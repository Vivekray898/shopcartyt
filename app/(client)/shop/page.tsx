import Shop from "@/components/Shop";
import { getAllBrands, getCategories } from "@/sanity/queries";
import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop – FundGrube BestPreis | Angebote, Neuigkeiten & Spartipps",
  description:
    "Entdecken Sie aktuelle Angebote, Neuigkeiten, Produktempfehlungen und praktische Spartipps von FundGrube BestPreis.",
};

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