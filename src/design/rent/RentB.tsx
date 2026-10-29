"use client";
import { useId } from "react";
import { Check } from "lucide-react";
import { useMoney } from "@/lib/money";
import { durations, endDate, perDay, priceFor, rentCountries, savingFor } from "@/content/rent-en";
import { CC, PageShell } from "../otp/parts";
import { field, primary, secondary } from "../googleVoice/clean";
import { Heading, Points, RentCheckout, RentFaq, RentOrderView, Title, useRent } from "./parts";

const perks = ["Unlimited SMS from any app", "Same number the whole time", "Extend before it ends", "Replaced if no SMS in 1 hour"];

// Page B — "Plan Cards": like a pricing page. Pick the country once; three plan cards show what a week, two weeks
// and a month cost there, with the month marked as best value. Each card has its own Rent button.
export default function RentB() {
  const usd = useMoney().format;
  const r = useRent();
  const cId = useId();
  if (r.order) return <PageShell><div className="px-6 py-14"><RentOrderView order={r.order} onReset={r.reset} /></div></PageShell>;

  return (
    <PageShell>
      <div className="mx-auto max-w-6xl px-6 pb-24 pt-14">
        <div className="mx-auto max-w-2xl text-center">
          <Title sub="One number, every SMS, for as long as you need it. Longer rentals cost less per day.">Simple rental plans</Title>
          <div className="mx-auto mt-8 max-w-sm text-start">
            <label htmlFor={cId} className="text-sm font-semibold text-slate-900 dark:text-white">Country</label>
            <div className="mt-2 flex items-center gap-3">
              <CC cc={r.country.cc} />
              <select id={cId} value={r.country.cc} onChange={(e) => r.setCountry(rentCountries.find((c) => c.cc === e.target.value)!)} className={`${field} appearance-auto`}>
                {rentCountries.map((c) => <option key={c.cc} value={c.cc}>{c.name}</option>)}
              </select>
            </div>
          </div>
        </div>

        <ul aria-live="polite" className="mt-12 grid gap-6 md:grid-cols-3">
          {durations.map((d) => {
            const best = d.days === 30;
            const save = savingFor(d);
            return (
              <li key={d.days} className={`relative flex flex-col rounded-3xl border-2 bg-white p-7 dark:bg-[#0E1424] ${best ? "border-emerald-700 shadow-xl shadow-emerald-900/10 dark:border-emerald-400" : "border-slate-200 dark:border-white/15"}`}>
                {best && <span className="absolute -top-3.5 start-7 rounded-full bg-emerald-700 px-3 py-1 text-sm font-semibold text-white dark:bg-emerald-400 dark:text-emerald-950">Best value</span>}
                <h2 className="font-display text-xl font-semibold text-slate-900 dark:text-white">{d.label}</h2>
                <p className="mt-1 text-slate-600 dark:text-slate-400">{d.days} days · ends {endDate(d.days)}</p>
                <p className="mt-6"><span className="font-display text-4xl font-bold text-slate-900 dark:text-white">{usd(priceFor(r.country, d))}</span></p>
                <p className="mt-1 text-slate-700 dark:text-slate-300">{usd(perDay(r.country, d))} a day{save > 0 && <span className="font-semibold text-amber-800 dark:text-amber-300"> · save {save}%</span>}</p>
                <ul className="mt-6 flex-1 space-y-2.5">
                  {perks.map((p) => <li key={p} className="flex gap-2.5 text-[15px] text-slate-700 dark:text-slate-300"><Check aria-hidden className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700 dark:text-emerald-400" />{p}</li>)}
                </ul>
                <button onClick={() => { r.setCustom(null); r.setDuration(d); r.openPay(); }} className={`${best ? primary : secondary} mt-8 w-full`}>
                  Rent for {d.label}<span className="sr-only"> in {r.country.name}, {usd(priceFor(r.country, d))}</span>
                </button>
              </li>
            );
          })}
        </ul>
        <p className="mt-6 text-center text-slate-600 dark:text-slate-400">{r.country.stock} {r.country.name} numbers available now.</p>

        <section aria-labelledby="why" className="mt-24"><Heading id="why">What every plan includes</Heading><div className="mt-6"><Points /></div></section>
        <section aria-labelledby="faq" className="mt-16 max-w-3xl"><Heading id="faq">Common questions</Heading><div className="mt-6"><RentFaq /></div></section>
      </div>
      <RentCheckout r={r} />
    </PageShell>
  );
}
