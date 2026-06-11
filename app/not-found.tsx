"use client";
import Logo from "@/components/Logo";
import Link from "next/link";
import React from "react";
import { ArrowLeft, Store } from "lucide-react";

const NotFoundPage = () => {
  return (
    <div className="bg-slate-50/50 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-16 md:py-32 min-h-[80vh]">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-slate-100 shadow-xs space-y-8 text-center animate-fadeIn">
        
        {/* Branding & Header */}
        <div className="flex flex-col items-center">
          <Logo />

          <h1 className="mt-8 text-4xl font-black text-slate-900 tracking-tight">
            404
          </h1>
          <h2 className="mt-2 text-xl font-bold text-slate-800 tracking-tight">
            Page Not Found
          </h2>
          <p className="mt-3 text-sm text-slate-500 leading-relaxed">
            The Web address you entered is not a functioning page on our site. 
            It may have been moved, renamed, or temporarily deleted.
          </p>
        </div>

        {/* Action Navigation Matrix */}
        <div className="space-y-3">
          <Link
            href="/"
            className="w-full flex items-center justify-center gap-2 px-5 py-3 border border-transparent text-xs font-black uppercase tracking-wider rounded-xl text-white bg-shop_light_green hover:bg-shop_light_green/90 shadow-2xs hover:shadow-md transition-all duration-200 active:scale-98 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Go to Home Page
          </Link>
          
          <Link
            href="/shop"
            className="w-full flex items-center justify-center gap-2 px-5 py-3 border border-slate-200 bg-white text-xs font-black uppercase tracking-wider rounded-xl text-slate-700 hover:bg-slate-50 transition-all duration-200 active:scale-98 cursor-pointer"
          >
            <Store className="w-4 h-4 text-shop_light_green" />
            Browse Our Collection
          </Link>
        </div>

        {/* Support Fallback Footer */}
        <div className="pt-4 border-t border-slate-100">
          <p className="text-xs font-semibold text-slate-400">
            Need help? Visit our{" "}
            <Link
              href="/faq"
              className="font-bold text-shop_light_green hover:underline inline-flex items-center gap-0.5"
            >
              FAQ Section
            </Link>{" "}
            or{" "}
            <Link
              href="/contact"
              className="font-bold text-shop_light_green hover:underline"
            >
              Contact Us
            </Link>.
          </p>
        </div>

      </div>
    </div>
  );
};

export default NotFoundPage;