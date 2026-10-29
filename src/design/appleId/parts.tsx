"use client";

import { useEffect, useId, useRef, useState, useTransition, type ReactNode } from "react";
import Link from "@/i18n/Link";
import { useRouter } from "next/navigation";
import { Apple, Check, Loader2, ChevronRight, Clock, Eye, EyeOff, KeyRound, Minus, Plus, ShieldCheck, ShieldQuestion, Smartphone, UserPen, X, Zap } from "lucide-react";
import CheckoutModal, { type PayMethod } from "@/components/checkout/CheckoutModal";
import { appleFaq, applePaths, compareRows, CUSTOM_PRICE, MAX_QTY, methodInfo, months, packs, READY_PRICE, sampleApple, type AppleMethod } from "@/content/apple-en";
import { CopyButton } from "../otp/parts";
import { field, primary, ring, secondary } from "../googleVoice/clean";
import { useLocale, useT } from "@/i18n/client";
import { formatNum } from "@/i18n/translate";
import { useLocalePath } from "@/i18n/Link";
import { stripLocale } from "@/i18n/config";
import { accountApi, ApiError, TOP_UP_HREF, useAccount } from "@/lib/account";
import { useMoney } from "@/lib/money";
import type { ApiAppleAccount, ApiAppleOrder } from "@/lib/apple-id";
import { useLiveApple } from "./live";

// Pieces shared by the Apple ID page offers. Built to be accessible: labelled fields with autocomplete, hints and
// errors tied to each field (aria-describedby / aria-invalid), an error summary that links to the fields, real
// radio groups, visible focus rings, and live announcements for changes.

// ---------- State ----------

export type FormKey = "first" | "last" | "email" | "day" | "month" | "year" | "password";
export type AppleForm = Record<FormKey, string>;
type Errors = Partial<Record<"first" | "last" | "email" | "birthday" | "password", string>>;
// Live orders also carry their id, state and the logins delivered so far; design previews leave those out.
export type AppleOrder = {
  method: AppleMethod; qty: number; total: number; form?: AppleForm; paidWith: PayMethod; at: number;
  id?: number; status?: "delivered" | "preparing"; accounts?: ApiAppleAccount[]; email?: string;
};
export type AppleNotice = { good: boolean; text: string };

const pad = (s: string) => s.padStart(2, "0");

const orderOf = (o: ApiAppleOrder): AppleOrder => ({
  id: o.id, method: o.kind, qty: o.qty, total: o.price, paidWith: o.paid_with, at: Date.parse(o.created_at),
  status: o.status === "delivered" ? "delivered" : "preparing", accounts: o.accounts, email: o.details?.email,
});

