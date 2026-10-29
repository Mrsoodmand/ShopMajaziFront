"use client";
import { useId } from "react";
import { useMoney } from "@/lib/money";
import { appFrom, durations, rentCountries } from "@/content/rent-en";
import { CC, PageShell } from "../otp/parts";
import { field } from "../googleVoice/clean";
import { AppChoices, CountryChoices, MethodSwitch, PayAgain, PeriodChoices, RentPayModal, useRentFlow } from "./flow";
import { Heading, Points, RentFaq, RentOrderView, Title } from "./parts";

// Page I — "Quick Pick": everything on one compact screen for people who know what they want.
// All apps: period chips, then a grid of countries with their price. One app: a country dropdown, period chips,
// then a grid of apps with prices. The last pick opens the payment window.
export default function RentI() {
  const usd = useMoney().format;
  const f = useRentFlow();
  const cId = useId();
  if (f.order) return <PageShell><div className="px-6 py-14"><RentOrderView order={f.order} onReset={f.reset} /></div></PageShell>;

  const label = "text-sm font-semibold text-slate-900 dark:text-white";

  return (
    <PageShell>
      <div className="mx-auto max-w-6xl px-6 pb-24 pt-14">
        <Title sub="Unlimited SMS for a week or a month.">Rent a number</Title>
        <div className="mt-8"><MethodSwitch f={f} /></div>

        <div key={f.method} className="mt-8 space-y-8 rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 dark:border-white/15 dark:bg-[#0E1424]">
          {f.method === "all" ? (
            <>
              <section aria-labelledby="i-period"><h2 id="i-period" className={label}>1 · Period</h2><div className="mt-3"><PeriodChoices f={f} layout="chips" /></div></section>
              <section aria-labelledby="i-country">
                <h2 id="i-country" className={label}>2 · Country</h2>
                <div className="mt-3">{f.period ? <CountryChoices f={f} layout="grid" /> : <p className="text-slate-600 dark:text-slate-400">Choose a period to see the countries and prices.</p>}</div>
              </section>
            </>
          ) : (
            <>
              <section aria-labelledby="i-country">
                <h2 id="i-country" className={label}><label htmlFor={cId}>1 · Country</label></h2>
                <div className="mt-3 flex max-w-md items-center gap-3">
                  {f.country && <CC cc={f.country.cc} />}
                  <select id={cId} value={f.country?.cc ?? ""} onChange={(e) => { const c = rentCountries.find((x) => x.cc === e.target.value); if (c) f.pickCountry(c); }} className={`${field} appearance-auto`}>
                    <option value="" disabled>Choose a country</option>
                    {rentCountries.map((c) => <option key={c.cc} value={c.cc}>{c.name} · one app from {usd(appFrom(c, durations[0]))}/week</option>)}
                  </select>
                </div>
              </section>
              <section aria-labelledby="i-period">
                <h2 id="i-period" className={label}>2 · Period</h2>
                <div className="mt-3">{f.country ? <PeriodChoices f={f} layout="chips" /> : <p className="text-slate-600 dark:text-slate-400">Choose a country first.</p>}</div>
              </section>
              <section aria-labelledby="i-app">
                <h2 id="i-app" className={label}>3 · App</h2>
                <div className="mt-3">{f.country && f.period ? <AppChoices f={f} layout="grid" /> : <p className="text-slate-600 dark:text-slate-400">Choose a country and a period to see the apps and prices.</p>}</div>
              </section>
            </>
          )}
          <PayAgain f={f} />
        </div>

        <section aria-labelledby="why" className="mt-20"><Heading id="why">Why rent a number</Heading><div className="mt-6"><Points /></div></section>
        <section aria-labelledby="faq" className="mt-16 max-w-3xl"><Heading id="faq">Common questions</Heading><div className="mt-6"><RentFaq /></div></section>
      </div>
      <RentPayModal f={f} />
    </PageShell>
  );
}
