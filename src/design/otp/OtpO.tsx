"use client";
import { useState } from "react";
import { Check, Lock, Wallet, CreditCard, Bitcoin, AlertCircle, Pencil } from "lucide-react";
import { WALLET_BALANCE } from "@/content/otp-en";
import { useMoney } from "@/lib/money";
import { useOtpFlow } from "./flow";
import { AppChoices, CountryChoices } from "./Choices";
import { FirstSwitch, OperatorList, OrderView, RecentOrders } from "./flowParts";
import { AppTile, Assurances, CC, PageShell, PageTitle } from "./parts";

type Pay = "wallet" | "card" | "crypto";
const payMethods = (usd: (n: number) => string) => [
  { id: "wallet" as Pay, label: "Wallet", desc: `Balance ${usd(WALLET_BALANCE)}`, icon: Wallet },
  { id: "card" as Pay, label: "Card", desc: "Visa, Mastercard, local cards", icon: CreditCard },
  { id: "crypto" as Pay, label: "Crypto", desc: "USDT, BTC, TON", icon: Bitcoin },
];

// Page O — "Checkout": a familiar e-commerce checkout. Three numbered sections (app ⇄ country, operator) fold into a
// one-line summary with "Change" once chosen; the order summary and payment sit on the right. After paying,
// the page becomes the order.
export default function OtpO() {
  const usd = useMoney().format;
  const f = useOtpFlow("app");
  const [pay, setPay] = useState<Pay>("wallet");
  const total = f.operator ? f.operator.price + (pay === "card" ? Math.round(f.operator.price * 3) / 100 : 0) : 0; // placeholder 3% card fee
  const short = pay === "wallet" && total > WALLET_BALANCE;
  const appSection = { title: "App", done: !!f.app, summary: f.app && <span className="flex items-center gap-2"><AppTile app={f.app} size="sm" />{f.app.name}</span>, change: () => f.clearApp(), body: <AppChoices options={f.appOptions} value={f.app?.id ?? null} onPick={f.pickApp} priced={f.appsPriced} /> };
  const countrySection = { title: "Country", done: !!f.country, summary: f.country && <span className="flex items-center gap-2"><CC cc={f.country.cc} flag={f.country.flag} />{f.country.name}</span>, change: () => f.clearCountry(), body: <CountryChoices options={f.countryOptions} value={f.country?.cc ?? null} onPick={f.pickCountry} priced={f.app ? "exact" : "from"} /> };
  const ordered = f.first === "app" ? [appSection, countrySection] : [countrySection, appSection];

  if (f.step === "order" && f.order) {
    return (
      <PageShell>
        <div className="mx-auto max-w-6xl px-6 py-14">
          <PageTitle kicker="Order confirmed" title="Your number is ready" />
          <div className="mt-8 grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[minmax(0,1fr)_320px]"><OrderView order={f.order} flow={f} /><RecentOrders flow={f} /></div>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <PageTitle title="Buy a virtual number" sub="Three quick choices, then pay." />
          <FirstSwitch value={f.first} onChange={f.setFirst} />
        </div>
        <div className="mt-10 grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
          <div className="space-y-4">
            {ordered.map((s, i) => {
              const open = !s.done && (i === 0 || ordered[0].done);
              return (
                <section key={s.title} className="rounded-3xl bg-white ring-1 ring-slate-200 dark:bg-[#0E1424] dark:ring-white/10">
                  <div className="flex items-center gap-3 p-5">
                    <span className={`grid h-8 w-8 place-items-center rounded-full text-sm font-bold ${s.done ? "bg-emerald-500 text-white" : "bg-indigo-600 text-white"}`}>{s.done ? <Check className="h-4 w-4" /> : i + 1}</span>
                    <h2 className="flex-1 font-display text-lg font-semibold text-slate-900 dark:text-white">{s.title}</h2>
                    {s.done && <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{s.summary}</span>}
                    {s.done && <button onClick={s.change} className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-indigo-600 hover:bg-indigo-50 dark:text-indigo-300 dark:hover:bg-indigo-500/10"><Pencil className="h-3.5 w-3.5" />Change</button>}
                  </div>
                  {open && <div className="animate-fade-up px-5 pb-5 [animation-duration:300ms]">{s.body}</div>}
                </section>
              );
            })}
            <section className={`rounded-3xl bg-white ring-1 ring-slate-200 dark:bg-[#0E1424] dark:ring-white/10 ${f.step === "operator" ? "" : "opacity-60"}`}>
              <div className="flex items-center gap-3 p-5">
                <span className={`grid h-8 w-8 place-items-center rounded-full text-sm font-bold ${f.operator ? "bg-emerald-500 text-white" : "bg-indigo-600 text-white"}`}>{f.operator ? <Check className="h-4 w-4" /> : 3}</span>
                <h2 className="flex-1 font-display text-lg font-semibold text-slate-900 dark:text-white">Operator</h2>
              </div>
              {f.step === "operator" && <div className="animate-fade-up px-5 pb-5 [animation-duration:300ms]"><OperatorList ops={f.operators} value={f.operator?.id ?? null} onPick={f.pickOperator} /></div>}
            </section>
          </div>

          <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-3xl bg-white p-6 ring-1 ring-slate-200 dark:bg-[#0E1424] dark:ring-white/10">
              <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-white">Order summary</h2>
              <dl className="mt-4 space-y-2 text-sm">
                {[["App", f.app?.name], ["Country", f.country?.name], ["Operator", f.operator?.name]].map(([k, v]) => (
                  <div key={k} className="flex justify-between"><dt className="text-slate-500 dark:text-slate-400">{k}</dt><dd className={v ? "font-medium text-slate-900 dark:text-white" : "text-slate-400"}>{v ?? "—"}</dd></div>
                ))}
              </dl>
              <div role="radiogroup" aria-label="Payment method" className="mt-5 grid grid-cols-3 gap-2 border-t border-slate-100 pt-5 dark:border-white/10">
                {payMethods(usd).map((m) => (
                  <button key={m.id} role="radio" aria-checked={pay === m.id} onClick={() => setPay(m.id)} title={m.desc}
                    className={`flex flex-col items-center gap-1.5 rounded-xl py-3 text-xs font-medium transition ${pay === m.id ? "bg-indigo-50 text-indigo-700 ring-2 ring-indigo-500 dark:bg-indigo-500/10 dark:text-indigo-200" : "text-slate-600 ring-1 ring-slate-200 hover:ring-slate-300 dark:text-slate-300 dark:ring-white/10"}`}>
                    <m.icon className="h-5 w-5" />{m.label}
                  </button>
                ))}
              </div>
              <div className="mt-5 flex items-baseline justify-between border-t border-slate-100 pt-4 dark:border-white/10">
                <span className="font-semibold text-slate-900 dark:text-white">Total</span>
                <span className="font-display text-2xl font-bold text-slate-900 dark:text-white">{f.operator ? usd(total) : "—"}</span>
              </div>
              {short && <p className="mt-3 flex items-start gap-2 rounded-xl bg-amber-50 p-3 text-xs text-amber-800 dark:bg-amber-500/10 dark:text-amber-300"><AlertCircle className="h-4 w-4 shrink-0" />Not enough in your wallet.</p>}
              <button onClick={() => f.purchase()} disabled={!f.operator || short} className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 py-4 text-base font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-40">
                <Lock className="h-4 w-4" />{f.operator ? `Pay ${usd(total)}` : "Complete the 3 steps"}
              </button>
            </div>
            <RecentOrders flow={f} />
          </aside>
        </div>
        <div className="mt-10"><Assurances /></div>
      </div>
    </PageShell>
  );
}
