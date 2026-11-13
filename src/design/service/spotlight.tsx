"use client";

import { createContext, useContext, useEffect, useRef, type ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

// Landing-page hero "Spotlight × Grid" (hero-system C with A's background, see /design/landing-hero).
// One band for every landing page, on the page's own ground (pale in light, night in dark): a hairline grid, one soft
// green beam from the top and, on the centred heroes, the page's icon in a tile with rings breathing out of it.
// It replaces each page's own band (Brand Mesh, gold, violet, platform colours) while the preview is on
// (cookie `hero-preview=spotlight`) or once it is chosen (decisions.json › landing-hero = B).

import { HERO_PREVIEW_COOKIE } from "./heroPreview";

const Ctx = createContext({ on: false, preview: false });

export function SpotlightProvider({ on, preview, children }: { on: boolean; preview: boolean; children: ReactNode }) {
  return (
    <Ctx.Provider value={{ on, preview }}>
      {children}
      {preview && <PreviewPill />}
    </Ctx.Provider>
  );
}

export const useSpotlight = () => useContext(Ctx).on;

export function setHeroPreview(on: boolean) {
  document.cookie = on ? `${HERO_PREVIEW_COOKIE}=spotlight; path=/; max-age=2592000; samesite=lax` : `${HERO_PREVIEW_COOKIE}=; path=/; max-age=0`;
  location.reload();
}

// A small fixed note while the preview is on, so it's clear which hero is showing and how to compare.
function PreviewPill() {
  return (
    <div dir="ltr" className="fixed bottom-24 left-1/2 z-[60] flex -translate-x-1/2 items-center gap-1 whitespace-nowrap rounded-full lg:bottom-4 border border-white/15 bg-slate-900/90 p-1 ps-3 text-xs font-medium text-white shadow-xl backdrop-blur">
      <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />New hero preview</span>
      <a href="/design/landing-hero" className="rounded-full px-2.5 py-1 text-slate-300 hover:bg-white/10 hover:text-white">All pages</a>
      <button type="button" onClick={() => setHeroPreview(false)} className="rounded-full bg-white/10 px-2.5 py-1 hover:bg-white/20">Show current</button>
    </div>
  );
}

// Hero text on the band. The band follows the theme (pale in light, night in dark), so its text does too.
export const spotTone = {
  title: "text-slate-900 dark:text-white",
  sub: "text-slate-700 dark:text-slate-300",
  muted: "text-slate-600 dark:text-slate-400",
};

// The band's ground is the page's own colour (#F5F6FB light, #070B14 dark), so there is no edge where the hero ends:
// only the grid and the light fade out, along a long eased curve.
const fadeMask = "[mask-image:linear-gradient(to_bottom,black_0%,black_40%,rgba(0,0,0,.85)_52%,rgba(0,0,0,.62)_64%,rgba(0,0,0,.38)_76%,rgba(0,0,0,.17)_87%,rgba(0,0,0,.05)_95%,transparent_100%)]";

// The band itself. `under`: sits behind the section's content with -z-10 (sections that `isolate`); without it the
// section's content is simply drawn after it (Telegram and social order pages). `beam` sits over the title: centred,
// or on the start side when an order summary takes the end side. `motion`: the background animation, A Grid Comets by default
// (chosen at /design/hero-motion; "none" turns it off).
export type SpotMotion = "none" | "comets" | "sweep" | "scan" | "ripple" | "dust" | "converge" | "circuit" | "orbit" | "nodes" | "rain";

const GRID = 56;
const gridAt = { backgroundSize: `${GRID}px ${GRID}px`, backgroundPosition: "var(--grid-at, calc(50% + 28px) 0)" };
const greenLines = `linear-gradient(to right,rgba(52,211,153,.55) 1px,transparent 1px),linear-gradient(to bottom,rgba(52,211,153,.55) 1px,transparent 1px)`;

// The grid is laid so one vertical and one horizontal line cross at the centre of the section's icon tile
// ([data-spot-mark]); with no tile, a vertical line runs down the middle. --mx/--my hold that point for the motion layers.
function useGridAnchor() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const band = ref.current;
    const host = band?.parentElement;
    if (!band || !host) return;
    const place = () => {
      const b = band.getBoundingClientRect();
      const mark = host.querySelector<HTMLElement>("[data-spot-mark]")?.getBoundingClientRect();
      const x = mark ? mark.left + mark.width / 2 - b.left : b.width / 2;
      const y = mark ? mark.top + mark.height / 2 - b.top : 0;
      band.style.setProperty("--mx", `${x}px`);
      band.style.setProperty("--my", `${y}px`);
      band.style.setProperty("--grid-at", `${x - 0.5}px ${y - 0.5}px`);
    };
    place();
    const ro = new ResizeObserver(place);
    ro.observe(host);
    return () => ro.disconnect();
  }, []);
  return ref;
}

