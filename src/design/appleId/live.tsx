"use client";

import { createContext, useContext, type ReactNode } from "react";

// Live Apple ID prices (Toman) and ready stock, provided by the /apple-id pages. Design previews have no provider
// and keep the sample prices. Partner packs cost the same per Apple ID as buying one.
export type LiveApple = { readyPrice: number; customPrice: number; stock: number; maxQty: number; packs: { qty: number; each: number }[]; error?: string };

const Ctx = createContext<LiveApple | null>(null);

export function LiveAppleProvider({ value, children }: { value: LiveApple; children: ReactNode }) {
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useLiveApple = () => useContext(Ctx);
