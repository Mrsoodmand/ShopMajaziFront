"use client";

import type { ReactNode } from "react";
import { Check } from "lucide-react";
import Link from "@/i18n/Link";
import { ring } from "./googleVoice/clean";
import { useT } from "@/i18n/client";

// The "Popular:" quick picks under a hero's search, shared by every catalog page. On a coloured band ("band") they
// are see-through dark pills with white text, so they sit behind the search; on a plain page ("page") they are
// bordered white pills. A pick that selects something (onPick) is a toggle button: the chosen one turns solid with
// a check. A pick that goes somewhere (href) is a link. With no picks the whole row, label included, is left out.

export type QuickPick = { key: string; name: string; icon?: ReactNode; on?: boolean; onPick?: () => void; href?: string };

const looks = {
  band: {
    label: "text-white/85",
    off: "border-white/25 bg-slate-950/30 text-white hover:border-white/50 hover:bg-slate-950/45",
    on: "border-white bg-white text-slate-900",
    check: "text-emerald-700",
  },
  page: {
    label: "text-slate-700 dark:text-slate-300",
    off: "border-slate-300 bg-white text-slate-900 hover:border-slate-400 dark:border-white/15 dark:bg-white/5 dark:text-white dark:hover:border-white/30",
    on: "border-slate-900 bg-slate-900 text-white dark:border-white dark:bg-white dark:text-slate-900",
    check: "text-emerald-400 dark:text-emerald-700",
  },
};

// `align="start"` lines the row up with the start edge (e.g. in a catalog toolbar) instead of centring it under a hero.
export function QuickPicks({ items, tone = "band", align = "center", className = "mt-4" }: { items: QuickPick[]; tone?: keyof typeof looks; align?: "center" | "start"; className?: string }) {
  const t = useT();
  if (!items.length) return null;
  const look = looks[tone];
  const chip = (p: QuickPick) => `inline-flex h-9 items-center gap-2 rounded-full border text-sm font-semibold transition-colors duration-200 ${p.icon ? "pe-3.5 ps-1" : "px-4"} ${p.on ? look.on : look.off} ${ring}`;
  return (
    <div className={`flex flex-wrap items-center gap-2 ${align === "start" ? "justify-start" : "justify-center"} ${className}`}>
      <span className={`me-1 text-sm font-medium ${look.label}`}>{t("Popular:")}</span>
      {items.map((p) => {
        const body = <>{p.icon}{p.name}{p.on && <Check aria-hidden strokeWidth={2.5} className={`-me-1 h-4 w-4 ${look.check}`} />}</>;
        return p.href
          ? <Link key={p.key} href={p.href} className={chip(p)}>{body}</Link>
          : <button key={p.key} type="button" onClick={p.onPick} aria-pressed={!!p.on} className={chip(p)}>{body}</button>;
      })}
    </div>
  );
}
