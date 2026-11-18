"use client";

import { useEffect, useState, type ReactNode } from "react";
import { ArrowLeft, ArrowRight, BadgeCheck, ChevronUp, KeyRound, ReceiptText, Undo2 } from "lucide-react";
import { useT } from "@/i18n/client";
import { PageShell } from "../otp/parts";
import { SumRows, Trust } from "../telegram/parts";
import { LiveAmount, LiveCheckout, LiveFields, LiveMark, LiveNotice, LiveOrderView, LiveSummary, toneOf, useLiveOrder, type LiveOrder } from "../social/liveOrder";
import {
  AfterPay, Article, Breadcrumb, card, Comments, facts, FactTiles, noteIcon, OtherServices, PayBar, primary, PromiseGrid,
  Questions, ring, Section, ServiceRoot, toneVars, useOnScreen, usePageData, usePromises, useTotal, type PageData,
} from "./parts";

// Single social service page (/virtual-service/{platform}/{service}) — five offers, all mobile first and all on
// the live order logic. Shared pieces in ./parts.tsx.

function useOffer() {
  const p = usePageData();
  const o = useLiveOrder(p.d);
  return { p, o };
}

function Done({ o }: { o: LiveOrder }) {
  return <PageShell><div className="px-4 py-14 sm:px-6"><LiveOrderView o={o} /></div></PageShell>;
}

function Problem({ o }: { o: LiveOrder }) {
  const tx = useT();
  if (o.d.error) return <p role="alert" className="font-semibold text-red-700 dark:text-red-400">{o.d.error}</p>;
  if (!o.service) return <p className="text-slate-700 dark:text-slate-300">{tx("This service isn't on sale right now. Have a look at the other {0} services.", { 0: o.d.platform.name })}</p>;
  return null;
}

