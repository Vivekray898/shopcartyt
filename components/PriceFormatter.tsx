import { twMerge } from "tailwind-merge";

interface Props {
  amount: number | undefined;
  className?: string;
}

const PriceFormatter = ({ amount, className }: Props) => {
  // 1. Prüfen, ob der Preis fehlt, null oder explizit 0 ist
  const isZeroOrInvalid = amount === undefined || amount === null || amount === 0;

  // 2. Formatierung nach Euro-Währungsrichtlinien mit europäisch-freundlichem Rendering-Layout
  const formattedPrice = !isZeroOrInvalid
    ? new Number(amount).toLocaleString("de-DE", {
        currency: "EUR",
        style: "currency",
        minimumFractionDigits: 2,
      })
    : "";

  return (
    <span
      className={twMerge(
        "text-sm font-semibold text-darkColor",
        isZeroOrInvalid && "text-slate-500 italic font-medium", // Sanfte Gestaltung für Showroom-Fallback-Text
        className
      )}
    >
      {isZeroOrInvalid ? "Preis auf Anfrage" : formattedPrice}
    </span>
  );
};

export default PriceFormatter;