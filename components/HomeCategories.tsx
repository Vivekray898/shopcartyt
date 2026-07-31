"use client";

import React from "react";
import Title from "./Title";
import { Category } from "@/sanity.types";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface ExtendedCategory extends Category {
  productCount?: number;
}

const HomeCategories = ({ categories }: { categories: ExtendedCategory[] }) => {
  // 🚀 SORTIERLOGIK: Kategorien mit aktiven Artikeln werden priorisiert
  const sortedCategories = [...(categories || [])].sort((a, b) => {
    const countA = (a as any)?.productCount ?? 0;
    const countB = (b as any)?.productCount ?? 0;
    return countB - countA;
  });

  return (
    // Bereinigte mobile Padding-Klassen (p-4 auf mobil, p-6+ auf Desktop)
    <div className="bg-white my-6 md:my-16 p-4 md:p-6 lg:p-8 rounded-3xl border border-slate-100 shadow-xs">
      
      {/* Header-Container-Layout-Matrix */}
      <div className="flex items-center justify-between border-b pb-4 mb-5">
        <Title className="text-base md:text-xl font-black text-slate-900 tracking-tight">
          Beliebte Kategorien durchstöbern
        </Title>
        <span className="text-[10px] md:text-xs font-bold text-shop_dark_green bg-emerald-50 px-2.5 py-1 md:px-3 md:py-1.5 rounded-full uppercase tracking-wider whitespace-nowrap">
          Live-Bestand
        </span>
      </div>

      {/* 🎨 MOBIL-OPTIMIERTER CONTAINER-VIEWPORT-LAYER 
          Mobil: Einzelner horizontaler Slider-Stream mit versteckten nativen Scrollbalken
          Desktop (sm+): Nahtlose Layout-Konvertierung zurück zu deinen responsiven Kartenrastern */}
      <div className="flex overflow-x-auto pb-3 gap-4 snap-x snap-mandatory scrollbar-none sm:grid sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 sm:gap-6 sm:pb-0">
        {sortedCategories?.map((category) => {
          const count = (category as any)?.productCount ?? 0;
          const hasItems = count > 0;

          return (
            <Link
              key={category?._id}
              href={`/category/${category?.slug?.current}`}
              // 🚀 MOBILE STRUKTURÄNDERUNG: Mindestbreite und Snap-Ausrichtungs-Tracking auf mobil hinzugefügt
              className="group flex flex-col items-center text-center p-3 sm:p-4 bg-slate-50/50 rounded-2xl border border-slate-100/60 hover:bg-white hover:shadow-md hover:border-transparent transition-all duration-300 ease-out cursor-pointer min-w-[110px] max-w-[120px] sm:min-w-0 sm:max-w-none snap-start flex-shrink-0"
            >
              {/* 🖼️ Runder Bild-Canvas mit Scale-Hover-Effekten */}
              <div className="relative w-16 h-16 md:w-24 md:h-24 rounded-full bg-white border border-slate-100 flex items-center justify-center p-2.5 shadow-2xs group-hover:border-shop_dark_green/30 transition-colors duration-300 overflow-hidden">
                {category?.image ? (
                  <Image
                    src={urlFor(category.image).url()}
                    alt={category?.title || "KategorieBild"}
                    fill
                    sizes="(max-width: 768px) 64px, 96px"
                    className="object-contain p-2 group-hover:scale-110 transition-transform duration-500 ease-out"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-slate-100 flex items-center justify-center text-slate-400 text-[10px]">
                    Kein Bild
                  </div>
                )}
              </div>

              {/* 📝 Metadaten-Informationszeilen */}
              <div className="mt-2.5 space-y-0.5 w-full">
                {/* 🚀 MOBIL-FIX: Leicht entspanntes Abschneideverhalten für horizontale Kartenlayouts */}
                <h3 className="text-[11px] md:text-sm font-bold text-slate-700 line-clamp-1 group-hover:text-shop_dark_green transition-colors px-0.5">
                  {category?.title}
                </h3>
                
                <p className={`text-[9px] md:text-xs font-semibold uppercase tracking-wide inline-flex items-center gap-0.5 ${
                  hasItems ? "text-slate-400" : "text-slate-300"
                }`}>
                  <span className={hasItems ? "font-black text-shop_dark_green" : "font-semibold"}>
                    {count}
                  </span>{" "}
                  {count === 1 ? "Artikel" : "Artikel"}
                  <ChevronRight className="w-2.5 h-2.5 hidden sm:block opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-shop_dark_green ml-0.5" />
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default HomeCategories;