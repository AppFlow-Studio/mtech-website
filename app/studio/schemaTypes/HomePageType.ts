import { defineField, defineType } from 'sanity'

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
          type: 'string',
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: 'Insights_Section_SubText',
          type: 'string',
        }),
        defineField({
          name: 'Insights_Section_Image',
          type: 'array',
          of: [{
            type: 'object', fields: [
              defineField({
                name: 'Insight_Title',
                type: 'string',
                validation: (rule) => rule.required(),
              }),
              defineField({
                name: 'Insight_Description',
                type: 'string',
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