"use client";

import { useMemo, useState } from "react";
import { AlertCircle, CreditCard, Loader2, ReceiptText, Wallet, X } from "lucide-react";
import { PageShell } from "../otp/parts";
import { useT } from "@/i18n/client";
import type { AccountOrder, OrderCharge } from "@/content/account-en";
import { Passbook, type OrderPaySlots, type OrderSlot, type View } from "./AccountC";
import { card, errorText, payBtn, secondary, smallBtn, useAccountDemo, useFmt, type Store } from "./kit";

// Offers for money an order still asks for, and for the buyer's own cancel:
//  - an order support made for the buyer (admin › ثبت سفارش جدید) waits for them to pay it;
//  - support added an extra amount (tax, VAT…) to an order already paid;
//  - a pending order can be cancelled by the buyer; everything paid goes back to the wallet.
// Shown inside the whole Passbook order page. Sample: #20501 PayPal account made by support (unpaid),
// #20502 Instagram followers, paid, with VAT added and still cancellable.

const ORDER_CHARGE: OrderCharge = { id: 1, kind: "order", title: "Order price", price: 3_450_000, paid: false, at: "2026-10-29T08:40:00" };
const VAT: OrderCharge = { id: 2, kind: "extra", title: "Value added tax (VAT)", price: 98_000, paid: false, at: "2026-10-29T09:30:00" };

const samples: AccountOrder[] = [
  {
    id: 20501, kind: "custom", service: "Custom order", title: "PayPal business account setup", detail: "Made for you by support",
    state: "awaiting-payment", price: 3_450_000, paidWith: "wallet", at: "2026-10-29T08:40:00",
    charges: [ORDER_CHARGE], due: 3_450_000, cancellable: false,
    delivery: { type: "details", fields: [{ label: "PayPal business account setup", value: "Verified business account, linked to your Wise card" }], note: "" },
  },
  {
    id: 20502, kind: "social", service: "Instagram", title: "Instagram followers", detail: "10,000 · @arash.k",
    state: "delivering", price: 1_250_000, paidWith: "wallet", at: "2026-10-29T08:55:00",
    charges: [VAT], due: 98_000, cancellable: true,
    delivery: { type: "details", fields: [{ label: "Instagram page", value: "@arash.k" }], note: "Support starts it within a few hours." },
  },
];

function useOrderPayDemo(): Store {
  const demo = useAccountDemo();
  const [orders, setOrders] = useState(samples);
  const [wallet, setWallet] = useState<number | null>(null);
  return useMemo(() => {
    const balance = wallet ?? demo.wallet;
    const patch = (id: number, f: (o: AccountOrder) => AccountOrder) => setOrders((l) => l.map((o) => (o.id === id ? f(o) : o)));
    const payOrder = async (id: number, method: "wallet" | "card") => {
      await new Promise((r) => setTimeout(r, 700));
      const o = orders.find((x) => x.id === id)!;
      if (method === "wallet" && balance < (o.due ?? 0)) throw new Error("Your wallet balance isn't enough.");
      if (method === "wallet") setWallet(balance - (o.due ?? 0));
      patch(id, (x) => ({ ...x, state: x.state === "awaiting-payment" ? "delivering" : x.state, due: 0, cancellable: true, charges: x.charges?.map((c) => ({ ...c, paid: true })) }));
    };
    const cancelOrder = async (id: number) => {
      await new Promise((r) => setTimeout(r, 700));
      const o = orders.find((x) => x.id === id)!;
      const back = o.price + (o.charges ?? []).filter((c) => c.paid && c.kind === "extra").reduce((s, c) => s + c.price, 0);
      setWallet(balance + back);
      patch(id, (x) => ({ ...x, state: "refunded", cancellable: false, due: 0, charges: x.charges?.filter((c) => c.paid), refund: { amount: back, reason: "Cancelled by you", at: "2026-10-29T10:30:00" } }));
    };
    return { ...demo, wallet: balance, orders: [...orders, ...demo.orders], payOrder, cancelOrder };
  }, [demo, orders, wallet]);
}

