"use client";
import { useEffect, useId, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Gift, Star, User } from "lucide-react";
import { useMoney } from "@/lib/money";
import { perMonth, premiumFeatures, tgHeadings } from "@/content/telegram-en";
import { useHasExtras } from "../service/slot";
import { primary } from "../googleVoice/clean";
import { Avatar, H2, TgFaq, Trust, type PremiumState } from "./parts";
import { featureIcons } from "./premium";
import { useT } from "@/i18n/client";

// Shared pieces of the Premium Night Sky pages (Premium L to Q): the always-dark sky, the turning Premium badge, the
// who switch, the feature sheet, the sidebar order card with the green Continue, and the phone jump bar.
// Motion vocabulary: one turn plus a sparkle burst when the plan changes or the account is found; a few sparkles
// drift up twice on load. Nothing loops; reduced motion stills everything (globals.css).

// Telegram's own spectrum for the feature squares, in sheet order.
export const spectrum = ["bg-[#ef4444]", "bg-[#f97316]", "bg-[#eab308]", "bg-[#22c55e]", "bg-[#06b6d4]", "bg-[#3b82f6]", "bg-[#8b5cf6]", "bg-[#d946ef]"];
export const panel = "rounded-3xl border border-white/12 bg-[#140a2a] shadow-[0_16px_40px_-20px_rgba(0,0,0,.8)]";
// The site's emerald focus ring, with the gap in the panel colour.
export const focusRing = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#140a2a]";
export const hasFocusRing = "has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-emerald-400 has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-[#140a2a]";

// A four-point sparkle.
export const Sparkle = ({ className = "", style }: { className?: string; style?: CSSProperties }) => (
  <svg aria-hidden viewBox="0 0 24 24" className={className} style={style}><path fill="currentColor" d="M12 0c1 8 4 11 12 12-8 1-11 4-12 12-1-8-4-11-12-12 8-1 11-4 12-12Z" /></svg>
);

// Fixed values so server and browser match.
const stars = Array.from({ length: 70 }, (_, i) => ({ x: (i * 37 + 11) % 100, y: (i * 53 + 7) % 92, s: i % 9 === 0 ? 2.5 : (i % 3) * 0.6 + 1, o: 0.18 + ((i * 7) % 10) / 18 }));
const glints = [{ x: 14, y: 22, s: 10 }, { x: 31, y: 9, s: 7 }, { x: 58, y: 16, s: 8 }, { x: 73, y: 34, s: 6 }, { x: 88, y: 12, s: 11 }, { x: 46, y: 41, s: 6 }];
// Fine grain over the gradients so they don't band.
const grain = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>")`;
const rising = Array.from({ length: 8 }, (_, i) => ({ x: (i * 47 + 5) % 100, b: (i * 23) % 60, s: 6 + (i % 4) * 4, d: ((i * 9) % 80) / 10, t: 7 + (i % 5) }));
const burstAt = (r: number) => Array.from({ length: 7 }, (_, i) => { const a = (i / 7) * Math.PI * 2; return { dx: `${Math.round(Math.cos(a) * r)}px`, dy: `${Math.round(Math.sin(a) * r)}px` }; });
const burst = burstAt(70);

// Counts changes of the given values after the first render (drives one-shot animations by remounting with a key).
export function useChanges(deps: unknown[]) {
  const [n, setN] = useState(0);
  const first = useRef(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { if (first.current) { first.current = false; return; } setN((x) => x + 1); }, deps);
  return n;
}

// Sparkles flying out from the centre of the parent, once per `n` change.
export function Burst({ n, radius = 70, className = "text-fuchsia-200" }: { n: number; radius?: number; className?: string }) {
  if (!n) return null;
  const pts = radius === 70 ? burst : burstAt(radius);
  return <>{pts.map((b, i) => <Sparkle key={`${n}-${i}`} className={`absolute start-1/2 top-1/2 h-3 w-3 animate-burst sm:h-4 sm:w-4 ${className}`} style={{ "--dx": b.dx, "--dy": b.dy } as CSSProperties} />)}</>;
}

