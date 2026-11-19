"use client";

import { createContext, useContext, type ReactNode } from "react";
import Link from "@/i18n/Link";
import { Eye, Heart, MessageCircle, Sparkles, UserPlus, Users, type LucideIcon } from "lucide-react";
import { useT } from "@/i18n/client";
import { MoneyProvider } from "@/lib/money";
import { categoryHref, type SocialCategory } from "@/content/social-categories-en";
import type { LiveService } from "@/lib/social";
import { PageShell } from "../otp/parts";
import { LiveSocialOrderProvider, useLiveSocialOrder, type LiveSocialOrder } from "../social/live";
import { LiveMark, LiveOrderView, useLiveOrder, type LiveOrder } from "../social/liveOrder";
import { icons } from "../social/listKit";
import { AfterPay, Article, PromiseGrid, Questions, ring, Section } from "../socialService/parts";
import { PostRow } from "../service/ServiceExtras";
import BackToTop from "@/components/ui/BackToTop";

// Shared by the platform page offers F–J (/design/page-social, live at /virtual-service/{platform}). Every offer runs
// on the live order logic (social/liveOrder.tsx), so the one picked works with the admin's platforms, services,
// packages and fields as they are. In the gallery it gets a Telegram fixture shaped like the real data: four
// services, two with packages and two with any amount.

// ---------- Data: live or the gallery's fixture ----------

const tg: SocialCategory = { slug: "telegram", name: "Telegram", short: "Members, views, reactions", color: "#0ea5e9", icon: "telegram", order: 1, services: [] };
const ig: SocialCategory = { slug: "instagram", name: "Instagram", short: "Followers, likes, views", color: "#e1306c", icon: "instagram", order: 2, services: [] };

function fixture(fa: boolean): LiveSocialOrder {
  const L = (en: string, f: string) => (fa ? f : en);
  const link = { name: "link", title: L("Channel link", "لینک کانال"), kind: "text" as const, options: [], link: true };
  const notes = (time: string, feature: string) => [
    { label: L("Delivery", "مدت تحویل"), value: time }, { label: L("Support", "پشتیبانی"), value: L("24/7 support", "پشتیبانی ۲۴ ساعته") },
    { label: L("Feature", "خصوصیت"), value: feature },
  ];
  const plans = (per1000: number) => [500, 1000, 2000, 3000, 5000, 10000, 20000, 30000].map((n, i) => ({ id: i + 1, count: n, price: (per1000 * n) / 1000 }));
  const services: LiveService[] = [
    { id: 21, slug: "real-members", name: L("Real Telegram members, 100% guaranteed", "ممبر واقعی تلگرام ۱۰۰ درصد ضمانتی"), per1000: 224_000, count: null, plans: plans(224_000), fields: [link],
      notes: notes(L("Instant", "تحویل آنی"), L("No login needed", "بدون لاگین")) },
    { id: 22, slug: "fake-members", name: L("Fake Telegram members", "ممبر فیک تلگرام"), per1000: 48_000, count: null, plans: plans(48_000), fields: [link],
      notes: notes(L("Instant", "تحویل آنی"), L("No login needed", "بدون نیاز به لاگین")) },
    { id: 23, slug: "last-post-views", name: L("Last post views", "بازدید آخرین پست تلگرام"), per1000: 6_000, plans: [], count: { step: 500, price: 3_000, min: 500, max: 100_000 },
      fields: [{ ...link, title: L("Post link", "لینک پست") }], notes: notes(L("Instant", "تحویل آنی"), L("No login needed", "بدون لاگین")) },
    { id: 24, slug: "votes-likes", name: L("Telegram votes and likes", "رای و لایک تلگرام"), per1000: 95_000, count: null,
      plans: [{ id: 31, count: 100, price: 12_000 }, { id: 32, count: 500, price: 50_000 }, { id: 33, count: 1000, price: 95_000 }, { id: 34, count: 2000, price: 185_000 }],
      fields: [{ ...link, title: L("Post link", "لینک پست") }], notes: notes(L("Right away", "تحویل فوری"), L("No login needed", "بدون نیاز به لاگین")) },
  ];
  const tgName = { ...tg, name: L("Telegram", "تلگرام"), short: L("Members, views and votes for channels and groups", "ممبر، بازدید و رای برای کانال و گروه") };
  return {
    platforms: [tgName, { ...ig, name: L("Instagram", "اینستاگرام") }], platform: tgName, services,
    title: L("Buy Telegram services", "خرید خدمات تلگرام"),
    sub: L("Pick a service and an amount, paste the link and pay. We never ask for your password.", "خدمت و تعداد را انتخاب کنید، لینک را بگذارید و پرداخت کنید. هیچ‌وقت رمز عبور نمی‌خواهیم."),
  };
}

const PreviewCtx = createContext(false);

export function PlatformRoot({ children }: { children: ReactNode }) {
  const live = useLiveSocialOrder();
  const tx = useT();
  if (live) return <>{children}</>;
  return (
    <PreviewCtx.Provider value>
      <MoneyProvider currency="toman">
        <LiveSocialOrderProvider value={fixture(tx.locale === "fa")}>{children}</LiveSocialOrderProvider>
      </MoneyProvider>
    </PreviewCtx.Provider>
  );
}

export function usePlatform() {
  const d = useLiveSocialOrder()!;
  const o = useLiveOrder(d);
  return { d, o, preview: useContext(PreviewCtx) };
}

// ---------- A service at a glance ----------

