"use client";
import { useLayoutEffect, useRef, useState, type ComponentType } from "react";
import Link from "@/i18n/Link";
import {
  ArrowRight, ChevronDown, Flame, Check, Smartphone, Apple, Sparkles, Users, Send, Instagram,
  MessageSquareCode, Phone, CalendarClock, UserPen, BadgeCheck, Bot, LineChart, Headphones, Palette, Crown, Megaphone, type LucideIcon,
} from "lucide-react";
import { LocaleProvider, useT } from "@/i18n/client";
import type { T } from "@/i18n/translate";
import { livePrice } from "@/i18n/nav";

// The shop window under the home hero (offer G): the product categories and their products. Gallery section
// "hero-catalog" (/design/hero-catalog) shows each style; the live hero (HeroG.tsx) uses CATALOG_STYLE below.
// The prices are display text from the catalog below (translated to Toman on the Persian site by tx.tr).

// Each card is a category; clicking it opens that category's own page.
// `image`: an admin-uploaded logo (cards the admin put on the home page), shown instead of `icon`.
type Card = { name: string; desc: string; features: string[]; from: string; href: string; icon: LucideIcon; tint: string; hot?: boolean; image?: string };
type Tab = { id: string; name: string; short: string; icon: LucideIcon; cards: Card[]; viewAll?: string };

export const catalog: Tab[] = [
  {
    id: "subs", name: "Subscriptions", short: "Subscriptions", icon: Sparkles, viewAll: "/accounts",
    cards: [
      // The live account products (backend type "accounts"); prices are each one's cheapest plan in dollars at the
      // backend's rate, shown in Toman on the Persian site.
      { name: "Claude", desc: "Anthropic's AI assistant on a ready account", features: ["1 month", "Pro, Max or Ultra"], from: "$22.00", href: "/accounts/buy-claude", icon: Bot, tint: "bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-300", hot: true },
      { name: "Spotify Premium", desc: "Ad-free music and offline listening", features: ["1 to 12 months", "Individual"], from: "$3.30", href: "/accounts/buy-spotify-account", icon: Headphones, tint: "bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-300" },
      { name: "Freepik", desc: "Premium photos, vectors and templates", features: ["1 or 12 months", "All premium assets"], from: "$9.90", href: "/accounts/buy-freepick-account", icon: Palette, tint: "bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300" },
      { name: "TradingView", desc: "Pro charts, alerts and market tools", features: ["3 to 18 months", "Pro plans"], from: "$32.99", href: "/accounts/trading-view", icon: LineChart, tint: "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300" },
    ],
  },
  {
    // Verification (/verify): filled with the live products (picks.home.verify); left out when there are none.
    id: "verify", name: "Verification", short: "Verify", icon: BadgeCheck, viewAll: "/verify", cards: [],
  },
  {
    id: "numbers", name: "Virtual Numbers", short: "Numbers", icon: Smartphone,
    cards: [
      { name: "Virtual Number (OTP)", desc: "One-time numbers to receive a verification code", features: ["150+ countries", "2,000+ apps", "Refund if no SMS"], from: "$0.30", href: "/virtual-number", icon: MessageSquareCode, tint: "bg-indigo-100 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300", hot: true },
      { name: "Google Voice", desc: "A permanent US number that is yours to keep", features: ["Calls & SMS", "Choose your area code", "Full ownership"], from: "$9.90", href: "/google-voice", icon: Phone, tint: "bg-sky-100 text-sky-600 dark:bg-sky-500/15 dark:text-sky-300" },
      { name: "Rent Number", desc: "Keep a number for days or weeks with unlimited SMS", features: ["7 to 30 days", "Unlimited codes", "Extend any time"], from: "$4.90", href: "/rent-number", icon: CalendarClock, tint: "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300" },
    ],
  },
  {
    id: "apple", name: "Apple ID", short: "Apple ID", icon: Apple,
    cards: [
      { name: "Custom USA Apple ID", desc: "Made with your own name and email address", features: ["Your details", "Verified 2FA option", "Lifetime support"], from: "$9.00", href: "/apple-id/custom", icon: UserPen, tint: "bg-slate-200 text-slate-800 dark:bg-white/10 dark:text-slate-200", hot: true },
      { name: "USA Apple ID", desc: "Ready-made US Apple ID, delivered instantly", features: ["Instant delivery", "Email access option", "Works on all devices"], from: "$6.50", href: "/apple-id/usa", icon: BadgeCheck, tint: "bg-blue-100 text-blue-600 dark:bg-blue-500/15 dark:text-blue-300" },
    ],
  },
  {
    id: "telegram", name: "Telegram", short: "Telegram", icon: Send,
    cards: [
      { name: "Telegram Premium", desc: "Gifted straight to your account, no login needed", features: ["3, 6 or 12 months", "Just your username", "Instant activation"], from: "$11.90", href: "/telegram/premium", icon: Crown, tint: "bg-violet-100 text-violet-600 dark:bg-violet-500/15 dark:text-violet-300", hot: true },
      { name: "Telegram Ads", desc: "Sponsored messages in the channels your audience reads", features: ["Target by channel or topic", "Campaign setup included", "Live performance reports"], from: "$50.00", href: "/telegram/ads", icon: Megaphone, tint: "bg-sky-100 text-sky-600 dark:bg-sky-500/15 dark:text-sky-300" },
    ],
  },
  {
    id: "social", name: "Social Media Services", short: "Social", icon: Users, viewAll: "/virtual-service",
    cards: [
      { name: "Telegram", desc: "Members, post views and reactions", features: ["Real members", "Instant start"], from: "$1.20", href: "/virtual-service/telegram", icon: Send, tint: "bg-sky-100 text-sky-600 dark:bg-sky-500/15 dark:text-sky-300", hot: true },
      { name: "Instagram", desc: "Followers, likes and Reels views", features: ["High quality", "Drip-feed option"], from: "$0.90", href: "/virtual-service/instagram", icon: Instagram, tint: "bg-pink-100 text-pink-600 dark:bg-pink-500/15 dark:text-pink-300" },
      // YouTube and TikTok come back here once they have services in admin › Virtual services.
    ],
  },
];

