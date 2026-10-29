"use client";
import { useRef } from "react";

import { useMoney } from "@/lib/money";
import { fromPrice, savePct, subs, type SubPlan } from "@/content/subs-en";
import { PageShell } from "../otp/parts";
import { primary, ring, secondary } from "../googleVoice/clean";
import { FieldsForm, Notes, ProductHeader, SubsCheckout, SubsFaq, SubsOrderView, Tile, useSubs } from "./parts";

// Page E — "Featured Product": reads like a product page. The chosen subscription on top with its plans as pricing
// cards, each with its own Buy button (the longest plan marked best value); the account field sits right above.
// Below, "More subscriptions" swaps the product in place. Opens on ChatGPT Plus.
export default function SubsE({ slug }: { slug?: string }) {
  const usd = useMoney().format;
  const s = useSubs(slug ?? subs[0].slug);
  const top = useRef<HTMLDivElement>(null);
  if (s.order) return <PageShell><div className="px-6 py-14"><SubsOrderView s={s} /></div></PageShell>;
  const p = s.product!;
  const best = p.plans.reduce((a, b) => (b.price / b.months < a.price / a.months ? b : a));
  // Same product, chosen plan: open payment, or focus the field that still needs filling.
  const buy = (pl: SubPlan) => { s.setPlan(pl); s.proceed(); };

  return (
    <PageShell>
      <div className="mx-auto max-w-6xl px-4 pb-24 pt-10 sm:px-6 sm:pt-14">
        <div ref={top} key={p.slug} className="scroll-mt-24 animate-fade-up [animation-duration:300ms]">
          <ProductHeader p={p} as="h1" focusable />
          <div className="mt-6 max-w-2xl"><Notes p={p} /></div>
          {p.fields.length > 0 && <div className="mt-8 max-w-md"><FieldsForm s={s} /></div>}

          <h2 className="mt-10 text-base font-semibold text-slate-900 dark:text-white">Choose a plan</h2>
          <ul className={`mt-3 grid gap-4 ${p.plans.length >= 3 ? "md:grid-cols-3" : "md:grid-cols-2"} ${p.plans.length === 4 ? "lg:grid-cols-4" : ""}`}>
            {p.plans.map((pl) => {
              const isBest = pl.id === best.id && p.plans.length > 1;
              const save = savePct(pl);
              return (
                <li key={pl.id} className={`relative flex flex-col rounded-3xl border-2 bg-white p-6 dark:bg-[#0E1424] ${isBest ? "border-violet-700 dark:border-violet-400" : "border-slate-200 dark:border-white/15"}`}>
                  {isBest && <span className="absolute -top-3.5 start-6 rounded-full bg-violet-700 px-3 py-1 text-sm font-semibold text-white dark:bg-violet-400 dark:text-violet-950">Best value</span>}
                  <h3 className="font-display text-lg font-semibold text-slate-900 dark:text-white">{pl.name}</h3>
                  <p className="mt-4">
                    {pl.was && <span className="me-2 text-slate-500 line-through dark:text-slate-400"><span className="sr-only">Was </span>{usd(pl.was)}</span>}
                    <span className="font-display text-3xl font-bold text-slate-900 dark:text-white">{usd(pl.price)}</span>
                  </p>
                  <p className="mt-1 flex-1 text-slate-700 dark:text-slate-300">{usd(pl.price / pl.months)} a month{save > 0 && <span className="font-semibold text-amber-800 dark:text-amber-300"> · save {save}%</span>}</p>
                  <button onClick={() => buy(pl)} className={`${isBest ? primary : secondary} mt-6 w-full`}>Buy {pl.name}<span className="sr-only"> of {p.name}</span></button>
                </li>
              );
            })}
          </ul>
        </div>

        <section aria-labelledby="more" className="mt-20">
          <h2 id="more" className="font-display text-2xl font-bold text-slate-900 dark:text-white">More subscriptions</h2>
          <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {subs.filter((x) => x.slug !== p.slug).map((x) => (
              <li key={x.slug}>
                <button onClick={() => { s.select(x); setTimeout(() => { top.current?.scrollIntoView({ behavior: "smooth", block: "start" }); top.current?.querySelector<HTMLElement>("h1")?.focus({ preventScroll: true }); }, 50); }}
                  className={`flex h-full w-full flex-col items-center rounded-2xl border border-slate-200 bg-white p-4 text-center transition hover:border-violet-400 dark:border-white/15 dark:bg-[#0E1424] ${ring}`}>
                  <Tile p={x} />
                  <span className="mt-2 text-sm font-semibold leading-tight text-slate-900 dark:text-white">{x.name}</span>
                  <span className="text-xs text-slate-600 dark:text-slate-400">from {usd(fromPrice(x))}/mo</span>
                </button>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="faq" className="mt-20 max-w-3xl"><h2 id="faq" className="font-display text-2xl font-bold text-slate-900 dark:text-white">Common questions</h2><div className="mt-6"><SubsFaq /></div></section>
      </div>
      <SubsCheckout s={s} />
    </PageShell>
  );
}

