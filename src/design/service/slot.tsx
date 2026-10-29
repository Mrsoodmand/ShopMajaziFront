"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { GlowTone } from "./HeaderGlow";

// Lets a live service page add its shared sections (how to use, content, comments, FAQ, blog) at the end of the
// page design's <main>, above the footer. Designs can check `useHasExtras()` to drop their own FAQ / steps so
// nothing shows twice.
// `glow` also gives the page the home hero's animated glow behind its title, in that color (see HeaderGlow).
const ExtrasCtx = createContext<ReactNode>(null);
const GlowCtx = createContext<GlowTone | undefined>(undefined);

export function ExtrasSlot({ extras, glow, children }: { extras: ReactNode; glow?: GlowTone; children: ReactNode }) {
  return <ExtrasCtx.Provider value={extras}><GlowCtx.Provider value={glow}>{children}</GlowCtx.Provider></ExtrasCtx.Provider>;
}

export const useExtras = () => useContext(ExtrasCtx);
export const useHasExtras = () => useContext(ExtrasCtx) != null;
export const useGlow = () => useContext(GlowCtx);