// The catalog in this language, with the Subscriptions and Social tabs showing what the admin put on the home page
// (Api\StorefrontController::picks › home; their prices from prices › from). A chosen item that is also a built-in card keeps that card's
// icon, colours and feature list; a new one gets its logo and description. Nothing chosen = the built-in cards.
const catalogMemo = new WeakMap<T, Tab[]>();
const PLAIN_TINT = "bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-300";
export function catalogFor(tx: T): Tab[] {
  let out = catalogMemo.get(tx);
  if (out) return out;
  const base = tx.tr(catalog);
  const picks = tx.prices?.picks?.home;
  const fa = tx.locale === "fa";
  out = base.map((tab) => {
    const chosen = tab.id === "subs" ? picks?.subs : tab.id === "social" ? picks?.social : tab.id === "verify" ? picks?.verify : undefined;
    if (!chosen?.length) return tab;
    return {
      ...tab,
      cards: chosen.map((p): Card => {
        const known = tab.cards.find((c) => c.href === p.href);
        const live = { from: livePrice(p.href, tx) || known?.from || "", href: p.href };
        if (known) return { ...known, ...live };
        return { ...live, name: fa ? p.name : p.name_en || p.name, desc: (fa ? p.desc : p.desc_en || p.desc) ?? "", features: [], icon: tab.icon, tint: PLAIN_TINT, image: p.image ?? undefined };
      }),
    };
  });
  out = out.filter((tab) => tab.cards.length > 0); // Verification before it has live products
  catalogMemo.set(tx, out);
  return out;
}

// A card's icon tile content: the uploaded logo, else the built-in icon.
function CardIcon({ c, className }: { c: Card; className: string }) {
  if (c.image) return <img src={c.image} alt="" loading="lazy" decoding="async" className="h-full w-full rounded-xl object-cover" />;
  const Icon = c.icon;
  return <Icon aria-hidden className={className} />;
}

// The tab that is open when the page loads.
const DEFAULT_TAB = "subs";

const cols: Record<number, string> = { 2: "sm:grid-cols-2", 3: "sm:grid-cols-2 lg:grid-cols-3", 4: "sm:grid-cols-2 lg:grid-cols-4" };

