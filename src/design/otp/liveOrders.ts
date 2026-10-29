"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { OtpApp, OtpCountry, OtpOffer, OtpOperator } from "@/content/otp-en";
import { accountApi, useAccount } from "@/lib/account";
import type { Locale, VnCatalog } from "@/lib/virtual-numbers";
import type { Order, OrderStore, PayMethod } from "./order";

// Live orders for the signed-in user (Api\StorefrontAccountController): the recent ones on load, buy with the
// wallet, check each waiting number for its SMS every few seconds, cancel. Every answer carries the wallet balance,
// which updates the header and the checkout.

type ApiOrder = {
  id: number; product_id: number | null; service_id: number | string | null; country_id: number | string | null; server: number | null;
  number: string | null; code: string | null; status: Order["status"]; price: number; paid_with: "wallet" | "card"; created_at: string; seconds_left: number;
};
type WithWallet<T> = T & { wallet: number };

export const LIVE_ORDER_MINUTES = 10; // the backend's expire_date: 10 minutes after buying
const POLL_MS = 5000;

const serverName = (n: number, locale: Locale) => (locale === "fa" ? `سرور ${n.toLocaleString("fa-IR")}` : `Server ${n}`);


export function useLiveOrders(catalog: VnCatalog, locale: Locale): OrderStore & { loaded: boolean } {
  const account = useAccount();
  const signedIn = account.status === "user";
  const { setWallet } = account;
  const [orders, setOrders] = useState<Order[]>([]);
  const [loaded, setLoaded] = useState(false);

  // Backend order → the order shape the screens use. Apps and countries missing from the catalog (switched off
  // since) get a plain stand-in so old orders still show.
  const toOrder = useCallback((o: ApiOrder, operator?: OtpOperator): Order => {
    const app: OtpApp = catalog.apps.find((a) => a.sid === Number(o.service_id)) ?? { id: `s${o.service_id}`, name: "—", letter: "?", color: "bg-slate-500" };
    const country: OtpCountry = catalog.countries.find((c) => c.cid === Number(o.country_id)) ?? { cc: "UN", name: "—", base: 0 };
    const offer: OtpOffer = { app, country, price: o.price };
    const expiresAt = Date.now() + o.seconds_left * 1000;
    return {
      id: String(o.id), offer, paidWith: o.paid_with, number: o.number ?? "—", status: o.status, code: o.code ?? undefined,
      operator: operator ?? (o.product_id ? { id: String(o.product_id), name: serverName(o.server ?? 1, locale), price: o.price } : undefined),
      startedAt: o.status === "waiting" ? expiresAt - LIVE_ORDER_MINUTES * 60_000 : Date.parse(o.created_at), expiresAt,
    };
  }, [catalog, locale]);

  // Replace one order, keeping the operator picked at purchase (its name matches the list the buyer saw).
  const put = useCallback((o: ApiOrder) => setOrders((list) => {
    const old = list.find((x) => x.id === String(o.id));
    const next = toOrder(o, old?.operator);
    return old ? list.map((x) => (x.id === next.id ? next : x)) : [next, ...list];
  }), [toOrder]);

  // Recent orders, once signed in; cleared on sign-out.
  useEffect(() => {
    if (!signedIn) { setOrders([]); setLoaded(account.status === "guest"); return; }
    let live = true;
    accountApi<WithWallet<{ orders: ApiOrder[] }>>("virtual-numbers/orders")
      .then((r) => { if (!live) return; setOrders(r.orders.map((o) => toOrder(o))); setWallet(r.wallet); })
      .catch(() => {})
      .finally(() => live && setLoaded(true));
    return () => { live = false; };
  }, [signedIn, account.status, toOrder, setWallet]);

  // Waiting numbers: ask for the SMS every few seconds (the backend also refunds an expired one here).
  const waitingIds = orders.filter((o) => o.status === "waiting").map((o) => o.id).join(",");
  const inFlight = useRef(new Set<string>());
  useEffect(() => {
    if (!waitingIds) return;
    const ids = waitingIds.split(",");
    const tick = () => ids.forEach((id) => {
      if (inFlight.current.has(id)) return;
      inFlight.current.add(id);
      accountApi<WithWallet<{ order: ApiOrder }>>(`virtual-numbers/orders/${id}`)
        .then((r) => { put(r.order); setWallet(r.wallet); })
        .catch(() => {}) // try again on the next tick
        .finally(() => inFlight.current.delete(id));
    });
    const timer = setInterval(tick, POLL_MS);
    return () => clearInterval(timer);
  }, [waitingIds, put, setWallet]);

  const buy = useCallback(async (offer: OtpOffer, operator?: OtpOperator, paidWith?: PayMethod): Promise<Order> => {
    if (!operator) throw new Error("operator required");
    if (paidWith === "card") {
      // To the bank (ZarinPal); it sends the buyer back here with ?pay=…&order=… (see usePaymentResult).
      const r = await accountApi<{ url: string }>("virtual-numbers/pay-card", { product_id: Number(operator.id), price: operator.price, return: window.location.pathname });
      window.location.assign(r.url);
      return new Promise<Order>(() => {}); // the page is leaving; keep the modal busy
    }
    const r = await accountApi<WithWallet<{ order: ApiOrder }>>("virtual-numbers/buy", { product_id: Number(operator.id), price: operator.price });
    setWallet(r.wallet);
    const order = toOrder(r.order, operator);
    setOrders((list) => [order, ...list.filter((x) => x.id !== order.id)]);
    return { ...order, offer: { ...offer, price: order.offer.price } };
  }, [toOrder, setWallet]);

  const cancel = useCallback(async (id: string) => {
    try {
      const r = await accountApi<WithWallet<{ order: ApiOrder }>>(`virtual-numbers/orders/${id}/cancel`, {});
      put(r.order);
      setWallet(r.wallet);
    } catch (e) {
      // The order may have moved on (code arrived meanwhile): show its current state, then report the failure.
      const order = (e as { data?: { order?: ApiOrder } }).data?.order;
      if (order) put(order);
      throw e;
    }
  }, [put, setWallet]);

  // "Check SMS": ask right away; the automatic check skips this number while the request is out.
  const check = useCallback(async (id: string) => {
    inFlight.current.add(id);
    try {
      const r = await accountApi<WithWallet<{ order: ApiOrder }>>(`virtual-numbers/orders/${id}`);
      put(r.order);
      setWallet(r.wallet);
    } finally {
      inFlight.current.delete(id);
    }
  }, [put, setWallet]);

  return useMemo(() => ({ orders, buy, cancel, check, minutes: LIVE_ORDER_MINUTES, loaded }), [orders, buy, cancel, check, loaded]);
}
