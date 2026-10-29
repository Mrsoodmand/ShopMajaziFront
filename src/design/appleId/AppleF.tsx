"use client";

import { ChevronRight, RotateCcw, ShieldCheck, Zap } from "lucide-react";
import { PageShell } from "../otp/parts";
import { ring } from "../googleVoice/clean";
import { AppleCheckout, AppleFaq, AppleOrderView, CompareTable, ContinueButton, CustomForm, ErrorSummary, Quantity, useApple } from "./parts";
import { MethodToggle, tagline } from "./quick";

// Page F — "One Card": the whole purchase in one small card that fits on a phone screen: Ready / Custom switch,
// the quantity or the short form, and the buy button. Everything else (comparison, FAQ) is folded away below.
export default function AppleF({ method }: { method?: string }) {
  const a = useApple(method === "custom" ? "custom" : "ready");
  if (a.order) return <PageShell><div className="px-6 py-14"><AppleOrderView a={a} /></div></PageShell>;

  return (
    <PageShell>
      <div className="mx-auto max-w-md px-4 pb-24 pt-10 sm:pt-16">
        <h1 className="text-center font-display text-3xl font-bold tracking-tight text-slate-900 dark:text-white">US Apple ID</h1>
        <p className="mt-2 text-center text-slate-600 dark:text-slate-400">{tagline(a)}</p>

        <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 dark:border-white/15 dark:bg-[#0E1424]">
          <MethodToggle a={a} />
          <div key={a.method} className="mt-6 animate-fade-up space-y-5 [animation-duration:250ms]">
            {a.method === "custom" && <ErrorSummary a={a} />}
            {a.method === "ready" ? <Quantity a={a} /> : <CustomForm a={a} />}
          </div>
          <ContinueButton a={a} className="mt-6" />
        </div>

        <ul className="mt-5 flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm text-slate-600 dark:text-slate-400">
          <li className="flex items-center gap-1.5"><Zap aria-hidden className="h-4 w-4 text-amber-600 dark:text-amber-400" />US region</li>
          <li className="flex items-center gap-1.5"><ShieldCheck aria-hidden className="h-4 w-4 text-sky-700 dark:text-sky-400" />Verified</li>
          <li className="flex items-center gap-1.5"><RotateCcw aria-hidden className="h-4 w-4 text-emerald-700 dark:text-emerald-400" />Replace or refund</li>
        </ul>

        <div className="mt-12 space-y-3">
          <details className="group rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/15 dark:bg-[#0E1424] [&_summary::-webkit-details-marker]:hidden">
            <summary className={`flex cursor-pointer list-none items-center justify-between rounded-lg font-semibold text-slate-900 dark:text-white ${ring}`}>Ready or custom: what's the difference?<ChevronRight aria-hidden className="h-4 w-4 text-slate-500 transition group-open:rotate-90 rtl:rotate-180" /></summary>
            <div className="mt-4"><CompareTable /></div>
          </details>
          <details className="group rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/15 dark:bg-[#0E1424] [&_summary::-webkit-details-marker]:hidden">
            <summary className={`flex cursor-pointer list-none items-center justify-between rounded-lg font-semibold text-slate-900 dark:text-white ${ring}`}>Common questions<ChevronRight aria-hidden className="h-4 w-4 text-slate-500 transition group-open:rotate-90 rtl:rotate-180" /></summary>
            <div className="mt-4"><AppleFaq /></div>
          </details>
        </div>
      </div>
      <AppleCheckout a={a} />
    </PageShell>
  );
}
