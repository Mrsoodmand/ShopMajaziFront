"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Check } from "lucide-react";
import { PageShell } from "../otp/parts";
import { useHasExtras } from "../service/slot";
import { accent, AdErrorSummary, AdPreview, AdsCheckout, BudgetField, ButtonField, card, ContactField, GoalRadios, H2, LinkField, ring, TargetingFields, TextField, TgFaq, TgOrderView, Title, TitleField, useAds } from "./parts";
import { AdSummary, Estimate, Rules, SubmitAd } from "./ads";

// Ads C — "Step by Step": four short steps (what you promote, the ad, audience, budget and review) with a clickable
// step bar. Each step is checked before moving on, and focus moves to the new step's heading.

const steps = ["Promote", "Your ad", "Audience", "Budget"] as const;

export default function AdsC() {
  const a = useAds();
  const extras = useHasExtras();
  const [step, setStep] = useState(0);
  const [reached, setReached] = useState(0);
  const head = useRef<HTMLHeadingElement>(null);
  const first = useRef(true);
  useEffect(() => { if (first.current) { first.current = false; return; } head.current?.focus(); }, [step]);
  if (a.order) return <PageShell><div className="px-6 py-14"><TgOrderView o={a.order} onAgain={a.reset} /></div></PageShell>;

  const checks = [["link"], ["text", "button"], ["targeting"], ["budget", "contact"]] as const;
  const next = () => { if (!a.stepOk([...checks[step]])) return; const n = step + 1; setStep(n); setReached((r) => Math.max(r, n)); };
  const titles = ["What do you want to promote?", "Write your ad", "Who should see it?", "Budget and review"];

  return (
    <PageShell>
      <div className="mx-auto max-w-5xl px-4 pb-24 pt-14 sm:px-6">
        <Title s="ads" sub="Four short steps. We submit the ad to Telegram for you.">Create a Telegram ad</Title>

        <nav aria-label="Steps" className="mt-10">
          <ol className="grid grid-cols-4 gap-2">
            {steps.map((s, i) => {
              const done = i < step, now = i === step, can = i <= reached;
              return (
                <li key={s}>
                  <button type="button" disabled={!can} onClick={() => setStep(i)} aria-current={now ? "step" : undefined}
                    className={`w-full rounded-xl text-start disabled:cursor-not-allowed ${ring}`}>
                    <span aria-hidden className={`block h-1.5 rounded-full ${done || now ? "bg-sky-600 dark:bg-sky-400" : "bg-slate-200 dark:bg-white/10"}`} />
                    <span className={`mt-2 flex items-center gap-1.5 text-sm font-semibold ${now ? accent.ads.text : done ? "text-slate-900 dark:text-white" : "text-slate-500"}`}>
                      {done && <Check aria-hidden className="h-4 w-4" />}<span className="hidden sm:inline">{i + 1} · </span>{s}<span className="sr-only">{done ? ", done" : now ? ", current" : ""}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </nav>

        <div className="mt-8 grid grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
          <section aria-labelledby="step-h" className={`${card} p-6 sm:p-8`}>
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">Step {step + 1} of {steps.length}</p>
            <H2 id="step-h" className="mt-1"><span ref={head} tabIndex={-1} className="outline-none">{titles[step]}</span></H2>
            <div key={step} className="mt-6 animate-fade-up space-y-6 [animation-duration:300ms]">
              {step === 0 && <><GoalRadios a={a} legend="Choose one" /><LinkField a={a} /></>}
              {step === 1 && <><TitleField a={a} /><TextField a={a} rows={4} /><ButtonField a={a} /></>}
              {step === 2 && <TargetingFields a={a} />}
              {step === 3 && <><AdErrorSummary a={a} /><BudgetField a={a} /><Estimate a={a} /><ContactField a={a} /></>}
            </div>
            <div className="mt-8 flex items-center justify-between gap-3 border-t border-slate-200 pt-6 dark:border-white/10">
              {step > 0 ? <button type="button" onClick={() => setStep(step - 1)} className={`flex items-center gap-1.5 rounded-xl px-4 py-3 font-semibold text-slate-800 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/5 ${ring}`}><ArrowLeft aria-hidden className="h-4 w-4 rtl:rotate-180" />Back</button> : <span />}
              {step < 3 ? <button type="button" onClick={next} className={accent.ads.btn}>Continue</button> : <div className="w-full max-w-xs"><SubmitAd a={a} /></div>}
            </div>
          </section>
          <div className="space-y-5 lg:sticky lg:top-24 lg:self-start">
            <AdPreview a={a} />
            {step === 3 ? <AdSummary a={a} /> : <Rules />}
          </div>
        </div>
        {!extras && <section aria-labelledby="faq" className="mt-20 max-w-3xl"><H2 id="faq">Common questions</H2><div className="mt-6"><TgFaq s="ads" /></div></section>}
      </div>
      <AdsCheckout a={a} />
    </PageShell>
  );
}
