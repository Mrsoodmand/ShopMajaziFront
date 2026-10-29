import { Plus } from "lucide-react";
import type { ReactNode } from "react";

// One expandable question. The answer stays in the HTML when collapsed, so search engines and Ctrl+F still find it.
export default function Item({ id, q, a, open, onToggle, boxed = false }: { id: string; q: ReactNode; a: ReactNode; open: boolean; onToggle: () => void; boxed?: boolean }) {
  return (
    <div className={boxed
      ? `rounded-2xl ring-1 transition-colors ${open ? "bg-white ring-indigo-200 shadow-lg shadow-indigo-100/60 dark:bg-[#0E1424] dark:shadow-black/30 dark:ring-indigo-400/40" : "bg-white ring-slate-200 dark:bg-[#0E1424] dark:ring-white/10"}`
      : "border-b border-slate-200 dark:border-white/10"}>
      <h3>
        <button id={`${id}-q`} aria-controls={`${id}-a`} aria-expanded={open} onClick={onToggle}
          className={`flex w-full items-center justify-between gap-6 text-start ${boxed ? "px-5 py-4" : "py-5"}`}>
          <span className={`font-display text-base font-semibold sm:text-lg ${open ? "text-indigo-700 dark:text-indigo-300" : "text-slate-900 dark:text-white"}`}>{q}</span>
          <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full transition duration-300 ${open ? "rotate-45 bg-indigo-600 text-white" : "bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-300"}`}>
            <Plus className="h-4 w-4" />
          </span>
        </button>
      </h3>
      <div id={`${id}-a`} role="region" aria-labelledby={`${id}-q`} className={`grid transition-all duration-300 ease-out ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
        <div className="overflow-hidden">
          <p className={`text-[15px] leading-7 text-slate-600 dark:text-slate-400 ${boxed ? "px-5 pb-5" : "pb-6 pe-14"}`}>{a}</p>
        </div>
      </div>
    </div>
  );
}
