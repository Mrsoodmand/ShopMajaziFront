"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

// One word of a headline that changes every few seconds ("Get your digital services instantly / safely / …").
// The slot glides to each word's own width, so the text around it stays snug. Three ways to change:
//   slot  – the word slides up and out while the next slides in from below
//   blur  – the word fades through a soft blur into the next
//   type  – the word is deleted letter by letter and the next one typed, with a blinking cursor
// Screen readers and visitors who prefer reduced motion get the first word only, standing still.
export type WordMotion = "slot" | "blur" | "type";

function useReducedMotion() {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduce(m.matches);
    const on = () => setReduce(m.matches);
    m.addEventListener("change", on);
    return () => m.removeEventListener("change", on);
  }, []);
  return reduce;
}

export default function RotatingWord({ words, motion, every = 2600, className = "" }: { words: string[]; motion: WordMotion; every?: number; className?: string }) {
  const reduce = useReducedMotion();
  // The page's HTML (and so the headline search engines read) holds the first word only; the other words and the
  // motion arrive once the page runs in the browser.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const [i, setI] = useState(0);
  const [typed, setTyped] = useState(Array.from(words[0]).length); // letters of words[i] shown (typewriter)
  const [deleting, setDeleting] = useState(false);

  // slot / blur: next word on a timer.
  useEffect(() => {
    if (reduce || motion === "type" || words.length < 2) return;
    const id = setInterval(() => setI((n) => (n + 1) % words.length), every);
    return () => clearInterval(id);
  }, [reduce, motion, every, words.length]);

  // type: hold the full word, delete it, type the next one.
  useEffect(() => {
    if (reduce || motion !== "type" || words.length < 2) return;
    const len = Array.from(words[i]).length;
    let id: ReturnType<typeof setTimeout>;
    if (!deleting && typed === len) id = setTimeout(() => setDeleting(true), every - 900);
    else if (deleting && typed === 0) id = setTimeout(() => { setDeleting(false); setI((n) => (n + 1) % words.length); }, 250);
    else id = setTimeout(() => setTyped((n) => n + (deleting ? -1 : 1)), deleting ? 45 : 85);
    return () => clearTimeout(id);
  }, [reduce, motion, every, words, i, typed, deleting]);

  // Width of each word, measured once laid out (and again when fonts load or the size changes).
  const measure = useRef<(HTMLSpanElement | null)[]>([]);
  const [widths, setWidths] = useState<number[]>([]);
  useLayoutEffect(() => {
    const read = () => setWidths(measure.current.map((el) => el?.getBoundingClientRect().width ?? 0));
    read();
    document.fonts?.ready.then(read);
    window.addEventListener("resize", read);
    return () => window.removeEventListener("resize", read);
  }, [words, mounted]);

  if (reduce || !mounted) return <span className={className}>{words[0]}</span>;

  if (motion === "type")
    return (
      <span className="inline-block">
        <span aria-hidden className="whitespace-nowrap">
          <span className={className}>{Array.from(words[i]).slice(0, typed).join("")}</span>
          <span className="ms-0.5 inline-block w-[3px] translate-y-[0.08em] animate-[caret_1s_steps(1)_infinite] bg-current align-baseline text-indigo-500 [height:0.9em] dark:text-indigo-300" />
        </span>
        <span className="sr-only">{words[0]}</span>
      </span>
    );

  return (
    <span style={widths[i] ? { width: widths[i] } : undefined}
      className={`relative inline-grid transition-[width] duration-700 ease-[cubic-bezier(.16,1,.3,1)] ${motion === "slot" ? "overflow-hidden pb-[0.12em] align-bottom [clip-path:inset(0_-0.3em)]" : "overflow-visible"}`}>
      {/* Hidden copies to measure each word. */}
      <span aria-hidden className="pointer-events-none invisible absolute start-0 top-0 whitespace-nowrap">
        {words.map((w, n) => <span key={w} ref={(el) => { measure.current[n] = el; }} className={`inline-block ${className}`}>{w}</span>)}
      </span>
      {words.map((w, n) => {
        const on = n === i;
        const before = n === (i - 1 + words.length) % words.length; // the one leaving
        const look = motion === "slot"
          ? on ? "translate-y-0 opacity-100" : before ? "-translate-y-full opacity-0" : "translate-y-full opacity-0"
          : on ? "opacity-100 blur-0 scale-100" : "opacity-0 blur-md scale-95";
        return (
          <span key={w} aria-hidden={!on || undefined}
            className={`col-start-1 row-start-1 whitespace-nowrap text-start transition-all duration-700 ease-[cubic-bezier(.16,1,.3,1)] ${look}`}>
            <span className={className}>{w}</span>
          </span>
        );
      })}
    </span>
  );
}
