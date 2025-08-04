import { defineField, defineType } from "sanity";

export const BusinessTypes = defineType({
    name: "BUSINESS_TYPES",
    title: "Business Types",
    type: "document",
    fields: [
        // Business Type Link (for routing)
        defineField({
            name: "business_type_link",
            title: "Business Type Link",
            type: "string",
            description: "The URL path for this business type (e.g., '/bakeries-and-delis')",
            validation: (Rule) => Rule.required(),
        }),

        // Business Type Title
        defineField({
            name: "title",
            title: "Business Type Title",
            type: "string",
            description: "The main title for this business type (e.g., 'Inventory Management')",
            validation: (Rule) => Rule.required(),
        }),

        // Business Type Image
        defineField({
            name: "imageSrc",
            title: "Business Type Image",
            type: "image",
            description: "The main image for this business type",
            options: {
                hotspot: true,
            },
        }),

        // Business Type Description
        defineField({
            name: "description",
            title: "Card Description",
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

        // Business Type Cards
        defineField({
            name: "cards",
            title: "Business Type Cards",
            type: "array",
            description: "Array of cards to display for this business type",
            of: [{
                type: "object",
                fields: [
                    defineField({
                        name: "title",
                        title: "Card Title",
                        type: "string",
                        description: "The title for this card",
                        validation: (Rule) => Rule.required(),
                    }),
                    defineField({
                        name: "description",
                        title: "Card Description",
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
                        name: "image",
                        title: "Card Image",
                        type: "image",
                        description: "The image for this card",
                        options: {
                            hotspot: true,
                        },
                        validation: (Rule) => Rule.required(),
                    }),
                    defineField({
                        name: "features",
                        title: "Card Features",
                        type: "array",
                        of: [
                            {
                                type: "object",
                                fields: [
                                    {
                                        name: "name",
                                        title: "Feature Name",
                                        type: "string",
                                    },
                                    {
                                        name: "description",
                                        title: "Feature Description",
                                        type: "string",
                                    },
                                ],
                            },
                        ],
                    }),
                    // Call to Action
                    defineField({
                        name: "cta",
                        title: "Call to Action Text",
                        type: "string",
                        description: "The text for the call-to-action button (e.g., 'Talk to an Expert')",
                        validation: (Rule) => Rule.required(),
                    }),

                ],
                preview: {
                    select: {
                        title: 'card_title',
                        subtitle: 'card_description',
                        media: 'card_image',
                    },
                },
            }],
            validation: (Rule) => Rule.required().min(1),
        }),

        // Business Type Picture Cards (Horizontal Layout)
        defineField({
            name: "picture_cards",
            title: "Business Type Picture Cards",
            type: "array",
            description: "Array of picture cards to display horizontally (like the gas station cards)",
            of: [{
                type: "image",
            }],
            validation: (Rule) => Rule.required().min(1),
        }),


        // SEO Fields
        defineField({
            name: "seo_title",
            title: "SEO Title",
            type: "string",
            description: "SEO optimized title for search engines",
        }),

        defineField({
            name: "seo_description",
            title: "SEO Description",
            type: "text",
            description: "SEO optimized description for search engines",
        }),

        // Meta Fields
        defineField({
            name: "is_active",
            title: "Is Active",
            type: "boolean",
            description: "Whether this business type is currently active and should be displayed",
            initialValue: true,
        }),

        defineField({
            name: "sort_order",
            title: "Sort Order",
            type: "number",
            description: "Order in which this business type should appear in lists",
            initialValue: 0,
        }),
    ],

    preview: {
        select: {
            title: 'title',
            subtitle: 'business_type_link',
            media: 'imageSrc',
        },
        prepare(selection) {
            const { title, subtitle, media } = selection;
            return {
                title: title || 'Untitled Business Type',
                subtitle: subtitle ? `Path: ${subtitle}` : 'No path set',
                media: media,
            };
        },
    },

    orderings: [
        {
            title: 'Sort Order',
            name: 'sortOrderAsc',
            by: [{ field: 'sort_order', direction: 'asc' }],
        },
        {
            title: 'Title A-Z',
            name: 'titleAsc',
            by: [{ field: 'title', direction: 'asc' }],
        },
    ],
});