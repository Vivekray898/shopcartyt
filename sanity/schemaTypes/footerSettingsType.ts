// sanity/schemaTypes/footerSettingsType.ts
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
      name: "storeLocations",
      title: "Store Locations",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "name", title: "Store Name", type: "string" }),
            defineField({ name: "address", title: "Address", type: "string" }),
            defineField({ name: "city", title: "City", type: "string" }),
            defineField({ name: "phone", title: "Phone", type: "string" }),
            defineField({ name: "email", title: "Email", type: "string" }),
            defineField({ name: "hours", title: "Business Hours", type: "string" }),
            defineField({ 
              name: "embedUrl", 
              title: "Google Maps Embed URL", 
              type: "url",
              description: "Get this from Google Maps > Share > Embed map"
            }),
            defineField({ 
              name: "mapsUrl", 
              title: "Google Maps Directions URL", 
              type: "url",
              description: "Get this from Google Maps > Share > Copy link"
            }),
            defineField({ 
              name: "featured", 
              title: "Featured Location", 
              type: "boolean",
              description: "Show this location prominently"
            }),
          ],
          preview: {
            select: {
              title: "name",
              subtitle: "address",
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