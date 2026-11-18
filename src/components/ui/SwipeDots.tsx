"use client";

import { useT } from "@/i18n/client";

// Position dots under a swipe row (useSwipeRow): the current card's dot stretches into a pill; tapping a dot goes to
// that card. `className` sets visibility (e.g. "sm:hidden" when the row is a grid on wider screens).
export default function SwipeDots({ count, index, go, label, className = "", tone = "bg-slate-900 dark:bg-white" }: { count: number; index: number; go: (i: number) => void; label: string; className?: string; tone?: string }) {
  const tx = useT();
  if (count < 2) return null;
  return (
    <div role="group" aria-label={label} className={`mt-5 flex justify-center gap-1.5 ${className}`}>
      {Array.from({ length: count }, (_, i) => (
        <button key={i} type="button" onClick={() => go(i)} aria-label={tx("Go to {0}", { 0: i + 1 })} aria-current={i === index ? "true" : undefined}
          className="grid h-6 place-items-center px-0.5">
          <span aria-hidden className={`block h-1.5 rounded-full transition-all duration-300 ${i === index ? `w-6 ${tone}` : "w-1.5 bg-slate-300 dark:bg-white/20"}`} />
        </button>
      ))}
    </div>
  );
}
