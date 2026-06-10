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

const Footer = () => {
  const { footerSettings } = useSiteSettings();
  const quickLinks = footerSettings?.quickLinks ?? [];
  const categories = footerSettings?.categories ?? [];
  const newsletterText =
    footerSettings?.newsletterText ||
    "Subscribe to our newsletter to receive updates and exclusive offers.";
  const socialLinks = footerSettings?.socialLinks;
  const contactItems = footerSettings?.contactItems;
  const footerLogo = footerSettings?.logo;
  const tagline =
    footerSettings?.tagline ||
    "Discover curated furniture collections at Shopcartyt, blending style and comfort to elevate your living spaces.";
  const footerBottomText =
    footerSettings?.footerBottomText ||
    `© ${new Date().getFullYear()} Shopcartyt. All rights reserved.`;

  return (
    <footer className="bg-white border-t">
      <Container>
        <FooterTop contactItems={contactItems} />
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            {footerLogo ? (
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
            <SubText>{tagline}</SubText>
            <SocialMedia
              links={socialLinks}
              className="text-darkColor/60"
              iconClassName="border-darkColor/60 hover:border-shop_light_green hover:text-shop_light_green"
              tooltipClassName="bg-darkColor text-white"
            />
          </div>
          <div>
            <SubTitle>Quick Links</SubTitle>
            <ul className="space-y-3 mt-4">
              {quickLinks?.map((item) => (
                <li key={item?.title}>
                  <Link
                    href={item?.href ?? "#"}
                    className="hover:text-shop_light_green hoverEffect font-medium"
                  >
                    {item?.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <SubTitle>Categories</SubTitle>
            <ul className="space-y-3 mt-4">
              {categories?.map((item) => (
                <li key={item?.title}>
                  <Link
                    href={item?.href ?? "#"}
                    className="hover:text-shop_light_green hoverEffect font-medium"
                  >
                    {item?.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-4">
            <SubTitle>Newsletter</SubTitle>
            <SubText>{newsletterText}</SubText>
            <form className="space-y-3">
              <Input placeholder="Enter your email" type="email" required />
              <Button className="w-full">Subscribe</Button>
            </form>
          </div>
        </div>
        <div className="py-6 border-t text-center text-sm text-gray-600">
          <div>{footerBottomText}</div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