// Any number of cards (the admin picks how many go on the home page): rows of at most 4, shared out evenly
// (5 → 3 + 2, 6 → 3 + 3, 7 → 4 + 3), so no card ends up alone or full width. Two columns below lg, where an odd
// last card spans both; from lg a 12-column grid, each card spanning 12 / the size of its row.
const SPAN: Record<number, string> = { 1: "lg:col-span-12", 2: "lg:col-span-6", 3: "lg:col-span-4", 4: "lg:col-span-3" };
const cardGrid = (n: number) => (n > 1 ? "sm:grid-cols-2 lg:grid-cols-12" : "");
function cardSpan(n: number, i: number): string {
  if (n < 2) return "";
  const rows = Math.ceil(n / 4);
  const base = Math.floor(n / rows), extra = n % rows; // the first `extra` rows get one card more
  let start = 0, size = 0;
  for (let r = 0; r < rows; r++) {
    size = base + (r < extra ? 1 : 0);
    if (i < start + size) break;
    start += size;
  }
  return `${n % 2 === 1 && i === n - 1 ? "sm:col-span-2" : ""} ${SPAN[size]}`;
}


// A · Catalog Tabs (current): a scrolling row of tabs with a sliding pill, the products as full cards.
function Tabs() {
  const tx = useT();
  const [tabId, setTabId] = useState(DEFAULT_TAB);
  const tab = catalogFor(tx).find((t) => t.id === tabId)!;

  // Sliding pill behind the active tab (same motion as the "What are you buying today?" tabs).
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [pill, setPill] = useState({ left: 0, width: 0 });
  useLayoutEffect(() => {
    const measure = () => {
      const b = tabRefs.current[tabId];
      if (b) setPill({ left: b.offsetLeft, width: b.offsetWidth });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [tabId]);

  return (
    <div className="mt-12 rounded-3xl border border-white bg-white/80 p-3 text-start shadow-2xl shadow-indigo-200/60 backdrop-blur-xl dark:border-white/10 dark:bg-white/[.04] dark:shadow-black/40">
      {/* The sliding pill overshoots a little when it lands on an end tab; with no scrollbar that never flashes one. Phones still swipe the row. */}
      <div className="relative flex gap-1 overflow-x-auto rounded-2xl bg-slate-100/80 p-1 [scrollbar-width:none] dark:bg-white/5 [&::-webkit-scrollbar]:hidden">
        <span aria-hidden className="absolute inset-y-1 rounded-xl bg-white shadow-sm transition-all duration-500 ease-[cubic-bezier(.3,1.3,.5,1)] dark:bg-white/10" style={{ left: pill.left, width: pill.width }} />
        {catalogFor(tx).map((t) => {
          const on = t.id === tabId;
          return (
            <button key={t.id} ref={(el) => { tabRefs.current[t.id] = el; }} onClick={() => setTabId(t.id)} className={`relative z-10 flex shrink-0 flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-medium transition-colors duration-300 ${on ? "text-slate-900 dark:text-white" : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white"}`}>
              <t.icon className="h-4 w-4" />{t.name}
            </button>
          );
        })}
      </div>

      <div className={`grid gap-3 p-2 pt-4 ${cardGrid(tab.cards.length)}`}>
        {tab.cards.map((c, i) => (
          <div key={tab.id + c.name} className={`animate-blur-in ${cardSpan(tab.cards.length, i)}`} style={{ animationDelay: `${i * 70}ms` }}>
          <Link href={c.href} className="group relative flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-lg dark:border-white/10 dark:bg-[#0E1424] dark:hover:border-indigo-400/50 dark:hover:shadow-black/30">
            {c.hot && <span className="absolute end-4 top-4 flex items-center gap-1 rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-semibold text-orange-600 dark:bg-orange-500/15 dark:text-orange-300"><Flame className="h-3 w-3" />{tx("Popular")}</span>}
            <span className={`grid h-11 w-11 place-items-center rounded-xl ${c.tint}`}><CardIcon c={c} className="h-5 w-5" /></span>
            <div className="mt-4 font-display text-lg font-semibold text-slate-900 dark:text-white">{c.name}</div>
            <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">{c.desc}</div>
            <ul className="mt-4 space-y-1.5">
              {c.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300"><Check className="h-3.5 w-3.5 text-emerald-500" />{f}</li>
              ))}
            </ul>
            <div className="mt-auto flex items-end justify-between pt-6">
              <span className="text-xs text-slate-500 dark:text-slate-400">{tx("from")}{" "}<span className="block font-display text-2xl font-bold text-slate-900 dark:text-white">{c.from}</span></span>
              <span className="grid h-9 w-9 place-items-center rounded-full bg-slate-900 text-white transition group-hover:bg-indigo-600 dark:bg-white/10"><ArrowRight className="h-4 w-4 rtl:rotate-180" /></span>
            </div>
          </Link>
          </div>
        ))}
      </div>
      {tab.viewAll && (
        <Link key={tab.id} href={tab.viewAll} className="group mx-auto mt-1 flex w-fit animate-blur-in [animation-delay:240ms] items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-medium text-indigo-600 hover:bg-indigo-50 dark:text-indigo-300 dark:hover:bg-indigo-500/10">
          {tx("View all")}{" "}{tab.name.toLowerCase()} <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
        </Link>
      )}
    </div>
  );
}

