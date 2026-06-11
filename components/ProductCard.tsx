"use client";

import React from "react";
import { Product } from "@/sanity.types";
import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import FavoriteButton from "./FavoriteButton";
import { Star } from "lucide-react";
import PriceView from "./PriceView";

interface Props {
  product: Product;
  isCatalogueMode?: boolean; 
}

const ProductCard = ({ product, isCatalogueMode = true }: Props) => {
  const productName = product?.name || "Unnamed Product";
  const hasDiscount = product?.price !== undefined && product?.price > 0 && product?.discount !== undefined && product?.discount > 0;
  const isOutOfStock = (product?.stock ?? 0) <= 0;

  const resolvedVariant = typeof product?.variant === "object" && product?.variant !== null
    ? (product.variant as any)?.title
    : "General";

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl bg-white shadow-xs border border-slate-100/70 transition-all duration-300 hover:shadow-md hover:shadow-slate-200/50">
      
      {/* 1. Image Preview Frame Area (FIXED: Isolated grid box preventing clipping) */}
      <div className="relative aspect-square w-full overflow-hidden bg-slate-50/60 p-3 flex items-center justify-center border-b border-slate-100/40">
        {product?.images && product.images[0] ? (
          <Link href={`/product/${product?.slug?.current}`} className="block relative w-full h-full">
            <Image
              src={urlFor(product.images[0]).url()}
              alt={productName}
              fill
              priority
              sizes="(max-width: 768px) 50vw, 25vw"
              // FIXED: Switched back to object-contain so nothing ever gets cut out of view!
              className="object-contain w-full h-full mix-blend-multiply transition-transform duration-500 ease-out group-hover:scale-105"
            />
          </Link>
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs font-medium text-slate-400">
            No Image
          </div>
        )}

        {/* Status/Discount Badges Overlay */}
        {product?.status && (
          <div className="absolute top-2 left-2 z-10">
            <span className="rounded-md bg-slate-900/85 px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-white shadow-xs">
              {product.status}
            </span>
          </div>
        )}

        {/* Wishlist Button Overlay */}
        <div className="absolute top-2 right-2 z-10 transition-all duration-200 hover:scale-110">
          <FavoriteButton product={product} />
        </div>
      </div>

      {/* 2. Text Content Details */}
      <div className="flex flex-col flex-1 p-3 bg-white">
        
        {/* Brand / Type Tag */}
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide line-clamp-1">
          {resolvedVariant}
        </span>
        
        {/* Product Title */}
        <Link href={`/product/${product?.slug?.current}`} className="mt-0.5 block">
          <h2 className="line-clamp-1 text-xs md:text-sm font-bold text-slate-800 group-hover:text-slate-950 tracking-tight transition-colors">
            {productName}
          </h2>
        </Link>

        {/* Pricing & Discount Matrix Block */}
        <div className="mt-1 flex flex-wrap items-baseline gap-1.5">
          <PriceView 
            price={product?.price} 
            discount={product?.discount} 
            className="text-sm md:text-base font-black text-slate-900 tracking-tight" 
          />
          {hasDiscount && (
            <span className="text-[10px] font-extrabold text-emerald-600 bg-emerald-50 px-1 rounded-sm">
              {Math.round((product.discount! / (product.price! + product.discount!)) * 100)}% off
            </span>
          )}
        </div>

        {/* Compact Rating Ribbon Row */}
        <div className="mt-1.5 flex items-center gap-2">
          <div className="inline-flex items-center gap-0.5 bg-emerald-600 text-white font-black text-[10px] px-1.5 py-0.5 rounded-md shadow-2xs">
            <span>5.0</span>
            <Star className="h-2.5 w-2.5 fill-white text-white" />
          </div>
          <span className="text-[10px] font-semibold text-slate-400">(120)</span>
        </div>

        {/* Availability / Shipping Status Bar */}
        <div className="mt-2 flex items-center gap-1.5 text-[10px] font-bold">
          <span className={`h-1.5 w-1.5 rounded-full ${isOutOfStock ? 'bg-amber-400 animate-pulse' : 'bg-emerald-500'}`} />
          <p className={isOutOfStock ? 'text-amber-600' : 'text-slate-500'}>
            {isOutOfStock ? 'Call For Availability' : 'Free Delivery'}
          </p>
        </div>

        {/* 3. Action Buttons */}
        <div className="mt-3.5">
          {isCatalogueMode ? (
            <Link
              href={`/product/${product?.slug?.current}`}
              className="flex min-h-[34px] w-full items-center justify-center rounded-xl border border-slate-200/80 bg-white text-xs font-bold text-slate-700 shadow-2xs transition-all duration-200 hover:bg-slate-950 hover:text-white hover:border-slate-950 cursor-pointer"
            >
              View Details
            </Link>
          ) : (
            <button 
              disabled={isOutOfStock}
              className="flex min-h-[34px] w-full items-center justify-center gap-1.5 rounded-xl bg-emerald-600 text-xs font-bold text-white transition-all duration-200 hover:bg-emerald-700 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed cursor-pointer"
            >
              {isOutOfStock ? "Out of Stock" : "Add to Cart"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;