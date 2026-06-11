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
      description: "e.g., Summer Headphone Sale Promo (Used for internal tracking)",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "isFullBleedGraphic",
      title: "Is Full-Width Graphic? (No Overlapping Text)",
      type: "boolean",
      description: "Toggle ON if your uploaded image already has promo text edited inside it. This hides the structural HTML headline text entirely.",
      initialValue: false,
    }),
    defineField({
      name: "headline",
      title: "Banner Headline Text (Optional)",
      type: "string",
      description: "e.g., Grab Up to 50% off on Selected products",
      hidden: ({ parent }) => parent?.isFullBleedGraphic === true,
    }),
    defineField({
      name: "bannerImage",
      title: "Banner Background / Product Image",
      type: "image",
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "targetUrl",
      title: "Redirect Target Link / Route",
      type: "string",
      description: "The path a user visits when clicking the banner (e.g., /shop or /categories/electronics)",
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
});