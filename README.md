# claude-master-skills

Skills, subagents, hooks, and CLAUDE.md templates for Claude Code — covering **Next.js, Python, React Native, Astro, monorepos, and more**.

Synthesized from: [superpowers](https://github.com/obra/superpowers), [ECC](https://github.com/affaan-m/everything-claude-code), [anthropics/skills](https://github.com/anthropics/skills), [caveman](https://github.com/JuliusBrussee/caveman), [impeccable](https://github.com/pbakaus/impeccable), [VoltAgent subagents](https://github.com/VoltAgent/awesome-claude-code-subagents), [karpathy-guidelines](https://github.com/multica-ai/andrej-karpathy-skills), [vercel/next.js](https://github.com/vercel/next.js) CLAUDE.md, and [awesome-claude-code](https://github.com/hesreallyhim/awesome-claude-code).

---

## What's included

| Type | Count | Description |
|------|-------|-------------|
| Skills | 13 | SKILL.md files for TDD, code review, debugging, planning, Next.js, security, git, UI/UX, Claude API, Karpathy guidelines, caveman mode, verification + skill-navigator (meta) |
| Subagents | 9 | YAML agent definitions: architect, code-reviewer, typescript-specialist, security-reviewer, test-engineer, refactor-agent, doc-writer, api-designer, nextjs-specialist |
| Hooks | 9 | session-start, context-loader, pre-tool-check, branch-guard, secret-scanner, dependency-audit, test-reminder, task-summary, statusline |
| CLAUDE.md templates | 9 | nextjs-app, supabase-nextjs, node-api, typescript-lib, python-api, monorepo, react-native, cli-tool, astro-site |

---

## Install

### Option 1 — Plugin install (skills only, immediate)

Inside Claude Code:
```
/plugin install PierDeRogatis/claude-master-skills
```

Installs all 12 skills to `~/.claude/skills/`. No hooks, no CLAUDE.md template.

### Option 2 — Clone + script (full install)

```bash
git clone https://github.com/PierDeRogatis/claude-master-skills.git
node claude-master-skills/bin/install.js --target /path/to/your-project
```

This will:
1. Auto-detect project type (Next.js, Supabase, Python, Expo, Astro, monorepo, CLI, Node API, TypeScript lib)
2. Copy the matching CLAUDE.md template to your project root
3. Register all 9 hooks in `.claude/settings.json`
4. Register the plugin in `.claude/plugins.json`

**Options:**
```
--target <path>      Target project (default: cwd)
--dry-run            Preview changes, write nothing
--template <name>    Override detected template:
                     nextjs-app | supabase-nextjs | node-api | typescript-lib
                     python-api | monorepo | react-native | cli-tool | astro-site
--hooks-only         Skip CLAUDE.md copy
--no-hooks           Skip hook installation
```

### Option 3 — Manual copy

Copy only what you need:

| Want | Copy |
|------|------|
| A single skill | `skills/<name>/SKILL.md` → `~/.claude/skills/<name>/SKILL.md` |
| A single agent | `agents/<name>.yaml` → `.claude/agents/<name>.yaml` |
| A CLAUDE.md starter | `templates/<type>/CLAUDE.md` → `./CLAUDE.md` |
| Hooks only | Copy `hooks/*.js` and `hooks/*.sh` anywhere, then add paths to `.claude/settings.json` |

---

## Skills

| Skill | When to use |
|-------|-------------|
| `tdd-workflow` | RED-GREEN-REFACTOR with checkpoint commits |
| `code-review` | Multi-dimension PR review (correctness, security, perf, style, tests) |
| `systematic-debugging` | Isolate → reproduce → hypothesize → verify → fix |
| `planning` | Design-before-code with HARD GATE (no code until design is approved) |
| `caveman-communication` | Terse output mode, ~60–75% token reduction |
| `nextjs-patterns` | App Router, Turbopack, pnpm, Vercel, PR conventions |
| `security-review` | OWASP Top 10 + prompt-injection defense |
| `git-workflow` | Branch naming, Conventional Commits, PR creation |
| `ui-ux-design` | OKLCH colors, typography rules, 7 anti-pattern bans |
| `claude-api` | Anthropic SDK with prompt caching, tool use, streaming |
| `karpathy-guidelines` | Think before coding, simplicity first, surgical changes |
| `verification` | Confirm behavior in real env before reporting done |

---

## Agents

| Agent | Model | Role |
|-------|-------|------|
| `architect` | Opus | System design, ADRs, architecture decisions |
| `code-reviewer` | Sonnet | Multi-dimension PR review |
| `typescript-specialist` | Sonnet | TypeScript strict mode, generics, type design |
| `security-reviewer` | Opus | OWASP audit, prompt-injection defense |
| `test-engineer` | Sonnet | TDD, test generation, coverage |
| `refactor-agent` | Sonnet | Surgical refactoring, no scope creep |
| `doc-writer` | Haiku | JSDoc, README, changelogs |
| `api-designer` | Sonnet | REST/tRPC endpoint design |
| `nextjs-specialist` | Sonnet | App Router, caching, Turbopack, Vercel |

**To use an agent:**
```bash
# Copy to project-level agents directory
cp agents/architect.yaml .claude/agents/architect.yaml

# Or copy to global agents directory
cp agents/architect.yaml ~/.claude/agents/architect.yaml
```

---

## Hooks

| Hook | Event | What it does |
|------|-------|--------------|
| `session-start.js` | SessionStart | Detects project type, emits relevant skills hint |
| `context-loader.js` | UserPromptSubmit | Loads first 40 lines of CLAUDE.md on session's first message |
| `pre-tool-check.js` | PreToolUse(Bash) | Warns on `rm -rf`, force push, `git reset --hard`, DROP TABLE, etc. |
| `branch-guard.js` | PreToolUse(Bash) | Warns before committing/pushing directly on `main`/`master` |
| `secret-scanner.js` | PreToolUse(Bash) | Scans staged files for API keys, tokens, hardcoded passwords before commit/push |
| `dependency-audit.js` | PreToolUse(Bash) | Reminds to run `pnpm audit` / `pip-audit` after `add`/`install` |
| `test-reminder.js` | PostToolUse(Write/Edit) | Reminds to run tests after modifying `.ts/.tsx/.js/.py` files |
| `task-summary.js` | PostToolUse | Emits count of uncommitted changed files when ≥2 files are modified |
| `statusline.sh` | PostToolUse | Writes active-skills line to `~/.claude_statusline` |

Hooks are **read-only watchers** — they do not modify your project files.

---

## CLAUDE.md Templates

Ready-to-use starter files with project commands, architecture conventions, git rules, and a skills table. Auto-detected by the installer; override with `--template <name>`.

| Template | Auto-detected when | Stack |
|----------|--------------------|-------|
| `nextjs-app` | `next` in deps | Next.js 14+ App Router, pnpm, Vercel |
| `supabase-nextjs` | `@supabase/supabase-js` + `next` | Next.js + Supabase Auth/DB/Storage/Realtime |
| `node-api` | `hono`/`express`/`fastify`/`koa` in deps | Node.js REST API, TypeScript |
| `typescript-lib` | `typescript` only | TypeScript library with Changesets |
| `python-api` | `pyproject.toml` or `requirements.txt` present | FastAPI, Pydantic v2, uv, pytest |
| `monorepo` | `workspaces` field or `pnpm-workspace.yaml` | Turborepo + pnpm workspaces |
| `react-native` | `expo` or `react-native` in deps | React Native + Expo Router + EAS |
| `cli-tool` | `bin` field in `package.json` | Node.js CLI with Commander/esbuild |
| `astro-site` | `astro` in deps | Astro 4+ with Content Collections |

Edit after copying: replace `[PROJECT_NAME]` and add your specific stack details.

---

## Testing

The repo ships with a full test suite using Node.js built-in `node:test` (no extra dependencies).

```bash
# Run all tests
node --test 'tests/**/*.test.js'

# By category
node --test 'tests/hooks/*.test.js'       # hook unit tests (stdin/stdout)
node --test 'tests/installer/*.test.js'   # detectProjectType() cases
node --test 'tests/templates/*.test.js'   # template structure validation
```

**112 tests** covering:
- All 8 hook scripts (branch-guard, secret-scanner, pre-tool-check, test-reminder, dependency-audit, context-loader, task-summary, session-start)
- All 13 `detectProjectType()` cases including priority order
- All 9 CLAUDE.md templates (required sections + placeholder check)

---

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for the full guide.

Quick summary:
- **New skill**: open an issue with the `new-skill` template, or submit a PR
- **New template**: open an issue with the `new-template` template, or submit a PR
- **Bug report**: open an issue with the `bug-report` template

Quality bar: hooks must exit 0 always; skills must have TRIGGER/SKIP; templates must have all 5 required sections. All 112 tests must pass.

---

## Acknowledgements

This repo was made possible by **[Luca Luigi Gallo](https://github.com/LucaLuigiGallo)** ([@LucaLuigiGallo](https://github.com/LucaLuigiGallo)), who selected all the reference repositories and did the research that this collection is built on. The idea for the repo came from [@PierDeRogatis](https://github.com/PierDeRogatis) — but the curation and source discovery are Luca's work.

---

## Sources & Attribution

This collection synthesizes patterns from:

- **[superpowers](https://github.com/obra/superpowers)** — HARD GATE pattern, brainstorming checklist, hook architecture
- **[ECC](https://github.com/affaan-m/everything-claude-code)** — TDD checkpoint commits, identity profiles, security baseline
- **[anthropics/skills](https://github.com/anthropics/skills)** — SKILL.md format, marketplace.json, trigger/skip conventions
- **[caveman](https://github.com/JuliusBrussee/caveman)** — Communication compression modes, hook safety patterns
- **[impeccable](https://github.com/pbakaus/impeccable)** — UI anti-pattern bans, OKLCH color rules, typography constraints
- **[VoltAgent subagents](https://github.com/VoltAgent/awesome-claude-code-subagents)** — Agent taxonomy, model routing, YAML format
- **[karpathy-guidelines](https://github.com/multica-ai/andrej-karpathy-skills)** — Think before coding, simplicity first, surgical changes
- **[vercel/next.js](https://github.com/vercel/next.js)** — PR conventions, Turbopack defaults, testing patterns
- **[awesome-claude-code](https://github.com/hesreallyhim/awesome-claude-code)** — Hook decision trees, CLAUDE.md structure patterns

---

## License

MIT — see [LICENSE](./LICENSE).
