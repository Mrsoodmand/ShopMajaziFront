"use client";
import { useId, useState, type ReactNode } from "react";
import { Check, ChevronDown, Info } from "lucide-react";
import { MoneyProvider, useMoney } from "@/lib/money";
import { LocaleProvider, useT } from "@/i18n/client";
import type { SubProduct } from "@/content/subs-en";
import { ActivationBadge, PopularBadge, Tile } from "./parts";
import { planTones, PLAN_TONE } from "./planSelect";
import { field, primary } from "../googleVoice/clean";

// Where the admin's «نکات کنار سفارش» (admin › اکانت‌ها › notes) show on a live subscription page. Today panel J
// draws none of them: only the delivery-time note reaches the header, and only when «زمان تحویل» is empty.
// Gallery section "subs-notes" shows each placement on a copy of panel J with notes like the real ones. Notes the
// header already says (delivery time, «نوع فعال‌سازی») are left out in every offer.
// rows (A): label/value rows in a tinted box under the name. chips (B): small pills under the name.
// checklist (C): check lines between the total and Continue. card (D): its own card under the panel.
// fold (E): «جزئیات سرویس», closed, under the plans.
type Style = "rows" | "chips" | "checklist" | "card" | "fold";

const product: SubProduct = {
  slug: "chatgpt-plus", name: "ChatGPT Plus", cat: "ai", letter: "G", color: "bg-[#10A37F]", tagline: "", activation: "own",
  delivery: "حدود ۱ ساعت", plans: [], fields: [], notes: [],
};
const plans = [
  { id: "1", name: "۱ ماهه", price: 2_150_000 },
  { id: "3", name: "۳ ماهه", price: 6_090_000, popular: true },
  { id: "12", name: "۱۲ ماهه", price: 23_400_000 },
];
const notes = [
  { label: "اطلاعات لازم", value: "ایمیل و رمز حساب ChatGPT" },
  { label: "مدت اشتراک", value: "۱، ۳ و ۱۲ ماهه" },
  { label: "پلن‌ها", value: "Plus و Pro" },
];

function Rows({ dense = false, rows = notes }: { dense?: boolean; rows?: { label: string; value: string }[] }) {
  return (
    <dl className={`divide-y divide-slate-200 text-sm dark:divide-white/10 ${dense ? "" : "rounded-xl bg-slate-50 px-3 dark:bg-white/5"}`}>
      {rows.map((n) => (
        <div key={n.label} className="flex items-baseline justify-between gap-3 py-2">
          <dt className="shrink-0 text-slate-500 dark:text-slate-400">{n.label}</dt>
          <dd className="min-w-0 text-end font-medium text-slate-800 dark:text-slate-200">{n.value}</dd>
        </div>
      ))}
    </dl>
  );
}

function Chips() {
  return (
    <ul className="flex flex-wrap gap-1.5">
      {notes.map((n) => (
        <li key={n.label} className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-700 dark:border-white/15 dark:bg-white/5 dark:text-slate-300">
          <span className="text-slate-500 dark:text-slate-400">{n.label}:</span> <span className="font-medium">{n.value}</span>
        </li>
      ))}
    </ul>
  );
}

function Checklist() {
  return (
    <ul className="space-y-1.5 text-sm text-slate-700 dark:text-slate-300">
      {notes.map((n) => (
        <li key={n.label} className="flex gap-2">
          <Check aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" strokeWidth={2.5} />
          <span><span className="text-slate-500 dark:text-slate-400">{n.label}:</span> {n.value}</span>
        </li>
      ))}
    </ul>
  );
}

function Fold() {
  return (
    <details className="group rounded-xl border border-slate-200 dark:border-white/15">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-3 py-2.5 text-sm font-semibold text-slate-800 dark:text-slate-200 [&::-webkit-details-marker]:hidden">
        <span className="inline-flex items-center gap-1.5"><Info aria-hidden className="h-4 w-4 text-slate-500" />جزئیات سرویس</span>
        <ChevronDown aria-hidden className="h-4 w-4 text-slate-500 transition-transform group-open:rotate-180" />
      </summary>
      <div className="border-t border-slate-200 px-3 dark:border-white/10"><Rows dense /></div>
    </details>
  );
}

