"use client";
import { useMoney } from "@/lib/money";
import { savePct } from "@/content/subs-en";
import { PageShell } from "../otp/parts";
import { primary, secondary } from "../googleVoice/clean";
import { BuyButton, FieldsForm, SubsCheckout, SubsOrderView, useSubs } from "../subs/parts";
import { Crumbs, DEFAULT_SLUG, H2, HowDelivered, Related, TitleBlock, Trust, WhatYouGet } from "./parts";
import { useT } from "@/i18n/client";

// Single B — "Pricing Page": a centered title, then the plans as pricing cards (the cheapest per month marked best
// value). Choosing a card selects it and moves you to the account field; Continue sits right under the cards.
export default function SingleB({ slug }: { slug?: string; panel?: string }) {
  const usd = useMoney().format;
  const t = useT();
  const s = useSubs(slug ?? DEFAULT_SLUG);
  if (s.order) return <PageShell><div className="px-6 py-14"><SubsOrderView s={s} /></div></PageShell>;
  const p = s.product!;
  const best = p.plans.reduce((a, b) => (b.price / b.months < a.price / a.months ? b : a));
  const choose = (id: string) => {
    s.setPlan(p.plans.find((x) => x.id === id)!);
    document.getElementById("buy-box")?.querySelector<HTMLElement>("input, select, button")?.focus();
  };
  return (
    <PageShell>
      <div className="mx-auto max-w-5xl px-4 pb-20 pt-8 sm:px-6 sm:pt-12">
        <Crumbs p={p} />
        <div className="mt-8"><TitleBlock p={p} center /></div>
        <Trust p={p} className="mt-5 justify-center" />

        <ul className={`mt-10 grid gap-4 ${p.plans.length === 1 ? "mx-auto max-w-sm" : p.plans.length === 2 ? "md:grid-cols-2" : p.plans.length === 3 ? "md:grid-cols-3" : "md:grid-cols-2 lg:grid-cols-4"}`}>
          {p.plans.map((pl) => {
            const on = s.plan?.id === pl.id;
            const isBest = p.plans.length > 1 && pl.id === best.id;
            return (
              <li key={pl.id} className={`relative flex flex-col rounded-3xl border-2 bg-white p-6 dark:bg-[#0E1424] ${on ? "border-violet-700 dark:border-violet-400" : "border-slate-200 dark:border-white/15"}`}>
                {isBest && <span className="absolute -top-3.5 start-6 rounded-full bg-violet-700 px-3 py-1 text-sm font-semibold text-white dark:bg-violet-400 dark:text-violet-950">{t("Best value")}</span>}
                <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-white">{pl.name}</h2>
                <p className="mt-4"><span className="font-display text-4xl font-bold text-slate-900 dark:text-white">{usd(pl.price / pl.months)}</span><span className="text-slate-600 dark:text-slate-400">{" "}{t("/mo")}</span></p>
                <p className="mt-1 flex-1 text-slate-700 dark:text-slate-300">{usd(pl.price)}{" "}{t("total")}{savePct(pl) > 0 && <span className="font-semibold text-amber-800 dark:text-amber-300">{" "}{t("· save")}{" "}{savePct(pl)}%</span>}</p>
                <button onClick={() => choose(pl.id)} aria-pressed={on} className={`${on ? primary : secondary} mt-6 w-full`}>{on ? t("Selected") : t("Choose")}<span className="sr-only"> {pl.name}</span></button>
              </li>
            );
          })}
        </ul>

        <section id="buy-box" aria-label={t("Your order")} className="mx-auto mt-8 max-w-md space-y-5 rounded-3xl border border-slate-200 bg-white p-6 dark:border-white/15 dark:bg-[#0E1424]">
          <FieldsForm s={s} />
          <BuyButton s={s} label={t("Continue · {0} · {1}", { 0: s.plan?.name ?? "", 1: s.plan ? usd(s.plan.price) : "" })} />
        </section>

        <div className="mt-16 space-y-12">
          <section aria-labelledby="get"><H2 id="get">{t("What you get")}</H2><div className="mt-5"><WhatYouGet p={p} /></div></section>
          <section aria-labelledby="how"><H2 id="how">{t("How it's delivered")}</H2><div className="mt-5"><HowDelivered p={p} /></div></section>
          <Related p={p} />
        </div>
      </div>
      <SubsCheckout s={s} />
    </PageShell>
  );
}
