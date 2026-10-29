"use client";

import { useMemo, useState, type CSSProperties } from "react";
import { Facebook, Instagram, Linkedin, Music2, Search, Send, Twitch, Twitter, X, Youtube, type LucideIcon } from "lucide-react";
import { listHeadings, listSteps, sortedCategories, type SocialCategory } from "@/content/social-categories-en";
import { field, ring } from "../googleVoice/clean";
import { H2 } from "../telegram/parts";
import { useHasExtras } from "../service/slot";
import HowToSteps from "../service/HowToSteps";
import { SocialFaq, SocialRules } from "./kit";
import { liveSocialFaq, liveSocialRules } from "@/content/social-en";
import { useT } from "@/i18n/client";
import { useLiveSocial } from "./live";
import { PageH1 } from "@/components/seo/PageHeading";

// Pieces shared by the Social media services category-list offers. The list is whatever the admin has added, in
// the admin's order, so every layout copes with 3 or 50 platforms, long names and missing logos.

export { ring };
export const card = "rounded-3xl border border-slate-200 bg-white dark:border-white/15 dark:bg-[#0E1424]";
// `format` is the page's money formatter (useMoney): toman on live pages, sample dollars in the /design previews.
export const fmtFrom = (tx: ReturnType<typeof useT>, n: number, format: (n: number) => string = tx.usd) => tx("from {0} / 1,000", { 0: format(n) });

// Placeholder icons for the demo data; live categories use the logo the admin uploads.
export const icons: Record<string, LucideIcon> = { telegram: Send, instagram: Instagram, youtube: Youtube, tiktok: Music2, x: Twitter, facebook: Facebook, twitch: Twitch, linkedin: Linkedin };
export const iconFor = (c: SocialCategory): LucideIcon | undefined => (c.icon ? icons[c.icon] : undefined);

export function CategoryLogo({ c, size = "md", className = "", style }: { c: SocialCategory; size?: "sm" | "md" | "lg" | "xl"; className?: string; style?: CSSProperties }) {
  const box = size === "xl" ? "h-16 w-16 rounded-2xl text-2xl" : size === "lg" ? "h-14 w-14 rounded-2xl text-xl" : size === "sm" ? "h-9 w-9 rounded-lg text-sm" : "h-11 w-11 rounded-xl text-base";
  const ico = size === "xl" ? "h-8 w-8" : size === "lg" ? "h-7 w-7" : size === "sm" ? "h-4 w-4" : "h-5 w-5";
  const Icon = c.icon ? icons[c.icon] : undefined;
  if (c.logo) return <img src={c.logo} alt="" style={style} className={`${box} shrink-0 object-cover ${className}`} />;
  return (
    <span aria-hidden style={{ backgroundColor: c.color, ...style }} className={`grid shrink-0 place-items-center font-display font-bold text-white ring-1 ring-inset ring-black/5 dark:ring-white/10 ${box} ${className}`}>
      {Icon ? <Icon className={ico} /> : c.name.slice(0, 1)}
    </span>
  );
}

// A soft wash of the category's own colour, for tiles that carry it.
export const wash = (c: SocialCategory, pct = 10): CSSProperties => ({ backgroundColor: `color-mix(in srgb, ${c.color} ${pct}%, transparent)` });

// Search over names, the one-liner and service names ("followers" finds every platform that sells them).
export function useCategorySearch() {
  const tx = useT();
  const [q, setQ] = useState("");
  // Live pages get the admin's platforms from the backend (LiveSocialProvider); /design previews use the placeholders.
  const live = useLiveSocial();
  const all = useMemo(() => (live ? [...live.categories].sort((a, b) => a.order - b.order) : sortedCategories()), [live]);
  const words = q.toLowerCase().split(/\s+/).filter(Boolean);
  const list = all.filter((c) => {
    const hay = [c.name, tx(c.name), c.short, tx(c.short), ...c.services.flatMap((x) => [x.name, tx(x.name)])].join(" ").toLowerCase();
    return words.every((w) => hay.includes(w));
  });
  return { q, setQ, all, list, searching: words.length > 0 };
}
export type CategorySearch = ReturnType<typeof useCategorySearch>;

export function SearchField({ s, big = false, onDark = false, id = "cat-search" }: { s: CategorySearch; big?: boolean; onDark?: boolean; id?: string }) {
  const tx = useT();
  return (
    <div className="relative">
      <label htmlFor={id} className="sr-only">{tx("Search platforms and services")}</label>
      <Search aria-hidden className={`pointer-events-none absolute start-4 top-1/2 -translate-y-1/2 text-slate-500 ${big ? "h-5 w-5" : "h-4 w-4"}`} />
      <input id={id} type="search" value={s.q} onChange={(e) => s.setQ(e.target.value)} placeholder={tx("Search, e.g. instagram or followers")} autoComplete="off"
        className={`${field} ${big ? "py-4 ps-12 text-lg" : "ps-10"} ${onDark ? "shadow-xl shadow-black/20" : ""}`} />
    </div>
  );
}

export function SearchStatus({ s }: { s: CategorySearch }) {
  const tx = useT();
  return <p aria-live="polite" className="sr-only">{s.searching ? tx("{0} platforms found", { 0: s.list.length }) : ""}</p>;
}

export function NoMatch({ s }: { s: CategorySearch }) {
  const tx = useT();
  return (
    <div className={`${card} px-6 py-12 text-center`}>
      <p className="font-semibold text-slate-900 dark:text-white">{tx("No platform or service matches “{0}”.", { 0: s.q })}</p>
      <p className="mt-1 text-slate-600 dark:text-slate-400">{tx("Try the platform's name, or what you need: members, followers, views.")}</p>
      <button type="button" onClick={() => s.setQ("")} className={`mt-4 inline-flex items-center gap-1.5 rounded-lg font-semibold text-slate-900 underline underline-offset-2 dark:text-white ${ring}`}><X aria-hidden className="h-4 w-4" />{tx("Clear search")}</button>
    </div>
  );
}

export function ListTitle({ light = false }: { light?: boolean }) {
  const tx = useT();
  return (
    <>
      <h1 className={`text-balance font-display text-3xl font-bold tracking-tight sm:text-5xl ${light ? "text-white" : "text-slate-900 dark:text-white"}`}><PageH1 text={tx(listHeadings.h1)} /></h1>
      <p className={`mt-3 max-w-2xl text-base leading-relaxed sm:text-lg ${light ? "text-white/90" : "text-slate-700 dark:text-slate-300"}`}>{tx(listHeadings.sub)}</p>
    </>
  );
}

// How buying works, then the rules and FAQ shared with the order page.
export function ListBelow() {
  const tx = useT();
  const extras = useHasExtras();
  return (
    <div className="mx-auto max-w-6xl space-y-20 px-4 pb-28 pt-20 sm:px-6">
      {/* The same steps, card design and motion as every service page's "How to use" (see HowToSteps). */}
      <HowToSteps service="social" name={tx("Social media services")} steps={tx.tr(listSteps)} motion="e" detail="roll" flush />
      {/* The live wording, as on the order pages: real services have no refill period or start time set. */}
      <SocialRules items={liveSocialRules} />
      {!extras && <section aria-labelledby="list-faq" className="max-w-3xl"><H2 id="list-faq">{tx("Common questions")}</H2><div className="mt-6"><SocialFaq items={tx.tr(liveSocialFaq)} /></div></section>}
    </div>
  );
}
