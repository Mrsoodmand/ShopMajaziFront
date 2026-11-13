"use client";

import { useEffect, useState } from "react";
import { Check, Zap } from "lucide-react";
import { useT } from "@/i18n/client";
import { BigNumber, Glossy, card, pageBg, reason, stat, useInView } from "./parts";

// Offer J — "Number Mosaic": the heading lives inside the grid as its own tile, and big blue numbers share the
// mosaic with the reasons. One tile shows a short feed of orders landing (delivered / refunded), a new line
// sliding in every few seconds. Numbers count up when the section comes into view.
const FEED = [
  { what: "Telegram Premium · 3 months", ok: true },
  { what: "Virtual number · WhatsApp", ok: true },
  { what: "Apple ID · USA", ok: true },
  { what: "Virtual number · Instagram", ok: false },
  { what: "Google Voice", ok: true },
  { what: "Telegram Stars · 500", ok: true },
];

function Feed() {
  const t = useT();
  const [head, setHead] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setHead((h) => (h + 1) % FEED.length), 2600);
    return () => clearInterval(id);
  }, []);
  const rows = [0, 1, 2].map((k) => FEED[(head + k) % FEED.length]);
  return (
    <ul className="mt-5 space-y-2">
      {rows.map((r, k) => (
        <li key={`${head}-${k}`} className={`flex items-center gap-3 rounded-2xl bg-slate-50 p-3 dark:bg-white/5 ${k === 0 ? "animate-[why-in_.5s_ease-out]" : ""}`} style={{ opacity: 1 - k * 0.25 }}>
          <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-white ${r.ok ? "bg-emerald-500" : "bg-amber-500"}`}>{r.ok ? <Check className="h-4 w-4" /> : <span className="text-xs font-bold">↺</span>}</span>
          <span className="flex-1 truncate text-sm text-slate-700 dark:text-slate-200">{t(r.what)}</span>
          <span className={`text-xs font-semibold ${r.ok ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"}`}>{t(r.ok ? "Delivered" : "Refunded")}</span>
        </li>
      ))}
    </ul>
  );
}

export default function WhyJ() {
  const t = useT();
  const [ref, seen] = useInView();
  const Small = ({ id }: { id: string }) => {
    const r = reason(id);
    return (
      <div className={`${card} p-7`}>
        <Glossy icon={r.icon} tone={r.tone} size={52} />
        <h3 className="mt-5 font-display text-lg font-bold text-slate-900 dark:text-white">{t(r.title)}</h3>
        <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">{t(r.desc)}</p>
      </div>
    );
  };
  const Num = ({ id, sub }: { id: Parameters<typeof stat>[0]; sub: string }) => (
    <div className={`${card} flex flex-col items-center justify-center p-8 text-center`}>
      <BigNumber s={stat(id)} run={seen} className="text-5xl text-blue-600 dark:text-blue-400" />
      <span className="mt-4 font-display text-lg font-bold text-slate-900 dark:text-white">{t(stat(id).label)}</span>
      <span className="mt-1 text-sm text-slate-500 dark:text-slate-400">{t(sub)}</span>
    </div>
  );

  return (
    <section className={`${pageBg} py-24`}>
      <div ref={ref} className="mx-auto grid max-w-6xl gap-4 px-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Heading tile */}
        <div className={`${card} flex flex-col justify-center p-8 lg:row-span-2`}>
          <span className="text-5xl" aria-hidden>😎</span>
          <span className="mt-6 text-sm font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400">{t("Why ShopMajazi")}</span>
          <h2 className="mt-3 font-display text-3xl font-black leading-tight tracking-tight text-slate-900 sm:text-4xl dark:text-white">{t("Buy with confidence")}</h2>
          <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-400">{t("Fast, safe and simple: the digital services you need, without a foreign card.")}</p>
          <div className="mt-8 flex items-center gap-3 rounded-2xl bg-blue-600 p-4 text-white">
            <Zap className="h-5 w-5 shrink-0 fill-white" />
            <span className="text-sm font-medium">{t("Most orders are delivered automatically, day or night, with no waiting for an operator.")}</span>
          </div>
        </div>

        <Num id="orders" sub="and counting" />
        <Small id="pay" />

        <div className={`${card} p-7 md:col-span-2 lg:col-span-1`}>
          <div className="flex items-center gap-3">
            <span className="relative flex h-2.5 w-2.5"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70 motion-reduce:hidden" /><span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" /></span>
            <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">{t("Every order ends one of two ways")}</h3>
          </div>
          <Feed />
          <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">{t("A failed order is refunded on its own.")}</p>
        </div>
        <Small id="support" />

        <Small id="private" />
        <Num id="speed" sub="from payment to delivery" />
        <Small id="catalog" />
      </div>
    </section>
  );
}
