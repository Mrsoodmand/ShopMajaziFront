"use client";
import { useRef } from "react";
import { Check } from "lucide-react";
import { useMoney } from "@/lib/money";
import { methodInfo, type AppleMethod } from "@/content/apple-en";
import { PageShell } from "../otp/parts";
import { ring } from "../googleVoice/clean";
import { AppleCheckout, AppleFaq, AppleOrderView, AppleTitle, ContinueButton, CustomForm, ErrorSummary, H2, MethodIcon, Quantity, useApple } from "./parts";

const tabs: AppleMethod[] = ["ready", "custom"];

// Page B — "Two Tabs": one calm column with two tabs, Ready and Custom (proper keyboard tabs: arrow keys, Home, End).
// Each tab holds everything for that kind: what you get, the quantity or the form, the total and the buy button.
export default function AppleB({ method }: { method?: string }) {
  const usd = useMoney().format;
  const a = useApple(method === "custom" ? "custom" : "ready");
  const refs = useRef<Record<AppleMethod, HTMLButtonElement | null>>({ ready: null, custom: null });
  if (a.order) return <PageShell><div className="px-6 py-14"><AppleOrderView a={a} /></div></PageShell>;

  const onKey = (e: React.KeyboardEvent) => {
    const i = tabs.indexOf(a.method);
    const rtl = getComputedStyle(e.currentTarget).direction === "rtl";
    const next = { ArrowRight: rtl ? i - 1 : i + 1, ArrowLeft: rtl ? i + 1 : i - 1, Home: 0, End: tabs.length - 1 }[e.key];
    if (next === undefined) return;
    e.preventDefault();
    const m = tabs[(next + tabs.length) % tabs.length];
    a.setMethod(m);
    refs.current[m]?.focus();
  };
  const info = methodInfo[a.method];

  return (
    <PageShell>
      <div className="mx-auto max-w-3xl px-6 pb-24 pt-14">
        <AppleTitle sub="Two ways to get a US Apple ID. Pick a tab.">Get your Apple ID</AppleTitle>

        <div role="tablist" aria-label="Kind of Apple ID" onKeyDown={onKey} className="mt-10 grid grid-cols-2 gap-1 rounded-2xl border border-slate-300 bg-white p-1 dark:border-white/15 dark:bg-white/5">
          {tabs.map((m) => {
            const on = a.method === m;
            return (
              <button key={m} ref={(el) => { refs.current[m] = el; }} role="tab" id={`tab-${m}`} aria-selected={on} aria-controls="apple-panel" tabIndex={on ? 0 : -1} onClick={() => a.setMethod(m)}
                className={`rounded-xl px-4 py-3 text-start transition-colors ${on ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900" : "text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-white/5"} ${ring}`}>
                <span className="block font-semibold">{methodInfo[m].title}</span>
                <span className={`text-sm ${on ? "opacity-80" : "text-slate-600 dark:text-slate-400"}`}>{usd(methodInfo[m].price)} · {methodInfo[m].delivery}</span>
              </button>
            );
          })}
        </div>

        <div id="apple-panel" role="tabpanel" aria-labelledby={`tab-${a.method}`} key={a.method} className="mt-6 animate-fade-up rounded-3xl border border-slate-200 bg-white p-6 [animation-duration:300ms] sm:p-8 dark:border-white/15 dark:bg-[#0E1424]">
          <div className="flex items-start gap-4">
            <MethodIcon m={a.method} size="lg" />
            <div><H2>{info.title}</H2><p className="mt-1 text-slate-700 dark:text-slate-300">{info.tagline}</p></div>
          </div>
          <ul className="mt-6 grid gap-2 sm:grid-cols-3">
            {info.points.map((p) => <li key={p} className="flex gap-2 text-[15px] text-slate-700 dark:text-slate-300"><Check aria-hidden className="mt-1 h-4 w-4 shrink-0 text-sky-700 dark:text-sky-400" />{p}</li>)}
          </ul>
          <div className="mt-8 space-y-6 border-t border-slate-200 pt-8 dark:border-white/10">
            {a.method === "custom" && <ErrorSummary a={a} />}
            {a.method === "ready" ? <Quantity a={a} /> : <CustomForm a={a} />}
          </div>
          <div aria-live="polite" className="mt-8 flex items-baseline justify-between border-t border-slate-200 pt-6 dark:border-white/10">
            <span className="text-slate-700 dark:text-slate-300">Total</span><span className="font-display text-3xl font-bold text-slate-900 dark:text-white">{usd(a.total)}</span>
          </div>
          <ContinueButton a={a} className="mt-5" />
        </div>

        <section aria-labelledby="faq" className="mt-20"><H2 id="faq">Common questions</H2><div className="mt-6"><AppleFaq /></div></section>
      </div>
      <AppleCheckout a={a} />
    </PageShell>
  );
}
