"use client";
import { ChevronDown } from "lucide-react";
import { useMoney } from "@/lib/money";
import { fromPrice, subCats } from "@/content/subs-en";
import { PageShell } from "../otp/parts";
import { ring } from "../googleVoice/clean";
import { ActivationBadge, BuyButton, FieldsForm, Notes, PlanRadios, SearchBox, SubsCheckout, SubsFaq, SubsOrderView, SubsTitle, Tile, useCatalog, useSubs } from "./parts";

// Page C — "Expandable List": one calm column, grouped by category. Each subscription is a row (icon, name, price,
// how it's delivered); opening a row unfolds its plans, fields and Buy right there, so nothing jumps around and
// the list stays easy to scan on a phone. One row is open at a time.
export default function SubsC({ slug }: { slug?: string }) {
  const usd = useMoney().format;
  const s = useSubs(slug);
  const c = useCatalog();
  if (s.order) return <PageShell><div className="px-6 py-14"><SubsOrderView s={s} /></div></PageShell>;

  const groups = subCats.map((g) => ({ ...g, items: c.list.filter((p) => p.cat === g.id) })).filter((g) => g.items.length);

  return (
    <PageShell>
      <div className="mx-auto max-w-3xl px-4 pb-24 pt-10 sm:px-6 sm:pt-14">
        <SubsTitle sub="Open a subscription to see its plans and price.">Subscriptions</SubsTitle>
        <SearchBox c={c} className="mt-6" />

        <div className="mt-8 space-y-10">
          {groups.map((g) => (
            <section key={g.id} aria-labelledby={`g-${g.id}`}>
              <h2 id={`g-${g.id}`} className="text-sm font-semibold uppercase tracking-widest text-slate-600 dark:text-slate-400">{g.label}</h2>
              <ul className="mt-3 divide-y divide-slate-200 overflow-hidden rounded-3xl border border-slate-200 bg-white dark:divide-white/10 dark:border-white/15 dark:bg-[#0E1424]">
                {g.items.map((p) => {
                  const open = s.product?.slug === p.slug;
                  return (
                    <li key={p.slug}>
                      <h3>
                        <button onClick={() => s.select(open ? null : p)} aria-expanded={open} aria-controls={`panel-${p.slug}`}
                          className={`flex w-full items-center gap-4 px-4 py-4 text-start transition-colors hover:bg-slate-50 sm:px-5 dark:hover:bg-white/5 ${ring} focus-visible:ring-inset focus-visible:ring-offset-0`}>
                          <Tile p={p} />
                          <span className="min-w-0 flex-1">
                            <span className="block font-semibold text-slate-900 dark:text-white">{p.name}</span>
                            <span className="block truncate text-sm text-slate-600 dark:text-slate-400">{p.tagline}</span>
                          </span>
                          <span className="hidden text-end text-sm text-slate-700 sm:block dark:text-slate-300">from<span className="block text-base font-bold text-slate-900 dark:text-white">{usd(fromPrice(p))}/mo</span></span>
                          <ChevronDown aria-hidden className={`h-5 w-5 shrink-0 text-slate-500 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
                        </button>
                      </h3>
                      {open && (
                        <div id={`panel-${p.slug}`} className="animate-fade-up space-y-6 border-t border-slate-200 bg-slate-50/60 px-4 py-6 [animation-duration:250ms] sm:px-5 dark:border-white/10 dark:bg-white/[.02]">
                          <p className="flex flex-wrap items-center gap-2 text-sm text-slate-700 dark:text-slate-300"><ActivationBadge p={p} />{p.delivery}</p>
                          <PlanRadios s={s} />
                          <FieldsForm s={s} />
                          <Notes p={p} />
                          <BuyButton s={s} label={`Buy ${s.plan?.name ?? ""} · ${s.plan ? usd(s.plan.price) : ""}`} />
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
          {groups.length === 0 && <p className="text-slate-600 dark:text-slate-400">Nothing matches “{c.q}”.</p>}
        </div>

        <section aria-labelledby="faq" className="mt-20"><h2 id="faq" className="font-display text-2xl font-bold text-slate-900 dark:text-white">Common questions</h2><div className="mt-6"><SubsFaq /></div></section>
      </div>
      <SubsCheckout s={s} />
    </PageShell>
  );
}
