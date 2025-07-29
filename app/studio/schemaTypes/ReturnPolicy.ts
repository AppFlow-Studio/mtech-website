import { defineField, defineType } from 'sanity'

export const ReturnPolicyType = defineType({
    name: 'ReturnPolicy',
    title: 'Return Policy',
    type: 'document',
    fields: [
        defineField({
            name: 'ReturnPolicy_Header',
            type: 'string',
        }),
        defineField({
            name: 'ReturnPolicy_Section',
            type: 'array',
            of: [{
                type: 'object', fields: [
                    defineField({
                        name: 'ReturnPolicy_Section_Header',
                        type: 'string',
                    }),
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
        }),

    ]
})