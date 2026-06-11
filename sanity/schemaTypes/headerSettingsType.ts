import { DocumentIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const headerSettingsType = defineType({
  name: "headerSettings",
  title: "Header Settings",
  type: "document",
  icon: DocumentIcon,
  fields: [
    defineField({
      name: "logo",
      title: "Logo",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "navigationLinks",
      title: "Navigation Links",
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
              name: "href",
              title: "Href / Route Path",
              type: "string", // Kept as string to support /shop routes cleanly
              description: "Accepts absolute URLs (e.g., https://google.com) or internal relative paths (e.g., /shop, /blog)",
            }),
          ],
          preview: {
            select: {
              title: "title",
              subtitle: "href",
            },
          },
        },
      ],
    }),
    defineField({
      name: "callToAction",
      title: "Call To Action",
      type: "object",
      fields: [
        defineField({
          // FIXED: Renamed from 'label' back to 'text' to match database and frontend queries
          name: "text", 
          title: "Label / Text",
          type: "string",
        }),
        defineField({
          // FIXED: Renamed from 'href' back to 'url' to match database and frontend queries
          name: "url", 
          title: "Href / Route Path",
          type: "string", 
          description: "Supports relative paths like /shop or absolute external links",
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: "navigationLinks.0.title",
      subtitle: "callToAction.text", // Updated fallback to match text
    },
    prepare(selection) {
      const { title, subtitle } = selection;
      return {
        title: title || "Header Settings",
        subtitle: subtitle ? `CTA: ${subtitle}` : "Header configuration",
      };
    },
  },
});