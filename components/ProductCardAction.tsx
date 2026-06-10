"use client";

import Link from "next/link";
import { Product } from "@/sanity.types";
import AddToCartButton from "./AddToCartButton";
import { useShopMode } from "@/hooks/useShopMode";

const ProductCardAction = ({ product }: { product: Product }) => {
  const { catalogueMode } = useShopMode();

  if (catalogueMode) {
    return (
      <Link
        href={`/product/${product?.slug?.current}`}
        className="inline-flex w-full items-center justify-center rounded-full border border-shop_orange bg-transparent px-3.5 py-2.5 text-sm font-semibold text-shop_orange transition hover:bg-shop_orange/10"
      >
        View Details
      </Link>
    );
  }

  return <AddToCartButton product={product} className="w-36 rounded-full" />;
};

export default ProductCardAction;
