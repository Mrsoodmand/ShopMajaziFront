"use client";

import { useEffect, useState } from "react";
import { Bitcoin, Check, ChevronLeft, CreditCard, Smartphone, Wallet, Apple, Send, Mic } from "lucide-react";
import { useT } from "@/i18n/client";
import { Glossy, WhyHeading, pageBg, reason, tone, useInView, type Reason } from "./parts";

// Offer H — "Phone Story": a phone in the middle plays a real order (choose → pay → delivered) on a loop, and the
// reason cards on both sides light up when the phone reaches the step they're about. Pointing at the section holds
// the current step; with reduced motion it rests on "delivered".
const STEPS = [
  { id: "choose", label: "Choose", lit: ["catalog", "support"] },
  { id: "pay", label: "Pay", lit: ["pay", "private"] },
  { id: "done", label: "Delivered", lit: ["speed", "refund"] },
] as const;

function ReasonCard({ r, on }: { r: Reason; on: boolean }) {
  const t = useT();
  return (
    <div className={`flex gap-4 rounded-3xl p-5 ring-1 transition duration-500 ease-out ${on ? "bg-white shadow-xl shadow-blue-100/70 ring-blue-200 dark:bg-[#121a2e] dark:shadow-black/40 dark:ring-blue-400/30" : "bg-white/50 ring-slate-200/70 opacity-70 dark:bg-white/[.03] dark:ring-white/10"}`}>
      <Glossy icon={r.icon} tone={r.tone} size={48} className={`transition duration-500 ${on ? "scale-100" : "scale-90 saturate-50"}`} />
      <div>
        <h3 className="font-display text-base font-bold text-slate-900 dark:text-white">{t(r.title)}</h3>
        <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-400">{t(r.desc)}</p>
      </div>
    </div>
  );
}

function Screen({ step }: { step: number }) {
  const t = useT();
  const show = (i: number) => `absolute inset-0 flex flex-col p-4 transition duration-500 ease-out ${step === i ? "opacity-100 translate-y-0" : "pointer-events-none opacity-0 translate-y-3"}`;
  return (
    <div className="relative h-full">
      <div className={show(0)}>
        <span className="text-xs text-slate-400">{t("What do you need?")}</span>
        <div className="mt-3 space-y-2">
          {[[Smartphone, "Virtual number", "green"], [Apple, "Apple ID", "violet"], [Send, "Telegram Premium", "blue"], [Mic, "Google Voice", "amber"]].map(([I, l, c], i) => (
            <div key={l as string} className={`flex items-center gap-3 rounded-2xl p-2.5 ${i === 0 ? "bg-white/10 ring-1 ring-white/20" : ""}`}>
              <Glossy icon={I as typeof Apple} tone={c as "green"} size={34} />
              <span className="flex-1 text-sm text-white">{t(l as string)}</span>
              <ChevronLeft className="h-4 w-4 text-slate-500 ltr:rotate-180" />
            </div>
          ))}
        </div>
      </div>
      <div className={show(1)}>
        <span className="text-xs text-slate-400">{t("Pay with")}</span>
        <div className="mt-3 space-y-2">
          {[[Wallet, "Wallet balance"], [CreditCard, "Bank card"], [Bitcoin, "Crypto"]].map(([I, l], i) => {
            const Icon = I as typeof Wallet;
            return (
              <div key={l as string} className={`flex items-center gap-3 rounded-2xl p-3 ring-1 ${i === 0 ? "bg-emerald-500/15 ring-emerald-400/50" : "ring-white/10"}`}>
                <Icon className="h-5 w-5 text-slate-300" />
                <span className="flex-1 text-sm text-white">{t(l as string)}</span>
                <span className={`h-4 w-4 rounded-full ring-2 ${i === 0 ? "bg-emerald-400 ring-emerald-400" : "ring-slate-600"}`} />
              </div>
            );
          })}
        </div>
        <div className="mt-auto rounded-2xl bg-emerald-500 py-3 text-center text-sm font-semibold text-white">{t("Pay")}</div>
      </div>
      <div className={show(2)}>
        <div className="mt-4 flex flex-col items-center text-center">
          <span className="grid h-14 w-14 place-items-center rounded-full bg-emerald-500 text-white shadow-[0_0_0_8px_rgba(16,185,129,.2)]"><Check className="h-7 w-7" /></span>
          <span className="mt-4 text-sm font-semibold text-white">{t("Code received")}</span>
          <span dir="ltr" className="mt-3 rounded-2xl bg-white/10 px-4 py-3 font-mono text-2xl font-bold tracking-[.3em] text-white">482 913</span>
          <span className="mt-3 text-xs text-slate-400">{t("Delivered in 12 seconds")}</span>
        </div>
      </div>
    </div>
  );
}

export default function WhyH() {
  const t = useT();
  const [ref, seen] = useInView();
  const [step, setStep] = useState(0);
  const [hold, setHold] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setStep(2); return; }
    if (!seen || hold) return;
    const id = setInterval(() => setStep((s) => (s + 1) % STEPS.length), 3200);
    return () => clearInterval(id);
  }, [seen, hold]);

  const lit = new Set<string>(STEPS[step].lit);
  const side = (ids: string[]) => ids.map((id) => <ReasonCard key={id} r={reason(id)} on={lit.has(id)} />);

  return (
    <section className={`${pageBg} py-24`} onMouseEnter={() => setHold(true)} onMouseLeave={() => setHold(false)}>
      <div ref={ref} className="mx-auto max-w-6xl px-6">
        <WhyHeading center title="See it the way you'll use it" sub="Choose, pay, and it's delivered. Every step is built around a promise." />

        <div className="mt-14 grid items-center gap-6 lg:grid-cols-[1fr_auto_1fr]">
          <div className="order-2 space-y-4 lg:order-1">{side(["catalog", "pay", "speed"])}</div>

          <div className="order-1 mx-auto lg:order-2">
            <div className="relative h-[520px] w-[260px] rounded-[44px] bg-slate-900 p-3 shadow-[0_40px_80px_-30px_rgba(15,23,42,.6)] ring-[10px] ring-slate-200 dark:ring-white/10">
              <div className="flex items-center justify-between px-4 pt-2 text-[11px] font-semibold text-white" dir="ltr"><span>14:36</span><span className="h-4 w-16 rounded-full bg-black" /><span>100%</span></div>
              <div className="mx-1 mt-4 flex gap-1.5">
                {STEPS.map((s, i) => (
                  <button key={s.id} type="button" onClick={() => setStep(i)} className={`flex-1 rounded-full py-1.5 text-[11px] font-semibold transition ${i === step ? "bg-white text-slate-900" : "text-slate-400 hover:text-white"}`}>{t(s.label)}</button>
                ))}
              </div>
              <div className="mt-2 h-[400px]"><Screen step={step} /></div>
            </div>
          </div>

          <div className="order-3 space-y-4">{side(["support", "private", "refund"])}</div>
        </div>
        <p className="mt-6 text-center text-xs text-slate-500 lg:hidden">{t(STEPS[step].label)} · <span className={tone("blue").ink}>{STEPS[step].lit.map((id) => t(reason(id).title)).join(" · ")}</span></p>
      </div>
    </section>
  );
}
