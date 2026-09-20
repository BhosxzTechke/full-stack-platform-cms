# Implementation prompt: Vertex Design System

## Goal

Implement the Vertex design system shown in `design/vertex-designsystem.png` as reusable Tailwind v4 tokens and UI components in the `web` app (currently the repo root — no workspace split exists yet since no other feature has been built), plus a `/design-system` showcase page that renders every section of the reference image so it can be checked pixel-for-pixel. This is foundational UI plumbing only: no Sanity, Clerk, PostHog, or search code is touched.

## Skills / docs consulted

- Read `AGENTS.md` section 3 (UI work: reproduce the reference exactly, make responsive down to mobile, reuse existing patterns, no restyling).
- Skipped `frontend-design` — this is reproduction of a fully-specified reference image, not an original design decision.
- Checked `node_modules/next/dist/docs/` — no routing/data-fetching behavior is novel here (static page, `next/font/google`), so no deviation from familiar App Router usage.

## Code inspected

- `package.json` — plain `create-next-app` (Next 16.3.5, React 19.2.8, Tailwind 4, no icon library, no extra fonts installed).
- `app/globals.css` — Tailwind v4 `@import "tailwindcss"` + a minimal `@theme inline` block with only `--color-background`/`--color-foreground` and Geist fonts. No design tokens yet.
- `app/layout.tsx` — loads Geist Sans/Mono via `next/font/google`. Will be replaced with Playfair Display (display font) + Inter (UI font) per the reference.
- `app/page.tsx` — default create-next-app splash page. Left untouched (out of scope).
- `tsconfig.json` — `@/*` path alias already maps to repo root, so new files can use `@/components/...`, `@/lib/...`.
- No existing `components/` or `lib/` directories — building fresh.

## Decisions / assumptions

- **Fonts**: Playfair Display + Inter, both via `next/font/google`, replacing Geist. Exposed as CSS vars `--font-display` (Playfair) and `--font-sans` (Inter), wired into Tailwind's `@theme`.
- **Tokens live in `app/globals.css`** using Tailwind v4's `@theme` directive (not a `tailwind.config.ts`, since v4 is CSS-first):
  - Colors: `primary-100`..`primary-500`, `neutral-50`..`neutral-900`, `white`, exact hex from the image.
  - Type scale: Display 1/2, Heading 1/2/3, Body Large/Body/Small as named `font-size`/`line-height` pairs (`--text-display-1`, etc. with matching `--text-display-1--line-height`), per the table in section 03.
  - Spacing: base unit 4px; Tailwind's default spacing scale already matches 4/8/12/16/24/32/40/48/64, so no override needed — just confirm and document.
  - Radius: `--radius-xs` 4px, `--radius-sm` 8px, `--radius-md` 12px, `--radius-lg` 16px, `--radius-xl` 24px, `--radius-full`.
  - Shadows: `--shadow-sm/md/lg/xl` using the exact rgba values in section 05.
- **Icons**: `lucide-react` (new dependency) for the outline set — 24px grid, 2px stroke, rounded caps matches lucide's defaults closely. "Filled style" is approximated by rendering the same lucide icon with `fill="currentColor"` and `strokeWidth={0}` via a shared `Icon` wrapper's `variant` prop, since lucide has no separate solid icon set. Flagging this as the one place the reproduction isn't pixel-exact — will call it out in the report.
- **Components** built under `components/ui/`, each supporting the states shown:
  - `Button.tsx` — `variant`: primary/secondary/tertiary/text, `disabled`, hover via CSS, optional trailing icon (external-link / play).
  - `Input.tsx` — text/search variant with leading search icon + trailing `⌘K` hint slot; matches Field Specs (44px height, 12px radius, 1px `neutral-200` border, focus border `primary-400`).
  - `Select.tsx` — same field specs, trailing chevron.
  - `Badge.tsx` — `variant`: video/lesson/popular, colors per section 09.
  - `StatusIndicator.tsx` — in-progress/completed/now-playing/locked, icon + label per section 10.
  - `ProgressBar.tsx` — track + fill + percentage label, per section 11.
  - `Card.tsx` — `CourseCard`, `LessonCard` (video and lesson sub-variants), `ResourceCard`, per section 12.
  - Navigation bits from section 13: `Breadcrumbs.tsx`, `Pagination.tsx`, and a top `NavBar.tsx` (logo, Courses, My Learning) — presentational only, no routing logic beyond `<Link>`.
- **Showcase page** at `app/design-system/page.tsx`: one section per numbered block in the image (colors, typography, type scale, spacing, radius/shadows, icons, buttons, inputs, badges, status, progress, cards, navigation, principles), laid out to make visual diffing against the reference straightforward. Responsive down to mobile (stacked sections, wrapping swatch grids) even though the reference is desktop-only, per AGENTS.md section 3.
- Root `app/page.tsx` stays as the default splash — not part of this task, no reason to touch it.

## Files expected to touch

- `package.json` — add `lucide-react`.
- `app/layout.tsx` — swap Geist for Playfair Display + Inter.
- `app/globals.css` — add full token set.
- `components/ui/Button.tsx`, `Input.tsx`, `Select.tsx`, `Badge.tsx`, `StatusIndicator.tsx`, `ProgressBar.tsx`, `Card.tsx`, `Breadcrumbs.tsx`, `Pagination.tsx`, `NavBar.tsx`, `Icon.tsx` (new).
- `app/design-system/page.tsx` (new).

## Requirements

- Every color, spacing, radius, and shadow value matches the hex/px/rgba values printed in the image exactly.
- Type scale sizes/line-heights/weights match section 03's table exactly (e.g. Display 1 = Playfair Display, 48/56, Bold).
- Button/input/select states (default, hover, disabled, focus) are all reachable and visually match.
- Components are generic and reusable (props-driven variants), not one-off markup duplicated per section.
- Showcase page is responsive down to mobile per AGENTS.md section 3 (no horizontal scroll, swatches/cards wrap or stack).

## Security considerations

None — static presentational UI, no data fetching, no user input persisted, no secrets involved.

## Acceptance criteria

- `/design-system` visually matches `design/vertex-designsystem.png` section by section at desktop width, and remains usable/no horizontal overflow at mobile width.
- All components are exported from `components/ui/` and are what future feature pages (catalog, course, lesson) will import rather than reimplementing.
- `npm run lint` and `npm run build` pass.

## Checks to run

- `npm run lint`
- `npm run build` (routes/config changed: new route, new fonts, new theme tokens)
- `npm run dev` and manually inspect `/design-system`

## Manual test steps

1. `npm run dev`, open `http://localhost:3000/design-system`.
2. Compare each numbered section against `design/vertex-designsystem.png` at desktop width (~1440px): colors, typography samples, type scale table, spacing scale, radius/shadow swatches, icon set, button matrix (hover by mousing over, disabled state visible), inputs (click to see focus border), badges, status indicators, progress bar at 35%, the four card types, nav/breadcrumbs/pagination, and the four principle callouts.
3. Resize the browser to a mobile width (~375px) and confirm no horizontal scrollbar and that sections stack sensibly.
4. Tab through the button/input examples to confirm visible focus states for accessibility (per the "Accessible" principle in the image).
