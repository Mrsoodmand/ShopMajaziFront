"use client";
import { useEffect, useId, useRef, useState, type CSSProperties } from "react";
import { usePathname } from "next/navigation";
import { Gift, Star, User } from "lucide-react";
import { useMoney } from "@/lib/money";
import { perMonth, premiumFeatures } from "@/content/telegram-en";
import { primary } from "../googleVoice/clean";
import { Avatar, ring, type PremiumState } from "./parts";
import { featureIcons } from "./premium";
import type { Who } from "./night";
import { useT } from "@/i18n/client";

// Shared pieces of the theme-following Premium pages (R, S): unlike the night-sky offers, everything here follows
// the site theme (light lavender or the site's navy). Backgrounds, a solid panel, the who switch, the feature bento,
// the order card with the green Continue, and the phone jump bar.

// Solid cards that read well on both themes (Stars F's panel, in Premium violet).
export const glowPanel = "rounded-3xl border border-violet-200/80 bg-white shadow-[0_12px_32px_-12px_rgba(76,29,149,.18)] dark:border-white/10 dark:bg-[#0E1424] dark:shadow-[0_12px_32px_-12px_rgba(0,0,0,.6)]";
const hasRing = "has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-emerald-600 has-[:focus-visible]:ring-offset-2 dark:has-[:focus-visible]:ring-emerald-400 dark:has-[:focus-visible]:ring-offset-[#0E1424]";
// Text selection and caret in Premium violet.
export const glowSelection = "selection:bg-violet-200 selection:text-violet-950 dark:selection:bg-violet-400/40 dark:selection:text-white [&_input]:caret-violet-600 dark:[&_input]:caret-violet-300";

const Sparkle = ({ className = "", style }: { className?: string; style?: CSSProperties }) => (
  <svg aria-hidden viewBox="0 0 24 24" className={className} style={style}><path fill="currentColor" d="M12 0c1 8 4 11 12 12-8 1-11 4-12 12-1-8-4-11-12-12 8-1 11-4 12-12Z" /></svg>
);
// Fixed values so the server and browser render the same sparkles.
const sparkles = Array.from({ length: 8 }, (_, i) => ({ x: (i * 47 + 5) % 100, b: (i * 23) % 60, s: 6 + (i % 4) * 4, d: ((i * 9) % 80) / 10, t: 7 + (i % 5) }));

// Stars F's ground in Premium colours: lavender in light mode, the site's navy with a violet glow in dark mode, a
// faint dot grid near the top, and a fade into the page. A few sparkles drift up twice on load, then stop.
export function GlowBackground() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#EFE8FF_0%,#F8F5FF_50%,#F5F6FB_100%)] dark:bg-[linear-gradient(180deg,#140B26_0%,#0B0D16_50%,#070B14_100%)]" />
      <div className="absolute inset-x-0 top-0 h-[70%] bg-[radial-gradient(60%_70%_at_50%_0%,rgba(139,92,246,.30),transparent_70%)] dark:bg-[radial-gradient(60%_70%_at_50%_0%,rgba(139,92,246,.16),transparent_70%)]" />
      <div className="absolute -end-[10%] top-0 h-[45%] w-[45%] bg-[radial-gradient(closest-side,rgba(217,70,239,.14),transparent)] dark:bg-[radial-gradient(closest-side,rgba(217,70,239,.08),transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(rgba(109,40,217,.16)_1px,transparent_1px)] bg-[size:22px_22px] [mask-image:linear-gradient(to_bottom,black,transparent_75%)] dark:bg-[radial-gradient(rgba(196,181,253,.10)_1px,transparent_1px)]" />
      {sparkles.map((p, i) => (
        <Sparkle key={i} className="absolute animate-float-up text-violet-400 opacity-0 [animation-iteration-count:2] dark:text-fuchsia-200" style={{ left: `${p.x}%`, bottom: `${p.b}%`, width: p.s, height: p.s, animationDelay: `${p.d}s`, animationDuration: `${p.t}s` }} />
      ))}
    </div>
  );
}

// Single D's hero band in Premium's own gradient: darkened top and bottom so white text holds, a dot grid, and a
// soft light from the top end corner. Still.
export function BandBackground() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden bg-[linear-gradient(135deg,#4c1d95_0%,#6d28d9_45%,#c026d3_100%)]">
      <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/25 to-black/50" />
      <div className="absolute -end-[10%] -top-[30%] h-[90%] w-[55%] rounded-full bg-[radial-gradient(closest-side,rgba(240,171,252,.35),transparent)] blur-2xl" />
      <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,.12)_1px,transparent_1px)] bg-[size:20px_20px]" />
    </div>
  );
}