// ---------- Pieces shared by the redesigns ----------

const shell = "mt-12 rounded-3xl border border-white bg-white/80 p-3 text-start shadow-2xl shadow-indigo-200/60 backdrop-blur-xl dark:border-white/10 dark:bg-white/[.04] dark:shadow-black/40";
// Our own focus ring, so a tapped tab doesn't keep the browser's default (orange on some systems) outline.
const ring = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-indigo-400 dark:focus-visible:ring-offset-[#0E1424]";

function useCatalog() {
  const tx = useT();
  const list = catalogFor(tx);
  const [tabId, setTabId] = useState(DEFAULT_TAB);
  return { list, tab: list.find((t) => t.id === tabId) ?? list[0], tabId, setTabId };
}

// Phones get the short name (fits five across); wider screens the full one.
function TabName({ t }: { t: Tab }) {
  return <><span className="sm:hidden">{t.short}</span><span className="hidden sm:inline">{t.name}</span></>;
}

function ViewAll({ tab }: { tab: Tab }) {
  const tx = useT();
  if (!tab.viewAll) return null;
  return (
    <Link key={tab.id} href={tab.viewAll} className={`group mx-auto mt-2 flex w-fit animate-blur-in items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-medium text-indigo-600 hover:bg-indigo-50 dark:text-indigo-300 dark:hover:bg-indigo-500/10 ${ring}`}>
      {tx("View all")}{" "}{tab.name.toLowerCase()} <ArrowRight aria-hidden className="h-4 w-4 transition group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
    </Link>
  );
}

function Hot() {
  const tx = useT();
  return <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-semibold text-orange-600 dark:bg-orange-500/15 dark:text-orange-300"><Flame aria-hidden className="h-3 w-3" />{tx("Popular")}</span>;
}

// One product as a slim row: icon, name and one line about it, the starting price, an arrow.
function ProductRow({ c, i }: { c: Card; i: number }) {
  const tx = useT();
  return (
    <Link href={c.href} style={{ animationDelay: `${i * 60}ms` }}
      className={`group flex min-w-0 animate-blur-in items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 transition hover:border-indigo-300 hover:shadow-md dark:border-white/10 dark:bg-[#0E1424] dark:hover:border-indigo-400/50 ${ring}`}>
      <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${c.tint}`}><CardIcon c={c} className="h-5 w-5" /></span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2"><span className="truncate font-display font-semibold text-slate-900 dark:text-white">{c.name}</span>{c.hot && <Hot />}</span>
        <span className="block truncate text-[13px] text-slate-500 dark:text-slate-400">{c.desc}</span>
      </span>
      <span className="shrink-0 text-end text-[11px] leading-tight text-slate-500 dark:text-slate-400">{tx("from")}<span className="block font-display text-[15px] font-bold text-slate-900 dark:text-white">{c.from}</span></span>
      <ArrowRight aria-hidden className="h-4 w-4 shrink-0 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-indigo-600 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
    </Link>
  );
}

// B · Icon tiles + list: the five categories as equal tiles (icon over a short name) that always fit, with no
// sideways scrolling; the products as slim rows, so a whole category fits on one phone screen.
function Tiles() {
  const { list, tab, tabId, setTabId } = useCatalog();
  return (
    <div className={shell}>
      <div className="grid gap-1 sm:gap-2" style={{ gridTemplateColumns: `repeat(${list.length}, minmax(0, 1fr))` }}>
        {list.map((t) => {
          const on = t.id === tabId;
          return (
            <button key={t.id} type="button" onClick={() => setTabId(t.id)} aria-pressed={on}
              className={`flex flex-col items-center gap-1.5 rounded-2xl px-1 py-2.5 transition-colors ${ring} ${on ? "bg-indigo-50 dark:bg-indigo-500/10" : "hover:bg-slate-100 dark:hover:bg-white/5"}`}>
              <span className={`grid h-10 w-10 place-items-center rounded-xl transition-all duration-300 ${on ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 dark:bg-indigo-500" : "bg-slate-100 text-slate-500 dark:bg-white/10 dark:text-slate-300"}`}><t.icon aria-hidden className="h-5 w-5" /></span>
              <span className={`text-center text-[11px] leading-tight sm:text-sm ${on ? "font-bold text-slate-900 dark:text-white" : "font-medium text-slate-500 dark:text-slate-400"}`}><TabName t={t} /></span>
            </button>
          );
        })}
      </div>
      <div key={tab.id} className="mt-3 grid gap-2 sm:grid-cols-2">
        {tab.cards.map((c, i) => <ProductRow key={c.name} c={c} i={i} />)}
      </div>
      <ViewAll tab={tab} />
    </div>
  );
}

