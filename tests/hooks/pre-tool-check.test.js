const { test } = require("node:test");
const assert = require("node:assert/strict");
const { runHook, parseOutput } = require("../helpers/run-hook");

const HOOK = "pre-tool-check.js";
const bash = (command) => ({ tool: "Bash", input: { command } });

test("pre-tool-check: warns on rm -rf", () => {
  const { stdout, status } = runHook(HOOK, bash("rm -rf node_modules"));
  assert.equal(status, 0);
  const out = parseOutput(stdout);
  assert.equal(out.action, "warn");
  assert.match(out.message, /recursive delete/);
});

test("pre-tool-check: warns on git reset --hard", () => {
  const { stdout, status } = runHook(HOOK, bash("git reset --hard HEAD~1"));
  assert.equal(status, 0);
  const out = parseOutput(stdout);
  assert.equal(out.action, "warn");
  assert.match(out.message, /hard git reset/);
});

test("pre-tool-check: warns on git push --force", () => {
  const { stdout, status } = runHook(HOOK, bash("git push --force origin main"));
  assert.equal(status, 0);
  const out = parseOutput(stdout);
  assert.equal(out.action, "warn");
  assert.match(out.message, /force push/);
});

test("pre-tool-check: warns on DROP TABLE", () => {
  const { stdout, status } = runHook(HOOK, bash("psql -c 'DROP TABLE users'"));
  assert.equal(status, 0);
  const out = parseOutput(stdout);
  assert.equal(out.action, "warn");
});

test("pre-tool-check: silent on pnpm test", () => {
  const { stdout, status } = runHook(HOOK, bash("pnpm test"));
  assert.equal(status, 0);
  assert.equal(stdout.trim(), "");
});

test("pre-tool-check: silent on git status", () => {
  const { stdout, status } = runHook(HOOK, bash("git status"));
  assert.equal(status, 0);
  assert.equal(stdout.trim(), "");
});

test("pre-tool-check: silent on malformed input", () => {
  const { status } = runHook(HOOK, {});
  assert.equal(status, 0);
});
