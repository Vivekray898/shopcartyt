"use client";

import { BRANDS_QUERY_RESULT } from "@/sanity.types"; 
import React from "react";
import Title from "../Title";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";

interface Props {
  brands: BRANDS_QUERY_RESULT; 
  selectedBrand?: string | null;
  setSelectedBrand: React.Dispatch<React.SetStateAction<string | null>>;
}

const BrandList = ({ brands, selectedBrand, setSelectedBrand }: Props) => {
  return (
    <div className="w-full bg-white p-4 rounded-2xl border border-slate-100 shadow-xs">
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-50">
        <Title className="text-xs font-black uppercase tracking-wider text-slate-400">
          Geschäfte & Outlets
        </Title>
        {selectedBrand && (
          <button
            onClick={() => setSelectedBrand(null)}
            className="text-[10px] font-bold uppercase tracking-wider text-rose-600 hover:text-rose-700 bg-rose-50 px-2 py-1 rounded-lg transition-all cursor-pointer"
          >
            Clear
          </button>
        )}
      </div>
      
      {/* 🚀 FIXED SMARTPRIX VIEW: Isolated scrolling segment matrix block */}
      <div className="max-h-[200px] overflow-y-auto pr-1.5 space-y-1 scrollbar-thin scrollbar-thumb-slate-200">
        <RadioGroup value={selectedBrand || ""} className="space-y-1">
          {brands?.map((brand: any) => (
            <div
              key={brand?._id}
              onClick={() => setSelectedBrand(brand?.slug?.current as string)}
              className="flex items-center space-x-2 hover:cursor-pointer py-1 px-1.5 rounded-lg hover:bg-slate-50 transition-colors w-full min-w-0"
            >
              <RadioGroupItem
                value={brand?.slug?.current as string}
                id={brand?.slug?.current}
                className="rounded-full h-3.5 w-3.5 border-slate-300 text-shop_dark_green focus:ring-shop_dark_green flex-shrink-0"
              />
              <Label
                htmlFor={brand?.slug?.current}
                className={`text-xs cursor-pointer select-none truncate block flex-1 min-w-0 ${
                  selectedBrand === brand?.slug?.current 
                    ? "font-bold text-shop_dark_green bg-slate-100/50 px-1 py-0.5 rounded-md" 
                    : "font-semibold text-slate-700"
                }`}
              >
                {brand?.title}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    </div>
  );
};

export default BrandList;