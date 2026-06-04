/**
 * Utility: spawn a hook script, pipe JSON to its stdin, return stdout/stderr/status.
 * Used by all hook tests.
 */

const { spawnSync } = require("child_process");
const path = require("path");

const HOOKS_DIR = path.resolve(__dirname, "../../hooks");

/**
 * Run a hook script and return its output.
 *
 * @param {string} hookName - Filename in hooks/ (e.g. "branch-guard.js")
 * @param {object} input    - JSON object to pipe as stdin
 * @param {object} [opts]
 * @param {string} [opts.mockGitDir] - Directory to prepend to PATH (for fake git)
 * @param {string} [opts.cwd]        - Working directory for the hook process
 * @param {object} [opts.env]        - Additional env vars
 * @returns {{ stdout: string, stderr: string, status: number }}
 */
function runHook(hookName, input, opts = {}) {
  const hookPath = path.join(HOOKS_DIR, hookName);
  const env = {
    ...process.env,
    ...(opts.env || {}),
  };
  if (opts.mockGitDir) {
    env.PATH = opts.mockGitDir + path.delimiter + (env.PATH || "");
  }

  const result = spawnSync("node", [hookPath], {
    input: JSON.stringify(input),
    encoding: "utf8",
    env,
    cwd: opts.cwd || process.cwd(),
    timeout: 5000,
  });

  return {
    stdout: result.stdout || "",
    stderr: result.stderr || "",
    status: result.status ?? 0,
  };
}

/**
 * Parse hook stdout as JSON if it looks like JSON, otherwise return raw string.
 */
function parseOutput(stdout) {
  const trimmed = stdout.trim();
  if (trimmed.startsWith("{")) {
    try {
      return JSON.parse(trimmed);
    } catch {
      return trimmed;
    }
  }
  return trimmed;
}

module.exports = { runHook, parseOutput };
