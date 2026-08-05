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
    // 🆕 Quick Links Section with editable header
    defineField({
      name: "quickLinksSection",
      title: "Quick Links Section",
      type: "object",
      fields: [
        defineField({
          name: "title",
          title: "Section Title",
          type: "string",
          description: "The heading for the Quick Links section",
          initialValue: "Quick Links",
        }),
        defineField({
          name: "links",
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
      ],
      preview: {
        select: {
          title: "title",
          subtitle: "links.length",
        },
        prepare({ title, subtitle }) {
          return {
            title: title || "Quick Links Section",
            subtitle: `${subtitle || 0} links`,
          };
        },
      },
    }),
    // 🆕 Categories Section with editable header
    defineField({
      name: "categoriesSection",
      title: "Categories Section",
      type: "object",
      fields: [
        defineField({
          name: "title",
          title: "Section Title",
          type: "string",
          description: "The heading for the Categories section",
          initialValue: "Categories",
        }),
        defineField({
          name: "links",
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
      ],
      preview: {
        select: {
          title: "title",
          subtitle: "links.length",
        },
        prepare({ title, subtitle }) {
          return {
            title: title || "Categories Section",
            subtitle: `${subtitle || 0} categories`,
          };
        },
      },
    }),
    // 🆕 Legal Links Field
    defineField({
      name: "legalLinks",
      title: "Legal Links (Footer Bottom)",
      type: "array",
      description: "Add legal links like AGB, Widerrufsrecht, Datenschutz, etc.",
      of: [
        {
          type: "object",
          fields: [
            defineField({ 
              name: "title", 
              title: "Title", 
              type: "string",
              description: "Display text (e.g., 'AGB', 'Widerrufsrecht')"
            }),
            defineField({ 
              name: "href", 
              title: "Link URL", 
              type: "url",
              description: "Full URL or relative path (e.g., '/terms', '/privacy')"
            }),
            defineField({
              name: "openInNewTab",
              title: "Open in New Tab",
              type: "boolean",
              description: "Whether to open this link in a new browser tab",
              initialValue: false,
            }),
          ],
          preview: {
            select: {
              title: "title",
              subtitle: "href",
            },
            prepare({ title, subtitle }) {
              return {
                title: title || "Untitled Link",
                subtitle: subtitle || "No URL set",
              };
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
      description: "Copyright text (e.g., '© 2026 Your Company. All rights reserved.')",
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