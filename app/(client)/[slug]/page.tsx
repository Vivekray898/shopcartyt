import { client } from "@/sanity/lib/client";
import { notFound } from "next/navigation";
import React from "react";
import Container from "@/components/Container";

// Import your custom block UI view components
import HomeBanner from "@/components/HomeBanner"; 
import ProductCard from "@/components/ProductCard";
import { PortableText } from "next-sanity";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function DynamicNoCodePage({ params }: Props) {
  const { slug } = await params;

  // Fetch the page document layout structure dynamically from Sanity matching the slug URL
  const pageQuery = `*[_type == "page" && slug.current == $slug][0]{
    title,
    pageBuilder[] {
      ...,
      products[]->{
        ...,
        "brand": brand->{title},
        "variant": variant->{title}
      }
    }
  }`;

  const pageData = await client.fetch(pageQuery, { slug }, { next: { revalidate: 60 } });

  // If no document exists matching this URL pathway slug, drop into Next.js 404 page bounds
  if (!pageData) return notFound();

  return (
    <div className="py-10 space-y-16">
      {pageData.pageBuilder?.map((block: any, index: number) => {
        // Map over section content objects rendering matching UI blocks
        switch (block._type) {
          
          case "heroBlock":
            // Reuse your existing banner/hero styling structure cleanly
            return (
              <HomeBanner 
                key={index}
                banner={{
                  _id: index.toString(),
                  headline: block.heading,
                  bannerImage: block.image,
                  targetUrl: block.ctaLink || "/shop",
                  buttonText: block.ctaText,
                }} 
              />
            );

          case "productGridBlock":
            return (
              <Container key={index} className="flex flex-col">
                <h2 className="text-xl font-bold mb-6 text-slate-800 tracking-tight border-b pb-2">{block.title}</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {block.products?.map((product: any) => (
                    <ProductCard key={product._id} product={product} isCatalogueMode={true} />
                  ))}
                </div>
              </Container>
            );

          case "textContentBlock":
            return (
              <Container key={index} className="max-w-3xl prose prose-slate">
                {block.title && <h2 className="text-2xl font-bold text-slate-900 mb-4">{block.title}</h2>}
                <div className="text-slate-600 leading-relaxed text-sm">
                  <PortableText value={block.content} />
                </div>
              </Container>
            );

          default:
            return null;
        }
      })}
    </div>
  );
}