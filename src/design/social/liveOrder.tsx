"use client";

import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import Link from "@/i18n/Link";
import { Check, ShieldCheck, X } from "lucide-react";
import CheckoutModal, { type PayMethod } from "@/components/checkout/CheckoutModal";
import { accountApi, ApiError, TOP_UP_HREF, useAccount } from "@/lib/account";
import { useMoney } from "@/lib/money";
import { formatNum } from "@/i18n/translate";
import { useT } from "@/i18n/client";
import { PLATFORM_BRAND, type ApiServiceOrder, type LiveField, type LiveService } from "@/lib/social";
import type { SocialCategory } from "@/content/social-categories-en";
import type { SocialPlatform } from "@/content/social-en";
import { SumRows } from "../telegram/parts";
import { CategoryLogo } from "./listKit";
import { bad, card, field, FieldError, Legend, look, optionBase, optionOff, PlatformIcon, primary, ring } from "./kit";
import type { LiveSocialOrder } from "./live";

// The live order page's state and parts (/virtual-service/{platform}): the platform's services as the admin set
// them up (React admin › Virtual services), each with fixed packages or any count in steps of 500, plus the
// service's own order fields. Paying goes through the backend (Api\StorefrontAccountController services/*): wallet
// right away, card via the bank, which sends the buyer back with ?pay=…&order=…. Same look as the design's parts in
// kit.tsx; the platform's colour comes from the admin.

// ---------- Platform colour ----------

export type Tone = { border: string; dot: string; band: string; vars?: CSSProperties };

// The four platforms the design drew keep their drawn colours until the admin picks another.
export function toneOf(c: SocialCategory): Tone {
  const drawn = look[c.slug as SocialPlatform];
  if (drawn && c.color.toLowerCase() === PLATFORM_BRAND[c.slug]) return { border: drawn.border, dot: drawn.dot, band: drawn.band };
  return {
    border: "border-[color-mix(in_oklab,var(--brand)_80%,black)] dark:border-[color-mix(in_oklab,var(--brand)_55%,white)]",
    dot: "border-[color-mix(in_oklab,var(--brand)_80%,black)] bg-[color-mix(in_oklab,var(--brand)_80%,black)] dark:border-[color-mix(in_oklab,var(--brand)_55%,white)] dark:bg-[color-mix(in_oklab,var(--brand)_55%,white)]",
    band: `linear-gradient(135deg, color-mix(in oklab, ${c.color} 30%, #020617) 0%, color-mix(in oklab, ${c.color} 80%, black) 55%, ${c.color} 100%)`,
    vars: { "--brand": c.color } as CSSProperties,
  };
}

// The platform's mark: the design's drawn icon for the four it knows (unless the admin uploaded a logo), else the
// admin's logo or a letter tile in its colour.
export function LiveMark({ c, size = "md", className = "" }: { c: SocialCategory; size?: "sm" | "md" | "lg" | "xl"; className?: string }) {
  if (!c.logo && look[c.slug as SocialPlatform]) return <PlatformIcon p={c.slug as SocialPlatform} size={size} className={className} />;
  return <CategoryLogo c={c} size={size} className={className} />;
}

