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

  // Safely grab your custom product type name string from the reference map
  const resolvedVariant = typeof product?.variant === "object" && product?.variant !== null
    ? (product.variant as any)?.title
    : "General";

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white p-3.5 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:shadow-slate-200/60">
      
      {/* 1. Image Preview Area */}
      <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-slate-50/80 transition-colors duration-300 group-hover:bg-slate-50">
        {product?.images && product.images[0] ? (
          <Link href={`/product/${product?.slug?.current}`} className="block h-full w-full">
            <Image
              src={urlFor(product.images[0]).url()}
              alt={productName}
              fill
              priority
              sizes="(max-width: 768px) 50vw, 25vw"
              className="h-full w-full object-contain p-3 transition-transform duration-500 ease-out group-hover:scale-105"
            />
          </Link>
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs font-medium text-slate-400">
            No Image Found
          </div>
        )}

        {/* Dynamic Status/Discount Badges Overlay */}
        <div className="absolute top-2 left-2 z-10 flex flex-col gap-1.5">
          {product?.status && (
            <span className="rounded-md bg-slate-900/90 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-xs backdrop-blur-xs">
              {product.status}
            </span>
          )}
          {hasDiscount && (
            <span className="rounded-md bg-emerald-600 px-2 py-0.5 text-[10px] font-bold tracking-wide text-white shadow-xs">
              -{Math.round((product.discount! / (product.price! + product.discount!)) * 100)}%
            </span>
          )}
        </div>

        {/* Wishlist Button Overlay */}
        <div className="absolute top-2 right-2 z-10 transition-transform duration-200 hover:scale-110">
          <FavoriteButton product={product} />
        </div>
      </div>

      {/* 2. Text Content Details */}
      <div className="flex flex-col flex-1 pt-3">
        
        {/* Product Type/Category Tag */}
        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400/90">
          {resolvedVariant}
        </p>
        
        {/* Product Name Title */}
        <Link href={`/product/${product?.slug?.current}`} className="mt-1 block">
          <h2 className="line-clamp-1 text-sm font-bold text-slate-800 tracking-tight transition-colors duration-200 group-hover:text-slate-950">
            {productName}
          </h2>
        </Link>

        {/* Ratings Section */}
        <div className="mt-1 flex items-center gap-0.5">
          {Array.from({ length: 5 }).map((_, index) => (
            <Star key={index} className="h-3 w-3 fill-amber-400 text-amber-400" />
          ))}
          <span className="text-[10px] font-semibold text-slate-400/90 ml-1">5.0</span>
        </div>

        {/* Stock Status Indicator */}
        <div className="mt-2 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider">
          <span className={`h-1.5 w-1.5 rounded-full ${isOutOfStock ? 'bg-amber-500' : 'bg-emerald-500'}`} />
          <p className={isOutOfStock ? 'text-amber-600' : 'text-emerald-600'}>
            {isOutOfStock ? 'Call For Availability' : `In Stock: ${product.stock}`}
          </p>
        </div>

        {/* Pricing Layout Block */}
        <div className="mt-2.5 pt-2 border-t border-slate-50">
          <PriceView 
            price={product?.price} 
            discount={product?.discount} 
            className="text-base font-black text-slate-900 tracking-tight" 
          />
        </div>

        {/* 3. Action Button Trigger */}
        <div className="mt-3.5">
          {isCatalogueMode ? (
            <Link
              href={`/product/${product?.slug?.current}`}
              className="flex min-h-[38px] w-full items-center justify-center rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 shadow-2xs transition-all duration-200 hover:bg-slate-950 hover:text-white hover:border-slate-950"
            >
              View Details
            </Link>
          ) : (
            <button 
              disabled={isOutOfStock}
              className="flex min-h-[38px] w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 text-xs font-bold text-white transition-all duration-200 hover:bg-emerald-700 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed"
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