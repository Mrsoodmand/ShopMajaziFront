"use client";
import { useState } from "react";
import { Check, Search } from "lucide-react";
import { useMoney } from "@/lib/money";
import { socialHeadings, socialPlatforms, socialServices, type SocialPlatform } from "@/content/social-en";
import { PageShell } from "../otp/parts";
import { Trust } from "../telegram/parts";
import { card, field, LinkField, look, PlatformIcon, QuantityPicker, ring, SocialBelow, SocialCheckout, SocialForm, SocialOrderView, SocialSummary, TierRadios, useJump, useSocial, JumpBar } from "./kit";
import { useT } from "@/i18n/client";

// Social D — "Price Board": every service on one list, for people who know what they want. Filter by platform or
// search ("tiktok views"); each row shows the price per 1,000, when it starts and the refill. Choosing a row fills
// the order details under the list (quality, amount, link). Plain site theme, summary and Continue in the sidebar.

export default function SocialD() {
  const usd = useMoney().format;
  const tx = useT();
  const s = useSocial();
  const jump = useJump(s.order);
  const [filter, setFilter] = useState<SocialPlatform | "all">("all");
  const [q, setQ] = useState("");
  if (s.order) return <PageShell><div className="px-6 py-14"><SocialOrderView o={s.order} onAgain={s.reset} /></div></PageShell>;

  const words = q.toLowerCase().split(/\s+/).filter(Boolean);
  const rows = socialServices.filter((x) => (filter === "all" || x.platform === filter) && words.every((w) => `${x.platform} ${tx(x.platform)} ${x.name} ${tx(x.name)} ${x.unit} ${tx(x.unit)}`.toLowerCase().includes(w)));
  const pName = (p: SocialPlatform) => tx(socialPlatforms.find((x) => x.id === p)!.name);

  return (
    <PageShell>
      <div className="mx-auto max-w-6xl px-4 pt-12 sm:px-6">
        <h1 className="text-balance font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl dark:text-white">{tx(socialHeadings.h1)}</h1>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-700 sm:text-lg dark:text-slate-300">{tx(socialHeadings.sub)}</p>
        <div className="mt-5"><Trust items={[tx("No password needed"), tx("Starts in minutes"), tx("Refund if it can't start")]} /></div>
      </div>

      <div id="buy" className="mx-auto mt-10 max-w-6xl scroll-mt-24 px-4 sm:px-6">
        <SocialForm s={s} className="grid grid-cols-[minmax(0,1fr)] gap-x-10 gap-y-10 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="min-w-0 space-y-6">
            <section aria-labelledby="board-h" className={`${card} overflow-hidden`}>
              <div className="space-y-4 border-b border-slate-200 p-5 sm:p-6 dark:border-white/10">
                <h2 id="board-h" className="font-display text-lg font-semibold text-slate-900 dark:text-white">{tx("Choose a service")}</h2>
                <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
                  <div className="relative xl:w-64">
                    <label htmlFor="board-search" className="sr-only">{tx("Search services")}</label>
                    <Search aria-hidden className="pointer-events-none absolute start-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                    <input id="board-search" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={tx("Search, e.g. tiktok views")} className={`${field} ps-10`} />
                  </div>
                  <div role="group" aria-label={tx("Platform")} className="flex flex-wrap gap-2">
                    {(["all", ...socialPlatforms.map((p) => p.id)] as const).map((p) => {
                      const on = filter === p;
                      return (
                        <button key={p} type="button" aria-pressed={on} onClick={() => setFilter(p)} className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-semibold transition-colors ${ring} ${on ? "border-slate-900 bg-slate-900 text-white dark:border-white dark:bg-white dark:text-slate-900" : "border-slate-300 text-slate-700 hover:bg-slate-50 dark:border-white/20 dark:text-slate-200 dark:hover:bg-white/5"}`}>
                          {on && <Check aria-hidden className="h-3.5 w-3.5" />}{p === "all" ? tx("All") : pName(p)}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
              <fieldset>
                <legend className="sr-only">{tx("Service")}</legend>
                <div aria-hidden className="hidden grid-cols-[minmax(0,1fr)_7rem_9rem_7rem] gap-4 px-6 py-2.5 text-sm font-medium text-slate-600 sm:grid dark:text-slate-400">
                  <span>{tx("Service")}</span><span className="text-end">{tx("Per 1,000")}</span><span>{tx("Starts")}</span><span>{tx("Refill")}</span>
                </div>
                <ul className="divide-y divide-slate-200 dark:divide-white/10">
                  {rows.map((x) => {
                    const on = s.service.id === x.id;
                    const refill = Math.max(...x.tiers.map((t) => t.refillDays));
                    return (
                      <li key={x.id}>
                        <label className={`grid cursor-pointer grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-4 gap-y-1 px-5 py-4 transition-colors sm:grid-cols-[auto_minmax(0,1fr)_7rem_9rem_7rem] sm:px-6 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:-outline-offset-2 has-[:focus-visible]:outline-emerald-600 dark:has-[:focus-visible]:outline-emerald-400 ${on ? look[x.platform].soft : "hover:bg-slate-50 dark:hover:bg-white/[.03]"}`}>
                          <input type="radio" name="board-service" checked={on} onChange={() => s.setService(x.id)} className="sr-only" />
                          <span className="relative">
                            <PlatformIcon p={x.platform} />
                            {on && <span aria-hidden className={`absolute -bottom-1 -end-1 grid h-5 w-5 place-items-center rounded-full ring-2 ring-white dark:ring-[#0E1424] ${look[x.platform].dot}`}><Check className="h-3 w-3 text-white dark:text-slate-950" strokeWidth={3} /></span>}
                          </span>
                          <span className="min-w-0">
                            <span className="block truncate font-semibold text-slate-900 dark:text-white">{tx(x.name)}{on && <span className="sr-only">, {tx("selected")}</span>}</span>
                            <span className="block truncate text-sm text-slate-600 dark:text-slate-400">{pName(x.platform)} · {tx(x.desc)}</span>
                          </span>
                          <span className="text-end font-display font-bold tabular-nums text-slate-900 dark:text-white">{usd(x.tiers[0].per1k)}<span className="block text-xs font-normal text-slate-600 sm:hidden dark:text-slate-400">{tx("per 1,000")}</span></span>
                          <span className="col-span-2 col-start-2 text-sm text-slate-700 sm:col-span-1 sm:col-start-auto dark:text-slate-300">{tx(x.startsIn)}<span className="sm:hidden"> · {refill ? tx("refill up to {0} days", { 0: refill }) : tx("no refill")}</span></span>
                          <span className="hidden text-sm text-slate-700 sm:block dark:text-slate-300">{refill ? tx("up to {0} days", { 0: refill }) : tx("None")}</span>
                        </label>
                      </li>
                    );
                  })}
                </ul>
                {!rows.length && <p className="px-6 py-10 text-center text-slate-600 dark:text-slate-400">{tx("No service matches “{0}”.", { 0: q })}{" "}<button type="button" onClick={() => { setQ(""); setFilter("all"); }} className={`rounded font-semibold text-slate-900 underline underline-offset-2 dark:text-white ${ring}`}>{tx("Show all services")}</button></p>}
              </fieldset>
            </section>

            <section aria-labelledby="details-h" className={`${card} space-y-8 p-6 sm:p-8`}>
              <div className="flex items-center gap-3">
                <PlatformIcon p={s.platform} />
                <h2 id="details-h" className="font-display text-lg font-semibold text-slate-900 dark:text-white">{tx(s.service.name)} · {pName(s.platform)}</h2>
              </div>
              <TierRadios s={s} />
              <QuantityPicker s={s} />
              <LinkField s={s} />
            </section>
          </div>
          <aside aria-label={tx("Your order")}>
            <div ref={jump.ref} className="lg:sticky lg:top-24"><SocialSummary s={s} /></div>
          </aside>
        </SocialForm>
      </div>
      <SocialBelow />
      <JumpBar s={s} inView={jump.inView} go={jump.go} />
      <SocialCheckout s={s} />
    </PageShell>
  );
}
