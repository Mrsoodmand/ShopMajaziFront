"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { subCats, subs } from "@/content/subs-en";
import { PageShell } from "../otp/parts";
import { secondary } from "../googleVoice/clean";
import { ProductButton, ProductPanel, SearchBox, SubsCheckout, SubsFaq, SubsOrderView, useCatalog, useSubs } from "./parts";

// Page D — "Two Panes": like a mail app. All subscriptions in a scrollable list on the left (grouped by category,
// with search); the chosen one fills the right side with its plans, fields and Buy. Opens on ChatGPT Plus.
// On phones it's one pane at a time: the list, then the product with a Back button.
export default function SubsD({ slug }: { slug?: string }) {
  const s = useSubs(slug ?? subs[0].slug);
  const c = useCatalog();
  // Phones: show the product pane only after a pick (or when opened on a product's own address).
  const [detail, setDetail] = useState(!!slug);
  const pane = useRef<HTMLDivElement>(null);
  const picked = useRef(false);
  useEffect(() => { if (picked.current) pane.current?.querySelector<HTMLElement>("h2")?.focus(); }, [s.product?.slug, detail]);
  if (s.order) return <PageShell><div className="px-6 py-14"><SubsOrderView s={s} /></div></PageShell>;

  const groups = subCats.map((g) => ({ ...g, items: c.list.filter((p) => p.cat === g.id) })).filter((g) => g.items.length);

  return (
    <PageShell>
      <div className="mx-auto max-w-6xl px-4 pb-24 pt-10 sm:px-6 sm:pt-14">
        <p className="text-sm font-semibold text-violet-800 dark:text-violet-300">Subscriptions</p>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">Premium subscriptions</h1>

        <div className="mt-8 grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
          <nav aria-label="All subscriptions" className={`${detail ? "hidden lg:block" : ""} rounded-3xl border border-slate-200 bg-slate-50 p-3 lg:sticky lg:top-24 lg:max-h-[calc(100vh-8rem)] lg:self-start lg:overflow-y-auto dark:border-white/15 dark:bg-white/[.03]`}>
            <SearchBox c={c} className="p-1" />
            {groups.map((g) => (
              <div key={g.id} className="mt-4">
                <h2 className="px-3 text-xs font-semibold uppercase tracking-widest text-slate-600 dark:text-slate-400">{g.label}</h2>
                <ul className="mt-1 space-y-1">
                  {g.items.map((p) => <li key={p.slug}><ProductButton layout="row" p={p} on={s.product?.slug === p.slug} onPick={() => { picked.current = true; s.select(p); setDetail(true); window.scrollTo({ top: 0 }); }} /></li>)}
                </ul>
              </div>
            ))}
          </nav>

          <div ref={pane} className={`${detail ? "" : "hidden lg:block"} min-w-0`}>
            <button onClick={() => setDetail(false)} className={`${secondary} mb-5 lg:hidden`}><ArrowLeft aria-hidden className="h-4 w-4 rtl:rotate-180" />All subscriptions</button>
            {s.product && (
              <section key={s.product.slug} aria-label={s.product.name} className="animate-fade-up rounded-3xl border border-slate-200 bg-white p-6 [animation-duration:250ms] sm:p-8 dark:border-white/15 dark:bg-[#0E1424]">
                <ProductPanel s={s} focusable />
              </section>
            )}
          </div>
        </div>

        <section aria-labelledby="faq" className="mt-20 max-w-3xl"><h2 id="faq" className="font-display text-2xl font-bold text-slate-900 dark:text-white">Common questions</h2><div className="mt-6"><SubsFaq /></div></section>
      </div>
      <SubsCheckout s={s} />
    </PageShell>
  );
}