function Dot({ on, tone }: { on: boolean; tone: Tone }) {
  return (
    <span aria-hidden className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 ${on ? `${tone.border} ${tone.dot}` : "border-slate-300 dark:border-white/30"}`}>
      {on && <Check className="h-3 w-3 text-white dark:text-slate-950" strokeWidth={3} />}
    </span>
  );
}

// ---------- State ----------

type CountPricing = NonNullable<LiveService["count"]>;
const PRESETS = [100, 500, 1000, 2500, 5000, 10000, 25000, 50000, 100000];
// The minimum first, then the usual sizes that fit the service's range and step.
const countPresets = (c: CountPricing) => [...new Set([c.min, ...PRESETS.filter((n) => n > c.min && n <= c.max && n % c.step === 0)])].slice(0, 6);
// The nearest allowed amount: a multiple of the step, within min and max.
const nearest = (c: CountPricing, n: number) => Math.min(c.max, Math.max(c.min, Math.round(n / c.step) * c.step));
const validCount = (c: CountPricing, n: number) => n >= c.min && n <= c.max && n % c.step === 0;
const startCount = (s?: LiveService) => (s?.count ? nearest(s.count, 1000) : 0);
const countPrice = (c: CountPricing, n: number) => Math.floor(n / c.step) * c.price;
// Packages: the 1,000 one when there is one (the size most people buy), else the smallest.
const startPlan = (s?: LiveService) => (s && s.plans.length ? (s.plans.find((p) => p.count === 1000) ?? s.plans[0]).id : null);

export type Notice = { good: boolean; text: string };

export function useLiveOrder(d: LiveSocialOrder) {
  const tx = useT();
  const num = (n: number) => formatNum(n, tx.locale);
  const { setWallet } = useAccount();
  const first = d.services.find((s) => s.slug === d.initialService) ?? d.services[0];
  const [serviceId, setServiceId] = useState(first?.id);
  const service = d.services.find((s) => s.id === serviceId) ?? first;
  const [planId, setPlanId] = useState(startPlan(first));
  const [qty, setQtyRaw] = useState(startCount(first));
  const [values, setValues] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [tried, setTried] = useState(false);
  const [payOpen, setPayOpen] = useState(false);
  const [order, setOrder] = useState<ApiServiceOrder | null>(null);
  const [notice, setNotice] = useState<Notice | null>(null);
  // Prices the backend corrected at payment (rates moved since the page loaded), per choice.
  const [corrected, setCorrected] = useState<Record<string, number>>({});
  const [changedTo, setChangedTo] = useState<number | null>(null);

  const setService = (id: number) => {
    const next = d.services.find((s) => s.id === id);
    if (!next || id === serviceId) return;
    setServiceId(id);
    setPlanId(startPlan(next));
    if (next.count) setQtyRaw((q) => (validCount(next.count!, q) ? q : startCount(next)));
    setChangedTo(null);
    // Answers stay for fields both services share (most ask for the same link).
  };
  const setQty = (n: number) => setQtyRaw(Math.max(0, Math.min(10_000_000, Math.round(n) || 0)));

  const plan = service?.plans.find((p) => p.id === planId) ?? null;
  const count = service?.count ? qty : plan?.count ?? 0;
  const key = service ? `${service.id}:${service.count ? qty : planId}` : "";
  const base = !service ? 0 : service.count ? countPrice(service.count, qty) : plan?.price ?? 0;
  const total = corrected[key] ?? base;

  const qtyError = !service?.count ? undefined
    : qty < service.count.min ? tx("The minimum for this service is {0}", { 0: num(service.count.min) })
    : qty > service.count.max ? tx("The most per order is {0}. Place a second order for more.", { 0: num(service.count.max) })
    : qty % service.count.step ? tx("Use a multiple of {0}, like {1}", { 0: num(service.count.step), 1: num(nearest(service.count, qty)) })
    : undefined;
  const value = (f: LiveField) => (values[f.name] ?? "").trim();
  const fieldError = (f: LiveField): string | undefined => {
    const v = value(f);
    if (f.kind === "select") return f.options.includes(v) ? undefined : tx("Choose {0}", { 0: f.title });
    if (!v) return tx("Enter {0}", { 0: f.title });
    if (v.length < 3) return tx("{0} needs at least 3 characters", { 0: f.title });
    if (v.length > 150) return tx("{0} can be at most 150 characters", { 0: f.title });
    return undefined;
  };
  const fields = service?.fields ?? [];
  const firstBadField = fields.find((f) => fieldError(f));
  const problem = qtyError ? "qty" : firstBadField ? firstBadField.name : null;
  const blocker = tried && problem ? (problem === "qty" ? tx("Check the amount above") : tx("Fill in {0} above", { 0: firstBadField!.title })) : undefined;
  const target = fields.find((f) => f.link && value(f) && !fieldError(f));

  const focusProblem = () => {
    const el = document.getElementById(problem === "qty" ? "social-qty" : `social-f-${problem}`);
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
    el?.focus({ preventScroll: true });
  };
  const proceed = () => {
    setTried(true);
    if (!service || d.error) return false;
    if (problem) { focusProblem(); return false; }
    setPayOpen(true);
    return true;
  };

  const show = (o: ApiServiceOrder) => { setOrder(o); setPayOpen(false); window.scrollTo({ top: 0, behavior: "smooth" }); };

  const buy = async (m: PayMethod) => {
    if (!service) return;
    const body = {
      service_id: service.id,
      ...(service.count ? { count: qty } : { plan_id: planId }),
      fields: Object.fromEntries(fields.map((f) => [f.name, value(f)])),
      price: total,
    };
    try {
      if (m === "card") {
        const r = await accountApi<{ url: string }>("services/pay-card", { ...body, return: window.location.pathname });
        window.location.assign(r.url);
        return new Promise<void>(() => {}); // the page is leaving; keep the modal busy
      }
      const r = await accountApi<{ order: ApiServiceOrder; wallet: number }>("services/buy", body);
      setWallet(r.wallet);
      show(r.order);
    } catch (e) {
      if (e instanceof ApiError) {
        if (typeof e.data?.wallet === "number") setWallet(e.data.wallet);
        if (e.code === "price_changed" && typeof e.data?.price === "number") {
          const p = e.data.price;
          setCorrected((c) => ({ ...c, [key]: p }));
          setChangedTo(p);
        }
      }
      throw e; // the modal shows why
    }
  };

  // Back from the bank: show the order, or what happened. Then clean the address so a reload doesn't repeat it.
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const pay = q.get("pay");
    const id = q.get("order");
    if (!pay) return;
    q.delete("pay"); q.delete("order");
    window.history.replaceState(null, "", window.location.pathname + (q.size ? `?${q}` : "") + window.location.hash);
    if (pay === "ok" && id) {
      accountApi<{ order: ApiServiceOrder; wallet: number }>(`services/orders/${id}`)
        .then((r) => { setWallet(r.wallet); show(r.order); })
        .catch(() => setNotice({ good: true, text: tx("Payment received. You'll find the order in your orders.") }));
    } else {
      setNotice(pay === "cancelled"
        ? { good: false, text: tx("Payment cancelled. Nothing was charged.") }
        : { good: false, text: tx("The payment didn't go through. If money left your account, the bank returns it within 72 hours.") });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // While support works on it, check every 30 seconds so the page follows along without a reload.
  const followId = order && (order.status === "queued" || order.status === "in_progress") ? order.id : undefined;
  useEffect(() => {
    if (!followId) return;
    const timer = setInterval(() => {
      accountApi<{ order: ApiServiceOrder; wallet: number }>(`services/orders/${followId}`)
        .then((r) => setOrder((o) => (o && o.id === r.order.id ? r.order : o)))
        .catch(() => {}); // try again on the next tick
    }, 30000);
    return () => clearInterval(timer);
  }, [followId]);

  return {
    d, tone: toneOf(d.platform), service, setService, plan, setPlan: setPlanId, qty, setQty, count, total, changedTo,
    presets: service?.count ? countPresets(service.count) : [],
    values, setValue: (name: string, v: string) => setValues((x) => ({ ...x, [name]: v })),
    touch: (name: string) => setTouched((t) => ({ ...t, [name]: true })),
    errorOf: (f: LiveField) => (tried || touched[f.name] ? fieldError(f) : undefined),
    qtyError: tried || touched.qty ? qtyError : undefined,
    target, problem, blocker, proceed, num,
    payOpen, closePay: () => setPayOpen(false), buy, order, notice,
    reset: () => { setOrder(null); setTried(false); setTouched({}); setNotice(null); },
  };
}
export type LiveOrder = ReturnType<typeof useLiveOrder>;

// ---------- Choices ----------

export function LiveServiceRadios({ o }: { o: LiveOrder }) {
  const tx = useT();
  const money = useMoney();
  return (
    <fieldset>
      <Legend>{`${o.d.platform.name} · ${tx("Service")}`}</Legend>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {o.d.services.map((x) => {
          const on = o.service?.id === x.id;
          // One line under the name: the admin's "feature" note (e.g. "no login needed"), when it has one.
          const kind = x.notes.find((n) => /خصوصیت|ویژگی|feature/i.test(n.label));
          return (
            <label key={x.id} className={`${optionBase} flex-col gap-1 ${on ? o.tone.border : optionOff}`}>
              <input type="radio" name="social-service" value={x.id} checked={on} onChange={() => o.setService(x.id)} className="sr-only" />
              <span className="flex items-start justify-between gap-2"><span className="font-semibold text-slate-900 dark:text-white">{x.name}</span><Dot on={on} tone={o.tone} /></span>
              {kind && kind.value !== x.name && <span className="text-sm text-slate-600 dark:text-slate-400">{kind.value}</span>}
              <span className="mt-1 text-sm font-semibold tabular-nums text-slate-900 dark:text-white">{tx("from {0} / 1,000", { 0: money.format(x.per1000) })}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

// Packages as chips, or (any-amount services) preset chips plus any amount in the service's steps (500).
export function LiveAmount({ o }: { o: LiveOrder }) {
  const tx = useT();
  const money = useMoney();
  const s = o.service;
  if (!s) return null;
  if (!s.count) {
    return (
      <fieldset>
        <Legend hint={tx("Pick a package.")}>{tx("How many?")}</Legend>
        <div className={`mt-3 grid gap-2 ${s.plans.length > 6 ? "grid-cols-2 sm:grid-cols-4" : "grid-cols-2 sm:grid-cols-3"}`}>
          {s.plans.map((p) => {
            const on = o.plan?.id === p.id;
            return (
              <label key={p.id} className={`${optionBase} flex-col items-center !p-3 text-center ${on ? o.tone.border : optionOff}`}>
                <input type="radio" name="social-plan" checked={on} onChange={() => o.setPlan(p.id)} className="sr-only" />
                <span className="font-display text-lg font-bold tabular-nums text-slate-900 dark:text-white">{o.num(p.count)}</span>
                <span className="text-xs tabular-nums text-slate-600 dark:text-slate-400">{money.format(p.price)}</span>
              </label>
            );
          })}
        </div>
      </fieldset>
    );
  }
  const c = s.count;
  const e = o.qtyError;
  const custom = !o.presets.includes(o.qty);
  return (
    <fieldset>
      <Legend hint={tx("Between {0} and {1}, in steps of {2}.", { 0: o.num(c.min), 1: o.num(c.max), 2: o.num(c.step) })}>{tx("How many?")}</Legend>
      <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-6">
        {o.presets.map((n) => {
          const on = o.qty === n;
          return (
            <label key={n} className={`${optionBase} flex-col items-center !p-3 text-center ${on ? o.tone.border : optionOff}`}>
              <input type="radio" name="social-qty-preset" checked={on} onChange={() => o.setQty(n)} className="sr-only" />
              <span className="font-display font-bold tabular-nums text-slate-900 dark:text-white">{o.num(n)}</span>
              <span className="text-xs tabular-nums text-slate-600 dark:text-slate-400">{money.format(countPrice(c, n))}</span>
            </label>
          );
        })}
      </div>
      <div className="mt-4">
        <label htmlFor="social-qty" className="text-sm font-semibold text-slate-900 dark:text-white">{tx("Or enter an amount")}</label>
        <FieldError id="social-qty-error">{e}</FieldError>
        <input id="social-qty" type="number" inputMode="numeric" min={c.min} max={c.max} step={c.step} value={o.qty || ""} onChange={(x) => o.setQty(+x.target.value)} onBlur={() => o.touch("qty")}
          aria-invalid={!!e} aria-describedby={e ? "social-qty-error" : undefined}
          className={`${field} mt-2 tabular-nums ${custom && !e ? o.tone.border : ""} ${e ? bad : ""}`} />
      </div>
    </fieldset>
  );
}

const placeholders: Record<string, string> = { telegram: "t.me/yourchannel", instagram: "instagram.com/yourname", youtube: "youtube.com/@yourchannel", tiktok: "tiktok.com/@yourname" };

// The service's own questions (admin › service › order fields): a link or username, an answer, a choice…
export function LiveFields({ o }: { o: LiveOrder }) {
  const tx = useT();
  const fields = o.service?.fields ?? [];
  const firstLink = fields.find((f) => f.link)?.name;
  return (
    <div className="space-y-6">
      {fields.map((f) => {
        const id = `social-f-${f.name}`;
        const e = o.errorOf(f);
        const v = o.values[f.name] ?? "";
        if (f.kind === "select" && f.options.length <= 4) {
          return (
            <fieldset key={f.name} id={id} tabIndex={-1} aria-describedby={e ? `${id}-error` : undefined} className="outline-none">
              <Legend>{f.title}</Legend>
              <FieldError id={`${id}-error`}>{e}</FieldError>
              <div className="mt-3 flex flex-wrap gap-2">
                {f.options.map((opt) => {
                  const on = v === opt;
                  return (
                    <label key={opt} className={`${optionBase} items-center gap-2 !px-4 !py-2.5 ${on ? o.tone.border : optionOff}`}>
                      <input type="radio" name={id} checked={on} onChange={() => { o.setValue(f.name, opt); o.touch(f.name); }} className="sr-only" />
                      <Dot on={on} tone={o.tone} /><span className="font-semibold text-slate-900 dark:text-white">{opt}</span>
                    </label>
                  );
                })}
              </div>
            </fieldset>
          );
        }
        return (
          <div key={f.name}>
            <label htmlFor={id} className="text-base font-semibold text-slate-900 dark:text-white">{f.title}</label>
            <FieldError id={`${id}-error`}>{e}</FieldError>
            {f.kind === "select" ? (
              <select id={id} value={v} onChange={(x) => { o.setValue(f.name, x.target.value); o.touch(f.name); }} onBlur={() => o.touch(f.name)}
                aria-invalid={!!e} aria-describedby={e ? `${id}-error` : undefined} className={`${field} mt-2 ${e ? bad : ""}`}>
                <option value="">{tx("Choose…")}</option>
                {f.options.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            ) : (
              <input id={id} value={v} onChange={(x) => o.setValue(f.name, x.target.value)} onBlur={() => o.touch(f.name)} maxLength={150}
                {...(f.link ? { dir: "ltr", inputMode: "url" as const, autoCapitalize: "none", spellCheck: false, autoComplete: "off", placeholder: placeholders[o.d.platform.slug] ?? "https://" } : {})}
                aria-invalid={!!e} aria-describedby={[f.link && f.name === firstLink && `${id}-safe`, e && `${id}-error`].filter(Boolean).join(" ") || undefined}
                className={`${field} mt-2 ${f.link ? "text-start" : ""} ${e ? bad : ""}`} />
            )}
            {f.link && f.name === firstLink && <p id={`${id}-safe`} className="mt-2 flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400"><ShieldCheck aria-hidden className="h-4 w-4 shrink-0 text-emerald-700 dark:text-emerald-400" />{tx("We never ask for your password or a login code.")}</p>}
          </div>
        );
      })}
    </div>
  );
}

// ---------- Summary ----------

export function LiveSummary({ o, className = card }: { o: LiveOrder; className?: string }) {
  const tx = useT();
  const money = useMoney();
  const s = o.service;
  return (
    <div className={`${className} p-6`}>
      <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-white">{tx("Your order")}</h2>
      <div className="mt-4 flex items-center gap-3">
        <LiveMark c={o.d.platform} />
        <span className="min-w-0"><span className="block truncate font-semibold text-slate-900 dark:text-white">{s?.name ?? "—"}</span><span className="block truncate text-sm text-slate-600 dark:text-slate-400">{o.d.platform.name}</span></span>
      </div>
      <div className="mt-3">
        <SumRows rows={[
          [tx("To"), o.target ? <span dir="ltr">{(o.values[o.target.name] ?? "").trim().replace(/^https?:\/\/(www\.)?/, "")}</span> : "—"],
          [tx("Amount"), <span className="tabular-nums">{o.count && !o.qtyError ? o.num(o.count) : "—"}</span>],
          ...(s?.notes ?? []).filter((n) => !/نوع|type/i.test(n.label)).slice(0, 3).map((n): [string, ReactNode] => [n.label, n.value]),
        ]} />
      </div>
      <div className="mt-2 flex items-baseline justify-between border-t border-slate-200 pt-4 dark:border-white/10">
        <span className="font-semibold text-slate-900 dark:text-white">{tx("Total")}</span>
        <span className="font-display text-2xl font-bold tabular-nums text-slate-900 dark:text-white">{o.total && !o.qtyError ? money.format(o.total) : "—"}</span>
      </div>
      <button type="submit" disabled={!s || !!o.d.error} className={`${primary} mt-5 w-full tabular-nums disabled:cursor-not-allowed disabled:opacity-50`}>{o.total && !o.qtyError ? `${tx("Continue")} · ${money.format(o.total)}` : tx("Continue")}</button>
      {o.blocker && <p role="alert" className="mt-3 flex items-start justify-center gap-1.5 text-center text-sm font-semibold text-red-700 dark:text-red-400"><X aria-hidden className="mt-0.5 h-4 w-4 shrink-0" />{o.blocker}</p>}
      <p className="mt-3 text-center text-sm text-slate-600 dark:text-slate-400">{tx("Pay with your wallet or card on the next step.")}</p>
    </div>
  );
}

// Phones: a bar with the total that jumps to the summary.
export function LiveJumpBar({ o, inView, go }: { o: LiveOrder; inView: boolean; go: () => void }) {
  const tx = useT();
  const money = useMoney();
  return (
    <div className={`fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white px-4 py-3 shadow-[0_-8px_24px_-12px_rgba(0,0,0,.25)] transition-transform duration-300 lg:hidden dark:border-white/10 dark:bg-[#0E1424] ${inView ? "translate-y-full" : "translate-y-0"}`} aria-hidden={inView} inert={inView}>
      <div className="mx-auto flex max-w-xl items-center justify-between gap-4">
        <span className="min-w-0">
          <span className="block truncate text-sm text-slate-600 dark:text-slate-400">{o.count && !o.qtyError ? `${o.num(o.count)} · ${o.service?.name ?? ""}` : o.service?.name}</span>
          <span className="font-display text-xl font-bold tabular-nums text-slate-900 dark:text-white">{o.total && !o.qtyError ? money.format(o.total) : "—"}</span>
        </span>
        <button type="button" onClick={go} className={`rounded-xl border border-slate-300 px-4 py-2.5 font-semibold text-slate-900 dark:border-white/20 dark:text-white ${ring}`}>{tx("Review order")}</button>
      </div>
    </div>
  );
}

// ---------- Payment and after ----------

export function LiveCheckout({ o }: { o: LiveOrder }) {
  const tx = useT();
  const money = useMoney();
  const s = o.service;
  const to = o.target ? (o.values[o.target.name] ?? "").trim() : "";
  return (
    <CheckoutModal open={o.payOpen} onClose={o.closePay} price={o.total} itemLabel={`${o.num(o.count)} · ${s?.name ?? ""}`} payLabel={tx("Pay")} onPay={o.buy}
      signIn only={["wallet", "card"]} topUpHref={TOP_UP_HREF} fees={{ card: 0 }} notes={{ card: "Iranian bank cards, via ZarinPal" }}
      note={o.changedTo != null ? tx("The price just changed to {price}. Check it and pay again.", { price: money.format(o.changedTo) }) : tx("Delivery starts once we've checked the link. If it's private or wrong, the order is cancelled and refunded to your wallet.")}
      summary={<>
        <LiveMark c={o.d.platform} />
        <div className="min-w-0 flex-1">
          <div className="truncate font-semibold text-slate-900 dark:text-white">{o.num(o.count)} · {s?.name}</div>
          {to && <div dir="ltr" className="truncate text-start text-xs text-slate-500 dark:text-slate-400">{to}</div>}
        </div>
      </>} />
  );
}

export function LiveNotice({ n }: { n: Notice }) {
  return (
    <p role={n.good ? "status" : "alert"} className="mt-5 inline-flex max-w-2xl items-start gap-2 rounded-2xl bg-white/95 px-4 py-3 text-sm font-semibold text-slate-900 shadow-lg shadow-black/20">
      {n.good ? <Check aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" /> : <X aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-red-700" />}{n.text}
    </p>
  );
}

const STEP: Record<ApiServiceOrder["status"], number> = { unpaid: 0, queued: 1, in_progress: 2, done: 3, cancelled: -1, refunded: -1, paused: 1 };

export function LiveOrderView({ o }: { o: LiveOrder }) {
  const tx = useT();
  const money = useMoney();
  const r = o.order!;
  const done = STEP[r.status];
  const stopped = done < 0;
  const titles: Record<ApiServiceOrder["status"], string> = {
    unpaid: tx("Waiting for payment"),
    queued: tx("Your order is in"),
    in_progress: tx("Your order has started"),
    done: tx("Your order is complete"),
    cancelled: tx("This order was cancelled"),
    refunded: tx("This order was refunded to your wallet"),
    paused: tx("This order is on hold"),
  };
  const steps = [tx("Payment received"), tx("Checked and started"), tx("Delivered")];
  const to = r.fields.find((f) => /link|لینک|آیدی/i.test(f.title))?.value ?? r.fields[0]?.value;
  return (
    <div className="mx-auto max-w-2xl animate-fade-up">
      {r.status !== "unpaid" && <p className="flex items-center gap-2 font-semibold text-emerald-800 dark:text-emerald-300"><Check aria-hidden className="h-5 w-5" />{tx("Payment received ·")}{" "}{money.format(r.price)}</p>}
      <h1 aria-live="polite" className="mt-3 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">{titles[r.status]}</h1>
      <p className="mt-2 text-slate-700 dark:text-slate-300">{stopped ? tx("Questions about it? Message support from your order page.") : tx("We check the link and start delivery. Keep the account public and the username unchanged until it's done.")}</p>
      <div className={`${card} mt-6 flex items-center gap-4 p-5`}>
        <LiveMark c={o.d.platform} />
        <div className="min-w-0 flex-1">
          <div className="truncate font-semibold text-slate-900 dark:text-white">{r.count ? `${o.num(r.count)} · ` : ""}{tx.locale === "fa" ? r.service?.name : r.service?.en_name || r.service?.name}</div>
          {to && <div dir="ltr" className="truncate text-start text-sm text-slate-600 dark:text-slate-400">{to}</div>}
        </div>
        <span className="shrink-0 text-sm tabular-nums text-slate-600 dark:text-slate-400">#{formatNum(r.id, tx.locale, { useGrouping: false })}</span>
      </div>
      {!stopped && (
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
      )}
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/dashboard/orders" className={primary}>{tx("View in my orders")}</Link>
        <button onClick={o.reset} className={`inline-flex items-center justify-center rounded-xl border border-slate-300 px-6 py-3.5 font-semibold text-slate-800 hover:bg-slate-50 dark:border-white/20 dark:text-slate-100 dark:hover:bg-white/5 ${ring}`}>{tx("Place another order")}</button>
      </div>
    </div>
  );
}
