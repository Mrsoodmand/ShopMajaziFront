"use client";

import { useEffect, useState } from "react";
import { Timer } from "lucide-react";
import { catOf, products } from "@/content/products-en";
import { BuyButton, Delivery, Heading, Price, ProductCard, Rating } from "./parts";

// Time left until local midnight, as hh:mm:ss parts. Computed after mount so server and client markup match.
function useUntilMidnight() {
  const [left, setLeft] = useState<number | null>(null);
  useEffect(() => {
    const tick = () => { const now = new Date(); const end = new Date(now); end.setHours(24, 0, 0, 0); setLeft(end.getTime() - now.getTime()); };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);
  if (left === null) return ["--", "--", "--"];
  const s = Math.floor(left / 1000);
  return [Math.floor(s / 3600), Math.floor((s % 3600) / 60), s % 60].map((n) => String(n).padStart(2, "0"));
}

// Offer D — "Deal of the Day": one discounted product in a big card with a live countdown to midnight,
// plus three other best-sellers beside it.
export default function PopD() {
  const deal = products.find((p) => p.id === "gv-ny")!;
  const others = ["gpt", "tg-premium", "aid-custom"].map((id) => products.find((p) => p.id === id)!);
  const [h, m, s] = useUntilMidnight();
  const sold = 68; // placeholder: % of today's deal stock claimed

  return (
    <section className="bg-white py-24 dark:bg-[#070B14]">
      <div className="mx-auto max-w-7xl px-6">
        <Heading kicker="Popular now" title="Today's deal and best-sellers" />
        <div className="mt-12 grid gap-5 lg:grid-cols-[1.2fr_1fr_1fr_1fr]">
          <div className="relative flex flex-col overflow-hidden rounded-[2rem] bg-[#070B14] p-7 text-white ring-1 ring-white/10 lg:row-span-1">
            <div aria-hidden className="absolute -top-20 start-1/2 h-56 w-80 -translate-x-1/2 rounded-full bg-rose-500/30 blur-[90px]" />
            <span className="relative inline-flex items-center gap-1.5 self-start rounded-full bg-rose-500 px-3 py-1 text-xs font-bold uppercase tracking-wider"><Timer className="h-3.5 w-3.5" />Deal of the day</span>
            <div className="relative mt-5 flex gap-2" aria-label={`Ends in ${h} hours ${m} minutes ${s} seconds`}>
              {[[h, "hrs"], [m, "min"], [s, "sec"]].map(([v, l]) => (
                <div key={l} className="w-16 rounded-xl bg-white/10 py-2 text-center backdrop-blur">
                  <div className="font-mono text-2xl font-bold tabular-nums">{v}</div>
                  <div className="text-[10px] uppercase tracking-widest text-white/60">{l}</div>
                </div>
              ))}
            </div>
            <span className="relative mt-6 grid h-12 w-12 place-items-center rounded-2xl bg-white/10"><deal.icon className="h-6 w-6" /></span>
            <h3 className="relative mt-4 font-display text-2xl font-semibold">{deal.name}</h3>
            <p className="relative text-sm text-white/70">{deal.desc} · {catOf(deal.cat)}</p>
            <div className="relative mt-4 [&_.text-slate-900]:text-white"><Price p={deal} size="lg" /></div>
            <div className="relative mt-4">
              <div className="flex justify-between text-xs text-white/70"><span>{sold}% claimed</span><Delivery p={deal} /></div>
              <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-gradient-to-r from-rose-500 to-amber-400" style={{ width: `${sold}%` }} /></div>
            </div>
            <div className="relative mt-auto pt-6 [&_a]:bg-white [&_a]:text-slate-900 [&_a:hover]:bg-rose-500 [&_a:hover]:text-white"><BuyButton p={deal} label="Grab the deal" full /></div>
            <div className="relative mt-3 flex justify-center [&_*]:text-white/60"><Rating p={deal} /></div>
          </div>
          {others.map((p) => <ProductCard key={p.id} p={p} />)}
        </div>
      </div>
    </section>
  );
}
