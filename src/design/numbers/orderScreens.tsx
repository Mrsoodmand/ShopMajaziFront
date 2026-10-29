"use client";

import { useState, type ReactNode } from "react";
import { Check, ClipboardCopy, Copy, Inbox, MessageSquare, Plus, Repeat, Smartphone, Timer } from "lucide-react";
import { AppTile, CC } from "../otp/parts";
import { CancelButton, RefundNote, useOrderState, type OrderViewProps } from "../otp/order-screen/shared";
import type { Order } from "../otp/order";
import type { OtpFlow } from "../otp/flow";
import { useT } from "@/i18n/client";

// Order screens F–J (offers of /design/page-otp-order), built for the time between getting the number and the SMS.
// They share three ideas: a slot that shows where the code will land (it fills in when the SMS arrives), a short
// "what to do now" guide, and actions that match the moment: while waiting, nothing pushes another purchase;
// Cancel stays quiet; once the code is in, copying it comes first.

type S = ReturnType<typeof useOrderState>;
const ring = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2 dark:focus-visible:ring-indigo-400 dark:focus-visible:ring-offset-[#0E1424]";
const card = "animate-fade-up overflow-hidden rounded-3xl bg-white ring-1 ring-slate-200 [animation-duration:400ms] dark:bg-[#0E1424] dark:ring-white/10";
const clean = (v: string) => v.replace(/\s|\(|\)/g, "");
const low = (s: S) => s.waiting && s.fraction < 0.15; // last ~3 minutes

// Copy with words, not just an icon; says "Copied" for a moment (and to screen readers).
function CopyPill({ text, label, tone = "soft", className = "" }: { text: string; label: string; tone?: "soft" | "solid" | "onColor"; className?: string }) {
  const t = useT();
  const [done, setDone] = useState(false);
  const look = { soft: "bg-slate-100 text-slate-800 hover:bg-slate-200 dark:bg-white/10 dark:text-slate-100 dark:hover:bg-white/15", solid: "bg-indigo-600 text-white hover:bg-indigo-700", onColor: "bg-white/20 text-white hover:bg-white/30" }[tone];
  return (
    <button type="button" onClick={() => { navigator.clipboard?.writeText(clean(text)); setDone(true); setTimeout(() => setDone(false), 1600); }}
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-semibold transition-colors ${look} ${ring} ${className}`}>
      {done ? <Check aria-hidden className="h-4 w-4" strokeWidth={3} /> : <Copy aria-hidden className="h-4 w-4" />}
      <span aria-live="polite">{done ? t("Copied") : label}</span>
    </button>
  );
}

// Where the code lands: dashed empty cells while waiting, the code itself (with Copy) once it arrives.
function CodeSlot({ order, s, size = "lg" }: { order: Order; s: S; size?: "lg" | "sm" }) {
  const t = useT();
  if (s.cancelled) return <RefundNote order={order} />;
  if (s.received && order.code) return (
    <div className="animate-fade-up rounded-2xl bg-emerald-600 p-4 text-white [animation-duration:400ms] sm:p-5">
      <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-100"><MessageSquare aria-hidden className="h-3.5 w-3.5" />{t("Your {app} code", { app: order.offer.app.name })}</div>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
        {s.longCode ? <p className="min-w-0 flex-1 text-sm leading-6 [overflow-wrap:anywhere]">{order.code}</p>
          : <span dir="ltr" className={`font-mono font-bold tracking-[0.3em] ${size === "lg" ? "text-4xl sm:text-5xl" : "text-2xl"}`}>{order.code}</span>}
        <CopyPill text={order.code} label={t("Copy code")} tone="onColor" />
      </div>
    </div>
  );
  return (
    <div className="rounded-2xl border-2 border-dashed border-slate-300 p-4 dark:border-white/15">
      <div dir="ltr" aria-hidden className="flex justify-center gap-2">
        {Array.from({ length: 6 }, (_, i) => (
          <span key={i} style={{ animationDelay: `${i * 120}ms` }} className={`animate-pulse rounded-lg bg-slate-100 dark:bg-white/10 ${size === "lg" ? "h-12 w-10 sm:h-14 sm:w-12" : "h-8 w-7"}`} />
        ))}
      </div>
      <p className="mt-3 text-center text-sm text-slate-600 dark:text-slate-400">{t("The code appears here by itself. No need to refresh.")}</p>
    </div>
  );
}

// The three things to do, with the current one marked.
function Guide({ order, s, vertical = false }: { order: Order; s: S; vertical?: boolean }) {
  const t = useT();
  const steps = [
    { icon: ClipboardCopy, text: t("Copy the number"), done: true },
    { icon: Smartphone, text: t("Enter it in {app}", { app: order.offer.app.name }), done: !s.waiting },
    { icon: Inbox, text: t("The code shows up here"), done: s.received },
  ];
  const current = steps.findIndex((x) => !x.done);
  return (
    <ol className={vertical ? "space-y-3" : "grid gap-2 sm:grid-cols-3"}>
      {steps.map((x, i) => {
        const on = i === current;
        return (
          <li key={i} aria-current={on ? "step" : undefined} className={`flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm ${on ? "bg-indigo-50 font-semibold text-indigo-900 dark:bg-indigo-500/15 dark:text-indigo-100" : "text-slate-700 dark:text-slate-300"}`}>
            <span aria-hidden className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-bold ${x.done ? "bg-emerald-600 text-white" : on ? "bg-indigo-600 text-white" : "bg-slate-200 text-slate-700 dark:bg-white/10 dark:text-slate-300"}`}>{x.done ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : i + 1}</span>
            {x.text}
          </li>
        );
      })}
    </ol>
  );
}

