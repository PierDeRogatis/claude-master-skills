# Contributing to claude-master-skills

Thanks for improving this collection. Contributions are welcome for new skills, hooks, templates, and bug fixes.

---

## What to contribute

| Type | Welcome | Not welcome |
|------|---------|-------------|
| New skill (SKILL.md) | ✓ Any coding/process domain | Duplicate of existing skill |
| New hook | ✓ Any Claude Code event | Hooks that modify project files |
| New CLAUDE.md template | ✓ New framework/stack | Variants of existing templates |
| Bug fix | ✓ Any file | |
| New agent (YAML) | ✓ Specialized roles | |
| Tests for existing code | ✓ Always welcome | |

---

## Quality bars

### Skill quality bar
Every SKILL.md must have:
- `TRIGGER when:` and `SKIP:` conditions in the description frontmatter
- At least one `## Examples` section with a concrete before/after or usage example
- Rules expressed as `MUST` / `MUST NOT` statements (not vague guidance)
- A `## Notes` section listing related skills
- Target length: 150–300 lines

### Hook quality bar
Every hook script must:
- Exit `0` in all cases — never block execution
- Handle malformed stdin JSON silently (try/catch around all logic)
- Be a **read-only watcher** — do not modify project files
- Include a test in `tests/hooks/<name>.test.js`

### Template quality bar
Every CLAUDE.md template must have:
- `## Commands` section with copy-paste ready commands
- `## Architecture` section with directory tree
- `## Git & PR Conventions` section
- `## Communication Style` section (terse mode rules)
- `## Skills Available` table
- `[PROJECT_NAME]` placeholder (not filled in)
- No framework version numbers that will go stale within 6 months (use "14+" not "14.2.3")

---

## How to submit

1. **Fork** the repo and create a branch: `feat/<slug>` or `fix/<slug>`
2. **Write your content** following the quality bars above
3. **Add tests** for hooks; run `node --test 'tests/**/*.test.js'` and confirm all pass
4. **Update README.md** tables if you added a skill, hook, or template
5. **Open a PR** as draft with the PR template filled in
6. Do NOT add `Co-Authored-By: Claude` or "Generated with Claude Code" to commits or PR

---

## Proposing ideas

Not ready to code it? Open an issue using one of the templates:
- **New skill** — describe the problem it solves and the TRIGGER conditions
- **New template** — describe the stack and why it differs from existing templates
- **Bug report** — include the exact input, expected output, and actual output

---

## Testing

```bash
# Run all tests
node --test 'tests/**/*.test.js'

# Run only hook tests
node --test 'tests/hooks/*.test.js'

# Run only installer tests
node --test 'tests/installer/*.test.js'

# Run only template validation
node --test 'tests/templates/*.test.js'
```

All 112+ tests must pass before a PR is merged.

---

## Code style

- CommonJS (`require()`), not ESM
- No external dependencies in hooks or the installer
- `node:test` + `node:assert` for tests (no Jest, no Vitest)
- 2-space indentation, double quotes for strings
- Hook scripts: always `exit 0`; never `process.exit(1)` on normal paths
