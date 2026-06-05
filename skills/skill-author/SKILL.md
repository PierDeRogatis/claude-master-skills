---
name: skill-author
label: Skill Author
description: |
  Guides writing a new SKILL.md file that meets the collection's quality bar.
  TRIGGER when: user wants to add a new skill to claude-master-skills, asks "how do
  I write a skill", or wants to contribute a skill. SKIP: user is invoking an
  existing skill; user is writing a CLAUDE.md template (different format).
version: "1.0.0"
author: PierDeRogatis
tags: [meta, contributing, skills, authoring]
---

# Skill Author

## Overview

Guides you through writing a complete, high-quality SKILL.md from scratch. Follow the steps in order — each one produces a specific part of the file. The result must pass the quality checklist at the end before it is added to the collection.

## Behavior

### Step 1 — Choose the slug and label

- **Slug**: lowercase, hyphen-separated, describes the action (`tdd-workflow`, `code-review`, `accessibility`). Verb-first or noun-phrase.
- **Label**: Title Case human-readable name for the same concept.
- The slug becomes the folder name: `skills/<slug>/SKILL.md`.

### Step 2 — Write the frontmatter

Copy this template exactly, then fill in each field:

```yaml
---
name: <slug>
label: <Label>
description: |
  One paragraph (3–5 sentences). Must end with:
  TRIGGER when: <explicit conditions that activate this skill>.
  SKIP: <when NOT to use it — name competing skills if relevant>.
version: "1.0.0"
author: <your-github-handle>
tags: [<tag1>, <tag2>]
---
```

**Description rules:**
- TRIGGER conditions must be concrete: user says X, file contains Y, task involves Z.
- SKIP conditions must name the alternative: "use `code-review` instead", "handle ad-hoc".
- Do not repeat the skill name in the description — it is redundant.

### Step 3 — Write the body (five required sections)

```markdown
# <Label>

## Overview
2–4 sentences: what this skill does and when to invoke it. No step-by-step here.

## Behavior
Numbered steps: what Claude does when this skill is active.
Each step is a concrete action, not a vague principle.
Use sub-bullets for options within a step.

## Rules
Bulleted list of invariants. Use MUST / MUST NOT.
No hedging ("should", "try to", "consider"). Hard rules only.
Include at least 4 rules and at most 10.

## Examples
At least one complete example. Show:
- The user's task or input
- The specific steps Claude takes
- The concrete output or outcome
Use code blocks where relevant.

## Notes
- Edge cases and limitations
- Related skills (link by name: `code-review`, `planning`, etc.)
- When to escalate to a human decision
```

### Step 4 — Check length

Target: **150–300 lines** for the full file (frontmatter + body).
- Under 150 lines: the skill is probably too vague or missing examples.
- Over 300 lines: the skill is probably two skills — split it.

### Step 5 — Self-check against quality bar

Before submitting, confirm every item:

- [ ] Frontmatter has `name`, `label`, `description`, `version`, `author`, `tags`
- [ ] Description ends with explicit `TRIGGER when:` and `SKIP:` lines
- [ ] All five body sections present: Overview, Behavior, Rules, Examples, Notes
- [ ] Rules use MUST / MUST NOT (no "should" or "consider")
- [ ] At least one concrete example with input → output
- [ ] Notes section names at least one related skill
- [ ] File is 150–300 lines
- [ ] Slug is unique — not a duplicate of an existing skill

### Step 6 — Add to the collection

After writing the file:
1. Add the skill path to `.claude-plugin/plugin.json` under `"skills"`.
2. Add to the appropriate group in `.claude-plugin/marketplace.json`.
3. Add a row to the Skills table in `README.md`.
4. Update the skills count badge in the README header.
5. Run `node --test 'tests/**/*.test.js'` — template validator will catch missing sections.

## Rules

- MUST include all five body sections. A skill without Examples is not complete.
- MUST use MUST / MUST NOT in the Rules section — no soft language.
- MUST have explicit TRIGGER and SKIP conditions in the frontmatter description.
- MUST NOT duplicate an existing skill — check `skills/` before starting.
- MUST keep the file between 150 and 300 lines.
- MUST add the skill to both `plugin.json` and `marketplace.json` after writing it.

## Examples

**Writing a `rate-limiting` skill from scratch:**

```
Step 1 — Slug: rate-limiting  Label: Rate Limiting

Step 2 — Frontmatter description:
  "Applies rate limiting to API endpoints to prevent abuse...
  TRIGGER when: user adds a public API endpoint, asks about protecting routes,
  or reports abuse/DDoS concerns. SKIP: purely internal endpoints with no
  external callers (use security-review for general security)."

Step 3 — Behavior (excerpt):
  1. Identify the endpoint type: auth, public read, write, expensive operation.
  2. Select a limit appropriate to the type:
     - Auth endpoints: 5 req/min per IP
     - Public read: 60 req/min per IP
     - Write: 30 req/min per user
     - Expensive (LLM, export): 10 req/min per user
  3. Choose the implementation: Redis sliding window (preferred), token bucket,
     or in-memory (dev only).
  ...

Step 4 — Length check: 180 lines ✓

Step 5 — Quality checklist: all items checked ✓
```

## Notes

- The `skill-navigator` skill is the complement to this one: it helps *choose* which skill to use; this skill helps *create* new ones.
- For contributing hooks (not skills), see `CONTRIBUTING.md` — the quality bar is different.
- For CLAUDE.md templates, the format is entirely different — templates are project-specific markdown, not SKILL.md files.
