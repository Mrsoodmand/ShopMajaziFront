"use client";

import type { ComponentType, CSSProperties } from "react";
import { ArrowRight, Check, ChevronRight } from "lucide-react";
import type { GvNumber } from "@/content/google-voice-en";
import { STATE_NAMES, US_GRID } from "@/lib/us-states";
import { ring } from "../googleVoice/clean";
import { useT } from "@/i18n/client";

// Five versions of the city card in the Google Voice catalog (page K), chosen in /design/page-google-voice-card.
// Every card is one button: picking it opens that city's numbers in the panel. The chosen card gets the emerald
// border plus a check (never colour alone). Cards sit flat on the page: a border, no shadow; hover tints the card.

export type City = { key: string; city: string; state: string; numbers: GvNumber[]; areas: string[]; from: number };
export type CityCardProps = { c: City; price: string; on: boolean; onPick: () => void; label: string; i: number };

const ease = "ease-[cubic-bezier(0.22,1,0.36,1)]";
const enter = (i: number): CSSProperties => ({ animationDelay: `${Math.min(i, 12) * 30}ms` });
const base = `group relative w-full animate-[card-in_.6s_cubic-bezier(0.22,1,0.36,1)_backwards] text-start transition-[border-color,background-color] duration-500 ${ease} ${ring}`;
const edge = (on: boolean) => on
  ? "border-emerald-700 bg-emerald-50 ring-1 ring-emerald-700 dark:border-emerald-400 dark:bg-emerald-400/10 dark:ring-emerald-400"
  : "border-slate-200 bg-white hover:border-emerald-600/40 hover:bg-emerald-50/50 dark:border-white/10 dark:bg-[#0E1424] dark:hover:border-emerald-400/40 dark:hover:bg-emerald-400/5";

function Picked({ className = "end-3 top-3" }: { className?: string }) {
  return <span aria-hidden className={`absolute grid h-5 w-5 place-items-center rounded-full bg-emerald-700 text-white dark:bg-emerald-400 dark:text-emerald-950 ${className}`}><Check className="h-3 w-3" strokeWidth={3} /></span>;
}

function useCount() {
  const t = useT();
  return (n: number) => (n === 1 ? t("1 number") : t("{0} numbers", { 0: n }));
}

// Area codes as written on the site, e.g. "(212) (646)".
const Areas = ({ c, className = "" }: { c: City; className?: string }) => (
  <span dir="ltr" className={`inline-block font-mono tabular-nums ${className}`}>{c.areas.map((a) => `(${a})`).join(" ")}</span>
);

// ---------- A · Area Code ----------
// The area code is the thing a Google Voice buyer is choosing, so it leads in big digits after a small +1, like a
// number being dialled. City under it; count and lowest price on a hairline at the bottom.
function AreaCode({ c, price, on, onPick, label, i }: CityCardProps) {
  const t = useT();
  const count = useCount();
  const [first, ...more] = c.areas;
  return (
    <button type="button" onClick={onPick} aria-pressed={on} aria-label={label} style={enter(i)}
      className={`${base} flex h-full flex-col rounded-2xl border p-4 ${edge(on)}`}>
      {on && <Picked />}
      <span dir="ltr" className="flex items-baseline gap-1.5 self-start font-mono">
        <span className="text-sm text-slate-500 dark:text-slate-400">+1</span>
        <span className={`text-3xl font-semibold tracking-tight text-slate-900 transition-colors duration-500 group-hover:text-emerald-800 dark:text-white dark:group-hover:text-emerald-300 ${on ? "!text-emerald-800 dark:!text-emerald-300" : ""}`}>{first}</span>
      </span>
      <span className="mt-2 font-display font-semibold leading-snug text-slate-900 dark:text-white">{c.city}, {c.state}</span>
      {more.length > 0 && <span className="text-[13px] text-slate-600 dark:text-slate-400">{t("also {0}", { 0: more.join(", ") })}</span>}
      <span className="mt-auto flex flex-wrap items-baseline justify-between gap-x-2 border-t border-slate-200/80 pt-3 text-sm tabular-nums dark:border-white/10">
        <span className="text-slate-600 dark:text-slate-400">{count(c.numbers.length)}</span>
        <span className="whitespace-nowrap text-slate-600 dark:text-slate-400">{t("from")}{" "}<b className="font-semibold text-slate-900 dark:text-white">{price}</b></span>
      </span>
    </button>
  );
}

