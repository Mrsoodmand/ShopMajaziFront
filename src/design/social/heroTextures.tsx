"use client";

import { Facebook, Instagram, Linkedin, Music2, Send, Twitch, Twitter, Youtube, type LucideIcon } from "lucide-react";

// Background textures for the Brand Mesh hero (B), replacing the old dot grid. Each sits inside the band's fade
// mask, so it disappears with the band. All are still, decorative and hidden from screen readers.

export type TextureId = "none" | "grid" | "rings" | "grain" | "lines" | "glyphs";

// Fades a texture toward the edges so it reads as light on the colour, not a pattern pasted on top.
const softEdge = "[mask-image:radial-gradient(ellipse_80%_75%_at_50%_20%,black,transparent)]";

// Film grain: fractal noise from an inline SVG, blended into the colour.
const grain = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 .55 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

// Faint outlined platform icons scattered at fixed spots (same on server and browser).
const glyphs: { Icon: LucideIcon; x: number; y: number; size: number; r: number }[] = [
  { Icon: Send, x: 6, y: 18, size: 44, r: -12 }, { Icon: Instagram, x: 22, y: 62, size: 34, r: 8 },
  { Icon: Youtube, x: 40, y: 12, size: 30, r: -6 }, { Icon: Music2, x: 55, y: 55, size: 40, r: 14 },
  { Icon: Twitter, x: 68, y: 16, size: 36, r: -10 }, { Icon: Facebook, x: 82, y: 48, size: 30, r: 6 },
  { Icon: Twitch, x: 92, y: 14, size: 40, r: 12 }, { Icon: Linkedin, x: 76, y: 78, size: 28, r: -8 },
  { Icon: Instagram, x: 88, y: 84, size: 22, r: 18 }, { Icon: Send, x: 34, y: 86, size: 26, r: 10 },
];

export function HeroTexture({ id }: { id?: string }) {
  switch (id as TextureId) {
    case "grid":
      return <div className={`absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.07)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.07)_1px,transparent_1px)] bg-[size:56px_56px] ${softEdge}`} />;
    case "rings":
      return <div className="absolute inset-0 bg-[repeating-radial-gradient(circle_at_88%_-10%,rgba(255,255,255,.12)_0_1px,transparent_1px_64px)] [mask-image:radial-gradient(circle_at_88%_0%,black,transparent_70%)] rtl:bg-[repeating-radial-gradient(circle_at_12%_-10%,rgba(255,255,255,.12)_0_1px,transparent_1px_64px)] rtl:[mask-image:radial-gradient(circle_at_12%_0%,black,transparent_70%)]" />;
    case "grain":
      return <div style={{ backgroundImage: grain }} className="absolute inset-0 opacity-[.4] mix-blend-overlay" />;
    case "lines":
      return <div className={`absolute inset-0 bg-[repeating-linear-gradient(120deg,rgba(255,255,255,.06)_0_1px,transparent_1px_18px)] ${softEdge}`} />;
    case "glyphs":
      return (
        <div className="absolute inset-0 overflow-hidden">
          {glyphs.map(({ Icon, x, y, size, r }, i) => (
            <Icon key={i} strokeWidth={1.25} style={{ insetInlineStart: `${x}%`, top: `${y}%`, width: size, height: size, rotate: `${r}deg` }} className="absolute text-white/[.09]" />
          ))}
        </div>
      );
    default:
      return null;
  }
}
