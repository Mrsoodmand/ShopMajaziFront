"use client";

import { createContext, useContext, type ReactNode } from "react";
import { CurrentMark, markById, type WordStyle } from "@/design/logo/marks";
import { useLocale } from "@/i18n/client";

// The logo chosen in /design/logo (root layout reads it from decisions.json). With no choice yet, the old mark stays.
const Ctx = createContext<string | undefined>(undefined);

export function BrandProvider({ mark, children }: { mark?: string; children: ReactNode }) {
  return <Ctx.Provider value={mark}>{children}</Ctx.Provider>;
}

export const useBrandMark = () => useContext(Ctx);

// The mark alone. `id` overrides the chosen one (used on the comparison page).
export function BrandMark({ id, className = "h-8 w-8" }: { id?: string; className?: string }) {
  const chosen = useBrandMark();
  const m = markById(id ?? chosen);
  return m ? <m.Mark className={className} /> : <CurrentMark className={className} />;
}

// The name, set the way the mark asks: bold, split (light first word, bold second) or light and wide.
export function Wordmark({ id, locale: forced, className = "" }: { id?: string; locale?: "en" | "fa"; className?: string }) {
  const chosen = useBrandMark();
  const pageLocale = useLocale();
  const locale = forced ?? pageLocale;
  const style: WordStyle = markById(id ?? chosen)?.word ?? "bold";
  const [a, b] = locale === "fa" ? ["شاپ", "مجازی"] : ["Shop", "Majazi"];
  const gap = locale === "fa" ? " " : "";
  if (style === "split") return <span className={`font-display tracking-tight ${className}`}><span className="font-medium opacity-80">{a}</span>{gap}<span className="font-bold">{b}</span></span>;
  if (style === "light") return <span className={`font-display font-medium ${locale === "fa" ? "" : "tracking-wide"} ${className}`}>{a}{gap}{b}</span>;
  return <span className={`font-display font-bold tracking-tight ${className}`}>{a}{gap}{b}</span>;
}

// What the page-change loader shows: the mark breathing inside a ring whose arc runs round it.
// `tone` pins the colours (for previews that must show light or dark whatever the page theme).
export function LoaderMark({ id, size = 56, tone }: { id?: string; size?: number; tone?: "light" | "dark" }) {
  const c = tone === "light" ? { track: "stroke-slate-900/10", arc: "stroke-emerald-600", ink: "text-slate-900" }
    : tone === "dark" ? { track: "stroke-white/10", arc: "stroke-emerald-400", ink: "text-white" }
    : { track: "stroke-slate-900/10 dark:stroke-white/10", arc: "stroke-emerald-600 dark:stroke-emerald-400", ink: "text-slate-900 dark:text-white" };
  return (
    <span className="relative grid place-items-center" style={{ width: size + 24, height: size + 24 }}>
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full animate-[spin_1.1s_linear_infinite]" aria-hidden>
        <circle cx="50" cy="50" r="46" fill="none" strokeWidth="4" className={c.track} />
        <circle cx="50" cy="50" r="46" fill="none" strokeWidth="4" strokeLinecap="round" strokeDasharray="72 217" className={c.arc} />
      </svg>
      <span className="animate-[brand-breathe_1.4s_ease-in-out_infinite]" style={{ width: size, height: size }}>
        <BrandMark id={id} className={`h-full w-full ${c.ink}`} />
      </span>
    </span>
  );
}