// Time left, as a ring. Turns rose in the last minutes.
function TimerRing({ s, size = 132 }: { s: S; size?: number }) {
  const t = useT();
  const r = 44, c = 2 * Math.PI * r;
  const tone = s.received ? "text-emerald-500" : s.cancelled ? "text-slate-400" : low(s) ? "text-rose-500" : "text-indigo-500";
  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" className="absolute inset-0 -rotate-90">
        <circle cx="50" cy="50" r={r} fill="none" strokeWidth="6" className="stroke-slate-100 dark:stroke-white/10" />
        <circle cx="50" cy="50" r={r} fill="none" strokeWidth="6" strokeLinecap="round" stroke="currentColor" className={`${tone} transition-[stroke-dashoffset] duration-1000 ease-linear`}
          strokeDasharray={c} strokeDashoffset={s.waiting ? c * (1 - s.fraction) : 0} />
      </svg>
      <div className="text-center">
        {s.received ? <Check aria-hidden className="mx-auto h-9 w-9 text-emerald-500" strokeWidth={3} />
          : <span className={`block font-mono text-2xl font-bold tabular-nums ${low(s) ? "text-rose-600 dark:text-rose-400" : "text-slate-900 dark:text-white"}`}>{s.waiting ? s.text : "--:--"}</span>}
        <span className="text-xs text-slate-600 dark:text-slate-400">{s.received ? t("Code received") : s.waiting ? t("left") : t("Closed")}</span>
      </div>
    </div>
  );
}

function Meta({ order, s }: { order: Order; s: S }) {
  const t = useT();
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
      <span className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white"><AppTile app={order.offer.app} size="sm" />{order.offer.app.name}</span>
      <span className="flex items-center gap-2 text-slate-700 dark:text-slate-300"><CC cc={order.offer.country.cc} flag={order.offer.country.flag} />{order.offer.country.name}</span>
      <span className="text-slate-600 dark:text-slate-400">{order.operator?.name ?? t("Any operator")}</span>
      <span className="ms-auto text-xs text-slate-600 dark:text-slate-400">{s.paid} · <span dir="ltr" className="font-mono">#{order.id}</span></span>
    </div>
  );
}

function Number({ order, big = true }: { order: Order; big?: boolean }) {
  return <span dir="ltr" className={`font-mono font-bold tracking-wide text-slate-900 dark:text-white ${big ? "text-3xl sm:text-5xl" : "text-xl sm:text-2xl"}`}>{order.number}</span>;
}

// Waiting: Cancel (quiet) only. Done: Same again first, New number second.
function Actions({ order, flow, s, className = "" }: { order: Order; flow: OtpFlow; s: S; className?: string }) {
  const t = useT();
  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      {s.waiting ? (
        <>
          <p className="me-auto text-sm text-slate-600 dark:text-slate-400">{t("No code before the timer ends? The full amount comes back to your wallet.")}</p>
          <CancelButton order={order} flow={flow} tone="ghost" />
        </>
      ) : (
        <>
          <button type="button" onClick={flow.sameAgain} className={`flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 ${ring}`}><Repeat aria-hidden className="h-4 w-4" />{t("Same again")}</button>
          <button type="button" onClick={flow.startOver} className={`flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-slate-800 ring-1 ring-slate-300 hover:ring-slate-500 dark:text-slate-100 dark:ring-white/20 ${ring}`}><Plus aria-hidden className="h-4 w-4" />{t("New number")}</button>
        </>
      )}
    </div>
  );
}

