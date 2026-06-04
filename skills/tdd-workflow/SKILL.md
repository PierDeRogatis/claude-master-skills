---
name: tdd-workflow
label: TDD Workflow
description: |
  Test-driven development with RED-GREEN-REFACTOR cycle and git checkpoint commits.
  TRIGGER when: user asks to write tests first, mentions TDD or red-green-refactor,
  starts a new feature, or says "write a failing test". SKIP: user only wants to run
  existing tests or review test coverage without adding new behavior.
version: "1.0.0"
author: PierDeRogatis
tags: [tdd, testing, workflow, git]
---

# TDD Workflow

## Overview

Enforce a strict RED → GREEN → REFACTOR cycle. Each cycle ends with a git checkpoint commit before moving to the next. Commits are never squashed — they form an auditable trail of the design emerging through tests.

## Behavior

1. **Clarify the target behavior** before writing any test. Ask: what is the smallest unit of behavior to add? Write it as a user-story sentence: "Given X, when Y, then Z."

2. **Write the failing test (RED)**
   - Write one test that captures the stated behavior.
   - Run the test suite. Confirm it fails for the right reason — a missing implementation, not a syntax error or wrong import.
   - If it fails for the wrong reason, fix the test before continuing.

3. **Write the minimum implementation to pass (GREEN)**
   - Write only enough code to make the failing test pass.
   - Do not refactor. Do not add features. Do not fix unrelated issues.
   - Run the full test suite. Confirm only the new test is affected.

4. **Commit the GREEN state**
   - Stage: `git add -p` (selective staging, not `git add .`)
   - Commit message format: `test: <behavior description>` for the test file, then a separate `feat: <minimal impl>` for the implementation.
   - Do NOT squash these two commits. They are the checkpoint.

5. **Refactor (REFACTOR)**
   - Clean up duplication, rename for clarity, simplify logic.
   - Tests must stay GREEN throughout. Run after every significant change.
   - Refactoring commits use `refactor: <what changed>`.

6. **Repeat** for the next unit of behavior.

## Rules

- MUST write the test before the implementation. No exceptions.
- MUST confirm test is RED before writing implementation code.
- MUST commit after GREEN before starting REFACTOR.
- MUST NOT squash the test + implementation commits.
- MUST NOT add more than one unit of behavior per cycle.
- MUST use `git add -p` (or equivalent selective staging) — never `git add .` blindly.
- MUST run the full suite at RED and GREEN, not just the new test.
- MUST NOT fix unrelated failing tests during a TDD cycle — note them, continue.

## Examples

**Cycle for a `formatCurrency(amount, locale)` function:**

```
RED:
  test('formats USD with $ symbol', () => {
    expect(formatCurrency(1234.5, 'en-US')).toBe('$1,234.50');
  });
  → Run: FAIL (formatCurrency is not defined)

GREEN:
  export function formatCurrency(amount: number, locale: string): string {
    return new Intl.NumberFormat(locale, { style: 'currency', currency: 'USD' }).format(amount);
  }
  → Run: PASS

COMMIT:
  git add src/utils/currency.test.ts
  git commit -m "test: formatCurrency returns locale-formatted USD string"
  git add src/utils/currency.ts
  git commit -m "feat: implement formatCurrency with Intl.NumberFormat"

REFACTOR:
  Extract currency code detection, add type guard for locale.
  → Run: PASS
  git commit -m "refactor: extract currency code from locale in formatCurrency"
```

## Notes

- TypeScript compile errors count as RED — fix the type error first, then confirm the test logic fails.
- For React components, prefer testing behavior (what the user sees/does) over implementation details (internal state).
- If a test is hard to write, that is a design signal — the unit is too large or the interface is wrong. Pause and redesign.
- Related skills: `verification` (run after all cycles complete), `code-review` (after a full feature is done).
