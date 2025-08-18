import { defineField, defineType } from "sanity";

export const OurPartners = defineType({
    name: "ourPartners",
    title: "Our Partners",
    type: "document",
    fields: [
        defineField({
            name: "title",
            title: "Title",
            type: "string",
        }),
        defineField({
            name: "description",
            title: "Description",
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
            name: "partner_logos",
            title: "Partner Logos",
            type: "array",
            of: [
                {
                    type: "object",
                    fields: [
                        defineField({
                            name: "logo",
                            title: "Logo",
                            type: "image",
                        }),

                        defineField({
                            name: "name",
                            title: "Name",
                            type: "string",
                        }),

                        defineField({
                            name: "width",
                            title: "Width",
                            type: "number",
                        }),

                        defineField({
                            name: "height",
                            title: "Height",
                            type: "number",
                        }),
                    ]
                }
            ]
        }),

    ]
})