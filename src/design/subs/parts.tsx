"use client";
import { useEffect, useId, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import Link from "@/i18n/Link";
import { Bot, Briefcase, Check, LayoutGrid, ChevronRight, Clapperboard, Clock, Eye, EyeOff, KeyRound, LineChart, Music2, Palette, Search, UserCheck, X, type LucideIcon } from "lucide-react";
import CheckoutModal, { type PayMethod } from "@/components/checkout/CheckoutModal";
import { useMoney } from "@/lib/money";
import { fromPrice, savePct, subCats, subs, subsFaq, type SubCat, type SubPlan, type SubProduct } from "@/content/subs-en";
import { CopyButton } from "../otp/parts";
import { field, primary, ring, secondary } from "../googleVoice/clean";
import { useT } from "@/i18n/client";

// Pieces shared by the Subscriptions page offers. Accessible like the other product pages: real radio groups,
// labelled fields with hints and errors tied to them, focus moved to the first problem, visible focus rings.

// ---------- State ----------

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export type SubOrder = { product: SubProduct; plan: SubPlan; values: Record<string, string>; paidWith: PayMethod };

export function useSubs(initial?: string) {
  const tx = useT();
  const [product, setProduct] = useState<SubProduct | null>(tx.tr(subs).find((s) => s.slug === initial) ?? null);
  const [plan, setPlan] = useState<SubPlan | null>(product ? product.plans[0] : null);
  const [values, setValues] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState(false);
  const [payOpen, setPayOpen] = useState(false);
  const [order, setOrder] = useState<SubOrder | null>(null);

  const select = (p: SubProduct | null) => {
    setProduct(p);
    setPlan(p ? p.plans[0] : null);
    // Selects start on their first option.
    setValues(Object.fromEntries((p?.fields ?? []).filter((f) => f.options).map((f) => [f.id, f.options![0]])));
    setTouched({}); setSubmitted(false);
  };

  const all: Record<string, string> = {};
  for (const f of product?.fields ?? []) {
    const v = (values[f.id] ?? "").trim();
    // "Your Discord username" → "Enter your Discord username"; "Email of your Canva account" → "Enter the email of…"
    const what = /^your /i.test(f.label) ? `y${f.label.slice(1)}` : `the ${f.label.charAt(0).toLowerCase()}${f.label.slice(1)}`;
    if (!v && !f.optional) all[f.id] = `${f.type === "select" ? tx("Choose") : tx("Enter")} ${what}`;
    else if (v && f.type === "email" && !EMAIL.test(v)) all[f.id] = tx("Enter an email address in the correct format, like name@example.com");
  }
  const errors = Object.fromEntries(Object.entries(all).filter(([k]) => submitted || touched[k]));

  // Opens payment, or focuses the first field with a problem.
  const proceed = () => {
    setSubmitted(true);
    const bad = product?.fields.find((f) => all[f.id]);
    if (bad) { document.getElementById(`sub-${bad.id}`)?.focus(); return false; }
    if (product && plan) setPayOpen(true);
    return true;
  };
  // One tap on a plan: picks product and plan together, then opens payment straight away when the product needs
  // nothing typed in. Returns true when the buyer still has fields to fill (the caller shows them).
  const quickBuy = (p: SubProduct, pl: SubPlan) => {
    select(p);
    setPlan(pl);
    const needs = p.fields.some((f) => !f.options && !f.optional);
    if (!needs) setPayOpen(true);
    return needs;
  };
  const buy = (m: PayMethod) => {
    if (!product || !plan) return;
    setOrder({ product, plan, values, paidWith: m });
    setPayOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return {
    product, select, plan, setPlan, values, set: (k: string, v: string) => setValues((x) => ({ ...x, [k]: v })),
    touch: (k: string) => setTouched((t) => ({ ...t, [k]: true })), errors, proceed, quickBuy,
    payOpen, closePay: () => setPayOpen(false), order, buy, reset: () => { setOrder(null); select(null); },
  };
}
export type Subs = ReturnType<typeof useSubs>;

// Category filter + search over the catalog.
export function useCatalog() {
  const tx = useT();
  const [cat, setCat] = useState<SubCat | "all">("all");
  const [q, setQ] = useState("");
  const t = q.trim().toLowerCase();
  const list = tx.tr(subs).filter((p) => (cat === "all" || p.cat === cat) && (!t || `${p.name} ${p.tagline}`.toLowerCase().includes(t)));
  return { cat, setCat, q, setQ, list };
}

// ---------- Product visuals ----------

export function Tile({ p, size = "md" }: { p: SubProduct; size?: "sm" | "md" | "lg" }) {
  const s = size === "lg" ? "h-16 w-16 rounded-2xl text-2xl" : size === "sm" ? "h-9 w-9 rounded-lg text-sm" : "h-12 w-12 rounded-xl text-lg";
  return <span aria-hidden className={`grid shrink-0 place-items-center font-display font-bold text-white ${p.color} ${s}`}>{p.letter}</span>;
}

// How the subscription is delivered: an outlined tag with the icon in a small coloured circle. The colour is only a
// hint; the words carry the meaning, and the title explains it on hover.
export function ActivationBadge({ p }: { p: SubProduct }) {
  const tx = useT();
  const own = p.activation === "own";
  const Icon = own ? UserCheck : KeyRound;
  return (
    <span title={own ? tx("We activate the plan on your own account; you never share a password.") : tx("You receive a ready account login.")}
      className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border border-slate-300 bg-white py-0.5 pe-2.5 ps-0.5 text-xs font-semibold text-slate-800 dark:border-white/20 dark:bg-white/5 dark:text-slate-100">
      <span aria-hidden className={`grid h-5 w-5 place-items-center rounded-full ${own ? "bg-emerald-600 text-white dark:bg-emerald-400 dark:text-emerald-950" : "bg-amber-500 text-white dark:bg-amber-400 dark:text-amber-950"}`}><Icon className="h-3 w-3" strokeWidth={2.5} /></span>
      {own ? tx("On your account") : tx("Ready account")}
    </span>
  );
}

// ---------- Catalog controls ----------

export function CatChips({ c }: { c: ReturnType<typeof useCatalog> }) {
  const tx = useT();
  const name = useId();
  return (
    <fieldset>
      <legend className="sr-only">{tx("Category")}</legend>
      <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
        {[{ id: "all" as const, label: tx("All") }, ...tx.tr(subCats)].map((x) => {
          const on = c.cat === x.id;
          return (
            <label key={x.id} className={`shrink-0 cursor-pointer rounded-full border-2 px-4 py-2 text-[15px] font-semibold transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-violet-600 has-[:focus-visible]:ring-offset-2 dark:has-[:focus-visible]:ring-violet-400 dark:has-[:focus-visible]:ring-offset-[#070B14] ${on ? "border-slate-900 bg-slate-900 text-white dark:border-white dark:bg-white dark:text-slate-900" : "border-slate-300 bg-white text-slate-800 hover:border-slate-500 dark:border-white/20 dark:bg-transparent dark:text-slate-100"}`}>
              <input type="radio" autoComplete="off" name={name} checked={on} onChange={() => c.setCat(x.id)} className="sr-only" />{x.label}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

export function SearchBox({ c, className = "", big = false }: { c: ReturnType<typeof useCatalog>; className?: string; big?: boolean }) {
  const tx = useT();
  return (
    <div className={className}>
      <label className="relative block">
        <span className="sr-only">{tx("Search subscriptions")}</span>
        <Search aria-hidden className={`pointer-events-none absolute start-4 top-1/2 -translate-y-1/2 text-slate-500 ${big ? "h-5 w-5" : "h-4 w-4"}`} />
        <input type="search" value={c.q} onChange={(e) => c.setQ(e.target.value)} placeholder={tx("Search ChatGPT, Netflix, Canva…")} autoComplete="off" className={`${field} ${big ? "py-4 ps-12 text-lg shadow-xl shadow-black/20" : "ps-11"}`} />
      </label>
      <p aria-live="polite" className="sr-only">{c.list.length}{" "}{tx("subscriptions")}</p>
    </div>
  );
}

// A product to pick (a button: picking shows its plans).
// `more` adds a "Read more" link to the subscription's own page. A link can't sit inside a button, so then the card
// is a box with a full-size select button layered under its content and the link on top of it.
export function ProductButton({ p, on, onPick, layout = "card", more = false }: { p: SubProduct; on: boolean; onPick: () => void; layout?: "card" | "row"; more?: boolean }) {
  const usd = useMoney().format;
  const tx = useT();
  const from = fromPrice(p);
  if (layout === "row") return (
    <button onClick={onPick} aria-pressed={on} className={`flex w-full items-center gap-3 rounded-2xl border-2 bg-white px-3 py-3 text-start transition-colors dark:bg-[#0E1424] ${on ? "border-violet-700 dark:border-violet-400" : "border-transparent hover:border-slate-300 dark:hover:border-white/20"} ${ring}`}>
      <Tile p={p} size="sm" />
      <span className="min-w-0 flex-1"><span className="block truncate font-semibold text-slate-900 dark:text-white">{p.name}</span><span className="text-sm text-slate-600 dark:text-slate-400">{tx("from")}{" "}{usd(from)}{tx("/mo")}</span></span>
      <ChevronRight aria-hidden className="h-4 w-4 text-slate-400 rtl:rotate-180" />
    </button>
  );
  // Catalog card in the style of the social platform cards (/virtual-service): washed in the product's own brand
  // colour with a soft glow in the corner; on hover it lifts slowly, the glow swells and the logo follows. The whole
  // card picks the product (a real button underneath); "Read more" opens its own page.
  if (more) {
    const hex = p.color.match(/#[0-9a-f]{6}/i)?.[0] ?? "#64748b";
    const ease = "ease-[cubic-bezier(0.22,1,0.36,1)]";
    const wash = { backgroundImage: `linear-gradient(color-mix(in srgb, ${hex} 9%, transparent), color-mix(in srgb, ${hex} 9%, transparent))` };
    return (
      <div style={wash} className={`group relative flex h-full flex-col overflow-hidden rounded-3xl border-2 bg-white p-5 transition-[translate,box-shadow,border-color] duration-700 ${ease} hover:-translate-y-1 hover:shadow-[0_18px_40px_-18px_rgba(15,23,42,.28)] has-[button:focus-visible]:ring-2 has-[button:focus-visible]:ring-violet-600 has-[button:focus-visible]:ring-offset-2 dark:bg-[#0E1424] dark:hover:shadow-[0_18px_40px_-18px_rgba(0,0,0,.8)] dark:has-[button:focus-visible]:ring-violet-400 dark:has-[button:focus-visible]:ring-offset-[#070B14] ${on ? "border-violet-700 dark:border-violet-400" : "border-slate-200 hover:border-slate-300 dark:border-white/10 dark:hover:border-white/25"}`}>
        <span aria-hidden style={{ backgroundColor: hex }} className={`pointer-events-none absolute -end-10 -top-10 h-32 w-32 rounded-full opacity-15 blur-2xl transition-[scale,opacity] duration-1000 ${ease} group-hover:scale-150 group-hover:opacity-30`} />
        <button onClick={onPick} aria-pressed={on} className="absolute inset-0 z-[1] rounded-3xl outline-none"><span className="sr-only">{tx("Choose {0}, from {1} a month", { 0: p.name, 1: usd(from) })}</span></button>
        <span aria-hidden className="pointer-events-none relative flex items-start justify-between gap-3">
          <span className={`block transition-[translate,scale] duration-700 ${ease} group-hover:-translate-y-0.5 group-hover:scale-[1.06]`}><Tile p={p} /></span>
          {on
            ? <span className="inline-flex items-center gap-1 rounded-full bg-violet-700 px-2 py-0.5 text-xs font-semibold text-white dark:bg-violet-400 dark:text-violet-950"><Check className="h-3 w-3" strokeWidth={3} />{tx("Selected")}</span>
            : p.popular && <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-900 dark:bg-amber-500/20 dark:text-amber-200">{tx("Popular")}</span>}
        </span>
        <span className="pointer-events-none relative mt-4 block font-display text-lg font-bold text-slate-900 dark:text-white">{p.name}</span>
        <span className="pointer-events-none relative mt-1 block text-sm text-slate-700 dark:text-slate-300">{p.tagline}</span>
        <span className="pointer-events-none relative mb-5 mt-4 flex"><ActivationBadge p={p} /></span>
        <span className="relative mt-auto flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 border-t border-slate-900/10 pt-4 text-sm dark:border-white/10">
          <span className="pointer-events-none whitespace-nowrap text-slate-700 dark:text-slate-300">{tx("from")}{" "}<b className="font-display text-base tabular-nums text-slate-900 dark:text-white">{usd(from)}</b>{tx("/mo")}</span>
          <Link href={`/accounts/${p.slug}`} className={`relative z-[2] inline-flex items-center gap-1 whitespace-nowrap rounded-lg font-semibold text-violet-800 underline-offset-4 hover:underline dark:text-violet-300 ${ring}`}>
            {tx("Read more")}<span className="sr-only">{" "}{tx("about")}{" "}{p.name}</span><ChevronRight aria-hidden className={`h-4 w-4 transition-[translate] duration-700 ${ease} group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1`} />
          </Link>
        </span>
      </div>
    );
  }
  return (
    <button onClick={onPick} aria-pressed={on} className={`flex h-full w-full flex-col rounded-3xl border-2 bg-white p-5 text-start transition-colors dark:bg-[#0E1424] ${on ? "border-violet-700 dark:border-violet-400" : "border-slate-200 hover:border-slate-400 dark:border-white/15 dark:hover:border-white/40"} ${ring}`}>
      <span className="flex items-start justify-between gap-3"><Tile p={p} />{p.popular && <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-900 dark:bg-amber-500/20 dark:text-amber-200">{tx("Popular")}</span>}</span>
      <span className="mt-4 block font-display text-lg font-semibold text-slate-900 dark:text-white">{p.name}</span>
      <span className="mt-1 block flex-1 text-[15px] text-slate-600 dark:text-slate-400">{p.tagline}</span>
      <span className="mt-4 flex flex-wrap items-center justify-between gap-2"><ActivationBadge p={p} /><span className="text-sm text-slate-700 dark:text-slate-300">{tx("from")}{" "}<b className="text-base text-slate-900 dark:text-white">{usd(from)}</b>{tx("/mo")}</span></span>
    </button>
  );
}

// ---------- Product detail ----------

// `focusable` lets a design move focus to the heading after a pick (keyboard and screen-reader users land here).
export function ProductHeader({ p, as = "h2", focusable = false }: { p: SubProduct; as?: "h1" | "h2"; focusable?: boolean }) {
  const H = as;
  return (
    <div className="flex items-start gap-4">
      <Tile p={p} size="lg" />
      <div className="min-w-0">
        <H tabIndex={focusable ? -1 : undefined} className="font-display text-2xl font-bold tracking-tight text-slate-900 outline-none sm:text-3xl dark:text-white">{p.name}</H>
        <p className="mt-1 text-slate-700 dark:text-slate-300">{p.tagline}</p>
        <p className="mt-2 flex flex-wrap items-center gap-2 text-sm text-slate-700 dark:text-slate-300"><ActivationBadge p={p} /><span className="inline-flex items-center gap-1"><Clock aria-hidden className="h-4 w-4" />{p.delivery}</span></p>
      </div>
    </div>
  );
}

export function PlanRadios({ s, cols = 2 }: { s: Subs; cols?: 1 | 2 | 3 }) {
  const usd = useMoney().format;
  const tx = useT();
  const name = useId();
  const p = s.product!;
  return (
    <fieldset>
      <legend className="text-base font-semibold text-slate-900 dark:text-white">{tx("Choose a plan")}</legend>
      <div className={`mt-3 grid gap-2.5 ${cols === 2 ? "sm:grid-cols-2" : cols === 3 ? "sm:grid-cols-3" : ""}`}>
        {p.plans.map((pl) => {
          const on = s.plan?.id === pl.id;
          const save = savePct(pl);
          return (
            <label key={pl.id} className={`relative flex cursor-pointer items-center gap-3 rounded-2xl border-2 bg-white px-4 py-3 transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-violet-600 has-[:focus-visible]:ring-offset-2 dark:bg-[#0E1424] dark:has-[:focus-visible]:ring-violet-400 dark:has-[:focus-visible]:ring-offset-[#070B14] ${on ? "border-violet-700 dark:border-violet-400" : "border-slate-200 hover:border-slate-400 dark:border-white/15 dark:hover:border-white/40"}`}>
              <input type="radio" autoComplete="off" name={name} checked={on} onChange={() => s.setPlan(pl)} className="sr-only" />
              <span aria-hidden className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 ${on ? "border-violet-700 bg-violet-700 dark:border-violet-400 dark:bg-violet-400" : "border-slate-400 dark:border-white/30"}`}>{on && <Check className="h-3.5 w-3.5 text-white dark:text-violet-950" strokeWidth={3} />}</span>
              <span className="min-w-0 flex-1">
                <span className="block font-semibold text-slate-900 dark:text-white">{pl.name}</span>
                <span className="text-sm text-slate-600 dark:text-slate-400">{usd(pl.price / pl.months)}{tx("/mo")}{save > 0 && <span className="font-semibold text-amber-800 dark:text-amber-300">{" "}{tx("· save")}{" "}{save}%</span>}</span>
              </span>
              <span className="text-end">
                {pl.was && <span className="block text-sm text-slate-500 line-through dark:text-slate-400"><span className="sr-only">{tx("Was")}{" "}</span>{usd(pl.was)}</span>}
                <span className="font-bold text-slate-900 dark:text-white">{usd(pl.price)}</span>
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

export function FieldsForm({ s }: { s: Subs }) {
  const tx = useT();
  const p = s.product!;
  if (!p.fields.length) return null;
  return (
    <div className="space-y-5">
      {p.fields.map((f) => {
        const id = `sub-${f.id}`;
        const err = s.errors[f.id];
        const describedBy = [f.hint && `${id}-hint`, err && `${id}-error`].filter(Boolean).join(" ") || undefined;
        const cls = `${field} mt-2 ${err ? tx("!border-red-700 dark:!border-red-400") : ""}`;
        return (
          <div key={f.id}>
            <label htmlFor={id} className="block text-base font-semibold text-slate-900 dark:text-white">{f.label}{f.optional && <span className="font-normal text-slate-600 dark:text-slate-400">{" "}{tx("(optional)")}</span>}</label>
            {f.hint && <p id={`${id}-hint`} className="text-sm text-slate-600 dark:text-slate-400">{f.hint}</p>}
            {err && <p id={`${id}-error`} className="mt-1 flex items-start gap-1.5 text-sm font-semibold text-red-700 dark:text-red-400"><X aria-hidden className="mt-0.5 h-4 w-4 shrink-0" /><span><span className="sr-only">{tx("Error:")}{" "}</span>{err}</span></p>}
            {f.type === "select" ? (
              <select id={id} value={s.values[f.id] ?? ""} onChange={(e) => s.set(f.id, e.target.value)} aria-invalid={!!err} aria-describedby={describedBy} className={`${cls} appearance-auto`}>
                {f.options!.map((o) => <option key={o}>{o}</option>)}
              </select>
            ) : (
              <input id={id} type={f.type === "email" ? "email" : "text"} inputMode={f.type === "email" ? "email" : undefined} autoComplete={f.type === "email" ? "email" : "off"} spellCheck={false}
                value={s.values[f.id] ?? ""} onChange={(e) => s.set(f.id, e.target.value)} onBlur={() => s.touch(f.id)} aria-invalid={!!err} aria-describedby={describedBy} className={cls} />
            )}
          </div>
        );
      })}
    </div>
  );
}

export function Notes({ p }: { p: SubProduct }) {
  return (
    <ul className="space-y-2">
      {p.notes.map((n) => <li key={n} className="flex gap-2 text-[15px] text-slate-700 dark:text-slate-300"><Check aria-hidden className="mt-1 h-4 w-4 shrink-0 text-violet-700 dark:text-violet-400" />{n}</li>)}
    </ul>
  );
}

// `onBuy` replaces the default (e.g. to close a sheet first); it should call s.proceed().
export function BuyButton({ s, className = "", label, onBuy }: { s: Subs; className?: string; label?: string; onBuy?: () => void }) {
  const usd = useMoney().format;
  const tx = useT();
  return <button type="button" onClick={onBuy ?? s.proceed} className={`${primary} w-full ${className}`}>{label ?? tx("Continue · {0}", { 0: s.plan ? usd(s.plan.price) : "" })}</button>;
}

// Plans, fields, notes and buy for the chosen product, in one block.
export function ProductPanel({ s, heading = "h2", cols = 2, focusable = false, onBuy }: { s: Subs; heading?: "h1" | "h2"; cols?: 1 | 2 | 3; focusable?: boolean; onBuy?: () => void }) {
  const usd = useMoney().format;
  const tx = useT();
  const p = s.product!;
  return (
    <div className="space-y-6">
      <ProductHeader p={p} as={heading} focusable={focusable} />
      <PlanRadios s={s} cols={cols} />
      <FieldsForm s={s} />
      <Notes p={p} />
      <div aria-live="polite" className="flex items-baseline justify-between border-t border-slate-200 pt-5 dark:border-white/10">
        <span className="text-slate-700 dark:text-slate-300">{tx("Total")}</span>
        <span className="font-display text-3xl font-bold text-slate-900 dark:text-white">{s.plan ? usd(s.plan.price) : "—"}</span>
      </div>
      <BuyButton s={s} onBuy={onBuy} />
    </div>
  );
}

export function SubsCheckout({ s }: { s: Subs }) {
  const tx = useT();
  const p = s.product, pl = s.plan;
  return (
    <CheckoutModal open={s.payOpen && !!p && !!pl} onClose={s.closePay} price={pl?.price ?? 0} itemLabel={pl ? `${p?.name} · ${pl.name}` : tx("Subscription")} payLabel={tx("Pay")}
      note={p?.activation === "own" ? tx("Activated on your account · {0}.", { 0: p.delivery.toLowerCase() }) : tx("Login shown on your order page.")} onPay={s.buy}
      summary={p && pl && <>
        <Tile p={p} />
        <div className="min-w-0 flex-1">
          <div className="truncate font-semibold text-slate-900 dark:text-white">{p.name} · {pl.name}</div>
          <div className="truncate text-xs text-slate-500 dark:text-slate-400">{p.activation === "own" ? tx("For {0}", { 0: Object.values(s.values)[0]?.trim() || tx("your account") }) : tx("Ready account")}</div>
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
      <div className="min-w-0 flex-1"><div className="text-sm text-slate-600 dark:text-slate-400">{label}</div><div className="truncate font-mono text-[15px] font-semibold text-slate-900 dark:text-white">{show ? value : "•".repeat(12)}</div></div>
      <button onClick={() => setShow(!show)} aria-pressed={show} aria-label={tx("Show {0}", { 0: label })} className={`grid h-9 w-9 place-items-center rounded-lg bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-slate-200 ${ring}`}>{show ? <EyeOff aria-hidden className="h-4 w-4" /> : <Eye aria-hidden className="h-4 w-4" />}</button>
      <CopyButton text={value} label={tx("Copy {0}", { 0: label })} />
    </div>
  );
}

export function SubsOrderView({ s }: { s: Subs }) {
  const tx = useT();
  const o = s.order!;
  const own = o.product.activation === "own";
  const [done, setDone] = useState(!own);
  useEffect(() => { if (done) return; const t = setTimeout(() => setDone(true), 6000); return () => clearTimeout(t); }, [done]);
  const until = new Date(Date.now() + o.plan.months * 30 * 86400000).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  const target = Object.values(o.values)[0];
  return (
    <div className="mx-auto max-w-2xl animate-fade-up">
      <p className="flex items-center gap-2 font-semibold text-emerald-800 dark:text-emerald-300"><Check aria-hidden className="h-5 w-5" />{tx("Payment received")}</p>
      <div aria-live="polite" className="mt-4 flex items-center gap-4">
        <Tile p={o.product} size="lg" />
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{done ? tx("{0} is active", { 0: o.product.name }) : tx("Activating {0}", { 0: o.product.name })}</h1>
          <p className="mt-1 text-slate-700 dark:text-slate-300">{o.plan.name}{done ? ` · until ${until}` : ` · ${o.product.delivery.toLowerCase()}`}</p>
        </div>
      </div>
      <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 dark:border-white/15 dark:bg-[#0E1424]">
        {own ? (
          <p className="text-[15px] text-slate-800 dark:text-slate-200">{done ? <>{tx("Done. Open")}{" "}{o.product.name}{" "}{tx("with")}{" "}<b>{target}</b>{" "}{tx("and your plan is there.")}</> : <>{tx("We're activating the plan on")}{" "}<b>{target}</b>{tx(". You can leave this page; we'll notify you when it's done.")}</>}</p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            <Secret label={tx("Login email")} value={`${o.product.slug}.0412@example.com`} />
            <Secret label={tx("Password")} value="Vb8#qT2w-Lm" />
          </div>
        )}
      </div>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/dashboard/orders" className={primary}>{tx("View in my orders")}</Link>
        <button onClick={s.reset} className={secondary}>{tx("Buy another subscription")}</button>
      </div>
    </div>
  );
}

// ---------- Info ----------

export function SubsFaq() {
  const tx = useT();
  return (
    <div className="divide-y divide-slate-200 rounded-3xl border border-slate-200 bg-white dark:divide-white/10 dark:border-white/15 dark:bg-[#0E1424]">
      {tx.tr(subsFaq).map((f) => (
        <details key={f.q} className="group p-5 [&_summary::-webkit-details-marker]:hidden">
          <summary className={`flex cursor-pointer list-none items-center justify-between gap-4 rounded-lg font-semibold text-slate-900 dark:text-white ${ring}`}>{f.q}<ChevronRight aria-hidden className="h-4 w-4 shrink-0 text-slate-500 transition group-open:rotate-90 rtl:rotate-180 rtl:group-open:rotate-90" /></summary>
          <p className="mt-3 text-[15px] leading-7 text-slate-700 dark:text-slate-300">{f.a}</p>
        </details>
      ))}
    </div>
  );
}

export function SubsTitle({ children, sub }: { children: ReactNode; sub?: ReactNode }) {
  const tx = useT();
  return (
    <div>
      <p className="text-sm font-semibold text-violet-800 dark:text-violet-300">{tx("Subscriptions")}</p>
      <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl dark:text-white">{children}</h1>
      {sub && <p className="mt-4 max-w-2xl text-lg leading-relaxed text-slate-700 dark:text-slate-300">{sub}</p>}
    </div>
  );
}


// ---------- Shared by F–J ----------

export const catIcon: Record<SubCat, LucideIcon> = { ai: Bot, video: Clapperboard, music: Music2, design: Palette, work: Briefcase, trading: LineChart };
export const countIn = (cat: SubCat) => subs.filter((p) => p.cat === cat).length;

// The product's plans, fields and Buy in a native <dialog>: focus stays inside, Escape closes it and focus returns
// to the button that opened it. Bottom sheet on phones, centered on desktop. Continue closes it only when the
// fields are fine and payment opens.
export function ProductSheet({ s, dref }: { s: Subs; dref: React.RefObject<HTMLDialogElement | null> }) {
  const tx = useT();
  return (
    <dialog ref={dref} aria-label={s.product?.name ?? tx("Subscription")}
      className="m-0 mt-auto w-full max-w-none rounded-t-[2rem] bg-white p-0 text-slate-900 backdrop:bg-slate-950/50 backdrop:backdrop-blur-sm sm:m-auto sm:max-w-lg sm:rounded-[2rem] dark:bg-[#0B1020] dark:text-white">
      <div className="max-h-[88vh] overflow-y-auto p-6">
        <div className="flex justify-end"><button onClick={() => dref.current?.close()} aria-label={tx("Close")} className={`grid h-10 w-10 place-items-center rounded-full bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-slate-200 ${ring}`}><X aria-hidden className="h-5 w-5" /></button></div>
        {s.product && <ProductPanel key={s.product.slug} s={s} cols={1} onBuy={() => { if (s.proceed()) dref.current?.close(); }} />}
      </div>
    </dialog>
  );
}

// Category bar with icons and counts and a highlight that slides to the chosen category (like the site's other tab
// bars). Real radio buttons, so arrow keys move between categories. Phones: one swipeable row that keeps the chosen
// one in view. Wider screens: the bar wraps onto a second line so every category is visible, and the highlight
// follows onto it. The first placement is instant so the highlight doesn't grow in on page load.
export function CatTabs({ c }: { c: ReturnType<typeof useCatalog> }) {
  const tx = useT();
  const name = useId();
  const row = useRef<HTMLDivElement>(null);
  const refs = useRef<Partial<Record<string, HTMLLabelElement | null>>>({});
  const [pill, setPill] = useState({ left: 0, top: 0, width: 0, height: 0, ready: false });
  const items = [{ id: "all" as const, label: tx("All"), icon: LayoutGrid, n: tx.tr(subs).length }, ...tx.tr(subCats).map((x) => ({ ...x, icon: catIcon[x.id], n: countIn(x.id) }))];
  useLayoutEffect(() => {
    const measure = () => {
      const el = refs.current[c.cat];
      if (!el) return;
      setPill((o) => ({ left: el.offsetLeft, top: el.offsetTop, width: el.offsetWidth, height: el.offsetHeight, ready: o.width > 0 }));
      // Keep the chosen category visible in the scrolling row.
      const r = row.current;
      if (r && (el.offsetLeft < r.scrollLeft || el.offsetLeft + el.offsetWidth > r.scrollLeft + r.clientWidth)) r.scrollTo({ left: el.offsetLeft - 16, behavior: "smooth" });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [c.cat]);
  // min-w-0 on the fieldset: fieldsets refuse to shrink below their content by default, which would stop the row scrolling.
  return (
    <fieldset className="min-w-0">
      <legend className="sr-only">{tx("Category")}</legend>
      <div ref={row} className="relative flex gap-1 overflow-x-auto rounded-2xl sm:flex-wrap sm:overflow-visible border border-slate-200 bg-white p-1.5 [scrollbar-width:none] dark:border-white/15 dark:bg-white/5">
        <span aria-hidden className={`absolute rounded-xl bg-slate-900 shadow-md dark:bg-white ${pill.ready ? "transition-all duration-500 ease-[cubic-bezier(.3,1.3,.5,1)]" : "transition-none"}`} style={{ left: pill.left, top: pill.top, width: pill.width, height: pill.height }} />
        {items.map((x) => {
          const on = c.cat === x.id;
          const Icon = x.icon;
          return (
            <label key={x.id} ref={(el) => { refs.current[x.id] = el; }}
              className={`relative z-10 flex shrink-0 cursor-pointer items-center gap-2 rounded-xl px-4 py-2.5 text-[15px] font-semibold transition-colors duration-300 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-violet-600 has-[:focus-visible]:ring-offset-2 dark:has-[:focus-visible]:ring-violet-400 dark:has-[:focus-visible]:ring-offset-[#070B14] ${on ? "text-white dark:text-slate-900" : "text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"}`}>
              <input type="radio" autoComplete="off" name={name} checked={on} onChange={() => c.setCat(x.id)} className="sr-only" />
              <Icon aria-hidden className="h-4 w-4" />{x.label}
              <span className={`rounded-full px-1.5 text-xs font-semibold ${on ? "bg-white/20 dark:bg-slate-900/10" : "bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-400"}`}>{x.n}<span className="sr-only">{" "}{tx("subscriptions")}</span></span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
