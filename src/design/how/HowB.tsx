"use client";

import { useEffect, useState } from "react";
import { Search, CreditCard, Bitcoin, Wallet, Check, Copy, MessageSquare } from "lucide-react";

const steps = [
  { title: "Choose a service", desc: "Search or browse. Pick the country, plan or package you need." },
  { title: "Pay in seconds", desc: "Card, crypto or wallet balance. Top up once and buy with one click." },
  { title: "Receive it instantly", desc: "Your number, code or login appears in the dashboard right away." },
];
const DURATION = 5000;

// Offer B — "Interactive Stepper": dark, matches hero A. Steps auto-advance with a progress bar; the screen on the right shows each step.
export default function HowB() {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setStep((s) => (s + 1) % steps.length), DURATION);
    return () => clearTimeout(t);
  }, [step]);

  return (
    <section className="relative overflow-hidden bg-[#070B14] py-24 text-white">
      <div aria-hidden className="pointer-events-none absolute -bottom-40 start-1/3 h-96 w-[700px] rounded-full bg-indigo-600/20 blur-[120px]" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-6 lg:grid-cols-2">
        <div>
          <span className="text-sm font-semibold uppercase tracking-widest text-cyan-300">How to buy</span>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-5xl">Three steps. About thirty seconds.</h2>
          <ol className="mt-10 space-y-3">
            {steps.map((s, i) => {
              const on = i === step;
              return (
                <li key={s.title}>
                  <button onClick={() => setStep(i)} className={`relative w-full overflow-hidden rounded-2xl border p-5 text-start transition ${on ? "border-white/15 bg-white/[.06]" : "border-transparent hover:bg-white/[.03]"}`}>
                    <div className="flex items-start gap-4">
                      <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full font-mono text-sm font-bold ${on ? "bg-indigo-500 text-white" : "bg-white/5 text-slate-500"}`}>{i + 1}</span>
                      <div>
                        <div className={`font-display text-lg font-semibold ${on ? "text-white" : "text-slate-400"}`}>{s.title}</div>
                        <div className={`grid transition-all duration-300 ${on ? "mt-1 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                          <p className="overflow-hidden text-sm text-slate-400">{s.desc}</p>
                        </div>
                      </div>
                    </div>
                    {on && <span key={step} className="absolute bottom-0 start-0 h-0.5 bg-gradient-to-r from-indigo-400 to-cyan-300" style={{ animation: `grow ${DURATION}ms linear forwards` }} />}
                  </button>
                </li>
              );
            })}
          </ol>
        </div>

        <div className="relative rounded-3xl border border-white/10 bg-white/[.04] p-6 shadow-2xl shadow-indigo-950/50 backdrop-blur-xl">
          <div className="mb-5 flex gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-white/20" /><span className="h-2.5 w-2.5 rounded-full bg-white/20" /><span className="h-2.5 w-2.5 rounded-full bg-white/20" /></div>
          <div className="min-h-[300px]">
            {step === 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 rounded-xl border border-indigo-400/40 bg-slate-950/60 px-4 py-3 text-sm"><Search className="h-4 w-4 text-slate-400" />whatsapp germ<span className="h-4 w-px animate-pulse bg-white" /></div>
                {[["WhatsApp number · Germany", "$0.42", true], ["WhatsApp number · Netherlands", "$0.35", false], ["WhatsApp number · UK", "$0.48", false]].map(([n, p, on]) => (
                  <div key={n as string} className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm ${on ? "bg-indigo-500/20 ring-1 ring-indigo-400/50" : "bg-white/[.03]"}`}>
                    <span>{n as string}</span><span className="font-semibold">{p as string}</span>
                  </div>
                ))}
              </div>
            )}
            {step === 1 && (
              <div>
                <div className="flex items-center justify-between text-sm text-slate-400"><span>WhatsApp number · Germany</span><span className="font-display text-2xl font-bold text-white">$0.42</span></div>
                <div className="mt-6 grid grid-cols-3 gap-3">
                  {[[Wallet, "Wallet", true], [CreditCard, "Card", false], [Bitcoin, "Crypto", false]].map(([I, l, on]) => {
                    const Icon = I as typeof Wallet;
                    return <div key={l as string} className={`flex flex-col items-center gap-2 rounded-xl py-5 text-sm ${on ? "bg-indigo-500/20 ring-1 ring-indigo-400/60" : "bg-white/[.03] text-slate-400"}`}><Icon className="h-5 w-5" />{l as string}</div>;
                  })}
                </div>
                <div className="mt-4 rounded-xl bg-white/[.03] px-4 py-3 text-xs text-slate-400">Wallet balance: <span className="font-semibold text-white">$48.20</span></div>
                <button className="mt-4 w-full rounded-xl bg-indigo-500 py-3.5 text-sm font-semibold">Pay $0.42</button>
              </div>
            )}
            {step === 2 && (
              <div className="space-y-3">
                <div className="rounded-xl bg-white/[.04] p-4">
                  <div className="flex items-center justify-between text-xs text-slate-400"><span>Your number · Germany</span><span className="flex items-center gap-1 text-emerald-300"><Check className="h-3.5 w-3.5" />Active</span></div>
                  <div className="mt-2 flex items-center justify-between font-mono text-xl font-semibold">+49 1521 448 0937<Copy className="h-4 w-4 text-slate-500" /></div>
                </div>
                <div className="rounded-xl bg-emerald-500 p-4 text-white shadow-lg shadow-emerald-500/20">
                  <div className="flex items-center gap-1.5 text-xs text-emerald-50"><MessageSquare className="h-3.5 w-3.5" />WhatsApp · just now</div>
                  <div className="mt-1 font-mono text-3xl font-bold tracking-widest">482 913</div>
                </div>
                <div className="text-center text-xs text-slate-500">Delivered in 27 seconds</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
