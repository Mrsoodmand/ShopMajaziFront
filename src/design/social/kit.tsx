"use client";
import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "@/i18n/Link";
import { Check, ChevronRight, Instagram, Music2, Send, ShieldCheck, X, Youtube, type LucideIcon } from "lucide-react";
import CheckoutModal, { type PayMethod } from "@/components/checkout/CheckoutModal";
import { useMoney } from "@/lib/money";
import {
  handleOf, servicesOf, socialFaq, socialPlatforms, socialRules, socialServices, targets,
  type SocialPlatform, type SocialService, type SocialTier,
} from "@/content/social-en";
import { field, primary, ring, secondary as secondaryBtn } from "../googleVoice/clean";
import { H2, SumRows } from "../telegram/parts";
import { useHasExtras } from "../service/slot";
import { useT } from "@/i18n/client";

// Pieces shared by the Social media services page offers. Same purchase pattern as every product page: choices on
// the start side, the order summary with the green Continue on the end side. Real radio groups in fieldsets,
// labelled fields with hints and errors tied to them, focus moved to the first problem on Continue.

export { ring, field, primary, secondaryBtn };
export const card = "rounded-3xl border border-slate-200 bg-white dark:border-white/15 dark:bg-[#0E1424]";
const fmt = (n: number) => n.toLocaleString("en-US");

// ---------- Look per platform ----------
// Each platform colours only its icon tile, selection borders, links and (in offer A) the band.

export const look: Record<SocialPlatform, { Icon: LucideIcon; tile: string; text: string; border: string; dot: string; band: string; soft: string }> = {
  telegram: { Icon: Send, tile: "bg-sky-500 text-white", text: "text-sky-700 dark:text-sky-300", border: "border-sky-600 dark:border-sky-400", dot: "bg-sky-600 dark:bg-sky-400", soft: "bg-sky-50 dark:bg-sky-400/10", band: "linear-gradient(135deg,#082f49 0%,#0369a1 55%,#0ea5e9 100%)" },
  instagram: { Icon: Instagram, tile: "bg-[linear-gradient(45deg,#f59e0b,#ec4899_50%,#8b5cf6)] text-white", text: "text-pink-700 dark:text-pink-300", border: "border-pink-600 dark:border-pink-400", dot: "bg-pink-600 dark:bg-pink-400", soft: "bg-pink-50 dark:bg-pink-400/10", band: "linear-gradient(135deg,#581c87 0%,#be185d 55%,#f59e0b 100%)" },
  youtube: { Icon: Youtube, tile: "bg-red-600 text-white", text: "text-red-700 dark:text-red-300", border: "border-red-600 dark:border-red-400", dot: "bg-red-600 dark:bg-red-400", soft: "bg-red-50 dark:bg-red-400/10", band: "linear-gradient(135deg,#450a0a 0%,#991b1b 55%,#ef4444 100%)" },
  tiktok: { Icon: Music2, tile: "bg-slate-950 text-white ring-1 ring-inset ring-white/15", text: "text-teal-700 dark:text-teal-300", border: "border-slate-900 dark:border-teal-300", dot: "bg-slate-900 dark:bg-teal-300", soft: "bg-slate-100 dark:bg-teal-300/10", band: "linear-gradient(135deg,#020617 0%,#134e4a 60%,#be123c 100%)" },
};

export function PlatformIcon({ p, size = "md", className = "" }: { p: SocialPlatform; size?: "sm" | "md" | "lg" | "xl"; className?: string }) {
  const { Icon, tile } = look[p];
  const s = size === "xl" ? "h-20 w-20 rounded-3xl [&>svg]:h-10 [&>svg]:w-10" : size === "lg" ? "h-14 w-14 rounded-2xl [&>svg]:h-7 [&>svg]:w-7" : size === "sm" ? "h-8 w-8 rounded-lg [&>svg]:h-4 [&>svg]:w-4" : "h-11 w-11 rounded-xl [&>svg]:h-5 [&>svg]:w-5";
  return <span aria-hidden className={`grid shrink-0 place-items-center ${tile} ${s} ${className}`}><Icon /></span>;
}

