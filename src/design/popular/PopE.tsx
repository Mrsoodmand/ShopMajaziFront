"use client";
import { useState } from "react";
import Link from "next/link";
import { Search, ArrowRight } from "lucide-react";
import { productCats, products } from "@/content/products-en";
import { useMoney } from "@/lib/money";
import { Badge } from "./parts";

// Offer E — "Price Board": a dense, scannable price list grouped by category, with a quick filter, a live
// "in stock" dot, rating, delivery time and price on every row. Good for returning customers who know what they want.
export default function PopE() {
  const usd = useMoney().format;
  const [q, setQ] = useState("");
  const t = q.trim().toLowerCase();
  const groups = productCats
    .map((c) => ({ ...c, items: products.filter((p) => p.cat === c.id && (!t || `${p.name} ${p.desc}`.toLowerCase().includes(t))) }))
    .filter((g) => g.items.length);

  return (
    <section className="bg-[#F6F5F1] py-24 dark:bg-[#070B14]">
      <div className="mx-auto max-w-5xl px-6">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <span className="text-sm font-semibold uppercase tracking-widest text-violet-600 dark:text-violet-400">Popular now</span>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl dark:text-white">Today's prices</h2>
          </div>
          <label className="relative w-full sm:w-72">
            <Search className="pointer-events-none absolute start-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Filter products…" aria-label="Filter products"
              className="h-11 w-full rounded-xl border border-slate-200 bg-white ps-11 pe-4 text-sm outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:ring-violet-500/20" />
          </label>
        </div>

        <div className="mt-10 overflow-hidden rounded-3xl bg-white ring-1 ring-slate-200 dark:bg-[#0E1424] dark:ring-white/10">
          {groups.length === 0 && <div className="p-10 text-center text-sm text-slate-500 dark:text-slate-400">Nothing matches “{q}”.</div>}
          {groups.map((g) => (
            <div key={g.id}>
              <div className="border-b border-slate-100 bg-slate-50 px-6 py-2.5 text-xs font-semibold uppercase tracking-widest text-slate-500 dark:border-white/10 dark:bg-white/[.03] dark:text-slate-400">{g.label}</div>
              <ul className="divide-y divide-slate-100 dark:divide-white/5">
                {g.items.map((p) => (
                  <li key={p.id}>
                    <Link href={p.href} className="group grid grid-cols-[auto_1fr_auto] items-center gap-4 px-6 py-4 transition duration-300 hover:bg-violet-50/50 sm:grid-cols-[auto_1fr_140px_110px_auto] dark:hover:bg-white/[.03]">
                      <span className="relative flex h-2.5 w-2.5" title="In stock">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                        <span className="relative h-2.5 w-2.5 rounded-full bg-emerald-500" />
                      </span>
                      <span className="min-w-0">
                        <span className="flex items-center gap-2"><span className="truncate font-medium text-slate-900 dark:text-white">{p.name}</span><Badge p={p} /></span>
                        <span className="block truncate text-xs text-slate-500 dark:text-slate-400">{p.desc}</span>
                      </span>
                      <span className="hidden text-xs text-slate-500 sm:block dark:text-slate-400">★ {p.rating} · {p.delivery}</span>
                      <span className="hidden text-end sm:block">
                        <span className="font-display text-lg font-bold text-slate-900 dark:text-white">{usd(p.price)}</span>
                        {p.oldPrice && <span className="ms-1.5 text-xs text-slate-400 line-through">{usd(p.oldPrice)}</span>}
                      </span>
                      <span className="flex items-center gap-2">
                        <span className="font-display font-bold text-slate-900 sm:hidden dark:text-white">{usd(p.price)}</span>
                        <span className="grid h-9 w-9 place-items-center rounded-full ring-1 ring-slate-200 transition duration-300 group-hover:bg-violet-600 group-hover:text-white group-hover:ring-violet-600 dark:ring-white/15 dark:text-slate-300"><ArrowRight className="h-4 w-4 rtl:rotate-180" /></span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
