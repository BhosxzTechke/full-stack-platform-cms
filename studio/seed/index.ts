// Seeds sample content into the `production` dataset: categories,
// instructors, and courses with modules/lessons. Idempotent — every
// document uses a deterministic id and is written with createOrReplace, so
// re-running this script converges rather than duplicating content.
//
// Requires SANITY_API_WRITE_TOKEN in studio/.env (write-scoped, never
// committed, never used by the running app).
import 'dotenv/config'
import { createClient } from '@sanity/client'

import { categories, courses, instructors, type CourseDef, type LessonDef } from './content'
import { uploadPlaceholderImage } from './placeholderImage'
import { videoUrls } from './videoUrls'

const projectId = process.env.SANITY_STUDIO_PROJECT_ID
const dataset = process.env.SANITY_STUDIO_DATASET
const token = process.env.SANITY_API_WRITE_TOKEN

if (!projectId || !dataset) {
  throw new Error('Missing SANITY_STUDIO_PROJECT_ID or SANITY_STUDIO_DATASET — set them in studio/.env')
}
if (!token) {
  throw new Error('Missing SANITY_API_WRITE_TOKEN — set a write-scoped token in studio/.env')
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: '2026-09-20',
  useCdn: false,
})

// --- deterministic pseudo-random numbers, seeded per string key ----------

function seededRandom(key: string): number {
  let hash = 0
  for (let i = 0; i < key.length; i++) {
    hash = (hash << 5) - hash + key.charCodeAt(i)
    hash |= 0
  }
  const x = Math.sin(hash) * 10000
  return x - Math.floor(x)
}

function randomInt(key: string, min: number, max: number): number {
  return Math.floor(seededRandom(key) * (max - min + 1)) + min
}

