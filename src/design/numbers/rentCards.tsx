"use client";

import type { ComponentType, CSSProperties, ReactNode } from "react";
import { ArrowRight, Check, ChevronRight, Flame } from "lucide-react";
import { sampleRentNumber, type RentCountry } from "@/content/rent-en";
import { ring } from "../googleVoice/clean";
import { Flag } from "./flags";
import { useT } from "@/i18n/client";

// Five versions of the country card in the Rent Number catalog (page K), chosen in /design/page-rent-card.
// Every card is one button: picking it fills the panel. The flag carries the country; the chosen card gets the
// emerald border plus a check (never colour alone). Cards sit flat on the page: a border, no shadow; hover tints
// the card. "Popular" is a small flame (as on the virtual number cards), not a badge, so the country name leads.

export type RentCardProps = {
  c: RentCountry; flag?: string; week: string; month: string; on: boolean; onPick: () => void; label: string; i: number;
};

const ease = "ease-[cubic-bezier(0.22,1,0.36,1)]";
const enter = (i: number): CSSProperties => ({ animationDelay: `${Math.min(i, 12) * 30}ms` });
const base = `group relative w-full animate-[card-in_.6s_cubic-bezier(0.22,1,0.36,1)_backwards] text-start transition-[border-color,background-color] duration-500 ${ease} ${ring}`;
const edge = (on: boolean) => on
  ? "border-emerald-700 bg-emerald-50 ring-1 ring-emerald-700 dark:border-emerald-400 dark:bg-emerald-400/10 dark:ring-emerald-400"
  : "border-slate-200 bg-white hover:border-emerald-600/40 hover:bg-emerald-50/50 dark:border-white/10 dark:bg-[#0E1424] dark:hover:border-emerald-400/40 dark:hover:bg-emerald-400/5";
const muted = "text-slate-600 dark:text-slate-400";
const strong = "font-semibold text-slate-900 dark:text-white";

// The country calling code, e.g. "+44".
const dial = (cc: string) => sampleRentNumber(cc).split(" ")[0];

function Hot() {
  const t = useT();
  return <span title={t("Popular")} className="inline-flex shrink-0 text-orange-600 dark:text-orange-400"><Flame aria-hidden className="h-3.5 w-3.5" /><span className="sr-only">{t("Popular")}</span></span>;
}

function Name({ c, className = "" }: { c: RentCountry; className?: string }) {
  return <span className={`flex min-w-0 items-center gap-1.5 ${className}`}><span className={`truncate ${strong}`}>{c.name}</span>{c.popular && <Hot />}</span>;
}

const Check20 = ({ className = "" }: { className?: string }) => (
  <span aria-hidden className={`grid h-5 w-5 place-items-center rounded-full bg-emerald-700 text-white dark:bg-emerald-400 dark:text-emerald-950 ${className}`}><Check className="h-3 w-3" strokeWidth={3} /></span>
);

// End of a row: a chevron that slides on hover, or a check once chosen. Same width either way, so nothing jumps.
function Go({ on }: { on: boolean }) {
  return on
    ? <span aria-hidden className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-emerald-700 text-white dark:bg-emerald-400 dark:text-emerald-950"><Check className="h-3.5 w-3.5" strokeWidth={3} /></span>
    : <ChevronRight aria-hidden className={`h-6 w-6 shrink-0 text-slate-400 transition-[translate,color] duration-500 ${ease} group-hover:translate-x-0.5 group-hover:text-emerald-700 rtl:rotate-180 rtl:group-hover:-translate-x-0.5 dark:text-slate-500 dark:group-hover:text-emerald-300`} />;
}

const Dial = ({ cc, className = "" }: { cc: string; className?: string }) => <span dir="ltr" className={`inline-block font-mono tabular-nums ${className}`}>{dial(cc)}</span>;

