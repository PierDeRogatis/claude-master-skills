#!/usr/bin/env node
/**
 * PreToolUse(Bash) hook — warns before destructive shell commands.
 * Input (stdin): JSON { tool, input: { command } }
 * Output (stdout): JSON { action, message } or empty (allow through)
 * Exit 0 always — never hard-block, only warn.
 */

const DESTRUCTIVE_PATTERNS = [
  { pattern: /rm\s+-rf?\s/, label: "recursive delete" },
  { pattern: /git\s+reset\s+--hard/, label: "hard git reset" },
  { pattern: /git\s+push\s+(--force|-f)/, label: "force push" },
  { pattern: /git\s+push\s+[^\s]*\s+--force/, label: "force push" },
  { pattern: /DROP\s+TABLE/i, label: "DROP TABLE" },
  { pattern: /TRUNCATE\s+TABLE/i, label: "TRUNCATE TABLE" },
  { pattern: /mkfs\b/, label: "filesystem format" },
  { pattern: />\s*\/dev\/sd[a-z]/, label: "raw disk write" },
  { pattern: /git\s+checkout\s+--\s+\./, label: "discard all working changes" },
  { pattern: /git\s+clean\s+-[a-z]*f/, label: "clean untracked files" },
];

let raw = "";
process.stdin.setEncoding("utf8");
process.stdin.on("data", (chunk) => (raw += chunk));
process.stdin.on("end", () => {
  try {
    const input = JSON.parse(raw);
    const command = input?.input?.command || "";
    for (const { pattern, label } of DESTRUCTIVE_PATTERNS) {
      if (pattern.test(command)) {
        process.stdout.write(
          JSON.stringify({
            action: "warn",
            message:
              `[claude-master-skills] Destructive command detected (${label}).\n` +
              `Command: ${command.slice(0, 120)}\n` +
              `Confirm this is intentional before proceeding.`,
          }) + "\n"
        );
        break;
      }
    }
  } catch {
    // Malformed input — allow through
  }
  process.exit(0);
});
