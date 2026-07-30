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
  initialTabs: string[]; 
  limit?: number; 
}

const ProductGrid = ({ initialTabs, limit }: Props) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [availableTabs, setAvailableTabs] = useState<string[]>(initialTabs);
  
  // Sets default fallback safely to the first element string ("Featured")
  const [selectedTab, setSelectedTab] = useState<string>(initialTabs[0] || "Featured");

  // Fetch products for all tabs to determine which have products
  useEffect(() => {
    const fetchAllTabsData = async () => {
      const tabsWithProducts: string[] = [];
      
      for (const tab of initialTabs) {
        const sliceQuery = limit ? `[0...$limit]` : "";
        const query = `*[_type == "product" && (
          ($variantTitle == "Featured" && isFeatured == true)
          ||
          (variant->title == $variantTitle)
        )] | order(_createdAt desc) ${sliceQuery} {
          ...,
          "brand": brand->{brandName},
          "variant": variant->{title}
        }`;

        try {
          const response = await client.fetch(query, { 
            variantTitle: tab,
            limit: limit ?? 100 
          });
          
          if (response && response.length > 0) {
            tabsWithProducts.push(tab);
          }
        } catch (error) {
          console.log(`❌ Error fetching products for tab: ${tab}`, error);
        }
      }
      
      setAvailableTabs(tabsWithProducts);
      
      // If current selected tab has no products, switch to first available tab
      if (!tabsWithProducts.includes(selectedTab) && tabsWithProducts.length > 0) {
        setSelectedTab(tabsWithProducts[0]);
      }
    };

    fetchAllTabsData();
  }, [initialTabs, limit]);

  useEffect(() => {
    if (!selectedTab) return;

    const sliceQuery = limit ? `[0...$limit]` : "";
    
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

  // If no tabs have products, show a message
  if (availableTabs.length === 0 && !loading) {
    return (
      <Container className="flex flex-col lg:px-0 my-10">
        <div className="flex flex-col items-center justify-center py-10 min-h-80 space-y-4 text-center bg-gray-100 rounded-lg w-full mt-10">
          <p className="text-lg font-medium text-gray-600">No products available at the moment</p>
          <p className="text-sm text-gray-500">Please check back later</p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="flex flex-col lg:px-0 my-10">
      {/* Only show tabbar if there are available tabs */}
      {availableTabs.length > 0 && (
        <HomeTabbar 
          selectedTab={selectedTab} 
          onTabSelect={setSelectedTab} 
          tabs={availableTabs} // Pass only tabs that have products
        />
      )}
      
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