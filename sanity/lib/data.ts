import { sanityFetch } from './live'
import {
  CATEGORIES_QUERY,
  CATEGORY_BY_SLUG_QUERY,
  COURSES_QUERY,
  COURSE_BY_SLUG_QUERY,
  COURSE_FOR_LESSON_QUERY,
  INSTRUCTOR_BY_SLUG_QUERY,
  LESSON_BY_SLUG_QUERY,
} from './queries'

// Server-only fetch helpers. Pages call these instead of touching the
// Sanity client or GROQ directly — keeps the read-only data layer in one
// place (AGENTS.md §5).

export async function getCourses() {
  const { data } = await sanityFetch({ query: COURSES_QUERY })
  return data
}

export async function getCourseBySlug(slug: string) {
  const { data } = await sanityFetch({
    query: COURSE_BY_SLUG_QUERY,
    params: { slug },
  })
  return data
}

export async function getCategories() {
  const { data } = await sanityFetch({ query: CATEGORIES_QUERY })
  return data
}

export async function getCategoryBySlug(slug: string) {
  const { data } = await sanityFetch({
    query: CATEGORY_BY_SLUG_QUERY,
    params: { slug },
  })
  return data
}

export async function getInstructorBySlug(slug: string) {
  const { data } = await sanityFetch({
    query: INSTRUCTOR_BY_SLUG_QUERY,
    params: { slug },
  })
  return data
}

/**
 * Fetches a lesson plus the course/module context it's used in, and derives
 * the display numbers (e.g. "Module 2", "Lesson 2.3") and the previous/next
 * lesson from array order — none of that is stored (AGENTS.md §8).
 */
export async function getLessonWithContext(lessonSlug: string) {
  const { data: lesson } = await sanityFetch({
    query: LESSON_BY_SLUG_QUERY,
    params: { slug: lessonSlug },
  })

  if (!lesson) return null

  const { data: course } = await sanityFetch({
    query: COURSE_FOR_LESSON_QUERY,
    params: { lessonId: lesson._id },
  })

  if (!course) {
    return { lesson, course: null, moduleIndex: null, lessonIndex: null, previousLesson: null, nextLesson: null }
  }

  const flatLessons: Array<{ _id: string; title: string; slug: string | null }> = []
  let moduleIndex: number | null = null
  let lessonIndex: number | null = null

  course.modules?.forEach((courseModule, mIdx) => {
    courseModule.lessons?.forEach((moduleLesson, lIdx) => {
      if (!moduleLesson) return
      flatLessons.push(moduleLesson)
      if (moduleLesson._id === lesson._id) {
        moduleIndex = mIdx + 1
        lessonIndex = lIdx + 1
      }
    })
  })

  const flatPosition = flatLessons.findIndex((entry) => entry._id === lesson._id)
  const previousLesson = flatPosition > 0 ? flatLessons[flatPosition - 1] : null
  const nextLesson =
    flatPosition >= 0 && flatPosition < flatLessons.length - 1
      ? flatLessons[flatPosition + 1]
      : null

  return {
    lesson,
    course: { _id: course._id, title: course.title, slug: course.slug },
    moduleIndex,
    lessonIndex,
    previousLesson,
    nextLesson,
  }
}
