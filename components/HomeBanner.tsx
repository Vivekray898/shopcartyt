import React from "react";
import { Title } from "./ui/text";
import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";

interface BannerData {
  _id: string;
  isFullBleedGraphic?: boolean;
  headline?: string;
  bannerImage?: any;
  targetUrl: string;
  buttonText?: string;
  backgroundColor?: string;
}

interface Props {
  banner: BannerData | null | undefined;
}

const HomeBanner = ({ banner }: Props) => {
  // 1. Safe default fallback layout configuration bounds if no data is found
  if (!banner || !banner.bannerImage) return null;

  const targetLink = banner.targetUrl || "/shop";
  const hasCustomBg = banner.backgroundColor && banner.backgroundColor.startsWith("#");

  // 2. RENDERING OPTION A: Full-width edited graphics layout block
  if (banner.isFullBleedGraphic) {
    return (
      <Link href={targetLink} className="block group relative w-full overflow-hidden rounded-2xl transition-all duration-300 hover:shadow-md">
        <div className="relative w-full h-[240px] sm:h-[320px] md:h-[400px] lg:h-[450px]">
          <Image
            src={urlFor(banner.bannerImage).url()}
            alt={banner.headline || "Promotional Banner"}
            fill
            priority
            className="object-cover object-center transition-transform duration-700 group-hover:scale-[1.02]"
          />
        </div>
      </Link>
    );
  }

  // 3. RENDERING OPTION B: Split title + product cut-out text details layout
  return (
    <div 
      className="py-12 md:py-0 px-8 lg:px-20 flex flex-col md:flex-row items-center justify-between gap-6 rounded-2xl border border-slate-100/50 shadow-2xs"
      style={{ backgroundColor: hasCustomBg ? banner.backgroundColor : "var(--shop_light_pink, #FFF0F5)" }}
    >
      {/* Structural Copy Details Grid Side */}
      <div className="space-y-5 text-center md:text-left max-w-md">
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
      <div className="relative w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 aspect-square">
        <Image
          src={urlFor(banner.bannerImage).url()}
          alt="Banner Badge Product"
          fill
          priority
          sizes="(max-width: 768px) 100vw, 384px"
          className="object-contain p-4 transition-transform duration-500 hover:scale-105"
        />
      </div>
    </div>
  );
};

export default HomeBanner;