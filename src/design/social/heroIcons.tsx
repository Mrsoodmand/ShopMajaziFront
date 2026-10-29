"use client";

import type { CSSProperties, ReactNode } from "react";
import Link from "@/i18n/Link";
import { categoryHref, type SocialCategory } from "@/content/social-categories-en";
import { iconFor, ring } from "./listKit";
import { GlossyIcons, type GlossyMotion } from "./glossyIcons";
import { useT } from "@/i18n/client";

// Platform icons around the centred title of hero C, in six styles (chosen in /design/page-social-list-hero-icons).
// Every icon is a link to its platform, drawn from the admin's list (its icon or uploaded logo and its colour).
// Desktop places them on both sides of the text; phones get a small row above the title. Reduced motion holds
// everything still (globals.css). Hover always answers the same way: the icon straightens, grows a little and
// takes its platform's colour.

export type IconStyle = "line" | "tile" | "mono" | "bubble" | "constellation" | "orbit";

const ease = "ease-[cubic-bezier(0.22,1,0.36,1)]";
type Size = "md" | "lg" | "xl";
type Spot = { x: number; y: number; size: Size; r: number; d: number; t: number };

// Fixed positions (percent of the hero box), so server and browser draw the same picture.
const spots: Spot[] = [
  { x: 2, y: 14, size: "xl", r: -8, d: 0, t: 7 }, { x: 9, y: 46, size: "lg", r: 7, d: 1.4, t: 8.5 },
  { x: 3, y: 76, size: "md", r: -5, d: 2.6, t: 6.5 }, { x: 17, y: 4, size: "md", r: 11, d: 3.3, t: 9 },
  { x: 92, y: 10, size: "lg", r: 9, d: 0.7, t: 8 }, { x: 85, y: 42, size: "xl", r: -7, d: 2, t: 7.5 },
  { x: 93, y: 72, size: "md", r: 6, d: 3, t: 9.5 }, { x: 77, y: 2, size: "md", r: -11, d: 3.8, t: 6.8 },
];
const box: Record<Size, string> = { md: "h-11 w-11 [&_svg]:h-5 [&_svg]:w-5", lg: "h-13 w-13 [&_svg]:h-6 [&_svg]:w-6", xl: "h-16 w-16 [&_svg]:h-7 [&_svg]:w-7" };
// Brand colour, lifted toward white in dark mode so dark brands (TikTok, X) stay visible.
const hoverInk = "group-hover/f:text-[var(--c)] dark:group-hover/f:text-[color-mix(in_srgb,var(--c)_65%,white)]";

function Mark({ c, stroke = 1.4, draw = false }: { c: SocialCategory; stroke?: number; draw?: boolean }) {
  const Icon = iconFor(c);
  if (c.logo) return <img src={c.logo} alt="" className="h-1/2 w-1/2 rounded-md object-cover opacity-70 grayscale transition duration-700 group-hover/f:opacity-100 group-hover/f:grayscale-0" />;
  if (!Icon) return <span aria-hidden className="font-display text-lg font-semibold">{c.name.slice(0, 1)}</span>;
  return <Icon aria-hidden strokeWidth={stroke} className={draw ? "[&_*]:[stroke-dasharray:120] [&_*]:animate-[stroke-in_1.8s_cubic-bezier(0.45,0,0.2,1)_backwards] [&_*]:[animation-delay:var(--dl)]" : ""} />;
}

// ---------- The six looks ----------

