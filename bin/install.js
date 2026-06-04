#!/usr/bin/env node
/**
 * claude-master-skills installer
 * Usage: node bin/install.js [options]
 *
 * Options:
 *   --target <path>      Target project directory (default: cwd)
 *   --dry-run            Print what would happen, write nothing
 *   --template <name>    Override auto-detected template (nextjs-app | node-api | typescript-lib)
 *   --hooks-only         Skip template copy, only merge hooks
 *   --no-hooks           Skip hook installation
 */

const fs = require("fs");
const path = require("path");
const readline = require("readline");

// ---------------------------------------------------------------------------
// CLI arg parsing
// ---------------------------------------------------------------------------

const args = process.argv.slice(2);
const flags = {
  target: process.cwd(),
  dryRun: false,
  template: null,
  hooksOnly: false,
  noHooks: false,
};

for (let i = 0; i < args.length; i++) {
  if (args[i] === "--target" && args[i + 1]) flags.target = path.resolve(args[++i]);
  if (args[i] === "--dry-run") flags.dryRun = true;
  if (args[i] === "--template" && args[i + 1]) flags.template = args[++i];
  if (args[i] === "--hooks-only") flags.hooksOnly = true;
  if (args[i] === "--no-hooks") flags.noHooks = true;
}

const REPO_ROOT = path.resolve(__dirname, "..");
const TARGET = flags.target;

// ---------------------------------------------------------------------------
// Utilities
// ---------------------------------------------------------------------------

function log(msg) {
  console.log(`[cms] ${msg}`);
}

function logDry(msg) {
  console.log(`[cms] [dry-run] ${msg}`);
}

function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch {
    return null;
  }
}

function writeJson(filePath, data) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n", "utf8");
}

function ask(question) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim().toLowerCase());
    });
  });
}

// ---------------------------------------------------------------------------
// Project type detection
// ---------------------------------------------------------------------------

function detectProjectType() {
  const pkgPath = path.join(TARGET, "package.json");
  const pkg = readJson(pkgPath);
  if (!pkg) return "generic";
  const deps = { ...pkg.dependencies, ...pkg.devDependencies };
  if (deps.next) return "nextjs-app";
  if (deps.hono || deps.express) return "node-api";
  if (deps.typescript) return "typescript-lib";
  return "generic";
}

// ---------------------------------------------------------------------------
// Step A — Copy CLAUDE.md template
// ---------------------------------------------------------------------------

async function copyTemplate(projectType) {
  if (flags.hooksOnly) {
    log("Skipping template copy (--hooks-only).");
    return;
  }

  const type = flags.template || projectType;

  if (type === "generic") {
    log("⚠ Project type not detected. Skipping CLAUDE.md template copy.");
    log("  Pass --template nextjs-app|node-api|typescript-lib to override.");
    return;
  }

  const srcTemplate = path.join(REPO_ROOT, "templates", type, "CLAUDE.md");
  const destTemplate = path.join(TARGET, "CLAUDE.md");

  if (!fs.existsSync(srcTemplate)) {
    log(`⚠ Template not found: ${srcTemplate}`);
    return;
  }

  if (flags.dryRun) {
    logDry(`Would copy templates/${type}/CLAUDE.md → ${destTemplate}`);
    return;
  }

  if (fs.existsSync(destTemplate)) {
    const answer = await ask(
      `[cms] CLAUDE.md already exists in target. Overwrite? (y/N) `
    );
    if (answer !== "y") {
      log("Skipping CLAUDE.md copy.");
      return;
    }
  }

  fs.copyFileSync(srcTemplate, destTemplate);
  log(`✓ Copied templates/${type}/CLAUDE.md → CLAUDE.md`);
  log("  Edit CLAUDE.md: replace [PROJECT_NAME] and add your stack details.");
}

// ---------------------------------------------------------------------------
// Step B — Merge hooks into .claude/settings.json
// ---------------------------------------------------------------------------

function mergeHooks() {
  if (flags.noHooks) {
    log("Skipping hooks (--no-hooks).");
    return;
  }

  const hooksManifestPath = path.join(REPO_ROOT, "hooks", "hooks.json");
  const manifest = readJson(hooksManifestPath);
  if (!manifest) {
    log("⚠ hooks/hooks.json not found. Skipping hook installation.");
    return;
  }

  const settingsPath = path.join(TARGET, ".claude", "settings.json");
  const existing = readJson(settingsPath) || {};
  const hooks = existing.hooks || {};

  for (const hook of manifest.hooks) {
    const scriptAbsPath = path.join(REPO_ROOT, hook.script);
    const event = hook.event;

    let command;
    if (hook.runtime === "node") {
      command = `node "${scriptAbsPath}"`;
    } else if (hook.runtime === "bash") {
      command = `bash "${scriptAbsPath}"`;
    } else {
      command = `"${scriptAbsPath}"`;
    }

    if (!hooks[event]) hooks[event] = [];

    // Avoid duplicates — check if this script is already registered
    const alreadyRegistered = hooks[event].some(
      (h) => typeof h === "object" && h.command && h.command.includes(hook.script)
    );

    if (alreadyRegistered) {
      log(`  (hook ${hook.id} already registered — skipping)`);
      continue;
    }

    hooks[event].push({ command, description: hook.description });

    if (flags.dryRun) {
      logDry(`Would add hook: ${event} → ${command}`);
    } else {
      log(`✓ Added hook: ${event} → ${hook.script}`);
    }
  }

  if (!flags.dryRun) {
    existing.hooks = hooks;
    writeJson(settingsPath, existing);
    log(`✓ Updated .claude/settings.json`);
  }
}

// ---------------------------------------------------------------------------
// Step C — Register plugin
// ---------------------------------------------------------------------------

function registerPlugin() {
  const pluginsPath = path.join(TARGET, ".claude", "plugins.json");
  const existing = readJson(pluginsPath) || { plugins: [] };
  const pluginEntry = {
    name: "claude-master-skills",
    path: path.join(REPO_ROOT, ".claude-plugin", "plugin.json"),
  };

  const alreadyRegistered = existing.plugins.some((p) => p.name === "claude-master-skills");

  if (alreadyRegistered) {
    log("Plugin already registered in .claude/plugins.json.");
    return;
  }

  if (flags.dryRun) {
    logDry(`Would register plugin in ${pluginsPath}`);
    return;
  }

  existing.plugins.push(pluginEntry);
  writeJson(pluginsPath, existing);
  log(`✓ Registered plugin in .claude/plugins.json`);
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  log(`Installing to: ${TARGET}`);
  if (flags.dryRun) log("Dry-run mode — no files will be written.");

  const projectType = detectProjectType();
  log(`Detected project type: ${projectType}`);

  await copyTemplate(projectType);
  mergeHooks();
  registerPlugin();

  console.log("");
  log("Done.");
  log("To activate skills in Claude Code:");
  log("  /plugin install PierDeRogatis/claude-master-skills");
  log("  — or —");
  log("  /plugin install (if plugins.json was updated above)");
  console.log("");
  log("Agents are in: " + path.join(REPO_ROOT, "agents/"));
  log("Copy individual .yaml files to your project's .claude/agents/ to use them.");
}

main().catch((err) => {
  console.error("[cms] Error:", err.message);
  process.exit(1);
});