// The Premium star badge: grows a little with the plan length; each plan change, and the account being found, makes
// it turn once and throw sparkles. Small on phones.
export function Badge({ months, found, size = "hero" }: { months: number; found: string; size?: "hero" | "small" }) {
  const t = useT();
  const changes = useChanges([months, found]);
  const grow = months === 3 ? 0.88 : months === 6 ? 0.98 : 1.08;
  const box = size === "hero" ? "h-20 w-20 sm:h-36 sm:w-36" : "h-24 w-24";
  const face = size === "hero" ? "h-14 w-14 rounded-[1.1rem] sm:h-24 sm:w-24 sm:rounded-[1.75rem]" : "h-16 w-16 rounded-[1.25rem]";
  const icon = size === "hero" ? "h-8 w-8 sm:h-14 sm:w-14" : "h-9 w-9";
  return (
    <div aria-hidden className={`relative grid shrink-0 place-items-center ${box}`}>
      <span className="absolute inset-0 rounded-full border-2 border-dashed border-fuchsia-300/40" />
      <Burst n={changes} radius={size === "hero" ? 70 : 52} />
      <span className="grid place-items-center transition-transform duration-500 ease-out [perspective:600px]" style={{ transform: `scale(${grow})` }}>
        <span key={changes} className={`grid place-items-center bg-[linear-gradient(135deg,#a78bfa,#7c3aed_45%,#c026d3)] shadow-[inset_0_-6px_12px_rgba(46,16,101,.45),0_10px_24px_-6px_rgba(192,38,211,.55)] [transform-style:preserve-3d] ${face} ${changes > 0 ? "animate-coin-once" : ""}`}>
          <Star className={`fill-white text-white drop-shadow-[0_2px_4px_rgba(46,16,101,.5)] ${icon}`} />
        </span>
      </span>
      <span key={`m${months}`} className="absolute -bottom-3 animate-pop rounded-full bg-white px-2.5 py-0.5 font-display text-xs font-bold tabular-nums text-violet-800 sm:text-sm">{months}{" "}{t("mo")}</span>
    </div>
  );
}

// The Premium Night Sky ground, always dark: deep violet with a soft glow from the top, two still aurora bands, a
// faint planet rim low down, still stars with a few four-point glints, fine grain, and a fade at the bottom into the
// page colour of the current theme (so there's no hard edge). The only motion: a few sparkles drift up twice on load.
export function PremiumSky() {
  const t = useT();
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden bg-[#0b0617]">
      <div className="absolute inset-0 bg-[radial-gradient(120%_70%_at_50%_-10%,#6d28d9_0%,rgba(76,29,149,.55)_35%,transparent_70%)]" />
      <div className="absolute -start-[20%] top-[8%] h-[55%] w-[70%] -rotate-12 rounded-[50%] bg-[radial-gradient(closest-side,rgba(139,92,246,.35),transparent)] blur-2xl" />
      <div className="absolute -end-[15%] top-[2%] h-[45%] w-[60%] rotate-12 rounded-[50%] bg-[radial-gradient(closest-side,rgba(217,70,239,.22),transparent)] blur-2xl" />
      <div className="absolute start-1/2 top-[62%] aspect-square w-[180%] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(46,16,101,0)_80%,rgba(124,58,237,.18)_97%,rgba(196,181,253,.3)_99%,transparent_100%)] rtl:translate-x-1/2" />
      {stars.map((p, i) => <span key={i} className="absolute rounded-full bg-violet-50" style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.s, height: p.s, opacity: p.o }} />)}
      {glints.map((g, i) => <Sparkle key={`g${i}`} className="absolute text-fuchsia-100/80" style={{ left: `${g.x}%`, top: `${g.y}%`, width: g.s, height: g.s }} />)}
      {rising.map((p, i) => <Sparkle key={`r${i}`} className="absolute animate-float-up text-fuchsia-200 opacity-0 [animation-iteration-count:2]" style={{ left: `${p.x}%`, bottom: `${p.b + 15}%`, width: p.s, height: p.s, animationDelay: `${p.d}s`, animationDuration: `${p.t}s` }} />)}
      <div className="absolute inset-0 opacity-[.09] mix-blend-soft-light" style={{ backgroundImage: t.tr(grain) }} />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-[#070B14] [:root:not(.dark)_&]:to-[#F5F6FB]" />
    </div>
  );
}

