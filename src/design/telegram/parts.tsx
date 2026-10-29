"use client";
import { useEffect, useId, useRef, useState, type CSSProperties, type ReactNode } from "react";
import Link from "@/i18n/Link";
import { AtSign, BadgeCheck, Check, ChevronRight, Crown, Loader2, Megaphone, ShieldCheck, Star, X } from "lucide-react";
import CheckoutModal, { type PayMethod } from "@/components/checkout/CheckoutModal";
import { useMoney } from "@/lib/money";
import {
  AD_BUTTON_MAX, AD_CPM, AD_MAX_BUDGET, AD_MIN_BUDGET, AD_TEXT_MAX, adCountries, adGoals, adLanguages, adTargets, adTopics, checkUsername, cleanUsername, estViews, lookupUser,
  premiumPlans, STAR_MAX, STAR_MIN, starEach, starPrice, tgFaq, type AdGoal, type AdTarget, type PremiumPlan, type TgService, type TgUser,
} from "@/content/telegram-en";
import { field, ring } from "../googleVoice/clean";
import { useT } from "@/i18n/client";
import type { T } from "@/i18n/translate";

// Pieces shared by the Telegram Stars, Premium and Ads page offers. Accessible like the other service pages:
// labelled fields with hints and errors tied to them, real radio groups, visible focus rings, live announcements.

export { ring, field };

// ---------- Look per service ----------

export const accent = {
  stars: {
    text: "text-amber-700 dark:text-amber-300", soft: "bg-amber-100 text-amber-900 dark:bg-amber-400/15 dark:text-amber-200",
    border: "border-amber-500 dark:border-amber-400", ringOn: "has-[:focus-visible]:ring-amber-500",
    btn: `inline-flex items-center justify-center gap-2 rounded-xl bg-amber-400 px-6 py-3.5 text-base font-semibold text-amber-950 transition-colors hover:bg-amber-300 ${ring}`,
    hero: "bg-[radial-gradient(ellipse_at_top,#78350f_0%,#1c1206_55%,#0b0803_100%)]",
  },
  premium: {
    text: "text-violet-700 dark:text-violet-300", soft: "bg-violet-100 text-violet-900 dark:bg-violet-400/15 dark:text-violet-200",
    border: "border-violet-600 dark:border-violet-400", ringOn: "has-[:focus-visible]:ring-violet-500",
    btn: `inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-6 py-3.5 text-base font-semibold text-white transition hover:brightness-110 ${ring}`,
    hero: "bg-[linear-gradient(135deg,#4c1d95_0%,#6d28d9_40%,#c026d3_100%)]",
  },
  ads: {
    text: "text-sky-700 dark:text-sky-300", soft: "bg-sky-100 text-sky-900 dark:bg-sky-400/15 dark:text-sky-200",
    border: "border-sky-600 dark:border-sky-400", ringOn: "has-[:focus-visible]:ring-sky-500",
    btn: `inline-flex items-center justify-center gap-2 rounded-xl bg-sky-600 px-6 py-3.5 text-base font-semibold text-white transition-colors hover:bg-sky-700 dark:bg-sky-500 dark:text-sky-950 dark:hover:bg-sky-400 ${ring}`,
    hero: "bg-[linear-gradient(160deg,#0c4a6e_0%,#0369a1_50%,#0ea5e9_100%)]",
  },
} as const;

export const card = "rounded-3xl border border-slate-200 bg-white dark:border-white/15 dark:bg-[#0E1424]";
// See-through card for the night-sky backgrounds.
export const glass = "rounded-3xl border border-white/15 bg-white/[.06] backdrop-blur-md";

// Night-sky backgrounds (Stars D look), in Stars gold or Premium purple.
export const nightBg = {
  stars: "bg-[radial-gradient(ellipse_at_top,#78350f_0%,#1c1206_55%,#0b0803_100%)]",
  premium: "bg-[radial-gradient(ellipse_at_top,#6d28d9_0%,#2e1065_45%,#0c0618_100%)]",
} as const;
// Fixed positions so the server and browser render the same sky.
const skyDots = Array.from({ length: 80 }, (_, i) => ({ x: (i * 37) % 100, y: (i * 61) % 100, s: (i % 3) + 1, d: ((i * 7) % 30) / 10, t: 2 + (i % 4) }));
const shooting = [{ top: 12, left: 92, delay: 1 }, { top: 30, left: 70, delay: 4.5 }, { top: 6, left: 55, delay: 7.5 }];
// Twinkling stars, a few shooting stars and two slowly drifting glows. Decorative only; reduced motion turns it
// still (see globals.css).
export function NightSky({ tone }: { tone: "stars" | "premium" }) {
  const dot = tone === "stars" ? "bg-amber-100" : "bg-fuchsia-100";
  const glowA = tone === "stars" ? "bg-amber-500/20" : "bg-fuchsia-500/25";
  const glowB = tone === "stars" ? "bg-orange-600/15" : "bg-violet-500/25";
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <span className={`absolute -start-32 top-1/4 h-96 w-96 animate-drift rounded-full blur-3xl ${glowA}`} />
      <span className={`absolute -end-24 top-0 h-[28rem] w-[28rem] animate-drift rounded-full blur-3xl [animation-delay:-9s] ${glowB}`} />
      {skyDots.map((p, i) => <span key={i} className={`absolute animate-twinkle rounded-full ${dot}`} style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.s, height: p.s, animationDelay: `${p.d}s`, animationDuration: `${p.t}s` }} />)}
      {shooting.map((s, i) => (
        <span key={i} className="absolute -rotate-[25deg]" style={{ top: `${s.top}%`, left: `${s.left}%` }}>
          <span className="block h-px w-32 animate-shoot bg-gradient-to-r from-white via-white/60 to-transparent opacity-0" style={{ animationDelay: `${s.delay}s` }} />
        </span>
      ))}
    </div>
  );
}

// A light sweep across a button. Put it inside a button with `relative overflow-hidden`.
export const Shine = () => <span aria-hidden className="pointer-events-none absolute inset-y-0 start-0 w-1/3 animate-shine bg-gradient-to-r from-transparent via-white/45 to-transparent" />;

