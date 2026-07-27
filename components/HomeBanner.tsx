"use client";
import React, { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { Title } from "./ui/text";
import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";

interface BannerData {
  _id: string;
  isFullBleedGraphic?: boolean;
  headline?: string;
  desktopImage?: any;
  mobileImage?: any;
  targetUrl: string;
  buttonText?: string;
  backgroundColor?: string;
  priority?: number;
}

interface Props {
  banners: BannerData[] | null | undefined;
}

const HomeBanner = ({ banners }: Props) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Initialize Embla with infinite loop and 4-second autoplay
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 4000, stopOnInteraction: false }),
  ]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
  }, [emblaApi, onSelect]);

  const scrollTo = useCallback(
    (index: number) => emblaApi && emblaApi.scrollTo(index),
    [emblaApi]
  );

  if (!banners || banners.length === 0) return null;

  return (
    <div className="relative w-full group">
      {/* 🎠 Carousel Viewport */}
      <div className="overflow-hidden rounded-2xl" ref={emblaRef}>
        <div className="flex">
          {banners.map((banner) => (
            <div key={banner._id} className="flex-[0_0_100%] min-w-0">
              <BannerCard banner={banner} />
            </div>
          ))}
        </div>
      </div>

      {/* 🟢 Navigation Dots (Only rendered if there are multiple banners) */}
      {banners.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-slate-950/30 backdrop-blur-md px-3 py-1.5 rounded-full">
          {banners.map((_, idx) => (
            <button
              key={idx}
              onClick={() => scrollTo(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                selectedIndex === idx
                  ? "w-7 bg-white"
                  : "w-2.5 bg-white/50 hover:bg-white/80"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// 🎨 Card Component for Rendering Each Slide
const BannerCard = ({ banner }: { banner: BannerData }) => {
  if (!banner?.desktopImage) return null;

  const targetLink = banner.targetUrl || "/shop";
  const hasCustomBg = banner.backgroundColor && banner.backgroundColor.startsWith("#");
  const mobileAssetSrc = banner.mobileImage ? urlFor(banner.mobileImage).url() : urlFor(banner.desktopImage).url();
  const desktopAssetSrc = urlFor(banner.desktopImage).url();

  if (banner.isFullBleedGraphic) {
    return (
      <Link
        href={targetLink}
        className="block group/item relative w-full overflow-hidden rounded-2xl cursor-pointer transition-all duration-300"
      >
        {/* Mobile Screen Layout Frame */}
        <div className="relative block md:hidden w-full aspect-[750/1000]">
          <Image
            src={mobileAssetSrc}
            alt={banner.headline || "Promotional Banner"}
            fill
            priority
            className="object-cover object-center transition-transform duration-700 group-hover/item:scale-[1.02]"
          />
        </div>

        {/* Desktop Screen Layout Frame */}
        <div className="relative hidden md:block w-full aspect-[1920/540]">
          <Image
            src={desktopAssetSrc}
            alt={banner.headline || "Promotional Banner"}
            fill
            priority
            sizes="(max-width: 1280px) 100vw, 1280px"
            className="object-cover object-center transition-transform duration-700 group-hover/item:scale-[1.02]"
          />
        </div>

        {/* Floating CTA Pill */}
        <div className="absolute bottom-3 right-3 sm:bottom-6 sm:right-6 z-10 flex items-center gap-2 bg-white/90 backdrop-blur-md text-slate-950 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-bold shadow-md transition-all duration-300 group-hover/item:bg-slate-950 group-hover/item:text-white group-hover/item:scale-105">
          <span>{banner.buttonText || "Shop Now"}</span>
          <svg
            className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-300 group-hover/item:translate-x-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </div>
      </Link>
    );
  }

  return (
    <div
      className="py-12 md:py-0 px-8 lg:px-20 flex flex-col md:flex-row items-center justify-between gap-6 rounded-2xl border border-slate-100/50 shadow-2xs"
      style={{ backgroundColor: hasCustomBg ? banner.backgroundColor : "var(--shop_light_pink, #FFF0F5)" }}
    >
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

      <div className="relative w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 aspect-square order-1 md:order-2">
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