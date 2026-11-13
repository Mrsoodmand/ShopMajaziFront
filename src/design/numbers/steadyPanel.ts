"use client";

import { useEffect, useLayoutEffect, useRef, type RefObject } from "react";

// Keeps a sticky side panel (CatalogPanel) still when its content grows or shrinks.
// Once the page is scrolled down, a sticky panel rests against the bottom of its column, so new content (the app
// step, the app list, an opened dropdown) pushes its top up and everything in it jumps, including the card just
// clicked. The browser's own scroll anchoring doesn't cover sticky boxes, so here the page scrolls by the same
// amount instead, before the frame is painted: the panel's top stays where it was.
// Only when the panel itself changed size and is sticky (desktop): on phones it sits below the grid and grows
// downwards, and a change elsewhere (Show more, a search) is left to the browser.
// Checked after each render of the component that calls this (works even when no frame is painted) and whenever
// the panel resizes (changes made inside the panel's own parts, e.g. a dropdown opening).
// `on`: whether the panel is on screen (false while the order screen replaces it).

type Spot = { top: number; height: number };
const spotOf = (el: HTMLElement): Spot => { const r = el.getBoundingClientRect(); return { top: r.top, height: r.height }; };

function settle(el: HTMLElement, last: { current: Spot | null }) {
  const was = last.current;
  const now = spotOf(el);
  last.current = now;
  if (!was || Math.abs(now.height - was.height) < 1 || getComputedStyle(el).position !== "sticky") return;
  const moved = now.top - was.top;
  if (Math.abs(moved) < 1) return;
  window.scrollBy({ top: moved, behavior: "instant" });
  last.current = spotOf(el);
}

export function useSteadyPanel(ref: RefObject<HTMLElement | null>, on = true) {
  const last = useRef<Spot | null>(null);

  // Where the panel was before anything changed: noted on every scroll and just before each click or key press.
  useEffect(() => {
    const el = ref.current;
    if (!on || !el) return;
    const note = () => { last.current = spotOf(el); };
    note();
    const ro = "ResizeObserver" in window ? new ResizeObserver(() => settle(el, last)) : null;
    ro?.observe(el);
    const quiet = { capture: true, passive: true } as const;
    window.addEventListener("scroll", note, { passive: true });
    window.addEventListener("resize", note);
    document.addEventListener("pointerdown", note, quiet);
    document.addEventListener("keydown", note, quiet);
    return () => {
      last.current = null;
      ro?.disconnect();
      window.removeEventListener("scroll", note);
      window.removeEventListener("resize", note);
      document.removeEventListener("pointerdown", note, quiet);
      document.removeEventListener("keydown", note, quiet);
    };
  }, [ref, on]);

  // After each render, before paint.
  useLayoutEffect(() => {
    if (on && ref.current) settle(ref.current, last);
  });
}
