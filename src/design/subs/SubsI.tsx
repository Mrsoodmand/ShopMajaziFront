"use client";
import { useId, useState } from "react";
import { Zap } from "lucide-react";
import { useMoney } from "@/lib/money";
import { subCats, subs, type SubCat } from "@/content/subs-en";
import { PageShell } from "../otp/parts";
import { field, ring } from "../googleVoice/clean";
import { ActivationBadge, BuyButton, FieldsForm, Notes, SubsCheckout, SubsFaq, SubsOrderView, SubsTitle, Tile, useSubs } from "./parts";

// One-tap shortcuts that fill category, subscription and plan.
const shortcuts = [
  { slug: "chatgpt-plus", plan: "gpt-1" },
  { slug: "spotify", plan: "sp-12" },
  { slug: "netflix", plan: "nf-1" },
  { slug: "canva", plan: "cv-12" },
];

// Page I — "Quick Picker": three plain dropdowns in a row (Category → Subscription → Plan), then the one field the
// product needs and Buy. Native selects work everywhere and with every screen reader. Popular picks above fill all
// three in one tap.
export default function SubsI({ slug }: { slug?: string }) {
  const usd = useMoney().format;
  const s = useSubs(slug);
  const [cat, setCat] = useState<SubCat | "">(s.product?.cat ?? "");
  const catId = useId(), prodId = useId(), planId = useId();
  if (s.order) return <PageShell><div className="px-6 py-14"><SubsOrderView s={s} /></div></PageShell>;

  const inCat = subs.filter((p) => p.cat === cat);
  const p = s.product;
  const label = "block text-base font-semibold text-slate-900 dark:text-white";

  return (
    <PageShell>
      <div className="mx-auto max-w-4xl px-4 pb-24 pt-10 sm:px-6 sm:pt-14">
        <SubsTitle sub="Pick a category, a subscription and a plan.">Buy a subscription</SubsTitle>

        <section aria-labelledby="quick" className="mt-8">
          <h2 id="quick" className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300"><Zap aria-hidden className="h-4 w-4 text-amber-600 dark:text-amber-400" />Popular picks</h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {shortcuts.map((sc) => {
              const prod = subs.find((x) => x.slug === sc.slug)!;
              const pl = prod.plans.find((x) => x.id === sc.plan)!;
              return (
                <li key={sc.plan}>
                  <button onClick={() => { setCat(prod.cat); s.select(prod); s.setPlan(pl); }}
                    className={`flex items-center gap-2 rounded-full border-2 border-slate-200 bg-white py-1.5 pe-4 ps-1.5 text-[15px] font-medium text-slate-900 hover:border-violet-700 dark:border-white/15 dark:bg-white/5 dark:text-white dark:hover:border-violet-400 ${ring}`}>
                    <Tile p={prod} size="sm" />{prod.name} · {pl.name} · {usd(pl.price)}
                  </button>
                </li>
              );
            })}
          </ul>
        </section>

        <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 dark:border-white/15 dark:bg-[#0E1424]">
          <div className="grid gap-5 md:grid-cols-3">
            <div>
              <label htmlFor={catId} className={label}>1. Category</label>
              <select id={catId} value={cat} onChange={(e) => { const c = e.target.value as SubCat; setCat(c); s.select(null); }} className={`${field} mt-2 appearance-auto`}>
                <option value="" disabled>Choose a category</option>
                {subCats.map((c) => <option key={c.id} value={c.id}>{c.label} ({subs.filter((x) => x.cat === c.id).length})</option>)}
              </select>
            </div>
            <div>
              <label htmlFor={prodId} className={label}>2. Subscription</label>
              <select id={prodId} value={p?.slug ?? ""} disabled={!cat} onChange={(e) => s.select(subs.find((x) => x.slug === e.target.value) ?? null)} className={`${field} mt-2 appearance-auto disabled:opacity-50`}>
                <option value="" disabled>{cat ? "Choose a subscription" : "Choose a category first"}</option>
                {inCat.map((x) => <option key={x.slug} value={x.slug}>{x.name}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor={planId} className={label}>3. Plan</label>
              <select id={planId} value={s.plan?.id ?? ""} disabled={!p} onChange={(e) => s.setPlan(p!.plans.find((x) => x.id === e.target.value)!)} className={`${field} mt-2 appearance-auto disabled:opacity-50`}>
                {!p && <option value="">Choose a subscription first</option>}
                {p?.plans.map((pl) => <option key={pl.id} value={pl.id}>{pl.name} · {usd(pl.price)}{pl.was ? ` (was ${usd(pl.was)})` : ""}</option>)}
              </select>
            </div>
          </div>

          {p && (
            <div key={p.slug} className="mt-8 animate-fade-up space-y-6 border-t border-slate-200 pt-8 [animation-duration:250ms] dark:border-white/10">
              <div className="flex items-center gap-3">
                <Tile p={p} />
                <div><p className="font-display text-lg font-semibold text-slate-900 dark:text-white">{p.name}</p><p className="mt-0.5 flex flex-wrap items-center gap-2 text-sm text-slate-700 dark:text-slate-300"><ActivationBadge p={p} />{p.delivery}</p></div>
              </div>
              <FieldsForm s={s} />
              <Notes p={p} />
              <div aria-live="polite" className="flex items-baseline justify-between border-t border-slate-200 pt-5 dark:border-white/10">
                <span className="text-slate-700 dark:text-slate-300">Total</span><span className="font-display text-3xl font-bold text-slate-900 dark:text-white">{s.plan ? usd(s.plan.price) : "—"}</span>
              </div>
              <BuyButton s={s} label={`Buy ${p.name} · ${s.plan ? usd(s.plan.price) : ""}`} />
            </div>
          )}
        </div>

        <section aria-labelledby="faq" className="mt-20"><h2 id="faq" className="font-display text-2xl font-bold text-slate-900 dark:text-white">Common questions</h2><div className="mt-6"><SubsFaq /></div></section>
      </div>
      <SubsCheckout s={s} />
    </PageShell>
  );
}
