import { defineField, defineType } from 'sanity'

export const TestimonialTypes = defineType({
    name: 'Testimonial',
    title: 'Testimonial',
    type: 'document',
    fields: [
        defineField({
            name: 'Testimonial_Header',
            type: 'string',
        }),
        defineField({
            name: 'Testimonial_Cards',
            type: 'array',
            of: [{
                type: 'object', fields: [
                    defineField({
                        name: 'Testimonial_Card_Review',
                        type: 'string',
                    }),
                    defineField({
                        name: 'Testimonial_Card_Rating',
                        type: 'number',
                    }),
                    defineField({
                        name: 'Testimonial_Card_Author',
                        type: 'string',
                    }),
                    defineField({
                        name: 'Testimonial_Card_SubText',
                        type: 'string',
                    }),
                    defineField({
                        name: 'Testimonial_Card_Image',
                        type: 'image',
                    }),
                ]
            }]
        }),
    ]
})