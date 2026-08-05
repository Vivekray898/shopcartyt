// components/Footer.tsx
"use client";
import React from "react";
import Image from "next/image";
import Container from "./Container";
import FooterTop from "./FooterTop";
import Logo from "./Logo";
import SocialMedia from "./SocialMedia";
import { SubText, SubTitle } from "./ui/text";
import Link from "next/link";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { urlFor } from "@/sanity/lib/image";
import FloatingWhatsApp from "./FloatingWhatsApp";

const Footer = () => {
  const { footerSettings } = useSiteSettings();
  
  const isCurrentlyLoading = !footerSettings;
  
  // Get section data with defaults
  const quickLinksSection = footerSettings?.quickLinksSection ?? { title: "Quick Links", links: [] };
  const categoriesSection = footerSettings?.categoriesSection ?? { title: "Categories", links: [] };
  const storeLocations = footerSettings?.storeLocations ?? [];
  const legalLinks = footerSettings?.legalLinks ?? [];
  
  const newsletterText = footerSettings?.newsletterText || "Subscribe to our newsletter for exclusive updates.";
  const socialLinks = footerSettings?.socialLinks;
  const contactItems = footerSettings?.contactItems;
  const footerLogo = footerSettings?.logo;
  const tagline = footerSettings?.tagline || "";
  
  const footerBottomText = footerSettings?.footerBottomText || 
    `© ${new Date().getFullYear()} Fundgrube-Bestpreis. All rights reserved.`;

  return (
    <footer className="bg-white border-t relative">
      <Container>
        <FooterTop 
          contactItems={contactItems} 
          storeLocations={storeLocations}
          isLoading={isCurrentlyLoading} 
        />
        
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            {isCurrentlyLoading ? (
              <div className="h-10 w-32 bg-slate-100 animate-pulse rounded-md" />
            ) : footerLogo ? (
              <Image
                src={urlFor(footerLogo).width(160).height(60).url()}
                alt="Footer logo"
                width={160}
                height={60}
                className="object-contain"
              />
            ) : (
              <Logo />
            )}
            
            {tagline && <SubText>{tagline}</SubText>}
            
            {!isCurrentlyLoading && socialLinks && socialLinks.length > 0 && (
              <SocialMedia
                links={socialLinks}
                className="text-darkColor/60 pt-2"
                iconClassName="border-darkColor/20 text-darkColor/60 hover:border-shop_light_green hover:text-shop_light_green hover:bg-shop_light_green/10 hoverEffect"
                tooltipClassName="bg-darkColor text-white"
              />
            )}
          </div>
          
          {/* Quick Links Section with Editable Header */}
          {quickLinksSection?.links && quickLinksSection.links.length > 0 && (
            <div>
              <SubTitle>{quickLinksSection.title || "Quick Links"}</SubTitle>
              <ul className="space-y-3 mt-4">
                {quickLinksSection.links.map((item) => (
                  <li key={item?.title}>
                    <Link
                      href={item?.href ?? "#"}
                      className="hover:text-shop_light_green hoverEffect font-medium text-sm"
                    >
                      {item?.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Categories Section with Editable Header */}
          {categoriesSection?.links && categoriesSection.links.length > 0 && (
            <div>
              <SubTitle>{categoriesSection.title || "Categories"}</SubTitle>
              <ul className="space-y-3 mt-4">
                {categoriesSection.links.map((item) => (
                  <li key={item?.title}>
                    <Link
                      href={item?.href ?? "#"}
                      className="hover:text-shop_light_green hoverEffect font-medium text-sm"
                    >
                      {item?.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="space-y-4">
            <SubTitle>Newsletter</SubTitle>
            <SubText>{newsletterText}</SubText>
            <form className="space-y-3">
              <Input placeholder="Enter your email" type="email" required />
              <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-xl">
                Subscribe
              </Button>
            </form>
          </div>
        </div>
        
        {/* LEGAL & COPYRIGHT SECTION */}
        <div className="py-4 border-t">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Legal Links */}
            {legalLinks && legalLinks.length > 0 && (
              <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
                {legalLinks.map((link, index) => (
                  <React.Fragment key={link?.title || index}>
                    {link?.openInNewTab ? (
                      <a
                        href={link?.href ?? "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-500 hover:text-shop_light_green hoverEffect transition-colors duration-200"
                      >
                        {link?.title}
                      </a>
                    ) : (
                      <Link
                        href={link?.href ?? "#"}
                        className="text-slate-500 hover:text-shop_light_green hoverEffect transition-colors duration-200"
                      >
                        {link?.title}
                      </Link>
                    )}
                    {index < legalLinks.length - 1 && (
                      <span className="text-slate-300 select-none">•</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            )}
            
            {/* Copyright Text */}
            <div className="text-center text-sm text-slate-500">
              {footerBottomText}
            </div>
          </div>
        </div>
      </Container>

      {/* 🟢 FLOATING ACTION PORTAL */}
      <FloatingWhatsApp />
    </footer>
  );
};

export default Footer;