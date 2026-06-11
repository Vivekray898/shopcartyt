"use client";

import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { motion, AnimatePresence } from "motion/react";
import { client } from "@/sanity/lib/client";
import NoProductAvailable from "./NoProductAvailable";
import { Loader2 } from "lucide-react";
import Container from "./Container";
import HomeTabbar from "./HomeTabbar";
import { Product } from "@/sanity.types";

interface TabItem {
  _id: string;
  title: string;
}

interface Props {
  initialTabs: TabItem[];
}

const ProductGrid = ({ initialTabs }: Props) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Sets the default active tab state to the first dynamic Sanity document title
  const [selectedTab, setSelectedTab] = useState(initialTabs[0]?.title || "");

  // FIXED QUERY: Replaced "variant->_title" with the correct target key path "variant->title"
  const query = `*[_type == "product" && variant->title == $variantTitle] | order(name asc) {
    ...,
    "brand": brand->{brandName},
    "variant": variant->{title}
  }`;

  useEffect(() => {
    if (!selectedTab) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await client.fetch(query, { variantTitle: selectedTab });
        setProducts(response);
      } catch (error) {
        console.log("Product fetching Error", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedTab]);

  // Map dynamic tabs for the child HomeTabbar component mapping format
  const formattedTabs = initialTabs.map(tab => tab.title);

  return (
    <Container className="flex flex-col lg:px-0 my-10">
      {/* Dynamic Tabbar Sync Engine */}
      <HomeTabbar 
        selectedTab={selectedTab} 
        onTabSelect={setSelectedTab} 
        tabs={formattedTabs}
      />
      
      {loading ? (
        <div className="flex flex-col items-center justify-center py-10 min-h-80 space-y-4 text-center bg-gray-100 rounded-lg w-full mt-10">
          <motion.div className="flex items-center space-x-2 text-blue-600">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Product is loading...</span>
          </motion.div>
        </div>
      ) : products?.length ? (
        /* FIXED GRID BREAKPOINTS: Matches your clean 2-column mobile structure */
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
      ) : (
        <NoProductAvailable selectedTab={selectedTab} />
      )}
    </Container>
  );
};

export default ProductGrid;