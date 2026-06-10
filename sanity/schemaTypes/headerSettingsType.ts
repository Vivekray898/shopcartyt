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
              title: "Href",
              type: "url",
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
          name: "label",
          title: "Label",
          type: "string",
        }),
        defineField({
          name: "href",
          title: "Href",
          type: "url",
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: "navigationLinks.0.title",
      subtitle: "callToAction.label",
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
