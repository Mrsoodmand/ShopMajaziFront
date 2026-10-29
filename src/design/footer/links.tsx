import Link from "@/i18n/Link";
import { ArrowRight } from "lucide-react";

// Slides a touch toward the reading direction while an underline draws in from the start side.
export const hoverLink =
  "relative inline-block transition-[color,translate] duration-300 ease-out hover:translate-x-1 rtl:hover:-translate-x-1 " +
  "after:pointer-events-none after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-current " +
  "after:transition-transform after:duration-300 after:ease-out hover:after:scale-x-100 rtl:after:origin-right " +
  "focus-visible:after:scale-x-100 motion-reduce:transition-none motion-reduce:hover:translate-x-0";

// Hover styles for footer links. All are eased over 300ms and respect "reduce motion".
export type LinkStyle = "underline" | "arrow" | "pill" | "sweep" | "dot";

const base = "text-slate-500 dark:text-slate-400";

export const linkStyles: Record<LinkStyle, string> = {
  // A — slides a touch and an underline draws in from the start side.
  underline: `${hoverLink} ${base} hover:text-slate-900 dark:hover:text-white`,
  // B — a small arrow grows in before the text, which turns indigo.
  arrow: `group/link inline-flex items-center gap-0 transition-[gap,color] duration-300 ease-out hover:gap-1.5 hover:text-indigo-600 ${base} dark:hover:text-indigo-300 motion-reduce:transition-none`,
  // C — a soft rounded pill fades in behind the link.
  pill: `-mx-2 inline-block rounded-lg px-2 py-1 transition-[background-color,color] duration-300 ease-out hover:bg-slate-900/[.06] hover:text-slate-900 ${base} dark:hover:bg-white/10 dark:hover:text-white`,
  // D — an indigo-to-pink highlight sweeps across behind the text.
  sweep: `-mx-1 inline-block rounded px-1 bg-gradient-to-r from-indigo-500/15 to-fuchsia-500/20 bg-no-repeat bg-[length:0%_100%] bg-left transition-[background-size,color] duration-300 ease-out hover:bg-[length:100%_100%] hover:text-indigo-700 rtl:bg-right ${base} dark:from-indigo-400/20 dark:to-fuchsia-400/25 dark:hover:text-white motion-reduce:transition-none`,
  // E — a dot pops in at the start and nudges the text over.
  dot: `relative inline-block transition-[padding,color] duration-300 ease-out hover:ps-3.5 hover:text-slate-900 before:absolute before:start-0 before:top-1/2 before:h-1.5 before:w-1.5 before:-translate-y-1/2 before:scale-0 before:rounded-full before:bg-gradient-to-br before:from-indigo-500 before:to-fuchsia-500 before:transition-transform before:duration-300 before:ease-out hover:before:scale-100 ${base} dark:hover:text-white motion-reduce:transition-none`,
};

export function FooterLink({ href, label, style, className = "" }: { href: string; label: string; style: LinkStyle; className?: string }) {
  return (
    <Link href={href} className={`${linkStyles[style]} ${className}`}>
      {style === "arrow" && (
        <ArrowRight aria-hidden className="h-3.5 w-0 shrink-0 opacity-0 transition-all duration-300 ease-out group-hover/link:w-3.5 group-hover/link:opacity-100 rtl:rotate-180" />
      )}
      {label}
    </Link>
  );
}
