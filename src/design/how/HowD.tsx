"use client";

import { Search, CreditCard, Bitcoin, Wallet, MessageSquare, ShieldCheck, Headphones, RefreshCcw } from "lucide-react";
import { useT } from "@/i18n/client";

// Offer D — "Bento Steps": three big step cards, each with a small picture of that step, plus a wide guarantee strip. Matches hero B and G.
export default function HowD() {
  const tx = useT();
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-xl">
            <span className="text-sm font-semibold uppercase tracking-widest text-violet-600">{tx("How to buy")}</span>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl">{tx("Buying is easier than ordering coffee.")}</h2>
          </div>
          <a href="#" className="rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-800 hover:border-slate-400">{tx("Read the full guide")}</a>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          <article className="flex flex-col rounded-3xl bg-violet-100 p-7 text-violet-950">
            <span className="font-display text-6xl font-bold text-violet-300">01</span>
            <h3 className="mt-4 font-display text-xl font-semibold">{tx("Choose a service")}</h3>
            <p className="mt-2 text-sm text-violet-900/70">{tx("Search 2,000+ services or browse by category.")}</p>
            <div className="mt-auto pt-8">
              <div className="flex items-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm text-slate-500 shadow-sm"><Search className="h-4 w-4" />{tx("Google Voice…")}</div>
              <div className="mt-2 flex flex-wrap gap-1.5">{[tx("Numbers"), tx("Apple ID"), tx("ChatGPT"), tx("Telegram")].map((c) => <span key={c} className="rounded-full bg-white/70 px-3 py-1 text-xs font-medium">{c}</span>)}</div>
            </div>
          </article>

          <article className="flex flex-col rounded-3xl bg-sky-100 p-7 text-sky-950">
            <span className="font-display text-6xl font-bold text-sky-300">02</span>
            <h3 className="mt-4 font-display text-xl font-semibold">{tx("Pay your way")}</h3>
            <p className="mt-2 text-sm text-sky-900/70">{tx("Card, crypto or your wallet balance. Top up once, buy in one click.")}</p>
            <div className="mt-auto grid grid-cols-3 gap-2 pt-8">
              {[[CreditCard, tx("Card")], [Bitcoin, tx("Crypto")], [Wallet, tx("Wallet")]].map(([I, l]) => {
                const Icon = I as typeof Wallet;
                return <div key={l as string} className="flex flex-col items-center gap-1.5 rounded-2xl bg-white py-4 text-xs font-medium shadow-sm"><Icon className="h-5 w-5" />{l as string}</div>;
              })}
            </div>
          </article>

          <article className="flex flex-col rounded-3xl bg-emerald-100 p-7 text-emerald-950">
            <span className="font-display text-6xl font-bold text-emerald-300">03</span>
            <h3 className="mt-4 font-display text-xl font-semibold">{tx("Get it instantly")}</h3>
            <p className="mt-2 text-sm text-emerald-900/70">{tx("Delivered automatically to your dashboard, usually in under 30 seconds.")}</p>
            <div className="mt-auto pt-8">
              <div className="rounded-2xl bg-emerald-600 p-4 text-white shadow-sm">
                <div className="flex items-center gap-1.5 text-xs text-emerald-100"><MessageSquare className="h-3.5 w-3.5" />{tx("Your code · now")}</div>
                <div className="mt-1 font-mono text-2xl font-bold tracking-widest">482 913</div>
              </div>
            </div>
          </article>
        </div>

        <div className="mt-4 grid gap-4 rounded-3xl bg-slate-900 p-7 text-white sm:grid-cols-3">
          {[[ShieldCheck, tx("Secure payments"), tx("Encrypted checkout, no card details stored.")], [RefreshCcw, tx("Automatic refunds"), tx("No delivery means your money goes back.")], [Headphones, "24/7 support", tx("Real people on chat, any time.")]].map(([I, t, d]) => {
            const Icon = I as typeof Wallet;
            return (
              <div key={t as string} className="flex items-start gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/10"><Icon className="h-5 w-5" /></span>
                <div><div className="font-semibold">{t as string}</div><div className="text-sm text-slate-400">{d as string}</div></div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
