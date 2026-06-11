"use client";
import Link from "next/link";

interface Props {
  selectedTab: string;
  onTabSelect: (tab: string) => void;
  tabs: string[]; // FIXED: Accepts the dynamic string array from Sanity
}

const HomeTabbar = ({ selectedTab, onTabSelect, tabs }: Props) => {
  return (
    // FIXED: Changed flex-wrap to flex-nowrap and isolated the layout structure 
    // to ensure the "See all" button stays locked perfectly to the right side.
    <div className="w-full flex items-center justify-between gap-4 border-b border-slate-100/40 pb-1">
      
      {/* 📱 HORIZONTAL SCROLL BAR BOX: Swipes beautifully on mobile without system scrollbar lines */}
      <div className="flex items-center overflow-x-auto flex-nowrap scrollbar-none snap-x snap-mandatory py-2 max-w-[calc(100%-90px)] sm:max-w-none">
        <div className="flex items-center flex-nowrap gap-2 md:gap-3">
          {/* FIXED: Mapping over your dynamic Sanity custom product types */}
          {tabs?.map((tabTitle) => (
            <button
              onClick={() => onTabSelect(tabTitle)}
              key={tabTitle}
              className={`snap-start flex-shrink-0 border border-shop_light_green/30 px-4 py-1.5 md:px-6 md:py-2 rounded-full hover:bg-shop_light_green hover:border-shop_light_green hover:text-white hoverEffect capitalize text-xs md:text-sm cursor-pointer ${
                selectedTab === tabTitle
                  ? "bg-shop_light_green text-white border-shop_light_green shadow-xs"
                  : "bg-shop_light_green/5 text-slate-700"
              }`}
            >
              {tabTitle}
            </button>
          ))}
        </div>
      </div>
      
      {/* 🎯 "SEE ALL" BUTTON: Firmly locked to the right side regardless of tab count */}
      <Link
        href={"/shop"}
        className="border border-darkColor/60 text-xs md:text-sm px-4 py-1.5 rounded-full font-semibold hover:bg-shop_light_green hover:text-white hover:border-shop_light_green hoverEffect whitespace-nowrap flex-shrink-0 transition-colors"
      >
        See all
      </Link>
    </div>
  );
};

export default HomeTabbar;