/* ---------- Shared pieces ---------- */

const unpaid = (o: AccountOrder) => (o.charges ?? []).filter((c) => !c.paid);
const isMade = (o: AccountOrder) => (o.charges ?? []).some((c) => c.kind === "order" && !c.paid);

// Wallet or card, then Pay. Card goes to the bank (the wallet is topped up with what it's short of, then pays).
function PayControls({ order, demo, compact = false }: { order: AccountOrder; demo: Store; compact?: boolean }) {
  const t = useT();
  const f = useFmt();
  const due = order.due ?? 0;
  const enough = demo.wallet >= due;
  const [method, setMethod] = useState<"wallet" | "card">(enough ? "wallet" : "card");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pay = async () => {
    setBusy(true); setError(null);
    try { await demo.payOrder?.(order.id, method); } catch (e) { setError(errorText(e, t("Something went wrong. Please try again."))); } finally { setBusy(false); }
  };
  const opt = (m: "wallet" | "card", Icon: typeof Wallet, title: string, sub: string, disabled = false) => (
    <label className={`flex cursor-pointer items-center gap-3 rounded-2xl border p-3 transition-colors ${method === m ? "border-indigo-600 bg-indigo-50 dark:border-indigo-400 dark:bg-indigo-500/10" : "border-slate-200 dark:border-white/15"} ${disabled ? "cursor-not-allowed opacity-50" : ""}`}>
      <input type="radio" name={`pay-${order.id}`} className="sr-only" checked={method === m} disabled={disabled} onChange={() => setMethod(m)} />
      <Icon aria-hidden className="h-5 w-5 shrink-0 text-indigo-700 dark:text-indigo-300" />
      <span className="min-w-0"><span className="block text-[15px] font-semibold text-slate-900 dark:text-white">{title}</span><span className="block text-sm text-slate-600 dark:text-slate-400">{sub}</span></span>
    </label>
  );
  return (
    <div>
      <fieldset className={`grid gap-2 ${compact ? "" : "sm:grid-cols-2"}`}>
        <legend className="sr-only">{t("How to pay")}</legend>
        {opt("wallet", Wallet, t("From wallet"), enough ? t("Balance {0}", { 0: f.money(demo.wallet) }) : t("Not enough · balance {0}", { 0: f.money(demo.wallet) }), !enough)}
        {opt("card", CreditCard, t("By card"), t("Through the bank gateway"))}
      </fieldset>
      {error && <p role="alert" className="mt-3 flex items-start gap-2 rounded-xl bg-rose-50 p-3 text-sm text-rose-700 dark:bg-rose-500/10 dark:text-rose-300"><AlertCircle aria-hidden className="mt-0.5 h-4 w-4 shrink-0" />{t(error)}</p>}
      <button type="button" onClick={pay} disabled={busy} className={`${payBtn} mt-3 !py-3.5`}>
        {busy ? <Loader2 aria-hidden className="h-5 w-5 animate-spin" /> : null}
        {busy ? t("Paying…") : t("Pay {0}", { 0: f.money(due) })}
      </button>
    </div>
  );
}