const KIND: [RegExp, LucideIcon][] = [
  [/ممبر|member|subscriber|عضو/i, Users], [/فالوور|follower/i, UserPlus], [/بازدید|ویو|view/i, Eye],
  [/رای|vote|لایک|like|reaction|ری‌اکشن/i, Heart], [/کامنت|comment|نظر/i, MessageCircle],
];
export const serviceIcon = (s: LiveService) => KIND.find(([r]) => r.test(s.name))?.[1] ?? Sparkles;

export const notesOf = (s: LiveService) => s.notes.filter((n) => !/نوع|type/i.test(n.label));
export const noteOf = (s: LiveService, r: RegExp) => s.notes.find((n) => r.test(n.label))?.value;
export const featureOf = (s: LiveService) => noteOf(s, /خصوصیت|ویژگی|feature/i);
export const deliveryOf = (s: LiveService) => noteOf(s, /تحویل|شروع|delivery|start/i);

// "8 packages" or "500 to 100,000".
export function useRange() {
  const tx = useT();
  return (o: LiveOrder, s: LiveService) => s.count
    ? tx("{0} to {1}", { 0: o.num(s.count.min), 1: o.num(s.count.max) })
    : tx("{0} packages", { 0: o.num(s.plans.length) });
}

// ---------- Platform switch ----------

// Every platform is its own page: a row of links, the current one marked.
export function PlatformSwitch({ d, look = "chips", className = "" }: { d: LiveSocialOrder; look?: "chips" | "glass" | "tabs"; className?: string }) {
  const tx = useT();
  const shown = d.platforms.some((p) => p.slug === d.platform.slug) ? d.platforms : [d.platform, ...d.platforms];
  if (shown.length < 2) return null;
  const base = look === "tabs"
    ? "flex items-center gap-2 border-b-2 px-1 pb-3 pt-1 text-sm font-semibold transition-colors"
    : "flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-semibold transition-colors";
  const on = { chips: "border-slate-900 bg-slate-900 text-white dark:border-white dark:bg-white dark:text-slate-900", glass: "border-white bg-white text-slate-900", tabs: "border-[var(--tone)] text-slate-900 dark:text-white" }[look];
  const off = { chips: "border-slate-300 bg-white text-slate-800 hover:border-slate-400 dark:border-white/20 dark:bg-white/5 dark:text-white dark:hover:border-white/40", glass: "border-white/40 text-white hover:bg-white/10", tabs: "border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white" }[look];
  return (
    <nav aria-label={tx("Platforms")} className={className}>
      <ul className={`flex gap-2 ${look === "tabs" ? "gap-6" : "flex-wrap"}`}>
        {shown.map((p) => {
          const here = p.slug === d.platform.slug;
          const Icon = !p.logo && p.icon ? icons[p.icon] : undefined;
          return (
            <li key={p.slug}>
              <Link href={categoryHref(p)} aria-current={here ? "page" : undefined} className={`${base} ${here ? on : off} ${ring}`}>
                {p.logo ? <img src={p.logo} alt="" className="h-5 w-5 rounded-md object-cover" /> : Icon ? <Icon aria-hidden className="h-4 w-4" /> : null}{p.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export function Crumb({ light = false }: { light?: boolean }) {
  const tx = useT();
  return (
    <Link href="/virtual-service" className={`rounded text-sm ${light ? "text-white/80 hover:text-white" : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"} ${ring}`}>
      {tx("Social media services")}
    </Link>
  );
}

export function Title({ d, light = false, className = "" }: { d: LiveSocialOrder; light?: boolean; className?: string }) {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <LiveMark c={d.platform} size="lg" className="shrink-0 shadow-lg shadow-slate-900/10" />
      <div className="min-w-0">
        <h1 className={`text-balance font-display text-3xl font-bold tracking-tight sm:text-4xl ${light ? "text-white" : "text-slate-900 dark:text-white"}`}>{d.title}</h1>
        {d.sub && <p className={`mt-1.5 max-w-2xl text-[15px] leading-7 sm:text-base ${light ? "text-white/85" : "text-slate-700 dark:text-slate-300"}`}>{d.sub}</p>}
      </div>
    </div>
  );
}

// ---------- States ----------

export function Done({ o }: { o: LiveOrder }) {
  return <PageShell><div className="px-4 py-14 sm:px-6"><LiveOrderView o={o} /></div></PageShell>;
}

// Nothing to sell: the backend's error, or a platform with no services on sale.
export function Empty({ o }: { o: LiveOrder }) {
  const tx = useT();
  if (o.d.error) return <p role="alert" className="font-semibold text-red-700 dark:text-red-400">{o.d.error}</p>;
  if (!o.service) return <p className="text-slate-700 dark:text-slate-300">{tx("No {0} services are on sale right now. Have a look at the other platforms above.", { 0: o.d.platform.name })}</p>;
  return null;
}

// ---------- Below the order ----------

export function PlatformBelow({ d }: { d: LiveSocialOrder }) {
  const tx = useT();
  return (
    <Section className="space-y-14 pb-32 pt-16 sm:space-y-16">
      <section aria-labelledby="pf-promise"><h2 id="pf-promise" className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-white">{tx("Why it's safe to order")}</h2><PromiseGrid className="mt-5" /></section>
      <section aria-labelledby="pf-after"><h2 id="pf-after" className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-white">{tx("What happens after you pay")}</h2><AfterPay className="mt-6" /></section>
      {/* The FAQ stays in view beside the (usually longer) article on wide screens. */}
      <div className="grid gap-14 lg:grid-cols-2 lg:items-start lg:gap-10">
        <Questions d={d} className="lg:sticky lg:top-24" />
        <Article d={d} />
      </div>
      {!!d.posts?.length && <PostRow posts={d.posts} cat={d.platform.slug === "telegram" ? "telegram" : "social"} name={d.platform.name} className="!px-0" />}
      <BackToTop raised />
    </Section>
  );
}
