---
name: Bug report
about: Report a problem with a hook, skill, template, or installer
title: "bug: <short description>"
labels: bug
assignees: ''
---

## Which file has the bug?
<!-- e.g. `hooks/secret-scanner.js`, `skills/tdd-workflow/SKILL.md`, `bin/install.js` -->

## Node.js version
<!-- `node --version` -->

## Expected behavior
<!-- What should happen? -->

## Actual behavior
<!-- What actually happens? Include exact output or error messages. -->

## Steps to reproduce
<!-- Minimal steps to trigger the bug -->

```bash
# Example: reproduce the hook bug
echo '{"tool":"Bash","input":{"command":"git commit -m test"}}' | node hooks/secret-scanner.js
```

## Additional context
<!-- OS, shell, any relevant environment details -->
