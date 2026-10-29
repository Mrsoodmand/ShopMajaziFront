"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { extrasFor } from "@/content/service-extras-en";
import { ChevronRight } from "lucide-react";
import { useT } from "@/i18n/client";
import { useGlow } from "./slot";
import type { GlowTone } from "./HeaderGlow";
import s from "./stepsMotion.module.css";

// The "How to use" steps every service page shows (see ServiceExtras), with an optional entrance motion.
// `motion` picks one of the motions in stepsMotion.module.css ("a" … "j"); without it the steps are static.
// The steps render fully on the server and without JS; motion only arms once the list is still below the fold
// (or always, with `preview`), plays when it scrolls into view, and never arms for reduced motion.
// `replay` (preview only): bump it to play the motion again. `flush`: drop the section's own width and side padding
// when the page already sets them.
// The cards follow the home page's "How to buy" cards: a big tinted step number, a bar showing how far through the
// process each step is, chevrons between them on wide screens, and a lift on hover, all in the page's own colour
// (its header glow, see slot.tsx; brand indigo where a page has none). `look="classic"` keeps the earlier plain card
// with a round badge, which motions B, C, H and I were drawn for.

export type StepsMotion = "a" | "b" | "c" | "d" | "e" | "f" | "g" | "h" | "i" | "j";
type State = "armed" | "play" | undefined;
// What the card details do after the cards come in (tone look only; see stepsMotion.module.css):
// fill = the bars fill one after another · relay = the arrows flow towards the next step, on a loop ·
// walk = the steps take turns, like the home page's How to buy · roll = the numbers roll up into place ·
// sheen = a soft light passes over each card.
export type StepsDetail = "fill" | "relay" | "walk" | "roll" | "sheen";

const wrap = "mx-auto max-w-6xl px-4 sm:px-6";
const kicker = "text-sm font-semibold uppercase tracking-widest text-emerald-800 dark:text-emerald-300";
const h2 = "mt-2 font-display text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white";
const card = "rounded-3xl border border-slate-200 bg-white dark:border-white/15 dark:bg-[#0E1424]";

// Per-tone classes, written out in full so Tailwind sees them.
// `hex` / `hexDark`: the strong tone for animated tints (light and dark theme).
type Tone = { num: string; bar: string; card: string; chev: string; hex: string; hexDark: string };
const brand: Tone = {
  num: "text-indigo-200 group-hover:text-indigo-600 dark:text-indigo-300/25 dark:group-hover:text-indigo-300",
  bar: "from-indigo-500 to-fuchsia-500",
  card: "hover:shadow-indigo-200/70 hover:ring-indigo-300 dark:hover:shadow-indigo-500/15 dark:hover:ring-indigo-400/50",
  chev: "text-indigo-300 dark:text-indigo-400/40", hex: "#4f46e5", hexDark: "#a5b4fc",
};
const tones: Record<GlowTone, Tone> = {
  violet: {
    num: "text-violet-200 group-hover:text-violet-600 dark:text-violet-300/25 dark:group-hover:text-violet-300",
    bar: "from-violet-500 to-cyan-400",
    card: "hover:shadow-violet-200/70 hover:ring-violet-300 dark:hover:shadow-violet-500/15 dark:hover:ring-violet-400/50",
    chev: "text-violet-300 dark:text-violet-400/40", hex: "#7c3aed", hexDark: "#c4b5fd",
  },
  emerald: {
    num: "text-emerald-200 group-hover:text-emerald-600 dark:text-emerald-300/25 dark:group-hover:text-emerald-300",
    bar: "from-emerald-500 to-teal-400",
    card: "hover:shadow-emerald-200/70 hover:ring-emerald-300 dark:hover:shadow-emerald-500/15 dark:hover:ring-emerald-400/50",
    chev: "text-emerald-300 dark:text-emerald-400/40", hex: "#059669", hexDark: "#6ee7b7",
  },
  amber: {
    num: "text-amber-200 group-hover:text-amber-600 dark:text-amber-300/25 dark:group-hover:text-amber-300",
    bar: "from-amber-500 to-rose-500",
    card: "hover:shadow-amber-200/70 hover:ring-amber-300 dark:hover:shadow-amber-500/15 dark:hover:ring-amber-400/50",
    chev: "text-amber-300 dark:text-amber-400/40", hex: "#d97706", hexDark: "#fcd34d",
  },
  sky: {
    num: "text-sky-200 group-hover:text-sky-600 dark:text-sky-300/25 dark:group-hover:text-sky-300",
    bar: "from-sky-500 to-blue-500",
    card: "hover:shadow-sky-200/70 hover:ring-sky-300 dark:hover:shadow-sky-500/15 dark:hover:ring-sky-400/50",
    chev: "text-sky-300 dark:text-sky-400/40", hex: "#0284c7", hexDark: "#7dd3fc",
  },
  rose: {
    num: "text-pink-200 group-hover:text-pink-600 dark:text-pink-300/25 dark:group-hover:text-pink-300",
    bar: "from-pink-500 to-violet-500",
    card: "hover:shadow-pink-200/70 hover:ring-pink-300 dark:hover:shadow-pink-500/15 dark:hover:ring-pink-400/50",
    chev: "text-pink-300 dark:text-pink-400/40", hex: "#db2777", hexDark: "#f9a8d4",
  },
};

