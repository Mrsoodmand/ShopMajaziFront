"use client";
import { useEffect, useRef, useState } from "react";
import { ChevronRight } from "lucide-react";
import { useMoney } from "@/lib/money";
import { fromPrice, subCats, subs, type SubCat } from "@/content/subs-en";
import { PageShell } from "../otp/parts";
import { ring } from "../googleVoice/clean";
import { catIcon, ProductButton, ProductPanel, SubsCheckout, SubsFaq, SubsOrderView, useSubs } from "./parts";

// Page J — "Category First": the simplest path for newcomers. Six big category tiles; open one to see its
// subscriptions; open a subscription to see its plans. A breadcrumb always shows where you are and goes back a
// level; focus moves to each new heading so keyboard and screen-reader users land in the right place.
export default function SubsJ({ slug }: { slug?: string }) {
  const usd = useMoney().format;
  const s = useSubs(slug);
  const [cat, setCat] = useState<SubCat | null>(s.product?.cat ?? null);
  // Each level's h1 is focusable; after a move, focus goes to whichever one is showing.
  const box = useRef<HTMLDivElement>(null);
  const first = useRef(true);
  const level = s.product ? 2 : cat ? 1 : 0;
  useEffect(() => { if (first.current) { first.current = false; return; } box.current?.querySelector<HTMLElement>("h1")?.focus(); window.scrollTo({ top: 0 }); }, [level, cat, s.product?.slug]);
  if (s.order) return <PageShell><div className="px-6 py-14"><SubsOrderView s={s} /></div></PageShell>;

  const catLabel = subCats.find((c) => c.id === cat)?.label;
  const crumb = `rounded-lg font-semibold text-violet-800 underline underline-offset-2 hover:text-violet-950 dark:text-violet-300 dark:hover:text-white ${ring}`;

  return (
    <PageShell>
      <div className="mx-auto max-w-5xl px-4 pb-24 pt-10 sm:px-6 sm:pt-14">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1.5 text-[15px] text-slate-600 dark:text-slate-400">
            <li>{level > 0 ? <button onClick={() => { s.select(null); setCat(null); }} className={crumb}>Subscriptions</button> : <span aria-current="page" className="font-semibold text-slate-900 dark:text-white">Subscriptions</span>}</li>
            {cat && <><ChevronRight aria-hidden className="h-4 w-4 rtl:rotate-180" /><li>{level > 1 ? <button onClick={() => s.select(null)} className={crumb}>{catLabel}</button> : <span aria-current="page" className="font-semibold text-slate-900 dark:text-white">{catLabel}</span>}</li></>}
            {s.product && <><ChevronRight aria-hidden className="h-4 w-4 rtl:rotate-180" /><li><span aria-current="page" className="font-semibold text-slate-900 dark:text-white">{s.product.name}</span></li></>}
          </ol>
        </nav>

        <div ref={box} key={`${level}-${cat}-${s.product?.slug}`} className="mt-6 animate-fade-up [animation-duration:250ms]">
          {level === 0 && (
            <>
              <h1 tabIndex={-1} className="font-display text-3xl font-bold tracking-tight text-slate-900 outline-none sm:text-5xl dark:text-white">What do you need?</h1>
              <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {subCats.map((c) => {
                  const Icon = catIcon[c.id];
                  const items = subs.filter((p) => p.cat === c.id);
                  return (
                    <li key={c.id}>
                      <button onClick={() => setCat(c.id)}
                        className={`flex w-full items-center gap-4 rounded-3xl border-2 border-slate-200 bg-white p-6 text-start transition-colors hover:border-violet-700 dark:border-white/15 dark:bg-[#0E1424] dark:hover:border-violet-400 ${ring}`}>
                        <span aria-hidden className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-violet-100 text-violet-800 dark:bg-violet-500/15 dark:text-violet-300"><Icon className="h-7 w-7" /></span>
                        <span className="min-w-0 flex-1">
                          <span className="block font-display text-xl font-semibold text-slate-900 dark:text-white">{c.label}</span>
                          <span className="text-slate-600 dark:text-slate-400">{items.length} subscriptions · from {usd(Math.min(...items.map(fromPrice)))}/mo</span>
                          <span className="mt-1 block truncate text-sm text-slate-500 dark:text-slate-400">{items.map((p) => p.name).join(", ")}</span>
                        </span>
                        <ChevronRight aria-hidden className="h-5 w-5 text-slate-400 rtl:rotate-180" />
                      </button>
                    </li>
                  );
                })}
              </ul>
            </>
          )}

          {level === 1 && cat && (
            <>
              <h1 tabIndex={-1} className="font-display text-3xl font-bold tracking-tight text-slate-900 outline-none sm:text-5xl dark:text-white">{catLabel}</h1>
              <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {subs.filter((p) => p.cat === cat).map((p) => <li key={p.slug}><ProductButton p={p} on={false} onPick={() => s.select(p)} /></li>)}
              </ul>
            </>
          )}

          {level === 2 && s.product && (
            <div className="max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 dark:border-white/15 dark:bg-[#0E1424]">
              <ProductPanel s={s} heading="h1" focusable />
            </div>
          )}
        </div>

        {level === 0 && <section aria-labelledby="faq" className="mt-20 max-w-3xl"><h2 id="faq" className="font-display text-2xl font-bold text-slate-900 dark:text-white">Common questions</h2><div className="mt-6"><SubsFaq /></div></section>}
      </div>
      <SubsCheckout s={s} />
    </PageShell>
  );
}
