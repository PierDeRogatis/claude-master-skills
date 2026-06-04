const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { runHook } = require("../helpers/run-hook");

const HOOK = "session-start.js";
const emptyInput = {};

function makeProjectDir(pkg) {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "cms-session-"));
  if (pkg) {
    fs.writeFileSync(path.join(tmpDir, "package.json"), JSON.stringify(pkg), "utf8");
  }
  return tmpDir;
}

test("session-start: detects nextjs-app", () => {
  const dir = makeProjectDir({ dependencies: { next: "14.0.0" } });
  try {
    const { stdout, status } = runHook(HOOK, emptyInput, {
      env: { CLAUDE_PROJECT_DIR: dir },
    });
    assert.equal(status, 0);
    assert.match(stdout, /nextjs-app/);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test("session-start: detects react-native", () => {
  const dir = makeProjectDir({ dependencies: { expo: "51.0.0" } });
  try {
    const { stdout, status } = runHook(HOOK, emptyInput, {
      env: { CLAUDE_PROJECT_DIR: dir },
    });
    assert.equal(status, 0);
    assert.match(stdout, /react-native/);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test("session-start: detects node-api (hono)", () => {
  const dir = makeProjectDir({ dependencies: { hono: "3.0.0" } });
  try {
    const { stdout, status } = runHook(HOOK, emptyInput, {
      env: { CLAUDE_PROJECT_DIR: dir },
    });
    assert.equal(status, 0);
    assert.match(stdout, /node-api/);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test("session-start: silent when no package.json", () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "cms-session-empty-"));
  try {
    const { stdout, status } = runHook(HOOK, emptyInput, {
      env: { CLAUDE_PROJECT_DIR: tmpDir },
    });
    assert.equal(status, 0);
    assert.equal(stdout.trim(), "");
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
});
