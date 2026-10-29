"use client";
import { useEffect, useId, useState } from "react";
import { useMoney } from "@/lib/money";
import { endDate, priceForDays, rentCountries } from "@/content/rent-en";
import { CC, PageShell } from "../otp/parts";
import { field, primary, ring } from "../googleVoice/clean";
import { Heading, Points, RentCheckout, RentFaq, RentOrderView, Title, useRent } from "./parts";

const MIN = 3, MAX = 30;
const quick = [7, 14, 30];
// Note for the fa (RTL) version: the browser already runs the slider right to left there; flip the fill gradient to "to left".

// Page D — "Pick Any Length": rent for exactly the days you need. A native slider (arrow keys move one day,
// Page Up/Down five) with quick 1 week / 2 weeks / 1 month buttons; the price, price per day and end date update live.
export default function RentD() {
  const usd = useMoney().format;
  const r = useRent();
  const [days, setDays] = useState(7);
  const cId = useId(), sId = useId();
  const price = priceForDays(r.country, days);

  // This design always uses its own day count and price.
  const { setCustom } = r;
  useEffect(() => { setCustom({ days, price }); }, [days, price, setCustom]);

  if (r.order) return <PageShell><div className="px-6 py-14"><RentOrderView order={r.order} onReset={r.reset} /></div></PageShell>;
  const pct = ((days - MIN) / (MAX - MIN)) * 100;

  return (
    <PageShell>
      <div className="mx-auto max-w-3xl px-6 pb-24 pt-14">
        <Title sub="Choose a country and slide to the number of days. Every SMS to the number reaches you until the last day.">Rent for exactly as long as you need</Title>

        <section aria-labelledby="calc" className="mt-12 rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 dark:border-white/15 dark:bg-[#0E1424]">
          <h2 id="calc" className="sr-only">Rental calculator</h2>
          <label htmlFor={cId} className="text-sm font-semibold text-slate-900 dark:text-white">Country</label>
          <div className="mt-2 flex items-center gap-3">
            <CC cc={r.country.cc} />
            <select id={cId} value={r.country.cc} onChange={(e) => r.setCountry(rentCountries.find((c) => c.cc === e.target.value)!)} className={`${field} appearance-auto`}>
              {rentCountries.map((c) => <option key={c.cc} value={c.cc}>{c.name} · from {usd(c.week)}/week</option>)}
            </select>
          </div>

          <div className="mt-10 flex items-baseline justify-between gap-4">
            <label htmlFor={sId} className="text-sm font-semibold text-slate-900 dark:text-white">Number of days</label>
            <output htmlFor={sId} className="font-display text-3xl font-bold text-slate-900 dark:text-white">{days} days</output>
          </div>
          <input id={sId} type="range" min={MIN} max={MAX} step={1} value={days} onChange={(e) => setDays(Number(e.target.value))}
            aria-valuetext={`${days} days, until ${endDate(days)}`}
            style={{ background: `linear-gradient(to right, var(--track-on) ${pct}%, var(--track-off) ${pct}%)` }}
            className={`mt-4 h-3 w-full cursor-pointer appearance-none rounded-full [--track-off:#e2e8f0] [--track-on:#047857] dark:[--track-off:rgba(255,255,255,.15)] dark:[--track-on:#34d399] [&::-moz-range-thumb]:h-7 [&::-moz-range-thumb]:w-7 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-4 [&::-moz-range-thumb]:border-emerald-700 [&::-moz-range-thumb]:bg-white [&::-webkit-slider-thumb]:h-7 [&::-webkit-slider-thumb]:w-7 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-emerald-700 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-md dark:[&::-webkit-slider-thumb]:border-emerald-400 ${ring}`} />
          <div aria-hidden className="mt-2 flex justify-between text-sm text-slate-600 dark:text-slate-400"><span>{MIN} days</span><span>{MAX} days</span></div>

          <div role="group" aria-label="Quick lengths" className="mt-6 flex flex-wrap gap-2">
            {quick.map((q) => (
              <button key={q} onClick={() => setDays(q)} aria-pressed={days === q}
                className={`rounded-full border-2 px-4 py-2 text-[15px] font-semibold transition-colors ${days === q ? "border-emerald-700 bg-emerald-700 text-white dark:border-emerald-400 dark:bg-emerald-400 dark:text-emerald-950" : "border-slate-300 text-slate-800 hover:border-slate-500 dark:border-white/20 dark:text-slate-100"} ${ring}`}>
                {q === 7 ? "1 week" : q === 14 ? "2 weeks" : "1 month"}
              </button>
            ))}
          </div>

          <dl aria-live="polite" className="mt-10 grid gap-4 border-t border-slate-200 pt-8 sm:grid-cols-3 dark:border-white/10">
            <div><dt className="text-sm text-slate-600 dark:text-slate-400">Total</dt><dd className="font-display text-4xl font-bold text-slate-900 dark:text-white">{usd(price)}</dd></div>
            <div><dt className="text-sm text-slate-600 dark:text-slate-400">Per day</dt><dd className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">{usd(price / days)}</dd></div>
            <div><dt className="text-sm text-slate-600 dark:text-slate-400">Ends on</dt><dd className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">{endDate(days)}</dd></div>
          </dl>
          <button onClick={r.openPay} className={`${primary} mt-8 w-full`}>Rent {r.country.name} number for {usd(price)}</button>
        </section>

        <section aria-labelledby="why" className="mt-20"><Heading id="why">What you get</Heading><div className="mt-6"><Points cols={2} /></div></section>
        <section aria-labelledby="faq" className="mt-16"><Heading id="faq">Common questions</Heading><div className="mt-6"><RentFaq /></div></section>
      </div>
      <RentCheckout r={r} />
    </PageShell>
  );
}