// ---------- State ----------

export type Problem = "link" | "qty" | null;

function presetsFor(s: SocialService) {
  return [100, 500, 1000, 2500, 5000, 10000, 25000, 50000, 100000].filter((n) => n >= s.min && n <= s.max).slice(0, 6);
}
const startQty = (s: SocialService) => Math.min(s.max, Math.max(s.min, 1000));

export function durationLabel(tx: ReturnType<typeof useT>, minutes: number) {
  if (minutes < 60) return tx("under an hour");
  const h = Math.round(minutes / 60);
  if (h < 24) return h === 1 ? tx("about 1 hour") : tx("about {0} hours", { 0: h });
  const d = Math.ceil(minutes / 1440);
  return d === 1 ? tx("about 1 day") : tx("about {0} days", { 0: d });
}

export type SocialOrder = { service: SocialService; tier: SocialTier; qty: number; link: string; total: number; paidWith: PayMethod; at: number };

export function useSocial(initial: SocialPlatform = "telegram") {
  const tx = useT();
  const [platform, setP] = useState<SocialPlatform>(initial);
  const [serviceId, setServiceId] = useState(servicesOf(initial)[0].id);
  const service = socialServices.find((s) => s.id === serviceId)!;
  const [tierId, setTierId] = useState<SocialTier["id"]>("standard");
  const tier = service.tiers.find((t) => t.id === tierId)!;
  const [qty, setQtyRaw] = useState(startQty(service));
  const [qtyTouched, setQtyTouched] = useState(false);
  const [link, setLink] = useState("");
  const [linkTouched, setLinkTouched] = useState(false);
  const [tried, setTried] = useState(false);
  const [payOpen, setPayOpen] = useState(false);
  const [order, setOrder] = useState<SocialOrder | null>(null);

  const setService = (id: string) => {
    const next = socialServices.find((s) => s.id === id)!;
    if (next.target !== service.target) { setLink(""); setLinkTouched(false); }
    setServiceId(id);
    setP(next.platform);
    if (qty < next.min || qty > next.max) setQtyRaw(startQty(next));
  };
  const setPlatform = (p: SocialPlatform) => { if (p !== platform) setService(servicesOf(p)[0].id); };
  const setQty = (n: number) => setQtyRaw(Math.max(0, Math.min(service.max * 10, Math.round(n) || 0)));

  const target = targets[service.target];
  const linkError = !link.trim() ? tx("Paste the link so we know where to deliver") : !target.test.test(link.trim()) ? tx(target.wrong) : undefined;
  const qtyError = qty < service.min ? tx("The minimum for this service is {0}", { 0: fmt(service.min) }) : qty > service.max ? tx("The most per order is {0}. Place a second order for more.", { 0: fmt(service.max) }) : undefined;
  const valid = !linkError && !qtyError;
  const total = Math.round(tier.per1k * qty / 10) / 100;
  const deliverMinutes = (Math.max(qty, 1) / service.perDay) * 1440;
  const problem: Problem = linkError ? "link" : qtyError ? "qty" : null;
  const blocker = tried && problem ? (problem === "link" ? (link.trim() ? tx("Check the link above") : tx("Add the link above to continue")) : tx("Check the amount above")) : undefined;

  const focusProblem = (p: Problem = problem) => {
    const id = p === "link" ? "social-link" : "social-qty";
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
    el?.focus({ preventScroll: true });
  };
  const proceed = () => {
    setTried(true); setLinkTouched(true); setQtyTouched(true);
    if (problem) { focusProblem(); return false; }
    setPayOpen(true);
    return true;
  };
  const buy = (m: PayMethod) => { setOrder({ service, tier, qty, link: link.trim(), total, paidWith: m, at: Date.now() }); setPayOpen(false); window.scrollTo({ top: 0, behavior: "smooth" }); };

  return {
    platform, setPlatform, service, setService, tier, setTier: setTierId, qty, setQty, presets: presetsFor(service),
    link, setLink, touchLink: () => setLinkTouched(true), target, handle: handleOf(link),
    linkError: linkTouched ? linkError : undefined, qtyError: qtyTouched || tried ? qtyError : undefined, touchQty: () => setQtyTouched(true),
    valid, total, deliverMinutes, problem, blocker, proceed, focusProblem,
    payOpen, closePay: () => setPayOpen(false), buy, order, reset: () => setOrder(null),
  };
}
export type Social = ReturnType<typeof useSocial>;

