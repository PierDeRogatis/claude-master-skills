#!/usr/bin/env node
/**
 * PostToolUse(Write, Edit) hook — reminds to run tests after modifying code files.
 * Input (stdin): JSON { tool, input: { file_path } }
 * Output (stdout): plain text hint (or empty)
 * Exit 0 always — informational only.
 */

const path = require("path");

const CODE_EXTENSIONS = new Set([
  ".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs",
  ".py", ".go", ".rs", ".java", ".kt", ".rb", ".php",
]);

const SKIP_PATTERNS = [
  /\.d\.ts$/,        // TypeScript declaration files
  /\.config\./,      // config files
  /\.lock$/,         // lock files
  /\btest\b/,        // test files themselves (already a test)
  /\bspec\b/,
  /\b__tests__\b/,
  /\.md$/,
  /\.json$/,
  /\.yaml$/,
  /\.yml$/,
  /\.env/,
];

let raw = "";
process.stdin.setEncoding("utf8");
process.stdin.on("data", (chunk) => (raw += chunk));
process.stdin.on("end", () => {
  try {
    const input = JSON.parse(raw);
    const filePath = input?.input?.file_path || input?.input?.path || "";

    if (!filePath) process.exit(0);

    const ext = path.extname(filePath).toLowerCase();
    if (!CODE_EXTENSIONS.has(ext)) process.exit(0);

    for (const pattern of SKIP_PATTERNS) {
      if (pattern.test(filePath)) process.exit(0);
    }

    const isPython = ext === ".py";
    const testCmd = isPython ? "pytest" : "pnpm test";
    process.stdout.write(
      `[cms] Code modified: ${path.basename(filePath)} — consider running \`${testCmd}\`.\n`
    );
  } catch {
    // Malformed input — stay silent
  }
  process.exit(0);
});
