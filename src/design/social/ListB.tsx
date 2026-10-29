"use client";

import Link from "@/i18n/Link";
import { ChevronRight } from "lucide-react";
import { categoryFrom, categoryHref } from "@/content/social-categories-en";
import { PageShell } from "../otp/parts";
import { card, CategoryLogo, fmtFrom, ListBelow, ListTitle, NoMatch, ring, SearchField, SearchStatus, useCategorySearch } from "./listKit";
import { useT } from "@/i18n/client";
import { useMoney } from "@/lib/money";

// List B — "Featured + Directory": Stars L's band in the site's indigo, with the title and the search inside it.
// The platforms the admin marks as featured sit as large tiles over the band's lower edge; every other platform
// follows as a compact three-column directory. While searching, it becomes one plain list of matches.

function Band() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden bg-[linear-gradient(135deg,#1e1b4b_0%,#3730a3_55%,#6366f1_100%)]">
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/40" />
      <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,.1)_1px,transparent_1px)] bg-[size:20px_20px]" />
    </div>
  );
}

export default function ListB() {
  const tx = useT();
  const money = useMoney();
  const s = useCategorySearch();
  const featured = s.searching ? [] : s.list.filter((c) => c.featured);
  const rest = s.searching ? s.list : s.list.filter((c) => !c.featured);
  return (
    <PageShell heroDark>
      <section className="relative -mt-16 overflow-hidden pb-32 pt-28">
        <Band />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <ListTitle light />
          <div className="mt-6 max-w-xl"><SearchField s={s} big onDark /></div>
          <SearchStatus s={s} />
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {featured.length > 0 && (
          <section aria-labelledby="feat-h" className="relative z-10 -mt-20">
            <h2 id="feat-h" className="sr-only">{tx("Most popular")}</h2>
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {featured.map((c) => (
                <li key={c.slug}>
                  <Link href={categoryHref(c)} className={`${card} group flex h-full flex-col p-6 shadow-2xl shadow-indigo-950/15 transition-[translate,scale,rotate] hover:-translate-y-0.5 ${ring}`}>
                    <CategoryLogo c={c} size="xl" />
                    <span className="mt-5 font-display text-xl font-bold text-slate-900 dark:text-white">{tx(c.name)}</span>
                    <span className="mt-1 text-sm text-slate-600 dark:text-slate-400">{tx(c.short)}</span>
                    <span className="mt-auto flex items-center justify-between gap-2 pt-5 text-sm font-semibold tabular-nums text-slate-900 dark:text-white">{fmtFrom(tx, categoryFrom(c), money.format)}<ChevronRight aria-hidden className="h-4 w-4 text-slate-400 transition-[translate,scale,rotate] group-hover:translate-x-0.5 rtl:rotate-180" /></span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section aria-labelledby="more-h" className={featured.length ? "mt-14" : "relative z-10 -mt-20"}>
          <h2 id="more-h" className={featured.length ? "font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-white" : "sr-only"}>{s.searching ? tx("Results") : tx("More platforms")}</h2>
          {rest.length ? (
            <ul className={`${card} mt-6 grid overflow-hidden sm:grid-cols-2 lg:grid-cols-3 ${featured.length ? "" : "mt-0 shadow-2xl shadow-indigo-950/15"}`}>
              {rest.map((c) => (
                <li key={c.slug} className="border-b border-slate-200 sm:border-e dark:border-white/10">
                  <Link href={categoryHref(c)} className={`group flex items-center gap-3 p-4 transition-colors hover:bg-slate-50 dark:hover:bg-white/[.03] ${ring} focus-visible:ring-inset focus-visible:ring-offset-0`}>
                    <CategoryLogo c={c} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-semibold text-slate-900 dark:text-white">{tx(c.name)}</span>
                      <span className="block truncate text-sm text-slate-600 dark:text-slate-400">{c.services.length === 1 ? tx("1 service") : tx("{0} services", { 0: c.services.length })} · {fmtFrom(tx, categoryFrom(c), money.format)}</span>
                    </span>
                    <ChevronRight aria-hidden className="h-4 w-4 shrink-0 text-slate-400 rtl:rotate-180" />
                  </Link>
                </li>
              ))}
            </ul>
          ) : s.searching ? <div className="mt-6"><NoMatch s={s} /></div> : null}
        </section>
      </div>
      <ListBelow />
    </PageShell>
  );
}