// ---------- A · Flag Row ----------
// Like the chosen Google Voice and virtual number cards: one row, flag on the start side, country with its calling
// code and free numbers, the weekly price lined up on the end side. Two to a row; names and prices scan down.
function FlagRow({ c, flag, week, on, onPick, label, i }: RentCardProps) {
  const t = useT();
  return (
    <button type="button" onClick={onPick} aria-pressed={on} aria-label={label} style={enter(i)}
      className={`${base} flex h-full items-center gap-3.5 rounded-2xl border p-3.5 ${edge(on)}`}>
      <Flag cc={c.cc} src={flag} className="h-8 w-12 rounded-md" />
      <span className="min-w-0 flex-1">
        <Name c={c} />
        <span className={`mt-0.5 block truncate text-[13px] ${muted}`}><Dial cc={c.cc} />{" · "}{t("{0} numbers free", { 0: c.stock })}</span>
      </span>
      <span className="shrink-0 text-end leading-tight">
        <b className={`block whitespace-nowrap tabular-nums ${strong}`}>{week}</b>
        <span className={`text-xs ${muted}`}>{t("a week")}</span>
      </span>
      <Go on={on} />
    </button>
  );
}

// ---------- B · Calling Code ----------
// The calling code leads in big digits, the way the number will start when you give it to an app; the flag sits
// beside it. Country under it; free numbers and the weekly price on a hairline at the bottom.
function CallingCode({ c, flag, week, on, onPick, label, i }: RentCardProps) {
  const t = useT();
  const code = dial(c.cc);
  return (
    <button type="button" onClick={onPick} aria-pressed={on} aria-label={label} style={enter(i)}
      className={`${base} flex h-full flex-col rounded-2xl border p-4 ${edge(on)}`}>
      <span className="flex items-start justify-between gap-2">
        <span dir="ltr" className="flex items-baseline gap-0.5 font-mono">
          <span className={`text-lg ${muted}`}>+</span>
          <span className={`text-3xl font-semibold tracking-tight text-slate-900 transition-colors duration-500 group-hover:text-emerald-800 dark:text-white dark:group-hover:text-emerald-300 ${on ? "!text-emerald-800 dark:!text-emerald-300" : ""}`}>{code.slice(1)}</span>
        </span>
        <span className="relative mt-1">
          <Flag cc={c.cc} src={flag} className="h-6 w-9 rounded-[5px]" />
          {on && <Check20 className="absolute -bottom-2 -end-2 ring-2 ring-emerald-50 dark:ring-[#0f2a2a]" />}
        </span>
      </span>
      <Name c={c} className="mt-2" />
      <span className="mt-auto flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5 border-t border-slate-200/80 pt-3 text-sm tabular-nums dark:border-white/10">
        <span className={muted}>{t("{0} numbers free", { 0: c.stock })}</span>
        <span className={`whitespace-nowrap ${muted}`}><b className={strong}>{week}</b>{t("/week")}</span>
      </span>
    </button>
  );
}

// ---------- C · Week & Month ----------
// For buyers deciding how long: the week and the month price side by side in a small well, so countries compare
// on the length you actually want. Flag, country and free numbers on top.
function WeekMonth({ c, flag, week, month, on, onPick, label, i }: RentCardProps) {
  const t = useT();
  const line = (name: string, price: ReactNode) => (
    <span className="flex items-baseline justify-between gap-3 py-1.5">
      <span className={`text-[13px] ${muted}`}>{name}</span>
      <b className={`whitespace-nowrap text-sm tabular-nums ${strong}`}>{price}</b>
    </span>
  );
  return (
    <button type="button" onClick={onPick} aria-pressed={on} aria-label={label} style={enter(i)}
      className={`${base} flex h-full flex-col rounded-2xl border p-4 ${edge(on)}`}>
      {on && <Check20 className="absolute end-3 top-3" />}
      <span className="flex items-center gap-3 pe-6">
        <Flag cc={c.cc} src={flag} className="h-7 w-[42px] rounded-md" />
        <span className="min-w-0">
          <Name c={c} />
          <span className={`block text-[13px] ${muted}`}>{t("{0} numbers free", { 0: c.stock })}</span>
        </span>
      </span>
      <span className="mt-auto block pt-4">
        <span className={`block divide-y rounded-xl px-3 transition-colors duration-500 ${on ? "divide-emerald-700/15 bg-white/70 dark:divide-emerald-400/15 dark:bg-white/5" : "divide-slate-200 bg-slate-50 group-hover:bg-white dark:divide-white/10 dark:bg-white/5"}`}>
          {line(t("1 week"), week)}
          {line(t("1 month"), month)}
        </span>
      </span>
    </button>
  );
}

