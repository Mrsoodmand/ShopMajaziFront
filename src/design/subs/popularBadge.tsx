"use client";
import { useId, useState } from "react";
import { Star } from "lucide-react";
import { MoneyProvider, useMoney } from "@/lib/money";
import { LocaleProvider, useT } from "@/i18n/client";
import { PopularBadge, PopularBand } from "./parts";
import { planTones, PLAN_TONE } from "./planSelect";

// The «محبوب‌ترین» badge on a plan row that also shows a business (organisation) price: the crossed-out list price
// and the company price leave little room, so the badge moves out of the price's way. Gallery section
// "subs-popular-badge" shows each way on sample rows of panel J with a 10% company discount.
// now: the pill beside the name (today). tab (A): the pill on the row's top border, over the name.
// tabEnd (D): the same pill on the top border at the price's side. folder (E): a gold tab joined to the row's top
// corner like a folder tab. band (F): a thin gold strip along the top inside the row.
type Style = "now" | "tab" | "tabEnd" | "folder" | "band";

const gold = "bg-gradient-to-l from-amber-300 to-yellow-200 text-amber-950";

const sample = [
  { id: "1", name: "1 month", price: 5040400 },
  { id: "3", name: "3 months", price: 13441150, popular: true },
  { id: "6", name: "6 months", price: 25202000 },
];

// Extra room the popular row needs for each placement.
const room: Record<Style, string> = { now: "", tab: "!mt-4 pt-3", tabEnd: "!mt-4 pt-3", folder: "!mt-6 rounded-ss-none", band: "pt-7" };

function Badge({ style }: { style: Style }) {
  const t = useT();
  const label = <><Star aria-hidden className="h-3 w-3 fill-amber-600 text-amber-600" />{t("Most popular plan")}</>;
  if (style === "now") return <PopularBadge />;
  if (style === "tab") return <PopularBadge className="absolute -top-2.5 start-3" />;
  if (style === "tabEnd") return <PopularBadge className="absolute -top-2.5 end-3" />;
  if (style === "folder")
    return <span className={`absolute -start-px bottom-full inline-flex items-center gap-1 whitespace-nowrap rounded-t-md px-2.5 py-0.5 text-[11px] font-bold leading-4 ${gold}`}>{label}</span>;
  return <PopularBand />;
}

function Demo({ style }: { style: Style }) {
  const t = useT();
  const usd = useMoney().format;
  const name = useId();
  const [picked, setPicked] = useState("3");
  const c = planTones[PLAN_TONE];
  return (
    <div className="mx-auto w-full max-w-sm rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/15 dark:bg-[#0E1424]">
      <fieldset>
        <legend className="text-sm font-semibold text-slate-900 dark:text-white">{t("Plan")}</legend>
        <div className="mt-2 space-y-1.5">
          {sample.map((pl) => {
            const on = picked === pl.id;
            const inline = style === "now";
            return (
              <label key={pl.id} className={`relative flex min-h-10 cursor-pointer items-center justify-between gap-3 rounded-lg border px-3 py-2 text-sm transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-violet-600 ${pl.popular ? room[style] : ""} ${on ? c.row : "border-slate-200 text-slate-700 hover:border-slate-400 dark:border-white/15 dark:text-slate-300 dark:hover:border-white/40"}`}>
                <input type="radio" name={name} checked={on} onChange={() => setPicked(pl.id)} className="sr-only" />
                {pl.popular && !inline && <Badge style={style} />}
                <span className="flex min-w-0 items-center gap-2"><span className="truncate font-semibold">{t(pl.name)}</span>{pl.popular && inline && <Badge style="now" />}</span>
                <span className={`whitespace-nowrap tabular-nums ${on ? c.price : "text-slate-500 dark:text-slate-400"}`}>
                  <s className="me-1.5 text-[0.8em] font-normal opacity-60">{usd(pl.price)}</s>{usd(pl.price - Math.round(pl.price * 10 / 100))}
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>
    </div>
  );
}

const Fa = ({ style }: { style: Style }) => <LocaleProvider locale="fa"><div dir="rtl"><MoneyProvider currency="toman"><Demo style={style} /></MoneyProvider></div></LocaleProvider>;
export const PopularBadgeNow = () => <Fa style="now" />;
export const PopularBadgeTab = () => <Fa style="tab" />;
export const PopularBadgeTabEnd = () => <Fa style="tabEnd" />;
export const PopularBadgeFolder = () => <Fa style="folder" />;
export const PopularBadgeBand = () => <Fa style="band" />;
