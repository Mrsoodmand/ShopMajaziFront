"use client";
import { Check } from "lucide-react";
import { useMoney } from "@/lib/money";
import { endDate } from "@/content/rent-en";
import { PageShell } from "../otp/parts";
import { primary, ring } from "../googleVoice/clean";
import { MethodSwitch, RentPayModal, StepChoices, stepTitle, StepValue, useRentFlow, type StepId } from "./flow";
import { Heading, Points, RentFaq, RentOrderView, Title } from "./parts";

const ask: Record<StepId, string> = { period: "Choose the rental period", country: "Choose a country", app: "Choose the app" };

// Page J — "Steps + Summary": the current question on the left with a step bar you can click back through; on the
// right, a summary fills in as you choose and shows the price once everything is picked. The last choice opens the
// payment window; the summary's button reopens it.
export default function RentJ() {
  const usd = useMoney().format;
  const f = useRentFlow();
  if (f.order) return <PageShell><div className="px-6 py-14"><RentOrderView order={f.order} onReset={f.reset} /></div></PageShell>;

  return (
    <PageShell>
      <div className="mx-auto max-w-6xl px-6 pb-24 pt-14">
        <Title sub="A number that receives every SMS, for as long as you need it.">Rent a number</Title>
        <div className="mt-8"><MethodSwitch f={f} /></div>

        <div className="mt-10 grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div>
            <nav aria-label="Steps">
              <ol className="flex flex-wrap gap-2">
                {f.steps.map((s, i) => {
                  const cur = s === f.current;
                  const done = f.value[s];
                  const can = f.unlocked(s);
                  return (
                    <li key={s}>
                      <button onClick={() => done && f.reopen(s)} disabled={!can || cur} aria-current={cur ? "step" : undefined}
                        className={`flex items-center gap-2 rounded-full border-2 px-4 py-2 text-[15px] font-semibold transition-colors disabled:cursor-default ${ring} ${cur ? "border-slate-900 bg-slate-900 text-white dark:border-white dark:bg-white dark:text-slate-900" : done ? "border-emerald-700 text-emerald-800 hover:bg-emerald-50 dark:border-emerald-400 dark:text-emerald-300 dark:hover:bg-emerald-500/10" : "border-slate-200 text-slate-500 dark:border-white/15 dark:text-slate-400"}`}>
                        {done && !cur ? <Check aria-hidden className="h-4 w-4" /> : <span aria-hidden>{i + 1}</span>}{stepTitle[s]}
                        {done && !cur && <span className="sr-only">, done, select to change</span>}
                      </button>
                    </li>
                  );
                })}
              </ol>
            </nav>
            <section key={`${f.method}-${f.current}`} aria-labelledby="j-q" className="mt-8 animate-fade-up [animation-duration:300ms]">
              <Heading id="j-q">{ask[f.current]}</Heading>
              <div className="mt-5"><StepChoices f={f} step={f.current} layout="grid" /></div>
            </section>
          </div>

          <aside aria-labelledby="j-sum" className="h-fit rounded-3xl border border-slate-200 bg-white p-6 lg:sticky lg:top-24 dark:border-white/15 dark:bg-[#0E1424]">
            <h2 id="j-sum" className="font-display text-lg font-semibold text-slate-900 dark:text-white">Your rental</h2>
            <dl className="mt-4 divide-y divide-slate-200 text-[15px] dark:divide-white/10">
              <div className="flex justify-between gap-4 py-2.5"><dt className="text-slate-600 dark:text-slate-400">Type</dt><dd className="font-medium text-slate-900 dark:text-white">{f.method === "all" ? "All apps" : "One app"}</dd></div>
              {f.steps.map((s) => (
                <div key={s} className="flex justify-between gap-4 py-2.5">
                  <dt className="text-slate-600 dark:text-slate-400">{stepTitle[s]}</dt>
                  <dd className="text-end font-medium text-slate-900 dark:text-white">{f.value[s] ? <StepValue f={f} step={s} /> : <span className="text-slate-500 dark:text-slate-400">Not chosen</span>}</dd>
                </div>
              ))}
              {f.period && <div className="flex justify-between gap-4 py-2.5"><dt className="text-slate-600 dark:text-slate-400">Ends</dt><dd className="font-medium text-slate-900 dark:text-white">{endDate(f.period.days)}</dd></div>}
            </dl>
            <div aria-live="polite" className="mt-4 flex items-baseline justify-between border-t border-slate-200 pt-4 dark:border-white/10">
              <span className="text-slate-600 dark:text-slate-400">Total</span>
              <span className="font-display text-2xl font-bold text-slate-900 dark:text-white">{f.ready ? usd(f.price) : "—"}</span>
            </div>
            <button onClick={f.openPay} disabled={!f.ready} className={`${primary} mt-5 w-full disabled:cursor-not-allowed disabled:opacity-50`}>
              {f.ready ? "Continue to payment" : `Choose ${stepTitle[f.current].toLowerCase()}`}
            </button>
          </aside>
        </div>

        <section aria-labelledby="why" className="mt-20"><Heading id="why">Why rent a number</Heading><div className="mt-6"><Points /></div></section>
        <section aria-labelledby="faq" className="mt-16 max-w-3xl"><Heading id="faq">Common questions</Heading><div className="mt-6"><RentFaq /></div></section>
      </div>
      <RentPayModal f={f} />
    </PageShell>
  );
}