function Glyph({ c, look, size, i, spot }: { c: SocialCategory; look: IconStyle; size: Size; i: number; spot: Spot }) {
  const vars = { "--c": c.color, "--dl": `${300 + i * 120}ms` } as CSSProperties;
  const t = `transition-[border-color,color,background-color,box-shadow] duration-700 ${ease}`;
  switch (look) {
    // Soft tinted tile: the platform's colour as a pale wash with the icon in that colour; sways gently.
    case "tile":
      return (
        <span style={vars} className={`grid animate-[sway_9s_ease-in-out_infinite] place-items-center rounded-2xl border border-[color-mix(in_srgb,var(--c)_28%,transparent)] bg-[color-mix(in_srgb,var(--c)_12%,transparent)] text-[var(--c)] backdrop-blur-sm dark:border-[color-mix(in_srgb,var(--c)_45%,rgba(255,255,255,.25))] dark:bg-[color-mix(in_srgb,color-mix(in_srgb,var(--c)_60%,white)_12%,transparent)] dark:text-[color-mix(in_srgb,var(--c)_60%,white)] ${t} group-hover/f:bg-[color-mix(in_srgb,var(--c)_22%,transparent)] ${box[size]}`} >
          <Mark c={c} stroke={1.8} />
        </span>
      );
    // Bare mono icon, no container, with a small brand-colour dot that pulses softly.
    case "mono":
      return (
        <span style={vars} className={`relative grid place-items-center text-slate-500 dark:text-slate-300 ${t} ${hoverInk} ${box[size]} [&_svg]:!h-[60%] [&_svg]:!w-[60%]`}>
          <Mark c={c} stroke={1.6} />
          <span aria-hidden className="absolute end-1 top-1 h-2 w-2 rounded-full bg-[var(--c)] ring-2 ring-[#F5F6FB] dark:bg-[color-mix(in_srgb,var(--c)_70%,white)] dark:ring-[#070B14]">
            <span style={{ animationDelay: `${spot.d}s` }} className="absolute inset-0 animate-[halo_4s_ease-out_infinite] rounded-full bg-inherit" />
          </span>
        </span>
      );
    // Glass bubble with the brand colour glowing inside; it rises, fades and comes back like a slow bubble.
    case "bubble":
      return (
        <span style={{ ...vars, animationDelay: `${spot.d}s`, animationDuration: `${spot.t + 4}s` }} className={`relative grid animate-[bubble_12s_ease-in-out_infinite] place-items-center overflow-hidden rounded-full border border-white/40 bg-white/40 text-white shadow-[inset_0_1px_0_rgba(255,255,255,.5),0_10px_30px_-12px_var(--c)] backdrop-blur-md dark:border-white/15 dark:bg-white/[.06] ${box[size]}`}>
          <span aria-hidden className="absolute inset-[18%] rounded-full bg-[var(--c)] opacity-80 blur-md transition-[opacity,inset] duration-700 group-hover/f:inset-[8%] group-hover/f:opacity-100" />
          <span className="relative drop-shadow-sm"><Mark c={c} stroke={1.8} /></span>
        </span>
      );
    // Small line icon with no ring that twinkles; neighbours are joined by faint lines (drawn by the layout).
    case "constellation":
      return (
        <span style={{ ...vars, animationDelay: `${spot.d}s` }} className={`grid animate-[twinkle-soft_6s_ease-in-out_infinite] place-items-center rounded-full bg-[#F5F6FB] text-slate-500 dark:bg-[#070B14] dark:text-slate-300 ${t} ${hoverInk} h-11 w-11 [&_svg]:h-5 [&_svg]:w-5`}>
          <Mark c={c} stroke={1.5} draw />
        </span>
      );
    // Line icon in a hairline ring: draws in on load, a ring breathes out now and then (the current look).
    default:
      return (
        <span style={vars} className={`relative grid place-items-center rounded-full border border-slate-900/10 bg-white/50 text-slate-400 backdrop-blur-sm ${t} group-hover/f:border-[color-mix(in_srgb,var(--c)_45%,transparent)] group-hover/f:bg-white ${hoverInk} dark:border-white/15 dark:bg-white/[.04] dark:text-slate-400 dark:group-hover/f:bg-white/[.07] ${box[size]}`}>
          <span aria-hidden style={{ animationDelay: `${spot.d * 1.7}s` }} className="pointer-events-none absolute inset-0 animate-[halo_7s_ease-out_infinite] rounded-full border border-slate-400/60 dark:border-white/30" />
          <Mark c={c} draw />
        </span>
      );
  }
}

// One icon as a link: lands on load, then floats on its own rhythm; hover straightens and lifts it.
function Item({ c, i, spot, look, small = false, float = true }: { c: SocialCategory; i: number; spot: Spot; look: IconStyle; small?: boolean; float?: boolean }) {
  const tx = useT();
  return (
    <Link href={categoryHref(c)} title={tx(c.name)} style={{ animationDelay: `${150 + i * 90}ms` }} className={`group/f block animate-[logo-in_0.9s_cubic-bezier(0.22,1,0.36,1)_backwards] rounded-full ${ring}`}>
      <span style={float ? { animationDelay: `${spot.d}s`, animationDuration: `${spot.t}s` } : undefined} className={float && look !== "bubble" ? "block animate-float" : "block"}>
        <span style={{ rotate: `${look === "constellation" ? 0 : spot.r}deg` }} className={`block transition-[translate,scale,rotate] duration-700 ${ease} group-hover/f:-translate-y-1 group-hover/f:scale-110 group-hover/f:rotate-0!`}>
          <Glyph c={c} look={look} size={small ? "md" : spot.size} i={i} spot={spot} />
        </span>
        <span className="sr-only">{tx(c.name)}</span>
      </span>
    </Link>
  );
}

