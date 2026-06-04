const { test } = require("node:test");
const assert = require("node:assert/strict");
const { runHook, parseOutput } = require("../helpers/run-hook");

const HOOK = "dependency-audit.js";
const bash = (command) => ({ tool: "Bash", input: { command } });

test("dependency-audit: warns on pnpm add", () => {
  const { stdout, status } = runHook(HOOK, bash("pnpm add react"));
  assert.equal(status, 0);
  const out = parseOutput(stdout);
  assert.equal(out.action, "warn");
  assert.match(out.message, /pnpm audit/);
});

test("dependency-audit: warns on npm install with package", () => {
  const { stdout, status } = runHook(HOOK, bash("npm i lodash"));
  assert.equal(status, 0);
  const out = parseOutput(stdout);
  assert.equal(out.action, "warn");
});

test("dependency-audit: warns on yarn add", () => {
  const { stdout, status } = runHook(HOOK, bash("yarn add axios"));
  assert.equal(status, 0);
  const out = parseOutput(stdout);
  assert.equal(out.action, "warn");
  assert.match(out.message, /yarn audit/);
});

test("dependency-audit: warns on pip install with pip-audit suggestion", () => {
  const { stdout, status } = runHook(HOOK, bash("pip install requests"));
  assert.equal(status, 0);
  const out = parseOutput(stdout);
  assert.equal(out.action, "warn");
  assert.match(out.message, /pip-audit/);
});

test("dependency-audit: warns on uv add", () => {
  const { stdout, status } = runHook(HOOK, bash("uv add fastapi"));
  assert.equal(status, 0);
  const out = parseOutput(stdout);
  assert.equal(out.action, "warn");
  assert.match(out.message, /pip-audit/);
});

test("dependency-audit: silent on pnpm test", () => {
  const { stdout, status } = runHook(HOOK, bash("pnpm test"));
  assert.equal(status, 0);
  assert.equal(stdout.trim(), "");
});

test("dependency-audit: silent on git commands", () => {
  const { stdout, status } = runHook(HOOK, bash("git commit -m 'chore: update deps'"));
  assert.equal(status, 0);
  assert.equal(stdout.trim(), "");
});
