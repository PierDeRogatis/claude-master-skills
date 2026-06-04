const { test } = require("node:test");
const assert = require("node:assert/strict");
const { runHook } = require("../helpers/run-hook");
const { createFakeGit } = require("../helpers/fake-git");

const HOOK = "task-summary.js";
const anyInput = { tool: "Write", input: { file_path: "src/foo.ts" } };

test("task-summary: emits summary when 3+ files changed", () => {
  const fakeStatus = "M  src/a.ts\nM  src/b.ts\nA  src/c.ts";
  const { dir, cleanup } = createFakeGit({ status: fakeStatus });
  try {
    const { stdout, status } = runHook(HOOK, anyInput, { mockGitDir: dir });
    assert.equal(status, 0);
    assert.match(stdout, /3 file\(s\) changed/);
    assert.match(stdout, /a\.ts/);
  } finally {
    cleanup();
  }
});

test("task-summary: silent when only 1 file changed (below MIN)", () => {
  const { dir, cleanup } = createFakeGit({ status: "M  src/a.ts" });
  try {
    const { stdout, status } = runHook(HOOK, anyInput, { mockGitDir: dir });
    assert.equal(status, 0);
    assert.equal(stdout.trim(), "");
  } finally {
    cleanup();
  }
});

test("task-summary: silent when no changes", () => {
  const { dir, cleanup } = createFakeGit({ status: "" });
  try {
    const { stdout, status } = runHook(HOOK, anyInput, { mockGitDir: dir });
    assert.equal(status, 0);
    assert.equal(stdout.trim(), "");
  } finally {
    cleanup();
  }
});

test("task-summary: exits 0 even when not in a git repo", () => {
  // PATH with no git at all — execSync will throw, hook should catch and exit 0
  const { status } = runHook(HOOK, anyInput, { mockGitDir: "/nonexistent-path-xyz" });
  assert.equal(status, 0);
});