// Faint lines between neighbouring icons on each side, drawn in once (constellation only).
function Links() {
  const left = [3, 0, 1, 2], right = [7, 4, 5, 6];
  const pts = (ids: number[]) => ids.map((k) => `${spots[k].x + 2},${spots[k].y + 5}`).join(" ");
  return (
    <svg aria-hidden viewBox="0 0 100 100" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 h-full w-full rtl:-scale-x-100">
      {[left, right].map((ids, n) => <polyline key={n} points={pts(ids)} fill="none" vectorEffect="non-scaling-stroke" className="animate-[twinkle-soft_1.8s_ease-out_0.4s_backwards] stroke-slate-400/50 [stroke-width:1] dark:stroke-white/20" />)}
    </svg>
  );
}

// Two slow, flat rings (ellipses) around the hero, turning in opposite directions. The ring is a circle squashed
// vertically; each icon cancels both the turn and the squash, so it stays round and upright. Icons fade out as they
// pass behind the text and show along the sides. Pointing at the hero pauses the rings.
const FLAT = 0.4;
function Orbit({ cats }: { cats: SocialCategory[] }) {
  const ringOf = (list: SocialCategory[], r: number, secs: number, reverse: boolean, offset: number) => (
    <div style={{ width: r * 2, height: r * 2, marginInlineStart: -r, marginTop: -r, transform: `scaleY(${FLAT})` }} className="absolute start-1/2 top-1/2">
      <div style={{ animationDuration: `${secs}s`, animationDirection: reverse ? "reverse" : "normal" }}
        className="relative h-full w-full animate-spin rounded-full border border-slate-900/[.08] [animation-timing-function:linear] group-hover/o:[animation-play-state:paused] dark:border-white/[.08]">
        {list.map((c, k) => {
          const a = offset + (k / list.length) * Math.PI * 2;
          return (
            <div key={c.slug} style={{ left: `${50 + 50 * Math.cos(a)}%`, top: `${50 + 50 * Math.sin(a)}%` }} className="absolute -translate-x-1/2 -translate-y-1/2">
              <div style={{ animationDuration: `${secs}s`, animationDirection: reverse ? "normal" : "reverse" }} className="animate-spin [animation-timing-function:linear] group-hover/o:[animation-play-state:paused]">
                <div style={{ transform: `scaleY(${1 / FLAT})` }}>
                  <Item c={c} i={k} spot={{ ...spots[k % spots.length], r: 0 }} look="line" float={false} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
  return (
    <div className="group/o absolute -inset-x-40 -inset-y-6 hidden [mask-image:radial-gradient(ellipse_30%_60%_at_50%_50%,transparent_60%,black_95%)] lg:block">
      {ringOf(cats.slice(0, 8), 620, 110, false, 0)}
      {ringOf(cats.slice(8, 14), 760, 150, true, Math.PI / 6)}
    </div>
  );
}


export function HeroIcons({ cats, look = "line" }: { cats: SocialCategory[]; look?: string }) {
  if (look === "none") return null;
  if (look.startsWith("g-")) return <GlossyIcons cats={cats} motion={look.slice(2) as GlossyMotion} />;
  const tx = useT();
  const style = (["line", "tile", "mono", "bubble", "constellation", "orbit"].includes(look) ? look : "line") as IconStyle;
  const phone: ReactNode = (
    <ul className="mb-8 flex justify-center gap-3 lg:hidden">
      {cats.slice(0, 5).map((c, i) => <li key={c.slug}><Item c={c} i={i} spot={spots[i]} look={style === "orbit" ? "line" : style} small /></li>)}
    </ul>
  );
  return (
    <nav aria-label={tx("Popular platforms")}>
      {style === "orbit" ? <Orbit cats={cats} /> : (
        <div className="pointer-events-none absolute inset-0 hidden lg:block">
          {style === "constellation" && <Links />}
          <ul>
            {cats.slice(0, spots.length).map((c, i) => (
              <li key={c.slug} style={{ insetInlineStart: `${spots[i].x}%`, top: `${spots[i].y}%` }} className="pointer-events-auto absolute"><Item c={c} i={i} spot={spots[i]} look={style} /></li>
            ))}
          </ul>
        </div>
      )}
      {phone}
    </nav>
  );
}
