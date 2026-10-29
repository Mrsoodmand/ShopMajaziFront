"use client";
import { useId } from "react";
import { useMoney } from "@/lib/money";
import { durations, perDay, priceFor, rentCountries } from "@/content/rent-en";
import { CC, PageShell } from "../otp/parts";
import { Dot, Heading, Points, RentCheckout, RentFaq, RentOrderView, RentSummary, Title, useRent } from "./parts";

// Page C — "Price Table": every country and every length in one table, so prices are easy to compare.
// Each price is a radio button with a full spoken label ("Germany, 2 weeks, $15.10"); the summary sits beside it.
export default function RentC() {
  const usd = useMoney().format;
  const r = useRent();
  const name = useId();
  if (r.order) return <PageShell><div className="px-6 py-14"><RentOrderView order={r.order} onReset={r.reset} /></div></PageShell>;

  return (
    <PageShell>
      <div className="mx-auto max-w-6xl px-6 pb-24 pt-14">
        <Title sub="Pick a price in the table: the row is the country, the column is how long you keep the number.">Rental prices by country</Title>

        <div className="mt-12 grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[minmax(0,1fr)_340px]">
          <section aria-labelledby="tbl">
            <Heading id="tbl">Choose country and length</Heading>
            <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-300 dark:border-white/15">
              <table className="w-full min-w-[560px] text-[15px]">
                <caption className="sr-only">Rental prices. Each price is a choice; select one to rent that country for that length.</caption>
                <thead className="bg-slate-50 dark:bg-white/5">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-start font-semibold text-slate-900 dark:text-white">Country</th>
                    {durations.map((d) => <th key={d.days} scope="col" className="px-4 py-3 text-start font-semibold text-slate-900 dark:text-white">{d.label}</th>)}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-white/10">
                  {rentCountries.map((c) => (
                    <tr key={c.cc}>
                      <th scope="row" className="px-4 py-3 text-start font-medium text-slate-900 dark:text-white"><span className="flex items-center gap-2.5"><CC cc={c.cc} />{c.name}</span></th>
                      {durations.map((d) => {
                        const on = !r.custom && r.country.cc === c.cc && r.duration.days === d.days;
                        return (
                          <td key={d.days} className="p-1.5">
                            <label className={`flex cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2 transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-emerald-600 dark:has-[:focus-visible]:ring-emerald-400 ${on ? "bg-emerald-50 ring-2 ring-emerald-700 dark:bg-emerald-500/10 dark:ring-emerald-400" : "hover:bg-slate-50 dark:hover:bg-white/5"}`}>
                              <input type="radio" autoComplete="off" name={name} checked={on} onChange={() => { r.setCustom(null); r.setCountry(c); r.setDuration(d); }}
                                aria-label={`${c.name}, ${d.label}, ${usd(priceFor(c, d))}`} className="sr-only" />
                              <Dot on={on} />
                              <span aria-hidden>
                                <span className="block font-semibold text-slate-900 dark:text-white">{usd(priceFor(c, d))}</span>
                                <span className="block text-xs text-slate-600 dark:text-slate-400">{usd(perDay(c, d))}/day</span>
                              </span>
                            </label>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
          <div className="lg:sticky lg:top-24 lg:self-start"><RentSummary r={r} /></div>
        </div>

        <section aria-labelledby="why" className="mt-20"><Heading id="why">Every rental includes</Heading><div className="mt-6"><Points /></div></section>
        <section aria-labelledby="faq" className="mt-16 max-w-3xl"><Heading id="faq">Common questions</Heading><div className="mt-6"><RentFaq /></div></section>
      </div>
      <RentCheckout r={r} />
    </PageShell>
  );
}
