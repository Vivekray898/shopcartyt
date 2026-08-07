// app/(client)/[slug]/page.tsx
import { client } from "@/sanity/lib/client";
import { notFound } from "next/navigation";
import React from "react";
import Container from "@/components/Container";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { PortableText } from "next-sanity";
import type { PortableTextBlock } from "@portabletext/types";

// Import existing components
import HomeBanner from "@/components/HomeBanner";
import ProductCard from "@/components/ProductCard";
import CategoryProducts from "@/components/CategoryProducts";
import ShopByBrands from "@/components/ShopByBrands";
import LatestBlog from "@/components/LatestBlog";
import Title from "@/components/Title";
import HomeCategories from "@/components/HomeCategories";

// Import new components
import ServiceDetail from "@/components/builder/ServiceDetail";
import CTASection from "@/components/builder/CTASection";
import AccordionSection from "@/components/builder/AccordionSection";
import GallerySection from "@/components/builder/GallerySection";

// Custom Portable Text serializers for better rendering
const portableTextComponents = {
  block: {
    // Normal paragraph
    normal: ({ children }: { children: React.ReactNode }) => (
      <p className="text-base md:text-lg leading-relaxed text-slate-700 mb-4">{children}</p>
    ),
    // Heading styles
    h1: ({ children }: { children: React.ReactNode }) => (
      <h1 className="text-3xl md:text-5xl font-bold text-primary mb-6">{children}</h1>
    ),
    h2: ({ children }: { children: React.ReactNode }) => (
      <h2 className="text-2xl md:text-4xl font-bold text-primary mb-5">{children}</h2>
    ),
    h3: ({ children }: { children: React.ReactNode }) => (
      <h3 className="text-xl md:text-3xl font-semibold text-primary mb-4">{children}</h3>
    ),
    h4: ({ children }: { children: React.ReactNode }) => (
      <h4 className="text-lg md:text-2xl font-semibold text-primary mb-3">{children}</h4>
    ),
    // Blockquote
    blockquote: ({ children }: { children: React.ReactNode }) => (
      <blockquote className="border-l-4 border-shop_light_green pl-4 my-4 italic text-slate-600">
        {children}
      </blockquote>
    ),
  },
  marks: {
    // Bold
    strong: ({ children }: { children: React.ReactNode }) => (
      <strong className="font-bold text-primary">{children}</strong>
    ),
    // Italic
    em: ({ children }: { children: React.ReactNode }) => (
      <em className="italic text-slate-600">{children}</em>
    ),
    // Underline
    underline: ({ children }: { children: React.ReactNode }) => (
      <span className="underline">{children}</span>
    ),
    // Strike-through
    strike: ({ children }: { children: React.ReactNode }) => (
      <span className="line-through">{children}</span>
    ),
    // Code
    code: ({ children }: { children: React.ReactNode }) => (
      <code className="bg-slate-100 px-1.5 py-0.5 rounded text-sm font-mono text-primary">
        {children}
      </code>
    ),
    // Links
    link: ({ children, value }: { children: React.ReactNode; value: { href?: string } }) => {
      const rel = !value.href?.startsWith("/") ? "noreferrer noopener" : undefined;
      return (
        <a
          href={value.href || "#"}
          rel={rel}
          className="text-shop_light_green hover:text-shop_light_green/80 underline transition-colors duration-200"
          target={rel ? "_blank" : undefined}
        >
          {children}
        </a>
      );
    },
    // Internal link (optional)
    internalLink: ({ children, value }: { children: React.ReactNode; value: { slug?: { current: string } } }) => {
      return (
        <a
          href={`/${value.slug?.current || "#"}`}
          className="text-shop_light_green hover:text-shop_light_green/80 underline transition-colors duration-200"
        >
          {children}
        </a>
      );
    },
  },
  list: {
    bullet: ({ children }: { children: React.ReactNode }) => (
      <ul className="list-disc pl-6 my-4 space-y-2 text-slate-700">{children}</ul>
    ),
    number: ({ children }: { children: React.ReactNode }) => (
      <ol className="list-decimal pl-6 my-4 space-y-2 text-slate-700">{children}</ol>
    ),
    checkmarks: ({ children }: { children: React.ReactNode }) => (
      <ul className="space-y-2 my-4">{children}</ul>
    ),
  },
  listItem: {
    bullet: ({ children }: { children: React.ReactNode }) => (
      <li className="text-base leading-relaxed">{children}</li>
    ),
    number: ({ children }: { children: React.ReactNode }) => (
      <li className="text-base leading-relaxed">{children}</li>
    ),
    checkmarks: ({ children }: { children: React.ReactNode }) => (
      <li className="flex items-start gap-2 text-base leading-relaxed">
        <span className="text-shop_light_green mt-1">✓</span>
        <span>{children}</span>
      </li>
    ),
  },
  types: {
    image: ({ value }: { value: any }) => {
      if (!value?.asset) return null;
      return (
        <div className="my-6 rounded-xl overflow-hidden shadow-lg">
          <Image
            src={urlFor(value).url()}
            alt={value.alt || "Image"}
            width={1200}
            height={800}
            className="w-full h-auto object-cover"
          />
        </div>
      );
    },
    // Custom code block
    code: ({ value }: { value: { code: string; language?: string } }) => {
      if (!value?.code) return null;
      return (
        <pre className="bg-slate-900 text-white p-4 rounded-xl my-4 overflow-x-auto">
          {value.language && (
            <div className="text-xs text-slate-400 mb-2">{value.language}</div>
          )}
          <code className="text-sm font-mono">{value.code}</code>
        </pre>
      );
    },
  },
};

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function DynamicNoCodePage({ params }: Props) {
  const { slug } = await params;

  const pageQuery = `*[_type == "page" && slug.current == $slug][0]{
    title,
    pageBuilder[] {
      ...,
      products[]->{
        ...,
        "brand": brand->{title},
        "variant": variant->{title}
      },
      categories[]->{
        ...,
        "products": *[_type == "product" && references(^._id)]{...}
      },
      brands[]->{...},
      posts[]->{
        ...,
        "author": author->{name, image},
        "category": category->{title}
      },
      images[]{
        ...,
        asset->
      }
    }
  }`;

  const pageData = await client.fetch(
    pageQuery,
    { slug },
    { next: { revalidate: 60 } }
  );

  if (!pageData) return notFound();

  return (
    <div className="page-content">
      {pageData.pageBuilder?.map((block: any, index: number) => {
        switch (block._type) {
          case "heroBlock":
            return (
              <HomeBanner
                key={index}
                banners={[
                  {
                    _id: index.toString(),
                    headline: block.heading,
                    subheading: block.subheading,
                    desktopImage: block.image,
                    mobileImage: block.image,
                    targetUrl: block.ctaLink || "/shop",
                    buttonText: block.ctaText,
                  },
                ]}
              />
            );

          case "productGridBlock":
            return (
              <Container key={index} className="xl:pt-22.5 pt-10 xl:pb-30 pb-10">
                <div className="section-content">
                  <Title
                    title={block.title}
                    subheading={block.subtitle || ""}
                    className="mb-10"
                  />
                  <div 
                    className={`grid gap-6 grid-cols-2 md:grid-cols-${block.gridColumns || 4}`}
                  >
                    {block.products?.map((product: any) => (
                      <ProductCard
                        key={product._id}
                        product={product}
                        isCatalogueMode={true}
                      />
                    ))}
                  </div>
                  {block.showViewAll && (
                    <div className="text-center mt-12">
                      <a
                        href="/shop"
                        className="inline-flex items-center px-8 py-3 bg-primary text-white rounded-full hover:bg-primary/90 transition duration-300"
                      >
                        View All Products
                        <i className="fas fa-arrow-right ml-2"></i>
                      </a>
                    </div>
                  )}
                </div>
              </Container>
            );

          case "textContentBlock":
            return (
              <Container key={index} className="xl:pt-15 pt-8 xl:pb-20 pb-10">
                <div className={`max-w-4xl mx-auto ${
                  block.layout === "centered" ? "text-center" : ""
                } ${
                  block.layout === "bordered" ? "border border-gray-200 rounded-3xl p-8 md:p-12" : ""
                }`}>
                  {block.title && (
                    <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">
                      {block.title}
                    </h2>
                  )}
                  <div className="text-primary leading-relaxed prose prose-lg max-w-none">
                    <PortableText 
                      value={block.content} 
                      components={portableTextComponents}
                    />
                  </div>
                </div>
              </Container>
            );

          case "serviceDetailBlock":
            return (
              <Container key={index} className="xl:pt-22.5 pt-10 xl:pb-30 pb-10">
                <ServiceDetail
                  title={block.title}
                  description={block.description}
                  images={block.images}
                  features={block.features}
                  serviceTypes={block.serviceTypes}
                  faqs={block.faqs}
                  amenities={block.amenities}
                />
              </Container>
            );

          case "blogPostsBlock":
            return (
              <Container key={index} className="xl:pt-22.5 pt-10 xl:pb-30 pb-10">
                <Title
                  title={block.title}
                  subheading={block.subtitle || ""}
                  className="mb-10"
                />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {block.posts?.map((post: any) => (
                    <LatestBlog key={post._id} post={post} />
                  ))}
                </div>
                {block.showAllLink && (
                  <div className="text-center mt-12">
                    <a
                      href={block.showAllLink}
                      className="inline-flex items-center px-8 py-3 bg-primary text-white rounded-full hover:bg-primary/90 transition duration-300"
                    >
                      View All Posts
                      <i className="fas fa-arrow-right ml-2"></i>
                    </a>
                  </div>
                )}
              </Container>
            );

          case "categoryGridBlock":
            return (
              <Container key={index} className="xl:pt-22.5 pt-10 xl:pb-30 pb-10">
                <Title title={block.title} className="mb-10" />
                <HomeCategories categories={block.categories || []} />
              </Container>
            );

          case "brandShowcaseBlock":
            return (
              <Container key={index} className="xl:pt-22.5 pt-10 xl:pb-30 pb-10">
                <Title title={block.title} className="mb-10" />
                <ShopByBrands brandData={block.brands || []} />
              </Container>
            );

          case "ctaBlock":
            return (
              <CTASection
                key={index}
                title={block.title}
                subtitle={block.subtitle}
                ctaText={block.ctaText}
                ctaLink={block.ctaLink}
                backgroundImage={block.backgroundImage}
              />
            );

          case "accordionBlock":
            return (
              <Container key={index} className="xl:pt-15 pt-8 xl:pb-20 pb-10">
                {block.title && (
                  <Title title={block.title} className="mb-8" />
                )}
                <AccordionSection
                  items={block.items || []}
                  style={block.style}
                />
              </Container>
            );

          case "galleryBlock":
            return (
              <Container key={index} className="xl:pt-15 pt-8 xl:pb-20 pb-10">
                {block.title && (
                  <Title title={block.title} className="mb-8" />
                )}
                <GallerySection
                  images={block.images || []}
                  columns={block.columns || 3}
                />
              </Container>
            );

          default:
            return null;
        }
      })}
    </div>
  );
}