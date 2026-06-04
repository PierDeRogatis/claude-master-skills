## Summary
<!-- 2-4 bullet points: what changed and why -->
-
-

## Type of change
<!-- Check all that apply -->
- [ ] New skill
- [ ] New hook
- [ ] New CLAUDE.md template
- [ ] New agent (YAML)
- [ ] Bug fix
- [ ] Test addition / improvement
- [ ] Documentation / README update

## Test evidence
<!-- For hooks: show the stdin/stdout you verified -->
<!-- For templates: confirm all required sections are present -->
<!-- For installer: confirm detectProjectType() returns the right value -->

```bash
# Example for a hook:
echo '{"tool":"Bash","input":{"command":"..."}}' | node hooks/<name>.js
# Output:
```

```
node --test 'tests/**/*.test.js'
# tests N
# pass N
# fail 0
```

## Quality checklist

**Skill (if applicable):**
- [ ] TRIGGER / SKIP conditions in frontmatter description
- [ ] Rules expressed as MUST / MUST NOT
- [ ] At least one concrete example
- [ ] Notes section with related skills

**Hook (if applicable):**
- [ ] Exits 0 always
- [ ] Handles malformed stdin silently
- [ ] Read-only (does not modify project files)
- [ ] Test added in `tests/hooks/<name>.test.js`
- [ ] Entry added to `hooks/hooks.json`

**Template (if applicable):**
- [ ] All 5 required sections present
- [ ] `[PROJECT_NAME]` placeholder present
- [ ] No pinned patch-version numbers

**General:**
- [ ] README.md updated
- [ ] No `Co-Authored-By: Claude` footer
- [ ] All 112+ existing tests still pass
