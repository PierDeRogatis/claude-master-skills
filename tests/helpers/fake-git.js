/**
 * Utility: create a temp directory with a fake `git` executable for hook testing.
 * The fake git responds to specific subcommands with canned output.
 *
 * Usage:
 *   const { dir, cleanup } = createFakeGit({ branch: 'main', diff: '+SK-abc...' });
 *   // use dir as mockGitDir in runHook()
 *   cleanup(); // remove temp dir after test
 */

const fs = require("fs");
const os = require("os");
const path = require("path");

/**
 * Create a temp dir with a fake `git` script.
 *
 * @param {object} opts
 * @param {string} [opts.branch='feat/test'] - Output of `git rev-parse --abbrev-ref HEAD`
 * @param {string} [opts.diff='']            - Output of `git diff --cached`
 * @param {string} [opts.status='']          - Output of `git status --short`
 * @returns {{ dir: string, cleanup: () => void }}
 */
function createFakeGit(opts = {}) {
  const { branch = "feat/test", diff = "", status = "" } = opts;

  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "fake-git-"));

  // Build per-line echo commands for multiline outputs (avoids printf escape issues)
  const diffLines = diff
    ? diff.split("\n").map((l) => `printf '%s\\n' ${shQuote(l)}`).join("\n  ")
    : "true";
  const statusLines = status
    ? status.split("\n").filter(Boolean).map((l) => `printf '%s\\n' ${shQuote(l)}`).join("\n  ")
    : "true";

  // Write a shell script that responds based on arguments
  const scriptContent = `#!/bin/sh
CMD="$1"
SUBCMD="$2"

if [ "$CMD" = "rev-parse" ] && [ "$SUBCMD" = "--abbrev-ref" ]; then
  printf '%s\\n' ${shQuote(branch)}
  exit 0
fi

if [ "$CMD" = "diff" ] && [ "$SUBCMD" = "--cached" ]; then
  ${diffLines}
  exit 0
fi

if [ "$CMD" = "status" ] && [ "$SUBCMD" = "--short" ]; then
  ${statusLines}
  exit 0
fi

# Default: succeed silently
exit 0
`;

  const gitPath = path.join(dir, "git");
  fs.writeFileSync(gitPath, scriptContent, { encoding: "utf8", mode: 0o755 });

  return {
    dir,
    cleanup: () => {
      try {
        fs.rmSync(dir, { recursive: true, force: true });
      } catch {
        // ignore cleanup errors in tests
      }
    },
  };
}

/** Single-quote a string for safe shell embedding. */
function shQuote(str) {
  return "'" + String(str).replace(/'/g, "'\\''") + "'";
}

module.exports = { createFakeGit };
