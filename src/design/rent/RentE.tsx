"use client";
import { useId } from "react";
import { Inbox } from "lucide-react";
import { useMoney } from "@/lib/money";
import { endDate, rentCountries, sampleRentNumber } from "@/content/rent-en";
import { CC, PageShell } from "../otp/parts";
import { field, primary } from "../googleVoice/clean";
import { DurationRadios, Heading, InboxList, Points, RentCheckout, RentFaq, RentOrderView, Title, useRent } from "./parts";

const how = [
  { t: "Choose country and length", d: "From one week to a month. Longer is cheaper per day." },
  { t: "Use the number anywhere", d: "Sign up or log in to any app with it, as many times as you like." },
  { t: "Read every SMS", d: "Messages land in your inbox on ShopMajazi, newest first." },
];

// Page E — "Inbox Preview": shows what you're buying. The setup sits on the left; on the right a preview of the
// rental inbox, with the number for the chosen country and messages arriving, so "unlimited SMS" is obvious.
export default function RentE() {
  const usd = useMoney().format;
  const r = useRent();
  const cId = useId();
  if (r.order) return <PageShell><div className="px-6 py-14"><RentOrderView order={r.order} onReset={r.reset} /></div></PageShell>;

  return (
    <PageShell>
      <div className="mx-auto max-w-6xl px-6 pb-24 pt-14">
        <div className="grid items-start gap-12 lg:grid-cols-2">
          <div>
            <Title sub="Keep a number for as long as you need and read every SMS it gets, from any app, in one inbox.">One number. Every SMS. For weeks.</Title>
            <section aria-labelledby="setup" className="mt-10 space-y-8">
              <h2 id="setup" className="sr-only">Set up your rental</h2>
              <div>
                <label htmlFor={cId} className="text-sm font-semibold text-slate-900 dark:text-white">Country</label>
                <div className="mt-2 flex items-center gap-3">
                  <CC cc={r.country.cc} />
                  <select id={cId} value={r.country.cc} onChange={(e) => r.setCountry(rentCountries.find((c) => c.cc === e.target.value)!)} className={`${field} appearance-auto`}>
                    {rentCountries.map((c) => <option key={c.cc} value={c.cc}>{c.name}</option>)}
                  </select>
                </div>
              </div>
              <DurationRadios r={r} legend="How long?" stacked />
              <button onClick={r.openPay} className={`${primary} w-full`}>Rent for {usd(r.price)}</button>
            </section>
          </div>

          <section aria-labelledby="preview" className="rounded-[2rem] border border-slate-200 bg-slate-50 p-6 lg:sticky lg:top-24 dark:border-white/15 dark:bg-white/[.03]">
            <h2 id="preview" className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300"><Inbox aria-hidden className="h-4 w-4" />Preview of your inbox</h2>
            <div className="mt-4 rounded-2xl bg-white p-5 dark:bg-[#0E1424]">
              <div className="flex items-center gap-3"><CC cc={r.country.cc} /><span key={r.country.cc} className="animate-fade-up font-mono text-xl font-bold text-slate-900 [animation-duration:300ms] dark:text-white">{sampleRentNumber(r.country.cc)}</span></div>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Active until {endDate(r.days)} · {r.days} days</p>
            </div>
            <div className="mt-4"><InboxList label="Example messages" announce={false} /></div>
            <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">Example only. Your real number is shown after paying.</p>
          </section>
        </div>

        <section aria-labelledby="how" className="mt-24">
          <Heading id="how">How renting works</Heading>
          <ol className="mt-6 grid gap-6 md:grid-cols-3">
            {how.map((s, i) => (
              <li key={s.t} className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-white/15 dark:bg-[#0E1424]">
                <span aria-hidden className="grid h-9 w-9 place-items-center rounded-full bg-slate-900 font-display font-bold text-white dark:bg-white dark:text-slate-900">{i + 1}</span>
                <h3 className="mt-4 font-display text-lg font-semibold text-slate-900 dark:text-white">{s.t}</h3>
                <p className="mt-1 text-slate-600 dark:text-slate-400">{s.d}</p>
              </li>
            ))}
          </ol>
        </section>
        <section aria-labelledby="why" className="mt-20"><Heading id="why">Why rent</Heading><div className="mt-6"><Points /></div></section>
        <section aria-labelledby="faq" className="mt-16 max-w-3xl"><Heading id="faq">Common questions</Heading><div className="mt-6"><RentFaq /></div></section>
      </div>
      <RentCheckout r={r} />
    </PageShell>
  );
}