// C · Chips + swipe cards: the categories as chips that wrap onto a second line instead of running off the
// screen; on phones the product cards sit side by side and swipe, with the next one peeking in.
function Swipe() {
  const tx = useT();
  const { list, tab, tabId, setTabId } = useCatalog();
  return (
    <div className={shell}>
      <div className="flex flex-wrap justify-center gap-2 p-1">
        {list.map((t) => {
          const on = t.id === tabId;
          return (
            <button key={t.id} type="button" onClick={() => setTabId(t.id)} aria-pressed={on}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm font-semibold transition-colors duration-300 ${ring} ${on ? "border-slate-900 bg-slate-900 text-white dark:border-white dark:bg-white dark:text-slate-900" : "border-slate-200 bg-white text-slate-600 hover:border-slate-400 dark:border-white/15 dark:bg-transparent dark:text-slate-300"}`}>
              <t.icon aria-hidden className="h-4 w-4" /><TabName t={t} />
            </button>
          );
        })}
      </div>
      <div key={tab.id} className={`-mx-3 mt-3 flex snap-x snap-mandatory gap-3 overflow-x-auto px-3 pb-2 [scrollbar-width:none] sm:mx-0 sm:grid sm:overflow-visible sm:px-0 [&::-webkit-scrollbar]:hidden ${cols[tab.cards.length] ?? ""}`}>
        {tab.cards.map((c, i) => (
          <Link key={c.name} href={c.href} style={{ animationDelay: `${i * 70}ms` }}
            className={`group relative flex w-[78%] shrink-0 animate-blur-in snap-start flex-col rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-indigo-300 hover:shadow-lg sm:w-auto sm:p-5 dark:border-white/10 dark:bg-[#0E1424] dark:hover:border-indigo-400/50 ${ring}`}>
            <span className="flex items-start justify-between gap-2"><span className={`grid h-11 w-11 place-items-center rounded-xl ${c.tint}`}><CardIcon c={c} className="h-5 w-5" /></span>{c.hot && <Hot />}</span>
            <span className="mt-3 font-display text-lg font-semibold text-slate-900 dark:text-white">{c.name}</span>
            <span className="mt-1 line-clamp-2 text-sm text-slate-500 dark:text-slate-400">{c.desc}</span>
            <ul className="mt-3 hidden space-y-1.5 sm:block">
              {c.features.map((f) => <li key={f} className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300"><Check aria-hidden className="h-3.5 w-3.5 text-emerald-500" />{f}</li>)}
            </ul>
            <span className="mt-auto flex items-end justify-between pt-4">
              <span className="text-xs text-slate-500 dark:text-slate-400">{tx("from")}{" "}<span className="block font-display text-xl font-bold text-slate-900 dark:text-white">{c.from}</span></span>
              <span className="grid h-9 w-9 place-items-center rounded-full bg-slate-900 text-white transition group-hover:bg-indigo-600 dark:bg-white/10"><ArrowRight aria-hidden className="h-4 w-4 rtl:rotate-180" /></span>
            </span>
          </Link>
        ))}
      </div>
      <ViewAll tab={tab} />
    </div>
  );
}

// D · Category menu: on phones every category is a row with its count, and the open one lists its products right
// under it (one open at a time); on wider screens the categories become a menu beside the products.
function Menu() {
  const tx = useT();
  const { list } = useCatalog();
  const [open, setOpen] = useState<string | null>(list[0].id);
  const wide = list.find((t) => t.id === open) ?? list[0];
  return (
    <div className={`${shell} md:grid md:grid-cols-[230px_minmax(0,1fr)] md:gap-4`}>
      <ul className="space-y-1.5">
        {list.map((t) => {
          const on = t.id === open;
          const onWide = t.id === wide.id;
          return (
            <li key={t.id}>
              <button type="button" onClick={() => setOpen(on ? null : t.id)} aria-expanded={on}
                className={`flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-start transition-colors ${ring} ${on ? "bg-white shadow-sm dark:bg-white/10" : "hover:bg-white/70 dark:hover:bg-white/5"} ${onWide ? "md:bg-white md:shadow-sm md:dark:bg-white/10" : "md:bg-transparent md:shadow-none"}`}>
                <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl transition-colors ${on || onWide ? "bg-indigo-600 text-white dark:bg-indigo-500" : "bg-slate-100 text-slate-500 dark:bg-white/10 dark:text-slate-300"} ${!on && onWide ? "max-md:bg-slate-100 max-md:text-slate-500 max-md:dark:bg-white/10 max-md:dark:text-slate-300" : ""}`}><t.icon aria-hidden className="h-5 w-5" /></span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-semibold text-slate-900 dark:text-white">{t.name}</span>
                  <span className="block text-xs text-slate-500 dark:text-slate-400">{tx("{0} services", { 0: tx.num(t.cards.length) })}</span>
                </span>
                <ChevronDown aria-hidden className={`h-4 w-4 shrink-0 text-slate-400 transition-transform duration-300 md:hidden ${on ? "rotate-180" : ""}`} />
              </button>
              {on && (
                <div className="space-y-2 px-1 pb-2 pt-2 md:hidden">
                  {t.cards.map((c, i) => <ProductRow key={c.name} c={c} i={i} />)}
                  <ViewAll tab={t} />
                </div>
              )}
            </li>
          );
        })}
      </ul>
      <div key={wide.id} className="hidden md:block">
        <div className="grid gap-2 lg:grid-cols-2">{wide.cards.map((c, i) => <ProductRow key={c.name} c={c} i={i} />)}</div>
        <ViewAll tab={wide} />
      </div>
    </div>
  );
}

// E · Segmented + mini cards: five equal segments (icon over a short name on phones) under one sliding pill, and
// the products as small cards two to a row: logo, name and price, with the details on wider screens.
function Mini() {
  const tx = useT();
  const { list, tab, tabId, setTabId } = useCatalog();
  const idx = list.findIndex((t) => t.id === tabId);
  return (
    <div className={shell}>
      <div className="relative grid rounded-2xl bg-slate-100/80 p-1 dark:bg-white/5" style={{ gridTemplateColumns: `repeat(${list.length}, minmax(0, 1fr))` }}>
        <span aria-hidden className="absolute inset-y-1 rounded-xl bg-white shadow-sm transition-[inset-inline-start] duration-500 ease-[cubic-bezier(.3,1.3,.5,1)] dark:bg-white/10"
          style={{ insetInlineStart: `calc(0.25rem + (100% - 0.5rem) / ${list.length} * ${idx})`, width: `calc((100% - 0.5rem) / ${list.length})` }} />
        {list.map((t) => {
          const on = t.id === tabId;
          return (
            <button key={t.id} type="button" onClick={() => setTabId(t.id)} aria-pressed={on}
              className={`relative z-10 flex min-w-0 flex-col items-center justify-center gap-1 rounded-xl px-1 py-2 text-[11px] leading-tight transition-colors duration-300 sm:flex-row sm:gap-2 sm:py-2.5 sm:text-sm ${ring} ${on ? "font-bold text-slate-900 dark:text-white" : "font-medium text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white"}`}>
              <t.icon aria-hidden className={`h-[18px] w-[18px] shrink-0 sm:h-4 sm:w-4 ${on ? "text-indigo-600 dark:text-indigo-300" : ""}`} /><span className="text-center"><TabName t={t} /></span>
            </button>
          );
        })}
      </div>
      <div key={tab.id} className={`mt-3 grid grid-cols-2 gap-2.5 ${tab.cards.length > 2 ? "lg:grid-cols-4" : ""}`}>
        {tab.cards.map((c, i) => (
          <Link key={c.name} href={c.href} style={{ animationDelay: `${i * 60}ms` }}
            className={`group relative flex animate-blur-in flex-col rounded-2xl border border-slate-200 bg-white p-3.5 transition hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-lg sm:p-5 dark:border-white/10 dark:bg-[#0E1424] dark:hover:border-indigo-400/50 ${ring} ${tab.cards.length % 2 === 1 && i === tab.cards.length - 1 ? "col-span-2 lg:col-span-1" : ""}`}>
            {c.hot && <Flame aria-label={tx("Popular")} className="absolute end-3 top-3 h-4 w-4 text-orange-500" />}
            <span className={`grid h-10 w-10 place-items-center rounded-xl ${c.tint}`}><CardIcon c={c} className="h-5 w-5" /></span>
            <span className="mt-3 line-clamp-2 font-display text-[15px] font-semibold leading-snug text-slate-900 sm:text-lg dark:text-white">{c.name}</span>
            <span className="mt-1 hidden line-clamp-2 text-sm text-slate-500 sm:block dark:text-slate-400">{c.desc}</span>
            <span className="mt-auto flex items-end justify-between gap-2 pt-3">
              {/* Toman prices are long ("۶٬۵۹۷٬۸۰۰ تومان"): one line, a touch smaller on phones, and no arrow there
                  (the whole card is the link), so «تومان» never drops to a line of its own in some cards only. */}
              <span className="min-w-0 text-[11px] text-slate-500 sm:text-xs dark:text-slate-400">{tx("from")}<span className="block whitespace-nowrap font-display text-[15px] font-bold tracking-tight text-slate-900 sm:text-xl dark:text-white">{c.from}</span></span>
              <ArrowRight aria-hidden className="hidden h-4 w-4 shrink-0 text-slate-400 transition group-hover:text-indigo-600 sm:block rtl:rotate-180" />
            </span>
          </Link>
        ))}
      </div>
      <ViewAll tab={tab} />
    </div>
  );
}

export const catalogStyles: Record<string, ComponentType> = { A: Tabs, B: Tiles, C: Swipe, D: Menu, E: Mini };

// The styles the live hero uses (design/decisions.json › hero-catalog): E on phones, where the old tabs ran off the
// screen, and the old tabs (A) from md up, as the owner asked. Both are in the page; CSS shows one.
export const CATALOG_STYLE_PHONE: keyof typeof catalogStyles = "E";
export const CATALOG_STYLE_WIDE: keyof typeof catalogStyles = "A";

export function CatalogWindow() {
  const Phone = catalogStyles[CATALOG_STYLE_PHONE] ?? Mini;
  const Wide = catalogStyles[CATALOG_STYLE_WIDE] ?? Tabs;
  return (
    <>
      <div className="md:hidden"><Phone /></div>
      <div className="hidden md:block"><Wide /></div>
    </>
  );
}

// Gallery: the window alone, at the hero's width, in Persian (the site's main language and the one that has to fit
// on a phone), on the hero's own background.
const demo = (S: ComponentType) => function CatalogDemo() {
  return (
    <div dir="rtl" lang="fa" className="rounded-3xl bg-[#F5F6FB] px-3 py-6 sm:px-6 dark:bg-[#070B14] [&>div]:mt-0">
      <LocaleProvider locale="fa"><S /></LocaleProvider>
    </div>
  );
};
export const CatalogA = demo(Tabs);
export const CatalogB = demo(Tiles);
export const CatalogC = demo(Swipe);
export const CatalogD = demo(Menu);
export const CatalogE = demo(Mini);
