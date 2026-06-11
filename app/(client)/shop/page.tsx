import Shop from "@/components/Shop";
import { getAllBrands, getCategories } from "@/sanity/queries";
import React from "react";

// FIXED: Defined Next.js structural search parameter interface properties
interface PageProps {
  searchParams: Promise<{
    search?: string;
    brand?: string;
    category?: string;
  }>;
}

const ShopPage = async ({ searchParams }: PageProps) => {
  // Fetch metadata collections from Sanity content cloud
  const categories = await getCategories();
  const brands = await getAllBrands();

  // FIXED: Await search parameter options array directly inside the server execution thread
  const resolvedSearchParams = await searchParams;
  const initialSearch = resolvedSearchParams?.search || "";
  const initialBrand = resolvedSearchParams?.brand || "";
  const initialCategory = resolvedSearchParams?.category || "";

  return (
    <div className="bg-white">
      {/* FIXED: Passing filter parameters directly down into your interactive shop grid workspace */}
      <Shop 
        categories={categories} 
        brands={brands} 
        initialSearch={initialSearch}
        initialBrand={initialBrand}
        initialCategory={initialCategory}
      />
    </div>
  );
};

export default ShopPage;