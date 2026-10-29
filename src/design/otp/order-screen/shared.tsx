"use client";

import { useEffect, useState } from "react";
import { X, RotateCcw, Loader2 } from "lucide-react";
import { useMoney } from "@/lib/money";
import type { OtpFlow } from "../flow";
import { useCountdown, type Order } from "../order";
import { useT } from "@/i18n/client";
import { errorText } from "@/components/account/errors";

export type OrderViewProps = { order: Order; flow: OtpFlow };

// Everything an order screen needs to know about the order's state.
export function useOrderState(order: Order) {
  const tx = useT();
  const usd = useMoney().format;
  const waiting = order.status === "waiting";
  const { text, fraction } = useCountdown(order.expiresAt, waiting, order.startedAt);
  const stages = [
    { label: tx("Paid"), done: true },
    { label: tx("Number delivered"), done: true },
    { label: order.status === "cancelled" ? tx("Cancelled · refunded") : order.status === "expired" ? tx("Expired · refunded") : tx("Waiting for SMS"), done: !waiting, active: waiting },
    { label: tx("Code received"), done: order.status === "received" },
  ];
  const paid = `${usd(order.offer.price)}${order.paidWith ? ` · ${tx(order.paidWith[0].toUpperCase() + order.paidWith.slice(1))}` : ""}`;
  // Some providers send the whole SMS, not just the code: show long ones as a message.
  const longCode = (order.code?.length ?? 0) > 12;
  return { waiting, received: order.status === "received", cancelled: order.status === "cancelled" || order.status === "expired", expired: order.status === "expired", text, fraction, stages, paid, longCode };
}

// Cancel with a one-step inline confirmation: the button turns into "Cancel this number? / Keep waiting".
// `tone` picks the look of the idle button; the confirm row is the same everywhere.
export function CancelButton({ order, flow, tone = "outline", full = false, className = "" }: OrderViewProps & { tone?: "outline" | "soft" | "ghost" | "onDark"; full?: boolean; className?: string }) {
  const tx = useT();
  const usd = useMoney().format;
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => { if (!confirming) return; const t = setTimeout(() => setConfirming(false), 6000); return () => clearTimeout(t); }, [confirming]);
  if (order.status !== "waiting") return null;

  const doCancel = async () => {
    setBusy(true); setError(null);
    try {
      await Promise.all([flow.cancel(order.id), new Promise((r) => setTimeout(r, 600))]);
    } catch (e) {
      setError(errorText(e, tx, usd));
    } finally {
      setBusy(false); setConfirming(false);
    }
  };
  const idle = {
    outline: "text-rose-600 ring-1 ring-rose-200 hover:bg-rose-50 dark:text-rose-300 dark:ring-rose-500/30 dark:hover:bg-rose-500/10",
    soft: "bg-rose-50 text-rose-700 hover:bg-rose-100 dark:bg-rose-500/10 dark:text-rose-300 dark:hover:bg-rose-500/20",
    ghost: "text-slate-500 hover:bg-rose-50 hover:text-rose-600 dark:text-slate-400 dark:hover:bg-rose-500/10 dark:hover:text-rose-300",
    onDark: "bg-white/10 text-white ring-1 ring-white/20 hover:bg-rose-500/80 hover:ring-rose-400",
  }[tone];

  if (confirming || busy) {
    return (
      <div role="alertdialog" aria-label={tx("Cancel this number?")} className={`flex animate-fade-up flex-wrap items-center gap-2 [animation-duration:200ms] ${full ? "w-full" : ""} ${className}`}>
        <span className={`text-sm ${tone === "onDark" ? "text-white/80" : "text-slate-600 dark:text-slate-300"} ${full ? "w-full" : ""}`}>
          {tx("Cancel this number?")}{" "}<b className={tone === "onDark" ? "text-white" : "text-slate-900 dark:text-white"}>{usd(order.offer.price)}</b>{" "}{tx("goes back to your wallet.")}
        </span>
        <button onClick={doCancel} disabled={busy} className={`flex items-center justify-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:opacity-70 ${full ? "flex-1" : ""}`}>
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4" />}{busy ? tx("Cancelling…") : tx("Yes, cancel")}
        </button>
        <button onClick={() => setConfirming(false)} disabled={busy} className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${tone === "onDark" ? "text-white hover:bg-white/10" : "text-slate-700 ring-1 ring-slate-200 hover:ring-slate-300 dark:text-slate-200 dark:ring-white/15"} ${full ? "flex-1" : ""}`}>{tx("Keep waiting")}</button>
      </div>
    );
  }
  return (
    <>
    <button onClick={() => setConfirming(true)} className={`flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition ${idle} ${full ? "w-full" : ""} ${className}`}>
      <X className="h-4 w-4" />{tx("Cancel & refund")}
    </button>
    {error && <p role="alert" className={`text-sm ${tone === "onDark" ? "text-rose-200" : "text-rose-600 dark:text-rose-300"} ${full ? "w-full" : ""}`}>{error}</p>}
    </>
  );
}

// Shown in place of the code once the order is cancelled.
export function RefundNote({ order, className = "" }: { order: Order; className?: string }) {
  const tx = useT();
  const usd = useMoney().format;
  if (order.status !== "cancelled" && order.status !== "expired") return null;
  return (
    <div className={`flex animate-fade-up items-center gap-3 rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800 [animation-duration:300ms] dark:bg-emerald-500/10 dark:text-emerald-200 ${className}`}>
      <RotateCcw className="h-4 w-4 shrink-0" /><span>{order.status === "expired" ? tx("No code arrived in time.") : tx("Cancelled.")}{" "}<b>{usd(order.offer.price)}</b>{" "}{tx("is back in your wallet.")}</span>
    </div>
  );
}
