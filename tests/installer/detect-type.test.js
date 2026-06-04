const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { detectProjectType } = require("../../bin/install");

function makeTmpDir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), "cms-detect-"));
}

function writePkg(dir, pkg) {
  fs.writeFileSync(path.join(dir, "package.json"), JSON.stringify(pkg), "utf8");
}

test("detectProjectType: python-api from pyproject.toml", () => {
  const dir = makeTmpDir();
  fs.writeFileSync(path.join(dir, "pyproject.toml"), "[tool.uv]\n", "utf8");
  assert.equal(detectProjectType(dir), "python-api");
  fs.rmSync(dir, { recursive: true, force: true });
});

test("detectProjectType: python-api from requirements.txt", () => {
  const dir = makeTmpDir();
  fs.writeFileSync(path.join(dir, "requirements.txt"), "fastapi\n", "utf8");
  assert.equal(detectProjectType(dir), "python-api");
  fs.rmSync(dir, { recursive: true, force: true });
});

test("detectProjectType: monorepo from workspaces field", () => {
  const dir = makeTmpDir();
  writePkg(dir, { workspaces: ["packages/*"] });
  assert.equal(detectProjectType(dir), "monorepo");
  fs.rmSync(dir, { recursive: true, force: true });
});

test("detectProjectType: monorepo from pnpm-workspace.yaml", () => {
  const dir = makeTmpDir();
  writePkg(dir, {});
  fs.writeFileSync(path.join(dir, "pnpm-workspace.yaml"), "packages:\n  - 'packages/*'\n", "utf8");
  assert.equal(detectProjectType(dir), "monorepo");
  fs.rmSync(dir, { recursive: true, force: true });
});

test("detectProjectType: astro-site", () => {
  const dir = makeTmpDir();
  writePkg(dir, { dependencies: { astro: "4.0.0" } });
  assert.equal(detectProjectType(dir), "astro-site");
  fs.rmSync(dir, { recursive: true, force: true });
});

test("detectProjectType: react-native from expo", () => {
  const dir = makeTmpDir();
  writePkg(dir, { dependencies: { expo: "51.0.0" } });
  assert.equal(detectProjectType(dir), "react-native");
  fs.rmSync(dir, { recursive: true, force: true });
});

test("detectProjectType: supabase-nextjs (supabase + next both present)", () => {
  const dir = makeTmpDir();
  writePkg(dir, { dependencies: { "@supabase/supabase-js": "2.0.0", next: "14.0.0" } });
  assert.equal(detectProjectType(dir), "supabase-nextjs");
  fs.rmSync(dir, { recursive: true, force: true });
});

test("detectProjectType: nextjs-app (next only, no supabase)", () => {
  const dir = makeTmpDir();
  writePkg(dir, { dependencies: { next: "14.0.0" } });
  assert.equal(detectProjectType(dir), "nextjs-app");
  fs.rmSync(dir, { recursive: true, force: true });
});

test("detectProjectType: cli-tool from bin field", () => {
  const dir = makeTmpDir();
  writePkg(dir, { bin: { mycli: "./dist/index.js" } });
  assert.equal(detectProjectType(dir), "cli-tool");
  fs.rmSync(dir, { recursive: true, force: true });
});

test("detectProjectType: node-api from hono", () => {
  const dir = makeTmpDir();
  writePkg(dir, { dependencies: { hono: "3.0.0" } });
  assert.equal(detectProjectType(dir), "node-api");
  fs.rmSync(dir, { recursive: true, force: true });
});

test("detectProjectType: typescript-lib from typescript only", () => {
  const dir = makeTmpDir();
  writePkg(dir, { devDependencies: { typescript: "5.0.0" } });
  assert.equal(detectProjectType(dir), "typescript-lib");
  fs.rmSync(dir, { recursive: true, force: true });
});

test("detectProjectType: generic for empty dir", () => {
  const dir = makeTmpDir();
  assert.equal(detectProjectType(dir), "generic");
  fs.rmSync(dir, { recursive: true, force: true });
});

test("detectProjectType: supabase-nextjs beats plain nextjs-app (priority check)", () => {
  const dir = makeTmpDir();
  writePkg(dir, {
    dependencies: {
      "@supabase/supabase-js": "2.0.0",
      next: "14.0.0",
      react: "18.0.0",
    },
  });
  assert.equal(detectProjectType(dir), "supabase-nextjs");
  fs.rmSync(dir, { recursive: true, force: true });
});
