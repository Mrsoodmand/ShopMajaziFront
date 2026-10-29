"use client";
import { useRef, useState } from "react";
import { LayoutGrid } from "lucide-react";
import { useMoney } from "@/lib/money";
import { fromPrice, subCats, subs, type SubCat } from "@/content/subs-en";
import { PageShell } from "../otp/parts";
import { ring } from "../googleVoice/clean";
import { ActivationBadge, catIcon, ProductSheet, SubsCheckout, SubsFaq, SubsOrderView, SubsTitle, Tile, useSubs } from "./parts";

type TabId = SubCat | "all";
const tabs: { id: TabId; label: string }[] = [{ id: "all", label: "All" }, ...subCats];

// Page F — "Category Tabs": categories as real keyboard tabs (arrow keys, Home, End) with a count on each. Every
// subscription in the tab is a row with its own Buy button that opens the plans straight away: two taps to payment.
export default function SubsF({ slug }: { slug?: string }) {
  const usd = useMoney().format;
  const s = useSubs(slug);
  const [tab, setTab] = useState<TabId>("all");
  const refs = useRef<Partial<Record<TabId, HTMLButtonElement | null>>>({});
  const sheet = useRef<HTMLDialogElement>(null);
  if (s.order) return <PageShell><div className="px-6 py-14"><SubsOrderView s={s} /></div></PageShell>;

  const list = subs.filter((p) => tab === "all" || p.cat === tab);
  const onKey = (e: React.KeyboardEvent) => {
    const i = tabs.findIndex((t) => t.id === tab);
    const rtl = getComputedStyle(e.currentTarget).direction === "rtl";
    const next = { ArrowRight: rtl ? i - 1 : i + 1, ArrowLeft: rtl ? i + 1 : i - 1, Home: 0, End: tabs.length - 1 }[e.key];
    if (next === undefined) return;
    e.preventDefault();
    const t = tabs[(next + tabs.length) % tabs.length].id;
    setTab(t); refs.current[t]?.focus();
  };

  return (
    <PageShell>
      <div className="mx-auto max-w-4xl px-4 pb-24 pt-10 sm:px-6 sm:pt-14">
        <SubsTitle>Subscriptions</SubsTitle>

        <div role="tablist" aria-label="Categories" onKeyDown={onKey} className="mt-6 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
          {tabs.map((t) => {
            const on = t.id === tab;
            const Icon = t.id === "all" ? LayoutGrid : catIcon[t.id];
            const n = t.id === "all" ? subs.length : subs.filter((p) => p.cat === t.id).length;
            return (
              <button key={t.id} ref={(el) => { refs.current[t.id] = el; }} role="tab" id={`tab-${t.id}`} aria-selected={on} aria-controls="subs-panel" tabIndex={on ? 0 : -1} onClick={() => setTab(t.id)}
                className={`flex shrink-0 items-center gap-2 rounded-2xl border-2 px-4 py-2.5 text-[15px] font-semibold transition-colors ${on ? "border-slate-900 bg-slate-900 text-white dark:border-white dark:bg-white dark:text-slate-900" : "border-slate-200 bg-white text-slate-800 hover:border-slate-400 dark:border-white/15 dark:bg-white/5 dark:text-slate-100"} ${ring}`}>
                <Icon aria-hidden className="h-4 w-4" />{t.label}<span className={`text-sm font-normal ${on ? "opacity-80" : "text-slate-600 dark:text-slate-400"}`}>{n}</span>
              </button>
            );
          })}
        </div>

        <ul id="subs-panel" role="tabpanel" aria-labelledby={`tab-${tab}`} key={tab} className="mt-6 animate-fade-up space-y-3 [animation-duration:250ms]">
          {list.map((p) => (
            <li key={p.slug} className="flex flex-wrap items-center gap-4 rounded-3xl border border-slate-200 bg-white p-4 sm:flex-nowrap sm:p-5 dark:border-white/15 dark:bg-[#0E1424]">
              <Tile p={p} />
              <div className="min-w-0 flex-1">
                <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-white">{p.name}</h2>
                <p className="text-[15px] text-slate-600 dark:text-slate-400">{p.tagline}</p>
                <p className="mt-2"><ActivationBadge p={p} /></p>
              </div>
              <div className="flex w-full items-center justify-between gap-4 sm:w-auto sm:flex-col sm:items-end sm:gap-2">
                <span className="text-sm text-slate-700 dark:text-slate-300">from <b className="text-lg text-slate-900 dark:text-white">{usd(fromPrice(p))}</b>/mo</span>
                <button onClick={() => { s.select(p); sheet.current?.showModal(); }} aria-haspopup="dialog"
                  className={`rounded-xl bg-violet-700 px-5 py-2.5 font-semibold text-white transition-colors hover:bg-violet-800 dark:bg-violet-400 dark:text-violet-950 dark:hover:bg-violet-300 ${ring}`}>
                  Buy<span className="sr-only"> {p.name}</span>
                </button>
              </div>
            </li>
          ))}
        </ul>

        <section aria-labelledby="faq" className="mt-20"><h2 id="faq" className="font-display text-2xl font-bold text-slate-900 dark:text-white">Common questions</h2><div className="mt-6"><SubsFaq /></div></section>
      </div>
      <ProductSheet s={s} dref={sheet} />
      <SubsCheckout s={s} />
    </PageShell>
  );
}
