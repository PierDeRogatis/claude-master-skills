const { test } = require("node:test");
const assert = require("node:assert/strict");
const { runHook } = require("../helpers/run-hook");

const HOOK = "test-reminder.js";
const writeInput = (file_path) => ({ tool: "Write", input: { file_path } });

test("test-reminder: reminds on .ts file", () => {
  const { stdout, status } = runHook(HOOK, writeInput("src/utils/format.ts"));
  assert.equal(status, 0);
  assert.match(stdout, /pnpm test/);
});

test("test-reminder: reminds on .tsx file", () => {
  const { stdout, status } = runHook(HOOK, writeInput("src/components/Button.tsx"));
  assert.equal(status, 0);
  assert.match(stdout, /pnpm test/);
});

test("test-reminder: reminds on .py file", () => {
  const { stdout, status } = runHook(HOOK, writeInput("app/services/user.py"));
  assert.equal(status, 0);
  assert.match(stdout, /pytest/);
});

test("test-reminder: silent on .md file", () => {
  const { stdout, status } = runHook(HOOK, writeInput("README.md"));
  assert.equal(status, 0);
  assert.equal(stdout.trim(), "");
});

test("test-reminder: silent on .json file", () => {
  const { stdout, status } = runHook(HOOK, writeInput("package.json"));
  assert.equal(status, 0);
  assert.equal(stdout.trim(), "");
});

test("test-reminder: silent on .test.ts file (already a test)", () => {
  const { stdout, status } = runHook(HOOK, writeInput("src/utils/format.test.ts"));
  assert.equal(status, 0);
  assert.equal(stdout.trim(), "");
});

test("test-reminder: silent on .config.ts file", () => {
  const { stdout, status } = runHook(HOOK, writeInput("tailwind.config.ts"));
  assert.equal(status, 0);
  assert.equal(stdout.trim(), "");
});

test("test-reminder: silent on no file_path in input", () => {
  const { stdout, status } = runHook(HOOK, { tool: "Write", input: {} });
  assert.equal(status, 0);
  assert.equal(stdout.trim(), "");
});
