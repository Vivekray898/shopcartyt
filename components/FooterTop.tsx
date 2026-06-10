"use client";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import React from "react";

type FooterContactItem = {
  title?: string;
  subtitle?: string;
  icon?: string;
};

const defaultData: FooterContactItem[] = [
  {
    title: "Visit Us",
    subtitle: "New Orleans, USA",
    icon: "map-pin",
  },
  {
    title: "Call Us",
    subtitle: "+12 958 648 597",
    icon: "phone",
  },
  {
    title: "Working Hours",
    subtitle: "Mon - Sat: 10:00 AM - 7:00 PM",
    icon: "clock",
  },
  {
    title: "Email Us",
    subtitle: "Shopcart@gmail.com",
    icon: "mail",
  },
];

const getIcon = (name?: string) => {
  switch (name?.toLowerCase()) {
    case "map-pin":
    case "mappin":
    case "map":
      return (
        <MapPin className="h-6 w-6 text-gray-600 group-hover:text-primary transition-colors" />
      );
    case "phone":
      return (
        <Phone className="h-6 w-6 text-gray-600 group-hover:text-primary transition-colors" />
      );
    case "clock":
    case "working-hours":
      return (
        <Clock className="h-6 w-6 text-gray-600 group-hover:text-primary transition-colors" />
      );
    case "mail":
    case "email":
      return (
        <Mail className="h-6 w-6 text-gray-600 group-hover:text-primary transition-colors" />
      );
    default:
      return (
        <MapPin className="h-6 w-6 text-gray-600 group-hover:text-primary transition-colors" />
      );
  }
};

const FooterTop = ({
  contactItems,
}: {
  contactItems?: FooterContactItem[];
}) => {
  const items = contactItems?.length ? contactItems : defaultData;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 border-b">
      {items?.map((item, index) => (
        <div
          key={`${item?.title ?? "contact"}-${index}`}
          className="flex items-center gap-3 group hover:bg-gray-50 p-4 transition-colors hoverEffect"
        >
          {getIcon(item?.icon)}
          <div>
            <h3 className="font-semibold text-gray-900 group-hover:text-black hoverEffect">
              {item?.title}
            </h3>
            <p className="text-gray-600 text-sm mt-1 group-hover:text-gray-900 hoverEffect">
              {item?.subtitle}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FooterTop;
