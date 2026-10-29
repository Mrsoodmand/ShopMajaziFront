"use client";
import Link from "next/link";
import { TrendingUp, ArrowRight } from "lucide-react";
import { catOf, products } from "@/content/products-en";
import { useMoney } from "@/lib/money";
import { Badge, BuyButton, Delivery, Price, Rating } from "./parts";

// Offer B — "Top 5 Chart": a big card for the #1 best-seller beside a numbered chart of #2–#6, ranked by sales this week.
export default function PopB() {
  const usd = useMoney().format;
  const ranked = [...products].sort((a, b) => b.sold - a.sold).slice(0, 6);
  const [top, ...rest] = ranked;
  const max = top.sold;

  return (
    <section className="bg-[#F5F6FB] py-24 dark:bg-[#070B14]">
      <div className="mx-auto max-w-6xl px-6">
        <span className="text-sm font-semibold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">Popular now</span>
        <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl dark:text-white">This week's top sellers</h2>

        <div className="mt-12 grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
          <div className="relative flex flex-col overflow-hidden rounded-[2rem] bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-500 p-8 text-white">
            <div aria-hidden className="absolute -end-10 -top-10 h-48 w-48 rounded-full bg-white/15 blur-2xl" />
            <span className="relative font-display text-7xl font-bold leading-none text-white/25">#1</span>
            <span className="relative mt-6 grid h-14 w-14 place-items-center rounded-2xl bg-white/20 backdrop-blur"><top.icon className="h-7 w-7" /></span>
            <h3 className="relative mt-5 font-display text-2xl font-semibold">{top.name}</h3>
            <p className="relative mt-1 text-white/80">{top.desc} · {catOf(top.cat)}</p>
            <div className="relative mt-6 flex items-baseline gap-2">
              <span className="font-display text-4xl font-bold">{usd(top.price)}</span>
              {top.oldPrice && <span className="text-white/60 line-through">{usd(top.oldPrice)}</span>}
            </div>
            <div className="relative mt-auto flex items-center justify-between gap-4 pt-8">
              <span className="flex items-center gap-1.5 text-sm text-white/80"><TrendingUp className="h-4 w-4" />{top.sold.toLocaleString("en-US")} sold this week</span>
              <Link href={top.href} className="group flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-indigo-700">Buy now<ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5 rtl:rotate-180" /></Link>
            </div>
          </div>

          <ol className="space-y-3">
            {rest.map((p, i) => (
              <li key={p.id} className="group flex items-center gap-4 rounded-2xl bg-white p-4 ring-1 ring-slate-200 transition duration-300 hover:ring-indigo-300 dark:bg-[#0E1424] dark:ring-white/10 dark:hover:ring-indigo-400/50">
                <span className="w-8 text-center font-display text-2xl font-bold text-slate-300 dark:text-slate-600">{i + 2}</span>
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300"><p.icon className="h-5 w-5" /></span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2"><span className="truncate font-semibold text-slate-900 dark:text-white">{p.name}</span><Badge p={p} /></div>
                  <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1"><Rating p={p} /><Delivery p={p} /></div>
                  <div className="mt-2 h-1 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10"><div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-fuchsia-500" style={{ width: `${(p.sold / max) * 100}%` }} /></div>
                </div>
                <div className="hidden text-end sm:block"><Price p={p} /></div>
                <BuyButton p={p} label="Buy" />
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
