"use client";

import { createContext, useContext, type ReactNode } from "react";

// The page H1 the admin set (React admin › SEO, see lib/seo.ts). Live pages wrap their design in the provider;
// each design's H1 reads it through useH1 and keeps its own text when there is none (and in /design previews).
const Ctx = createContext<string | undefined>(undefined);

export function PageHeadingProvider({ h1, children }: { h1?: string; children: ReactNode }) {
  return <Ctx.Provider value={h1 || undefined}>{children}</Ctx.Provider>;
}

export function useH1(own: string): string {
  return useContext(Ctx) ?? own;
}

// Drop-in text for a design's <h1>: <h1><PageH1 text={own} /></h1>.
export function PageH1({ text }: { text: string }) {
  return <>{useH1(text)}</>;
}
