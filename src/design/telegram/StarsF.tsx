"use client";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { ArrowUp, ChevronDown } from "lucide-react";
import { useMoney } from "@/lib/money";
import { POPULAR_PACK, STAR_MAX, STAR_MIN, tgHeadings } from "@/content/telegram-en";
import { PageShell } from "../otp/parts";
import { useHasExtras } from "../service/slot";
import { primary } from "../googleVoice/clean";
import { H2, ring, StarAmountInput, StarGlyph, StarsCheckout, TgFaq, TgOrderView, Trust, UsernameField, useStars, type StarsState } from "./parts";
import { PackRadios, StarsBlocker, starsLabel, StarsSummary, TierLine, TierNudge, UsesList } from "./stars";
import { useT } from "@/i18n/client";

// Stars F — "Pack Grid on Gold Glow": username, six packs (with their saving) or any amount, and the order summary
// with Continue in the sidebar, on a warm gold background that follows the site theme (cream in light mode, the
// site's navy with a gold glow in dark mode) and fades into the page below.
// One motion moment: the gold coin. It stays still until the amount changes, then turns once, grows a little,
// throws a few sparkles and shows the new amount. A handful of sparkles drift up twice when the page opens, then
// stop. Reduced motion keeps it all still.

const PACKS = [100, 250, 500, 1000, 2500, 10000];
const fmt = (n: number) => n.toLocaleString("en-US");

// Solid cards that read well on both themes.
export const panel = "rounded-3xl border border-amber-200/80 bg-white shadow-[0_12px_32px_-12px_rgba(120,53,15,.18)] dark:border-white/10 dark:bg-[#0E1424] dark:shadow-[0_12px_32px_-12px_rgba(0,0,0,.6)]";

// A four-point sparkle.
const Sparkle = ({ className = "", style }: { className?: string; style?: CSSProperties }) => (
  <svg aria-hidden viewBox="0 0 24 24" className={className} style={style}><path fill="currentColor" d="M12 0c1 8 4 11 12 12-8 1-11 4-12 12-1-8-4-11-12-12 8-1 11-4 12-12Z" /></svg>
);

// Fixed values so the server and browser render the same sparkles.
const sparkles = Array.from({ length: 8 }, (_, i) => ({ x: (i * 47 + 5) % 100, b: (i * 23) % 60, s: 6 + (i % 4) * 4, d: ((i * 9) % 80) / 10, t: 7 + (i % 5) }));
const burst = Array.from({ length: 7 }, (_, i) => { const a = (i / 7) * Math.PI * 2; return { dx: `${Math.round(Math.cos(a) * 70)}px`, dy: `${Math.round(Math.sin(a) * 70)}px` }; });

function GoldBackground() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#FFF3D6_0%,#FFF9EE_50%,#F5F6FB_100%)] dark:bg-[linear-gradient(180deg,#151005_0%,#0B0D16_50%,#070B14_100%)]" />
      <div className="absolute inset-x-0 top-0 h-[70%] bg-[radial-gradient(60%_70%_at_50%_0%,rgba(251,191,36,.32),transparent_70%)] dark:bg-[radial-gradient(60%_70%_at_50%_0%,rgba(251,191,36,.12),transparent_70%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(rgba(180,120,20,.16)_1px,transparent_1px)] bg-[size:22px_22px] [mask-image:linear-gradient(to_bottom,black,transparent_75%)] dark:bg-[radial-gradient(rgba(251,191,36,.10)_1px,transparent_1px)]" />
      {sparkles.map((p, i) => (
        <Sparkle key={i} className="absolute animate-float-up text-amber-400 opacity-0 [animation-iteration-count:2] dark:text-amber-300" style={{ left: `${p.x}%`, bottom: `${p.b}%`, width: p.s, height: p.s, animationDelay: `${p.d}s`, animationDuration: `${p.t}s` }} />
      ))}
    </div>
  );
}