// ---------- F · Code Slot ----------
// One card read top to bottom: the number with Copy, a slim timer, then the empty code slot that fills in.
export function OrderF({ order, flow }: OrderViewProps) {
  const t = useT();
  const s = useOrderState(order);
  return (
    <div className={card}>
      <div className="border-b border-slate-100 px-5 py-4 sm:px-6 dark:border-white/5"><Meta order={order} s={s} /></div>
      <div className="mx-auto max-w-xl px-5 py-8 text-center sm:px-6 sm:py-10">
        <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">{t("Your {app} number", { app: order.offer.app.name })}</p>
        <div className="mt-2 flex flex-wrap items-center justify-center gap-3"><Number order={order} /><CopyPill text={order.number} label={t("Copy")} /></div>
        {s.waiting && (
          <div className="mx-auto mt-6 max-w-sm">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 font-semibold text-amber-700 dark:text-amber-300"><span className="relative flex h-2 w-2"><span className="absolute inset-0 animate-ping rounded-full bg-amber-500/60" /><span className="relative h-2 w-2 rounded-full bg-amber-500" /></span>{t("Waiting for the SMS")}</span>
              <span className={`font-mono font-semibold tabular-nums ${low(s) ? "text-rose-600 dark:text-rose-400" : "text-slate-900 dark:text-white"}`}>{s.text}</span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10"><div className={`h-full rounded-full transition-[width] duration-1000 ease-linear ${low(s) ? "bg-rose-500" : "bg-amber-500"}`} style={{ width: `${s.fraction * 100}%` }} /></div>
          </div>
        )}
        <div className="mt-6 text-start"><CodeSlot order={order} s={s} /></div>
        <div className="mt-6 text-start"><Guide order={order} s={s} /></div>
      </div>
      <div className="border-t border-slate-100 bg-slate-50/60 px-5 py-4 sm:px-6 dark:border-white/5 dark:bg-white/[.02]"><Actions order={order} flow={flow} s={s} /></div>
    </div>
  );
}

// ---------- G · Inbox ----------
// Two halves: the number and what to do on one side; on the other, an inbox where the SMS lands as a message,
// with the code picked out of it.
export function OrderG({ order, flow }: OrderViewProps) {
  const t = useT();
  const s = useOrderState(order);
  return (
    <div className={card}>
      <div className="border-b border-slate-100 px-5 py-4 sm:px-6 dark:border-white/5"><Meta order={order} s={s} /></div>
      <div className="grid gap-6 p-5 sm:p-6 md:grid-cols-2">
        <div>
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">{t("Your {app} number", { app: order.offer.app.name })}</p>
          <div className="mt-2 flex flex-wrap items-center gap-3"><Number order={order} big={false} /><CopyPill text={order.number} label={t("Copy")} /></div>
          <div className="mt-5"><Guide order={order} s={s} vertical /></div>
        </div>
        <section aria-label={t("Inbox")} className="flex flex-col rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200 dark:bg-white/[.03] dark:ring-white/10">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white"><Inbox aria-hidden className="h-4 w-4" />{t("Inbox")}</span>
            {s.waiting && <span className={`flex items-center gap-1.5 font-mono tabular-nums ${low(s) ? "text-rose-600 dark:text-rose-400" : "text-slate-700 dark:text-slate-300"}`}><Timer aria-hidden className="h-4 w-4" />{s.text}</span>}
          </div>
          <div aria-live="polite" className="mt-4 flex flex-1 flex-col justify-end gap-3">
            {s.waiting && (
              <div className="flex items-end gap-2">
                <AppTile app={order.offer.app} size="sm" />
                <span className="flex gap-1 rounded-2xl rounded-es-md bg-white px-4 py-3 ring-1 ring-slate-200 dark:bg-[#0E1424] dark:ring-white/10" aria-label={t("Waiting for the SMS")}>
                  {[0, 1, 2].map((i) => <span key={i} style={{ animationDelay: `${i * 160}ms` }} className="h-2 w-2 animate-bounce rounded-full bg-slate-400" />)}
                </span>
              </div>
            )}
            {s.received && order.code && (
              <div className="flex animate-fade-up items-end gap-2 [animation-duration:400ms]">
                <AppTile app={order.offer.app} size="sm" />
                <div className="min-w-0 flex-1 rounded-2xl rounded-es-md bg-white p-4 ring-1 ring-emerald-300 dark:bg-[#0E1424] dark:ring-emerald-400/40">
                  <p className="text-sm text-slate-700 dark:text-slate-300">{s.longCode ? <span className="[overflow-wrap:anywhere]">{order.code}</span> : t("Your {app} code", { app: order.offer.app.name })}</p>
                  {!s.longCode && <p dir="ltr" className="mt-1 font-mono text-3xl font-bold tracking-[0.25em] text-emerald-700 dark:text-emerald-300">{order.code}</p>}
                  <CopyPill text={order.code} label={t("Copy code")} tone="solid" className="mt-3" />
                </div>
              </div>
            )}
            {s.cancelled && <RefundNote order={order} />}
          </div>
        </section>
      </div>
      <div className="border-t border-slate-100 bg-slate-50/60 px-5 py-4 sm:px-6 dark:border-white/5 dark:bg-white/[.02]"><Actions order={order} flow={flow} s={s} /></div>
    </div>
  );
}

