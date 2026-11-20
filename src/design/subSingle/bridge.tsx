"use client";

import { useId, type CSSProperties, type ReactNode } from "react";
import { BadgeCheck, ChevronDown, CreditCard, Lock, MousePointerClick, RotateCcw, Zap } from "lucide-react";
import { LocaleProvider, useT } from "@/i18n/client";
import type { SubProduct } from "@/content/subs-en";
import { Tile } from "../subs/parts";
import { useSubsList } from "../subs/live";
import { pageBg } from "../why/parts";
import { DEFAULT_SLUG, Related } from "./parts";

// Subscription bridge (gallery section "sub-single-bridge"): a moving element for the empty band between a single
// subscription's "More in …" cards and the "How to use" steps. Every bridge is decoration only (aria-hidden), sits
// on the page colour so there is no seam, and is tinted with the product's own colour. The global reduced-motion
// rule in globals.css stops all of them.

type Props = { p: SubProduct; list: SubProduct[] };

const hexOf = (p: SubProduct) => p.color.match(/#[0-9a-f]{6}/i)?.[0] ?? "#7c3aed";
const others = (p: SubProduct, list: SubProduct[]) => list.filter((x) => x.slug !== p.slug);
const fade = "[mask-image:linear-gradient(90deg,transparent,#000_15%,#000_85%,transparent)]";
const chip = "flex items-center gap-2 whitespace-nowrap rounded-full border border-slate-200 bg-white/80 px-3 py-2 text-sm font-medium text-slate-700 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5 dark:text-slate-200";

// A · Logo Orbit: the product's tile in the middle, the other subscriptions circling it slowly on a dashed ring.
export function BridgeOrbit({ p, list }: Props) {
  const ring = others(p, list).slice(0, 6);
  const hex = hexOf(p);
  return (
    <div aria-hidden className="relative mx-auto grid h-56 place-items-center">
      <div className="absolute h-44 w-44 rounded-full border border-dashed border-slate-300 dark:border-white/15" />
      <div className="absolute h-44 w-44 animate-[spin_40s_linear_infinite]">
        {ring.map((x, i) => {
          const a = (i / ring.length) * Math.PI * 2;
          return (
            <span key={x.slug} className="absolute left-1/2 top-1/2" style={{ transform: `translate(-50%,-50%) translate(${Math.cos(a) * 88}px, ${Math.sin(a) * 88}px)` }}>
              <span className="block animate-[spin_40s_linear_infinite_reverse]"><Tile p={x} size="sm" /></span>
            </span>
          );
        })}
      </div>
      <span className="relative animate-glow rounded-2xl" style={{ "--glow": `${hex}88` } as CSSProperties}><Tile p={p} /></span>
    </div>
  );
}

// B · Logo Marquee: two rows of subscription chips drifting in opposite directions, fading at both edges.
export function BridgeMarquee({ p, list }: Props) {
  const all = others(p, list);
  const rows = [all.filter((_, i) => i % 2 === 0), all.filter((_, i) => i % 2 === 1)];
  return (
    <div aria-hidden dir="ltr" className={`space-y-3 overflow-hidden py-6 ${fade}`}>
      {rows.map((r, ri) => {
        const row = [...r, ...r, ...r, ...r];
        return (
          <div key={ri} className={`flex w-max hover:[animation-play-state:paused] ${ri ? "animate-[marquee_70s_linear_infinite_reverse]" : "animate-[marquee_60s_linear_infinite]"}`}>
            {row.map((x, i) => <div key={i} className="pe-3"><span className={chip}><Tile p={x} size="sm" />{x.name}</span></div>)}
          </div>
        );
      })}
    </div>
  );
}

// C · Brand Aurora: two soft clouds in the product's colour drifting over a faint dot grid. Atmosphere only.
export function BridgeAurora({ p }: Props) {
  const hex = hexOf(p);
  return (
    <div aria-hidden className="relative h-48 overflow-hidden [mask-image:radial-gradient(55%_80%_at_50%_50%,#000_35%,transparent)]">
      <div className="absolute inset-0 bg-[radial-gradient(rgba(100,116,139,.35)_1px,transparent_1px)] bg-[size:18px_18px] dark:bg-[radial-gradient(rgba(255,255,255,.12)_1px,transparent_1px)]" />
      <span className="absolute left-[30%] top-6 h-36 w-72 animate-[aurora_14s_ease-in-out_infinite_alternate] rounded-full opacity-50 blur-3xl dark:opacity-50" style={{ backgroundColor: hex }} />
      <span className="absolute right-[28%] top-10 h-32 w-64 animate-[aurora_18s_ease-in-out_infinite_alternate-reverse] rounded-full bg-violet-400 opacity-40 blur-3xl dark:opacity-35" />
    </div>
  );
}

// D · Step Rail: a preview of the steps below. Four icons on a line light up one after another as a light runs along it.
const steps = [MousePointerClick, CreditCard, Zap, BadgeCheck];
export function BridgeRail({ p }: Props) {
  const hex = hexOf(p);
  return (
    <div aria-hidden className="mx-auto max-w-xl px-6 py-10">
      <div className="relative flex items-center justify-between">
        <div className="absolute inset-x-5 top-1/2 h-0.5 -translate-y-1/2 rounded-full bg-slate-200 dark:bg-white/10" />
        <span className="absolute top-1/2 h-2.5 w-2.5 -translate-y-1/2 animate-[travel_6s_linear_infinite] rounded-full" style={{ backgroundColor: hex, boxShadow: `0 0 14px 3px ${hex}99` }} />
        {steps.map((Icon, i) => (
          <span key={i} className="relative grid h-11 w-11 animate-[bridge-node_6s_linear_infinite] place-items-center rounded-full border border-[var(--rest-b)] bg-white text-[var(--rest-c)] [--rest-b:#e2e8f0] [--rest-c:#94a3b8] dark:bg-[#0E1424] dark:[--rest-b:rgba(255,255,255,.1)] dark:[--rest-c:#64748b]" style={{ animationDelay: `${[0, 1.95, 3.9, 5.75][i]}s`, "--tone": hex } as CSSProperties}>
            <Icon className="h-5 w-5" />
          </span>
        ))}
      </div>
    </div>
  );
}

// E · Rising Logos: the other subscriptions' tiles floating gently up and fading, like bubbles, at staggered spots.
const spots = [[8, 0], [21, 2.6], [34, 1.2], [47, 4.1], [60, 0.7], [73, 3.3], [86, 1.9], [94, 5]];
export function BridgeRise({ p, list }: Props) {
  const all = others(p, list);
  return (
    <div aria-hidden className="relative mx-auto h-48 max-w-6xl overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,#000_30%,#000_70%,transparent)]">
      {spots.map(([x, delay], i) => {
        const t = all[i % all.length];
        return t && (
          <span key={i} className="absolute bottom-0 animate-[bridge-rise_7s_ease-in-out_infinite] opacity-0" style={{ left: `${x}%`, animationDelay: `${delay}s` }}>
            <Tile p={t} size="sm" />
          </span>
        );
      })}
    </div>
  );
}

// F · Signal Ripple: the product's tile sending soft rings out in its own colour, with hairlines reaching to the sides.
export function BridgeRipple({ p }: Props) {
  const hex = hexOf(p);
  return (
    <div aria-hidden className="relative mx-auto grid h-48 max-w-6xl place-items-center px-6">
      <div className="absolute inset-x-6 top-1/2 h-0.5 -translate-y-1/2" style={{ backgroundImage: `linear-gradient(90deg, transparent, ${hex}cc 35%, transparent 46%, transparent 54%, ${hex}cc 65%, transparent)` }} />
      {[0, 1.3, 2.6].map((d) => (
        <span key={d} className="absolute h-24 w-24 animate-[spot-ring_4s_ease-out_infinite] rounded-full border-2" style={{ borderColor: hex, animationDelay: `${d}s` }} />
      ))}
      <span className="relative rounded-2xl ring-4 ring-white dark:ring-[#070B14]"><Tile p={p} /></span>
    </div>
  );
}

// G · Promise Ticker: the product's own promises (delivery time, how it's activated, the fix-or-refund rule) turning
// over one at a time in a pill. Uses only facts the page already states.
export function BridgeTicker({ p }: Props) {
  const tx = useT();
  const items = [
    p.delivery && { icon: Zap, cls: "text-amber-600 dark:text-amber-400", text: p.delivery },
    { icon: Lock, cls: "text-violet-700 dark:text-violet-400", text: p.activation === "own" ? tx("No password needed") : p.activation === "login" ? tx("On your own account") : tx("Secure delivery") },
    { icon: RotateCcw, cls: "text-emerald-700 dark:text-emerald-400", text: tx("Fixed, replaced or refunded") },
  ].filter(Boolean) as { icon: typeof Zap; cls: string; text: string }[];
  const loop = [...items, items[0]];
  return (
    <div aria-hidden className="grid place-items-center py-14">
      <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-white/80 py-2 pe-5 ps-2 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
        <Tile p={p} size="sm" />
        <div className="h-6 overflow-hidden">
          <div className={items.length === 3 ? "animate-[bridge-ticker3_9s_cubic-bezier(.7,0,.3,1)_infinite]" : "animate-[bridge-ticker2_6s_cubic-bezier(.7,0,.3,1)_infinite]"}>
            {loop.map((x, i) => <div key={i} className="flex h-6 items-center gap-2 whitespace-nowrap text-sm font-medium text-slate-700 dark:text-slate-200"><x.icon className={`h-4 w-4 ${x.cls}`} />{x.text}</div>)}
          </div>
        </div>
      </div>
    </div>
  );
}

// H · Brand Wave: two thin waves in the product's colour rolling across at different speeds.
const wave = (amp: number) => {
  let d = `M0 40 Q150 ${40 - amp} 300 40`;
  for (let x = 600; x <= 2400; x += 300) d += ` T${x} 40`;
  return d;
};
export function BridgeWave({ p }: Props) {
  const id = useId();
  const hex = hexOf(p);
  return (
    <div aria-hidden dir="ltr" className={`relative my-10 h-24 overflow-hidden ${fade}`}>
      {[{ amp: 34, dur: "18s", op: 1 }, { amp: -22, dur: "28s", op: 0.45 }].map((w, i) => (
        <svg key={i} viewBox="0 0 2400 80" preserveAspectRatio="none" className="absolute inset-y-0 left-0 h-full w-[200%] min-w-[2400px]" style={{ animation: `wave-roll ${w.dur} linear infinite`, opacity: w.op }}>
          <defs>
            <linearGradient id={`${id}-${i}`} x1="0" x2="1">
              <stop offset="0" stopColor={hex} /><stop offset=".25" stopColor="#a78bfa" /><stop offset=".5" stopColor={hex} /><stop offset=".75" stopColor="#a78bfa" /><stop offset="1" stopColor={hex} />
            </linearGradient>
          </defs>
          <path d={wave(w.amp)} fill="none" stroke={`url(#${id}-${i})`} strokeWidth="2" vectorEffect="non-scaling-stroke" />
        </svg>
      ))}
    </div>
  );
}

// I · Constellation: a few of the other subscriptions as stars joined by lines that draw themselves in, the product
// at the centre, small dots twinkling between them.
const stars = [[12, 62], [26, 28], [40, 70], [60, 26], [74, 66], [88, 34]];
const sparks = [[19, 44, 0], [33, 50, 1.2], [52, 78, 2.1], [67, 44, 0.6], [81, 52, 1.7], [46, 18, 2.6]];
export function BridgeConstellation({ p, list }: Props) {
  const all = others(p, list);
  const hex = hexOf(p);
  const c = [50, 50];
  return (
    <div aria-hidden className="relative mx-auto h-56 max-w-5xl [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)]">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
        {stars.map(([x, y], i) => (
          <line key={i} x1={c[0]} y1={c[1]} x2={x} y2={y} pathLength={1} strokeDasharray="1" stroke={hex} strokeOpacity=".75" strokeWidth="1.5" vectorEffect="non-scaling-stroke" className="animate-[bridge-draw_6s_ease-in-out_infinite]" style={{ animationDelay: `${i * 0.35}s` }} />
        ))}
      </svg>
      {sparks.map(([x, y, d], i) => <span key={i} className="absolute h-1.5 w-1.5 animate-twinkle rounded-full bg-violet-400" style={{ left: `${x}%`, top: `${y}%`, animationDelay: `${d}s` }} />)}
      {stars.map(([x, y], i) => all[i] && (
        <span key={i} className="absolute -translate-x-1/2 -translate-y-1/2 animate-[float_6s_ease-in-out_infinite]" style={{ left: `${x}%`, top: `${y}%`, animationDelay: `${i * 0.8}s` }}><Tile p={all[i]} size="sm" /></span>
      ))}
      <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-glow rounded-xl" style={{ "--glow": `${hex}88` } as CSSProperties}><Tile p={p} /></span>
    </div>
  );
}

// J · Glow Thread: a hairline in the product's colour drops from the cards, a bright dot runs down it, and it ends in
// a gently bobbing arrow pointing at the steps below.
export function BridgeThread({ p }: Props) {
  const hex = hexOf(p);
  return (
    <div aria-hidden className="flex flex-col items-center py-6">
      <div className="relative h-24 w-px" style={{ backgroundImage: `linear-gradient(to bottom, transparent, ${hex}88, ${hex})` }}>
        <span className="absolute -start-[3px] top-0 h-[7px] w-[7px] animate-[thread-drop_2.4s_ease-in_infinite] rounded-full" style={{ backgroundColor: hex, boxShadow: `0 0 12px 2px ${hex}aa` }} />
      </div>
      <span className="mt-2 grid h-10 w-10 animate-[bob_2.4s_ease-in-out_infinite] place-items-center rounded-full border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-[#0E1424]" style={{ color: hex }}>
        <ChevronDown className="h-5 w-5" />
      </span>
    </div>
  );
}

// The end of a thread: a round chip with a down arrow in the product's colour, gently bobbing.
function ArrowChip({ hex, bob = true }: { hex: string; bob?: boolean }) {
  return (
    <span className={`relative grid h-10 w-10 place-items-center rounded-full border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-[#0E1424] ${bob ? "animate-[bob_2.4s_ease-in-out_infinite]" : ""}`} style={{ color: hex }}>
      <ChevronDown className="h-5 w-5" />
    </span>
  );
}
const dot = (hex: string): CSSProperties => ({ backgroundColor: hex, boxShadow: `0 0 12px 2px ${hex}aa` });

// K · Twin Threads: two curved hairlines start apart under the cards and meet in the middle; a dot slides down each
// and they land on the arrow together.
const twin = ["M10 0 C10 60 120 50 120 110", "M230 0 C230 60 120 50 120 110"];
const triple = [twin[0], "M120 0 L120 110", twin[1]];
export function BridgeTwin({ p, paths = twin }: Props & { paths?: string[] }) {
  const id = useId();
  const hex = hexOf(p);
  return (
    <div aria-hidden className="flex flex-col items-center py-6">
      <div dir="ltr" className="relative h-[110px] w-[240px]">
        <svg viewBox="0 0 240 110" className="absolute inset-0 h-full w-full overflow-visible">
          <defs><linearGradient id={id} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={hex} stopOpacity="0" /><stop offset="1" stopColor={hex} /></linearGradient></defs>
          {paths.map((d) => <path key={d} d={d} fill="none" stroke={`url(#${id})`} strokeWidth="1.5" />)}
        </svg>
        {paths.map((d) => <span key={d} className="absolute left-0 top-0 h-[7px] w-[7px] animate-[bridge-path_2.6s_ease-in_infinite] rounded-full" style={{ ...dot(hex), offsetPath: `path("${d}")` }} />)}
      </div>
      <span className="-mt-1"><ArrowChip hex={hex} /></span>
    </div>
  );
}

// Q · Triple Threads: K with a third, straight line down the middle.
export const BridgeTriple = (props: Props) => <BridgeTwin {...props} paths={triple} />;

// L · Flowing Dash: a dashed line in the product's colour that keeps flowing downward into a softly pulsing ring.
export function BridgeDash({ p }: Props) {
  const hex = hexOf(p);
  return (
    <div aria-hidden className="flex flex-col items-center py-6">
      <div className="h-24 w-0.5 animate-[bridge-dash_1s_linear_infinite] [mask-image:linear-gradient(to_bottom,transparent,#000_40%)]" style={{ backgroundImage: `repeating-linear-gradient(to bottom, ${hex} 0 8px, transparent 8px 16px)` }} />
      <span className="relative mt-2 grid place-items-center">
        <span className="absolute h-10 w-10 animate-[ping-soft_2.4s_ease-out_infinite] rounded-full" style={{ backgroundColor: `${hex}33` }} />
        <ArrowChip hex={hex} bob={false} />
      </span>
    </div>
  );
}

// M · Comet Drop: a small comet with a fading tail falls down the thread and sends a ripple out where it lands.
export function BridgeComet({ p }: Props) {
  const hex = hexOf(p);
  return (
    <div aria-hidden className="flex flex-col items-center py-6">
      <div className="relative h-28 w-px overflow-hidden" style={{ backgroundImage: `linear-gradient(to bottom, transparent, ${hex}40)` }}>
        <span className="absolute -start-[2px] top-0 h-12 w-[5px] -translate-y-full animate-[bridge-comet_2.4s_cubic-bezier(.5,0,.9,.6)_infinite] rounded-full" style={{ backgroundImage: `linear-gradient(to bottom, transparent, ${hex})`, boxShadow: `0 6px 12px 1px ${hex}88` }} />
      </div>
      <span className="relative mt-1 grid place-items-center">
        <span className="absolute h-10 w-10 animate-[bridge-splash_2.4s_ease-out_infinite] rounded-full border-2" style={{ borderColor: hex }} />
        <ArrowChip hex={hex} bob={false} />
      </span>
    </div>
  );
}

// N · Chevron Cascade: three stacked chevrons on a short thread light up top to bottom, like a gentle scroll hint.
export function BridgeCascade({ p }: Props) {
  const hex = hexOf(p);
  return (
    <div aria-hidden className="flex flex-col items-center py-6" style={{ color: hex }}>
      <div className="h-12 w-px" style={{ backgroundImage: `linear-gradient(to bottom, transparent, ${hex}88)` }} />
      <div className="-mt-1 flex flex-col items-center">
        {[0, 1, 2].map((i) => <ChevronDown key={i} strokeWidth={2.5} className="-mt-2 h-7 w-7 animate-[chevron_1.8s_ease-in-out_infinite] first:mt-0" style={{ animationDelay: `${i * 0.25}s` }} />)}
      </div>
      <div className="mt-1 h-8 w-px" style={{ backgroundImage: `linear-gradient(to bottom, ${hex}88, transparent)` }} />
    </div>
  );
}

// R · Triple Cascade: N three times side by side, the middle column taller, lighting one after another. In the site's
// green (the "How to use" kicker's colour) rather than the product's, so it reads as part of the steps below.
function Cascade({ top, delay }: { top: number; delay: number }) {
  return (
    <div className="flex flex-col items-center text-emerald-600 dark:text-emerald-400">
      <div className="w-px" style={{ height: top, backgroundImage: "linear-gradient(to bottom, transparent, color-mix(in srgb, currentColor 55%, transparent))" }} />
      <div className="-mt-1 flex flex-col items-center">
        {[0, 1, 2].map((i) => <ChevronDown key={i} strokeWidth={2.5} className="-mt-2 h-6 w-6 animate-[chevron_1.8s_ease-in-out_infinite] first:mt-0" style={{ animationDelay: `${delay + i * 0.25}s` }} />)}
      </div>
    </div>
  );
}
export function BridgeTripleCascade(_: Props) {
  return (
    <div aria-hidden className="flex items-end justify-center gap-20 py-6 sm:gap-36">
      <Cascade top={28} delay={0.3} />
      <Cascade top={56} delay={0} />
      <Cascade top={28} delay={0.3} />
    </div>
  );
}

// O · Four Beads: four beads on the thread, one for each step below, light up in turn on the way down to the arrow.
export function BridgeBeads({ p }: Props) {
  const hex = hexOf(p);
  return (
    <div aria-hidden className="flex flex-col items-center py-6">
      <div className="relative flex h-32 w-px flex-col items-center justify-evenly bg-slate-200 dark:bg-white/10">
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className="h-2.5 w-2.5 animate-[bridge-bead_3.2s_linear_infinite] rounded-full bg-[var(--rest)] [--rest:#cbd5e1] dark:[--rest:#334155]" style={{ animationDelay: `${i * 0.4}s`, "--tone": hex } as CSSProperties} />
        ))}
      </div>
      <span className="mt-2"><ArrowChip hex={hex} /></span>
    </div>
  );
}

