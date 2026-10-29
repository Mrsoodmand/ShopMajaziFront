"use client";

import { useEffect, useRef, useState } from "react";
import Link from "@/i18n/Link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { postHref, posts } from "@/content/blog-en";
import Cover from "./Cover";
import { Chip, Meta, ViewAll } from "./parts";
import { useT } from "@/i18n/client";

// Offer C — "Carousel": a row of article cards with prev / next arrows. Drag it with the mouse on desktop;
// on phones it's a native swipe. Shows more posts in little vertical space.
export default function BlogC() {
  const tx = useT();
  const track = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const on = () => {
      const max = el.scrollWidth - el.clientWidth;
      const x = Math.abs(el.scrollLeft);
      setEdges({ start: x < 4, end: x > max - 4 });
    };
    on();
    el.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => { el.removeEventListener("scroll", on); window.removeEventListener("resize", on); };
  }, []);

  // Click-and-drag with a mouse (touch already swipes natively). While dragging, the row follows the pointer 1:1
  // (written once per frame). On release it eases, with the drag's momentum, onto the card the throw would land on.
  // Snapping is paused meanwhile so it doesn't fight the motion. A drag that moved more than a few pixels doesn't
  // count as a click on the card.
  const drag = useRef({ down: false, startX: 0, startLeft: 0, moved: false, lastX: 0, lastT: 0, v: 0, frame: 0, target: 0 });
  const [dragging, setDragging] = useState(false);

  useEffect(() => () => cancelAnimationFrame(drag.current.frame), []);

  const restoreSnap = (el: HTMLDivElement) => { el.style.scrollBehavior = ""; el.style.scrollSnapType = ""; };

  // Scroll positions where each card lines up with the snap line (the row's inner padding).
  const snapPoints = (el: HTMLDivElement) => {
    const pad = parseFloat(getComputedStyle(el).scrollPaddingInlineStart) || 0;
    const box = el.getBoundingClientRect();
    const rtl = getComputedStyle(el).direction === "rtl";
    const max = el.scrollWidth - el.clientWidth;
    return (Array.from(el.children) as HTMLElement[]).map((card) => {
      const r = card.getBoundingClientRect();
      const p = el.scrollLeft + (rtl ? r.right - (box.right - pad) : r.left - (box.left + pad));
      return rtl ? Math.max(-max, Math.min(0, p)) : Math.max(0, Math.min(max, p));
    });
  };

  // One eased motion from the release point to the card where the throw would have come to rest
  // (so it never overshoots and slides back). Then CSS snapping takes over again.
  const glide = (el: HTMLDivElement) => {
    const d = drag.current;
    const from = el.scrollLeft;
    const projected = from - d.v * 16 * (0.94 / 0.06); // distance a 0.94-per-frame friction would cover
    const points = snapPoints(el);
    if (!points.length) { restoreSnap(el); return; }
    const to = points.reduce((best, p) => (Math.abs(p - projected) < Math.abs(best - projected) ? p : best));
    const dist = Math.abs(to - from);
    if (dist < 1) { restoreSnap(el); return; }
    const duration = Math.min(750, 280 + dist * 0.6);
    const t0 = performance.now();
    const ease = (t: number) => 1 - Math.pow(1 - t, 3); // ease-out cubic
    const step = (now: number) => {
      const t = Math.min(1, (now - t0) / duration);
      el.scrollLeft = from + (to - from) * ease(t);
      if (t < 1) d.frame = requestAnimationFrame(step);
      else { d.frame = 0; restoreSnap(el); }
    };
    d.frame = requestAnimationFrame(step);
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || e.button !== 0) return;
    const el = e.currentTarget;
    cancelAnimationFrame(drag.current.frame); // grabbing stops any glide in progress
    drag.current = { down: true, startX: e.clientX, startLeft: el.scrollLeft, moved: false, lastX: e.clientX, lastT: performance.now(), v: 0, frame: 0, target: el.scrollLeft };
    el.style.scrollSnapType = "none";
    el.style.scrollBehavior = "auto";
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d.down) return;
    const dx = e.clientX - d.startX;
    if (!d.moved && Math.abs(dx) > 5) {
      d.moved = true;
      setDragging(true);
      try { e.currentTarget.setPointerCapture(e.pointerId); } catch {} // keeps the drag going if the mouse leaves the row
    }
    if (!d.moved) return;
    // Velocity in px per ms, smoothed so one jittery event doesn't throw the glide.
    const now = performance.now(), dt = Math.max(1, now - d.lastT);
    d.v = 0.8 * ((e.clientX - d.lastX) / dt) + 0.2 * d.v;
    d.lastX = e.clientX; d.lastT = now;
    d.target = d.startLeft - dx;
    if (!d.frame) {
      const el = e.currentTarget;
      d.frame = requestAnimationFrame(() => { el.scrollLeft = drag.current.target; drag.current.frame = 0; });
    }
  };
  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d.down) return;
    d.down = false;
    setDragging(false);
    const el = e.currentTarget;
    cancelAnimationFrame(d.frame);
    d.frame = 0;
    if (!d.moved) { restoreSnap(el); return; }
    el.scrollLeft = d.target;
    // A pause before letting go means no throw.
    if (performance.now() - d.lastT > 80) d.v = 0;
    glide(el);
  };
  const onClickCapture = (e: React.MouseEvent) => {
    if (drag.current.moved) { e.preventDefault(); e.stopPropagation(); drag.current.moved = false; }
  };

  // Move by one card; flips direction for RTL pages.
  const nudge = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const card = el.querySelector("a");
    const step = (card?.clientWidth ?? 320) + 20;
    const rtl = getComputedStyle(el).direction === "rtl";
    el.scrollBy({ left: dir * step * (rtl ? -1 : 1), behavior: "smooth" });
  };

  const arrow = "grid h-11 w-11 place-items-center rounded-full ring-1 transition disabled:opacity-30 ring-slate-300 text-slate-700 hover:bg-slate-900 hover:text-white hover:ring-slate-900 dark:ring-white/15 dark:text-slate-200 dark:hover:bg-white dark:hover:text-slate-900 disabled:hover:bg-transparent disabled:hover:text-inherit";

  return (
    <section className="overflow-hidden bg-white py-24 dark:bg-[#070B14]">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <span className="text-sm font-semibold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">{tx("Blog")}</span>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl dark:text-white">{tx("Fresh from the blog")}</h2>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => nudge(-1)} disabled={edges.start} aria-label={tx("Previous articles")} className={arrow}><ChevronLeft className="h-5 w-5 rtl:rotate-180" /></button>
            <button onClick={() => nudge(1)} disabled={edges.end} aria-label={tx("Next articles")} className={arrow}><ChevronRight className="h-5 w-5 rtl:rotate-180" /></button>
            <div className="ms-2 hidden sm:block"><ViewAll /></div>
          </div>
        </div>

        <div ref={track}
          onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={endDrag} onPointerCancel={endDrag} onPointerLeave={endDrag}
          onClickCapture={onClickCapture} onDragStart={(e) => e.preventDefault()}
          className={`-mx-6 mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-px-6 px-6 pb-2 select-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${dragging ? "cursor-grabbing [&_a]:cursor-grabbing" : "cursor-grab"}`}>
          {tx.tr(posts).map((p) => (
            <Link key={p.slug} href={postHref(p)} className="group w-[82%] shrink-0 snap-start sm:w-[46%] lg:w-[31.5%]">
              <Cover cat={p.cat} className="aspect-[4/3] rounded-3xl" />
              <div className="mt-4 px-1">
                <div className="flex items-center gap-3"><Chip p={p} /><Meta p={p} /></div>
                <h3 className="mt-3 line-clamp-2 font-display text-lg font-semibold leading-snug text-slate-900 group-hover:text-indigo-700 dark:text-white dark:group-hover:text-indigo-300">{p.title}</h3>
                <p className="mt-2 line-clamp-2 text-sm text-slate-600 dark:text-slate-400">{p.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
