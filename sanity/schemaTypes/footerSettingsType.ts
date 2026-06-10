import { DocumentIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const footerSettingsType = defineType({
  name: "footerSettings",
  title: "Footer Settings",
  type: "document",
  icon: DocumentIcon,
  fields: [
    defineField({
      name: "contactItems",
      title: "Contact Items",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "title", title: "Title", type: "string" }),
            defineField({ name: "subtitle", title: "Subtitle", type: "string" }),
            defineField({ name: "icon", title: "Icon", type: "string" }),
          ],
          preview: {
            select: {
              title: "title",
              subtitle: "subtitle",
            },
          },
        },
      ],
    }),
    defineField({
      name: "quickLinks",
      title: "Quick Links",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "title", title: "Title", type: "string" }),
            defineField({ name: "href", title: "Href", type: "url" }),
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
      name: "categories",
      title: "Categories",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "title", title: "Title", type: "string" }),
            defineField({ name: "href", title: "Href", type: "url" }),
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
      name: "logo",
      title: "Logo",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "tagline",
      title: "Tagline",
      type: "string",
    }),
    defineField({
      name: "footerBottomText",
      title: "Footer Bottom Text",
      type: "string",
    }),
    defineField({
      name: "socialLinks",
      title: "Social Links",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "platform", title: "Platform", type: "string" }),
            defineField({ name: "url", title: "URL", type: "url" }),
          ],
          preview: {
            select: {
              title: "platform",
              subtitle: "url",
            },
          },
        },
      ],
    }),
    defineField({
      name: "newsletterText",
      title: "Newsletter Text",
      type: "string",
    }),
  ],
  preview: {
    select: {
      title: "tagline",
      subtitle: "footerBottomText",
    },
    prepare(selection) {
      const { title, subtitle } = selection;
      return {
        title: "Footer Settings",
        subtitle: subtitle || title || "Footer configuration",
      };
    },
  },
});