export function SpotlightBand({ under = true, beam = "center", motion = "comets" }: { under?: boolean; beam?: "center" | "start"; motion?: SpotMotion }) {
  const at = beam === "center" ? "start-1/2 -translate-x-1/2 rtl:translate-x-1/2" : "start-[28%] -translate-x-1/2 rtl:translate-x-1/2";
  const ref = useGridAnchor();
  const grid = "absolute inset-0";
  return (
    <div ref={ref} aria-hidden className={`pointer-events-none absolute inset-0 ${under ? "-z-10" : ""} overflow-hidden bg-[#F5F6FB] dark:bg-[#070B14] ${fadeMask}`}>
      {/* A's hairline grid, strongest under the header and fading out, crossing at the icon tile. */}
      <div style={gridAt} className={`${grid} bg-[linear-gradient(to_right,rgba(15,23,42,.07)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,.07)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_80%_85%_at_50%_0%,black_25%,transparent)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,.085)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,.085)_1px,transparent_1px)]`} />
      {/* C's beam: a soft wedge of green light falling from the top edge, slowly breathing (or swinging, with `sweep`). */}
      <div className={`absolute top-0 h-[120%] w-[1100px] max-w-[160%] ${at}`}>
        <div className={`h-full w-full origin-top bg-[conic-gradient(from_150deg_at_50%_0%,transparent_0deg,rgba(16,185,129,.2)_30deg,transparent_60deg)] blur-2xl motion-reduce:animate-none dark:bg-[conic-gradient(from_150deg_at_50%_0%,transparent_0deg,rgba(16,185,129,.34)_30deg,transparent_60deg)] ${motion === "sweep" ? "animate-[spot-sweep_9s_ease-in-out_infinite]" : "animate-[spot-beam_7s_ease-in-out_infinite]"}`} />
      </div>
      <div className={`absolute -top-24 h-56 w-[520px] max-w-full rounded-full bg-emerald-300/30 blur-[90px] dark:bg-emerald-400/25 ${at}`} />
      {/* A thin lit edge where the beam starts. */}
      <div className={`absolute top-0 h-px w-[420px] max-w-full bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent dark:via-emerald-300/60 ${at}`} />
      {motion !== "none" && <div className="absolute inset-0 motion-reduce:hidden"><Motion kind={motion} grid={grid} /></div>}
    </div>
  );
}

