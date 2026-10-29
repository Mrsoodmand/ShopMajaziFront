"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { OtpFlow } from "../otp/flow";
import { AppTile } from "../otp/parts";
import { useT } from "@/i18n/client";

// Earlier numbers beside the order screen: the five newest (orders without a number are left out), with
// "Show all" for the rest. Each row opens that order; its state is a small coloured label.
export function RecentNumbers({ flow }: { flow: OtpFlow }) {
  const t = useT();
  const [all, setAll] = useState(false);
  const list = flow.orders.filter((o) => o.number && o.number !== "—");
  if (list.length < 2) return null;
  const shown = all ? list : list.slice(0, 5);
  const label = { waiting: t("Waiting"), cancelled: t("Cancelled"), expired: t("Expired"), received: "" };
  const tone = {
    waiting: "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-200",
    received: "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-200",
    cancelled: "bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-slate-300",
    expired: "bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-slate-300",
  };
  return (
    <section aria-labelledby="recent-h" className="rounded-3xl bg-white p-4 ring-1 ring-slate-200 dark:bg-[#0E1424] dark:ring-white/10">
      <h2 id="recent-h" className="px-1 pb-2 font-display text-sm font-semibold text-slate-900 dark:text-white">{t("Recent numbers")}</h2>
      <ul className="space-y-1">
        {shown.map((o) => {
          const on = flow.order?.id === o.id;
          return (
            <li key={o.id}>
              <button type="button" onClick={() => flow.showOrder(o.id)} aria-current={on ? "true" : undefined}
                className={`flex w-full items-center gap-3 rounded-xl px-2 py-2 text-start text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 ${on ? "bg-indigo-50 dark:bg-indigo-500/10" : "hover:bg-slate-50 dark:hover:bg-white/5"}`}>
                <AppTile app={o.offer.app} size="sm" />
                <span dir="ltr" className="min-w-0 flex-1 truncate font-mono text-slate-800 dark:text-slate-200">{o.number}</span>
                <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ${tone[o.status]}`}>
                  {o.status === "received" ? (o.code && o.code.length <= 12 ? <span dir="ltr" className="font-mono">{o.code}</span> : t("Code received")) : label[o.status]}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      {list.length > 5 && (
        <button type="button" onClick={() => setAll((a) => !a)} aria-expanded={all}
          className="mt-2 flex w-full items-center justify-center gap-1 rounded-xl py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 dark:text-indigo-300 dark:hover:bg-indigo-500/10">
          {all ? t("Show less") : t("Show all ({0})", { 0: list.length })}<ChevronDown aria-hidden className={`h-4 w-4 transition-transform ${all ? "rotate-180" : ""}`} />
        </button>
      )}
    </section>
  );
}
