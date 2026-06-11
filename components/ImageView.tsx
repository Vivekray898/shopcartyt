"use client";
import {
  internalGroqTypeReferenceTo,
  SanityImageCrop,
  SanityImageHotspot,
} from "@/sanity.types";
import { urlFor } from "@/sanity/lib/image";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import React, { useState } from "react";

interface Props {
  images?: Array<{
    asset?: {
      _ref: string;
      _type: "reference";
      _weak?: boolean;
      [internalGroqTypeReferenceTo]?: "sanity.imageAsset";
    };
    hotspot?: SanityImageHotspot;
    crop?: SanityImageCrop;
    _type: "image";
    _key: string;
  }>;
  isStock?: number | undefined;
}

const ImageView = ({ images = [], isStock }: Props) => {
  const [active, setActive] = useState(images[0]);

  return (
    <div className="w-full md:w-1/2 space-y-2 md:space-y-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={active?._key}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-h-[550px] min-h-[450px] border border-darkColor/10 rounded-md group overflow-hidden bg-white"
        >
          <Image
            src={urlFor(active).url()}
            alt="productImage"
            width={700}
            height={700}
            priority
            // FIXED: Removed the isStock === 0 ? "opacity-50" check so your showcase displays stay vibrant and clear!
            className="w-full h-96 max-h-[550px] min-h-[500px] object-contain group-hover:scale-105 hoverEffect rounded-md opacity-100"
          />
        </motion.div>
      </AnimatePresence>
      
      {/* Thumbnails list gallery section */}
      <div className="grid grid-cols-6 gap-2 h-20 md:h-24">
        {images?.map((image) => (
          <button
            key={image?._key}
            onClick={() => setActive(image)}
            className={`border rounded-md overflow-hidden transition-all duration-200 ${
              active?._key === image?._key 
                ? "border-shop_light_green ring-1 ring-shop_light_green opacity-100" 
                : "border-slate-200 opacity-60 hover:opacity-90"
            }`}
          >
            <Image
              src={urlFor(image).url()}
              alt={`Thumbnail ${image._key}`}
              width={100}
              height={100}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ImageView;