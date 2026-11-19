"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { useT } from "@/i18n/client";

// A round button fixed to the bottom corner that scrolls back to the top. It fades in once the page is scrolled
// past about one screen. `raised`: a bar is fixed to the bottom on phones/tablets (social pages' PayBar, lg:hidden),
// so the button sits above it there.
export default function BackToTop({ raised = false }: { raised?: boolean }) {
  const tx = useT();
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const on = () => setShown(window.scrollY > window.innerHeight * 0.9);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  const top = () => {
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: still ? "auto" : "smooth" });
  };
  return (
    <button type="button" onClick={top} aria-label={tx("Back to top")} aria-hidden={!shown} tabIndex={shown ? 0 : -1}
      className={`fixed end-4 z-40 grid h-12 w-12 place-items-center rounded-full border border-slate-200 bg-white/90 text-slate-800 shadow-lg shadow-slate-900/10 backdrop-blur transition-[opacity,transform] duration-300 hover:bg-slate-900 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 sm:end-6 dark:border-white/15 dark:bg-[#0E1424]/90 dark:text-slate-100 dark:hover:bg-white dark:hover:text-slate-900 dark:focus-visible:ring-offset-[#070B14] ${raised ? "bottom-28 lg:bottom-6" : "bottom-6"} ${shown ? "opacity-100" : "pointer-events-none translate-y-3 opacity-0"}`}>
      <ArrowUp aria-hidden className="h-5 w-5" />
    </button>
  );
}