const CYCLE_G = 2600; // spotlight: time on each step
const CYCLE_WALK = 2200; // walk: time on each step
const loops = (m?: StepsMotion, d?: StepsDetail) => m === "g" || m === "i" || d === "relay" || d === "walk";

export default function HowToSteps({ service, motion, preview, replay = 0, look = "tone", tone: toneProp, detail, steps: ownSteps, name: ownName, flush }: { service: string; motion?: StepsMotion; preview?: boolean; replay?: number; look?: "tone" | "classic"; tone?: GlowTone; detail?: StepsDetail; steps?: { title: string; text: string }[]; name?: string; flush?: boolean }) {
  const tx = useT();
  const glow = useGlow();
  const tone = tones[(toneProp ?? glow) as GlowTone] ?? brand;
  // A page outside service-extras (e.g. social services) passes its own `steps` and `name`.
  const x = ownSteps ? { name: ownName ?? "", howTo: ownSteps } : extrasFor(service, tx);
  const n = x.howTo.length;
  const root = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<State>();
  const [inView, setInView] = useState(false);

  // Arm, then play on first sight. Re-runs on replay.
  useEffect(() => {
    const el = root.current;
    if (!motion || !el || matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;
    if (!preview && el.getBoundingClientRect().top < window.innerHeight) return; // already on screen: leave it be
    setState("armed");
    let played = false;
    const io = new IntersectionObserver(([e]) => {
      setInView(e.isIntersecting);
      if (e.isIntersecting && !played) {
        played = true;
        // The armed style was committed on mount, so the motion can start straight away (no animation frames, which
        // background tabs pause: the steps must never be left hidden).
        setState("play");
      }
    }, { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, [motion, preview, replay, service]);

  // Spotlight (G) and walk: light one step at a time while the list is on screen; hovering or focusing a step pins it.
  const cycling = motion === "g" || (look === "tone" && detail === "walk");
  const cycle = motion === "g" ? CYCLE_G : CYCLE_WALK;
  const [active, setActive] = useState(-1);
  const [pinned, setPinned] = useState(false);
  useEffect(() => {
    if (!cycling || state !== "play" || !inView || pinned) return;
    let i = active;
    let tick: ReturnType<typeof setInterval> | undefined;
    const next = () => { i = (i + 1) % n; setActive(i); };
    const start = setTimeout(() => { next(); tick = setInterval(next, cycle); }, active < 0 ? 450 + n * 60 : cycle);
    return () => { clearTimeout(start); clearInterval(tick); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cycling, cycle, state, inView, pinned, n]);
  useEffect(() => { setActive(-1); }, [replay, service]);
  const pin = useCallback((i: number) => { if (cycling && state === "play") { setPinned(true); setActive(i); } }, [cycling, state]);

  const hid = preview ? `howto-${motion}${detail ?? ""}` : "howto"; // previews share a page, so each needs its own id
  const vars = { "--n": n, "--cycle": motion === "i" ? `${n * 1100}ms` : `${cycle}ms`, "--tone": tone.hex, "--tone-d": tone.hexDark } as CSSProperties;
  const d = look === "tone" ? detail : undefined;

  return (
    <section aria-labelledby={hid} className={flush ? undefined : wrap} data-own-motion={motion ? "" : undefined}>
      <p className={kicker}>{tx("How to use")}</p>
      <h2 id={hid} className={h2}>{x.name}{" "}{tx("in")}{" "}{n}{" "}{tx("steps")}</h2>
      <div ref={root} className={`${s.root} relative mt-8`} data-v={motion} data-d={d} data-n={n} data-state={state} data-paused={loops(motion, d) && state === "play" && !inView ? "" : undefined} style={vars}>
        {motion === "i" && <div aria-hidden className={s.track}><div className={s.walker}><span className={s.dot} /></div></div>}
        {look === "tone" ? (
        <ol className={`${s.list} grid gap-4 sm:grid-cols-2 lg:gap-11 ${n === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"}`} onMouseLeave={() => setPinned(false)} onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setPinned(false); }}>
          {x.howTo.map((step, i) => (
            <li key={step.title} style={{ "--i": i, zIndex: n - i } as CSSProperties}
              data-on={d === "walk" && active === i ? "" : undefined}
              onMouseEnter={() => pin(i)} onFocus={() => pin(i)} tabIndex={d === "walk" ? 0 : undefined}
              className={`${s.card} group relative flex flex-col rounded-3xl bg-white p-7 shadow-sm ring-1 ring-slate-200/70 transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:shadow-xl dark:bg-[#0E1424] dark:ring-white/10 ${tone.card}`}>
              {d === "sheen" && <span aria-hidden className={s.sheen} />}
              <span aria-hidden className={s.numMask}><span className={`${s.num} block font-display text-5xl font-bold leading-none transition-colors duration-300 ${tone.num}`}>{tx.num(i + 1)}</span></span>
              <h3 className="mt-4 font-display text-lg font-semibold text-slate-900 dark:text-white"><span className="sr-only">{tx("Step")}{" "}{i + 1}: </span>{step.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-slate-600 dark:text-slate-400">{step.text}</p>
              {/* How far through the process this step is: a quarter, half … the whole bar on the last step. */}
              <span aria-hidden className="mt-auto block pt-6">
                <span className="block h-1 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
                  <span key={d === "walk" ? `${active}-${pinned}` : undefined} data-run={d === "walk" && !pinned ? "" : undefined}
                    className={`${s.fill} block h-full rounded-full bg-gradient-to-r rtl:bg-gradient-to-l ${tone.bar}`} style={{ width: `${((i + 1) / n) * 100}%` }} />
                </span>
              </span>
              {i < n - 1 && (
                <span aria-hidden className="absolute top-1/2 hidden -translate-y-1/2 items-center justify-center lg:flex" style={{ insetInlineEnd: -44, width: 44 }}>
                  <span className="flex -space-x-2.5 rtl:space-x-reverse">
                    {[0, 1].map((k) => <ChevronRight key={k} strokeWidth={3} style={{ "--k": k } as CSSProperties} className={`${s.chev} h-5 w-5 rtl:rotate-180 ${tone.chev} ${k === 0 ? "opacity-50" : ""}`} />)}
                  </span>
                </span>
              )}
            </li>
          ))}
        </ol>
        ) : (
        <ol className={`${s.list} grid gap-4 sm:grid-cols-2 ${n === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"}`} onMouseLeave={() => setPinned(false)} onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setPinned(false); }}>
          {x.howTo.map((step, i) => (
            <li key={step.title} className={`${tx.tr(card)} ${s.card} relative p-6`} style={{ "--i": i } as CSSProperties}
              data-on={motion === "g" && active === i ? "" : undefined}
              onMouseEnter={() => pin(i)} onFocus={() => pin(i)} tabIndex={motion === "g" ? 0 : undefined}>
              {motion === "c" && <span aria-hidden className={s.bar} />}
              <span aria-hidden className={`${s.badge} relative grid h-10 w-10 place-items-center rounded-full bg-emerald-700 font-display text-lg font-bold text-white dark:bg-emerald-400 dark:text-emerald-950`}>
                {i + 1}
                {motion === "h" && (
                  <svg className={s.ring} viewBox="0 0 50 50" fill="none"><circle cx="25" cy="25" r="23.5" stroke="currentColor" strokeWidth="2" pathLength={1} strokeDasharray="1" transform="rotate(-90 25 25)" /></svg>
                )}
              </span>
              <div className={s.body}>
                <h3 className="mt-4 font-display text-lg font-semibold text-slate-900 dark:text-white"><span className="sr-only">{tx("Step")}{" "}{i + 1}: </span>{step.title}</h3>
                <p className="mt-1 text-[15px] text-slate-700 dark:text-slate-300">{step.text}</p>
              </div>
              {motion === "g" && <span aria-hidden className={s.meter} data-run={!pinned ? "" : undefined} key={`${active}-${pinned}`} />}
            </li>
          ))}
        </ol>
        )}
      </div>
    </section>
  );
}
