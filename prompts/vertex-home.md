# Implementation prompt: Vertex home page

## Goal

Replace the default `create-next-app` splash on `/` with the Vertex marketing home page shown in `design/vertex-home.png`: top nav, hero (eyebrow badge, headline, subhead, CTA, search bar), an "All Courses" preview grid of 3 course cards, a decorative divider line, and a decorative gradient bar-chart flourish at the very bottom of the page. No data fetching — course cards are hardcoded content matching the reference, since the Sanity content model doesn't exist yet.

## Skills / docs consulted

- AGENTS.md section 3 (UI work: reproduce the reference exactly, responsive down to mobile, reuse existing components/patterns, no restyling).
- Skipped `frontend-design` — this is reproduction of a fully specified reference image, not an original design decision.
- No Next.js routing/data-fetching novelty here (single static server component page), so no doc lookup needed beyond what section 1 of `AGENTS.md` already established.

## Code inspected

- `design/vertex-home.png` (target) and `design/vertex-designsystem.png` (source of truth for tokens/components).
- `prompts/vertex-design-system.md` — the prior prompt that built the design system; home page must reuse its output, not reinvent it.
- `app/globals.css` — existing color/type/radius/shadow tokens (`primary-*`, `neutral-*`, `--text-*`, `--radius-*`, `--shadow-*`). Page background is currently plain white; the reference's hero/page background is a warm cream distinct from card white and from `neutral-50` (which is cool-toned `#FAFAFC`).
- `app/layout.tsx` — Playfair Display (`--font-display`) + Inter (`--font-sans`) already wired.
- `app/page.tsx` — currently the unmodified create-next-app splash; will be fully replaced.
- `components/ui/NavBar.tsx` — logo + Courses/My Learning links, no right-side actions. The reference nav also has a bell icon and a user avatar on the right that aren't in the component yet.
- `components/ui/Button.tsx` — variants primary/secondary/tertiary/text, trailing icons limited to `external-link` and `play`. The reference uses a right-pointing arrow on both "Explore Courses" (primary button) and "View all courses" (text link), which isn't a supported trailing icon yet.
- `components/ui/Badge.tsx` — variants video/lesson/popular only; none matches the rounded pill "INTELLIGENT LEARNING" eyebrow tag (primary-100 bg, primary-500 text, uppercase, letter-spaced).
- `components/ui/Input.tsx` — already matches the search bar exactly (leading search icon, trailing `⌘K` hint, 44px height, focus border) — reused as-is.
- `components/ui/Card.tsx` — `CourseCard` already matches the course card layout (logo box, title, description, level/duration/modules meta row) but its `initial` prop only supports a single letter in a fixed dark box; the reference has a black "N" box, a blue "TS" box, and a Docker whale glyph — different fills per card.
- `components/ui/Icon.tsx` — lucide-react wrapper, outline/filled variants; has what's needed for bell, search, star, arrow-right.

## Decisions / assumptions

- **Extend, don't fork, shared components** — this page must not duplicate button/badge/card markup inline:
  - `Button`: add `"arrow-right"` to `TrailingIcon` (lucide `ArrowRight`). Used by the primary CTA and by the "View all courses" text link.
  - `Badge`: add an `"eyebrow"` variant — `bg-primary-100 text-primary-500`, `rounded-full` (vs. the existing `rounded-xs` tag style), same uppercase/tracking treatment — for "INTELLIGENT LEARNING".
  - `Card`'s `CourseCard`: change the `initial: string` prop to `logo: ReactNode` plus `logoClassName?: string` so the caller controls the box's fill color and content (letter(s), emoji, icon), instead of hardcoding a single letter on a fixed dark background. This is the one prop-shape change to an existing component; every current caller of `CourseCard` (currently only the design-system showcase) gets updated to pass `logo={<>N</>}` etc. to keep behavior identical there.
  - `NavBar`: add a right-side actions region — a bell icon button and a circular avatar placeholder — rendered unconditionally, since the header chrome is the same shape on every page even before Clerk is wired in. The avatar is a plain initials-in-circle placeholder (no photo asset, no Clerk yet); swapping in the real Clerk `<UserButton />` and live notification state is future work, not this task.
