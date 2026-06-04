const { test } = require("node:test");
const assert = require("node:assert/strict");
const { runHook, parseOutput } = require("../helpers/run-hook");
const { createFakeGit } = require("../helpers/fake-git");

const HOOK = "branch-guard.js";
const bashInput = (command) => ({ tool: "Bash", input: { command } });

test("branch-guard: warns on git commit when on main", () => {
  const { dir, cleanup } = createFakeGit({ branch: "main" });
  try {
    const { stdout, status } = runHook(HOOK, bashInput("git commit -m 'test'"), { mockGitDir: dir });
    assert.equal(status, 0);
    const out = parseOutput(stdout);
    assert.equal(out.action, "warn");
    assert.match(out.message, /main/);
  } finally {
    cleanup();
  }
});

test("branch-guard: warns on git push when on master", () => {
  const { dir, cleanup } = createFakeGit({ branch: "master" });
  try {
    const { stdout, status } = runHook(HOOK, bashInput("git push origin master"), { mockGitDir: dir });
    assert.equal(status, 0);
    const out = parseOutput(stdout);
    assert.equal(out.action, "warn");
  } finally {
    cleanup();
  }
});

test("branch-guard: silent on git commit when on feature branch", () => {
  const { dir, cleanup } = createFakeGit({ branch: "feat/my-feature" });
  try {
    const { stdout, status } = runHook(HOOK, bashInput("git commit -m 'test'"), { mockGitDir: dir });
    assert.equal(status, 0);
    assert.equal(stdout.trim(), "");
  } finally {
    cleanup();
  }
});

test("branch-guard: silent on non-git commands", () => {
  const { dir, cleanup } = createFakeGit({ branch: "main" });
  try {
    const { stdout, status } = runHook(HOOK, bashInput("pnpm test"), { mockGitDir: dir });
    assert.equal(status, 0);
    assert.equal(stdout.trim(), "");
  } finally {
    cleanup();
  }
});

test("branch-guard: silent on malformed input", () => {
  const { status } = runHook(HOOK, {});
  assert.equal(status, 0);
});
