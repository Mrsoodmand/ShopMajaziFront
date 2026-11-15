"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { accountApi, ApiError, useAccount } from "./account";

// The shopping cart (design "Side Drawer", design/cart/offers.tsx A). Lives on the server
// (Laravel Api\StorefrontCartController, /api/v1/storefront/account/cart*): guests get a session cart that joins
// their account's cart when they sign in. Each line is one ordinary purchase; paying makes one order per line,
// paid from the wallet (a card payment tops the wallet up with the total first).

export type CartKind = "service" | "subscription" | "apple_id" | "google_voice";
type Label = { title: string; detail: string };
export type CartLine = { id: number; kind: CartKind; label: { fa: Label; en: Label }; price: number; qty: number | null; problem: string | null };
export type CartData = { items: CartLine[]; count: number; total: number; wallet: number | null };
export type CheckoutLine = { kind: CartKind; label: { fa: Label; en: Label }; price: number; order_id: number | null; result: "delivered" | "queued" | "refunded" | "not_charged"; message: string | null };
export type Checkout = { id: number; method: "wallet" | "card"; status: "waiting_to_pay" | "paying" | "done" | "partial" | "failed" | "cancelled"; total: number; items: CheckoutLine[]; refunded: number };

export type Cart = {
  data: CartData | null;
  count: number;
  open: boolean;
  setOpen: (o: boolean) => void;
  // Add a line with the same body the product's buy endpoint takes; opens the drawer. Throws ApiError.
  add: (kind: CartKind, payload: Record<string, unknown>) => Promise<void>;
  remove: (id: number) => Promise<void>;
  setQty: (id: number, qty: number) => Promise<void>;
  // Wallet: pays and shows the result. Card: goes to the bank (the promise never resolves).
  checkout: (method: "wallet" | "card") => Promise<void>;
  result: Checkout | null;
  notice: "cancelled" | "failed" | "held" | null;
  clearResult: () => void;
  refresh: () => Promise<void>;
};

const Ctx = createContext<Cart | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const account = useAccount();
  const [data, setData] = useState<CartData | null>(null);
  const [open, setOpen] = useState(false);
  const [result, setResult] = useState<Checkout | null>(null);
  const [notice, setNotice] = useState<Cart["notice"]>(null);
  const { setWallet } = account;

  const take = useCallback((d: CartData) => { setData(d); if (typeof d.wallet === "number") setWallet(d.wallet); }, [setWallet]);
  const refresh = useCallback(async () => { try { take(await accountApi<CartData>("cart")); } catch { /* offline: keep what we have */ } }, [take]);

  // Load once the account is known, and again when it changes (a guest cart joins the user's at sign-in).
  useEffect(() => { if (account.status !== "loading") refresh(); }, [account.status, refresh]);

  // Back from the bank: ?cart=ok|partial|failed|cancelled|held&checkout=ID. Show the result, clean the address.
  const handled = useRef(false);
  useEffect(() => {
    if (handled.current || account.status !== "user") return;
    const q = new URLSearchParams(window.location.search);
    const outcome = q.get("cart");
    if (!outcome) return;
    handled.current = true;
    const id = Number(q.get("checkout"));
    q.delete("cart"); q.delete("checkout");
    window.history.replaceState(null, "", window.location.pathname + (q.size ? `?${q}` : "") + window.location.hash);
    setOpen(true);
    if (outcome === "cancelled" || outcome === "held" || (outcome === "failed" && !id)) { setNotice(outcome === "held" ? "held" : outcome as "cancelled" | "failed"); return; }
    if (id) accountApi<{ checkout: Checkout; wallet: number }>(`cart/checkouts/${id}`).then((r) => {
      setWallet(r.wallet);
      if (r.checkout.status === "failed" && !r.checkout.items.some((l) => l.order_id)) setNotice("failed"); else setResult(r.checkout);
    }).catch(() => setNotice("failed"));
    refresh();
  }, [account.status, refresh, setWallet]);

  const add = useCallback(async (kind: CartKind, payload: Record<string, unknown>) => {
    take(await accountApi<CartData>("cart/items", { kind, payload }));
    setResult(null); setNotice(null);
    setOpen(true);
  }, [take]);
  const remove = useCallback(async (id: number) => { take(await accountApi<CartData>(`cart/items/${id}/remove`, {})); }, [take]);
  const setQty = useCallback(async (id: number, qty: number) => { take(await accountApi<CartData>(`cart/items/${id}`, { qty })); }, [take]);

  const checkout = useCallback(async (method: "wallet" | "card") => {
    if (!data) return;
    try {
      if (method === "card") {
        const r = await accountApi<{ url: string }>("cart/checkout", { method, total: data.total, return: window.location.pathname });
        window.location.assign(r.url);
        return new Promise<void>(() => {}); // leaving for the bank
      }
      const r = await accountApi<{ checkout: Checkout; wallet: number }>("cart/checkout", { method, total: data.total });
      setWallet(r.wallet);
      setResult(r.checkout);
      await refresh();
    } catch (e) {
      if (e instanceof ApiError) {
        const fresh = (e.data?.cart ?? null) as CartData | null;
        if (fresh) take(fresh);
        if (typeof e.data?.wallet === "number") setWallet(e.data.wallet);
      }
      throw e;
    }
  }, [data, refresh, setWallet, take]);

  const value = useMemo<Cart>(() => ({
    data, count: data?.count ?? 0, open, setOpen, add, remove, setQty, checkout, result, notice,
    clearResult: () => { setResult(null); setNotice(null); }, refresh,
  }), [data, open, add, remove, setQty, checkout, result, notice, refresh]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

// Outside the provider (gallery previews) there is no cart.
export const useCart = () => useContext(Ctx);
