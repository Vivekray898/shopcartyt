import { defineQuery } from "next-sanity";

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
};