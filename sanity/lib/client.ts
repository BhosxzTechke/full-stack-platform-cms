import { createClient } from 'next-sanity'

import { apiVersion, dataset, projectId } from '../env'

// Server-only: the dataset is private, so every read needs this token.
// Never import this client from a 'use client' component.
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token: process.env.SANITY_API_READ_TOKEN,
  useCdn: true, // Set to false if statically generating pages, using ISR or tag-based revalidation
})
