import { HomeIcon } from "@sanity/icons"; // FIXED: Using valid Sanity building icon
import { defineField, defineType } from "sanity";

export const brandType = defineType({
  // Keep internal name as "brand" so frontend queries, filters, and state logic don't break!
  name: "brand", 
  title: "Shops & Outlets", // Changes the title header in Sanity Studio Sidebar
  type: "document",
  icon: HomeIcon, // Swapped to a valid registered icon asset
  fields: [
    defineField({
      name: "title",
      title: "Shop Name", // E.g., "Main Showroom", "Warehouse Outlet"
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Shop Archive URL Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Shop Profile / Location Details",
      type: "text",
      description: "Briefly describe this specific shop partition location or archive rules.",
    }),
    defineField({
      name: "image",
      title: "Shop Logo / Frontage Image",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "description",
      media: "image",
    },
  },
});