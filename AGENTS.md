# Screamulus: project context

Source documents: `EKIPI.md`, `BISEDAT.md`, and `HARTA.md`. Read them before changing the product scope.

- Team: Thesar and Amra (GitHub: Amruke1). Route 1, "Per veten".
- First user: a student who struggles to connect a mathematical formula with its graph.
- One job: help the student understand that connection by changing a simple graph with voice and phone tilt and explaining what changed.
- Research: the first student confused amplitude with repetition and used AI for a quick answer. Other notes concern memorization and time spent preparing for October math tests. The third note lacks a specific exercise; do not invent missing evidence or interview details.
- Planned flow: lesson list > lesson details > Scream Studio > result. The list and details exist; the microphone/tilt experiment and result screen are still planned.
- MVP focuses on amplitude. Camera graph recognition, generated sound, social features, payments, and interactive calculus are outside the MVP.

## Current Supabase assignment

- M0: keep this product summary aligned with the source documents.
- M1/M3: load the existing lesson list and details from Supabase, with loading, empty, failure, and retry states. Never silently replace a failed database read with hard-coded lessons.
- M2: let a student save a personal study note linked to a lesson and read it after reopening. Use Supabase Auth and owner-based row level security for personal data.
- Accounts are optional: keep public lesson browsing and guest trial notes. Guest registration links a verified email to the existing user before setting a password, preserving the user ID and notes.
- Use the shared auth queue and AuthProvider. Clear private note UI when the owner changes, and check the initiating owner ID before note requests. Never use editable user metadata for authorization.
- Email verification and password recovery use codes from the Supabase templates in supabase/templates, delivered through Brevo SMTP. SMTP credentials stay only in Supabase settings. See ACCOUNTS.md.
- Keep backend queries outside `src/app/`. Only route components belong there. Do not build the full Studio as part of this database assignment.
- Commit after each completed step and review the diff. Update `PROGRES.md` with what is implemented, what is verified, what the agent did, and the next step. Do not claim phone verification without a real phone test.
- Public project URL and publishable key belong in ignored `.env.local`. Database passwords, access tokens, service-role keys, and secret keys must never enter app code, commits, screenshots, or logs.

This is an Expo/React Native mobile application. Prioritize mobile-first patterns, performance, and cross-platform compatibility.

## Expo has changed — do not trust your training data

Expo ships breaking changes every SDK release. APIs you remember are likely renamed, moved, or removed. Before writing any code that touches an Expo, EAS, or React Native API:

1. Read the major version of the `expo` package in `package.json`.
2. Fetch the matching versioned docs: `https://docs.expo.dev/versions/v<major>.0.0/`
3. For anything else, fetch https://docs.expo.dev/llms.txt — an index of all Expo docs with corrections to common LLM misconceptions. Follow its links to the specific page you need; never answer from memory.

## Commands

Use `bunx` instead of `npx` if the project uses bun (`bun.lock` present).

```bash
npx expo install <package>  # ALWAYS use instead of npm/yarn/pnpm/bun add — resolves SDK-compatible versions
npx expo start              # start the dev server
npx expo lint               # lint
npx tsc --noEmit            # typecheck
npx expo-doctor             # diagnose dependency and config issues
npx expo install --fix      # fix incompatible package versions
```

Run lint and typecheck before declaring any task done.

## Navigation & Routing

- Use **Expo Router** for all navigation. Routes live in `src/app/` — every file there is a screen, `_layout.tsx` files define navigators. Keep non-route code (components, hooks, utils) outside `src/app/`.
- Import `Link`, `router`, and `useLocalSearchParams` from `expo-router`.
- Docs: https://docs.expo.dev/router/introduction.md

## Building with EAS

Use EAS to build, sign, and submit the app in the cloud (`eas build`, `eas submit`) and to ship over-the-air updates (`eas update`) — no local Xcode or Android Studio required. Run EAS CLI as `bunx eas-cli <command>` in Bun projects, or `npx eas-cli@latest <command>` otherwise; substitute that for bare `eas` in docs examples.
Docs: https://docs.expo.dev/eas/index.md

## Rules

- If `ios/` and `android/` directories do not exist, they are generated (Continuous Native Generation). Never create or edit them by hand — configure native behavior in `app.json` and config plugins.
- Expo Go only includes its bundled native modules. After adding a library with native code, the app needs a development build: `npx expo run:ios|android` locally, or `eas build --profile development`.
- Prefer recommended Expo modules over third-party libraries, and check your available skills before adding dependencies. Docs: https://docs.expo.dev/versions/latest/index.md
