"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowDown, Check } from "lucide-react";
import { useMoney } from "@/lib/money";
import { compareRows, GV_PRICE, gvCities } from "@/content/google-voice-en";
import { PageShell } from "../otp/parts";
import { BuyButton, Faq, GvCheckout, Guarantees, Included, OrderView, PhoneMock, SectionTitle, Steps, useGv } from "./parts";

// Page E — "Guide + Compare": for people still deciding. Explains what a Google Voice number is, compares it with
// one-time and rented numbers, then a compact picker (city, then number) and the FAQ. Long, readable, good for search.
export default function GvE() {
  const usd = useMoney().format;
  const gv = useGv();
  const [city, setCity] = useState(gvCities[0].city);
  const cur = gvCities.find((c) => c.city === city)!;

  if (gv.order) return <PageShell><div className="px-6 py-14"><OrderView gv={gv} /></div></PageShell>;

  return (
    <PageShell>
      <div className="mx-auto max-w-6xl px-6 pb-24 pt-14">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div>
            <span className="text-sm font-semibold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">Google Voice</span>
            <h1 className="mt-3 font-display text-4xl font-bold leading-[1.05] tracking-tight text-slate-900 sm:text-6xl dark:text-white">A permanent US number, without a US SIM</h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-600 dark:text-slate-400">Google Voice gives you a real American phone number that rings in an app. Make calls, send texts and receive verification codes from anywhere. Each number comes on its own Google account, so it's fully yours.</p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a href="#pick" className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-600/30 hover:bg-emerald-700">Pick a number · {usd(GV_PRICE)}<ArrowDown className="h-4 w-4" /></a>
              <Guarantees />
            </div>
          </div>
          <PhoneMock n={gv.selected} />
        </div>

        <section className="mt-24">
          <SectionTitle kicker="Compare" title="Which kind of number do you need?" />
          <div className="mt-8 overflow-x-auto rounded-3xl bg-white ring-1 ring-slate-200 dark:bg-[#0E1424] dark:ring-white/10">
            <table className="w-full min-w-[560px] text-sm">
              <thead>
                <tr className="text-start">
                  <th className="p-5 text-start font-medium text-slate-500 dark:text-slate-400" />
                  <th className="bg-emerald-50 p-5 text-start dark:bg-emerald-500/10"><div className="font-display text-base font-semibold text-slate-900 dark:text-white">Google Voice</div><div className="text-xs font-normal text-emerald-700 dark:text-emerald-300">This page</div></th>
                  <th className="p-5 text-start"><Link href="/virtual-number" className="font-display text-base font-semibold text-slate-900 hover:text-indigo-600 dark:text-white">One-time number</Link></th>
                  <th className="p-5 text-start"><Link href="/rent-number" className="font-display text-base font-semibold text-slate-900 hover:text-indigo-600 dark:text-white">Rented number</Link></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {compareRows.map((r) => (
                  <tr key={r.label}>
                    <td className="p-5 text-slate-500 dark:text-slate-400">{r.label}</td>
                    <td className="bg-emerald-50 p-5 font-semibold text-slate-900 dark:bg-emerald-500/10 dark:text-white">{r.gv}</td>
                    <td className="p-5 text-slate-700 dark:text-slate-300">{r.otp}</td>
                    <td className="p-5 text-slate-700 dark:text-slate-300">{r.rent}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section id="pick" className="mt-24 scroll-mt-24">
          <SectionTitle kicker="Choose" title="Pick your number" />
          <div className="mt-8 grid gap-6 rounded-3xl bg-white p-6 ring-1 ring-slate-200 sm:p-8 lg:grid-cols-[220px_minmax(0,1fr)_260px] dark:bg-[#0E1424] dark:ring-white/10">
            <div>
              <div className="text-xs font-semibold uppercase tracking-widest text-slate-400">1 · City</div>
              <ul className="mt-3 space-y-1">
                {gvCities.map((c) => (
                  <li key={c.city}>
                    <button onClick={() => { setCity(c.city); gv.setSelected(c.numbers[0]); }} aria-pressed={c.city === city}
                      className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm transition-colors ${c.city === city ? "bg-emerald-50 font-semibold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300" : "text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-white/5"}`}>
                      {c.city}<span className="text-xs text-slate-400">{c.numbers.length}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-widest text-slate-400">2 · Number</div>
              <div key={city} className="mt-3 grid animate-fade-up gap-2 [animation-duration:300ms] sm:grid-cols-2">
                {cur.numbers.map((n) => {
                  const on = gv.selected.id === n.id;
                  return (
                    <button key={n.id} onClick={() => gv.setSelected(n)} aria-pressed={on}
                      className={`flex items-center justify-between rounded-xl px-4 py-3 font-mono text-[15px] font-semibold ring-1 transition ${on ? "bg-emerald-600 text-white ring-emerald-600" : "text-slate-900 ring-slate-200 hover:ring-emerald-300 dark:text-white dark:ring-white/10"}`}>
                      {n.number}{on && <Check className="h-4 w-4" />}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="self-start rounded-2xl bg-slate-50 p-5 lg:sticky lg:top-24 dark:bg-white/5">
              <div className="text-xs font-semibold uppercase tracking-widest text-slate-400">3 · Buy</div>
              <div className="mt-3 font-mono text-xl font-bold text-slate-900 dark:text-white">{gv.selected.number}</div>
              <div className="text-sm text-slate-500 dark:text-slate-400">{gv.selected.city}, {gv.selected.state}</div>
              <BuyButton gv={gv} className="mt-5 w-full">Buy · {usd(GV_PRICE)}</BuyButton>
            </div>
          </div>
        </section>

        <section className="mt-24 grid gap-10 lg:grid-cols-2">
          <div><SectionTitle kicker="Included" title="What you receive" /><p className="mt-4 text-slate-600 dark:text-slate-400">Everything shows up in your dashboard right after paying, hidden until you choose to reveal it.</p><div className="mt-6"><Included /></div></div>
          <div><SectionTitle kicker="How it works" title="From order to first call" /><div className="mt-6 [&_ol]:grid-cols-1"><Steps /></div></div>
        </section>

        <section className="mt-24 max-w-3xl"><SectionTitle kicker="FAQ" title="Google Voice questions" /><div className="mt-8"><Faq /></div></section>
      </div>
      <GvCheckout gv={gv} />
    </PageShell>
  );
}
