"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { GvNumber } from "@/content/google-voice-en";
import type { GvPreorder } from "@/lib/google-voice";

// Live Google Voice numbers, provided by the /google-voice page. Design previews have no provider and keep the samples.
// initialState: a state to open the picker on (?state=CA). preorder: offered when Numberland can't sell (null: off).
// preorderCard: the pre-order card version chosen in /design/gv-preorder.
export type LiveGv = { numbers: GvNumber[]; initialState?: string; error?: string; preorder?: GvPreorder | null; preorderCard?: string };

const Ctx = createContext<LiveGv | null>(null);

export function LiveGvProvider({ value, children }: { value: LiveGv; children: ReactNode }) {
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useLiveGv = () => useContext(Ctx);
