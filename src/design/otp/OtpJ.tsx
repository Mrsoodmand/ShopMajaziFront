"use client";
import { useState } from "react";
import { Minus, Plus, Wallet, CreditCard, Bitcoin, Check, Lock, AlertCircle } from "lucide-react";
import { cheapest, offersFor, otpApps, WALLET_BALANCE } from "@/content/otp-en";
import { useMoney } from "@/lib/money";
import Combo from "./Combo";
import { useOtpOrders } from "./order";
import { AppTile, Assurances, CC, OrderCard, PageShell, PageTitle, SuccessBar } from "./parts";

type Pay = "wallet" | "card" | "crypto";
const payMethods = (usd: (n: number) => string): { id: Pay; label: string; desc: string; icon: typeof Wallet }[] => [
  { id: "wallet", label: "Wallet", desc: `Balance ${usd(WALLET_BALANCE)}`, icon: Wallet },
  { id: "card", label: "Card", desc: "Visa, Mastercard, local cards", icon: CreditCard },
  { id: "crypto", label: "Crypto", desc: "USDT, BTC, TON", icon: Bitcoin },
];

// Page J — "Checkout": a familiar e-commerce checkout. Configure the number (app, country, quantity) on the left,
// choose how to pay, and review the order summary on the right. Buying several numbers at once is built in.
export default function OtpJ() {
  const usd = useMoney().format;
  const [appId, setAppId] = useState("whatsapp");
  const [cc, setCc] = useState(() => cheapest("whatsapp").country.cc);
  const [qty, setQty] = useState(1);
  const [pay, setPay] = useState<Pay>("wallet");
  const { orders, buy, cancel } = useOtpOrders();
  const offers = [...offersFor(appId)].sort((a, b) => a.price - b.price);
  const offer = offers.find((o) => o.country.cc === cc)!;
  const subtotal = offer.price * qty;
  const fee = pay === "card" ? Math.round(subtotal * 0.03 * 100) / 100 : 0; // placeholder card fee
  const total = subtotal + fee;
  const short = pay === "wallet" && total > WALLET_BALANCE;
  const checkout = () => { for (let i = 0; i < qty; i++) buy(offer); };

  return (
    <PageShell>
      <div className="mx-auto max-w-6xl px-6 py-14">
        <PageTitle title="Buy virtual numbers" sub="Configure, pay, and receive your codes in your dashboard." />
        <div className="mt-10 grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
          <div className="space-y-6">
            <section className="rounded-3xl bg-white p-6 ring-1 ring-slate-200 dark:bg-[#0E1424] dark:ring-white/10">
              <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-white">1. Your number</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <Combo label="App" value={appId} onChange={(id) => { setAppId(id); setCc(cheapest(id).country.cc); }} placeholder="Choose app"
                  items={otpApps.map((a) => ({ id: a.id, label: a.name, hint: `from ${usd(cheapest(a.id).price)}`, icon: <AppTile app={a} size="sm" /> }))} />
                <Combo label="Country" value={cc} onChange={setCc} placeholder="Choose country"
                  items={offers.map((o) => ({ id: o.country.cc, label: o.country.name, search: o.country.cc, hint: usd(o.price), icon: <CC cc={o.country.cc} flag={o.country.flag} /> }))} />
              </div>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-slate-50 p-4 dark:bg-white/5">
                <div className="flex items-center gap-6 text-sm">
                  <span><span className="block text-xs text-slate-500 dark:text-slate-400">Success rate</span><SuccessBar pct={offer.success} /></span>
                  <span><span className="block text-xs text-slate-500 dark:text-slate-400">In stock</span><span className="font-semibold text-slate-900 dark:text-white">{offer.stock.toLocaleString("en-US")}</span></span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-slate-500 dark:text-slate-400">Quantity</span>
                  <div className="flex items-center rounded-xl bg-white ring-1 ring-slate-200 dark:bg-white/5 dark:ring-white/10">
                    <button onClick={() => setQty((q) => Math.max(1, q - 1))} disabled={qty === 1} aria-label="Fewer" className="grid h-10 w-10 place-items-center disabled:opacity-30"><Minus className="h-4 w-4" /></button>
                    <span className="w-8 text-center font-semibold tabular-nums text-slate-900 dark:text-white" aria-live="polite">{qty}</span>
                    <button onClick={() => setQty((q) => Math.min(5, q + 1))} disabled={qty === 5} aria-label="More" className="grid h-10 w-10 place-items-center disabled:opacity-30"><Plus className="h-4 w-4" /></button>
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-3xl bg-white p-6 ring-1 ring-slate-200 dark:bg-[#0E1424] dark:ring-white/10">
              <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-white">2. Payment</h2>
              <div role="radiogroup" aria-label="Payment method" className="mt-4 grid gap-3 sm:grid-cols-3">
                {payMethods(usd).map((m) => {
                  const on = pay === m.id;
                  return (
                    <button key={m.id} role="radio" aria-checked={on} onClick={() => setPay(m.id)}
                      className={`relative rounded-2xl p-4 text-start ring-1 transition ${on ? "bg-indigo-50 ring-2 ring-indigo-500 dark:bg-indigo-500/10" : "ring-slate-200 hover:ring-slate-300 dark:ring-white/10 dark:hover:ring-white/25"}`}>
                      {on && <span className="absolute end-3 top-3 grid h-5 w-5 place-items-center rounded-full bg-indigo-600 text-white"><Check className="h-3 w-3" /></span>}
                      <m.icon className="h-5 w-5 text-slate-700 dark:text-slate-200" />
                      <div className="mt-3 font-semibold text-slate-900 dark:text-white">{m.label}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">{m.desc}</div>
                    </button>
                  );
                })}
              </div>
            </section>

            {orders.length > 0 && (
              <section className="space-y-3">
                <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-white">Your numbers</h2>
                <div className="grid gap-3 md:grid-cols-2">{orders.map((o) => <OrderCard key={o.id} order={o} onCancel={() => cancel(o.id)} />)}</div>
              </section>
            )}
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-3xl bg-white p-6 ring-1 ring-slate-200 dark:bg-[#0E1424] dark:ring-white/10">
              <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-white">Order summary</h2>
              <div className="mt-5 flex items-center gap-3">
                <AppTile app={offer.app} />
                <div className="min-w-0 flex-1"><div className="truncate font-semibold text-slate-900 dark:text-white">{offer.app.name} number</div><div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400"><CC cc={offer.country.cc} flag={offer.country.flag} />{offer.country.name}</div></div>
                <span className="text-sm text-slate-500 dark:text-slate-400">× {qty}</span>
              </div>
              <dl className="mt-6 space-y-2 border-t border-slate-100 pt-4 text-sm dark:border-white/10">
                <div className="flex justify-between"><dt className="text-slate-500 dark:text-slate-400">{usd(offer.price)} × {qty}</dt><dd className="text-slate-900 dark:text-white">{usd(subtotal)}</dd></div>
                <div className="flex justify-between"><dt className="text-slate-500 dark:text-slate-400">Payment fee</dt><dd className="text-slate-900 dark:text-white">{fee ? usd(fee) : "Free"}</dd></div>
                <div className="flex justify-between border-t border-slate-100 pt-3 text-base font-semibold dark:border-white/10"><dt className="text-slate-900 dark:text-white">Total</dt><dd className="font-display text-xl text-slate-900 dark:text-white">{usd(total)}</dd></div>
              </dl>
              {short && <p className="mt-4 flex items-start gap-2 rounded-xl bg-amber-50 p-3 text-xs text-amber-800 dark:bg-amber-500/10 dark:text-amber-300"><AlertCircle className="h-4 w-4 shrink-0" />Not enough in your wallet. Top up or pick another payment method.</p>}
              <button onClick={checkout} disabled={short} className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 py-4 text-base font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50">
                <Lock className="h-4 w-4" />Pay {usd(total)}
              </button>
              <p className="mt-3 text-center text-xs text-slate-500 dark:text-slate-400">No code within 20 minutes? Each number is refunded automatically.</p>
            </div>
          </aside>
        </div>
        <div className="mt-10"><Assurances /></div>
      </div>
    </PageShell>
  );
}