// The gold coin. Grows a little with the amount; each change makes it turn and throw sparkles. Small on phones.
export function Coin({ amount, valid }: { amount: number; valid: boolean }) {
  const t = useT();
  const [changes, setChanges] = useState(0);
  const first = useRef(true);
  useEffect(() => { if (first.current) { first.current = false; return; } setChanges((n) => n + 1); }, [amount]);
  const grow = valid ? 0.9 + (Math.log(amount / t.tr(STAR_MIN)) / Math.log(STAR_MAX / t.tr(STAR_MIN))) * 0.25 : 0.85;
  return (
    <div aria-hidden className="relative grid h-20 w-20 shrink-0 place-items-center sm:h-36 sm:w-36">
      <span className="absolute inset-0 rounded-full border-2 border-dashed border-amber-400/60 dark:border-amber-300/30" />
      {changes > 0 && burst.map((b, i) => (
        <Sparkle key={`${changes}-${i}`} className="absolute start-1/2 top-1/2 h-3 w-3 animate-burst text-amber-500 dark:text-amber-300 sm:h-4 sm:w-4" style={{ "--dx": b.dx, "--dy": b.dy } as CSSProperties} />
      ))}
      <span className="grid place-items-center transition-transform duration-500 ease-out [perspective:600px]" style={{ transform: `scale(${grow.toFixed(3)})` }}>
        <span key={changes} className={`grid h-14 w-14 place-items-center ${changes > 0 ? "animate-coin-once" : ""} rounded-full bg-gradient-to-br from-amber-200 via-amber-400 to-orange-500 shadow-[inset_0_-6px_12px_rgba(154,52,18,.35),0_10px_24px_-6px_rgba(180,83,9,.45)] [transform-style:preserve-3d] sm:h-24 sm:w-24`}>
          <StarGlyph className="h-8 w-8 !fill-white !text-white drop-shadow-[0_2px_4px_rgba(154,52,18,.4)] sm:h-14 sm:w-14" />
        </span>
      </span>
      <span key={`n${amount}`} className="absolute -bottom-3 animate-pop rounded-full bg-amber-950 px-2.5 py-0.5 font-display text-xs font-bold tabular-nums text-amber-100 sm:text-sm dark:bg-amber-300 dark:text-amber-950">
        {valid ? fmt(amount) : "—"}
      </span>
    </div>
  );
}

// "Other amount" opens the custom field (already open when the amount isn't one of the packs).
export function AmountPicker({ st }: { st: StarsState }) {
  const t = useT();
  const [open, setOpen] = useState(!PACKS.includes(st.amount));
  const show = open || !PACKS.includes(st.amount);
  const toggle = () => {
    if (show) { if (!PACKS.includes(st.amount)) st.setAmount(t.tr(POPULAR_PACK)); setOpen(false); }
    else { setOpen(true); setTimeout(() => document.getElementById("star-amount")?.focus(), 0); }
  };
  return (
    <div className="space-y-4">
      <PackRadios st={st} cols={3} packs={PACKS} savings />
      <TierLine st={st} />
      <button type="button" onClick={toggle} aria-expanded={show} aria-controls="star-other" className={`flex items-center gap-1.5 rounded-lg font-semibold text-amber-800 underline-offset-4 hover:underline dark:text-amber-300 ${ring}`}>
        {!show ? t("Other amount") : PACKS.includes(st.amount) ? t("Hide other amount") : t("Use a pack instead")}<ChevronDown aria-hidden className={`h-4 w-4 transition-transform ${show ? "rotate-180" : ""}`} />
      </button>
      <div id="star-other" hidden={!show} className="space-y-3">{show && <><div className="sm:max-w-xs"><StarAmountInput st={st} label={t("Amount")} /></div><TierNudge st={st} /></>}</div>
    </div>
  );
}

