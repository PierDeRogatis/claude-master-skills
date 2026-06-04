#!/usr/bin/env node
/**
 * UserPromptSubmit hook — loads CLAUDE.md summary on the first user message of a session.
 * Only runs once per session (flag file prevents repeat firing).
 * Input (stdin): JSON { prompt }
 * Output (stdout): context text (or empty)
 * Exit 0 always.
 */

const fs = require("fs");
const path = require("path");
const os = require("os");

const CONTEXT_LINES = 40;
const FLAG_FILE = path.join(
  process.env.CLAUDE_CONFIG_DIR || path.join(os.homedir(), ".claude"),
  ".cms-context-loaded"
);

try {
  // Only fire once per session
  if (fs.existsSync(FLAG_FILE)) {
    process.exit(0);
  }

  const cwd = process.env.CLAUDE_PROJECT_DIR || process.cwd();
  const claudeMdPath = path.join(cwd, "CLAUDE.md");

  if (!fs.existsSync(claudeMdPath)) {
    process.exit(0);
  }

  const content = fs.readFileSync(claudeMdPath, "utf8");
  const lines = content.split("\n").slice(0, CONTEXT_LINES);
  const preview = lines.join("\n").trim();

  if (preview) {
    process.stdout.write(
      `[cms] CLAUDE.md loaded (first ${CONTEXT_LINES} lines):\n\n${preview}\n\n---\n`
    );
  }

  // Mark as loaded for this session
  fs.mkdirSync(path.dirname(FLAG_FILE), { recursive: true });
  fs.writeFileSync(FLAG_FILE, String(Date.now()), "utf8");
} catch {
  // Never block user prompt submission
}
process.exit(0);
