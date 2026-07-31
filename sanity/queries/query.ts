import { defineQuery } from "next-sanity";
import { client } from "@/sanity/lib/client"; // Make sure this import path is correct for your project

// Updated from name to title to avoid sorting issues with your new Shop config
const BRANDS_QUERY = defineQuery(`*[_type=='brand'] | order(title asc)`);

const LATEST_BLOG_QUERY = defineQuery(
  ` *[_type == 'blog' && isLatest == true]|order(title asc){
      ...,
      blogcategories[]->{
      title
    }
    }`
);

const DEAL_PRODUCTS = defineQuery(
  `*[_type == 'product' && status == 'hot'] | order(name asc){
    ...,
    "categories": categories[]->title,
    brand->{title},
    variant->{title}
  }`
);

// 🛠️ FIXED: Deeply expand references so your Product Page gets active real-time details
const PRODUCT_BY_SLUG_QUERY = defineQuery(
  `*[_type == "product" && slug.current == $slug][0]{
    ...,
    stock,
    price,
    discount,
    brand->{
      _id,
      title,
      description
    },
    variant->{
      _id,
      title
    },
    categories[]->{
      _id,
      title
    }
  }`
);

const BRAND_QUERY = defineQuery(`*[_type == "product" && slug.current == $slug]{
  "brandName": brand->title
  }`);

const SITE_SETTINGS_QUERY = defineQuery(
  `*[_type == "siteSettings"][0]{
    catalogueMode
  }`
);

const HEADER_SETTINGS_QUERY = defineQuery(
  `*[_type == "headerSettings"][0]{
    logo,
    navigationLinks[]{
      title,
      href
    },
    callToAction{
      text,
      url
    }
  }`
);

const FOOTER_SETTINGS_QUERY = defineQuery(
  `*[_type == "footerSettings"][0]{
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
  }`
);

const MY_ORDERS_QUERY = defineQuery(`
  *[_type == 'order' && clerkUserId == $userId] | order(orderData desc){
    ...,
    products[]{
      ...,
      product->
    }
  }
`);

const GET_ALL_BLOG = defineQuery(
  `*[_type == 'blog'] | order(publishedAt desc)[0...$quantity]{
    ...,  
    blogcategories[]->{
      title
    }
  }`
);

const SINGLE_BLOG_QUERY = defineQuery(`
  *[_type == "blog" && slug.current == $slug][0]{
    ..., 
    author->{
      name,
      image,
    },
    blogcategories[]->{
      title,
      "slug": slug.current,
    },
  }
`);

const BLOG_CATEGORIES = defineQuery(
  `*[_type == "blog"]{
     blogcategories[]->{
       ...
     }
  }`
);

const OTHERS_BLOG_QUERY = defineQuery(`
  *[
    _type == "blog"
    && defined(slug.current)
    && slug.current != $slug
  ]|order(publishedAt desc)[0...$quantity]{
    ...,
    publishedAt,
    title,
    mainImage,
    slug,
    author->{
      name,
      image,
    },
    categories[]->{
      title,
      "slug": slug.current,
    }
  }
`);

// Add this definition string at the bottom of sanity/queries/query.ts
const HOME_TAB_BAR_QUERY = defineQuery(`
  *[_type == "productVariant"] {
    title,
    "priority": coalesce(orderPriority, 0),
    "latestProductDate": *[_type == "product" && references(^._id)] | order(_createdAt desc)[0]._createdAt
  } | order(priority desc, latestProductDate desc)[0...15].title
`);

// ============================================
// NEW QUERY DEFINITIONS FOR RELATED PRODUCTS
// ============================================

// Related Products Query - finds products in same category or brand
export const RELATED_PRODUCTS_QUERY = `
  *[_type == "product" && _id != $excludeId] | order(_createdAt desc) [0...$limit] {
    _id,
    name,
    slug,
    price,
    discount,
    stock,
    images,
    brand->{
      title, 
      brandName, 
      slug
    },
    category->{
      title, 
      slug
    }
  }
`;

// Products by Category
export const PRODUCTS_BY_CATEGORY_QUERY = `
  *[_type == "product" && _id != $excludeId && references($categoryId)] | order(_createdAt desc) [0...$limit] {
    _id,
    name,
    slug,
    price,
    discount,
    stock,
    images,
    brand->{
      title, 
      brandName, 
      slug
    },
    category->{
      title, 
      slug
    }
  }
`;

