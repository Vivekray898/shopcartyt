// sanity/schemaTypes/index.ts

import { type SchemaTypeDefinition } from "sanity";

// Import all your types
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
import contactSubmission from "./contactSubmission";

// Page builder imports
import { pageType } from "./pageType";
import { 
  heroBlock, 
  productGridBlock, 
  textContentBlock,
  serviceDetailBlock,
  blogPostsBlock,
  categoryGridBlock,
  brandShowcaseBlock,
  ctaBlock,
  accordionBlock,
  galleryBlock
} from "./pageBlocks";
import { contactPageType } from "./contactPageType";

// Export as array (preferred for newer Sanity versions)
export const schemaTypes = [
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

  // Page Builder - Core
  pageType,
  heroBlock,
  productGridBlock,
  textContentBlock,
  
  // Page Builder - New Blocks
  serviceDetailBlock,
  blogPostsBlock,
  categoryGridBlock,
  brandShowcaseBlock,
  ctaBlock,
  accordionBlock,
  galleryBlock,

  // Site Configuration
  siteSettingsType,
  headerSettingsType,
  footerSettingsType,

  // Utility & Forms
  blockContentType,
  contactPageType,
  contactSubmission,
];

// If you need the SchemaTypeDefinition format (older versions)
export const schema: { types: SchemaTypeDefinition[] } = {
  types: schemaTypes,
};