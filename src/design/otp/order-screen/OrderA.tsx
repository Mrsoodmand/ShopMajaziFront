"use client";

import { MessageSquare, Plus, Repeat } from "lucide-react";
import { AppTile, CC, CopyButton } from "../parts";
import { CancelButton, RefundNote, useOrderState, type OrderViewProps } from "./shared";
import { useT } from "@/i18n/client";

// Order A — "Number Hero": one card. A slim progress bar on top, the number large in the middle, a live
// "waiting" line with a draining countdown bar, and one action row: Cancel on the start side, next steps on the end.
export default function OrderA({ order, flow }: OrderViewProps) {
  const t = useT();
  const s = useOrderState(order);
  const step = s.received ? 4 : 3;

  return (
    <div className="animate-fade-up overflow-hidden rounded-3xl bg-white ring-1 ring-slate-200 [animation-duration:400ms] dark:bg-[#0E1424] dark:ring-white/10">
      <div className="h-1 bg-slate-100 dark:bg-white/5"><div className={`h-full transition-all duration-700 ${s.cancelled ? "bg-slate-400" : s.received ? "bg-emerald-500" : "bg-amber-500"}`} style={{ width: `${(step / 4) * 100}%` }} /></div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-slate-100 px-6 py-4 text-sm dark:border-white/5">
        <span className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white"><AppTile app={order.offer.app} size="sm" />{order.offer.app.name}</span>
        <span className="flex items-center gap-2 text-slate-600 dark:text-slate-300"><CC cc={order.offer.country.cc} flag={order.offer.country.flag} />{order.offer.country.name}</span>
        <span className="text-slate-500 dark:text-slate-400">{order.operator?.name ?? t("Any operator")}</span>
        <span className="ms-auto text-xs text-slate-500 dark:text-slate-400">{s.paid} · <span className="font-mono">#{order.id}</span></span>
      </div>

      <div className="px-6 py-10 text-center sm:py-14">
        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{t("Your {app} number", { app: order.offer.app.name })}</div>
        <div className="mt-3 flex items-center justify-center gap-3">
          <span dir="ltr" className="font-mono text-3xl font-bold tracking-wide text-slate-900 sm:text-5xl dark:text-white">{order.number}</span>
          <CopyButton text={order.number} label={t("Copy number")} />
        </div>

        {s.waiting && (
          <div className="mx-auto mt-8 max-w-md">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 font-medium text-amber-600 dark:text-amber-300">
                <span className="flex gap-1">{[0, 1, 2].map((i) => <span key={i} className="h-1.5 w-1.5 animate-bounce rounded-full bg-amber-500" style={{ animationDelay: `${i * 150}ms` }} />)}</span>
                {t("Waiting for the SMS")}
              </span>
              <span className="font-mono font-semibold text-slate-900 dark:text-white">{s.text}</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10"><div className="h-full rounded-full bg-amber-500 transition-[width] duration-1000 ease-linear" style={{ width: `${s.fraction * 100}%` }} /></div>
            <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">{t("Enter the number in")}{" "}{order.offer.app.name}{t("; the code shows up here by itself. No code before the timer ends? You get refunded.")}</p>
          </div>
        )}

        {s.received && order.code && (
          <div className="mx-auto mt-8 flex max-w-md animate-fade-up items-center justify-between gap-4 rounded-2xl bg-emerald-600 px-6 py-5 text-start text-white [animation-duration:400ms]">
            <span className="min-w-0"><span className="flex items-center gap-1.5 text-xs text-emerald-100"><MessageSquare className="h-3.5 w-3.5" />{t("Verification code")}</span>{s.longCode
              ? <span className="mt-1 block text-sm leading-6 [overflow-wrap:anywhere]">{order.code}</span>
              : <span dir="ltr" className="font-mono text-4xl font-bold tracking-[0.25em]">{order.code}</span>}</span>
            <span className="[&_button]:bg-white/20 [&_button]:text-white [&_button:hover]:bg-white/30"><CopyButton text={order.code} label={t("Copy code")} /></span>
          </div>
        )}
        <RefundNote order={order} className="mx-auto mt-8 max-w-md text-start" />
      </div>

      <div className="flex flex-wrap items-center gap-3 border-t border-slate-100 bg-slate-50/60 px-6 py-4 dark:border-white/5 dark:bg-white/[.02]">
        <CancelButton order={order} flow={flow} tone="outline" />
        <div className="ms-auto flex flex-wrap gap-3">
          <button onClick={flow.startOver} className="flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-slate-700 ring-1 ring-slate-200 hover:ring-slate-300 dark:text-slate-200 dark:ring-white/15"><Plus className="h-4 w-4" />{t("New number")}</button>
          <button onClick={flow.sameAgain} className="flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-600 dark:bg-white dark:text-slate-900 dark:hover:bg-indigo-400 dark:hover:text-white"><Repeat className="h-4 w-4" />{t("Same again")}</button>
        </div>
      </div>
    </div>
  );
}
