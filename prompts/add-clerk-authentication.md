# Add Clerk Authentication

## Goal
Wire up Clerk authentication in the `web` Next.js app so learners can sign up,
sign in, and see their account state, per AGENTS.md section 7 ("Authentication
is Clerk... Keep browsing public and gate only what a feature marks as
protected") and section 5 (Clerk is wired through Next.js middleware, keeps
its secret key server-only, exposes only the publishable key to the browser).

## Skills read
- `AGENTS.md` (governs the whole loop, tech stack, and server/client boundary
  rules for this repo)
- `clerk` skill, which routed to `clerk-setup` (CLI-driven quickstart:
  install/update the Clerk CLI, `clerk auth login`, `clerk init`, verify the
  Next.js proxy matcher, add auth controls, `clerk doctor`)

## Code inspected
- `package.json` — plain Next.js 16 app (App Router), no Clerk, no Sanity yet.
  Only workspace at repo root; the Sanity Studio workspace described in
  AGENTS.md section 5 doesn't exist yet, so this is purely the `web` side.
- `app/layout.tsx` — root layout, no providers wrapping `<body>` yet.
- `app/page.tsx` — home page, uses `NavBar` from `components/ui`.
- `components/ui/NavBar.tsx` — has a placeholder circular "V" avatar
  (`span`) on the right side where a real account control belongs, plus a
  bell icon. No sign-in/sign-up affordance exists yet.
- No `middleware.ts` or `proxy.ts` at the repo root — `clerk init` will need
  to create one.
- No `.env` or `.env.example` files exist yet.
- No protected routes exist yet (`/courses`, `/my-learning` are nav links but
  the pages aren't built), so there is nothing to gate in middleware today.

## Decisions / assumptions
- Run `clerk init --app app_3JYndLZj62eHNWg0XgY8hb0ZBE4` against the existing
  Next.js project (not the empty-directory scaffold path) so it links to the
  Clerk application already specified by the skill.
- Since no private routes exist yet, `clerk init`'s default middleware/proxy
  (public by default) is correct — we are not adding route protection in this
  pass. Future private routes (My Learning, progress writes) will be gated in
  `middleware.ts`/`proxy.ts` when those pages are built, not here.
- Replace the placeholder "V" avatar span in `NavBar.tsx` with real Clerk
  controls: `SignInButton` + `SignUpButton` when signed out, `UserButton`
  when signed in, using Clerk's `Show` component to switch between them —
  matching the pattern in the clerk-setup skill.
- Add a committed `.env.example` listing `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
  and `CLERK_SECRET_KEY` as placeholders (no real values), per AGENTS.md
  section 12 ("keep a committed `.env.example` as the canonical list").
- `ClerkProvider` goes inside `<body>` in `app/layout.tsx`, not wrapping
  `<html>`, per Clerk's Next.js 15+ rules (also called out in the skill).
- No Sanity, PostHog, or other integrations are touched — out of scope for
  this task.

## Files expected to touch
- `package.json` / `package-lock.json` — add `@clerk/nextjs`
- `app/layout.tsx` — wrap children in `ClerkProvider`
- `components/ui/NavBar.tsx` — swap placeholder avatar for
  `SignInButton`/`SignUpButton`/`UserButton` via `Show`
- New `middleware.ts` or `proxy.ts` (whichever `clerk init` generates for
  this Next.js version) — verify matcher includes `'/__clerk/:path*'` after
  the `'/(api|trpc)(.*)'` entry
- New `.env.example`
- `.env.local` (created by `clerk init`, already covered by `.gitignore`'s
  `.env*` pattern — will not be committed)

## Requirements
1. Install or update the Clerk CLI.
2. `clerk auth login` (pauses for the user to complete the browser login).
3. `clerk init --app app_3JYndLZj62eHNWg0XgY8hb0ZBE4` against this existing
   project.
4. Verify the generated middleware/proxy matcher.
5. Add visible sign-in/sign-up/UserButton controls to `NavBar`.
6. `clerk doctor` to confirm the setup.
7. Start the dev server and manually verify sign-up works end to end.

## Security considerations
- `CLERK_SECRET_KEY` stays server-only (in `.env.local`, never imported into
  a client component); only `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` reaches the
  browser.
- No routes are gated yet, so there's no auth-bypass surface introduced by
  this change — this task only adds identity, not authorization.
- `.env.local` must not be committed (already covered by `.gitignore`).

## Acceptance criteria
- `@clerk/nextjs` installed; `ClerkProvider` wraps the app inside `<body>`.
- Middleware/proxy file exists with a correct matcher.
- `NavBar` shows `SignInButton`/`SignUpButton` when signed out and
  `UserButton` when signed in, replacing the placeholder avatar.
- `clerk doctor` reports no issues.
- Type check and lint pass.
- Dev server starts and the home page renders with working auth controls.

## Checks to run
- `npm run lint`
- `npx tsc --noEmit`
- `clerk doctor`
- `npm run dev` (manual verification below)

## Manual test steps
1. Run `npm run dev` and open the home page.
2. Confirm the nav bar shows Sign In / Sign Up controls instead of the old
   placeholder avatar.
3. Click Sign Up, complete Clerk's hosted/embedded sign-up flow with a test
   account.
4. Confirm the nav bar now shows a `UserButton` avatar for the signed-in
   user.
5. Click the `UserButton` and confirm the account menu (profile, sign out)
   opens correctly.
6. Sign out and confirm the nav bar reverts to Sign In / Sign Up.
