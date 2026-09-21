import { defineQuery } from 'next-sanity'

export const COURSES_QUERY = defineQuery(`
  *[_type == "course" && defined(slug.current)] | order(title asc) {
    _id,
    title,
    "slug": slug.current,
    summary,
    coverImage,
    level,
    price,
    popular,
    studentCount,
    instructor->{ name, "slug": slug.current, photo },
    category->{ title, "slug": slug.current }
  }
`)

export const COURSE_BY_SLUG_QUERY = defineQuery(`
  *[_type == "course" && slug.current == $slug][0]{
    _id,
    title,
    "slug": slug.current,
    summary,
    coverImage,
    level,
    price,
    popular,
    studentCount,
    learningOutcomes[]{ _key, icon, title, description },
    instructor->{ _id, name, "slug": slug.current, photo, expertise, bio },
    category->{ _id, title, "slug": slug.current },
    modules[]{
      _key,
      title,
      summary,
      lessons[]->{
        _id,
        title,
        "slug": slug.current,
        duration,
        freePreview,
        posterImage
      }
    }
  }
`)

export const LESSON_BY_SLUG_QUERY = defineQuery(`
  *[_type == "lesson" && slug.current == $slug][0]{
    _id,
    title,
    "slug": slug.current,
    videoUrl,
    posterImage,
    duration,
    freePreview,
    studentCount,
    notes,
    keyPoints,
    proTip,
    resources[]{ _key, type, title, description, url }
  }
`)

// Lessons don't store their parent course (AGENTS.md §8), so the course —
// and the module/lesson order needed to derive display numbers — is found
// by looking up the course that references this lesson's id.
export const COURSE_FOR_LESSON_QUERY = defineQuery(`
  *[_type == "course" && references($lessonId)][0]{
    _id,
    title,
    "slug": slug.current,
    modules[]{
      title,
      lessons[]->{ _id, title, "slug": slug.current }
    }
  }
`)

export const INSTRUCTOR_BY_SLUG_QUERY = defineQuery(`
  *[_type == "instructor" && slug.current == $slug][0]{
    _id,
    name,
    "slug": slug.current,
    photo,
    expertise,
    bio,
    "courses": *[_type == "course" && references(^._id) && defined(slug.current)]{
      _id, title, "slug": slug.current, coverImage, level, price
    }
  }
`)

export const CATEGORIES_QUERY = defineQuery(`
  *[_type == "category"] | order(title asc) {
    _id, title, "slug": slug.current, description
  }
`)

export const CATEGORY_BY_SLUG_QUERY = defineQuery(`
  *[_type == "category" && slug.current == $slug][0]{
    _id,
    title,
    "slug": slug.current,
    description,
    "courses": *[_type == "course" && references(^._id) && defined(slug.current)]{
      _id, title, "slug": slug.current, coverImage, level, price
    }
  }
`)
