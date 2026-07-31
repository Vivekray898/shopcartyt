"use client";

import { MapPin, MessageCircle, ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";

const StorePickupAction = () => {
  const [whatsappHref, setWhatsappHref] = useState<string>("#");

  useEffect(() => {
    const currentUrl = window.location.href;
    const message = `Hallo! Ich interessiere mich für dieses Produkt: ${currentUrl}`;
    setWhatsappHref(`https://wa.me/4917632853448?text=${encodeURIComponent(message)}`);
  }, []);

  return (
    <div className="border-t border-b border-slate-100 py-6 my-2">
      {/* Oberer Kontext-Beschreibungsbereich */}
      <div className="flex items-center gap-2 mb-4">
        <MapPin className="h-4 w-4 text-emerald-600 animate-pulse" />
        <p className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50/60 px-2.5 py-1 rounded-md">
          Verfügbar zur Abholung im Geschäft
        </p>
      </div>

      {/* Hauptstruktur-Layout-Interaktionsraster */}
      <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
        
        {/* Primäre Aktions-Hub: WhatsApp-Bestandsprüfung */}
        <a
          href={whatsappHref}
          target="_blank"
          rel="noreferrer"
          className="flex-1 inline-flex items-center justify-center gap-2 min-h-[48px] w-full rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white transition-all hover:bg-emerald-700 shadow-sm shadow-emerald-600/10 hover:shadow-md"
        >
          <MessageCircle className="w-4 h-4 fill-white" />
          Per Chat Bestand prüfen
        </a>

        {/* Zusätzliche Karten-Ankerblöcke */}
        <div className="flex items-center gap-2 w-full sm:w-auto flex-1 sm:flex-initial">
          <a
            href="https://maps.app.goo.gl/XiFRN5dq61wbTx1B9"
            target="_blank"
            rel="noreferrer"
            className="flex-1 sm:flex-initial inline-flex min-h-[48px] items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300"
          >
            <span>Hauptfiliale</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>

          <a
            href="https://maps.app.goo.gl/pUz5FKUb1dMPx5Uj8"
            target="_blank"
            rel="noreferrer"
            className="flex-1 sm:flex-initial inline-flex min-h-[48px] items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300"
          >
            <span>Filiale Zwei</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>
        </div>

      </div>
    </div>
  );
};

export default StorePickupAction;