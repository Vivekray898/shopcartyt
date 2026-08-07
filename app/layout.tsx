// app/layout.tsx
import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";

// Site configuration
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://fundgrube-bestpreis.de';
const SITE_NAME = 'FundGrube BestPreis';
const DEFAULT_DESCRIPTION = 'FundGrube BestPreis – Ihr zuverlässiger Partner für Markenprodukte';
const OG_IMAGE = '/social/og-image.png';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  
  // Basic SEO
  title: {
    default: `${SITE_NAME} – Markenprodukte günstig kaufen`,
    template: `%s | ${SITE_NAME}`
  },
  description: DEFAULT_DESCRIPTION,
  
  // Open Graph (Facebook, LinkedIn, etc.)
  openGraph: {
    title: `${SITE_NAME} – Ihr zuverlässiger Partner`,
    description: DEFAULT_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} - Social Sharing Image`,
        type: 'image/jpeg',
      },
    ],
    locale: 'de_DE',
    type: 'website',
  },
  
  // Twitter Cards
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} – Ihr zuverlässiger Partner`,
    description: DEFAULT_DESCRIPTION,
    images: [OG_IMAGE],
    creator: '@fundgrube',
    site: '@fundgrube',
  },
  
  // Search engine verification
  verification: {
    google: 'YOUR_GOOGLE_VERIFICATION_CODE', // Add your Google Search Console code
    other: {
      'msvalidate.01': 'YOUR_BING_VERIFICATION_CODE', // Bing Webmaster Tools
      'facebook-domain-verification': 'YOUR_FACEBOOK_VERIFICATION_CODE', // Facebook Business verification
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
  },
  
  // Icons - Next.js automatically handles favicon.ico from /app folder
  // but we also specify additional icons
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
  },
  
  // Manifest for PWA support
  manifest: '/manifest.json',
  
  // Other metadata
  authors: [{ name: 'FundGrube BestPreis' }],
  creator: 'FundGrube BestPreis',
  publisher: 'FundGrube BestPreis',
  
  // Category
  category: 'ecommerce',
  
  // Keywords (optional)
  keywords: ['FundGrube', 'BestPreis', 'Markenprodukte', 'Online Shop', 'Einkaufen'],
  
  // Theme color for mobile browsers
  themeColor: '#000000',
};

// Viewport configuration (separate export in Next.js 14+)
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#000000',
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
        
        {/* Facebook Domain Verification */}
        <meta name="facebook-domain-verification" content="YOUR_FACEBOOK_VERIFICATION_CODE" />
        
        {/* Pinterest Rich Pins */}
        <meta name="pinterest-rich-pin" content="true" />
        
        {/* Additional SEO */}
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
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