import { defineField, defineType } from 'sanity'

export const POSSystemsType = defineType({
    name: 'POSSystems',
    title: 'POSSystems',
    type: 'document',
    fields: [
        defineField({
            name: 'Pos_Systems',
            type: 'array',
            of: [{
                type: 'object', fields: [
                    defineField({
                        name: 'POS_System_Header',
                        type: 'string',
                    }),
                    defineField({
                        name: 'POS_System_SubText',
                        type: 'string',
                    }),
                    defineField({
                        name: 'POS_System_Image',
                        type: 'image',
                    }),
                    defineField({
                        name: 'POS_System_Link',
                        type: 'string',
                    })]
            }
            ]
        }),
    ]
});