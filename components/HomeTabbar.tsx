"use client";
import Link from "next/link";

interface Props {
  selectedTab: string;
  onTabSelect: (tab: string) => void;
  tabs: string[]; // FIXED: Accepts the dynamic string array from Sanity
}

const HomeTabbar = ({ selectedTab, onTabSelect, tabs }: Props) => {
  return (
    <div className="flex items-center flex-wrap gap-4 justify-between">
      <div className="flex items-center text-sm font-semibold">
        <div className="flex items-center flex-wrap gap-2 md:gap-3">
          {/* FIXED: Mapping over your dynamic Sanity custom product types */}
          {tabs?.map((tabTitle) => (
            <button
              onClick={() => onTabSelect(tabTitle)}
              key={tabTitle}
              className={`border border-shop_light_green/30 px-4 py-1.5 md:px-6 md:py-2 rounded-full hover:bg-shop_light_green hover:border-shop_light_green hover:text-white hoverEffect capitalize text-xs md:text-sm ${
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
      
      <Link
        href={"/shop"}
        className="border border-darkColor/60 text-xs md:text-sm px-4 py-1.5 rounded-full font-semibold hover:bg-shop_light_green hover:text-white hover:border-shop_light_green hoverEffect whitespace-nowrap ml-auto sm:ml-0"
      >
        See all
      </Link>
    </div>
  );
};

export default HomeTabbar;