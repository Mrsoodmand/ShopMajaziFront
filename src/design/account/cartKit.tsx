"use client";

import { type ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import { useT } from "@/i18n/client";
import type { AccountOrder } from "@/content/account-en";
import { Head, type Go } from "./AccountC";
import { Badge, card, secondary, ServiceTile, useFmt, useOrderLine, type Store } from "./kit";
import { PrintInvoice } from "./invoice";

// Cart orders in the account (design "page-account-cart-order" C, chosen 2026-11-15): services bought together from
// the cart (AccountOrder.cart) show as one order #C-{id} in the orders list, with its own page listing the services,
// the money and one invoice. Each service keeps its own page (the Receipt) as before. Carts with a single service
// left in the list show as a normal order.

const rowBtn = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-emerald-600 dark:focus-visible:ring-emerald-400";

// ---------- Grouping ----------

export type Entry = { type: "one"; o: AccountOrder } | { type: "cart"; id: number; items: AccountOrder[]; at: string; total: number; paidWith: string };

export function group(orders: AccountOrder[]): Entry[] {
  const out: Entry[] = [];
  const seen = new Map<number, Extract<Entry, { type: "cart" }>>();
  const counts = new Map<number, number>();
  orders.forEach((o) => { if (o.cart) counts.set(o.cart.id, (counts.get(o.cart.id) ?? 0) + 1); });
  for (const o of orders) {
    const c = o.cart && (counts.get(o.cart.id) ?? 0) > 1 ? o.cart.id : undefined;
    if (!c) { out.push({ type: "one", o }); continue; }
    let e = seen.get(c);
    if (!e) { e = { type: "cart", id: c, items: [], at: o.cart!.at, total: 0, paidWith: o.cart!.paidWith }; seen.set(c, e); out.push(e); }
    e.items.push(o); e.total += o.price;
  }
  return out;
}
export const busy = (o: AccountOrder) => o.state === "needs-you" || o.state === "awaiting-payment" || o.state === "waiting" || o.state === "delivering";
export const entryBusy = (e: Entry) => (e.type === "one" ? busy(e.o) : e.items.some(busy));
export const entryAt = (e: Entry) => (e.type === "one" ? e.o.at : e.at);

// "2 of 3 delivered", or what one of them is waiting on.
export function useCartLine() {
  const t = useT();
  return (items: AccountOrder[]) => {
    const done = items.filter((o) => o.state === "delivered").length;
    const back = items.filter((o) => o.state === "refunded" || o.state === "cancelled").length;
    if (items.some((o) => o.state === "needs-you")) return t("One service needs you");
    if (done === items.length) return t("All {0} delivered", { 0: items.length });
    return [t("{0} of {1} delivered", { 0: done, 1: items.length }), back ? t("{0} refunded", { 0: back }) : ""].filter(Boolean).join(" · ");
  };
}

// Overlapping service tiles: what's inside at a glance.
export function Stack({ items }: { items: AccountOrder[] }) {
  return (
    <span className="flex shrink-0 -space-x-3 rtl:space-x-reverse">
      {items.slice(0, 3).map((o) => <span key={o.id} className="rounded-xl ring-2 ring-white dark:ring-[#0E1424]"><ServiceTile service={o.service} size="sm" /></span>)}
    </span>
  );
}

export function cartState(items: AccountOrder[]) {
  return items.some((o) => o.state === "needs-you") ? "needs-you" : items.some(busy) ? "delivering" : "delivered";
}

// The cart order's own row: stacked tiles, "Cart order #C-12 · 3 services", how far along, the total.
export function CartRow({ e, onClick, open, trailing }: { e: Extract<Entry, { type: "cart" }>; onClick: () => void; open?: boolean; trailing?: ReactNode }) {
  const t = useT();
  const f = useFmt();
  const cartLine = useCartLine();
  const state = cartState(e.items);
  return (
    <button type="button" onClick={onClick} aria-expanded={open} className={`group flex w-full items-center gap-4 px-5 py-3.5 text-start transition-colors hover:bg-slate-50 sm:px-6 dark:hover:bg-white/[.03] ${rowBtn}`}>
      <span className="w-12 shrink-0 text-sm tabular-nums text-slate-500 dark:text-slate-400">{f.time(e.at)}</span>
      <Stack items={e.items} />
      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="font-semibold text-slate-900 dark:text-white">{t("Order #C-{0}", { 0: e.id })}</span>
          <span className="text-sm text-slate-500 dark:text-slate-400">· {t("{0} services", { 0: e.items.length })}</span>
          {state !== "delivered" && <Badge kind={state} />}
        </span>
        <span className="block truncate text-sm text-slate-600 dark:text-slate-400">{e.items.map((o) => t(o.title)).join(" · ")}</span>
        <span className="block text-xs text-slate-500 dark:text-slate-400">{cartLine(e.items)}</span>
      </span>
      <span className="text-[15px] font-semibold tabular-nums text-slate-900 dark:text-white">{f.num(e.total)}</span>
      {trailing ?? <ChevronRight aria-hidden className="h-5 w-5 shrink-0 text-slate-400 rtl:rotate-180" />}
    </button>
  );
}

// ---------- The cart order's own page (offers C and D) ----------

export function MoneyBox({ e, demo }: { e: Extract<Entry, { type: "cart" }>; demo: Store }) {
  const t = useT();
  const f = useFmt();
  const c = e.paidWith === "wallet" ? null : demo.cardOf(e.paidWith);
  const refunded = e.items.reduce((s, o) => s + (o.refund?.amount ?? 0), 0);
  return (
    <aside className={`${card} p-6 xl:sticky xl:top-24`}>
      <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-white">{t("Money")}</h2>
      <dl className="mt-3 space-y-2 text-[15px]">
        <div className="flex justify-between gap-3"><dt className="text-slate-600 dark:text-slate-400">{t("{0} services", { 0: e.items.length })}</dt><dd className="tabular-nums text-slate-900 dark:text-white">{f.num(e.total)}</dd></div>
        <div className="flex justify-between gap-3"><dt className="text-slate-600 dark:text-slate-400">{t("Paid with")}</dt><dd className="text-slate-900 dark:text-white">{c ? `${c.bank} •••• ${c.last4}` : t("Wallet")}</dd></div>
        {refunded > 0 && <div className="flex justify-between gap-3"><dt className="text-slate-600 dark:text-slate-400">{t("Refund to wallet")}</dt><dd className="tabular-nums text-emerald-800 dark:text-emerald-300">+{f.num(refunded)}</dd></div>}
        <div className="flex items-baseline justify-between gap-3 border-t border-slate-200 pt-3 dark:border-white/10"><dt className="font-semibold text-slate-900 dark:text-white">{t("Total")}</dt><dd className="font-display text-2xl font-bold tabular-nums text-slate-900 dark:text-white">{f.money(e.total - refunded)}</dd></div>
      </dl>
      <PrintInvoice order={e.items[0]} items={e.items} store={demo} className={`${secondary} mt-5 w-full !py-3`} />
      <p className="mt-2 text-center text-xs text-slate-500 dark:text-slate-400">{t("One invoice with every service in this order.")}</p>
    </aside>
  );
}

export type CartEntry = Extract<Entry, { type: "cart" }>;

// The cart order's page (offer C): a card per service (tap for its own page), and the money box.
export function CartOrderPage({ e, demo, go, back }: { e: CartEntry; demo: Store; go: Go; back: () => void }) {
  const t = useT();
  const f = useFmt();
  const line = useOrderLine();
  const cartLine = useCartLine();
  return (
    <div>
      <Head back={{ label: t("Orders"), onClick: back }} title={t("Order #C-{0}", { 0: e.id })} sub={<span className="flex flex-wrap items-center gap-x-3 gap-y-2">{f.when(e.at)} · {cartLine(e.items)}<Badge kind={cartState(e.items)} /></span>} />
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_20rem] xl:items-start">
        <ul className="grid gap-3 sm:grid-cols-2">
          {e.items.map((o) => (
            <li key={o.id}>
              <button type="button" onClick={() => go({ page: "order", id: o.id })} className={`${card} group flex h-full w-full flex-col p-5 text-start transition-colors hover:border-emerald-500 ${rowBtn}`}>
                <span className="flex items-start gap-3"><ServiceTile service={o.service} /><span className="min-w-0 flex-1"><span className="block font-semibold text-slate-900 dark:text-white">{t(o.title)}</span><span className="block truncate text-sm text-slate-600 dark:text-slate-400">{line(o, demo)}</span></span></span>
                <span className="mt-4 flex items-center justify-between gap-3"><Badge kind={o.state} /><span className="text-[15px] font-semibold tabular-nums text-slate-900 dark:text-white">{f.num(o.price)}</span></span>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-emerald-700 group-hover:underline dark:text-emerald-400">{t("Open this service")}<ChevronRight aria-hidden className="h-4 w-4 rtl:rotate-180" /></span>
              </button>
            </li>
          ))}
        </ul>
        <MoneyBox e={e} demo={demo} />
      </div>
    </div>
  );
}

// The page for /account/orders/c{id}: the cart's services from the store, or null when none are listed.
export function cartEntry(orders: AccountOrder[], id: number): CartEntry | null {
  const items = orders.filter((o) => o.cart?.id === id);
  if (!items.length) return null;
  return { type: "cart", id, items, at: items[0].cart!.at, total: items.reduce((s, o) => s + o.price, 0), paidWith: items[0].cart!.paidWith };
}
