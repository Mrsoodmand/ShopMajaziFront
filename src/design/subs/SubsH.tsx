"use client";
import { useEffect, useRef, useState } from "react";
import { useMoney } from "@/lib/money";
import { subCats, subs, type SubPlan, type SubProduct } from "@/content/subs-en";
import { PageShell } from "../otp/parts";
import { ring } from "../googleVoice/clean";
import { ActivationBadge, catIcon, ProductSheet, SubsCheckout, SubsFaq, SubsOrderView, SubsTitle, Tile, useSubs } from "./parts";

// Page H — "Plans on the Card": every category is a section, with a sticky bar to jump between them (it marks the
// one you're reading). Each card shows its plans as buttons: tap a plan and you go straight to payment, or to the
// one field the product needs first. The quickest route for people who know what they want.
export default function SubsH({ slug }: { slug?: string }) {
  const usd = useMoney().format;
  const s = useSubs(slug);
  const sheet = useRef<HTMLDialogElement>(null);
  const [current, setCurrent] = useState(subCats[0].id);

  // Mark the category section currently under the bar.
  useEffect(() => {
    const els = subCats.map((c) => document.getElementById(`cat-${c.id}`)).filter(Boolean) as HTMLElement[];
    const on = () => { let cur = subCats[0].id; for (const el of els) if (el.getBoundingClientRect().top < 180) cur = el.id.slice(4) as typeof cur; setCurrent(cur); };
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  if (s.order) return <PageShell><div className="px-6 py-14"><SubsOrderView s={s} /></div></PageShell>;

  const pickPlan = (p: SubProduct, pl: SubPlan) => { if (s.quickBuy(p, pl)) sheet.current?.showModal(); };

  return (
    <PageShell>
      <div className="mx-auto max-w-6xl px-4 pb-24 pt-10 sm:px-6 sm:pt-14">
        <SubsTitle sub="Tap a plan to buy it.">Subscriptions</SubsTitle>

        <nav aria-label="Categories" className="sticky top-16 z-20 -mx-4 mt-6 border-b border-slate-200 bg-[#F5F6FB]/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 dark:border-white/10 dark:bg-[#070B14]/95">
          <ul className="flex gap-2 overflow-x-auto [scrollbar-width:none]">
            {subCats.map((c) => {
              const Icon = catIcon[c.id];
              const on = current === c.id;
              return (
                <li key={c.id}>
                  <a href={`#cat-${c.id}`} aria-current={on ? "true" : undefined}
                    className={`flex shrink-0 items-center gap-2 rounded-full border-2 px-4 py-2 text-[15px] font-semibold transition-colors ${on ? "border-slate-900 bg-slate-900 text-white dark:border-white dark:bg-white dark:text-slate-900" : "border-slate-300 bg-white text-slate-800 hover:border-slate-500 dark:border-white/20 dark:bg-transparent dark:text-slate-100"} ${ring}`}>
                    <Icon aria-hidden className="h-4 w-4" />{c.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="mt-8 space-y-14">
          {subCats.map((c) => (
            <section key={c.id} id={`cat-${c.id}`} aria-labelledby={`h-${c.id}`} className="scroll-mt-36">
              <h2 id={`h-${c.id}`} className="font-display text-2xl font-bold text-slate-900 dark:text-white">{c.label}</h2>
              <ul className="mt-4 grid gap-4 md:grid-cols-2">
                {subs.filter((p) => p.cat === c.id).map((p) => (
                  <li key={p.slug} className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-white/15 dark:bg-[#0E1424]">
                    <div className="flex items-start gap-3">
                      <Tile p={p} />
                      <div className="min-w-0 flex-1">
                        <h3 className="font-display text-lg font-semibold text-slate-900 dark:text-white">{p.name}</h3>
                        <p className="text-[15px] text-slate-600 dark:text-slate-400">{p.tagline}</p>
                      </div>
                    </div>
                    <p className="mt-3"><ActivationBadge p={p} /></p>
                    <div role="group" aria-label={`${p.name} plans`} className="mt-4 flex flex-wrap gap-2">
                      {p.plans.map((pl) => (
                        <button key={pl.id} onClick={() => pickPlan(p, pl)} aria-haspopup="dialog"
                          className={`rounded-xl border-2 border-slate-200 px-3.5 py-2 text-start transition-colors hover:border-violet-700 dark:border-white/15 dark:hover:border-violet-400 ${ring}`}>
                          <span className="block text-sm text-slate-700 dark:text-slate-300">{pl.name}</span>
                          <span className="font-bold text-slate-900 dark:text-white">{usd(pl.price)}</span>
                          <span className="sr-only">. Buy {p.name} {pl.name}</span>
                        </button>
                      ))}
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <section aria-labelledby="faq" className="mt-20 max-w-3xl"><h2 id="faq" className="font-display text-2xl font-bold text-slate-900 dark:text-white">Common questions</h2><div className="mt-6"><SubsFaq /></div></section>
      </div>
      <ProductSheet s={s} dref={sheet} />
      <SubsCheckout s={s} />
    </PageShell>
  );
}
