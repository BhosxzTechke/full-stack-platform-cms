import { type SchemaTypeDefinition } from 'sanity'

import { category } from './documents/category'
import { instructor } from './documents/instructor'
import { lesson } from './documents/lesson'
import { course } from './documents/course'
import { learningOutcome } from './objects/learningOutcome'
import { lessonResource } from './objects/lessonResource'
import { module_ } from './objects/module'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    // Documents
    course,
    lesson,
    instructor,
    category,
    // Objects
    module_,
    learningOutcome,
    lessonResource,
  ],
}
