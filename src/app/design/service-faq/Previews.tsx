"use client";

import { useState } from "react";
import ChooseButton from "@/components/design/ChooseButton";
import { LocaleProvider } from "@/i18n/client";
import type { Locale } from "@/i18n/config";
import { ExtrasSlot } from "@/design/service/slot";
import type { GlowTone } from "@/design/service/HeaderGlow";
import { ServiceFaq } from "@/design/service/ServiceExtras";
import { faqOffers } from "@/design/service/faqOffers";

// Which page's questions and colour to show the offers with.
const pages: { id: string; label: string; glow?: GlowTone }[] = [
  { id: "virtual-number", label: "Virtual number", glow: "violet" },
  { id: "google-voice", label: "Google Voice", glow: "sky" },
  { id: "telegram-stars", label: "Telegram Stars", glow: "amber" },
  { id: "apple-id", label: "Apple ID" },
];

export default function Previews({ chosen }: { chosen: string }) {
  const [page, setPage] = useState(pages[0]);
  const [lang, setLang] = useState<Locale>("fa");
  const all = [{ id: "current", name: "Current", note: "Heading and support card on the side, question cards beside them.", C: ServiceFaq }, ...faqOffers];
  return (
    <ExtrasSlot extras={null} glow={page.glow}>
      <nav dir="ltr" className="sticky top-[49px] z-40 flex flex-wrap items-center justify-center gap-2 border-b border-slate-200 bg-white/90 px-6 py-3 backdrop-blur dark:border-white/10 dark:bg-[#070B14]/90">
        {all.map((o) => <a key={o.id} href={`#offer-${o.id}`} className="rounded-full bg-slate-100 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-200 dark:bg-white/5 dark:text-slate-300">{o.id === "current" ? "Current" : `${o.id} · ${o.name}`}</a>)}
        <span className="mx-2 h-5 w-px bg-slate-300 dark:bg-white/15" />
        {(["fa", "en"] as const).map((l) => (
          <button key={l} onClick={() => setLang(l)} className={`rounded-full px-3 py-1.5 text-sm ${l === lang ? "bg-emerald-600 text-white" : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-white/5"}`}>{l === "fa" ? "فارسی" : "English"}</button>
        ))}
        <span className="mx-2 h-5 w-px bg-slate-300 dark:bg-white/15" />
        {pages.map((p) => (
          <button key={p.id} onClick={() => setPage(p)} className={`rounded-full px-3 py-1.5 text-sm ${p.id === page.id ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900" : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-white/5"}`}>{p.label}</button>
        ))}
      </nav>
      {all.map(({ id, name, note, C }) => (
        <div key={id} id={`offer-${id}`} className="scroll-mt-28 border-b border-slate-200 py-16 dark:border-white/10">
          <div dir="ltr" className="mx-auto mb-10 flex max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
            <p className="text-sm text-slate-600 dark:text-slate-400"><b className="text-slate-900 dark:text-white">{id === "current" ? "Current" : `${id} · ${name}`}</b> — {note}</p>
            {id !== "current" && <div className="rounded-full bg-slate-900 p-0.5"><ChooseButton section="service-faq" offer={id} chosen={chosen === id} /></div>}
          </div>
          <LocaleProvider locale={lang}><div dir={lang === "fa" ? "rtl" : "ltr"} lang={lang}><C key={page.id + lang} service={page.id} /></div></LocaleProvider>
        </div>
      ))}
    </ExtrasSlot>
  );
}