- **Cream page background**: the reference's page/hero background is a warm off-white, visually distinct from the white cards and from the cool-toned `neutral-50` already in tokens. Not part of the documented design-system tokens (section 01 of `vertex-designsystem.png` has no such color), so add a single new token `--color-cream: #fdf8f3` used only as this page's `<body>`-level background wrapper, not a system-wide change to `--background`. Flagging this as a judgment call — closest visual match by eye, not a value taken from a spec.
- **Docker whale glyph**: no icon library ships a Docker mark and no brand asset exists in `public/`. Reproduce it as the 🐳 emoji inside the logo box (image is a course-catalog stand-in with hardcoded content anyway, not real content). Flagging as a minor reproduction gap, will call out in the report.
- **Bottom bar-chart flourish**: purely decorative, no data behind it. Built as a row of `div`s with fixed heights and a `primary-500 → transparent` gradient fill, absolutely positioned at the bottom of the page — not a chart component, not reused elsewhere.
- **Course card content**: hardcoded array of 3 items (Next.js for Production / Docker Essentials / TypeScript Deep Dive) with the exact copy, level, duration, and module count from the image. No Sanity fetch — the content model doesn't exist yet per `AGENTS.md` section 1's build order.
- Search input is presentational only on this page (no submit handler wired to the search route, since that doesn't exist yet) — typing and `⌘K` hint render, but there's no keyboard-shortcut listener or navigation. Flagging as a stub, consistent with "build nothing beyond what's asked."
- Page is a single server component (`app/page.tsx`), no client-side state needed since nothing is interactive yet.

## Files expected to touch

- `app/page.tsx` — full rewrite: nav, hero, course grid, divider, bottom flourish.
- `app/globals.css` — add `--color-cream` token.
- `components/ui/Button.tsx` — add `arrow-right` trailing icon.
- `components/ui/Badge.tsx` — add `eyebrow` variant.
- `components/ui/Card.tsx` — change `CourseCard`'s `initial` prop to `logo`/`logoClassName`.
- `components/ui/NavBar.tsx` — add bell + avatar placeholder region.
- `app/design-system/page.tsx` — update its `CourseCard` call site(s) for the prop rename, no visual change intended.

## Requirements

- Matches `design/vertex-home.png` at desktop width: nav layout, hero copy/typography (Playfair headline, Inter subhead), CTA button, search bar, "All Courses" section header + "View all courses" link, exactly 3 course cards with the pictured copy/meta, divider line with star icon and caption, bottom decorative bars.
- Responsive down to mobile per `AGENTS.md` section 3: nav stays usable (logo + links may wrap or the nav row scrolls before breaking), hero text and CTA stack full-width, course grid collapses from 3 columns to 1, no horizontal overflow at any width.
- Reuses `Button`, `Badge`, `Input`, `CourseCard`, `NavBar` — no duplicate one-off markup for things those components already do.
- All color/type/spacing/radius values come from existing tokens except the one new `--color-cream` token.

## Security considerations

None — static presentational content, no data fetching, no forms submitted, no secrets, no user input persisted.

## Acceptance criteria

- `/` visually matches `design/vertex-home.png` at desktop width (~1440px) and reflows sensibly at mobile width (~375px) with no horizontal scroll.
- `npm run lint` and `npm run build` pass.
- `/design-system` still renders correctly after the `CourseCard` prop change (no regression).

## Checks to run

- `npm run lint`
- `npm run build` (page + component changes)
- `npm run dev` and manually inspect `/` and `/design-system`

## Manual test steps

1. `npm run dev`, open `http://localhost:3000/`.
2. Compare against `design/vertex-home.png` at desktop width: nav (logo, Courses, My Learning, bell, avatar), eyebrow badge, headline/subhead, "Explore Courses" button with arrow, search bar with `⌘K` hint, "All Courses" heading + "View all courses" link, the 3 course cards (logos, titles, descriptions, level/duration/module meta), the star divider line, and the bottom gradient bars.
3. Resize to mobile width (~375px): confirm the nav, hero, and course grid all reflow without horizontal scrolling.
4. Open `http://localhost:3000/design-system` and confirm the course card section still renders correctly after the `initial` → `logo` prop change.
