import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";

interface Props {
  productName: string | undefined;
  variant: string | undefined;
  stock: number | undefined;
  brandName?: string;
  isCatalogueMode?: boolean; // New operational toggle property
}

const ProductCharacteristics = ({ productName, variant, stock, brandName, isCatalogueMode = true }: Props) => {
  const isAvailable = stock !== undefined && stock > 0;

  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="characteristics" className="border-b-0">
        <AccordionTrigger className="py-2 text-sm font-bold uppercase tracking-wider text-slate-800 hover:no-underline">
          Characteristics
        </AccordionTrigger>
        <AccordionContent className="pt-1 pb-3 space-y-2 text-sm text-slate-600">
          
          <p className="flex items-center justify-between border-b border-slate-100 pb-1.5">
            <span className="font-medium text-slate-500">Shop Outlet:</span>{" "}
            <span className="font-bold text-slate-900">
              {brandName || "Main Warehouse"}
            </span>
          </p>

          <p className="flex items-center justify-between border-b border-slate-100 pb-1.5">
            <span className="font-medium text-slate-500">Collection:</span>{" "}
            <span className="font-bold text-slate-900">2026</span>
          </p>

          <p className="flex items-center justify-between border-b border-slate-100 pb-1.5">
            <span className="font-medium text-slate-500">Type:</span>{" "}
            <span className="font-bold text-slate-900">
              {variant || "Standard Item"}
            </span>
          </p>

          <p className="flex items-center justify-between">
            <span className="font-medium text-slate-500">Stock Status:</span>{" "}
            {/* FIXED: Switches lookups conditionally if the site acts as a product showcase catalog */}
            <span className={`font-bold ${isCatalogueMode || isAvailable ? "text-emerald-600" : "text-rose-600"}`}>
              {isCatalogueMode 
                ? "Available on Order" 
                : isAvailable 
                  ? `In Stock (${stock})` 
                  : "Out of Stock"
              }
            </span>
          </p>

        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default ProductCharacteristics;