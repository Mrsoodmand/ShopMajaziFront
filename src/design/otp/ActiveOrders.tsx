"use client";

import { useEffect, useState } from "react";
import { Loader2, MessageSquare, RefreshCw, Repeat } from "lucide-react";
import type { OtpFlow } from "./flow";
import type { Order } from "./order";
import { AppTile, CC, CopyButton } from "./parts";
import { CancelButton, useOrderState } from "./order-screen/shared";
import { useT } from "@/i18n/client";

// Numbers still in play, as cards under the picker: each waiting number with its countdown and
// Check SMS / Cancel & refund / Buy again. A number that was waiting during this visit keeps its card after the
// code arrives (or it is cancelled), so the code doesn't vanish the moment it shows up. Older orders live in the account.
export default function ActiveOrders({ flow, className = "" }: { flow: OtpFlow; className?: string }) {
  const t = useT();
  const active = flow.activeOrders;
  if (!active.length) return null;
  return (
    <section aria-labelledby="active-numbers" className={className}>
      <h2 id="active-numbers" className="px-1 pb-3 font-display font-semibold text-slate-900 dark:text-white">{t("Active numbers")}</h2>
      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {active.map((o) => <li key={o.id}><OrderCard order={o} flow={flow} /></li>)}
      </ul>
    </section>
  );
}

function OrderCard({ order, flow }: { order: Order; flow: OtpFlow }) {
  const t = useT();
  const s = useOrderState(order);
  const [checking, setChecking] = useState(false);
  const [note, setNote] = useState<string | null>(null);
  useEffect(() => { if (!note) return; const id = setTimeout(() => setNote(null), 5000); return () => clearTimeout(id); }, [note]);

  const checkNow = async () => {
    setChecking(true); setNote(null);
    try {
      await Promise.all([flow.check(order.id), new Promise((r) => setTimeout(r, 500))]);
      setNote(t("No SMS yet. We keep checking by ourselves too."));
    } catch {
      setNote(t("Couldn't check right now. Please try again."));
    } finally {
      setChecking(false);
    }
  };
  // The note only makes sense while the number is still waiting.
  const showNote = note && s.waiting;

  const pill = s.received
    ? { text: t("Code received"), cls: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300" }
    : s.cancelled
      ? { text: s.expired ? t("Expired · refunded") : t("Cancelled · refunded"), cls: "bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-300" }
      : { text: t("Waiting for SMS"), cls: "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300" };

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-3xl bg-white ring-1 ring-slate-200 dark:bg-[#0E1424] dark:ring-white/10">
      {/* Time left, draining; full green once the code is in. */}
      <div className="h-1 bg-slate-100 dark:bg-white/5">
        <div className={`h-full transition-[width] duration-1000 ease-linear ${s.received ? "bg-emerald-500" : s.cancelled ? "bg-slate-300 dark:bg-white/20" : "bg-amber-500"}`}
          style={{ width: `${s.waiting ? Math.max(0, Math.min(1, s.fraction)) * 100 : 100}%` }} />
      </div>

      <div className="flex flex-1 flex-col gap-4 p-4">
        <header className="flex items-center gap-3">
          <AppTile app={order.offer.app} size="sm" />
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-semibold text-slate-900 dark:text-white">{order.offer.app.name}</div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <span className="[&>*]:h-3.5 [&>*]:w-5"><CC cc={order.offer.country.cc} flag={order.offer.country.flag} /></span>
              <span className="truncate">{order.offer.country.name}{order.operator ? ` · ${order.operator.name}` : ""}</span>
            </div>
          </div>
          <span className={`flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${pill.cls}`}>
            {s.waiting && <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-500 motion-reduce:animate-none" aria-hidden />}
            {pill.text}{s.waiting && <span dir="ltr" className="tabular-nums">{s.text}</span>}
          </span>
        </header>

        <div className="flex items-center justify-between gap-3 rounded-2xl bg-slate-50 px-3.5 py-3 dark:bg-white/5">
          <span dir="ltr" className={`min-w-0 truncate font-display text-lg font-bold tabular-nums tracking-wide ${s.cancelled ? "text-slate-400 line-through decoration-1" : "text-slate-900 dark:text-white"}`}>{order.number}</span>
          {!s.cancelled && <CopyButton text={order.number} label={t("Copy number")} />}
        </div>

        {s.received && order.code && (
          <div className="flex items-center justify-between gap-3 rounded-2xl bg-emerald-600 px-3.5 py-3 text-white">
            <span className="min-w-0">
              <span className="flex items-center gap-1.5 text-xs text-emerald-100"><MessageSquare className="h-3.5 w-3.5" aria-hidden />{t("Verification code")}</span>
              <span dir="ltr" className={`block font-display font-bold tabular-nums ${s.longCode ? "mt-1 text-sm leading-relaxed" : "text-2xl tracking-[0.2em]"}`}>{order.code}</span>
            </span>
            <span className="shrink-0 [&_button]:bg-white/20 [&_button]:text-white [&_button:hover]:bg-white/30"><CopyButton text={order.code} label={t("Copy code")} /></span>
          </div>
        )}

        <div className="mt-auto flex flex-wrap items-center gap-2">
          {s.waiting && (
            <button onClick={checkNow} disabled={checking}
              className="flex items-center gap-2 rounded-xl bg-indigo-50 px-4 py-2.5 text-sm font-semibold text-indigo-700 transition-colors hover:bg-indigo-100 disabled:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 dark:bg-indigo-500/15 dark:text-indigo-200 dark:hover:bg-indigo-500/25 dark:focus-visible:ring-emerald-400 dark:focus-visible:ring-offset-[#0E1424]">
              {checking ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <RefreshCw className="h-4 w-4" aria-hidden />}{checking ? t("Checking…") : t("Check SMS")}
            </button>
          )}
          <CancelButton order={order} flow={flow} tone="ghost" className="!px-4 !py-2.5" />
          <button onClick={() => flow.sameAgain(order.id)}
            className="ms-auto flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 ring-1 ring-slate-200 transition-colors hover:bg-slate-50 hover:ring-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 dark:text-slate-200 dark:ring-white/15 dark:hover:bg-white/5 dark:focus-visible:ring-emerald-400 dark:focus-visible:ring-offset-[#0E1424]">
            <Repeat className="h-4 w-4" aria-hidden />{t("Buy again")}
          </button>
          {showNote && <p role="status" className="w-full text-xs text-slate-500 dark:text-slate-400">{note}</p>}
        </div>
      </div>
    </article>
  );
}
