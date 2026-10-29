"use client";

import Link from "@/i18n/Link";
import { ArrowRight, Clock } from "lucide-react";
import { catLabel, type Post } from "@/content/blog-en";
import { useT } from "@/i18n/client";

// Small pieces shared by the blog-section offers.

export function Meta({ p, light = false }: { p: Post; light?: boolean }) {
  const t = useT();
  return (
    <div className={`flex items-center gap-2 text-xs ${light ? "text-white/80" : "text-slate-500 dark:text-slate-400"}`}>
      <time>{p.date}</time><span aria-hidden>·</span><span className="flex items-center gap-1"><Clock className="h-3 w-3" />{p.read}{" "}{t("read")}</span>
    </div>
  );
}

export function Chip({ p, light = false }: { p: Post; light?: boolean }) {
  const t = useT();
  return (
    <span className={`inline-block self-start rounded-full px-2.5 py-1 text-[11px] font-semibold ${light ? "bg-white/20 text-white backdrop-blur" : "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300"}`}>
      {t(catLabel(p.cat))}
    </span>
  );
}

export function Heading({ kicker, title, all = true }: { kicker: string; title: string; all?: boolean }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-6">
      <div className="max-w-2xl">
        <span className="text-sm font-semibold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">{kicker}</span>
        <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl dark:text-white">{title}</h2>
      </div>
      {all && <ViewAll />}
    </div>
  );
}

export function ViewAll() {
  const t = useT();
  return (
    <Link href="/blog" className="group flex items-center gap-1.5 rounded-full border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-800 hover:border-slate-400 dark:border-white/15 dark:text-slate-200 dark:hover:border-white/30">
      {t("All articles")}<ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5 rtl:rotate-180" />
    </Link>
  );
}
