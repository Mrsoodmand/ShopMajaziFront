"use client";

import { PageShell } from "../otp/parts";
import { SubsCheckout, SubsOrderView, useSubs } from "../subs/parts";
import { BuyBox, Crumbs, DEFAULT_SLUG, H2, HowDelivered, PlanTable, Related, TitleBlock, Trust, WhatYouGet } from "./parts";
import { useT } from "@/i18n/client";

// Single A — "Overview + Sticky Buy": the details read down the left (what you get, how it's delivered, plans
// compared); the buy box follows you on the right. On phones the buy box comes right after the title.
export default function SingleA({ slug, panel }: { slug?: string; panel?: string }) {
  const t = useT();
  const s = useSubs(slug ?? DEFAULT_SLUG);
  if (s.order) return <PageShell><div className="px-6 py-14"><SubsOrderView s={s} /></div></PageShell>;
  const p = s.product!;
  return (
    <PageShell>
      <div className="mx-auto max-w-6xl px-4 pb-20 pt-8 sm:px-6 sm:pt-12">
        <Crumbs p={p} />
        <div className="mt-6 grid grid-cols-[minmax(0,1fr)] gap-x-10 gap-y-8 lg:grid-cols-[minmax(0,1fr)_380px]">
          <div className="lg:col-start-1"><TitleBlock p={p} /><Trust p={p} className="mt-5" /></div>
          <aside className="lg:col-start-2 lg:row-span-2 lg:row-start-1"><div className="lg:sticky lg:top-24"><BuyBox s={s} panel={panel} /></div></aside>
          <div className="space-y-12 lg:col-start-1">
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
