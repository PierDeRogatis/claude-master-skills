#!/usr/bin/env node
/**
 * SessionStart hook — detects project type and emits a context hint.
 * Claude Code pipes stdout into the context window at session open.
 * Silent on all errors so it never blocks session startup.
 * Uses the shared detectProjectType() from bin/install.js.
 */

const path = require("path");

const SKILLS_BY_TYPE = {
  "nextjs-app":       ["nextjs-patterns", "git-workflow", "tdd-workflow", "ui-ux-design"],
  "supabase-nextjs":  ["nextjs-patterns", "security-review", "tdd-workflow", "git-workflow"],
  "node-api":         ["tdd-workflow", "code-review", "security-review", "git-workflow"],
  "typescript-lib":   ["tdd-workflow", "karpathy-guidelines", "verification"],
  "python-api":       ["tdd-workflow", "code-review", "security-review", "git-workflow"],
  "monorepo":         ["planning", "tdd-workflow", "code-review", "karpathy-guidelines"],
  "react-native":     ["tdd-workflow", "code-review", "security-review", "verification"],
  "cli-tool":         ["karpathy-guidelines", "tdd-workflow", "git-workflow"],
  "astro-site":       ["ui-ux-design", "tdd-workflow", "git-workflow"],
  "generic":          ["planning", "code-review", "verification"],
};

try {
  const cwd = process.env.CLAUDE_PROJECT_DIR || process.cwd();
  const repoRoot = path.resolve(__dirname, "..");
  const { detectProjectType } = require(path.join(repoRoot, "bin", "install"));
  const type = detectProjectType(cwd);
  if (type && type !== "generic") {
    const skills = SKILLS_BY_TYPE[type] || SKILLS_BY_TYPE.generic;
    process.stdout.write(
      `[claude-master-skills] Project type detected: ${type}. ` +
        `Relevant skills: ${skills.join(", ")}.\n`
    );
  }
} catch {
  // Never block session startup
}
