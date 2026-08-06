"use client";
import { BRANDS_QUERY_RESULT, Category, Product } from "@/sanity.types"; 
import React, { useEffect, useState, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Container from "./Container";
import Title from "./Title";
import CategoryList from "./shop/CategoryList";
import BrandList from "./shop/BrandList";
import { client } from "@/sanity/lib/client";
import { Loader2, SlidersHorizontal, X } from "lucide-react";
import NoProductAvailable from "./NoProductAvailable";
import ProductCard from "./ProductCard";
import { useDebounce } from "@/hooks/useDebounce";

interface Props {
  categories: Category[];
  brands: BRANDS_QUERY_RESULT; 
  initialSearch?: string;
  initialBrand?: string;
  initialCategory?: string;
}

const Shop = ({ 
  categories, 
  brands, 
  initialSearch = "", 
  initialBrand = "", 
  initialCategory = "" 
}: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const isFirstRender = useRef(true);

  // State from URL params - ensure arrays
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(() => {
    if (initialCategory) {
      return initialCategory.split(',').filter(Boolean);
    }
    return [];
  });
  const [selectedBrands, setSelectedBrands] = useState<string[]>(() => {
    if (initialBrand) {
      return initialBrand.split(',').filter(Boolean);
    }
    return [];
  });

  // Debounced search query to prevent too many API calls
  const debouncedSearch = useDebounce(searchQuery, 300);

  // Sync state with URL when URL changes (browser back/forward)
  useEffect(() => {
    const search = searchParams.get('search') || "";
    const brandParam = searchParams.get('brand') || "";
    const categoryParam = searchParams.get('category') || "";
    
    setSearchQuery(search);
    setSelectedBrands(brandParam ? brandParam.split(',').filter(Boolean) : []);
    setSelectedCategories(categoryParam ? categoryParam.split(',').filter(Boolean) : []);
  }, [searchParams]);

  // Update URL when filters change
  const updateURL = useCallback((
    updates: { 
      search?: string; 
      brands?: string[]; 
      categories?: string[];
    }
  ) => {
    const params = new URLSearchParams();
    
    // Get current values with proper fallbacks
    const finalSearch = updates.search !== undefined ? updates.search : searchQuery;
    const finalBrands = updates.brands !== undefined ? updates.brands : selectedBrands;
    const finalCategories = updates.categories !== undefined ? updates.categories : selectedCategories;
    
    // Ensure we're working with arrays
    const brandsArray = Array.isArray(finalBrands) ? finalBrands : [];
    const categoriesArray = Array.isArray(finalCategories) ? finalCategories : [];
    
    if (finalSearch) params.set('search', finalSearch);
    if (brandsArray.length > 0) params.set('brand', brandsArray.join(','));
    if (categoriesArray.length > 0) params.set('category', categoriesArray.join(','));
    
    const queryString = params.toString();
    const url = queryString ? `/shop?${queryString}` : '/shop';
    
    // Use push for immediate URL update
    router.push(url, { scroll: false });
  }, [searchQuery, selectedBrands, selectedCategories, router]);

  // Handle search with debounced URL update
  const handleSearch = useCallback((value: string) => {
    setSearchQuery(value);
    // Update URL immediately with the new value
    updateURL({ search: value });
  }, [updateURL]);

  // Handle category selection with immediate URL update
  const handleCategorySelect = useCallback((categories: string[]) => {
    const safeCategories = Array.isArray(categories) ? categories : [];
    setSelectedCategories(safeCategories);
    updateURL({ categories: safeCategories });
  }, [updateURL]);

  // Handle brand selection with immediate URL update
  const handleBrandSelect = useCallback((brands: string[]) => {
    const safeBrands = Array.isArray(brands) ? brands : [];
    setSelectedBrands(safeBrands);
    updateURL({ brands: safeBrands });
  }, [updateURL]);

  // Handle reset all filters
  const handleResetFilters = useCallback(() => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setSearchQuery("");
    router.push('/shop', { scroll: false });
  }, [router]);

  // Close mobile filter drawer when selection changes
  useEffect(() => {
    setIsMobileFilterOpen(false);
  }, [selectedCategories, selectedBrands, searchQuery]);

  // Prevent body scroll when mobile filter is open
  useEffect(() => {
    if (isMobileFilterOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileFilterOpen]);

  // Fetch products - triggered by state changes
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      // Build category filter
      let categoryFilter = '';
      if (selectedCategories.length > 0) {
        const categoryConditions = selectedCategories.map(
          (cat) => `references(*[_type == "category" && slug.current == "${cat}"]._id)`
        );
        categoryFilter = `(${categoryConditions.join(' || ')})`;
      }

      // Build brand filter
      let brandFilter = '';
      if (selectedBrands.length > 0) {
        const brandConditions = selectedBrands.map(
          (brand) => `references(*[_type == "brand" && slug.current == "${brand}"]._id)`
        );
        brandFilter = `(${brandConditions.join(' || ')})`;
      }

      // Build search filter (using debounced value for search)
      const searchFilter = debouncedSearch ? `name match "${debouncedSearch}*"` : '';

      // Combine filters
      const filters = [categoryFilter, brandFilter, searchFilter]
        .filter(Boolean)
        .join(' && ');

      const query = `
        *[_type == 'product' ${filters ? `&& ${filters}` : ''}] 
        | order(name asc) {
          ...,
          "brand": brand->{title},
          "variant": variant->{title}
        }
      `;

      const data = await client.fetch(
        query,
        {},
        { next: { revalidate: 0 } }
      );
      setProducts(data);
    } catch (error) {
      console.log("Shop product fetching Error", error);
    } finally {
      setLoading(false);
    }
  }, [selectedCategories, selectedBrands, debouncedSearch]);

  // Fetch products whenever dependencies change
  useEffect(() => {
    // Skip first render to avoid double fetch
    if (isFirstRender.current) {
      isFirstRender.current = false;
      fetchProducts();
      return;
    }
    fetchProducts();
  }, [fetchProducts]);

  // Count active filters
  const activeFilterCount = selectedCategories.length + selectedBrands.length + (searchQuery ? 1 : 0);

  return (
    <div className="border-t min-h-screen bg-slate-50/30">
      <Container className="mt-5">
        
        {/* Header Section */}
        <div className="mb-6 bg-white p-4 rounded-2xl border border-slate-100 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-0.5">
              <Title className="text-sm font-bold uppercase tracking-wider text-slate-400">
                Showroom-Bestand
              </Title>
              <h1 className="text-xl font-black text-slate-900 tracking-tight sm:text-2xl">
                {searchQuery ? `Search Results for "${searchQuery}"` : "Finden Sie Produkte, die Ihren Bedürfnissen entsprechen."}
              </h1>
            </div>

            <div className="flex items-center gap-3">
              {activeFilterCount > 0 && (
                <button
                  onClick={handleResetFilters}
                  className="text-xs font-semibold uppercase tracking-wider text-rose-600 hover:text-rose-700 bg-rose-50 px-3 py-2 rounded-xl transition-all cursor-pointer"
                >
                  Reset Filters ({activeFilterCount})
                </button>
              )}

              <button
                onClick={() => setIsMobileFilterOpen(true)}
                className="flex md:hidden items-center gap-2 bg-slate-950 text-white text-sm font-bold px-4 py-2.5 rounded-xl transition hover:bg-slate-800 shadow-sm cursor-pointer"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
              </button>
            </div>
          </div>
        </div>

        {/* Main Workspace Layout */}
        <div className="flex flex-col md:flex-row gap-6 items-start">
          
          {/* Mobile Drawer Overlay */}
          <div
            className={`fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs transition-opacity duration-300 md:hidden ${
              isMobileFilterOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
            }`}
            onClick={() => setIsMobileFilterOpen(false)}
          />

          {/* Sidebar */}
          <aside
            className={`fixed top-0 bottom-0 left-0 z-50 flex w-72 max-w-[80vw] flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out md:static md:z-0 md:w-64 md:max-w-none md:translate-x-0 md:bg-transparent md:shadow-none md:border-r border-slate-200/60 md:pr-4 ${
              isMobileFilterOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            {/* Header - always visible, never scrolls */}
            <div className="flex items-center justify-between p-6 pb-4 border-b border-slate-100 md:hidden flex-shrink-0">
              <span className="font-bold text-slate-900 text-base">Filter Options</span>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="p-1.5 rounded-lg bg-slate-50 text-slate-500 hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable content area */}
            <div className="flex-1 overflow-y-auto p-6 pt-0 md:p-0 md:pt-0 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
              <div className="space-y-6 md:sticky md:top-6">
                <CategoryList
                  categories={categories}
                  selectedCategories={selectedCategories}
                  setSelectedCategories={handleCategorySelect}
                />
                <BrandList
                  brands={brands}
                  setSelectedBrands={handleBrandSelect}
                  selectedBrands={selectedBrands}
                />
              </div>
            </div>
          </aside>

          {/* Product Catalog Grid View Workspace */}
          <div className="flex-1 w-full">
            {loading ? (
              <div className="p-20 flex flex-col gap-3 items-center justify-center bg-white rounded-3xl border border-slate-100 shadow-xs min-h-[400px]">
                <Loader2 className="w-9 h-9 text-slate-900 animate-spin" />
                <p className="font-bold tracking-tight text-slate-800 text-base">
                  Fetching current catalog availability...
                </p>
              </div>
            ) : products?.length > 0 ? (
              <>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm text-slate-500">
                    {products.length} product{products.length !== 1 ? 's' : ''} found
                  </p>
                  {activeFilterCount > 0 && (
                    <p className="text-xs text-slate-400">
                      Filtered by {activeFilterCount} selection{activeFilterCount !== 1 ? 's' : ''}
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
                  {products?.map((product) => (
                    <ProductCard key={product?._id} product={product as any} isCatalogueMode={true} />
                  ))}
                </div>
              </>
            ) : (
              <NoProductAvailable className="bg-white mt-0 rounded-3xl border border-slate-100 shadow-xs" />
            )}
          </div>

        </div>
      </Container>
    </div>
  );
};

export default Shop;