"use client";

import { Category } from "@/sanity.types";
import React, { useState, useEffect } from "react";
import Title from "../Title";
import { Checkbox } from "../ui/checkbox";
import { ChevronDown, ChevronRight } from "lucide-react";

interface ExtendedCategory extends Category {
  parent?: {
    _id: string;
    title: string;
    slug: { current: string };
  } | null;
}

interface Props {
  categories: ExtendedCategory[];
  selectedCategories: string[];
  setSelectedCategories: (categories: string[]) => void;
}

const CategoryList = ({
  categories,
  selectedCategories,
  setSelectedCategories,
}: Props) => {
  const [expandedParents, setExpandedParents] = useState<Record<string, boolean>>({});

  const mainCategories = categories?.filter((cat) => !cat.parent) || [];
  const subCategories = categories?.filter((cat) => cat.parent) || [];

  // Auto-expand parents when subcategories are selected
  useEffect(() => {
    if (selectedCategories.length > 0) {
      const newExpandedParents = { ...expandedParents };
      selectedCategories.forEach((slug) => {
        const activeSub = subCategories.find((sub) => sub.slug?.current === slug);
        if (activeSub && activeSub.parent) {
          const parentId = (activeSub.parent as any)._ref || activeSub.parent._id;
          if (parentId) {
            newExpandedParents[parentId] = true;
          }
        }
      });
      setExpandedParents(newExpandedParents);
    }
  }, [selectedCategories, categories]);

  const toggleParentExpand = (e: React.MouseEvent, parentId: string) => {
    e.stopPropagation();
    setExpandedParents((prev) => ({ ...prev, [parentId]: !prev[parentId] }));
  };

  // Toggle category selection - immediate update
  const toggleCategory = (slugKey: string) => {
    const safeCategories = Array.isArray(selectedCategories) ? selectedCategories : [];
    if (safeCategories.includes(slugKey)) {
      setSelectedCategories(safeCategories.filter((s) => s !== slugKey));
    } else {
      setSelectedCategories([...safeCategories, slugKey]);
    }
  };

  // Check if a category is selected
  const isSelected = (slugKey: string) => {
    const safeCategories = Array.isArray(selectedCategories) ? selectedCategories : [];
    return safeCategories.includes(slugKey);
  };

  const renderCategoryItem = (category: ExtendedCategory, isSub = false) => {
    const slugKey = category?.slug?.current as string;
    const selected = isSelected(slugKey);

    return (
      <div
        onClick={() => toggleCategory(slugKey)}
        key={category?._id}
        className={`flex items-center space-x-2 w-full min-w-0 hover:cursor-pointer py-1 px-1.5 rounded-xl hover:bg-slate-50 transition-colors ${
          isSub ? "pl-1 mt-0.5 text-slate-600" : "mt-1 text-slate-800"
        }`}
      >
        <Checkbox
          checked={selected}
          onCheckedChange={() => toggleCategory(slugKey)}
          id={category?.slug?.current}
          className="h-3.5 w-3.5 rounded border-slate-300 data-[state=checked]:bg-shop_dark_green data-[state=checked]:border-shop_dark_green flex-shrink-0"
        />
        
        <label
          htmlFor={category?.slug?.current}
          className={`text-xs cursor-pointer select-none truncate block flex-1 min-w-0 ${
            selected
              ? "font-bold text-shop_dark_green"
              : isSub
              ? "font-medium text-slate-500 hover:text-slate-900"
              : "font-semibold text-slate-800"
          }`}
          title={category?.title}
        >
          {category?.title}
        </label>

        {isSub && selected && (
          <span className="text-[9px] font-bold text-shop_dark_green bg-shop_dark_green/10 px-1.5 py-0.5 rounded-full flex-shrink-0">
            ✓
          </span>
        )}
      </div>
    );
  };

  const safeSelectedCategories = Array.isArray(selectedCategories) ? selectedCategories : [];
  const selectedCount = safeSelectedCategories.length;

  return (
    <div className="w-full bg-white p-4 rounded-2xl border border-slate-100/80 shadow-xs max-w-full overflow-hidden">
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-50">
        <Title className="text-xs font-black uppercase tracking-wider text-slate-400">
          Kategorien
        </Title>
        <div className="flex items-center gap-2">
          {selectedCount > 0 && (
            <span className="text-[10px] font-bold text-shop_dark_green bg-shop_dark_green/10 px-2 py-0.5 rounded-full">
              {selectedCount}
            </span>
          )}
          <button
            onClick={() => setSelectedCategories([])}
            className="text-[10px] font-bold uppercase tracking-wider text-rose-600 hover:text-rose-700 bg-rose-50 px-2 py-1 rounded-lg transition-all cursor-pointer"
          >
            Clear
          </button>
        </div>
      </div>

      <div className="max-h-[260px] overflow-y-auto pr-1.5 scrollbar-thin scrollbar-thumb-slate-200">
        <div className="space-y-1 w-full max-w-full">
          {mainCategories.map((mainCat) => {
            const hasChildren = subCategories.some(
              (sub) => sub.parent?._id === mainCat._id || (sub.parent as any)?._ref === mainCat._id
            );
            const isExpanded = !!expandedParents[mainCat._id];
            const children = subCategories.filter(
              (sub) => sub.parent?._id === mainCat._id || (sub.parent as any)?._ref === mainCat._id
            );

            const hasSelectedChildren = children.some(
              (child) => isSelected(child.slug?.current as string)
            );

            return (
              <div key={mainCat._id} className="space-y-0.5 block w-full max-w-full overflow-hidden">
                <div className="flex items-center justify-between w-full min-w-0 group pr-1">
                  <div className="flex-1 min-w-0">
                    {renderCategoryItem(mainCat, false)}
                  </div>
                  
                  {hasChildren && (
                    <button
                      type="button"
                      onClick={(e) => toggleParentExpand(e, mainCat._id)}
                      className={`p-1 rounded-md hover:bg-slate-100 transition-colors ml-1 flex-shrink-0 cursor-pointer ${
                        hasSelectedChildren ? "text-shop_dark_green" : "text-slate-400 hover:text-slate-700"
                      }`}
                    >
                      {isExpanded ? (
                        <ChevronDown className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5" />
                      )}
                    </button>
                  )}
                </div>

                {hasChildren && isExpanded && (
                  <div className="border-l-2 border-slate-100 ml-3.5 pl-2 space-y-0.5 block w-full max-w-full overflow-hidden animate-fadeIn">
                    {children.map((childCat) => (
                      <div key={childCat._id} className="w-full min-w-0 block truncate">
                        {renderCategoryItem(childCat, true)}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {mainCategories.length === 0 && categories?.map((cat) => renderCategoryItem(cat, false))}
        </div>
      </div>
    </div>
  );
};

export default CategoryList;