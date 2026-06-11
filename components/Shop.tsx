"use client";
import { BRANDS_QUERY_RESULT, Category, Product } from "@/sanity.types"; 
import React, { useEffect, useState } from "react";
import Container from "./Container";
import Title from "./Title";
import CategoryList from "./shop/CategoryList";
import BrandList from "./shop/BrandList";
import { client } from "@/sanity/lib/client";
import { Loader2, SlidersHorizontal, X } from "lucide-react";
import NoProductAvailable from "./NoProductAvailable";
import ProductCard from "./ProductCard";

interface Props {
  categories: Category[];
  brands: BRANDS_QUERY_RESULT; 
  initialSearch?: string;
  initialBrand?: string;
  initialCategory?: string;
}

const Shop = ({ 
  categories, 
  brands, 
  initialSearch = "", 
  initialBrand = "", 
  initialCategory = "" 
}: Props) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(initialCategory || null);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(initialBrand || null);

  useEffect(() => {
    setSearchQuery(initialSearch);
  }, [initialSearch]);

  // 🚀 FIXED: Closes the mobile filter drawer overlay smoothly whenever a selection state shifts
  useEffect(() => {
    setIsMobileFilterOpen(false);
  }, [selectedCategory, selectedBrand]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const query = `
        *[_type == 'product' 
          && (!defined($selectedCategory) || references(*[_type == "category" && slug.current == $selectedCategory]._id))
          && (!defined($selectedBrand) || references(*[_type == "brand" && slug.current == $selectedBrand]._id))
          && ($searchQuery == "" || name match $searchQuery + "*")
        ] 
        | order(name asc) {
          ...,
          "brand": brand->{title},
          "variant": variant->{title}
        }
      `;
      const data = await client.fetch(
        query,
        { selectedCategory, selectedBrand, searchQuery },
        { next: { revalidate: 0 } }
      );
      setProducts(data);
    } catch (error) {
      console.log("Shop product fetching Error", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, selectedBrand, searchQuery]);

  return (
    <div className="border-t min-h-screen bg-slate-50/30">
      <Container className="mt-5">
        
        {/* 1. Header Section */}
        <div className="mb-6 bg-white p-4 rounded-2xl border border-slate-100 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-0.5">
              <Title className="text-sm font-bold uppercase tracking-wider text-slate-400">
                Showroom Inventory
              </Title>
              <h1 className="text-xl font-black text-slate-900 tracking-tight sm:text-2xl">
                {searchQuery ? `Search Results for "${searchQuery}"` : "Find products that fit your needs"}
              </h1>
            </div>

            <div className="flex items-center gap-3">
              {(selectedCategory !== null || selectedBrand !== null || searchQuery !== "") && (
                <button
                  onClick={() => {
                    setSelectedCategory(null);
                    setSelectedBrand(null);
                    setSearchQuery("");
                  }}
                  className="text-xs font-semibold uppercase tracking-wider text-rose-600 hover:text-rose-700 bg-rose-50 px-3 py-2 rounded-xl transition-all cursor-pointer"
                >
                  Reset Filters
                </button>
              )}

              <button
                onClick={() => setIsMobileFilterOpen(true)}
                className="flex md:hidden items-center gap-2 bg-slate-950 text-white text-sm font-bold px-4 py-2.5 rounded-xl transition hover:bg-slate-800 shadow-sm cursor-pointer"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
              </button>
            </div>
          </div>
        </div>

        {/* Main Workspace Layout */}
        <div className="flex flex-col md:flex-row gap-6 items-start">
          
          {/* Mobile Drawer Overlay */}
          <div
            className={`fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs transition-opacity duration-300 md:hidden ${
              isMobileFilterOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
            }`}
            onClick={() => setIsMobileFilterOpen(false)}
          />

          <aside
            className={`fixed top-0 bottom-0 left-0 z-50 flex w-72 max-w-[80vw] flex-col bg-white p-6 shadow-2xl transition-transform duration-300 ease-in-out md:static md:z-0 md:w-64 md:max-w-none md:translate-x-0 md:p-0 md:bg-transparent md:shadow-none md:border-r border-slate-200/60 md:pr-4 ${
              isMobileFilterOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100 md:hidden">
              <span className="font-bold text-slate-900 text-base">Filter Options</span>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="p-1.5 rounded-lg bg-slate-50 text-slate-500 hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-6 pr-1 scrollbar-hide md:max-h-[calc(100vh-180px)] md:sticky md:top-6">
              <CategoryList
                categories={categories}
                selectedCategory={selectedCategory}
                setSelectedCategory={(cat) => {
                  setSelectedCategory(cat);
                }}
              />
              <BrandList
                brands={brands}
                // 🚀 FIXED: Passing the raw state dispatch handler matches the type definition inside BrandList.tsx perfectly
                setSelectedBrand={setSelectedBrand}
                selectedBrand={selectedBrand}
              />
            </div>
          </aside>

          {/* Product Catalog Grid View Workspace */}
          <div className="flex-1 w-full">
            {loading ? (
              <div className="p-20 flex flex-col gap-3 items-center justify-center bg-white rounded-3xl border border-slate-100 shadow-xs min-h-[400px]">
                <Loader2 className="w-9 h-9 text-slate-900 animate-spin" />
                <p className="font-bold tracking-tight text-slate-800 text-base">
                  Fetching current catalog availability...
                </p>
              </div>
            ) : products?.length > 0 ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
                {products?.map((product) => (
                  <ProductCard key={product?._id} product={product as any} isCatalogueMode={true} />
                ))}
              </div>
            ) : (
              <NoProductAvailable className="bg-white mt-0 rounded-3xl border border-slate-100 shadow-xs" />
            )}
          </div>

        </div>
      </Container>
    </div>
  );
};

export default Shop;