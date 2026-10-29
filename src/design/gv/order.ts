"use client";

import { useEffect, useRef, useState } from "react";
import type { GvNumber } from "@/content/gv-en";
import type { PayMethod } from "@/components/checkout/CheckoutModal";

// DEMO Google Voice order: paid → preparing (a few seconds) → delivered with the account login.
// The live page will submit to the Laravel service payment route and show the credentials it returns.
export type GvOrder = { id: string; number: GvNumber; paidWith: PayMethod; price: number; status: "preparing" | "delivered"; login?: { email: string; password: string; recovery: string } };

export function useGvOrder() {
  const [order, setOrder] = useState<GvOrder | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  const buy = (number: GvNumber, paidWith: PayMethod, price: number) => {
    const id = Math.random().toString(36).slice(2, 8);
    setOrder({ id, number, paidWith, price, status: "preparing" });
    timer.current = setTimeout(() => {
      const user = `voice.${number.area.code}.${id}`;
      setOrder((o) => o && o.id === id ? { ...o, status: "delivered", login: { email: `${user}@gmail.com`, password: `Gv-${id.toUpperCase()}-${number.area.code}!`, recovery: `recovery.${id}@outlook.com` } } : o);
    }, 3500);
  };
  return { order, buy, reset: () => setOrder(null) };
}