// ---------- B · Number Preview ----------
// Shows a real number from the city, so the buyer sees what they get. Extra numbers sit as cards stacked behind it
// (one layer per extra number, up to two) and fan out a little on hover.
function NumberPreview({ c, price, on, onPick, label, i }: CityCardProps) {
  const t = useT();
  // The first number is the one the panel selects when this city is picked.
  const pick = c.numbers[0];
  const extra = c.numbers.length - 1;
  const layers = Math.min(extra, 2);
  return (
    <button type="button" onClick={onPick} aria-pressed={on} aria-label={label} style={enter(i)}
      className={`${base} flex h-full flex-col rounded-2xl border p-4 ${edge(on)}`}>
      {on && <Picked />}
      <span className="pe-7 font-display font-semibold leading-snug text-slate-900 dark:text-white">{c.city}, {c.state}</span>
      <span className="relative mt-3 block" style={{ paddingBottom: layers * 5 }}>
        {Array.from({ length: layers }, (_, l) => (
          <span key={l} aria-hidden style={{ insetInline: (l + 1) * 8, top: 0, bottom: layers * 5, transform: `translateY(${(l + 1) * 5}px)`, zIndex: 5 - l }}
            className={`absolute rounded-xl border border-slate-200 bg-slate-100 transition-[translate] duration-500 ${ease} dark:border-white/10 dark:bg-[#141b2e] ${l === 0 ? "group-hover:translate-y-[3px]" : "group-hover:translate-y-[6px]"}`} />
        ))}
        <span className={`relative z-10 flex flex-wrap items-center justify-between gap-x-2 gap-y-1 rounded-xl border bg-white px-3 py-2.5 transition-[translate,border-color] duration-500 ${ease} group-hover:-translate-y-0.5 dark:bg-[#0B1020] ${on ? "border-emerald-600/40 dark:border-emerald-400/30" : "border-slate-200 dark:border-white/10"}`}>
          <span dir="ltr" className="whitespace-nowrap font-mono text-[17px] font-semibold tabular-nums tracking-tight text-slate-900 dark:text-white">{pick.number}</span>
          {pick.easy && <span className="shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-900 dark:bg-amber-400/15 dark:text-amber-200">{t("Easy to remember")}</span>}
        </span>
      </span>
      <span className="mt-auto flex flex-wrap items-baseline justify-between gap-x-2 pt-4 text-sm tabular-nums">
        <span className="text-slate-600 dark:text-slate-400">{extra > 0 ? t("+{0} more", { 0: extra }) : t("1 number")}</span>
        <span className="whitespace-nowrap text-slate-600 dark:text-slate-400">{t("from")}{" "}<b className="font-semibold text-slate-900 dark:text-white">{price}</b></span>
      </span>
    </button>
  );
}

// ---------- C · Map Pin ----------
// A small tile map of the US with the city's state lit in emerald, so "where is this number from" reads at a
// glance. Row card: map on the start side, city, state name, area codes and price beside it.
function MiniMap({ state, on }: { state: string; on: boolean }) {
  return (
    <span aria-hidden className="grid shrink-0 grid-cols-[repeat(11,6px)] grid-rows-[repeat(8,6px)] gap-[2px] rounded-xl bg-slate-50 p-2 ring-1 ring-slate-200/70 dark:bg-white/5 dark:ring-white/10">
      {US_GRID.map(([st, r, col]) => (
        <span key={st} style={{ gridRow: r + 1, gridColumn: col + 1 }}
          className={st === state
            ? `rounded-[2px] bg-emerald-600 transition-transform duration-500 ${ease} group-hover:scale-[1.6] dark:bg-emerald-400 ${on ? "scale-[1.6]" : ""}`
            : "rounded-[2px] bg-slate-300/70 dark:bg-white/15"} />
      ))}
    </span>
  );
}

function MapPin({ c, price, on, onPick, label, i }: CityCardProps) {
  const t = useT();
  const count = useCount();
  return (
    <button type="button" onClick={onPick} aria-pressed={on} aria-label={label} style={enter(i)}
      className={`${base} flex h-full items-center gap-4 rounded-2xl border p-3 pe-4 ${edge(on)}`}>
      {on && <Picked className="end-3 top-3" />}
      <MiniMap state={c.state} on={on} />
      <span className="min-w-0 flex-1">
        <span className="block truncate pe-6 font-display font-semibold text-slate-900 dark:text-white">{c.city}</span>
        <span className="block truncate text-[13px] text-slate-600 dark:text-slate-400">{STATE_NAMES[c.state] ?? c.state} · <Areas c={c} /></span>
        <span className="mt-1.5 block text-sm tabular-nums text-slate-600 dark:text-slate-400">{count(c.numbers.length)} · {t("from")}{" "}<b className="font-semibold text-slate-900 dark:text-white">{price}</b></span>
      </span>
    </button>
  );
}

