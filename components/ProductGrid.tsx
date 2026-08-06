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
import { useRouter, useSearchParams } from "next/navigation";

interface Props {
  initialTabs: string[]; 
  limit?: number; 
}

const ProductGrid = ({ initialTabs, limit }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [isCheckingTabs, setIsCheckingTabs] = useState(true);
  const [availableTabs, setAvailableTabs] = useState<string[]>([]);
  const [selectedTab, setSelectedTab] = useState<string>("");

  // Read tab from URL on mount
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && initialTabs.includes(tabParam)) {
      setSelectedTab(tabParam);
    }
  }, [searchParams, initialTabs]);

  // Update URL when tab changes
  const handleTabSelect = (tab: string) => {
    setSelectedTab(tab);
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', tab);
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  // Fetch all tabs data
  useEffect(() => {
    const fetchAllTabsData = async () => {
      setIsCheckingTabs(true);
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
          console.log(`❌ Fehler beim Abrufen der Produkte für Tab: ${tab}`, error);
        }
      }
      
      setAvailableTabs(tabsWithProducts);
      
      // Only set selected tab if not already set from URL
      if (tabsWithProducts.length > 0) {
        const urlTab = searchParams.get('tab');
        if (!urlTab || !tabsWithProducts.includes(urlTab)) {
          setSelectedTab(tabsWithProducts[0]);
          // Update URL with default tab
          const params = new URLSearchParams(searchParams.toString());
          params.set('tab', tabsWithProducts[0]);
          router.replace(`?${params.toString()}`, { scroll: false });
        }
      } else {
        setSelectedTab("");
      }
      
      setIsCheckingTabs(false);
    };

    fetchAllTabsData();
  }, [initialTabs, limit, searchParams, router]);

  // Fetch products for selected tab
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
        console.log("❌ Fehler beim Abrufen der Produkte", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedTab, limit]);

  if (isCheckingTabs) {
    return (
      <Container className="flex flex-col lg:px-0 my-10">
        <div className="flex flex-col items-center justify-center py-10 min-h-80 space-y-4 text-center bg-gray-100 rounded-lg w-full mt-10">
          <motion.div className="flex items-center space-x-2 text-slate-900">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Verfügbare Produkte werden geladen...</span>
          </motion.div>
        </div>
      </Container>
    );
  }

  if (availableTabs.length === 0 && !loading) {
    return (
      <Container className="flex flex-col lg:px-0 my-10">
        <div className="flex flex-col items-center justify-center py-10 min-h-80 space-y-4 text-center bg-gray-100 rounded-lg w-full mt-10">
          <p className="text-lg font-medium text-gray-600">Derzeit sind keine Produkte verfügbar</p>
          <p className="text-sm text-gray-500">Bitte schauen Sie später wieder vorbei</p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="flex flex-col lg:px-0 my-10">
      {availableTabs.length > 0 && (
        <HomeTabbar 
          selectedTab={selectedTab} 
          onTabSelect={handleTabSelect} 
          tabs={availableTabs}
        />
      )}
      
      {loading ? (
        <div className="flex flex-col items-center justify-center py-10 min-h-80 space-y-4 text-center bg-gray-100 rounded-lg w-full mt-10">
          <motion.div className="flex items-center space-x-2 text-slate-900">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Produkte werden geladen...</span>
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
                <span>Gesamtes Showroom entdecken</span>
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