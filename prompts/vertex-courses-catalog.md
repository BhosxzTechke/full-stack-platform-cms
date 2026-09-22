# Implementation prompt: Vertex all-courses catalog page

## Goal

Build a simple `/courses` catalog page listing every course, with a
category filter and pagination — no design reference image exists for
this page (only home, course-detail, and design-system images exist in
`design/`), so this reuses the established design-system look (grid of
`CourseCard`s, same page chrome as home) rather than reproducing a mock.
User explicitly asked to keep it simple.

## Skills / docs consulted

- AGENTS.md section 3: no reference image for this page, so it says
  nothing about visuals here on purpose — building to the existing design
  system instead of inventing new visual language.
- AGENTS.md section 5: pages are read only; no new server/client boundary
  violations. Filtering/pagination via URL search params keeps the page a
  server component — no progress/auth writes here.
- AGENTS.md section 13: type check, lint, and a build (new route) after
  implementing.

## Code inspected

- `sanity/lib/queries.ts` / `sanity/lib/data.ts` — `COURSES_QUERY` /
  `getCourses()` already return `category->{title, slug}` per course, and
  `CATEGORIES_QUERY` / `getCategories()` already exist and are unused
  anywhere in `app/`. No query changes needed.
- `app/page.tsx` — existing pattern for page chrome (`bg-cream` wrapper,
  `NavBar`, `mx-auto max-w-6xl` content), and `pickFeaturedCourses` /
  duration-summing logic for `CourseCard` props (`urlFor`, `formatLevel`,
  `formatDurationSeconds`, `sumDurations` from `lib/courseFormat.ts`).
- `components/ui/Card.tsx` (`CourseCard`), `Select.tsx`, `Pagination.tsx`,
  `NavBar.tsx`, `Button.tsx`, `Badge.tsx` — all already built and mostly
  unused outside home/design-system pages. `Pagination` is a `"use
  client"` component driven by an `onPageChange` callback (no built-in
  link/href support); `Select` is a plain styled `<select>` with no
  built-in navigation either.
- `app/design-system/page.tsx` — confirmed how `Select`/`Pagination` are
  invoked elsewhere (static showcase only, not wired to real state).
- `lib/courseFormat.ts` — reused as-is.

## Decisions / assumptions

- **Route**: `app/courses/page.tsx`, a server component. Reads
  `searchParams: { category?: string; page?: string }` (Next's
  `searchParams` is a promise in this app's Next.js version — same
  convention already used for `params` in `app/courses/[slug]/page.tsx`).
- **Filter**: a single category filter (Select), populated from
  `getCategories()`, defaulting to "All categories". No text search here
  — full-text search is the separate AI search feature (AGENTS.md §11),
  out of scope for this page.
- **Pagination**: 9 courses per page (3x3 grid, matches the existing
  `sm:grid-cols-2 lg:grid-cols-3` grid from home). Only rendered when
  there's more than one page.
- **New tiny client component** `components/ui/CourseFilters.tsx`:
  wraps the existing `Select` (category) and the existing `Pagination`,
  and on change pushes an updated `?category=&page=` URL via
  `useRouter`/`useSearchParams`/`usePathname`. This is the only new
  component — it composes existing UI pieces rather than styling
  anything new, and keeps `app/courses/page.tsx` itself a server
  component that just reads `searchParams` and fetches/filters/slices
  data.
  - Changing the category filter resets to page 1.
- **No new Sanity fields, no new queries** — filtering and pagination
  happen in-memory in the page component over `getCourses()`'s result
  (matches the existing scale: 6 seeded courses). If the catalog grows
  large enough that in-memory paging is wasteful, that's a follow-up, not
  in scope now.
- **Empty state**: if a category filter yields zero courses, show a
  simple centered message ("No courses in this category yet.") instead of
  an empty grid.
- Page heading: "All Courses", reusing `Badge`/typography tokens already
  established (`text-display-2 font-bold text-neutral-900` heading, as
  used for the "All Courses" section on home).
- Home page's existing "View all courses" button (`app/page.tsx`) already
  points nowhere (no `href`) — wire it to `Link href="/courses"` as part
  of this change, since otherwise the new page is unreachable from the UI.

## Files expected to touch

- `app/courses/page.tsx` (new)
- `components/ui/CourseFilters.tsx` (new)
- `app/page.tsx` (small edit: make "View all courses" a real link)

## Requirements

- Server-rendered course list from live Sanity data, no client fetch.
- Category filter and pagination both reflected in the URL (shareable,
  back-button friendly), not just local state.
- Responsive: grid collapses to 1 column on mobile, 2 on tablet, 3 on
  desktop (already how `CourseCard`'s grid behaves on home).
- Reuse `CourseCard`, `Select`, `Pagination`, `NavBar` as-is; no new
  visual styling invented.

## Security considerations

- No auth-gated data here (catalog browsing is public per AGENTS.md §5/§7).
- No writes; no user input reaches Sanity queries (category filtering is
  done in-memory against already-fetched data, not interpolated into
  GROQ).

## Acceptance criteria

- `/courses` lists all 6 seeded courses across however many pages result
  from a 9-per-page split (currently: 1 page, no pagination control
  shown).
- Selecting a category filters the grid to only that category's courses
  and updates the URL; an unmatched/empty result shows the empty state.
- Pagination control appears only when there's more than one page, and
  clicking a page updates the URL and the visible slice.
- Home page's "View all courses" button navigates to `/courses`.

## Checks to run

- `npm run typecheck` (or `tsc --noEmit`, whichever this repo's web
  workspace uses) in the web workspace.
- `npm run lint` in the web workspace.
- `npm run build` in the web workspace (new route added).
- Manually run `npm run dev` and verify in the browser.

## Manual test steps

1. Start the dev server, visit `/`, click "View all courses" → lands on
   `/courses`.
2. On `/courses`, confirm all 6 seeded courses render as cards, 3 per row
   on desktop width.
3. Resize to mobile width, confirm the grid collapses to 1 column and the
   filter/pagination controls stay usable.
4. Pick a category from the filter — confirm the grid narrows to that
   category's courses and the URL gains `?category=<slug>`.
5. Pick a category with zero courses (if any) or a category with fewer
   than 9 — confirm no pagination control shows for a single page, and
   the empty-state message shows in the zero-course case.
6. If more than 9 courses exist in one category (may require adding test
   content), confirm the pagination control appears, clicking page 2
   updates the URL (`?page=2`) and shows the next slice.
