"use client";

import React, { useEffect, useState } from "react";

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: any;
  }
}

export default function AutoTranslator() {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    window.googleTranslateElementInit = () => {
      if (!window.google?.translate?.TranslateElement) return;
      
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "de", // Website baseline source language
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: true,
        },
        "google_translate_element"
      );
    };

    if (document.querySelector("#google-translate-script")) {
      setInitialized(true);
      return;
    }

    const script = document.createElement("script");
    script.id = "google-translate-script";
    script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.body.appendChild(script);
    setInitialized(true);
  }, []);

  useEffect(() => {
    if (!initialized) return;

    const detectAndTranslate = async () => {
      let targetLanguage: string | undefined = undefined;

      const languageMap: Record<string, string> = {
        es: "es", // Spanish
        mx: "es", // Spanish
        fr: "fr", // French
        it: "it", // Italian
        de: "de", // German
        en: "en", // English
        us: "en", // English
        gb: "en", // English
      };

      // 1. ATTEMPT PRIMARY METHOD: Secure Geolocation with strict fallback safety nets
      try {
        const response = await fetch("https://ipapi.co/json/");
        if (response.ok) {
          const data = await response.json();
          const countryCode = data?.country_code?.toLowerCase();
          if (countryCode && languageMap[countryCode]) {
            targetLanguage = languageMap[countryCode];
          }
        }
      } catch (err) {
        // Log locally to keep terminal logs readable without breaking runtime flows
        console.warn("IP Geolocation was blocked or failed. Switching to native fallback route...");
      }

      // 2. ATTEMPT SECONDARY METHOD: Client Browser Locale Fallback (100% immune to AdBlockers)
      if (!targetLanguage && typeof navigator !== "undefined") {
        const browserLang = navigator.language?.split("-")[0]?.toLowerCase();
        if (browserLang && Object.values(languageMap).includes(browserLang)) {
          targetLanguage = browserLang;
        }
      }

      // 3. EXECUTE: Trigger the automation script routine if a language translation target exists
      if (targetLanguage) {
        const checkSelectInterval = setInterval(() => {
          const googleCombo = document.querySelector(".goog-te-combo") as HTMLSelectElement;
          if (googleCombo) {
            googleCombo.value = targetLanguage!;
            googleCombo.dispatchEvent(new Event("change"));
            clearInterval(checkSelectInterval);
          }
        }, 500);

        setTimeout(() => clearInterval(checkSelectInterval), 10000);
      }
    };

    const delayTimer = setTimeout(detectAndTranslate, 1500);
    return () => clearTimeout(delayTimer);
  }, [initialized]);

  return (
    <>
      <div id="google-translate-element" className="hidden" style={{ display: "none" }} />
      <style jsx global>{`
        .goog-te-banner-frame, .goog-te-banner { display: none !important; }
        body { top: 0px !important; }
        .goog-logo-link { display: none !important; }
        .goog-te-gadget { color: transparent !important; }
      `}</style>
    </>
  );
}