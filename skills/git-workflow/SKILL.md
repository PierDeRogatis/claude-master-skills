---
name: git-workflow
label: Git Workflow
description: |
  Branch, commit, and PR conventions for clean git history and safe collaboration.
  TRIGGER when: user asks to create a branch, commit changes, open a PR, or needs
  git advice. SKIP: user is resolving a complex merge conflict (handle ad-hoc) or
  doing a git bisect (too interactive for a scripted workflow).
version: "1.0.0"
author: PierDeRogatis
tags: [git, workflow, pr, commits, branches]
---

# Git Workflow

## Overview

Standardized git conventions: branch naming, commit format, PR creation, and safety rules. Consistent history makes reviews easier and reverts safer.

## Behavior

### Branch Naming

```
<type>/<short-description>
```

Types: `feat`, `fix`, `chore`, `docs`, `refactor`, `test`, `ci`

Examples:
- `feat/user-notifications`
- `fix/auth-token-expiry`
- `chore/upgrade-next-14`

### Commit Format (Conventional Commits)

```
<type>(<scope>): <subject>

[optional body — explain WHY, not WHAT]
[optional footer — BREAKING CHANGE: ..., Closes #123]
```

- Subject: imperative mood, ≤50 chars, no trailing period.
- Body: only when the why is non-obvious. No "This commit does X" phrasing.
- Scope: the module or area affected (`auth`, `api`, `ui`, `db`).
- Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `ci`, `perf`.

**BREAKING CHANGE** in footer if commit breaks public API.

Examples:
```
feat(auth): add JWT refresh token rotation
fix(api): handle null user in session middleware
chore: upgrade Next.js to 14.2.0
```

### Staging

- Use `git add -p` for selective staging — review each hunk before staging.
- Never `git add .` or `git add -A` without first running `git diff` to confirm contents.
- Do NOT commit: `.env` files, `node_modules/`, `dist/`, debug logs, `*.local` files.

### PR Creation

1. Push branch: `git push -u origin <branch>`
2. Create PR with `gh pr create --draft` — always draft first.
3. PR title = first commit subject of the branch, or a summary.
4. PR body must include:
   - **Summary**: 2–4 bullets of what changed and why.
   - **Test plan**: how to verify the change works.
   - No `Co-Authored-By: Claude` footers.
   - No "Generated with Claude Code" text.
5. Do NOT mark PR ready for review — that decision belongs to the human.
6. For LLM-authored PRs on Next.js repos: include `<!-- NEXT_JS_LLM_PR -->` in body.

### Safety Rules

- NEVER `git push --force` to `main` or `master`.
- NEVER `git reset --hard` without confirming with the user first.
- NEVER `git clean -f` without `--dry-run` check first.
- NEVER skip hooks with `--no-verify`.
- NEVER amend a commit that has been pushed to a shared branch.
- If a pre-commit hook fails: fix the underlying issue, re-stage, new commit — do NOT bypass.

### Merge Strategy

- Prefer squash merge for feature branches with noisy WIP commits.
- Prefer merge commit for branches with a clean, intentional commit history.
- Rebase only on local branches that have not been pushed.

## Rules

- MUST use Conventional Commits format.
- MUST use selective staging (`git add -p`), not bulk staging.
- MUST create PRs as draft.
- MUST NOT add AI attribution to commits or PRs.
- MUST NOT force-push to main/master.
- MUST NOT skip pre-commit hooks.
- MUST confirm with user before any destructive git operation.

## Examples

**Full feature commit sequence:**
```bash
git checkout -b feat/user-notifications
# ... make changes ...
git add -p
git commit -m "feat(notifications): add real-time bell via Supabase Realtime"
git push -u origin feat/user-notifications
gh pr create --draft --title "feat(notifications): add real-time bell" \
  --body "## Summary
- Add NotificationBell component (Server → Client handoff)
- Subscribe to Supabase channel on mount, unsubscribe on unmount
- Badge count resets on panel open

## Test plan
- [ ] Bell appears in nav
- [ ] Badge increments on new event
- [ ] Badge clears on open"
```

## Notes

- Conventional Commits reference: https://www.conventionalcommits.org
- Related skills: `nextjs-patterns` (PR conventions specific to Next.js), `tdd-workflow` (commit discipline during TDD cycles).
