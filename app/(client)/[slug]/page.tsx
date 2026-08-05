import { client } from "@/sanity/lib/client";
import { notFound } from "next/navigation";
import React from "react";
import Container from "@/components/Container";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { PortableText } from "next-sanity";

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
                    <PortableText value={block.content} />
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