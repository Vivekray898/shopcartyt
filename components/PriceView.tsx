import React from "react";
import PriceFormatter from "./PriceFormatter";

interface Props {
  price: number | undefined;
  discount: number | undefined;
  className?: string;
}

const PriceView = ({ price, discount, className }: Props) => {
  // If price is missing or 0, fallback to clean typography without strikethroughs
  const hasPrice = price !== undefined && price > 0;

  return (
    <div className="flex items-center gap-2">
      {/* Target Price Row */}
      <PriceFormatter amount={price} className={className} />

      {/* Conditionally render historical price strings ONLY if an active price tag exists */}
      {hasPrice && discount !== undefined && discount > 0 && (
        <PriceFormatter
          amount={price + discount}
          className="text-xs font-normal text-slate-400 line-through"
        />
      )}
    </div>
  );
};

export default PriceView;