// ---------- H · Timer Ring ----------
// The countdown leads: a ring of time left beside the number, so how long you have is clear at a glance.
// The ring turns rose near the end and into a green check when the code is in.
export function OrderH({ order, flow }: OrderViewProps) {
  const t = useT();
  const s = useOrderState(order);
  return (
    <div className={card}>
      <div className="border-b border-slate-100 px-5 py-4 sm:px-6 dark:border-white/5"><Meta order={order} s={s} /></div>
      <div className="flex flex-col items-center gap-6 p-6 sm:flex-row sm:gap-8 sm:p-8">
        <TimerRing s={s} />
        <div className="min-w-0 flex-1 text-center sm:text-start">
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">{t("Your {app} number", { app: order.offer.app.name })}</p>
          <div className="mt-2 flex flex-wrap items-center justify-center gap-3 sm:justify-start"><Number order={order} /><CopyPill text={order.number} label={t("Copy")} /></div>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{s.waiting ? t("Enter it in {app} now; the code arrives here.", { app: order.offer.app.name }) : s.received ? t("Done. Paste the code in {app}.", { app: order.offer.app.name }) : ""}</p>
        </div>
      </div>
      <div className="px-6 pb-6 sm:px-8"><CodeSlot order={order} s={s} /></div>
      <div className="border-t border-slate-100 bg-slate-50/60 px-5 py-4 sm:px-6 dark:border-white/5 dark:bg-white/[.02]"><Actions order={order} flow={flow} s={s} /></div>
    </div>
  );
}

// ---------- I · Checklist ----------
// The whole order as a checklist: paid, number, SMS, code. Each line shows its own content when it is the
// current one, so the page always says what is happening now.
export function OrderI({ order, flow }: OrderViewProps) {
  const t = useT();
  const s = useOrderState(order);
  const Row = ({ n, done, active, title, children }: { n: number; done: boolean; active?: boolean; title: string; children?: ReactNode }) => (
    <li className="relative flex gap-4 pb-6 last:pb-0">
      <span aria-hidden className="absolute bottom-0 start-[15px] top-8 w-px bg-slate-200 last:hidden dark:bg-white/10" />
      <span aria-hidden className={`relative grid h-8 w-8 shrink-0 place-items-center rounded-full text-sm font-bold ${done ? "bg-emerald-600 text-white" : active ? "bg-indigo-600 text-white ring-4 ring-indigo-500/20" : "bg-slate-200 text-slate-600 dark:bg-white/10 dark:text-slate-400"}`}>{done ? <Check className="h-4 w-4" strokeWidth={3} /> : n}</span>
      <div className="min-w-0 flex-1 pt-1">
        <p className={`font-semibold ${active ? "text-slate-900 dark:text-white" : "text-slate-700 dark:text-slate-300"}`}>{title}</p>
        {children && <div className="mt-3">{children}</div>}
      </div>
    </li>
  );
  return (
    <div className={card}>
      <div className="border-b border-slate-100 px-5 py-4 sm:px-6 dark:border-white/5"><Meta order={order} s={s} /></div>
      <ol className="p-5 sm:p-6">
        <Row n={1} done title={t("Paid · {0}", { 0: s.paid })} />
        <Row n={2} done title={t("Your {app} number", { app: order.offer.app.name })}>
          <div className="flex flex-wrap items-center gap-3"><Number order={order} big={false} /><CopyPill text={order.number} label={t("Copy")} /></div>
        </Row>
        <Row n={3} done={!s.waiting} active={s.waiting} title={s.waiting ? t("Enter it in {app} · waiting for the SMS", { app: order.offer.app.name }) : t("SMS")}>
          {s.waiting && (
            <div className="max-w-md">
              <div className="flex items-center justify-between text-sm"><span className="text-slate-600 dark:text-slate-400">{t("Time left")}</span><span className={`font-mono font-semibold tabular-nums ${low(s) ? "text-rose-600 dark:text-rose-400" : "text-slate-900 dark:text-white"}`}>{s.text}</span></div>
              <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10"><div className={`h-full rounded-full transition-[width] duration-1000 ease-linear ${low(s) ? "bg-rose-500" : "bg-indigo-500"}`} style={{ width: `${s.fraction * 100}%` }} /></div>
            </div>
          )}
        </Row>
        <Row n={4} done={s.received} active={s.received} title={t("Code")}><CodeSlot order={order} s={s} size="sm" /></Row>
      </ol>
      <div className="border-t border-slate-100 bg-slate-50/60 px-5 py-4 sm:px-6 dark:border-white/5 dark:bg-white/[.02]"><Actions order={order} flow={flow} s={s} /></div>
    </div>
  );
}

