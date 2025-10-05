import { defineField, defineType } from 'sanity'
import { mediaPreview } from 'sanity-plugin-icon-manager'
import { createClient } from '@/utils/supabase/server'
import TagSelector from './components/TagSelector'
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

    defineField({
      name: "Hero_Cards",
      title: "Hero Cards",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "title",
              title: "Title",
              type: "string",
            }),
            defineField({
              name: "imageSrc",
              title: "Image Source",
              type: "image",
            }),
            defineField({
              name: "CTA_Text",
              title: "CTA Text",
              type: "string",
            }),
            defineField({
              title: "Link Tags",
              name: "linkTags",
              type: "array",
              of: [{ type: "string" }],
              components: {
                input: TagSelector,
              },
              // options: {
              //   list: [],
              //   // async () => {
              //   //   try {
              //   //     const supabase = await createClient()
              //   //     const { data: tags, error } = await supabase.from('tags').select('name, id')

              //   //     return tags?.map((tag) => ({ title: tag.name, value: tag.id })) || []
              //   //   } catch (error) {
              //   //     console.error(error)
              //   //     return [{ title: 'Could not load vendors', value: '' }]
              //   //   }
              //   // },
              //   layout: "grid",
              //   direction: "horizontal"
              // },
              // [
              //   { title: "POS System", value: "pos system" },
              //   { title: "ATM Machines", value: "atm machines" },
              //   { title: "ATM Parts & Components", value: "atm parts" },
              //   { title: "POS Accessories", value: "pos accessories" },
              //   { title: "Digital Scales", value: "scales" },
              //   { title: "ATM Signage Solutions", value: "atm signage" },
              //   { title: "ATM Card Terminals", value: "credit card terminals" },
              //   { title: "Credit Card Terminals", value: "credit card terminals" },
              //   { title: "Network Devices", value: "network devices" },
              // ],

            })
          ],
        },
      ]
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

    // Merchant Portal
    defineField({
      name: 'Merchant_Portal',
      type: 'object',
      fields: [
        defineField({
          name: 'Merchant_Portal_Title',
          title: 'Merchant Portal Title',
          type: 'string',
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: "Merchant_Portal_SubText",
          title: "Merchant Portal SubText",
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
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: 'Merchant_Portal_Image',
          title: 'Merchant Portal Image',
          type: 'image',
        }),
        defineField({
          name: 'Merchant_Portal_Button_Text',
          title: 'Merchant Portal Button Text',
          type: 'string',
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: 'Merchant_Portal_Button_Link',
          title: 'Merchant Portal Button Link',
          type: 'url',
          validation: (rule) => rule.required(),
        }),
      ]
    })
  ],
})

// {
//   title: "Payment Processing & Management",
//   description:
//     "Efficiently manage transactions, track payments, and streamline your financial workflows with our secure payment processing solutions.",
//   imageSrc: "/features/feature-1-payment.png",
// },