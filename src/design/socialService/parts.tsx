"use client";

import { createContext, useContext, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import Link from "@/i18n/Link";
import { BadgeCheck, CalendarClock, ChevronLeft, Gauge, Headphones, KeyRound, MessageSquareQuote, RefreshCw, ShieldCheck, Sparkles, Timer, Undo2, Wallet, type LucideIcon } from "lucide-react";
import { useT } from "@/i18n/client";
import { formatNum } from "@/i18n/translate";
import { MoneyProvider, useMoney } from "@/lib/money";
import { categoryHref, type SocialCategory } from "@/content/social-categories-en";
import { liveSocialFaq } from "@/content/social-en";
import type { ServiceComment } from "@/content/service-extras-en";
import type { LiveService } from "@/lib/social";
import { card, primary, ring, SocialFaq } from "../social/kit";
import { LiveSocialOrderProvider, useLiveSocialOrder, type LiveSocialOrder } from "../social/live";
import type { LiveOrder } from "../social/liveOrder";

// Shared by the single social service page offers (/design/page-social-service, live at
// /virtual-service/{platform}/{service}). Every offer runs on the live order logic (social/liveOrder.tsx), so the
// one picked works with the admin's data as is. In the gallery it gets a Telegram members fixture instead.
// Trust shown is only what is true: no password, refund to the wallet when an order can't start, support, Enamad,
// the service's own notes from the admin, and real approved comments (samples only in the gallery, labelled).

export { card, primary, ring };

// ---------- Data: live or the gallery's fixture ----------

const tg: SocialCategory = { slug: "telegram", name: "Telegram", short: "Members, views, reactions", color: "#0ea5e9", icon: "telegram", order: 1, services: [] };

function fixture(fa: boolean): LiveSocialOrder {
  const L = (en: string, f: string) => (fa ? f : en);
  const link = { name: "link", title: L("Channel link", "لینک کانال"), kind: "text" as const, options: [], link: true };
  const notes = (start: string, speed: string, refill: string, feature: string) => [
    { label: L("Start", "شروع"), value: start }, { label: L("Speed", "سرعت"), value: speed },
    { label: L("Refill", "جبران ریزش"), value: refill }, { label: L("Feature", "ویژگی"), value: feature },
  ];
  const services: LiveService[] = [
    { id: 11, slug: "members", name: L("Telegram channel members", "ممبر کانال تلگرام"), per1000: 180_000, plans: [],
      count: { step: 500, price: 90_000, min: 500, max: 50_000 }, fields: [link],
      notes: notes(L("Within 1 hour", "تا ۱ ساعت"), L("Up to 5,000 a day", "تا ۵٬۰۰۰ در روز"), L("30 days", "۳۰ روز"), L("No login needed", "بدون نیاز به ورود")) },
    { id: 12, slug: "iranian-members", name: L("Iranian members", "ممبر ایرانی"), per1000: 320_000, fields: [link], count: null,
      plans: [{ id: 1, count: 1000, price: 320_000 }, { id: 2, count: 2000, price: 620_000 }, { id: 3, count: 5000, price: 1_500_000 }, { id: 4, count: 10000, price: 2_900_000 }],
      notes: notes(L("Within 3 hours", "تا ۳ ساعت"), L("Up to 2,000 a day", "تا ۲٬۰۰۰ در روز"), L("60 days", "۶۰ روز"), L("Active Iranian accounts", "اکانت‌های فعال ایرانی")) },
    { id: 13, slug: "views", name: L("Post views", "بازدید پست"), per1000: 8_000, plans: [], count: { step: 500, price: 4_000, min: 500, max: 100_000 }, fields: [link],
      notes: notes(L("Within 10 minutes", "تا ۱۰ دقیقه"), L("Up to 50,000 a day", "تا ۵۰٬۰۰۰ در روز"), L("None", "ندارد"), L("Last 5 posts", "۵ پست آخر")) },
  ];
  return {
    platforms: [tg], platform: { ...tg, name: L("Telegram", "تلگرام") }, services, initialService: "members",
    title: services[0].name,
    sub: L("Members for a public channel or group. Paste the link, pick an amount, pay. We never ask for your password.",
      "ممبر برای کانال یا گروه عمومی. لینک را بگذارید، تعداد را انتخاب کنید و پرداخت کنید. هیچ‌وقت رمز عبور نمی‌خواهیم."),
    faq: undefined,
  };
}

const sampleComments = (fa: boolean): ServiceComment[] => fa ? [
  { id: "s1", name: "سارا", date: "۲ آبان ۱۴۰۵", text: "سفارش ۲ هزار ممبر دادم، کمتر از یک ساعت شروع شد و تا شب کامل شد.", replies: [{ name: "پشتیبانی شاپ مجازی", date: "۲ آبان ۱۴۰۵", text: "ممنون از اعتمادتون.", staff: true }] },
  { id: "s2", name: "محمد", date: "۲۸ مهر ۱۴۰۵", text: "لینک رو اشتباه زده بودم، سفارش لغو شد و پولش برگشت به کیف پول." },
  { id: "s3", name: "نگار", date: "۱۹ مهر ۱۴۰۵", text: "بعد از دو هفته یه مقدار ریزش داشت، از صفحه سفارش جبران رو زدم و درست شد." },
] : [
  { id: "s1", name: "Sara", date: "Oct 24, 2026", text: "Ordered 2,000 members, it started within the hour and was done by night.", replies: [{ name: "ShopMajazi support", date: "Oct 24, 2026", text: "Thanks for trusting us.", staff: true }] },
  { id: "s2", name: "Mohammad", date: "Oct 20, 2026", text: "I pasted the wrong link; the order was cancelled and the money went back to my wallet." },
  { id: "s3", name: "Negar", date: "Oct 11, 2026", text: "Some dropped after two weeks, I pressed Refill on the order page and it was topped up." },
];

export type PageData = { d: LiveSocialOrder; comments: ServiceComment[]; preview: boolean };

const PreviewCtx = createContext(false);

// Every offer's root: the live page's data as is, or (gallery) the fixture in Toman with sample comments.
export function ServiceRoot({ children }: { children: ReactNode }) {
  const live = useLiveSocialOrder();
  const tx = useT();
  if (live) return <>{children}</>;
  const fa = tx.locale === "fa";
  return (
    <PreviewCtx.Provider value>
      <MoneyProvider currency="toman">
        <LiveSocialOrderProvider value={{ ...fixture(fa), comments: sampleComments(fa) }}>{children}</LiveSocialOrderProvider>
      </MoneyProvider>
    </PreviewCtx.Provider>
  );
}

export function usePageData(): PageData {
  const d = useLiveSocialOrder()!;
  return { d, comments: d.comments ?? [], preview: useContext(PreviewCtx) };
}

// ---------- Facts from the admin's notes ----------

const NOTE_ICONS: [RegExp, LucideIcon][] = [
  [/start|شروع/i, Timer], [/speed|سرعت|روز/i, Gauge], [/refill|ریزش|جبران/i, RefreshCw], [/guarant|گارانتی|ضمانت/i, ShieldCheck],
  [/time|delivery|تحویل|مدت/i, CalendarClock], [/feature|ویژگی|خصوصیت/i, Sparkles],
];
export const noteIcon = (label: string) => NOTE_ICONS.find(([r]) => r.test(label))?.[1] ?? BadgeCheck;
export const facts = (o: LiveOrder) => (o.service?.notes ?? []).filter((n) => !/نوع|type/i.test(n.label));

// Notes as tiles. `cols` sets the grid; on phones it's always two per row.
export function FactTiles({ o, className = "", cols = "sm:grid-cols-4", tone = "card" }: { o: LiveOrder; className?: string; cols?: string; tone?: "card" | "glass" }) {
  const list = facts(o);
  if (!list.length) return null;
  const box = tone === "glass" ? "border-white/15 bg-white/10 text-white" : "border-slate-200 bg-white dark:border-white/10 dark:bg-white/[.04]";
  return (
    <dl className={`grid grid-cols-2 gap-2.5 ${cols} ${className}`}>
      {list.slice(0, 4).map((n) => {
        const Icon = noteIcon(n.label);
        return (
          <div key={n.label} className={`rounded-2xl border p-3.5 ${box}`}>
            <dt className={`flex items-center gap-1.5 text-xs font-medium ${tone === "glass" ? "text-white/80" : "text-slate-600 dark:text-slate-400"}`}><Icon aria-hidden className="h-4 w-4 shrink-0" style={tone === "glass" ? undefined : { color: "var(--tone, #0ea5e9)" }} />{n.label}</dt>
            <dd className={`mt-1 font-semibold leading-snug ${tone === "glass" ? "text-white" : "text-slate-900 dark:text-white"}`}>{n.value}</dd>
          </div>
        );
      })}
    </dl>
  );
}

// ---------- Promises ----------

export function usePromises() {
  const tx = useT();
  return [
    { Icon: KeyRound, title: tx("No password, ever"), text: tx("We only need the public link. Nobody from us will ask for a login code.") },
    { Icon: Undo2, title: tx("Refund if it can't start"), text: tx("Wrong or private link? The order is cancelled and the money goes back to your wallet.") },
    { Icon: Headphones, title: tx("Real support"), text: tx("Message us from your order page and a person answers, around the clock.") },
    { Icon: BadgeCheck, title: tx("Registered with Enamad"), text: tx("ShopMajazi is a registered Iranian online shop.") },
  ];
}

export function PromiseGrid({ className = "", compact = false }: { className?: string; compact?: boolean }) {
  const items = usePromises();
  return (
    <ul className={`grid gap-3 sm:grid-cols-2 ${compact ? "" : "lg:grid-cols-4"} ${className}`}>
      {items.map(({ Icon, title, text }) => (
        <li key={title} className={`${card} flex gap-3 p-4`}>
          <span aria-hidden className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300"><Icon className="h-5 w-5" /></span>
          <span className="min-w-0"><span className="block font-semibold text-slate-900 dark:text-white">{title}</span><span className="mt-0.5 block text-sm leading-6 text-slate-600 dark:text-slate-400">{text}</span></span>
        </li>
      ))}
    </ul>
  );
}

// ---------- After you pay ----------

export function AfterPay({ className = "" }: { className?: string }) {
  const tx = useT();
  const steps = [
    { Icon: Wallet, t: tx("You pay"), s: tx("From your wallet, or by card through ZarinPal.") },
    { Icon: ShieldCheck, t: tx("We check the link"), s: tx("If it's public and right, delivery starts. If not, you get your money back.") },
    { Icon: Gauge, t: tx("It's delivered"), s: tx("At the speed shown above. Follow it in your orders.") },
    { Icon: RefreshCw, t: tx("Drops are refilled"), s: tx("Within the refill period, press Refill on the order.") },
  ];
  return (
    <ol className={`relative grid gap-5 sm:grid-cols-4 ${className}`}>
      {steps.map(({ Icon, t, s }, i) => (
        <li key={t} className="relative flex gap-3 sm:flex-col">
          {i < steps.length - 1 && <span aria-hidden className="absolute start-5 top-11 h-[calc(100%-1.25rem)] w-px bg-slate-200 sm:start-11 sm:top-5 sm:h-px sm:w-[calc(100%-2rem)] dark:bg-white/10" />}
          <span aria-hidden className="relative grid h-10 w-10 shrink-0 place-items-center rounded-full border-2 bg-white dark:bg-[#0E1424]" style={{ borderColor: "var(--tone, #0ea5e9)", color: "var(--tone, #0ea5e9)" }}><Icon className="h-5 w-5" /></span>
          <span className="min-w-0 pb-1"><span className="block font-semibold text-slate-900 dark:text-white">{t}</span><span className="mt-0.5 block text-sm leading-6 text-slate-600 dark:text-slate-400">{s}</span></span>
        </li>
      ))}
    </ol>
  );
}

// ---------- Comments ----------

export function CommentCard({ c, className = "" }: { c: ServiceComment; className?: string }) {
  const reply = c.replies?.find((r) => r.staff) ?? c.replies?.[0];
  return (
    <figure className={`${card} flex h-full flex-col p-5 ${className}`}>
      <MessageSquareQuote aria-hidden className="h-5 w-5 text-slate-400" />
      <blockquote className="mt-2 flex-1 text-[15px] leading-7 text-slate-800 dark:text-slate-200">{c.text}</blockquote>
      <figcaption className="mt-4 flex items-center justify-between gap-3 text-sm"><span className="font-semibold text-slate-900 dark:text-white">{c.name}</span><span className="text-slate-500 dark:text-slate-400">{c.date}</span></figcaption>
      {reply && <p className="mt-3 rounded-xl bg-slate-50 p-3 text-sm leading-6 text-slate-700 dark:bg-white/5 dark:text-slate-300"><span className="font-semibold text-emerald-800 dark:text-emerald-300">{reply.name}: </span>{reply.text}</p>}
    </figure>
  );
}

// Phones: a swipe row; from sm up a grid. Nothing at all when there are no approved comments.
export function Comments({ p, title, className = "" }: { p: PageData; title?: string; className?: string }) {
  const tx = useT();
  if (!p.comments.length) return null;
  return (
    <section aria-labelledby="svc-comments" className={className}>
      <div className="flex items-end justify-between gap-4">
        <h2 id="svc-comments" className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-white">{title ?? tx("What buyers said")}</h2>
        <span className="text-sm text-slate-600 dark:text-slate-400">{tx("{0} comments", { 0: formatNum(p.comments.length, tx.locale) })}</span>
      </div>
      {p.preview && <p className="mt-1 text-xs text-amber-700 dark:text-amber-300">{tx("Sample comments in this preview. The live page shows real, approved ones.")}</p>}
      <div className="-mx-4 mt-5 flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0">
        {p.comments.slice(0, 6).map((c) => <CommentCard key={c.id} c={c} className="w-[82%] shrink-0 snap-start sm:w-auto" />)}
      </div>
    </section>
  );
}

// ---------- FAQ, article, other services ----------

export function Questions({ d, className = "" }: { d: LiveSocialOrder; className?: string }) {
  const tx = useT();
  return (
    <section aria-labelledby="svc-faq" className={className}>
      <h2 id="svc-faq" className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-white">{tx("Common questions")}</h2>
      <div className="mt-5"><SocialFaq items={d.faq?.length ? d.faq : tx.tr(liveSocialFaq)} /></div>
    </section>
  );
}

// The admin's article, folded on phones after the first two paragraphs.
export function Article({ d, className = "" }: { d: LiveSocialOrder; className?: string }) {
  const tx = useT();
  const [open, setOpen] = useState(false);
  if (!d.article) return null;
  const blocks = d.article.blocks;
  const long = blocks.length > 3;
  return (
    <section aria-labelledby="svc-about" className={className}>
      <h2 id="svc-about" className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-white">{d.article.title}</h2>
      <div className={`relative mt-5 space-y-4 text-[15px] leading-8 text-slate-700 dark:text-slate-300 ${long && !open ? "max-h-72 overflow-hidden sm:max-h-none" : ""}`}>
        {blocks.map((b, i) => b.kind === "h" ? <h3 key={i} className="pt-3 font-display text-lg font-semibold text-slate-900 dark:text-white">{b.text}</h3> : <p key={i}>{b.text}</p>)}
        {long && !open && <span aria-hidden className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#F5F6FB] sm:hidden dark:from-[#070B14]" />}
      </div>
      {long && !open && <button type="button" onClick={() => setOpen(true)} className={`mt-3 rounded-lg font-semibold text-emerald-800 sm:hidden dark:text-emerald-300 ${ring}`}>{tx("Read more")}</button>}
    </section>
  );
}

export function OtherServices({ o, className = "" }: { o: LiveOrder; className?: string }) {
  const tx = useT();
  const money = useMoney();
  const others = o.d.services.filter((s) => s.id !== o.service?.id);
  if (!others.length) return null;
  return (
    <nav aria-labelledby="svc-others" className={className}>
      <h2 id="svc-others" className="font-display text-xl font-bold text-slate-900 dark:text-white">{tx("More {0} services", { 0: o.d.platform.name })}</h2>
      <ul className="mt-4 grid gap-2 sm:grid-cols-3">
        {others.map((s) => (
          <li key={s.id}>
            <Link href={`${categoryHref(o.d.platform)}/${s.slug}`} className={`${card} flex items-center justify-between gap-3 !rounded-2xl p-4 hover:border-slate-300 dark:hover:border-white/30 ${ring}`}>
              <span className="min-w-0"><span className="block truncate font-semibold text-slate-900 dark:text-white">{s.name}</span><span className="block text-sm tabular-nums text-slate-600 dark:text-slate-400">{tx("from {0} / 1,000", { 0: money.format(s.per1000) })}</span></span>
              <ChevronLeft aria-hidden className="h-4 w-4 shrink-0 text-slate-400 ltr:rotate-180" />
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

// ---------- Price and pay ----------

export function useTotal(o: LiveOrder) {
  const money = useMoney();
  const ok = !!o.total && !o.qtyError;
  return { ok, total: ok ? money.format(o.total) : "—", amount: o.count && !o.qtyError ? o.num(o.count) : "—", from: o.service ? money.format(o.service.per1000) : "—" };
}

// Phones: a bar fixed to the bottom with the total and the pay button itself (not a jump), hidden while `hide`.
export function PayBar({ o, hide = false, label }: { o: LiveOrder; hide?: boolean; label?: string }) {
  const tx = useT();
  const t = useTotal(o);
  return (
    <div className={`fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 px-4 pb-[max(.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur transition-transform duration-300 lg:hidden dark:border-white/10 dark:bg-[#0E1424]/95 ${hide ? "translate-y-full" : ""}`} aria-hidden={hide} inert={hide}>
      <div className="mx-auto flex max-w-xl items-center gap-3">
        <span className="min-w-0 flex-1">
          <span className="block truncate text-xs text-slate-600 dark:text-slate-400">{t.amount} · {o.service?.name}</span>
          <span className="block font-display text-xl font-bold tabular-nums text-slate-900 dark:text-white">{t.total}</span>
        </span>
        <button type="button" onClick={o.proceed} disabled={!o.service} className={`${primary} !px-5 !py-3 disabled:opacity-50`}>{label ?? tx("Pay")}</button>
      </div>
      {o.blocker && <p role="alert" className="mx-auto mt-2 max-w-xl text-center text-sm font-semibold text-red-700 dark:text-red-400">{o.blocker}</p>}
    </div>
  );
}

// True while the element is on screen (to hide the pay bar when the real button shows).
export function useOnScreen<T extends Element>() {
  const ref = useRef<T>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setOn(e.isIntersecting), { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, on] as const;
}

export function Breadcrumb({ d, light = false }: { d: LiveSocialOrder; light?: boolean }) {
  const tx = useT();
  const c = light ? "text-white/80 hover:text-white" : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white";
  return (
    <nav aria-label={tx("Breadcrumb")} className="text-sm">
      <ol className="flex flex-wrap items-center gap-1.5">
        <li><Link href="/virtual-service" className={`rounded ${c} ${ring}`}>{tx("Social media services")}</Link></li>
        <li aria-hidden className={light ? "text-white/50" : "text-slate-400"}>/</li>
        <li><Link href={categoryHref(d.platform)} className={`rounded ${c} ${ring}`}>{d.platform.name}</Link></li>
      </ol>
    </nav>
  );
}

// The platform colour as --tone for the icons and lines the offers draw.
export const toneVars = (d: LiveSocialOrder) => ({ "--tone": d.platform.color }) as CSSProperties;

export const Section = ({ children, className = "" }: { children: ReactNode; className?: string }) => <div className={`mx-auto max-w-6xl px-4 sm:px-6 ${className}`}>{children}</div>;