// Products by Brand
export const PRODUCTS_BY_BRAND_QUERY = `
  *[_type == "product" && _id != $excludeId && references($brandId)] | order(_createdAt desc) [0...$limit] {
    _id,
    name,
    slug,
    price,
    discount,
    stock,
    images,
    brand->{
      title, 
      brandName, 
      slug
    },
    category->{
      title, 
      slug
    }
  }
`;

// Popular Products (fallback)
export const POPULAR_PRODUCTS_QUERY = `
  *[_type == "product" && _id != $excludeId] | order(popularity desc, _createdAt desc) [0...$limit] {
    _id,
    name,
    slug,
    price,
    discount,
    stock,
    images,
    brand->{
      title, 
      brandName, 
      slug
    },
    category->{
      title, 
      slug
    }
  }
`;

// ============================================
// FUNCTIONS FOR FETCHING RELATED PRODUCTS
// ============================================

// Add this function to fetch related products
export async function getRelatedProducts(
  currentProductId: string,
  categoryId?: string,
  brandId?: string,
  limit: number = 10
) {
  // Build the query to find related products
  // Priority: Same category > Same brand > Random popular products
  
  let query = `*[_type == "product" && _id != $currentProductId`;
  const params: any = { currentProductId };

  // Try to find products in the same category first
  if (categoryId) {
    query += ` && references($categoryId)`;
    params.categoryId = categoryId;
  } else if (brandId) {
    query += ` && references($brandId)`;
    params.brandId = brandId;
  }

  // If we have category or brand, limit to those, otherwise get any products
  query += `] | order(_createdAt desc) [0...$limit]`;
  params.limit = limit;

  try {
    const products = await client.fetch(query, params);
    
    // If we didn't get enough products with category/brand, 
    // fetch additional popular products
    if (products.length < limit) {
      const remaining = limit - products.length;
      const fallbackQuery = `*[_type == "product" && _id != $currentProductId && !(_id in $existingIds)] | order(popularity desc, _createdAt desc) [0...$remaining]`;
      const fallbackProducts = await client.fetch(fallbackQuery, {
        currentProductId,
        existingIds: products.map((p: any) => p._id),
        remaining
      });
      return [...products, ...fallbackProducts];
    }
    
    return products;
  } catch (error) {
    console.error("Error fetching related products:", error);
    return [];
  }
}

// Alternative: Get products by category (more precise)
export async function getProductsByCategory(
  categoryId: string,
  excludeProductId: string,
  limit: number = 10
) {
  const query = `*[_type == "product" && _id != $excludeProductId && references($categoryId)] | order(_createdAt desc) [0...$limit] {
    _id,
    name,
    slug,
    price,
    discount,
    stock,
    images,
    brand->{title, brandName, slug},
    category->{title, slug}
  }`;
  
  return await client.fetch(query, { excludeProductId, categoryId, limit });
}

// Get "You May Also Like" - products from same brand
export async function getProductsByBrand(
  brandId: string,
  excludeProductId: string,
  limit: number = 10
) {
  const query = `*[_type == "product" && _id != $excludeProductId && references($brandId)] | order(_createdAt desc) [0...$limit] {
    _id,
    name,
    slug,
    price,
    discount,
    stock,
    images,
    brand->{title, brandName, slug}
  }`;
  
  return await client.fetch(query, { excludeProductId, brandId, limit });
}

// Get recently viewed/popular products (fallback)
export async function getPopularProducts(
  excludeProductId: string,
  limit: number = 10
) {
  const query = `*[_type == "product" && _id != $excludeProductId] | order(popularity desc, _createdAt desc) [0...$limit] {
    _id,
    name,
    slug,
    price,
    discount,
    stock,
    images,
    brand->{title, brandName, slug}
  }`;
  
  return await client.fetch(query, { excludeProductId, limit });
}

// ============================================
// EXPORTS
// ============================================

export {
  BRANDS_QUERY,
  LATEST_BLOG_QUERY,
  DEAL_PRODUCTS,
  PRODUCT_BY_SLUG_QUERY,
  BRAND_QUERY,
  MY_ORDERS_QUERY,
  GET_ALL_BLOG,
  SINGLE_BLOG_QUERY,
  BLOG_CATEGORIES,
  OTHERS_BLOG_QUERY,
  SITE_SETTINGS_QUERY,
  HEADER_SETTINGS_QUERY,
  FOOTER_SETTINGS_QUERY,
  HOME_TAB_BAR_QUERY,
};