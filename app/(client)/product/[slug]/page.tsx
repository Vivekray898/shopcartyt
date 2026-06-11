import ProductPurchaseAction from "@/components/ProductPurchaseAction";
import Container from "@/components/Container";
import FavoriteButton from "@/components/FavoriteButton";
import ImageView from "@/components/ImageView";
import PriceView from "@/components/PriceView";
import ProductCharacteristics from "@/components/ProductCharacteristics";
import { getProductBySlug, getSiteSettings } from "@/sanity/queries"; 
import { CornerDownLeft, StarIcon, Truck } from "lucide-react";
import { notFound } from "next/navigation";
import React from "react";
import { FaRegQuestionCircle } from "react-icons/fa";
import { FiShare2 } from "react-icons/fi";
import { RxBorderSplit } from "react-icons/rx";
import { TbTruckDelivery } from "react-icons/tb"; 
import ProductShareButton from "@/components/ProductShareButton"; // IMPORT THE NEW SHARE COMPONENT

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

  return (
    <Container className="flex flex-col md:flex-row gap-10 py-10">
      {product?.images && (
        <ImageView images={product?.images} isStock={product?.stock ?? undefined} />
      )}
      <div className="w-full md:w-1/2 flex flex-col gap-5">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold">{product?.name}</h2>
          <div className="text-sm text-gray-600 tracking-wide">
            <div dangerouslySetInnerHTML={{ __html: product?.description || "" }} className="prose-sm custom-html-reset" />
          </div>
          <div className="flex items-center gap-0.5 text-xs mt-3">
            {[...Array(5)].map((_, index) => (
              <StarIcon key={index} size={12} className="text-shop_light_green" fill={"#3b9c3c"} />
            ))}
            <p className="font-semibold">{`(120)`}</p>
          </div>
        </div>
        
        <div className="space-y-2 border-t border-b border-gray-200 py-5">
          <PriceView price={product?.price ?? undefined} discount={product?.discount ?? undefined} className="text-lg font-bold" />
          
          <p className={`px-4 py-1.5 text-sm text-center inline-block font-semibold rounded-lg ${
            isCatalogueMode || (product?.stock ?? 0) > 0 ? "text-green-600 bg-green-100" : "bg-red-100 text-red-600"
          }`}>
            {isCatalogueMode ? "Showroom Exhibition" : (product?.stock ?? 0) > 0 ? "In Stock" : "Out of Stock"}
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
            <p>Compare color</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-black hover:text-red-600 hoverEffect cursor-pointer">
            <FaRegQuestionCircle className="text-lg" />
            <p>Ask a question</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-black hover:text-red-600 hoverEffect cursor-pointer">
            <TbTruckDelivery className="text-lg" />
            <p>Delivery & Return</p>
          </div>
          
          {/* FIXED: Replaced passive layout row item with the working interactive Web Share API hub */}
          <ProductShareButton productName={product?.name || "Product"} />
        </div>

        {/* FIXED: Wrapped shipping detail rows inside inverted checks so they completely hide when catalogue mode is active */}
        {!isCatalogueMode && (
          <div className="flex flex-col animate-fadeIn">
            <div className="border border-lightColor/25 border-b-0 p-3 flex items-center gap-2.5">
              <Truck size={30} className="text-shop_orange" />
              <div>
                <p className="text-base font-semibold text-black">
                  Free Delivery
                </p>
                <p className="text-sm text-gray-500 underline underline-offset-2">
                  Enter your Postal code for Delivery Availability.
                </p>
              </div>
            </div>
            <div className="border border-lightColor/25 p-3 flex items-center gap-2.5">
              <CornerDownLeft size={30} className="text-shop_orange" />
              <div>
                <p className="text-base font-semibold text-black">
                  Return Delivery
                </p>
                <p className="text-sm text-gray-500 ">
                  Free 30days Delivery Returns. <span className="underline underline-offset-2">Details</span>
                </p>
              </div>
            </div>
          </div>
        )}

      </div>
    </Container>
  );
};

export default SingleProductPage;