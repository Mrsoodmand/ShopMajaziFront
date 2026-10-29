"use client";

import { Smartphone, Globe2, ArrowLeftRight, Check, Radio, ShieldCheck } from "lucide-react";
import type { OtpOperator } from "@/content/otp-en";
import { useMoney } from "@/lib/money";
import type { First, OtpFlow } from "./flow";
import { AppTile, SuccessBar } from "./parts";
import { useT } from "@/i18n/client";

// "Start with: App | Country" switch.
export function FirstSwitch({ value, onChange, className = "" }: { value: First; onChange: (f: First) => void; className?: string }) {
  const t = useT();
  return (
    <div role="radiogroup" aria-label={t("Start with")} className={`inline-flex items-center gap-1 rounded-2xl bg-white p-1 ring-1 ring-slate-200 dark:bg-white/5 dark:ring-white/10 ${className}`}>
      <span className="px-2 text-xs font-medium text-slate-500 dark:text-slate-400">{t("Start with")}</span>
      {([["app", t("App"), Smartphone], ["country", t("Country"), Globe2]] as const).map(([id, label, Icon]) => (
        <button key={id} role="radio" aria-checked={value === id} onClick={() => onChange(id)}
          className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-sm font-medium transition ${value === id ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900" : "text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"}`}>
          <Icon className="h-4 w-4" />{label}
        </button>
      ))}
    </div>
  );
}

// Swap button for layouts that show app and country side by side.
export function SwapButton({ flow }: { flow: OtpFlow }) {
  const t = useT();
  return (
    <button onClick={() => flow.setFirst(flow.first === "app" ? "country" : "app")} aria-label={t("Swap: choose the other one first")} title={t("Choose country first / app first")}
      className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white text-slate-600 shadow-sm ring-1 ring-slate-200 transition duration-300 hover:rotate-180 hover:text-indigo-600 dark:bg-white/10 dark:text-slate-300 dark:ring-white/10">
      <ArrowLeftRight className="h-4 w-4" />
    </button>
  );
}

// Operator choices for the picked app + country. "Any operator" is recommended.
export function OperatorList({ ops, value, onPick, onBuy }: { ops: OtpOperator[]; value: string | null; onPick: (id: string) => void; onBuy?: (op: OtpOperator) => void }) {
  const t = useT();
  const usd = useMoney().format;
  return (
    <div role="radiogroup" aria-label={t("Operator")} className="grid gap-2 sm:grid-cols-2">
      {ops.map((o) => {
        const on = o.id === value;
        return (
          <button key={o.id} role="radio" aria-checked={on} onClick={() => onPick(o.id)} onDoubleClick={() => onBuy?.(o)}
            className={`relative flex items-center gap-3 rounded-2xl p-4 text-start ring-1 transition duration-200 ${on ? "bg-indigo-50 ring-2 ring-indigo-500 dark:bg-indigo-500/10" : "bg-white ring-slate-200 hover:ring-slate-300 dark:bg-white/[.03] dark:ring-white/10 dark:hover:ring-white/25"}`}>
            <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${o.recommended ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300" : "bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-300"}`}>
              {o.recommended ? <ShieldCheck className="h-5 w-5" /> : <Radio className="h-5 w-5" />}
            </span>
            <span className="min-w-0 flex-1">
              <span className="flex flex-wrap items-center gap-x-2 gap-y-1 font-semibold text-slate-900 dark:text-white">{o.name}{o.recommended && <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">{t("Recommended")}</span>}</span>
              {(o.success != null || o.stock != null) && <span className="mt-1 flex items-center gap-3"><SuccessBar pct={o.success} />{o.stock != null && <span className="text-xs text-slate-500 dark:text-slate-400">{o.stock.toLocaleString("en-US")}{" "}{t("left")}</span>}</span>}
            </span>
            <span className="shrink-0 whitespace-nowrap font-display text-lg font-bold text-slate-900 dark:text-white">{usd(o.price)}</span>
            {on && <span className="absolute -end-1.5 -top-1.5 grid h-5 w-5 place-items-center rounded-full bg-indigo-600 text-white"><Check className="h-3 w-3" /></span>}
          </button>
        );
      })}
    </div>
  );
}
// The screen shown after buying: order screen A ("Number Hero", chosen in /design/page-otp-order), used by every page design.
export { default as OrderView } from "./order-screen/OrderA";

// Compact list of earlier orders, to jump back to one.
// `min`: how many orders before it shows (on the order screen the current one is already shown, so 2).
export function RecentOrders({ flow, min = 2 }: { flow: OtpFlow; min?: number }) {
  const t = useT();
  if (flow.orders.length < min) return null;
  const status = { waiting: t("Waiting"), cancelled: t("Cancelled"), expired: t("Expired"), received: "" };
  return (
    <div className="rounded-3xl bg-white p-4 ring-1 ring-slate-200 dark:bg-[#0E1424] dark:ring-white/10">
      <div className="px-1 pb-2 text-sm font-semibold text-slate-900 dark:text-white">{t("Recent numbers")}</div>
      <ul className="space-y-1">
        {flow.orders.map((o) => (
          <li key={o.id}>
            <button onClick={() => flow.showOrder(o.id)} className={`flex w-full items-center gap-3 rounded-xl px-2 py-2 text-start text-sm transition hover:bg-slate-50 dark:hover:bg-white/5 ${flow.order?.id === o.id ? "bg-indigo-50 dark:bg-indigo-500/10" : ""}`}>
              <AppTile app={o.offer.app} size="sm" /><span className="flex-1 truncate font-mono text-slate-700 dark:text-slate-200">{o.number}</span>
              <span className={`text-xs font-semibold ${o.status === "received" ? "text-emerald-600" : o.status === "waiting" ? "text-amber-600" : "text-slate-400"}`}>{o.status === "received" ? <span dir="ltr" className="inline-block max-w-[9rem] truncate align-bottom">{o.code}</span> : status[o.status]}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
