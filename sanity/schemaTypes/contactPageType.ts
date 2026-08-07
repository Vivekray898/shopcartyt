// sanity/schemaTypes/contactPageType.ts
import { defineField, defineType } from "sanity";
import { EnvelopeIcon, MapPinIcon, PhoneIcon, ClockIcon } from "@sanity/icons";

// Contact Page Main Schema
export const contactPageType = defineType({
  name: "contactPage",
  title: "Contact Page Settings",
  type: "document",
  icon: EnvelopeIcon,
  groups: [
    { name: "hero", title: "Hero Section" },
    { name: "content", title: "Content" },
    { name: "locations", title: "Store Locations" },
    { name: "faq", title: "FAQ Section" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    // Hero Section
    defineField({
      name: "heroTitle",
      title: "Hero Title",
      type: "string",
      group: "hero",
      validation: (Rule) => Rule.required(),
      initialValue: "Kontaktieren Sie uns",
    }),
    defineField({
      name: "heroSubtitle",
      title: "Hero Subtitle",
      type: "text",
      group: "hero",
      initialValue:
        "Haben Sie Fragen zu unseren Produkten oder Dienstleistungen? Wir würden gerne von Ihnen hören. Nehmen Sie über einen der folgenden Kanäle Kontakt mit uns auf.",
    }),
    defineField({
      name: "heroImage",
      title: "Hero Background Image",
      type: "image",
      group: "hero",
      options: { hotspot: true },
    }),

    // Contact Options
    defineField({
      name: "contactOptions",
      title: "Contact Options Cards",
      type: "array",
      group: "content",
      of: [
        defineField({
          name: "option",
          title: "Contact Option",
          type: "object",
          fields: [
            { name: "title", title: "Title", type: "string" },
            { name: "description", title: "Description", type: "text" },
            { name: "actionText", title: "Action Text", type: "string" },
            { name: "link", title: "Link URL", type: "string" },
            {
              name: "icon",
              title: "Icon",
              type: "string",
              options: {
                list: [
                  { title: "Phone", value: "phone" },
                  { title: "Email", value: "email" },
                  { title: "Map Pin", value: "map" },
                  { title: "Clock", value: "clock" },
                ],
              },
            },
            {
              name: "color",
              title: "Color Scheme",
              type: "string",
              options: {
                list: [
                  { title: "Blue", value: "blue" },
                  { title: "Green", value: "green" },
                  { title: "Purple", value: "purple" },
                  { title: "Orange", value: "orange" },
                  { title: "Red", value: "red" },
                ],
              },
              initialValue: "blue",
            },
          ],
          preview: {
            select: {
              title: "title",
              subtitle: "description",
            },
            prepare({ title, subtitle }) {
              return {
                title: title || "Contact Option",
                subtitle: subtitle || "",
              };
            },
          },
        }),
      ],
    }),

    // Form Settings
    defineField({
      name: "formTitle",
      title: "Form Title",
      type: "string",
      group: "content",
      initialValue: "Nachricht senden",
    }),
    defineField({
      name: "formSubtitle",
      title: "Form Subtitle",
      type: "text",
      group: "content",
      initialValue:
        "Füllen Sie das untenstehende Formular aus und wir melden uns so schnell wie möglich bei Ihnen.",
    }),
    defineField({
      name: "formSuccessMessage",
      title: "Success Message",
      type: "text",
      group: "content",
      initialValue:
        "Vielen Dank für Ihre Nachricht! Wir werden uns in Kürze bei Ihnen melden.",
    }),
    defineField({
      name: "formErrorMessage",
      title: "Error Message",
      type: "text",
      group: "content",
      initialValue:
        "Etwas ist schiefgelaufen. Bitte versuchen Sie es später erneut.",
    }),

    // Sidebar Info
    defineField({
      name: "sidebarTitle",
      title: "Sidebar Title",
      type: "string",
      group: "content",
      initialValue: "Informationen",
    }),
    defineField({
      name: "openingHours",
      title: "Opening Hours",
      type: "array",
      group: "content",
      of: [
        defineField({
          name: "hours",
          title: "Hours Entry",
          type: "object",
          fields: [
            { name: "day", title: "Day", type: "string" },
            { name: "time", title: "Time", type: "string" },
          ],
        }),
      ],
      initialValue: [
        { day: "Montag - Samstag", time: "9:00 - 20:00" },
        { day: "Sonntag", time: "Geschlossen" },
      ],
    }),
    defineField({
      name: "quickResponseText",
      title: "Quick Response Text",
      type: "text",
      group: "content",
      initialValue:
        "Wir antworten in der Regel innerhalb von 24 Stunden an Werktagen.",
    }),
    defineField({
      name: "socialTitle",
      title: "Social Media Title",
      type: "string",
      group: "content",
      initialValue: "Folgen Sie uns",
    }),

    // Store Locations
    defineField({
      name: "locationsTitle",
      title: "Locations Section Title",
      type: "string",
      group: "locations",
      initialValue: "Unsere Standorte",
    }),
    defineField({
      name: "locationsSubtitle",
      title: "Locations Section Subtitle",
      type: "text",
      group: "locations",
      initialValue:
        "Besuchen Sie uns an einem unserer praktischen Standorte. Wir würden uns freuen, Sie persönlich zu bedienen!",
    }),
    defineField({
      name: "locations",
      title: "Store Locations",
      type: "array",
      group: "locations",
      of: [
        defineField({
          name: "location",
          title: "Store Location",
          type: "object",
          fields: [
            { name: "name", title: "Store Name", type: "string" },
            { name: "address", title: "Address", type: "string" },
            { name: "city", title: "City", type: "string" },
            { name: "phone", title: "Phone Number", type: "string" },
            { name: "email", title: "Email", type: "string" },
            { name: "hours", title: "Opening Hours", type: "string" },
            { name: "coordinates", title: "Coordinates", type: "string" },
            { name: "mapsUrl", title: "Google Maps URL", type: "url" },
            { name: "embedUrl", title: "Google Maps Embed URL", type: "url" },
            {
              name: "image",
              title: "Store Image",
              type: "image",
              options: { hotspot: true },
            },
          ],
          preview: {
            select: {
              title: "name",
              subtitle: "city",
            },
            prepare({ title, subtitle }) {
              return {
                title: title || "Store Location",
                subtitle: subtitle || "",
              };
            },
          },
        }),
      ],
    }),

    // FAQ Section
    defineField({
      name: "faqTitle",
      title: "FAQ Section Title",
      type: "string",
      group: "faq",
      initialValue: "Häufig gestellte Fragen",
    }),
    defineField({
      name: "faqSubtitle",
      title: "FAQ Section Subtitle",
      type: "text",
      group: "faq",
      initialValue:
        "Finden Sie schnelle Antworten auf die häufigsten Fragen unserer Kunden.",
    }),
    defineField({
      name: "faqs",
      title: "Frequently Asked Questions",
      type: "array",
      group: "faq",
      of: [
        defineField({
          name: "faq",
          title: "FAQ",
          type: "object",
          fields: [
            { name: "question", title: "Question", type: "string" },
            { name: "answer", title: "Answer", type: "text" },
          ],
          preview: {
            select: {
              title: "question",
              subtitle: "answer",
            },
            prepare({ title, subtitle }) {
              return {
                title: title || "FAQ Question",
                subtitle: subtitle ? subtitle.substring(0, 50) + "..." : "",
              };
            },
          },
        }),
      ],
    }),

    // SEO Settings
    defineField({
      name: "seoTitle",
      title: "SEO Title",
      type: "string",
      group: "seo",
    }),
    defineField({
      name: "seoDescription",
      title: "SEO Description",
      type: "text",
      group: "seo",
    }),
    defineField({
      name: "seoKeywords",
      title: "SEO Keywords",
      type: "array",
      group: "seo",
      of: [{ type: "string" }],
    }),
  ],
  preview: {
    select: {
      title: "heroTitle",
    },
    prepare({ title }) {
      return {
        title: title || "Contact Page Settings",
        subtitle: "Edit contact page content",
      };
    },
  },
});