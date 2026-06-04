# claude-master-skills

Skills, subagents, hooks, and CLAUDE.md templates for Claude Code — scoped to the **Next.js / TypeScript / Vercel** stack.

Synthesized from: [superpowers](https://github.com/obra/superpowers), [ECC](https://github.com/affaan-m/everything-claude-code), [anthropics/skills](https://github.com/anthropics/skills), [caveman](https://github.com/JuliusBrussee/caveman), [impeccable](https://github.com/pbakaus/impeccable), [VoltAgent subagents](https://github.com/VoltAgent/awesome-claude-code-subagents), [karpathy-guidelines](https://github.com/multica-ai/andrej-karpathy-skills), [vercel/next.js](https://github.com/vercel/next.js) CLAUDE.md, and [awesome-claude-code](https://github.com/hesreallyhim/awesome-claude-code).

---

## What's included

| Type | Count | Description |
|------|-------|-------------|
| Skills | 12 | SKILL.md files for TDD, code review, debugging, planning, Next.js, security, git, UI/UX, Claude API, Karpathy guidelines, caveman mode, verification |
| Subagents | 9 | YAML agent definitions: architect, code-reviewer, typescript-specialist, security-reviewer, test-engineer, refactor-agent, doc-writer, api-designer, nextjs-specialist |
| Hooks | 3 | session-start (project detection), pre-tool-check (destructive command warning), statusline (active skills display) |
| CLAUDE.md templates | 3 | nextjs-app, node-api, typescript-lib |

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
1. Detect your project type (nextjs-app / node-api / typescript-lib)
2. Copy the matching CLAUDE.md template to your project root
3. Register the three hooks in `.claude/settings.json`
4. Register the plugin in `.claude/plugins.json`

**Options:**
```
--target <path>      Target project (default: cwd)
--dry-run            Preview changes, write nothing
--template <name>    Override detected template
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
| `session-start.js` | SessionStart | Reads `package.json`, emits project type + relevant skills |
| `pre-tool-check.js` | PreToolUse(Bash) | Warns on `rm -rf`, force push, `git reset --hard`, DROP TABLE, etc. |
| `statusline.sh` | PostToolUse | Writes active-skills line to `~/.claude_statusline` |

Hooks are **read-only watchers** — they do not modify your project files.

---

## CLAUDE.md Templates

Ready-to-use starter files with project commands, architecture conventions, git rules, and a skills table.

| Template | For |
|----------|-----|
| `templates/nextjs-app/CLAUDE.md` | Next.js 14+ App Router projects |
| `templates/node-api/CLAUDE.md` | Hono/Express TypeScript APIs |
| `templates/typescript-lib/CLAUDE.md` | TypeScript libraries with Changesets |

Edit after copying: replace `[PROJECT_NAME]` and add your specific stack details.

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
