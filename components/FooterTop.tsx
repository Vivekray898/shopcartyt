"use client";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import React from "react";

type FooterContactItem = {
  title?: string;
  subtitle?: string;
  icon?: string;
};

const getIcon = (name?: string) => {
  switch (name?.toLowerCase()) {
    case "map-pin":
    case "mappin":
    case "map":
      return <MapPin className="h-5 w-5 text-slate-400 group-hover:text-shop_light_green transition-colors" />;
    case "phone":
      return <Phone className="h-5 w-5 text-slate-400 group-hover:text-shop_light_green transition-colors" />;
    case "clock":
    case "working-hours":
      return <Clock className="h-5 w-5 text-slate-400 group-hover:text-shop_light_green transition-colors" />;
    case "mail":
    case "email":
      return <Mail className="h-5 w-5 text-slate-400 group-hover:text-shop_light_green transition-colors" />;
    default:
      return <MapPin className="h-5 w-5 text-slate-400 group-hover:text-shop_light_green transition-colors" />;
  }
};

interface FooterTopProps {
  contactItems?: FooterContactItem[];
  isLoading: boolean; // FIXED: Controls structural flash gates
}

const FooterTop = ({ contactItems, isLoading }: FooterTopProps) => {
  // If explicitly loading, render 4 identical layout shimmer grid rows
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 border-b py-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-center gap-3 p-4">
            <div className="h-10 w-10 rounded-xl bg-slate-100 animate-pulse flex-shrink-0" />
            <div className="space-y-2 w-full">
              <div className="h-4 w-24 bg-slate-100 animate-pulse rounded" />
              <div className="h-3 w-32 bg-slate-100 animate-pulse rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Once loading completes, map out active configurations safely (Gracefully renders nothing if unset)
  if (!contactItems || contactItems.length === 0) return null;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 border-b">
      {contactItems.map((item, index) => (
        <div
          key={`${item?.title ?? "contact"}-${index}`}
          className="flex items-center gap-3 group hover:bg-slate-50/50 p-4 rounded-xl transition-all duration-300"
        >
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 group-hover:bg-shop_light_green/10 group-hover:border-shop_light_green/20 transition-all duration-300">
            {getIcon(item?.icon)}
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-800 transition-colors group-hover:text-slate-950">
              {item?.title}
            </h3>
            <p className="text-slate-500 text-xs mt-0.5 transition-colors group-hover:text-slate-700">
              {item?.subtitle}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FooterTop;