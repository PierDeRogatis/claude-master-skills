#!/usr/bin/env node
/**
 * SessionStart hook — detects project type and emits a context hint.
 * Claude Code pipes stdout into the context window at session open.
 * Silent on all errors so it never blocks session startup.
 */

const fs = require("fs");
const path = require("path");

function detectProjectType(cwd) {
  try {
    const pkgPath = path.join(cwd, "package.json");
    if (!fs.existsSync(pkgPath)) return null;
    const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
    const deps = {
      ...pkg.dependencies,
      ...pkg.devDependencies,
    };
    if (deps.next) return "nextjs-app";
    if (deps.hono || deps.express) return "node-api";
    if (deps.typescript) return "typescript-lib";
    return "generic";
  } catch {
    return null;
  }
}

try {
  const cwd = process.env.CLAUDE_PROJECT_DIR || process.cwd();
  const type = detectProjectType(cwd);
  if (type) {
    process.stdout.write(
      `[claude-master-skills] Project type detected: ${type}. ` +
        `Relevant skills: ${getSkillsForType(type).join(", ")}.\n`
    );
  }
} catch {
  // Never block session startup
}

function getSkillsForType(type) {
  const map = {
    "nextjs-app": ["nextjs-patterns", "git-workflow", "tdd-workflow", "ui-ux-design"],
    "node-api": ["tdd-workflow", "code-review", "security-review", "git-workflow"],
    "typescript-lib": ["tdd-workflow", "karpathy-guidelines", "verification"],
    "generic": ["planning", "code-review", "verification"],
  };
  return map[type] || map.generic;
}
