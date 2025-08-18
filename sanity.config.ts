import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from '@/app/studio/schemaTypes'
import { presentationTool } from "sanity/presentation";
import { IconManager } from 'sanity-plugin-icon-manager'

export default defineConfig({
  name: 'default',
  title: 'MTech Website',
  basePath: '/studio',

  projectId: 'nqlvhyrn',
  dataset: 'production',

  plugins: [
    structureTool(),
    visionTool(),
    IconManager(
      {
        customPalette: [
          {
            hex: '#AB87FF',
            title: 'Tropical Indigo',
          },
          {
            hex: '#B4E1FF',
            title: 'Uranian Blue',
          },
          {
            hex: '#F49E4C',
            title: 'Sandy brown',
          },
          {
            hex: '#2D728F',
            title: 'Cerulean',
          },
          {
            hex: '#C14953',
            title: 'Bittersweet shimmer',
          },
          {
            hex: '#AEA4BF',
            title: 'Rose quartz',
          },
          {
            hex: '#02C39A',
            title: 'Mint',
          },
          {
            hex : '#380D52',
            title : 'Purple'
          },
          {
            hex : '#000000',
            title : 'Black'
          },
          {
            hex : '#FFFFFF',
            title : 'White'
          },
        ]
      }
    ),
    presentationTool({
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