// The rest of the page, in the order every offer shares (each may leave parts out).
function Below({ p, o, skip = [] }: { p: PageData; o: LiveOrder; skip?: ("promises" | "after" | "comments")[] }) {
  const tx = useT();
  return (
    <Section className="space-y-14 pb-32 pt-14 sm:space-y-16">
      {!skip.includes("promises") && <section aria-labelledby="svc-promise"><h2 id="svc-promise" className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-white">{tx("Why it's safe to order")}</h2><PromiseGrid className="mt-5" /></section>}
      {!skip.includes("after") && <section aria-labelledby="svc-after"><h2 id="svc-after" className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-white">{tx("What happens after you pay")}</h2><AfterPay className="mt-6" /></section>}
      {!skip.includes("comments") && <Comments p={p} />}
      <div className="grid gap-14 lg:grid-cols-2 lg:gap-10">
        <Questions d={p.d} />
        <Article d={p.d} />
      </div>
      <OtherServices o={o} />
    </Section>
  );
}

// =====================================================================================================
// A — Spec Sheet: a light header with the service's facts as four tiles right under the title (two by two on
// phones, so start time, speed and refill are seen before anything else). Form, sticky summary, then the proof.
// =====================================================================================================

function BodyA() {
  const tx = useT();
  const { p, o } = useOffer();
  const t = useTotal(o);
  const [sumRef, sumOn] = useOnScreen<HTMLDivElement>();
  if (o.order) return <Done o={o} />;
  return (
    <PageShell>
      <div style={{ ...o.tone.vars, ...toneVars(p.d) }}>
        <header className="relative overflow-hidden">
          <div aria-hidden className="absolute inset-x-0 top-0 h-80 opacity-[.13] dark:opacity-25" style={{ background: "radial-gradient(60% 100% at 70% 0%, var(--tone), transparent)" }} />
          <Section className="relative pb-8 pt-8 sm:pt-12">
            <Breadcrumb d={p.d} />
            <div className="mt-5 flex items-start gap-4">
              <LiveMark c={p.d.platform} size="lg" className="shadow-lg shadow-slate-900/10" />
              <div className="min-w-0">
                <h1 className="text-balance font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">{p.d.title}</h1>
                <p className="mt-1 text-sm font-semibold tabular-nums text-slate-700 dark:text-slate-300">{tx("from {0} / 1,000", { 0: t.from })}</p>
              </div>
            </div>
            {p.d.sub && <p className="mt-4 max-w-2xl text-[15px] leading-7 text-slate-700 sm:text-base dark:text-slate-300">{p.d.sub}</p>}
            <FactTiles o={o} className="mt-6 max-w-4xl" />
            {o.notice && <LiveNotice n={o.notice} />}
          </Section>
        </header>

        <Section>
          <form noValidate onSubmit={(e) => { e.preventDefault(); o.proceed(); }} className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
            <section aria-label={tx("Choose")} className={`${card} min-w-0 space-y-8 p-5 sm:p-8`}>
              <Problem o={o} />
              {o.service && !o.d.error && <><LiveAmount o={o} /><LiveFields o={o} /></>}
            </section>
            <aside aria-label={tx("Your order")} className="min-w-0">
              <div ref={sumRef} className="space-y-3 lg:sticky lg:top-24">
                <LiveSummary o={o} />
                <Trust items={[tx("No password needed"), tx("Refund if it can't start")]} />
              </div>
            </aside>
          </form>
        </Section>
        <Below p={p} o={o} />
        {o.service && <><PayBar o={o} hide={sumOn} /><LiveCheckout o={o} /></>}
      </div>
    </PageShell>
  );
}
export const SocialServiceA = () => <ServiceRoot><BodyA /></ServiceRoot>;

// =====================================================================================================
// B — Step by Step: the order as three short steps (amount → link → check and pay) in one card, with a fixed
// Back / Next bar on phones so the thumb never hunts for the button. Each step carries the promise that fits it.
// =====================================================================================================

function BodyB() {
  const tx = useT();
  const { p, o } = useOffer();
  const t = useTotal(o);
  const promises = usePromises();
  const [step, setStep] = useState(0);
  if (o.order) return <Done o={o} />;
  const names = [tx("Amount"), tx("Link"), tx("Check and pay")];
  const focusTop = () => document.getElementById("svc-step")?.scrollIntoView({ behavior: "smooth", block: "start" });
  const next = () => {
    if (step === 0) {
      if (o.problem === "qty") { o.touch("qty"); document.getElementById("social-qty")?.focus(); return; }
    } else if (step === 1) {
      if (o.problem && o.problem !== "qty") { o.proceed(); return; }
    } else { o.proceed(); return; }
    setStep(step + 1);
    focusTop();
  };
  const back = () => { setStep(Math.max(0, step - 1)); focusTop(); };
  const tip = [promises[2], promises[0], promises[1]][step];
  const Next = step === 2 ? null : ArrowLeft;
  const nextLabel = step === 2 ? `${tx("Pay")} · ${t.total}` : tx("Next");
  return (
    <PageShell>
      <div style={{ ...o.tone.vars, ...toneVars(p.d) }}>
        <Section className="pb-6 pt-8 sm:pt-12">
          <Breadcrumb d={p.d} />
          <div className="mt-4 flex items-center gap-3">
            <LiveMark c={p.d.platform} size="md" />
            <h1 className="min-w-0 text-balance font-display text-2xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">{p.d.title}</h1>
          </div>
          <p className="mt-2 text-sm font-semibold tabular-nums text-slate-700 dark:text-slate-300">{tx("from {0} / 1,000", { 0: t.from })}</p>
          {o.notice && <LiveNotice n={o.notice} />}
        </Section>

        <Section>
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
            <form noValidate onSubmit={(e) => { e.preventDefault(); next(); }} id="svc-step" className={`${card} min-w-0 scroll-mt-24 overflow-hidden`}>
              <ol className="grid grid-cols-3 border-b border-slate-200 dark:border-white/10" aria-label={tx("Steps")}>
                {names.map((n, i) => (
                  <li key={n} aria-current={i === step ? "step" : undefined} className="relative px-3 py-3 text-center text-xs font-semibold sm:text-sm">
                    <span className={i <= step ? "text-slate-900 dark:text-white" : "text-slate-500 dark:text-slate-500"}>{i + 1}. {n}</span>
                    <span aria-hidden className="absolute inset-x-0 bottom-0 h-1 transition-colors" style={{ background: i <= step ? "var(--tone)" : "transparent" }} />
                  </li>
                ))}
              </ol>
              <div key={step} className="animate-fade-up space-y-6 p-5 sm:p-8">
                <Problem o={o} />
                {o.service && !o.d.error && (
                  step === 0 ? <><LiveAmount o={o} /><FactTiles o={o} cols="sm:grid-cols-2" /></>
                  : step === 1 ? <LiveFields o={o} />
                  : (
                    <div>
                      <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-white">{tx("Check your order")}</h2>
                      <div className="mt-3"><SumRows rows={[
                        [tx("Service"), o.service.name],
                        [tx("To"), o.target ? <span dir="ltr">{(o.values[o.target.name] ?? "").trim()}</span> : "—"],
                        [tx("Amount"), <span className="tabular-nums">{t.amount}</span>],
                        ...facts(o).slice(0, 2).map((n): [string, ReactNode] => [n.label, n.value]),
                      ]} /></div>
                      <div className="mt-3 flex items-baseline justify-between border-t border-slate-200 pt-4 dark:border-white/10">
                        <span className="font-semibold text-slate-900 dark:text-white">{tx("Total")}</span>
                        <span className="font-display text-2xl font-bold tabular-nums text-slate-900 dark:text-white">{t.total}</span>
                      </div>
                    </div>
                  )
                )}
                {tip && (
                  <p className="flex items-start gap-3 rounded-2xl bg-emerald-50 p-4 text-sm leading-6 text-emerald-950 dark:bg-emerald-400/10 dark:text-emerald-100">
                    <tip.Icon aria-hidden className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700 dark:text-emerald-300" />
                    <span><span className="font-semibold">{tip.title}.</span> {tip.text}</span>
                  </p>
                )}
                {o.blocker && <p role="alert" className="text-sm font-semibold text-red-700 dark:text-red-400">{o.blocker}</p>}
              </div>
              {/* Buttons: inline from sm up, fixed to the bottom on phones. */}
              <div className="fixed inset-x-0 bottom-0 z-40 flex gap-3 border-t border-slate-200 bg-white/95 px-4 pb-[max(.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur sm:static sm:border-0 sm:bg-transparent sm:px-8 sm:pb-8 sm:pt-0 dark:border-white/10 dark:bg-[#0E1424]/95 sm:dark:bg-transparent">
                {step > 0 && <button type="button" onClick={back} className={`inline-flex items-center gap-1.5 rounded-xl border border-slate-300 px-4 py-3 font-semibold text-slate-800 dark:border-white/20 dark:text-slate-100 ${ring}`}><ArrowRight aria-hidden className="h-4 w-4 ltr:rotate-180" />{tx("Back")}</button>}
                <button type="submit" disabled={!o.service || !!o.d.error} className={`${primary} flex-1 tabular-nums disabled:opacity-50`}>{nextLabel}{Next && <Next aria-hidden className="h-4 w-4 ltr:rotate-180" />}</button>
              </div>
            </form>
            <aside aria-label={tx("Why it's safe to order")} className="hidden lg:block">
              <div className="sticky top-24 space-y-3"><PromiseGrid compact className="!grid-cols-1" /></div>
            </aside>
          </div>
        </Section>
        <Below p={p} o={o} skip={["promises"]} />
        {o.service && <LiveCheckout o={o} />}
      </div>
    </PageShell>
  );
}
export const SocialServiceB = () => <ServiceRoot><BodyB /></ServiceRoot>;

// =====================================================================================================
// C — Trust First: the platform's colour band holds the title, the four promises and the newest real comment,
// so proof comes before price. One single-column order card overlaps the band; total and Pay sit at its foot.
// =====================================================================================================

function BodyC() {
  const tx = useT();
  const { p, o } = useOffer();
  const t = useTotal(o);
  const promises = usePromises();
  const [payRef, payOn] = useOnScreen<HTMLDivElement>();
  if (o.order) return <Done o={o} />;
  const newest = p.comments[0];
  return (
    <PageShell heroDark>
      <div style={{ ...o.tone.vars, ...toneVars(p.d) }}>
        <section className="relative -mt-16 overflow-hidden pb-28 pt-24 text-white sm:pt-28">
          <div aria-hidden className="absolute inset-0" style={{ backgroundImage: toneOf(p.d.platform).band }} />
          <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/50" />
          <Section className="relative">
            <Breadcrumb d={p.d} light />
            <div className="mt-5 grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-end">
              <div className="min-w-0">
                <div className="flex items-center gap-3"><LiveMark c={p.d.platform} size="lg" className="shadow-xl shadow-black/30" /><span className="text-sm font-semibold tabular-nums text-white/90">{tx("from {0} / 1,000", { 0: t.from })}</span></div>
                <h1 className="mt-4 text-balance font-display text-3xl font-bold tracking-tight sm:text-5xl">{p.d.title}</h1>
                {p.d.sub && <p className="mt-3 max-w-2xl text-[15px] leading-7 text-white/90 sm:text-lg">{p.d.sub}</p>}
                <ul className="-mx-4 mt-6 flex snap-x scroll-px-4 gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0">
                  {promises.map(({ Icon, title }) => <li key={title} className="flex shrink-0 snap-start items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3.5 py-2 text-sm font-semibold backdrop-blur"><Icon aria-hidden className="h-4 w-4" />{title}</li>)}
                </ul>
              </div>
              {newest && (
                <figure className="rounded-3xl border border-white/20 bg-white/10 p-5 backdrop-blur-md">
                  <figcaption className="text-xs font-semibold uppercase tracking-wide text-white/75">{tx("Latest comment")}{p.preview ? ` · ${tx("sample")}` : ""}</figcaption>
                  <blockquote className="mt-2 text-[15px] leading-7">“{newest.text}”</blockquote>
                  <p className="mt-3 text-sm text-white/80">{newest.name} · {newest.date}</p>
                </figure>
              )}
            </div>
            {o.notice && <LiveNotice n={o.notice} />}
          </Section>
        </section>

        <Section>
          <form noValidate onSubmit={(e) => { e.preventDefault(); o.proceed(); }} className={`${card} relative z-10 mx-auto -mt-16 max-w-3xl overflow-hidden shadow-2xl shadow-slate-950/15`}>
            <div className="space-y-8 p-5 sm:p-8">
              <Problem o={o} />
              {o.service && !o.d.error && <><FactTiles o={o} /><LiveAmount o={o} /><LiveFields o={o} /></>}
            </div>
            <div ref={payRef} className="border-t border-slate-200 bg-slate-50 p-5 sm:p-8 dark:border-white/10 dark:bg-white/[.03]">
              <div className="flex items-baseline justify-between gap-4">
                <span className="min-w-0 truncate text-sm text-slate-600 dark:text-slate-400">{t.amount} · {o.service?.name}</span>
                <span className="font-display text-2xl font-bold tabular-nums text-slate-900 dark:text-white">{t.total}</span>
              </div>
              <button type="submit" disabled={!o.service || !!o.d.error} className={`${primary} mt-4 w-full disabled:opacity-50`}>{tx(o.inCart ? "Add to cart" : "Continue to payment")}</button>
              {o.blocker && <p role="alert" className="mt-3 text-center text-sm font-semibold text-red-700 dark:text-red-400">{o.blocker}</p>}
            </div>
          </form>
        </Section>
        <Below p={p} o={o} skip={["promises"]} />
        {o.service && <><PayBar o={o} hide={payOn} /><LiveCheckout o={o} /></>}
      </div>
    </PageShell>
  );
}
export const SocialServiceC = () => <ServiceRoot><BodyC /></ServiceRoot>;

// =====================================================================================================
// D — Receipt: the summary is a printed receipt that fills in as you choose, the facts as its lines and the
// promises stamped at its foot. On phones it's a sheet at the bottom: the total shows, tap to unfold and pay.
// =====================================================================================================

function Receipt({ o, p, onPay }: { o: LiveOrder; p: PageData; onPay?: () => void }) {
  const tx = useT();
  const t = useTotal(o);
  return (
    <div className="relative">
      <div className="rounded-t-3xl border border-b-0 border-slate-200 bg-white p-6 font-mono text-sm dark:border-white/15 dark:bg-[#0E1424]">
        <div className="flex items-center justify-between gap-3">
          <span className="flex items-center gap-2 font-sans font-display text-lg font-semibold text-slate-900 dark:text-white"><ReceiptText aria-hidden className="h-5 w-5" style={{ color: "var(--tone)" }} />{tx("Your order")}</span>
          <LiveMark c={p.d.platform} size="sm" />
        </div>
        <dl className="mt-4 space-y-2 border-y border-dashed border-slate-300 py-4 dark:border-white/20">
          {([
            [tx("Service"), o.service?.name ?? "—"],
            [tx("To"), o.target ? <span dir="ltr">{(o.values[o.target.name] ?? "").trim().replace(/^https?:\/\/(www\.)?/, "")}</span> : "—"],
            [tx("Amount"), t.amount],
            ...facts(o).slice(0, 3).map((n) => [n.label, n.value]),
          ] as [string, ReactNode][]).map(([k, v]) => (
            <div key={k} className="flex justify-between gap-4"><dt className="text-slate-500 dark:text-slate-400">{k}</dt><dd className="min-w-0 truncate text-end font-semibold text-slate-900 dark:text-white">{v}</dd></div>
          ))}
        </dl>
        <div className="mt-4 flex items-baseline justify-between"><span className="font-semibold text-slate-900 dark:text-white">{tx("Total")}</span><span className="font-sans font-display text-2xl font-bold tabular-nums text-slate-900 dark:text-white">{t.total}</span></div>
        <div className="mt-4 flex flex-wrap gap-2 font-sans">
          {[[KeyRound, tx("No password")], [Undo2, tx("Refund to wallet")], [BadgeCheck, tx("Enamad")]].map(([Icon, l]) => {
            const I = Icon as typeof KeyRound;
            return <span key={l as string} className="inline-flex -rotate-2 items-center gap-1 rounded-md border-2 border-emerald-700/60 px-2 py-0.5 text-xs font-bold uppercase tracking-wide text-emerald-800 dark:border-emerald-400/60 dark:text-emerald-300"><I aria-hidden className="h-3.5 w-3.5" />{l as string}</span>;
          })}
        </div>
        <button type={onPay ? "button" : "submit"} onClick={onPay} disabled={!o.service || !!o.d.error} className={`${primary} mt-5 w-full font-sans disabled:opacity-50`}>{tx(o.inCart ? "Add to cart" : "Pay")} · {t.total}</button>
        {o.blocker && <p role="alert" className="mt-3 text-center font-sans text-sm font-semibold text-red-700 dark:text-red-400">{o.blocker}</p>}
      </div>
      {/* Torn edge */}
      <div aria-hidden className="h-3 bg-[radial-gradient(circle_at_8px_0,transparent_6px,white_6.5px)] bg-[length:16px_12px] dark:bg-[radial-gradient(circle_at_8px_0,transparent_6px,#0E1424_6.5px)]" style={{ transform: "scaleY(-1)" }} />
    </div>
  );
}

function BodyD() {
  const tx = useT();
  const { p, o } = useOffer();
  const t = useTotal(o);
  const [open, setOpen] = useState(false);
  useEffect(() => { if (o.payOpen) setOpen(false); }, [o.payOpen]);
  if (o.order) return <Done o={o} />;
  return (
    <PageShell>
      <div style={{ ...o.tone.vars, ...toneVars(p.d) }}>
        <Section className="pb-8 pt-8 sm:pt-12">
          <Breadcrumb d={p.d} />
          <h1 className="mt-4 text-balance font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">{p.d.title}</h1>
          {p.d.sub && <p className="mt-2 max-w-2xl text-[15px] leading-7 text-slate-700 dark:text-slate-300">{p.d.sub}</p>}
          {o.notice && <LiveNotice n={o.notice} />}
        </Section>
        <Section>
          <form noValidate onSubmit={(e) => { e.preventDefault(); o.proceed(); }} className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
            <section aria-label={tx("Choose")} className={`${card} min-w-0 space-y-8 p-5 sm:p-8`}>
              <Problem o={o} />
              {o.service && !o.d.error && <><LiveAmount o={o} /><LiveFields o={o} /></>}
            </section>
            <aside aria-label={tx("Your order")} className="hidden lg:block"><div className="sticky top-24"><Receipt o={o} p={p} /></div></aside>
          </form>
        </Section>
        <Below p={p} o={o} />

        {/* Phones: the receipt as a bottom sheet. */}
        {o.service && (
          <div className="lg:hidden">
            {open && <button type="button" aria-label={tx("Close")} onClick={() => setOpen(false)} className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-[2px]" />}
            <div className="fixed inset-x-0 bottom-0 z-50">
              {open ? (
                <div className="mx-auto max-w-xl animate-fade-up px-3 pb-[max(.75rem,env(safe-area-inset-bottom))]">
                  <button type="button" onClick={() => setOpen(false)} className={`mx-auto mb-2 flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow dark:bg-[#0E1424] dark:text-slate-300 ${ring}`}>{tx("Hide")}<ChevronUp aria-hidden className="h-3.5 w-3.5 rotate-180" /></button>
                  <Receipt o={o} p={p} onPay={o.proceed} />
                </div>
              ) : (
                <button type="button" onClick={() => setOpen(true)} aria-expanded={false} className="flex w-full items-center gap-3 border-t border-slate-200 bg-white/95 px-4 pb-[max(.75rem,env(safe-area-inset-bottom))] pt-3 text-start backdrop-blur dark:border-white/10 dark:bg-[#0E1424]/95">
                  <ReceiptText aria-hidden className="h-6 w-6 shrink-0" style={{ color: "var(--tone)" }} />
                  <span className="min-w-0 flex-1"><span className="block truncate text-xs text-slate-600 dark:text-slate-400">{t.amount} · {o.service.name}</span><span className="block font-display text-xl font-bold tabular-nums text-slate-900 dark:text-white">{t.total}</span></span>
                  <span className="inline-flex items-center gap-1 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white dark:bg-white dark:text-slate-900">{tx("See receipt")}<ChevronUp aria-hidden className="h-4 w-4" /></span>
                </button>
              )}
            </div>
          </div>
        )}
        {o.service && <LiveCheckout o={o} />}
      </div>
    </PageShell>
  );
}
export const SocialServiceD = () => <ServiceRoot><BodyD /></ServiceRoot>;

// =====================================================================================================
// E — Tabs: a compact header, then a tab bar that sticks under the site header (Order · Details · Comments ·
// Questions). On a phone the long page becomes four short stops; the bar follows where you are.
// =====================================================================================================

function useSpy(ids: string[]) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver((es) => {
      const top = es.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
      if (top) setActive(top.target.id);
    }, { rootMargin: "-130px 0px -55% 0px" });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [ids.join()]); // eslint-disable-line react-hooks/exhaustive-deps
  return active;
}

function BodyE() {
  const tx = useT();
  const { p, o } = useOffer();
  const t = useTotal(o);
  const [sumRef, sumOn] = useOnScreen<HTMLDivElement>();
  const tabs = [
    { id: "tab-order", label: tx("Order") },
    { id: "tab-details", label: tx("Details") },
    ...(p.comments.length ? [{ id: "tab-comments", label: `${tx("Comments")} (${p.comments.length.toLocaleString(tx.locale === "fa" ? "fa-IR" : "en-US")})` }] : []),
    { id: "tab-faq", label: tx("Questions") },
  ];
  const active = useSpy(tabs.map((x) => x.id));
  if (o.order) return <Done o={o} />;
  const chips = facts(o).slice(0, 3);
  return (
    <PageShell>
      <div style={{ ...o.tone.vars, ...toneVars(p.d) }}>
        <Section className="pb-5 pt-8 sm:pt-12">
          <Breadcrumb d={p.d} />
          <div className="mt-4 flex items-center gap-3">
            <LiveMark c={p.d.platform} size="md" />
            <div className="min-w-0">
              <h1 className="text-balance font-display text-2xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">{p.d.title}</h1>
              <p className="text-sm font-semibold tabular-nums text-slate-700 dark:text-slate-300">{tx("from {0} / 1,000", { 0: t.from })}</p>
            </div>
          </div>
          {chips.length > 0 && (
            <ul className="mt-4 flex flex-wrap gap-2">
              {chips.map((n) => { const I = noteIcon(n.label); return <li key={n.label} className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm dark:border-white/10 dark:bg-white/5"><I aria-hidden className="h-4 w-4" style={{ color: "var(--tone)" }} /><span className="text-slate-600 dark:text-slate-400">{n.label}:</span><span className="font-semibold text-slate-900 dark:text-white">{n.value}</span></li>; })}
            </ul>
          )}
          {o.notice && <LiveNotice n={o.notice} />}
        </Section>

        <nav aria-label={tx("On this page")} className="sticky top-16 z-30 border-y border-slate-200 bg-[#F5F6FB]/90 backdrop-blur dark:border-white/10 dark:bg-[#070B14]/90">
          <Section className="!px-0 sm:!px-6">
            <ul className="flex overflow-x-auto px-4 [scrollbar-width:none] sm:px-0">
              {tabs.map((x) => (
                <li key={x.id} className="shrink-0">
                  <a href={`#${x.id}`} aria-current={active === x.id ? "true" : undefined} className={`relative block px-4 py-3.5 text-sm font-semibold ${ring} ${active === x.id ? "text-slate-900 dark:text-white" : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"}`}>
                    {x.label}
                    <span aria-hidden className={`absolute inset-x-3 bottom-0 h-0.5 rounded-full transition-opacity ${active === x.id ? "opacity-100" : "opacity-0"}`} style={{ background: "var(--tone)" }} />
                  </a>
                </li>
              ))}
            </ul>
          </Section>
        </nav>

        <Section className="space-y-16 pb-32 pt-8">
          <section id="tab-order" aria-label={tx("Order")} className="scroll-mt-32">
            <form noValidate onSubmit={(e) => { e.preventDefault(); o.proceed(); }} className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
              <div className={`${card} min-w-0 space-y-8 p-5 sm:p-8`}>
                <Problem o={o} />
                {o.service && !o.d.error && <><LiveAmount o={o} /><LiveFields o={o} /></>}
              </div>
              <aside aria-label={tx("Your order")}><div ref={sumRef} className="lg:sticky lg:top-36"><LiveSummary o={o} /></div></aside>
            </form>
          </section>
          <section id="tab-details" aria-labelledby="svc-details" className="scroll-mt-32 space-y-10">
            <h2 id="svc-details" className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-white">{tx("About this service")}</h2>
            <FactTiles o={o} />
            <AfterPay />
            <PromiseGrid />
            <Article d={p.d} />
          </section>
          {p.comments.length > 0 && <div id="tab-comments" className="scroll-mt-32"><Comments p={p} /></div>}
          <div id="tab-faq" className="scroll-mt-32"><Questions d={p.d} /></div>
          <OtherServices o={o} />
        </Section>
        {o.service && <><PayBar o={o} hide={sumOn} /><LiveCheckout o={o} /></>}
      </div>
    </PageShell>
  );
}
export const SocialServiceE = () => <ServiceRoot><BodyE /></ServiceRoot>;

