"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  AlertCircle, Apple, Check, Clock, CreditCard, Info, Loader2, Lock, Minus, Phone, Plus, RotateCcw, ShoppingBag, Sparkles,
  Trash2, Users, Wallet, X,
} from "lucide-react";
import { useT } from "@/i18n/client";
import { faDigits, toman, type T } from "@/i18n/translate";
import { ApiError, TOP_UP_HREF, useAccount } from "@/lib/account";
import { useCart, type CartKind, type CartLine, type Checkout, type CheckoutLine } from "@/lib/cart";
import SignInForm from "@/components/account/SignInForm";
import { errorText } from "@/components/account/errors";

// The cart as a side drawer (design "Side Drawer", design/cart/offers.tsx A): lines with quantity and remove, the
// total, Wallet / Card and one Pay button. After paying it shows what happened to each line.

const focus = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 dark:focus-visible:outline-emerald-400";
const primary = `flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3.5 font-semibold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-40 ${focus}`;
const ghost = `flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-50 dark:text-slate-200 dark:ring-white/15 dark:hover:bg-white/5 ${focus}`;

const KIND: Record<CartKind, { icon: typeof Users; tone: string }> = {
  service: { icon: Users, tone: "bg-pink-50 text-pink-600 dark:bg-pink-500/10 dark:text-pink-300" },
  subscription: { icon: Sparkles, tone: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300" },
  apple_id: { icon: Apple, tone: "bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-slate-200" },
  google_voice: { icon: Phone, tone: "bg-sky-50 text-sky-600 dark:bg-sky-500/10 dark:text-sky-300" },
};

const labelOf = (l: { label: CartLine["label"] }, t: T) => {
  const x = t.locale === "fa" ? l.label.fa : l.label.en;
  return { title: x.title, detail: t.locale === "fa" ? faDigits(x.detail) : x.detail };
};

function Tile({ kind }: { kind: CartKind }) {
  const { icon: Icon, tone } = KIND[kind];
  return <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${tone}`}><Icon aria-hidden className="h-5 w-5" /></span>;
}

function messageOf(e: unknown, t: T, m: (n: number) => string) {
  const code = e instanceof ApiError ? e.code : "";
  const own: Record<string, string> = {
    price_changed: "Prices changed since you opened the cart. Check the new total and pay again.",
    cart_changed: "Something in your cart can't be bought any more. Remove it and pay again.",
    cart_empty: "Your cart is empty.",
    cart_full: "Your cart is full. Pay for what's in it first.",
    kind_invalid: "This can't go in the cart.",
  };
  return own[code] ? t(own[code]) : errorText(e, t, m);
}

export function CartButton({ className = "" }: { className?: string }) {
  const cart = useCart();
  const t = useT();
  if (!cart) return null;
  const n = cart.count;
  return (
    <button type="button" onClick={() => cart.setOpen(true)} aria-label={t("Cart, {0} items", { 0: t.num(n) })} aria-expanded={cart.open} data-no-loader
      className={`relative ${className} ${focus}`}>
      <ShoppingBag className="h-[18px] w-[18px]" />
      {n > 0 && <span key={n} className="absolute -end-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-emerald-600 px-1 text-[11px] font-bold text-white ring-2 ring-white animate-[cart-pop_.4s_ease-out] dark:ring-[#070B14]">{t.num(n)}</span>}
    </button>
  );
}

export default function CartDrawer() {
  const cart = useCart();
  const t = useT();
  const account = useAccount();
  const m = (n: number) => toman(n, t.locale);
  const [how, setHow] = useState<"wallet" | "card">("wallet");
  const [busy, setBusy] = useState<number | "pay" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const panel = useRef<HTMLElement>(null);
  const open = !!cart?.open;
  const close = () => cart?.setOpen(false);
  const closeRef = useRef(close);
  closeRef.current = close;

  const data = cart?.data;
  const total = data?.total ?? 0;
  const wallet = account.wallet;
  const short = how === "wallet" && wallet != null && total > wallet;
  const hasProblem = !!data?.items.some((l) => l.problem);

  // Opening with too little in the wallet: start on Card.
  useEffect(() => { if (open) { setError(null); setHow(wallet != null && total > wallet ? "card" : "wallet"); } /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [open]);
  useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => e.key === "Escape" && closeRef.current();
    window.addEventListener("keydown", k);
    const html = document.documentElement;
    html.style.overflow = "hidden";
    setTimeout(() => panel.current?.querySelector<HTMLElement>("button")?.focus(), 60);
    return () => { window.removeEventListener("keydown", k); html.style.overflow = ""; };
  }, [open]);

  if (!cart) return null;

  const run = async (key: number | "pay", job: () => Promise<unknown>) => {
    setBusy(key); setError(null);
    try { await job(); } catch (e) { setError(messageOf(e, t, m)); } finally { setBusy(null); }
  };

  const showResult = cart.result || cart.notice;

  return (
    <div className={`fixed inset-0 z-[75] ${open ? "" : "pointer-events-none"}`} aria-hidden={!open} inert={!open}>
      <style>{"@keyframes cart-pop{0%{transform:scale(.4)}60%{transform:scale(1.25)}100%{transform:scale(1)}}"}</style>
      <div onClick={close} className={`absolute inset-0 bg-slate-950/40 backdrop-blur-sm transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`} />
      <aside ref={panel} role="dialog" aria-modal="true" aria-labelledby="cart-title"
        className={`absolute inset-y-0 end-0 flex w-full max-w-[420px] flex-col bg-white shadow-2xl transition-transform duration-300 ease-out dark:bg-[#0B1020] ${open ? "translate-x-0" : "ltr:translate-x-full rtl:-translate-x-full"}`}>
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-white/10">
          <h2 id="cart-title" className="font-display text-lg font-semibold text-slate-900 dark:text-white">
            {showResult ? t("Your purchase") : <>{t("Your cart")} {!!cart.count && <span className="text-sm font-normal text-slate-500">({t.num(cart.count)})</span>}</>}
          </h2>
          <button type="button" aria-label={t("Close")} onClick={close} className={`grid h-9 w-9 place-items-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-white/10 dark:text-slate-300 ${focus}`}><X className="h-5 w-5" /></button>
        </div>

        {showResult ? <Result checkout={cart.result} notice={cart.notice} onBack={cart.clearResult} onClose={close} t={t} m={m} /> : <>
          <div className="flex-1 overflow-y-auto px-5">
            {!data ? <div className="mt-5 space-y-3">{[0, 1].map((i) => <div key={i} className="h-16 animate-pulse rounded-2xl bg-slate-100 dark:bg-white/5" />)}</div>
              : data.items.length ? (
                <ul className="divide-y divide-slate-100 dark:divide-white/10">
                  {data.items.map((l) => {
                    const { title, detail } = labelOf(l, t);
                    return (
                      <li key={l.id} className="flex items-start gap-3 py-3.5 animate-step-in">
                        <Tile kind={l.kind} />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <span className="font-semibold text-slate-900 dark:text-white">{title}</span>
                            <span className={`shrink-0 text-sm font-semibold tabular-nums ${l.problem ? "text-slate-400 line-through" : "text-slate-900 dark:text-white"}`}>{m(l.price)}</span>
                          </div>
                          {detail && <div className="mt-0.5 truncate text-xs text-slate-500 dark:text-slate-400"><bdi>{detail}</bdi></div>}
                          {l.kind === "google_voice" && !l.problem && <div className="mt-1 flex items-center gap-1 text-xs text-amber-700 dark:text-amber-300"><Info className="h-3.5 w-3.5 shrink-0" />{t("Not held until you pay")}</div>}
                          {l.problem && <div className="mt-1 flex items-start gap-1 text-xs text-rose-700 dark:text-rose-300"><AlertCircle className="mt-px h-3.5 w-3.5 shrink-0" />{l.problem}</div>}
                          <div className="mt-2 flex items-center gap-3">
                            {l.qty != null && (
                              <span className="inline-flex items-center rounded-full ring-1 ring-slate-200 dark:ring-white/15">
                                <button type="button" aria-label={t("One less")} disabled={l.qty <= 1 || busy !== null} onClick={() => run(l.id, () => cart.setQty(l.id, l.qty! - 1))} className={`grid h-7 w-7 place-items-center rounded-full text-slate-600 hover:bg-slate-100 disabled:opacity-40 dark:text-slate-300 dark:hover:bg-white/10 ${focus}`}><Minus className="h-3.5 w-3.5" /></button>
                                <span className="w-6 text-center text-sm tabular-nums text-slate-900 dark:text-white">{busy === l.id ? <Loader2 className="mx-auto h-3.5 w-3.5 animate-spin" /> : t.num(l.qty)}</span>
                                <button type="button" aria-label={t("One more")} disabled={l.qty >= 10 || busy !== null} onClick={() => run(l.id, () => cart.setQty(l.id, l.qty! + 1))} className={`grid h-7 w-7 place-items-center rounded-full text-slate-600 hover:bg-slate-100 disabled:opacity-40 dark:text-slate-300 dark:hover:bg-white/10 ${focus}`}><Plus className="h-3.5 w-3.5" /></button>
                              </span>
                            )}
                            <button type="button" disabled={busy !== null} onClick={() => run(l.id, () => cart.remove(l.id))} className={`flex items-center gap-1 rounded-lg text-xs text-slate-500 hover:text-rose-600 disabled:opacity-40 dark:text-slate-400 ${focus}`}><Trash2 className="h-3.5 w-3.5" />{t("Remove")}</button>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <div className="grid place-items-center py-16 text-center">
                  <span className="grid h-14 w-14 place-items-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-white/5"><ShoppingBag className="h-7 w-7" /></span>
                  <p className="mt-4 font-semibold text-slate-900 dark:text-white">{t("Your cart is empty")}</p>
                  <p className="mt-1 max-w-64 text-sm text-slate-500 dark:text-slate-400">{t("Add services and pay for them all at once.")}</p>
                  <button type="button" onClick={close} className={`${ghost} mt-5`}>{t("Keep shopping")}</button>
                </div>
              )}
          </div>

          {!!data?.items.length && (
            <div className="space-y-4 border-t border-slate-100 p-5 dark:border-white/10">
              <dl className="space-y-1.5 text-sm">
                <div className="flex justify-between"><dt className="text-slate-500 dark:text-slate-400">{t("Payment fee")}</dt><dd className="text-slate-900 dark:text-white">{t("Free")}</dd></div>
                <div className="flex items-baseline justify-between"><dt className="font-semibold text-slate-900 dark:text-white">{t("Total")}</dt><dd className="font-display text-2xl font-bold tabular-nums text-slate-900 dark:text-white">{m(total)}</dd></div>
              </dl>

              {account.status !== "user" ? (
                <div>
                  {account.status === "loading" ? <div className="h-40 animate-pulse rounded-2xl bg-slate-100 dark:bg-white/5" /> : <SignInForm />}
                  <p className="mt-3 text-center text-xs text-slate-500 dark:text-slate-400">{t("Sign in to pay. Your cart stays as it is.")}</p>
                </div>
              ) : <>
                <div role="radiogroup" aria-label={t("Payment method")} className="flex gap-2">
                  {([["wallet", "Wallet", wallet != null ? t("Balance {0}", { 0: m(wallet) }) : "", Wallet], ["card", "Card", t("Bank gateway"), CreditCard]] as const).map(([id, label, sub, Icon]) => (
                    <button key={id} type="button" role="radio" aria-checked={how === id} onClick={() => setHow(id)}
                      className={`flex flex-1 items-center gap-2.5 rounded-2xl p-3 text-start transition ${focus} ${how === id ? "bg-emerald-50 ring-2 ring-emerald-500 dark:bg-emerald-500/10" : "ring-1 ring-slate-200 hover:ring-slate-300 dark:ring-white/10"}`}>
                      <Icon className={`h-5 w-5 shrink-0 ${how === id ? "text-emerald-600 dark:text-emerald-300" : "text-slate-500"}`} />
                      <span className="min-w-0"><span className="block text-sm font-semibold text-slate-900 dark:text-white">{t(label)}</span><span className="block truncate text-[11px] text-slate-500 dark:text-slate-400">{sub}</span></span>
                    </button>
                  ))}
                </div>
                {short && (
                  <div className="flex items-start gap-2 rounded-xl bg-amber-50 p-3 text-xs text-amber-800 dark:bg-amber-500/10 dark:text-amber-300">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span className="flex-1">{t("Not enough in your wallet. Top up, or pay by card.")}</span>
                    <Link href={TOP_UP_HREF} onClick={close} className="flex shrink-0 items-center gap-1 font-semibold text-amber-900 underline-offset-2 hover:underline dark:text-amber-200"><Plus className="h-3.5 w-3.5" />{t("Top up wallet")}</Link>
                  </div>
                )}
                {error && <p role="alert" className="flex items-start gap-2 rounded-xl bg-rose-50 p-3 text-sm text-rose-700 dark:bg-rose-500/10 dark:text-rose-300"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />{error}</p>}
                <button type="button" disabled={!total || short || hasProblem || busy !== null} onClick={() => run("pay", () => cart.checkout(how))} className={primary}>
                  {busy === "pay" ? <><Loader2 className="h-4 w-4 animate-spin" />{how === "card" ? t("Going to the bank…") : t("Paying…")}</> : <><Lock className="h-4 w-4" />{t("Pay {0}", { 0: m(total) })}</>}
                </button>
                <p className="text-center text-[11px] text-slate-500 dark:text-slate-400">{t("One payment for everything. Anything we can't deliver goes back to your wallet.")}</p>
              </>}
            </div>
          )}
        </>}
      </aside>
    </div>
  );
}

// After paying: each line with delivered / on its way / back to the wallet, and links to the orders.
function Result({ checkout, notice, onBack, onClose, t, m }: { checkout: Checkout | null; notice: "cancelled" | "failed" | "held" | null; onBack: () => void; onClose: () => void; t: T; m: (n: number) => string }) {
  if (!checkout) {
    const text = notice === "cancelled" ? t("You cancelled at the bank. Nothing was charged; your cart is as it was.")
      : notice === "held" ? t("Your payment is being checked. Look at your orders in a minute.")
      : t("The payment didn't go through. If money left your account, it comes back within 72 hours.");
    return (
      <div className="flex-1 p-5">
        <div className="flex items-start gap-2 rounded-2xl bg-amber-50 p-4 text-sm text-amber-800 dark:bg-amber-500/10 dark:text-amber-200"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />{text}</div>
        <button type="button" onClick={onBack} className={`${ghost} mt-4 w-full`}>{t("Back to your cart")}</button>
      </div>
    );
  }
  const ok = checkout.items.filter((l) => l.result === "delivered" || l.result === "queued").length;
  const state = (l: CheckoutLine) => l.result === "delivered" ? { icon: Check, text: t("Delivered"), tone: "text-emerald-700 dark:text-emerald-300" }
    : l.result === "queued" ? { icon: Clock, text: t("On its way"), tone: "text-sky-700 dark:text-sky-300" }
    : { icon: RotateCcw, text: l.result === "refunded" ? t("Back in your wallet") : t("Not charged"), tone: "text-amber-700 dark:text-amber-300" };
  return (
    <div className="flex flex-1 flex-col overflow-y-auto">
      <div className="p-5">
        <div className={`rounded-2xl p-4 ${ok === checkout.items.length ? "bg-emerald-50 dark:bg-emerald-500/10" : "bg-amber-50 dark:bg-amber-500/10"}`}>
          <div className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white">
            {ok === checkout.items.length ? <Check className="h-5 w-5 text-emerald-600" /> : <AlertCircle className="h-5 w-5 text-amber-600" />}
            {ok === checkout.items.length ? t("Paid. Your orders are on their way.") : ok ? t("Paid. Some items couldn't be bought.") : t("Nothing could be bought.")}
          </div>
          {checkout.refunded > 0 && <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{t("{0} is in your wallet for the items that didn't go through.", { 0: m(checkout.refunded) })}</p>}
        </div>
        <ul className="mt-3 divide-y divide-slate-100 dark:divide-white/10">
          {checkout.items.map((l, i) => {
            const { title, detail } = labelOf(l, t);
            const s = state(l);
            return (
              <li key={i} className="flex items-start gap-3 py-3.5">
                <Tile kind={l.kind} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2"><span className="font-semibold text-slate-900 dark:text-white">{title}</span><span className="shrink-0 text-sm tabular-nums text-slate-900 dark:text-white">{m(l.price)}</span></div>
                  {detail && <div className="mt-0.5 truncate text-xs text-slate-500 dark:text-slate-400"><bdi>{detail}</bdi></div>}
                  <div className={`mt-1.5 flex items-center gap-1 text-xs font-semibold ${s.tone}`}><s.icon className="h-3.5 w-3.5" />{s.text}
                    {l.order_id && <Link href={`/account/orders/${l.order_id}`} onClick={onClose} className="ms-auto font-normal text-slate-500 underline-offset-2 hover:underline dark:text-slate-400">{t("Order #{0}", { 0: t.num(l.order_id, { useGrouping: false }) })}</Link>}
                  </div>
                  {l.message && l.result !== "queued" && l.result !== "delivered" && <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{l.message}</p>}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="mt-auto grid gap-2 border-t border-slate-100 p-5 dark:border-white/10">
        {/* Several services bought: they are one order (#C-{id}) in the account. */}
        {checkout.items.filter((l) => l.order_id).length > 1
          ? <Link href={`/account/orders/c${checkout.id}`} onClick={onClose} className={primary}>{t("See this order")}</Link>
          : <Link href="/account/orders" onClick={onClose} className={primary}>{t("See my orders")}</Link>}
        <button type="button" onClick={() => { onBack(); onClose(); }} className={ghost}>{t("Keep shopping")}</button>
      </div>
    </div>
  );
}
