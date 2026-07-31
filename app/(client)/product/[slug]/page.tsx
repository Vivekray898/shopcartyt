// app/(client)/product/[slug]/page.tsx

import ProductPurchaseAction from "@/components/ProductPurchaseAction";
import Container from "@/components/Container";
import FavoriteButton from "@/components/FavoriteButton";
import ImageView from "@/components/ImageView";
import PriceView from "@/components/PriceView";
import ProductCharacteristics from "@/components/ProductCharacteristics";
import RelatedProducts from "@/components/RelatedProducts";
import RecentlyViewed from "@/components/RecentlyViewed";
import { getProductBySlug, getSiteSettings, getRelatedProducts } from "@/sanity/queries";
import { CornerDownLeft, StarIcon, Truck } from "lucide-react";
import { notFound } from "next/navigation";
import React from "react";
import { FaRegQuestionCircle } from "react-icons/fa";
import { RxBorderSplit } from "react-icons/rx";
import { TbTruckDelivery } from "react-icons/tb"; 
import ProductShareButton from "@/components/ProductShareButton";

const SingleProductPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  const siteSettings = await getSiteSettings();
  const isCatalogueMode = siteSettings?.catalogueMode ?? true; 
  
  if (!product) {
    return notFound();
  }

  const resolvedVariant = typeof product?.variant === "object" && product?.variant !== null
    ? (product.variant as any)?.title
    : undefined;

  const resolvedBrandName = typeof product?.brand === "object" && product?.brand !== null
    ? ((product.brand as any)?.title || (product.brand as any)?.brandName)
    : undefined;

  const categoryId = product?.categories && product.categories.length > 0 
    ? (product.categories[0] as any)?._id 
    : undefined;
  
  const brandId = (product?.brand as any)?._id || (product?.brand as any)?._ref;
  
  let relatedProducts = [];
  
  if (categoryId) {
    relatedProducts = await getRelatedProducts(product._id, categoryId, undefined, 12);
  } 
  
  if (relatedProducts.length === 0 && brandId) {
    relatedProducts = await getRelatedProducts(product._id, undefined, brandId, 12);
  }
  
  if (relatedProducts.length === 0) {
    relatedProducts = await getRelatedProducts(product._id, undefined, undefined, 12);
  }

  return (
    <>
      <Container className="flex flex-col md:flex-row gap-10 py-10">
        {product?.images && (
          <ImageView images={product?.images} isStock={product?.stock ?? undefined} />
        )}
        <div className="w-full md:w-1/2 flex flex-col gap-6">
          {/* Header & Description Block */}
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-gray-900 leading-tight">
              {product?.name}
            </h1>
            
            {product?.description && (
              <div 
                dangerouslySetInnerHTML={{ __html: product?.description || "" }} 
                className="mt-2 text-sm md:text-base text-gray-500 leading-relaxed prose-sm custom-html-reset" 
              />
            )}
            
            <div className="flex items-center gap-1.5 mt-3">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, index) => (
                  <StarIcon key={index} size={14} className="text-shop_light_green" fill={"#3b9c3c"} />
                ))}
              </div>
              <span className="text-xs font-medium text-gray-500">(120)</span>
            </div>
          </div>
          
          <div className="space-y-3 border-t border-b border-gray-200 py-5">
            <PriceView price={product?.price ?? undefined} discount={product?.discount ?? undefined} className="text-xl font-bold" />
            
            <p className={`px-3.5 py-1 text-xs sm:text-sm inline-block font-semibold rounded-md ${
              isCatalogueMode || (product?.stock ?? 0) > 0 ? "text-green-700 bg-green-50 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"
            }`}>
              {isCatalogueMode ? "Showroom-Ausstellung" : (product?.stock ?? 0) > 0 ? "Auf Lager" : "Nicht auf Lager"}
            </p>
          </div>

          <div className="flex items-center gap-2.5 lg:gap-3">
            <ProductPurchaseAction product={product as any} />
            <FavoriteButton showProduct={true} product={product as any} />
          </div>

          <ProductCharacteristics 
            productName={product?.name}
            variant={resolvedVariant}
            stock={product?.stock ?? undefined}
            brandName={resolvedBrandName}
            isCatalogueMode={isCatalogueMode}
          />

          {/* Informational utility bottom panel bar */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 border-b border-b-gray-200 py-5 -mt-2">
            <div className="flex items-center gap-2 text-sm text-black hover:text-red-600 hoverEffect cursor-pointer">
              <RxBorderSplit className="text-lg" />
              <p>Farbe vergleichen</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-black hover:text-red-600 hoverEffect cursor-pointer">
              <FaRegQuestionCircle className="text-lg" />
              <p>Eine Frage stellen</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-black hover:text-red-600 hoverEffect cursor-pointer">
              <TbTruckDelivery className="text-lg" />
              <p>Lieferung & Rückgabe</p>
            </div>
            
            <ProductShareButton productName={product?.name || "Produkt"} />
          </div>

          {!isCatalogueMode && (
            <div className="flex flex-col animate-fadeIn">
              <div className="border border-lightColor/25 border-b-0 p-3 flex items-center gap-2.5">
                <Truck size={30} className="text-shop_orange" />
                <div>
                  <p className="text-base font-semibold text-black">
                    Kostenlose Lieferung
                  </p>
                  <p className="text-sm text-gray-500 underline underline-offset-2">
                    Geben Sie Ihre Postleitzahl ein, um die Lieferverfügbarkeit zu prüfen.
                  </p>
                </div>
              </div>
              <div className="border border-lightColor/25 p-3 flex items-center gap-2.5">
                <CornerDownLeft size={30} className="text-shop_orange" />
                <div>
                  <p className="text-base font-semibold text-black">
                    Rücklieferung
                  </p>
                  <p className="text-sm text-gray-500 ">
                    Kostenlose 30-Tage-Rückgabe. <span className="underline underline-offset-2">Details</span>
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </Container>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <Container>
          <RelatedProducts 
            products={relatedProducts}
            title="Das könnte Ihnen auch gefallen"
          />
        </Container>
      )}

      {/* Recently Viewed Products Section */}
      <Container>
        <RecentlyViewed 
          currentProductId={product._id}
          currentProduct={product}
          maxItems={10}
        />
      </Container>
    </>
  );
};

export default SingleProductPage;