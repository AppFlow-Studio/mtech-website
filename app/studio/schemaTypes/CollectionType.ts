import { defineType, defineField } from "sanity";

export const CollectionType = defineType({
  name: "collection",
  title: "Collection",
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
      type: "text",
    }),
    defineField({
      name: "cards",
      title: "Cards",
      type: "array",
      of: [
        {
            type: "object",
            fields: [
                defineField({
                    name: "title",
                    title: "Title",
                    type: "string",       
                  }),
                  defineField({
                    name: "imageSrc",
                    title: "Image Source",
                    type: "image",
                  }),
                  defineField({
                    name: "isNew",
                    title: "Is New",
                    type: "boolean",
                  }),
                  defineField({
                    title: "Link Tags",
                    name: "linkTags",
                    type: "array",
                    of: [{ type: "string" }],
                    options: {
                      list: [
                        { title: "ATM Machines", value: "atm machines" },
                        { title: "POS System", value: "pos system" },
                        { title: "Credit Card Terminals", value: "credit card terminals" },
                        { title: "Network Devices", value: "network devices" },
                      ],
                      layout: "grid",
                      direction: "horizontal"
                    }
                  }),
            ],
        },
      ],
    }),
  ],
});