import { defineField, defineType } from "sanity";

export const Warranty = defineType({
    name: 'Warranty',
    title: 'Warranty',
    type: 'document',
    fields: [
        defineField({
            name: 'Warranty_Header',
            title: 'Warranty Header',
            type: 'string',
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'Warranty_SubText',
            title: 'Warranty SubText',
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
        })
    ]
})