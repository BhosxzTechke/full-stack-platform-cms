/**
 * This configuration file lets you run `$ sanity [command]` in this folder.
 * Go to https://www.sanity.io/docs/cli to learn more.
 **/
import { defineCliConfig } from 'sanity/cli'

const projectId = process.env.SANITY_STUDIO_PROJECT_ID
const dataset = process.env.SANITY_STUDIO_DATASET

export default defineCliConfig({
  api: { projectId, dataset },
  deployment: {
    appId: 'hhkwai73hmt4rmu8oacgt2n2',
  },
  typegen: {
    // Queries live in the web app's sanity/lib folder, one level up.
    path: '../sanity/lib/**/*.{ts,tsx}',
    schema: 'schema.json',
    generates: '../sanity.types.ts',
    overloadClientMethods: true,
  },
})
