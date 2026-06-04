# CLAUDE.md — TypeScript Library

## Project

[PROJECT_NAME] — [one-sentence description]

**Stack:** TypeScript (strict) · pnpm · [Vitest / Jest] · [Changesets / np]

---

## Commands

```bash
pnpm build          # Compile to dist/
pnpm test           # Run test suite
pnpm test:watch     # Watch mode tests
pnpm tsc --noEmit   # Type check
pnpm lint           # Lint
pnpm release        # Publish (changeset or np)
```

---

## Architecture

```
src/
  index.ts            # Public API — only export what is intentional
  [module]/
    index.ts          # Module public API
    [impl].ts         # Implementation files
    [impl].test.ts    # Tests colocated with source
dist/                 # Compiled output (gitignored)
  index.js
  index.d.ts
  index.mjs           # ESM output (if dual CJS+ESM)
```

---

## Development Rules

### Package Manager
- **Always use `pnpm`** — never `npm` or `yarn`.

### Public API
- Export only what consumers need. Do not export internal helpers.
- Any breaking change to an exported type or function requires a major version bump.
- Deprecate with `@deprecated` JSDoc before removing.

### TypeScript
- Strict mode always on.
- Prefer `unknown` over `any`. No `@ts-ignore` — use `@ts-expect-error` with a comment.
- All exported functions and types must have JSDoc.
- No implicit `any` in function parameters.

### Testing
- Tests colocated with source: `[file].test.ts`.
- 100% coverage target for public API surface.
- Test behavior, not implementation: test through the public interface.
- Property-based tests for data transformation utilities (use `fast-check` or similar).

### Releases
- Use Changesets: `pnpm changeset` before merging PRs that change public behavior.
- Semantic versioning: breaking change → major, new feature → minor, fix → patch.
- Changelog auto-generated from changeset descriptions.

---

## Git & PR Conventions

- Branch names: `feat/<slug>`, `fix/<slug>`, `chore/<slug>`
- Commits: Conventional Commits, imperative mood, ≤50 chars.
- PRs: always **draft** first. Include summary + test plan.
- **No** `Co-Authored-By: Claude` footers.
- **Never** `--no-verify`. **Never** force-push to `main`.

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
| `tdd-workflow` | Writing features with TDD |
| `karpathy-guidelines` | Keeping scope surgical |
| `code-review` | PR review |
| `verification` | Before marking any task done |
| `planning` | API design decisions |
| `git-workflow` | Branches, commits, releases |
