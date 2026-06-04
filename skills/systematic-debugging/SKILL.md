---
name: systematic-debugging
label: Systematic Debugging
description: |
  Structured debugging process: isolate, reproduce, hypothesize, verify, fix.
  TRIGGER when: user reports a bug, unexpected behavior, error message, test failure,
  or says "this doesn't work". SKIP: user is asking a how-to question with no bug present.
version: "1.0.0"
author: PierDeRogatis
tags: [debugging, troubleshooting, workflow]
---

# Systematic Debugging

## Overview

Bugs are found faster by narrowing the problem space than by random trial-and-error. This skill enforces a disciplined five-step process: isolate the boundary, reproduce reliably, form a hypothesis, verify it, then fix and confirm.

## Behavior

1. **Gather the full error context**
   - Exact error message (copy verbatim, do not paraphrase).
   - Stack trace: first frame pointing to user code is the primary suspect.
   - When it started: last known-good state, recent changes.
   - Environment: OS, Node version, browser, env vars that differ from dev/prod.

2. **Reproduce the bug deterministically**
   - Write the smallest possible reproducer: a unit test, a `curl` command, or a minimal script.
   - If you cannot reproduce it, you cannot fix it. Do not proceed until reproduction is confirmed.
   - Note: "intermittent" bugs are usually race conditions or missing awaits — check async paths first.

3. **Isolate the boundary**
   - Identify the last point in the call stack where data is known-good.
   - Identify the first point where it is known-bad.
   - The bug lives between those two points. Narrow further with binary search (comment out halves, add log points).

4. **Form a hypothesis**
   - State one specific cause: "I believe the bug is X because Y."
   - Derive a prediction: "If X is the cause, then adding log Z will show W."

5. **Verify the hypothesis**
   - Test the prediction. If confirmed, proceed to fix. If not, discard the hypothesis and form a new one.
   - Do not fix until the hypothesis is confirmed — patches without understanding create new bugs.

6. **Fix and confirm**
   - Make the minimal change that addresses the root cause.
   - Re-run the reproducer. Confirm it passes.
   - Run the full test suite. Confirm no regressions.
   - Commit: `fix: <root cause description>` with a note in the body explaining the hypothesis.

## Rules

- MUST reproduce the bug before proposing a fix.
- MUST state the hypothesis explicitly before attempting a fix.
- MUST verify the hypothesis before committing the fix.
- MUST run the full test suite after fixing, not just the reproducer.
- MUST NOT add logging to production code as a debugging mechanism — use test assertions instead.
- MUST NOT make multiple changes simultaneously when debugging — change one variable at a time.
- MUST check async error handling first for any "intermittent" or "sometimes fails" bug.

## Examples

**Bug: "API returns 500 on POST /users but only in production"**

```
Step 1 — Gather:
  Error: "Cannot read properties of undefined (reading 'id')"
  Stack: user.service.ts:87 → auth.middleware.ts:23
  Recent change: deployed env var rename NEXT_PUBLIC_API_URL → API_BASE_URL

Step 2 — Reproduce:
  curl -X POST http://localhost:3000/api/users -H "Authorization: Bearer test-token" -d '{"email":"x@x.com"}'
  → 500 reproduced locally when AUTH_SECRET is undefined

Step 3 — Isolate:
  auth.middleware.ts:23 reads process.env.AUTH_SECRET
  .env.local has it; .env.production does not

Step 4 — Hypothesis:
  AUTH_SECRET is not set in the production environment after the rename.

Step 5 — Verify:
  Add console.log(!!process.env.AUTH_SECRET) → false in prod build

Step 6 — Fix:
  Add AUTH_SECRET to Vercel environment variables.
  Re-run curl → 201 Created.
  Commit: "fix: add AUTH_SECRET to production env (missing after var rename)"
```

## Notes

- "It works on my machine" almost always means an environment difference — compare env vars, Node versions, and installed packages between environments.
- For React bugs, use React DevTools Profiler to confirm the component tree and prop values at the time of the error.
- Related skills: `verification` (confirm fix works end-to-end), `tdd-workflow` (write a regression test after fixing).
