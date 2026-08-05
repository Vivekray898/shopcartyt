// hooks/useSiteSettings.ts
import { useEffect, useState, useRef } from "react";
import { client } from "@/sanity/lib/client";

// ============ QUERIES ============

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

interface CachedSettings {
  headerSettings: HeaderSettings;
  footerSettings: FooterSettings;
  timestamp: number;
}

let cachedSiteSettings: CachedSettings | null = null;
let siteSettingsPromise: Promise<Omit<SiteSettingsState, 'isLoading' | 'error'>> | null = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache

async function fetchSiteSettings(): Promise<Omit<SiteSettingsState, 'isLoading' | 'error'>> {
  // Check if cached data is still valid
  if (cachedSiteSettings) {
    const isCacheValid = Date.now() - cachedSiteSettings.timestamp < CACHE_DURATION;
    if (isCacheValid) {
      const { timestamp, ...settings } = cachedSiteSettings;
      return settings;
    }
  }

  // Return existing promise if one is in progress
  if (siteSettingsPromise) {
    return siteSettingsPromise;
  }

  // Create new fetch promise
  siteSettingsPromise = Promise.all([
    client.fetch(HEADER_SETTINGS_QUERY).catch((err) => {
      console.warn("Error fetching header settings:", err);
      return null;
    }),
    client.fetch(FOOTER_SETTINGS_QUERY).catch((err) => {
      console.warn("Error fetching footer settings:", err);
      return null;
    }),
  ])
    .then(([headerSettings, footerSettings]) => {
      const result = {
        headerSettings: headerSettings ?? defaultHeaderSettings,
        footerSettings: footerSettings ?? defaultFooterSettings,
      };
      
      // Cache the result with timestamp
      cachedSiteSettings = {
        ...result,
        timestamp: Date.now(),
      };
      
      return result;
    })
    .finally(() => {
      siteSettingsPromise = null;
    });

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
  
  const fetchAttempted = useRef(false);
  const isMounted = useRef(true);

  useEffect(() => {
    // Prevent multiple fetches
    if (fetchAttempted.current) return;
    fetchAttempted.current = true;

    const loadSettings = async () => {
      try {
        const result = await fetchSiteSettings();
        if (isMounted.current) {
          setState({
            ...result,
            isLoading: false,
            error: null,
          });
        }
      } catch (error) {
        console.error("Failed to fetch site settings:", error);
        if (isMounted.current) {
          setState({
            headerSettings: defaultHeaderSettings,
            footerSettings: defaultFooterSettings,
            isLoading: false,
            error: error instanceof Error ? error : new Error('Failed to fetch settings'),
          });
        }
      }
    };

    loadSettings();

    return () => {
      isMounted.current = false;
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

// ============ REFRESH FUNCTION ============

export function refreshSiteSettings(): void {
  cachedSiteSettings = null;
  siteSettingsPromise = null;
}

// ============ UTILITY HOOK FOR MANUAL REFRESH ============

export function useRefreshSiteSettings() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const refresh = async (): Promise<void> => {
    setIsRefreshing(true);
    setError(null);
    
    try {
      // Clear cache
      refreshSiteSettings();
      // Trigger new fetch
      await fetchSiteSettings();
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to refresh settings'));
      throw err;
    } finally {
      setIsRefreshing(false);
    }
  };

  return { refresh, isRefreshing, error };
}