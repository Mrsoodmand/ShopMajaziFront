"use client";
import { Clock } from "lucide-react";
import { useMoney } from "@/lib/money";
import { methodInfo, type AppleMethod } from "@/content/apple-en";
import { PageShell } from "../otp/parts";
import { AppleCheckout, AppleFaq, AppleOrderView, ContinueButton, CustomForm, ErrorSummary, H2, MethodIcon, Quantity, useApple, type AppleState } from "./parts";

function Column({ a, m }: { a: AppleState; m: AppleMethod }) {
  const usd = useMoney().format;
  const info = methodInfo[m];
  return (
    <section aria-labelledby={`col-${m}`} className="flex flex-col rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 dark:border-white/15 dark:bg-[#0E1424]">
      <div className="flex items-center gap-3">
        <MethodIcon m={m} />
        <div className="min-w-0 flex-1">
          <h2 id={`col-${m}`} className="font-display text-xl font-semibold text-slate-900 dark:text-white">{info.title}</h2>
          <p className="flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-400"><Clock aria-hidden className="h-4 w-4" />{info.delivery} · {usd(info.price)}{m === "ready" && " each"}</p>
        </div>
      </div>
      <p className="mt-4 text-slate-700 dark:text-slate-300">{info.tagline}</p>
      <div className="mt-5 flex-1 space-y-5">
        {m === "custom" && <ErrorSummary a={a} />}
        {m === "ready" ? <Quantity a={a} hint={false} /> : <CustomForm a={a} />}
      </div>
      <ContinueButton a={a} className="mt-6" />
    </section>
  );
}

// Page J — "Side by Side": no switching. Ready and Custom sit next to each other on desktop, each with its own buy
// button; on phones they stack, Ready first, so the fastest option is right at the top.
export default function AppleJ() {
  const ready = useApple("ready");
  const custom = useApple("custom");
  const done = ready.order ? ready : custom.order ? custom : null;
  if (done) return <PageShell><div className="px-6 py-14"><AppleOrderView a={done} /></div></PageShell>;

  return (
    <PageShell>
      <div className="mx-auto max-w-5xl px-4 pb-24 pt-10 sm:px-6 sm:pt-14">
        <p className="text-sm font-semibold text-sky-800 dark:text-sky-300">Apple ID · United States</p>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl dark:text-white">Two ways to get a US Apple ID</h1>
        <div className="mt-8 grid items-start gap-5 lg:grid-cols-2">
          <Column a={ready} m="ready" />
          <Column a={custom} m="custom" />
        </div>
        <section aria-labelledby="faq" className="mt-20 max-w-3xl"><H2 id="faq">Common questions</H2><div className="mt-6"><AppleFaq /></div></section>
      </div>
      <AppleCheckout a={ready} />
      <AppleCheckout a={custom} />
    </PageShell>
  );
}
