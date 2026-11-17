import type { CSSProperties } from "react";
import type { GlowTone } from "./HeaderGlow";
import s from "./pageBackdrop.module.css";

// The page ground under PageShell's content: soft pools of the page's own two colours down the page, the hero's dot
// grid carried along the edges, and a fine grain (see pageBackdrop.module.css). Still, decorative, behind everything.
// The colours are the page's header glow pair (see HeaderGlow); pages without a glow get the brand indigo and fuchsia.

const pairs: Record<GlowTone | "brand", [string, string]> = {
  violet: ["#8b5cf6", "#06b6d4"], // virtual numbers
  emerald: ["#10b981", "#14b8a6"], // Google Voice
  amber: ["#f59e0b", "#f43f5e"], // rent a number
  sky: ["#0ea5e9", "#6366f1"], // Apple ID
  rose: ["#ec4899", "#8b5cf6"], // subscriptions
  brand: ["#6366f1", "#d946ef"],
};

export default function PageBackdrop({ tone }: { tone?: GlowTone }) {
  const [a, b] = pairs[tone ?? "brand"];
  return (
    // will-change keeps the backdrop on its own GPU layer, painted once: without it the big gradients were repainted
    // on every scroll frame, which made long pages (blog posts) stutter on phones.
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-20 overflow-hidden [will-change:transform]" style={{ "--a": a, "--b": b } as CSSProperties}>
      <div className={s.fields} />
      <div className={s.dots} />
      <div className={s.grain} />
    </div>
  );
}
