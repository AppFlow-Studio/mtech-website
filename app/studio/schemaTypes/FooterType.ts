import { defineField, defineType } from 'sanity'

export const FooterType = defineType({
  name: 'Footer',
  title: 'Footer',
  type: 'document',
  fields: [
    
    //Logo
    defineField({
      name: 'Footer_Logo',
      type: 'image',
    }),

    //Description
    defineField({
      name: 'Footer_Description',
      type: 'string',
    }),

    //Socials
    defineField({   
      name: 'Footer_Socials',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          defineField({
            name: 'Footer_Social_Icon',
            type: 'string',
          }),
          defineField({
            name: 'Footer_Social_Link',
            type: 'string',
          }),
        ],
      }],
    }),

    //Product Links
    defineField({
      name: 'Footer_Product_Links',
      type: 'array',
      of: [{
        type: 'object',
        fields: [   
          defineField({
            name: 'Footer_Product_Link_Name',
            type: 'string',
          }),
          defineField({
            name: 'Footer_Product_Link_Url',
            type: 'string', 
          }),
        ],
      }],
    }),

    //Resource Links
    defineField({
      name: 'Footer_Resource_Links',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          defineField({
            name: 'Footer_Resource_Link_Name',
            type: 'string',
          }),  
          defineField({
            name: 'Footer_Resource_Link_Url',
            type: 'string',
          }),
        ],
      }],
    }),
    //Contact Links
    defineField({
      name: 'Footer_Contact_Links',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          defineField({
            name: 'Footer_Resource_Link_Icon',
            type: 'string',
          }),
          defineField({
            name: 'Footer_Contact_Link_Name',
            type: 'string',
          }),
          defineField({
            name: 'Footer_Contact_Link_Url',
            type: 'string',
          }),
        ],
      }],
    }),
  ],

});