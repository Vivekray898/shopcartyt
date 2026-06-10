import { DocumentIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const siteSettingsType = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  icon: DocumentIcon,
  fields: [
    defineField({
      name: "catalogueMode",
      title: "Catalogue Mode",
      type: "boolean",
      description: "When enabled, cart and checkout functionality is disabled and products are shown as catalogue-only.",
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      catalogueMode: "catalogueMode",
    },
    prepare(selection) {
      const { catalogueMode } = selection;
      return {
        title: `Catalogue Mode: ${catalogueMode ? "Enabled" : "Disabled"}`,
      };
    },
  },
});