// ---------- J · Slim Bar ----------
// For people who buy several at once: one short bar per order (app, number, time left, code slot, Cancel), so a
// few active numbers fit on one screen. The code fills the slot at the end of the bar.
export function OrderJ({ order, flow }: OrderViewProps) {
  const t = useT();
  const s = useOrderState(order);
  return (
    <div className="space-y-3">
      <div className={`${card} p-4 sm:p-5`}>
        <div className="flex flex-wrap items-center gap-4">
          <AppTile app={order.offer.app} />
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2"><Number order={order} big={false} /><CopyPill text={order.number} label={t("Copy")} /></div>
            <p className="mt-0.5 flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-400"><CC cc={order.offer.country.cc} flag={order.offer.country.flag} />{order.offer.country.name} · {order.operator?.name ?? t("Any operator")}</p>
          </div>
          <div className="ms-auto flex flex-wrap items-center gap-3">
            {s.waiting && <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 font-mono text-sm font-semibold tabular-nums ${low(s) ? "bg-rose-50 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300" : "bg-amber-50 text-amber-800 dark:bg-amber-500/15 dark:text-amber-200"}`}><Timer aria-hidden className="h-4 w-4" />{s.text}</span>}
            {s.received && order.code ? (
              <span className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 py-1.5 pe-1.5 ps-4 text-white">
                {s.longCode ? <span className="max-w-[16rem] truncate text-sm">{order.code}</span> : <span dir="ltr" className="font-mono text-xl font-bold tracking-[0.2em]">{order.code}</span>}
                <CopyPill text={order.code} label={t("Copy")} tone="onColor" />
              </span>
            ) : s.waiting ? (
              <span dir="ltr" aria-label={t("The code appears here by itself. No need to refresh.")} className="flex gap-1 rounded-xl border-2 border-dashed border-slate-300 p-1.5 dark:border-white/15">
                {Array.from({ length: 6 }, (_, i) => <span key={i} style={{ animationDelay: `${i * 120}ms` }} className="h-7 w-5 animate-pulse rounded-md bg-slate-100 dark:bg-white/10" />)}
              </span>
            ) : null}
          </div>
        </div>
        {s.waiting && <div className="mt-4 h-1 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10"><div className={`h-full rounded-full transition-[width] duration-1000 ease-linear ${low(s) ? "bg-rose-500" : "bg-amber-500"}`} style={{ width: `${s.fraction * 100}%` }} /></div>}
        {s.cancelled && <div className="mt-4"><RefundNote order={order} /></div>}
        <div className="mt-4 border-t border-slate-100 pt-4 dark:border-white/5"><Actions order={order} flow={flow} s={s} /></div>
      </div>
      {s.waiting && <div className="rounded-2xl bg-white/60 p-3 ring-1 ring-slate-200 dark:bg-white/[.03] dark:ring-white/10"><Guide order={order} s={s} /></div>}
    </div>
  );
}
