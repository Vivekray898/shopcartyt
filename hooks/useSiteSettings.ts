// hooks/useSiteSettings.ts
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
  storeLocations[]{
    name,
    address,
    city,
    phone,
    email,
    hours,
    embedUrl,
    mapsUrl,
    featured
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

// ============ TYPES ============

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

export type StoreLocation = {
  name?: string;
  address?: string;
  city?: string;
  phone?: string;
  email?: string;
  hours?: string;
  embedUrl?: string;
  mapsUrl?: string;
  featured?: boolean;
};

export type FooterSettings = {
  logo?: unknown;
  tagline?: string;
  footerBottomText?: string;
  contactItems?: FooterContactItem[];
  storeLocations?: StoreLocation[];
  quickLinks?: FooterLink[];
  categories?: FooterLink[];
  socialLinks?: FooterSocialLink[];
  newsletterText?: string;
};

export type SiteSettingsState = {
  headerSettings: HeaderSettings;
  footerSettings: FooterSettings;
  isLoading: boolean;
  error: Error | null;
};

// ============ DEFAULTS ============

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
  storeLocations: [
    {
      name: "Fundgrube Aßweiler",
      address: "Blumen, Gartencenter",
      city: "Aßweiler, Germany",
      phone: "+4917632853448",
      email: "assweiler@fundgrube.com",
      hours: "Mon-Sat: 9:00 - 20:00",
      embedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2606.322878516748!2d7.1800750767101915!3d49.2134034756573!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4795cdce6b678f33%3A0x302e33a329f835f9!2sFundgrube%20Sonderpostenmarkt%2C%20Blumen%2C%20Gartencenter%2C%20A%C3%9Fweiler!5e0!3m2!1sen!2sin!4v1785411348624!5m2!1sen!2sin",
      mapsUrl: "https://www.google.com/maps?q=Fundgrube+Sonderpostenmarkt+A%C3%9Fweiler",
      featured: true,
    },
    {
      name: "Best Preis Blieskastel",
      address: "Textil, Schreibware, Baumarkt",
      city: "Blieskastel, Germany",
      phone: "+4917632853448",
      email: "blieskastel@fundgrube.com",
      hours: "Mon-Sat: 9:00 - 20:00",
      embedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2604.5416189021976!2d7.363204976711802!3d49.24717927326737!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4795d123d15c4abb%3A0xad008301e167ed7!2sBest%20Preis%20Textil%20Schreibware%20Baumarkt%20Artikel!5e0!3m2!1sen!2sin!4v1785411367261!5m2!1sen!2sin",
      mapsUrl: "https://www.google.com/maps?q=Best+Preis+Textil+Schreibware+Baumarkt+Blieskastel",
      featured: true,
    },
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

// ============ CACHE ============

let cachedSiteSettings: Omit<SiteSettingsState, 'isLoading' | 'error'> | null = null;
let siteSettingsPromise: Promise<Omit<SiteSettingsState, 'isLoading' | 'error'>> | null = null;

async function fetchSiteSettings(): Promise<Omit<SiteSettingsState, 'isLoading' | 'error'>> {
  if (cachedSiteSettings) {
    return cachedSiteSettings;
  }

  if (!siteSettingsPromise) {
    siteSettingsPromise = Promise.all([
      client.fetch(HEADER_SETTINGS_QUERY),
      client.fetch(FOOTER_SETTINGS_QUERY),
    ])
      .then(([headerSettings, footerSettings]) => {
        const result = {
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

// ============ HOOK ============

export function useSiteSettings(): SiteSettingsState & {
  headerSettings: HeaderSettings;
  footerSettings: FooterSettings;
  isLoading: boolean;
  error: Error | null;
} {
  const [state, setState] = useState<SiteSettingsState>({
    headerSettings: defaultHeaderSettings,
    footerSettings: defaultFooterSettings,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    let isMounted = true;

    fetchSiteSettings()
      .then((result) => {
        if (isMounted) {
          setState({
            ...result,
            isLoading: false,
            error: null,
          });
        }
      })
      .catch((error) => {
        if (isMounted) {
          setState({
            headerSettings: defaultHeaderSettings,
            footerSettings: defaultFooterSettings,
            isLoading: false,
            error: error instanceof Error ? error : new Error('Failed to fetch settings'),
          });
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return state;
}

// ============ INDIVIDUAL HOOKS FOR BETTER DX ============

export function useHeaderSettings() {
  const { headerSettings, isLoading, error } = useSiteSettings();
  return { headerSettings, isLoading, error };
}

export function useFooterSettings() {
  const { footerSettings, isLoading, error } = useSiteSettings();
  return { footerSettings, isLoading, error };
}

export function useStoreLocations() {
  const { footerSettings, isLoading, error } = useSiteSettings();
  return { 
    storeLocations: footerSettings.storeLocations || [], 
    isLoading, 
    error 
  };
}

export function useContactItems() {
  const { footerSettings, isLoading, error } = useSiteSettings();
  return { 
    contactItems: footerSettings.contactItems || [], 
    isLoading, 
    error 
  };
}

export function useSocialLinks() {
  const { footerSettings, isLoading, error } = useSiteSettings();
  return { 
    socialLinks: footerSettings.socialLinks || [], 
    isLoading, 
    error 
  };
}

// ============ TYPE GUARDS ============

export function hasStoreLocations(footerSettings: FooterSettings): boolean {
  return !!(footerSettings.storeLocations && footerSettings.storeLocations.length > 0);
}

export function getFeaturedLocations(footerSettings: FooterSettings): StoreLocation[] {
  if (!footerSettings.storeLocations) return [];
  return footerSettings.storeLocations.filter(loc => loc.featured === true);
}

export function getPrimaryLocation(footerSettings: FooterSettings): StoreLocation | undefined {
  if (!footerSettings.storeLocations || footerSettings.storeLocations.length === 0) {
    return undefined;
  }
  const featured = getFeaturedLocations(footerSettings);
  return featured.length > 0 ? featured[0] : footerSettings.storeLocations[0];
}