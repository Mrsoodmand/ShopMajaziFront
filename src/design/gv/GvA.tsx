"use client";
import { useState } from "react";
import { Phone, ShieldCheck, Zap, ArrowRight, Check } from "lucide-react";
import { GV_PRICE, gvFeatures, gvNumbers, gvStates } from "@/content/gv-en";
import { useMoney } from "@/lib/money";
import { useGvOrder } from "./order";
import { EasyTag, GvCheckout, GvDelivery, NumberChip, PageShell, WalletChip } from "./parts";

// Page A — "Number Picker": a hero that explains the product, then every available number as a chip, filtered by
// state. The chosen number sits in a sticky card with the price and Buy.
export default function GvA() {
  const usd = useMoney().format;
  const [state, setState] = useState("all");
  const [sel, setSel] = useState(gvNumbers[0].id);
  const [pay, setPay] = useState(false);
  const { order, buy, reset } = useGvOrder();
  const list = gvNumbers.filter((n) => state === "all" || n.area.state === state);
  const n = gvNumbers.find((x) => x.id === sel)!;

  return (
    <PageShell>
      <section className="relative overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute -top-32 start-[10%] h-[400px] w-[400px] rounded-full bg-sky-300/40 blur-[110px] dark:bg-sky-600/20" />
          <div className="absolute -top-20 end-[8%] h-[360px] w-[360px] rounded-full bg-indigo-300/40 blur-[110px] dark:bg-indigo-600/20" />
        </div>
        <div className="relative mx-auto max-w-4xl px-6 pb-10 pt-14 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white bg-white/70 px-3 py-1 text-xs font-medium text-slate-600 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5 dark:text-slate-300"><Phone className="h-3.5 w-3.5 text-sky-500" />Google Voice · permanent US number</span>
          <h1 className="mt-6 font-display text-4xl font-bold leading-[1.05] tracking-tight text-slate-900 sm:text-6xl dark:text-white">A US number <span className="bg-gradient-to-r from-sky-500 to-indigo-600 bg-clip-text text-transparent dark:from-sky-300 dark:to-indigo-300">that stays yours.</span></h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-slate-600 dark:text-slate-400">Calls, texts and verification codes on a real Google Voice line. Pick the exact number you like.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-2 text-xs text-slate-600 dark:text-slate-300">
            {[[Zap, "Delivered in minutes"], [ShieldCheck, "Replacement guarantee"], [Check, "Full Google login"]].map(([I, t]) => { const Icon = I as typeof Zap; return <span key={t as string} className="flex items-center gap-1.5 rounded-full bg-white/70 px-3 py-1.5 ring-1 ring-slate-200 dark:bg-white/5 dark:ring-white/10"><Icon className="h-3.5 w-3.5 text-indigo-500" />{t as string}</span>; })}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 pb-16">
        {order ? <GvDelivery order={order} onAnother={reset} /> : (
          <div className="grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="font-display text-xl font-semibold text-slate-900 dark:text-white">{list.length} numbers available</h2>
                <WalletChip />
              </div>
              <div className="mt-4 flex gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none]">
                {[{ state: "all", name: "All states", count: gvNumbers.length }, ...gvStates].map((s) => (
                  <button key={s.state} onClick={() => setState(s.state)} className={`shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium transition ${state === s.state ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900" : "bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-slate-300 dark:bg-white/5 dark:text-slate-300 dark:ring-white/10"}`}>
                    {s.name} <span className="opacity-60">{s.count}</span>
                  </button>
                ))}
              </div>
              <div key={state} className="mt-5 grid animate-fade-up grid-cols-1 gap-3 [animation-duration:300ms] sm:grid-cols-2 xl:grid-cols-3">
                {list.map((x) => <NumberChip key={x.id} n={x} on={x.id === sel} onPick={() => setSel(x.id)} />)}
              </div>
            </div>

            <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
              <div className="rounded-3xl bg-white p-6 shadow-xl shadow-indigo-100/60 ring-1 ring-slate-200 dark:bg-[#0E1424] dark:shadow-black/30 dark:ring-white/10">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">Your pick</div>
                <div key={n.id} className="mt-2 animate-fade-up [animation-duration:250ms]">
                  <div className="font-mono text-2xl font-bold text-slate-900 dark:text-white">{n.number}</div>
                  <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">{n.area.city}, {n.area.stateName}</div>
                  {n.easy && <div className="mt-2"><EasyTag /></div>}
                </div>
                <div className="mt-5 flex items-baseline justify-between border-t border-slate-100 pt-4 dark:border-white/10"><span className="text-sm text-slate-500 dark:text-slate-400">One-time price</span><span className="font-display text-3xl font-bold text-slate-900 dark:text-white">{usd(GV_PRICE)}</span></div>
                <button onClick={() => setPay(true)} className="group mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 py-4 font-semibold text-white transition hover:bg-indigo-700">Buy this number<ArrowRight className="h-4 w-4 transition group-hover:translate-x-1 rtl:rotate-180" /></button>
              </div>
              <ul className="space-y-3 rounded-3xl bg-white p-6 ring-1 ring-slate-200 dark:bg-[#0E1424] dark:ring-white/10">
                {gvFeatures.map((f) => <li key={f.title} className="flex gap-3"><Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" /><span><span className="block text-sm font-semibold text-slate-900 dark:text-white">{f.title}</span><span className="block text-xs text-slate-500 dark:text-slate-400">{f.desc}</span></span></li>)}
              </ul>
            </aside>
          </div>
        )}
      </div>
      <GvCheckout open={pay} onClose={() => setPay(false)} number={n} onPay={(m) => buy(n, m, GV_PRICE)} />
    </PageShell>
  );
}
