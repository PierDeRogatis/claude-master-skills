---
name: ui-ux-design
label: UI/UX Design
description: |
  Frontend design rules: OKLCH color system, typography, layout, motion, and a
  rewrite-immediately list of anti-patterns. TRIGGER when: writing or reviewing
  CSS/Tailwind, creating UI components, designing layouts, or choosing color palettes.
  SKIP: backend-only changes with no UI output.
version: "1.0.0"
author: PierDeRogatis
tags: [ui, ux, design, css, tailwind, oklch, typography]
---

# UI/UX Design

## Overview

Concrete, enforceable design rules. Anti-patterns are listed explicitly — rewrite any component that uses them, immediately. No hex codes for new color tokens. No gradient text.

## Color

- **OKLCH throughout** — all new color tokens use `oklch(L C H)` syntax.
- Never write hex codes or HSL for new tokens. Existing hex in legacy code is acceptable until migrated.
- Body text contrast ≥4.5:1 against background.
- Large text (≥18px / ≥14px bold) contrast ≥3:1.
- Placeholder text contrast ≥4.5:1 (same as body — `color-mix` with alpha is not sufficient).
- Gray text on colored background → use a darker shade of the background's own hue (do not use neutral gray).
- Tinted neutrals: `oklch(L C H)` where L=0.84–0.97, C<0.06, H=40–100. Not cool gray.

## Typography

- Body line length: 65–75 characters. Use `max-width: 65ch` or equivalent.
- Hierarchy via scale + weight contrast — minimum 1.25× ratio between adjacent type levels.
- Cap font families at 3: display, body, optional mono. No decorative fonts for body copy.
- No all-caps body copy. Uppercase reserved for short labels (≤4 words, 0.08em letter-spacing).
- Hero headings: max `6rem`. Display type: `letter-spacing ≥ -0.04em`.
- Apply `text-wrap: balance` to `h1`–`h3`. Apply `text-wrap: pretty` to prose paragraphs.
- Avoid `font-size` below `0.75rem` / 12px in any UI element.

## Layout

- Flexbox for 1D layouts (row or column). Grid for 2D layouts. No defaulting to Grid for everything.
- Responsive grids: `grid-template-columns: repeat(auto-fit, minmax(280px, 1fr))`.
- Semantic z-index scale — never arbitrary `999` or `9999`. Define a scale: 10/20/30/40/50.
- Spacing: vary rhythm intentionally. Do not use the same spacing value for every gap.
- Cards only when content needs containment and boundary. Not as a default wrapper for everything.

## Motion

- Ease-out with exponential curves: `cubic-bezier(0.22, 1, 0.36, 1)` (ease-out-quart/quint/expo).
- No bounce (`spring`, `elastic`) unless explicitly requested.
- Duration: micro-interactions 100–150ms, transitions 200–300ms, page transitions 350–500ms.
- `@media (prefers-reduced-motion: reduce)` is mandatory on every animation.
- Reveal animations must enhance already-visible defaults — elements should render correctly with motion disabled.

## Interaction

- Dropdowns with `position: absolute` inside `overflow: hidden` parent = clipped. Use `<dialog>`, Popover API, `position: fixed`, or a portal.
- Focus states: always visible (`outline: 2px solid currentColor; outline-offset: 2px`). Never `outline: none` without a replacement.
- Touch targets: minimum 44×44px for interactive elements on mobile.
- Loading states: every async action needs a visible loading indicator within 300ms.

## Copy

- Every word earns its place. No restatement of headings in body copy.
- No em dashes — use commas, colons, semicolons, periods instead.
- No marketing buzzwords: seamless, transform, leverage, powerful, robust, intuitive, game-changing.
- Button labels: verb + object ("Save changes", "Delete account", not "OK", "Submit").
- Link text: standalone meaning ("View pricing", not "Click here" or "Learn more" without context).
- Error messages: what went wrong + how to fix it. No "An error occurred."

## Anti-Pattern Bans — Rewrite Immediately

Any component using these patterns must be rewritten before merge:

1. **Side-stripe borders** — `border-left` or `border-right` >1px on cards, list items, or callouts as a decorative element.
2. **Gradient text** — `background-clip: text; -webkit-background-clip: text`. Use solid color or a single accent.
3. **Decorative glassmorphism** — `backdrop-filter: blur()` as a default background treatment. Only use for modals/overlays where it adds genuine depth.
4. **Hero metric template** — big number + small label + row of stats + gradient background. Find a different way to present data.
5. **Identical card grid** — three or more cards with the same icon + heading + text structure repeated. Vary density, hierarchy, or content type.
6. **Numbered section scaffold** — `01 / 02 / 03` or tiny uppercase eyebrows above every section as the only hierarchy signal.
7. **Mobile text overflow** — large clamp heading that overflows at 320–375px viewport width.

## AI Slop Test

Before shipping any UI, answer:
- Can someone guess the theme and palette from the category alone? ("It's a SaaS dashboard.") → Rework.
- Can someone guess the aesthetic family from category + anti-reference list? → Rework.
- Both answers must be "no" for the design to be non-generic.

## Rules

- MUST use OKLCH for all new color tokens.
- MUST check and enforce the 7 anti-pattern bans before any UI review passes.
- MUST include `@media (prefers-reduced-motion)` on every animation.
- MUST NOT use hex codes for new design tokens.
- MUST NOT use `outline: none` without an accessible replacement.
- MUST NOT approve `dangerouslySetInnerHTML` with user input (security cross-concern).

## Notes

- For color palette generation from a seed: use the palette script if available, or manually compose with OKLCH at L=0.4/0.6/0.8 for dark/mid/light variants.
- Related skills: `code-review` (catch anti-patterns in review), `nextjs-patterns` (Next.js Image/Font rules).
