"use client";
import { useId, type ReactNode } from "react";
import { BadgeCheck, Ban, Check, Download, FolderPlus, Mic, Smile, Sparkles, Upload } from "lucide-react";
import { useMoney } from "@/lib/money";
import { perMonth, premiumCompare, premiumFeatures, premiumPlans, premiumSaving } from "@/content/telegram-en";
import { accent, card, SumRows, type PremiumState } from "./parts";
import { useT } from "@/i18n/client";

// Pieces used only by the Premium offers.

export const featureIcons: Record<string, typeof Ban> = { ads: Ban, upload: Upload, speed: Download, voice: Mic, limits: FolderPlus, emoji: Smile, stories: Sparkles, badge: BadgeCheck };

// Plans as radio cards. `layout="row"` is a compact segmented row.
// `still` drops the hover lift and the settle animation on the chosen plan (pages whose only motion is elsewhere).
export function PlanRadios({ pm, layout = "cards", legend = "How long?", dark = false, still = false }: { pm: PremiumState; layout?: "cards" | "row" | "list"; legend?: string; dark?: boolean; still?: boolean }) {
  const usd = useMoney().format;
  const t = useT();
  legend = t(legend);
  const name = useId();
  const text = dark ? "text-white" : "text-slate-900 dark:text-white";
  const sub = dark ? "text-white/70" : "text-slate-600 dark:text-slate-400";
  return (
    <fieldset>
      <legend className={`text-base font-semibold ${text}`}>{legend}</legend>
      <div className={`mt-3 grid gap-2.5 ${layout === "list" ? "" : "grid-cols-3"} ${layout === "cards" ? "sm:gap-4" : ""}`}>
        {t.tr(premiumPlans).map((p) => {
          const on = pm.plan.months === p.months;
          const save = premiumSaving(p);
          return (
            <label key={p.months} className={`relative flex cursor-pointer rounded-2xl border-2 transition-colors duration-200 has-[:focus-visible]:ring-2 ${still ? "" : `hover:-translate-y-0.5 transition ${on ? "animate-pop shadow-lg shadow-violet-600/20" : ""}`} ${still ? "has-[:focus-visible]:ring-emerald-400 has-[:focus-visible]:ring-offset-[#140a2a]" : "has-[:focus-visible]:ring-violet-500"} has-[:focus-visible]:ring-offset-2
              ${layout === "list" ? "items-center justify-between gap-3 px-4 py-3.5" : layout === "row" ? "flex-col items-center px-2 py-3 text-center" : "flex-col p-4 sm:p-5"}
              ${on ? `${t.tr(accent).premium.border} ${dark ? "bg-white/10" : "bg-violet-50 dark:bg-violet-400/10"}` : dark ? "border-white/20 hover:border-white/50" : "border-slate-200 hover:border-slate-400 dark:border-white/15 dark:hover:border-white/40"}`}>
              <input type="radio" name={name} checked={on} onChange={() => pm.setPlan(p)} className="sr-only" />
              {p.tag && layout !== "list" && <span className={`absolute -top-2.5 start-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-bold rtl:translate-x-1/2 ${p.months === 12 ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white" : "bg-slate-900 text-white dark:bg-white dark:text-slate-900"}`}>{p.tag}</span>}
              {layout === "list" ? (
                <>
                  <span className="flex items-center gap-3">
                    <span aria-hidden className={`grid h-5 w-5 place-items-center rounded-full border-2 ${on ? "border-violet-600 bg-violet-600 dark:border-violet-400 dark:bg-violet-400" : "border-slate-400"}`}>{on && <Check className="h-3 w-3 text-white" strokeWidth={3} />}</span>
                    <span><span className={`block font-semibold ${text}`}>{p.label}{p.tag && <span className={`ms-2 text-xs font-bold ${t.tr(accent).premium.text}`}>{p.tag}</span>}</span><span className={`text-sm ${sub}`}>{usd(perMonth(p))}{" "}{t("a month")}{save > 0 && ` · save ${save}%`}</span></span>
                  </span>
                  <span className={`font-display text-lg font-bold ${text}`}>{usd(p.price)}</span>
                </>
              ) : (
                <>
                  <span className={`font-semibold ${text} ${layout === "row" ? "text-sm" : ""}`}>{p.label}</span>
                  <span className={`font-display font-bold ${text} ${layout === "row" ? "text-lg" : "mt-2 text-2xl sm:text-3xl"}`}>{usd(p.price)}</span>
                  <span className={`text-xs sm:text-sm ${sub}`}>{usd(perMonth(p))}{t("/mo")}</span>
                  {layout === "cards" && <span className={`mt-3 self-start rounded-full px-2 py-0.5 text-xs font-semibold ${save > 0 ? t.tr(accent).premium.soft : "invisible"}`}>{t("Save")}{" "}{save}%</span>}
                </>
              )}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

export function FeatureGrid({ cols = 4, dark = false, limit }: { cols?: 2 | 4; dark?: boolean; limit?: number }) {
  const t = useT();
  return (
    <ul className={`grid gap-4 sm:grid-cols-2 ${cols === 4 ? "lg:grid-cols-4" : ""}`}>
      {t.tr(premiumFeatures).slice(0, limit).map((f) => {
        const I = featureIcons[f.id];
        return (
          <li key={f.id} className={dark ? "rounded-3xl border border-white/10 bg-white/5 p-5" : `${card} p-5`}>
            <span aria-hidden className={`grid h-10 w-10 place-items-center rounded-xl ${dark ? "bg-white/10 text-fuchsia-200" : t.tr(accent).premium.soft}`}><I className="h-5 w-5" /></span>
            <h3 className={`mt-4 font-semibold ${dark ? "text-white" : "text-slate-900 dark:text-white"}`}>{f.title}</h3>
            <p className={`mt-1 text-[15px] ${dark ? "text-white/70" : "text-slate-600 dark:text-slate-400"}`}>{f.text}</p>
          </li>
        );
      })}
    </ul>
  );
}

export function FeatureList({ dense = false }: { dense?: boolean }) {
  const t = useT();
  return (
    <ul className={dense ? "grid gap-2 sm:grid-cols-2" : "space-y-3"}>
      {t.tr(premiumFeatures).map((f) => <li key={f.id} className="flex gap-2.5 text-[15px] text-slate-700 dark:text-slate-300"><Check aria-hidden className={`mt-0.5 h-5 w-5 shrink-0 ${t.tr(accent).premium.text}`} /><span><strong className="font-semibold text-slate-900 dark:text-white">{f.title}</strong>{!dense && <> · {f.text}</>}</span></li>)}
    </ul>
  );
}

export function CompareRows() {
  const t = useT();
  return (
    <>
      {t.tr(premiumCompare).map((r) => (
        <tr key={r.label}>
          <th scope="row" className="px-4 py-3.5 text-start font-medium text-slate-700 dark:text-slate-300">{r.label}</th>
          <td className="px-4 py-3.5 text-center text-slate-600 dark:text-slate-400">{r.free === "—" ? <><span aria-hidden>—</span><span className="sr-only">{t("No")}</span></> : r.free}</td>
          <td className="bg-violet-50/70 px-4 py-3.5 text-center font-semibold text-slate-900 dark:bg-violet-400/10 dark:text-white">{r.premium}</td>
        </tr>
      ))}
    </>
  );
}

export function PremiumSummary({ pm, children }: { pm: PremiumState; children?: ReactNode }) {
  const usd = useMoney().format;
  const t = useT();
  return (
    <section aria-labelledby="pm-sum" className={`${card} p-6`}>
      <h2 id="pm-sum" className="font-display text-lg font-semibold text-slate-900 dark:text-white">{t("Your order")}</h2>
      <div className="mt-3"><SumRows rows={[[t("Plan"), t("Premium · {0}", { 0: pm.plan.label })], [t("To"), pm.r.user ? `@${pm.r.user.username}` : "—"], [t("Per month"), usd(perMonth(pm.plan))], [t("Activation"), t("A few minutes")]]} /></div>
      <div aria-live="polite" className="mt-3 flex items-baseline justify-between border-t border-slate-200 pt-4 dark:border-white/10"><span className="text-slate-600 dark:text-slate-400">{t("Total")}</span><span className="font-display text-2xl font-bold text-slate-900 dark:text-white">{usd(pm.total)}</span></div>
      {children}
    </section>
  );
}

export const BuyPremium = ({ pm, className = "", label }: { pm: PremiumState; className?: string; label?: string }) => {
  const usd = useMoney().format;
  const t = useT();
  return (
  <button type="button" onClick={pm.proceed} className={`${t.tr(accent).premium.btn} w-full ${className}`}>{label ?? t("Get Premium for {0}", { 0: pm.plan.label })} · {usd(pm.total)}</button>
);
};
