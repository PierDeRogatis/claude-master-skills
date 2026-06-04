# CLAUDE.md — Python API

## Project

[PROJECT_NAME] — [one-sentence description]

**Stack:** Python 3.11+ · FastAPI · Pydantic v2 · uv · pytest · uvicorn

---

## Commands

```bash
uv run fastapi dev app/main.py    # Dev server with hot reload
uv run fastapi dev                # Auto-detect main.py
uv run pytest                     # Run test suite
uv run pytest -x                  # Stop on first failure
uv run mypy .                     # Type check
uv run ruff check .               # Lint
uv run ruff format .              # Format
uv add <package>                  # Add dependency
uv add --dev <package>            # Add dev dependency
```

---

## Architecture

```
app/
  main.py               # FastAPI app instance, include routers
  routers/              # Route handlers grouped by resource
    users.py
    health.py
  models/               # Pydantic models (request/response schemas)
    user.py
  services/             # Business logic (no HTTP concerns)
    user_service.py
  core/
    config.py           # Settings via pydantic-settings
    database.py         # DB connection (SQLAlchemy / asyncpg)
    security.py         # Auth utilities
  dependencies.py       # FastAPI Depends() definitions
tests/
  conftest.py           # pytest fixtures, test client
  test_users.py         # Route-level integration tests
pyproject.toml
```

---

## Development Rules

### Types
- Type hints mandatory on all function signatures — no bare `Any` without comment.
- Pydantic v2 models for all request/response bodies. No raw dicts at API boundaries.
- Use `model_config = ConfigDict(strict=True)` for input models.

### FastAPI patterns
- Dependency injection via `Depends()` for: DB sessions, auth, settings.
- Route handlers: thin. Logic belongs in `services/`.
- Async route handlers (`async def`) when the handler awaits I/O; sync otherwise.
- Response models declared on every endpoint: `response_model=UserResponse`.
- HTTP status codes explicit: `status_code=201` for creates, `204` for deletes.

### Settings
- All config via `pydantic-settings` — never `os.environ[]` directly in business logic.
- `.env` file for local dev; real env vars in production. `.env` is gitignored.

### Error handling
- Use FastAPI `HTTPException` for client errors (4xx).
- Define custom exception handlers for domain errors (e.g., `EntityNotFoundError → 404`).
- Never expose stack traces in API responses — log internally, return safe messages.

### Testing
- Integration tests use `httpx.AsyncClient` + `TestClient` against the real app.
- No mocking of DB in integration tests — use a test database.
- Fixtures in `conftest.py`. One fixture per concern.
- Test naming: `test_<resource>_<action>_<condition>` (e.g., `test_user_create_returns_201`).

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

- No secrets in source code — all via environment variables / pydantic-settings.
- Validate all user input with Pydantic before use.
- Run `pip-audit` / `uv run pip-audit` before every deployment.
- SQL: use parameterized queries / ORM — never string format in queries.

---

## Skills Available

Install: `/plugin install PierDeRogatis/claude-master-skills`

| Skill | When to use |
|-------|-------------|
| `tdd-workflow` | Writing features with TDD |
| `code-review` | PR review |
| `security-review` | Auth, input handling, SQL |
| `git-workflow` | Branches, commits, PRs |
| `planning` | New feature or service design |
| `verification` | Before marking any task done |
| `systematic-debugging` | When something breaks |
