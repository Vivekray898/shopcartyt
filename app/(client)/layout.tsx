// app/(client)/layout.tsx
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ClerkProvider } from "@clerk/nextjs";
import { ShopModeProvider } from "@/hooks/useShopMode";
import { getSiteSettings } from "@/sanity/queries";
import AutoTranslator from "@/components/AutoTranslator";

// NO metadata export here - it inherits from root layout

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
        <AutoTranslator />
      </ShopModeProvider>
    </ClerkProvider>
  );
}