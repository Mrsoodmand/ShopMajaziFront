"use client";

import { forwardRef, type CSSProperties, type ReactNode } from "react";
import { Search } from "lucide-react";
import { BrandMesh } from "../social/heroBackdrops";
import { field, ring } from "../googleVoice/clean";
import { useT } from "@/i18n/client";
import { PageH1 } from "@/components/seo/PageHeading";

// Shared parts for the number pages' "Catalog + Panel" designs (virtual number, rent, Google Voice). They follow
// /accounts and /virtual-service: a brand-colour band with a centred title, one big search and popular quick
// picks; then a grid of colour-washed cards, and the chosen card's options with Continue in a panel that stays
// beside the grid on desktop (below it on phones).

const ease = "ease-[cubic-bezier(0.22,1,0.36,1)]";

// Hex colour of a Tailwind background class (e.g. "bg-[#229ED9]" or "bg-sky-600"), for washes and the band.
const named: Record<string, string> = {
  "bg-indigo-600": "#4f46e5", "bg-sky-600": "#0284c7", "bg-emerald-600": "#059669", "bg-rose-600": "#e11d48",
  "bg-amber-600": "#d97706", "bg-violet-600": "#7c3aed", "bg-teal-600": "#0d9488", "bg-slate-700": "#334155", "bg-black": "#111827",
};
export const hexOf = (cls: string) => cls.match(/#[0-9a-f]{6}/i)?.[0] ?? named[cls.split(" ").find((c) => c in named) ?? ""] ?? "#6366f1";

// Brand colours of the apps people buy most, by app id (the live ids come from the backend's image names).
// The backend gives other apps a random letter colour, so those get the page's indigo instead of a wrong brand.
const brands: Record<string, string> = {
  telegram: "#229ED9", whatsapp: "#25D366", instagram: "#DD2A7B", tiktok: "#25F4EE", openai: "#10A37F", imo: "#1E88E5",
  apple: "#64748b", clubhouse: "#F1C40F", facebook: "#1877F2", twitter: "#1D9BF0", viber: "#7360F2", "line-messenger": "#06C755",
  "linked-in": "#0A66C2", gmail: "#EA4335", google: "#EA4335", yahoo: "#6001D2", discord: "#5865F2", paypal: "#0070E0",
  "snap-chat": "#FFFC00", steam: "#1B2838", netflix: "#E50914", tinder: "#FE3C72", "we-chat": "#07C160", amazon: "#FF9900",
  microsoft: "#00A4EF", "office-365": "#D83B01", signal: "#3A76F0", vk: "#0077FF", coinbase: "#0052FF", fiverr: "#1DBF73",
};
export const appTint = (app: { id: string; color: string }) => brands[app.id] ?? (/#[0-9a-f]{6}/i.test(app.color) ? hexOf(app.color) : "#6366f1");

// A soft wash of a colour, for cards that carry it.
export const wash = (hex: string, pct = 10): CSSProperties => ({ backgroundColor: `color-mix(in srgb, ${hex} ${pct}%, transparent)` });

export type Accent = "indigo" | "emerald";
const accentOn: Record<Accent, string> = {
  indigo: "border-indigo-600 ring-2 ring-indigo-600 dark:border-indigo-400 dark:ring-indigo-400",
  emerald: "border-emerald-700 ring-2 ring-emerald-700 dark:border-emerald-400 dark:ring-emerald-400",
};

// Search box focus: a clear indigo border with a soft glow and the icon turning indigo, so the box reads as
// active the moment it is clicked (mouse or keyboard).
export const searchFocus = "transition-[border-color,box-shadow,background-color] duration-300 focus:outline-none focus:border-indigo-500 focus:bg-white focus:shadow-[0_0_0_4px_rgba(99,102,241,.18),0_12px_30px_-14px_rgba(79,70,229,.55)] dark:focus:border-indigo-400 dark:focus:bg-[#0E1424] dark:focus:shadow-[0_0_0_4px_rgba(129,140,248,.25)]";
export const searchIcon = "transition-colors duration-300 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-300";

// A search box for the catalog toolbar.
export function CatalogSearch({ q, setQ, label, placeholder, className = "" }: { q: string; setQ: (v: string) => void; label: string; placeholder: string; className?: string }) {
  return (
    <label className={`group relative block ${className}`}>
      <span className="sr-only">{label}</span>
      <Search aria-hidden className={`pointer-events-none absolute start-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500 ${searchIcon}`} />
      <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={placeholder} autoComplete="off"
        className={`h-12 w-full rounded-2xl border border-slate-300 bg-white pe-4 ps-12 text-base text-slate-900 placeholder:text-slate-500 dark:border-white/15 dark:bg-white/5 dark:text-white dark:placeholder:text-slate-400 ${searchFocus}`} />
    </label>
  );
}

export type Popular = { key: string; name: string; icon: ReactNode; on?: boolean; onPick: () => void };

// The band at the top. `colors` tint it (up to four hex colours); `children` sits under the quick picks.
// The big search shows only when `setQ` is given (a page can put its search in the catalog toolbar instead).
// `backdrop` replaces the brand-colour mesh with a background of its own (e.g. GreenMesh on Google Voice).
export function CatalogHero({ id, title, sub, colors, backdrop, q, setQ, label, placeholder, popular, stats, children }: {
  id: string; title: string; sub: string; colors?: string[]; backdrop?: ReactNode; q?: string; setQ?: (v: string) => void; label?: string; placeholder?: string;
  popular: Popular[]; stats?: ReactNode; children?: ReactNode;
}) {
  const t = useT();
  return (
    <section aria-labelledby={id} className="relative isolate -mt-16 overflow-hidden pb-20 pt-16">
      {backdrop ?? <BrandMesh colors={colors ?? []} />}
      <div className="mx-auto max-w-7xl px-4 pt-12 text-center sm:px-6 sm:pt-20">
        <h1 id={id} className="mx-auto max-w-3xl text-balance font-display text-4xl font-bold tracking-tight text-white drop-shadow-[0_2px_12px_rgba(0,0,0,.25)] sm:text-6xl"><PageH1 text={title} /></h1>
        <p className="mx-auto mt-4 max-w-2xl text-pretty text-base leading-relaxed text-white/90 sm:text-lg">{sub}</p>
        {setQ && (
          <label className="group relative mx-auto mt-8 block max-w-2xl text-start">
            <span className="sr-only">{label}</span>
            <Search aria-hidden className={`pointer-events-none absolute start-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500 ${searchIcon}`} />
            <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={placeholder} autoComplete="off" className={`${field} py-4 ps-12 text-lg shadow-xl shadow-black/20 ${searchFocus}`} />
          </label>
        )}
        {popular.length > 0 && (
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
            <span className="me-1 text-sm font-semibold text-white/90">{t("Popular:")}</span>
            {popular.map((p) => (
              <button key={p.key} type="button" onClick={p.onPick} aria-pressed={!!p.on}
                className={`inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white py-1 pe-3.5 ps-1 text-sm font-semibold text-slate-900 transition-[border-color,translate] duration-500 ${ease} hover:-translate-y-0.5 hover:border-slate-400 dark:border-white/15 dark:bg-[#0E1424] dark:text-white dark:hover:border-white/40 ${ring}`}>
                {p.icon}{p.name}
              </button>
            ))}
          </div>
        )}
        {stats && <p className="mt-6 text-sm font-medium text-white/85">{stats}</p>}
        {children}
      </div>
    </section>
  );
}

// A pickable card washed in its own colour. `label` is the full spoken name of the choice.
// `compact` is the smaller card for long catalogs (the virtual number apps), four to a row on wide screens.
export function CatalogCard({ on, onPick, label, tint, visual, title, sub, price, badge, accent = "indigo", i = 0, compact = false }: {
  compact?: boolean; on: boolean; onPick: () => void; label: string; tint: string; visual: ReactNode; title: ReactNode; sub?: ReactNode; price?: ReactNode; badge?: ReactNode; accent?: Accent; i?: number;
}) {
  return (
    <button type="button" onClick={onPick} aria-pressed={on} aria-label={label} style={{ ...wash(tint, on ? 16 : 9), animationDelay: `${Math.min(i, 12) * 35}ms` }}
      className={`group relative flex h-full w-full animate-[card-in_.7s_cubic-bezier(0.22,1,0.36,1)_backwards] flex-col overflow-hidden border bg-white text-start ${compact ? "rounded-2xl p-3 sm:p-3.5" : "rounded-3xl p-4 sm:p-5"} transition-[translate,box-shadow,border-color] duration-700 ${ease} hover:-translate-y-1 hover:shadow-[0_18px_40px_-18px_rgba(15,23,42,.28)] sm:p-5 dark:bg-[#0E1424] dark:hover:shadow-[0_18px_40px_-18px_rgba(0,0,0,.8)] ${ring} ${on ? accentOn[accent] : "border-slate-200 hover:border-slate-300 dark:border-white/10 dark:hover:border-white/25"}`}>
      <span aria-hidden style={{ backgroundColor: tint }} className={`pointer-events-none absolute -end-8 -top-8 rounded-full ${compact ? "h-20 w-20" : "h-28 w-28"} opacity-15 blur-2xl transition-[scale,opacity] duration-1000 ${ease} group-hover:scale-150 group-hover:opacity-30`} />
      <span className="relative flex items-start justify-between gap-2">
        <span className={`transition-[translate,scale] duration-700 ${ease} group-hover:-translate-y-0.5 group-hover:scale-[1.06]`}>{visual}</span>
        {badge}
      </span>
      <span className={`relative block font-display font-semibold text-slate-900 dark:text-white ${compact ? "mt-2 truncate text-[15px]" : "mt-3 text-base sm:text-lg"}`}>{title}</span>
      {sub && <span className="relative mt-0.5 block text-sm text-slate-700 dark:text-slate-300">{sub}</span>}
      {price && <span className={`relative mt-auto block text-sm ${compact ? "pt-1.5" : "pt-3"} tabular-nums text-slate-700 dark:text-slate-300 [&_b]:whitespace-nowrap`}>{price}</span>}
    </button>
  );
}

export function PopularBadge() {
  const t = useT();
  return <span className="shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-900 dark:bg-amber-500/20 dark:text-amber-200">{t("Popular")}</span>;
}

// The panel beside the grid. Its first h2 takes focus after a pick on phones (see showPanel).
export const CatalogPanel = forwardRef<HTMLDivElement, { children: ReactNode }>(function CatalogPanel({ children }, ref) {
  return (
    <div ref={ref} className="scroll-mt-20 lg:sticky lg:top-24 lg:self-start">
      <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 dark:border-white/15 dark:bg-[#0E1424]">{children}</div>
    </div>
  );
});

// A numbered step inside the panel.
export function PanelStep({ n, title, done = false, children }: { n: number; title: string; done?: boolean; children: ReactNode }) {
  return (
    <section className="mt-6 first:mt-0">
      <h3 className="flex items-center gap-2 font-display text-[15px] font-semibold text-slate-900 dark:text-white">
        <span aria-hidden className={`grid h-6 w-6 shrink-0 place-items-center rounded-full text-xs font-bold ${done ? "bg-emerald-700 text-white dark:bg-emerald-400 dark:text-emerald-950" : "bg-slate-900 text-white dark:bg-white dark:text-slate-900"}`}>{n}</span>
        {title}
      </h3>
      <div className="mt-3">{children}</div>
    </section>
  );
}

// Grid shell: catalog on the start side, panel on the end side (stacked on phones).
export function CatalogLayout({ label, toolbar, children, panel }: { label: string; toolbar?: ReactNode; children: ReactNode; panel: ReactNode }) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-[minmax(0,1fr)_400px]">
      <section aria-label={label}>
        {toolbar}
        {children}
      </section>
      {panel}
    </div>
  );
}

// Phones: after a pick, scroll the panel into view and move focus to its heading.
export const isPhone = () => window.matchMedia("(max-width: 1023px)").matches;
export function showPanel(el: HTMLElement | null) {
  if (!el || !isPhone()) return;
  setTimeout(() => {
    el.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
    el.querySelector<HTMLElement>("h2")?.focus({ preventScroll: true });
  }, 80);
}

// Two-way switch (By app / By country, All apps / One app), as pressed buttons.
export function Segmented<T extends string>({ label, value, options, onChange }: { label: string; value: T; options: { id: T; label: string; icon?: ReactNode }[]; onChange: (v: T) => void }) {
  return (
    <div role="group" aria-label={label} className="inline-flex rounded-2xl border border-slate-200 bg-white p-1 dark:border-white/15 dark:bg-white/5">
      {options.map((o) => {
        const on = o.id === value;
        return (
          <button key={o.id} type="button" onClick={() => onChange(o.id)} aria-pressed={on}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-[15px] font-semibold transition-colors duration-300 ${on ? "bg-slate-900 text-white shadow-md dark:bg-white dark:text-slate-900" : "text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"} ${ring}`}>
            {o.icon}{o.label}
          </button>
        );
      })}
    </div>
  );
}

export function NoMatch({ q }: { q: string }) {
  const t = useT();
  return <p className="mt-6 rounded-3xl border border-dashed border-slate-300 p-10 text-center text-slate-600 dark:border-white/15 dark:text-slate-400">{t("Nothing matches “")}{q}”.</p>;
}
