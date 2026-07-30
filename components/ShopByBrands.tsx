import React from "react";
import Title from "./Title";
import Link from "next/link";
import { getAllBrands } from "@/sanity/queries";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { BadgeCheck, Layers, FileText, Store } from "lucide-react";

// Catalog & showroom indicators
const extraData = [
  {
    title: "Official Distributor",
    description: "100% certified authentic brands",
    icon: <BadgeCheck size={40} className="stroke-[1.5]" />,
  },
  {
    title: "Bespoke Ordering",
    description: "Custom finishes & specifications",
    icon: <Layers size={40} className="stroke-[1.5]" />,
  },
  {
    title: "Showroom Viewing",
    description: "Experience product ranges in person",
    icon: <Store size={40} className="stroke-[1.5]" />,
  },
  {
    title: "Full Specifications",
    description: "Detailed technical documentation",
    icon: <FileText size={40} className="stroke-[1.5]" />,
  },
];

const ShopByBrands = async () => {
  const brands = await getAllBrands();
  
  // 🎯 Handle empty or minimal brands gracefully
  const hasBrands = brands && brands.length > 0;
  const brandCount = hasBrands ? brands.length : 0;
  
  return (
    <div className="mb-10 lg:mb-20 bg-shop_light_bg p-5 lg:p-7 rounded-2xl border border-slate-100">
      <div className="flex items-center gap-5 justify-between mb-10">
        <Title>Our Store</Title>
        <Link
          href={"/shop"}
          className="text-sm font-bold tracking-wide text-slate-500 hover:text-shop_btn_dark_green hoverEffect"
        >
          View all
        </Link>
      </div>
      
      {/* 🔄 FIXED: Brands Grid - Dynamic sizing based on count */}
      {hasBrands ? (
        <>
          <div className={`grid gap-4 ${
            brandCount <= 2 
              ? 'grid-cols-1 sm:grid-cols-2 max-w-3xl mx-auto' 
              : brandCount <= 4 
              ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 max-w-5xl mx-auto'
              : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8'
          }`}>
            {brands.map((brand) => (
              <Link
                key={brand?._id}
                href={{ pathname: "/shop", query: { brand: brand?.slug?.current } }}
                className="bg-white aspect-[34/24] w-full flex items-center justify-center rounded-xl overflow-hidden hover:shadow-lg border border-slate-100 transition-all duration-300 hover:-translate-y-1 hover:border-shop_light_green"
              >
                {brand?.image && (
                  <Image
                    src={urlFor(brand?.image).url()}
                    alt={(brand as any)?.brandName || (brand as any)?.title || "brandImage"}
                    width={200}
                    height={120}
                    className="w-4/5 h-4/5 object-contain p-2"
                  />
                )}
              </Link>
            ))}
          </div>
          
          {/* 🆕 Brand count indicator for small collections */}
          {brandCount <= 3 && (
            <div className="text-center mt-6 text-slate-500 text-sm">
              <span className="inline-block bg-white px-4 py-2 rounded-full border border-slate-100">
                {brandCount} {brandCount === 1 ? 'brand' : 'brands'} available
              </span>
            </div>
          )}
        </>
      ) : (
        // 🆕 Empty state when no brands
        <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-200">
          <Store size={48} className="mx-auto text-slate-300 mb-3" />
          <h3 className="text-lg font-semibold text-slate-600">No brands available</h3>
          <p className="text-slate-400 text-sm mt-1">Check back soon for new arrivals</p>
        </div>
      )}

      {/* Showroom Features Matrix Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-16 p-4 rounded-xl bg-white/60 border border-slate-50 py-6">
        {extraData?.map((item, index) => (
          <div
            key={index}
            className="flex items-start gap-3.5 group text-slate-400 hover:text-shop_light_green"
          >
            <span className="inline-flex scale-100 group-hover:scale-95 text-slate-800 group-hover:text-shop_light_green transition-all duration-300 mt-0.5">
              {item?.icon}
            </span>
            <div className="text-xs md:text-sm">
              <p className="text-slate-900 font-bold tracking-tight">
                {item?.title}
              </p>
              <p className="text-slate-500 font-medium mt-0.5 leading-relaxed">{item?.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShopByBrands;