"use client";

import type { ComponentType, CSSProperties, ReactNode } from "react";
import { ArrowRight, Check, Flame, Star } from "lucide-react";
import type { OtpApp } from "@/content/otp-en";
import { appTint } from "./kit";
import { useT } from "@/i18n/client";

// Five versions of the app card in the virtual number catalog (page P), chosen in /design/page-otp-card.
// Every card is one button: picking it fills the panel. The app's own colour (appTint) carries the brand; the
// chosen card gets the indigo outline and a check. "Popular" is a small mark, not a badge, so the name leads.

export type CardProps = { app: OtpApp; price: string; on: boolean; onPick: () => void; label: string; i: number };

const ease = "ease-[cubic-bezier(0.22,1,0.36,1)]";
const ring = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2 dark:focus-visible:ring-indigo-400 dark:focus-visible:ring-offset-[#070B14]";
const enter = (i: number): CSSProperties => ({ animationDelay: `${Math.min(i, 12) * 30}ms` });
const base = `group relative w-full animate-[card-in_.6s_cubic-bezier(0.22,1,0.36,1)_backwards] text-start transition-[translate,box-shadow,border-color,background-color] duration-500 ${ease} ${ring}`;
const edge = (on: boolean) => on
  ? "border-indigo-600 ring-1 ring-indigo-600 dark:border-indigo-400 dark:ring-indigo-400"
  : "border-slate-200 hover:border-slate-300 dark:border-white/10 dark:hover:border-white/25";
const mix = (c: string, pct: number) => `color-mix(in srgb, ${c} ${pct}%, transparent)`;

// The app's logo on a tile. `tint` puts it on a soft wash of its own colour instead of white.
function Logo({ app, size = 40, tint = false }: { app: OtpApp; size?: number; tint?: boolean }) {
  const c = appTint(app);
  const style: CSSProperties = { width: size, height: size, ...(tint && { backgroundColor: mix(c, 16) }) };
  if (app.image) return (
    <span aria-hidden style={style} className={`grid shrink-0 place-items-center rounded-xl ${tint ? "" : "bg-white shadow-sm ring-1 ring-slate-900/5 dark:ring-white/10"}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={app.image} alt="" loading="lazy" style={{ width: size * 0.58, height: size * 0.58 }} className="object-contain" />
    </span>
  );
  return <span aria-hidden style={{ ...style, backgroundColor: c }} className="grid shrink-0 place-items-center rounded-xl font-display text-lg font-bold text-white">{app.letter}</span>;
}

function PopularStar() {
  const t = useT();
  return <span title={t("Popular")} className="inline-flex shrink-0 text-amber-500 dark:text-amber-400"><Star aria-hidden className="h-3.5 w-3.5 fill-current" /><span className="sr-only">{t("Popular")}</span></span>;
}

function Picked() {
  return <span aria-hidden className="absolute end-2 top-2 grid h-5 w-5 place-items-center rounded-full bg-indigo-600 text-white dark:bg-indigo-400 dark:text-indigo-950"><Check className="h-3 w-3" strokeWidth={3} /></span>;
}

// ---------- A · Row ----------
// Logo beside the name and price, like a contact list: half the height of the old card, so more apps fit on screen.
function Row({ app, price, on, onPick, label, i }: CardProps) {
  const t = useT();
  return (
    <button type="button" onClick={onPick} aria-pressed={on} aria-label={label} style={enter(i)}
      className={`${base} flex items-center gap-3 rounded-2xl border bg-white p-2.5 pe-3 hover:-translate-y-0.5 hover:shadow-[0_12px_28px_-16px_rgba(15,23,42,.35)] dark:bg-[#0E1424] ${edge(on)} ${on ? "bg-indigo-50/60 dark:bg-indigo-500/10" : ""}`}>
      <Logo app={app} tint />
      <span className="min-w-0 flex-1">
        <span className="flex items-start gap-1.5"><span className="line-clamp-2 font-semibold leading-snug text-slate-900 dark:text-white">{app.name}</span>{app.popular && <span className="mt-0.5"><PopularStar /></span>}</span>
        <span className="block text-sm text-slate-600 dark:text-slate-400">{t("from")}{" "}<b className="font-semibold tabular-nums text-slate-900 dark:text-white">{price}</b></span>
      </span>
      {on && <Check aria-hidden className="h-4 w-4 shrink-0 text-indigo-600 dark:text-indigo-300" strokeWidth={3} />}
    </button>
  );
}

// ---------- B · Logo Spotlight ----------
// Centred: the logo sits in a soft glow of its own colour, the name under it and the price in a small pill.
function Spotlight({ app, price, on, onPick, label, i }: CardProps) {
  const t = useT();
  const c = appTint(app);
  return (
    <button type="button" onClick={onPick} aria-pressed={on} aria-label={label} style={enter(i)}
      className={`${base} flex flex-col items-center overflow-hidden rounded-2xl border bg-white px-3 pb-3.5 pt-5 text-center hover:-translate-y-1 hover:shadow-[0_16px_34px_-18px_rgba(15,23,42,.4)] dark:bg-[#0E1424] ${edge(on)}`}>
      <span aria-hidden style={{ backgroundImage: `radial-gradient(60% 70% at 50% 0%, ${mix(c, 30)}, transparent)` }} className={`pointer-events-none absolute inset-x-0 top-0 h-24 transition-opacity duration-700 ${ease} ${on ? "opacity-100" : "opacity-70 group-hover:opacity-100"}`} />
      {app.popular && <span className="absolute start-2.5 top-2.5"><PopularStar /></span>}
      {on && <Picked />}
      <span className={`relative transition-transform duration-700 ${ease} group-hover:-translate-y-0.5 group-hover:scale-105`}><Logo app={app} size={48} /></span>
      <span className="relative mt-2.5 w-full truncate font-semibold text-slate-900 dark:text-white">{app.name}</span>
      <span className="relative mt-2 rounded-full bg-slate-100 px-2.5 py-0.5 text-[13px] text-slate-700 dark:bg-white/10 dark:text-slate-300">{t("from")}{" "}<b className="font-semibold tabular-nums text-slate-900 dark:text-white">{price}</b></span>
    </button>
  );
}

// ---------- C · Brand Ring (live) ----------
// A calm neutral card; the brand shows as a ring of colour around the logo. On hover the card fills with a wash
// of that colour (from D) and the arrow slides. RingCard is shared with the country cards ("By country").
export function RingCard({ visual, name, popular = false, tint, price, on, onPick, label, i }: {
  visual: ReactNode; name: string; popular?: boolean; tint: string; price: string; on: boolean; onPick: () => void; label: string; i: number;
}) {
  const t = useT();
  return (
    // Hover as in D: no lift; a wash of the tint fills the card in (and stays on the chosen card).
    <button type="button" onClick={onPick} aria-pressed={on} aria-label={label} style={{ ...enter(i), "--wash": mix(tint, 12) } as CSSProperties}
      className={`${base} flex flex-col rounded-2xl border bg-white p-3.5 hover:bg-[var(--wash)] dark:bg-[#0E1424] dark:hover:bg-[var(--wash)] ${edge(on)} ${on ? "!bg-[var(--wash)]" : ""}`}>
      {on && <Picked />}
      <span className="flex items-center gap-3">
        <span style={{ boxShadow: `0 0 0 3px ${mix(tint, 35)}` }} className="rounded-xl">{visual}</span>
        <span className="min-w-0 flex-1">
          <span className={`flex items-start gap-1 ${on ? "pe-4" : ""}`}><span className="line-clamp-2 font-semibold leading-snug text-slate-900 dark:text-white">{name}</span>{popular && <span title={t("Popular")} className="mt-0.5 shrink-0 text-orange-500"><Flame aria-hidden className="h-3.5 w-3.5" /><span className="sr-only">{t("Popular")}</span></span>}</span>
        </span>
      </span>
      <span className="mt-3 flex items-center justify-between gap-2 border-t border-slate-100 pt-2.5 text-sm dark:border-white/5">
        <span className="text-slate-600 dark:text-slate-400">{t("from")}{" "}<b className="font-semibold tabular-nums text-slate-900 dark:text-white">{price}</b></span>
        <ArrowRight aria-hidden className={`h-4 w-4 text-slate-400 transition-[translate,color] duration-500 ${ease} group-hover:translate-x-0.5 group-hover:text-indigo-600 rtl:rotate-180 rtl:group-hover:-translate-x-0.5 dark:group-hover:text-indigo-300`} />
      </span>
    </button>
  );
}

function BrandRing({ app, ...rest }: CardProps) {
  return <RingCard {...rest} visual={<Logo app={app} size={38} />} name={app.name} popular={!!app.popular} tint={appTint(app)} />;
}

// A country's flag on the same 38px tile as the app logos (the ISO code when there is no flag).
export function FlagTile({ cc, flag }: { cc: string; flag?: string }) {
  return (
    <span aria-hidden className="grid h-[38px] w-[38px] shrink-0 place-items-center rounded-xl bg-white shadow-sm ring-1 ring-slate-900/5 dark:ring-white/10">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {flag ? <img src={flag} alt="" loading="lazy" className="h-[18px] w-[26px] rounded-[3px] object-cover ring-1 ring-black/10" /> : <span className="font-mono text-[11px] font-bold text-slate-900">{cc}</span>}
    </span>
  );
}

// ---------- D · Price First ----------
// The price is the big number; logo and name sit small above it. A wash of the brand colour fills in on hover.
function PriceFirst({ app, price, on, onPick, label, i }: CardProps) {
  const t = useT();
  const c = appTint(app);
  return (
    <button type="button" onClick={onPick} aria-pressed={on} aria-label={label} style={{ ...enter(i), "--wash": mix(c, 12) } as CSSProperties}
      className={`${base} flex flex-col rounded-2xl border bg-white p-3.5 hover:bg-[var(--wash)] dark:bg-[#0E1424] dark:hover:bg-[var(--wash)] ${edge(on)} ${on ? "!bg-[var(--wash)]" : ""}`}>
      {on && <Picked />}
      <span className="flex items-start gap-2 pe-6"><Logo app={app} size={28} /><span className="line-clamp-2 min-w-0 text-sm font-semibold leading-snug text-slate-800 dark:text-slate-100">{app.name}</span>{app.popular && <PopularStar />}</span>
      <span className="mt-3 text-xs text-slate-600 dark:text-slate-400">{t("from")}</span>
      <span className="font-display text-xl font-bold tabular-nums leading-tight text-slate-900 dark:text-white">{price}</span>
    </button>
  );
}

// ---------- E · Store Tile ----------
// App-store style: logo, name, and a price pill that reads like a Get button; it turns solid on hover and when chosen.
function StoreTile({ app, price, on, onPick, label, i }: CardProps) {
  return (
    <button type="button" onClick={onPick} aria-pressed={on} aria-label={label} style={enter(i)}
      className={`${base} flex flex-col items-start rounded-2xl border bg-white p-3.5 hover:-translate-y-0.5 hover:shadow-[0_12px_28px_-16px_rgba(15,23,42,.35)] dark:bg-[#0E1424] ${edge(on)}`}>
      <span className="flex w-full items-start justify-between gap-2"><Logo app={app} size={44} />{app.popular && <PopularStar />}</span>
      <span className="mt-2.5 w-full truncate font-semibold text-slate-900 dark:text-white">{app.name}</span>
      <span className={`mt-2.5 inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-semibold tabular-nums transition-colors duration-300 ${on
        ? "bg-indigo-600 text-white dark:bg-indigo-400 dark:text-indigo-950"
        : "bg-indigo-50 text-indigo-800 group-hover:bg-indigo-600 group-hover:text-white dark:bg-indigo-500/15 dark:text-indigo-200 dark:group-hover:bg-indigo-400 dark:group-hover:text-indigo-950"}`}>
        {on && <Check aria-hidden className="h-3.5 w-3.5" strokeWidth={3} />}{price}
      </span>
    </button>
  );
}

export const appCards: Record<string, ComponentType<CardProps>> = { A: Row, B: Spotlight, C: BrandRing, D: PriceFirst, E: StoreTile };

// The grid for each card: the side-by-side cards (logo beside the name) need wider columns so names fit.
const wide = "grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-2 xl:grid-cols-3";
export const cardGrid: Record<string, string> = { A: wide, C: wide, D: wide };
