"use client";
import { Minus, Plus } from "lucide-react";
import { socialHeadings, socialPlatforms, servicesOf, type SocialPlatform } from "@/content/social-en";
import { useMoney } from "@/lib/money";
import { PageShell } from "../otp/parts";
import { Trust } from "../telegram/parts";
import { card, durationLabel, field, LinkField, look, PlatformIcon, ring, SocialBelow, SocialCheckout, SocialForm, SocialOrderView, SocialSummary, TierRadios, useJump, useSocial, JumpBar, type Social } from "./kit";
import { useT } from "@/i18n/client";

// Social E — "Delivery Timeline": starts with how many and how long. Platform and service are two plain dropdowns;
// the amount is one big number with − / + and a slider, and a timeline under it shows when delivery starts, when
// it's done at the service's daily speed, and how long the free refill covers. The one motion moment: the delivery
// stretch grows or shrinks when the amount changes. Plain site theme, summary and Continue in the sidebar.

const fmt = (n: number) => n.toLocaleString("en-US");
const select = `${field} appearance-none bg-[url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='%2364748b'%3E%3Cpath d='M5.3 7.3a1 1 0 0 1 1.4 0L10 10.6l3.3-3.3a1 1 0 1 1 1.4 1.4l-4 4a1 1 0 0 1-1.4 0l-4-4a1 1 0 0 1 0-1.4z'/%3E%3C/svg%3E")] bg-[length:1.25rem] bg-[position:right_0.75rem_center] bg-no-repeat pe-10 rtl:bg-[position:left_0.75rem_center]`;

// Slider on a log scale, so 100 and 50,000 are both easy to reach.
const toSlider = (s: Social, n: number) => Math.round((Math.log(Math.max(n, s.service.min) / s.service.min) / Math.log(s.service.max / s.service.min)) * 1000);
const fromSlider = (s: Social, v: number) => {
  const n = s.service.min * Math.pow(s.service.max / s.service.min, v / 1000);
  const step = n >= 10000 ? 1000 : n >= 1000 ? 100 : 10;
  return Math.min(s.service.max, Math.max(s.service.min, Math.round(n / step) * step));
};

function Amount({ s }: { s: Social }) {
  const tx = useT();
  const step = s.qty >= 10000 ? 1000 : s.qty >= 1000 ? 100 : 50;
  const e = s.qtyError;
  const btn = `grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-slate-300 text-slate-800 transition-colors hover:bg-slate-50 disabled:opacity-40 dark:border-white/20 dark:text-slate-100 dark:hover:bg-white/5 ${ring}`;
  return (
    <div>
      <label htmlFor="social-qty" className="text-base font-semibold text-slate-900 dark:text-white">{tx("How many {0}?", { 0: tx(s.service.unit) })}</label>
      <p id="social-qty-hint" className="text-sm text-slate-600 dark:text-slate-400">{tx("Between {0} and {1} per order.", { 0: fmt(s.service.min), 1: fmt(s.service.max) })}</p>
      {e && <p id="social-qty-error" className="mt-1 text-sm font-semibold text-red-700 dark:text-red-400"><span className="sr-only">{tx("Error:")}{" "}</span>{e}</p>}
      <div className="mt-3 flex items-center gap-3">
        <button type="button" aria-label={tx("Fewer")} disabled={s.qty <= s.service.min} onClick={() => s.setQty(Math.max(s.service.min, s.qty - step))} className={btn}><Minus aria-hidden className="h-5 w-5" /></button>
        <input id="social-qty" type="number" inputMode="numeric" value={s.qty || ""} onChange={(x) => s.setQty(+x.target.value)} onBlur={s.touchQty}
          aria-invalid={!!e} aria-describedby={["social-qty-hint", e && "social-qty-error"].filter(Boolean).join(" ")}
          className={`min-w-0 flex-1 rounded-xl border bg-white px-4 py-2 text-center font-display text-4xl font-bold tabular-nums text-slate-900 sm:text-5xl dark:bg-white/5 dark:text-white ${e ? "border-red-700 dark:border-red-400" : "border-slate-300 dark:border-white/20"} ${ring}`} />
        <button type="button" aria-label={tx("More")} disabled={s.qty >= s.service.max} onClick={() => s.setQty(Math.min(s.service.max, s.qty + step))} className={btn}><Plus aria-hidden className="h-5 w-5" /></button>
      </div>
      <label htmlFor="social-qty-range" className="sr-only">{tx("Amount slider")}</label>
      <input id="social-qty-range" type="range" min={0} max={1000} value={toSlider(s, s.qty)} onChange={(x) => s.setQty(fromSlider(s, +x.target.value))} aria-valuetext={`${fmt(s.qty)} ${tx(s.service.unit)}`}
        className={`mt-5 w-full cursor-pointer accent-emerald-700 dark:accent-emerald-400 ${ring} rounded`} />
      <div aria-hidden className="mt-1 flex justify-between text-xs tabular-nums text-slate-600 dark:text-slate-400"><span>{fmt(s.service.min)}</span><span>{fmt(s.service.max)}</span></div>
    </div>
  );
}

