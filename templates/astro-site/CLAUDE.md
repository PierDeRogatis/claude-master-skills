# CLAUDE.md — Astro Site

## Project

[PROJECT_NAME] — [one-sentence description]

**Stack:** Astro 4+ · TypeScript · pnpm · Content Collections · Vercel (or Netlify)

---

## Commands

```bash
pnpm dev                          # Dev server (localhost:4321)
pnpm build                        # Production build to dist/
pnpm preview                      # Preview production build locally
pnpm astro check                  # Type-check .astro files
pnpm tsc --noEmit                 # Type-check .ts files
pnpm lint                         # Lint
```

---

## Architecture

```
src/
  pages/                # File-based routing — every .astro/.md file becomes a route
    index.astro         # Home page
    blog/
      [slug].astro      # Dynamic route from content collection
  content/              # Content Collections (structured Markdown/MDX)
    blog/               # Each subfolder = a collection
      post-1.md
    config.ts           # Collection schemas (Zod)
  components/           # Reusable Astro + framework components
    Header.astro
    Card.astro
    Counter.tsx         # React island (interactive)
  layouts/              # Page layouts
    BaseLayout.astro
    BlogLayout.astro
  lib/                  # Shared utilities
  styles/               # Global CSS
    global.css
public/                 # Static assets (copied as-is, no processing)
  favicon.svg
  og-image.png
astro.config.mjs        # Astro configuration
```

---

## Development Rules

### Component model
- **Astro components** (`.astro`) for static content — zero JS sent to client by default.
- **Framework components** (React/Vue/Svelte) only when interactivity is required — use `client:` directive.
  - `client:load` — hydrate immediately on page load.
  - `client:idle` — hydrate when browser is idle.
  - `client:visible` — hydrate when component enters viewport (default choice for below-fold interactive).
  - `client:only="react"` — skip SSR, render client-only (for browser-API-dependent components).
- No framework component without a `client:` directive renders any JavaScript.

### Content Collections
- All structured content (blog, docs, products) goes in `src/content/` as a collection.
- Define collection schema with Zod in `src/content/config.ts`.
- Access via `getCollection()` and `getEntry()` — never read content files with `fs`.
- Use `getStaticPaths()` with `getCollection()` for dynamic routes.

### Routing
- Static routes: `.astro` or `.md` files in `src/pages/`.
- Dynamic routes: `[slug].astro` with `getStaticPaths()` — must return all paths at build time.
- API routes: `src/pages/api/` with `.ts` extension — export `GET`, `POST`, etc.
- Avoid client-side routing unless using `@astrojs/react` + `react-router` for a full SPA section.

### Images
- Use `<Image>` from `astro:assets` for optimized images — never raw `<img>` for content images.
- Remote images: add allowed domains to `astro.config.mjs` under `image.domains`.
- Public static assets (logos, favicons): keep in `public/` — reference as `/filename.ext`.

### Styling
- Scoped styles by default in `.astro` files: `<style>` is component-scoped.
- Global styles: `import './styles/global.css'` in `BaseLayout.astro`.
- CSS variables for design tokens — define in `:root {}` in `global.css`.
- Tailwind: configure via `@astrojs/tailwind` integration.

### Performance
- Astro builds to static HTML by default — keep it that way unless you need SSR.
- Enable SSR only for pages that need server-side data fetching at request time.
- Islands add JS to the page — minimize and justify each one.

---

## Git & PR Conventions

- Branch names: `feat/<slug>`, `fix/<slug>`, `chore/<slug>`
- Commits: Conventional Commits, imperative mood, ≤50 chars.
- PRs: always **draft** first.
- **No** `Co-Authored-By: Claude` footers.
- **Never** force-push to `main`.

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
| `ui-ux-design` | Component design, color, typography |
| `tdd-workflow` | Writing features with TDD |
| `code-review` | PR review |
| `git-workflow` | Branches, commits, PRs |
| `planning` | New page or feature design |
| `verification` | Before marking any task done |
| `karpathy-guidelines` | Keeping changes surgical |