// Moves a shown number smoothly to its new value (e.g. a total). Jumps straight there when reduced motion is on.
export function useTween(value: number, ms = 450) {
  const [shown, setShown] = useState(value);
  const from = useRef(value);
  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setShown(value); from.current = value; return; }
    const start = performance.now(), a = from.current;
    let raf = 0;
    const tick = (t: number) => {
      const k = Math.min(1, (t - start) / ms), e = 1 - Math.pow(1 - k, 3);
      const v = a + (value - a) * e;
      setShown(v); from.current = v;
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, ms]);
  return shown;
}

// A price that counts smoothly to each new value. Screen readers get only the final value.
export function Tweened({ value }: { value: number }) {
  const usd = useMoney().format;
  const v = useTween(value);
  return <><span aria-hidden>{usd(v)}</span><span className="sr-only">{usd(value)}</span></>;
}

// Stars falling across the screen once (after paying for Stars or Premium).
const rain = Array.from({ length: 28 }, (_, i) => ({ x: (i * 41) % 100, d: ((i * 13) % 12) / 10, s: 14 + ((i * 7) % 4) * 6 }));
export function StarRain({ tone }: { tone: "stars" | "premium" }) {
  const [on, setOn] = useState(true);
  useEffect(() => { const t = setTimeout(() => setOn(false), 4000); return () => clearTimeout(t); }, []);
  if (!on) return null;
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[80] overflow-hidden">
      {rain.map((r, i) => <Star key={i} className={`absolute -top-10 animate-fall ${tone === "stars" ? "fill-amber-400 text-amber-400" : "fill-fuchsia-400 text-violet-400"}`} style={{ left: `${r.x}%`, width: r.s, height: r.s, animationDelay: `${r.d}s` }} />)}
    </div>
  );
}

export function ServiceIcon({ s, size = "md" }: { s: TgService; size?: "sm" | "md" | "lg" }) {
  const box = size === "lg" ? "h-14 w-14 rounded-2xl" : size === "sm" ? "h-8 w-8 rounded-lg" : "h-11 w-11 rounded-xl";
  const ic = size === "lg" ? "h-7 w-7" : size === "sm" ? "h-4 w-4" : "h-5 w-5";
  const bg = s === "stars" ? "bg-gradient-to-br from-amber-300 to-orange-500 text-white" : s === "premium" ? "bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white" : "bg-gradient-to-br from-sky-400 to-sky-600 text-white";
  const I = s === "stars" ? Star : s === "premium" ? Crown : Megaphone;
  return <span aria-hidden className={`grid shrink-0 place-items-center ${box} ${bg}`}><I className={`${ic} ${s === "stars" ? "fill-current" : ""}`} /></span>;
}

export const StarGlyph = ({ className = "h-4 w-4", style }: { className?: string; style?: CSSProperties }) => <Star aria-hidden style={style} className={`${className} fill-amber-400 text-amber-400`} />;

export function Kicker({ s, light = false }: { s: TgService; light?: boolean }) {
  const tx = useT();
  const label = s === "stars" ? tx("Telegram Stars") : s === "premium" ? tx("Telegram Premium") : tx("Telegram Ads");
  return <p className={`flex items-center gap-2 text-sm font-semibold ${light ? "text-white/85" : accent[s].text}`}><ServiceIcon s={s} size="sm" />{label}</p>;
}

export function Title({ s, children, sub, light = false, center = false }: { s: TgService; children: ReactNode; sub?: ReactNode; light?: boolean; center?: boolean }) {
  return (
    <div className={center ? "flex flex-col items-center text-center" : ""}>
      <Kicker s={s} light={light} />
      <h1 className={`mt-3 font-display text-3xl font-bold tracking-tight sm:text-5xl ${light ? "text-white" : "text-slate-900 dark:text-white"}`}>{children}</h1>
      {sub && <p className={`mt-4 max-w-2xl text-lg leading-relaxed ${light ? "text-white/85" : "text-slate-700 dark:text-slate-300"}`}>{sub}</p>}
    </div>
  );
}

export function H2({ id, children, className = "" }: { id?: string; children: ReactNode; className?: string }) {
  return <h2 id={id} className={`font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-white ${className}`}>{children}</h2>;
}

export function Trust({ items, light = false }: { items: string[]; light?: boolean }) {
  return (
    <ul className="flex flex-wrap gap-x-5 gap-y-2">
      {items.map((t) => <li key={t} className={`flex items-center gap-1.5 text-sm font-medium ${light ? "text-white/90" : "text-slate-700 dark:text-slate-300"}`}><BadgeCheck aria-hidden className={`h-4 w-4 ${light ? "text-white" : "text-emerald-700 dark:text-emerald-400"}`} />{t}</li>)}
    </ul>
  );
}

// ---------- Recipient (username) ----------

export function useRecipient() {
  const [value, setValue] = useState("");
  const [touched, setTouched] = useState(false);
  const [checking, setChecking] = useState(false);
  const [user, setUser] = useState<TgUser | null>(null);
  const error = checkUsername(value);

  // Placeholder lookup with a short delay, like the live check against the back end.
  useEffect(() => {
    setUser(null);
    if (error) { setChecking(false); return; }
    setChecking(true);
    const t = setTimeout(() => { setUser(lookupUser(cleanUsername(value))); setChecking(false); }, 450);
    return () => clearTimeout(t);
  }, [value, error]);

  return {
    value, set: setValue, touched, touch: () => setTouched(true), error, shownError: touched ? error : undefined, checking, user,
    // Placeholder for the signed-in user's own username.
    useMine: () => { setValue("my_username"); setTouched(true); },
    validate: () => { setTouched(true); return !error; },
  };
}
export type Recipient = ReturnType<typeof useRecipient>;

export function Avatar({ u, size = "md" }: { u: TgUser; size?: "sm" | "md" | "lg" }) {
  const s = size === "lg" ? "h-16 w-16 text-xl" : size === "sm" ? "h-8 w-8 text-xs" : "h-11 w-11 text-sm";
  return <span aria-hidden className={`grid shrink-0 place-items-center rounded-full font-semibold text-white ${u.color} ${s}`}>{u.initials}</span>;
}

