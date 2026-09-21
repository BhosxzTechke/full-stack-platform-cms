import { visionTool } from '@sanity/vision'
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'

import { schema } from './schemaTypes'
import { structure } from './structure'

const projectId = process.env.SANITY_STUDIO_PROJECT_ID
const dataset = process.env.SANITY_STUDIO_DATASET

if (!projectId || !dataset) {
  throw new Error(
    'Missing SANITY_STUDIO_PROJECT_ID or SANITY_STUDIO_DATASET — set them in studio/.env'
  )
}

export default defineConfig({
  name: 'vertex',
  title: 'Vertex',
  projectId,
  dataset,
  schema,
  plugins: [structureTool({ structure }), visionTool()],
})
