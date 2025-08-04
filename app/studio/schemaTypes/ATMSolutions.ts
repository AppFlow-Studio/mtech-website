import { defineField, defineType } from "sanity";

export const ATMSolutions = defineType({
  name: "ATMSolutions",
  title: "ATM Solutions",
  type: "document",
  fields: [
    defineField({
        name: "ATM_Solutions_Link",
        title: "ATM Solutions Link",
        type: "string",
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
    }),
    defineField({
        name: "ATM_Solutions_Description",
        title: "ATM Solutions Description",
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
        name: "ATM_Solutions_Image",
        title: "ATM Solutions Image",
        type: "image",
    }),
    defineField({
        name: "ATM_Solutions_Second_Section_Description",
        title: "ATM Solutions Second Section Description",
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