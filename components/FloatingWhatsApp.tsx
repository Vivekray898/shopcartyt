"use client";

import React, { useState } from "react";
import { FaWhatsapp, FaPhone, FaChevronUp, FaChevronDown } from "react-icons/fa";

interface ContactOption {
  label: string;
  phoneNumber: string;
  icon?: React.ReactNode;
}

const FloatingWhatsApp = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Contact options for both brands
  const contactOptions: ContactOption[] = [
    {
      label: "Fundgrube",
      phoneNumber: "4968039943760", // +49 6803 9943760
    },
    {
      label: "Bestpreis",
      phoneNumber: "4963329136688", // +49 6332 9136688
    },
  ];

  // Default message
  const defaultMessage = encodeURIComponent(
    "Hello! I am browsing the showroom and have a question regarding product availability."
  );

  // Toggle expanded state
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  // Get WhatsApp URL for a specific number
  const getWhatsAppUrl = (phoneNumber: string) => {
    return `https://wa.me/${phoneNumber}?text=${defaultMessage}`;
  };

  // Get call URL for a specific number
  const getCallUrl = (phoneNumber: string) => {
    return `tel:${phoneNumber}`;
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-center gap-3">
      {/* Toggle Button - Only show when expanded */}
      {isExpanded && (
        <button
          onClick={toggleExpand}
          aria-label="Collapse contact options"
          className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-700 text-white shadow-xl transition-all duration-300 hover:scale-110 hover:bg-gray-600 active:scale-95"
        >
          <FaChevronDown className="h-5 w-5" />
        </button>
      )}

      {/* Contact Options - Expanded View */}
      {isExpanded && (
        <>
          {contactOptions.map((option, index) => (
            <div
              key={option.label}
              className="flex flex-col items-center gap-2 animate-fadeInUp"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Brand Label */}
              <span className="text-xs font-semibold text-gray-700 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-md">
                {option.label}
              </span>
              
              <div className="flex items-center gap-2">
                {/* Call Button */}
                <a
                  href={getCallUrl(option.phoneNumber)}
                  aria-label={`Call ${option.label}`}
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-[#34B7F1] text-white shadow-xl transition-all duration-300 hover:scale-110 hover:bg-[#2a9fd6] active:scale-95 group"
                >
                  <FaPhone className="h-5 w-5 transition-transform group-hover:rotate-12" />
                  <span className="sr-only">Call {option.label}</span>
                </a>

                {/* WhatsApp Button */}
                <a
                  href={getWhatsAppUrl(option.phoneNumber)}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Chat with ${option.label} on WhatsApp`}
                  className="relative flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl transition-all duration-300 hover:scale-110 hover:bg-[#20ba5a] active:scale-95 group"
                >
                  <FaWhatsapp className="h-6 w-6 transition-transform group-hover:rotate-6" />
                  <span className="sr-only">Chat with {option.label} on WhatsApp</span>
                </a>
              </div>
            </div>
          ))}
        </>
      )}

      {/* Main Toggle Button - Always visible */}
      <button
        onClick={toggleExpand}
        aria-label={isExpanded ? "Collapse contact options" : "Contact us"}
        className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl transition-all duration-300 hover:scale-110 hover:bg-[#20ba5a] active:scale-95 group"
      >
        {/* Notification Dot - Only show when collapsed */}
        {!isExpanded && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75" />
            <span className="relative inline-flex h-4 w-4 rounded-full bg-rose-500 text-[9px] font-black items-center justify-center text-white">
              {contactOptions.length}
            </span>
          </span>
        )}

        {/* Icon changes based on state */}
        {isExpanded ? (
          <FaChevronUp className="h-6 w-6 transition-transform" />
        ) : (
          <FaWhatsapp className="h-8 w-8 transition-transform group-hover:rotate-6" />
        )}

        <span className="sr-only">
          {isExpanded ? "Close contact options" : "Contact us"}
        </span>
      </button>

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.3s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
};

export default FloatingWhatsApp;