// The background animations. Each one works with the grid: lights run along its lines, or light its cells.
function Motion({ kind, grid }: { kind: SpotMotion; grid: string }) {
  if (kind === "comets") {
    // Short streaks of light running along the grid lines, out of the icon tile and away from it.
    const v = [-5, -3, -1, 2, 4, 6];
    const h = [1, 3, 5];
    return (
      <>
        {v.map((k, i) => (
          <span key={`v${k}`} style={{ left: `calc(var(--mx,50%) + ${k * GRID}px - .5px)`, top: "var(--my,0px)", animationDelay: `${i * 0.9}s`, animationDuration: `${4 + (i % 3)}s` }}
            className="absolute h-24 w-px animate-[spot-comet-y_5s_linear_infinite] bg-gradient-to-b from-transparent via-emerald-300/80 to-transparent opacity-0" />
        ))}
        {h.flatMap((k, i) => [-1, 1].map((dir) => (
          <span key={`h${k}${dir}`} style={{ top: `calc(var(--my,0px) + ${k * GRID}px - .5px)`, left: "var(--mx,50%)", animationDelay: `${i * 1.3 + (dir > 0 ? 0.6 : 0)}s`, ["--dir" as string]: dir }}
            className="absolute h-px w-28 animate-[spot-comet-x_6s_linear_infinite] bg-gradient-to-r from-transparent via-emerald-300/80 to-transparent opacity-0" />
        )))}
      </>
    );
  }
  if (kind === "converge") {
    // A in reverse: streaks run in along the grid lines and disappear into the icon tile.
    const v = [-4, -2, 1, 3, 5];
    const h = [1, 2, 4];
    return (
      <>
        {v.map((k, i) => (
          <span key={`v${k}`} style={{ left: `calc(var(--mx,50%) + ${k * GRID}px - .5px)`, top: "var(--my,0px)", animationDelay: `${i * 1.1}s`, animationDuration: `${4.5 + (i % 3) * 0.7}s` }}
            className="absolute h-24 w-px animate-[spot-in-y_5s_cubic-bezier(.4,0,.2,1)_infinite] bg-gradient-to-t from-transparent via-emerald-300/80 to-emerald-200 opacity-0" />
        ))}
        {h.flatMap((k, i) => [-1, 1].map((dir) => (
          <span key={`h${k}${dir}`} style={{ top: `calc(var(--my,0px) + ${k * GRID}px - .5px)`, left: "var(--mx,50%)", animationDelay: `${i * 1.4 + (dir > 0 ? 0.7 : 0)}s`, ["--dir" as string]: dir }}
            className={`absolute h-px w-28 animate-[spot-in-x_6s_cubic-bezier(.4,0,.2,1)_infinite] opacity-0 ${dir > 0 ? "bg-gradient-to-l" : "bg-gradient-to-r"} from-transparent via-emerald-300/80 to-emerald-200`} />
        )))}
      </>
    );
  }
  if (kind === "circuit") {
    // Lights trace circuit-board paths along the grid: out of the tile, a turn or two, and off.
    const g = GRID;
    const paths = [
      `M0 0 H ${3 * g} V ${2 * g} H ${7 * g}`, `M0 0 H ${-2 * g} V ${3 * g} H ${-6 * g} V ${5 * g}`,
      `M0 0 V ${2 * g} H ${4 * g} V ${5 * g}`, `M0 0 V ${g} H ${-4 * g} V ${-g} H ${-9 * g}`,
      `M0 0 H ${5 * g} V ${-2 * g} H ${9 * g}`, `M0 0 V ${4 * g} H ${-3 * g} V ${6 * g}`,
    ];
    return (
      <div className="absolute" style={{ left: "var(--mx,50%)", top: "var(--my,0px)" }}>
        {paths.map((d, i) => (
          <span key={i} style={{ offsetPath: `path("${d}")`, animationDelay: `${i * 1.05}s` }}
            className="absolute left-0 top-0 h-px w-14 animate-[spot-trace_6.3s_linear_infinite] bg-gradient-to-r from-transparent via-emerald-300/80 to-emerald-100 opacity-0 [offset-rotate:auto]" />
        ))}
      </div>
    );
  }
  if (kind === "orbit") {
    // Lights circle the icon tile along square paths of grid lines, the inner and outer ones turning opposite ways.
    const sq = (r: number) => `M${-r} ${-r} H ${r} V ${r} H ${-r} Z`;
    const rings = [{ r: GRID * 2, t: 7, rev: false }, { r: GRID * 4, t: 12, rev: true }, { r: GRID * 6, t: 17, rev: false }];
    return (
      <div className="absolute" style={{ left: "var(--mx,50%)", top: "var(--my,0px)" }}>
        {rings.flatMap(({ r, t, rev }) => [0, 0.5].map((off) => (
          <span key={`${r}${off}`} style={{ offsetPath: `path("${sq(r)}")`, animationDuration: `${t}s`, animationDelay: `${-off * t}s`, animationDirection: rev ? "reverse" : "normal" }}
            className="absolute left-0 top-0 h-px w-20 animate-[spot-orbit_10s_linear_infinite] bg-gradient-to-r from-transparent via-emerald-300/70 to-emerald-100 [offset-rotate:auto]" />
        )))}
      </div>
    );
  }
  if (kind === "nodes") {
    // Grid crossings light up in turn, each sending a short spark along its line.
    const pts = Array.from({ length: 18 }, (_, i) => ({ x: ((i * 7) % 15) - 7, y: (i * 5) % 7 + (i % 2), d: (i * 0.61) % 6, h: i % 2 === 0 }));
    return pts.map((p, i) => (
      <span key={i} style={{ left: `calc(var(--mx,50%) + ${p.x * GRID}px)`, top: `calc(var(--my,0px) + ${(p.y - 2) * GRID}px)`, animationDelay: `${p.d}s` }} className="absolute opacity-0 animate-[spot-node_6s_ease-out_infinite]">
        <span className="absolute -left-[3px] -top-[3px] h-1.5 w-1.5 rounded-full bg-emerald-200 shadow-[0_0_10px_3px_rgba(52,211,153,.55)]" />
        <span className={`absolute ${p.h ? "-top-px left-0 h-px w-14 bg-gradient-to-r" : "-left-px top-0 h-14 w-px bg-gradient-to-b"} from-emerald-300/80 to-transparent`} />
      </span>
    ));
  }
  if (kind === "rain") {
    // Streaks fall down the vertical lines across the whole band at their own pace.
    return Array.from({ length: 20 }, (_, i) => i - 10).map((k, i) => (
      <span key={k} style={{ left: `calc(var(--mx,50%) + ${k * GRID}px - .5px)`, animationDelay: `${(i * 1.37) % 7}s`, animationDuration: `${5 + ((i * 3) % 5)}s` }}
        className="absolute top-0 h-20 w-px animate-[spot-rain_6s_linear_infinite] bg-gradient-to-b from-transparent via-emerald-300/60 to-emerald-200/90 opacity-0" />
    ));
  }
  if (kind === "scan") {
    // A band of green grid sweeping slowly down the hero, like a scanner passing over it.
    const mask = "linear-gradient(to bottom, transparent calc(var(--scan) - 90px), black var(--scan), transparent calc(var(--scan) + 6px))";
    return <div style={{ ...gridAt, backgroundImage: greenLines, maskImage: mask, WebkitMaskImage: mask }} className={`${grid} animate-[spot-scan_6s_ease-in-out_infinite]`} />;
  }
  if (kind === "ripple") {
    // Rings of lit grid spreading out of the icon tile, in step with the rings around it.
    const ripMask = "radial-gradient(circle at var(--mx, 50%) var(--my, 0px), transparent calc(var(--rip) - 70px), black var(--rip), transparent calc(var(--rip) + 2px))";
    return [0, 1.5].map((d) => (
      <div key={d} style={{ ...gridAt, backgroundImage: greenLines, maskImage: ripMask, WebkitMaskImage: ripMask, animationDelay: `${d}s` }} className={`${grid} animate-[spot-ripple_3s_ease-out_infinite]`} />
    ));
  }
  if (kind === "dust") {
    // Specks of light drifting up through the beam and fading.
    const specks = Array.from({ length: 22 }, (_, i) => ({ x: ((i * 37) % 100) - 50, y: 30 + ((i * 53) % 60), d: (i * 0.73) % 8, s: i % 3 === 0 ? 3 : 2, t: 7 + (i % 5) }));
    return specks.map((p, i) => (
      <span key={i} style={{ left: `calc(var(--mx,50%) + ${p.x * 6}px)`, top: `${p.y}%`, width: p.s, height: p.s, animationDelay: `${p.d}s`, animationDuration: `${p.t}s` }}
        className="absolute rounded-full bg-emerald-200 opacity-0 shadow-[0_0_8px_2px_rgba(52,211,153,.6)] animate-[spot-dust_8s_ease-in-out_infinite]" />
    ));
  }
  return null;
}

// C's icon tile with rings breathing out of it, above a centred title.
export function SpotlightMark({ icon: Icon, children, className = "mb-7" }: { icon?: LucideIcon; children?: ReactNode; className?: string }) {
  return (
    <div aria-hidden data-spot-mark className={`relative mx-auto grid h-[72px] w-[72px] place-items-center ${className}`}>
      {[0, 1.4].map((d) => <span key={d} style={{ animationDelay: `${d}s` }} className="absolute inset-0 animate-[spot-ring_2.8s_ease-out_infinite] rounded-2xl border border-emerald-500/40 dark:border-emerald-400/45" />)}
      <span className="relative grid h-[72px] w-[72px] place-items-center rounded-2xl border border-slate-200 bg-white shadow-[0_12px_36px_-12px_rgba(16,185,129,.45)] dark:border-white/15 dark:bg-transparent dark:bg-gradient-to-b dark:from-white/[.14] dark:to-white/[.03] dark:shadow-[0_10px_40px_-10px_rgba(16,185,129,.55)] dark:backdrop-blur">
        {children ?? (Icon && <Icon className="h-8 w-8 text-emerald-600 dark:text-emerald-300" strokeWidth={1.75} />)}
      </span>
    </div>
  );
}
