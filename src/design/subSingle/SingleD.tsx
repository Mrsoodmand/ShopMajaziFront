"use client";
import { useMoney } from "@/lib/money";
import { fromPrice } from "@/content/subs-en";
import { PageShell } from "../otp/parts";
import { ActivationBadge, SubsCheckout, SubsOrderView, Tile, useSubs } from "../subs/parts";
import { BuyBox, Crumbs, DEFAULT_SLUG, H2, HowDelivered, PlanTable, Related, Trust, WhatYouGet } from "./parts";
import { useT } from "@/i18n/client";

// Single D — "Brand Hero": a hero in the product's own colour with a large title; on desktop the buy box overlaps
// the hero, so it's the first thing on the right. On phones it follows the hero. Details come below.
export default function SingleD({ slug, panel }: { slug?: string; panel?: string }) {
  const usd = useMoney().format;
  const t = useT();
  const s = useSubs(slug ?? DEFAULT_SLUG);
  if (s.order) return <PageShell><div className="px-6 py-14"><SubsOrderView s={s} /></div></PageShell>;
  const p = s.product!;
  return (
    <PageShell heroDark>
      <section aria-label={p.name} className={`relative -mt-16 overflow-hidden pb-32 pt-28 text-white [mask-image:linear-gradient(to_bottom,black_calc(100%-9rem),transparent)] ${p.color}`}>
        <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/35 to-black/60" />
        <div aria-hidden className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,.12)_1px,transparent_1px)] bg-[size:20px_20px]" />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <Crumbs p={p} light />
          <div className="mt-8 max-w-xl lg:max-w-[calc(100%-420px)]">
            <div className="flex flex-wrap items-center gap-4"><span className="rounded-2xl ring-2 ring-white/40"><Tile p={p} size="lg" /></span><ActivationBadge p={p} /></div>
            <h1 className="mt-6 font-display text-4xl font-bold tracking-tight sm:text-6xl">{p.name}</h1>
            <p className="mt-4 text-lg leading-relaxed text-white/90">{p.tagline}{t(". From")}{" "}{usd(fromPrice(p))}{" "}{t("a month.")}</p>
          </div>
        </div>
      </section>
      <div className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <div className="grid grid-cols-[minmax(0,1fr)] gap-x-10 gap-y-10 lg:grid-cols-[minmax(0,1fr)_380px]">
          <aside className="relative z-10 -mt-24 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:-mt-80"><div className="lg:sticky lg:top-24"><BuyBox s={s} panel={panel} className="shadow-2xl shadow-slate-900/20" /></div></aside>
          <div className="space-y-12 lg:col-start-1 lg:row-start-1 lg:pt-10">
            <Trust p={p} />
            <section aria-labelledby="get"><H2 id="get">{t("What you get")}</H2><div className="mt-5"><WhatYouGet p={p} /></div></section>
            <section aria-labelledby="how"><H2 id="how">{t("How it's delivered")}</H2><div className="mt-5"><HowDelivered p={p} /></div></section>
            <section aria-labelledby="plans"><H2 id="plans">{t("Plans compared")}</H2><div className="mt-5"><PlanTable p={p} /></div></section>
          </div>
        </div>
        <div className="mt-16"><Related p={p} /></div>
      </div>
      <SubsCheckout s={s} />
    </PageShell>
  );
}
