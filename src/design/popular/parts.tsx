"use client";
import Link from "next/link";
import { Star, Zap, ShoppingCart, Flame, Sparkles, Tag } from "lucide-react";
import { type Product } from "@/content/products-en";
import { useMoney } from "@/lib/money";

// Pieces shared by the Popular products offers.

const badgeLooks: Record<NonNullable<Product["badge"]>, { cls: string; icon: typeof Flame }> = {
  "Best seller": { cls: "bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-300", icon: Flame },
  New: { cls: "bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300", icon: Sparkles },
  Deal: { cls: "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300", icon: Tag },
};

export function Badge({ p }: { p: Product }) {
  if (!p.badge) return null;
  const { cls, icon: Icon } = badgeLooks[p.badge];
  return <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${cls}`}><Icon className="h-3 w-3" />{p.badge}</span>;
}

export function Price({ p, size = "md" }: { p: Product; size?: "md" | "lg" }) {
  const usd = useMoney().format;
  const off = p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : 0;
  return (
    <div className="flex items-baseline gap-2">
      <span className={`font-display font-bold text-slate-900 dark:text-white ${size === "lg" ? "text-4xl" : "text-2xl"}`}>{usd(p.price)}</span>
      {p.oldPrice && <span className="text-sm text-slate-400 line-through">{usd(p.oldPrice)}</span>}
      {off > 0 && <span className="rounded-md bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">−{off}%</span>}
    </div>
  );
}

export function Rating({ p }: { p: Product }) {
  return (
    <span className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" /><span className="font-semibold text-slate-700 dark:text-slate-200">{p.rating}</span>
      <span aria-hidden>·</span>{p.sold.toLocaleString("en-US")} sold this week
    </span>
  );
}

export function Delivery({ p }: { p: Product }) {
  return <span className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400"><Zap className="h-3.5 w-3.5 text-amber-500" />{p.delivery}</span>;
}

export function BuyButton({ p, label = "Buy now", full = false }: { p: Product; label?: string; full?: boolean }) {
  return (
    <Link href={p.href} className={`group/buy inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition duration-300 hover:bg-indigo-600 dark:bg-white dark:text-slate-900 dark:hover:bg-indigo-400 dark:hover:text-white ${full ? "w-full" : ""}`}>
      <ShoppingCart className="h-4 w-4 transition duration-300 group-hover/buy:-rotate-12" />{label}
    </Link>
  );
}

export function ProductCard({ p }: { p: Product }) {
  return (
    <div className="group flex flex-col rounded-3xl bg-white p-5 ring-1 ring-slate-200 transition duration-300 ease-out hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-100 dark:bg-[#0E1424] dark:ring-white/10 dark:hover:shadow-black/40 motion-reduce:hover:translate-y-0">
      <div className="flex items-start justify-between">
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-indigo-50 text-indigo-600 transition duration-300 group-hover:scale-105 dark:bg-indigo-500/15 dark:text-indigo-300"><p.icon className="h-6 w-6" /></span>
        <Badge p={p} />
      </div>
      <h3 className="mt-4 font-display font-semibold leading-snug text-slate-900 dark:text-white">{p.name}</h3>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{p.desc}</p>
      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1"><Rating p={p} /></div>
      <div className="mt-auto pt-5">
        <div className="flex items-end justify-between gap-3"><Price p={p} /><Delivery p={p} /></div>
        <div className="mt-4"><BuyButton p={p} full /></div>
      </div>
    </div>
  );
}

export function Heading({ kicker, title, action }: { kicker: string; title: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-6">
      <div className="max-w-2xl">
        <span className="text-sm font-semibold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">{kicker}</span>
        <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl dark:text-white">{title}</h2>
      </div>
      {action}
    </div>
  );
}
