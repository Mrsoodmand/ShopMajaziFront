"use client";
import { useId } from "react";
import { useMoney } from "@/lib/money";
import { GV_PRICE, gvCities } from "@/content/google-voice-en";
import { PageShell } from "../otp/parts";
import { Faq, GvCheckout, Included, OrderView, useGv } from "./parts";
import { H1, H2, Live, NumberRadios, primary, ring } from "./clean";

// Page H — "Grouped by City": built for phones first. Numbers are grouped under city headings, with a row of
// jump links to each city. Your choice and the Continue button sit in a bar at the bottom, labelled for screen readers.
export default function GvH() {
  const usd = useMoney().format;
  const gv = useGv();
  const name = useId();

  if (gv.order) return <PageShell><div className="px-6 py-14"><OrderView gv={gv} /></div></PageShell>;

  return (
    <PageShell>
      <div className="mx-auto max-w-3xl px-6 pb-40 pt-14">
        <H1 sub={`Choose a number from the city you like. Calls and texts, on its own Google account, ${usd(GV_PRICE)} once.`}>US numbers by city</H1>

        <nav aria-label="Jump to a city" className="mt-8">
          <ul className="flex flex-wrap gap-2">
            {gvCities.map((c) => (
              <li key={c.city}>
                <a href={`#city-${c.city.replace(/\s/g, "-")}`} className={`inline-block rounded-full border border-slate-300 px-4 py-2 text-[15px] font-medium text-slate-800 hover:border-slate-500 hover:bg-slate-50 dark:border-white/20 dark:text-slate-100 dark:hover:bg-white/5 ${ring}`}>
                  {c.city} <span className="text-slate-600 dark:text-slate-400">({c.numbers.length})</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <Live>Selected {gv.selected.number}, {gv.selected.city}.</Live>
        <div className="mt-12 space-y-12">
          {gvCities.map((c) => (
            <section key={c.city} id={`city-${c.city.replace(/\s/g, "-")}`} aria-labelledby={`h-${c.city.replace(/\s/g, "-")}`} className="scroll-mt-24">
              <h2 id={`h-${c.city.replace(/\s/g, "-")}`} className="font-display text-xl font-bold text-slate-900 dark:text-white">
                {c.city}, {c.state} <span className="ms-1 font-sans text-base font-normal text-slate-600 dark:text-slate-400">area code {c.areas.join(", ")}</span>
              </h2>
              <div className="mt-4"><NumberRadios legend={`Numbers in ${c.city}`} hideLegend name={name} list={c.numbers} gv={gv} size="lg" /></div>
            </section>
          ))}
        </div>

        <section aria-labelledby="included" className="mt-20"><H2 id="included">What you get</H2><div className="mt-6"><Included /></div></section>
        <section aria-labelledby="faq" className="mt-16"><H2 id="faq">Common questions</H2><div className="mt-6"><Faq /></div></section>
      </div>

      <section aria-label="Your selection" className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-300 bg-white dark:border-white/15 dark:bg-[#0B1020]">
        <div className="mx-auto flex max-w-3xl items-center gap-4 px-6 py-4">
          <div className="min-w-0 flex-1">
            <p className="text-sm text-slate-600 dark:text-slate-400">Your number</p>
            <p className="truncate font-mono text-lg font-semibold text-slate-900 dark:text-white">{gv.selected.number}</p>
          </div>
          <button onClick={gv.openPay} className={primary}>Continue · {usd(GV_PRICE)}</button>
        </div>
      </section>
      <GvCheckout gv={gv} />
    </PageShell>
  );
}
