import { defineField, defineType } from "sanity";

export const DualPricing = defineType({
  name: "DualPricing",
  title: "Dual Pricing",
  type: "document",
  fields: [
    defineField({
        name: "DualPricing_Link",
        title: "Dual Pricing Link",
        type: "string",
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
    }),
    defineField({
        name: "DualPricing_Badge",
        title: "Dual Pricing Badge",
        type: "string",
    }),
    defineField({
        name: "DualPricing_Description",
        title: "Dual Pricing Description",
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
        name: "DualPricing_Image",
        title: "Dual Pricing Image",
        type: "image",
    }),
    defineField({
        name: "DualPricing_Second_Section_Description",
        title: "Dual Pricing Second Section Description",
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
    })
  ],
});