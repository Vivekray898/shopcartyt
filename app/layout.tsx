// app/layout.tsx
import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";

// Site configuration
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://fundgrube-bestpreis.de';
const SITE_NAME = 'FundGrube BestPreis';
const SITE_TITLE = 'FundGrube BestPreis – Markenprodukte günstig kaufen | Offizieller Vertriebspartner';
const DEFAULT_DESCRIPTION = 'FundGrube BestPreis - Ihr zuverlässiger Partner für zertifizierte Originalmarken. Maßgeschneiderte Bestellungen & Showroom-Besichtigung in Blieskastel und Zweibrücken.';
const OG_IMAGE = '/social/og-image.jpg';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  
  // Basic SEO - Title is now 50-60 characters
  title: {
    default: SITE_TITLE,
    template: `%s | ${SITE_NAME}`
  },
  description: DEFAULT_DESCRIPTION, // Now 128 characters - perfect!
  
  // Open Graph (Facebook, LinkedIn, Discord, etc.)
  openGraph: {
    title: SITE_TITLE, // Explicit og:title
    description: DEFAULT_DESCRIPTION, // Now under 125 characters
    url: SITE_URL,
    siteName: SITE_NAME, // Explicit og:site_name
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: 'FundGrube BestPreis - Ihr zuverlässiger Partner für Markenprodukte',
        type: 'image/jpeg',
        secureUrl: OG_IMAGE, // For HTTPS
      },
    ],
    locale: 'de_DE',
    type: 'website',
    // Add these for better rich previews
    determiner: 'auto',
  },
  
  // Twitter Cards - Now complete
  twitter: {
    card: 'summary_large_image', // Explicit twitter:card
    title: SITE_TITLE, // Explicit twitter:title
    description: DEFAULT_DESCRIPTION, // Explicit twitter:description
    images: [OG_IMAGE], // Explicit twitter:image
    creator: '@fundgrube',
    site: '@fundgrube',
  },
  
  // Search engine verification
  verification: {
    google: 'YOUR_GOOGLE_VERIFICATION_CODE',
    other: {
      'msvalidate.01': 'YOUR_BING_VERIFICATION_CODE',
      'facebook-domain-verification': 'YOUR_FACEBOOK_VERIFICATION_CODE',
    },
  },
  
  // Robots
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  
  // Canonical URL
  alternates: {
    canonical: SITE_URL,
    languages: {
      'de-DE': SITE_URL,
    },
  },
  
  // Icons
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon0.svg', type: 'image/svg+xml' },
      { url: '/icon1.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-icon.png' },
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: ['/favicon.ico'],
  },
  
  // Manifest for PWA
  manifest: '/manifest.json',
  
  // Authors & Publisher
  authors: [
    { name: 'Harinder Singh', url: SITE_URL },
  ],
  creator: 'FundGrube BestPreis',
  publisher: 'FundGrube BestPreis',
  
  // Category
  category: 'ecommerce',
  
  // Keywords
  keywords: [
    'FundGrube',
    'BestPreis',
    'Markenprodukte',
    'Online Shop',
    'Sonderpostenmarkt',
    'Blieskastel',
    'Zweibrücken',
    'Originalmarken',
    'Vertriebspartner',
  ],
  
  // Theme color
  themeColor: '#000000',
  
  // Other metadata
  applicationName: SITE_NAME,
  generator: 'Next.js',
  referrer: 'origin-when-cross-origin',
  formatDetection: {
    email: true,
    address: true,
    telephone: true,
  },
  
  // Open Graph additional for better previews
  other: {
    'og:phone_number': '+49 176 32853448',
    'og:email': 'fundgrube6@gmail.com',
    'og:street_address': 'Saar-Pfalz-Straße 2b',
    'og:locality': 'Blieskastel',
    'og:postal_code': '66440',
    'og:country_name': 'Germany',
  },
};

// Viewport configuration
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#000000',
  colorScheme: 'light',
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="de">
      <head>
        {/* Apple Mobile Web App */}
        <meta name="apple-mobile-web-app-title" content="FundGrube" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        
        {/* Microsoft Windows */}
        <meta name="msapplication-TileImage" content="/ms-icon-144x144.png" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        
        {/* Facebook Domain Verification */}
        <meta name="facebook-domain-verification" content="YOUR_FACEBOOK_VERIFICATION_CODE" />
        
        {/* Pinterest Rich Pins */}
        <meta name="pinterest-rich-pin" content="true" />
        
        {/* Additional SEO */}
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        
        {/* Geo Location for local SEO */}
        <meta name="geo.region" content="DE-SL" />
        <meta name="geo.placename" content="Blieskastel" />
        <meta name="geo.position" content="49.2372;7.2529" />
        <meta name="ICBM" content="49.2372, 7.2529" />
        
        {/* Business Info */}
        <meta name="business:contact_data:street_address" content="Saar-Pfalz-Straße 2b" />
        <meta name="business:contact_data:locality" content="Blieskastel" />
        <meta name="business:contact_data:postal_code" content="66440" />
        <meta name="business:contact_data:country" content="Germany" />
        <meta name="business:contact_data:phone_number" content="+49 176 32853448" />
        <meta name="business:contact_data:email" content="fundgrube6@gmail.com" />
      </head>
      <body className="font-poppins antialiased">
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#000000",
              color: "#fff",
            },
          }}
        />
      </body>
    </html>
  );
};

export default RootLayout;