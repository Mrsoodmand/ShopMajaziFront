"use client";

import { Check, Clock, MessageSquare, Plus, Repeat } from "lucide-react";
import { AppTile, CC, CopyButton } from "../parts";
import { CancelButton, RefundNote, useOrderState, type OrderViewProps } from "./shared";
import { useT } from "@/i18n/client";

// Order D — "Receipt": one narrow centered card that reads top to bottom like a receipt: status and timer,
// the number, the code slot, the order lines under a dashed rule, and the buttons stacked full width at the end.
export default function OrderD({ order, flow }: OrderViewProps) {
  const t = useT();
  const s = useOrderState(order);
  const tone = s.received ? "bg-emerald-500" : s.cancelled ? "bg-slate-400" : "bg-amber-500";

  return (
    <div className="mx-auto w-full max-w-lg animate-fade-up rounded-3xl bg-white shadow-xl shadow-slate-900/5 ring-1 ring-slate-200 [animation-duration:400ms] dark:bg-[#0E1424] dark:shadow-none dark:ring-white/10">
      <div className="flex items-center justify-between px-6 pt-6">
        <span className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
          <span className="relative flex h-2.5 w-2.5">{s.waiting && <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-60 ${tone}`} />}<span className={`relative h-2.5 w-2.5 rounded-full ${tone}`} /></span>
          {s.received ? t("Code received") : s.cancelled ? t("Cancelled · refunded") : t("Waiting for SMS")}
        </span>
        {s.waiting && <span className="flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 font-mono text-sm font-semibold text-amber-700 dark:bg-amber-500/10 dark:text-amber-300"><Clock className="h-3.5 w-3.5" />{s.text}</span>}
        {s.received && <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-300"><Check className="h-3.5 w-3.5" />{t("Done")}</span>}
      </div>

      <div className="px-6 pt-6">
        <div className="text-xs text-slate-500 dark:text-slate-400">{t("Your number")}</div>
        <div className="mt-1 flex items-center justify-between gap-3">
          <span className="font-mono text-3xl font-bold tracking-wide text-slate-900 dark:text-white">{order.number}</span>
          <CopyButton text={order.number} label={t("Copy number")} />
        </div>

        <div className={`mt-5 flex items-center justify-between gap-4 rounded-2xl px-5 py-4 ${s.received ? "animate-fade-up bg-emerald-600 text-white [animation-duration:400ms]" : "border-2 border-dashed border-slate-200 text-slate-400 dark:border-white/10"}`}>
          <span>
            <span className={`flex items-center gap-1.5 text-xs ${s.received ? "text-emerald-100" : ""}`}><MessageSquare className="h-3.5 w-3.5" />{t("Verification code")}</span>
            <span className="font-mono text-3xl font-bold tracking-[0.25em]">{s.received ? order.code : s.cancelled ? "— — —" : "··· ···"}</span>
          </span>
          {s.received && order.code && <span className="[&_button]:bg-white/20 [&_button]:text-white [&_button:hover]:bg-white/30"><CopyButton text={order.code} label={t("Copy code")} /></span>}
        </div>
        {s.waiting && <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{t("Enter the number in")}{" "}{order.offer.app.name}{t("; the code fills in here.")}</p>}
        <RefundNote order={order} className="mt-4" />
      </div>

      <div className="relative my-6 flex items-center"><span className="-ms-3 h-6 w-6 rounded-full bg-[#F5F6FB] ring-1 ring-slate-200 dark:bg-[#070B14] dark:ring-white/10" /><span className="flex-1 border-t-2 border-dashed border-slate-200 dark:border-white/10" /><span className="-me-3 h-6 w-6 rounded-full bg-[#F5F6FB] ring-1 ring-slate-200 dark:bg-[#070B14] dark:ring-white/10" /></div>

      <dl className="space-y-3 px-6 text-sm">
        {[
          [t("App"), <span key="a" className="flex items-center gap-2"><AppTile app={order.offer.app} size="sm" />{order.offer.app.name}</span>],
          [t("Country"), <span key="c" className="flex items-center gap-2"><CC cc={order.offer.country.cc} flag={order.offer.country.flag} />{order.offer.country.name}</span>],
          [t("Operator"), order.operator?.name ?? t("Any operator")],
          [t("Order"), <span key="o" className="font-mono">#{order.id}</span>],
        ].map(([k, v]) => (
          <div key={k as string} className="flex items-center justify-between gap-4"><dt className="text-slate-500 dark:text-slate-400">{k}</dt><dd className="font-medium text-slate-900 dark:text-white">{v}</dd></div>
        ))}
        <div className="flex items-center justify-between gap-4 border-t border-slate-100 pt-3 dark:border-white/5"><dt className="font-semibold text-slate-900 dark:text-white">{t("Paid")}</dt><dd className="font-display text-lg font-bold text-slate-900 dark:text-white">{s.paid}</dd></div>
      </dl>

      <div className="space-y-2 p-6">
        {!s.waiting && <button onClick={flow.sameAgain} className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-indigo-700"><Repeat className="h-4 w-4" />{t("Same number type again")}</button>}
        <CancelButton order={order} flow={flow} tone="outline" full />
        <button onClick={flow.startOver} className="flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-white/5"><Plus className="h-4 w-4" />{t("New number")}</button>
      </div>
    </div>
  );
}
