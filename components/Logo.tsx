"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";

const Logo = ({
  className,
  spanDesign,
}: {
  className?: string;
  spanDesign?: string;
}) => {
  return (
    <Link href={"/"} className="inline-flex">
      <h2
        className={cn(
          "text-xl sm:text-2xl text-shop_dark_green font-black tracking-wider uppercase hover:text-shop_light_green hoverEffect group font-sans select-none",
          className
        )}
      >
        Fundgrube
        <span
          className={cn(
            "text-shop_light_green group-hover:text-shop_dark_green hoverEffect pl-1",
            spanDesign
          )}
        >
          Bestpreis
        </span>
      </h2>
    </Link>
  );
};

export default Logo;