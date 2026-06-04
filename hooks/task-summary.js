#!/usr/bin/env node
/**
 * PostToolUse hook — emits a summary of modified files after each tool use.
 * Fires after every tool call; only outputs when there are uncommitted changes.
 * Output (stdout): one-line summary or empty
 * Exit 0 always.
 *
 * To avoid noise, only prints when ≥2 files have been modified.
 */

const { execSync } = require("child_process");

const MIN_CHANGED_FILES = 2; // only summarize when meaningful work has accumulated

try {
  const status = execSync("git status --short 2>/dev/null", {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "ignore"],
    timeout: 3000,
  }).trim();

  if (!status) process.exit(0);

  const lines = status.split("\n").filter(Boolean);
  if (lines.length < MIN_CHANGED_FILES) process.exit(0);

  const fileNames = lines
    .map((l) => l.slice(3).trim().split(" -> ").pop()) // handle renames
    .slice(0, 5); // cap at 5 for readability

  const more = lines.length > 5 ? ` (+${lines.length - 5} more)` : "";
  process.stdout.write(
    `[cms] ${lines.length} file(s) changed: ${fileNames.join(", ")}${more} — commit when ready.\n`
  );
} catch {
  // Not a git repo or git unavailable — stay silent
}
process.exit(0);
