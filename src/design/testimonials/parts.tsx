"use client";

import { Star, BadgeCheck } from "lucide-react";
import type { Review } from "@/content/reviews-en";
import { useT } from "@/i18n/client";

// Pieces shared by the testimonials offers.

const avatarTints = [
  "from-indigo-500 to-violet-500", "from-sky-400 to-cyan-500", "from-amber-400 to-orange-500",
  "from-emerald-400 to-teal-500", "from-fuchsia-500 to-pink-500",
];

export function Avatar({ r, size = "md" }: { r: Review; size?: "md" | "lg" }) {
  const tint = avatarTints[Number(r.id.slice(1)) % avatarTints.length];
  return (
    <span aria-hidden className={`grid shrink-0 place-items-center rounded-full bg-gradient-to-br font-bold text-white ${tint} ${size === "lg" ? "h-14 w-14 text-lg" : "h-10 w-10 text-sm"}`}>
      {r.name.split(" ").map((p) => p[0]).join("").slice(0, 2)}
    </span>
  );
}

export function Stars({ n, size = "sm" }: { n: number; size?: "sm" | "lg" }) {
  const t = useT();
  const cls = size === "lg" ? "h-6 w-6" : "h-4 w-4";
  return (
    <span className="flex" role="img" aria-label={t("{0} out of 5 stars", { 0: n })}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} className={`${cls} ${i <= Math.round(n) ? "fill-amber-400 text-amber-400" : "fill-slate-200 text-slate-200 dark:fill-white/10 dark:text-white/10"}`} />
      ))}
    </span>
  );
}

export function Who({ r, light = false }: { r: Review; light?: boolean }) {
  const t = useT();
  return (
    <div className="flex items-center gap-3">
      <Avatar r={r} />
      <div className="min-w-0">
        <div className={`flex items-center gap-1 text-sm font-semibold ${light ? "text-white" : "text-slate-900 dark:text-white"}`}>
          {r.name}<BadgeCheck className="h-4 w-4 text-sky-500" aria-label={t("Verified buyer")} />
        </div>
        <div className={`truncate text-xs ${light ? "text-white/70" : "text-slate-500 dark:text-slate-400"}`}>{r.service} · {r.date}</div>
      </div>
    </div>
  );
}

export function ReviewCard({ r, className = "" }: { r: Review; className?: string }) {
  return (
    <figure className={`rounded-3xl bg-white p-6 ring-1 ring-slate-200 dark:bg-[#0E1424] dark:ring-white/10 ${className}`}>
      <Stars n={r.rating} />
      <blockquote className="mt-4 text-[15px] leading-7 text-slate-700 dark:text-slate-300">“{r.text}”</blockquote>
      <figcaption className="mt-5"><Who r={r} /></figcaption>
    </figure>
  );
}

export function Heading({ kicker, title, sub }: { kicker: string; title: string; sub?: string }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <span className="text-sm font-semibold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">{kicker}</span>
      <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl dark:text-white">{title}</h2>
      {sub && <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">{sub}</p>}
    </div>
  );
}
