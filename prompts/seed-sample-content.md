# Seed Sample Content

## Goal
Populate the (currently empty) `production` dataset with realistic sample
content — categories, instructors, and courses with modules and lessons —
so the catalog, course/lesson pages, and cross-course search have real data
to work against. This is fixture/seed data for development, not a migration
from an external source.

## Skills read
- `AGENTS.md` — sections 2 (workflow), 5 (workspace boundaries: web is read
  only, all writes are server-side/scripted, never through the app), 7
  (content must be genuinely coherent top-to-bottom — "if the lessons are
  unrelated to their module, search returns junk"), 8 (data shape), 12
  (private dataset, server-only tokens).
- `sanity-migration` — `references/general.md` guardrails applied even
  though there's no legacy source: deterministic document IDs,
  `createOrReplace` for idempotent reruns, referenced documents written
  before documents that reference them, uploaded image assets (not external
  CDN URLs baked into the dataset), Portable Text for rich text, a
  validation pass before calling it done.

## Code inspected
- `studio/schemaTypes/documents/{course,lesson,instructor,category}.ts` and
  `studio/schemaTypes/objects/{module,learningOutcome,lessonResource}.ts` —
  confirmed exact required fields and validation (re-read in full this
  session; matches the schema built in the `sanity-content-model-and-studio`
  pass).
- `sanity/env.ts`, `sanity/lib/client.ts` — confirmed project id/dataset
  come from `NEXT_PUBLIC_SANITY_*` and reads use `SANITY_API_READ_TOKEN`.
  This token is read-only, so seeding needs a separate write token.
- `studio/sanity.config.ts`, `studio/sanity.cli.ts` — confirmed
  `SANITY_STUDIO_PROJECT_ID`/`DATASET` env var names Studio uses, and that
  TypeGen output goes to `../sanity.types.ts`.
- `studio/package.json` — `sanity` and its deps already pull in
  `@sanity/client` and `tsx` transitively (confirmed both resolve from
  `studio/node_modules`); no new runtime tooling needed for a script.
- Queried the live dataset with the existing read client: `*[_type in
  ["course","lesson","instructor","category"]]` returns `[]` — dataset is
  currently empty, so there's no risk of colliding with or duplicating
  earlier manual test content.

## Decisions / assumptions
- **Where the script lives**: `studio/seed/` (Sanity-specific tooling
  belongs next to the schema it fills, not in the web app). Run via
  `npm run seed` in `studio/`, calling `tsx seed/index.ts`.
- **Auth**: needs a **write** token, which doesn't exist yet. I'll create
  one with `npx sanity tokens add "Seed script" --role editor` before
  running the script (this is a live, hard-to-reverse-casually action on
  the shared Sanity project — flagging it as such). It's stored as
  `SANITY_API_WRITE_TOKEN` in `studio/.env` only (already gitignored),
  never committed, never used by the running app. `studio/.env.example`
  gets the blank key for documentation.
- **Idempotency**: every document gets a deterministic `_id` derived from
  its slug (`category-<slug>`, `instructor-<slug>`, `course-<slug>`,
  `lesson-<course-slug>-<lesson-slug>`) and is written with
  `createOrReplace`. Re-running the script is safe and converges to the
  same state rather than duplicating content.
- **Write order**: categories and instructors first, then lessons (each
  lesson gets its poster image uploaded first), then courses last (each
  course embeds its modules, which embed lesson references — so lessons
  must already exist; course cover image uploaded as part of the same
  step).
- **Images**: schema requires `coverImage`/`posterImage`/`photo` with
  required alt text — these can't be left empty. Since there's no real
  media library yet, the script fetches a deterministic placeholder image
  per slug from `placehold.co` (a solid color picked deterministically from
  the slug, with the slug as overlay text) and uploads the bytes as a real
  Sanity image asset via `client.assets.upload`. Originally planned to use
  `picsum.photos`, but that host was unreachable (connection timeouts) from
  this environment — `placehold.co` and `dummyimage.com` were reachable, so
  the script uses `placehold.co`. This satisfies
  the "no external CDN URLs baked into content" guardrail (the asset lives
  in Sanity, not a live external link) while giving every card a distinct,
  non-broken image. Flagging this as a placeholder strategy to swap for
  real course art later.
- **Video URLs** (updated per user direction): every lesson gets a real,
  unique, topically-relevant public YouTube video — not a placeholder. A
  research pass (delegated to a background agent with web search) maps
  each of the 144 lesson topics to a real YouTube URL, preferring
  well-known reputable channels/creators for the subject (e.g. freeCodeCamp,
  Fireship, Traversy Media, Corey Schafer for Python, official Kubernetes/
  PyTorch/Apple Developer/Google Developers channels) and verifying each
  video actually exists and matches the stated topic before it's used. No
  two lessons share a video. The mapping is written to
  `studio/seed/videoUrls.ts` and imported by `content.ts`; any lesson the
  research pass couldn't confidently match gets flagged in its output
  rather than silently guessed.
- **Content plan** (revised down at the user's request — "that's enough i
  dont want too many" — from the original 12 courses/144 lessons to a
  smaller set): 6 categories, 6 instructors, **6 courses (one per
  category)**, 2 modules per course, 2 lessons per module = **24 lessons**.
  Kept: Modern JavaScript Fundamentals, TypeScript Deep Dive, Machine
  Learning Foundations, Python for Data Analysis with Pandas, Docker &
  Kubernetes Essentials, iOS App Development with Swift — one per category,
  each course's first 2 modules kept as-is (still genuinely
  building on each other). Dropped the other 6 courses entirely rather than
  thinning every course, so each kept course still reads as a real,
  coherent curriculum rather than a stub.
  - Categories: Web Development, Programming Languages, Artificial
    Intelligence, Data Science, DevOps & Cloud, Mobile Development.
  - Instructors (one primary domain each, teaches both of that domain's
    courses): Priya Nandakumar (Web Dev), Marcus Webb (Programming
    Languages), Sofia Alvarez (AI), Daniel Osei (Data Science), Lena
    Kowalski (DevOps & Cloud), Ryo Tanaka (Mobile Dev).
  - Courses:
    1. Modern JavaScript Fundamentals — Web Dev — beginner
    2. Full-Stack Next.js Applications — Web Dev — advanced
    3. TypeScript Deep Dive — Programming Languages — intermediate
    4. Go for Backend Engineers — Programming Languages — intermediate
    5. Machine Learning Foundations — AI — beginner
    6. Deep Learning with PyTorch — AI — advanced
    7. Python for Data Analysis with Pandas — Data Science — beginner
    8. SQL for Data Professionals — Data Science — beginner
    9. Docker & Kubernetes Essentials — DevOps & Cloud — intermediate
    10. AWS Cloud Practitioner Bootcamp — DevOps & Cloud — beginner
    11. iOS App Development with Swift — Mobile Dev — intermediate
    12. Cross-Platform Apps with React Native — Mobile Dev — intermediate
  - Each course gets real `learningOutcomes` (3–4), each lesson gets real
    `notes` (Portable Text, a few paragraphs specific to that lesson's
    actual topic — not lorem ipsum), 3–5 `keyPoints`, and 1–2 `resources`
    linking to real, genuinely relevant public documentation (MDN, the
    Python docs, PyTorch docs, Kubernetes docs, Apple's Swift docs, etc.) —
    real URLs, since a documentation link doesn't need to be Sanity-hosted.
    Content is written so each module's lessons genuinely build on one
    topic and each course's modules genuinely build on each other, per
    AGENTS.md section 7 ("content is coherent top to bottom... if the
    lessons are unrelated to their module, search returns junk") — this is
    the main point of the exercise, so it gets real writing effort, not
    filler.
  - `freePreview: true` on each course's first lesson only; `popular` true
    on ~4 of the 12 courses; `studentCount`/lesson `studentCount` randomized
    within a plausible range, deterministic per seed run (seeded RNG) so
    reruns don't produce drifting numbers.
- **Consistency requirement** (the user's explicit ask): a module's lesson
  count is exactly its `lessons` array length (only references to lessons
  actually created in this run, no dangling/missing refs), and a course's
  total lesson count is exactly the sum across its `modules[].lessons`
  arrays (every module fully populated, no empty modules). Since the schema
  never stores a count field — module/lesson numbers are derived from array
  position (AGENTS.md section 8) — "consistent" here means: no orphan
  lessons (created but not referenced by any module) and no dangling
  references (referenced but not created). The script's final validation
  pass checks exactly this via GROQ and fails loudly if it doesn't hold.

## Files expected to touch
New (`studio/` workspace):
- `studio/seed/content.ts` — the actual category/instructor/course/lesson
  data definitions (the writing-heavy part).
- `studio/seed/index.ts` — the runner: connects with the write token,
  uploads images, writes documents in dependency order, then runs the
  validation pass and prints a summary.
- `studio/seed/placeholderImage.ts` — small helper to fetch a seeded
  placeholder photo and upload it as a Sanity asset, memoized so the same
  slug isn't uploaded twice in one run.

Updated:
- `studio/package.json` — add `"seed": "tsx seed/index.ts"` script; add
  `@sanity/client` as an explicit devDependency (currently only transitive)
  since the seed script imports it directly.
- `studio/.env.example` — add blank `SANITY_API_WRITE_TOKEN` key.
- `studio/.env` (gitignored, not committed) — add the real write token
  value once created.

No `web` files change — this is Studio-side content, not app code.

## Requirements
1. Create a write-scoped API token for the project and store it in
   `studio/.env` only.
2. Write `studio/seed/placeholderImage.ts`, `studio/seed/content.ts`,
   `studio/seed/index.ts` per the plan above.
3. Run the seed script against the `production` dataset.
4. Run the validation pass (module lesson counts vs. actual references,
   course lesson totals vs. sum of modules, no dangling refs) and report
   the result.
5. Confirm content renders correctly in Studio (spot check a few documents).

## Security considerations
- The write token is server/script-only: lives in `studio/.env`
  (gitignored) and is read only by `studio/seed/index.ts`. It's never
  referenced from `web`, never exposed to the browser, and isn't the same
  token as the app's read-only `SANITY_API_READ_TOKEN`.
- No change to dataset visibility or to the app's read path — this only
  adds content through a one-off authenticated script, consistent with
  AGENTS.md section 5 ("Any write... goes through a server route" / here, a
  one-off authen, script, not the running app — the app itself still never
  writes).
- Placeholder images are fetched from `picsum.photos` at seed time and
  re-uploaded into Sanity's asset store; the dataset itself never points at
  a live third-party URL.

## Acceptance criteria
- Dataset contains exactly 6 categories, 6 instructors, 6 courses, and 24
  lessons (4 per course), all `createOrReplace`d under deterministic ids.
- Every course has 2 modules; every module has exactly 2 lesson references,
  all resolving to real lesson documents created in this run.
- Every course, lesson, and instructor required field is populated
  (images uploaded as real assets with alt text, no empty required
  strings).
- Lesson notes/key points/resources are topically real (about that
  lesson's actual subject), not lorem ipsum or copy-pasted filler.
- Re-running `npm run seed` is a no-op in effect (same ids, same content,
  no duplicates).
- The script's own validation pass reports zero orphan lessons and zero
  dangling module references.

## Checks to run
- The seed script's built-in validation pass (see above) — this is the
  primary check for this kind of task per AGENTS.md section 13 ("for
  search or ingestion work verify against the live MCP endpoint" — full
  MCP/search verification is out of scope until the search feature itself
  is built, but the content-integrity check is the equivalent here).
- `studio`: `npm run build` (Studio type/bundle check) — the new
  `seed/*.ts` files are plain scripts run via `tsx`, not part of the Studio
  app bundle, but keeping them type-clean.
- No `web` checks needed — no `web` files change.

## Manual test steps
1. `cd studio && npm run seed` — confirm it prints progress (categories →
   instructors → lessons → courses) and ends with a validation summary
   showing 0 issues.
2. Open Studio (`npm run dev` in `studio/`), open 2–3 courses across
   different categories, confirm modules show the right lesson counts and
   every lesson opens with real notes, key points, and a poster image.
3. Re-run `npm run seed` a second time; confirm the document counts in
   Studio don't change (idempotent) and no duplicate slugs appear.
4. Spot check one lesson's `resources` links actually resolve (they're real
   external docs, not placeholders).
