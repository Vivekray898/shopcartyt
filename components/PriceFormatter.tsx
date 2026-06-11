import { twMerge } from "tailwind-merge";

interface Props {
  amount: number | undefined;
  className?: string;
}

const PriceFormatter = ({ amount, className }: Props) => {
  // 1. Check if the price is missing, null, or explicitly 0
  const isZeroOrInvalid = amount === undefined || amount === null || amount === 0;

  // 2. Format using Euro currency guidelines with European-friendly rendering layouts
  const formattedPrice = !isZeroOrInvalid
    ? new Number(amount).toLocaleString("en-IE", {
        currency: "EUR",
        style: "currency",
        minimumFractionDigits: 2,
      })
    : "";

  return (
    <span
      className={twMerge(
        "text-sm font-semibold text-darkColor",
        isZeroOrInvalid && "text-slate-500 italic font-medium", // Soft styling for showroom fallback text
        className
      )}
    >
      {isZeroOrInvalid ? "Price on Request" : formattedPrice}
    </span>
  );
};

export default PriceFormatter;