export function UserChip({ r, s }: { r: Recipient; s: TgService }) {
  const tx = useT();
  if (r.checking) return <p className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400"><Loader2 aria-hidden className="h-4 w-4 animate-spin" />{tx("Checking the account…")}</p>;
  if (!r.user) return null;
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-slate-50 px-3 py-2.5 dark:bg-white/5">
      <Avatar u={r.user} size="sm" />
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-1 truncate font-semibold text-slate-900 dark:text-white">{r.user.name}{r.user.premium && <Star aria-label={tx("has Premium")} className="h-3.5 w-3.5 fill-violet-500 text-violet-500" />}</span>
        <span className="block truncate text-sm text-slate-600 dark:text-slate-400">@{r.user.username}</span>
      </span>
      <span className={`flex items-center gap-1 text-sm font-semibold ${accent[s].text}`}><Check aria-hidden className="h-4 w-4" />{tx("Found")}</span>
    </div>
  );
}

export function UsernameField({ r, s, id = `tg-user-${s}`, label = "Telegram username", hint = "The account that receives it. We never need a password or login code.", mine = true, chip = true, big = false, chipClass = "" }: {
  r: Recipient; s: TgService; id?: string; label?: string; hint?: string; mine?: boolean; chip?: boolean; big?: boolean; chipClass?: string;
}) {
  const tx = useT();
  label = tx(label);
  hint = tx(hint);
  const e = r.shownError;
  return (
    <div>
      <div className="flex items-end justify-between gap-3">
        <label htmlFor={id} className="text-base font-semibold text-slate-900 dark:text-white">{label}</label>
        {mine && <button type="button" onClick={r.useMine} className={`rounded-lg text-sm font-semibold underline underline-offset-2 ${accent[s].text} ${ring}`}>{tx("Use my account")}</button>}
      </div>
      {hint && <p id={`${id}-hint`} className="text-sm text-slate-600 dark:text-slate-400">{hint}</p>}
      {e && <p id={`${id}-error`} className="mt-1 flex items-start gap-1.5 text-sm font-semibold text-red-700 dark:text-red-400"><X aria-hidden className="mt-0.5 h-4 w-4 shrink-0" /><span><span className="sr-only">{tx("Error:")}{" "}</span>{e}</span></p>}
      <div className="relative mt-2">
        <AtSign aria-hidden className={`pointer-events-none absolute start-4 top-1/2 -translate-y-1/2 text-slate-500 ${big ? "h-5 w-5" : "h-4 w-4"}`} />
        <input id={id} value={r.value} onChange={(x) => r.set(x.target.value)} onBlur={r.touch} autoComplete="off" autoCapitalize="none" spellCheck={false} placeholder={tx("username")}
          aria-invalid={!!e} aria-describedby={[hint && `${id}-hint`, e && `${id}-error`].filter(Boolean).join(" ") || undefined}
          className={`${field} ${big ? "py-4 ps-11 text-lg" : "ps-10"} ${e ? "!border-red-700 focus-visible:!ring-red-600 dark:!border-red-400 dark:focus-visible:!ring-red-400" : ""}`} />
      </div>
      {/* Fixed height, so the packs below don't jump when the account is found. */}
      {chip && (
        <div aria-live="polite" className={`mt-3 flex min-h-16 flex-col justify-center ${chipClass}`}>
          {r.checking || r.user ? <UserChip r={r} s={s} /> : <p className="flex items-center gap-2 px-1 text-sm text-slate-600 dark:text-slate-400"><ShieldCheck aria-hidden className="h-4 w-4 shrink-0 text-emerald-700 dark:text-emerald-400" />{tx("We check the account before anything is sent.")}</p>}
        </div>
      )}
    </div>
  );
}

// ---------- Order (all three services) ----------

export type TgOrder = { service: TgService; title: string; detail: string; total: number; to: string; paidWith: PayMethod; at: number };

export function useCheckout() {
  const [payOpen, setPayOpen] = useState(false);
  const [order, setOrder] = useState<TgOrder | null>(null);
  return {
    payOpen, openPay: () => setPayOpen(true), closePay: () => setPayOpen(false), order,
    finish: (o: Omit<TgOrder, "at">) => { setOrder({ ...o, at: Date.now() }); setPayOpen(false); window.scrollTo({ top: 0, behavior: "smooth" }); },
    reset: () => setOrder(null),
  };
}

// ---------- Stars ----------

export function useStars(initial = 500) {
  const tx = useT();
  const r = useRecipient();
  const c = useCheckout();
  const [amount, setRaw] = useState(initial);
  const [anon, setAnon] = useState(false);
  const [amountTouched, setAmountTouched] = useState(false);
  const [tried, setTried] = useState(false);
  // Amounts over the maximum are kept (and explained), not silently cut down.
  const setAmount = (n: number) => setRaw(Math.min(STAR_MAX * 10, Math.max(0, Math.round(n) || 0)));
  const valid = amount >= tx.tr(STAR_MIN) && amount <= STAR_MAX;
  const total = valid ? starPrice(amount) : 0;
  // `amountError` is the raw check; `amountShown` waits until the field is left or Continue is pressed, so the
  // error doesn't flash while someone is still typing.
  const amountError = amount < tx.tr(STAR_MIN) ? tx("The smallest order is {0} Stars", { 0: STAR_MIN }) : amount > STAR_MAX ? tx("Up to {0} Stars per order", { 0: STAR_MAX.toLocaleString("en-US") }) : undefined;
  const amountShown = amountTouched || tried ? amountError : undefined;
  // Why Continue can't go on yet, shown under the button after a try.
  const blocker = !tried ? undefined : r.error ? (cleanUsername(r.value) ? tx("Check the username above") : tx("Add a username above to continue")) : amountError ? tx("Check the amount above") : undefined;
  // On failure, bring the first problem into view and put the cursor there.
  const proceed = () => {
    const okUser = r.validate();
    setTried(true); setAmountTouched(true);
    if (okUser && valid) { c.openPay(); return true; }
    const el = document.getElementById(!okUser ? "tg-user-stars" : "star-amount");
    if (el && el.offsetParent !== null) { el.scrollIntoView({ behavior: "smooth", block: "center" }); el.focus({ preventScroll: true }); }
    return false;
  };
  const buy = (m: PayMethod) => c.finish({ service: "stars", title: tx("{0} Telegram Stars", { 0: amount.toLocaleString("en-US") }), detail: anon ? tx("Sent anonymously") : tx("Sent with your name"), total, to: cleanUsername(r.value), paidWith: m });
  return { r, ...c, amount, setAmount, each: starEach(Math.min(STAR_MAX, Math.max(amount, tx.tr(STAR_MIN)))), total, valid, amountError, amountShown, touchAmount: () => setAmountTouched(true), blocker, anon, setAnon, proceed, buy };
}
export type StarsState = ReturnType<typeof useStars>;

