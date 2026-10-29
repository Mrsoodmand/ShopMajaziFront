"use client";
import Link from "@/i18n/Link";
import { Check, ChevronRight, KeyRound, Lock, RotateCcw, UserCheck, Zap } from "lucide-react";
import { useMoney } from "@/lib/money";
import { fromPrice, savePct, subCats, subs, type SubProduct } from "@/content/subs-en";
import { ring } from "../googleVoice/clean";
import { panels } from "../subs/panels";
import { ActivationBadge, Tile, type Subs } from "../subs/parts";
import { useT } from "@/i18n/client";

// Pieces shared by the single-subscription page offers (/accounts/{slug}): breadcrumb, buy box (uses the chosen
// product panel), what you get, how it's delivered, plan table, related subscriptions.

export const DEFAULT_SLUG = "chatgpt-plus";

export function Crumbs({ p, light = false }: { p: SubProduct; light?: boolean }) {
  const tx = useT();
  const a = `rounded font-medium underline-offset-4 hover:underline ${light ? "text-white/85 hover:text-white" : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"} ${ring}`;
  return (
    <nav aria-label={tx("Breadcrumb")}>
      <ol className={`flex flex-wrap items-center gap-1.5 text-sm ${light ? "text-white/60" : "text-slate-500"}`}>
        <li><Link href="/" className={a}>{tx("Home")}</Link></li><ChevronRight aria-hidden className="h-3.5 w-3.5 rtl:rotate-180" />
        <li><Link href="/accounts" className={a}>{tx("Subscriptions")}</Link></li><ChevronRight aria-hidden className="h-3.5 w-3.5 rtl:rotate-180" />
        <li><span aria-current="page" className={`font-semibold ${light ? "text-white" : "text-slate-900 dark:text-white"}`}>{p.name}</span></li>
      </ol>
    </nav>
  );
}

// The buy box: the chosen product panel (plans, field, Continue) in a card.
export function BuyBox({ s, panel = "A", className = "" }: { s: Subs; panel?: string; className?: string }) {
  const tx = useT();
  const Panel = panels[panel] ?? panels.A;
  return (
    <section aria-label={tx("Buy {0}", { 0: s.product!.name })} className={`rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/15 dark:bg-[#0E1424] ${className}`}>
      <Panel s={s} />
    </section>
  );
}

export function H2({ id, children }: { id: string; children: React.ReactNode }) {
  return <h2 id={id} className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-white">{children}</h2>;
}

export function WhatYouGet({ p }: { p: SubProduct }) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {[p.tagline, ...p.notes].map((t) => (
        <li key={t} className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-[15px] text-slate-800 dark:border-white/15 dark:bg-[#0E1424] dark:text-slate-200">
          <span aria-hidden className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-violet-100 text-violet-800 dark:bg-violet-500/15 dark:text-violet-300"><Check className="h-3.5 w-3.5" strokeWidth={3} /></span>{t}
        </li>
      ))}
    </ul>
  );
}

