"use client";
import { useEffect, useId, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import Link from "@/i18n/Link";
import { Bot, Briefcase, Check, LayoutGrid, ChevronRight, Clapperboard, Clock, Eye, EyeOff, KeyRound, LineChart, LogIn, MessageCircle, Music2, Palette, PhoneCall, Shapes, ShoppingBag, Star, UserCheck, X, type LucideIcon } from "lucide-react";
import CheckoutModal, { type PayMethod } from "@/components/checkout/CheckoutModal";
import { nightCallBody } from "@/components/checkout/NightCall";
import { useMoney } from "@/lib/money";
import { accountApi, ApiError, TOP_UP_HREF, useAccount } from "@/lib/account";
import { useCart } from "@/lib/cart";
import type { ApiSubOrder } from "@/lib/subs";
import { formatNum } from "@/i18n/translate";
import { fromPrice, monthly, perMonth, savePct, subCats, subs, subsFaq, type SubCat, type SubPlan, type SubProduct } from "@/content/subs-en";
import { CopyButton } from "../otp/parts";
import { field, primary, ring, secondary } from "../googleVoice/clean";
import { useT } from "@/i18n/client";
import { SearchInput } from "../search";
import { useLiveSubs, useSubsList } from "./live";
import { ReviewCard } from "../account/ReviewCard";

// Pieces shared by the Subscriptions page offers. Accessible like the other product pages: real radio groups,
// labelled fields with hints and errors tied to them, focus moved to the first problem, visible focus rings.
// On the live pages (LiveSubsProvider, see live.tsx) the products come from the backend and paying goes through
// it (Api\StorefrontAccountController subscriptions/*): wallet right away, card via the bank, which sends the buyer
// back with ?pay=…&order=…. Support then activates the order in admin › orders.

// ---------- State ----------

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// `live`: the backend's order on the live pages (support activates it; see SubsOrderView).
export type SubOrder = { product: SubProduct; plan: SubPlan; values: Record<string, string>; paidWith: PayMethod; live?: ApiSubOrder };
export type SubsNotice = { good: boolean; text: string };

// Add-ons start on their first option (the admin's default, usually «خیر»).
const addonDefaults = (p: SubProduct | null) => Object.fromEntries((p?.addons ?? []).map((a) => [a.id, a.options[0]?.id ?? ""]));
// What the chosen add-ons add to this plan, in Toman.
const addonExtra = (p: SubProduct | null, pl: SubPlan | null, picks: Record<string, string>) =>
  !p || !pl ? 0 : (p.addons ?? []).reduce((sum, a) => sum + (a.options.find((o) => o.id === picks[a.id])?.prices[pl.id] ?? 0), 0);

// Selects start on their first option.
const selectDefaults = (p: SubProduct | null) => Object.fromEntries((p?.fields ?? []).filter((f) => f.options).map((f) => [f.id, f.options![0]]));

// The plan a product opens on: the admin's «محبوب‌ترین» one, else the first.
const firstPlan = (p: SubProduct) => p.plans.find((x) => x.popular) ?? p.plans[0];

// «محبوب‌ترین» on the plan the admin marked (admin › اکانت‌های خارجی › پلن‌ها). `on`: sits on a filled (chosen) row.
export function PopularBadge({ on = false, className = "" }: { on?: boolean; className?: string }) {
  const tx = useT();
  // Gold on every ground (white, dark, or the chosen row's violet), so it reads as a mark of its own, not as part of the row.
  return <span className={`inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full bg-gradient-to-l from-amber-300 to-yellow-200 py-0.5 pe-2.5 ps-1.5 text-[11px] font-bold leading-4 text-amber-950 ring-1 ring-inset ring-amber-500/50 ${on ? "shadow-md shadow-violet-950/30" : "shadow-sm shadow-amber-500/20"} ${className}`}><Star aria-hidden className="h-3 w-3 fill-amber-600 text-amber-600" />{tx("Most popular plan")}</span>;
}

export function useSubs(initial?: string) {
  const tx = useT();
  const list = useSubsList();
  const live = useLiveSubs();
  const { setWallet } = useAccount();
  const [product, setProduct] = useState<SubProduct | null>(list.find((s) => s.slug === initial) ?? null);
  const [plan, setPlan] = useState<SubPlan | null>(product ? firstPlan(product) : null);
  const [values, setValues] = useState<Record<string, string>>(() => selectDefaults(product));
  const [picks, setPicks] = useState<Record<string, string>>(() => addonDefaults(product));
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState(false);
  const [payOpen, setPayOpen] = useState(false);
  // "Available for a call 21:00–07:00?", asked in the form (components/checkout/NightCall.tsx). null = no answer yet.
  const [night, setNight] = useState<boolean | null>(null);
  const [order, setOrder] = useState<SubOrder | null>(null);
  const [notice, setNotice] = useState<SubsNotice | null>(null);
  const [changedTo, setChangedTo] = useState<number | null>(null);

  const select = (p: SubProduct | null) => {
    setProduct(p);
    setPlan(p ? firstPlan(p) : null);
    setValues(selectDefaults(p));
    setPicks(addonDefaults(p));
    setTouched({}); setSubmitted(false); setChangedTo(null);
  };

  const all: Record<string, string> = {};
  for (const f of product?.fields ?? []) {
    const v = (values[f.id] ?? "").trim();
    // "Your Discord username" → "Enter your Discord username"; "Email of your Canva account" → "Enter the email of…"
    const what = /^your /i.test(f.label) ? `y${f.label.slice(1)}` : `the ${f.label.charAt(0).toLowerCase()}${f.label.slice(1)}`;
    // Persian reads the label as written ("آیدی تلگرام را وارد کنید"); the English sentence above doesn't carry over.
    if (!v && !f.optional) all[f.id] = tx.locale === "fa" ? tx(f.type === "select" ? "Choose {0}" : "Enter {0}", { 0: f.label }) : `${f.type === "select" ? tx("Choose") : tx("Enter")} ${what}`;
    else if (v && f.type === "email" && !EMAIL.test(v)) all[f.id] = tx("Enter an email address in the correct format, like name@example.com");
    else if (v && live && f.type !== "select" && (v.length < 3 || v.length > 150)) all[f.id] = tx("Use 3 to 150 characters");
  }
  const errors = Object.fromEntries(Object.entries(all).filter(([k]) => submitted || touched[k]));

  // Opens payment, or focuses the first field with a problem.
  const proceed = () => {
    setSubmitted(true);
    const bad = product?.fields.find((f) => all[f.id]);
    if (bad) { document.getElementById(`sub-${bad.id}`)?.focus(); return false; }
    if (night === null) { const el = document.getElementById("night-call"); el?.scrollIntoView({ behavior: "smooth", block: "center" }); el?.focus({ preventScroll: true }); return false; }
    if (live?.error) { setNotice({ good: false, text: live.error }); return false; }
    if (product && plan) setPayOpen(true);
    return true;
  };
  // One tap on a plan: picks product and plan together, then opens payment straight away when the product needs
  // nothing typed in. Returns true when the buyer still has fields to fill (the caller shows them).
  const quickBuy = (p: SubProduct, pl: SubPlan) => {
    select(p);
    setPlan(pl);
    const needs = night === null || p.fields.some((f) => !f.options && !f.optional);
    if (!needs) setPayOpen(true);
    return needs;
  };

  const show = (p: SubProduct, pl: SubPlan, vals: Record<string, string>, m: PayMethod, o?: ApiSubOrder) => {
    setOrder({ product: p, plan: pl, values: vals, paidWith: m, live: o });
    setPayOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  // Live: the backend priced the plan differently (the dollar rate moved since the page loaded).
  const reprice = (price: number) => {
    if (!product || !plan) return;
    const next = { ...plan, price, was: plan.was && plan.was > price ? plan.was : undefined };
    setProduct({ ...product, plans: product.plans.map((x) => (x.id === plan.id ? next : x)) });
    setPlan(next);
    setChangedTo(price);
  };

  // The plan's price plus the chosen add-ons: what every total on the page and the payment shows.
  const extra = addonExtra(product, plan, picks);
  const total = (plan?.price ?? 0) + extra;
  const pick = (addon: string, option: string) => setPicks((x) => ({ ...x, [addon]: option }));
  const addonBody = product?.addons?.length ? { addons: picks } : {};

  const cart = useCart();
  const addToCart = live && cart && product && plan ? () => cart.add("subscription", {
    ...nightCallBody(night), ...addonBody, product_id: product.id, plan_id: Number(plan.id),
    fields: Object.fromEntries(product.fields.map((f) => [f.id, (values[f.id] ?? "").trim()])),
  }) : undefined;

  const buy = async (m: PayMethod) => {
    if (!product || !plan) return;
    if (!live) { show(product, plan, values, m); return; }
    const body = {
      ...nightCallBody(night), ...addonBody, product_id: product.id, plan_id: Number(plan.id), price: total,
      fields: Object.fromEntries(product.fields.map((f) => [f.id, (values[f.id] ?? "").trim()])),
    };
    try {
      if (m === "card") {
        const r = await accountApi<{ url: string }>("subscriptions/pay-card", { ...body, return: window.location.pathname });
        window.location.assign(r.url);
        return new Promise<void>(() => {}); // the page is leaving; keep the modal busy
      }
      const r = await accountApi<{ order: ApiSubOrder; wallet: number }>("subscriptions/buy", body);
      setWallet(r.wallet);
      show(product, plan, values, m, r.order);
    } catch (e) {
      if (e instanceof ApiError) {
        if (typeof e.data?.wallet === "number") setWallet(e.data.wallet);
        if (e.code === "price_changed" && typeof e.data?.price === "number") reprice(e.data.price);
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
    const received = { good: true, text: tx("Payment received. You'll find the order in your orders.") };
    if (pay === "ok" && id) {
      accountApi<{ order: ApiSubOrder; wallet: number }>(`subscriptions/orders/${id}`)
        .then((r) => {
          setWallet(r.wallet);
          const p = list.find((x) => x.slug === r.order.product?.slug);
          const pl = p?.plans.find((x) => x.id === String(r.order.plan.id));
          if (p && pl) show(p, pl, {}, r.order.paid_with, r.order);
          else setNotice(received);
        })
        .catch(() => setNotice(received));
    } else {
      setNotice(pay === "cancelled"
        ? { good: false, text: tx("Payment cancelled. Nothing was charged.") }
        : { good: false, text: tx("The payment didn't go through. If money left your account, the bank returns it within 72 hours.") });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // While support works on it, check every 30 seconds so the page follows along without a reload.
  const followId = order?.live && (order.live.status === "queued" || order.live.status === "in_progress") ? order.live.id : undefined;
  useEffect(() => {
    if (!followId) return;
    const timer = setInterval(() => {
      accountApi<{ order: ApiSubOrder; wallet: number }>(`subscriptions/orders/${followId}`)
        .then((r) => setOrder((o) => (o?.live?.id === r.order.id ? { ...o, live: r.order } : o)))
        .catch(() => {}); // try again on the next tick
    }, 30000);
    return () => clearInterval(timer);
  }, [followId]);

  return {
    product, select, plan, setPlan, values, set: (k: string, v: string) => setValues((x) => ({ ...x, [k]: v })),
    touch: (k: string) => setTouched((t) => ({ ...t, [k]: true })), errors, proceed, quickBuy, night, setNight, nightMissing: submitted && night === null, inCart: !!addToCart,
    // Buying another opens the page's own product again (a product page has nothing to show without one).
    payOpen, closePay: () => setPayOpen(false), order, buy, addToCart, reset: () => { setOrder(null); select(list.find((x) => x.slug === initial) ?? null); },
    live: !!live, notice, dismissNotice: () => setNotice(null), changedTo,
    picks, pick, extra, total,
  };
}
export type Subs = ReturnType<typeof useSubs>;

// Category filter + search over the catalog. `all`: every subscription on offer (for the category counts).
export function useCatalog() {
  const all = useSubsList();
  const [cat, setCat] = useState<SubCat | "all">("all");
  const [q, setQ] = useState("");
  const t = q.trim().toLowerCase();
  const list = all.filter((p) => (cat === "all" || p.cat === cat) && (!t || `${p.name} ${p.tagline}`.toLowerCase().includes(t)));
  return { cat, setCat, q, setQ, list, all };
}

// ---------- Product visuals ----------

// The product's colour: a Tailwind class (placeholders) or the admin's hex colour (live products), as a class or style.
export function brand(p: SubProduct): { className: string; style?: CSSProperties } {
  return p.color.startsWith("#") ? { className: "", style: { backgroundColor: p.color } } : { className: p.color };
}

// The admin's square logo when it has one, else the first letter on the brand colour.
export function Tile({ p, size = "md" }: { p: SubProduct; size?: "sm" | "md" | "lg" }) {
  const s = size === "lg" ? "h-16 w-16 rounded-2xl text-2xl" : size === "sm" ? "h-9 w-9 rounded-lg text-sm" : "h-12 w-12 rounded-xl text-lg";
  // eslint-disable-next-line @next/next/no-img-element -- admin uploads, served by the backend through the proxy
  if (p.image) return <span aria-hidden className={`block shrink-0 overflow-hidden bg-white ring-1 ring-inset ring-slate-900/10 ${s}`}><img src={p.image} alt="" className="h-full w-full object-cover" /></span>;
  const b = brand(p);
  return <span aria-hidden style={b.style} className={`grid shrink-0 place-items-center font-display font-bold text-white ${b.className} ${s}`}>{p.letter}</span>;
}

// How the subscription is delivered: an outlined tag with the icon in a small coloured circle. The colour is only a
// hint; the words carry the meaning, and the title explains it on hover.
export function ActivationBadge({ p }: { p: SubProduct }) {
  const tx = useT();
  const own = p.activation !== "ready";
  const login = p.activation === "login";
  const Icon = login ? LogIn : own ? UserCheck : KeyRound;
  return (
    <span title={login ? tx("We sign in to your account once to activate the plan. Change your password once it's active.") : own ? tx("We activate the plan on your own account; you never share a password.") : tx("You receive a ready account login.")}
      className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border border-slate-300 bg-white py-0.5 pe-2.5 ps-0.5 text-xs font-semibold text-slate-800 dark:border-white/20 dark:bg-white/5 dark:text-slate-100">
      <span aria-hidden className={`grid h-5 w-5 place-items-center rounded-full ${login ? "bg-sky-600 text-white dark:bg-sky-400 dark:text-sky-950" : own ? "bg-emerald-600 text-white dark:bg-emerald-400 dark:text-emerald-950" : "bg-amber-500 text-white dark:bg-amber-400 dark:text-amber-950"}`}><Icon className="h-3 w-3" strokeWidth={2.5} /></span>
      {login ? tx("With your login") : own ? tx("On your account") : tx("Ready account")}
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

// The site's shared search box (../search.tsx); `hero` is the look for the coloured band at the top.
export function SearchBox({ c, className = "", hero = false }: { c: ReturnType<typeof useCatalog>; className?: string; hero?: boolean }) {
  const tx = useT();
  const live = useLiveSubs();
  // Live: the first few real names, so the hint never offers something the shop doesn't sell.
  const names = c.all.slice(0, 3).map((p) => p.name).join(tx.locale === "fa" ? "، " : ", ");
  const placeholder = live ? (names ? tx("Search {0}…", { 0: names }) : tx("Search subscriptions")) : tx("Search ChatGPT, Netflix, Canva…");
  return (
    <div className={className}>
      <SearchInput tone={hero ? "hero" : "page"} value={c.q} onChange={c.setQ} label={tx("Search subscriptions")} placeholder={placeholder} />
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
  const mo = monthly(p) ? tx("/mo") : "";
  if (layout === "row") return (
    <button onClick={onPick} aria-pressed={on} className={`flex w-full items-center gap-3 rounded-2xl border-2 bg-white px-3 py-3 text-start transition-colors dark:bg-[#0E1424] ${on ? "border-violet-700 dark:border-violet-400" : "border-transparent hover:border-slate-300 dark:hover:border-white/20"} ${ring}`}>
      <Tile p={p} size="sm" />
      <span className="min-w-0 flex-1"><span className="block truncate font-semibold text-slate-900 dark:text-white">{p.name}</span><span className="text-sm text-slate-600 dark:text-slate-400">{tx("from")}{" "}{usd(from)}{mo}</span></span>
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
        <button onClick={onPick} aria-pressed={on} className="absolute inset-0 z-[1] rounded-3xl outline-none"><span className="sr-only">{monthly(p) ? tx("Choose {0}, from {1} a month", { 0: p.name, 1: usd(from) }) : tx("Choose {0}, from {1}", { 0: p.name, 1: usd(from) })}</span></button>
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
          <span className="pointer-events-none whitespace-nowrap text-slate-700 dark:text-slate-300">{tx("from")}{" "}<b className="font-display text-base tabular-nums text-slate-900 dark:text-white">{usd(from)}</b>{mo}</span>
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
      <span className="mt-4 flex flex-wrap items-center justify-between gap-2"><ActivationBadge p={p} /><span className="text-sm text-slate-700 dark:text-slate-300">{tx("from")}{" "}<b className="text-base text-slate-900 dark:text-white">{usd(from)}</b>{mo}</span></span>
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
        <p className="mt-2 flex flex-wrap items-center gap-2 text-sm text-slate-700 dark:text-slate-300"><ActivationBadge p={p} />{p.delivery && <span className="inline-flex items-center gap-1"><Clock aria-hidden className="h-4 w-4" />{p.delivery}</span>}</p>
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
                <span className="flex flex-wrap items-center gap-2 font-semibold text-slate-900 dark:text-white">{pl.name}{pl.popular && <PopularBadge />}</span>
                <span className="text-sm text-slate-600 dark:text-slate-400">{pl.months > 0 && <>{usd(perMonth(pl))}{tx("/mo")}</>}{save > 0 && <span className="font-semibold text-amber-800 dark:text-amber-300">{" "}{tx("· save")}{" "}{save}%</span>}</span>
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
  return (
    <div className="space-y-5">
      {p.fields.map((given) => {
        let f = given;
        const id = `sub-${f.id}`;
        const err = s.errors[f.id];
        if (f.type === "password" && !f.hint) f = { ...f, hint: tx("Only used to activate the plan. Change it once the plan is active.") };
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
              <input id={id} type={f.type === "email" ? "email" : f.type === "password" ? "password" : "text"} inputMode={f.type === "email" ? "email" : undefined}
                autoComplete={f.type === "email" ? "email" : f.type === "password" ? "new-password" : "off"} spellCheck={false} dir={f.type === "text" ? "auto" : "ltr"}
                value={s.values[f.id] ?? ""} onChange={(e) => s.set(f.id, e.target.value)} onBlur={() => s.touch(f.id)} aria-invalid={!!err} aria-describedby={describedBy} className={cls} />
            )}
          </div>
        );
      })}
      <AddonQuestions s={s} />
    </div>
  );
}

// The admin's add-on questions and the night-call question (design «Switch rows», buy-form option 2). A yes/no
// add-on (two options) is one row with its price and a switch: off = its first option (the admin's default, usually
// «خیر»), on = the second. Questions with more options keep the segmented buttons above the rows. Night call is the
// last row: off = «no, daytime only», so showing the form answers it (night_call 0) until the buyer turns it on.
function AddonQuestions({ s }: { s: Subs }) {
  const tx = useT();
  const usd = useMoney().format;
  const name = useId();
  const p = s.product;
  const { night, setNight } = s;
  useEffect(() => { if (night === null) setNight(false); }, [night, setNight]);
  const addons = p?.addons ?? [];
  const extraOf = (o: { prices: Record<string, number> }) => (s.plan ? o.prices[s.plan.id] ?? 0 : 0);
  const binary = addons.filter((a) => a.options.length === 2);
  const multi = addons.filter((a) => a.options.length !== 2);
  return (
    <>
      {multi.map((a) => (
        <fieldset key={a.id}>
          <legend className="text-base font-semibold text-slate-900 dark:text-white">{a.question}</legend>
          <div className="mt-3 grid grid-cols-1 gap-1 rounded-2xl bg-slate-100 p-1 sm:grid-cols-3 dark:bg-white/[.06]">
            {a.options.map((o) => {
              const extra = extraOf(o);
              const on = s.picks[a.id] === o.id;
              return (
                <label key={o.id} className={`cursor-pointer rounded-xl px-4 py-2.5 text-center text-[15px] font-semibold transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-emerald-600 ${on ? "bg-white text-slate-900 shadow dark:bg-white/15 dark:text-white" : "text-slate-600 dark:text-slate-300"}`}>
                  <input type="radio" name={`${name}-${a.id}`} className="sr-only" checked={on} onChange={() => s.pick(a.id, o.id)} />
                  {o.label}
                  {extra > 0 && <span className="block text-xs font-medium tabular-nums text-slate-500 dark:text-slate-400">+{usd(extra)}</span>}
                </label>
              );
            })}
          </div>
        </fieldset>
      ))}
      <div className="divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-slate-50 dark:divide-white/10 dark:border-white/10 dark:bg-white/[.04]">
        {binary.map((a) => {
          const [off, onOpt] = a.options;
          const on = s.picks[a.id] === onOpt.id;
          const extra = extraOf(onOpt);
          return (
            <SwitchRow key={a.id} title={a.question} price={extra > 0 ? `+${usd(extra)}` : undefined} on={on}
              onChange={(v) => s.pick(a.id, v ? onOpt.id : off.id)} />
          );
        })}
        <SwitchRow id="night-call" icon={<PhoneCall aria-hidden className="h-4 w-4 shrink-0 text-indigo-600 dark:text-indigo-400" />}
          title={tx("Can support call you between 9 pm and 7 am?")} detail={tx("If something about your order needs a quick answer.")}
          on={night === true} onChange={(v) => setNight(v)} />
      </div>
    </>
  );
}

// One row of the switch list: question, a short line under it, the extra price, and a real switch.
function SwitchRow({ id, icon, title, detail, price, on, onChange }: { id?: string; icon?: ReactNode; title: string; detail?: string; price?: string; on: boolean; onChange: (v: boolean) => void }) {
  const label = useId();
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <div className="min-w-0 flex-1">
        <p id={label} className="flex items-center gap-2 text-[15px] font-semibold text-slate-900 dark:text-white">{icon}{title}</p>
        {detail && <p className="mt-0.5 text-sm text-slate-600 dark:text-slate-400">{detail}</p>}
      </div>
      {price && <span className="shrink-0 whitespace-nowrap rounded-lg bg-indigo-50 px-2 py-0.5 text-xs font-semibold tabular-nums text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300">{price}</span>}
      <button id={id} type="button" role="switch" aria-checked={on} aria-labelledby={label} onClick={() => onChange(!on)}
        className={`relative h-7 w-12 shrink-0 rounded-full transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 ${on ? "bg-indigo-600 dark:bg-indigo-500" : "bg-slate-300 dark:bg-white/20"}`}>
        <span aria-hidden className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all ${on ? "start-6" : "start-1"}`} />
      </button>
    </div>
  );
}

// What the buyer pays, line by line, above the buy button (buy-form option 5): the plan, each paid add-on they
// turned on, then the total. Updates as plans and add-ons change.
export function Receipt({ s }: { s: Subs }) {
  const tx = useT();
  const usd = useMoney().format;
  const p = s.product, pl = s.plan;
  if (!p || !pl) return null;
  const extras = (p.addons ?? []).flatMap((a) => {
    const o = a.options.find((x) => x.id === s.picks[a.id]);
    const v = o ? o.prices[pl.id] ?? 0 : 0;
    if (!o || v <= 0) return [];
    const title = a.options.length === 2 ? a.question.replace(/[؟?]\s*$/, "") : `${a.question.replace(/[؟?]\s*$/, "")}: ${o.label}`;
    return [{ id: a.id, title, v }];
  });
  return (
    <div aria-live="polite" className="space-y-1.5 text-sm">
      <div className="flex items-baseline justify-between gap-3 text-slate-700 dark:text-slate-300"><span className="min-w-0 truncate">{pl.name}</span><span className="shrink-0 tabular-nums">{usd(pl.price)}</span></div>
      {extras.map((e) => (
        <div key={e.id} className="flex items-baseline justify-between gap-3 text-slate-700 dark:text-slate-300"><span className="min-w-0">{e.title}</span><span className="shrink-0 tabular-nums">+{usd(e.v)}</span></div>
      ))}
      <div className="flex items-baseline justify-between gap-3 border-t border-dashed border-slate-300 pt-2 dark:border-white/15">
        <span className="font-semibold text-slate-900 dark:text-white">{tx("Total")}</span>
        <span className="font-display text-lg font-bold tabular-nums text-slate-900 dark:text-white">{usd(s.total)}</span>
      </div>
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
  const tx = useT();
  return <button type="button" onClick={onBuy ?? s.proceed} className={`${primary} w-full ${className}`}>{s.inCart ? <span className="inline-flex items-center justify-center gap-2"><ShoppingBag aria-hidden className="h-5 w-5" />{tx("Add to cart")}</span> : label ?? tx("Continue")}</button>;
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
        <span className="font-display text-3xl font-bold text-slate-900 dark:text-white">{s.plan ? usd(s.total) : "—"}</span>
      </div>
      <BuyButton s={s} onBuy={onBuy} />
    </div>
  );
}

export function SubsCheckout({ s }: { s: Subs }) {
  const tx = useT();
  const money = useMoney();
  const p = s.product, pl = s.plan;
  const target = p?.fields.find((f) => f.type !== "password" && f.type !== "select");
  const forWho = (target && s.values[target.id]?.trim()) || Object.values(s.values)[0]?.trim() || tx("your account");
  const note = s.changedTo != null
    ? tx("The price just changed to {price}. Check it and pay again.", { price: money.format(s.changedTo) })
    : p?.activation === "ready" ? tx("The login will be on your order page.")
    : p?.delivery ? tx("Activated on your account · {0}.", { 0: tx.locale === "fa" ? p.delivery : p.delivery.toLowerCase() })
    : tx("Activated on your account by our team after payment.");
  return (
    <>
      {s.notice && <SubsNoticeToast n={s.notice} onClose={s.dismissNotice} />}
      <CheckoutModal open={s.payOpen && !!p && !!pl} onClose={s.closePay} price={s.total} itemLabel={pl ? `${p?.name} · ${pl.name}` : tx("Subscription")} payLabel={tx("Pay")}
        note={note} onPay={s.buy} onAddToCart={s.addToCart}
        {...(s.live ? { signIn: true, only: ["wallet", "card"] as PayMethod[], topUpHref: TOP_UP_HREF, fees: { card: 0 }, notes: { card: "Iranian bank cards, via ZarinPal" } } : {})}
        summary={p && pl && <>
          <Tile p={p} />
          <div className="min-w-0 flex-1">
            <div className="truncate font-semibold text-slate-900 dark:text-white">{p.name} · {pl.name}</div>
            <div className="truncate text-xs text-slate-500 dark:text-slate-400">{p.activation === "ready" ? tx("Ready account") : tx("For {0}", { 0: forWho })}</div>
          </div>
        </>} />
    </>
  );
}

// What happened at the bank (or why buying is paused): a toast at the bottom until it's closed.
export function SubsNoticeToast({ n, onClose }: { n: { good: boolean; text: string }; onClose: () => void }) {
  const tx = useT();
  return (
    <div role={n.good ? "status" : "alert"} className="fixed inset-x-4 bottom-4 z-50 mx-auto flex max-w-lg items-start gap-3 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-2xl shadow-black/30 dark:bg-white dark:text-slate-900">
      {n.good ? <Check aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400 dark:text-emerald-700" /> : <X aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-red-400 dark:text-red-700" />}
      <span className="flex-1">{n.text}</span>
      <button type="button" onClick={onClose} className={`-m-1 rounded-lg p-1 text-white/70 hover:text-white dark:text-slate-500 dark:hover:text-slate-900 ${ring}`} aria-label={tx("Close")}><X aria-hidden className="h-4 w-4" /></button>
    </div>
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
  const o = s.order!;
  return o.live ? <LiveSubsOrderView s={s} /> : <DemoOrderView s={s} />;
}

const STEP: Record<ApiSubOrder["status"], number> = { unpaid: 0, queued: 1, in_progress: 2, done: 3, cancelled: -1, refunded: -1, paused: 1 };

// A live order: where it stands as support works on it (checked every 30 seconds by useSubs).
function LiveSubsOrderView({ s }: { s: Subs }) {
  const tx = useT();
  const money = useMoney();
  const o = s.order!;
  const r = o.live!;
  const p = o.product;
  const how = p.activation;
  const step = STEP[r.status];
  const stopped = step < 0;
  const target = r.fields.find((f) => f.value)?.value ?? "";
  const titles: Record<ApiSubOrder["status"], string> = {
    unpaid: tx("Waiting for payment"),
    queued: how === "ready" ? tx("Preparing your {0} account", { 0: p.name }) : tx("Activating {0}", { 0: p.name }),
    in_progress: how === "ready" ? tx("Preparing your {0} account", { 0: p.name }) : tx("Activating {0}", { 0: p.name }),
    done: how === "ready" ? tx("Your {0} account is ready", { 0: p.name }) : tx("{0} is active", { 0: p.name }),
    cancelled: tx("This order was cancelled"),
    refunded: tx("This order was refunded to your wallet"),
    paused: tx("This order is on hold"),
  };
  const done = r.status === "done";
  const text = stopped ? tx("Questions about it? Message support from your order page.")
    : how === "ready" ? (done ? tx("The login is on your order page, ready to copy.") : tx("We're preparing the account. Its login will be on your order page."))
    : how === "login" ? (done ? tx("Done. The plan is on {0}. If you haven't yet, change your password now.", { 0: target }) : tx("We'll sign in to {0} once to activate the plan. Change your password as soon as it's active.", { 0: target }))
    : done ? <>{tx("Done. Open")}{" "}{p.name}{" "}{tx("with")}{" "}<b dir="ltr">{target}</b>{" "}{tx("and your plan is there.")}</>
    : <>{tx("We're activating the plan on")}{" "}<b dir="ltr">{target}</b>{tx(". You can leave this page; we'll notify you when it's done.")}</>;
  const steps = [tx("Payment received"), tx(how === "ready" ? "Account being prepared" : "Activation started"), tx(how === "ready" ? "Login delivered" : "Plan active")];
  return (
    <div className="mx-auto max-w-2xl animate-fade-up">
      {r.status !== "unpaid" && <p className="flex items-center gap-2 font-semibold text-emerald-800 dark:text-emerald-300"><Check aria-hidden className="h-5 w-5" />{tx("Payment received ·")}{" "}{money.format(r.price)}</p>}
      <div aria-live="polite" className="mt-4 flex items-center gap-4">
        <Tile p={p} size="lg" />
        <div className="min-w-0">
          <h1 className="font-display text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{titles[r.status]}</h1>
          <p className="mt-1 text-slate-700 dark:text-slate-300">{o.plan.name}{!stopped && !done && p.delivery ? ` · ${tx.locale === "fa" ? p.delivery : p.delivery.toLowerCase()}` : ""}</p>
        </div>
      </div>
      <div className="mt-8 flex items-start gap-4 rounded-3xl border border-slate-200 bg-white p-6 dark:border-white/15 dark:bg-[#0E1424]">
        <p className="min-w-0 flex-1 text-[15px] text-slate-800 dark:text-slate-200">{text}</p>
        <span className="shrink-0 text-sm tabular-nums text-slate-600 dark:text-slate-400">#{formatNum(r.id, tx.locale, { useGrouping: false })}</span>
      </div>
      {!stopped && (
        <ol className="mt-6 space-y-3">
          {steps.map((st, i) => {
            const state = i < step ? "done" : i === step ? "now" : "wait";
            return (
              <li key={i} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/15 dark:bg-[#0E1424]">
                <span aria-hidden className={`grid h-8 w-8 shrink-0 place-items-center rounded-full ${state === "done" ? "bg-emerald-700 text-white dark:bg-emerald-400 dark:text-emerald-950" : state === "now" ? "border-2 border-violet-700 dark:border-violet-400" : "border-2 border-slate-300 dark:border-white/20"}`}>
                  {state === "done" ? <Check className="h-4 w-4" /> : state === "now" ? <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-violet-700 dark:bg-violet-400" /> : null}
                </span>
                <span className="text-slate-900 dark:text-white">{st}<span className="sr-only">{state === "done" ? tx(", done") : state === "now" ? tx(", in progress") : tx(", waiting")}</span></span>
              </li>
            );
          })}
        </ol>
      )}
      {done && r.review && <ReviewCard orderId={r.id} review={r.review} product={p.name} className="mt-8" />}
      <div className="mt-8 flex flex-wrap gap-3">
        {/* The order page is still the old user panel (served by the backend through the proxy). */}
        <a href={`/user/orders/${r.id}`} className={primary}>{tx("View in my orders")}</a>
        <button onClick={s.reset} className={secondary}>{tx("Buy another subscription")}</button>
      </div>
    </div>
  );
}

// The design pages' sample order (no backend): pretends to activate, or shows a sample login.
function DemoOrderView({ s }: { s: Subs }) {
  const tx = useT();
  const o = s.order!;
  const own = o.product.activation !== "ready";
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

export const catIcon: Record<SubCat, LucideIcon> = { ai: Bot, video: Clapperboard, music: Music2, design: Palette, work: Briefcase, trading: LineChart, social: MessageCircle, other: Shapes };
export const countIn = (cat: SubCat, list: SubProduct[] = subs) => list.filter((p) => p.cat === cat).length;

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
  // Only categories that have something in them.
  const items = [{ id: "all" as const, label: tx("All"), icon: LayoutGrid, n: c.all.length }, ...tx.tr(subCats).map((x) => ({ ...x, icon: catIcon[x.id], n: countIn(x.id, c.all) })).filter((x) => x.n > 0)];
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
  // One row at every width: when the categories don't fit, it scrolls sideways (no scrollbar) and the side with more
  // fades out, so nothing wraps onto a lonely second line.
  const [more, setMore] = useState({ start: false, end: false });
  useEffect(() => {
    const r = row.current;
    if (!r) return;
    const check = () => {
      const max = r.scrollWidth - r.clientWidth;
      const from = Math.abs(r.scrollLeft); // RTL rows scroll into negative values
      setMore({ start: max > 1 && from > 1, end: max > 1 && from < max - 1 });
    };
    check();
    r.addEventListener("scroll", check, { passive: true });
    const ro = new ResizeObserver(check);
    ro.observe(r);
    return () => { r.removeEventListener("scroll", check); ro.disconnect(); };
  }, [items.length]);
  const fade = more.start && more.end
    ? "[mask-image:linear-gradient(to_right,transparent,black_40px,black_calc(100%-40px),transparent)]"
    : more.end ? "[mask-image:linear-gradient(to_right,black_calc(100%-48px),transparent)] rtl:[mask-image:linear-gradient(to_left,black_calc(100%-48px),transparent)]"
    : more.start ? "[mask-image:linear-gradient(to_left,black_calc(100%-48px),transparent)] rtl:[mask-image:linear-gradient(to_right,black_calc(100%-48px),transparent)]"
    : "";
  // min-w-0 on the fieldset: fieldsets refuse to shrink below their content by default, which would stop the row scrolling.
  return (
    <fieldset className="min-w-0">
      <legend className="sr-only">{tx("Category")}</legend>
      <div className="rounded-2xl border border-slate-200 bg-white p-1.5 dark:border-white/15 dark:bg-white/5">
      <div ref={row} className={`relative flex gap-1 overflow-x-auto overscroll-x-contain rounded-xl sm:gap-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${fade}`}>
        <span aria-hidden className={`absolute rounded-xl bg-slate-900 shadow-md dark:bg-white ${pill.ready ? "transition-all duration-500 ease-[cubic-bezier(.3,1.3,.5,1)]" : "transition-none"}`} style={{ left: pill.left, top: pill.top, width: pill.width, height: pill.height }} />
        {items.map((x) => {
          const on = c.cat === x.id;
          const Icon = x.icon;
          return (
            <label key={x.id} ref={(el) => { refs.current[x.id] = el; }}
              className={`relative z-10 flex shrink-0 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-xl px-3 py-2.5 text-[15px] font-semibold sm:px-2.5 sm:text-sm transition-colors duration-300 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-violet-600 has-[:focus-visible]:ring-offset-2 dark:has-[:focus-visible]:ring-violet-400 dark:has-[:focus-visible]:ring-offset-[#070B14] ${on ? "text-white dark:text-slate-900" : "text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"}`}>
              <input type="radio" autoComplete="off" name={name} checked={on} onChange={() => c.setCat(x.id)} className="sr-only" />
              <Icon aria-hidden className="h-4 w-4" />{x.label}
              <span className={`rounded-full px-1.5 text-xs font-semibold ${on ? "bg-white/20 dark:bg-slate-900/10" : "bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-400"}`}>{x.n}<span className="sr-only">{" "}{tx("subscriptions")}</span></span>
            </label>
          );
        })}
      </div>
      </div>
    </fieldset>
  );
}
