import Shop from "@/components/Shop";
import { getAllBrands, getCategories } from "@/sanity/queries";
import React from "react";

interface PageProps {
  searchParams: Promise<{
    search?: string;
    brand?: string;
    category?: string;
  }>;
}

const ShopPage = async ({ searchParams }: PageProps) => {
  const categories = await getCategories();
  const brands = await getAllBrands();

  const resolvedSearchParams = await searchParams;
  const initialSearch = resolvedSearchParams?.search || "";
  const initialBrand = resolvedSearchParams?.brand || "";
  const initialCategory = resolvedSearchParams?.category || "";

  return (
    <div className="bg-white">
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