// ---------- D · Price First ----------
// The lowest price is the big figure; the city sits small above it and the area codes below. A round "go" button
// at the end fills emerald on hover and turns into a check when the city is chosen.
function PriceFirst({ c, price, on, onPick, label, i }: CityCardProps) {
  const t = useT();
  const count = useCount();
  return (
    <button type="button" onClick={onPick} aria-pressed={on} aria-label={label} style={enter(i)}
      className={`${base} flex h-full flex-col rounded-2xl border p-4 ${edge(on)}`}>
      <span className="flex items-start justify-between gap-2">
        <span className="min-w-0">
          <span className="block truncate font-semibold text-slate-900 dark:text-white">{c.city}</span>
          <span className="block text-[13px] text-slate-600 dark:text-slate-400">{c.state} · {count(c.numbers.length)}</span>
        </span>
        <span aria-hidden className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border transition-colors duration-300 ${on
          ? "border-emerald-700 bg-emerald-700 text-white dark:border-emerald-400 dark:bg-emerald-400 dark:text-emerald-950"
          : "border-slate-200 text-slate-500 group-hover:border-emerald-700 group-hover:bg-emerald-700 group-hover:text-white dark:border-white/15 dark:text-slate-400 dark:group-hover:border-emerald-400 dark:group-hover:bg-emerald-400 dark:group-hover:text-emerald-950"}`}>
          {on ? <Check className="h-4 w-4" strokeWidth={3} /> : <ArrowRight className={`h-4 w-4 transition-transform duration-500 ${ease} group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5`} />}
        </span>
      </span>
      <span className="mt-4 text-xs text-slate-600 dark:text-slate-400">{t("from")}</span>
      <span className="font-display text-xl font-bold tabular-nums leading-tight text-slate-900 sm:text-2xl dark:text-white">{price}</span>
      <Areas c={c} className="mt-auto self-start pt-3 text-[13px] text-slate-600 dark:text-slate-400" />
    </button>
  );
}

// ---------- E · Directory ----------
// One bordered list, like a phone directory: state tile, city and area codes, then count and price lined up in
// columns, a chevron at the end. The most cities fit on screen, and prices compare down one column.
function Directory({ c, price, on, onPick, label, i }: CityCardProps) {
  const t = useT();
  const count = useCount();
  return (
    <button type="button" onClick={onPick} aria-pressed={on} aria-label={label} style={enter(i)}
      className={`${base} flex items-center gap-3 px-4 py-3 focus-visible:ring-inset focus-visible:ring-offset-0 sm:gap-4 sm:px-5 ${on ? "bg-emerald-50 dark:bg-emerald-400/10" : "hover:bg-emerald-50/50 dark:hover:bg-emerald-400/5"}`}>
      <span aria-hidden className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl font-display text-sm font-bold transition-colors duration-300 ${on ? "bg-emerald-700 text-white dark:bg-emerald-400 dark:text-emerald-950" : "bg-emerald-50 text-emerald-800 ring-1 ring-emerald-700/10 dark:bg-emerald-400/10 dark:text-emerald-300 dark:ring-emerald-400/20"}`}>{c.state}</span>
      <span className="min-w-0 flex-1">
        <span className="block truncate font-semibold text-slate-900 dark:text-white">{c.city}</span>
        <Areas c={c} className="text-[13px] text-slate-600 dark:text-slate-400" />
      </span>
      <span className="hidden w-24 shrink-0 text-sm text-slate-600 sm:block dark:text-slate-400">{count(c.numbers.length)}</span>
      <span className="shrink-0 text-end text-sm tabular-nums">
        <span className="block text-xs text-slate-600 dark:text-slate-400">{t("from")}</span>
        <b className="whitespace-nowrap font-semibold text-slate-900 dark:text-white">{price}</b>
      </span>
      {on
        ? <span aria-hidden className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-emerald-700 text-white dark:bg-emerald-400 dark:text-emerald-950"><Check className="h-3.5 w-3.5" strokeWidth={3} /></span>
        : <ChevronRight aria-hidden className={`h-5 w-5 shrink-0 text-slate-400 transition-[translate,color] duration-500 ${ease} group-hover:translate-x-0.5 group-hover:text-emerald-700 rtl:rotate-180 rtl:group-hover:-translate-x-0.5 dark:group-hover:text-emerald-300`} />}
    </button>
  );
}

export const cityCards: Record<string, ComponentType<CityCardProps>> = { A: AreaCode, B: NumberPreview, C: MapPin, D: PriceFirst, E: Directory };

// The list around each card: a grid of tiles, two-up rows, or one bordered directory.
export const cityGrid: Record<string, string> = {
  A: "mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3",
  B: "mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3",
  C: "mt-6 grid grid-cols-1 gap-3 md:grid-cols-2",
  D: "mt-6 grid grid-cols-2 gap-3 md:grid-cols-3",
  E: "mt-6 divide-y divide-slate-200 overflow-hidden rounded-3xl border border-slate-200 bg-white dark:divide-white/10 dark:border-white/10 dark:bg-[#0E1424]",
};
