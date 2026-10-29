"use client";

import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import { PageShell } from "../otp/parts";
import { ring } from "../googleVoice/clean";
import { SubsCheckout, SubsOrderView, useSubs } from "../subs/parts";
import { BuyBox, Crumbs, DEFAULT_SLUG, HowDelivered, PlanTable, Related, Trust, WhatYouGet } from "./parts";
import { useT } from "@/i18n/client";

// Single E — "Buy First": minimal and quick. A one-line title, then the buy box straight away; the details fold
// into expandable sections underneath (native <details>, so they work with every keyboard and screen reader).
export default function SingleE({ slug, panel }: { slug?: string; panel?: string }) {
  const t = useT();
  const s = useSubs(slug ?? DEFAULT_SLUG);
  if (s.order) return <PageShell><div className="px-6 py-14"><SubsOrderView s={s} /></div></PageShell>;
  const p = s.product!;
  const fold = (title: string, body: ReactNode, open = false) => (
    <details open={open} className="group rounded-2xl border border-slate-200 bg-white dark:border-white/15 dark:bg-[#0E1424] [&_summary::-webkit-details-marker]:hidden">
      <summary className={`flex cursor-pointer list-none items-center justify-between gap-4 rounded-2xl p-5 text-[17px] font-semibold text-slate-900 dark:text-white ${ring}`}>{title}<ChevronRight aria-hidden className="h-5 w-5 text-slate-500 transition group-open:rotate-90 rtl:rotate-180 rtl:group-open:rotate-90" /></summary>
      <div className="px-5 pb-5">{body}</div>
    </details>
  );
  return (
    <PageShell>
      <div className="mx-auto max-w-xl px-4 pb-16 pt-8 sm:pt-12">
        <Crumbs p={p} />
        <h1 className="mt-6 font-display text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{t("Buy")}{" "}{p.name}</h1>
        <Trust p={p} className="mt-3" />
        <div className="mt-6"><BuyBox s={s} panel={panel} /></div>
        <div className="mt-10 space-y-3">
          {fold("What you get", <WhatYouGet p={p} />, true)}
          {fold("How it's delivered", <HowDelivered p={p} />)}
          {fold("Plans compared", <PlanTable p={p} />)}
        </div>
      </div>
      <div className="mx-auto max-w-6xl px-4 pb-16 sm:px-6"><Related p={p} /></div>
      <SubsCheckout s={s} />
    </PageShell>
  );
}
