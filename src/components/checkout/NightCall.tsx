"use client";

import { useId } from "react";
import { PhoneCall, X } from "lucide-react";
import { useT } from "@/i18n/client";

// «آیا از ساعت ۲۱ تا ۷ صبح برای تماس در دسترس هستید؟» (design checkout-night-call A · Segmented). Asked in the
// order form of products that support delivers by hand (social services, subscriptions); the answer goes into the
// buy / cart body as `night_call` (Laravel saves it on the order: orders.night_call). `value` null = not answered.
export const nightCallBody = (v: boolean | null): { night_call?: 0 | 1 } => (v === null ? {} : { night_call: v ? 1 : 0 });

export default function NightCallQuestion({ value, onChange, error, id = "night-call", className = "" }: {
  value: boolean | null; onChange: (v: boolean) => void; error?: string; id?: string; className?: string;
}) {
  const t = useT();
  const name = useId();
  return (
    <fieldset className={className} aria-describedby={error ? `${id}-error` : undefined}>
      <legend className="sr-only">{t("Can support call you between 9 pm and 7 am?")}</legend>
      <p aria-hidden className="flex items-center gap-2 text-base font-semibold text-slate-900 dark:text-white"><PhoneCall className="h-4 w-4 shrink-0 text-indigo-600 dark:text-indigo-400" />{t("Can support call you between 9 pm and 7 am?")}</p>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{t("If something about your order needs a quick answer.")}</p>
      {error && <p id={`${id}-error`} className="mt-1 flex items-start gap-1.5 text-sm font-semibold text-red-700 dark:text-red-400"><X aria-hidden className="mt-0.5 h-4 w-4 shrink-0" />{error}</p>}
      <div className={`mt-3 grid grid-cols-2 rounded-2xl bg-slate-100 p-1 dark:bg-white/[.06] ${error ? "ring-2 ring-red-700 dark:ring-red-400" : ""}`}>
        {([true, false] as const).map((v) => (
          <label key={String(v)} className={`cursor-pointer rounded-xl px-4 py-2.5 text-center text-[15px] font-semibold transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-emerald-600 ${value === v ? "bg-white text-slate-900 shadow dark:bg-white/15 dark:text-white" : "text-slate-600 dark:text-slate-300"}`}>
            <input id={v ? id : undefined} type="radio" name={name} className="sr-only" checked={value === v} onChange={() => onChange(v)} />
            {v ? t("Yes, call me") : t("No, daytime only")}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
