"use client";
import { useEffect, useId, useRef, useState } from "react";
import { ArrowLeft, Check } from "lucide-react";
import { useMoney } from "@/lib/money";
import { GV_PRICE, gvCities } from "@/content/google-voice-en";
import { PageShell } from "../otp/parts";
import { Faq, GvCheckout, Included, OrderView, useGv } from "./parts";
import { H2, NumberRadios, primary, secondary, Summary } from "./clean";

const steps = ["City", "Number", "Review"];

// Page J — "Guided Steps": one question per screen, for first-time buyers. A clear "Step 2 of 3" progress, Back and
// Continue buttons, and focus moves to each new question so keyboard and screen-reader users land in the right place.
export default function GvJ() {
  const usd = useMoney().format;
  const gv = useGv();
  const [step, setStep] = useState(0);
  const [city, setCity] = useState(gvCities[0].city);
  const heading = useRef<HTMLHeadingElement>(null);
  const first = useRef(true);
  const cityName = useId();
  const cur = gvCities.find((c) => c.city === city)!;

  // Move focus to the new question (not on first load).
  useEffect(() => { if (first.current) { first.current = false; return; } heading.current?.focus(); }, [step]);

  if (gv.order) return <PageShell><div className="px-6 py-14"><OrderView gv={gv} /></div></PageShell>;

  const pickCity = (c: string) => { setCity(c); gv.setSelected(gvCities.find((x) => x.city === c)!.numbers[0]); };
  const titles = ["Which city should your number be from?", `Choose a number in ${city}`, "Check your order"];

  return (
    <PageShell>
      <div className="mx-auto max-w-2xl px-6 pb-24 pt-14">
        <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">Google Voice · {usd(GV_PRICE)} one time</p>

        <nav aria-label="Progress" className="mt-6">
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Step {step + 1} of {steps.length}</p>
          <ol className="mt-3 grid grid-cols-3 gap-2">
            {steps.map((s, i) => (
              <li key={s} aria-current={i === step ? "step" : undefined}>
                <span aria-hidden className={`block h-2 rounded-full transition-colors duration-500 ${i <= step ? "bg-emerald-700 dark:bg-emerald-400" : "bg-slate-200 dark:bg-white/15"}`} />
                <span className={`mt-2 flex items-center gap-1 text-sm ${i === step ? "font-semibold text-slate-900 dark:text-white" : "text-slate-600 dark:text-slate-400"}`}>
                  {i < step && <Check aria-hidden className="h-4 w-4 text-emerald-700 dark:text-emerald-400" />}{s}{i < step && <span className="sr-only"> (done)</span>}
                </span>
              </li>
            ))}
          </ol>
        </nav>

        <div key={step} className="mt-10 animate-fade-up [animation-duration:350ms]">
          <h1 ref={heading} tabIndex={-1} className="font-display text-3xl font-bold tracking-tight text-slate-900 outline-none sm:text-4xl dark:text-white">{titles[step]}</h1>

          {step === 0 && (
            <fieldset className="mt-6">
              <legend className="sr-only">City</legend>
              <div className="grid gap-3 sm:grid-cols-2">
                {gvCities.map((c) => {
                  const on = c.city === city;
                  return (
                    <label key={c.city} className={`flex cursor-pointer items-center gap-3 rounded-2xl border-2 px-4 py-3.5 transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-emerald-600 has-[:focus-visible]:ring-offset-2 dark:has-[:focus-visible]:ring-emerald-400 dark:has-[:focus-visible]:ring-offset-[#070B14] ${on ? "border-emerald-700 bg-white dark:border-emerald-400 dark:bg-[#0E1424]" : "border-slate-200 bg-white hover:border-slate-400 dark:border-white/15 dark:bg-[#0E1424] dark:hover:border-white/40"}`}>
                      <input type="radio" autoComplete="off" name={cityName} checked={on} onChange={() => pickCity(c.city)} className="sr-only" />
                      <span aria-hidden className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 ${on ? "border-emerald-700 bg-emerald-700 dark:border-emerald-400 dark:bg-emerald-400" : "border-slate-400 dark:border-white/30"}`}>{on && <Check className="h-3.5 w-3.5 text-white dark:text-emerald-950" strokeWidth={3} />}</span>
                      <span className="flex-1">
                        <span className="block text-lg font-semibold text-slate-900 dark:text-white">{c.city}, {c.state}</span>
                        <span className="text-sm text-slate-600 dark:text-slate-400">Area code {c.areas.join(", ")} · {c.numbers.length} available</span>
                      </span>
                    </label>
                  );
                })}
              </div>
            </fieldset>
          )}

          {step === 1 && <div className="mt-6"><NumberRadios legend={`Numbers in ${city}`} hideLegend list={cur.numbers} gv={gv} size="lg" /></div>}

          {step === 2 && (
            <div className="mt-6 space-y-6">
              <Summary gv={gv} title="Order summary" />
              <section aria-labelledby="included" className="rounded-3xl border border-slate-200 p-6 dark:border-white/15"><H2 id="included">Included</H2><div className="mt-4"><Included /></div></section>
            </div>
          )}
        </div>

        <div className="mt-8 flex items-center justify-between gap-3">
          {step > 0 ? <button onClick={() => setStep(step - 1)} className={secondary}><ArrowLeft aria-hidden className="h-4 w-4 rtl:rotate-180" />Back</button> : <span />}
          {step < 2 && <button onClick={() => setStep(step + 1)} className={primary}>Continue</button>}
        </div>

        <section aria-labelledby="faq" className="mt-24"><H2 id="faq">Common questions</H2><div className="mt-6"><Faq /></div></section>
      </div>
      <GvCheckout gv={gv} />
    </PageShell>
  );
}
