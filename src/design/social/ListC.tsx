"use client";

import Link from "@/i18n/Link";
import { ChevronRight } from "lucide-react";
import { categoryFrom, categoryHref, type SocialCategory } from "@/content/social-categories-en";
import { PageShell } from "../otp/parts";
import { card, CategoryLogo, fmtFrom, ListBelow, ListTitle, NoMatch, ring, SearchField, SearchStatus, useCategorySearch } from "./listKit";
import { useT } from "@/i18n/client";
import { useMoney } from "@/lib/money";

// List C — "A–Z Directory": built for a long list. Featured platforms as a short row of chips up top, then every
// platform alphabetically, grouped by first letter with a letter bar to jump; each row lists the services by name
// with the lowest price. Letters with no platforms are dimmed, not hidden, so the bar never jumps around.

const letterOf = (c: SocialCategory) => c.name.slice(0, 1).toUpperCase();

export default function ListC() {
  const tx = useT();
  const money = useMoney();
  const s = useCategorySearch();
  const byName = [...s.list].sort((a, b) => tx(a.name).localeCompare(tx(b.name)));
  const groups = byName.reduce<Record<string, SocialCategory[]>>((g, c) => { (g[letterOf(c)] ??= []).push(c); return g; }, {});
  const letters = Object.keys(groups);
  const alphabet = Array.from(new Set([..."ABCDEFGHIJKLMNOPQRSTUVWXYZ", ...letters])).sort();
  const featured = s.all.filter((c) => c.featured);

  return (
    <PageShell>
      <div className="mx-auto max-w-6xl px-4 pt-12 sm:px-6">
        <ListTitle />
        <div className="mt-6 flex flex-wrap items-center gap-2">
          <span className="me-1 text-sm font-semibold text-slate-700 dark:text-slate-300">{tx("Popular:")}</span>
          {featured.map((c) => (
            <Link key={c.slug} href={categoryHref(c)} className={`inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white py-1 pe-3.5 ps-1 text-sm font-semibold text-slate-900 transition-colors hover:border-slate-400 dark:border-white/15 dark:bg-[#0E1424] dark:text-white dark:hover:border-white/40 ${ring}`}><CategoryLogo c={c} size="sm" className="!h-7 !w-7 !rounded-full" />{tx(c.name)}</Link>
          ))}
        </div>

        <div className="sticky top-16 z-20 -mx-4 mt-10 border-b border-slate-200 bg-[#F5F6FB]/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 dark:border-white/10 dark:bg-[#070B14]/95">
          <div className="grid gap-3 lg:grid-cols-[20rem_minmax(0,1fr)] lg:items-center">
            <SearchField s={s} />
            <nav aria-label={tx("Jump to letter")} className="overflow-x-auto">
              <ul className="flex gap-0.5">
                {alphabet.map((l) => groups[l]
                  ? <li key={l}><a href={`#letter-${l}`} className={`grid h-8 w-8 place-items-center rounded-lg font-display text-sm font-bold text-slate-900 hover:bg-slate-200 dark:text-white dark:hover:bg-white/10 ${ring}`}>{l}</a></li>
                  : <li key={l} aria-hidden className="grid h-8 w-8 place-items-center font-display text-sm text-slate-400 dark:text-slate-600">{l}</li>)}
              </ul>
            </nav>
          </div>
        </div>
        <SearchStatus s={s} />

        <div className="mt-8">
          {letters.length ? (
            <div className="space-y-7">
              {letters.map((l) => (
                <section key={l} id={`letter-${l}`} aria-labelledby={`h-${l}`} className="scroll-mt-44 lg:scroll-mt-36">
                  <h2 id={`h-${l}`} className="font-display text-2xl font-bold text-slate-900 dark:text-white">{l}</h2>
                  <ul className={`${card} mt-3 divide-y divide-slate-200 overflow-hidden dark:divide-white/10`}>
                    {groups[l].map((c) => (
                      <li key={c.slug}>
                        <Link href={categoryHref(c)} className={`group grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 p-4 transition-colors hover:bg-slate-50 sm:grid-cols-[auto_12rem_minmax(0,1fr)_auto_auto] sm:px-6 dark:hover:bg-white/[.03] ${ring} focus-visible:ring-inset focus-visible:ring-offset-0`}>
                          <CategoryLogo c={c} />
                          <span className="min-w-0"><span className="block truncate font-semibold text-slate-900 dark:text-white">{tx(c.name)}</span><span className="block truncate text-sm text-slate-600 sm:hidden dark:text-slate-400">{fmtFrom(tx, categoryFrom(c), money.format)}</span></span>
                          <span className="hidden truncate text-sm text-slate-600 sm:block dark:text-slate-400">{c.services.map((x) => tx(x.name)).join(" · ")}</span>
                          <span className="hidden text-sm font-semibold tabular-nums text-slate-900 sm:block dark:text-white">{fmtFrom(tx, categoryFrom(c), money.format)}</span>
                          <ChevronRight aria-hidden className="h-4 w-4 text-slate-400 transition-[translate,scale,rotate] group-hover:translate-x-0.5 rtl:rotate-180" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          ) : <NoMatch s={s} />}
        </div>
      </div>
      <ListBelow />
    </PageShell>
  );
}
