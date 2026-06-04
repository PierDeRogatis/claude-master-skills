# CLAUDE.md — Monorepo (Turborepo + pnpm workspaces)

## Project

[PROJECT_NAME] — [one-sentence description]

**Stack:** Turborepo · pnpm workspaces · TypeScript · [apps: Next.js, Node API, etc.] · Changesets

---

## Commands

```bash
pnpm turbo build                  # Build all packages in dependency order
pnpm turbo test                   # Run tests across all packages
pnpm turbo lint                   # Lint all packages
pnpm turbo dev                    # Dev mode for all apps
pnpm --filter=<app-or-pkg> dev    # Dev a specific app/package
pnpm --filter=<app-or-pkg> build  # Build a specific app/package
pnpm --filter=<app-or-pkg> test   # Test a specific package
pnpm changeset                    # Create a changeset for shared package changes
pnpm version-packages             # Apply changesets and bump versions
```

---

## Architecture

```
apps/                   # Deployable applications (each is independent)
  web/                  # Next.js frontend
  api/                  # Node.js backend
  docs/                 # Docs site (Astro, Docusaurus, etc.)
packages/               # Shared libraries (imported by apps and each other)
  ui/                   # Shared React component library
  config/               # Shared TypeScript/ESLint/Tailwind configs
  db/                   # Database client and migrations
  utils/                # Shared utility functions
tooling/                # Shared build tooling
  typescript/           # Base tsconfig.json
  eslint/               # Shared ESLint config
  tailwind/             # Shared Tailwind config
turbo.json              # Turborepo pipeline config
pnpm-workspace.yaml     # Workspace package paths
package.json            # Root: scripts + workspace devDependencies
```

---

## Development Rules

### Package boundaries
- `apps/` packages must NOT import from each other directly. All sharing goes through `packages/`.
- `packages/` may import from other `packages/` but NOT from `apps/`.
- Circular dependencies between packages are forbidden.
- Every new shared utility goes to an existing `packages/` package or a new one — never inline in `apps/`.

### TypeScript
- Each package has its own `tsconfig.json` that extends `tooling/typescript/base.json`.
- `paths` aliases must be consistent: use `@repo/<package>` naming convention.
- Root `tsconfig.json` is for IDE support only — not used by build tools.

### Turborepo pipeline (`turbo.json`)
- `build` task: `dependsOn: ["^build"]` — builds run bottom-up (deps first).
- `dev` task: `persistent: true` — never cache dev servers.
- `test` and `lint` tasks: `dependsOn: ["^build"]` so type checking uses built artifacts.
- Cache outputs: `dist/**`, `.next/**`, `build/**`. Never cache `node_modules/`.

### Adding shared packages
1. Create `packages/<name>/` with `package.json` (`name: "@repo/<name>"`).
2. Add to `pnpm-workspace.yaml` if not already globbed.
3. In consuming app/package: `pnpm --filter=<app> add @repo/<name>`.
4. Export types from `packages/<name>/src/index.ts` only.

### Versioning
- Internal packages (`@repo/*`) are private — no public versioning needed.
- Public packages: use Changesets (`pnpm changeset`) on every user-facing change.
- Never manually edit `CHANGELOG.md` — Changesets generates it.

---

## Git & PR Conventions

- Branch names: `feat/<slug>`, `fix/<slug>`, `chore/<slug>`
- Commits: Conventional Commits, imperative mood, ≤50 chars.
- PRs: always **draft** first. Mention which `apps/` or `packages/` are affected.
- **No** `Co-Authored-By: Claude` footers.
- **Never** force-push to `main`.
- For changes to shared `packages/`: always include a changeset.

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
| `planning` | Before adding a new package or app |
| `tdd-workflow` | Writing features with TDD |
| `code-review` | PR review |
| `git-workflow` | Branches, commits, PRs |
| `karpathy-guidelines` | Keeping changes surgical |
| `verification` | Before marking any task done |
