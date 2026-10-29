import { ArrowRight, Check, ChevronRight } from "lucide-react";

// Arrow styles for the step cards in How to buy E. Each connector sits in the gap after card i.
export type ArrowStyle = "chip" | "orb" | "flow" | "chevrons" | "rail";
export type LinkState = "done" | "live" | "idle"; // done: step before it finished · live: leaving the current step

// Column gap (px) per style; Tailwind needs the literal class.
export const gaps: Record<ArrowStyle, { px: number; cls: string }> = {
  chip: { px: 16, cls: "md:gap-4" },
  orb: { px: 24, cls: "md:gap-6" },
  flow: { px: 44, cls: "md:gap-11" },
  chevrons: { px: 44, cls: "md:gap-11" },
  rail: { px: 16, cls: "md:gap-4" },
};

export function Connector({ style, state }: { style: ArrowStyle; state: LinkState }) {
  if (style === "rail") return null;
  const { px } = gaps[style];
  return (
    <span aria-hidden className="absolute top-1/2 hidden -translate-y-1/2 items-center justify-center md:flex" style={{ insetInlineEnd: -px, width: px }}>
      {style === "chip" && <Chip state={state} />}
      {style === "orb" && <Orb state={state} />}
      {style === "flow" && <Flow state={state} />}
      {style === "chevrons" && <Chevrons state={state} />}
    </span>
  );
}

// A — white pill with a chevron; flips to a green check when the step is done.
function Chip({ state }: { state: LinkState }) {
  return (
    <span className={`flex h-8 w-11 shrink-0 items-center justify-center rounded-full shadow-md ring-1 transition-all duration-500 ${
      state === "done" ? "bg-emerald-500 text-white ring-emerald-400" : state === "live" ? "bg-white text-indigo-600 ring-indigo-200" : "bg-white text-slate-300 ring-slate-200"}`}>
      {state === "done" ? <Check className="h-4 w-4" /> : <ChevronRight className={`h-4 w-4 rtl:rotate-180 ${state === "live" ? "animate-nudge" : ""}`} />}
    </span>
  );
}

// B — glowing gradient orb with a ping ring on the live link.
function Orb({ state }: { state: LinkState }) {
  return (
    <span className="relative grid h-10 w-10 shrink-0 place-items-center">
      {state === "live" && <span className="absolute inset-0 animate-ping rounded-full bg-fuchsia-400/40" />}
      <span className={`relative grid h-10 w-10 place-items-center rounded-full text-white shadow-lg ring-4 ring-[#F5F6FB] transition-all duration-500 ${
        state === "done" ? "bg-gradient-to-br from-emerald-400 to-teal-500 shadow-emerald-400/40"
        : state === "live" ? "scale-110 bg-gradient-to-br from-indigo-500 to-fuchsia-500 shadow-fuchsia-400/50"
        : "bg-gradient-to-br from-slate-300 to-slate-400 shadow-transparent"}`}>
        {state === "done" ? <Check className="h-4 w-4" /> : <ArrowRight className="h-4 w-4 rtl:rotate-180" />}
      </span>
    </span>
  );
}

// C — dashed line with a dot travelling along it; turns solid green when done.
function Flow({ state }: { state: LinkState }) {
  return (
    <span className="relative flex h-3 w-full items-center">
      <span className={`h-[3px] w-full rounded-full transition-colors duration-500 ${state === "done" ? "bg-emerald-500" : state === "live" ? "bg-[repeating-linear-gradient(90deg,#6366f1_0_6px,transparent_6px_10px)]" : "bg-[repeating-linear-gradient(90deg,#cbd5e1_0_6px,transparent_6px_10px)]"}`} />
      {state === "live" && <span className="absolute h-2.5 w-2.5 animate-travel rounded-full bg-indigo-600 shadow-[0_0_10px] shadow-indigo-500" />}
      <ChevronRight strokeWidth={3} className={`absolute -end-2 h-5 w-5 rtl:rotate-180 ${state === "done" ? "text-emerald-500" : state === "live" ? "text-indigo-500" : "text-slate-300"}`} />
    </span>
  );
}

// D — three chevrons lighting up in sequence, like a "go this way" sign.
function Chevrons({ state }: { state: LinkState }) {
  return (
    <span className="flex -space-x-2.5 rtl:space-x-reverse">
      {[0, 1, 2].map((n) => (
        <ChevronRight
          key={n}
          className={`h-5 w-5 rtl:rotate-180 ${state === "done" ? "text-emerald-500" : state === "live" ? "animate-chevron text-indigo-600 dark:text-indigo-400" : "text-slate-300 dark:text-slate-600"}`}
          strokeWidth={3}
          style={state === "live" ? { animationDelay: `${n * 160}ms` } : undefined}
        />
      ))}
    </span>
  );
}

// E — no arrows between cards: a progress rail above them with numbered nodes that fills step by step.
export function Rail({ active, stepMs, resetKey }: { active: number; stepMs: number; resetKey: string }) {
  return (
    <div aria-hidden className="relative mx-[16.66%] mb-6 mt-10 hidden h-9 md:block">
      <div className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-slate-200" />
      {[0, 1].map((seg) => (
        <div key={seg} className="absolute top-1/2 h-1 -translate-y-1/2 overflow-hidden" style={{ insetInlineStart: `${seg * 50}%`, width: "50%" }}>
          {seg < active && <span className="block h-full w-full bg-emerald-500" />}
          {seg === active && <span key={resetKey + active} className="block h-full bg-gradient-to-r from-indigo-500 to-fuchsia-500" style={{ animation: `grow ${stepMs}ms linear forwards` }} />}
        </div>
      ))}
      {[0, 1, 2].map((n) => (
        <span
          key={n}
          className={`absolute top-1/2 grid h-9 w-9 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full text-sm font-bold ring-4 ring-[#F5F6FB] transition-all duration-500 rtl:translate-x-1/2 ${
            n < active ? "bg-emerald-500 text-white" : n === active ? "scale-110 bg-indigo-600 text-white shadow-lg shadow-indigo-400/50" : "border border-slate-200 bg-white text-slate-400"}`}
          style={{ insetInlineStart: `${n * 50}%` }}
        >
          {n < active ? <Check className="h-4 w-4" /> : n + 1}
        </span>
      ))}
    </div>
  );
}
