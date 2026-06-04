---
name: code-review
label: Code Review
description: |
  Multi-dimension code review: correctness, security, performance, style, and test coverage.
  TRIGGER when: user asks to review code, opens a PR, says "LGTM check", or asks "is this correct".
  SKIP: user only wants syntax formatting or linting (use the linter directly).
version: "1.0.0"
author: PierDeRogatis
tags: [code-review, quality, security, performance]
---

# Code Review

## Overview

Review code across five dimensions in a fixed order. Each dimension is independent — findings in one do not block reporting in others. Output is a structured list of findings, each with severity and a concrete fix suggestion.

## Behavior

1. **Read the full diff or file set** before commenting on anything. Form a complete picture first.

2. **Dimension 1 — Correctness**
   - Logic errors, off-by-one, null/undefined handling, wrong assumptions about data shape.
   - Type mismatches in TypeScript (check `.ts` strict mode violations).
   - Async/await errors: missing await, unhandled rejections, race conditions.

3. **Dimension 2 — Security**
   - Input validation at system boundaries (user input, external APIs, env vars).
   - SQL/command injection, XSS, path traversal.
   - Secrets/tokens in code or logs.
   - Overly permissive CORS, missing auth checks, insecure headers.
   - See `security-review` skill for the full OWASP checklist.

4. **Dimension 3 — Performance**
   - N+1 queries or fetch loops inside render/request handlers.
   - Missing memoization where recomputation is expensive.
   - Unnecessary re-renders in React (missing `useMemo`/`useCallback`/`React.memo`).
   - Large synchronous operations blocking the event loop.

5. **Dimension 4 — Style & Maintainability**
   - Naming: variables, functions, components should express intent.
   - Duplication that should be extracted.
   - Functions/components doing more than one thing (SRP).
   - Dead code, unused imports, commented-out blocks.

6. **Dimension 5 — Test Coverage**
   - New behavior without tests.
   - Tests that only test happy path, missing edge cases and error paths.
   - Tests coupled to implementation details rather than behavior.

7. **Format findings** as:

```
## [Dimension]: [File:Line] — [Severity]
**Issue:** What is wrong.
**Fix:** Concrete suggestion or code snippet.
```

Severity levels: `critical` (must fix before merge), `major` (should fix), `minor` (nice to fix), `nit` (optional).

8. **End with a summary line**: `N critical, M major, P minor findings.`

## Rules

- MUST cover all five dimensions for every review. Do not skip dimensions.
- MUST include file and approximate line number for every finding.
- MUST suggest a concrete fix, not just describe the problem.
- MUST NOT flag style preferences as `critical` or `major`.
- MUST NOT rewrite the entire function — suggest targeted changes.
- MUST call out security findings first in the output regardless of discovery order.
- MUST NOT approve code with unhandled user input at system boundaries.

## Examples

```
## Security: src/api/upload.ts:42 — critical
**Issue:** File extension is checked client-side only; server accepts any MIME type.
**Fix:** Add server-side MIME validation: `if (!ALLOWED_TYPES.includes(file.mimetype)) throw new BadRequestError()`.

## Correctness: src/utils/paginate.ts:18 — major
**Issue:** `Math.ceil(total / pageSize)` returns Infinity when pageSize is 0.
**Fix:** Guard: `if (pageSize <= 0) throw new RangeError('pageSize must be positive')`.

## Performance: src/components/UserList.tsx:55 — major
**Issue:** `getUser(id)` called inside map on every render; no memoization.
**Fix:** Move fetch outside render or wrap in `useMemo(() => items.map(getUser), [items])`.
```

## Notes

- For large PRs (>500 lines), split review into logical chunks: API layer first, then business logic, then UI.
- Security dimension always uses the `security-review` skill's OWASP checklist as a sub-reference.
- Related skills: `security-review` (deep security pass), `verification` (confirm fixes work end-to-end).