// ---------- D · Price First ----------
// The weekly price is the big figure; flag and country small above it. A round go button fills emerald on hover
// and turns into a check when the country is chosen.
function PriceFirst({ c, flag, week, on, onPick, label, i }: RentCardProps) {
  const t = useT();
  return (
    <button type="button" onClick={onPick} aria-pressed={on} aria-label={label} style={enter(i)}
      className={`${base} flex h-full flex-col rounded-2xl border p-4 ${edge(on)}`}>
      <span className="flex items-start justify-between gap-2">
        <Flag cc={c.cc} src={flag} className="h-6 w-9 rounded-[5px]" />
        <span aria-hidden className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border transition-colors duration-300 ${on
          ? "border-emerald-700 bg-emerald-700 text-white dark:border-emerald-400 dark:bg-emerald-400 dark:text-emerald-950"
          : "border-slate-200 text-slate-500 group-hover:border-emerald-700 group-hover:bg-emerald-700 group-hover:text-white dark:border-white/15 dark:text-slate-400 dark:group-hover:border-emerald-400 dark:group-hover:bg-emerald-400 dark:group-hover:text-emerald-950"}`}>
          {on ? <Check className="h-4 w-4" strokeWidth={3} /> : <ArrowRight className={`h-4 w-4 transition-transform duration-500 ${ease} group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5`} />}
        </span>
      </span>
      <Name c={c} className="mt-3" />
      <span className={`mt-3 text-xs ${muted}`}>{t("from")}</span>
      <span className="font-display text-xl font-bold tabular-nums leading-tight text-slate-900 sm:text-2xl dark:text-white">{week}</span>
      <span className={`mt-auto pt-1 text-xs ${muted}`}>{t("a week")}</span>
    </button>
  );
}

// ---------- E · Directory ----------
// One bordered list, like a phone directory: flag, country and calling code, free numbers and the weekly price in
// columns, a chevron at the end. The most countries fit on screen, and prices compare down one column.
function Directory({ c, flag, week, on, onPick, label, i }: RentCardProps) {
  const t = useT();
  return (
    <button type="button" onClick={onPick} aria-pressed={on} aria-label={label} style={enter(i)}
      className={`${base} flex items-center gap-3 px-4 py-3 focus-visible:ring-inset focus-visible:ring-offset-0 sm:gap-4 sm:px-5 ${on ? "bg-emerald-50 dark:bg-emerald-400/10" : "hover:bg-emerald-50/50 dark:hover:bg-emerald-400/5"}`}>
      <Flag cc={c.cc} src={flag} className="h-7 w-[42px] rounded-md" />
      <span className="min-w-0 flex-1">
        <Name c={c} />
        <Dial cc={c.cc} className={`text-[13px] ${muted}`} />
      </span>
      <span className={`hidden w-32 shrink-0 text-sm sm:block ${muted}`}>{t("{0} numbers free", { 0: c.stock })}</span>
      <span className="shrink-0 text-end leading-tight">
        <b className={`block whitespace-nowrap text-sm tabular-nums ${strong}`}>{week}</b>
        <span className={`text-xs ${muted}`}>{t("a week")}</span>
      </span>
      <Go on={on} />
    </button>
  );
}

export const rentCards: Record<string, ComponentType<RentCardProps>> = { A: FlagRow, B: CallingCode, C: WeekMonth, D: PriceFirst, E: Directory };

// The list around each card: two-up rows, a grid of tiles, or one bordered directory. Rows go one to a line while
// the panel sits beside the grid (lg) and two-up again once there is room (xl).
export const rentGrid: Record<string, string> = {
  A: "mt-6 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2",
  B: "mt-6 grid grid-cols-2 gap-3 md:grid-cols-3",
  C: "mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3",
  D: "mt-6 grid grid-cols-2 gap-3 md:grid-cols-3",
  E: "mt-6 divide-y divide-slate-200 overflow-hidden rounded-3xl border border-slate-200 bg-white dark:divide-white/10 dark:border-white/10 dark:bg-[#0E1424]",
};
