"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

// The signed-in user and their wallet, from the Laravel session (Api\StorefrontAccountController).
// Calls go same-origin to /api/v1/storefront/account/* (proxied by next.config.ts), so the session cookie is this
// site's. POSTs send the XSRF-TOKEN cookie back as X-XSRF-TOKEN, which Laravel's CSRF check accepts.

export type AccountUser = { name: string; mobile: string };
type Me = { authenticated: boolean; user: AccountUser | null; wallet: number };

export class ApiError extends Error {
  constructor(message: string, readonly code: string, readonly status: number, readonly data: Record<string, unknown> | null = null) {
    super(message);
  }
}

const BASE = "/api/v1/storefront/account/";
const xsrf = () => decodeURIComponent(document.cookie.split("; ").find((c) => c.startsWith("XSRF-TOKEN="))?.slice(11) ?? "");

export async function accountApi<T>(path: string, body?: Record<string, unknown>, retried = false): Promise<T> {
  const res = await fetch(BASE + path, {
    method: body ? "POST" : "GET",
    credentials: "same-origin",
    headers: { Accept: "application/json", ...(body ? { "Content-Type": "application/json", "X-XSRF-TOKEN": xsrf() } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  // 419: the CSRF token was missing or stale (new session). A GET hands out a fresh one; then try once more.
  if (res.status === 419 && body && !retried) {
    await fetch(BASE + "me", { credentials: "same-origin", headers: { Accept: "application/json" } });
    return accountApi<T>(path, body, true);
  }
  let json: { success?: boolean; message?: string | null; code?: string; data?: unknown } = {};
  try { json = await res.json(); } catch { /* not JSON: handled below */ }
  if (!res.ok || !json.success) throw new ApiError(json.message ?? `HTTP ${res.status}`, json.code ?? (res.status === 429 ? "busy" : "network"), res.status, (json.data as Record<string, unknown>) ?? null);
  return json.data as T;
}

export type Account = {
  status: "loading" | "guest" | "user";
  user: AccountUser | null;
  wallet: number | null; // null until known (or signed out)
  refresh: () => Promise<void>;
  signedIn: (me: Me) => void; // after a sign-in / sign-up call returned the new state
  setWallet: (n: number) => void;
  signOut: () => Promise<void>;
};

const Ctx = createContext<Account | null>(null);

export function AccountProvider({ children }: { children: ReactNode }) {
  const [me, setMe] = useState<Me | null>(null);
  const [failed, setFailed] = useState(false);

  const refresh = useCallback(async () => {
    try { setMe(await accountApi<Me>("me")); setFailed(false); } catch { setFailed(true); }
  }, []);
  useEffect(() => { refresh(); }, [refresh]);
  // Stable, and a no-op when the balance is unchanged: order polling calls it on every answer.
  const setWallet = useCallback((n: number) => setMe((m) => (m && m.wallet !== n ? { ...m, wallet: n } : m)), []);
  const signOut = useCallback(async () => { setMe(await accountApi<Me>("logout", {})); }, []);

  const value = useMemo<Account>(() => ({
    status: me ? (me.authenticated ? "user" : "guest") : failed ? "guest" : "loading",
    user: me?.user ?? null,
    wallet: me?.authenticated ? me.wallet : null,
    refresh, signedIn: setMe, setWallet, signOut,
  }), [me, failed, refresh, setWallet, signOut]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

// Outside the provider (design previews rendered on their own) everyone is a guest.
const guest: Account = { status: "guest", user: null, wallet: null, refresh: async () => {}, signedIn: () => {}, setWallet: () => {}, signOut: async () => {} };
export const useAccount = () => useContext(Ctx) ?? guest;

// The old site's wallet page (top-up by card), served by Laravel through the fallback rewrite.
export const TOP_UP_HREF = "/user/wallet";