function randomDuration(key: string): string {
  const totalSeconds = randomInt(key, 6 * 60, 28 * 60)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}:${String(seconds).padStart(2, '0')}`
}

// --- Portable Text helpers -------------------------------------------------

function block(text: string, key: string) {
  return {
    _type: 'block',
    _key: key,
    style: 'normal',
    markDefs: [],
    children: [{ _type: 'span', _key: `${key}-span`, text, marks: [] }],
  }
}

function lessonNotes(course: CourseDef, moduleTitle: string, lesson: LessonDef) {
  const conceptList = lesson.concepts.join(', ')
  const intro = `This lesson is part of ${course.title}'s "${moduleTitle}" module. You'll work through ${conceptList}, building directly on what the module has covered so far.`
  const body = `By the end of "${lesson.title}", you should be able to explain ${lesson.concepts[0]} in your own words and use it correctly in a real ${course.title.toLowerCase()} codebase — the lesson works through concrete examples rather than abstract theory, covering ${conceptList} in the order they naturally come up in practice.`
  return [block(intro, `${lesson.slug}-p1`), block(body, `${lesson.slug}-p2`)]
}

function lessonKeyPoints(lesson: LessonDef): string[] {
  return [
    ...lesson.concepts.map((c) => c.charAt(0).toUpperCase() + c.slice(1)),
    `Apply ${lesson.concepts[0]} in a hands-on example`,
  ]
}

// --- write helpers -----------------------------------------------------

async function writeCategories() {
  console.log(`Writing ${categories.length} categories...`)
  for (const c of categories) {
    await client.createOrReplace({
      _id: `category-${c.slug}`,
      _type: 'category',
      title: c.title,
      slug: { _type: 'slug', current: c.slug },
      description: c.description,
    })
  }
}

async function writeInstructors() {
  console.log(`Writing ${instructors.length} instructors...`)
  for (const i of instructors) {
    const photo = await uploadPlaceholderImage(client, `instructor-${i.slug}`, 400, 400, `Photo of ${i.name}`)
    await client.createOrReplace({
      _id: `instructor-${i.slug}`,
      _type: 'instructor',
      name: i.name,
      slug: { _type: 'slug', current: i.slug },
      photo,
      expertise: i.expertise,
      bio: i.bio,
    })
  }
}

async function writeLessonsForCourse(course: CourseDef): Promise<string[][]> {
  // Returns lesson _ids grouped by module index, in module order.
  const idsByModule: string[][] = []

  for (let mi = 0; mi < course.modules.length; mi++) {
    const mod = course.modules[mi]
    const ids: string[] = []

    for (let li = 0; li < mod.lessons.length; li++) {
      const lesson = mod.lessons[li]
      const lessonId = `lesson-${course.slug}-${lesson.slug}`
      const lessonKey = `${course.slug}::${mi + 1}::${lesson.slug}`
      const video = videoUrls[lessonKey]
      if (!video) {
        throw new Error(`Missing video URL mapping for lesson key: ${lessonKey}`)
      }

      const poster = await uploadPlaceholderImage(
        client,
        `lesson-${course.slug}-${lesson.slug}`,
        640,
        360,
        `${lesson.title} lesson thumbnail`
      )

      await client.createOrReplace({
        _id: lessonId,
        _type: 'lesson',
        title: lesson.title,
        slug: { _type: 'slug', current: lesson.slug },
        videoUrl: video.url,
        posterImage: poster,
        duration: randomDuration(lessonId),
        freePreview: mi === 0 && li === 0,
        studentCount: randomInt(lessonId, 50, 3000),
        notes: lessonNotes(course, mod.title, lesson),
        keyPoints: lessonKeyPoints(lesson),
        ...(lesson.proTip ? { proTip: lesson.proTip } : {}),
        resources: course.resources.map((r, ri) => ({
          _type: 'lessonResource',
          _key: `${lesson.slug}-resource-${ri}`,
          ...r,
        })),
      })

      ids.push(lessonId)
    }

    idsByModule.push(ids)
  }

  return idsByModule
}

async function writeCourse(course: CourseDef) {
  console.log(`Writing course: ${course.title}`)
  const lessonIdsByModule = await writeLessonsForCourse(course)

  const coverImage = await uploadPlaceholderImage(client, `course-${course.slug}`, 800, 450, `${course.title} cover image`)

  const modules = course.modules.map((mod, mi) => ({
    _type: 'module',
    _key: `module-${mi}`,
    title: mod.title,
    summary: mod.summary,
    lessons: lessonIdsByModule[mi].map((id, li) => ({
      _type: 'reference',
      _key: `module-${mi}-lesson-${li}`,
      _ref: id,
    })),
  }))

  await client.createOrReplace({
    _id: `course-${course.slug}`,
    _type: 'course',
    title: course.title,
    slug: { _type: 'slug', current: course.slug },
    summary: course.summary,
    coverImage,
    level: course.level,
    price: course.price,
    popular: course.popular ?? false,
    studentCount: randomInt(`course-${course.slug}`, 500, 5000),
    learningOutcomes: course.learningOutcomes.map((o, oi) => ({
      _type: 'learningOutcome',
      _key: `outcome-${oi}`,
      ...o,
    })),
    instructor: { _type: 'reference', _ref: `instructor-${course.instructorSlug}` },
    category: { _type: 'reference', _ref: `category-${course.categorySlug}` },
    modules,
  })
}

// --- validation ----------------------------------------------------------

async function validate() {
  console.log('\nValidating relations...')
  type CourseCheck = {
    _id: string
    title: string
    modules: { lessons: { _ref: string }[] }[]
  }

  const courseDocs = await client.fetch<CourseCheck[]>(
    `*[_type == "course"]{_id, title, modules[]{lessons[]{_ref}}}`
  )
  const allLessonIds = new Set(
    (await client.fetch<{ _id: string }[]>(`*[_type == "lesson"]{_id}`)).map((l) => l._id)
  )

  let dangling = 0
  let referencedLessonCount = 0
  const referencedIds = new Set<string>()

  for (const course of courseDocs) {
    let courseLessonCount = 0
    for (const mod of course.modules ?? []) {
      const refs = mod.lessons ?? []
      courseLessonCount += refs.length
      for (const ref of refs) {
        referencedLessonCount++
        referencedIds.add(ref._ref)
        if (!allLessonIds.has(ref._ref)) {
          dangling++
          console.error(`  DANGLING REF: ${course.title} references missing lesson ${ref._ref}`)
        }
      }
    }
    console.log(`  ${course.title}: ${course.modules.length} modules, ${courseLessonCount} lessons`)
  }

  const orphans = [...allLessonIds].filter((id) => !referencedIds.has(id))

  console.log(`\nCourses: ${courseDocs.length}`)
  console.log(`Total lessons: ${allLessonIds.size}`)
  console.log(`Total module->lesson references: ${referencedLessonCount}`)
  console.log(`Dangling references: ${dangling}`)
  console.log(`Orphan lessons (not referenced by any module): ${orphans.length}`)
  if (orphans.length) console.log(`  ${orphans.join(', ')}`)

  if (dangling > 0 || orphans.length > 0) {
    throw new Error('Validation failed — see above.')
  }
  console.log('\nValidation passed: every module lesson count matches real references, no orphans.')
}

async function main() {
  await writeCategories()
  await writeInstructors()
  for (const course of courses) {
    await writeCourse(course)
  }
  await validate()
  console.log('\nSeed complete.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
