"use client";
import { useRef, type ReactNode } from "react";
import { ChevronRight, X } from "lucide-react";
import { useMoney } from "@/lib/money";
import { methodInfo, type AppleMethod } from "@/content/apple-en";
import { PageShell } from "../otp/parts";
import { primary, ring } from "../googleVoice/clean";
import { AppleCheckout, AppleFaq, AppleOrderView, CompareTable, CustomForm, ErrorSummary, H2, MethodIcon, Quantity, useApple, type AppleState } from "./parts";

// A native <dialog>: the browser keeps focus inside, Escape closes it and focus returns to the button that opened it.
// Bottom sheet on phones, centered panel on desktop.
function Sheet({ dref, title, children }: { dref: React.RefObject<HTMLDialogElement | null>; title: string; children: ReactNode }) {
  return (
    <dialog ref={dref} aria-labelledby={`${title}-t`}
      className="m-0 mt-auto w-full max-w-none rounded-t-[2rem] bg-white p-0 text-slate-900 backdrop:bg-slate-950/50 backdrop:backdrop-blur-sm sm:m-auto sm:max-w-lg sm:rounded-[2rem] dark:bg-[#0B1020] dark:text-white">
      <div className="max-h-[88vh] overflow-y-auto p-6">
        <div className="flex items-center justify-between gap-4">
          <h2 id={`${title}-t`} className="font-display text-xl font-semibold">{title}</h2>
          <button onClick={() => dref.current?.close()} aria-label="Close" className={`grid h-10 w-10 place-items-center rounded-full bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-slate-200 ${ring}`}><X aria-hidden className="h-5 w-5" /></button>
        </div>
        <div className="mt-5">{children}</div>
      </div>
    </dialog>
  );
}

function ChoiceButton({ m, onClick }: { m: AppleMethod; onClick: () => void }) {
  const usd = useMoney().format;
  const info = methodInfo[m];
  return (
    <button onClick={onClick} aria-haspopup="dialog"
      className={`flex w-full items-center gap-4 rounded-3xl border-2 border-slate-200 bg-white p-5 text-start transition-colors hover:border-sky-700 dark:border-white/15 dark:bg-[#0E1424] dark:hover:border-sky-400 ${ring}`}>
      <MethodIcon m={m} size="lg" />
      <span className="min-w-0 flex-1">
        <span className="block font-display text-xl font-semibold text-slate-900 dark:text-white">{m === "ready" ? "Buy a ready one" : "Make one with my details"}</span>
        <span className="text-slate-600 dark:text-slate-400">{usd(info.price)} · {info.delivery}</span>
      </span>
      <ChevronRight aria-hidden className="h-6 w-6 text-slate-500 rtl:rotate-180" />
    </button>
  );
}

// Page I — "Two Big Buttons": the page is just two large buttons, Ready and Custom. Each opens a sheet with only
// what it needs (quantity, or the short form) and a Continue button that goes on to payment.
export default function AppleI({ method }: { method?: string }) {
  const usd = useMoney().format;
  const a = useApple(method === "custom" ? "custom" : "ready");
  const ready = useRef<HTMLDialogElement>(null);
  const custom = useRef<HTMLDialogElement>(null);
  if (a.order) return <PageShell><div className="px-6 py-14"><AppleOrderView a={a} /></div></PageShell>;

  const open = (m: AppleMethod) => { a.setMethod(m); (m === "ready" ? ready : custom).current?.showModal(); };
  // Close the sheet first, then open payment (only if the form is fine).
  const go = (d: React.RefObject<HTMLDialogElement | null>, s: AppleState) => {
    const okay = s.method === "ready" || Object.keys(s.allErrors).length === 0;
    if (okay) d.current?.close();
    s.proceed();
  };

  return (
    <PageShell>
      <div className="mx-auto max-w-xl px-4 pb-24 pt-10 sm:pt-16">
        <p className="text-sm font-semibold text-sky-800 dark:text-sky-300">Apple ID · United States</p>
        <h1 className="mt-2 font-display text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl dark:text-white">How do you want your Apple ID?</h1>
        <div className="mt-8 space-y-3">
          <ChoiceButton m="ready" onClick={() => open("ready")} />
          <ChoiceButton m="custom" onClick={() => open("custom")} />
        </div>

        <section aria-labelledby="compare" className="mt-16"><H2 id="compare">Not sure? Compare</H2><div className="mt-6"><CompareTable /></div></section>
        <section aria-labelledby="faq" className="mt-16"><H2 id="faq">Common questions</H2><div className="mt-6"><AppleFaq /></div></section>
      </div>

      <Sheet dref={ready} title="Ready Apple ID">
        <Quantity a={a} />
        <div aria-live="polite" className="mt-6 flex items-baseline justify-between"><span className="text-slate-600 dark:text-slate-400">Total</span><span className="font-display text-2xl font-bold">{usd(a.total)}</span></div>
        <button type="button" onClick={() => go(ready, a)} className={`${primary} mt-4 w-full`}>Continue to payment</button>
      </Sheet>
      <Sheet dref={custom} title="Custom Apple ID">
        <div className="space-y-5">
          <ErrorSummary a={a} />
          <CustomForm a={a} />
        </div>
        <button type="button" onClick={() => go(custom, a)} className={`${primary} mt-6 w-full`}>Continue to payment · {usd(a.total)}</button>
      </Sheet>
      <AppleCheckout a={a} />
    </PageShell>
  );
}
