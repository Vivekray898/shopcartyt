"use client";

import React from "react";
import { FiShare2 } from "react-icons/fi";
import toast from "react-hot-toast";

interface ShareProps {
  productName: string;
}

const ProductShareButton = ({ productName }: ShareProps) => {
  const handleShare = async () => {
    const shareData = {
      title: productName,
      text: `Check out the ${productName} available now at Fundgrube!`,
      url: window.location.href,
    };

    // 1. If native device application routing exists (Mobile Apps, Safari, etc.)
    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        toast.success("Shared successfully!");
      } catch (error) {
        // Suppress errors if user simply dismissed the panel layout bounds manually
        console.log("Share sheet cancelled safely");
      }
    } else {
      // 2. Fallback strategy for basic desktop browsers: Copy string straight to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Product link copied to clipboard!");
      } catch (err) {
        toast.error("Could not copy link automatically");
      }
    }
  };

  return (
    <button
      onClick={handleShare}
      className="flex items-center gap-2 text-sm text-black hover:text-shop_light_green hoverEffect cursor-pointer bg-transparent border-0 outline-none p-0"
    >
      <FiShare2 className="text-lg" />
      <p className="font-medium">Share</p>
    </button>
  );
};

export default ProductShareButton;