"use client";

import AddToCartButton from "./AddToCartButton";
import StorePickupAction from "./StorePickupAction";
import { Product } from "@/sanity.types";
import { useShopMode } from "@/hooks/useShopMode";

const ProductPurchaseAction = ({ product }: { product: Product }) => {
  const { catalogueMode } = useShopMode();

  return catalogueMode ? <StorePickupAction /> : <AddToCartButton product={product} />;
};

export default ProductPurchaseAction;
