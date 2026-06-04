#!/usr/bin/env node
/**
 * PreToolUse(Bash) hook — reminds to run security audit after adding dependencies.
 * Input (stdin): JSON { tool, input: { command } }
 * Output (stdout): JSON { action, message } or empty
 * Exit 0 always — informational only.
 */

const ADD_PATTERNS = [
  /\bpnpm\s+add\b/,
  /\bnpm\s+install\b(?!\s+--save-dev\b.*--dev)/, // npm install with packages
  /\bnpm\s+i\s+[^-]/, // npm i <pkg>
  /\byarn\s+add\b/,
  /\bpip\s+install\b/,
  /\buv\s+add\b/,
  /\bpoetry\s+add\b/,
  /\bcargo\s+add\b/,
  /\bgo\s+get\b/,
];

let raw = "";
process.stdin.setEncoding("utf8");
process.stdin.on("data", (chunk) => (raw += chunk));
process.stdin.on("end", () => {
  try {
    const input = JSON.parse(raw);
    const command = input?.input?.command || "";

    const matched = ADD_PATTERNS.some((re) => re.test(command));
    if (!matched) process.exit(0);

    // Detect package manager for the audit command
    let auditCmd = "pnpm audit";
    if (/\bpip\b|\buv\b|\bpoetry\b/.test(command)) auditCmd = "pip-audit";
    else if (/\byarn\b/.test(command)) auditCmd = "yarn audit";
    else if (/\bnpm\b/.test(command)) auditCmd = "npm audit";
    else if (/\bcargo\b/.test(command)) auditCmd = "cargo audit";

    process.stdout.write(
      JSON.stringify({
        action: "warn",
        message:
          `[cms] Adding dependency. After install completes, run:\n  ${auditCmd}\nto check for known vulnerabilities.`,
      }) + "\n"
    );
  } catch {
    // Malformed input — allow through
  }
  process.exit(0);
});
