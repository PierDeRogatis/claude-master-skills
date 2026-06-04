const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { runHook } = require("../helpers/run-hook");

const HOOK = "context-loader.js";
const promptInput = { prompt: "help me build a feature" };

test("context-loader: outputs CLAUDE.md preview on first message", () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "cms-ctx-test-"));
  const claudeDir = path.join(tmpDir, ".claude");
  fs.mkdirSync(claudeDir, { recursive: true });

  const claudeMdContent = "# Test Project\n\n## Commands\n\npnpm dev\n\n## Architecture\n\nsome arch\n";
  fs.writeFileSync(path.join(tmpDir, "CLAUDE.md"), claudeMdContent, "utf8");

  try {
    const { stdout, status } = runHook(HOOK, promptInput, {
      cwd: tmpDir,
      env: {
        CLAUDE_PROJECT_DIR: tmpDir,
        CLAUDE_CONFIG_DIR: claudeDir,
      },
    });
    assert.equal(status, 0);
    assert.match(stdout, /CLAUDE\.md loaded/);
    assert.match(stdout, /Test Project/);
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
});

test("context-loader: silent when flag file already exists (not first message)", () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "cms-ctx-test-"));
  const claudeDir = path.join(tmpDir, ".claude");
  fs.mkdirSync(claudeDir, { recursive: true });

  fs.writeFileSync(path.join(tmpDir, "CLAUDE.md"), "# Project\n", "utf8");
  // Create the flag file — simulates that context was already loaded this session
  fs.writeFileSync(path.join(claudeDir, ".cms-context-loaded"), String(Date.now()), "utf8");

  try {
    const { stdout, status } = runHook(HOOK, promptInput, {
      cwd: tmpDir,
      env: {
        CLAUDE_PROJECT_DIR: tmpDir,
        CLAUDE_CONFIG_DIR: claudeDir,
      },
    });
    assert.equal(status, 0);
    assert.equal(stdout.trim(), "");
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
});

test("context-loader: silent when no CLAUDE.md present", () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "cms-ctx-test-"));
  const claudeDir = path.join(tmpDir, ".claude");
  fs.mkdirSync(claudeDir, { recursive: true });

  try {
    const { stdout, status } = runHook(HOOK, promptInput, {
      cwd: tmpDir,
      env: {
        CLAUDE_PROJECT_DIR: tmpDir,
        CLAUDE_CONFIG_DIR: claudeDir,
      },
    });
    assert.equal(status, 0);
    assert.equal(stdout.trim(), "");
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
});