// The always-dark top section: the Premium sky, the title row (with optional art), the trust row, then the page's
// own content.
export function NightHero({ title = tgHeadings.premium.h1, sub = tgHeadings.premium.sub, art, children }: { title?: ReactNode; sub?: ReactNode; art?: ReactNode; children: ReactNode }) {
  const t = useT();
  if (title === t.tr(tgHeadings).premium.h1) title = t.tr(tgHeadings).premium.h1;
  if (sub === t.tr(tgHeadings).premium.sub) sub = t.tr(tgHeadings).premium.sub;
  return (
    <section id="buy" aria-labelledby="pm-h1" className="dark relative -mt-16 scroll-mt-16 overflow-hidden pb-44 pt-24 sm:pt-28 selection:bg-violet-300 selection:text-violet-950 [&_input]:caret-violet-300">
      <PremiumSky />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex items-center justify-between gap-5">
          <div className="min-w-0">
            <h1 id="pm-h1" className="text-balance font-display text-3xl font-bold tracking-tight text-white sm:text-5xl">{title}</h1>
            <p className="mt-2 max-w-2xl text-base leading-relaxed text-violet-100 sm:mt-3 sm:text-lg">{sub}</p>
          </div>
          {art}
        </div>
        <div className="mt-4 sm:mt-6 [&_li]:text-violet-50"><Trust light items={[t("Gift to your username"), t("No password needed"), t("Active in minutes")]} /></div>
        {children}
      </div>
    </section>
  );
}

export type Who = "me" | "gift";

