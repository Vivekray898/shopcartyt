"use client";

import { BRANDS_QUERY_RESULT } from "@/sanity.types"; 
import React from "react";
import Title from "../Title";
import { Checkbox } from "../ui/checkbox";

interface Props {
  brands: BRANDS_QUERY_RESULT; 
  selectedBrands: string[];
  setSelectedBrands: (brands: string[]) => void;
}

const BrandList = ({ brands, selectedBrands, setSelectedBrands }: Props) => {
  // Toggle brand selection - immediate update
  const toggleBrand = (slugKey: string) => {
    const safeBrands = Array.isArray(selectedBrands) ? selectedBrands : [];
    if (safeBrands.includes(slugKey)) {
      setSelectedBrands(safeBrands.filter((s) => s !== slugKey));
    } else {
      setSelectedBrands([...safeBrands, slugKey]);
    }
  };

  // Check if a brand is selected
  const isSelected = (slugKey: string) => {
    const safeBrands = Array.isArray(selectedBrands) ? selectedBrands : [];
    return safeBrands.includes(slugKey);
  };

  const safeSelectedBrands = Array.isArray(selectedBrands) ? selectedBrands : [];
  const selectedCount = safeSelectedBrands.length;

  return (
    <div className="w-full bg-white p-4 rounded-2xl border border-slate-100 shadow-xs">
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-50">
        <Title className="text-xs font-black uppercase tracking-wider text-slate-400">
          Geschäfte & Outlets
        </Title>
        <div className="flex items-center gap-2">
          {selectedCount > 0 && (
            <span className="text-[10px] font-bold text-shop_dark_green bg-shop_dark_green/10 px-2 py-0.5 rounded-full">
              {selectedCount}
            </span>
          )}
          <button
            onClick={() => setSelectedBrands([])}
            className="text-[10px] font-bold uppercase tracking-wider text-rose-600 hover:text-rose-700 bg-rose-50 px-2 py-1 rounded-lg transition-all cursor-pointer"
          >
            Clear
          </button>
        </div>
      </div>
      
      <div className="max-h-[200px] overflow-y-auto pr-1.5 space-y-1 scrollbar-thin scrollbar-thumb-slate-200">
        <div className="space-y-1">
          {brands?.map((brand: any) => {
            const slugKey = brand?.slug?.current as string;
            const selected = isSelected(slugKey);

            return (
              <div
                key={brand?._id}
                onClick={() => toggleBrand(slugKey)}
                className="flex items-center space-x-2 hover:cursor-pointer py-1 px-1.5 rounded-lg hover:bg-slate-50 transition-colors w-full min-w-0"
              >
                <Checkbox
                  checked={selected}
                  onCheckedChange={() => toggleBrand(slugKey)}
                  id={brand?.slug?.current}
                  className="h-3.5 w-3.5 rounded border-slate-300 data-[state=checked]:bg-shop_dark_green data-[state=checked]:border-shop_dark_green flex-shrink-0"
                />
                <label
                  htmlFor={brand?.slug?.current}
                  className={`text-xs cursor-pointer select-none truncate block flex-1 min-w-0 ${
                    selected
                      ? "font-bold text-shop_dark_green"
                      : "font-semibold text-slate-700"
                  }`}
                >
                  {brand?.title}
                </label>
                {selected && (
                  <span className="text-[9px] font-bold text-shop_dark_green flex-shrink-0">
                    ✓
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BrandList;