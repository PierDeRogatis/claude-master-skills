# CLAUDE.md — Node.js API

## Project

[PROJECT_NAME] — [one-sentence description]

**Stack:** Node.js · TypeScript (strict) · [Hono / Express] · pnpm · [add: DB, auth, etc.]

---

## Commands

```bash
pnpm dev            # Watch mode (tsx watch / nodemon)
pnpm build          # Compile TypeScript
pnpm start          # Run compiled output
pnpm test           # Run test suite
pnpm tsc --noEmit   # Type check
pnpm lint           # Lint
```

---

## Architecture

```
src/
  routes/             # Route handlers grouped by resource
  middleware/         # Auth, error handling, logging
  services/           # Business logic (no HTTP concerns)
  db/                 # Database client, queries, migrations
  types/              # Shared TypeScript types
  lib/                # Utilities (validation, crypto, etc.)
  index.ts            # App entry point
tests/
  unit/               # Pure function tests
  integration/        # API endpoint tests (real HTTP)
```

---

## Development Rules

### Package Manager
- **Always use `pnpm`** — never `npm` or `yarn`.

### API Design
- Resources are nouns, plural: `/users`, `/posts`.
- HTTP verbs for actions: GET (read), POST (create), PUT (replace), PATCH (update), DELETE (remove).
- Consistent response envelope: `{ data: {...} }` for success, `{ error: { code, message } }` for errors.
- Input validated with Zod at the route handler level — never pass unvalidated user input to services.

### Error Handling
- All route handlers wrapped in `try/catch` or use a global error middleware.
- Never expose stack traces or internal paths in error responses.
- Log errors server-side; return safe generic messages to clients.

### Testing
- Integration tests hit the real running server and real database — no DB mocks.
- Unit tests for pure functions and business logic only.
- Use `supertest` or equivalent for HTTP integration tests.

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

## Security

- No secrets in source code — all via environment variables.
- Rate limiting on auth endpoints and expensive operations.
- SQL: parameterized queries only — never string concatenation.
- `exec()` with user input is forbidden — use `execFile()` with array args.
- Run `pnpm audit` before every deployment.

---

## Skills Available

Install: `/plugin install PierDeRogatis/claude-master-skills`

| Skill | When to use |
|-------|-------------|
| `tdd-workflow` | Writing features with TDD |
| `code-review` | PR review |
| `security-review` | Auth, input handling, API endpoints |
| `git-workflow` | Branches, commits, PRs |
| `planning` | New feature or service design |
| `verification` | Before marking any task done |
| `systematic-debugging` | When something breaks |
