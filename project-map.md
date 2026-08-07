# Astro Project Map

Generated: 8/7/2026, 10:45:26 PM

## Statistics

- **Folders:** 0
- **Files:** 0
- **Size:** 8.42 MB

---

## Folder Structure

```
fun
├── actions
│   └── createCheckoutSession.ts
├── app
│   ├── (client)
│   │   ├── [slug]
│   │   │   └── page.tsx
│   │   ├── api
│   │   │   └── webhook
│   │   │       └── route.ts
│   │   ├── blog
│   │   │   ├── [slug]
│   │   │   │   └── page.tsx
│   │   │   └── page.tsx
│   │   ├── brand
│   │   │   └── [slug]
│   │   │       └── page.tsx
│   │   ├── cart
│   │   │   └── page.tsx
│   │   ├── category
│   │   │   └── [slug]
│   │   │       └── page.tsx
│   │   ├── contact
│   │   │   ├── ContactClient.tsx
│   │   │   └── page.tsx
│   │   ├── deal
│   │   │   └── page.tsx
│   │   ├── orders
│   │   │   └── page.tsx
│   │   ├── product
│   │   │   └── [slug]
│   │   │       └── page.tsx
│   │   ├── shop
│   │   │   └── page.tsx
│   │   ├── success
│   │   │   └── page.tsx
│   │   ├── videos
│   │   │   ├── loading.tsx
│   │   │   └── page.tsx
│   │   ├── wishlist
│   │   │   └── page.tsx
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── api
│   │   └── contact
│   │       └── route.ts
│   ├── studio
│   │   └── [[...tool]]
│   │       └── page.tsx
│   ├── apple-icon.png
│   ├── favicon.ico
│   ├── globals.css
│   ├── icon0.svg
│   ├── icon1.png
│   ├── layout.tsx
│   ├── manifest.json
│   ├── not-found.tsx
│   ├── robots.ts
│   └── sitemap.ts
├── components
│   ├── builder
│   │   ├── AccordionSection.tsx
│   │   ├── CTASection.tsx
│   │   ├── GallerySection.tsx
│   │   └── ServiceDetail.tsx
│   ├── shop
│   │   ├── BrandList.tsx
│   │   ├── CategoryList.tsx
│   │   └── PriceList.tsx
│   ├── ui
│   │   ├── accordion.tsx
│   │   ├── badge.tsx
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── carousel.tsx
│   │   ├── checkbox.tsx
│   │   ├── collapsible.tsx
│   │   ├── command.tsx
│   │   ├── dialog.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── popover.tsx
│   │   ├── radio-group.tsx
│   │   ├── scroll-area.tsx
│   │   ├── separator.tsx
│   │   ├── table.tsx
│   │   ├── text.tsx
│   │   ├── textarea.tsx
│   │   └── tooltip.tsx
│   ├── AddToCartButton.tsx
│   ├── AutoTranslator.tsx
│   ├── BulkEditor.tsx
│   ├── CartIcon.tsx
│   ├── CategoryProducts.tsx
│   ├── Container.tsx
│   ├── EmptyCart.tsx
│   ├── FavoriteButton.tsx
│   ├── FloatingWhatsApp.tsx
│   ├── Footer.tsx
│   ├── FooterTop.tsx
│   ├── Header.tsx
│   ├── HeaderMenu.tsx
│   ├── HomeBanner.tsx
│   ├── HomeCategories.tsx
│   ├── HomeTabbar.tsx
│   ├── ImageView.tsx
│   ├── LatestBlog.tsx
│   ├── Logo.tsx
│   ├── MobileMenu.tsx
│   ├── NoAccess.tsx
│   ├── NoProductAvailable.tsx
│   ├── OrderDetailDialog.tsx
│   ├── OrdersComponent.tsx
│   ├── PriceFormatter.tsx
│   ├── PriceView.tsx
│   ├── ProductCard.tsx
│   ├── ProductCardAction.tsx
│   ├── ProductCharacteristics.tsx
│   ├── ProductGrid.tsx
│   ├── ProductPurchaseAction.tsx
│   ├── ProductShareButton.tsx
│   ├── ProductSideMenu.tsx
│   ├── QuantityButtons.tsx
│   ├── RecentlyViewed.tsx
│   ├── RelatedProducts.tsx
│   ├── SearchBar.tsx
│   ├── Shop.tsx
│   ├── ShopByBrands.tsx
│   ├── SideMenu.tsx
│   ├── SignIn.tsx
│   ├── SocialMedia.tsx
│   ├── StorePickupAction.tsx
│   ├── Title.tsx
│   └── WishListProducts.tsx
├── constants
│   └── data.ts
├── hooks
│   ├── index.ts
│   ├── useDebounce.ts
│   ├── useShopMode.tsx
│   └── useSiteSettings.ts
├── lib
│   ├── metadata.ts
│   ├── stripe.ts
│   └── utils.ts
├── public
│   ├── images
│   │   ├── banner
│   │   │   └── banner_1.png
│   │   ├── brands
│   │   │   └── brand_1.webp
│   │   ├── products
│   │   │   └── product_23.png
│   │   ├── emptyCart.png
│   │   ├── index.ts
│   │   ├── payment.png
│   │   └── paypalLogo.png
│   └── social
│       ├── web-app-manifest-192x192.png
│       └── web-app-manifest-512x512.png
├── sanity
│   ├── lib
│   │   ├── backendClient.ts
│   │   ├── client.ts
│   │   ├── image.ts
│   │   └── live.ts
│   ├── queries
│   │   ├── index.ts
│   │   └── query.ts
│   ├── schemaTypes
│   │   ├── addressType.ts
│   │   ├── authorType.ts
│   │   ├── bannerType.ts
│   │   ├── blockContentType.ts
│   │   ├── blogCategoryType.ts
│   │   ├── blogType.ts
│   │   ├── brandTypes.ts
│   │   ├── categoryType.ts
│   │   ├── contactPageType.ts
│   │   ├── contactSubmission.ts
│   │   ├── footerSettingsType.ts
│   │   ├── headerSettingsType.ts
│   │   ├── index.ts
│   │   ├── orderType.ts
│   │   ├── pageBlocks.ts
│   │   ├── pageType.ts
│   │   ├── productType.ts
│   │   ├── productVariant.ts
│   │   └── siteSettingsType.ts
│   ├── env.ts
│   └── structure.ts
├── scripts
│   └── import-woocommerce-products.js
├── .gitignore
├── components.json
├── eslint.config.mjs
├── middleware.ts
├── next-env.d.ts
├── next.config.ts
├── package.json
├── pnpm-workspace.yaml
├── postcss.config.mjs
├── README.md
├── sanity.cli.ts
├── sanity.config.ts
├── seed.tar.gz
├── store.ts
├── tsconfig.json
└── tsconfig.tsbuildinfo

```
