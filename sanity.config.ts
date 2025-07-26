import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from '@/app/studio/schemaTypes'
import { presentationTool } from "sanity/presentation";

export default defineConfig({
  name: 'default',
  title: 'MTech Website',
  basePath: '/studio',

  projectId: 'nqlvhyrn',
  dataset: 'production',

  plugins: [structureTool(), visionTool(), presentationTool({
    previewUrl: {
      origin: process.env.SANITY_STUDIO_PREVIEW_ORIGIN,
      preview: "/",
      previewMode: {
        enable: "/api/draft-mode/enable",
      },
    },
  }),],

  schema: {
    types: schemaTypes,
  },
})
