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
  isCatalogueMode?: boolean; // Neue operative Umschalt-Eigenschaft
}

const ProductCharacteristics = ({ productName, variant, stock, brandName, isCatalogueMode = true }: Props) => {
  const isAvailable = stock !== undefined && stock > 0;

  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="characteristics" className="border-b-0">
        <AccordionTrigger className="py-2 text-sm font-bold uppercase tracking-wider text-slate-800 hover:no-underline">
          Eigenschaften
        </AccordionTrigger>
        <AccordionContent className="pt-1 pb-3 space-y-2 text-sm text-slate-600">
          
          <p className="flex items-center justify-between border-b border-slate-100 pb-1.5">
            <span className="font-medium text-slate-500">Shop-Filiale:</span>{" "}
            <span className="font-bold text-slate-900">
              {brandName || "Hauptlager"}
            </span>
          </p>

          <p className="flex items-center justify-between border-b border-slate-100 pb-1.5">
            <span className="font-medium text-slate-500">Kollektion:</span>{" "}
            <span className="font-bold text-slate-900">2026</span>
          </p>

          <p className="flex items-center justify-between border-b border-slate-100 pb-1.5">
            <span className="font-medium text-slate-500">Typ:</span>{" "}
            <span className="font-bold text-slate-900">
              {variant || "Standard-Artikel"}
            </span>
          </p>

          <p className="flex items-center justify-between">
            <span className="font-medium text-slate-500">Lagerstatus:</span>{" "}
            {/* FIXED: Wechselt die Abfragen bedingt, wenn die Website als Produktkatalog fungiert */}
            <span className={`font-bold ${isCatalogueMode || isAvailable ? "text-emerald-600" : "text-rose-600"}`}>
              {isCatalogueMode 
                ? "Auf Bestellung verfügbar" 
                : isAvailable 
                  ? `Auf Lager (${stock})` 
                  : "Nicht auf Lager"
              }
            </span>
          </p>

        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default ProductCharacteristics;