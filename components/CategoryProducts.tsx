"use client";

import { Category, Product } from "@/sanity.types";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { client } from "@/sanity/lib/client";
import { AnimatePresence, motion } from "motion/react";
import { Loader2, ChevronDown, ChevronRight, Folder } from "lucide-react";
import NoProductAvailable from "./NoProductAvailable";
import ProductCard from "./ProductCard";

interface ExtendedCategory extends Category {
  parent?: {
    _id: string;
    title: string;
    slug: { current: string };
  } | null;
}

interface Props {
  categories: ExtendedCategory[];
  slug: string;
}

const CategoryProducts = ({ categories, slug }: Props) => {
  const [currentSlug, setCurrentSlug] = useState(slug);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedParents, setExpandedParents] = useState<Record<string, boolean>>({});
  const router = useRouter();

  // 1. Organize nested parent-child categories structure cleanly
  const mainCategories = categories?.filter((cat) => !cat.parent) || [];
  const subCategories = categories?.filter((cat) => cat.parent) || [];

  // Auto-expand the active parent row if a subcategory slug is selected initially
  useEffect(() => {
    if (currentSlug) {
      const activeSub = subCategories.find((sub) => sub.slug?.current === currentSlug);
      if (activeSub && activeSub.parent) {
        const parentId = (activeSub.parent as any)._ref || activeSub.parent._id;
        if (parentId) {
          setExpandedParents((prev) => ({ ...prev, [parentId]: true }));
        }
      }
    }
  }, [currentSlug]);

  const handleCategoryChange = (newSlug: string) => {
    if (newSlug === currentSlug) return;
    setCurrentSlug(newSlug);
    router.push(`/category/${newSlug}`, { scroll: false });
  };

  const toggleParentExpand = (e: React.MouseEvent, parentId: string) => {
    e.stopPropagation(); // Stops navigation trigger when only clicking the arrow toggle explicitly
    setExpandedParents((prev) => ({ ...prev, [parentId]: !prev[parentId] }));
  };

  const fetchProducts = async (categorySlug: string) => {
    setLoading(true);
    try {
      const query = `
        *[_type == 'product' && references(*[_type == "category" && slug.current == $categorySlug]._id)] | order(name asc){
          ...,
          "brand": brand->{title},
          "variant": variant->{title}
        }
      `;
      const data = await client.fetch(query, { categorySlug });
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(currentSlug);
  }, [currentSlug]);

  // Unified tree rendering item utility helper
  const renderCategoryButton = (item: ExtendedCategory, isSub = false) => {
    const itemSlug = item?.slug?.current as string;
    const isActive = itemSlug === currentSlug;

    return (
      <button
        onClick={() => handleCategoryChange(itemSlug)}
        key={item?._id}
        className={`flex items-center space-x-2 w-full text-left py-2 px-3 text-xs font-semibold rounded-xl transition-all border-0 bg-transparent cursor-pointer select-none truncate min-w-0 ${
          isActive
            ? "bg-shop_dark_green/10 text-shop_dark_green font-bold"
            : isSub
            ? "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
            : "text-slate-800 hover:bg-slate-50"
        }`}
        title={item?.title}
      >
        <Folder className={`w-3.5 h-3.5 flex-shrink-0 ${isActive ? "text-shop_dark_green" : "text-slate-400"}`} />
        <span className="truncate flex-1 min-w-0 capitalize">{item?.title}</span>
      </button>
    );
  };

  return (
    // 🚀 FIXED: Responsive grid layout (Sidebar takes 1 column on desktop, drops full-width on mobile)
    <div className="flex flex-col md:flex-row gap-6 items-start w-full max-w-full">
      
      {/* 📁 SIDEBAR ACCORDION VIEWPORT CONTAINER */}
      <div className="w-full md:w-64 bg-slate-50/50 p-3 rounded-2xl border border-slate-100 flex-shrink-0 max-w-full overflow-hidden">
        <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-2 mb-2">
          Select Department
        </p>
        
        {/* 🚀 FIXED HEIGHT SCROLL: Limits list heights to 400px with isolated scroll tracks */}
        <div className="max-h-[400px] overflow-y-auto space-y-0.5 pr-1 scrollbar-thin scrollbar-thumb-slate-200">
          {mainCategories.map((mainCat) => {
            const hasChildren = subCategories.some(
              (sub) => sub.parent?._id === mainCat._id || (sub.parent as any)?._ref === mainCat._id
            );
            const isExpanded = !!expandedParents[mainCat._id];
            const children = subCategories.filter(
              (sub) => sub.parent?._id === mainCat._id || (sub.parent as any)?._ref === mainCat._id
            );

            return (
              <div key={mainCat._id} className="space-y-0.5 block w-full max-w-full overflow-hidden">
                <div className="flex items-center justify-between w-full min-w-0 group pr-1">
                  <div className="flex-1 min-w-0">
                    {renderCategoryButton(mainCat, false)}
                  </div>
                  
                  {hasChildren && (
                    <button
                      type="button"
                      onClick={(e) => toggleParentExpand(e, mainCat._id)}
                      className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer flex-shrink-0"
                    >
                      {isExpanded ? (
                        <ChevronDown className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5" />
                      )}
                    </button>
                  )}
                </div>

                {/* Nested subcategory children links segment block */}
                {hasChildren && isExpanded && (
                  <div className="border-l-2 border-slate-200/60 ml-4 pl-1 space-y-0.5 block w-full max-w-full overflow-hidden">
                    {children.map((childCat) => (
                      <div key={childCat._id} className="w-full min-w-0 block truncate">
                        {renderCategoryButton(childCat, true)}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
          
          {mainCategories.length === 0 && categories?.map((cat) => renderCategoryButton(cat, false))}
        </div>
      </div>

      {/* 🛍️ PRODUCT CATALOG WORKSPACE GRID VIEWPORT */}
      <div className="flex-1 w-full max-w-full overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-10 min-h-[300px] space-y-3 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 w-full">
            <Loader2 className="w-8 h-8 text-shop_dark_green animate-spin" />
            <p className="text-sm font-bold tracking-tight text-slate-700">
              Updating current products stream view...
            </p>
          </div>
        ) : products?.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4 w-full">
            {products?.map((product: Product) => (
              <AnimatePresence key={product._id}>
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Updated with catalog view compatibility layout */}
                  <ProductCard product={product} isCatalogueMode={true} />
                </motion.div>
              </AnimatePresence>
            ))}
          </div>
        ) : (
          <NoProductAvailable
            selectedTab={currentSlug}
            className="mt-0 w-full bg-slate-50 border border-slate-100 rounded-3xl min-h-[260px]"
          />
        )}
      </div>
    </div>
  );
};

export default CategoryProducts;