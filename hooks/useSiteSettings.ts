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
  quickLinksSection{
    title,
    links[]{
      title,
      href
    }
  },
  categoriesSection{
    title,
    links[]{
      title,
      href
    }
  },
  socialLinks[]{
    platform,
    url
  },
  newsletterText,
  legalLinks[]{
    title,
    href,
    openInNewTab
  }
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

export type FooterLegalLink = {
  title?: string;
  href?: string;
  openInNewTab?: boolean;
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

export type FooterSection = {
  title?: string;
  links?: FooterLink[];
};

export type FooterSettings = {
  logo?: unknown;
  tagline?: string;
  footerBottomText?: string;
  contactItems?: FooterContactItem[];
  storeLocations?: StoreLocation[];
  quickLinksSection?: FooterSection;
  categoriesSection?: FooterSection;
  socialLinks?: FooterSocialLink[];
  newsletterText?: string;
  legalLinks?: FooterLegalLink[];
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

// Minimal defaults - will be replaced by Sanity data
export const defaultFooterSettings: FooterSettings = {
  logo: undefined,
  tagline: "",
  footerBottomText: `© ${new Date().getFullYear()} Fundgrube-Bestpreis. All rights reserved.`,
  contactItems: [],
  storeLocations: [],
  quickLinksSection: { title: "Quick Links", links: [] },
  categoriesSection: { title: "Categories", links: [] },
  socialLinks: [],
  newsletterText: "Subscribe to our newsletter for exclusive updates.",
  legalLinks: [],
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