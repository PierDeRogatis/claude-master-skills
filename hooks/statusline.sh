#!/usr/bin/env bash
# PostToolUse hook — writes active-skills info to ~/.claude_statusline
# Source this in your .zshrc/.bashrc PROMPT_COMMAND to display in terminal:
#   PROMPT_COMMAND='cat ~/.claude_statusline 2>/dev/null; echo'
# Or add to PS1: PS1='$(cat ~/.claude_statusline 2>/dev/null) \$ '

STATUSLINE_FILE="${HOME}/.claude_statusline"
SETTINGS_FILE="${CLAUDE_PROJECT_DIR:-$(pwd)}/.claude/settings.json"

# Read enabled skills from settings.json if it exists
skills=""
if [ -f "$SETTINGS_FILE" ]; then
  skills=$(node -e "
    try {
      const s = JSON.parse(require('fs').readFileSync('$SETTINGS_FILE','utf8'));
      const names = (s.skills || []).map(sk => sk.name || sk).join(',');
      process.stdout.write(names);
    } catch { process.stdout.write(''); }
  " 2>/dev/null)
fi

if [ -n "$skills" ]; then
  printf "[cms:%s]" "$skills" > "$STATUSLINE_FILE"
else
  printf "[cms]" > "$STATUSLINE_FILE"
fi

exit 0
