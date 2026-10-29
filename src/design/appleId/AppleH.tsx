"use client";
import { useId } from "react";
import { ChevronDown, Clock, UserPen } from "lucide-react";
import { useMoney } from "@/lib/money";
import { CUSTOM_PRICE } from "@/content/apple-en";
import { PageShell } from "../otp/parts";
import { ring } from "../googleVoice/clean";
import { AppleCheckout, AppleFaq, AppleOrderView, ContinueButton, CustomForm, ErrorSummary, H2, useApple } from "./parts";

const quick = [1, 2, 3, 5, 10];

// Page H — "Instant First": most people want a ready Apple ID now, so the page opens on exactly that: pick how many
// with one tap and press Buy. Custom is one clear button below that opens the short form in place.
export default function AppleH({ method }: { method?: string }) {
  const usd = useMoney().format;
  const a = useApple(method === "custom" ? "custom" : "ready");
  const name = useId();
  if (a.order) return <PageShell><div className="px-6 py-14"><AppleOrderView a={a} /></div></PageShell>;
  const custom = a.method === "custom";

  return (
    <PageShell>
      <div className="mx-auto max-w-xl px-4 pb-24 pt-10 sm:pt-16">
        <p className="text-sm font-semibold text-sky-800 dark:text-sky-300">Apple ID · United States</p>
        <h1 className="mt-2 font-display text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl dark:text-white">Ready Apple ID, delivered instantly</h1>

        {!custom && (
          <section aria-label="Ready Apple ID" className="mt-8 animate-fade-up [animation-duration:250ms]">
            <fieldset>
              <legend className="text-base font-semibold text-slate-900 dark:text-white">How many?</legend>
              <div className="mt-3 grid grid-cols-5 gap-2">
                {quick.map((n) => {
                  const on = !a.pack && a.qty === n;
                  return (
                    <label key={n} className={`cursor-pointer rounded-2xl border-2 py-3 text-center text-lg font-bold transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-sky-600 has-[:focus-visible]:ring-offset-2 dark:has-[:focus-visible]:ring-sky-400 dark:has-[:focus-visible]:ring-offset-[#070B14] ${on ? "border-sky-700 bg-sky-700 text-white dark:border-sky-400 dark:bg-sky-400 dark:text-sky-950" : "border-slate-200 bg-white text-slate-900 hover:border-slate-400 dark:border-white/15 dark:bg-[#0E1424] dark:text-white"}`}>
                      <input type="radio" autoComplete="off" name={name} checked={on} onChange={() => a.setQty(n)} className="sr-only" />{n}
                    </label>
                  );
                })}
              </div>
            </fieldset>
            <p className="mt-3 flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-400"><Clock aria-hidden className="h-4 w-4" />{usd(a.total / a.count)} each · delivered the moment you pay</p>
            <ContinueButton a={a} className="mt-6 py-4 text-lg" />
          </section>
        )}

        <div className="mt-8">
          <button onClick={() => a.setMethod(custom ? "ready" : "custom")} aria-expanded={custom} aria-controls="custom-panel"
            className={`flex w-full items-center gap-4 rounded-2xl border-2 bg-white p-4 text-start transition-colors dark:bg-[#0E1424] ${custom ? "border-sky-700 dark:border-sky-400" : "border-slate-200 hover:border-slate-400 dark:border-white/15 dark:hover:border-white/40"} ${ring}`}>
            <span aria-hidden className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-sky-100 text-sky-800 dark:bg-sky-500/15 dark:text-sky-300"><UserPen className="h-5 w-5" /></span>
            <span className="flex-1">
              <span className="block font-semibold text-slate-900 dark:text-white">{custom ? "Making a custom Apple ID" : "Want it with your own name and email?"}</span>
              <span className="text-sm text-slate-600 dark:text-slate-400">{custom ? "Or go back to a ready one" : `Custom Apple ID · ${usd(CUSTOM_PRICE)} · about 10 minutes`}</span>
            </span>
            <ChevronDown aria-hidden className={`h-5 w-5 text-slate-500 transition-transform duration-300 ${custom ? "rotate-180" : ""}`} />
          </button>
          {custom && (
            <section id="custom-panel" aria-label="Custom Apple ID" className="mt-6 animate-fade-up space-y-5 [animation-duration:250ms]">
              <ErrorSummary a={a} />
              <CustomForm a={a} />
              <ContinueButton a={a} className="mt-2" />
            </section>
          )}
        </div>

        <section aria-labelledby="faq" className="mt-20"><H2 id="faq">Common questions</H2><div className="mt-6"><AppleFaq /></div></section>
      </div>
      <AppleCheckout a={a} />
    </PageShell>
  );
}
