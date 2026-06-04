---
name: verification
label: Verification
description: |
  Verify that a change actually works before reporting it complete. Test the golden
  path AND edge cases in the real environment. TRIGGER when: completing a feature,
  fixing a bug, or before reporting a task as done. SKIP: trivial typo/comment
  changes with no behavior impact.
version: "1.0.0"
author: PierDeRogatis
tags: [verification, testing, qa, completeness]
---

# Verification

## Overview

A task is not complete when the code is written — it is complete when the behavior is confirmed in the real environment. This skill enforces a verification checklist before any "done" declaration.

## Behavior

1. **Run the automated test suite**
   - `pnpm test` or equivalent.
   - All tests must pass. No skipped tests that cover the changed behavior.
   - TypeScript: `pnpm tsc --noEmit` must pass with zero errors.
   - Linting: `pnpm lint` must pass.

2. **Test the golden path in the real environment**
   - The golden path is the primary happy-path user flow for the changed feature.
   - Run it end-to-end: real browser, real API calls, real database.
   - Not a unit test — the actual running application.

3. **Test at least 2 edge cases**
   - Empty input, null/undefined, boundary values.
   - Error states: what happens when the API returns 500? When the user is not authenticated?
   - Mobile viewport if UI was changed.

4. **Check for regressions**
   - Identify which existing features share code paths with the change.
   - Manually exercise the top 1–2 existing flows that could be affected.

5. **Confirm the original acceptance criterion is met**
   - Re-read the original task description or user request.
   - Does the delivered behavior match exactly what was asked? Not more, not less.

6. **Report with evidence**
   - Do not report "done" — report what was tested and what the outcome was.
   - Format: "Tested: [golden path]. Edge cases: [list]. Regressions: [none / what was checked]."

## Rules

- MUST run the test suite before reporting complete.
- MUST test the golden path in the real running environment (not just unit tests).
- MUST test at least 2 edge cases.
- MUST re-read the original request and confirm it was fully addressed.
- MUST NOT report complete based on code inspection alone.
- MUST NOT skip verification because "it's a small change."
- MUST surface any issue found during verification before reporting done.

## Verification Report Template

```
## Verification

**Test suite:** ✓ 47/47 passing, 0 skipped
**Type check:** ✓ tsc --noEmit clean
**Linting:** ✓ 0 errors

**Golden path:** [Describe what was exercised and the result]
- Step 1 → Expected ✓
- Step 2 → Expected ✓

**Edge cases:**
- [Case 1] → [Result] ✓/✗
- [Case 2] → [Result] ✓/✗

**Regressions checked:**
- [Existing flow 1] → unaffected ✓
- [Existing flow 2] → unaffected ✓

**Acceptance criterion:** [Original request restated] → ✓ met
```

## Examples

**Feature: "Add a character counter to the bio input field"**

```
Verification:
- Test suite: ✓ 23/23 passing
- Type check: ✓ clean
- Golden path: Typed 150 chars → counter shows "150/200". Typed 200 chars → counter red, 
  submit disabled. Cleared field → counter resets to "0/200". ✓
- Edge cases:
  - Paste 300 chars → trimmed to 200, counter shows 200/200 ✓
  - Empty submit → validation error shown, counter at 0/200 ✓
- Regressions: profile save flow unaffected ✓
- Acceptance criterion: character counter on bio input → ✓ met
```

## Notes

- "The tests pass" is necessary but not sufficient. Unit tests verify code logic; verification confirms user-visible behavior.
- If the real environment is not accessible (CI-only, no local setup), explicitly state that and describe what was tested instead.
- Related skills: `tdd-workflow` (write tests during development), `code-review` (review before verification), `systematic-debugging` (if verification reveals a bug).
