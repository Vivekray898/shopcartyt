import Container from "@/components/Container";
import HomeBanner from "@/components/HomeBanner";
import HomeCategories from "@/components/HomeCategories";
import LatestBlog from "@/components/LatestBlog";
import ProductGrid from "@/components/ProductGrid";
import ShopByBrands from "@/components/ShopByBrands";
import { getCategories, getHomeTabsData } from "@/sanity/queries"; 
import { client } from "@/sanity/lib/client";
import React from "react";

const Home = async () => {
  const categories = await getCategories(6);
  const productTabsArray = await getHomeTabsData();

  // 🚀 FIXED: Removed [0] so it fetches ALL banners as an array
  const bannerQuery = `*[_type == "banner"] | order(priority desc, _createdAt desc)`;
  const banners = await client.fetch(bannerQuery);

  return (
    <Container className="bg-shop-light-pink">
      {/* Pass the array of banners to HomeBanner */}
      <HomeBanner banners={banners} />
      
      <ProductGrid initialTabs={productTabsArray} limit={8} />
      <HomeCategories categories={categories} />
      <ShopByBrands />
      <LatestBlog />
    </Container>
  );
};

export default Home;