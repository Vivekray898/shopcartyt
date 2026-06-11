import { defineField, defineType } from "sanity";
import { DocumentIcon } from "@sanity/icons";

export const pageType = defineType({
  name: "page",
  title: "Pages (No-Code Builder)",
  type: "document",
  icon: DocumentIcon,
  fields: [
    defineField({
      name: "title",
      title: "Page Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "URL Slug / Path",
      type: "slug",
      description: "e.g., 'about-us' or 'summer-clearance'. Do not include slashes.",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "pageBuilder",
      title: "Construct Page Sections",
      description: "Add, delete, or drag-and-drop structural sections to build your layout.",
      type: "array",
      of: [
        { type: "heroBlock" },
        { type: "productGridBlock" },
        { type: "textContentBlock" },
      ],
    }),
  ],
});