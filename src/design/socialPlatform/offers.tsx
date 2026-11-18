"use client";

import { useRef, type ReactNode } from "react";
import { Check, ChevronDown, Minus, Plus, ShieldCheck } from "lucide-react";
import { useT } from "@/i18n/client";
import { useMoney } from "@/lib/money";
import type { LiveService } from "@/lib/social";
import { PageShell } from "../otp/parts";
import { Trust } from "../telegram/parts";
import { field } from "../social/kit";
import { LiveAmount, LiveCheckout, LiveFields, LiveMark, LiveNotice, LiveSummary, toneOf, type LiveOrder } from "../social/liveOrder";
import { card, FactTiles, PayBar, primary, ring, Section, toneVars, useOnScreen, useTotal } from "../socialService/parts";
import { Crumb, deliveryOf, Done, Empty, featureOf, notesOf, PlatformBelow, PlatformRoot, PlatformSwitch, serviceIcon, Title, usePlatform, useRange } from "./parts";

// Platform page (/virtual-service/{platform}) — offers F–J, all mobile first and all on the live order logic.
// Shared pieces in ./parts.tsx; the order form, summary and checkout are the live ones from social/liveOrder.tsx.

const trustItems = (tx: ReturnType<typeof useT>) => [tx("No password needed"), tx("24/7 support"), tx("Refund if it can't start")];

