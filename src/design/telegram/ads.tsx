"use client";
import type { ReactNode } from "react";
import { Eye, MousePointerClick, ShieldCheck } from "lucide-react";
import { useMoney } from "@/lib/money";
import { adRules, adSteps, estClicks, fmt } from "@/content/telegram-en";
import { accent, card, SumRows, type AdsState } from "./parts";
import { useT } from "@/i18n/client";

// Pieces used only by the Ads offers.

export function Estimate({ a, dark = false, big = false }: { a: AdsState; dark?: boolean; big?: boolean }) {
  const usd = useMoney().format;
  const tx = useT();
  const [lo, hi] = estClicks(a.views);
  const box = dark ? "rounded-2xl bg-white/10 p-4" : "rounded-2xl bg-sky-50 p-4 dark:bg-sky-400/10";
  const label = dark ? "text-white/75" : "text-slate-600 dark:text-slate-400";
  const val = `font-display font-bold ${big ? "text-3xl sm:text-4xl" : "text-2xl"} ${dark ? "text-white" : "text-slate-900 dark:text-white"}`;
  return (
    <div aria-live="polite" className="grid grid-cols-2 gap-3">
      <div className={box}><div className={`flex items-center gap-1.5 text-sm ${label}`}><Eye aria-hidden className="h-4 w-4" />{tx("Views")}</div><div className={val}>~{fmt(a.views)}</div></div>
      <div className={box}><div className={`flex items-center gap-1.5 text-sm ${label}`}><MousePointerClick aria-hidden className="h-4 w-4" />{tx("Clicks")}</div><div className={val}>{fmt(lo)}–{fmt(hi)}</div></div>
      <p className={`col-span-2 text-xs ${label}`}>{tx("Estimate at about")}{" "}{usd(a.cpm)}{" "}{tx("per 1,000 views. Real results depend on your text and targeting.")}</p>
    </div>
  );
}

export function AdSummary({ a, children }: { a: AdsState; children?: ReactNode }) {
  const usd = useMoney().format;
  const tx = useT();
  const t = a.f.target === "topics" ? (a.f.topics.length ? a.f.topics.join(", ") : "—") : a.f.target === "channels" ? `${a.f.channels.split(/[\n,]+/).filter((x) => x.trim()).length} channels` : `${a.f.country} · ${a.f.language}`;
  return (
    <section aria-labelledby="ad-sum" className={`${card} p-6`}>
      <h2 id="ad-sum" className="font-display text-lg font-semibold text-slate-900 dark:text-white">{tx("Campaign")}</h2>
      <div className="mt-3"><SumRows rows={[[tx("Link"), a.f.link || "—"], [tx("Audience"), t], [tx("Review"), tx("About 24 hours")]]} /></div>
      <div aria-live="polite" className="mt-3 flex items-baseline justify-between border-t border-slate-200 pt-4 dark:border-white/10"><span className="text-slate-600 dark:text-slate-400">{tx("Budget")}</span><span className="font-display text-2xl font-bold text-slate-900 dark:text-white">{usd(a.f.budget || 0)}</span></div>
      {children}
    </section>
  );
}

export const SubmitAd = ({ a, className = "", label }: { a: AdsState; className?: string; label?: string }) => {
  const usd = useMoney().format;
  const tx = useT();
  return (
  <button type="button" onClick={a.proceed} className={`${tx.tr(accent).ads.btn} w-full ${className}`}>{label ?? tx("Pay {0} and submit", { 0: usd(a.f.budget || 0) })}</button>
);
};

export function HowItWorks({ dark = false }: { dark?: boolean }) {
  const tx = useT();
  return (
    <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {tx.tr(adSteps).map((s, i) => (
        <li key={s.title} className={dark ? "rounded-3xl border border-white/10 bg-white/5 p-5" : `${card} p-5`}>
          <span aria-hidden className={`grid h-9 w-9 place-items-center rounded-full font-display font-bold ${dark ? "bg-white text-sky-700" : "bg-sky-600 text-white dark:bg-sky-500 dark:text-sky-950"}`}>{i + 1}</span>
          <h3 className={`mt-4 font-semibold ${dark ? "text-white" : "text-slate-900 dark:text-white"}`}>{s.title}</h3>
          <p className={`mt-1 text-[15px] ${dark ? "text-white/70" : "text-slate-600 dark:text-slate-400"}`}>{s.text}</p>
        </li>
      ))}
    </ol>
  );
}

export function Rules() {
  const tx = useT();
  return (
    <div className="rounded-3xl border border-amber-300 bg-amber-50 p-5 dark:border-amber-400/30 dark:bg-amber-400/5">
      <h3 className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white"><ShieldCheck aria-hidden className="h-5 w-5 text-amber-700 dark:text-amber-300" />{tx("Telegram's ad rules")}</h3>
      <ul className="mt-3 space-y-1.5 text-[15px] text-slate-700 dark:text-slate-300">{tx.tr(adRules).map((r) => <li key={r} className="flex gap-2"><span aria-hidden>·</span>{r}</li>)}</ul>
    </div>
  );
}
