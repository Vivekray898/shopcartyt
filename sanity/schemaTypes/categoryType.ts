import { defineField, defineType } from "sanity";
import { TagIcon } from "@sanity/icons";

export const categoryType = defineType({
  name: "category",
  title: "Category",
  type: "document",
  icon: TagIcon,
  fields: [
    defineField({
      name: "title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    // 🚀 NEW FIELD: Self-referencing link to create hierarchical trees
    defineField({
      name: "parent",
      title: "Parent Category",
      type: "reference",
      to: [{ type: "category" }],
      description: "Leave empty if this is a top-level parent category (e.g., 'Gartencenter'). Select a parent if this is a subcategory (e.g., 'Indoor Plants' -> parent: 'Gartencenter').",
      // Safety rule to prevent a category from selecting itself as its own parent
      validation: (Rule) =>
        Rule.custom((currentValue, context) => {
          if (currentValue?._ref && currentValue._ref === (context.document as any)?._id?.replace("drafts.", "")) {
            return "A category cannot be its own parent.";
          }
          return true;
        }),
    }),
    defineField({
      name: "description",
      type: "text",
    }),
    defineField({
      name: "range",
      type: "number",
      description: "Starting from",
    }),
    defineField({
      name: "featured",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "image",
      title: "Category Image",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
  ],
  // 🎨 UPDATED PREVIEW: Visualizes relationships directly in Studio desk lists
  preview: {
    select: {
      title: "title",
      parentTitle: "parent.title",
      media: "image",
    },
    prepare({ title, parentTitle, media }) {
      return {
        title: title,
        subtitle: parentTitle ? `➔ Subcategory of ${parentTitle}` : "🏠 Top-Level Main Category",
        media: media,
      };
    },
  },
});