// A service choice as a radio card: icon in the platform colour, name, feature, delivery and the price from.
export function ServiceCard({ o, s, className = "", wash = false }: { o: LiveOrder; s: LiveService; className?: string; wash?: boolean }) {
  const tx = useT();
  const money = useMoney();
  const on = o.service?.id === s.id;
  const Icon = serviceIcon(s);
  const feature = featureOf(s);
  const delivery = deliveryOf(s);
  return (
    <label className={`group relative flex cursor-pointer flex-col rounded-3xl border-2 p-4 transition-[border-color,box-shadow,transform] duration-200 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-emerald-600 has-[:focus-visible]:ring-offset-2 dark:has-[:focus-visible]:ring-emerald-400 dark:has-[:focus-visible]:ring-offset-[#070B14] sm:p-5
      ${on ? "border-[var(--tone)] shadow-lg shadow-[color-mix(in_oklab,var(--tone)_25%,transparent)]" : "border-slate-200 hover:-translate-y-0.5 hover:border-slate-300 dark:border-white/10 dark:hover:border-white/25"}
      ${wash ? "bg-[color-mix(in_oklab,var(--tone)_7%,white)] dark:bg-[color-mix(in_oklab,var(--tone)_10%,#0E1424)]" : "bg-white dark:bg-[#0E1424]"} ${className}`}>
      <input type="radio" name="pf-service" checked={on} onChange={() => o.setService(s.id)} className="sr-only" />
      <span className="flex items-start justify-between gap-3">
        <span aria-hidden className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl transition-colors ${on ? "bg-[var(--tone)] text-white" : "bg-[color-mix(in_oklab,var(--tone)_14%,transparent)] text-[color-mix(in_oklab,var(--tone)_75%,black)] dark:text-[color-mix(in_oklab,var(--tone)_60%,white)]"}`}><Icon className="h-5 w-5" /></span>
        <span aria-hidden className={`grid h-6 w-6 place-items-center rounded-full border-2 transition-colors ${on ? "border-[var(--tone)] bg-[var(--tone)] text-white" : "border-slate-300 dark:border-white/25"}`}>{on && <Check className="h-3.5 w-3.5" strokeWidth={3} />}</span>
      </span>
      <span className="mt-4 font-semibold leading-snug text-slate-900 dark:text-white">{s.name}</span>
      {(feature || delivery) && <span className="mt-1 text-sm text-slate-600 dark:text-slate-400">{[delivery, feature].filter(Boolean).join(" · ")}</span>}
      <span className="mt-auto pt-4 text-sm tabular-nums text-slate-600 dark:text-slate-400">{tx("from")} <span className="font-display text-lg font-bold text-slate-900 dark:text-white">{money.format(s.per1000)}</span> <span className="whitespace-nowrap">/ {o.num(1000)}</span></span>
    </label>
  );
}

// The amount, the fields and nothing else: the form card every offer shares.
function OrderCard({ o, className = "" }: { o: LiveOrder; className?: string }) {
  const tx = useT();
  return (
    <section aria-label={tx("Choose")} className={`${card} min-w-0 space-y-8 p-5 sm:p-8 ${className}`}>
      <Empty o={o} />
      {o.service && !o.d.error && <><LiveAmount o={o} /><LiveFields o={o} /></>}
    </section>
  );
}

// =====================================================================================================
// F — Service Shelf: a light header with the platform switch, then every service as a card on one shelf (a swipe
// row on phones, a grid from tablets). The chosen card lifts in the platform colour; amount, link and the sticky
// summary follow.
// =====================================================================================================

function BodyF() {
  const tx = useT();
  const { d, o } = usePlatform();
  const [sumRef, sumOn] = useOnScreen<HTMLDivElement>();
  if (o.order) return <Done o={o} />;
  return (
    <PageShell>
      <div style={{ ...o.tone.vars, ...toneVars(d) }}>
        <header className="relative overflow-hidden">
          <div aria-hidden className="absolute inset-x-0 top-0 h-96 opacity-[.14] dark:opacity-25" style={{ background: "radial-gradient(60% 100% at 70% 0%, var(--tone), transparent)" }} />
          <Section className="relative pb-6 pt-8 sm:pt-12">
            <Crumb />
            <Title d={d} className="mt-4" />
            <PlatformSwitch d={d} className="mt-6" />
            {o.notice && <LiveNotice n={o.notice} />}
          </Section>
        </header>

        <Section>
          <fieldset className="min-w-0">
            <legend className="font-display text-xl font-bold text-slate-900 dark:text-white">{tx("Pick a service")}</legend>
            <div className="-mx-4 mt-4 flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 pb-3 pt-1 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-4">
              {d.services.map((s) => <ServiceCard key={s.id} o={o} s={s} className="w-[74%] shrink-0 snap-start sm:w-auto" />)}
            </div>
          </fieldset>
          <form noValidate onSubmit={(e) => { e.preventDefault(); o.proceed(); }} className="mt-8 grid grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
            <OrderCard o={o} />
            <aside aria-label={tx("Your order")} className="min-w-0">
              <div ref={sumRef} className="space-y-3 lg:sticky lg:top-24">
                <LiveSummary o={o} />
                <Trust items={trustItems(tx)} />
              </div>
            </aside>
          </form>
        </Section>
        <PlatformBelow d={d} />
        {o.service && <><PayBar o={o} hide={sumOn} /><LiveCheckout o={o} /></>}
      </div>
    </PageShell>
  );
}
export const SocialPlatformF = () => <PlatformRoot><BodyF /></PlatformRoot>;

// =====================================================================================================
// G — Compare: the platform's services side by side, one column each, the facts as rows (price from, delivery,
// feature, amounts). The column you pick is outlined in the platform colour; the order follows. Phones scroll the
// columns sideways with the row labels pinned.
// =====================================================================================================

function Compare({ o }: { o: LiveOrder }) {
  const tx = useT();
  const money = useMoney();
  const range = useRange();
  const services = o.d.services;
  // Rows: the price, then each note label the services share (in the admin's order), then the amounts.
  const labels = [...new Set(services.flatMap((s) => notesOf(s).map((n) => n.label)))];
  const cols = `minmax(7.5rem,.8fr) repeat(${services.length}, minmax(10.5rem,1fr))`;
  const cell = "px-4 py-3 text-sm";
  const onCol = (s: LiveService) => o.service?.id === s.id;
  const colBg = (s: LiveService) => onCol(s) ? "bg-[color-mix(in_oklab,var(--tone)_9%,white)] dark:bg-[color-mix(in_oklab,var(--tone)_14%,#0E1424)]" : "";
  return (
    <fieldset className="min-w-0">
      <legend className="font-display text-xl font-bold text-slate-900 dark:text-white">{tx("Compare and pick")}</legend>
      <div className={`${card} relative -mx-4 mt-4 overflow-x-auto !rounded-none border-x-0 [scrollbar-width:thin] sm:mx-0 sm:!rounded-3xl sm:border-x`}>
        <div role="table" aria-label={tx("Compare {0} services", { 0: o.d.platform.name })} className="grid" style={{ gridTemplateColumns: cols }}>
          <div role="row" className="contents">
            <span role="columnheader" className={`${cell} sticky start-0 z-10 bg-white dark:bg-[#0E1424]`}><span className="sr-only">{tx("Service")}</span></span>
            {services.map((s) => {
              const Icon = serviceIcon(s);
              return (
                <label key={s.id} role="columnheader" className={`${cell} flex cursor-pointer flex-col gap-3 border-t-4 pt-4 transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:-outline-offset-2 has-[:focus-visible]:outline-emerald-600 ${onCol(s) ? "border-[var(--tone)]" : "border-transparent"} ${colBg(s)}`}>
                  <input type="radio" name="pf-compare" checked={onCol(s)} onChange={() => o.setService(s.id)} className="sr-only" />
                  <span aria-hidden className={`grid h-10 w-10 place-items-center rounded-xl ${onCol(s) ? "bg-[var(--tone)] text-white" : "bg-[color-mix(in_oklab,var(--tone)_14%,transparent)] text-[color-mix(in_oklab,var(--tone)_75%,black)] dark:text-[color-mix(in_oklab,var(--tone)_60%,white)]"}`}><Icon className="h-5 w-5" /></span>
                  <span className="font-semibold leading-snug text-slate-900 dark:text-white">{s.name}</span>
                </label>
              );
            })}
          </div>
          <Row label={tx("From, per {0}", { 0: o.num(1000) })} cell={cell}>
            {services.map((s) => <span key={s.id} role="cell" className={`${cell} font-display text-lg font-bold tabular-nums text-slate-900 dark:text-white ${colBg(s)}`}>{money.format(s.per1000)}</span>)}
          </Row>
          {labels.map((l) => (
            <Row key={l} label={l} cell={cell}>
              {services.map((s) => <span key={s.id} role="cell" className={`${cell} text-slate-800 dark:text-slate-200 ${colBg(s)}`}>{notesOf(s).find((n) => n.label === l)?.value ?? "—"}</span>)}
            </Row>
          ))}
          <Row label={tx("Amounts")} cell={cell}>
            {services.map((s) => <span key={s.id} role="cell" className={`${cell} tabular-nums text-slate-800 dark:text-slate-200 ${colBg(s)}`}>{range(o, s)}</span>)}
          </Row>
          <div role="row" className="contents">
            <span role="cell" className={`${cell} sticky start-0 z-10 bg-white dark:bg-[#0E1424]`} />
            {services.map((s) => (
              <span key={s.id} role="cell" className={`${cell} pb-4 ${colBg(s)}`}>
                <button type="button" onClick={() => { o.setService(s.id); document.getElementById("pf-order")?.scrollIntoView({ behavior: "smooth", block: "start" }); }}
                  className={`w-full rounded-xl border-2 px-3 py-2 text-sm font-semibold transition-colors ${ring} ${onCol(s) ? "border-[var(--tone)] bg-[var(--tone)] text-white" : "border-slate-300 text-slate-800 hover:border-slate-400 dark:border-white/20 dark:text-white"}`}>
                  {onCol(s) ? tx("Chosen · order below") : tx("Choose")}
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>
    </fieldset>
  );
}

function Row({ label, cell, children }: { label: string; cell: string; children: ReactNode }) {
  return (
    <div role="row" className="contents">
      <span role="rowheader" className={`${cell} sticky start-0 z-10 border-t border-slate-200 bg-white font-medium text-slate-600 dark:border-white/10 dark:bg-[#0E1424] dark:text-slate-400`}>{label}</span>
      <span className="contents [&>*]:border-t [&>*]:border-slate-200 dark:[&>*]:border-white/10">{children}</span>
    </div>
  );
}

function BodyG() {
  const tx = useT();
  const { d, o } = usePlatform();
  const [sumRef, sumOn] = useOnScreen<HTMLDivElement>();
  if (o.order) return <Done o={o} />;
  return (
    <PageShell>
      <div style={{ ...o.tone.vars, ...toneVars(d) }}>
        <Section className="pb-8 pt-8 sm:pt-12">
          <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-5">
            <div className="min-w-0"><Crumb /><Title d={d} className="mt-4" /></div>
            <PlatformSwitch d={d} />
          </div>
          <Trust items={trustItems(tx)} />
          {o.notice && <LiveNotice n={o.notice} />}
        </Section>
        <Section>
          {d.services.length > 1 ? <Compare o={o} /> : null}
          <form id="pf-order" noValidate onSubmit={(e) => { e.preventDefault(); o.proceed(); }} className="mt-10 grid scroll-mt-24 grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div className="min-w-0">
              {o.service && <p className="mb-3 flex items-center gap-2 font-display text-xl font-bold text-slate-900 dark:text-white"><LiveMark c={d.platform} size="sm" />{o.service.name}</p>}
              <OrderCard o={o} />
            </div>
            <aside aria-label={tx("Your order")} className="min-w-0">
              <div ref={sumRef} className="lg:sticky lg:top-24"><LiveSummary o={o} /></div>
            </aside>
          </form>
        </Section>
        <PlatformBelow d={d} />
        {o.service && <><PayBar o={o} hide={sumOn} /><LiveCheckout o={o} /></>}
      </div>
    </PageShell>
  );
}
export const SocialPlatformG = () => <PlatformRoot><BodyG /></PlatformRoot>;

// =====================================================================================================
// H — Catalog + Panel: like /accounts, /virtual-numbers and /google-voice. A band in the platform's colours with
// the title and the platform switch; every service as a colour-washed card in a grid, and the chosen one's amount,
// link, total and Pay in a panel beside it (under it on phones, where picking a card brings the panel into view).
// =====================================================================================================

function BodyH() {
  const tx = useT();
  const money = useMoney();
  const { d, o } = usePlatform();
  const t = useTotal(o);
  const panel = useRef<HTMLDivElement>(null);
  const [payRef, payOn] = useOnScreen<HTMLDivElement>();
  if (o.order) return <Done o={o} />;
  const pick = (id: number) => {
    o.setService(id);
    if (window.matchMedia("(max-width: 1023px)").matches) setTimeout(() => panel.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  };
  const oo = { ...o, setService: pick };
  return (
    <PageShell heroDark>
      <div style={{ ...o.tone.vars, ...toneVars(d) }}>
        <section aria-labelledby="pf-h" className="relative -mt-16 overflow-hidden pb-24 pt-28 text-white">
          <div aria-hidden className="absolute inset-0" style={{ backgroundImage: toneOf(d.platform).band }} />
          <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/15 to-black/40" />
          <div aria-hidden className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,.1)_1px,transparent_1px)] bg-[size:20px_20px] [mask-image:linear-gradient(to_bottom,black,transparent)]" />
          <Section className="relative">
            <Crumb light />
            <div id="pf-h"><Title d={d} light className="mt-4" /></div>
            <PlatformSwitch d={d} look="glass" className="mt-6" />
            {o.notice && <LiveNotice n={o.notice} />}
          </Section>
        </section>
        <Section className="relative -mt-14">
          <form noValidate onSubmit={(e) => { e.preventDefault(); o.proceed(); }} className="grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[minmax(0,1fr)_400px] lg:items-start">
            <fieldset className="min-w-0">
              <legend className="sr-only">{tx("Pick a service")}</legend>
              {d.error || !o.service ? <div className={`${card} p-6`}><Empty o={o} /></div> : (
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  {d.services.map((s) => <ServiceCard key={s.id} o={oo} s={s} wash className="shadow-xl shadow-slate-950/5" />)}
                </div>
              )}
            </fieldset>
            {o.service && !d.error && (
              <div ref={panel} className="min-w-0 scroll-mt-20 lg:sticky lg:top-24">
                <section aria-label={tx("Your order")} className={`${card} overflow-hidden shadow-2xl shadow-slate-950/15`}>
                  <div className="flex items-center gap-3 border-b border-slate-200 bg-[color-mix(in_oklab,var(--tone)_8%,white)] px-5 py-4 dark:border-white/10 dark:bg-[color-mix(in_oklab,var(--tone)_12%,#0E1424)]">
                    <LiveMark c={d.platform} size="sm" />
                    <span key={o.service.id} className="min-w-0 animate-step-in"><span className="block truncate font-semibold text-slate-900 dark:text-white">{o.service.name}</span><span className="block text-xs text-slate-600 dark:text-slate-400">{[deliveryOf(o.service), featureOf(o.service)].filter(Boolean).join(" · ")}</span></span>
                  </div>
                  <div key={o.service.id} className="animate-step-in space-y-7 p-5 sm:p-6"><LiveAmount o={o} /><LiveFields o={o} /></div>
                  <div ref={payRef} className="border-t border-slate-200 p-5 sm:p-6 dark:border-white/10">
                    <div className="flex items-baseline justify-between"><span className="font-semibold text-slate-900 dark:text-white">{tx("Total")}</span><span className="font-display text-2xl font-bold tabular-nums text-slate-900 dark:text-white">{t.total}</span></div>
                    <button type="submit" className={`${primary} mt-4 w-full`}>{o.total && !o.qtyError ? `${tx(o.inCart ? "Add to cart" : "Continue")} · ${money.format(o.total)}` : tx(o.inCart ? "Add to cart" : "Continue")}</button>
                    {o.blocker && <p role="alert" className="mt-3 text-center text-sm font-semibold text-red-700 dark:text-red-400">{o.blocker}</p>}
                    <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-slate-600 dark:text-slate-400"><ShieldCheck aria-hidden className="h-4 w-4 text-emerald-700 dark:text-emerald-400" />{tx("Refund if it can't start")}</p>
                  </div>
                </section>
              </div>
            )}
          </form>
        </Section>
        <PlatformBelow d={d} />
        {o.service && <><PayBar o={o} hide={payOn} /><LiveCheckout o={o} /></>}
      </div>
    </PageShell>
  );
}
export const SocialPlatformH = () => <PlatformRoot><BodyH /></PlatformRoot>;

// =====================================================================================================
// I — Spec Tabs: the single service page you picked (Spec Sheet), with the platform's services as tabs under the
// title. The tabs stick under the site header while you scroll the form; the fact tiles, form and summary follow
// the tab. Phones swipe the tabs.
// =====================================================================================================

function BodyI() {
  const tx = useT();
  const { d, o } = usePlatform();
  const t = useTotal(o);
  const [sumRef, sumOn] = useOnScreen<HTMLDivElement>();
  if (o.order) return <Done o={o} />;
  return (
    <PageShell>
      <div style={{ ...o.tone.vars, ...toneVars(d) }}>
        <header className="relative overflow-hidden">
          <div aria-hidden className="absolute inset-x-0 top-0 h-80 opacity-[.13] dark:opacity-25" style={{ background: "radial-gradient(60% 100% at 70% 0%, var(--tone), transparent)" }} />
          <Section className="relative pb-4 pt-8 sm:pt-12">
            <div className="flex flex-wrap items-center justify-between gap-3"><Crumb /><PlatformSwitch d={d} /></div>
            <Title d={d} className="mt-5" />
            {o.notice && <LiveNotice n={o.notice} />}
          </Section>
        </header>

        {d.services.length > 0 && !d.error && (
          <div className="sticky top-16 z-30 border-b border-slate-200 bg-[#F5F6FB]/90 backdrop-blur dark:border-white/10 dark:bg-[#070B14]/90">
            <Section>
              <div role="radiogroup" aria-label={tx("Service")} className="-mx-4 flex snap-x gap-1 overflow-x-auto px-4 [scrollbar-width:none] sm:mx-0 sm:px-0">
                {d.services.map((s) => {
                  const on = o.service?.id === s.id;
                  const Icon = serviceIcon(s);
                  return (
                    <label key={s.id} className={`relative flex shrink-0 cursor-pointer snap-start items-center gap-2 px-3 py-3.5 text-sm font-semibold transition-colors has-[:focus-visible]:rounded-lg has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-emerald-600 ${on ? "text-slate-900 dark:text-white" : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"}`}>
                      <input type="radio" name="pf-tab" checked={on} onChange={() => o.setService(s.id)} className="sr-only" />
                      <Icon aria-hidden className="h-4 w-4" style={on ? { color: "var(--tone)" } : undefined} />
                      <span className="max-w-[16rem] truncate">{s.name}</span>
                      <span aria-hidden className={`absolute inset-x-2 bottom-0 h-0.5 rounded-full transition-opacity ${on ? "bg-[var(--tone)] opacity-100" : "opacity-0"}`} />
                    </label>
                  );
                })}
              </div>
            </Section>
          </div>
        )}

        <Section className="pt-6">
          {o.service && (
            <div key={o.service.id} className="animate-step-in">
              <p className="text-sm font-semibold tabular-nums text-slate-700 dark:text-slate-300">{tx("from {0} / 1,000", { 0: t.from })}</p>
              <FactTiles o={o} className="mt-3 max-w-4xl" cols="sm:grid-cols-3" />
            </div>
          )}
          <form noValidate onSubmit={(e) => { e.preventDefault(); o.proceed(); }} className="mt-8 grid grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
            <OrderCard o={o} />
            <aside aria-label={tx("Your order")} className="min-w-0">
              <div ref={sumRef} className="space-y-3 lg:sticky lg:top-36">
                <LiveSummary o={o} />
                <Trust items={[tx("No password needed"), tx("Refund if it can't start")]} />
              </div>
            </aside>
          </form>
        </Section>
        <PlatformBelow d={d} />
        {o.service && <><PayBar o={o} hide={sumOn} /><LiveCheckout o={o} /></>}
      </div>
    </PageShell>
  );
}
export const SocialPlatformI = () => <PlatformRoot><BodyI /></PlatformRoot>;

// =====================================================================================================
// J — Order Console: the whole order in one compact card inside the hero — service, amount, link, total and Pay —
// so a returning buyer is done without scrolling. Below it, each service once more with its facts, for anyone who
// wants to compare first.
// =====================================================================================================

const consoleSelect = `${field} appearance-none pe-10 font-semibold`;

function ConsoleAmount({ o }: { o: LiveOrder }) {
  const tx = useT();
  const money = useMoney();
  const s = o.service!;
  if (!s.count) {
    return (
      <div>
        <label htmlFor="pf-plan" className="text-sm font-semibold text-slate-900 dark:text-white">{tx("How many?")}</label>
        <div className="relative mt-2">
          <select id="pf-plan" value={o.plan?.id ?? ""} onChange={(e) => o.setPlan(+e.target.value)} className={`${consoleSelect} tabular-nums`}>
            {s.plans.map((p) => <option key={p.id} value={p.id}>{`${o.num(p.count)} — ${money.format(p.price)}`}</option>)}
          </select>
          <ChevronDown aria-hidden className="pointer-events-none absolute end-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
        </div>
      </div>
    );
  }
  const c = s.count;
  const step = (n: number) => { o.setQty(Math.min(c.max, Math.max(c.min, o.qty + n))); o.touch("qty"); };
  return (
    <div>
      <label htmlFor="social-qty" className="text-sm font-semibold text-slate-900 dark:text-white">{tx("How many?")} <span className="font-normal text-slate-600 dark:text-slate-400">{tx("{0} to {1}", { 0: o.num(c.min), 1: o.num(c.max) })}</span></label>
      <div className="mt-2 flex items-stretch gap-2">
        <button type="button" onClick={() => step(-c.step)} aria-label={tx("Less")} className={`grid w-12 shrink-0 place-items-center rounded-xl border border-slate-300 text-slate-800 hover:bg-slate-50 dark:border-white/20 dark:text-white dark:hover:bg-white/5 ${ring}`}><Minus className="h-4 w-4" /></button>
        <input id="social-qty" type="number" inputMode="numeric" min={c.min} max={c.max} step={c.step} value={o.qty || ""} onChange={(e) => o.setQty(+e.target.value)} onBlur={() => o.touch("qty")}
          aria-invalid={!!o.qtyError} aria-describedby={o.qtyError ? "pf-qty-error" : undefined} className={`${field} text-center font-display text-lg font-bold tabular-nums`} />
        <button type="button" onClick={() => step(c.step)} aria-label={tx("More")} className={`grid w-12 shrink-0 place-items-center rounded-xl border border-slate-300 text-slate-800 hover:bg-slate-50 dark:border-white/20 dark:text-white dark:hover:bg-white/5 ${ring}`}><Plus className="h-4 w-4" /></button>
      </div>
      {o.qtyError && <p id="pf-qty-error" className="mt-1.5 text-sm font-semibold text-red-700 dark:text-red-400">{o.qtyError}</p>}
    </div>
  );
}

function BodyJ() {
  const tx = useT();
  const money = useMoney();
  const { d, o } = usePlatform();
  const t = useTotal(o);
  const [payRef, payOn] = useOnScreen<HTMLDivElement>();
  if (o.order) return <Done o={o} />;
  return (
    <PageShell>
      <div style={{ ...o.tone.vars, ...toneVars(d) }}>
        <section className="relative overflow-hidden">
          <div aria-hidden className="absolute -top-40 start-1/2 h-[34rem] w-[54rem] -translate-x-1/2 rounded-full opacity-25 blur-3xl rtl:translate-x-1/2 dark:opacity-30" style={{ background: "radial-gradient(closest-side, var(--tone), transparent)" }} />
          <Section className="relative grid grid-cols-[minmax(0,1fr)] gap-8 pb-14 pt-8 sm:pt-12 lg:grid-cols-[minmax(0,1fr)_440px] lg:items-center lg:gap-12">
            <div className="min-w-0">
              <Crumb />
              <Title d={d} className="mt-4" />
              <PlatformSwitch d={d} className="mt-6" />
              <div className="mt-6"><Trust items={trustItems(tx)} /></div>
              {o.notice && <LiveNotice n={o.notice} />}
            </div>
            <form noValidate onSubmit={(e) => { e.preventDefault(); o.proceed(); }} className={`${card} min-w-0 p-5 shadow-2xl shadow-slate-950/10 sm:p-6`}>
              <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">{tx("Order in one go")}</h2>
              {d.error || !o.service ? <div className="mt-4"><Empty o={o} /></div> : (
                <div className="mt-5 space-y-5">
                  <div>
                    <label htmlFor="pf-service" className="text-sm font-semibold text-slate-900 dark:text-white">{tx("Service")}</label>
                    <div className="relative mt-2">
                      <select id="pf-service" value={o.service.id} onChange={(e) => o.setService(+e.target.value)} className={consoleSelect}>
                        {d.services.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                      </select>
                      <ChevronDown aria-hidden className="pointer-events-none absolute end-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
                    </div>
                  </div>
                  <ConsoleAmount o={o} />
                  <LiveFields o={o} />
                  <div ref={payRef} className="border-t border-slate-200 pt-5 dark:border-white/10">
                    <div className="flex items-baseline justify-between"><span className="text-sm text-slate-600 dark:text-slate-400">{t.amount} · {tx("Total")}</span><span className="font-display text-2xl font-bold tabular-nums text-slate-900 dark:text-white">{t.total}</span></div>
                    <button type="submit" className={`${primary} mt-4 w-full`}>{tx(o.inCart ? "Add to cart" : "Continue")}</button>
                    {o.blocker && <p role="alert" className="mt-3 text-center text-sm font-semibold text-red-700 dark:text-red-400">{o.blocker}</p>}
                  </div>
                </div>
              )}
            </form>
          </Section>
        </section>

        {d.services.length > 1 && (
          <Section>
            <h2 className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-white">{tx("Every {0} service", { 0: d.platform.name })}</h2>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {d.services.map((s) => {
                const Icon = serviceIcon(s);
                const on = o.service?.id === s.id;
                return (
                  <li key={s.id} className={`${card} flex gap-4 p-5 transition-colors ${on ? "!border-[var(--tone)]" : ""}`}>
                    <span aria-hidden className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[color-mix(in_oklab,var(--tone)_14%,transparent)] text-[color-mix(in_oklab,var(--tone)_75%,black)] dark:text-[color-mix(in_oklab,var(--tone)_60%,white)]"><Icon className="h-5 w-5" /></span>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-slate-900 dark:text-white">{s.name}</h3>
                      <dl className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm">
                        {notesOf(s).slice(0, 3).map((n) => <div key={n.label} className="flex gap-1"><dt className="text-slate-600 dark:text-slate-400">{n.label}:</dt><dd className="font-medium text-slate-800 dark:text-slate-200">{n.value}</dd></div>)}
                      </dl>
                      <div className="mt-3 flex items-center justify-between gap-3">
                        <span className="text-sm tabular-nums text-slate-700 dark:text-slate-300">{tx("from {0} / 1,000", { 0: money.format(s.per1000) })}</span>
                        <button type="button" onClick={() => { o.setService(s.id); window.scrollTo({ top: 0, behavior: "smooth" }); }} disabled={on}
                          className={`rounded-full px-3.5 py-1.5 text-sm font-semibold ${ring} ${on ? "bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-300" : "border border-slate-300 text-slate-900 hover:border-slate-400 dark:border-white/20 dark:text-white"}`}>
                          {on ? tx("In the order") : tx("Order this")}
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </Section>
        )}
        <PlatformBelow d={d} />
        {o.service && <><PayBar o={o} hide={payOn} /><LiveCheckout o={o} /></>}
      </div>
    </PageShell>
  );
}
export const SocialPlatformJ = () => <PlatformRoot><BodyJ /></PlatformRoot>;
