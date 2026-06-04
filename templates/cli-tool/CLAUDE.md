# CLAUDE.md — Node.js CLI Tool

## Project

[PROJECT_NAME] — [one-sentence description]

**Stack:** Node.js · TypeScript · Commander.js (or Yargs) · pnpm · tsx (dev) · esbuild (dist)

---

## Commands

```bash
pnpm dev                           # Run CLI in dev mode (tsx src/index.ts)
pnpm dev -- <args>                 # Pass args: pnpm dev -- --help
pnpm build                         # Compile to dist/ via esbuild
pnpm start                         # Run compiled dist/index.js
pnpm test                          # Run test suite
pnpm tsc --noEmit                  # Type check
pnpm lint                          # Lint
node dist/index.js --help          # Test compiled output
```

---

## Architecture

```
src/
  index.ts              # Entry point: create program, register commands, parse args
  commands/             # One file per top-level command
    init.ts
    run.ts
    config.ts
  utils/                # Shared utilities
    output.ts           # print(), warn(), error() wrappers
    fs.ts               # File system helpers
    config.ts           # Config file loading/saving
  types/                # Shared TypeScript types
dist/                   # Compiled output (gitignored)
  index.js              # Single-file bundle (esbuild)
tests/
  commands/
    init.test.ts
  utils/
    output.test.ts
```

---

## Development Rules

### Command structure
- Each command is a separate file in `src/commands/`.
- Register all commands in `src/index.ts`, not inline.
- Command file exports a single `register(program: Command): void` function.
- Keep command handlers thin — logic goes in `src/utils/` or a dedicated service.

### Output
- `stdout` for data output (piping-friendly).
- `stderr` for all diagnostics: progress, warnings, errors.
- Use `picocolors` or `chalk` for colors — check `process.stdout.isTTY` before coloring.
- Use `ora` for spinners on long-running operations. Stop spinner before printing final output.
- Verbose flag (`--verbose` / `-v`): guard debug output with it.

### Error handling
- **Never** call `process.exit()` inside command logic. Throw errors; let the top-level handler in `index.ts` catch and exit.
- Custom error class: `class CliError extends Error { constructor(message: string, public readonly code = 1) {} }`
- Exit codes: `0` success, `1` general error, `2` usage error, `130` SIGINT.

### Configuration
- User config stored in OS config dir: `os.homedir() + '/.config/<tool>/config.json'` or via `env-paths`.
- Never hardcode paths. Never write to cwd unless it's the project's own config file.
- Validate config at load time with Zod.

### Compilation
- `esbuild` bundles to a single `dist/index.js` — no node_modules in dist.
- Mark Node.js built-ins as external. Mark large optional deps as external if optional.
- `#!/usr/bin/env node` shebang in the compiled output (added by esbuild config).
- `package.json`: `"bin": { "<name>": "./dist/index.js" }`.

### Testing
- Test command behavior via spawning the actual CLI process (`execa` or `child_process.spawnSync`).
- Unit test pure utility functions.
- Do not mock `process.stdout` — use subprocess output capture.

---

## Git & PR Conventions

- Branch names: `feat/<slug>`, `fix/<slug>`, `chore/<slug>`
- Commits: Conventional Commits, imperative mood, ≤50 chars.
- PRs: always **draft** first.
- **No** `Co-Authored-By: Claude` footers.
- **Never** force-push to `main`.
- Bump `package.json` version with each release (`pnpm version patch/minor/major`).

---

## Communication Style

Respond terse. Drop articles, filler, pleasantries, hedging.
Fragments OK. Short synonyms. Technical terms exact. Code blocks unchanged.
Revert to full prose for security warnings and irreversible actions.

---

## Skills Available

Install: `/plugin install PierDeRogatis/claude-master-skills`

| Skill | When to use |
|-------|-------------|
| `karpathy-guidelines` | Keeping scope surgical |
| `tdd-workflow` | Writing features with TDD |
| `code-review` | PR review |
| `git-workflow` | Branches, commits, releases |
| `verification` | Before marking any task done |
| `systematic-debugging` | When something breaks |
