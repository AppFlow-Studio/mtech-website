import { defineField, defineType } from "sanity";

export const POSSystemTypes = defineType({
    name: "POS_SYSTEM_TYPES",
    title: "POS System Types",
    type: "document",
    fields: [
        // POS System Header
        defineField({
            name: "POS_System_Link",
            title: "POS System Link",
            type: "string",
        }),
        // POS System Subtitle
        defineField({
            name: "POS_System_Header",
            title: "POS System",
            type: "string",
        }),
        // POS System Description
        defineField({
            name: "POS_System_Description",
            title: "POS System Description",
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
            ],
        }),
        // POS System Image
        defineField({
            name: "POS_System_Image",
            title: "POS System Image",
            type: "image",
        }),
        // POS System Items
        defineField({
            name: "POS_System_Items",
            title: "POS System Items",
            type: "array",
            of: [{
                type: "object",
                fields: [
                    defineField({
                        name: "name",
                        title: "Name",
                        type: "string",
                    }),
                    defineField({
                        name: "description",
                        title: "Description",
                        type: "string",
                    }),
                    defineField({
                        name: "imageSrc",
                        title: "Image",
                        type: "image",
                    }),
                    defineField({
                        name: "link",
                        title: "Link",
                        type: "string",
                    }),
                    defineField({
                        name: "inStock",
                        title: "In Stock",
                        type: "boolean",
                    }),
                    defineField({
                        name: "tags",
                        title: "Tags",
                        type: "array",
                        of: [{ type: "string" }],
                    }),
                ]
            }],
        }),

        // POS System Pricing Header
        defineField({
            name: "POS_System_Pricing_Header",
            title: "POS System Pricing Header",
            type: "string",
        }),
        // POS System Pricing Description
        defineField({
            name: "POS_System_Pricing_Description",
            title: "POS System Pricing Description",
            type: "string",
        }),
        // POS System Pricing Plans
        defineField({
            name: "POS_System_Pricing_Plans",
            title: "POS System Pricing Plans",
            type: "array",
            of: [{
                type: "object",
                fields: [
                    defineField({
                        name: "name",
                        title: "Name",
                        type: "string",
                    }),
                    defineField({
                        name: "price",
                        title: "Price",
                        type: "number",
                    }),
                    defineField({
                        name: "priceSuffix",
                        title: "Price Suffix",
                        type: "string",
                    }),
                    defineField({
                        name: "description",
                        title: "Description",
                        type: "string",
                    }),
                    defineField({
                        name: "ctaText",
                        title: "CTA Text",
                        type: "string",
                    }),
                    defineField({
                        name: "isFeatured",
                        title: "Is Featured",
                        type: "boolean",
                    }),
                    defineField({
                        name: "features",
                        title: "Features",
                        type: "array",
                        of: [{ type: "string" }],
                    }),
                ]
            }]
        })
    ]
});