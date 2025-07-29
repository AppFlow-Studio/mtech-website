import { defineField, defineType } from 'sanity'

export const RateCardsType = defineType({
    name: 'RateCards',
    title: 'Rate Cards',
    type: 'document',
    fields: [
        defineField({
            name: 'RateCards',
            type: 'array',
            of: [{
                type: 'object', fields: [
                    // Header
                    defineField({
                        name: 'RateCards_Header',
                        type: 'string',
                    }),
                    // Rate
                    defineField({
                        name: 'RateCards_Rate',
                        type: 'string',
                    }),
                    // Description
                    defineField({
                        name: 'RateCards_Description',
                        type: 'string',
                    }),
                    // CTA
                    defineField({
                        name: 'RateCards_CTA',
                        type: 'string',
                    }),
                    // Is Featured
                    defineField({
                        name: 'RateCards_IsFeatured',
                        type: 'boolean',
                    }),
                    // Body
                    defineField({
                        name: 'ReturnPolicy_Section_Body',
                        type: 'array',
                        of: [
                            {
                                type: 'block',
                                styles: [
                                    { title: 'Normal', value: 'normal' },
                                    { title: 'H1', value: 'h1' },
                                    // ... other styles
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
                        ]
                    })
                ]
            }]
        })
    ]
})