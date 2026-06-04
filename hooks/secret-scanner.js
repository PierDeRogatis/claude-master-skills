#!/usr/bin/env node
/**
 * PreToolUse(Bash) hook — scans staged files for secret patterns before git commit/push.
 * Input (stdin): JSON { tool, input: { command } }
 * Output (stdout): JSON { action, message } if secrets found, else empty
 * Exit 0 always — warn only, never block.
 * Only runs `git diff --cached` as a subprocess — never reads project files directly.
 */

const { execSync } = require("child_process");

const COMMIT_PUSH_PATTERN = /\bgit\s+(commit|push)\b/;

const SECRET_PATTERNS = [
  { name: "OpenAI API key",     re: /sk-[A-Za-z0-9]{48}/ },
  { name: "Google API key",     re: /AIza[0-9A-Za-z\-_]{35}/ },
  { name: "AWS access key",     re: /AKIA[0-9A-Z]{16}/ },
  { name: "GitHub PAT",         re: /ghp_[A-Za-z0-9]{36}/ },
  { name: "Slack token",        re: /xox[baprs]-[A-Za-z0-9\-]+/ },
  { name: "Anthropic API key",  re: /sk-ant-[A-Za-z0-9\-_]{32,}/ },
  { name: "Hardcoded password", re: /(?:password|passwd|pwd)\s*[=:]\s*['"][^'"]{8,}['"]/ },
  { name: "Private key block",  re: /-----BEGIN (RSA|EC|OPENSSH|DSA) PRIVATE KEY-----/ },
];

let raw = "";
process.stdin.setEncoding("utf8");
process.stdin.on("data", (chunk) => (raw += chunk));
process.stdin.on("end", () => {
  try {
    const input = JSON.parse(raw);
    const command = input?.input?.command || "";

    if (!COMMIT_PUSH_PATTERN.test(command)) {
      process.exit(0);
    }

    let diff;
    try {
      diff = execSync("git diff --cached", {
        encoding: "utf8",
        stdio: ["ignore", "pipe", "ignore"],
        timeout: 5000,
        maxBuffer: 2 * 1024 * 1024, // 2MB cap
      });
    } catch {
      process.exit(0); // not a git repo or nothing staged
    }

    if (!diff) process.exit(0);

    const hits = [];
    for (const { name, re } of SECRET_PATTERNS) {
      if (re.test(diff)) hits.push(name);
    }

    if (hits.length > 0) {
      process.stdout.write(
        JSON.stringify({
          action: "warn",
          message:
            `[cms] Possible secret(s) detected in staged files:\n` +
            hits.map((h) => `  • ${h}`).join("\n") + "\n" +
            `\nReview staged changes before committing:\n  git diff --cached`,
        }) + "\n"
      );
    }
  } catch {
    // Malformed input — allow through
  }
  process.exit(0);
});
