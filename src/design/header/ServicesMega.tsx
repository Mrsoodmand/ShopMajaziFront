"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Link from "@/i18n/Link";
import { ChevronRight, ArrowRight, Headphones } from "lucide-react";
import { navGroups } from "@/content/nav-en";
import { useT } from "@/i18n/client";

// The "All services" mega panel (headers F and G): categories on the left, the hovered one's
// sub-categories in the middle, a support card on the right. Sits under the bar, desktop only.
export function ServicesMega({ open, onEnter, onLeave }: { open: boolean; onEnter: () => void; onLeave?: () => void }) {
  const t = useT();
  const [cat, setCat] = useState(t.tr(navGroups)[0].id);

  // Sliding pill behind the active category (same motion as the hero's catalog tabs).
  const catRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [pill, setPill] = useState({ top: 0, height: 0 });
  useLayoutEffect(() => {
    const measure = () => {
      const b = catRefs.current[cat];
      if (b) setPill({ top: b.offsetTop, height: b.offsetHeight });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [cat, open]);

  const group = t.tr(navGroups).find((g) => g.id === cat)!;

  return (
    <div onMouseEnter={onEnter} onMouseLeave={onLeave} className={`absolute inset-x-0 top-full hidden px-6 pt-2 transition-all duration-200 lg:block ${open ? "visible translate-y-0 opacity-100" : "invisible -translate-y-1 opacity-0"}`}>
      <div className="mx-auto grid max-w-7xl grid-cols-[250px_1fr_250px] overflow-hidden rounded-3xl bg-white shadow-2xl shadow-slate-900/15 ring-1 ring-slate-200 dark:bg-[#0E1424] dark:shadow-black/50 dark:ring-white/10">
        <ul className="relative space-y-1 border-e border-slate-100 bg-slate-50/70 p-3 dark:border-white/10 dark:bg-white/[.02]">
          <span aria-hidden className="absolute inset-x-3 rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 transition-all duration-500 ease-[cubic-bezier(.3,1.3,.5,1)] dark:bg-white/10 dark:ring-white/10" style={{ top: pill.top, height: pill.height }} />
          {t.tr(navGroups).map((g) => {
            const on = g.id === cat;
            return (
              <li key={g.id}>
                <button ref={(el) => { catRefs.current[g.id] = el; }} onMouseEnter={() => setCat(g.id)} onFocus={() => setCat(g.id)} onClick={() => setCat(g.id)}
                  className={`relative z-10 flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-start transition-colors duration-300 ${on ? "" : "hover:bg-white/70 dark:hover:bg-white/5"}`}>
                  <span className={`grid h-9 w-9 place-items-center rounded-xl transition-colors duration-300 ${on ? "bg-indigo-600 text-white" : "bg-white text-slate-500 ring-1 ring-slate-200 dark:bg-white/5 dark:text-slate-400 dark:ring-white/10"}`}><g.icon className="h-[18px] w-[18px]" /></span>
                  <span className="flex-1">
                    <span className={`block text-sm font-semibold transition-colors duration-300 ${on ? "text-slate-900 dark:text-white" : "text-slate-700 dark:text-slate-300"}`}>{g.label}</span>
                    <span className="block text-xs text-slate-400">{g.items.length}{" "}{t("categories")}</span>
                  </span>
                  <ChevronRight className={`h-4 w-4 transition rtl:rotate-180 ${on ? "text-indigo-600 dark:text-indigo-400" : "text-slate-300 dark:text-slate-600"}`} />
                </button>
              </li>
            );
          })}
        </ul>

        <div key={cat} className="p-6">
          <div className="flex animate-fade-up items-center justify-between [animation-duration:400ms]">
            <div className="font-display text-lg font-semibold text-slate-900 dark:text-white">{group.label}</div>
            {group.viewAll && <Link href={group.viewAll.href} className="flex items-center gap-1 text-sm font-semibold text-indigo-600 dark:text-indigo-400">{group.viewAll.label}<ArrowRight className="h-4 w-4 rtl:rotate-180" /></Link>}
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {group.items.map((it, i) => (
              <Link key={it.href} href={it.href} style={{ animationDelay: `${60 + i * 50}ms` }} className="group flex animate-fade-up items-center [animation-duration:450ms] gap-3 rounded-2xl border border-slate-200 p-3 transition hover:border-indigo-300 hover:bg-indigo-50/40 dark:border-white/10 dark:hover:border-indigo-400/50 dark:hover:bg-indigo-500/10">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300"><it.icon className="h-5 w-5" /></span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-slate-900 dark:text-white">{it.label}</span>
                  <span className="block truncate text-xs text-slate-500 dark:text-slate-400">{it.desc}</span>
                </span>
                <span className="text-end text-[11px] text-slate-400">{t("from")}<span className="block text-sm font-bold text-slate-900 dark:text-white">{it.from}</span></span>
              </Link>
            ))}
          </div>
        </div>

        <aside className="m-3 flex flex-col justify-between rounded-2xl bg-gradient-to-br from-indigo-600 to-fuchsia-500 p-5 text-white">
          <div>
            <Headphones className="h-6 w-6" />
            <div className="mt-3 font-display text-lg font-semibold">{t("Not sure what to pick?")}</div>
            <p className="mt-1 text-sm text-white/80">{t("Our team answers 24/7 and will point you to the right service.")}</p>
          </div>
          <Link href="/contact-us" className="mt-4 inline-flex items-center justify-center gap-1.5 rounded-xl bg-white py-2.5 text-sm font-semibold text-indigo-700">{t("Chat with support")}<ArrowRight className="h-4 w-4 rtl:rotate-180" /></Link>
        </aside>
      </div>
    </div>
  );
}