export default function StarsF() {
  const usd = useMoney().format;
  const t = useT();
  const st = useStars();
  const extras = useHasExtras();
  const summary = useRef<HTMLDivElement>(null);
  const [summaryInView, setSummaryInView] = useState(false);

  // On phones the summary is far below the form: a small bar shows the total and jumps to it until it's in view.
  useEffect(() => {
    const el = summary.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => setSummaryInView(e.isIntersecting), { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, [st.order]);

  if (st.order) return <PageShell><div className="px-6 py-14"><TgOrderView o={st.order} onAgain={st.reset} /></div></PageShell>;

  const toSummary = () => { summary.current?.scrollIntoView({ behavior: "smooth", block: "center" }); summary.current?.querySelector<HTMLButtonElement>("button")?.focus({ preventScroll: true }); };

  return (
    <PageShell>
      <section id="buy" aria-labelledby="stars-h1" className="relative -mt-16 scroll-mt-16 overflow-hidden pb-12 pt-24 selection:bg-amber-200 selection:text-amber-950 [&_input]:caret-amber-600">
        <GoldBackground />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex items-center justify-between gap-5">
            <div className="min-w-0">
              <h1 id="stars-h1" className="text-balance font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl dark:text-white">{t.tr(tgHeadings).stars.h1}</h1>
              <p className="mt-2 max-w-2xl text-base leading-relaxed text-slate-700 sm:mt-3 sm:text-lg dark:text-slate-300">{t.tr(tgHeadings).stars.sub}</p>
            </div>
            <Coin amount={st.amount} valid={st.valid} />
          </div>
          <div className="mt-4 sm:mt-6"><Trust items={[t("No login needed"), t("Delivered in minutes"), t("Refund if not delivered")]} /></div>

          {/* A form, so Enter in any field works like Continue. */}
          <form noValidate onSubmit={(e) => { e.preventDefault(); st.proceed(); }} className="mt-6 grid grid-cols-[minmax(0,1fr)] gap-8 sm:mt-10 lg:grid-cols-[minmax(0,1fr)_340px]">
            <section aria-label={t("Choose")} className={`${t.tr(panel)} space-y-6 p-6 sm:p-8`}>
              <UsernameField r={st.r} s="stars" />
              <AmountPicker st={st} />
            </section>
            <div ref={summary} className="lg:sticky lg:top-24 lg:self-start">
              <StarsSummary st={st} className={t.tr(panel)}>
                <button type="submit" className={`${primary} mt-5 w-full tabular-nums`}>{starsLabel(st, t("Continue"), usd)}</button>
                <StarsBlocker st={st} />
                <p className="mt-3 text-center text-sm text-slate-600 dark:text-slate-400">{t("Pay with your wallet, card or crypto on the next step.")}</p>
              </StarsSummary>
            </div>
          </form>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 pb-28 pt-8 sm:px-6">
        <section aria-labelledby="uses"><H2 id="uses">{t("What can you do with Stars?")}</H2><div className="mt-6"><UsesList /></div></section>
        {!extras && <section aria-labelledby="faq" className="mt-16 max-w-3xl"><H2 id="faq">{t("Common questions")}</H2><div className="mt-6"><TgFaq s="stars" /></div></section>}
        <a href="#buy" className={`mt-12 inline-flex items-center gap-2 rounded-lg font-semibold text-amber-800 underline-offset-4 hover:underline dark:text-amber-300 ${ring}`}><ArrowUp aria-hidden className="h-4 w-4" />{t("Choose your Stars")}</a>
      </div>

      {/* Phones only: total plus a jump to the order summary (Continue itself stays in the summary). */}
      <div className={`fixed inset-x-0 bottom-0 z-40 border-t border-amber-200 bg-white px-4 py-3 shadow-[0_-8px_24px_-12px_rgba(0,0,0,.25)] transition-transform duration-300 lg:hidden dark:border-white/10 dark:bg-[#0E1424] ${summaryInView ? "translate-y-full" : "translate-y-0"}`} aria-hidden={summaryInView} inert={summaryInView}>
        <div className="mx-auto flex max-w-xl items-center justify-between gap-4">
          <span className="min-w-0"><span className={`block text-sm ${st.r.user ? "text-slate-600 dark:text-slate-400" : "font-semibold text-amber-800 dark:text-amber-300"}`}>{!st.r.user ? t("Add a username to continue") : st.valid ? t("{0} Stars to @{1}", { 0: fmt(st.amount), 1: st.r.user.username }) : t("Check the amount")}</span><span className="font-display text-xl font-bold tabular-nums text-slate-900 dark:text-white">{st.valid ? usd(st.total) : "—"}</span></span>
          <button type="button" onClick={toSummary} className={`rounded-xl border border-slate-300 px-4 py-2.5 font-semibold text-slate-900 dark:border-white/20 dark:text-white ${ring}`}>{t("Review order")}</button>
        </div>
      </div>
      <StarsCheckout st={st} />
    </PageShell>
  );
}
