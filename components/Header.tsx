import React from "react";
import Container from "./Container";
import Logo from "./Logo";
import HeaderMenu from "./HeaderMenu";
import SearchBar from "./SearchBar";
import CartIcon from "./CartIcon";
import FavoriteButton from "./FavoriteButton";
import SignIn from "./SignIn";
import MobileMenu from "./MobileMenu";
import { auth, currentUser } from "@clerk/nextjs/server";
import { ClerkLoaded, SignedIn, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { Logs } from "lucide-react";
import Image from "next/image";
import { getHeaderSettings, getMyOrders } from "@/sanity/queries";
import { urlFor } from "@/sanity/lib/image";

const Header = async () => {
  const user = await currentUser();
  const { userId } = await auth();
  let orders = null;
  if (userId) {
    orders = await getMyOrders(userId);
  }

  const headerSettings = await getHeaderSettings();
  const headerLogo = headerSettings?.logo;
  const callToAction = headerSettings?.callToAction;

  return (
    <header className="sticky top-0 z-50 py-5 bg-white/70 backdrop-blur-md">
      <Container className="flex items-center justify-between text-lightColor">
        <div className="w-auto md:w-1/3 flex items-center gap-2.5 justify-start md:gap-0">
          <MobileMenu />
          {headerLogo ? (
            <Link href="/" className="inline-flex items-center">
              <Image
                src={urlFor(headerLogo).width(160).height(40).url()}
                alt="Site logo"
                width={160}
                height={40}
                className="object-contain"
              />
            </Link>
          ) : (
            <Logo />
          )}
        </div>
        <HeaderMenu />
        <div className="w-auto md:w-1/3 flex items-center justify-end gap-5">
          {/* FIXED: Swapped out legacy .label and .href keys for Sanity's .text and .url shapes */}
          {callToAction?.text && callToAction?.url && (
            <Link
              href={callToAction.url}
              className="hidden md:inline-flex rounded-full bg-shop_light_green px-4 py-2 text-white font-semibold hover:bg-shop_dark_green hoverEffect"
            >
              {callToAction.text}
            </Link>
          )}
          <SearchBar />
          <CartIcon />
          <FavoriteButton />

          {user && (
            <Link
              href={"/orders"}
              className="group relative hover:text-shop_light_green hoverEffect"
            >
              <Logs />
              <span className="absolute -top-1 -right-1 bg-shop_btn_dark_green text-white h-3.5 w-3.5 rounded-full text-xs font-semibold flex items-center justify-center">
                {orders?.length ? orders?.length : 0}
              </span>
            </Link>
          )}

          <ClerkLoaded>
            <SignedIn>
              <UserButton />
            </SignedIn>
            {!user && <SignIn />}
          </ClerkLoaded>
        </div>
      </Container>
    </header>
  );
};

export default Header;