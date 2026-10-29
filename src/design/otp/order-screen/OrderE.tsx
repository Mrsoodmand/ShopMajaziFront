"use client";

import { Check, MessageSquare, Plus, Repeat, ShieldCheck } from "lucide-react";
import { AppTile, CC, CopyButton } from "../parts";
import { CancelButton, RefundNote, useOrderState, type OrderViewProps } from "./shared";
import { useT } from "@/i18n/client";

// Order E — "Stepper + Control Bar": the current layout tidied up. A connected stepper with a filling line,
// the number card with details folded in, and a dark control bar that holds the timer and the Cancel button
// together, so stopping the order sits right next to the time left.
export default function OrderE({ order, flow }: OrderViewProps) {
  const t = useT();
  const s = useOrderState(order);
  const doneCount = s.stages.filter((x) => x.done).length;

  return (
    <div className="animate-fade-up space-y-5 [animation-duration:400ms]">
      <ol className="relative grid grid-cols-4">
        <span aria-hidden className="absolute inset-x-[12.5%] top-3.5 h-0.5 bg-slate-200 dark:bg-white/10" />
        {/* The green line runs up to the current step: "Waiting for SMS" while waiting (2 of 3 gaps), the last step once the code is in. */}
        <span aria-hidden className={`absolute start-[12.5%] top-3.5 h-0.5 transition-all duration-700 ${s.cancelled ? "bg-slate-400" : "bg-emerald-500"}`} style={{ width: `${(s.waiting ? 2 : doneCount - 1) * 25}%` }} />
        {s.stages.map((st) => (
          <li key={st.label} className="relative flex flex-col items-center gap-2 text-center">
            <span className={`grid h-7 w-7 place-items-center rounded-full ring-4 ring-[#F5F6FB] dark:ring-[#070B14] ${st.done ? (s.cancelled && st.label.startsWith("Cancelled") ? "bg-slate-400 text-white" : "bg-emerald-500 text-white") : st.active ? "bg-amber-500" : "bg-slate-200 dark:bg-white/10"}`}>
              {st.done ? <Check className="h-4 w-4" /> : st.active ? <span className="h-2 w-2 animate-ping rounded-full bg-white" /> : null}
            </span>
            <span className={`text-xs font-semibold ${st.done ? "text-slate-900 dark:text-white" : st.active ? "text-amber-600 dark:text-amber-300" : "text-slate-400"}`}>{st.label}</span>
          </li>
        ))}
      </ol>

      <div className="rounded-3xl bg-white ring-1 ring-slate-200 dark:bg-[#0E1424] dark:ring-white/10">
        <div className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">{t("Your number")}</div>
              <div className="mt-2 font-mono text-3xl font-bold tracking-wide text-slate-900 sm:text-4xl dark:text-white">{order.number}</div>
            </div>
            <CopyButton text={order.number} label={t("Copy number")} />
          </div>
          <div className="mt-4 flex flex-wrap gap-2 text-xs">
            <span className="flex items-center gap-1.5 rounded-full bg-slate-100 py-1 pe-3 ps-1 font-medium text-slate-700 dark:bg-white/5 dark:text-slate-200"><AppTile app={order.offer.app} size="sm" />{order.offer.app.name}</span>
            <span className="flex items-center gap-1.5 rounded-full bg-slate-100 py-1 pe-3 ps-1 font-medium text-slate-700 dark:bg-white/5 dark:text-slate-200"><CC cc={order.offer.country.cc} flag={order.offer.country.flag} />{order.offer.country.name}</span>
            <span className="flex items-center rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-700 dark:bg-white/5 dark:text-slate-200">{order.operator?.name ?? t("Any operator")}</span>
            <span className="flex items-center rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-700 dark:bg-white/5 dark:text-slate-200">{s.paid} · <span className="ms-1 font-mono">#{order.id}</span></span>
          </div>

          {s.received && order.code && (
            <div className="mt-5 flex animate-fade-up items-center justify-between gap-4 rounded-2xl bg-emerald-600 px-5 py-4 text-white [animation-duration:400ms]">
              <span><span className="flex items-center gap-1.5 text-xs text-emerald-100"><MessageSquare className="h-3.5 w-3.5" />{t("Verification code")}</span><span className="font-mono text-4xl font-bold tracking-[0.25em]">{order.code}</span></span>
              <span className="[&_button]:bg-white/20 [&_button]:text-white [&_button:hover]:bg-white/30"><CopyButton text={order.code} label={t("Copy code")} /></span>
            </div>
          )}
          <RefundNote order={order} className="mt-5" />
        </div>

        {s.waiting && (
          <div className="flex flex-wrap items-center gap-4 rounded-b-3xl bg-slate-900 px-6 py-4 text-white dark:bg-white/[.04]">
            <span className="font-mono text-2xl font-bold tabular-nums">{s.text}</span>
            <span className="min-w-40 flex-1">
              <span className="block h-1.5 overflow-hidden rounded-full bg-white/15"><span className="block h-full rounded-full bg-amber-400 transition-[width] duration-1000 ease-linear" style={{ width: `${s.fraction * 100}%` }} /></span>
              <span className="mt-1.5 flex items-center gap-1 text-xs text-slate-300"><ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />{t("Enter it in {app}. No code in time = automatic refund.", { app: order.offer.app.name })}</span>
            </span>
            <CancelButton order={order} flow={flow} tone="onDark" />
          </div>
        )}
      </div>

      {!s.waiting && (
        <div className="flex flex-wrap gap-3">
          <button onClick={flow.sameAgain} className="flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-600 dark:bg-white dark:text-slate-900 dark:hover:bg-indigo-400 dark:hover:text-white"><Repeat className="h-4 w-4" />{t("Same number type again")}</button>
          <button onClick={flow.startOver} className="flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-slate-700 ring-1 ring-slate-200 hover:ring-slate-300 dark:text-slate-200 dark:ring-white/15"><Plus className="h-4 w-4" />{t("New number")}</button>
        </div>
      )}
    </div>
  );
}
