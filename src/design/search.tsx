"use client";

import { useRef } from "react";
import { Search, X } from "lucide-react";
import { fieldFocus, ring } from "./googleVoice/clean";
import { useT } from "@/i18n/client";

// The site's one search box, used on every page that searches a list. Two looks:
// - "page": on the page ground or inside a panel. A bordered white field (a navy wash in dark).
// - "hero": on a coloured hero band. A white field with a soft drop shadow (deep navy in dark); its focus ring is
//   an outline, so the 2px gap shows the band itself.
// Clicking either doesn't turn it green (site-wide rule, see fieldFocus): the page field's border darkens a step,
// the hero field's shadow deepens. A clear button shows once there is text. `small` is the compact size for side
// panels and sidebars.

const ease = "ease-[cubic-bezier(0.22,1,0.36,1)]";

const base = "w-full appearance-none text-slate-900 placeholder:text-slate-500 [&::-webkit-search-cancel-button]:appearance-none dark:text-white dark:placeholder:text-slate-400";
const looks = {
  page: `border border-slate-300 bg-white dark:border-white/15 dark:bg-white/5 dark:focus:bg-[#0E1424] ${fieldFocus}`,
  hero: `border border-white/70 bg-white shadow-[0_10px_30px_-14px_rgba(2,6,23,.55)] transition-[border-color,box-shadow,background-color] duration-200 ${ease} focus:outline-none focus:border-white focus:shadow-[0_18px_40px_-16px_rgba(2,6,23,.7)] dark:border-white/15 dark:bg-[#0E1424]/80 dark:focus:border-white/40 dark:focus:bg-[#0E1424]`,
};

export function SearchInput({ value, onChange, label, placeholder, tone = "page", small = false, id, className = "" }: {
  value: string; onChange: (v: string) => void; label: string; placeholder?: string; tone?: keyof typeof looks; small?: boolean; id?: string; className?: string;
}) {
  const t = useT();
  const input = useRef<HTMLInputElement>(null);
  return (
    <div className={`group/search relative ${className}`}>
      {/* The label wraps the input, so it needs no generated id (useId differs between server and browser here). */}
      <label className="block">
        <span className="sr-only">{label}</span>
        <Search aria-hidden className={`pointer-events-none absolute top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400 ${small ? "start-3.5 h-4 w-4" : "start-4 h-[18px] w-[18px]"}`} />
        {/* Phones get 16px text so iOS doesn't zoom the page when the box is tapped. */}
        <input ref={input} id={id} type="search" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder ?? label}
          autoComplete="off" spellCheck={false} enterKeyHint="search"
          className={`${base} ${looks[tone]} ${small ? "h-11 rounded-xl pe-10 ps-10 text-base sm:text-sm" : "h-12 rounded-2xl pe-12 ps-11 text-base"}`} />
      </label>
      {value && (
        <button type="button" onClick={() => { onChange(""); input.current?.focus(); }} aria-label={t("Clear search")}
          className={`absolute top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white ${small ? "end-1.5" : "end-2"} ${ring}`}>
          <X aria-hidden className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