// The buyer's cancel, with the amount that goes back and an inline confirm.
function CancelOrder({ order, demo, tone = "button" }: { order: AccountOrder; demo: Store; tone?: "button" | "link" }) {
  const t = useT();
  const f = useFmt();
  const [asking, setAsking] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  if (!order.cancellable) return null;
  const back = order.price + (order.charges ?? []).filter((c) => c.paid && c.kind === "extra").reduce((s, c) => s + c.price, 0);
  const run = async () => {
    setBusy(true); setError(null);
    try { await demo.cancelOrder?.(order.id); } catch (e) { setError(errorText(e, t("Couldn't cancel. Please try again."))); setBusy(false); }
  };
  if (asking)
    return (
      <div role="group" aria-label={t("Cancel this order?")} className="rounded-2xl bg-rose-50 p-4 dark:bg-rose-500/10">
        <p className="text-[15px] text-slate-800 dark:text-slate-200">{t("Cancel the order?")} <b className="text-slate-900 dark:text-white">{f.money(back)}</b> {t("goes back to your wallet right away.")}</p>
        {error && <p role="alert" className="mt-2 text-sm font-semibold text-red-700 dark:text-red-400">{error}</p>}
        <div className="mt-3 flex flex-wrap gap-2">
          <button type="button" onClick={run} disabled={busy} className={`${smallBtn} bg-red-700 text-white hover:bg-red-800 disabled:opacity-60 dark:bg-red-500 dark:hover:bg-red-400`}>{busy ? <Loader2 aria-hidden className="h-4 w-4 animate-spin" /> : <X aria-hidden className="h-4 w-4" />}{t("Yes, cancel")}</button>
          <button type="button" onClick={() => setAsking(false)} className={`${smallBtn} border border-slate-300 text-slate-800 hover:bg-white dark:border-white/20 dark:text-slate-100 dark:hover:bg-white/5`}>{t("Keep it")}</button>
        </div>
      </div>
    );
  return tone === "link"
    ? <button type="button" onClick={() => setAsking(true)} className="text-sm font-semibold text-red-700 underline-offset-4 hover:underline dark:text-red-400">{t("Cancel this order")}</button>
    : <button type="button" onClick={() => setAsking(true)} className={`${secondary} !py-3 !text-red-700 dark:!text-red-400`}><X aria-hidden className="h-4 w-4" />{t("Cancel & refund")}</button>;
}

function DueList({ order }: { order: AccountOrder }) {
  const t = useT();
  const f = useFmt();
  return (
    <ul className="divide-y divide-slate-200 dark:divide-white/10">
      {unpaid(order).map((c) => (
        <li key={c.id} className="flex items-baseline justify-between gap-3 py-2.5">
          <span className="text-[15px] text-slate-800 dark:text-slate-200">{c.kind === "order" ? t("Order price") : t(c.title)}</span>
          <span className="text-[15px] font-semibold tabular-nums text-slate-900 dark:text-white">{f.money(c.price)}</span>
        </li>
      ))}
    </ul>
  );
}

/* ---------- A · Pay Banner: an amber band across the top of the order ---------- */

export const BannerTop: OrderSlot = ({ order, demo }) => {
  const t = useT();
  const f = useFmt();
  if (!order.due) return null;
  return (
    <section aria-labelledby="pay-a" className="mb-6 rounded-3xl border border-amber-300 bg-amber-50 p-6 sm:p-8 dark:border-amber-400/30 dark:bg-amber-400/10">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
        <div>
          <h2 id="pay-a" className="font-display text-xl font-bold text-amber-950 dark:text-amber-100">
            {isMade(order) ? t("Support made this order for you") : t("{0} more to pay", { 0: f.money(order.due) })}
          </h2>
          <p className="mt-1 text-[15px] text-amber-900 dark:text-amber-200">
            {isMade(order) ? t("Pay it and support starts right away.") : t("Support added this to your order. Your order goes on as usual.")}
          </p>
          <div className="mt-3"><DueList order={order} /></div>
        </div>
        <PayControls key={order.id} order={order} demo={demo} compact />
      </div>
    </section>
  );
};
export const BannerAside: OrderSlot = ({ order, demo }) => (order.cancellable ? <div className={`${card} p-6`}><CancelOrder order={order} demo={demo} tone="link" /></div> : null);

/* ---------- B · In the Money table: unpaid lines and Pay where the money is ---------- */

