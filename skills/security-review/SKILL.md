---
name: security-review
label: Security Review
description: |
  OWASP Top 10 checklist plus prompt-injection defense for AI-adjacent code.
  TRIGGER when: user asks for a security review, adds authentication, handles user
  input, exposes a new API endpoint, or deploys to production. SKIP: pure UI changes
  with no data handling or auth logic.
version: "1.0.0"
author: PierDeRogatis
tags: [security, owasp, auth, injection, review]
---

# Security Review

## Overview

Two-part review: (1) OWASP Top 10 checklist for standard web vulnerabilities, (2) Prompt Defense Baseline for code that passes user input to LLMs. Run both whenever an LLM feature is present.

## Behavior

### Part 1 — OWASP Top 10 Checklist

Check each category. Mark `✓ OK`, `⚠ Risk`, or `✗ Fail`.

1. **Broken Access Control**
   - Every protected route checks authentication AND authorization.
   - No direct object reference without ownership check (e.g., `GET /users/:id` verifies the requester owns that ID).
   - Sensitive actions require re-authentication or CSRF tokens.

2. **Cryptographic Failures**
   - Passwords hashed with bcrypt/argon2 (min cost 12). Never MD5/SHA1 for passwords.
   - TLS enforced everywhere; no HTTP fallback in production.
   - Secrets in environment variables, never in source code or logs.
   - Database connections encrypted; PII fields encrypted at rest where required.

3. **Injection**
   - All DB queries use parameterized queries or ORM — no string concatenation.
   - Shell commands use `execFile` (array args) not `exec` (string) when user input is involved.
   - HTML output escaped (React does this by default; flag any `dangerouslySetInnerHTML`).

4. **Insecure Design**
   - Rate limiting on auth endpoints and expensive operations.
   - Account enumeration not possible via login/reset error messages.
   - File uploads: server-side MIME validation, size limits, stored outside webroot.

5. **Security Misconfiguration**
   - `DEBUG=false` / `NODE_ENV=production` in production.
   - Default credentials removed.
   - Error responses do not leak stack traces or internal paths.
   - CORS: explicit allowlist, never `*` for credentialed requests.
   - Security headers: `X-Frame-Options`, `X-Content-Type-Options`, `Strict-Transport-Security`, `Content-Security-Policy`.

6. **Vulnerable & Outdated Components**
   - `pnpm audit` / `npm audit` clean (zero high/critical).
   - Dependencies pinned to exact versions in production deployments.

7. **Identification & Authentication Failures**
   - Session tokens: minimum 128-bit entropy, HttpOnly, Secure, SameSite=Strict.
   - JWT: `alg` not `none`; validate `exp`; use short-lived tokens + refresh.
   - Password reset: time-limited (15 min), single-use, invalidated after use.

8. **Software & Data Integrity Failures**
   - CI/CD pipeline does not run on unreviewed code.
   - Dependencies from trusted registries; lock files committed.
   - Deserialization: never deserialize user-supplied class instances.

9. **Logging & Monitoring Failures**
   - Auth events logged: login success/fail, password changes, permission changes.
   - Logs do NOT include passwords, tokens, PII, or full request bodies.
   - Alerts configured for repeated auth failures.

10. **Server-Side Request Forgery (SSRF)**
    - Any feature that fetches a URL provided by the user validates against an allowlist.
    - Block internal IP ranges (10.x, 172.16.x, 192.168.x, 169.254.x, ::1).

### Part 2 — Prompt Defense Baseline (LLM-adjacent code)

For any code that passes user input to an LLM:

- **Input sanitization**: strip or escape prompt-injection markers before including in system prompt (`Ignore previous instructions`, role-play injections, `<|endoftext|>` tokens).
- **Least-privilege context**: only include data the LLM needs — not entire database rows, not env vars.
- **Output validation**: LLM output treated as untrusted input; validate structure before using downstream.
- **No code execution from LLM output** without explicit sandboxing and user confirmation.
- **Audit log**: log user prompt (sanitized), model, and output for each LLM call in production.

## Rules

- MUST run both Part 1 and Part 2 whenever an LLM feature is present.
- MUST mark every OWASP category with a status (✓/⚠/✗).
- MUST flag `critical` for: SQL injection, missing auth check, hardcoded secret, SSRF.
- MUST NOT approve code with `dangerouslySetInnerHTML` receiving user input.
- MUST NOT approve `exec(userInput)` or equivalent in any language.
- MUST escalate to human review for: payment flows, PII handling, auth system changes.

## Output Format

```
## Security Review — <filename or PR title>

### OWASP Top 10
| # | Category | Status | Finding |
|---|----------|--------|---------|
| 1 | Broken Access Control | ✓ OK | — |
| 3 | Injection | ✗ Fail | SQL concat at db/users.ts:42 |
...

### Prompt Defense (if applicable)
- ✓ Input sanitized
- ⚠ Output used without validation at ai/summarize.ts:88

### Summary
N critical, M major, P minor findings.
```

## Notes

- Run `pnpm audit` before completing any security review.
- Related skills: `code-review` (general quality), `verification` (confirm fixes work).
