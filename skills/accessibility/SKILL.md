---
name: accessibility
label: Accessibility
description: |
  WCAG 2.1 AA audit and remediation for web UI: semantic HTML, ARIA, keyboard
  navigation, focus management, color contrast, and screen reader compatibility.
  TRIGGER when: reviewing or building UI components, forms, modals, interactive
  elements, or any page that needs an a11y audit. Also trigger when a user reports
  a screen reader issue or keyboard navigation problem. SKIP: backend-only changes
  with no HTML/JSX output.
version: "1.0.0"
author: PierDeRogatis
tags: [accessibility, a11y, wcag, aria, keyboard, screen-reader]
---

# Accessibility

## Overview

WCAG 2.1 AA is the standard. This skill applies the four WCAG principles (Perceivable, Operable, Understandable, Robust) as a structured audit checklist, then remediates any findings. A page that passes automated tools (axe-core, Lighthouse) but fails manual keyboard and screen reader testing is not accessible.

## Behavior

### Automated audit first

1. Run `axe-core` in the browser console or via `@axe-core/react` / Playwright integration. Fix all violations before manual testing.
2. Run Lighthouse a11y audit (Chrome DevTools → Lighthouse → Accessibility). Target score: 90+.
3. Run `eslint-plugin-jsx-a11y` if not already in the project. Fix all errors (not just warnings).

### Manual checklist (WCAG 2.1 AA)

**Perceivable**
- All `<img>` elements have meaningful `alt` text. Decorative images: `alt=""`.
- No information conveyed by color alone — always pair with text or shape.
- Color contrast: body text ≥4.5:1, large text (≥18px/≥14px bold) ≥3:1, UI components ≥3:1.
- Video/audio: captions and transcripts provided.
- Content does not rely solely on sensory characteristics (shape, size, position).

**Operable**
- Every interactive element reachable and activatable by keyboard alone (Tab, Shift+Tab, Enter, Space, Arrow keys).
- Focus order is logical — follows reading order, not DOM order if they differ.
- Focus ring is visible on every focusable element. `outline: none` without replacement is forbidden.
- No keyboard traps: focus can always leave any component.
- Skip-navigation link at top of page: `<a href="#main" class="skip-link">Skip to content</a>`.
- No time limits that cannot be paused or extended (or flagged as exceptions).
- No content that flashes more than 3 times per second.

**Understandable**
- `<html lang="en">` (or appropriate language code) present on every page.
- Form fields have associated `<label>` (via `for`/`id` or wrapping). Never use `placeholder` as the only label.
- Error messages: programmatically associated with the field via `aria-describedby` or `aria-errormessage`. Error text appears in DOM, not only as color/icon.
- Clear, consistent navigation across pages.

**Robust**
- Semantic HTML: use `<button>` for buttons, `<a>` for navigation, `<nav>`, `<main>`, `<header>`, `<footer>`, `<section>`, `<article>` appropriately.
- Never use `<div>` or `<span>` as interactive elements without ARIA role + keyboard handlers.
- ARIA: only add `aria-*` when native semantics are insufficient. Wrong ARIA is worse than no ARIA.
- `aria-label` or `aria-labelledby` on icon-only buttons: `<button aria-label="Close dialog">✕</button>`.
- Never set `aria-hidden="true"` on a focusable element.
- `role="dialog"` modals: focus moves into modal on open, returns to trigger on close, focus trapped inside while open.
- Live regions: `aria-live="polite"` for non-urgent updates, `aria-live="assertive"` only for critical alerts.

### Screen reader testing

Verify with at least one:
- **VoiceOver** (macOS): Cmd+F5 to toggle. Navigate with VO+Arrow keys.
- **NVDA** (Windows, free): Navigate with Insert+Arrow keys.
- **TalkBack** (Android): Settings → Accessibility → TalkBack.

Minimum test: tab through the entire page, activate each interactive element, confirm all content is announced meaningfully.

## Rules

- MUST fix all `axe-core` violations before considering a component accessible.
- MUST ensure every interactive element is reachable by keyboard.
- MUST NOT use `outline: none` without providing an equivalent visible focus indicator.
- MUST NOT use `aria-hidden="true"` on any element that can receive focus.
- MUST associate form error messages with their field via `aria-describedby` or `aria-errormessage`.
- MUST use semantic HTML before reaching for ARIA.
- MUST test with real keyboard navigation before reporting accessible.
- MUST NOT pass `alt=""` to meaningful images — only decorative images get empty alt.
- MUST ensure modal dialogs trap focus while open and restore focus on close.

## Examples

**Icon-only button — wrong vs right:**
```jsx
// Wrong: screen reader announces "button" with no context
<button onClick={onClose}><XIcon /></button>

// Right: announces "Close dialog, button"
<button aria-label="Close dialog" onClick={onClose}><XIcon /></button>
```

**Form field with error — wrong vs right:**
```jsx
// Wrong: error only shown visually, not programmatically linked
<input type="email" style={{ borderColor: 'red' }} />
<span style={{ color: 'red' }}>Invalid email</span>

// Right: error linked to input, announced on focus
<input
  type="email"
  aria-invalid="true"
  aria-describedby="email-error"
/>
<span id="email-error" role="alert">
  Enter a valid email address (e.g. name@example.com)
</span>
```

**Skip navigation link:**
```css
/* Visually hidden until focused */
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: #000;
  color: #fff;
  padding: 8px;
  z-index: 100;
}
.skip-link:focus { top: 0; }
```
```html
<a href="#main-content" class="skip-link">Skip to main content</a>
<main id="main-content">...</main>
```

## Notes

- `ui-ux-design` skill covers color contrast from a design perspective — this skill covers it from an audit/remediation perspective. They overlap on contrast; this skill goes deeper on ARIA and keyboard.
- WCAG 2.2 (2023) added new criteria; WCAG 2.1 AA is the current legal baseline in most jurisdictions.
- Automated tools catch ~30–40% of a11y issues. Manual keyboard and screen reader testing is required for the rest.
- Related skills: `ui-ux-design` (design-time color/typography), `code-review` (catch issues in review), `verification` (confirm a11y before shipping).
