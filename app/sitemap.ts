// app/sitemap.ts
import { MetadataRoute } from 'next';
import { client } from '@/sanity/lib/client';
import { groq } from 'next-sanity';

// Helper to get base URL
function getBaseUrl() {
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return `https://${process.env.NEXT_PUBLIC_BASE_URL}`;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return 'http://localhost:3000';
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseUrl();

  // Fetch dynamic content
  const query = groq`{
    "pages": *[_type == "page" && defined(slug.current)] { _updatedAt, slug },
    "products": *[_type == "product" && defined(slug.current)] { _updatedAt, slug },
    "categories": *[_type == "category" && defined(slug.current)] { _updatedAt, slug },
    "brands": *[_type == "brand" && defined(slug.current)] { _updatedAt, slug },
    "blogs": *[_type == "blog" && defined(slug.current)] { _updatedAt, slug }
  }`;

  const data = await client.fetch(query);

  // Static routes (always included)
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/shop`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/deal`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ];

  // Dynamic routes
  const dynamicRoutes: MetadataRoute.Sitemap = [];

  // Add pages
  data.pages?.forEach((page: any) => {
    if (page.slug?.current) {
      dynamicRoutes.push({
        url: `${baseUrl}/${page.slug.current}`,
        lastModified: page._updatedAt ? new Date(page._updatedAt) : new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      });
    }
  });

  // Add products
  data.products?.forEach((product: any) => {
    if (product.slug?.current) {
      dynamicRoutes.push({
        url: `${baseUrl}/product/${product.slug.current}`,
        lastModified: product._updatedAt ? new Date(product._updatedAt) : new Date(),
        changeFrequency: 'daily',
        priority: 0.9,
      });
    }
  });

  // Add categories
  data.categories?.forEach((category: any) => {
    if (category.slug?.current) {
      dynamicRoutes.push({
        url: `${baseUrl}/category/${category.slug.current}`,
        lastModified: category._updatedAt ? new Date(category._updatedAt) : new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
      });
    }
  });

  // Add brands
  data.brands?.forEach((brand: any) => {
    if (brand.slug?.current) {
      dynamicRoutes.push({
        url: `${baseUrl}/brand/${brand.slug.current}`,
        lastModified: brand._updatedAt ? new Date(brand._updatedAt) : new Date(),
        changeFrequency: 'weekly',
        priority: 0.6,
      });
    }
  });

  // Add blogs
  data.blogs?.forEach((blog: any) => {
    if (blog.slug?.current) {
      dynamicRoutes.push({
        url: `${baseUrl}/blog/${blog.slug.current}`,
        lastModified: blog._updatedAt ? new Date(blog._updatedAt) : new Date(),
        changeFrequency: 'weekly',
        priority: 0.6,
      });
    }
  });

  // Combine and return
  return [...staticRoutes, ...dynamicRoutes];
}

// Option 1: Use ISR with revalidation (recommended for auto-refresh)
export const revalidate = 3600; // Regenerate every hour

// Option 2: Use dynamic (only if you want on-demand generation)
// export const dynamic = 'force-dynamic';