// P · Logo Landing: the thread ends in the product's own logo; every dot that lands makes the logo glow.
export function BridgeLanding({ p }: Props) {
  const hex = hexOf(p);
  return (
    <div aria-hidden className="flex flex-col items-center py-6">
      <div className="relative h-24 w-px" style={{ backgroundImage: `linear-gradient(to bottom, transparent, ${hex}88, ${hex})` }}>
        <span className="absolute -start-[3px] top-0 h-[7px] w-[7px] animate-[thread-drop_2.4s_ease-in_infinite] rounded-full" style={dot(hex)} />
      </div>
      <span className="mt-2 animate-[glow_2.4s_ease-in-out_infinite] rounded-xl [animation-delay:1s]" style={{ "--glow": `${hex}99` } as CSSProperties}><Tile p={p} /></span>
    </div>
  );
}

// Gallery frame: the real "More in …" cards, the bridge, then the "How to use" heading, in Persian like the site.
function FrameInner({ Bridge }: { Bridge: (props: Props) => ReactNode }) {
  const tx = useT();
  const list = useSubsList();
  const p = list.find((x) => x.slug === DEFAULT_SLUG) ?? list[0];
  return (
    <div className={pageBg}>
      <div className="mx-auto max-w-6xl px-4 pt-14 sm:px-6"><Related p={p} /></div>
      <Bridge p={p} list={list} />
      <div className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <p className="text-sm font-semibold uppercase tracking-widest text-emerald-800 dark:text-emerald-300">{tx("How to use")}</p>
        <p className="mt-2 font-display text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">{p.name}{" "}{tx("in")}{" "}4{" "}{tx("steps")}</p>
      </div>
    </div>
  );
}
const Frame = ({ Bridge }: { Bridge: (props: Props) => ReactNode }) => (
  <div dir="rtl" lang="fa"><LocaleProvider locale="fa"><FrameInner Bridge={Bridge} /></LocaleProvider></div>
);

