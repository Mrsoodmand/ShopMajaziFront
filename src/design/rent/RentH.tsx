"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Check } from "lucide-react";
import { PageShell } from "../otp/parts";
import { secondary } from "../googleVoice/clean";
import { MethodSwitch, PayAgain, RentPayModal, StepChoices, stepTitle, StepValue, useRentFlow, type StepId } from "./flow";
import { Heading, RentFaq, RentOrderView } from "./parts";

const ask: Record<StepId, string> = { period: "How long do you need the number?", country: "Which country should it be from?", app: "Which app is it for?" };

// Page H — "One Question at a Time": for first-time renters. First "All apps or one app?", then one question per
// screen with "Step 2 of 4" progress and a Back button. Picking an answer moves on by itself; the last one opens
// the payment window. Focus moves to each new question.
export default function RentH() {
  const f = useRentFlow();
  const [started, setStarted] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const screen = started ? f.current : null;
  const first = useRef(true);
  useEffect(() => { if (first.current) { first.current = false; return; } heading.current?.focus(); }, [screen, started]);

  if (f.order) return <PageShell><div className="px-6 py-14"><RentOrderView order={f.order} onReset={() => { f.reset(); setStarted(false); }} /></div></PageShell>;

  const total = f.steps.length + 1;
  const at = started ? f.steps.indexOf(f.current) + 2 : 1;
  const back = () => {
    const i = f.steps.indexOf(f.current);
    // On the last step with an answer, Back reopens it; otherwise go to the previous step (or the method question).
    if (f.value[f.current] && i === f.steps.length - 1) f.reopen(f.current);
    else if (i > 0) f.reopen(f.steps[i - 1]);
    else setStarted(false);
  };

  return (
    <PageShell>
      <div className="mx-auto max-w-2xl px-6 pb-24 pt-14">
        <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">Rent a number</p>
        <nav aria-label="Progress" className="mt-5">
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Step {at} of {total}</p>
          <div aria-hidden className="mt-2 flex gap-1.5">{Array.from({ length: total }, (_, i) => <span key={i} className={`h-2 flex-1 rounded-full transition-colors duration-500 ${i < at ? "bg-emerald-700 dark:bg-emerald-400" : "bg-slate-200 dark:bg-white/15"}`} />)}</div>
        </nav>

        {started && f.steps.some((s) => f.value[s]) && (
          <ul aria-label="Your answers" className="mt-6 flex flex-wrap gap-2">
            {f.steps.filter((s) => f.value[s]).map((s) => (
              <li key={s} className="flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-sm text-slate-800 dark:bg-white/10 dark:text-slate-200">
                <Check aria-hidden className="h-3.5 w-3.5 text-emerald-700 dark:text-emerald-400" /><span className="sr-only">{stepTitle[s]}: </span><StepValue f={f} step={s} />
              </li>
            ))}
          </ul>
        )}

        <div key={`${started}-${screen}-${f.method}`} className="mt-8 animate-fade-up [animation-duration:300ms]">
          <h1 ref={heading} tabIndex={-1} className="font-display text-3xl font-bold tracking-tight text-slate-900 outline-none sm:text-4xl dark:text-white">
            {started ? ask[f.current] : "Do you need the number for all apps or one app?"}
          </h1>
          <div className="mt-6">
            {!started ? (
              <>
                <MethodSwitch f={f} variant="cards" />
                <button onClick={() => setStarted(true)} className={`${secondary} mt-6 w-full`}>Continue with {f.method === "all" ? "all apps" : "one app"}</button>
              </>
            ) : <StepChoices f={f} step={f.current} />}
          </div>
          <PayAgain f={f} className="mt-6" />
        </div>

        {started && <button onClick={back} className={`${secondary} mt-8`}><ArrowLeft aria-hidden className="h-4 w-4 rtl:rotate-180" />Back</button>}

        <section aria-labelledby="faq" className="mt-24"><Heading id="faq">Common questions</Heading><div className="mt-6"><RentFaq /></div></section>
      </div>
      <RentPayModal f={f} />
    </PageShell>
  );
}