const NAME = /^[\p{L}][\p{L} '\-]*$/u;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const passwordRules = [
  { id: "len", label: "At least 8 characters", test: (p: string) => p.length >= 8 },
  { id: "upper", label: "An uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
  { id: "lower", label: "A lowercase letter", test: (p: string) => /[a-z]/.test(p) },
  { id: "num", label: "A number", test: (p: string) => /\d/.test(p) },
];

function check(f: AppleForm): Errors {
  const e: Errors = {};
  if (!f.first.trim()) e.first = "Enter your first name";
  else if (!NAME.test(f.first.trim())) e.first = "First name can only use letters, spaces, hyphens and apostrophes";
  if (!f.last.trim()) e.last = "Enter your last name";
  else if (!NAME.test(f.last.trim())) e.last = "Last name can only use letters, spaces, hyphens and apostrophes";
  if (!f.email.trim()) e.email = "Enter your email address";
  else if (!EMAIL.test(f.email.trim())) e.email = "Enter an email address in the correct format, like name@example.com";
  const d = Number(f.day), m = Number(f.month), y = Number(f.year);
  if (!f.day || !f.month || !f.year) e.birthday = "Enter your full date of birth: day, month and year";
  else {
    const date = new Date(y, m - 1, d);
    const real = date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === d;
    const age = (Date.now() - date.getTime()) / (365.25 * 86400000);
    if (!real || y < 1900) e.birthday = "Enter a real date of birth";
    else if (age < 13) e.birthday = "You must be 13 or older to have an Apple ID";
  }
  if (f.password && !passwordRules.every((r) => r.test(f.password))) e.password = "Password must have at least 8 characters, an uppercase letter, a lowercase letter and a number";
  return e;
}

// Kind → quantity or details → payment → delivered order. On the live page (LiveAppleProvider) prices and stock come
// from the backend and paying goes through it: wallet right away, card via the bank (which sends the buyer back with
// ?pay=…&order=…). In design previews paying succeeds straight away with sample logins.
export function useApple(initial: AppleMethod = "ready") {
  const tx = useT();
  const live = useLiveApple();
  const { setWallet } = useAccount();
  const readyPrice = live ? live.readyPrice : tx.tr(READY_PRICE);
  const customPrice = live ? live.customPrice : CUSTOM_PRICE;
  const maxQty = live ? live.maxQty : tx.tr(MAX_QTY);
  const packList = live ? live.packs : tx.tr(packs);
  const [stock, setStock] = useState(live ? live.stock : Infinity);
  const [notice, setNotice] = useState<AppleNotice | null>(null);
  const [method, setMethod] = useState<AppleMethod>(initial);
  const [qty, setQtyRaw] = useState(1);
  const [pack, setPack] = useState<number | null>(null);
  const [form, setForm] = useState<AppleForm>({ first: "", last: "", email: "", day: "", month: "", year: "", password: "" });
  const [touched, setTouched] = useState<Partial<Record<keyof Errors, boolean>>>({});
  const [submitted, setSubmitted] = useState(0);
  const [payOpen, setPayOpen] = useState(false);
  const [order, setOrder] = useState<AppleOrder | null>(null);

  // /apple-id/usa and /apple-id/custom are separate pages with their own content, so switching kind there goes to
  // the other page. On /apple-id (about both kinds) and the design comparison pages, switching stays in place.
  // One move, no flicker: on those two pages the card itself navigates (the current card stays chosen until the other
  // page arrives, and the clicked card shows that it is opening).
  const router = useRouter();
  const lp = useLocalePath();
  const [opening, setOpening] = useState<AppleMethod | null>(null);
  const [navigating, startNav] = useTransition();
  const chooseMethod = (m: AppleMethod) => {
    if (m === method) return;
    const path = stripLocale(window.location.pathname);
    if (Object.values(applePaths).includes(path)) {
      setOpening(m);
      startNav(() => router.push(lp(applePaths[m]), { scroll: false }));
      return;
    }
    setMethod(m);
  };

  const all = check(form);
  // Errors show for fields the user has left, and for every field after a submit attempt.
  const errors: Errors = Object.fromEntries(Object.entries(all).filter(([k]) => submitted || touched[k as keyof Errors])) as Errors;

  const setQty = (n: number) => { setPack(null); setQtyRaw(Math.min(maxQty, Math.max(1, Math.round(n) || 1))); };
  const packInfo = packList.find((p) => p.qty === pack);
  const count = method === "custom" ? 1 : packInfo ? packInfo.qty : qty;
  const total = method === "custom" ? customPrice : packInfo ? Math.round(packInfo.qty * packInfo.each * 100) / 100 : Math.round(qty * readyPrice * 100) / 100;
  // Ready: more asked for than is in stock right now (live page only). Allowed as a pre-order: paying hands over what
  // is in stock and the rest follows in the same order when new ones are added. The page never shows the stock count.
  const short = method === "ready" && count > stock;
  const paused = !!live?.error;

  const show = (o: AppleOrder) => { setOrder(o); setPayOpen(false); window.scrollTo({ top: 0, behavior: "smooth" }); };

  // Returns true when the payment window opened; false when something must be fixed first.
  const proceed = () => {
    if (paused) return false;
    if (method === "custom") {
      setSubmitted((n) => n + 1);
      if (Object.keys(all).length) return false;
    }
    setPayOpen(true);
    return true;
  };

  const buy = async (m: PayMethod) => {
    if (!live) return show({ method, qty: count, total, form: method === "custom" ? form : undefined, paidWith: m, at: Date.now() });
    const body = method === "ready"
      ? { kind: "ready", qty: count, price: total }
      : { kind: "custom", price: total, first: form.first.trim(), last: form.last.trim(), email: form.email.trim(), birthday: `${form.year}-${pad(form.month)}-${pad(form.day)}`, password: form.password };
    try {
      if (m === "card") {
        const r = await accountApi<{ url: string }>("apple-id/pay-card", { ...body, return: window.location.pathname });
        window.location.assign(r.url);
        return new Promise<void>(() => {}); // the page is leaving; keep the modal busy
      }
      const r = await accountApi<{ order: ApiAppleOrder; wallet: number }>("apple-id/buy", body);
      setWallet(r.wallet);
      if (method === "ready") setStock((s) => Math.max(0, s - r.order.accounts.length));
      show({ ...orderOf(r.order), form: method === "custom" ? form : undefined });
    } catch (e) {
      if (e instanceof ApiError) {
        if (typeof e.data?.wallet === "number") setWallet(e.data.wallet);
        if (typeof e.data?.stock === "number") setStock(e.data.stock);
      }
      throw e; // the modal shows why
    }
  };

  // Back from the bank: show the order, or what happened. Then clean the address so a reload doesn't repeat it.
  useEffect(() => {
    if (!live) return;
    const q = new URLSearchParams(window.location.search);
    const pay = q.get("pay");
    const id = q.get("order");
    if (!pay) return;
    q.delete("pay"); q.delete("order");
    window.history.replaceState(null, "", window.location.pathname + (q.size ? `?${q}` : "") + window.location.hash);
    const texts: Record<string, AppleNotice> = {
      cancelled: { good: false, text: tx("Payment cancelled. Nothing was charged.") },
      failed: { good: false, text: tx("The payment didn't go through. If money left your account, the bank returns it within 72 hours.") },
    };
    if (pay === "ok" && id) {
      accountApi<{ order: ApiAppleOrder; wallet: number }>(`apple-id/orders/${id}`)
        .then((r) => { setWallet(r.wallet); show(orderOf(r.order)); })
        .catch(() => setNotice({ good: true, text: tx("Payment received. Your Apple ID is in your orders.") }));
    } else {
      setNotice(texts[pay] ?? texts.failed);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [live]);

  // While support finishes an order, check every 20 seconds so the login shows up here without a reload.
  const waitingId = order?.status === "preparing" ? order.id : undefined;
  useEffect(() => {
    if (!waitingId) return;
    const timer = setInterval(() => {
      accountApi<{ order: ApiAppleOrder; wallet: number }>(`apple-id/orders/${waitingId}`)
        .then((r) => { if (r.order.status === "delivered" || r.order.accounts.length) setOrder((o) => (o ? { ...orderOf(r.order), form: o.form } : o)); })
        .catch(() => {}); // try again on the next tick
    }, 20000);
    return () => clearInterval(timer);
  }, [waitingId]);

  return {
    live: !!live, readyPrice, customPrice, maxQty, packs: packList, stock, short, paused, error: live?.error, notice,
    method, setMethod: chooseMethod, opening: navigating ? opening : null, qty, setQty, pack, setPack, count, total,
    form, set: (k: FormKey, v: string) => setForm((f) => ({ ...f, [k]: v })), touch: (k: keyof Errors) => setTouched((t) => ({ ...t, [k]: true })),
    errors, allErrors: all, submitted,
    payOpen, proceed, closePay: () => setPayOpen(false), order, buy, reset: () => { setOrder(null); setSubmitted(0); setTouched({}); setNotice(null); },
  };
}
export type AppleState = ReturnType<typeof useApple>;

// ---------- Method choice ----------

export function MethodIcon({ m, size = "md" }: { m: AppleMethod; size?: "md" | "lg" }) {
  const I = m === "ready" ? Zap : UserPen;
  return <span aria-hidden className={`grid shrink-0 place-items-center ${size === "lg" ? "h-14 w-14 rounded-2xl" : "h-11 w-11 rounded-xl"} ${m === "ready" ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900" : "bg-sky-100 text-sky-800 dark:bg-sky-500/15 dark:text-sky-300"}`}><I className={size === "lg" ? "h-7 w-7" : "h-5 w-5"} /></span>;
}

// Radio cards for Ready / Custom. `details` adds the bullet points.
export function MethodRadios({ a, details = true, legend = "Which Apple ID do you need?", hideLegend = false }: { a: AppleState; details?: boolean; legend?: string; hideLegend?: boolean }) {
  const tx = useT();
  const money = useMoney();
  legend = tx(legend);
  const name = useId();
  return (
    <fieldset>
      <legend className={hideLegend ? "sr-only" : "text-base font-semibold text-slate-900 dark:text-white"}>{legend}</legend>
      <div className={`grid gap-3 sm:grid-cols-2 ${hideLegend ? "" : "mt-3"}`}>
        {(["ready", "custom"] as const).map((m) => {
          const info = tx.tr(methodInfo)[m];
          const on = a.method === m;
          return (
            <label key={m} className={`relative flex cursor-pointer gap-4 rounded-3xl border-2 bg-white p-5 transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-sky-600 has-[:focus-visible]:ring-offset-2 dark:bg-[#0E1424] dark:has-[:focus-visible]:ring-sky-400 dark:has-[:focus-visible]:ring-offset-[#070B14] ${on ? "border-sky-700 dark:border-sky-400" : "border-slate-200 hover:border-slate-400 dark:border-white/15 dark:hover:border-white/40"}`}>
              <input type="radio" autoComplete="off" name={name} checked={on} onChange={() => a.setMethod(m)} className="sr-only" />
              <MethodIcon m={m} />
              <span className="min-w-0 flex-1">
                <span className="flex items-start justify-between gap-2 pe-8">
                  <span className="font-display text-lg font-semibold text-slate-900 dark:text-white">{info.title}</span>
                  <span className="text-end font-bold text-slate-900 dark:text-white">{money.format(m === "ready" ? a.readyPrice : a.customPrice)}</span>
                </span>
                <span className="mt-0.5 block text-slate-600 dark:text-slate-400">{info.tagline}</span>
                <span className="mt-2 flex items-center gap-1.5 text-sm font-medium text-slate-800 dark:text-slate-200"><Clock aria-hidden className="h-4 w-4" />{info.delivery}</span>
                {details && (
                  <ul className="mt-3 space-y-1.5">
                    {info.points.map((p) => <li key={p} className="flex gap-2 text-[15px] text-slate-700 dark:text-slate-300"><Check aria-hidden className="mt-1 h-4 w-4 shrink-0 text-sky-700 dark:text-sky-400" />{p}</li>)}
                  </ul>
                )}
              </span>
              <span aria-hidden className={`absolute end-4 top-4 h-6 w-6 place-items-center rounded-full ${on ? "grid bg-sky-700 text-white dark:bg-sky-400 dark:text-sky-950" : "hidden"}`}><Check className="h-3.5 w-3.5" strokeWidth={3} /></span>
              {a.opening === m && <span role="status" className="absolute end-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-sky-100 px-2.5 py-1 text-xs font-semibold text-sky-900 dark:bg-sky-400/15 dark:text-sky-100"><Loader2 aria-hidden className="h-3.5 w-3.5 animate-spin" />{tx("Opening…")}</span>}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

// ---------- Ready: quantity ----------

// `showPacks={false}` hides the partner packs (minimal layouts); `hint={false}` drops the price line.
// `side`: the partner packs sit beside the quantity (in the empty space on the end side) and are always shown, under
// "Need more?". Without it they fold away under the quantity, as in the older designs.
export function Quantity({ a, packsOpen = false, showPacks = true, hint = true, side = false }: { a: AppleState; packsOpen?: boolean; showPacks?: boolean; hint?: boolean; side?: boolean }) {
  const tx = useT();
  const money = useMoney();
  const id = useId(), packName = useId();
  const fitting = a.packs; // every pack can be ordered; what is not in stock yet follows in the same order
  const withPacks = showPacks && fitting.length > 0;

  const picker = (
    <div>
      <label htmlFor={id} className="text-base font-semibold text-slate-900 dark:text-white">{tx("How many?")}</label>
      <p id={`${id}-hint`} className={hint ? "text-sm text-slate-600 dark:text-slate-400" : "sr-only"}>{tx("1 to")}{" "}{a.maxQty}{" "}{tx("at")}{" "}{money.format(a.readyPrice)}{" "}{tx("each")}</p>
      <div className="mt-2 flex items-center gap-2">
        <button type="button" onClick={() => a.setQty(a.qty - 1)} disabled={!a.pack && a.qty <= 1} aria-label={tx("One fewer")} className={`grid h-12 w-12 place-items-center rounded-xl border border-slate-300 text-slate-800 disabled:opacity-40 dark:border-white/20 dark:text-slate-100 ${ring}`}><Minus aria-hidden className="h-5 w-5" /></button>
        <div className="w-20 shrink-0"><input id={id} type="number" inputMode="numeric" min={1} max={a.maxQty} value={a.pack ? "" : a.qty} placeholder={a.pack ? "—" : undefined} aria-describedby={`${id}-hint`}
          onChange={(e) => a.setQty(Number(e.target.value))} className={`${field} text-center text-lg font-semibold`} /></div>
        <button type="button" onClick={() => a.setQty(a.pack ? 1 : a.qty + 1)} disabled={!a.pack && a.qty >= a.maxQty} aria-label={tx("One more")} className={`grid h-12 w-12 place-items-center rounded-xl border border-slate-300 text-slate-800 disabled:opacity-40 dark:border-white/20 dark:text-slate-100 ${ring}`}><Plus aria-hidden className="h-5 w-5" /></button>
      </div>
    </div>
  );

  const note = a.short && (
    <p role="status" className="flex items-start gap-2 rounded-xl bg-sky-50 px-4 py-3 text-sm text-sky-900 ring-1 ring-sky-200 dark:bg-sky-400/10 dark:text-sky-100 dark:ring-sky-400/25">
      <Clock aria-hidden className="mt-0.5 h-4 w-4 shrink-0" />{tx("Some of these will come a little later: you get the ones ready now straight away, and the rest are added to the same order as soon as new ones arrive.")}
    </p>
  );

  const packOption = (p: (typeof fitting)[number], compact: boolean) => {
    const on = a.pack === p.qty;
    return (
      <label key={p.qty} className={`relative flex cursor-pointer rounded-xl border-2 px-4 py-3 transition-colors ${compact ? "flex-col items-start gap-0.5" : "items-center justify-between gap-3"} has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-sky-600 dark:has-[:focus-visible]:ring-sky-400 ${on ? "border-sky-700 bg-sky-50 dark:border-sky-400 dark:bg-sky-400/10" : "border-slate-200 hover:border-slate-400 dark:border-white/15 dark:hover:border-white/30"}`}>
        <input type="radio" autoComplete="off" name={packName} checked={on} onChange={() => a.setPack(p.qty)} className="sr-only" />
        <span className="min-w-0">
          <span className="flex items-center gap-1.5 whitespace-nowrap font-semibold text-slate-900 dark:text-white">{on && <Check aria-hidden className="h-4 w-4 text-sky-700 dark:text-sky-400" strokeWidth={3} />}{p.qty}{" "}{tx("Apple IDs")}</span>
          {!compact && <span className="text-sm text-slate-600 dark:text-slate-400">{money.format(p.each)}{" "}{tx("each")}</span>}
        </span>
        <span className={`whitespace-nowrap font-bold tabular-nums ${compact ? "text-sm text-slate-700 dark:text-slate-300" : "text-slate-900 dark:text-white"}`}>{money.format(p.qty * p.each)}</span>
      </label>
    );
  };

  // `side` (live design A): one control for every amount. The number always shows what you are buying, packs
  // included; − / + walk one ladder (1 … 10, then the partner packs 30, 50, 100, 200) and the packs are quick picks
  // under it. A line beside the number does the sum, so the total is never a surprise.
  if (side) {
    const steps = [...Array.from({ length: a.maxQty }, (_, i) => i + 1), ...fitting.map((p) => p.qty)];
    const at = Math.max(0, steps.indexOf(a.count));
    const go = (n: number) => (fitting.some((p) => p.qty === n) ? a.setPack(n) : a.setQty(n));
    const each = a.pack ? fitting.find((p) => p.qty === a.pack)!.each : a.readyPrice;
    const stepBtn = `grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-slate-300 text-slate-800 transition-[background-color,border-color,scale] duration-200 hover:bg-slate-50 active:scale-95 disabled:pointer-events-none disabled:opacity-35 dark:border-white/20 dark:text-slate-100 dark:hover:bg-white/5 ${ring}`;
    return (
      <div className="space-y-6">
        <div>
          <label htmlFor={id} className="text-base font-semibold text-slate-900 dark:text-white">{tx("How many?")}</label>
          <p id={`${id}-hint`} className={hint ? "text-sm text-slate-600 dark:text-slate-400" : "sr-only"}>{withPacks ? tx("1 to {0}, or a partner pack of 30 or more.", { 0: a.maxQty }) : tx("1 to {0}.", { 0: a.maxQty })}</p>
          <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-4">
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => go(steps[at - 1])} disabled={at === 0} aria-label={tx("Fewer")} className={stepBtn}><Minus aria-hidden className="h-5 w-5" /></button>
              <input id={id} type="number" inputMode="numeric" min={1} value={a.count} aria-describedby={`${id}-hint ${id}-sum`}
                onChange={(e) => { const n = Math.round(Number(e.target.value)) || 1; go(fitting.some((p) => p.qty === n) ? n : Math.min(a.maxQty, Math.max(1, n))); }}
                className={`h-14 w-24 rounded-2xl border bg-white text-center font-display text-2xl font-bold tabular-nums text-slate-900 [appearance:textfield] dark:bg-white/5 dark:text-white [&::-webkit-inner-spin-button]:appearance-none ${a.pack ? "border-sky-600 dark:border-sky-400" : "border-slate-300 dark:border-white/20"} ${ring}`} />
              <button type="button" onClick={() => go(steps[at + 1])} disabled={at === steps.length - 1} aria-label={tx("More")} className={stepBtn}><Plus aria-hidden className="h-5 w-5" /></button>
            </div>
            <p id={`${id}-sum`} aria-live="polite" className="min-w-0 text-slate-700 dark:text-slate-300">
              <span className="block text-sm tabular-nums">{tx("{0} × {1}", { 0: a.count, 1: money.format(each) })}{a.pack ? ` · ${tx("Partner pack")}` : ""}</span>
              <span className="block font-display text-xl font-bold tabular-nums text-slate-900 dark:text-white">{money.format(a.total)}</span>
            </p>
          </div>
        </div>

        {withPacks && (
          <fieldset>
            <legend className="text-sm font-semibold text-slate-900 dark:text-white">{tx("Need more?")}<span className="ms-1 font-normal text-slate-600 dark:text-slate-400">{tx("Partner packs for resellers.")}</span></legend>
            <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {fitting.map((p) => {
                const on = a.pack === p.qty;
                return (
                  <label key={p.qty} className={`relative flex cursor-pointer select-none flex-col items-center rounded-2xl border-2 px-3 py-2.5 text-center transition-[border-color,background-color,translate] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-sky-600 dark:has-[:focus-visible]:ring-sky-400 ${on ? "border-sky-700 bg-sky-50 dark:border-sky-400 dark:bg-sky-400/10" : "border-slate-200 hover:border-slate-400 dark:border-white/15 dark:hover:border-white/30"}`}>
                    <input type="radio" autoComplete="off" name={packName} checked={on} onChange={() => a.setPack(p.qty)} className="sr-only" />
                    {on && <Check aria-hidden className="absolute end-2 top-2 h-3.5 w-3.5 text-sky-700 dark:text-sky-400" strokeWidth={3} />}
                    <span className="font-display text-lg font-bold tabular-nums text-slate-900 dark:text-white">{p.qty}</span>
                    <span className="text-xs tabular-nums text-slate-600 dark:text-slate-400">{money.format(p.qty * p.each)}</span>
                  </label>
                );
              })}
            </div>
          </fieldset>
        )}
        {note}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        {picker}
        {note && <div className="mt-3">{note}</div>}
      </div>

      {withPacks && <details open={packsOpen || !!a.pack} className="group rounded-2xl border border-slate-200 p-4 dark:border-white/15 [&_summary::-webkit-details-marker]:hidden">
        <summary className={`flex cursor-pointer list-none items-center justify-between gap-3 rounded-lg font-semibold text-slate-900 dark:text-white ${ring}`}>
          {tx("Buying 30 or more? Partner packs")}<ChevronRight aria-hidden className="h-4 w-4 text-slate-500 transition group-open:rotate-90 rtl:rotate-180 rtl:group-open:rotate-90" />
        </summary>
        <fieldset className="mt-3">
          <legend className="sr-only">{tx("Partner pack")}</legend>
          <div className="grid gap-2 sm:grid-cols-2">{fitting.map((p) => packOption(p, false))}</div>
        </fieldset>
      </details>}
    </div>
  );
}

// What each ready Apple ID comes with, and what to do after signing in. Fills the quantity step beside the summary.
const readyIncludes = [
  { icon: KeyRound, title: "Email and password", text: "The login itself, ready to sign in." },
  { icon: ShieldQuestion, title: "Birthday and 3 security answers", text: "What Apple asks for when you recover or change details." },
  { icon: Smartphone, title: "Works on any Apple device", text: "iPhone, iPad and Mac: App Store, iCloud and more." },
  { icon: Zap, title: "Shown right after paying", text: "On this page and in your orders, any time later." },
];
const readyAfter = [
  "Sign in on your device and change the password.",
  "Set new security answers you'll remember.",
  "Add your own phone as the trusted number.",
];

export function ReadyNotes() {
  const tx = useT();
  const locale = useLocale();
  return (
    <div className="space-y-6 border-t border-slate-200 pt-6 dark:border-white/10">
      <div>
        <h3 className="text-base font-semibold text-slate-900 dark:text-white">{tx("What you get with each one")}</h3>
        <ul className="mt-3 grid gap-x-6 gap-y-4 sm:grid-cols-2">
          {readyIncludes.map(({ icon: I, title, text }) => (
            <li key={title} className="flex gap-3">
              <span aria-hidden className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-slate-100 text-slate-800 dark:bg-white/10 dark:text-slate-100"><I className="h-[18px] w-[18px]" /></span>
              <span className="min-w-0"><span className="block font-medium text-slate-900 dark:text-white">{tx(title)}</span><span className="block text-sm text-slate-600 dark:text-slate-400">{tx(text)}</span></span>
            </li>
          ))}
        </ul>
      </div>
      <div className="rounded-2xl bg-slate-50 p-5 dark:bg-white/5">
        <h3 className="text-base font-semibold text-slate-900 dark:text-white">{tx("After you sign in")}</h3>
        <ol className="mt-3 space-y-2.5">
          {readyAfter.map((s, i) => (
            <li key={s} className="flex items-start gap-3 text-[15px] text-slate-700 dark:text-slate-300">
              <span aria-hidden className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-white text-xs font-bold text-slate-900 ring-1 ring-slate-300 dark:bg-[#0E1424] dark:text-white dark:ring-white/20">{formatNum(i + 1, locale)}</span>
              {tx(s)}
            </li>
          ))}
        </ol>
      </div>
      <p className="flex items-start gap-2.5 text-[15px] text-slate-700 dark:text-slate-300"><ShieldCheck aria-hidden className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700 dark:text-emerald-400" />{tx("Login not working? We replace it or refund you.")}</p>
    </div>
  );
}

// ---------- Custom: form ----------

function Field({ id, label, hint, error, children }: { id: string; label: string; hint?: ReactNode; error?: string; children: ReactNode }) {
  const tx = useT();
  return (
    <div>
      <label htmlFor={id} className="block text-base font-semibold text-slate-900 dark:text-white">{label}</label>
      {hint && <p id={`${id}-hint`} className="text-sm text-slate-600 dark:text-slate-400">{hint}</p>}
      {error && <p id={`${id}-error`} className="mt-1 flex items-start gap-1.5 text-sm font-semibold text-red-700 dark:text-red-400"><X aria-hidden className="mt-0.5 h-4 w-4 shrink-0" /><span><span className="sr-only">{tx("Error:")}{" "}</span>{error}</span></p>}
      <div className="mt-2">{children}</div>
    </div>
  );
}

const desc = (id: string, hint: boolean, error?: string) => [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(" ") || undefined;
const bad = (error?: string) => (error ? "!border-red-700 dark:!border-red-400" : "");

// Error summary shown after a failed submit; it takes focus on each failed attempt so screen readers read it,
// and its links jump to each field.
export function ErrorSummary({ a }: { a: AppleState }) {
  const tx = useT();
  const ref = useRef<HTMLDivElement>(null);
  const list = Object.entries(a.allErrors) as [keyof typeof a.allErrors, string][];
  const failed = a.submitted > 0 && list.length > 0;
  useEffect(() => { if (failed) ref.current?.focus(); }, [a.submitted]); // eslint-disable-line react-hooks/exhaustive-deps
  if (!a.submitted || !list.length) return null;
  const target: Record<string, string> = { first: "apple-first", last: "apple-last", email: "apple-email", birthday: "apple-day", password: "apple-password" };
  return (
    <div ref={ref} tabIndex={-1} role="alert" aria-labelledby="err-title" className="rounded-2xl border-2 border-red-700 bg-red-50 p-5 outline-none dark:border-red-400 dark:bg-red-500/10">
      <h2 id="err-title" className="font-display text-lg font-semibold text-slate-900 dark:text-white">{tx("Please fix")}{" "}{list.length === 1 ? "this" : tx("these {0} things", { 0: list.length })}</h2>
      <ul className="mt-2 space-y-1">
        {list.map(([k, msg]) => <li key={k}><a href={`#${target[k]}`} onClick={(e) => { e.preventDefault(); document.getElementById(target[k])?.focus(); }} className={`font-semibold text-red-800 underline underline-offset-2 dark:text-red-300 ${ring}`}>{msg}</a></li>)}
      </ul>
    </div>
  );
}

// The custom form, also available as separate pieces (for the one-question-per-screen design).
export function CustomForm({ a, cols = 2 }: { a: AppleState; cols?: 1 | 2 }) {
  return (
    <div className="space-y-6">
      <NameFields a={a} cols={cols} />
      <EmailField a={a} />
      <BirthdayField a={a} />
      <PasswordField a={a} />
    </div>
  );
}

export function NameFields({ a, cols = 2 }: { a: AppleState; cols?: 1 | 2 }) {
  const tx = useT();
  const e = a.errors;
  return (
      <div className={`grid gap-6 ${cols === 2 ? "sm:grid-cols-2" : ""}`}>
        <Field id="apple-first" label={tx("First name")} error={e.first}>
          <input id="apple-first" autoComplete="given-name" value={a.form.first} onChange={(x) => a.set("first", x.target.value)} onBlur={() => a.touch("first")}
            aria-invalid={!!e.first} aria-describedby={desc("apple-first", false, e.first)} className={`${field} ${bad(e.first)}`} />
        </Field>
        <Field id="apple-last" label={tx("Last name")} error={e.last}>
          <input id="apple-last" autoComplete="family-name" value={a.form.last} onChange={(x) => a.set("last", x.target.value)} onBlur={() => a.touch("last")}
            aria-invalid={!!e.last} aria-describedby={desc("apple-last", false, e.last)} className={`${field} ${bad(e.last)}`} />
        </Field>
      </div>
  );
}

export function EmailField({ a }: { a: AppleState }) {
  const tx = useT();
  const e = a.errors;
  return (
      <Field id="apple-email" label={tx("Email address")} hint={tx("Your Apple ID will use this email. Make sure you can open it.")} error={e.email}>
        <input id="apple-email" type="email" inputMode="email" autoComplete="email" spellCheck={false} value={a.form.email} onChange={(x) => a.set("email", x.target.value)} onBlur={() => a.touch("email")}
          aria-invalid={!!e.email} aria-describedby={desc("apple-email", true, e.email)} className={`${field} ${bad(e.email)}`} />
      </Field>
  );
}

export function BirthdayField({ a }: { a: AppleState }) {
  const tx = useT();
  const e = a.errors;
  return (
      <fieldset aria-describedby={["apple-bday-hint", e.birthday && "apple-bday-error"].filter(Boolean).join(" ")}>
        <legend className="text-base font-semibold text-slate-900 dark:text-white">{tx("Date of birth")}</legend>
        <p id="apple-bday-hint" className="text-sm text-slate-600 dark:text-slate-400">{tx("For example, 14 March 1994. You must be 13 or older.")}</p>
        {e.birthday && <p id="apple-bday-error" className="mt-1 flex items-start gap-1.5 text-sm font-semibold text-red-700 dark:text-red-400"><X aria-hidden className="mt-0.5 h-4 w-4 shrink-0" /><span><span className="sr-only">{tx("Error:")}{" "}</span>{e.birthday}</span></p>}
        <div className="mt-2 flex flex-wrap gap-3" onBlur={(x) => { if (!x.currentTarget.contains(x.relatedTarget as Node)) a.touch("birthday"); }}>
          <div className="w-20">
            <label htmlFor="apple-day" className="text-sm text-slate-700 dark:text-slate-300">{tx("Day")}</label>
            <input id="apple-day" inputMode="numeric" autoComplete="bday-day" maxLength={2} value={a.form.day} onChange={(x) => a.set("day", x.target.value.replace(/\D/g, ""))}
              aria-invalid={!!e.birthday} className={`${field} mt-1 text-center ${bad(e.birthday)}`} />
          </div>
          <div className="w-44">
            <label htmlFor="apple-month" className="text-sm text-slate-700 dark:text-slate-300">{tx("Month")}</label>
            <select id="apple-month" autoComplete="bday-month" value={a.form.month} onChange={(x) => a.set("month", x.target.value)}
              aria-invalid={!!e.birthday} className={`${field} mt-1 appearance-auto ${bad(e.birthday)}`}>
              <option value="">{tx("Choose")}</option>
              {tx.tr(months).map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
            </select>
          </div>
          <div className="w-28">
            <label htmlFor="apple-year" className="text-sm text-slate-700 dark:text-slate-300">{tx("Year")}</label>
            <input id="apple-year" inputMode="numeric" autoComplete="bday-year" maxLength={4} value={a.form.year} onChange={(x) => a.set("year", x.target.value.replace(/\D/g, ""))}
              aria-invalid={!!e.birthday} className={`${field} mt-1 text-center ${bad(e.birthday)}`} />
          </div>
        </div>
      </fieldset>
  );
}

export function PasswordField({ a }: { a: AppleState }) {
  const tx = useT();
  const [show, setShow] = useState(false);
  const e = a.errors;
  const pw = a.form.password;
  return (
      <Field id="apple-password" label={tx("Password (optional)")} hint={tx("Leave empty and we'll create a strong one for you.")} error={e.password}>
        <div className="relative">
          <input id="apple-password" type={show ? "text" : "password"} autoComplete="new-password" value={pw} onChange={(x) => a.set("password", x.target.value)} onBlur={() => a.touch("password")}
            aria-invalid={!!e.password} aria-describedby={[desc("apple-password", true, e.password), pw && "apple-pw-rules"].filter(Boolean).join(" ")} className={`${field} pe-24 ${bad(e.password)}`} />
          <button type="button" onClick={() => setShow(!show)} aria-pressed={show} className={`absolute end-2 top-1/2 flex -translate-y-1/2 items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/10 ${ring}`}>
            {show ? <EyeOff aria-hidden className="h-4 w-4" /> : <Eye aria-hidden className="h-4 w-4" />}{show ? tx("Hide") : tx("Show")}<span className="sr-only">{" "}{tx("password")}</span>
          </button>
        </div>
        {pw && (
          <ul id="apple-pw-rules" aria-live="polite" className="mt-3 grid gap-1.5 sm:grid-cols-2">
            {tx.tr(passwordRules).map((r) => {
              const ok = r.test(pw);
              return (
                <li key={r.id} className={`flex items-center gap-2 text-sm ${ok ? "text-emerald-800 dark:text-emerald-300" : "text-slate-600 dark:text-slate-400"}`}>
                  {ok ? <Check aria-hidden className="h-4 w-4" /> : <span aria-hidden className="grid h-4 w-4 place-items-center"><span className="h-1.5 w-1.5 rounded-full bg-current" /></span>}
                  {r.label}<span className="sr-only">{ok ? ": done" : ": not yet"}</span>
                </li>
              );
            })}
          </ul>
        )}
      </Field>
  );
}

// ---------- Summary, checkout ----------

export function AppleSummary({ a, title = "Your order", children }: { a: AppleState; title?: string; children?: ReactNode }) {
  const tx = useT();
  const money = useMoney();
  title = tx(title);
  const info = tx.tr(methodInfo)[a.method];
  const rows: [string, ReactNode][] = a.method === "ready"
    ? [[tx("Type"), info.title], [tx("Quantity"), a.pack ? tx("{0} (partner pack)", { 0: a.pack }) : a.qty], [tx("Region"), tx("United States")], [tx("Delivery"), info.delivery]]
    : [[tx("Type"), info.title], [tx("Name"), [a.form.first, a.form.last].filter(Boolean).join(" ") || "—"], [tx("Email"), a.form.email || "—"], [tx("Delivery"), info.delivery]];
  return (
    <section aria-labelledby="apple-sum" className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-white/15 dark:bg-[#0E1424]">
      <h2 id="apple-sum" className="font-display text-lg font-semibold text-slate-900 dark:text-white">{title}</h2>
      <dl className="mt-4 divide-y divide-slate-200 text-[15px] dark:divide-white/10">
        {rows.map(([k, v]) => (
          <div key={k} className="flex justify-between gap-4 py-2.5"><dt className="text-slate-600 dark:text-slate-400">{k}</dt><dd className="min-w-0 truncate text-end font-medium text-slate-900 dark:text-white">{v}</dd></div>
        ))}
      </dl>
      <div aria-live="polite" className="mt-4 flex items-baseline justify-between border-t border-slate-200 pt-4 dark:border-white/10">
        <span className="text-slate-600 dark:text-slate-400">{tx("Total")}</span><span className="font-display text-2xl font-bold text-slate-900 dark:text-white">{money.format(a.total)}</span>
      </div>
      {children}
    </section>
  );
}

export function ContinueButton({ a, className = "", full = true, short = false }: { a: AppleState; className?: string; full?: boolean; short?: boolean }) {
  const tx = useT();
  const money = useMoney();
  // Sales paused: the page says why, the button waits. (More than the stock is fine: it is a pre-order.)
  const off = a.paused;
  if (short) return <button type="button" onClick={a.proceed} disabled={off} className={`${primary} disabled:cursor-not-allowed disabled:opacity-50 ${full ? "w-full" : ""} ${className}`}>{a.method === "ready" ? tx("Buy now") : tx("Continue")}</button>;
  return (
    <button type="button" onClick={a.proceed} disabled={off} className={`${primary} disabled:cursor-not-allowed disabled:opacity-50 ${full ? "w-full" : ""} ${className}`}>
      {a.method === "ready" ? `${a.count === 1 ? tx("Buy now") : tx("Buy {0}", { 0: tx("{0} Apple IDs", { 0: a.count }) })} · ${money.format(a.total)}` : tx("Continue to payment · {0}", { 0: money.format(a.total) })}
    </button>
  );
}

export function AppleCheckout({ a }: { a: AppleState }) {
  const tx = useT();
  const info = tx.tr(methodInfo)[a.method];
  return (
    <CheckoutModal open={a.payOpen} onClose={a.closePay} price={a.total} itemLabel={a.method === "ready" ? tx("Apple ID × {0}", { 0: a.count }) : tx("Custom Apple ID")} payLabel={tx("Pay")}
      note={a.method === "ready" ? (a.short ? tx("You get the ones ready now straight away; the rest follow in the same order. Login not working? We replace it or refund you.") : tx("Login not working? We replace it or refund you.")) : tx("Ready in about 10 minutes. You'll see it on your order page.")} onPay={a.buy}
      {...(a.live && { signIn: true, only: ["wallet", "card"] as PayMethod[], topUpHref: TOP_UP_HREF, fees: { card: 0 }, notes: { card: "Iranian bank cards, via ZarinPal" } })}
      summary={<>
        <MethodIcon m={a.method} />
        <div className="min-w-0 flex-1">
          <div className="truncate font-semibold text-slate-900 dark:text-white">{a.method === "ready" ? `${info.title}${a.count > 1 ? ` × ${a.count}` : ""}` : `${info.title} · ${a.form.first} ${a.form.last}`}</div>
          <div className="truncate text-xs text-slate-500 dark:text-slate-400">{a.method === "ready" ? tx("United States · instant") : tx("{0} · United States", { 0: a.form.email })}</div>
        </div>
      </>} />
  );
}

// ---------- After paying ----------

function Secret({ label, value }: { label: string; value: string }) {
  const tx = useT();
  const [show, setShow] = useState(false);
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3 dark:bg-white/5">
      <div className="min-w-0 flex-1">
        <div className="text-sm text-slate-600 dark:text-slate-400">{label}</div>
        <div className="truncate font-mono text-[15px] font-semibold text-slate-900 dark:text-white">{show ? value : "•".repeat(12)}</div>
      </div>
      <button onClick={() => setShow(!show)} aria-pressed={show} aria-label={tx("Show {0}", { 0: label })} className={`grid h-9 w-9 place-items-center rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-white/10 dark:text-slate-200 ${ring}`}>{show ? <EyeOff aria-hidden className="h-4 w-4" /> : <Eye aria-hidden className="h-4 w-4" />}</button>
      <CopyButton text={value} label={tx("Copy {0}", { 0: label })} />
    </div>
  );
}

// One delivered login: the real one (`acc`, live page) or a sample built from the form (design previews).
function Account({ i, custom, acc }: { i: number; custom?: AppleState["form"]; acc?: ApiAppleAccount }) {
  const tx = useT();
  const sample = sampleApple(i);
  const s = acc ? { appleId: acc.apple_id, password: acc.password, birthday: acc.birthday, answers: acc.answers } : sample;
  const id = !acc && custom ? custom.email : s.appleId;
  const bday = !acc && custom ? `${tx.tr(months)[Number(custom.month) - 1]} ${custom.day}, ${custom.year}` : s.birthday;
  return (
    <section aria-label={tx("Apple ID {0}", { 0: i + 1 })} className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-white/15 dark:bg-[#0E1424]">
      <div className="flex flex-wrap items-center gap-3">
        <span aria-hidden className="grid h-11 w-11 place-items-center rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900"><Apple className="h-5 w-5" /></span>
        <span className="min-w-0 flex-1"><span className="block text-sm text-slate-600 dark:text-slate-400">{tx("Apple ID")}</span><span className="block truncate font-mono text-lg font-semibold text-slate-900 dark:text-white">{id}</span></span>
        <CopyButton text={id} label={tx("Copy Apple ID")} />
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <Secret label={tx("Password")} value={acc ? s.password : custom?.password || s.password} />
        {bday && <Secret label={tx("Date of birth")} value={bday} />}
        {s.answers.map((x, n) => <Secret key={n} label={tx("Security answer {0}", { 0: n + 1 })} value={x} />)}
      </div>
    </section>
  );
}

export function AppleOrderView({ a }: { a: AppleState }) {
  const tx = useT();
  const o = a.order!;
  const live = !!o.accounts;
  // Design previews: custom orders take a while; the placeholder finishes after a few seconds.
  const [fakeReady, setFakeReady] = useState(o.method === "ready");
  useEffect(() => { if (live || fakeReady) return; const t = setTimeout(() => setFakeReady(true), 6000); return () => clearTimeout(t); }, [live, fakeReady]);
  const ready = live ? o.status === "delivered" : fakeReady;
  // Live: every login delivered so far (a ready order short of stock gets the rest shortly).
  const accounts = o.accounts ?? [];
  const partial = live && o.method === "ready" && !ready;
  const shown = live ? Math.min(accounts.length, 10) : Math.min(o.qty, 3);
  const more = (live ? accounts.length : o.qty) - shown;
  return (
    <div className="mx-auto max-w-3xl animate-fade-up">
      <p className="flex items-center gap-2 font-semibold text-emerald-800 dark:text-emerald-300"><Check aria-hidden className="h-5 w-5" />{tx("Payment received")}</p>
      <div aria-live="polite">
        <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
          {ready ? (o.qty > 1 ? tx("Your {0} Apple IDs are ready", { 0: o.qty }) : tx("Your Apple ID is ready")) : partial ? tx("We're finishing your order") : tx("We're creating your Apple ID")}
        </h1>
        {partial && <p className="mt-3 text-lg text-slate-700 dark:text-slate-300">{accounts.length ? tx("{0} of {1} are ready below. The rest will appear here and in your orders shortly.", { 0: accounts.length, 1: o.qty }) : tx("Your {0} Apple IDs are on the way. They will appear here and in your orders as soon as they are added; you can leave this page.", { 0: o.qty })}</p>}
        {!ready && !partial && <p className="mt-3 text-lg text-slate-700 dark:text-slate-300">{tx("This usually takes about 10 minutes. You can leave this page; the login will be in your orders.")}</p>}
      </div>

      {!ready && !partial ? (
        <ol className="mt-8 space-y-3">
          {[tx("Order received"), tx("Creating the Apple ID with your details"), tx("Ready to sign in")].map((s, i) => (
            <li key={s} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/15 dark:bg-[#0E1424]">
              <span aria-hidden className={`grid h-8 w-8 place-items-center rounded-full ${i === 0 ? "bg-emerald-700 text-white dark:bg-emerald-400 dark:text-emerald-950" : i === 1 ? "border-2 border-sky-700 dark:border-sky-400" : "border-2 border-slate-300 dark:border-white/20"}`}>
                {i === 0 ? <Check className="h-4 w-4" /> : i === 1 ? <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-sky-700 dark:bg-sky-400" /> : null}
              </span>
              <span className="text-slate-900 dark:text-white">{s}<span className="sr-only">{i === 0 ? tx(", done") : i === 1 ? tx(", in progress") : tx(", waiting")}</span></span>
            </li>
          ))}
        </ol>
      ) : (
        <div className="mt-8 space-y-4">
          {Array.from({ length: shown }, (_, i) => <Account key={i} i={i} acc={live ? accounts[i] : undefined} custom={o.method === "custom" ? o.form : undefined} />)}
          {more > 0 && <p className="text-slate-700 dark:text-slate-300">{tx("And")}{" "}{more}{" "}{tx("more in your orders, with a download of all logins.")}</p>}
        </div>
      )}

      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/dashboard/orders" className={primary}>{tx("View in my orders")}</Link>
        <button onClick={a.reset} className={secondary}>{tx("Buy another Apple ID")}</button>
      </div>
    </div>
  );
}

// What happened at the bank, or why buying is paused (live page only).
export function AppleNotices({ a, className = "" }: { a: AppleState; className?: string }) {
  const n = a.notice ?? (a.error ? { good: false, text: a.error } : null);
  if (!n) return null;
  return (
    <p role="status" className={`flex items-start gap-3 rounded-2xl px-4 py-3 text-[15px] ring-1 ${n.good ? "bg-emerald-50 text-emerald-900 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-200 dark:ring-emerald-400/25" : "bg-amber-50 text-amber-900 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-200 dark:ring-amber-400/25"} ${className}`}>
      {n.good ? <Check aria-hidden className="mt-0.5 h-4 w-4 shrink-0" /> : <X aria-hidden className="mt-0.5 h-4 w-4 shrink-0" />}{n.text}
    </p>
  );
}

// ---------- Info ----------

export function CompareTable() {
  const tx = useT();
  const live = useLiveApple();
  const money = useMoney();
  // Live page: the price row shows the real prices.
  const rows = tx.tr(compareRows).map((r, i, all) => (live && i === all.length - 1
    ? { ...r, ready: tx("{0} each", { 0: money.format(live.readyPrice) }), custom: money.format(live.customPrice) }
    : r));
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-300 dark:border-white/15">
      <table className="w-full min-w-[480px] text-[15px]">
        <caption className="sr-only">{tx("Ready and custom Apple IDs compared")}</caption>
        <thead className="bg-slate-50 dark:bg-white/5">
          <tr><td className="px-4 py-3" /><th scope="col" className="px-4 py-3 text-start font-semibold text-slate-900 dark:text-white">{tx("Ready")}</th><th scope="col" className="px-4 py-3 text-start font-semibold text-slate-900 dark:text-white">{tx("Custom")}</th></tr>
        </thead>
        <tbody className="divide-y divide-slate-200 dark:divide-white/10">
          {rows.map((r) => <tr key={r.label}><th scope="row" className="px-4 py-3 text-start font-medium text-slate-600 dark:text-slate-400">{r.label}</th><td className="px-4 py-3 text-slate-900 dark:text-white">{r.ready}</td><td className="px-4 py-3 text-slate-900 dark:text-white">{r.custom}</td></tr>)}
        </tbody>
      </table>
    </div>
  );
}

export function AppleFaq() {
  const tx = useT();
  return (
    <div className="divide-y divide-slate-200 rounded-3xl border border-slate-200 bg-white dark:divide-white/10 dark:border-white/15 dark:bg-[#0E1424]">
      {tx.tr(appleFaq).map((f) => (
        <details key={f.q} className="group p-5 [&_summary::-webkit-details-marker]:hidden">
          <summary className={`flex cursor-pointer list-none items-center justify-between gap-4 rounded-lg font-semibold text-slate-900 dark:text-white ${ring}`}>
            {f.q}<ChevronRight aria-hidden className="h-4 w-4 shrink-0 text-slate-500 transition group-open:rotate-90 rtl:rotate-180 rtl:group-open:rotate-90" />
          </summary>
          <p className="mt-3 text-[15px] leading-7 text-slate-700 dark:text-slate-300">{f.a}</p>
        </details>
      ))}
    </div>
  );
}

export function AppleTitle({ children, sub }: { children: ReactNode; sub?: ReactNode }) {
  const tx = useT();
  return (
    <div>
      <p className="flex items-center gap-1.5 text-sm font-semibold text-sky-800 dark:text-sky-300"><Apple aria-hidden className="h-4 w-4" />{tx("Apple ID · United States")}</p>
      <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl dark:text-white">{children}</h1>
      {sub && <p className="mt-4 max-w-2xl text-lg leading-relaxed text-slate-700 dark:text-slate-300">{sub}</p>}
    </div>
  );
}

export function H2({ id, children }: { id?: string; children: ReactNode }) {
  return <h2 id={id} className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-white">{children}</h2>;
}