// How the plan reaches you, depending on "own account" or "ready account".
export function HowDelivered({ p }: { p: SubProduct }) {
  const tx = useT();
  const own = p.activation === "own";
  const field = p.fields.find((f) => !f.options);
  const steps = own
    ? [{ t: tx("You tell us your account"), d: field ? field.label : tx("Your account email") }, { t: tx("We activate the plan"), d: p.delivery }, { t: tx("Open {0}", { 0: p.name }), d: tx("The plan is on your account") }]
    : [{ t: tx("You pay"), d: tx("Wallet, card or crypto") }, { t: tx("We send the login"), d: p.delivery }, { t: tx("Sign in"), d: tx("Copy it from your order page") }];
  const Icon = own ? UserCheck : KeyRound;
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-white/15 dark:bg-[#0E1424]">
      <p className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white"><Icon aria-hidden className="h-5 w-5 text-violet-700 dark:text-violet-400" />{own ? tx("Activated on your own account") : tx("Delivered as a ready account")}</p>
      <ol className="mt-5 grid gap-4 sm:grid-cols-3">
        {steps.map((st, i) => (
          <li key={st.t} className="flex gap-3">
            <span aria-hidden className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-slate-900 text-sm font-bold text-white dark:bg-white dark:text-slate-900">{i + 1}</span>
            <span><span className="block font-semibold text-slate-900 dark:text-white">{st.t}</span><span className="text-sm text-slate-600 dark:text-slate-400">{st.d}</span></span>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function PlanTable({ p }: { p: SubProduct }) {
  const usd = useMoney().format;
  const tx = useT();
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-300 dark:border-white/15">
      <table className="w-full min-w-[420px] text-[15px]">
        <caption className="sr-only">{tx("{0} plans compared", { 0: p.name })}</caption>
        <thead className="bg-slate-50 dark:bg-white/5">
          <tr>{[tx("Plan"), tx("Per month"), tx("Total"), tx("Saving")].map((h) => <th key={h} scope="col" className="px-4 py-3 text-start font-semibold text-slate-900 dark:text-white">{h}</th>)}</tr>
        </thead>
        <tbody className="divide-y divide-slate-200 dark:divide-white/10">
          {p.plans.map((pl) => (
            <tr key={pl.id}>
              <th scope="row" className="px-4 py-3 text-start font-medium text-slate-900 dark:text-white">{pl.name}</th>
              <td className="px-4 py-3 text-slate-800 dark:text-slate-200">{usd(pl.price / pl.months)}</td>
              <td className="px-4 py-3 text-slate-800 dark:text-slate-200">{usd(pl.price)}{pl.was && <span className="ms-2 text-sm text-slate-500 line-through"><span className="sr-only">{tx("was")}{" "}</span>{usd(pl.was)}</span>}</td>
              <td className="px-4 py-3">{savePct(pl) > 0 ? <span className="font-semibold text-amber-800 dark:text-amber-300">{savePct(pl)}%</span> : <span className="text-slate-500">—</span>}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Trust({ p, className = "" }: { p: SubProduct; className?: string }) {
  const tx = useT();
  return (
    <ul className={`flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-700 dark:text-slate-300 ${className}`}>
      <li className="flex items-center gap-1.5"><Zap aria-hidden className="h-4 w-4 text-amber-600 dark:text-amber-400" />{p.delivery}</li>
      <li className="flex items-center gap-1.5"><Lock aria-hidden className="h-4 w-4 text-violet-700 dark:text-violet-400" />{p.activation === "own" ? tx("No password needed") : tx("Secure delivery")}</li>
      <li className="flex items-center gap-1.5"><RotateCcw aria-hidden className="h-4 w-4 text-emerald-700 dark:text-emerald-400" />{tx("Fixed, replaced or refunded")}</li>
    </ul>
  );
}

// Other subscriptions in the same category (then popular ones), linking to their pages.
export function Related({ p }: { p: SubProduct }) {
  const usd = useMoney().format;
  const tx = useT();
  const list = [...tx.tr(subs).filter((x) => x.cat === p.cat && x.slug !== p.slug), ...tx.tr(subs).filter((x) => x.popular && x.cat !== p.cat && x.slug !== p.slug)].slice(0, 4);
  const cat = tx.tr(subCats).find((c) => c.id === p.cat)!.label;
  return (
    <section aria-labelledby="related">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <H2 id="related">{tx("More in")}{" "}{cat}</H2>
        <Link href="/accounts" className={`rounded-lg text-sm font-semibold text-violet-800 underline-offset-4 hover:underline dark:text-violet-300 ${ring}`}>{tx("All subscriptions")}</Link>
      </div>
      <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {list.map((x) => (
          <li key={x.slug}>
            <Link href={`/accounts/${x.slug}`} className={`flex h-full items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-violet-400 dark:border-white/15 dark:bg-[#0E1424] ${ring}`}>
              <Tile p={x} size="sm" />
              <span className="min-w-0"><span className="block truncate font-semibold text-slate-900 dark:text-white">{x.name}</span><span className="text-sm text-slate-600 dark:text-slate-400">{tx("from")}{" "}{usd(fromPrice(x))}{tx("/mo")}</span></span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function TitleBlock({ p, as = "h1", center = false }: { p: SubProduct; as?: "h1" | "h2"; center?: boolean }) {
  const usd = useMoney().format;
  const tx = useT();
  const H = as;
  return (
    <div className={center ? "text-center" : ""}>
      <div className={`flex items-center gap-4 ${center ? "justify-center" : ""}`}>
        <Tile p={p} size="lg" />
        <div className="text-start">
          <H className="font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">{p.name}</H>
          <p className="mt-1.5"><ActivationBadge p={p} /></p>
        </div>
      </div>
      <p className={`mt-4 max-w-2xl text-lg leading-relaxed text-slate-700 dark:text-slate-300 ${center ? "mx-auto" : ""}`}>{p.tagline}{tx(". From")}{" "}{usd(fromPrice(p))}{" "}{tx("a month.")}</p>
    </div>
  );
}
