import { defineField, defineType } from "sanity";
import { BlockElementIcon, ImagesIcon, TrolleyIcon } from "@sanity/icons";

// 1. Hero Block Layout Schema
export const heroBlock = defineType({
  name: "heroBlock",
  title: "Hero Banner Section",
  type: "object",
  icon: ImagesIcon,
  fields: [
    defineField({ name: "heading", title: "Heading", type: "string" }),
    defineField({ name: "subheading", title: "Subheading", type: "string" }),
    defineField({ name: "image", title: "Background Image", type: "image", options: { hotspot: true } }),
    defineField({ name: "ctaLink", title: "Button Redirect Link", type: "string" }),
    defineField({ name: "ctaText", title: "Button Text", type: "string", initialValue: "Explore More" }),
  ],
});

// 2. Product Grid Showcase Block Schema
export const productGridBlock = defineType({
  name: "productGridBlock",
  title: "Product Grid Section",
  type: "object",
  icon: TrolleyIcon,
  fields: [
    defineField({ name: "title", title: "Section Title", type: "string", initialValue: "Featured Products" }),
    defineField({
      name: "products",
      title: "Select Products to Display",
      type: "array",
      of: [{ type: "reference", to: [{ type: "product" }] }],
    }),
  ],
});

// 3. Simple Rich Text Content Block Schema
export const textContentBlock = defineType({
  name: "textContentBlock",
  title: "Rich Text Section",
  type: "object",
  icon: BlockElementIcon,
  fields: [
    defineField({ name: "title", title: "Section Title", type: "string" }),
    defineField({ name: "content", title: "Body Content", type: "array", of: [{ type: "block" }] }),
  ],
});