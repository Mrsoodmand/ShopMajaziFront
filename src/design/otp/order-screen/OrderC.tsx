"use client";

import { Clock, Plus, Repeat, Signal, Wifi, BatteryFull } from "lucide-react";
import { AppTile, CC, CopyButton } from "../parts";
import { CancelButton, RefundNote, useOrderState, type OrderViewProps } from "./shared";
import { useT } from "@/i18n/client";

// Order C — "Phone Inbox": the number, three short steps and the actions on the start side; on the end side a
// phone shows the SMS inbox — a typing bubble while waiting, then the real message with the code.
export default function OrderC({ order, flow }: OrderViewProps) {
  const tx = useT();
  const s = useOrderState(order);
  const app = order.offer.app;

  return (
    <div className="grid animate-fade-up items-center gap-8 rounded-3xl bg-white p-6 ring-1 ring-slate-200 [animation-duration:400ms] sm:p-8 lg:grid-cols-[minmax(0,1fr)_320px] dark:bg-[#0E1424] dark:ring-white/10">
      <div>
        <div className="flex flex-wrap items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
          <AppTile app={app} size="sm" /><span className="font-semibold text-slate-900 dark:text-white">{app.name}</span>
          <span className="text-slate-300 dark:text-white/20">/</span><CC cc={order.offer.country.cc} flag={order.offer.country.flag} />{order.offer.country.name}
          <span className="text-slate-300 dark:text-white/20">/</span>{order.operator?.name ?? tx("Any operator")}
        </div>

        <div className="mt-6 flex items-center gap-3 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200 dark:bg-white/[.03] dark:ring-white/10">
          <span className="flex-1 font-mono text-2xl font-bold tracking-wide text-slate-900 sm:text-3xl dark:text-white">{order.number}</span>
          <CopyButton text={order.number} label={tx("Copy number")} />
        </div>

        <ol className="mt-6 space-y-3 text-sm text-slate-600 dark:text-slate-300">
          {[tx("Copy the number and paste it in {0}.", { 0: app.name }), tx("Tap \"send code\" in {0}.", { 0: app.name }), tx("Watch the phone: the code lands there in seconds.")].map((t, i) => (
            <li key={t} className="flex gap-3"><span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-indigo-50 text-xs font-bold text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300">{i + 1}</span>{t}</li>
          ))}
        </ol>

        {s.waiting && <p className="mt-6 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400"><Clock className="h-4 w-4 text-amber-500" /><span><b className="font-mono text-slate-900 dark:text-white">{s.text}</b>{" "}{tx("left · no code by then means a full refund")}</span></p>}
        <RefundNote order={order} className="mt-6" />

        <div className="mt-6 flex flex-wrap gap-3">
          {s.waiting ? <CancelButton order={order} flow={flow} tone="outline" /> : (
            <>
              <button onClick={flow.sameAgain} className="flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-600 dark:bg-white dark:text-slate-900 dark:hover:bg-indigo-400 dark:hover:text-white"><Repeat className="h-4 w-4" />{tx("Same number type again")}</button>
              <button onClick={flow.startOver} className="flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-slate-700 ring-1 ring-slate-200 hover:ring-slate-300 dark:text-slate-200 dark:ring-white/15"><Plus className="h-4 w-4" />{tx("New number")}</button>
            </>
          )}
        </div>
      </div>

      {/* Phone */}
      <div className="mx-auto w-full max-w-[300px] rounded-[2.5rem] bg-slate-900 p-2.5 shadow-2xl shadow-slate-900/30 ring-1 ring-white/10">
        <div className="flex h-[440px] flex-col overflow-hidden rounded-[2rem] bg-slate-100 dark:bg-[#0B1120]">
          <div className="flex items-center justify-between px-6 pt-3 text-[11px] font-semibold text-slate-700 dark:text-slate-300"><span>9:41</span><span className="flex items-center gap-1"><Signal className="h-3 w-3" /><Wifi className="h-3 w-3" /><BatteryFull className="h-3.5 w-3.5" /></span></div>
          <div className="mt-3 flex flex-col items-center border-b border-slate-200 pb-3 dark:border-white/10"><AppTile app={app} size="sm" /><span className="mt-1 text-xs font-semibold text-slate-900 dark:text-white">{app.name}</span></div>
          <div className="flex flex-1 flex-col justify-end gap-2 p-4">
            <span className="mx-auto text-[10px] text-slate-400">{tx("Today")}</span>
            {s.received && order.code ? (
              <div className="max-w-[85%] animate-fade-up rounded-2xl rounded-bl-md bg-white px-3.5 py-2.5 text-sm text-slate-700 shadow-sm [animation-duration:400ms] dark:bg-white/10 dark:text-slate-200">
                {tx("Your")}{" "}{app.name}{" "}{tx("code is")}{" "}<b className="font-mono text-base text-slate-900 dark:text-white">{order.code}</b>{tx(". Don't share it with anyone.")}
                <span className="mt-1 flex justify-end [&_button]:h-7 [&_button]:w-7"><CopyButton text={order.code} label={tx("Copy code")} /></span>
              </div>
            ) : s.cancelled ? (
              <span className="mx-auto rounded-full bg-slate-200 px-3 py-1 text-[11px] text-slate-500 dark:bg-white/10 dark:text-slate-400">{tx("Number released")}</span>
            ) : (
              <div className="flex w-16 items-center justify-center gap-1 rounded-2xl rounded-bl-md bg-white px-3 py-3 shadow-sm dark:bg-white/10">
                {[0, 1, 2].map((i) => <span key={i} className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400" style={{ animationDelay: `${i * 150}ms` }} />)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
