"use client";

import { useRef, useState } from "react";
import { PageShell } from "../otp/parts";
import { ring } from "../googleVoice/clean";
import { SubsCheckout, SubsOrderView, useSubs } from "../subs/parts";
import { BuyBox, Crumbs, DEFAULT_SLUG, HowDelivered, PlanTable, Related, TitleBlock, Trust, WhatYouGet } from "./parts";
import { useT } from "@/i18n/client";

const tabs = [{ id: "overview", label: "Overview" }, { id: "plans", label: "Plans" }, { id: "how", label: "How it works" }] as const;
type Tab = (typeof tabs)[number]["id"];

// Single C — "Tabs": title and the buy box side by side; the details sit in keyboard tabs (Overview, Plans, How it
// works). Hidden tab panels stay in the HTML so search engines read all of it.
export default function SingleC({ slug, panel }: { slug?: string; panel?: string }) {
  const tx = useT();
  const s = useSubs(slug ?? DEFAULT_SLUG);
  const [tab, setTab] = useState<Tab>("overview");
  const refs = useRef<Partial<Record<Tab, HTMLButtonElement | null>>>({});
  if (s.order) return <PageShell><div className="px-6 py-14"><SubsOrderView s={s} /></div></PageShell>;
  const p = s.product!;
  const onKey = (e: React.KeyboardEvent) => {
    const i = tx.tr(tabs).findIndex((t) => t.id === tab);
    const rtl = getComputedStyle(e.currentTarget).direction === "rtl";
    const next = { ArrowRight: rtl ? i - 1 : i + 1, ArrowLeft: rtl ? i + 1 : i - 1, Home: 0, End: tx.tr(tabs).length - 1 }[e.key];
    if (next === undefined) return;
    e.preventDefault();
    const t = tx.tr(tabs)[(next + tx.tr(tabs).length) % tx.tr(tabs).length].id;
    setTab(t); refs.current[t]?.focus();
  };
  return (
    <PageShell>
      <div className="mx-auto max-w-6xl px-4 pb-20 pt-8 sm:px-6 sm:pt-12">
        <Crumbs p={p} />
        <div className="mt-6 grid grid-cols-[minmax(0,1fr)] gap-x-10 gap-y-8 lg:grid-cols-[minmax(0,1fr)_380px]">
          <div className="lg:col-start-1"><TitleBlock p={p} /><Trust p={p} className="mt-5" /></div>
          <aside className="lg:col-start-2 lg:row-span-2 lg:row-start-1"><div className="lg:sticky lg:top-24"><BuyBox s={s} panel={panel} /></div></aside>
          <div className="lg:col-start-1">
            <div role="tablist" aria-label={`${p.name} details`} onKeyDown={onKey} className="flex gap-1 overflow-x-auto border-b border-slate-200 [scrollbar-width:none] dark:border-white/10">
              {tx.tr(tabs).map((t) => (
                <button key={t.id} ref={(el) => { refs.current[t.id] = el; }} role="tab" id={`t-${t.id}`} aria-selected={tab === t.id} aria-controls={`p-${t.id}`} tabIndex={tab === t.id ? 0 : -1} onClick={() => setTab(t.id)}
                  className={`relative shrink-0 px-4 py-3 text-[15px] font-semibold transition-colors after:absolute after:inset-x-3 after:-bottom-px after:h-0.5 after:rounded-full ${tab === t.id ? "text-slate-900 after:bg-violet-700 dark:text-white dark:after:bg-violet-400" : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"} ${ring}`}>{t.label}</button>
              ))}
            </div>
            <div id="p-overview" role="tabpanel" aria-labelledby="t-overview" hidden={tab !== "overview"} className="mt-6"><WhatYouGet p={p} /></div>
            <div id="p-plans" role="tabpanel" aria-labelledby="t-plans" hidden={tab !== "plans"} className="mt-6"><PlanTable p={p} /></div>
            <div id="p-how" role="tabpanel" aria-labelledby="t-how" hidden={tab !== "how"} className="mt-6"><HowDelivered p={p} /></div>
          </div>
        </div>
        <div className="mt-16"><Related p={p} /></div>
      </div>
      <SubsCheckout s={s} />
    </PageShell>
  );
}
