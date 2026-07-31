"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/sanity/lib/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import PriceView from "./PriceView";

interface RelatedProduct {
  _id: string;
  name: string;
  slug: { current: string };
  price?: number;
  discount?: number;
  stock?: number;
  images?: any[];
  brand?: {
    title?: string;
    brandName?: string;
    slug?: { current: string };
  };
}

interface RelatedProductsProps {
  products: RelatedProduct[];
  title?: string;
  maxDisplay?: number;
}

const RelatedProducts = ({ 
  products, 
  title = "Mehr Produkte entdecken",
  maxDisplay = 12 
}: RelatedProductsProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  // If no products, don't render
  if (!products || products.length === 0) {
    return null;
  }

  const displayProducts = products.slice(0, maxDisplay);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      const currentScroll = scrollContainerRef.current.scrollLeft;
      const newScroll = direction === "left" 
        ? currentScroll - scrollAmount 
        : currentScroll + scrollAmount;
      
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
      // Check initial scroll state
      setTimeout(handleScroll, 100);
      
      // Check on resize
      window.addEventListener("resize", handleScroll);
      
      return () => {
        container.removeEventListener("scroll", handleScroll);
        window.removeEventListener("resize", handleScroll);
      };
    }
  }, []);

  return (
    <div className="mt-12 pt-8 border-t border-gray-200">
      {/* Header with title and view all link */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
          {title}
        </h2>
        <Link 
          href="/shop" 
          className="text-sm font-semibold text-shop_light_green hover:text-shop_light_green/80 transition-colors hover:underline"
        >
          Alle anzeigen →
        </Link>
      </div>

      {/* Scrollable products container */}
      <div 
        className="relative group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Navigation arrows */}
        {showLeftArrow && (
          <button
            onClick={() => scroll("left")}
            className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-slate-700 hover:text-shop_light_green p-2.5 rounded-full shadow-lg border border-gray-200 transition-all duration-200 ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
            style={{ transform: "translateY(-50%)" }}
          >
            <ChevronLeft size={20} />
          </button>
        )}

        {showRightArrow && (
          <button
            onClick={() => scroll("right")}
            className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-slate-700 hover:text-shop_light_green p-2.5 rounded-full shadow-lg border border-gray-200 transition-all duration-200 ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
            style={{ transform: "translateY(-50%)" }}
          >
            <ChevronRight size={20} />
          </button>
        )}

        {/* Products grid - horizontal scroll */}
        <div
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto scroll-smooth pb-4 scrollbar-hide"
          style={{ 
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {displayProducts.map((product) => (
            <Link
              key={product._id}
              href={`/product/${product.slug?.current}`}
              className="flex-shrink-0 w-[200px] sm:w-[220px] bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group/product"
            >
              {/* Product Image */}
              <div className="relative aspect-square bg-gray-50 overflow-hidden">
                {product.images && product.images.length > 0 && (
                  <Image
                    src={urlFor(product.images[0]).url()}
                    alt={product.name}
                    width={220}
                    height={220}
                    className="w-full h-full object-cover group-hover/product:scale-105 transition-transform duration-300"
                  />
                )}
                {/* Stock badge */}
                {(product.stock ?? 0) <= 0 && (
                  <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    Ausverkauft
                  </span>
                )}
              </div>

              {/* Product Info */}
              <div className="p-3">
                {product.brand && (
                  <p className="text-xs text-gray-500 font-medium truncate">
                    {product.brand.brandName || product.brand.title}
                  </p>
                )}
                <h3 className="text-sm font-semibold text-slate-800 line-clamp-2 h-10">
                  {product.name}
                </h3>
                <div className="mt-2">
                  <PriceView 
                    price={product.price} 
                    discount={product.discount} 
                    className="text-sm font-bold"
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile scroll indicator */}
      <div className="flex justify-center gap-1 mt-4 md:hidden">
        {displayProducts.length > 4 && (
          <div className="flex gap-1">
            <div className="w-2 h-2 rounded-full bg-shop_light_green"></div>
            <div className="w-2 h-2 rounded-full bg-gray-300"></div>
            <div className="w-2 h-2 rounded-full bg-gray-300"></div>
          </div>
        )}
      </div>

      {/* Add scrollbar-hide to global CSS */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default RelatedProducts;