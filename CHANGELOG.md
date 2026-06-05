# Changelog

All notable changes to this project will be documented in this file.
Format: [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [1.3.0] — 2026-06-05

### Added
- GitHub Actions CI workflow (`.github/workflows/test.yml`) — runs 112 tests on Node 18/20/22 for every push and PR
- `skill-author` skill — guides writing new SKILL.md files following the repo's quality bar
- `accessibility` skill — WCAG 2.1 AA checklist, ARIA rules, screen reader testing, a11y tooling
- `database-migrations` skill — safe schema change patterns (add column, rename, remove, index, type changes)
- README shields.io badges (tests, license, skill count)
- `CHANGELOG.md` (this file)

### Fixed
- `plugin.json` was missing `skill-navigator` — now lists all 13 skills

### Changed
- Bumped version to `1.3.0` across `package.json`, `plugin.json`, `marketplace.json`

---

## [1.2.0] — 2026-06-04

### Added
- Full test suite: 112 tests using `node:test` (zero dependencies)
  - 8 hook unit tests (`tests/hooks/`)
  - 13 installer `detectProjectType()` cases (`tests/installer/`)
  - 54 template structure assertions (`tests/templates/`)
  - Test helpers: `run-hook.js` (subprocess runner), `fake-git.js` (mock PATH git binary)
- `skill-navigator` skill — meta decision tree for choosing which skill to invoke
- `CONTRIBUTING.md` — quality bars, submission process, code style
- GitHub issue templates: `new-skill.md`, `new-template.md`, `bug-report.md`
- GitHub PR template with per-type quality checklists

### Fixed
- `session-start.js` now uses shared `detectProjectType()` from `bin/install.js`, recognising all 9 project types (was only detecting 3)
- `typescript-lib` template had `[LIBRARY_NAME]` placeholder instead of `[PROJECT_NAME]`

### Changed
- `bin/install.js`: exported `detectProjectType(dir?)` for direct import in tests; wrapped `main()` in `require.main === module` guard

---

## [1.1.0] — 2026-06-04

### Added
- 6 new hooks (total 9):
  - `context-loader.js` — loads CLAUDE.md on first session message (UserPromptSubmit)
  - `branch-guard.js` — warns on commit/push to `main`/`master`
  - `secret-scanner.js` — scans staged diff for API keys before commit/push
  - `dependency-audit.js` — audit reminder on `pnpm add` / `pip install`
  - `test-reminder.js` — nudges tests after editing code files
  - `task-summary.js` — emits uncommitted file count when ≥2 files changed
- 6 new CLAUDE.md templates (total 9):
  - `python-api` (FastAPI + uv + pytest)
  - `monorepo` (Turborepo + pnpm workspaces)
  - `supabase-nextjs` (Next.js + Supabase Auth/DB/Realtime)
  - `react-native` (Expo Router + EAS)
  - `cli-tool` (Commander.js + esbuild)
  - `astro-site` (Astro 4 + Content Collections)
- Extended `bin/install.js` detection to all 9 project types (astro, expo, supabase, monorepo, python, cli)

---

## [1.0.0] — 2026-06-04

### Added
- 12 skills: `tdd-workflow`, `code-review`, `systematic-debugging`, `planning`, `caveman-communication`, `nextjs-patterns`, `security-review`, `git-workflow`, `ui-ux-design`, `claude-api`, `karpathy-guidelines`, `verification`
- 9 subagent YAML definitions: `architect`, `code-reviewer`, `typescript-specialist`, `security-reviewer`, `test-engineer`, `refactor-agent`, `doc-writer`, `api-designer`, `nextjs-specialist`
- 3 hooks: `session-start.js`, `pre-tool-check.js`, `statusline.sh`
- 3 CLAUDE.md templates: `nextjs-app`, `node-api`, `typescript-lib`
- Universal installer (`bin/install.js`) with auto project-type detection and `--dry-run` support
- Plugin registry: `.claude-plugin/plugin.json` + `marketplace.json` (3 groups)
- MIT license, README with all three usage modes documented
