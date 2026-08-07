// app/robots.ts
import { MetadataRoute } from 'next';

function getBaseUrl() {
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return `https://${process.env.NEXT_PUBLIC_BASE_URL}`;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return 'http://localhost:3000';
}

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getBaseUrl();

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',      // Don't index API routes
        '/studio/',   // Don't index Sanity Studio
        '/admin/',    // Don't index admin panel
        '/cart',      // Don't index cart page
        '/wishlist',  // Don't index wishlist
        '/orders',    // Don't index orders
        '/checkout',  // Don't index checkout
        '/success',   // Don't index success page
        '/_next/',    // Don't index Next.js internal
        '/_vercel/',  // Don't index Vercel internal
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}