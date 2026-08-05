import { defineField, defineType } from "sanity";
import { 
  BlockElementIcon, 
  ImagesIcon, 
  TrolleyIcon, 
  ListIcon,
  TagIcon,
  ImageIcon,
  InfoFilledIcon,
  MenuIcon,
  StackIcon,
  DashboardIcon,
  ThListIcon,
  // Use these instead of OrderIcon
  ClipboardIcon,
  CheckCircleIcon
} from "@sanity/icons";

// 1. Hero Block Layout Schema
export const heroBlock = defineType({
  name: "heroBlock",
  title: "Hero Banner Section",
  type: "object",
  icon: ImagesIcon,
  fields: [
    defineField({ 
      name: "heading", 
      title: "Heading", 
      type: "string",
      validation: Rule => Rule.required()
    }),
    defineField({ 
      name: "subheading", 
      title: "Subheading", 
      type: "string" 
    }),
    defineField({ 
      name: "image", 
      title: "Background Image", 
      type: "image", 
      options: { hotspot: true },
      validation: Rule => Rule.required()
    }),
    defineField({ 
      name: "ctaLink", 
      title: "Button Redirect Link", 
      type: "string" 
    }),
    defineField({ 
      name: "ctaText", 
      title: "Button Text", 
      type: "string", 
      initialValue: "Explore More" 
    }),
    defineField({
      name: "breadcrumb",
      title: "Show Breadcrumb",
      type: "boolean",
      initialValue: true
    }),
    defineField({
      name: "decorations",
      title: "Show Decorative Elements",
      type: "boolean",
      initialValue: true
    })
  ],
});

// 2. Product Grid Block Schema
export const productGridBlock = defineType({
  name: "productGridBlock",
  title: "Product Grid Section",
  type: "object",
  icon: TrolleyIcon,
  fields: [
    defineField({ 
      name: "title", 
      title: "Section Title", 
      type: "string", 
      initialValue: "Featured Products" 
    }),
    defineField({
      name: "subtitle",
      title: "Section Subtitle",
      type: "string",
      initialValue: "Discover our curated collection"
    }),
    defineField({
      name: "products",
      title: "Select Products to Display",
      type: "array",
      of: [{ type: "reference", to: [{ type: "product" }] }],
    }),
    defineField({
      name: "gridColumns",
      title: "Grid Columns",
      type: "number",
      options: {
        list: [2, 3, 4, 5]
      },
      initialValue: 4
    }),
    defineField({
      name: "showViewAll",
      title: "Show View All Button",
      type: "boolean",
      initialValue: true
    })
  ],
});

// 3. Rich Text Content Block Schema
export const textContentBlock = defineType({
  name: "textContentBlock",
  title: "Rich Text Section",
  type: "object",
  icon: BlockElementIcon,
  fields: [
    defineField({ name: "title", title: "Section Title", type: "string" }),
    defineField({ 
      name: "content", 
      title: "Body Content", 
      type: "array", 
      of: [{ type: "block" }] 
    }),
    defineField({
      name: "layout",
      title: "Layout Style",
      type: "string",
      options: {
        list: [
          { title: "Default", value: "default" },
          { title: "Centered", value: "centered" },
          { title: "With Border", value: "bordered" }
        ]
      },
      initialValue: "default"
    })
  ],
});

// 4. Service Detail Block Schema
export const serviceDetailBlock = defineType({
  name: "serviceDetailBlock",
  title: "Service Detail Section",
  type: "object",
  icon: InfoFilledIcon,
  fields: [
    defineField({
      name: "title",
      title: "Service Title",
      type: "string",
      validation: Rule => Rule.required()
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      validation: Rule => Rule.required()
    }),
    defineField({
      name: "images",
      title: "Gallery Images",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }]
    }),
    defineField({
      name: "features",
      title: "Key Features",
      type: "array",
      of: [{ type: "string" }]
    }),
    defineField({
      name: "serviceTypes",
      title: "Service Types",
      type: "array",
      of: [
        defineField({
          name: "serviceType",
          title: "Service Type",
          type: "object",
          fields: [
            { name: "name", title: "Type Name", type: "string" },
            { name: "description", title: "Description", type: "text" }
          ]
        })
      ]
    }),
    defineField({
      name: "faqs",
      title: "Frequently Asked Questions",
      type: "array",
      of: [
        defineField({
          name: "faq",
          title: "FAQ",
          type: "object",
          fields: [
            { name: "question", title: "Question", type: "string" },
            { name: "answer", title: "Answer", type: "text" }
          ]
        })
      ]
    }),
    defineField({
      name: "amenities",
      title: "Amenities",
      type: "array",
      of: [
        defineField({
          name: "category",
          title: "Category",
          type: "object",
          fields: [
            { name: "name", title: "Category Name", type: "string" },
            {
              name: "items",
              title: "Items",
              type: "array",
              of: [
                defineField({
                  name: "item",
                  title: "Item",
                  type: "object",
                  fields: [
                    { name: "label", title: "Label", type: "string" },
                    { name: "description", title: "Description", type: "text" }
                  ]
                })
              ]
            }
          ]
        })
      ]
    })
  ]
});

