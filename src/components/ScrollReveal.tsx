"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Landing pages: each top-level <section> below the fold softly fades and rises in as it scrolls into view
// (see .reveal in globals.css). Mounted once in the root layout, so every page gets it without its own code.
// Only sections that start below the first screen are touched, so nothing visible on load ever blinks, and pages
// render fully without JS. Opacity and transform only: no layout shift. Off for reduced motion, and on the design
// comparison and login pages, and on the Lexicon landing pages, whose only motion is the turning guide words.
const skip = /^\/(?:en\/)?(?:design|login|landing)(?:\/|$)/;

export default function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    if (skip.test(pathname) || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!("IntersectionObserver" in window)) return;

    // Outermost sections only (a section inside another one moves with its parent).
    const all = Array.from(document.querySelectorAll<HTMLElement>("main section"));
    const fold = window.innerHeight;
    if (!fold) return; // no viewport yet (hidden tab, prerender): leave everything as is
    // Sections with their own entrance (data-own-motion, e.g. the service "How to use" steps) are left to it.
    const targets = all.filter((el) => !el.parentElement?.closest("main section") && !el.hasAttribute("data-own-motion") && el.getBoundingClientRect().top > fold);

    // Once shown, drop the classes so the section's transform can't affect fixed or sticky children later.
    const done = (el: HTMLElement) => {
      el.classList.remove("reveal", "reveal-in");
    };
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const el = e.target as HTMLElement;
          io.unobserve(el);
          el.classList.add("reveal-in");
          el.addEventListener("transitionend", () => done(el), { once: true });
          setTimeout(() => done(el), 1200);
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    for (const el of targets) {
      el.classList.add("reveal");
      io.observe(el);
    }
    return () => {
      io.disconnect();
      targets.forEach(done);
    };
  }, [pathname]);

  return null;
}
