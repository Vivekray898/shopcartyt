import CategoryProducts from "@/components/CategoryProducts";
import Container from "@/components/Container";
import Title from "@/components/Title";
import { getCategories } from "@/sanity/queries";
// 🚀 FIXED: Imported your Category type definition from Sanity Typegen maps
import { Category } from "@/sanity.types"; 
import React from "react";

const CategoryPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const categories = await getCategories();
  const { slug } = await params;

  // 🚀 FIXED: Explicitly typed '(cat: Category)' to satisfy strict compiler configurations
  const currentCategory = categories?.find(
    (cat: Category) => cat?.slug?.current === slug
  );

  return (
    <div className="border-t min-h-screen bg-slate-50/30 py-6 md:py-10">
      <Container>
        
        {/* 🌟 PREMIUM HEADER CARD CONTAINER */}
        <div className="mb-6 bg-white p-4 md:p-6 rounded-2xl border border-slate-100 shadow-2xs">
          <div className="space-y-1">
            <Title className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Department Catalogue
            </Title>
            <h1 className="text-xl font-black text-slate-900 tracking-tight sm:text-2xl">
              Products by Category:{" "}
              <span className="text-shop_dark_green font-black capitalize">
                {/* Displays "Garten & Pflanzen" cleanly instead of "Garten-Pflanzen" */}
                {currentCategory ? currentCategory.title : slug?.replace(/-/g, " ")}
              </span>
            </h1>
          </div>
        </div>

        {/* 🎨 MODERN SITE RESPONSIVE LAYOUT FRAMEWORK
            This controls the structural behavior so everything sits beautifully on mobile and desktop */}
        <div className="w-full bg-white p-4 md:p-6 rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          {/* Injects your category options and products layout into an encapsulated, responsive grid space */}
          <div className="w-full max-w-full overflow-hidden">
            <CategoryProducts categories={categories} slug={slug} />
          </div>
        </div>

      </Container>
    </div>
  );
};

export default CategoryPage;