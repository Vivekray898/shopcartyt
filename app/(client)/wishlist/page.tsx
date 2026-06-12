import NoAccess from "@/components/NoAccess";
import WishListProducts from "@/components/WishListProducts";
import { currentUser } from "@clerk/nextjs/server";
import { client } from "@/sanity/lib/client"; // Adjust this import path to match your sanity client location
import React from "react";

const WishListPage = async () => {
  const user = await currentUser();
  
  // Fetch the catalogue mode setting from Sanity
  const settings = await client.fetch(`*[_type == "siteSettings"][0]{ catalogueMode }`);
  const isCatalogueMode = settings?.catalogueMode || false;

  return (
    <>
      {user ? (
        <WishListProducts catalogueMode={isCatalogueMode} />
      ) : (
        <NoAccess details="Log in to view your wishlist items. Don’t miss out on your cart products to make the payment!" />
      )}
    </>
  );
};

export default WishListPage;