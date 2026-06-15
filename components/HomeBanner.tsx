"use client";
import React from "react";
import { Title } from "./ui/text";
import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";

interface BannerData {
  _id: string;
  isFullBleedGraphic?: boolean;
  headline?: string;
  desktopImage?: any; // UPDATED
  mobileImage?: any;  // ADDED
  targetUrl: string;
  buttonText?: string;
  backgroundColor?: string;
  priority?: number;  // ADDED
}

interface Props {
  banner: BannerData | null | undefined;
}

const HomeBanner = ({ banner }: Props) => {
  // Safe default fallback if no valid asset mapping properties exist
  if (!banner || !banner.desktopImage) return null;

  const targetLink = banner.targetUrl || "/shop";
  const hasCustomBg = banner.backgroundColor && banner.backgroundColor.startsWith("#");
  
  // Use mobileImage if available, otherwise gracefully fall back to the desktop asset canvas
  const mobileAssetSrc = banner.mobileImage ? urlFor(banner.mobileImage).url() : urlFor(banner.desktopImage).url();
  const desktopAssetSrc = urlFor(banner.desktopImage).url();

  // 📐 RENDERING OPTION A: Full-width edited graphic blocks
  if (banner.isFullBleedGraphic) {
    return (
      <Link href={targetLink} className="block group relative w-full overflow-hidden rounded-2xl transition-all duration-300 hover:shadow-md">
        {/* Mobile Layout Frame Structure: Displays a portrait/square box on phone screens */}
        <div className="relative block md:hidden w-full h-[360px] sm:h-[420px]">
          <Image
            src={mobileAssetSrc}
            alt={banner.headline || "Promotional Banner"}
            fill
            priority
            className="object-cover object-center transition-transform duration-700 group-hover:scale-[1.02]"
          />
        </div>

        {/* Desktop Layout Frame Structure: Displays wide aspect on laptops/monitors */}
        <div className="relative hidden md:block w-full h-[400px] lg:h-[450px]">
          <Image
            src={desktopAssetSrc}
            alt={banner.headline || "Promotional Banner"}
            fill
            priority
            className="object-cover object-center transition-transform duration-700 group-hover:scale-[1.02]"
          />
        </div>
      </Link>
    );
  }

  // 📐 RENDERING OPTION B: Split title text + product cut-out badge layout
  return (
    <div 
      className="py-12 md:py-0 px-8 lg:px-20 flex flex-col md:flex-row items-center justify-between gap-6 rounded-2xl border border-slate-100/50 shadow-2xs"
      style={{ backgroundColor: hasCustomBg ? banner.backgroundColor : "var(--shop_light_pink, #FFF0F5)" }}
    >
      {/* Structural Copy Details Grid Side */}
      <div className="space-y-5 text-center md:text-left max-w-md order-2 md:order-1">
        {banner.headline && (
          <Title className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 leading-tight">
            {banner.headline}
          </Title>
        )}
        <Link
          href={targetLink}
          className="inline-block bg-slate-950 text-white px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-xs transition hover:bg-slate-800"
        >
          {banner.buttonText || "Buy Now"}
        </Link>
      </div>

      {/* Graphical Product Badge Canvas Frame Element */}
      <div className="relative w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 aspect-square order-1 md:order-2">
        {/* Mobile View Item Image Asset */}
        <div className="block md:hidden relative w-full h-full">
          <Image
            src={mobileAssetSrc}
            alt="Banner Badge Product Mobile"
            fill
            priority
            sizes="256px"
            className="object-contain p-2 transition-transform duration-500 hover:scale-105"
          />
        </div>

        {/* Desktop View Item Image Asset */}
        <div className="hidden md:block relative w-full h-full">
          <Image
            src={desktopAssetSrc}
            alt="Banner Badge Product Desktop"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 384px"
            className="object-contain p-4 transition-transform duration-500 hover:scale-105"
          />
        </div>
      </div>
    </div>
  );
};

export default HomeBanner;