export function WhoSwitch({ who, setWho, legend = "Who is it for?" }: { who: Who; setWho: (w: Who) => void; legend?: string }) {
  const t = useT();
  legend = t(legend);
  const name = useId();
  return (
    <fieldset>
      <legend className="text-base font-semibold text-white">{legend}</legend>
      <div className="mt-3 grid grid-cols-2 gap-2.5">
        {([["me", t("For me"), User], ["gift", t("A gift"), Gift]] as const).map(([id, label, I]) => {
          const on = who === id;
          return (
            <label key={id} className={`flex cursor-pointer items-center gap-3 rounded-2xl border-2 px-4 py-3.5 transition-colors ${hasFocusRing} ${on ? "border-violet-400 bg-white/[.07]" : "border-white/20 hover:border-white/45"}`}>
              <input type="radio" name={name} checked={on} onChange={() => setWho(id)} className="sr-only" />
              <I aria-hidden className={`h-5 w-5 ${on ? "text-violet-300" : "text-white/60"}`} /><span className="font-semibold text-white">{label}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

// The sheet heading with Telegram's Premium emblem; names the recipient once the account is found.
export function SheetHeading({ pm, id }: { pm: PremiumState; id: string }) {
  const t = useT();
  const u = pm.r.user;
  return (
    <h2 id={id} aria-live="polite" className="flex items-center gap-3 px-1 font-display text-lg font-semibold text-white">
      <span aria-hidden className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[linear-gradient(135deg,#7c3aed,#c026d3)] shadow-[0_6px_16px_-6px_rgba(192,38,211,.7)]"><Star className="h-5 w-5 fill-white text-white" /></span>
      {u ? <span key={u.username} className="animate-fade-up [animation-duration:400ms]">{u.name}{" "}{t("gets")}</span> : t("Premium includes")}
    </h2>
  );
}

// The feature list as Telegram's Premium sheet: one line per row. `compact` is a 2 x 4 grid of squares with titles.
export function FeatureSheet({ pm, compact = false, idSuffix = "" }: { pm: PremiumState; compact?: boolean; idSuffix?: string }) {
  if (compact) return (
    <section aria-labelledby={`sheet-h-compact${idSuffix}`} className={`${panel} p-5`}>
      <SheetHeading pm={pm} id={`sheet-h-compact${idSuffix}`} />
      <FeatureGridCompact />
    </section>
  );
  return (
    <section aria-labelledby={`sheet-h${idSuffix}`} className={`${panel} p-5 sm:p-6`}>
      <SheetHeading pm={pm} id={`sheet-h${idSuffix}`} />
      <FeatureRows />
    </section>
  );
}

export function FeatureRows({ className = "mt-3" }: { className?: string }) {
  const t = useT();
  return (
    <ul className={className}>
      {t.tr(premiumFeatures).map((f, i) => {
        const I = featureIcons[f.id];
        return (
          <li key={f.id} className="flex items-center gap-3.5 border-b border-white/[.07] px-1 py-2.5 last:border-0">
            <span aria-hidden className={`grid h-8 w-8 shrink-0 place-items-center rounded-[9px] text-white ${spectrum[i]}`}><I className="h-[18px] w-[18px]" /></span>
            <span className="min-w-0"><span className="block font-semibold text-white">{f.title}</span><span className="block text-sm text-violet-100/70">{f.short}</span></span>
          </li>
        );
      })}
    </ul>
  );
}

export function FeatureGridCompact({ cols = "sm:grid-cols-4" }: { cols?: string }) {
  const t = useT();
  return (
    <ul className={`mt-4 grid grid-cols-2 gap-x-4 gap-y-3 ${cols}`}>
      {t.tr(premiumFeatures).map((f, i) => {
        const I = featureIcons[f.id];
        return <li key={f.id} className="flex items-center gap-2.5 text-sm font-semibold text-white"><span aria-hidden className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg text-white ${spectrum[i]}`}><I className="h-4 w-4" /></span>{f.title}</li>;
      })}
    </ul>
  );
}

// Sidebar: the recipient's profile (unless the page shows it elsewhere), the order and Continue (the site's green
// button, a submit button of the page's form).
export function OrderCard({ pm, who, profile = true }: { pm: PremiumState; who: Who; profile?: boolean }) {
  const usd = useMoney().format;
  const t = useT();
  const u = pm.r.user;
  // On the design comparison pages, say that prices and the looked-up account are samples.
  const sample = usePathname()?.startsWith("/design") ?? false;
  return (
    <section aria-labelledby="pm-order" className={`${panel} overflow-hidden`}>
      {profile ? (
        <div className="relative bg-[linear-gradient(135deg,#4c1d95,#7c3aed_55%,#c026d3)] px-6 pb-6 pt-7 text-center text-white">
          <h2 id="pm-order" className="sr-only">{t("Your order")}</h2>
          <div className="relative mx-auto grid h-[4.5rem] w-[4.5rem] place-items-center">
            {u && <span aria-hidden className="absolute inset-0 rounded-full bg-[conic-gradient(#f0abfc,#a78bfa,#fde68a,#f0abfc)]" />}
            <span key={u?.username ?? "none"} className={`relative rounded-full ${u ? "animate-pop ring-[3px] ring-[#5b21b6]" : ""}`}>
              {u ? <Avatar u={u} size="lg" /> : <span aria-hidden className="grid h-16 w-16 place-items-center rounded-full bg-white/20"><User className="h-7 w-7" /></span>}
            </span>
          </div>
          <p aria-live="polite" className="mt-3 flex items-center justify-center gap-1.5 font-display text-xl font-bold">
            {u ? u.name : pm.r.checking ? t("Checking…") : who === "gift" ? t("Your friend") : t("You")}
            <Star aria-hidden className={`h-5 w-5 fill-white text-white transition duration-500 ease-out ${u ? "scale-100 opacity-100" : "scale-50 opacity-0"}`} />
          </p>
          <p className="text-sm text-white/85">{u ? `@${u.username}` : t("Enter a username")}</p>
        </div>
      ) : (
        <h2 id="pm-order" className="border-b border-white/10 px-6 pb-4 pt-6 font-display text-lg font-semibold text-white">{t("Your order")}</h2>
      )}
      <div className="p-6 text-[15px]">
        <dl className="divide-y divide-white/10">
          {([[t("Plan"), t("Premium · {0}", { 0: pm.plan.label })], [t("Per month"), usd(perMonth(pm.plan))], ...(profile ? [] : [[t("To"), u ? `@${u.username}` : "—"] as const]), [who === "gift" ? t("From") : t("For"), who === "gift" ? t("You, as a gift") : t("Your account")], [t("Activation"), t("A few minutes")]] as const).map(([k, v]) => (
            <div key={k} className="flex justify-between gap-4 py-2.5"><dt className="text-violet-100/70">{k}</dt><dd className="min-w-0 truncate text-end font-medium tabular-nums text-white">{v}</dd></div>
          ))}
        </dl>
        <div aria-live="polite" className="mt-2 flex items-baseline justify-between border-t border-white/10 pt-4"><span className="text-violet-100/70">{t("Total")}</span><span className="font-display text-2xl font-bold tabular-nums text-white">{usd(pm.total)}</span></div>
        <button type="submit" className={`${primary} mt-5 w-full tabular-nums`}>{t("Continue ·")}{" "}{usd(pm.total)}</button>
        <p role="status" className="mt-2.5 text-center text-sm font-semibold text-red-300 empty:hidden">{pm.blocker ?? ""}</p>
        <p className="mt-3 text-center text-sm text-violet-100/70">{t("Pay with your wallet, card or crypto on the next step.")}</p>
        {sample && <p className="mt-2 text-center text-xs text-violet-100/60">{t("Sample prices and account lookup (design preview)")}</p>}
      </div>
    </section>
  );
}

// On phones the order card sits below the form: a small bar shows what's missing or the total, and jumps to Continue.
export function useJumpBar(pm: PremiumState) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, [pm.order]);
  const go = () => { ref.current?.scrollIntoView({ behavior: "smooth", block: "center" }); ref.current?.querySelector<HTMLButtonElement>("button[type=submit]")?.focus({ preventScroll: true }); };
  return { ref, inView, go };
}

export function JumpBar({ pm, inView, go }: { pm: PremiumState; inView: boolean; go: () => void }) {
  const usd = useMoney().format;
  const t = useT();
  return (
    <div className={`fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[#140a2a] px-4 py-3 text-white shadow-[0_-8px_24px_-12px_rgba(0,0,0,.6)] transition-transform duration-300 lg:hidden ${inView ? "translate-y-full" : "translate-y-0"}`} aria-hidden={inView} inert={inView}>
      <div className="mx-auto flex max-w-xl items-center justify-between gap-4">
        <span className="min-w-0"><span className={`block truncate text-sm ${pm.r.user ? "text-violet-100/70" : "font-semibold text-violet-200"}`}>{pm.r.user ? t("Premium · {0} for @{1}", { 0: pm.plan.label, 1: pm.r.user.username }) : t("Add a username to continue")}</span><span className="font-display text-xl font-bold tabular-nums">{usd(pm.total)}</span></span>
        <button type="button" onClick={go} className={`shrink-0 whitespace-nowrap rounded-xl border border-white/25 px-4 py-2.5 font-semibold ${focusRing}`}>{t("Review order")}</button>
      </div>
    </div>
  );
}

// The FAQ under the top section (the live page adds the shared sections instead).
export function PremiumFaq() {
  const t = useT();
  const extras = useHasExtras();
  if (extras) return null;
  return <div className="mx-auto max-w-6xl px-4 pb-28 pt-12 sm:px-6"><section aria-labelledby="faq" className="max-w-3xl"><H2 id="faq">{t("Common questions")}</H2><div className="mt-6"><TgFaq s="premium" /></div></section></div>;
}

// Form wrapper: Enter in any field works like Continue.
export function PremiumForm({ pm, className, children }: { pm: PremiumState; className: string; children: ReactNode }) {
  return <form noValidate onSubmit={(e) => { e.preventDefault(); pm.proceed(); }} className={className}>{children}</form>;
}

// Date the plan would end if it started today, like "26 October 2027".
export const untilDate = (months: number) => { const d = new Date(); d.setMonth(d.getMonth() + months); return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }); };
