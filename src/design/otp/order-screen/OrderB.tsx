"use client";

import { Check, MessageSquare, Plus, Repeat } from "lucide-react";
import { AppTile, CC, CopyButton } from "../parts";
import { CancelButton, RefundNote, useOrderState, type OrderViewProps } from "./shared";
import { useT } from "@/i18n/client";

// Order B — "Ticket + Status": the number as a dark gradient ticket (app, country, operator, paid on the stub);
// beside it a status panel with the countdown ring, a vertical timeline, and a full-width Cancel at the bottom.
export default function OrderB({ order, flow }: OrderViewProps) {
  const t = useT();
  const s = useOrderState(order);
  const C = 2 * Math.PI * 34;

  return (
    <div className="grid animate-fade-up gap-5 [animation-duration:400ms] md:grid-cols-[minmax(0,1fr)_300px]">
      <div className="flex flex-col gap-5">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 text-white shadow-xl shadow-indigo-900/20">
          <div aria-hidden className="absolute -end-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
          <div className="relative p-6 sm:p-8">
            <div className="flex items-center gap-3"><AppTile app={order.offer.app} /><span><span className="block font-display text-lg font-semibold">{order.offer.app.name}</span><span className="text-sm text-indigo-200">{t("Verification number")}</span></span></div>
            <div className="mt-8 flex items-center justify-between gap-3">
              <span className="font-mono text-3xl font-bold tracking-wide sm:text-4xl">{order.number}</span>
              <span className="[&_button]:bg-white/15 [&_button]:text-white [&_button:hover]:bg-white/25"><CopyButton text={order.number} label={t("Copy number")} /></span>
            </div>
            <p className="mt-2 text-sm text-indigo-200">{t("Enter it in")}{" "}{order.offer.app.name}{t(". The code appears here by itself.")}</p>
          </div>
          {/* Perforated stub */}
          <div className="relative flex items-center"><span className="-ms-3 h-6 w-6 rounded-full bg-[#F5F6FB] dark:bg-[#070B14]" /><span className="flex-1 border-t-2 border-dashed border-white/25" /><span className="-me-3 h-6 w-6 rounded-full bg-[#F5F6FB] dark:bg-[#070B14]" /></div>
          <dl className="relative grid grid-cols-2 gap-4 p-6 text-sm sm:grid-cols-4 sm:px-8">
            <div><dt className="text-xs text-indigo-200">{t("Country")}</dt><dd className="mt-1 flex items-center gap-2 font-medium"><CC cc={order.offer.country.cc} flag={order.offer.country.flag} />{order.offer.country.name}</dd></div>
            <div><dt className="text-xs text-indigo-200">{t("Operator")}</dt><dd className="mt-1 font-medium">{order.operator?.name ?? t("Any operator")}</dd></div>
            <div><dt className="text-xs text-indigo-200">{t("Paid")}</dt><dd className="mt-1 font-medium">{s.paid}</dd></div>
            <div><dt className="text-xs text-indigo-200">{t("Order")}</dt><dd className="mt-1 font-mono font-medium">#{order.id}</dd></div>
          </dl>
        </div>

        {s.received && order.code && (
          <div className="flex animate-fade-up items-center justify-between gap-4 rounded-3xl bg-emerald-600 px-6 py-5 text-white [animation-duration:400ms]">
            <span><span className="flex items-center gap-1.5 text-xs text-emerald-100"><MessageSquare className="h-3.5 w-3.5" />{t("Verification code")}</span><span className="font-mono text-4xl font-bold tracking-[0.25em]">{order.code}</span></span>
            <span className="[&_button]:bg-white/20 [&_button]:text-white [&_button:hover]:bg-white/30"><CopyButton text={order.code} label={t("Copy code")} /></span>
          </div>
        )}
        <RefundNote order={order} />
      </div>

      <aside className="flex flex-col rounded-3xl bg-white p-6 ring-1 ring-slate-200 dark:bg-[#0E1424] dark:ring-white/10">
        {s.waiting && (
          <div className="flex flex-col items-center border-b border-slate-100 pb-6 dark:border-white/5">
            <span className="relative grid h-28 w-28 place-items-center">
              <svg viewBox="0 0 76 76" className="absolute inset-0 -rotate-90"><circle cx="38" cy="38" r="34" className="fill-none stroke-slate-100 dark:stroke-white/10" strokeWidth="5" /><circle cx="38" cy="38" r="34" className="fill-none stroke-amber-500 transition-[stroke-dashoffset] duration-1000 ease-linear" strokeWidth="5" strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - s.fraction)} /></svg>
              <span className="text-center"><span className="block font-mono text-xl font-bold text-slate-900 dark:text-white">{s.text}</span><span className="text-[10px] uppercase tracking-wide text-slate-400">{t("left")}</span></span>
            </span>
            <span className="mt-3 text-center text-xs text-slate-500 dark:text-slate-400">{t("Auto refund if no code arrives")}</span>
          </div>
        )}

        <ol className={`relative space-y-4 ${s.waiting ? "pt-6" : ""}`}>
          {s.stages.map((st, i) => (
            <li key={st.label} className="relative flex items-center gap-3 text-sm">
              {i < s.stages.length - 1 && <span aria-hidden className={`absolute start-3 top-7 h-4 w-px ${st.done ? "bg-emerald-400" : "bg-slate-200 dark:bg-white/10"}`} />}
              <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-full ${st.done ? "bg-emerald-500 text-white" : st.active ? "bg-amber-100 dark:bg-amber-500/20" : "bg-slate-100 dark:bg-white/5"}`}>
                {st.done ? <Check className="h-3.5 w-3.5" /> : st.active ? <span className="h-2 w-2 animate-pulse rounded-full bg-amber-500" /> : <span className="h-1.5 w-1.5 rounded-full bg-slate-300 dark:bg-white/20" />}
              </span>
              <span className={st.done ? "font-medium text-slate-900 dark:text-white" : st.active ? "font-semibold text-amber-600 dark:text-amber-300" : "text-slate-400"}>{st.label}</span>
            </li>
          ))}
        </ol>

        <div className="mt-auto space-y-2 pt-6">
          <CancelButton order={order} flow={flow} tone="soft" full />
          {!s.waiting && (
            <>
              <button onClick={flow.sameAgain} className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-600 dark:bg-white dark:text-slate-900 dark:hover:bg-indigo-400 dark:hover:text-white"><Repeat className="h-4 w-4" />{t("Same number type again")}</button>
              <button onClick={flow.startOver} className="flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-slate-700 ring-1 ring-slate-200 hover:ring-slate-300 dark:text-slate-200 dark:ring-white/15"><Plus className="h-4 w-4" />{t("New number")}</button>
            </>
          )}
        </div>
      </aside>
    </div>
  );
}
