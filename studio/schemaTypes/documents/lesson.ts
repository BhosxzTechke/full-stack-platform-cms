import { PlayIcon } from '@sanity/icons'
import { defineArrayMember, defineField, defineType } from 'sanity'

export const lesson = defineType({
  name: 'lesson',
  title: 'Lesson',
  type: 'document',
  icon: PlayIcon,
  // A lesson does not store its parent course/module — that's derived via a
  // reverse reference lookup from the course that lists it (AGENTS.md §8).
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (rule) =>
        rule.required().custom((slug) => {
          if (!slug?.current) return 'Required'
          return /^[a-z0-9-]+$/.test(slug.current)
            ? true
            : 'Slug must be lowercase with hyphens only'
        }),
    }),
    defineField({
      name: 'videoUrl',
      title: 'Video URL',
      description: 'A YouTube, Vimeo, or Bunny video URL.',
      type: 'url',
      validation: (rule) => rule.required().uri({ scheme: ['http', 'https'] }),
    }),
    defineField({
      name: 'posterImage',
      title: 'Poster image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt text',
          type: 'string',
          validation: (rule) => rule.required(),
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'duration',
      title: 'Duration',
      description: 'Display label, e.g. "12:45".',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'freePreview',
      title: 'Free preview',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'studentCount',
      title: 'Student count',
      type: 'number',
      validation: (rule) => rule.min(0),
    }),
    defineField({
      name: 'notes',
      title: 'Notes',
      type: 'array',
      of: [defineArrayMember({ type: 'block' })],
    }),
    defineField({
      name: 'keyPoints',
      title: 'In this lesson you will',
      type: 'array',
      of: [{ type: 'string' }],
      validation: (rule) => rule.max(6),
    }),
    defineField({
      name: 'proTip',
      title: 'Pro tip',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'resources',
      title: 'Resources',
      type: 'array',
      of: [defineArrayMember({ type: 'lessonResource' })],
    }),
  ],
  preview: {
    select: { title: 'title', media: 'posterImage', subtitle: 'duration' },
  },
})
