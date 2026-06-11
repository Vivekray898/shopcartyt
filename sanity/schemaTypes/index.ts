import { type SchemaTypeDefinition } from "sanity";
import { categoryType } from "./categoryType";
import { blockContentType } from "./blockContentType";
import { productType } from "./productType";
import { orderType } from "./orderType";
import { brandType } from "./brandTypes";
import { blogType } from "./blogType";
import { blogCategoryType } from "./blogCategoryType";
import { authorType } from "./authorType";
import { addressType } from "./addressType";
import { siteSettingsType } from "./siteSettingsType";
import { headerSettingsType } from "./headerSettingsType";
import { footerSettingsType } from "./footerSettingsType";
import { productVariantType } from "./productVariant"; 
import { bannerType } from "./bannerType"; 

// 1. IMPORT NO-CODE PAGE BUILDER SCHEMAS
import { pageType } from "./pageType";
import { heroBlock, productGridBlock, textContentBlock } from "./pageBlocks";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    // Core Commerce
    productType,
    productVariantType,
    categoryType,
    brandType,
    orderType,
    addressType,

    // Content & Marketing
    blogType,
    blogCategoryType,
    authorType,
    bannerType,

    // 2. REGISTER THE NO-CODE BUILDER FILES NATIVELY
    pageType,
    heroBlock,
    productGridBlock,
    textContentBlock,

    // Site Configuration
    siteSettingsType,
    headerSettingsType,
    footerSettingsType,

    // Utility
    blockContentType,
  ],
};