// 5. Blog Posts Block Schema
export const blogPostsBlock = defineType({
  name: "blogPostsBlock",
  title: "Blog Posts Section",
  type: "object",
  icon: ListIcon,
  fields: [
    defineField({
      name: "title",
      title: "Section Title",
      type: "string",
      initialValue: "Latest Articles"
    }),
    defineField({
      name: "subtitle",
      title: "Section Subtitle",
      type: "string"
    }),
    defineField({
      name: "posts",
      title: "Select Blog Posts",
      type: "array",
      of: [{ type: "reference", to: [{ type: "blog" }] }]
    }),
    defineField({
      name: "showAllLink",
      title: "Show All Link",
      type: "string",
      placeholder: "/blog"
    })
  ]
});

// 6. Category Grid Block Schema
export const categoryGridBlock = defineType({
  name: "categoryGridBlock",
  title: "Category Grid Section",
  type: "object",
  icon: ThListIcon,
  fields: [
    defineField({
      name: "title",
      title: "Section Title",
      type: "string",
      initialValue: "Shop by Category"
    }),
    defineField({
      name: "categories",
      title: "Select Categories",
      type: "array",
      of: [{ type: "reference", to: [{ type: "category" }] }]
    })
  ]
});

// 7. Brand Showcase Block Schema
export const brandShowcaseBlock = defineType({
  name: "brandShowcaseBlock",
  title: "Brand Showcase Section",
  type: "object",
  icon: TagIcon,
  fields: [
    defineField({
      name: "title",
      title: "Section Title",
      type: "string",
      initialValue: "Top Brands"
    }),
    defineField({
      name: "brands",
      title: "Select Brands",
      type: "array",
      of: [{ type: "reference", to: [{ type: "brand" }] }]
    })
  ]
});

// 8. Call to Action Block Schema - Using ClipboardIcon instead of OrderIcon
export const ctaBlock = defineType({
  name: "ctaBlock",
  title: "Call to Action Section",
  type: "object",
  icon: ClipboardIcon, // Changed from OrderIcon to ClipboardIcon
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: Rule => Rule.required()
    }),
    defineField({
      name: "subtitle",
      title: "Subtitle",
      type: "text"
    }),
    defineField({
      name: "ctaText",
      title: "Button Text",
      type: "string",
      initialValue: "Subscribe Now"
    }),
    defineField({
      name: "ctaLink",
      title: "Button Link",
      type: "string"
    }),
    defineField({
      name: "backgroundImage",
      title: "Background Image",
      type: "image",
      options: { hotspot: true }
    })
  ]
});

// 9. Accordion/FAQ Block Schema
export const accordionBlock = defineType({
  name: "accordionBlock",
  title: "Accordion / FAQ Section",
  type: "object",
  icon: MenuIcon,
  fields: [
    defineField({
      name: "title",
      title: "Section Title",
      type: "string"
    }),
    defineField({
      name: "items",
      title: "Accordion Items",
      type: "array",
      of: [
        defineField({
          name: "item",
          title: "Item",
          type: "object",
          fields: [
            { name: "title", title: "Title", type: "string" },
            { name: "content", title: "Content", type: "text" }
          ]
        })
      ]
    }),
    defineField({
      name: "style",
      title: "Style",
      type: "string",
      options: {
        list: [
          { title: "Default", value: "default" },
          { title: "Bordered", value: "bordered" }
        ]
      },
      initialValue: "bordered"
    })
  ]
});

// 10. Image Gallery Block Schema
export const galleryBlock = defineType({
  name: "galleryBlock",
  title: "Image Gallery Section",
  type: "object",
  icon: ImageIcon,
  fields: [
    defineField({
      name: "title",
      title: "Section Title",
      type: "string"
    }),
    defineField({
      name: "images",
      title: "Gallery Images",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }]
    }),
    defineField({
      name: "columns",
      title: "Number of Columns",
      type: "number",
      options: {
        list: [2, 3, 4, 6]
      },
      initialValue: 3
    })
  ]
});

// Export all block types
export const pageBlocks = [
  heroBlock,
  productGridBlock,
  textContentBlock,
  serviceDetailBlock,
  blogPostsBlock,
  categoryGridBlock,
  brandShowcaseBlock,
  ctaBlock,
  accordionBlock,
  galleryBlock
];