// When it starts, when it's done, and how long drops are refilled, on one bar. The bar is a picture; the same facts
// are in the list under it.
function Timeline({ s }: { s: Social }) {
  const tx = useT();
  // Log-weighted stretches: a 30-day refill would otherwise flatten a 5-hour delivery to nothing.
  const w = (m: number) => Math.log1p(m);
  const start = w(s.service.startMinutes);
  const deliver = w(Math.max(s.deliverMinutes, 30));
  const refill = s.tier.refillDays ? w(s.tier.refillDays * 1440) : (start + deliver) * 0.15;
  const span = start + deliver + refill;
  const pct = (x: number) => `${Math.min(100, (x / span) * 100)}%`;
  const L = look[s.platform];
  return (
    <section aria-labelledby="tl-h" className="rounded-2xl border border-slate-200 p-5 dark:border-white/10">
      <h3 id="tl-h" className="font-semibold text-slate-900 dark:text-white">{tx("What happens after you pay")}</h3>
      <div aria-hidden className="relative mt-5 h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
        <div className="absolute inset-y-0 start-0 bg-slate-300 dark:bg-white/25" style={{ width: pct(start) }} />
        <div className={`absolute inset-y-0 ${L.dot} transition-[width] duration-500 ease-out`} style={{ insetInlineStart: pct(start), width: `calc(${pct(start + deliver)} - ${pct(start)})` }} />
        {s.tier.refillDays > 0 && <div className="absolute inset-y-0 end-0 bg-[repeating-linear-gradient(135deg,rgba(4,120,87,.35)_0_6px,transparent_6px_12px)] transition-[inset] duration-500 ease-out dark:bg-[repeating-linear-gradient(135deg,rgba(52,211,153,.4)_0_6px,transparent_6px_12px)]" style={{ insetInlineStart: pct(start + deliver) }} />}
      </div>
      <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
        <div className="flex items-start gap-2"><span aria-hidden className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-slate-300 dark:bg-white/25" /><span><dt className="text-slate-600 dark:text-slate-400">{tx("Starts")}</dt><dd className="font-semibold text-slate-900 dark:text-white">{tx(s.service.startsIn)}</dd></span></div>
        <div className="flex items-start gap-2"><span aria-hidden className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${L.dot}`} /><span><dt className="text-slate-600 dark:text-slate-400">{tx("Delivered in")}</dt><dd className="font-semibold text-slate-900 dark:text-white">{durationLabel(tx, s.deliverMinutes)}<span className="block font-normal text-slate-600 dark:text-slate-400">{tx("{0} a day", { 0: fmt(s.service.perDay) })}</span></dd></span></div>
        <div className="flex items-start gap-2"><span aria-hidden className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-emerald-700/50 dark:bg-emerald-400/50" /><span><dt className="text-slate-600 dark:text-slate-400">{tx("Refill")}</dt><dd className="font-semibold text-slate-900 dark:text-white">{s.tier.refillDays ? tx("{0} days after delivery", { 0: s.tier.refillDays }) : tx("None for this service")}</dd></span></div>
      </dl>
    </section>
  );
}

export default function SocialE() {
  const usd = useMoney().format;
  const tx = useT();
  const s = useSocial();
  const jump = useJump(s.order);
  if (s.order) return <PageShell><div className="px-6 py-14"><SocialOrderView o={s.order} onAgain={s.reset} /></div></PageShell>;
  return (
    <PageShell>
      <div className="mx-auto max-w-6xl px-4 pt-12 sm:px-6">
        <h1 className="text-balance font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl dark:text-white">{tx(socialHeadings.h1)}</h1>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-700 sm:text-lg dark:text-slate-300">{tx(socialHeadings.sub)}</p>
        <div className="mt-5"><Trust items={[tx("No password needed"), tx("Starts in minutes"), tx("Refund if it can't start")]} /></div>
      </div>
      <div id="buy" className="mx-auto mt-10 max-w-6xl scroll-mt-24 px-4 sm:px-6">
        <SocialForm s={s} className="grid grid-cols-[minmax(0,1fr)] gap-x-10 gap-y-10 lg:grid-cols-[minmax(0,1fr)_360px]">
          <section aria-label={tx("Choose")} className={`${card} min-w-0 space-y-8 p-6 sm:p-8`}>
            <div className="grid gap-4 sm:grid-cols-[auto_1fr_1fr] sm:items-end">
              <PlatformIcon key={s.platform} p={s.platform} size="lg" className="hidden animate-pop sm:grid" />
              <div>
                <label htmlFor="social-platform" className="text-base font-semibold text-slate-900 dark:text-white">{tx("Platform")}</label>
                <select id="social-platform" value={s.platform} onChange={(e) => s.setPlatform(e.target.value as SocialPlatform)} className={`${select} mt-2`}>
                  {socialPlatforms.map((p) => <option key={p.id} value={p.id}>{tx(p.name)}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="social-service" className="text-base font-semibold text-slate-900 dark:text-white">{tx("Service")}</label>
                <select id="social-service" value={s.service.id} onChange={(e) => s.setService(e.target.value)} className={`${select} mt-2`}>
                  {servicesOf(s.platform).map((x) => <option key={x.id} value={x.id}>{tx(x.name)} · {tx("from {0} / 1,000", { 0: usd(x.tiers[0].per1k) })}</option>)}
                </select>
              </div>
            </div>
            <TierRadios s={s} />
            <Amount s={s} />
            <Timeline s={s} />
            <LinkField s={s} />
          </section>
          <aside aria-label={tx("Your order")}>
            <div ref={jump.ref} className="lg:sticky lg:top-24"><SocialSummary s={s} /></div>
          </aside>
        </SocialForm>
      </div>
      <SocialBelow />
      <JumpBar s={s} inView={jump.inView} go={jump.go} />
      <SocialCheckout s={s} />
    </PageShell>
  );
}