// Same error style as the username field: X icon, red text, red border. Shown after leaving the field.
export function StarAmountInput({ st, id = "star-amount", label = "Or enter an amount" }: { st: StarsState; id?: string; label?: string }) {
  const tx = useT();
  label = tx(label);
  const e = st.amountShown;
  return (
    <div>
      <label htmlFor={id} className="text-base font-semibold text-slate-900 dark:text-white">{label}</label>
      <p id={`${id}-hint`} className="text-sm text-slate-600 dark:text-slate-400">{tx.tr(STAR_MIN)}{" "}{tx("to")}{" "}{STAR_MAX.toLocaleString("en-US")}{" "}{tx("Stars")}</p>
      {e && <p id={`${id}-error`} className="mt-1 flex items-start gap-1.5 text-sm font-semibold text-red-700 dark:text-red-400"><X aria-hidden className="mt-0.5 h-4 w-4 shrink-0" /><span><span className="sr-only">{tx("Error:")}{" "}</span>{e}</span></p>}
      <div className="relative mt-2">
        <StarGlyph className="pointer-events-none absolute start-4 top-1/2 h-4 w-4 -translate-y-1/2" />
        <input id={id} type="number" inputMode="numeric" min={tx.tr(STAR_MIN)} max={STAR_MAX} value={st.amount || ""} onChange={(x) => st.setAmount(Number(x.target.value))} onBlur={st.touchAmount}
          aria-invalid={!!e} aria-describedby={[`${id}-hint`, e && `${id}-error`].filter(Boolean).join(" ")} className={`${field} ps-10 font-semibold tabular-nums [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none ${e ? "!border-red-700 focus-visible:!ring-red-600 dark:!border-red-400 dark:focus-visible:!ring-red-400" : ""}`} />
      </div>
    </div>
  );
}

export function AnonToggle({ st }: { st: StarsState }) {
  const tx = useT();
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-200 p-4 dark:border-white/15">
      <input type="checkbox" checked={st.anon} onChange={(e) => st.setAnon(e.target.checked)} className={`mt-1 h-5 w-5 accent-amber-500 ${ring}`} />
      <span><span className="block font-semibold text-slate-900 dark:text-white">{tx("Send without my name")}</span><span className="text-sm text-slate-600 dark:text-slate-400">{tx("The receiver sees the Stars, not who sent them.")}</span></span>
    </label>
  );
}

export function StarsCheckout({ st }: { st: StarsState }) {
  const tx = useT();
  return (
    <CheckoutModal open={st.payOpen} onClose={st.closePay} price={st.total} itemLabel={tx("{0} Stars", { 0: st.amount.toLocaleString("en-US") })} note={tx("Delivered in 1–5 minutes. Wrong username? Nothing is sent and you're refunded.")} onPay={st.buy}
      summary={<><ServiceIcon s="stars" /><div className="min-w-0 flex-1"><div className="truncate font-semibold text-slate-900 dark:text-white">{st.amount.toLocaleString("en-US")}{" "}{tx("Telegram Stars")}</div><div className="truncate text-xs text-slate-500 dark:text-slate-400">{tx("To @")}{cleanUsername(st.r.value)}{st.anon ? tx(" · anonymous") : ""}</div></div></>} />
  );
}

// ---------- Premium ----------

export function usePremium(initialMonths = 12) {
  const tx = useT();
  const r = useRecipient();
  const c = useCheckout();
  const [plan, setPlan] = useState<PremiumPlan>(tx.tr(premiumPlans).find((p) => p.months === initialMonths) ?? tx.tr(premiumPlans)[2]);
  const [tried, setTried] = useState(false);
  // Why Continue can't go on yet, shown under the button after a try.
  const blocker = tried && r.error ? (cleanUsername(r.value) ? tx("Check the username above") : tx("Add a username above to continue")) : undefined;
  // On failure, bring the username field into view and put the cursor there.
  const proceed = () => {
    const ok = r.validate();
    setTried(true);
    if (ok) { c.openPay(); return true; }
    const el = document.getElementById("tg-user-premium");
    if (el && el.offsetParent !== null) { el.scrollIntoView({ behavior: "smooth", block: "center" }); el.focus({ preventScroll: true }); }
    return false;
  };
  const buy = (m: PayMethod) => c.finish({ service: "premium", title: tx("Telegram Premium · {0}", { 0: plan.label }), detail: tx("Gift to the username"), total: plan.price, to: cleanUsername(r.value), paidWith: m });
  return { r, ...c, plan, setPlan, total: plan.price, proceed, blocker, buy };
}
export type PremiumState = ReturnType<typeof usePremium>;

export function PremiumCheckout({ pm }: { pm: PremiumState }) {
  const tx = useT();
  return (
    <CheckoutModal open={pm.payOpen} onClose={pm.closePay} price={pm.total} itemLabel={tx("Premium · {0}", { 0: pm.plan.label })} note={tx("Activated in a few minutes on the account. Nothing else is needed from you.")} onPay={pm.buy}
      summary={<><ServiceIcon s="premium" /><div className="min-w-0 flex-1"><div className="truncate font-semibold text-slate-900 dark:text-white">{tx("Telegram Premium ·")}{" "}{pm.plan.label}</div><div className="truncate text-xs text-slate-500 dark:text-slate-400">{tx("To @")}{cleanUsername(pm.r.value)}</div></div></>} />
  );
}

// ---------- Ads ----------

export type AdForm = { goal: AdGoal; link: string; title: string; text: string; button: string; target: AdTarget; topics: string[]; channels: string; country: string; language: string; budget: number; contact: string };
type AdErrors = Partial<Record<"link" | "text" | "button" | "targeting" | "budget" | "contact", string>>;

