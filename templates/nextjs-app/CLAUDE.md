# CLAUDE.md — Next.js App

## Project

[PROJECT_NAME] — [one-sentence description]

**Stack:** Next.js 14+ (App Router) · TypeScript (strict) · pnpm · Vercel · [add: DB, auth, etc.]

---

## Commands

```bash
pnpm --filter=next dev          # Watch mode (~1–2s rebuilds)
pnpm --filter=next build        # Build Next.js package only
pnpm build                      # Full workspace build
pnpm test                       # Run test suite
pnpm tsc --noEmit               # Type check (~10s)
pnpm lint                       # Lint
pnpm test-dev-turbo             # Integration tests (Turbopack dev)
pnpm test-start-turbo           # Integration tests (Turbopack prod)
```

---

## Architecture

```
app/                    # App Router — all new routes go here
  (auth)/               # Route group: auth pages
  api/                  # Route handlers (app/api/<name>/route.ts)
  layout.tsx            # Root layout
  page.tsx              # Home page
components/             # Shared React components
  ui/                   # Primitive UI components
lib/                    # Shared utilities, db client, auth helpers
  db.ts                 # Database client (singleton)
  auth.ts               # Auth configuration
types/                  # Shared TypeScript types
public/                 # Static assets
```

---

## Development Rules

### Package Manager
- **Always use `pnpm`** — never `npm` or `yarn`.

### Components
- Server Components by default. Add `"use client"` only for: `useState`/`useEffect`, browser APIs, event listeners.
- Never fetch data in Client Components — pass as props from Server Components.

### Bundler
- Turbopack is the default. No `--no-turbopack` flag.
- Force webpack only when explicitly needed: `--webpack`.

### Images & Fonts
- `next/image` for all images. Never raw `<img>`.
- `next/font` for all fonts. Never `<link>` to Google Fonts.

### Testing
- Use `retry()` from `next-test-utils`, never `setTimeout`.
- Generate test suites with `pnpm new-test`.

---

## Git & PR Conventions

- Branch names: `feat/<slug>`, `fix/<slug>`, `chore/<slug>`
- Commits: Conventional Commits (`feat:`, `fix:`, `chore:`, etc.), imperative mood, ≤50 chars subject.
- PRs: always created as **draft**. Include summary + test plan in body.
- LLM-authored PRs: must include `<!-- NEXT_JS_LLM_PR -->` in description body.
- **No** `Co-Authored-By: Claude` footers. **No** "Generated with Claude Code" text.
- **Never** `--no-verify`. **Never** `git push --force` to `main`.

---

## Communication Style

Respond terse. Drop: articles, filler (just/really/basically), pleasantries, hedging.
Fragments OK. Short synonyms. Technical terms exact. Code blocks unchanged.
Pattern: `[thing] [action] [reason]. [next step].`
Revert to full prose for: security warnings, irreversible action confirmations.

---

## Security

- No secrets in source code. All secrets via environment variables.
- User input validated at system boundaries before use.
- LLM calls: sanitize user input before including in prompts.
- Run `pnpm audit` before every deployment.

---

## Skills Available

Install: `/plugin install PierDeRogatis/claude-master-skills`

| Skill | When to use |
|-------|-------------|
| `nextjs-patterns` | App Router, Turbopack, PR conventions |
| `tdd-workflow` | Writing features with TDD |
| `code-review` | PR review |
| `git-workflow` | Branches, commits, PRs |
| `ui-ux-design` | CSS, Tailwind, component design |
| `security-review` | Auth, API endpoints, user input |
| `planning` | New feature design |
| `verification` | Before marking any task done |