// ---------- Choices ----------

export const optionBase = `relative flex cursor-pointer rounded-2xl border-2 bg-white p-4 transition-colors dark:bg-white/[.03] has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-emerald-600 has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-white dark:has-[:focus-visible]:ring-emerald-400 dark:has-[:focus-visible]:ring-offset-[#0E1424]`;
export const optionOff = "border-slate-200 hover:border-slate-300 dark:border-white/15 dark:hover:border-white/30";

export function Dot({ on, p }: { on: boolean; p: SocialPlatform }) {
  return (
    <span aria-hidden className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 ${on ? `${look[p].border} ${look[p].dot}` : "border-slate-300 dark:border-white/30"}`}>
      {on && <Check className="h-3 w-3 text-white dark:text-slate-950" strokeWidth={3} />}
    </span>
  );
}

export function Legend({ children, hint, className = "" }: { children: ReactNode; hint?: ReactNode; className?: string }) {
  return <legend className={`text-base font-semibold text-slate-900 dark:text-white ${className}`}>{children}{hint && <span className="block text-sm font-normal text-slate-600 dark:text-slate-400">{hint}</span>}</legend>;
}

// Platform as four tiles (radios).
export function PlatformTiles({ s, legend = "Platform", cols = "grid-cols-2 sm:grid-cols-4" }: { s: Social; legend?: string; cols?: string }) {
  const tx = useT();
  return (
    <fieldset>
      <Legend>{tx(legend)}</Legend>
      <div className={`mt-3 grid gap-3 ${cols}`}>
        {socialPlatforms.map((p) => {
          const on = s.platform === p.id;
          return (
            <label key={p.id} className={`${optionBase} flex-col items-start gap-3 ${on ? look[p.id].border : optionOff}`}>
              <input type="radio" name="social-platform" value={p.id} checked={on} onChange={() => s.setPlatform(p.id)} className="sr-only" />
              <span className="flex w-full items-start justify-between gap-2"><PlatformIcon p={p.id} /><Dot on={on} p={p.id} /></span>
              <span className="font-semibold text-slate-900 dark:text-white">{tx(p.name)}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

// Service as option cards with the price per 1,000.
export function ServiceRadios({ s, legend = "Service", cols = "sm:grid-cols-3", list }: { s: Social; legend?: string; cols?: string; list?: SocialService[] }) {
  const usd = useMoney().format;
  const tx = useT();
  const items = list ?? servicesOf(s.platform);
  return (
    <fieldset>
      <Legend>{tx(legend)}</Legend>
      <div className={`mt-3 grid gap-3 ${cols}`}>
        {items.map((x) => {
          const on = s.service.id === x.id;
          return (
            <label key={x.id} className={`${optionBase} flex-col gap-1 ${on ? look[x.platform].border : optionOff}`}>
              <input type="radio" name="social-service" value={x.id} checked={on} onChange={() => s.setService(x.id)} className="sr-only" />
              <span className="flex items-start justify-between gap-2"><span className="font-semibold text-slate-900 dark:text-white">{tx(x.name)}</span><Dot on={on} p={x.platform} /></span>
              <span className="text-sm text-slate-600 dark:text-slate-400">{tx(x.desc)}</span>
              <span className="mt-1 text-sm font-semibold tabular-nums text-slate-900 dark:text-white">{tx("from {0} / 1,000", { 0: usd(x.tiers[0].per1k) })}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

export function refillLabel(tx: ReturnType<typeof useT>, days: number) {
  return days ? tx("Free refill for {0} days", { 0: days }) : tx("No refill");
}

export function TierRadios({ s, legend = "Quality" }: { s: Social; legend?: string }) {
  const usd = useMoney().format;
  const tx = useT();
  return (
    <fieldset>
      <Legend>{tx(legend)}</Legend>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {s.service.tiers.map((t) => {
          const on = s.tier.id === t.id;
          return (
            <label key={t.id} className={`${optionBase} gap-3 ${on ? look[s.platform].border : optionOff}`}>
              <input type="radio" name="social-tier" value={t.id} checked={on} onChange={() => s.setTier(t.id)} className="sr-only" />
              <Dot on={on} p={s.platform} />
              <span className="min-w-0 flex-1">
                <span className="flex items-baseline justify-between gap-2"><span className="font-semibold text-slate-900 dark:text-white">{tx(t.name)}</span><span className="font-display font-bold tabular-nums text-slate-900 dark:text-white">{usd(t.per1k)}<span className="text-sm font-normal text-slate-600 dark:text-slate-400"> / 1,000</span></span></span>
                <span className="block text-sm text-slate-600 dark:text-slate-400">{tx(t.desc)}</span>
                <span className={`mt-1 block text-sm font-medium ${t.refillDays ? "text-emerald-800 dark:text-emerald-300" : "text-slate-600 dark:text-slate-400"}`}>{refillLabel(tx, t.refillDays)}</span>
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

export function FieldError({ id, children }: { id: string; children?: ReactNode }) {
  const tx = useT();
  if (!children) return null;
  return <p id={id} className="mt-1 flex items-start gap-1.5 text-sm font-semibold text-red-700 dark:text-red-400"><X aria-hidden className="mt-0.5 h-4 w-4 shrink-0" /><span><span className="sr-only">{tx("Error:")}{" "}</span>{children}</span></p>;
}
export const bad = "!border-red-700 focus-visible:!ring-red-600 dark:!border-red-400 dark:focus-visible:!ring-red-400";

// Amount as preset chips (radios) plus any amount.
export function QuantityPicker({ s, legend = "How many?" }: { s: Social; legend?: string }) {
  const usd = useMoney().format;
  const tx = useT();
  const custom = !s.presets.includes(s.qty);
  const e = s.qtyError;
  return (
    <fieldset>
      <Legend hint={tx("Between {0} and {1} {2} per order.", { 0: fmt(s.service.min), 1: fmt(s.service.max), 2: tx(s.service.unit) })}>{tx(legend)}</Legend>
      <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-6">
        {s.presets.map((n) => {
          const on = s.qty === n;
          return (
            <label key={n} className={`${optionBase} flex-col items-center !p-3 text-center ${on ? look[s.platform].border : optionOff}`}>
              <input type="radio" name="social-qty-preset" checked={on} onChange={() => s.setQty(n)} className="sr-only" />
              <span className="font-display font-bold tabular-nums text-slate-900 dark:text-white">{fmt(n)}</span>
              <span className="text-xs tabular-nums text-slate-600 dark:text-slate-400">{usd(Math.round(s.tier.per1k * n / 10) / 100)}</span>
            </label>
          );
        })}
      </div>
      <div className="mt-4">
        <label htmlFor="social-qty" className="text-sm font-semibold text-slate-900 dark:text-white">{tx("Or enter an amount")}</label>
        <FieldError id="social-qty-error">{e}</FieldError>
        <input id="social-qty" type="number" inputMode="numeric" min={s.service.min} max={s.service.max} value={s.qty || ""} onChange={(x) => s.setQty(+x.target.value)} onBlur={s.touchQty}
          aria-invalid={!!e} aria-describedby={e ? "social-qty-error" : undefined}
          className={`${field} mt-2 tabular-nums ${custom && !e ? look[s.platform].border : ""} ${e ? bad : ""}`} />
      </div>
    </fieldset>
  );
}

// The one thing we need from the buyer: a public link. Never a password.
export function LinkField({ s, big = false }: { s: Social; big?: boolean }) {
  const tx = useT();
  const t = s.target;
  const e = s.linkError;
  return (
    <div>
      <label htmlFor="social-link" className="text-base font-semibold text-slate-900 dark:text-white">{tx(t.label)}</label>
      <p id="social-link-hint" className="text-sm text-slate-600 dark:text-slate-400">{tx(t.hint)}</p>
      <FieldError id="social-link-error">{e}</FieldError>
      <input id="social-link" value={s.link} onChange={(x) => s.setLink(x.target.value)} onBlur={s.touchLink} placeholder={t.placeholder} autoComplete="off" autoCapitalize="none" spellCheck={false} inputMode="url"
        aria-invalid={!!e} aria-describedby={["social-link-hint", e && "social-link-error"].filter(Boolean).join(" ")}
        className={`${field} mt-2 ${big ? "py-4 text-lg" : ""} ${e ? bad : ""}`} />
      <p className="mt-2 flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400"><ShieldCheck aria-hidden className="h-4 w-4 shrink-0 text-emerald-700 dark:text-emerald-400" />{tx("We never ask for your password or a login code.")}</p>
    </div>
  );
}

// ---------- Summary ----------

export function SocialSummary({ s, children, className = card, head }: { s: Social; children?: ReactNode; className?: string; head?: ReactNode }) {
  const usd = useMoney().format;
  const tx = useT();
  return (
    <div className={`${className} p-6`}>
      {head}
      <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-white">{tx("Your order")}</h2>
      <div className="mt-4 flex items-center gap-3">
        <PlatformIcon p={s.platform} />
        <span className="min-w-0"><span className="block truncate font-semibold text-slate-900 dark:text-white">{tx(s.service.name)}</span><span className="block truncate text-sm text-slate-600 dark:text-slate-400">{tx(socialPlatforms.find((p) => p.id === s.platform)!.name)} · {tx(s.tier.name)}</span></span>
      </div>
      <div className="mt-3">
        <SumRows rows={[
          [tx("To"), s.link.trim() && !s.linkError ? <span dir="ltr">{s.link.trim().replace(/^https?:\/\/(www\.)?/, "")}</span> : "—"],
          [tx("Amount"), <span className="tabular-nums">{s.qty ? `${fmt(s.qty)} ${tx(s.service.unit)}` : "—"}</span>],
          [tx("Starts"), tx(s.service.startsIn)],
          [tx("Done in"), durationLabel(tx, s.deliverMinutes)],
          [tx("Refill"), s.tier.refillDays ? tx("{0} days", { 0: s.tier.refillDays }) : tx("None")],
        ]} />
      </div>
      <div className="mt-2 flex items-baseline justify-between border-t border-slate-200 pt-4 dark:border-white/10">
        <span className="font-semibold text-slate-900 dark:text-white">{tx("Total")}</span>
        <span className="font-display text-2xl font-bold tabular-nums text-slate-900 dark:text-white">{s.qty ? usd(s.total) : "—"}</span>
      </div>
      {children ?? <SummaryActions s={s} />}
    </div>
  );
}

export function SummaryActions({ s }: { s: Social }) {
  const usd = useMoney().format;
  const tx = useT();
  return (
    <>
      <button type="submit" className={`${primary} mt-5 w-full tabular-nums`}>{s.qty && !s.qtyError ? `${tx("Continue")} · ${usd(s.total)}` : tx("Continue")}</button>
      {s.blocker && <p role="alert" className="mt-3 flex items-start justify-center gap-1.5 text-center text-sm font-semibold text-red-700 dark:text-red-400"><X aria-hidden className="mt-0.5 h-4 w-4 shrink-0" />{s.blocker}</p>}
      <p className="mt-3 text-center text-sm text-slate-600 dark:text-slate-400">{tx("Pay with your wallet, card or crypto on the next step.")}</p>
    </>
  );
}

// A form, so Enter in any field works like Continue.
export function SocialForm({ s, className, children, onSubmit }: { s: Social; className?: string; children: ReactNode; onSubmit?: () => void }) {
  return <form noValidate onSubmit={(e) => { e.preventDefault(); (onSubmit ?? s.proceed)(); }} className={className}>{children}</form>;
}

// ---------- Phones: jump to the summary ----------

export function useJump(dep?: unknown) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, [dep]);
  const go = () => { ref.current?.scrollIntoView({ behavior: "smooth", block: "center" }); ref.current?.querySelector<HTMLButtonElement>("button[type=submit]")?.focus({ preventScroll: true }); };
  return { ref, inView, go };
}

export function JumpBar({ s, inView, go }: { s: Social; inView: boolean; go: () => void }) {
  const usd = useMoney().format;
  const tx = useT();
  return (
    <div className={`fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white px-4 py-3 shadow-[0_-8px_24px_-12px_rgba(0,0,0,.25)] transition-transform duration-300 lg:hidden dark:border-white/10 dark:bg-[#0E1424] ${inView ? "translate-y-full" : "translate-y-0"}`} aria-hidden={inView} inert={inView}>
      <div className="mx-auto flex max-w-xl items-center justify-between gap-4">
        <span className="min-w-0">
          <span className="block truncate text-sm text-slate-600 dark:text-slate-400">{s.qty ? `${fmt(s.qty)} ${tx(s.service.unit)}` : tx(s.service.name)}</span>
          <span className="font-display text-xl font-bold tabular-nums text-slate-900 dark:text-white">{s.qty ? usd(s.total) : "—"}</span>
        </span>
        <button type="button" onClick={go} className={`rounded-xl border border-slate-300 px-4 py-2.5 font-semibold text-slate-900 dark:border-white/20 dark:text-white ${ring}`}>{tx("Review order")}</button>
      </div>
    </div>
  );
}

// ---------- Payment and after ----------

export function SocialCheckout({ s }: { s: Social }) {
  const tx = useT();
  return (
    <CheckoutModal open={s.payOpen} onClose={s.closePay} price={s.total} itemLabel={`${fmt(s.qty)} ${tx(s.service.unit)}`} onPay={s.buy}
      note={tx("Starts {0}. If the link is private or wrong, the order is cancelled and refunded.", { 0: tx(s.service.startsIn) })}
      summary={<><PlatformIcon p={s.platform} /><div className="min-w-0 flex-1"><div className="truncate font-semibold text-slate-900 dark:text-white">{fmt(s.qty)}{" "}{tx(s.service.unit)} · {tx(s.tier.name)}</div><div dir="ltr" className="truncate text-xs text-slate-500 dark:text-slate-400">{s.link.trim()}</div></div></>} />
  );
}

export function SocialOrderView({ o, onAgain }: { o: SocialOrder; onAgain: () => void }) {
  const usd = useMoney().format;
  const tx = useT();
  const steps = [tx("Payment received"), tx("Link checked"), tx("Delivering {0}", { 0: `${fmt(o.qty)} ${tx(o.service.unit)}` }), tx("Done")];
  const [done, setDone] = useState(1);
  // Placeholder progress: the link check passes, then delivery is under way (it takes hours, so it stays there).
  useEffect(() => { if (done >= 2) return; const t = setTimeout(() => setDone((d) => d + 1), 2000); return () => clearTimeout(t); }, [done]);
  return (
    <div className="mx-auto max-w-2xl animate-fade-up">
      <p className="flex items-center gap-2 font-semibold text-emerald-800 dark:text-emerald-300"><Check aria-hidden className="h-5 w-5" />{tx("Payment received ·")}{" "}{usd(o.total)}</p>
      <h1 aria-live="polite" className="mt-3 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">{done >= 2 ? tx("Your order has started") : tx("Checking your link")}</h1>
      <p className="mt-2 text-slate-700 dark:text-slate-300">{tx("Delivery takes {0}. Keep the account public and the username unchanged until it's done.", { 0: durationLabel(tx, (o.qty / o.service.perDay) * 1440) })}</p>
      <div className={`${card} mt-6 flex items-center gap-4 p-5`}>
        <PlatformIcon p={o.service.platform} />
        <div className="min-w-0 flex-1"><div className="truncate font-semibold text-slate-900 dark:text-white">{fmt(o.qty)}{" "}{tx(o.service.unit)} · {tx(o.tier.name)}</div><div dir="ltr" className="truncate text-start text-sm text-slate-600 dark:text-slate-400">{o.link}</div></div>
      </div>
      <ol className="mt-6 space-y-3">
        {steps.map((st, i) => {
          const state = i < done ? "done" : i === done ? "now" : "wait";
          return (
            <li key={i} className={`${card} flex items-center gap-3 p-4`}>
              <span aria-hidden className={`grid h-8 w-8 shrink-0 place-items-center rounded-full ${state === "done" ? "bg-emerald-700 text-white dark:bg-emerald-400 dark:text-emerald-950" : state === "now" ? "border-2 border-sky-700 dark:border-sky-400" : "border-2 border-slate-300 dark:border-white/20"}`}>
                {state === "done" ? <Check className="h-4 w-4" /> : state === "now" ? <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-sky-700 dark:bg-sky-400" /> : null}
              </span>
              <span className="text-slate-900 dark:text-white">{st}<span className="sr-only">{state === "done" ? tx(", done") : state === "now" ? tx(", in progress") : tx(", waiting")}</span></span>
            </li>
          );
        })}
      </ol>
      {o.tier.refillDays > 0 && <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">{tx("If the count drops in the next {0} days, press Refill on the order and we top it up for free.", { 0: o.tier.refillDays })}</p>}
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/dashboard/orders" className={primary}>{tx("View in my orders")}</Link>
        <button onClick={onAgain} className={`inline-flex items-center justify-center rounded-xl border border-slate-300 px-6 py-3.5 font-semibold text-slate-800 hover:bg-slate-50 dark:border-white/20 dark:text-slate-100 dark:hover:bg-white/5 ${ring}`}>{tx("Place another order")}</button>
      </div>
    </div>
  );
}

// ---------- Below the purchase ----------

export function SocialRules({ className = "", items = socialRules }: { className?: string; items?: { title: string; text: string }[] }) {
  const tx = useT();
  return (
    <section aria-labelledby="social-rules" className={className}>
      <H2 id="social-rules">{tx("Before you order")}</H2>
      <ul className="mt-6 grid gap-x-10 gap-y-6 sm:grid-cols-2">
        {tx.tr(items).map((r) => (
          <li key={r.title} className="border-t border-slate-200 pt-4 dark:border-white/10">
            <h3 className="font-display text-lg font-semibold text-slate-900 dark:text-white">{r.title}</h3>
            <p className="mt-1 text-[15px] leading-7 text-slate-700 dark:text-slate-300">{r.text}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

// `items`: a live service's own questions (admin › service › FAQ); the general ones otherwise.
export function SocialFaq({ items }: { items?: { q: string; a: string }[] }) {
  const tx = useT();
  return (
    <div className={`${card} divide-y divide-slate-200 dark:divide-white/10`}>
      {(items ?? tx.tr(socialFaq)).map((f) => (
        <details key={f.q} className="group p-5 [&_summary::-webkit-details-marker]:hidden">
          <summary className={`flex cursor-pointer list-none items-center justify-between gap-4 rounded-lg font-semibold text-slate-900 dark:text-white ${ring}`}>{f.q}<ChevronRight aria-hidden className="h-4 w-4 shrink-0 text-slate-500 transition group-open:rotate-90 rtl:rotate-180 rtl:group-open:rotate-90" /></summary>
          <p className="mt-3 text-[15px] leading-7 text-slate-700 dark:text-slate-300">{f.a}</p>
        </details>
      ))}
    </div>
  );
}

// Rules, then the FAQ when the shared service sections aren't attached.
export function SocialBelow() {
  const tx = useT();
  const extras = useHasExtras();
  return (
    <div className="mx-auto max-w-6xl space-y-16 px-4 pb-28 pt-16 sm:px-6">
      <SocialRules />
      {!extras && <section aria-labelledby="social-faq" className="max-w-3xl"><H2 id="social-faq">{tx("Common questions")}</H2><div className="mt-6"><SocialFaq /></div></section>}
    </div>
  );
}
