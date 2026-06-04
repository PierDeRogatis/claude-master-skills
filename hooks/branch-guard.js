#!/usr/bin/env node
/**
 * PreToolUse(Bash) hook — warns before committing or pushing directly on main/master.
 * Input (stdin): JSON { tool, input: { command } }
 * Output (stdout): JSON { action, message } or empty
 * Exit 0 always — warn only, never block.
 */

const { execSync } = require("child_process");

const PROTECTED_BRANCHES = new Set(["main", "master"]);
const COMMIT_PUSH_PATTERN = /\bgit\s+(commit|push)\b/;

let raw = "";
process.stdin.setEncoding("utf8");
process.stdin.on("data", (chunk) => (raw += chunk));
process.stdin.on("end", () => {
  try {
    const input = JSON.parse(raw);
    const command = input?.input?.command || "";

    if (!COMMIT_PUSH_PATTERN.test(command)) {
      process.exit(0);
    }

    let branch;
    try {
      branch = execSync("git rev-parse --abbrev-ref HEAD", {
        encoding: "utf8",
        stdio: ["ignore", "pipe", "ignore"],
        timeout: 3000,
      }).trim();
    } catch {
      process.exit(0); // not a git repo or git not available
    }

    if (PROTECTED_BRANCHES.has(branch)) {
      process.stdout.write(
        JSON.stringify({
          action: "warn",
          message:
            `[cms] You are on the \`${branch}\` branch.\n` +
            `Consider creating a feature branch first:\n` +
            `  git checkout -b feat/<slug>`,
        }) + "\n"
      );
    }
  } catch {
    // Malformed input — allow through
  }
  process.exit(0);
});
