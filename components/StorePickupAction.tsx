"use client";

import { MapPin } from "lucide-react";
import { useEffect, useState } from "react";

const StorePickupAction = () => {
  const [whatsappHref, setWhatsappHref] = useState<string>("#");

  useEffect(() => {
    const currentUrl = window.location.href;
    const message = `Hi! I am interested in this product: ${currentUrl}`;
    setWhatsappHref(`https://wa.me/4917632853448?text=${encodeURIComponent(message)}`);
  }, []);

  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/30">
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
            <MapPin className="h-5 w-5" />
          </span>
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-slate-500">
            Available For In-Store Pickup
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <a
          href="https://maps.app.goo.gl/XiFRN5dq61wbTx1B9"
          target="_blank"
          rel="noreferrer"
          className="inline-flex min-h-[56px] items-center justify-center rounded-3xl border border-slate-300 bg-slate-950 px-5 py-4 text-sm font-semibold text-white transition hover:border-slate-400 hover:bg-slate-800"
        >
          Locate at Main Branch
        </a>

        <a
          href="https://maps.app.goo.gl/pUz5FKUb1dMPx5Uj8"
          target="_blank"
          rel="noreferrer"
          className="inline-flex min-h-[56px] items-center justify-center rounded-3xl border border-slate-300 bg-slate-950 px-5 py-4 text-sm font-semibold text-white transition hover:border-slate-400 hover:bg-slate-800"
        >
          Locate at Branch Two
        </a>
      </div>

      <a
        href={whatsappHref}
        target="_blank"
        rel="noreferrer"
        className="mt-5 inline-flex w-full items-center justify-center rounded-3xl bg-emerald-600 px-5 py-4 text-sm font-semibold text-white transition hover:bg-emerald-700"
      >
        Chat with Us to Check Stock
      </a>
    </section>
  );
};

export default StorePickupAction;
