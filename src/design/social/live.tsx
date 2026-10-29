"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { SocialCategory } from "@/content/social-categories-en";
import type { LiveService } from "@/lib/social";

// The live Social media services pages get their platforms from the backend through these providers. Without them
// (the /design previews) the pages fall back to the placeholder data in content/social-*.ts.

// The list (/virtual-service).
export type LiveSocial = { categories: SocialCategory[]; error?: string };

const Ctx = createContext<LiveSocial | null>(null);

export function LiveSocialProvider({ value, children }: { value: LiveSocial; children: ReactNode }) {
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useLiveSocial(): LiveSocial | null {
  return useContext(Ctx);
}

// One platform's order page (/virtual-service/{platform}, or /{platform}/{service} opened on that service).
// `platforms` are every live platform, for the switch at the top; `platform` is this page's.
export type LiveSocialOrder = {
  platforms: SocialCategory[];
  platform: SocialCategory;
  services: LiveService[];
  initialService?: string; // slug
  title: string;
  sub: string;
  // Below the order: the platform's (or service's) own article and FAQ from the admin, when it has them.
  article?: { title: string; blocks: { kind: "h" | "p"; text: string }[] };
  faq?: { q: string; a: string }[];
  error?: string;
};

const OrderCtx = createContext<LiveSocialOrder | null>(null);

export function LiveSocialOrderProvider({ value, children }: { value: LiveSocialOrder; children: ReactNode }) {
  return <OrderCtx.Provider value={value}>{children}</OrderCtx.Provider>;
}

export function useLiveSocialOrder(): LiveSocialOrder | null {
  return useContext(OrderCtx);
}
