// components/CTASection.tsx
import React from "react";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";

interface CTASectionProps {
  title: string;
  subtitle?: string;
  ctaText: string;
  ctaLink?: string;
  backgroundImage?: any;
}

export default function CTASection({
  title,
  subtitle,
  ctaText,
  ctaLink = "#",
  backgroundImage,
}: CTASectionProps) {
  return (
    <div className="relative py-20 bg-primary bg-cover">
      {backgroundImage && (
        <div className="absolute inset-0">
          <Image
            src={urlFor(backgroundImage).url()}
            alt="CTA Background"
            fill
            className="object-cover opacity-10"
          />
        </div>
      )}
      <div className="container relative z-1">
        <div className="md:flex items-center justify-between">
          <div className="pr-5 max-lg:w-1/2 max-md:!w-full">
            <h2 className="text-primary font-display lg:text-80 text-5xl leading-[0.75] lg:text-shadow-[2px_3px_0px_rgba(255,255,255,0.72)] pb-5">
              <span className="text-white inline-block">{title}</span>
            </h2>
            {subtitle && (
              <div className="text-white text-xl font-medium font-title max-md:mb-5">
                {subtitle}
              </div>
            )}
          </div>
          <div className="p-1.5 bg-paleaqua rounded-full max-w-107 flex-1 h-20">
            <form className="dzSubscribe" action={ctaLink} method="get">
              <div className="flex relative">
                <input
                  type="email"
                  className="form-control !h-17 !border-0 outline-none !py-2.5 !pl-5 !pr-17.5 rounded-full !text-2xs !leading-5 bg-white focus:text-[#212529] focus:bg-transparent placeholder:text-primary"
                  placeholder="Email address..."
                  required
                />
                <button
                  type="submit"
                  className="text-28 text-white rounded-full size-15 bg-primary absolute top-1.25 right-1.25 duration-500 cursor-pointer"
                >
                  <i className="fa-solid fa-magnifying-glass"></i>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}