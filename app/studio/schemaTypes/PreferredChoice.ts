import { defineField, defineType } from "sanity";
import { mediaPreview } from 'sanity-plugin-icon-manager'

export const PreferredChoice = defineType({
    name: 'PreferredChoice',
    title: 'Preferred Choice',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Title',
            type: 'string',
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
            name: 'rows',
            title: 'Rows',
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
                        validation: (rule) => rule.required(),

                    }),
                    defineField({
                        name: 'feature',
                        title: 'Feature',
                        type: 'string',
                        validation: (rule) => rule.required(),
                    }),
                    defineField({
                        name: 'mtech',
                        title: 'Mtech',
                        type: 'boolean',
                        validation: (rule) => rule.required(),
                    }),
                    defineField({
                        name: 'others',
                        title: 'Others',
                        type: 'boolean',
                        validation: (rule) => rule.required(),
                    })
                ]
            }],
        })
    ]
})