# CLAUDE.md — React Native (Expo)

## Project

[PROJECT_NAME] — [one-sentence description]

**Stack:** React Native · Expo SDK 51+ · TypeScript · Expo Router · EAS Build · pnpm (or bun)

---

## Commands

```bash
npx expo start                    # Start Metro bundler (choose iOS/Android/Web)
npx expo start --ios              # Open iOS Simulator directly
npx expo start --android          # Open Android Emulator directly
npx expo run:ios                  # Build and run native iOS (requires Xcode)
npx expo run:android              # Build and run native Android (requires Android Studio)
eas build --profile development   # Build development client (EAS)
eas build --profile preview       # Preview APK/IPA (EAS)
eas submit                        # Submit to App Store / Play Store
pnpm test                         # Run Jest test suite
pnpm tsc --noEmit                 # Type check
```

---

## Architecture

```
app/                    # Expo Router — file-based navigation (DO NOT use react-navigation directly)
  (tabs)/               # Tab navigator group
    index.tsx           # Home tab
    profile.tsx         # Profile tab
  _layout.tsx           # Root layout (Stack or Tabs)
  +not-found.tsx        # 404 screen
components/             # Shared React Native components
  ui/                   # Primitive UI (Button, Text, Input)
hooks/                  # Custom hooks
lib/                    # Utilities, API clients, constants
assets/                 # Images, fonts (static assets)
constants/
  Colors.ts             # Platform-aware color tokens
app.json                # Expo app config
eas.json                # EAS Build profiles
```

---

## Development Rules

### Navigation
- **Always use Expo Router** (file-based) — do not add `react-navigation` directly.
- Navigation types: use `expo-router`'s typed routes (`router.push`, `Link` component).
- Deep linking configured in `app.json` under `scheme`.

### Platform differences
- Use `Platform.select({ ios: ..., android: ..., default: ... })` for platform-specific values.
- Use `Platform.OS === 'ios'` guards sparingly — prefer cross-platform solutions.
- **Never** use web-only APIs (`localStorage`, `window`, `document`) without a Platform guard.
- Safe area: wrap root layout with `<SafeAreaProvider>` from `react-native-safe-area-context`.

### Styling
- Use `StyleSheet.create()` for performance — avoid inline style objects in render.
- No web CSS classes. No Tailwind without `nativewind` configured.
- Platform-aware colors via `Colors.ts` constants, not hardcoded hex.

### Icons
- Use `@expo/vector-icons` — do not import raw SVGs directly.
- `Ionicons`, `MaterialIcons`, `FontAwesome` all available via the same package.

### Images
- Use `<Image>` from `expo-image` (not React Native's built-in) for better caching/perf.
- Local assets registered in `app.json` under `assets` field.
- Remote images: always set explicit `width` and `height`.

### Native modules
- Adding a native module (non-Expo-Go compatible): run `npx expo prebuild` and use a development build.
- Check Expo SDK compatibility before adding any package: `npx expo install <pkg>` (not `pnpm add`) — it installs the compatible version.

### Testing
- Unit tests: Jest + `@testing-library/react-native`.
- Snapshot tests for UI components: update with `-u` only when the change is intentional.
- E2E: Maestro or Detox (configure separately per project).

---

## Git & PR Conventions

- Branch names: `feat/<slug>`, `fix/<slug>`, `chore/<slug>`
- Commits: Conventional Commits, imperative mood, ≤50 chars.
- PRs: always **draft** first.
- **No** `Co-Authored-By: Claude` footers.
- **Never** force-push to `main`.
- EAS build profiles committed — secrets in EAS environment variables, not in `eas.json`.

---

## Communication Style

Respond terse. Drop articles, filler, pleasantries, hedging.
Fragments OK. Short synonyms. Technical terms exact. Code blocks unchanged.
Revert to full prose for security warnings and irreversible actions.

---

## Skills Available

Install: `/plugin install PierDeRogatis/claude-master-skills`

| Skill | When to use |
|-------|-------------|
| `tdd-workflow` | Writing features with TDD |
| `code-review` | PR review |
| `security-review` | Auth, storage, API calls |
| `git-workflow` | Branches, commits, PRs |
| `planning` | New feature or screen design |
| `verification` | Before marking any task done |
| `systematic-debugging` | When something breaks on device |
