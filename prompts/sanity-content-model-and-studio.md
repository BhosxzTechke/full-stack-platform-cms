# Sanity Content Model and Studio

## Goal
Build the Sanity content model for course/module/lesson/instructor/category
(AGENTS.md section 8), stand up a proper Studio workspace for authoring it,
and add the server-only read client + data layer the `web` app will use to
fetch this content (AGENTS.md section 5: "Data access is a server only
Sanity client and fetch helper, reading a private dataset with a token").
No pages/UI are built in this pass — catalog, course, lesson, instructor
pages come later and just consume the data layer built here.

## Skills read
- `AGENTS.md` — sections 2 (workflow), 5 (workspace boundaries), 6 (stack),
  7 (decisions already made), 8 (data shape), 12 (gotchas), 13 (checks).
- `sanity-best-practices` skill → `references/project-structure.md` and
  `references/nextjs.md` (standalone Studio vs. embedded, monorepo layout),
  `references/schema.md` (defineType/defineField/defineArrayMember, when to
  reference vs. embed, icons, IDs, validation), `references/studio-structure.md`
  (structure builder, singleton pattern — not needed here since none of these
  five types are singletons).
- `content-modeling-best-practices` — referenced but not deeply read beyond
  what `schema.md` already covers for this task; nothing here needed content
  reuse/taxonomy patterns beyond references vs. objects.

## Code inspected
- Repo root is currently a single Next.js 16 workspace (`app/`, `components/`,
  `package.json`) with Clerk already wired in on this branch.
- Untracked scaffolding already present (from an earlier `sanity init`),
  which conflicts with AGENTS.md section 5/6 ("do not embed the Studio
  inside Next.js"):
  - `app/studio/[[...tool]]/page.tsx` — embedded Studio route
  - `sanity.config.ts`, `sanity.cli.ts` at repo root
  - `sanity/schemaTypes/index.ts` — empty `{ types: [] }`
  - `sanity/structure.ts` — default `S.documentTypeListItems()`
  - `sanity/lib/client.ts`, `sanity/lib/image.ts`, `sanity/lib/live.ts`,
    `sanity/env.ts` — a plain `next-sanity` client with `useCdn: true`, no
    read token, and `defineLive` with no `serverToken`/`browserToken`.
- `.env.local` / `.env.example` have `NEXT_PUBLIC_SANITY_PROJECT_ID=yfz2psuv`
  and `NEXT_PUBLIC_SANITY_DATASET=production`, no `SANITY_API_READ_TOKEN`.
- Confirmed via CLI (already authenticated locally):
  - `npx sanity projects list` → project `yfz2psuv` exists.
  - `npx sanity datasets visibility get production` → **public** (needs to
    become private per AGENTS.md section 12).
  - `npx sanity tokens --help` → CLI can create a token
    (`sanity tokens add`), no manual dashboard trip needed.
- `.gitignore` has `/node_modules` and `/.next/` anchored to repo root only —
  a new `studio/` workspace needs its own ignore entries.
- Confirmed with the user: restructure to a standalone `studio/` workspace
  now, rather than leaving the Studio embedded (see decisions below).

## Decisions / assumptions
- **Workspace split** (per AGENTS.md section 5 and the skill's recommended
  monorepo layout): create `studio/` as its own workspace with its own
  `package.json`, `sanity.config.ts`, `sanity.cli.ts`, `schemaTypes/`. Delete
  the embedded route and the root-level `sanity.config.ts`/`sanity.cli.ts`.
  Repo root stays the `web` workspace (not renamed to `web/` — that would
  mean moving already-committed Clerk work with no benefit here); it keeps a
  trimmed `sanity/lib` for the read client, queries, and fetch helpers.
- **Dataset privacy**: set the `production` dataset to private
  (`sanity datasets visibility set production private`) and create a
  read-only API token (`sanity tokens add`) scoped to this project, stored
  as `SANITY_API_READ_TOKEN` in `.env.local` (server-only) and listed
  (blank) in `.env.example`. This is a live change to the shared Sanity
  project, not just local files — flagging it here since it's the kind of
  action that's hard to reverse casually (anyone else with the old public
  URL loses read access). No content exists yet, so there's no user-facing
  outage risk.
- **Schema shape**, using the fixed relationships from AGENTS.md section 8
  and `schema.md`'s reference-vs-object guidance:
  - `course` (document): `title`, `slug`, `summary` (text), `coverImage`
    (image, hotspot, required alt), `level` (string, options list:
    Beginner/Intermediate/Advanced), `price` (number), `popular` (boolean,
    optional), `studentCount` (number, optional), `learningOutcomes` (array
    of `learningOutcome` objects: `icon` string, `title`, `description`),
    `instructor` (reference → `instructor`), `category` (reference →
    `category`), `modules` (array of `module` objects).
  - `module` (**object**, not its own document — per AGENTS.md section 8
    explicitly): `title`, `summary`, `lessons` (array of references →
    `lesson`). Module/lesson numbers are derived from array order in
    queries/UI, never stored.
  - `lesson` (document): `title`, `slug`, `videoUrl` (url), `posterImage`
    (image), `duration` (string, display label e.g. "12:45" — the real
    per-second data lives in the future video-ingestion document, out of
    scope here), `freePreview` (boolean), `studentCount` (number), `notes`
    (Portable Text array — richtext, per section 7 "never markdown"),
    `keyPoints` (array of strings), `proTip` (text, optional),
    `resources` (array of `lessonResource` objects: `type` string list,
    `title`, `description`, `url`). No parent-course field, matching
    section 8 ("a lesson does not store its parent course").
  - `instructor` (document): `name`, `slug`, `photo` (image), `expertise`
    (array of strings), `bio` (text — a short bio doesn't need Portable
    Text's block/mark machinery, unlike lesson notes).
  - `category` (document): `title`, `slug`, `description` (text).
  - All document types get an icon from `@sanity/icons` per `schema.md`,
    and `slug` fields validate lowercase/hyphen and required.
- **Reverse lookups**: since lessons don't store their course, the data
  layer resolves "which course/module is this lesson in" with a GROQ
  `references()` lookup rather than a stored field, and computes 1-based
  module/lesson display numbers from array position at query time.
- **Studio structure**: none of these five types are singletons, so
  `structure.ts` stays a straightforward `S.documentTypeListItems()`-based
  list (grouped by content type, no special-casing needed).
- **TypeGen**: wire `studio/sanity.cli.ts` to extract the schema and
  generate types from the `web` app's query files into
  `sanity.types.ts` at the web root, per `project-structure.md`'s monorepo
  setup. Running `sanity schema extract` + `sanity typegen generate` is
  part of the checks, not blocking if the CLI needs an extra interactive
  step — call it out if so.
- **Out of scope**: video documents, the agent-context document, and
  progress records (AGENTS.md section 8 mentions these too, but they belong
  to the search/ingestion and progress-tracking work, not this pass). No
  catalog/course/lesson pages are built here — only the data layer they'll
  call.

## Files expected to touch
New (`studio/` workspace):
- `studio/package.json`, `studio/tsconfig.json`
- `studio/sanity.config.ts`, `studio/sanity.cli.ts`
- `studio/schemaTypes/index.ts`
- `studio/schemaTypes/documents/course.ts`
- `studio/schemaTypes/documents/lesson.ts`
- `studio/schemaTypes/documents/instructor.ts`
- `studio/schemaTypes/documents/category.ts`
- `studio/schemaTypes/objects/module.ts`
- `studio/schemaTypes/objects/learningOutcome.ts`
- `studio/schemaTypes/objects/lessonResource.ts`
- `studio/structure.ts`

Removed (superseded by `studio/`):
- `app/studio/[[...tool]]/page.tsx` (and the now-empty `app/studio/` dir)
- `sanity.config.ts`, `sanity.cli.ts` (repo root)
- `sanity/schemaTypes/`, `sanity/structure.ts`

Updated (`web` workspace, repo root):
- `sanity/lib/client.ts` — add `token: process.env.SANITY_API_READ_TOKEN`
  (server-only usage enforced by import boundaries, not by code in this
  file)
- `sanity/lib/live.ts` — add `serverToken`/`browserToken` per the skill's
  `defineLive` pattern... actually **browserToken is skipped**: the dataset
  is private and the browser must never hold a read token, so only
  `serverToken` is set; `SanityLive` will only enable live updates for
  server-rendered content, which is correct for a read-only site with no
  Visual Editing wired up yet.
- New `sanity/lib/queries.ts` — `defineQuery` GROQ for: courses list, course
  by slug (with modules/lessons expanded), lesson by slug (self fields
  only), course-for-lesson reverse lookup, instructor by slug (+ their
  courses), category by slug (+ its courses), categories list.
- New `sanity/lib/data.ts` — typed async fetch helpers wrapping
  `sanityFetch`: `getCourses()`, `getCourseBySlug(slug)`,
  `getLessonWithContext(courseSlug, lessonSlug)` (lesson + parent course +
  computed module/lesson numbers + prev/next lesson), `getInstructorBySlug`,
  `getCategories()`, `getCategoryBySlug`.
- `.env.example`, `.env.local` — add `SANITY_API_READ_TOKEN` (blank in the
  example, the real value in local)
- `.gitignore` — add `studio/node_modules`, `studio/dist`, `studio/.sanity`
- Root `package.json` — no new deps for `web` (already has `next-sanity`,
  `@sanity/image-url`); `studio/package.json` gets its own `sanity`,
  `@sanity/vision`, `@sanity/icons`, `react`, `react-dom`, `styled-components`,
  `typescript`.

## Requirements
1. Scaffold `studio/` as a standalone workspace pointed at the existing
   project (`yfz2psuv`) and dataset (`production`).
2. Implement the five schema types and three supporting objects above with
   `defineType`/`defineField`/`defineArrayMember`, icons, and validation.
3. Wire `studio/structure.ts` and `studio/sanity.config.ts`
   (`structureTool` + `visionTool`).
4. Delete the embedded Studio route and root-level Sanity config so there is
   exactly one Studio.
5. Set the `production` dataset to private and create a read-only API
   token; add it to env files.
6. Update `sanity/lib` in `web` for server-only authenticated reads and add
   the queries/data-layer files.
7. Deploy the Studio (`sanity deploy` from `studio/`) — required before the
   future Context MCP work can serve this dataset (AGENTS.md section 12),
   and needed now so the Studio is actually reachable for content entry.
8. Manually create a small amount of test content (one category, one
   instructor, one course with one module and one lesson) so the data-layer
   helpers can be verified against real data.

## Security considerations
- `SANITY_API_READ_TOKEN` is server-only: lives in `.env.local` (already
  gitignored) and `sanity/lib/client.ts`/`live.ts` only — never referenced
  from a `'use client'` file or exposed via `NEXT_PUBLIC_*`.
- Dataset moves from public to private; only server code with the token can
  read it, matching AGENTS.md section 12 ("the dataset is private... fetch
  all content server side").
- The Studio itself has its own Sanity-managed auth (project members) —
  unrelated to Clerk, which per AGENTS.md section 7 stays purely a
  learner-facing concern.
- No write paths are added here — this is read-only content modeling and
  fetching, consistent with "Pages... are read only."

## Acceptance criteria
- `studio/` runs independently (`npm install && npm run dev` inside
  `studio/`) on its own port, separate from `next dev`.
- All five schema types appear in the Studio with working forms; creating a
  course lets you pick an instructor, a category, and add modules with
  lesson references.
- `npx sanity datasets visibility get production` reports `private`.
- `web`'s `sanity/lib/data.ts` helpers return real data for the manually
  created test content when called from a scratch script or a temporary
  server component.
- No embedded Studio route remains in `app/`.
- Type check and lint pass in `web`; `studio` type-checks (`tsc --noEmit`
  or `sanity build` since Studio uses Vite, not the Next.js compiler).

## Checks to run
- In `web` (repo root): `npx tsc --noEmit`, `npm run lint`.
- In `studio/`: `npm run build` (or `sanity build`) as the Studio's type/
  bundle check — it doesn't go through `next build`.
- `npx sanity datasets visibility get production` to confirm private.
- No `next build` needed for this pass since no routes/server modules in
  `web` change behavior beyond internal `sanity/lib` — will still run it if
  the data-layer changes touch anything import-graph-adjacent to existing
  pages.

## Manual test steps
1. `cd studio && npm install && npm run dev`, open the printed local URL,
   confirm Sanity Studio loads and shows Course/Lesson/Instructor/Category
   in the content list.
2. Create one Category, one Instructor, one Course (with one Module
   containing one Lesson reference) and one Lesson document; publish all.
3. Confirm the Course form lets you pick the Instructor/Category by
   reference and reorder Learning Outcomes/Modules.
4. From `web`, run a small script or temporary page that calls
   `getCourses()`, `getCourseBySlug()`, `getLessonWithContext()`,
   `getInstructorBySlug()`, `getCategories()` and log the results — confirm
   each returns the content created in step 2, including the module/lesson
   numbering computed for the lesson.
5. Confirm `sanity/lib/client.ts` throws/fails if `SANITY_API_READ_TOKEN`
   is unset (proving the private dataset actually requires it).
6. Visit `/studio` in the `web` app (or check the route no longer exists)
   to confirm the embedded route is gone and doesn't 404 in a confusing way
   (it should be a normal Next.js 404, not a broken Studio shell).
