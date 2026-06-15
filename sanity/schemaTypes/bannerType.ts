import { defineField, defineType } from "sanity";
import { ImagesIcon } from "@sanity/icons";

export const bannerType = defineType({
  name: "banner",
  title: "Home Banner",
  type: "document",
  icon: ImagesIcon,
  fields: [
    defineField({
      name: "title",
      title: "Banner Administrative Title",
      type: "string",
      description: "e.g., Summer Special Promo (Used for internal tracking)",
      validation: (Rule) => Rule.required(),
    }),
    // 🚀 NEW FIELD: Priority controller to handle arrangement hierarchy
    defineField({
      name: "priority",
      title: "Banner Display Priority (0 - 10)",
      type: "number",
      description: "Higher numbers show first (e.g., 10 is top priority, 0 is baseline fallback).",
      initialValue: 0,
      validation: (Rule) => Rule.min(0).max(10).integer(),
    }),
    defineField({
      name: "isFullBleedGraphic",
      title: "Is Full-Width Graphic? (No Overlapping Text)",
      type: "boolean",
      description: "Toggle ON if your uploaded images already have promo text designed inside them. This hides the structural HTML text elements entirely.",
      initialValue: false,
    }),
    defineField({
      name: "headline",
      title: "Banner Headline Text (Optional)",
      type: "string",
      description: "e.g., Grab Up to 50% off on Selected products",
      hidden: ({ parent }) => parent?.isFullBleedGraphic === true,
    }),
    // 🖥️ UPDATED FIELD: Explicitly designated for Desktop viewports
    defineField({
      name: "desktopImage",
      title: "Desktop Banner Image",
      type: "image",
      description: "Optimized wide image for computers. Full-Bleed size: 1920x540px | Split Badge size: 800x800px (1:1 Square)",
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    // 📱 NEW FIELD: Explicitly designated for Mobile viewports
    defineField({
      name: "mobileImage",
      title: "Mobile Banner Image (Optional)",
      type: "image",
      description: "If left blank, the desktop image will be scaled down. Ideal Full-Bleed mobile aspect ratio size: 750x1000px (Vertical Stack).",
      options: { hotspot: true },
    }),
    defineField({
      name: "targetUrl",
      title: "Redirect Target Link / Route",
      type: "string",
      description: "The path a user visits when clicking the banner (e.g., /shop)",
      initialValue: "/shop",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "buttonText",
      title: "Action Button Text",
      type: "string",
      initialValue: "Buy Now",
      hidden: ({ parent }) => parent?.isFullBleedGraphic === true,
    }),
    defineField({
      name: "backgroundColor",
      title: "Banner Container Background Hex Code",
      type: "string",
      description: "e.g., #FCE4EC (Defaults to your custom light pink theme if left empty)",
    }),
  ],
  // Sets up the preview string mapping inside your Sanity Studio desk lists
  preview: {
    select: {
      title: "title",
      priority: "priority",
      media: "desktopImage",
    },
    prepare({ title, priority, media }) {
      return {
        title: title,
        subtitle: `Priority: ${priority ?? 0}/10`,
        media: media,
      };
    },
  },
});