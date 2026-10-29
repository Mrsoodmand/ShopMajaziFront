"use client";
import { useRef, useState, type KeyboardEvent } from "react";
import Link from "@/i18n/Link";
import { ArrowRight, ChevronRight } from "lucide-react";
import { useMoney } from "@/lib/money";
import { categoryFrom, categoryHref, serviceHref } from "@/content/social-categories-en";
import { PageShell } from "../otp/parts";
import { card, CategoryLogo, fmtFrom, ListBelow, ListTitle, NoMatch, ring, SearchField, SearchStatus, useCategorySearch, wash } from "./listKit";
import { primary } from "../googleVoice/clean";
import { useT } from "@/i18n/client";

// List D — "Platform Explorer": platforms as a vertical tab list on the start side; the chosen one opens on the
// end side with its logo, all its services and their prices, each a link to its order page, plus a link to the
// platform's page. Arrow keys move between platforms. On phones each platform is a native disclosure instead.

export default function ListD() {
  const usd = useMoney().format;
  const tx = useT();
  const money = useMoney();
  const s = useCategorySearch();
  const [pick, setPick] = useState(s.all[0].slug);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const cur = s.list.find((c) => c.slug === pick) ?? s.list[0];

  const onKey = (e: KeyboardEvent, i: number) => {
    const n = s.list.length;
    const to = e.key === "ArrowDown" ? (i + 1) % n : e.key === "ArrowUp" ? (i - 1 + n) % n : e.key === "Home" ? 0 : e.key === "End" ? n - 1 : -1;
    if (to < 0) return;
    e.preventDefault();
    setPick(s.list[to].slug);
    tabs.current[to]?.focus();
  };

  const Services = ({ c }: { c: typeof cur }) => (
    <ul className="divide-y divide-slate-200 dark:divide-white/10">
      {c.services.map((x) => (
        <li key={x.slug}>
          <Link href={serviceHref(c, x)} className={`group flex items-center justify-between gap-4 rounded-xl px-2 py-3.5 transition-colors hover:bg-slate-50 dark:hover:bg-white/[.03] ${ring}`}>
            <span className="font-semibold text-slate-900 dark:text-white">{tx(x.name)}</span>
            <span className="flex items-center gap-3 text-sm tabular-nums text-slate-700 dark:text-slate-300">{fmtFrom(tx, x.from, money.format)}<ChevronRight aria-hidden className="h-4 w-4 text-slate-400 transition-[translate,scale,rotate] group-hover:translate-x-0.5 rtl:rotate-180" /></span>
          </Link>
        </li>
      ))}
    </ul>
  );

  return (
    <PageShell>
      <div className="mx-auto max-w-6xl px-4 pt-12 sm:px-6">
        <ListTitle />
        <SearchStatus s={s} />
        {!s.list.length ? <div className="mt-10"><div className="mb-6 max-w-md"><SearchField s={s} /></div><NoMatch s={s} /></div> : (
          <>
            {/* Desktop: tabs beside a panel. */}
            <div className="mt-10 hidden gap-8 lg:grid lg:grid-cols-[20rem_minmax(0,1fr)]">
              <div className="space-y-3">
                <SearchField s={s} />
                <div role="tablist" aria-orientation="vertical" aria-label={tx("Platforms")} className={`${card} max-h-[34rem] space-y-1 overflow-y-auto p-2`}>
                  {s.list.map((c, i) => {
                    const on = c.slug === cur.slug;
                    return (
                      <button key={c.slug} ref={(el) => { tabs.current[i] = el; }} role="tab" id={`tab-${c.slug}`} aria-selected={on} aria-controls="cat-panel" tabIndex={on ? 0 : -1}
                        onClick={() => setPick(c.slug)} onKeyDown={(e) => onKey(e, i)}
                        className={`flex w-full items-center gap-3 rounded-2xl p-2.5 text-start transition-colors ${ring} ${on ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900" : "text-slate-900 hover:bg-slate-100 dark:text-white dark:hover:bg-white/5"}`}>
                        <CategoryLogo c={c} size="sm" />
                        <span className="min-w-0 flex-1 truncate font-semibold">{tx(c.name)}</span>
                        <span className={`text-sm tabular-nums ${on ? "text-white/80 dark:text-slate-600" : "text-slate-600 dark:text-slate-400"}`}>{c.services.length}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
              <section id="cat-panel" role="tabpanel" aria-labelledby={`tab-${cur.slug}`} className={`${card} overflow-hidden`}>
                <div key={cur.slug}>
                  <div style={wash(cur, 12)} className="flex flex-wrap items-center gap-5 p-8">
                    <CategoryLogo c={cur} size="xl" />
                    <div className="min-w-0 flex-1">
                      <h2 className="font-display text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{tx(cur.name)}</h2>
                      <p className="mt-1 text-slate-700 dark:text-slate-300">{tx(cur.short)}</p>
                    </div>
                    <p className="text-end"><span className="block text-sm text-slate-600 dark:text-slate-400">{tx("Prices from")}</span><span className="font-display text-2xl font-bold tabular-nums text-slate-900 dark:text-white">{usd(categoryFrom(cur))}</span><span className="block text-sm text-slate-600 dark:text-slate-400">{tx("per 1,000")}</span></p>
                  </div>
                  <div className="p-6 sm:p-8">
                    <h3 className="font-semibold text-slate-900 dark:text-white">{cur.services.length === 1 ? tx("1 service") : tx("{0} services", { 0: cur.services.length })}</h3>
                    <div className="mt-2"><Services c={cur} /></div>
                    <Link href={categoryHref(cur)} className={`${primary} mt-6`}>{tx("Open {0} services", { 0: tx(cur.name) })}<ArrowRight aria-hidden className="h-4 w-4 rtl:rotate-180" /></Link>
                  </div>
                </div>
              </section>
            </div>

            {/* Phones and tablets: a disclosure per platform. */}
            <div className="mt-8 space-y-3 lg:hidden">
              <SearchField s={s} id="cat-search-m" />
              {s.list.map((c) => (
                <details key={c.slug} className={`${card} group [&_summary::-webkit-details-marker]:hidden`}>
                  <summary className={`flex cursor-pointer list-none items-center gap-3 rounded-3xl p-4 ${ring}`}>
                    <CategoryLogo c={c} />
                    <span className="min-w-0 flex-1"><span className="block font-semibold text-slate-900 dark:text-white">{tx(c.name)}</span><span className="block truncate text-sm text-slate-600 dark:text-slate-400">{fmtFrom(tx, categoryFrom(c), money.format)}</span></span>
                    <ChevronRight aria-hidden className="h-4 w-4 text-slate-500 transition group-open:rotate-90 rtl:rotate-180 rtl:group-open:rotate-90" />
                  </summary>
                  <div className="border-t border-slate-200 px-4 pb-4 pt-2 dark:border-white/10">
                    <Services c={c} />
                    <Link href={categoryHref(c)} className={`mt-2 inline-flex items-center gap-1.5 rounded-lg font-semibold text-slate-900 underline underline-offset-2 dark:text-white ${ring}`}>{tx("Open {0} services", { 0: tx(c.name) })}<ArrowRight aria-hidden className="h-4 w-4 rtl:rotate-180" /></Link>
                  </div>
                </details>
              ))}
            </div>
          </>
        )}
      </div>
      <ListBelow />
    </PageShell>
  );
}
