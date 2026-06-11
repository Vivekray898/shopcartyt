"use client";
import React, { FC } from "react";
import Logo from "./Logo";
import { X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import SocialMedia from "./SocialMedia";
import { useOutsideClick } from "@/hooks";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { urlFor } from "@/sanity/lib/image";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const SideMenu: FC<SidebarProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname();
  const sidebarRef = useOutsideClick<HTMLDivElement>(onClose);
  
  // Pull both header settings and footer settings values seamlessly from your hook pool
  const { headerSettings, footerSettings } = useSiteSettings();
  const navLinks = headerSettings?.navigationLinks ?? [];
  const headerLogo = headerSettings?.logo;
  const targetSocialLinks = footerSettings?.socialLinks ?? [];

  return (
    <div
      className={`fixed inset-y-0 h-screen left-0 z-50 w-full bg-black/50 text-white/70 shadow-xl ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } hoverEffect`}
    >
      <div
        ref={sidebarRef}
        className="min-w-72 max-w-96 bg-black h-screen p-10 border-r border-r-shop_light_green flex flex-col gap-6"
      >
        <div className="flex items-center justify-between gap-5">
          {/* FIXED: Dynamic conditional image evaluation matching your main desktop header banner */}
          {headerLogo ? (
            <Link href="/" onClick={onClose} className="inline-flex items-center">
              <Image
                src={urlFor(headerLogo).width(160).height(40).url()}
                alt="Site logo"
                width={160}
                height={40}
                className="object-contain invert brightness-0" // Keeps logo cleanly visible on dark side background grids
              />
            </Link>
          ) : (
            <Logo className="text-white" spanDesign="group-hover:text-white" />
          )}
          <button
            onClick={onClose}
            className="hover:text-shop_light_green hoverEffect"
          >
            <X />
          </button>
        </div>

        <div className="flex flex-col space-y-3.5 font-semibold tracking-wide">
          {navLinks?.map((item) => (
            <Link
              href={item?.href ?? "/"}
              key={item?.title}
              onClick={onClose}
              className={`hover:text-shop_light_green hoverEffect ${
                pathname === item?.href && "text-white"
              }`}
            >
              {item?.title}
            </Link>
          ))}
        </div>

        {/* FIXED: Feeds your live active Sanity payload directly to the social component */}
        <div className="mt-auto pt-5 border-t border-white/10">
          <SocialMedia links={targetSocialLinks} />
        </div>
      </div>
    </div>
  );
};

export default SideMenu;