"use client";

import { useLayoutEffect, useRef, useState } from "react";
import type { LucideIcon } from "lucide-react";

// The tab bar from How to buy E: equal-width tabs with icons and a highlight that slides (with a slight bounce)
// behind the active one. Scrolls sideways on narrow screens.
export type Tab<T extends string> = { id: T; label: string; icon?: LucideIcon };

export default function SlidingTabs<T extends string>({ tabs, value, onChange, className = "" }: { tabs: Tab<T>[]; value: T; onChange: (id: T) => void; className?: string }) {
  const refs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [pill, setPill] = useState({ left: 0, width: 0 });
  useLayoutEffect(() => {
    const measure = () => { const b = refs.current[value]; if (b) setPill({ left: b.offsetLeft, width: b.offsetWidth }); };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [value]);

  return (
    <div role="tablist" className={`relative flex gap-1 overflow-x-auto rounded-2xl bg-white p-1 shadow-sm ring-1 ring-slate-200 [scrollbar-width:none] dark:bg-white/5 dark:ring-white/10 ${className}`}>
      <span aria-hidden className="absolute inset-y-1 rounded-xl bg-slate-900 shadow-md transition-all duration-500 ease-[cubic-bezier(.3,1.3,.5,1)] dark:bg-white" style={{ left: pill.left, width: pill.width }} />
      {tabs.map((t) => {
        const on = t.id === value;
        return (
          <button key={t.id} role="tab" aria-selected={on} ref={(el) => { refs.current[t.id] = el; }} onClick={() => onChange(t.id)}
            className={`relative z-10 flex shrink-0 flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-medium transition-colors duration-300 ${on ? "text-white dark:text-slate-900" : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"}`}>
            {t.icon && <t.icon className="h-4 w-4" />}{t.label}
          </button>
        );
      })}
    </div>
  );
}