function checkAd(f: AdForm, tx: T): AdErrors {
  const e: AdErrors = {};
  const l = f.link.trim();
  if (!l) e.link = "Enter the link your ad opens";
  else if (f.goal === "site" ? !/^https:\/\/[^\s.]+\.[^\s]{2,}$/i.test(l) : !/^(https?:\/\/)?t\.me\/[a-zA-Z][a-zA-Z0-9_]{4,31}\/?$/i.test(l)) e.link = f.goal === "site" ? "Enter a website address starting with https://" : "Enter a Telegram link like t.me/yourchannel";
  if (!f.text.trim()) e.text = "Write the text of your ad";
  else if (f.text.length > AD_TEXT_MAX) e.text = `Ad text can be at most ${AD_TEXT_MAX} characters`;
  if (f.button.length > AD_BUTTON_MAX) e.button = `Button text can be at most ${AD_BUTTON_MAX} characters`;
  if (f.target === "topics" && !f.topics.length) e.targeting = "Choose at least one topic";
  if (f.target === "channels" && !f.channels.trim()) e.targeting = "List at least one channel";
  if (!(f.budget >= AD_MIN_BUDGET)) e.budget = tx("The smallest budget is {0}", { 0: tx.usd(AD_MIN_BUDGET) });
  else if (f.budget > AD_MAX_BUDGET) e.budget = tx("For more than {0}, contact us for a custom plan", { 0: tx.usd(AD_MAX_BUDGET) });
  if (f.contact.trim() && checkUsername(f.contact)) e.contact = "Enter a valid Telegram username, or leave it empty";
  return e;
}

export function useAds(initial: Partial<AdForm> = {}) {
  const usd = useMoney().format;
  const tx = useT();
  const c = useCheckout();
  const [f, setF] = useState<AdForm>({ goal: "channel", link: "", title: "", text: "", button: tx("Open channel"), target: "topics", topics: [], channels: "", country: tx("Worldwide"), language: tx("Any"), budget: 100, contact: "", ...initial });
  const [touched, setTouched] = useState<Partial<Record<keyof AdErrors, boolean>>>({});
  const [submitted, setSubmitted] = useState(0);
  const all = checkAd(f, tx);
  const errors = Object.fromEntries(Object.entries(all).filter(([k]) => submitted || touched[k as keyof AdErrors])) as AdErrors;
  const set = <K extends keyof AdForm>(k: K, v: AdForm[K]) => setF((x) => ({ ...x, [k]: v }));
  const setGoal = (g: AdGoal) => setF((x) => ({ ...x, goal: g, button: x.button && ![tx("Open channel"), tx("Start bot"), tx("Visit site")].includes(x.button) ? x.button : g === "channel" ? tx("Open channel") : g === "bot" ? tx("Start bot") : tx("Visit site") }));
  const toggleTopic = (t: string) => setF((x) => ({ ...x, topics: x.topics.includes(t) ? x.topics.filter((y) => y !== t) : [...x.topics, t] }));
  // `keys` limits the check to one step's fields (for step-by-step designs).
  const stepOk = (keys: (keyof AdErrors)[]) => { setTouched((t) => ({ ...t, ...Object.fromEntries(keys.map((k) => [k, true])) })); return keys.every((k) => !all[k]); };
  const proceed = () => { setSubmitted((n) => n + 1); if (Object.keys(all).length) return false; c.openPay(); return true; };
  const buy = (m: PayMethod) => c.finish({ service: "ads", title: tx("Telegram Ads campaign · {0}", { 0: usd(f.budget) }), detail: tx("About {0} views", { 0: estViews(f.budget).toLocaleString("en-US") }), total: f.budget, to: f.link, paidWith: m });
  return { ...c, f, set, setGoal, toggleTopic, errors, allErrors: all, submitted, touch: (k: keyof AdErrors) => setTouched((t) => ({ ...t, [k]: true })), stepOk, proceed, buy, views: estViews(f.budget), cpm: tx.tr(AD_CPM) };
}
export type AdsState = ReturnType<typeof useAds>;

