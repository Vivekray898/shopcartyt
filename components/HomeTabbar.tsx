"use client";
import Link from "next/link";
import React, { useRef, useEffect, useState } from "react";

interface Props {
  selectedTab: string;
  onTabSelect: (tab: string) => void;
  tabs: string[];
}

const HomeTabbar = ({ selectedTab, onTabSelect, tabs }: Props) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkForOverflow = () => {
    const container = scrollContainerRef.current;
    if (!container) return;
    
    // Check if there is still track width left to slide into
    const hasMoreRight = container.scrollWidth > container.clientWidth + container.scrollLeft + 5;
    setCanScrollRight(hasMoreRight);
  };

  useEffect(() => {
    checkForOverflow();
    window.addEventListener("resize", checkForOverflow);
    return () => window.removeEventListener("resize", checkForOverflow);
  }, [tabs]);

  // Handle Drag-to-scroll & Mousewheel
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    let isDown = false;
    let startX: number;
    let scrollLeft: number;

    const handleWheelScroll = (e: WheelEvent) => {
      if (e.deltaY !== 0) {
        e.preventDefault();
        container.scrollLeft += e.deltaY;
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      isDown = true;
      container.classList.add("cursor-grabbing");
      startX = e.pageX - container.offsetLeft;
      scrollLeft = container.scrollLeft;
    };

    const handleMouseLeave = () => { isDown = false; container.classList.remove("cursor-grabbing"); };
    const handleMouseUp = () => { isDown = false; container.classList.remove("cursor-grabbing"); };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - container.offsetLeft;
      const walk = (x - startX) * 1.5;
      container.scrollLeft = scrollLeft - walk;
    };

    container.addEventListener("wheel", handleWheelScroll, { passive: false });
    container.addEventListener("mousedown", handleMouseDown);
    container.addEventListener("mouseleave", handleMouseLeave);
    container.addEventListener("mouseup", handleMouseUp);
    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("scroll", checkForOverflow);
    
    return () => {
      container.removeEventListener("wheel", handleWheelScroll);
      container.removeEventListener("mousedown", handleMouseDown);
      container.removeEventListener("mouseleave", handleMouseLeave);
      container.removeEventListener("mouseup", handleMouseUp);
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("scroll", checkForOverflow);
    };
  }, [tabs]);

  return (
    // Outer flex wrap structure keeps the button isolated safely on the right side
    <div className="w-full flex items-center justify-between gap-4 border-b border-slate-100/60 pb-1">
      
      {/* 🚀 FIXED CONTAINER LAYOUT: Houses the slider tracks and the gradient wrapper safely away from the CTA Link */}
      <div className="relative flex-1 overflow-hidden">
        
        <div 
          ref={scrollContainerRef}
          className="flex items-center overflow-x-auto flex-nowrap scrollbar-none py-2 select-none cursor-grab"
        >
          {/* 🚀 FIXED: Added pr-16 (padding-right) on the layout track. This ensures that when you scroll 
              to the very end, the last category text clears the gradient overlay bounds perfectly! */}
          <div className="flex items-center flex-nowrap gap-2 md:gap-3 pr-16">
            {tabs?.map((tabTitle) => (
              <button
                onClick={() => onTabSelect(tabTitle)}
                key={tabTitle}
                onMouseDown={(e) => e.stopPropagation()} 
                className={`flex-shrink-0 border border-shop_light_green/30 px-4 py-1.5 md:px-6 md:py-2 rounded-full hover:bg-shop_light_green hover:border-shop_light_green hover:text-white transition-all duration-200 capitalize text-xs md:text-sm cursor-pointer ${
                  selectedTab === tabTitle
                    ? "bg-shop_light_green text-white border-shop_light_green shadow-xs font-bold"
                    : "bg-shop_light_green/5 text-slate-700"
                }`}
              >
                {tabTitle}
              </button>
            ))}
          </div>
        </div>

        {/* 🎨 VISUAL OVERFLOW GRADIENT: 
            Clamped tightly to the end of the sliding track parent viewport box, meaning it can never touch the view all button */}
        <div 
          className={`absolute right-0 top-0 bottom-0 w-14 bg-gradient-to-l from-white via-white/80 to-transparent pointer-events-none transition-opacity duration-300 z-10 ${
            canScrollRight ? "opacity-100" : "opacity-0"
          }`}
        />
      </div>
      
      {/* 🎯 "SEE ALL" BUTTON: Completely isolated from the sliding view boundaries */}
      <Link
        href={"/shop"}
        className="border border-darkColor/60 text-xs md:text-sm px-5 py-1.5 rounded-full font-bold hover:bg-shop_light_green hover:text-white hover:border-shop_light_green whitespace-nowrap flex-shrink-0 transition-all bg-white relative z-20"
      >
        See all
      </Link>
    </div>
  );
};

export default HomeTabbar;