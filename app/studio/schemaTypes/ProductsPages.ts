import { defineField, defineType } from "sanity";

export const ProductsPages = defineType({
    name: "PRODUCTS_PAGES",
    title: "Products Pages",
    type: "document",
    fields: [
        // Products Header
        defineField({
            name: "POS_System_Link",
            title: "Products Link",
            type: "string",
        }),
        // Products Subtitle
        defineField({
            name: "POS_System_Header",
            title: "Products",
            type: "string",
        }),
        // Products Description
        defineField({
            name: "POS_System_Description",
            title: "Products Description",
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
        // Products Image
        defineField({
            name: "POS_System_Image",
            title: "Products Image",
            type: "image",
        }),
        // Products Items
        defineField({
            name: "POS_System_Items",
            title: "Products Items",
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

        // Products Pricing Header
        defineField({
            name: "POS_System_Pricing_Header",
            title: "Products Pricing Header",
            type: "string",
        }),
        // Products Pricing Description
        defineField({
            name: "POS_System_Pricing_Description",
            title: "Products Pricing Description",
            type: "string",
        }),
        // Products Pricing Plans
        defineField({
            name: "POS_System_Pricing_Plans",
            title: "Products Pricing Plans",
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