// The chosen bridge by gallery id, for the live page.
export const subBridges: Record<string, (props: Props) => ReactNode> = {
  A: BridgeOrbit, B: BridgeMarquee, C: BridgeAurora, D: BridgeRail, E: BridgeRise,
  F: BridgeRipple, G: BridgeTicker, H: BridgeWave, I: BridgeConstellation, J: BridgeThread,
  K: BridgeTwin, L: BridgeDash, M: BridgeComet, N: BridgeCascade, O: BridgeBeads, P: BridgeLanding,
  Q: BridgeTriple, R: BridgeTripleCascade,
};
export const SubBridgeA = () => <Frame Bridge={BridgeOrbit} />;
export const SubBridgeB = () => <Frame Bridge={BridgeMarquee} />;
export const SubBridgeC = () => <Frame Bridge={BridgeAurora} />;
export const SubBridgeD = () => <Frame Bridge={BridgeRail} />;
export const SubBridgeE = () => <Frame Bridge={BridgeRise} />;
export const SubBridgeF = () => <Frame Bridge={BridgeRipple} />;
export const SubBridgeG = () => <Frame Bridge={BridgeTicker} />;
export const SubBridgeH = () => <Frame Bridge={BridgeWave} />;
export const SubBridgeI = () => <Frame Bridge={BridgeConstellation} />;
export const SubBridgeJ = () => <Frame Bridge={BridgeThread} />;
export const SubBridgeK = () => <Frame Bridge={BridgeTwin} />;
export const SubBridgeL = () => <Frame Bridge={BridgeDash} />;
export const SubBridgeM = () => <Frame Bridge={BridgeComet} />;
export const SubBridgeN = () => <Frame Bridge={BridgeCascade} />;
export const SubBridgeO = () => <Frame Bridge={BridgeBeads} />;
export const SubBridgeP = () => <Frame Bridge={BridgeLanding} />;
export const SubBridgeQ = () => <Frame Bridge={BridgeTriple} />;
export const SubBridgeR = () => <Frame Bridge={BridgeTripleCascade} />;
