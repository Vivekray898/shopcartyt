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
  return (
    <div className="mb-10 lg:mb-20 bg-shop_light_bg p-5 lg:p-7 rounded-2xl border border-slate-100">
      <div className="flex items-center gap-5 justify-between mb-10">
        {/* 🏛️ FIXED: Changed from "Shop By Brands" to represent your storefront / showroom natively */}
        <Title>Our Store</Title>
        <Link
          href={"/shop"}
          className="text-sm font-bold tracking-wide text-slate-500 hover:text-shop_btn_dark_green hoverEffect"
        >
          View all
        </Link>
      </div>
      
      {/* Brands Grid Layout */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
        {brands?.map((brand) => (
          <Link
            key={brand?._id}
            href={{ pathname: "/shop", query: { brand: brand?.slug?.current } }}
            className="bg-white aspect-[34/24] w-full flex items-center justify-center rounded-xl overflow-hidden hover:shadow-md border border-slate-100 transition-all duration-300 hover:-translate-y-0.5"
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