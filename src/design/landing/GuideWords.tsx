"use client";

import { useEffect, useRef, useState } from "react";

// The guide words at the head of the page: the first and the last headword in view, recomputed as you scroll,
// the way a lexicon prints the first and last entry of each page. Anything marked `data-hw` counts as a headword.
export default function GuideWords({ initial, side }: { initial: string; side: "first" | "last" }) {
  const [word, setWord] = useState(initial);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let raf = 0;
    const read = () => {
      raf = 0;
      const head = ref.current?.closest("header")?.getBoundingClientRect().bottom ?? 0;
      let first: string | undefined, last: string | undefined;
      for (const el of document.querySelectorAll<HTMLElement>("[data-hw]")) {
        const r = el.getBoundingClientRect();
        if (r.height === 0 || r.bottom <= head || r.top >= window.innerHeight) continue;
        first ??= el.dataset.hw;
        last = el.dataset.hw;
      }
      const next = side === "first" ? first : last;
      if (next) setWord(next);
    };
    const queue = () => { if (!raf) raf = requestAnimationFrame(read); };
    read();
    window.addEventListener("scroll", queue, { passive: true });
    window.addEventListener("resize", queue);
    return () => { window.removeEventListener("scroll", queue); window.removeEventListener("resize", queue); cancelAnimationFrame(raf); };
  }, [side]);

  return (
    <span ref={ref} aria-hidden className="block min-w-0 truncate">
      <span key={word} className="lx-turn inline-block max-w-full truncate align-bottom italic">{word}</span>
    </span>
  );
}