function AdField({ id, label, hint, error, count, children }: { id: string; label: string; hint?: ReactNode; error?: string; count?: ReactNode; children: ReactNode }) {
  const tx = useT();
  return (
    <div>
      <div className="flex items-end justify-between gap-3"><label htmlFor={id} className="block text-base font-semibold text-slate-900 dark:text-white">{label}</label>{count}</div>
      {hint && <p id={`${id}-hint`} className="text-sm text-slate-600 dark:text-slate-400">{hint}</p>}
      {error && <p id={`${id}-error`} className="mt-1 flex items-start gap-1.5 text-sm font-semibold text-red-700 dark:text-red-400"><X aria-hidden className="mt-0.5 h-4 w-4 shrink-0" /><span><span className="sr-only">{tx("Error:")}{" "}</span>{error}</span></p>}
      <div className="mt-2">{children}</div>
    </div>
  );
}
const desc = (id: string, hint: boolean, error?: string) => [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(" ") || undefined;
const bad = (e?: string) => (e ? "!border-red-700 dark:!border-red-400" : "");

export function GoalRadios({ a, legend = "What do you want to promote?" }: { a: AdsState; legend?: string }) {
  const tx = useT();
  legend = tx(legend);
  const name = useId();
  return (
    <fieldset>
      <legend className="text-base font-semibold text-slate-900 dark:text-white">{legend}</legend>
      <div className="mt-3 grid gap-2 sm:grid-cols-3">
        {tx.tr(adGoals).map((g) => {
          const on = a.f.goal === g.id;
          return (
            <label key={g.id} className={`flex cursor-pointer items-center gap-3 rounded-2xl border-2 px-4 py-3 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-sky-500 ${on ? accent.ads.border : "border-slate-200 hover:border-slate-400 dark:border-white/15"}`}>
              <input type="radio" name={name} checked={on} onChange={() => a.setGoal(g.id)} className="sr-only" />
              <span aria-hidden className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 ${on ? "border-sky-600 bg-sky-600 dark:border-sky-400 dark:bg-sky-400" : "border-slate-400"}`}>{on && <Check className="h-3 w-3 text-white dark:text-sky-950" strokeWidth={3} />}</span>
              <span className="font-semibold text-slate-900 dark:text-white">{g.label}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

export function LinkField({ a }: { a: AdsState }) {
  const tx = useT();
  const g = tx.tr(adGoals).find((x) => x.id === a.f.goal)!;
  const e = a.errors.link;
  return (
    <AdField id="ad-link" label={tx("Link")} hint={tx("{0}, for example {1}", { 0: g.hint, 1: g.example })} error={e}>
      <input id="ad-link" inputMode="url" autoComplete="url" spellCheck={false} value={a.f.link} onChange={(x) => a.set("link", x.target.value)} onBlur={() => a.touch("link")} placeholder={g.example}
        aria-invalid={!!e} aria-describedby={desc("ad-link", true, e)} className={`${field} ${bad(e)}`} />
    </AdField>
  );
}

export function TextField({ a, rows = 3 }: { a: AdsState; rows?: number }) {
  const tx = useT();
  const e = a.errors.text;
  const left = tx.tr(AD_TEXT_MAX) - a.f.text.length;
  return (
    <AdField id="ad-text" label={tx("Ad text")} hint={tx("Plain text, no emoji or images. Say what you offer and why to open it.")} error={e}
      count={<span aria-live="polite" className={`text-sm tabular-nums ${left < 0 ? "font-semibold text-red-700 dark:text-red-400" : left < 20 ? "text-amber-700 dark:text-amber-300" : "text-slate-500"}`}>{left}<span className="sr-only">{" "}{tx("characters left")}</span></span>}>
      <textarea id="ad-text" rows={rows} value={a.f.text} onChange={(x) => a.set("text", x.target.value)} onBlur={() => a.touch("text")}
        aria-invalid={!!e} aria-describedby={desc("ad-text", true, e)} className={`${field} resize-y ${bad(e)}`} />
    </AdField>
  );
}

export function ButtonField({ a }: { a: AdsState }) {
  const tx = useT();
  const e = a.errors.button;
  return (
    <AdField id="ad-button" label={tx("Button text")} hint={tx("Up to {0} characters", { 0: AD_BUTTON_MAX })} error={e}>
      <input id="ad-button" value={a.f.button} onChange={(x) => a.set("button", x.target.value)} onBlur={() => a.touch("button")} aria-invalid={!!e} aria-describedby={desc("ad-button", true, e)} className={`${field} ${bad(e)}`} />
    </AdField>
  );
}

export function TitleField({ a }: { a: AdsState }) {
  const tx = useT();
  return (
    <AdField id="ad-title" label={tx("Title (optional)")} hint={tx("Shown in bold above the text. Usually your channel or brand name.")}>
      <input id="ad-title" maxLength={40} value={a.f.title} onChange={(x) => a.set("title", x.target.value)} aria-describedby="ad-title-hint" className={field} />
    </AdField>
  );
}

export function TargetingFields({ a, compact = false }: { a: AdsState; compact?: boolean }) {
  const tx = useT();
  const name = useId();
  const e = a.errors.targeting;
  return (
    <div className="space-y-5">
      <fieldset>
        <legend className="text-base font-semibold text-slate-900 dark:text-white">{tx("Who should see it?")}</legend>
        <div className={`mt-3 grid gap-2 ${compact ? "" : "sm:grid-cols-3"}`}>
          {tx.tr(adTargets).map((t) => {
            const on = a.f.target === t.id;
            return (
              <label key={t.id} className={`flex cursor-pointer gap-3 rounded-2xl border-2 p-3.5 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-sky-500 ${on ? accent.ads.border : "border-slate-200 hover:border-slate-400 dark:border-white/15"}`}>
                <input type="radio" name={name} checked={on} onChange={() => a.set("target", t.id)} className="sr-only" />
                <span aria-hidden className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 ${on ? "border-sky-600 bg-sky-600 dark:border-sky-400 dark:bg-sky-400" : "border-slate-400"}`}>{on && <Check className="h-3 w-3 text-white dark:text-sky-950" strokeWidth={3} />}</span>
                <span><span className="block font-semibold text-slate-900 dark:text-white">{t.label}</span><span className="text-sm text-slate-600 dark:text-slate-400">{t.hint}</span></span>
              </label>
            );
          })}
        </div>
      </fieldset>
      {e && <p id="ad-target-error" className="flex items-start gap-1.5 text-sm font-semibold text-red-700 dark:text-red-400"><X aria-hidden className="mt-0.5 h-4 w-4 shrink-0" /><span><span className="sr-only">{tx("Error:")}{" "}</span>{e}</span></p>}
      {a.f.target === "topics" && (
        <fieldset aria-describedby={e ? "ad-target-error" : undefined}>
          <legend className="text-sm font-semibold text-slate-900 dark:text-white">{tx("Topics")}{" "}<span className="font-normal text-slate-600 dark:text-slate-400">({a.f.topics.length}{" "}{tx("chosen)")}</span></legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {tx.tr(adTopics).map((t) => {
              const on = a.f.topics.includes(t);
              return <button key={t} type="button" aria-pressed={on} onClick={() => { a.toggleTopic(t); a.touch("targeting"); }} className={`flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-semibold transition-colors ${on ? "border-sky-600 bg-sky-600 text-white dark:border-sky-400 dark:bg-sky-400 dark:text-sky-950" : "border-slate-300 text-slate-800 hover:border-slate-500 dark:border-white/20 dark:text-slate-200"} ${ring}`}>{on && <Check aria-hidden className="h-3.5 w-3.5" />}{t}</button>;
            })}
          </div>
        </fieldset>
      )}
      {a.f.target === "channels" && (
        <AdField id="ad-channels" label={tx("Channels")} hint={tx("One per line or separated by commas, like @technews")}>
          <textarea id="ad-channels" rows={3} value={a.f.channels} onChange={(x) => a.set("channels", x.target.value)} onBlur={() => a.touch("targeting")} aria-invalid={!!e} aria-describedby={["ad-channels-hint", e && "ad-target-error"].filter(Boolean).join(" ")} className={`${field} ${bad(e)}`} />
        </AdField>
      )}
      <div className={`grid gap-4 ${compact ? "" : "sm:grid-cols-2"}`}>
        <AdField id="ad-country" label={tx("Country")}>
          <select id="ad-country" value={a.f.country} onChange={(x) => a.set("country", x.target.value)} className={`${field} appearance-auto`}>{tx.tr(adCountries).map((c) => <option key={c}>{c}</option>)}</select>
        </AdField>
        <AdField id="ad-lang" label={tx("Language")}>
          <select id="ad-lang" value={a.f.language} onChange={(x) => a.set("language", x.target.value)} className={`${field} appearance-auto`}>{tx.tr(adLanguages).map((c) => <option key={c}>{c}</option>)}</select>
        </AdField>
      </div>
    </div>
  );
}

export function BudgetField({ a, slider = true }: { a: AdsState; slider?: boolean }) {
  const usd = useMoney().format;
  const tx = useT();
  const e = a.errors.budget;
  return (
    <AdField id="ad-budget" label={tx("Budget")} hint={tx("{0} to {1}. Unspent money is refunded.", { 0: usd(AD_MIN_BUDGET), 1: usd(AD_MAX_BUDGET) })} error={e}>
      <div className="flex items-center gap-4">
        <div className="relative w-36 shrink-0">
          <span aria-hidden className="pointer-events-none absolute start-4 top-1/2 -translate-y-1/2 font-semibold text-slate-500">$</span>
          <input id="ad-budget" type="number" inputMode="numeric" min={tx.tr(AD_MIN_BUDGET)} max={AD_MAX_BUDGET} step={10} value={a.f.budget || ""} onChange={(x) => a.set("budget", Number(x.target.value))} onBlur={() => a.touch("budget")}
            aria-invalid={!!e} aria-describedby={desc("ad-budget", true, e)} className={`${field} ps-8 font-semibold ${bad(e)}`} />
        </div>
        {slider && <input type="range" aria-label={tx("Budget slider")} min={tx.tr(AD_MIN_BUDGET)} max={2000} step={10} value={Math.min(2000, Math.max(tx.tr(AD_MIN_BUDGET), a.f.budget || 0))} onChange={(x) => a.set("budget", Number(x.target.value))} className="w-full accent-sky-600" />}
      </div>
    </AdField>
  );
}

export function ContactField({ a }: { a: AdsState }) {
  const tx = useT();
  const e = a.errors.contact;
  return (
    <AdField id="ad-contact" label={tx("Your Telegram (optional)")} hint={tx("So we can message you if Telegram asks for changes.")} error={e}>
      <div className="relative">
        <AtSign aria-hidden className="pointer-events-none absolute start-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
        <input id="ad-contact" autoComplete="off" autoCapitalize="none" spellCheck={false} value={a.f.contact} onChange={(x) => a.set("contact", x.target.value)} onBlur={() => a.touch("contact")}
          aria-invalid={!!e} aria-describedby={desc("ad-contact", true, e)} className={`${field} ps-10 ${bad(e)}`} />
      </div>
    </AdField>
  );
}

export function AdErrorSummary({ a }: { a: AdsState }) {
  const tx = useT();
  const list = Object.entries(a.allErrors);
  if (!a.submitted || !list.length) return null;
  const target: Record<string, string> = { link: "ad-link", text: "ad-text", button: "ad-button", targeting: a.f.target === "channels" ? "ad-channels" : "ad-country", budget: "ad-budget", contact: "ad-contact" };
  return (
    <div role="alert" className="rounded-2xl border-2 border-red-700 bg-red-50 p-5 dark:border-red-400 dark:bg-red-500/10">
      <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-white">{tx("Please fix")}{" "}{list.length === 1 ? "this" : tx("these {0} things", { 0: list.length })}</h2>
      <ul className="mt-2 space-y-1">{list.map(([k, m]) => <li key={k}><a href={`#${target[k]}`} onClick={(ev) => { ev.preventDefault(); document.getElementById(target[k])?.focus(); }} className={`font-semibold text-red-800 underline underline-offset-2 dark:text-red-300 ${ring}`}>{m}</a></li>)}</ul>
    </div>
  );
}

// How the ad looks: a channel post with the sponsored message under it, Telegram style.
export function AdPreview({ a, dark = false, className = "" }: { a: AdsState; dark?: boolean; className?: string }) {
  const tx = useT();
  const text = a.f.text.trim() || tx("Your ad text appears here. Tell people what you offer in up to 160 characters.");
  const title = a.f.title.trim() || (a.f.goal === "site" ? tx("Your brand") : tx("Your channel"));
  return (
    <figure aria-label={tx("Ad preview")} className={`overflow-hidden rounded-[1.75rem] ${dark ? "bg-[#0e1621]" : "bg-[#b7d3a8] dark:bg-[#0e1621]"} ${className}`}>
      <div className={`flex items-center gap-3 px-4 py-3 ${dark ? "bg-[#17212b] text-white" : "bg-white text-slate-900 dark:bg-[#17212b] dark:text-white"}`}>
        <span aria-hidden className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 text-sm font-bold text-white">{tx("TN")}</span>
        <span className="min-w-0"><span className="block truncate text-sm font-semibold">{tx("Tech News Daily")}</span><span className={`block text-xs ${dark ? "text-slate-400" : "text-slate-500 dark:text-slate-400"}`}>{tx("128,450 subscribers")}</span></span>
      </div>
      <div className="space-y-2 p-4">
        <div className={`max-w-[85%] rounded-2xl rounded-bl-md px-3.5 py-2.5 text-[14px] leading-snug ${dark ? "bg-[#182533] text-slate-200" : "bg-white text-slate-800 dark:bg-[#182533] dark:text-slate-200"}`}>
          {tx("New phones announced this week: here's what changed and what didn't.")}
          <span className="mt-1 block text-end text-[11px] text-slate-400">👁 41K · 12:04</span>
        </div>
        <div className={`max-w-[85%] rounded-2xl rounded-bl-md px-3.5 py-2.5 text-[14px] leading-snug ${dark ? "bg-[#182533] text-slate-100" : "bg-white text-slate-900 dark:bg-[#182533] dark:text-slate-100"}`}>
          <span className="flex items-center justify-between gap-3"><span className="font-semibold text-sky-600 dark:text-sky-400">{title}</span><span className="text-[11px] font-medium text-slate-400">{tx("Ad")}</span></span>
          <span aria-live="polite" className={`mt-1 block whitespace-pre-wrap break-words ${a.f.text.trim() ? "" : "text-slate-400"}`}>{text.slice(0, tx.tr(AD_TEXT_MAX))}</span>
          <span className="mt-2.5 block rounded-lg bg-sky-500/10 py-2 text-center text-sm font-semibold text-sky-600 dark:text-sky-400">{a.f.button.trim() || tx("Open")}</span>
        </div>
      </div>
      <figcaption className="sr-only">{tx("Your ad as a sponsored message under a channel post")}</figcaption>
    </figure>
  );
}

export function AdsCheckout({ a }: { a: AdsState }) {
  const usd = useMoney().format;
  const tx = useT();
  return (
    <CheckoutModal open={a.payOpen} onClose={a.closePay} price={a.f.budget} itemLabel={tx("Ad budget")} payLabel={tx("Pay and submit")} note={tx("Telegram reviews the ad in about 24 hours. If it's rejected and can't be fixed, you're refunded in full.")} onPay={a.buy}
      summary={<><ServiceIcon s="ads" /><div className="min-w-0 flex-1"><div className="truncate font-semibold text-slate-900 dark:text-white">{tx("Telegram Ads ·")}{" "}{usd(a.f.budget)}</div><div className="truncate text-xs text-slate-500 dark:text-slate-400">{a.f.link || tx("Your link")}{" "}{tx("· about")}{" "}{a.views.toLocaleString("en-US")}{" "}{tx("views")}</div></div></>} />
  );
}

// ---------- After paying ----------

const orderSteps: Record<TgService, string[]> = {
  stars: ["Payment received", "Sending Stars to the account", "Delivered"],
  premium: ["Payment received", "Gifting Premium to the account", "Premium is active"],
  ads: ["Payment received", "Ad submitted to Telegram", "Telegram review (about 24 hours)", "Running"],
};

export function TgOrderView({ o, onAgain }: { o: TgOrder; onAgain: () => void }) {
  const usd = useMoney().format;
  const tx = useT();
  const steps = tx.tr(orderSteps)[o.service];
  const last = o.service === "ads" ? 1 : steps.length - 1;
  const [done, setDone] = useState(1);
  useEffect(() => { if (done >= last) return; const t = setTimeout(() => setDone((d) => d + 1), 2500); return () => clearTimeout(t); }, [done, last]);
  const finished = done >= last && o.service !== "ads";
  return (
    <div className="mx-auto max-w-2xl animate-fade-up">
      {finished && o.service !== "ads" && <StarRain tone={o.service} />}
      <p className="flex items-center gap-2 font-semibold text-emerald-800 dark:text-emerald-300"><Check aria-hidden className="h-5 w-5" />{tx("Payment received ·")}{" "}{usd(o.total)}</p>
      <h1 aria-live="polite" className="mt-3 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
        {o.service === "ads" ? tx("Your ad is on its way to Telegram") : finished ? (o.service === "stars" ? tx("Stars delivered") : tx("Premium is active")) : o.service === "stars" ? tx("Sending your Stars") : tx("Activating Premium")}
      </h1>
      <div className={`${tx.tr(card)} mt-6 flex items-center gap-4 p-5`}>
        <ServiceIcon s={o.service} />
        <div className="min-w-0 flex-1"><div className="truncate font-semibold text-slate-900 dark:text-white">{o.title}</div><div className="truncate text-sm text-slate-600 dark:text-slate-400">{o.service === "ads" ? o.to : `@${o.to}`} · {o.detail}</div></div>
      </div>
      <ol className="mt-6 space-y-3">
        {steps.map((s, i) => {
          const state = i < done || (finished && i === done) ? "done" : i === done ? "now" : "wait";
          return (
            <li key={s} className={`${tx.tr(card)} flex items-center gap-3 p-4`}>
              <span aria-hidden className={`grid h-8 w-8 place-items-center rounded-full ${state === "done" ? "bg-emerald-700 text-white dark:bg-emerald-400 dark:text-emerald-950" : state === "now" ? "border-2 border-sky-700 dark:border-sky-400" : "border-2 border-slate-300 dark:border-white/20"}`}>
                {state === "done" ? <Check className="h-4 w-4" /> : state === "now" ? <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-sky-700 dark:bg-sky-400" /> : null}
              </span>
              <span className="text-slate-900 dark:text-white">{s}<span className="sr-only">{state === "done" ? tx(", done") : state === "now" ? tx(", in progress") : tx(", waiting")}</span></span>
            </li>
          );
        })}
      </ol>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/dashboard/orders" className={accent[o.service].btn}>{tx("View in my orders")}</Link>
        <button onClick={onAgain} className={`inline-flex items-center justify-center rounded-xl border border-slate-300 px-6 py-3.5 font-semibold text-slate-800 hover:bg-slate-50 dark:border-white/20 dark:text-slate-100 dark:hover:bg-white/5 ${ring}`}>{o.service === "ads" ? tx("Create another ad") : tx("Buy again")}</button>
      </div>
    </div>
  );
}

// ---------- Info ----------

export function TgFaq({ s }: { s: TgService }) {
  const tx = useT();
  return (
    <div className={`${tx.tr(card)} divide-y divide-slate-200 dark:divide-white/10`}>
      {tx.tr(tgFaq)[s].map((f) => (
        <details key={f.q} className="group p-5 [&_summary::-webkit-details-marker]:hidden">
          <summary className={`flex cursor-pointer list-none items-center justify-between gap-4 rounded-lg font-semibold text-slate-900 dark:text-white ${ring}`}>{f.q}<ChevronRight aria-hidden className="h-4 w-4 shrink-0 text-slate-500 transition group-open:rotate-90 rtl:rotate-180 rtl:group-open:rotate-90" /></summary>
          <p className="mt-3 text-[15px] leading-7 text-slate-700 dark:text-slate-300">{f.a}</p>
        </details>
      ))}
    </div>
  );
}

export function SumRows({ rows }: { rows: [string, ReactNode][] }) {
  return (
    <dl className="divide-y divide-slate-200 text-[15px] dark:divide-white/10">
      {rows.map(([k, v]) => <div key={k} className="flex justify-between gap-4 py-2.5"><dt className="text-slate-600 dark:text-slate-400">{k}</dt><dd className="min-w-0 truncate text-end font-medium text-slate-900 dark:text-white">{v}</dd></div>)}
    </dl>
  );
}
