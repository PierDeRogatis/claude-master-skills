---
name: karpathy-guidelines
label: Karpathy Guidelines
description: |
  Behavioral coding guidelines to reduce common LLM mistakes: think before coding,
  simplicity first, surgical changes, goal-driven execution. TRIGGER when: starting
  any coding task, reviewing code for quality, or when the user wants disciplined
  engineering behavior. SKIP: user explicitly wants a quick hack or prototype with
  no quality requirements.
version: "1.0.0"
author: PierDeRogatis
tags: [guidelines, best-practices, coding, simplicity, discipline]
---

# Karpathy Guidelines

## Overview

Four principles derived from Andrej Karpathy's coding philosophy for LLMs. Applied together, they prevent the most common failure modes: premature coding, unnecessary complexity, scope creep, and losing track of the goal.

## 1. Think Before Coding

**Before writing a single line of implementation code:**

- State the problem in one sentence.
- Identify the constraints (performance, compatibility, scope).
- Know what "done" looks like — what is the acceptance criterion?
- Consider what already exists that can be reused.
- Estimate the simplest possible solution.

If you cannot state what "done" looks like, stop and ask. Ambiguous goals produce wrong solutions faster than slow ones.

**Anti-patterns:**
- Starting to code while still unclear on requirements.
- Writing infrastructure before proving the core logic works.
- Adding abstraction layers before the concrete case works.

## 2. Simplicity First

The simplest solution that correctly solves the problem is the right solution.

**Hierarchy of simplicity:**
1. Delete the code entirely (does this need to exist?)
2. Use a built-in / standard library function
3. Use an existing utility in the codebase
4. Write a new function
5. Write a new abstraction / pattern

Try each level before moving to the next.

**Rules:**
- Three similar lines is better than a premature abstraction.
- No helper functions for one-time operations.
- No configuration for things that will never vary.
- No error handling for scenarios that cannot happen.
- No generalization for a problem that only exists in one form.

**Anti-patterns:**
- Building a framework to solve a single case.
- Adding parameters for flexibility that is not needed yet.
- Wrapping a 2-line operation in a class "for future extensibility".

## 3. Surgical Changes

Make the smallest change that achieves the goal. Nothing more.

**Principles:**
- Change one thing at a time. Test it. Then change the next thing.
- A bug fix does not need surrounding cleanup.
- A feature addition does not need a pre-existing refactor.
- Do not fix unrelated issues you notice while working on something else — note them, address separately.
- A line of code you did not need to touch should not be touched.

**Anti-patterns:**
- "While I'm here" refactoring mixed into feature commits.
- Renaming variables that don't need renaming during a bug fix.
- Restructuring a file while fixing one function in it.
- Adding logging, metrics, or tracing to a feature PR.

## 4. Goal-Driven Execution

Every action must move toward the stated goal. Stop and recalibrate when it doesn't.

**At every step, ask:**
- Does this directly contribute to the goal?
- Is this the shortest path to completing the goal?
- Have I drifted into solving a different, more interesting problem?

**Stop and recalibrate when:**
- The implementation is growing beyond the original scope.
- A design decision requires revisiting the requirements.
- A dependency is missing or incompatible with the approach.
- The approach is not working after two attempts.

**Anti-patterns:**
- Solving an interesting sub-problem that is not on the critical path.
- Adding features that were not asked for because they seem useful.
- Continuing an approach that has failed twice without reconsidering the design.

## Rules

- MUST state the problem and acceptance criteria before coding.
- MUST attempt simpler solutions (built-in, existing utility) before writing new code.
- MUST NOT mix refactoring with feature changes in the same commit.
- MUST NOT add abstraction for a single use case.
- MUST stop and recalibrate if scope is growing beyond the original goal.
- MUST NOTE (but not fix) unrelated issues found during focused work.

## Examples

**Violation — premature abstraction:**
```typescript
// Requested: format a single date for display in the dashboard
// Wrong: built a full DateFormatter class with multiple strategies
class DateFormatter {
  constructor(private strategy: FormattingStrategy) {}
  format(date: Date, locale: string, options: Intl.DateTimeFormatOptions): string { ... }
}

// Right: one function for the one use case
function formatDashboardDate(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
```

**Violation — scope creep during bug fix:**
```
// Bug: tooltip not showing on hover
// Wrong: renamed all tooltip-related variables + extracted TooltipProvider
// Right: fix the CSS z-index that was clipping the tooltip
```

## Notes

- These guidelines apply to LLM-generated code, not just human code. Treat them as self-imposed constraints, not external rules.
- Related skills: `planning` (think before coding, formally), `tdd-workflow` (disciplined implementation), `verification` (confirm the goal was actually met).