function Panel({ style }: { style: Style }) {
  const t = useT();
  const usd = useMoney().format;
  const name = useId();
  const [picked, setPicked] = useState("3");
  const tone = planTones[PLAN_TONE];
  const plan = plans.find((p) => p.id === picked)!;
  const slot = (where: Style, node: ReactNode) => (style === where ? node : null);
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2.5">
        <Tile p={product} size="sm" />
        <div className="min-w-0 flex-1">
          <h2 className="font-display text-base font-bold leading-tight text-slate-900 dark:text-white">{product.name}</h2>
          <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-600 dark:text-slate-400"><ActivationBadge p={product} />{product.delivery}</p>
        </div>
      </div>
      {slot("rows", <Rows />)}
      {slot("chips", <Chips />)}
      <fieldset>
        <legend className="text-sm font-semibold text-slate-900 dark:text-white">{t("Plan")}</legend>
        <div className="mt-2 space-y-1.5">
          {plans.map((pl) => {
            const on = picked === pl.id;
            return (
              <label key={pl.id} className={`relative flex min-h-10 cursor-pointer items-center justify-between gap-3 rounded-lg border px-3 py-2 text-sm transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-violet-600 ${on ? tone.row : "border-slate-200 text-slate-700 hover:border-slate-400 dark:border-white/15 dark:text-slate-300 dark:hover:border-white/40"}`}>
                <input type="radio" name={name} checked={on} onChange={() => setPicked(pl.id)} className="sr-only" />
                <span className="flex min-w-0 items-center gap-2"><span className="truncate font-semibold">{pl.name}</span>{pl.popular && <PopularBadge on={on && tone.fill} />}</span>
                <span className={`whitespace-nowrap tabular-nums ${on ? tone.price : "text-slate-500 dark:text-slate-400"}`}>{usd(pl.price)}</span>
              </label>
            );
          })}
        </div>
      </fieldset>
      {slot("fold", <Fold />)}
      <label className="block">
        <span className="text-sm font-semibold text-slate-900 dark:text-white">ایمیل حساب ChatGPT شما</span>
        <input type="email" dir="ltr" placeholder="you@example.com" className={`${field} mt-1.5 py-2.5 text-[15px]`} />
      </label>
      <div className="flex items-baseline justify-between gap-3 border-t border-dashed border-slate-300 pt-2 text-sm dark:border-white/15">
        <span className="font-semibold text-slate-900 dark:text-white">{t("Total")}</span>
        <span className="font-display text-lg font-bold tabular-nums text-slate-900 dark:text-white">{usd(plan.price)}</span>
      </div>
      {slot("checklist", <Checklist />)}
      <button type="button" className={`${primary} w-full !py-3`}>{t("Continue")}</button>
    </div>
  );
}

// Picked: D (decisions.json › subs-notes). The live card under the buy box on the product page (subSingle/SingleD).
export function OrderNotes({ p, className = "" }: { p: SubProduct; className?: string }) {
  const t = useT();
  const id = useId();
  if (!p.specs?.length) return null;
  return (
    <section aria-labelledby={id} className={`rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/15 dark:bg-[#0E1424] ${className}`}>
      <h2 id={id} className="mb-1 text-sm font-bold text-slate-900 dark:text-white">{t("Good to know before you buy")}</h2>
      <Rows dense rows={p.specs} />
    </section>
  );
}

function Demo({ style }: { style: Style }) {
  const box = "rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/15 dark:bg-[#0E1424]";
  return (
    <div className="mx-auto w-full max-w-sm space-y-4">
      <section className={box}><Panel style={style} /></section>
      {style === "card" && <OrderNotes p={{ ...product, specs: notes }} />}
    </div>
  );
}

const Fa = ({ style }: { style: Style }) => <LocaleProvider locale="fa"><div dir="rtl"><MoneyProvider currency="toman"><Demo style={style} /></MoneyProvider></div></LocaleProvider>;
export const NotesRows = () => <Fa style="rows" />;
export const NotesChips = () => <Fa style="chips" />;
export const NotesChecklist = () => <Fa style="checklist" />;
export const NotesCard = () => <Fa style="card" />;
export const NotesFold = () => <Fa style="fold" />;
