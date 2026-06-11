"use client";

import React from "react";
import { FaWhatsapp } from "react-icons/fa";

const FloatingWhatsApp = () => {
  // Replace this with your actual business phone number (including country code, e.g., 91 for India)
  const phoneNumber = "4917632853448"; // Example: "4917632853448" for Germany
  
  // Prefilled message that appears in the user's text box automatically
  const defaultMessage = encodeURIComponent(
    "Hello Fundgrube Support! I am browsing the showroom and have a question regarding product availability."
  );

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${defaultMessage}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 left-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl transition-all duration-300 hover:scale-110 hover:bg-[#20ba5a] active:scale-95 animate-bounce-slow group"
    >
      {/* Dynamic Notification Dot Tooltip */}
      <span className="absolute -top-1 -right-1 flex h-4 w-4">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75" />
        <span className="relative inline-flex h-4 w-4 rounded-full bg-rose-500 text-[9px] font-black items-center justify-center text-white">
          1
        </span>
      </span>

      {/* WhatsApp Icon */}
      <FaWhatsapp className="h-8 w-8 transition-transform group-hover:rotate-6" />

      {/* Hidden Text for Accessibilities */}
      <span className="sr-only">Chat with us on WhatsApp</span>
    </a>
  );
};

export default FloatingWhatsApp;