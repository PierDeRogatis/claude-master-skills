const { test } = require("node:test");
const assert = require("node:assert/strict");
const { runHook, parseOutput } = require("../helpers/run-hook");
const { createFakeGit } = require("../helpers/fake-git");

const HOOK = "secret-scanner.js";
const commitInput = { tool: "Bash", input: { command: "git commit -m 'feat: add auth'" } };
const pushInput = { tool: "Bash", input: { command: "git push origin main" } };

test("secret-scanner: warns on OpenAI key in staged diff", () => {
  const fakeKey = "sk-" + "A".repeat(48);
  const { dir, cleanup } = createFakeGit({ diff: `+OPENAI_API_KEY=${fakeKey}` });
  try {
    const { stdout, status } = runHook(HOOK, commitInput, { mockGitDir: dir });
    assert.equal(status, 0);
    const out = parseOutput(stdout);
    assert.equal(out.action, "warn");
    assert.match(out.message, /OpenAI/);
  } finally {
    cleanup();
  }
});

test("secret-scanner: warns on GitHub PAT in staged diff", () => {
  const fakePat = "ghp_" + "B".repeat(36);
  const { dir, cleanup } = createFakeGit({ diff: `+TOKEN=${fakePat}` });
  try {
    const { stdout, status } = runHook(HOOK, commitInput, { mockGitDir: dir });
    assert.equal(status, 0);
    const out = parseOutput(stdout);
    assert.equal(out.action, "warn");
    assert.match(out.message, /GitHub PAT/);
  } finally {
    cleanup();
  }
});

test("secret-scanner: warns on AWS access key in staged diff", () => {
  const fakeKey = "AKIA" + "C".repeat(16);
  const { dir, cleanup } = createFakeGit({ diff: `+AWS_ACCESS_KEY_ID=${fakeKey}` });
  try {
    const { stdout, status } = runHook(HOOK, commitInput, { mockGitDir: dir });
    assert.equal(status, 0);
    const out = parseOutput(stdout);
    assert.equal(out.action, "warn");
    assert.match(out.message, /AWS/);
  } finally {
    cleanup();
  }
});

test("secret-scanner: silent on clean staged diff", () => {
  const { dir, cleanup } = createFakeGit({ diff: "+const greeting = 'hello world';" });
  try {
    const { stdout, status } = runHook(HOOK, commitInput, { mockGitDir: dir });
    assert.equal(status, 0);
    assert.equal(stdout.trim(), "");
  } finally {
    cleanup();
  }
});

test("secret-scanner: silent on non-commit/push command", () => {
  const { dir, cleanup } = createFakeGit({ diff: "+OPENAI_API_KEY=sk-" + "A".repeat(48) });
  try {
    const { stdout, status } = runHook(HOOK, { tool: "Bash", input: { command: "pnpm test" } }, { mockGitDir: dir });
    assert.equal(status, 0);
    assert.equal(stdout.trim(), "");
  } finally {
    cleanup();
  }
});

test("secret-scanner: also fires on git push", () => {
  const fakePat = "ghp_" + "D".repeat(36);
  const { dir, cleanup } = createFakeGit({ diff: `+SECRET=${fakePat}` });
  try {
    const { stdout, status } = runHook(HOOK, pushInput, { mockGitDir: dir });
    assert.equal(status, 0);
    const out = parseOutput(stdout);
    assert.equal(out.action, "warn");
  } finally {
    cleanup();
  }
});
