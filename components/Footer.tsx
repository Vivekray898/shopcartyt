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
import FloatingWhatsApp from "./FloatingWhatsApp"; // 🚀 IMPORT THE NEW COMPONENT

const Footer = () => {
  const { footerSettings } = useSiteSettings();
  
  const isCurrentlyLoading = !footerSettings;
  
  const quickLinks = footerSettings?.quickLinks ?? [];
  const categories = footerSettings?.categories ?? [];
  
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
        {/* Passing down active synchronization state controls */}
        <FooterTop contactItems={contactItems} isLoading={isCurrentlyLoading} />
        
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
            
            {!isCurrentlyLoading && (
              <SocialMedia
                links={socialLinks}
                className="text-darkColor/60 pt-2"
                iconClassName="border-darkColor/20 text-darkColor/60 hover:border-shop_light_green hover:text-shop_light_green hover:bg-shop_light_green/10 hoverEffect"
                tooltipClassName="bg-darkColor text-white"
              />
            )}
          </div>
          
          <div>
            <SubTitle>Quick Links</SubTitle>
            <ul className="space-y-3 mt-4">
              {quickLinks?.map((item) => (
                <li key={item?.title}>
                  <Link
                    href={item?.href ?? "#"}
                    className="hover:text-shop_light_green hoverEffect font-medium text-sm"
                  >
                    {item?.title}
                  </Link>
                </li>
              ))}
              {!isCurrentlyLoading && quickLinks.length === 0 && (
                <span className="text-xs text-slate-400 italic">No links configured</span>
              )}
            </ul>
          </div>
          
          <div>
            <SubTitle>Categories</SubTitle>
            <ul className="space-y-3 mt-4">
              {categories?.map((item) => (
                <li key={item?.title}>
                  <Link
                    href={item?.href ?? "#"}
                    className="hover:text-shop_light_green hoverEffect font-medium text-sm"
                  >
                    {item?.title}
                  </Link>
                </li>
              ))}
              {!isCurrentlyLoading && categories.length === 0 && (
                <span className="text-xs text-slate-400 italic">No categories configured</span>
              )}
            </ul>
          </div>
          
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
        
        <div className="py-6 border-t text-center text-sm text-slate-500">
          <div>{footerBottomText}</div>
        </div>
      </Container>

      {/* 🟢 FLOATING ACTION PORTAL */}
      <FloatingWhatsApp />
    </footer>
  );
};

export default Footer;