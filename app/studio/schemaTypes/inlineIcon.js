    // schemas/inlineIcon.js
    import { defineType } from 'sanity';
import { Star } from 'lucide-react';
    export default defineType({
      name: 'inlineIcon',
      title: 'Inline Icon',
      type: 'object',
      fields: [
        {
          name: 'iconName',
          title: 'Icon Name',
          type: 'string',
        },
      ],
      // This makes it a mark that can be applied to text
      marks: {
        decorators: [],
        annotations: [
          {
            name: 'inlineIconAnnotation',
            title: 'Inline Icon',
            type: 'object',
            fields: [{ name: 'icon', type: 'string' }],
            blockEditor: {
              icon: Star, // Icon in the Portable Text toolbar
              render: ({ children, value }) => {
                // You'll handle the actual icon rendering in your frontend
                return (
                  <span>
                    {value.icon && <Star />} {/* Example: Render the star icon */}
                    {children}
                  </span>
                );
              },
            },
          },
        ],
      },
    });