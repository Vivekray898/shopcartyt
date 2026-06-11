import React from "react";
import Title from "./Title";
import { Category } from "@/sanity.types";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import Link from "next/link";

const HomeCategories = ({ categories }: { categories: Category[] }) => {
  return (
    <div className="bg-white border border-shop_light_green/20 my-10 md:my-20 p-5 lg:p-7 rounded-2xl shadow-xs">
      <Title className="border-b pb-3">Popular Categories</Title>
      <div className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {categories?.map((category) => {
          // FIXED: Extracted productCount using an unsafe type assert fallback to prevent build halts
          const count = (category as any)?.productCount ?? 0;

          return (
            <div
              key={category?._id}
              className="bg-shop_light_bg p-5 flex items-center gap-3 group rounded-xl border border-transparent transition-all duration-300 hover:border-shop_orange/20"
            >
              {category?.image && (
                <div className="overflow-hidden border border-shop_orange/30 rounded-lg bg-white hover:border-shop_orange hoverEffect w-20 h-20 p-1 flex items-center justify-center">
                  <Link href={`/category/${category?.slug?.current}`} className="w-full h-full block relative">
                    <Image
                      src={urlFor(category?.image).url()}
                      alt={category?.title || "categoryImage"}
                      width={120}
                      height={120}
                      className="w-full h-full object-contain group-hover:scale-110 hoverEffect"
                    />
                  </Link>
                </div>
              )}
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-800">{category?.title}</h3>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <span className="font-black text-shop_dark_green">{`(${count})`}</span>{" "}
                  Items Available
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HomeCategories;