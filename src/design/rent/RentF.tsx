"use client";

import { useEffect, useRef } from "react";
import { Check, Pencil } from "lucide-react";
import { PageShell } from "../otp/parts";
import { ring } from "../googleVoice/clean";
import { MethodSwitch, PayAgain, RentPayModal, StepChoices, stepTitle, StepValue, useRentFlow, type StepId } from "./flow";
import { Heading, Points, RentFaq, RentOrderView, Title } from "./parts";

const ask: Record<StepId, string> = { period: "How long do you need it?", country: "Which country?", app: "Which app is it for?" };

// Page F — "Step by Step": choose all apps or one app, then answer the questions in order down the page.
// Finished steps fold into one line with a Change button; the next step opens below and gets focus.
// The last choice opens the payment window.
export default function RentF() {
  const f = useRentFlow();
  const heads = useRef<Partial<Record<StepId, HTMLHeadingElement | null>>>({});
  const prev = useRef(f.current);
  // Move focus to the step that just opened.
  useEffect(() => { if (prev.current !== f.current) heads.current[f.current]?.focus(); prev.current = f.current; }, [f.current]);

  if (f.order) return <PageShell><div className="px-6 py-14"><RentOrderView order={f.order} onReset={f.reset} /></div></PageShell>;

  return (
    <PageShell>
      <div className="mx-auto max-w-3xl px-6 pb-24 pt-14">
        <Title sub="Keep a number for a week or a month and receive every SMS. Use it for all your apps, or for one app at a lower price.">Rent a number</Title>
        <section aria-labelledby="how" className="mt-10">
          <h2 id="how" className="text-sm font-semibold text-slate-900 dark:text-white">How do you want to rent?</h2>
          <div className="mt-3"><MethodSwitch f={f} variant="cards" /></div>
        </section>

        <ol key={f.method} className="mt-10 space-y-4">
          {f.steps.map((s, i) => {
            const done = f.value[s];
            const open = !done && f.unlocked(s);
            return (
              <li key={s} className={`rounded-3xl border bg-white p-5 transition-opacity dark:bg-[#0E1424] ${open ? "border-slate-300 dark:border-white/20" : "border-slate-200 dark:border-white/10"} ${!done && !open ? "opacity-60" : ""}`}>
                <div className="flex items-center gap-3">
                  <span aria-hidden className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-sm font-bold ${done ? "bg-emerald-700 text-white dark:bg-emerald-400 dark:text-emerald-950" : "bg-slate-900 text-white dark:bg-white dark:text-slate-900"}`}>{done ? <Check className="h-4 w-4" /> : i + 1}</span>
                  <h3 ref={(el) => { heads.current[s] = el; }} tabIndex={-1} className="flex-1 font-display text-lg font-semibold text-slate-900 outline-none dark:text-white">
                    {done ? stepTitle[s] : ask[s]}<span className="sr-only">{done ? ", done" : open ? "" : ", locked"}</span>
                  </h3>
                  {done && <span className="text-[15px] font-medium text-slate-800 dark:text-slate-200"><StepValue f={f} step={s} /></span>}
                  {done && <button onClick={() => f.reopen(s)} className={`flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-sm font-semibold text-emerald-800 hover:bg-emerald-50 dark:text-emerald-300 dark:hover:bg-emerald-500/10 ${ring}`}><Pencil aria-hidden className="h-3.5 w-3.5" />Change<span className="sr-only"> {stepTitle[s].toLowerCase()}</span></button>}
                </div>
                {open && <div className="mt-4 animate-fade-up [animation-duration:300ms]"><StepChoices f={f} step={s} /></div>}
                {!done && !open && <p className="mt-2 ps-11 text-sm text-slate-600 dark:text-slate-400">Answer step {i} first.</p>}
              </li>
            );
          })}
        </ol>
        <PayAgain f={f} className="mt-6" />

        <section aria-labelledby="why" className="mt-20"><Heading id="why">Why rent a number</Heading><div className="mt-6"><Points cols={2} /></div></section>
        <section aria-labelledby="faq" className="mt-16"><Heading id="faq">Common questions</Heading><div className="mt-6"><RentFaq /></div></section>
      </div>
      <RentPayModal f={f} />
    </PageShell>
  );
}
