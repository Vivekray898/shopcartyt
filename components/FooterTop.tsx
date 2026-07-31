// components/FooterTop.tsx
"use client";
import { Clock, Mail, MapPin, Phone, ChevronLeft, ChevronRight, ExternalLink, Navigation } from "lucide-react";
import React, { useState, useEffect } from "react";

type FooterContactItem = {
  title?: string;
  subtitle?: string;
  icon?: string;
};

type StoreLocation = {
  name?: string;
  address?: string;
  city?: string;
  phone?: string;
  email?: string;
  hours?: string;
  embedUrl?: string;
  mapsUrl?: string;
  featured?: boolean;
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
  storeLocations?: StoreLocation[];
  isLoading: boolean;
}

const FooterTop = ({ contactItems, storeLocations, isLoading }: FooterTopProps) => {
  const [currentMapIndex, setCurrentMapIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Filter and sort locations (featured first)
  const locations = storeLocations?.filter(loc => loc?.embedUrl) || [];
  
  // If no locations from Sanity, use fallback default locations
  const mapLocations = locations.length > 0 ? locations : [
    {
      name: "Fundgrube Aßweiler",
      address: "Blumen, Gartencenter",
      city: "Aßweiler, Germany",
      embedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2606.322878516748!2d7.1800750767101915!3d49.2134034756573!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4795cdce6b678f33%3A0x302e33a329f835f9!2sFundgrube%20Sonderpostenmarkt%2C%20Blumen%2C%20Gartencenter%2C%20A%C3%9Fweiler!5e0!3m2!1sen!2sin!4v1785411348624!5m2!1sen!2sin",
      mapsUrl: "https://www.google.com/maps?q=Fundgrube+Sonderpostenmarkt+A%C3%9Fweiler",
      hours: "Mon-Sat 9:00-20:00"
    },
    {
      name: "Best Preis Blieskastel",
      address: "Textil, Schreibware, Baumarkt",
      city: "Blieskastel, Germany",
      embedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2604.5416189021976!2d7.363204976711802!3d49.24717927326737!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4795d123d15c4abb%3A0xad008301e167ed7!2sBest%20Preis%20Textil%20Schreibware%20Baumarkt%20Artikel!5e0!3m2!1sen!2sin!4v1785411367261!5m2!1sen!2sin",
      mapsUrl: "https://www.google.com/maps?q=Best+Preis+Textil+Schreibware+Baumarkt+Blieskastel",
      hours: "Mon-Sat 9:00-20:00"
    }
  ];

  const nextMap = () => {
    setCurrentMapIndex((prev) => (prev + 1) % mapLocations.length);
  };

  const prevMap = () => {
    setCurrentMapIndex((prev) => (prev - 1 + mapLocations.length) % mapLocations.length);
  };

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

  // Once loading completes, map out active configurations safely
  if (!contactItems || contactItems.length === 0) {
    // If no contact items, show nothing
    if (mapLocations.length === 0) return null;
  }

  return (
    <>
      {/* 🚀 NATURAL GAP ADDED: Small top spacing to prevent content from mixing */}
      <div className="pt-4 md:pt-6">
        {/* Contact Info Grid */}
        {contactItems && contactItems.length > 0 && (
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
        )}

        {/* Visit Us Section - Only show if there are locations */}
        {mapLocations.length > 0 && (
          <div className={`${contactItems && contactItems.length > 0 ? 'mt-8' : 'border-b pb-0'} pb-8`}>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-xl bg-shop_light_green/10 border border-shop_light_green/20">
                <MapPin className="h-5 w-5 text-shop_light_green" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800">Visit Our Stores</h3>
                <p className="text-sm text-slate-500">Find us at these convenient locations</p>
              </div>
            </div>

            {/* Mobile: Carousel with dots and navigation */}
            <div className="md:hidden">
              <div className="relative">
                {/* Map Container */}
                <div className="rounded-xl overflow-hidden shadow-lg border border-slate-200">
                  <div className="bg-gradient-to-r from-slate-50 to-white px-4 py-3 border-b flex justify-between items-center">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-slate-800 truncate">
                        {mapLocations[currentMapIndex]?.name || `Location ${currentMapIndex + 1}`}
                      </h4>
                      <p className="text-xs text-slate-500 truncate">
                        {mapLocations[currentMapIndex]?.address || ''}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 ml-2 flex-shrink-0">
                      <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                        {currentMapIndex + 1}/{mapLocations.length}
                      </span>
                    </div>
                  </div>
                  <div className="relative">
                    <iframe
                      src={mapLocations[currentMapIndex]?.embedUrl || ''}
                      width="100%"
                      height="250"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="strict-origin-when-cross-origin"
                      title={mapLocations[currentMapIndex]?.name || `Location ${currentMapIndex + 1}`}
                      className="w-full"
                    />
                    {mapLocations[currentMapIndex]?.mapsUrl && (
                      <a
                        href={mapLocations[currentMapIndex]?.mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute bottom-3 right-3 bg-white/95 hover:bg-white text-slate-800 px-3 py-1.5 rounded-lg text-xs font-medium shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-1.5 border border-slate-200 hover:border-shop_light_green"
                      >
                        <Navigation className="h-3.5 w-3.5 text-shop_light_green" />
                        Directions
                      </a>
                    )}
                  </div>
                </div>

                {/* Navigation Arrows */}
                {mapLocations.length > 1 && (
                  <>
                    <button
                      onClick={prevMap}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-slate-800 p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110 border border-slate-200"
                      aria-label="Previous location"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={nextMap}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-slate-800 p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110 border border-slate-200"
                      aria-label="Next location"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </>
                )}

                {/* Dots Indicator */}
                {mapLocations.length > 1 && (
                  <div className="flex justify-center gap-2 mt-4">
                    {mapLocations.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentMapIndex(index)}
                        className={`h-2 rounded-full transition-all duration-300 ${
                          currentMapIndex === index
                            ? "w-8 bg-shop_light_green"
                            : "w-2 bg-slate-300 hover:bg-slate-400"
                        }`}
                        aria-label={`Go to location ${index + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Desktop: Side by Side */}
            <div className="hidden md:grid md:grid-cols-2 gap-6">
              {mapLocations.map((location, index) => (
                <div
                  key={index}
                  className="rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200 group"
                >
                  <div className="bg-gradient-to-r from-slate-50 to-white px-4 py-3 border-b flex justify-between items-center">
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">
                        {location?.name || `Location ${index + 1}`}
                      </h4>
                      <p className="text-xs text-slate-500">
                        {location?.address || ''}
                      </p>
                    </div>
                    {location?.mapsUrl && (
                      <a
                        href={location.mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-shop_light_green hover:text-shop_light_green/80 text-xs font-medium flex items-center gap-1 transition-colors"
                      >
                        Get Directions
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                  <div className="relative">
                    <iframe
                      src={location?.embedUrl || ''}
                      width="100%"
                      height="300"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="strict-origin-when-cross-origin"
                      title={location?.name || `Location ${index + 1}`}
                      className="w-full"
                    />
                    {location?.mapsUrl && (
                      <a
                        href={location.mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute bottom-3 right-3 bg-white/95 hover:bg-white text-slate-800 px-3 py-1.5 rounded-lg text-xs font-medium shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-1.5 border border-slate-200 hover:border-shop_light_green opacity-0 group-hover:opacity-100"
                      >
                        <Navigation className="h-3.5 w-3.5 text-shop_light_green" />
                        Directions
                      </a>
                    )}
                  </div>
                  {/* Store Details Footer */}
                  <div className="bg-slate-50 px-4 py-2 border-t flex justify-between items-center text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-slate-400" />
                      {location?.city || location?.address || ''}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-slate-400" />
                      {location?.hours || 'Mon-Sat 9:00-20:00'}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Store Location Quick Links (Mobile Friendly) */}
            {mapLocations.length > 1 && (
              <div className="flex flex-wrap justify-center gap-2 mt-4 md:hidden">
                {mapLocations.map((location, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentMapIndex(index)}
                    className={`px-3 py-1.5 text-xs rounded-full transition-all duration-200 ${
                      currentMapIndex === index
                        ? "bg-shop_light_green text-white font-medium shadow-md"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {location?.name?.replace(/^[^ ]+ /, '') || `Location ${index + 1}`}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default FooterTop;