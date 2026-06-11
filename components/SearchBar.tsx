"use client";

import React, { useState, useRef, useEffect } from "react";
import { Search, X, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { client } from "@/sanity/lib/client";
import Link from "next/link";

// Define a type for our instant preview items
interface ProductSuggestion {
  _id: string;
  name: string;
  slug: { current: string };
  categoryName?: string;
}

const SearchBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<ProductSuggestion[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // 🔍 REAL-TIME SUGGESTION ENGINE (Debounced lookup via Sanity Client)
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setIsSearching(true);
      try {
        // Fetches up to 5 matching products based on text prefix matches
        const query = `*[_type == "product" && name match $searchQuery + "*"][0...5]{
          _id,
          name,
          slug,
          "categoryName": category->title
        }`;
        const results = await client.fetch(query, { searchQuery: searchQuery.trim() });
        setSuggestions(results);
      } catch (error) {
        console.error("Failed to fetch search suggestions:", error);
      } finally {
        setIsSearching(false);
      }
    }, 300); // 300ms debounce prevents overloading Sanity with requests on every keystroke

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  // Handle Search Form Submission (Pressing Enter)
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
    closeSearch();
  };

  const closeSearch = () => {
    setSearchQuery("");
    setSuggestions([]);
    setIsOpen(false);
  };

  // Focus input automatically when search bar slides open
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Click Outside Listener: Closes everything if user clicks elsewhere
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setSuggestions([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative flex items-center h-10">
      
      {/* 🔍 TRIGGER ICON */}
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 text-slate-700 hover:text-shop_light_green hoverEffect bg-transparent border-none outline-none cursor-pointer"
          aria-label="Open search"
        >
          <Search className="w-5 h-5 transition-transform active:scale-90" />
        </button>
      ) : (
        <div className="relative">
          {/* EXPANDABLE SEARCH FORM BOX */}
          <form 
            onSubmit={handleSearchSubmit}
            className="flex items-center bg-slate-50 border border-slate-200/80 rounded-full pl-3.5 pr-1.5 py-1 w-[240px] sm:w-[280px] md:w-[320px] transition-all duration-300 shadow-2xs"
          >
            <Search className="w-4 h-4 text-slate-400 flex-shrink-0 mr-2" />
            
            <input
              ref={inputRef}
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-0 outline-none text-xs font-semibold text-slate-800 placeholder-slate-400 p-0 focus:ring-0"
            />

            {/* Loading spinner or clear button depending on client state */}
            {isSearching ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-400 mx-1.5" />
            ) : (
              <button
                type="button"
                onClick={closeSearch}
                className="p-1.5 text-slate-400 hover:text-rose-500 rounded-full transition-colors cursor-pointer ml-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </form>

          {/* ⚡ INSTANT DROPDOWN SUGGESTIONS PANEL */}
          {suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-100 rounded-2xl shadow-lg overflow-hidden z-50 animate-fadeIn">
              <ul className="divide-y divide-slate-50">
                {suggestions.map((item) => (
                  <li key={item._id}>
                    <Link
                      href={`/product/${item.slug?.current}`}
                      onClick={closeSearch}
                      className="flex flex-col px-4 py-2.5 hover:bg-slate-50 transition-colors group text-left"
                    >
                      <span className="text-xs font-bold text-slate-800 group-hover:text-shop_light_green transition-colors line-clamp-1">
                        {item.name}
                      </span>
                      {item.categoryName && (
                        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mt-0.5">
                          in {item.categoryName}
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Empty fallback hint if user typed matching query strings but nothing returned */}
          {searchQuery.trim() && suggestions.length === 0 && !isSearching && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-100 rounded-2xl p-4 shadow-lg text-center text-xs text-slate-400 italic z-50">
              No direct matches found. Press Enter to view full catalogue.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;