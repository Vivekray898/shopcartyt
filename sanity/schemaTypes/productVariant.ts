import { defineField, defineType } from "sanity";
import { ComponentIcon } from "@sanity/icons";

export const productVariantType = defineType({
  name: "productVariant",
  title: "Product Types",
  type: "document",
  icon: ComponentIcon,
  fields: [
    defineField({
      name: "title",
      title: "Type Title",
      type: "string",
      description: "e.g., Electronics, Wooden Chairs, Custom Decor",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "description",
    },
  },
});