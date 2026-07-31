import { client } from "../lib/client";
import {
  BLOG_CATEGORIES,
  BRAND_QUERY,
  BRANDS_QUERY,
  DEAL_PRODUCTS,
  GET_ALL_BLOG,
  LATEST_BLOG_QUERY,
  MY_ORDERS_QUERY,
  OTHERS_BLOG_QUERY,
  PRODUCT_BY_SLUG_QUERY,
  SINGLE_BLOG_QUERY,
  SITE_SETTINGS_QUERY,
  HEADER_SETTINGS_QUERY,
  FOOTER_SETTINGS_QUERY,
  HOME_TAB_BAR_QUERY,
  // Import the new queries
  RELATED_PRODUCTS_QUERY,
  PRODUCTS_BY_CATEGORY_QUERY,
  PRODUCTS_BY_BRAND_QUERY,
  POPULAR_PRODUCTS_QUERY,
} from "./query";

const getCategories = async (quantity?: number) => {
  try {
    const query = quantity
      ? `*[_type == 'category'] | order(name asc) [0...$quantity] {
          ...,
          "productCount": count(*[_type == "product" && references(^._id)])
        }`
      : `*[_type == 'category'] | order(name asc) {
          ...,
          "productCount": count(*[_type == "product" && references(^._id)])
        }`;
    const data = await client.fetch(query, quantity ? { quantity } : {});
    return data;
  } catch (error) {
    console.log("Error fetching categories", error);
    return [];
  }
};

const getAllBrands = async () => {
  try {
    const data = await client.fetch(BRANDS_QUERY);
    return data ?? [];
  } catch (error) {
    console.log("Error fetching all brands:", error);
    return [];
  }
};

const getLatestBlogs = async () => {
  try {
    const data = await client.fetch(LATEST_BLOG_QUERY);
    return data ?? [];
  } catch (error) {
    console.log("Error fetching latest Blogs:", error);
    return [];
  }
};

const getDealProducts = async () => {
  try {
    const data = await client.fetch(DEAL_PRODUCTS);
    return data ?? [];
  } catch (error) {
    console.log("Error fetching deal Products:", error);
    return [];
  }
};

const getProductBySlug = async (slug: string) => {
  try {
    const product = await client.fetch(PRODUCT_BY_SLUG_QUERY, { slug });
    return product || null;
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    return null;
  }
};

const getBrand = async (slug: string) => {
  try {
    const product = await client.fetch(BRAND_QUERY, { slug });
    return product || null;
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    return null;
  }
};

const getSiteSettings = async () => {
  try {
    const data = await client.fetch(SITE_SETTINGS_QUERY);
    return data ?? null;
  } catch (error) {
    console.error("Error fetching site settings:", error);
    return null;
  }
};

const getHeaderSettings = async () => {
  try {
    const data = await client.fetch(HEADER_SETTINGS_QUERY);
    return data ?? null;
  } catch (error) {
    console.error("Error fetching header settings:", error);
    return null;
  }
};

const getFooterSettings = async () => {
  try {
    const data = await client.fetch(FOOTER_SETTINGS_QUERY);
    return data ?? null;
  } catch (error) {
    console.error("Error fetching footer settings:", error);
    return null;
  }
};

const getMyOrders = async (userId: string) => {
  try {
    const orders = await client.fetch(MY_ORDERS_QUERY, { userId });
    return orders || null;
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    return null;
  }
};

const getAllBlogs = async (quantity: number) => {
  try {
    const data = await client.fetch(GET_ALL_BLOG, { quantity });
    return data ?? [];
  } catch (error) {
    console.log("Error fetching all brands:", error);
    return [];
  }
};

const getSingleBlog = async (slug: string) => {
  try {
    const data = await client.fetch(SINGLE_BLOG_QUERY, { slug });
    return data ?? [];
  } catch (error) {
    console.log("Error fetching all brands:", error);
    return [];
  }
};

const getBlogCategories = async () => {
  try {
    const data = await client.fetch(BLOG_CATEGORIES);
    return data ?? [];
  } catch (error) {
    console.log("Error fetching all brands:", error);
    return [];
  }
};

