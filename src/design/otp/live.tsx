"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { ApiOffer, Locale, VnCatalog } from "@/lib/virtual-numbers";

// Live virtual-number data, provided by the /virtual-number page. Page designs that support it (L) read it;
// inside /design previews there is no provider, so they keep the placeholder data.
export type LiveOtp = { catalog: VnCatalog; locale: Locale; defaultApp: string; defaultCc?: string; preload?: { appId: string; offers: ApiOffer[] }; error?: string };

const Ctx = createContext<LiveOtp | null>(null);

export function LiveOtpProvider({ value, children }: { value: LiveOtp; children: ReactNode }) {
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useLiveOtp = () => useContext(Ctx);
