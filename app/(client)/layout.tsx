import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ClerkProvider } from "@clerk/nextjs";
import { ShopModeProvider } from "@/hooks/useShopMode";
import { getSiteSettings } from "@/sanity/queries";
// IMPORT YOUR NEW AUTO TRANSLATOR COMPONENT
import AutoTranslator from "@/components/AutoTranslator"; 

export const metadata: Metadata = {
  title: {
    template: "%s - FundGrube online store",
    default: "FundGrube online store",
  },
  description: "FundGrube online store, Your one stop shop for all your needs",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const siteSettings = await getSiteSettings();
  const catalogueMode = siteSettings?.catalogueMode ?? false;

  return (
    <ClerkProvider>
      <ShopModeProvider catalogueMode={catalogueMode}>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
        
        {/* 🚀 RUNS AUTO-TRANSLATION CHECKS FOR EVERY VISITOR ENTIRELY FOR FREE */}
        <AutoTranslator />
      </ShopModeProvider>
    </ClerkProvider>
  );
}