const getOthersBlog = async (slug: string, quantity: number) => {
  try {
    const data = await client.fetch(OTHERS_BLOG_QUERY, { slug, quantity });
    return data ?? [];
  } catch (error) {
    console.log("Error fetching all brands:", error);
    return [];
  }
};

// B. Add the type-safe fetcher function inside your orchestration list
const getHomeTabsData = async (): Promise<string[]> => {
  try {
    const variantTitles: string[] = await client.fetch(HOME_TAB_BAR_QUERY);
    
    // 🚀 Inject "Featured" cleanly at array element position zero
    return ["Featured", ...(variantTitles || [])];
  } catch (error) {
    console.error("❌ Failed to resolve home tab navigation categories:", error);
    return ["Featured"]; // Fallback safe gracefully if DB is bootstrapping
  }
};

// ============================================
// 🔥 NEW: RELATED PRODUCTS FUNCTIONS
// ============================================

// 🔥 NEW: Get Related Products function with priority logic
const getRelatedProducts = async (
  excludeId: string,
  categoryId?: string,
  brandId?: string,
  limit: number = 12
) => {
  try {
    let products = [];

    // Priority 1: Products from same category
    if (categoryId) {
      products = await client.fetch(PRODUCTS_BY_CATEGORY_QUERY, {
        excludeId,
        categoryId,
        limit,
      });
    }

    // Priority 2: If no category products, try same brand
    if (products.length === 0 && brandId) {
      products = await client.fetch(PRODUCTS_BY_BRAND_QUERY, {
        excludeId,
        brandId,
        limit,
      });
    }

    // Priority 3: If still no products, get popular products as fallback
    if (products.length === 0) {
      products = await client.fetch(POPULAR_PRODUCTS_QUERY, {
        excludeId,
        limit,
      });
    }

    return products ?? [];
  } catch (error) {
    console.error("Error fetching related products:", error);
    return [];
  }
};

// Alternative: Get products by category only
const getProductsByCategory = async (
  categoryId: string,
  excludeId: string,
  limit: number = 12
) => {
  try {
    const products = await client.fetch(PRODUCTS_BY_CATEGORY_QUERY, {
      excludeId,
      categoryId,
      limit,
    });
    return products ?? [];
  } catch (error) {
    console.error("Error fetching products by category:", error);
    return [];
  }
};

// Alternative: Get products by brand only
const getProductsByBrand = async (
  brandId: string,
  excludeId: string,
  limit: number = 12
) => {
  try {
    const products = await client.fetch(PRODUCTS_BY_BRAND_QUERY, {
      excludeId,
      brandId,
      limit,
    });
    return products ?? [];
  } catch (error) {
    console.error("Error fetching products by brand:", error);
    return [];
  }
};

// Alternative: Get popular products
const getPopularProducts = async (
  excludeId: string,
  limit: number = 12
) => {
  try {
    const products = await client.fetch(POPULAR_PRODUCTS_QUERY, {
      excludeId,
      limit,
    });
    return products ?? [];
  } catch (error) {
    console.error("Error fetching popular products:", error);
    return [];
  }
};

// ============================================
// EXPORTS
// ============================================

// C. Export all functions including the new one
export {
  getCategories,
  getAllBrands,
  getHomeTabsData,
  getLatestBlogs,
  getDealProducts,
  getProductBySlug,
  getBrand,
  getMyOrders,
  getAllBlogs,
  getSingleBlog,
  getBlogCategories,
  getOthersBlog,
  getSiteSettings,
  getHeaderSettings,
  getFooterSettings,
  // 🔥 NEW: Export the new functions
  getRelatedProducts,
  getProductsByCategory,
  getProductsByBrand,
  getPopularProducts,
  // Exporting raw query string tags safely for other multi-fetch structures
  SITE_SETTINGS_QUERY,
  HEADER_SETTINGS_QUERY,
  FOOTER_SETTINGS_QUERY,
};