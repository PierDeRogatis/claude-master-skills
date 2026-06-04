---
name: skill-navigator
label: Skill Navigator
description: |
  Meta-skill: recommends which skill(s) to use based on the current task description.
  TRIGGER when: user says "what skill should I use", "where do I start", describes
  a new task without invoking a skill, or asks "how should I approach this". SKIP:
  user has already invoked a specific skill; task is a simple one-liner with an
  obvious answer.
version: "1.0.0"
author: PierDeRogatis
tags: [meta, navigation, skills, onboarding]
---

# Skill Navigator

## Overview

Decision tree for choosing which skill applies to a given task. Use this when you're not sure which skill to reach for, or when a user starts describing work without specifying an approach.

## Behavior

1. **Read the task description.** Identify the primary activity: building, reviewing, fixing, designing, or deploying.
2. **Match to the decision tree below.** Recommend the primary skill + any supporting skills.
3. **State the recommendation in one line**: `"For [task], use /[skill] → then /[skill]."
4. **Invoke the recommended skill immediately** if the user's intent is clear. Do not wait for confirmation if the match is unambiguous.

## Decision Tree

### Building a new feature
→ `/planning` (design gate first)  
→ `/tdd-workflow` (implement)  
→ `/verification` (confirm before done)

### Bug / broken behavior / error
→ `/systematic-debugging`  
→ `/verification` (after fix)

### Code review / "is this correct" / PR review
→ `/code-review`  
→ `/security-review` (if auth, API endpoints, or user input changed)

### Security concern / auth / user input / deployment
→ `/security-review`

### Git work: branch, commit, PR, push
→ `/git-workflow`  
→ `/nextjs-patterns` (if working in a Next.js project)

### UI / component / CSS / design / styling
→ `/ui-ux-design`

### Tests / TDD / "write tests first"
→ `/tdd-workflow`

### Claude API / Anthropic SDK / prompt caching / tool use
→ `/claude-api`

### Refactor / clean up / extract / simplify
→ `/karpathy-guidelines` (scope check first)  
→ `/code-review` (after, to confirm no regressions)

### Architecture decision / system design / "how should we structure"
→ `/planning`

### Confirming a task is done
→ `/verification`

### Output is too verbose / want terse responses
→ `/caveman-communication`

### "I don't know where to start"
→ `/planning`

## Quick Reference Table

| Task type | Primary skill | Supporting skill |
|-----------|--------------|-----------------|
| New feature | `planning` | `tdd-workflow`, `verification` |
| Bug fix | `systematic-debugging` | `verification` |
| PR review | `code-review` | `security-review` |
| Security | `security-review` | — |
| Git / PR | `git-workflow` | `nextjs-patterns` |
| UI / CSS | `ui-ux-design` | — |
| Testing | `tdd-workflow` | `verification` |
| Claude API | `claude-api` | `security-review` |
| Refactor | `karpathy-guidelines` | `code-review` |
| Architecture | `planning` | — |
| Verify done | `verification` | — |
| Terse output | `caveman-communication` | — |

## Rules

- MUST recommend at least one skill.
- MUST invoke the skill immediately when the task is unambiguous.
- MUST NOT recommend more than 2 skills at once — if more apply, lead with the most important.
- MUST surface the `planning` skill for any "I don't know where to start" situation.
- MUST NOT use this skill to delay action — it exists to speed up skill selection, not add a step.

## Notes

- All available skills are in `skills/` — browse them directly for the full list.
- If no skill fits the task exactly, start with `planning` to define the approach first.
- Related: this skill is the only meta-skill in the collection. All others are task-specific.
