// components/RecentlyViewed.tsx
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import PriceView from "./PriceView";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface RecentlyViewedProps {
  currentProductId?: string;
  currentProduct?: any; // Pass the full product data
  maxItems?: number;
}

const RecentlyViewed = ({ 
  currentProductId, 
  currentProduct,
  maxItems = 10 
}: RecentlyViewedProps) => {
  const [recentProducts, setRecentProducts] = useState<any[]>([]);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  // Save current product to recently viewed
  useEffect(() => {
    if (currentProduct && currentProductId) {
      try {
        // Get existing recently viewed products
        const stored = localStorage.getItem("recentlyViewed");
        let products = stored ? JSON.parse(stored) : [];
        
        // Remove duplicate if product already exists
        products = products.filter((p: any) => p._id !== currentProductId);
        
        // Add current product to the beginning
        const newProduct = {
          _id: currentProduct._id,
          name: currentProduct.name,
          slug: currentProduct.slug,
          price: currentProduct.price,
          discount: currentProduct.discount,
          stock: currentProduct.stock,
          images: currentProduct.images,
          brand: currentProduct.brand,
          viewedAt: new Date().toISOString()
        };
        
        products = [newProduct, ...products];
        
        // Keep only the most recent items
        if (products.length > 20) { // Store up to 20, display maxItems
          products = products.slice(0, 20);
        }
        
        localStorage.setItem("recentlyViewed", JSON.stringify(products));
      } catch (e) {
        console.error("Error saving recently viewed:", e);
      }
    }
  }, [currentProductId, currentProduct]);

  // Load recently viewed from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("recentlyViewed");
    if (stored) {
      try {
        const products = JSON.parse(stored);
        // Filter out current product and limit display
        const filtered = products
          .filter((p: any) => p._id !== currentProductId)
          .slice(0, maxItems);
        setRecentProducts(filtered);
      } catch (e) {
        console.error("Error loading recently viewed:", e);
      }
    }
  }, [currentProductId, maxItems]);

  // Scroll handling
  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      const newScroll = direction === "left" 
        ? scrollContainerRef.current.scrollLeft - scrollAmount
        : scrollContainerRef.current.scrollLeft + scrollAmount;
      
      scrollContainerRef.current.scrollTo({
        left: newScroll,
        behavior: "smooth",
      });
    }
  };

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 20);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 20);
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      setTimeout(handleScroll, 100);
      window.addEventListener("resize", handleScroll);
      return () => {
        container.removeEventListener("scroll", handleScroll);
        window.removeEventListener("resize", handleScroll);
      };
    }
  }, []);

  if (recentProducts.length === 0) return null;

  return (
    <div className="mt-8 pt-8 border-t border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-800">
          Zuletzt angesehen
        </h3>
        <span className="text-xs text-slate-400">
          {recentProducts.length} Produkte
        </span>
      </div>

      <div className="relative group">
        {/* Left Arrow */}
        {showLeftArrow && (
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-slate-700 hover:text-shop_light_green p-2 rounded-full shadow-lg border border-gray-200 transition-all duration-200 opacity-0 group-hover:opacity-100"
          >
            <ChevronLeft size={18} />
          </button>
        )}

        {/* Right Arrow */}
        {showRightArrow && (
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-slate-700 hover:text-shop_light_green p-2 rounded-full shadow-lg border border-gray-200 transition-all duration-200 opacity-0 group-hover:opacity-100"
          >
            <ChevronRight size={18} />
          </button>
        )}

        {/* Products Container */}
        <div
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto scroll-smooth pb-4"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {recentProducts.map((product) => (
            <Link
              key={product._id}
              href={`/product/${product.slug?.current}`}
              className="flex-shrink-0 w-[150px] bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-200 hover:-translate-y-1 group/product"
            >
              {/* Product Image */}
              <div className="relative aspect-square bg-gray-50 overflow-hidden">
                {product.images && product.images.length > 0 ? (
                  <Image
                    src={urlFor(product.images[0]).url()}
                    alt={product.name || "Product"}
                    width={150}
                    height={150}
                    className="w-full h-full object-cover group-hover/product:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400 text-xs">
                    Kein Bild
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-2">
                {product.brand && (
                  <p className="text-[10px] text-gray-500 font-medium truncate">
                    {product.brand.brandName || product.brand.title}
                  </p>
                )}
                <p className="text-xs font-medium text-slate-700 line-clamp-2 h-8">
                  {product.name}
                </p>
                <div className="mt-1">
                  <PriceView 
                    price={product.price} 
                    discount={product.discount} 
                    className="text-xs font-bold"
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Scrollbar hide styles */}
      <style jsx>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default RecentlyViewed;