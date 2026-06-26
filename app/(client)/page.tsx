import Container from "@/components/Container";
import HomeBanner from "@/components/HomeBanner";
import HomeCategories from "@/components/HomeCategories";
import LatestBlog from "@/components/LatestBlog";
import ProductGrid from "@/components/ProductGrid";
import ShopByBrands from "@/components/ShopByBrands";
// 🚀 FIXED: Imported your new tab fetching function from your query pipeline aggregator
import { getCategories, getHomeTabsData } from "@/sanity/queries"; 
import { client } from "@/sanity/lib/client";
import React from "react";

const Home = async () => {
  const categories = await getCategories(6);

  // 🚀 FIXED: Replaced the raw inline query with your advanced priority + "Featured" tab system fetcher
  const productTabsArray = await getHomeTabsData();

  // Ordered by priority score descending first, then by registration date
  const bannerQuery = `*[_type == "banner"] | order(priority desc, _createdAt desc)[0]`;
  const activeBanner = await client.fetch(bannerQuery);

  return (
    <Container className="bg-shop-light-pink">
      <HomeBanner banner={activeBanner} />
      
      {/* 🚀 FIXED: Passed down the raw string array list containing ["Featured", "Apparel", ...] 
          directly into your interactive slider container element */}
      <ProductGrid initialTabs={productTabsArray} limit={8} />
      
      <HomeCategories categories={categories} />
      <ShopByBrands />
      <LatestBlog />
    </Container>
  );
};

export default Home;