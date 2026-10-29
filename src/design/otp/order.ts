"use client";

import { useEffect, useRef, useState } from "react";
import type { OtpOffer, OtpOperator } from "@/content/otp-en";

// Orders: the DEMO flow for the page previews (below) mimics the Laravel flow (buy → number issued → poll get-sms →
// code or timeout refund; cancel → refund) with timers instead of API calls. The live page uses useLiveOrders
// (liveOrders.ts), which has the same shape and talks to the backend.
export type OrderStatus = "waiting" | "received" | "cancelled" | "expired";
// `operator` is the carrier the number comes from; `offer.price` is the price actually paid (the operator's price).
import type { PayMethod } from "@/components/checkout/CheckoutModal";
export type { PayMethod };
export type Order = { id: string; offer: OtpOffer; operator?: OtpOperator; paidWith?: PayMethod; number: string; status: OrderStatus; code?: string; startedAt: number; expiresAt: number };

export const ORDER_MINUTES = 20;

// Where orders come from. `buy` and `cancel` may be async (live); a failure rejects with the reason.
export type OrderStore = {
  orders: Order[];
  buy: (offer: OtpOffer, operator?: OtpOperator, paidWith?: PayMethod) => Order | Promise<Order>;
  cancel: (id: string) => void | Promise<void>;
  check?: (id: string) => Promise<void>; // ask for the SMS now, instead of waiting for the next automatic check
  minutes: number; // how long a number waits for its code
};
const DEMO_CODE_AFTER_MS = 7000;

const fakeNumber = (cc: string) => {
  const prefix: Record<string, string> = {
    US: "+1 (415) 5", GB: "+44 7700 9", DE: "+49 152 1", NL: "+31 6 2", FR: "+33 6 1", CA: "+1 (604) 5", TR: "+90 532 4", AE: "+971 50 3",
    IN: "+91 98 1", ID: "+62 812 3", BR: "+55 11 9", PL: "+48 51 2", SE: "+46 70 3", KZ: "+7 701 4", EG: "+20 10 5", ZA: "+27 72 6",
  };
  const tail = String(Math.floor(1000000 + Math.random() * 8999999));
  return `${prefix[cc] ?? "+7 900 1"}${tail.slice(0, 2)} ${tail.slice(2, 6)}`;
};

// The demo store buys synchronously (some preview designs use the order right away).
type DemoStore = Omit<OrderStore, "buy"> & { buy: (offer: OtpOffer, operator?: OtpOperator, paidWith?: PayMethod) => Order };
export function useOtpOrders(codeAfterMs = DEMO_CODE_AFTER_MS): DemoStore {
  const [orders, setOrders] = useState<Order[]>([]);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const buy = (offer: OtpOffer, operator?: OtpOperator, paidWith?: PayMethod) => {
    const now = Date.now();
    const paid = operator ? { ...offer, price: operator.price } : offer;
    const order: Order = { id: Math.random().toString(36).slice(2, 8), offer: paid, operator, paidWith, number: fakeNumber(offer.country.cc), status: "waiting", startedAt: now, expiresAt: now + ORDER_MINUTES * 60_000 };
    setOrders((o) => [order, ...o]);
    timers.current.push(setTimeout(() => {
      setOrders((list) => list.map((x) => (x.id === order.id && x.status === "waiting" ? { ...x, status: "received", code: String(100000 + Math.floor(Math.random() * 899999)).replace(/(\d{3})(\d{3})/, "$1 $2") } : x)));
    }, codeAfterMs));
    return order;
  };
  const cancel = (id: string) => setOrders((list) => list.map((x) => (x.id === id && x.status === "waiting" ? { ...x, status: "cancelled" } : x)));
  return { orders, buy, cancel, minutes: ORDER_MINUTES };
}

// mm:ss left on an order, ticking every second; `fraction` is the share of its waiting time still left.
export function useCountdown(expiresAt: number, running: boolean, startedAt = expiresAt - ORDER_MINUTES * 60_000) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [running]);
  const left = Math.max(0, expiresAt - now);
  const m = Math.floor(left / 60000), s = Math.floor((left % 60000) / 1000);
  return { text: `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`, fraction: left / Math.max(1, expiresAt - startedAt) };
}
