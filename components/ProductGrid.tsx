"use client";

import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { motion, AnimatePresence } from "motion/react";
import { client } from "@/sanity/lib/client";
import NoProductAvailable from "./NoProductAvailable";
import { Loader2, ArrowRight } from "lucide-react";
import Container from "./Container";
import HomeTabbar from "./HomeTabbar";
import { Product } from "@/sanity.types";
import Link from "next/link";

interface Props {
  // 🚀 FIXED: Now seamlessly accepts a string array input directly from your optimized query logic
  initialTabs: string[]; 
  limit?: number; 
}

const ProductGrid = ({ initialTabs, limit }: Props) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Sets default fallback safely to the first element string ("Featured")
  const [selectedTab, setSelectedTab] = useState<string>(initialTabs[0] || "Featured");

  useEffect(() => {
    if (!selectedTab) return;

    const sliceQuery = limit ? `[0...$limit]` : "";
    
    // 🚀 FIXED: Dynamic conditional filter parameters. 
    // If 'Featured' is chosen, check isFeatured tag status. Else, link to specific variant titles.
    const query = `*[_type == "product" && (
      ($variantTitle == "Featured" && isFeatured == true)
      ||
      (variant->title == $variantTitle)
    )] | order(_createdAt desc) ${sliceQuery} {
      ...,
      "brand": brand->{brandName},
      "variant": variant->{title}
    }`;

    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await client.fetch(query, { 
          variantTitle: selectedTab,
          limit: limit ?? 100 
        });
        setProducts(response);
      } catch (error) {
        console.log("❌ Product fetching Error", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedTab, limit]);

  return (
    <Container className="flex flex-col lg:px-0 my-10">
      {/* Dynamic Tabbar Sync Engine */}
      <HomeTabbar 
        selectedTab={selectedTab} 
        onTabSelect={setSelectedTab} 
        tabs={initialTabs} // 🚀 FIXED: Drops your clean string array directly inside the component props
      />
      
      {loading ? (
        <div className="flex flex-col items-center justify-center py-10 min-h-80 space-y-4 text-center bg-gray-100 rounded-lg w-full mt-10">
          <motion.div className="flex items-center space-x-2 text-slate-900">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Product is loading...</span>
          </motion.div>
        </div>
      ) : products?.length ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mt-10">
            <AnimatePresence mode="popLayout">
              {products?.map((product) => (
                <motion.div
                  key={product?._id}
                  layout
                  initial={{ opacity: 0.2 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ProductCard product={product} isCatalogueMode={true} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {limit && products.length >= limit && (
            <div className="mt-10 flex justify-center">
              <Link
                href="/shop"
                className="group inline-flex items-center gap-2 bg-white hover:bg-slate-950 text-slate-900 hover:text-white px-6 py-3 rounded-xl border border-slate-200 hover:border-slate-950 font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-xs hover:shadow-md active:scale-98 cursor-pointer"
              >
                <span>Explore Entire Showroom</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          )}
        </>
      ) : (
        <NoProductAvailable selectedTab={selectedTab} />
      )}
    </Container>
  );
};

export default ProductGrid;