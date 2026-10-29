"use client";
import { useState } from "react";
import { MapPin, ArrowLeft } from "lucide-react";
import { useMoney } from "@/lib/money";
import { GV_PRICE, gvCities } from "@/content/google-voice-en";
import { PageShell } from "../otp/parts";
import { BuyButton, Faq, Features, GvCheckout, Guarantees, NumberTile, OrderView, SectionTitle, useGv } from "./parts";

// Light tint per city card, cycling.
const tints = ["from-emerald-400 to-teal-500", "from-sky-400 to-indigo-500", "from-amber-400 to-orange-500", "from-fuchsia-400 to-pink-500", "from-violet-400 to-indigo-600", "from-teal-400 to-cyan-500"];

// Page C — "Pick by City": people often want a number from a particular place, so you start with the city.
// Each city card shows its area codes and how many numbers are left; opening one lists them with Buy beside it.
export default function GvC() {
  const usd = useMoney().format;
  const gv = useGv();
  const [city, setCity] = useState<string | null>(null);
  const open = gvCities.find((c) => c.city === city);

  if (gv.order) return <PageShell><div className="px-6 py-14"><OrderView gv={gv} /></div></PageShell>;

  return (
    <PageShell>
      <section className="relative overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 start-[12%] h-[360px] w-[360px] rounded-full bg-emerald-300/40 blur-[110px] dark:bg-emerald-600/20" />
          <div className="absolute -top-10 end-[10%] h-[320px] w-[320px] rounded-full bg-sky-300/40 blur-[110px] dark:bg-sky-600/15" />
        </div>
        <div className="relative mx-auto max-w-3xl px-6 pb-6 pt-16 text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">Google Voice</span>
          <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl dark:text-white">Where should your US number be from?</h1>
          <p className="mt-5 text-lg text-slate-600 dark:text-slate-400">Pick a city, then a number. Calls and texts, yours to keep, {usd(GV_PRICE)} once.</p>
          <Guarantees className="mt-6 justify-center" />
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-6 pb-24 pt-8">
        {!open ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {gvCities.map((c, i) => (
              <div key={c.city} className="animate-fade-up [animation-duration:400ms]" style={{ animationDelay: `${i * 40}ms` }}>
              <button onClick={() => { setCity(c.city); gv.setSelected(c.numbers[0]); }}
                className="group w-full overflow-hidden rounded-3xl bg-white text-start ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-xl hover:ring-emerald-300 dark:bg-[#0E1424] dark:ring-white/10 dark:hover:ring-emerald-400/50">
                <div className={`relative h-24 bg-gradient-to-br ${tints[i % tints.length]}`}>
                  <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,.3)_1px,transparent_1px)] bg-[size:14px_14px]" />
                  <MapPin className="absolute bottom-3 end-4 h-10 w-10 text-white/80 transition duration-500 group-hover:-translate-y-1" strokeWidth={1.5} />
                  <span className="absolute bottom-3 start-4 rounded-full bg-white/25 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur">{c.state}</span>
                </div>
                <div className="flex items-end justify-between gap-3 p-5">
                  <div>
                    <div className="font-display text-xl font-semibold text-slate-900 dark:text-white">{c.city}</div>
                    <div className="mt-1 font-mono text-sm text-slate-500 dark:text-slate-400">{c.areas.map((a) => `(${a})`).join(" · ")}</div>
                  </div>
                  <span className="text-sm text-slate-500 dark:text-slate-400"><b className="text-slate-900 dark:text-white">{c.numbers.length}</b> left</span>
                </div>
              </button>
              </div>
            ))}
          </div>
        ) : (
          <div key={open.city} className="grid animate-fade-up gap-8 [animation-duration:350ms] lg:grid-cols-[minmax(0,1fr)_340px]">
            <div>
              <button onClick={() => setCity(null)} className="flex items-center gap-1.5 text-sm font-semibold text-emerald-600 dark:text-emerald-400"><ArrowLeft className="h-4 w-4 rtl:rotate-180" />All cities</button>
              <h2 className="mt-4 font-display text-3xl font-bold text-slate-900 dark:text-white">{open.city}, {open.state}</h2>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {open.numbers.map((n) => <NumberTile key={n.id} n={n} on={gv.selected.id === n.id} onPick={() => gv.setSelected(n)} />)}
              </div>
            </div>
            <aside className="h-fit rounded-3xl bg-white p-6 ring-1 ring-slate-200 lg:sticky lg:top-24 dark:bg-[#0E1424] dark:ring-white/10">
              <div className="text-xs font-semibold uppercase tracking-widest text-slate-400">Your number</div>
              <div key={gv.selected.id} className="mt-2 animate-fade-up font-mono text-2xl font-bold text-slate-900 [animation-duration:300ms] dark:text-white">{gv.selected.number}</div>
              <div className="text-sm text-slate-500 dark:text-slate-400">{gv.selected.city}, {gv.selected.state}</div>
              <div className="mt-6 flex items-baseline justify-between border-t border-slate-100 pt-5 dark:border-white/10"><span className="text-sm text-slate-500 dark:text-slate-400">One-time price</span><span className="font-display text-2xl font-bold text-slate-900 dark:text-white">{usd(GV_PRICE)}</span></div>
              <BuyButton gv={gv} className="mt-5 w-full">Buy this number</BuyButton>
            </aside>
          </div>
        )}

        <section className="mt-24"><SectionTitle kicker="Why Google Voice" title="A number that works like a real US line" /><div className="mt-8"><Features /></div></section>
        <section className="mt-20 max-w-3xl"><SectionTitle kicker="FAQ" title="Good to know" /><div className="mt-8"><Faq /></div></section>
      </div>
      <GvCheckout gv={gv} />
    </PageShell>
  );
}