const MoneyRows: OrderSlot = ({ order, demo }) => {
  const t = useT();
  const f = useFmt();
  if (!order.due) return null;
  return (
    <div className="mt-6 rounded-2xl border-2 border-dashed border-amber-400 p-5 dark:border-amber-400/50">
      <h3 className="flex items-center gap-2 text-[15px] font-semibold text-amber-900 dark:text-amber-200"><ReceiptText aria-hidden className="h-5 w-5" />{t("Still to pay")}</h3>
      <DueList order={order} />
      <div className="mt-1 flex items-baseline justify-between border-t border-slate-200 pt-3 dark:border-white/10">
        <span className="font-semibold text-slate-900 dark:text-white">{t("To pay")}</span>
        <span className="font-display text-2xl font-bold tabular-nums text-slate-900 dark:text-white">{f.money(order.due)}</span>
      </div>
      <div className="mt-4"><PayControls key={order.id} order={order} demo={demo} /></div>
    </div>
  );
};
const MoneyAside: OrderSlot = ({ order, demo }) => {
  const t = useT();
  if (!order.cancellable) return null;
  return (
    <div className={`${card} p-6`}>
      <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-white">{t("Changed your mind?")}</h2>
      <p className="mb-4 mt-1 text-[15px] text-slate-700 dark:text-slate-300">{t("Until support starts it, you can cancel; everything you paid goes back to your wallet.")}</p>
      <CancelOrder order={order} demo={demo} />
    </div>
  );
};

/* ---------- C · Side Pay Card: a dark card at the top of the side column ---------- */

const SideCard: OrderSlot = ({ order, demo }) => {
  const t = useT();
  const f = useFmt();
  return (
    <>
      {!!order.due && (
        <section aria-labelledby="pay-c" className="rounded-3xl bg-indigo-950 p-6 text-white dark:bg-[#15123a]">
          <p className="text-sm text-indigo-200">{t("To pay")}</p>
          <h2 id="pay-c" className="font-display text-3xl font-bold tabular-nums">{f.money(order.due)}</h2>
          <ul className="mt-3 space-y-1.5 text-sm text-indigo-100">
            {unpaid(order).map((c) => <li key={c.id} className="flex justify-between gap-3"><span>{c.kind === "order" ? t("Order price") : t(c.title)}</span><span className="tabular-nums">{f.num(c.price)}</span></li>)}
          </ul>
          <div className="mt-4 rounded-2xl bg-white p-3 text-slate-900 dark:bg-[#0E1424]"><PayControls key={order.id} order={order} demo={demo} compact /></div>
        </section>
      )}
      {order.cancellable && (
        <div className={`${card} p-6`}>
          <h2 className="mb-3 font-display text-lg font-semibold text-slate-900 dark:text-white">{t("Not started yet")}</h2>
          <CancelOrder order={order} demo={demo} />
        </div>
      )}
    </>
  );
};

/* ---------- The offers ---------- */

function offer(slots: OrderPaySlots) {
  return function Offer() {
    const demo = useOrderPayDemo();
    const t = useT();
    const [view, setView] = useState<View>({ page: "order", id: 20501 });
    return (
      <PageShell>
        <div className="mx-auto flex max-w-[1280px] flex-wrap gap-2 px-4 pt-4">
          {samples.map((s) => (
            <button key={s.id} type="button" onClick={() => setView({ page: "order", id: s.id })} className={`${smallBtn} ${view.page === "order" && view.id === s.id ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900" : "border border-slate-300 dark:border-white/20"}`}>
              #{s.id} · {t(s.id === 20501 ? "Made by support, unpaid" : "Paid, VAT added, cancellable")}
            </button>
          ))}
        </div>
        <Passbook store={demo} view={view} go={setView} OrderPay={slots} />
      </PageShell>
    );
  };
}

export const OrderPayA = offer({ Top: BannerTop, Aside: BannerAside });
export const OrderPayB = offer({ Money: MoneyRows, Aside: MoneyAside });
export const OrderPayC = offer({ Aside: SideCard });
