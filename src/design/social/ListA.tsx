"use client";

import Link from "@/i18n/Link";
import { ArrowRight } from "lucide-react";
import { categoryFrom, categoryHref, serviceHref } from "@/content/social-categories-en";
import { PageShell } from "../otp/parts";
import { card, CategoryLogo, fmtFrom, ListBelow, ListTitle, NoMatch, ring, SearchField, SearchStatus, useCategorySearch } from "./listKit";
import { useT } from "@/i18n/client";
import { useMoney } from "@/lib/money";

// List A — "Category Grid": a search over every platform the admin has added, then one card per platform in the
// admin's order: logo, name, one-liner, how many services and the lowest price, plus its top three services as
// direct links. The whole card opens the platform's page. Plain site theme.

export default function ListA() {
  const tx = useT();
  const money = useMoney();
  const s = useCategorySearch();
  return (
    <PageShell>
      <div className="mx-auto max-w-6xl px-4 pt-12 sm:px-6">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-end">
          <div><ListTitle /></div>
          <SearchField s={s} />
        </div>
        <SearchStatus s={s} />
        <section aria-label={tx("Platforms")} className="mt-10">
          {s.list.length ? (
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {s.list.map((c) => (
                <li key={c.slug} className={`${card} group relative flex flex-col p-6 transition-colors hover:border-slate-300 dark:hover:border-white/30 has-[a.main:focus-visible]:ring-2 has-[a.main:focus-visible]:ring-emerald-600 dark:has-[a.main:focus-visible]:ring-emerald-400`}>
                  <div className="flex items-start gap-4">
                    <CategoryLogo c={c} size="lg" />
                    <div className="min-w-0 flex-1">
                      <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-white">
                        <Link href={categoryHref(c)} className="main outline-none after:absolute after:inset-0 after:rounded-3xl">{tx(c.name)}</Link>
                      </h2>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{tx(c.short)}</p>
                    </div>
                    <ArrowRight aria-hidden className="mt-1 h-5 w-5 shrink-0 text-slate-400 transition-[translate,scale,rotate] group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
                  </div>
                  <ul aria-label={tx("Popular {0} services", { 0: tx(c.name) })} className="relative z-10 mb-5 mt-5 flex flex-wrap gap-2">
                    {c.services.slice(0, 3).map((x) => (
                      <li key={x.slug}><Link href={serviceHref(c, x)} className={`inline-flex rounded-full border border-slate-200 px-3 py-1 text-sm font-medium text-slate-700 transition-colors hover:border-slate-400 hover:text-slate-900 dark:border-white/15 dark:text-slate-300 dark:hover:border-white/40 dark:hover:text-white ${ring}`}>{tx(x.name)}</Link></li>
                    ))}
                  </ul>
                  <p className="mt-auto flex items-baseline justify-between gap-3 border-t border-slate-200 pt-4 text-sm dark:border-white/10">
                    <span className="text-slate-600 dark:text-slate-400">{c.services.length === 1 ? tx("1 service") : tx("{0} services", { 0: c.services.length })}</span>
                    <span className="font-semibold tabular-nums text-slate-900 dark:text-white">{fmtFrom(tx, categoryFrom(c), money.format)}</span>
                  </p>
                </li>
              ))}
            </ul>
          ) : <NoMatch s={s} />}
        </section>
      </div>
      <ListBelow />
    </PageShell>
  );
}