export function WhoSwitchGlow({ who, setWho }: { who: Who; setWho: (w: Who) => void }) {
  const t = useT();
  const name = useId();
  return (
    <fieldset>
      <legend className="text-base font-semibold text-slate-900 dark:text-white">{t("Who is it for?")}</legend>
      <div className="mt-3 grid grid-cols-2 gap-2.5">
        {([["me", t("For me"), User], ["gift", t("A gift"), Gift]] as const).map(([id, label, I]) => {
          const on = who === id;
          return (
            <label key={id} className={`flex cursor-pointer items-center gap-3 rounded-2xl border-2 px-4 py-3.5 transition-colors ${t.tr(hasRing)} ${on ? "border-violet-600 bg-violet-50 dark:border-violet-400 dark:bg-violet-400/10" : "border-slate-200 hover:border-slate-400 dark:border-white/15 dark:hover:border-white/40"}`}>
              <input type="radio" name={name} checked={on} onChange={() => setWho(id)} className="sr-only" />
              <I aria-hidden className={`h-5 w-5 ${on ? "text-violet-700 dark:text-violet-300" : "text-slate-500 dark:text-white/60"}`} /><span className="font-semibold text-slate-900 dark:text-white">{label}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

// K's feature bento on solid tiles; pointing at a tile lights a turning gradient border.
const span: Record<string, string> = { ads: "col-span-2 sm:row-span-2", upload: "col-span-2" };
export function BentoGlow() {
  const t = useT();
  return (
    <section aria-labelledby="bento-h">
      <h2 id="bento-h" className="font-display text-xl font-bold text-slate-900 dark:text-white">{t("What you get")}</h2>
      <ul className="mt-4 grid grid-flow-dense grid-cols-2 gap-3 sm:grid-cols-4">
        {t.tr(premiumFeatures).map((f, i) => {
          const I = featureIcons[f.id];
          const big = f.id === "ads";
          return (
            <li key={f.id} className={`group relative animate-fade-up overflow-hidden rounded-3xl p-px ${span[f.id] ?? ""}`} style={{ animationDelay: `${300 + i * 60}ms` }}>
              <span aria-hidden className="absolute -inset-[60%] animate-spin-slow bg-[conic-gradient(from_0deg,#d946ef,transparent_30%,#7c3aed,transparent_70%,#d946ef)] opacity-0 transition-opacity duration-300 [animation-duration:6s] group-hover:opacity-100" />
              <div className={`relative h-full rounded-[calc(1.5rem-1px)] border border-violet-200/80 bg-white dark:border-white/10 dark:bg-[#0E1424] ${big ? "p-6" : "p-4"}`}>
                <span aria-hidden className={`grid place-items-center rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white shadow-[0_6px_14px_-6px_rgba(124,58,237,.6)] transition duration-300 group-hover:rotate-6 group-hover:scale-110 ${big ? "h-14 w-14" : "h-10 w-10"}`}><I className={big ? "h-7 w-7" : "h-5 w-5"} /></span>
                <h3 className={`mt-4 font-semibold text-slate-900 dark:text-white ${big ? "font-display text-2xl" : ""}`}>{f.title}</h3>
                <p className={`mt-1 text-slate-600 dark:text-slate-400 ${big ? "text-base" : "text-sm"}`}>{f.text}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

// Sidebar: the recipient's profile on the Premium gradient, the order, and the site's green Continue (a submit
// button of the page's form). Follows the site theme below the profile.
export function OrderCardGlow({ pm, who, className = "" }: { pm: PremiumState; who: Who; className?: string }) {
  const usd = useMoney().format;
  const t = useT();
  const u = pm.r.user;
  const sample = usePathname()?.startsWith("/design") ?? false;
  return (
    <section aria-labelledby="pm-order" className={`${t.tr(glowPanel)} overflow-hidden ${className}`}>
      <div className="border-b border-slate-200 px-6 pb-6 pt-7 text-center dark:border-white/10">
        <h2 id="pm-order" className="sr-only">{t("Your order")}</h2>
        <div className="relative mx-auto grid h-[4.5rem] w-[4.5rem] place-items-center">
          {u && <span aria-hidden className="absolute inset-0 rounded-full bg-[conic-gradient(#d946ef,#8b5cf6,#fbbf24,#d946ef)]" />}
          <span key={u?.username ?? "none"} className={`relative rounded-full ${u ? "animate-pop ring-[3px] ring-white dark:ring-[#0E1424]" : ""}`}>
            {u ? <Avatar u={u} size="lg" /> : <span aria-hidden className="grid h-16 w-16 place-items-center rounded-full bg-violet-100 text-violet-700 dark:bg-white/10 dark:text-violet-300"><User className="h-7 w-7" /></span>}
          </span>
        </div>
        <p aria-live="polite" className="mt-3 flex items-center justify-center gap-1.5 font-display text-xl font-bold text-slate-900 dark:text-white">
          {u ? u.name : pm.r.checking ? t("Checking…") : who === "gift" ? t("Your friend") : t("You")}
          <Star aria-hidden className={`h-5 w-5 fill-violet-600 text-violet-600 transition duration-500 ease-out dark:fill-violet-400 dark:text-violet-400 ${u ? "scale-100 opacity-100" : "scale-50 opacity-0"}`} />
        </p>
        <p className="text-sm text-slate-600 dark:text-slate-400">{u ? `@${u.username}` : t("Enter a username")}</p>
      </div>
      <div className="p-6 text-[15px]">
        <dl className="divide-y divide-slate-200 dark:divide-white/10">
          {([[t("Plan"), t("Premium · {0}", { 0: pm.plan.label })], [t("Per month"), usd(perMonth(pm.plan))], [who === "gift" ? t("From") : t("For"), who === "gift" ? t("You, as a gift") : t("Your account")], [t("Activation"), t("A few minutes")]] as const).map(([k, v]) => (
            <div key={k} className="flex justify-between gap-4 py-2.5"><dt className="text-slate-600 dark:text-slate-400">{k}</dt><dd className="min-w-0 truncate text-end font-medium tabular-nums text-slate-900 dark:text-white">{v}</dd></div>
          ))}
        </dl>
        <div aria-live="polite" className="mt-2 flex items-baseline justify-between border-t border-slate-200 pt-4 dark:border-white/10"><span className="text-slate-600 dark:text-slate-400">{t("Total")}</span><span className="font-display text-2xl font-bold tabular-nums text-slate-900 dark:text-white">{usd(pm.total)}</span></div>
        <button type="submit" className={`${primary} mt-5 w-full tabular-nums`}>{t("Continue ·")}{" "}{usd(pm.total)}</button>
        <p role="status" className="mt-2.5 text-center text-sm font-semibold text-red-700 empty:hidden dark:text-red-400">{pm.blocker ?? ""}</p>
        <p className="mt-3 text-center text-sm text-slate-600 dark:text-slate-400">{t("Pay with your wallet, card or crypto on the next step.")}</p>
        {sample && <p className="mt-2 text-center text-xs text-slate-500 dark:text-slate-400">{t("Sample prices and account lookup (design preview)")}</p>}
      </div>
    </section>
  );
}

// On phones the order card is below the form: a small bar shows the total and jumps to it until it's in view.
export function useJump(pm: PremiumState) {
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

export function JumpBarGlow({ pm, inView, go }: { pm: PremiumState; inView: boolean; go: () => void }) {
  const usd = useMoney().format;
  const t = useT();
  return (
    <div className={`fixed inset-x-0 bottom-0 z-40 border-t border-violet-200 bg-white px-4 py-3 shadow-[0_-8px_24px_-12px_rgba(0,0,0,.25)] transition-transform duration-300 lg:hidden dark:border-white/10 dark:bg-[#0E1424] ${inView ? "translate-y-full" : "translate-y-0"}`} aria-hidden={inView} inert={inView}>
      <div className="mx-auto flex max-w-xl items-center justify-between gap-4">
        <span className="min-w-0"><span className={`block truncate text-sm ${pm.r.user ? "text-slate-600 dark:text-slate-400" : "font-semibold text-violet-800 dark:text-violet-300"}`}>{pm.r.user ? t("Premium · {0} for @{1}", { 0: pm.plan.label, 1: pm.r.user.username }) : t("Add a username to continue")}</span><span className="font-display text-xl font-bold tabular-nums text-slate-900 dark:text-white">{usd(pm.total)}</span></span>
        <button type="button" onClick={go} className={`shrink-0 whitespace-nowrap rounded-xl border border-slate-300 px-4 py-2.5 font-semibold text-slate-900 dark:border-white/20 dark:text-white ${ring}`}>{t("Review order")}</button>
      </div>
    </div>
  );
}
