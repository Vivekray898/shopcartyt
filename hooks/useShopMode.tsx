"use client";

import { createContext, useContext } from "react";

type ShopModeContextValue = {
  catalogueMode: boolean;
};

const ShopModeContext = createContext<ShopModeContextValue>({
  catalogueMode: false,
});

export const ShopModeProvider = ({
  catalogueMode,
  children,
}: {
  catalogueMode: boolean;
  children: React.ReactNode;
}) => {
  return (
    <ShopModeContext.Provider value={{ catalogueMode }}>
      {children}
    </ShopModeContext.Provider>
  );
};

export const useShopMode = () => useContext(ShopModeContext);
