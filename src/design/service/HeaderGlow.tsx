// The home hero's soft glow (three blurred color blobs over a dot grid), recolored per page. It fades and settles in
// on load, then the blobs drift slowly on their own loops. Sits behind the page's title area and fades out below it.
// Reduced motion turns the movement off (see globals.css).

export type GlowTone = "violet" | "emerald" | "amber" | "sky" | "rose";

const tones: Record<GlowTone, [string, string, string]> = {
  // Virtual numbers: violet and cyan.
  violet: ["bg-violet-300/50 dark:bg-violet-600/30", "bg-cyan-300/40 dark:bg-cyan-500/20", "bg-blue-300/40 dark:bg-blue-600/15"],
  // Google Voice: emerald and teal.
  emerald: ["bg-emerald-300/50 dark:bg-emerald-600/25", "bg-teal-300/40 dark:bg-teal-500/20", "bg-sky-300/35 dark:bg-sky-500/15"],
  // Rent a number: warm amber and rose.
  amber: ["bg-amber-300/50 dark:bg-amber-500/20", "bg-rose-300/40 dark:bg-rose-600/20", "bg-orange-200/50 dark:bg-orange-500/12"],
  // Apple ID: cool sky and silver.
  sky: ["bg-sky-300/50 dark:bg-sky-600/25", "bg-blue-300/40 dark:bg-blue-600/20", "bg-slate-300/50 dark:bg-indigo-400/12"],
  // Subscriptions: pink and violet.
  rose: ["bg-pink-300/50 dark:bg-pink-600/25", "bg-violet-300/40 dark:bg-purple-600/20", "bg-orange-200/45 dark:bg-orange-500/12"],
};

export default function HeaderGlow({ tone }: { tone: GlowTone }) {
  const [a, b, c] = tones[tone];
  return (
    <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[720px] overflow-hidden [mask-image:linear-gradient(to_bottom,black_55%,transparent)]">
      <div className="absolute inset-0 animate-glow-in">
        <div className={`absolute -top-32 start-[8%] h-[420px] w-[420px] animate-glow-a rounded-full blur-[110px] transition-colors duration-700 ${a}`} />
        <div className={`absolute -top-20 end-[6%] h-[380px] w-[380px] animate-glow-b rounded-full blur-[110px] transition-colors duration-700 ${b}`} />
        <div className={`absolute top-[30%] start-1/2 h-[340px] w-[760px] -translate-x-1/2 animate-glow-c rounded-full blur-[120px] transition-colors duration-700 ${c}`} />
      </div>
      <div className="absolute inset-0 animate-[glow-in_1.6s_ease-out_both] bg-[radial-gradient(rgba(15,23,42,.12)_1px,transparent_1px)] bg-[size:22px_22px] [mask-image:radial-gradient(ellipse_at_top,black_20%,transparent_70%)] dark:bg-[radial-gradient(rgba(255,255,255,.08)_1px,transparent_1px)]" />
    </div>
  );
}
