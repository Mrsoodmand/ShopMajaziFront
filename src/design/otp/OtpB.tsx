"use client";
import { useState } from "react";
import { ArrowLeft, Check, Search, ArrowRight } from "lucide-react";
import { cheapest, offersFor, otpApps, type OtpOffer } from "@/content/otp-en";
import { useMoney } from "@/lib/money";
import { useOtpOrders } from "./order";
import { AppTile, Assurances, CC, OrderCard, PageShell, PageTitle, SuccessBar, WalletChip } from "./parts";

const steps = ["App", "Country", "Code"];

// Page B — "Step-by-step Wizard": one question at a time in a single centered card: which app, which country,
// then your number and code. Calm and impossible to get lost in; good for first-time buyers.
export default function OtpB() {
  const usd = useMoney().format;
  const [step, setStep] = useState(0);
  const [appId, setAppId] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const { orders, buy, cancel } = useOtpOrders();
  const order = orders[0];
  const app = otpApps.find((a) => a.id === appId);

  const pickApp = (id: string) => { setAppId(id); setQ(""); setStep(1); };
  const pickOffer = (o: OtpOffer) => { buy(o); setStep(2); };
  const filteredApps = otpApps.filter((a) => a.name.toLowerCase().includes(q.trim().toLowerCase()));
  const offers = appId ? offersFor(appId).filter((o) => o.country.name.toLowerCase().includes(q.trim().toLowerCase())).sort((a, b) => a.price - b.price) : [];

  return (
    <PageShell>
      <div className="mx-auto max-w-3xl px-6 py-14">
        <PageTitle center title="Get a verification code in 3 steps" sub="No account setup, no waiting. Refund if the code doesn't arrive." />

        <ol className="mx-auto mt-10 flex max-w-md items-center">
          {steps.map((s, i) => (
            <li key={s} className="flex flex-1 items-center last:flex-none">
              <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full text-sm font-bold transition duration-500 ${i < step ? "bg-emerald-500 text-white" : i === step ? "bg-indigo-600 text-white ring-4 ring-indigo-200 dark:ring-indigo-500/30" : "bg-white text-slate-400 ring-1 ring-slate-200 dark:bg-white/5 dark:ring-white/10"}`}>
                {i < step ? <Check className="h-4 w-4" /> : i + 1}
              </span>
              <span className={`ms-2 text-sm font-medium ${i === step ? "text-slate-900 dark:text-white" : "text-slate-400"}`}>{s}</span>
              {i < steps.length - 1 && <span className="mx-3 h-0.5 flex-1 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10"><span className={`block h-full bg-emerald-500 transition-all duration-500 ${i < step ? "w-full" : "w-0"}`} /></span>}
            </li>
          ))}
        </ol>

        <div className="mt-8 rounded-[2rem] bg-white p-6 shadow-xl shadow-indigo-100/60 ring-1 ring-slate-200 sm:p-8 dark:bg-[#0E1424] dark:shadow-black/30 dark:ring-white/10">
          {step > 0 && step < 2 && (
            <button onClick={() => { setStep(step - 1); setQ(""); }} className="mb-4 flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"><ArrowLeft className="h-4 w-4 rtl:rotate-180" />Back</button>
          )}

          {step < 2 && (
            <label className="relative block">
              <Search className="pointer-events-none absolute start-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={step === 0 ? "Which app do you need a code for?" : `Search countries for ${app?.name}…`} aria-label="Search"
                className="h-13 w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 ps-12 pe-4 text-base outline-none focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:ring-indigo-500/20" />
            </label>
          )}

          {step === 0 && (
            <div key="apps" className="mt-6 grid animate-fade-up grid-cols-2 gap-3 [animation-duration:300ms] sm:grid-cols-4">
              {filteredApps.map((a) => (
                <button key={a.id} onClick={() => pickApp(a.id)} className="group flex flex-col items-center gap-3 rounded-2xl p-4 text-center ring-1 ring-slate-200 transition duration-300 hover:-translate-y-1 hover:shadow-lg hover:ring-indigo-300 dark:ring-white/10 dark:hover:ring-indigo-400/50">
                  <AppTile app={a} size="lg" />
                  <span className="text-sm font-semibold text-slate-900 dark:text-white">{a.name}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">from {usd(cheapest(a.id).price)}</span>
                </button>
              ))}
            </div>
          )}

          {step === 1 && app && (
            <ul key="countries" className="mt-6 max-h-[460px] animate-fade-up space-y-2 overflow-y-auto [animation-duration:300ms]">
              {offers.map((o, i) => (
                <li key={o.country.cc}>
                  <button onClick={() => pickOffer(o)} className="group flex w-full items-center gap-4 rounded-2xl p-3 text-start ring-1 ring-slate-200 transition duration-300 hover:bg-indigo-50/50 hover:ring-indigo-300 dark:ring-white/10 dark:hover:bg-white/[.03] dark:hover:ring-indigo-400/50">
                    <CC cc={o.country.cc} flag={o.country.flag} />
                    <span className="min-w-0 flex-1"><span className="block truncate font-medium text-slate-900 dark:text-white">{o.country.name}{i === 0 && <span className="ms-2 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">Cheapest</span>}</span><SuccessBar pct={o.success} /></span>
                    <span className="font-display text-lg font-bold text-slate-900 dark:text-white">{usd(o.price)}</span>
                    <ArrowRight className="h-5 w-5 text-slate-300 transition group-hover:translate-x-1 group-hover:text-indigo-600 rtl:rotate-180 dark:text-slate-600" />
                  </button>
                </li>
              ))}
            </ul>
          )}

          {step === 2 && order && (
            <div className="space-y-5">
              <OrderCard order={order} onCancel={() => cancel(order.id)} />
              <p className="text-center text-sm text-slate-500 dark:text-slate-400">Enter this number in {order.offer.app.name}. The code appears here automatically.</p>
              <div className="flex justify-center gap-3">
                <button onClick={() => { setStep(0); setAppId(null); }} className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 ring-1 ring-slate-200 hover:ring-slate-300 dark:text-slate-200 dark:ring-white/15">Buy another number</button>
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-center"><WalletChip /></div>
        <div className="mt-10"><Assurances /></div>
      </div>
    </PageShell>
  );
}
