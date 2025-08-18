import { defineField, defineType } from 'sanity'
import { mediaPreview } from 'sanity-plugin-icon-manager'

export const HomePageType = defineType({
  name: 'Home_Page',
  title: 'Home_Page',
  type: 'document',
  fields: [
    //Hero Header
    defineField({
      name: 'Hero_Header',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    //Hero SubText
    defineField({
      name: 'Hero_SubText',
      type: 'string',
      validation: (rule) => rule.required(),
    }),

    //Why Choose Us
    defineField({
      name: 'Why_Choose_Us',
      type: 'object',
      fields: [
        defineField({
          name: 'Why_Choose_Us_Header',
          type: 'string',
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: 'Why_Choose_Us_SubText',
          type: 'string',
        }),
        defineField({
          name: 'Why_Choose_Us_Image',
          type: 'image',
          validation: (rule) => rule.required(),
        }),
      ]
    }),

    //Features Card Proccessing
    defineField({
      name: 'Features_Card',
      type: 'array',
      of: [{
        type: 'object', fields: [
          defineField({
            name: 'title',
            type: 'string',
            validation: (rule) => rule.required(),
          }),
          defineField({
            name: 'description',
            type: 'string',
            validation: (rule) => rule.required(),
          }),
          defineField({
            name: 'imageSrc',
            type: 'image',
            validation: (rule) => rule.required(),
          }),
        ]
      }]
    }),

    // Growth Section
    defineField({
      name: 'Growth_Section',
      type: 'object',
      fields: [
        defineField({
          name: 'Growth_Section_Header',
          type: 'string',
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: 'Growth_Section_SubText',
          type: 'string',
        }),
        defineField({
          name: 'Growth_Section_Image',
          type: 'image',
          validation: (rule) => rule.required(),
        }),
      ]
    }),

    //Features Card Transparent
    defineField({
      name: 'Features_Business',
      type: 'array',
      of: [{
        type: 'object', fields: [
          defineField({
            name: 'title',
            type: 'string',
            validation: (rule) => rule.required(),
          }),
          defineField({
            name: 'description',
            type: 'string',
            validation: (rule) => rule.required(),
          }),
          defineField({
            name: 'imageSrc',
            type: 'image',
            validation: (rule) => rule.required(),
          }),
        ]
      }]
    }),

    //Features Card Business
    defineField({
      name: 'Modern_Payments',
      type: 'object',
      fields: [
        defineField({
          name: 'Modern_Title',
          type: 'string',
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: 'Modern_Description',
          type: 'string',
        }),
        defineField({
          name: 'Modern_Image',
          type: 'image',
          validation: (rule) => rule.required(),
        }),
      ]
    }),

    //Modern Payments Intro
    defineField({
      name: 'Features_Payments',
      type: 'array',
      of: [{
        type: 'object', fields: [
          defineField({
            name: 'title',
            type: 'string',
            validation: (rule) => rule.required(),
          }),
          defineField({
            name: 'description',
            type: 'string',
            validation: (rule) => rule.required(),
          }),
          defineField({
            name: 'imageSrc',
            type: 'image',
            validation: (rule) => rule.required(),
          }),
        ]
      }]
    }),

    //Insights Section
    defineField({
      name: 'Insights_Section',
      type: 'object',
      fields: [
        defineField({
          name: 'Insights_Section_Header',
          title: 'Insights Section Header',
          type: 'string',
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: "Insights_Section_SubText",
          title: "Insights Section Subtext",
          type: 'array',
          of: [
            {
              type: 'block',
              styles: [
                { title: 'Normal', value: 'normal' },
                { title: 'H1', value: 'h1' },
                { title: 'H2', value: 'h2' },
                { title: 'H3', value: 'h3' },
                { title: 'H4', value: 'h4' },
                { title: 'H5', value: 'h5' },
                { title: 'H6', value: 'h6' },
              ],
              lists: [{ title: 'Bullet', value: 'bullet' }],
              marks: {
                decorators: [
                  { title: 'Strong', value: 'strong' },
                  { title: 'Emphasis', value: 'em' },
                ],

                annotations: [
                  {
                    name: 'link',
                    type: 'object',
                    title: 'URL',
                    fields: [
                      {
                        title: 'URL',
                        name: 'href',
                        type: 'url',
                      },
                    ],
                  },
                ],
              },
            }
          ],
        }),
        defineField({
          name: 'Insights_Section_Cards',
          type: 'array',
          of: [{
            type: 'object',
            preview: {
              select: {
                // ...
                icon: 'icon'
              },
              prepare({ icon, ...rest }) {
                return {
                  // ...rest
                  media: mediaPreview(icon)
                }
              }
            },
            fields: [
              defineField({
                type: 'icon.manager',
                name: 'icon',
                title: 'Icon',
              }),
              defineField({
                title: 'Title',
                name: 'Title',
                type: 'string',
                validation: (rule) => rule.required(),
              }),
              defineField({
                title: 'Description',
                name: 'Description',
                type: 'string',
                validation: (rule) => rule.required(),
              }),
              defineField({
                title: 'Image',
                name: 'imageSrc',
                type: 'image',
                validation: (rule) => rule.required(),
              }),
            ]
          }]
        }),
      ]
    }),

  ],
})

// {
//   title: "Payment Processing & Management",
//   description:
//     "Efficiently manage transactions, track payments, and streamline your financial workflows with our secure payment processing solutions.",
//   imageSrc: "/features/feature-1-payment.png",
// },