---
name: planning
label: Planning
description: |
  Design-before-code planning with a HARD GATE: no implementation until the design is
  agreed. TRIGGER when: user asks to build a new feature, start a new project, says
  "how should I approach", or "let's architect". SKIP: user has an agreed design and
  is asking to implement a specific, bounded change.
version: "1.0.0"
author: PierDeRogatis
tags: [planning, architecture, design, workflow]
---

# Planning

## Overview

Code written without a plan is usually rewritten. This skill enforces a design-first gate: explore, clarify, propose, get agreement — then and only then write code. The output is a written design doc (even if brief) that the user has approved.

---

**HARD GATE: Do not write implementation code until the user has explicitly approved the design. If the user asks to skip straight to code, acknowledge the request but explain that a 5-minute design pass will save time overall. Propose a minimal design and ask for approval.**

---

## Behavior

1. **Understand the context**
   - Read the relevant existing code. Identify what already exists that can be reused.
   - Ask: What problem does this solve? Who uses it? What does success look like?
   - Identify constraints: performance requirements, API compatibility, deployment target.

2. **Ask clarifying questions** (max 3, prioritize the most impactful)
   - What is the expected scale / load?
   - Are there existing patterns in this codebase we should follow?
   - Are there hard deadlines or "must not break" guarantees?

3. **Propose 2–3 approaches** (brief, not full specs)
   - Each approach: one paragraph, key trade-off, recommendation.
   - Recommend one. Explain why.

4. **Write the design doc** (after user selects approach)
   - Format: Context → Decision → Implementation Steps → Open Questions
   - Length: 1–3 pages. No filler.
   - List files to be created/modified.
   - Identify risks and mitigations.

5. **Get explicit approval** before writing any implementation code.
   - "Is this design correct? Shall I proceed?"

6. **Implement** following the agreed design. Reference the doc in commit messages.

## Rules

- MUST ask clarifying questions before proposing approaches.
- MUST write a design doc before implementation, even for small features.
- MUST get explicit user approval on the design before coding.
- MUST NOT start coding while questions are still open.
- MUST NOT add scope beyond what the design doc describes.
- MUST surface reuse opportunities — if something already exists, say so.
- MUST keep the design doc as the source of truth; update it if the design changes during implementation.

## Design Doc Template

```markdown
## Context
[What problem this solves and why it's being solved now]

## Decision
[The chosen approach and why it was selected over alternatives]

## Implementation Steps
1. [Step]
2. [Step]

## Files
- `src/...` — [what changes]

## Open Questions
- [ ] [Question that needs resolution]

## Risks
- [Risk] → [Mitigation]
```

## Examples

**"Let's add real-time notifications to the dashboard"**

```
Step 1 — Context:
  Existing: REST API, Next.js App Router, Supabase.
  Reuse available: Supabase Realtime is already configured for auth.

Step 2 — Clarifying questions:
  1. Notifications for which events? (PR merged, deploy failed, both?)
  2. Should they persist after page reload?
  3. Target: web only, or also mobile push?

Step 3 — Approaches:
  A. Supabase Realtime — uses existing infra, no new dependencies. Best for ≤10k concurrent users.
  B. Server-Sent Events + Redis — more control, requires Redis setup. Overkill for current scale.
  C. Polling — simple, zero infra cost, but 30s latency minimum.
  Recommendation: A. Supabase Realtime. Reuses existing subscription, fastest to ship.

Step 4 — Design doc written, user approves.

Step 5 → Begin implementation.
```

## Notes

- For spikes/explorations, a design doc can be a 5-bullet list. The format scales down, not the habit.
- Related skills: `tdd-workflow` (once design is approved, use TDD for implementation), `verification` (test the implemented design end-to-end).
