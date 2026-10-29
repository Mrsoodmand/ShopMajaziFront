"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Link from "@/i18n/Link";
import {
  ArrowRight, Search, Flame, Check, Smartphone, Apple, Sparkles, Users, Send, Instagram, Zap, ShieldCheck,
  MessageSquareCode, Phone, CalendarClock, UserPen, BadgeCheck, Bot, Clapperboard, Headphones, Palette, Crown, Megaphone, type LucideIcon,
} from "lucide-react";
import { brand } from "@/content/en";
import { useT } from "@/i18n/client";

// Each card is a category; clicking it opens that category's own page.
type Card = { name: string; desc: string; features: string[]; from: string; href: string; icon: LucideIcon; tint: string; hot?: boolean };
type Tab = { id: string; name: string; icon: LucideIcon; cards: Card[]; viewAll?: string };

const catalog: Tab[] = [
  {
    id: "numbers", name: "Virtual Numbers", icon: Smartphone,
    cards: [
      { name: "Virtual Number (OTP)", desc: "One-time numbers to receive a verification code", features: ["150+ countries", "2,000+ apps", "Refund if no SMS"], from: "$0.30", href: "/virtual-number", icon: MessageSquareCode, tint: "bg-indigo-100 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300", hot: true },
      { name: "Google Voice", desc: "A permanent US number that is yours to keep", features: ["Calls & SMS", "Choose your area code", "Full ownership"], from: "$9.90", href: "/google-voice", icon: Phone, tint: "bg-sky-100 text-sky-600 dark:bg-sky-500/15 dark:text-sky-300" },
      { name: "Rent Number", desc: "Keep a number for days or weeks with unlimited SMS", features: ["7 to 30 days", "Unlimited codes", "Extend any time"], from: "$4.90", href: "/rent-number", icon: CalendarClock, tint: "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300" },
    ],
  },
  {
    id: "apple", name: "Apple ID", icon: Apple,
    cards: [
      { name: "Custom USA Apple ID", desc: "Made with your own name and email address", features: ["Your details", "Verified 2FA option", "Lifetime support"], from: "$9.00", href: "/apple-id/custom", icon: UserPen, tint: "bg-slate-200 text-slate-800 dark:bg-white/10 dark:text-slate-200", hot: true },
      { name: "USA Apple ID", desc: "Ready-made US Apple ID, delivered instantly", features: ["Instant delivery", "Email access option", "Works on all devices"], from: "$6.50", href: "/apple-id/usa", icon: BadgeCheck, tint: "bg-blue-100 text-blue-600 dark:bg-blue-500/15 dark:text-blue-300" },
    ],
  },
  {
    id: "subs", name: "Subscriptions", icon: Sparkles, viewAll: "/accounts",
    cards: [
      { name: "ChatGPT Plus", desc: "GPT access on your own account", features: ["1 month", "Your account"], from: "$22.00", href: "/accounts/chatgpt-plus", icon: Bot, tint: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300", hot: true },
      { name: "Netflix Premium", desc: "4K streaming on every screen", features: ["1 month", "4K UHD"], from: "$8.00", href: "/accounts/netflix", icon: Clapperboard, tint: "bg-red-100 text-red-600 dark:bg-red-500/15 dark:text-red-300" },
      { name: "Spotify Premium", desc: "Ad-free music, offline listening", features: ["1 month", "Individual"], from: "$4.00", href: "/accounts/spotify", icon: Headphones, tint: "bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-300" },
      { name: "Canva Pro", desc: "Every premium template and tool", features: ["1 year", "All Pro features"], from: "$12.00", href: "/accounts/canva", icon: Palette, tint: "bg-cyan-100 text-cyan-700 dark:bg-cyan-500/15 dark:text-cyan-300" },
    ],
  },
  {
    id: "telegram", name: "Telegram", icon: Send,
    cards: [
      { name: "Telegram Premium", desc: "Gifted straight to your account, no login needed", features: ["3, 6 or 12 months", "Just your username", "Instant activation"], from: "$11.90", href: "/telegram/premium", icon: Crown, tint: "bg-violet-100 text-violet-600 dark:bg-violet-500/15 dark:text-violet-300", hot: true },
      { name: "Telegram Ads", desc: "Sponsored messages in the channels your audience reads", features: ["Target by channel or topic", "Campaign setup included", "Live performance reports"], from: "$50.00", href: "/telegram/ads", icon: Megaphone, tint: "bg-sky-100 text-sky-600 dark:bg-sky-500/15 dark:text-sky-300" },
    ],
  },
  {
    id: "social", name: "Social Media Services", icon: Users, viewAll: "/virtual-service",
    cards: [
      { name: "Telegram", desc: "Members, post views and reactions", features: ["Real members", "Instant start"], from: "$1.20", href: "/virtual-service/telegram", icon: Send, tint: "bg-sky-100 text-sky-600 dark:bg-sky-500/15 dark:text-sky-300", hot: true },
      { name: "Instagram", desc: "Followers, likes and Reels views", features: ["High quality", "Drip-feed option"], from: "$0.90", href: "/virtual-service/instagram", icon: Instagram, tint: "bg-pink-100 text-pink-600 dark:bg-pink-500/15 dark:text-pink-300" },
      // YouTube and TikTok come back here once they have services in admin › Virtual services.
    ],
  },
];

const cols: Record<number, string> = { 2: "sm:grid-cols-2", 3: "sm:grid-cols-2 lg:grid-cols-3", 4: "sm:grid-cols-2 lg:grid-cols-4" };

// Offer G — "Catalog Tabs": centered headline over a tabbed shop window. Each tab shows its categories as cards that lead to the category page.
// `bare` drops the built-in nav for pages with a separate site header: "overlay" when that header floats over the hero
// (adds room for it at the top), "flow" when it sits above the hero.
export default function HeroG({ bare }: { bare?: "overlay" | "flow" }) {
  const tx = useT();
  const [tabId, setTabId] = useState(tx.tr(catalog)[0].id);
  const tab = tx.tr(catalog).find((t) => t.id === tabId)!;

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
    <section className="relative overflow-hidden bg-[#F5F6FB] dark:bg-[#070B14]">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 start-[8%] h-[420px] w-[420px] rounded-full bg-indigo-300/50 blur-[110px] dark:bg-indigo-600/30" />
        <div className="absolute -top-20 end-[6%] h-[380px] w-[380px] rounded-full bg-fuchsia-300/40 blur-[110px] dark:bg-fuchsia-600/20" />
        <div className="absolute top-[38%] start-1/2 h-[360px] w-[760px] -translate-x-1/2 rounded-full bg-sky-300/40 blur-[120px] dark:bg-cyan-500/15" />
        <div className="absolute inset-0 bg-[radial-gradient(rgba(15,23,42,.12)_1px,transparent_1px)] bg-[size:22px_22px] dark:bg-[radial-gradient(rgba(255,255,255,.08)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_at_top,black_20%,transparent_70%)]" />
      </div>

      {!bare && <nav className="relative mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <span className="font-display text-xl font-bold text-slate-900">{tx.tr(brand).name}</span>
        <div className="hidden w-80 items-center gap-2 rounded-full border border-white bg-white/70 px-4 py-2 text-sm text-slate-400 shadow-sm backdrop-blur md:flex">
          <Search className="h-4 w-4" />{tx("Search 2,000+ services")}
        </div>
        <a href="#" className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white">{tx("Sign in")}</a>
      </nav>}

      <div className={`relative mx-auto max-w-6xl px-6 pb-20 text-center ${bare === "overlay" ? "pt-28 md:pt-32" : "pt-12 md:pt-16"}`}>
        <span className="inline-flex items-center gap-2 rounded-full border border-white bg-white/70 px-3 py-1 text-xs font-medium text-slate-600 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
          <Zap className="h-3.5 w-3.5 text-amber-500" />{tx("Instant delivery")}<span className="text-slate-300 dark:text-slate-600">·</span><ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />{tx("Refund guarantee")}
        </span>
        <h1 className="mx-auto mt-6 max-w-4xl font-display text-4xl font-bold leading-[1.05] tracking-tight text-slate-900 sm:text-6xl dark:text-white">
          {tx("Shop digital services")}{" "}<span className="bg-gradient-to-r from-indigo-600 to-fuchsia-500 bg-clip-text dark:from-indigo-300 dark:to-fuchsia-300 text-transparent">{tx("like a pro.")}</span>
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-lg text-slate-600 dark:text-slate-400">{tx("Real numbers, real accounts, real growth. Instant delivery and a refund if anything goes wrong.")}</p>

        <div className="mt-12 rounded-3xl border border-white bg-white/80 p-3 text-start shadow-2xl shadow-indigo-200/60 backdrop-blur-xl dark:border-white/10 dark:bg-white/[.04] dark:shadow-black/40">
          <div className="relative flex gap-1 overflow-x-auto rounded-2xl bg-slate-100/80 p-1 dark:bg-white/5">
            <span aria-hidden className="absolute inset-y-1 rounded-xl bg-white shadow-sm transition-all duration-500 ease-[cubic-bezier(.3,1.3,.5,1)] dark:bg-white/10" style={{ left: pill.left, width: pill.width }} />
            {tx.tr(catalog).map((t) => {
              const on = t.id === tabId;
              return (
                <button key={t.id} ref={(el) => { tabRefs.current[t.id] = el; }} onClick={() => setTabId(t.id)} className={`relative z-10 flex shrink-0 flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-medium transition-colors duration-300 ${on ? "text-slate-900 dark:text-white" : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white"}`}>
                  <t.icon className="h-4 w-4" />{t.name}
                </button>
              );
            })}
          </div>

          <div className={`grid gap-3 p-2 pt-4 ${cols[tab.cards.length]}`}>
            {tab.cards.map((c, i) => (
              <div key={tab.id + c.name} className="animate-fade-up" style={{ animationDelay: `${i * 60}ms` }}>
              <Link href={c.href} className="group relative flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-lg dark:border-white/10 dark:bg-[#0E1424] dark:hover:border-indigo-400/50 dark:hover:shadow-black/30">
                {c.hot && <span className="absolute end-4 top-4 flex items-center gap-1 rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-semibold text-orange-600 dark:bg-orange-500/15 dark:text-orange-300"><Flame className="h-3 w-3" />{tx("Popular")}</span>}
                <span className={`grid h-11 w-11 place-items-center rounded-xl ${c.tint}`}><c.icon className="h-5 w-5" /></span>
                <div className="mt-4 font-display text-lg font-semibold text-slate-900 dark:text-white">{c.name}</div>
                <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">{c.desc}</div>
                <ul className="mt-4 space-y-1.5">
                  {c.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300"><Check className="h-3.5 w-3.5 text-emerald-500" />{f}</li>
                  ))}
                </ul>
                <div className="mt-auto flex items-end justify-between pt-6">
                  <span className="text-xs text-slate-500 dark:text-slate-400">{tx("from")}{" "}<span className="block font-display text-2xl font-bold text-slate-900 dark:text-white">{c.from}</span></span>
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-slate-900 text-white transition group-hover:bg-indigo-600 dark:bg-white/10"><ArrowRight className="h-4 w-4" /></span>
                </div>
              </Link>
              </div>
            ))}
          </div>
          {tab.viewAll && (
            <Link key={tab.id} href={tab.viewAll} className="group mx-auto mt-1 flex w-fit animate-fade-up [animation-delay:180ms] items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-medium text-indigo-600 hover:bg-indigo-50 dark:text-indigo-300 dark:hover:bg-indigo-500/10">
              {tx("View all")}{" "}{tab.name.toLowerCase()} <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
