import { useEffect, useState } from "react";
import { client } from "@/sanity/lib/client";

const HEADER_SETTINGS_QUERY = `*[_type == 'headerSettings'][0]{
  logo,
  navigationLinks[]{
    title,
    href
  },
  callToAction{
    label,
    href
  }
}`;

const FOOTER_SETTINGS_QUERY = `*[_type == 'footerSettings'][0]{
  logo,
  tagline,
  footerBottomText,
  contactItems[]{
    title,
    subtitle,
    icon
  },
  quickLinks[]{
    title,
    href
  },
  categories[]{
    title,
    href
  },
  socialLinks[]{
    platform,
    url
  },
  newsletterText
}`;

export type HeaderLink = {
  title?: string;
  href?: string;
};

export type HeaderCallToAction = {
  label?: string;
  href?: string;
};

export type HeaderSettings = {
  logo?: unknown;
  navigationLinks?: HeaderLink[];
  callToAction?: HeaderCallToAction;
};

export type FooterContactItem = {
  title?: string;
  subtitle?: string;
  icon?: string;
};

export type FooterLink = {
  title?: string;
  href?: string;
};

export type FooterSocialLink = {
  platform?: string;
  url?: string;
};

export type FooterSettings = {
  logo?: unknown;
  tagline?: string;
  footerBottomText?: string;
  contactItems?: FooterContactItem[];
  quickLinks?: FooterLink[];
  categories?: FooterLink[];
  socialLinks?: FooterSocialLink[];
  newsletterText?: string;
};

export const defaultHeaderSettings: HeaderSettings = {
  navigationLinks: [
    { title: "Home", href: "/" },
    { title: "Shop", href: "/shop" },
    { title: "Blog", href: "/blog" },
    { title: "Hot Deal", href: "/deal" },
  ],
  callToAction: { label: "Contact us", href: "/contact" },
};

export const defaultFooterSettings: FooterSettings = {
  logo: undefined,
  tagline: "Discover curated furniture collections at Shopcartyt, blending style and comfort to elevate your living spaces.",
  footerBottomText: `© ${new Date().getFullYear()} Shopcartyt. All rights reserved.`,
  contactItems: [
    { title: "Visit Us", subtitle: "New Orleans, USA", icon: "map-pin" },
    { title: "Call Us", subtitle: "+12 958 648 597", icon: "phone" },
    { title: "Working Hours", subtitle: "Mon - Sat: 10:00 AM - 7:00 PM", icon: "clock" },
    { title: "Email Us", subtitle: "Shopcart@gmail.com", icon: "mail" },
  ],
  quickLinks: [
    { title: "About us", href: "/about" },
    { title: "Contact us", href: "/contact" },
    { title: "Terms & Conditions", href: "/terms" },
    { title: "Privacy Policy", href: "/privacy" },
    { title: "FAQs", href: "/faqs" },
    { title: "Help", href: "/help" },
  ],
  categories: [
    { title: "Mobiles", href: "/category/mobiles" },
    { title: "Appliances", href: "/category/appliances" },
    { title: "Smartphones", href: "/category/smartphones" },
    { title: "Air Conditioners", href: "/category/air-conditioners" },
    { title: "Washing Machine", href: "/category/washing-machine" },
    { title: "Kitchen Appliances", href: "/category/kitchen-appliances" },
    { title: "Gadget Accessories", href: "/category/gadget-accessories" },
  ],
  socialLinks: [
    { platform: "Youtube", url: "https://www.youtube.com/@reactjsBD" },
    { platform: "Github", url: "https://www.youtube.com/@reactjsBD" },
    { platform: "Linkedin", url: "https://www.youtube.com/@reactjsBD" },
    { platform: "Facebook", url: "https://www.youtube.com/@reactjsBD" },
    { platform: "Slack", url: "https://www.youtube.com/@reactjsBD" },
  ],
  newsletterText:
    "Subscribe to our newsletter to receive updates and exclusive offers.",
};

type SiteSettingsState = {
  headerSettings: HeaderSettings;
  footerSettings: FooterSettings;
};

let cachedSiteSettings: SiteSettingsState | null = null;
let siteSettingsPromise: Promise<SiteSettingsState> | null = null;

async function fetchSiteSettings(): Promise<SiteSettingsState> {
  if (cachedSiteSettings) {
    return cachedSiteSettings;
  }

  if (!siteSettingsPromise) {
    siteSettingsPromise = Promise.all([
      client.fetch(HEADER_SETTINGS_QUERY),
      client.fetch(FOOTER_SETTINGS_QUERY),
    ])
      .then(([headerSettings, footerSettings]) => {
        const result: SiteSettingsState = {
          headerSettings: headerSettings ?? defaultHeaderSettings,
          footerSettings: footerSettings ?? defaultFooterSettings,
        };
        cachedSiteSettings = result;
        return result;
      })
      .catch((error) => {
        console.error("Error fetching site settings:", error);
        return {
          headerSettings: defaultHeaderSettings,
          footerSettings: defaultFooterSettings,
        };
      })
      .finally(() => {
        siteSettingsPromise = null;
      });
  }

  return siteSettingsPromise;
}

export function useSiteSettings() {
  const [siteSettings, setSiteSettings] = useState<SiteSettingsState>({
    headerSettings: defaultHeaderSettings,
    footerSettings: defaultFooterSettings,
  });

  useEffect(() => {
    let isMounted = true;

    fetchSiteSettings().then((result) => {
      if (isMounted) {
        setSiteSettings(result);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  return siteSettings;
}

// This hook is intended for client-side use only and should not import
// server-only helpers that require SANITY_API_READ_TOKEN.
