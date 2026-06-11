import Container from "@/components/Container";
import HomeBanner from "@/components/HomeBanner";
import HomeCategories from "@/components/HomeCategories";
import LatestBlog from "@/components/LatestBlog";
import ProductGrid from "@/components/ProductGrid";
import ShopByBrands from "@/components/ShopByBrands";
import { getCategories } from "@/sanity/queries";
import { client } from "@/sanity/lib/client";
import React from "react";

const Home = async () => {
  const categories = await getCategories(6);

  // FETCH DYNAMIC PRODUCT TYPES
  const productTypesQuery = `*[_type == "productVariant"] | order(title asc) { _id, title }`;
  const productTypes = await client.fetch(productTypesQuery);

  // FETCH ACTIVE BANNER
  const bannerQuery = `*[_type == "banner"] | order(_createdAt desc)[0]`;
  const activeBanner = await client.fetch(bannerQuery);

  return (
    <Container className="bg-shop-light-pink">
      <HomeBanner banner={activeBanner} />
      
      {/* FIXED: Added a structural limit constraint helper prop to shorten the layout list */}
      <ProductGrid initialTabs={productTypes} limit={8} />
      
      <HomeCategories categories={categories} />
      <ShopByBrands />
      <LatestBlog />
    </Container>
  );
};

export default Home;