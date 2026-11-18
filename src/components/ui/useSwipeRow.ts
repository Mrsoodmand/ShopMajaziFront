"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// A horizontally scrolling, snapping row of cards (the home blog carousel, blog offer C, and the service pages'
// blog and How to use rows). Touch swipes natively; with a mouse the row can be dragged: it follows the pointer 1:1
// and on release eases, with the throw's momentum, onto the card it would land on. Works left to right and right to
// left. Returns a ref for the scrolling element, pointer handlers to spread on it, `edges` (at the start / end, for
// arrow buttons), `index` (the card lined up with the snap line, for dots), `nudge` (one card back or on) and `go`
// (to a card). Cards are the row's direct children.
export function useSwipeRow<T extends HTMLElement = HTMLDivElement>() {
  const track = useRef<T>(null);
  const [edges, setEdges] = useState({ start: true, end: false });
  const [index, setIndex] = useState(0);
  const [count, setCount] = useState(0);

  // Scroll positions where each card lines up with the snap line (the row's inner padding).
  const snapPoints = useCallback((el: HTMLElement) => {
    const pad = parseFloat(getComputedStyle(el).scrollPaddingInlineStart) || 0;
    const box = el.getBoundingClientRect();
    const rtl = getComputedStyle(el).direction === "rtl";
    const max = el.scrollWidth - el.clientWidth;
    return (Array.from(el.children) as HTMLElement[]).map((card) => {
      const r = card.getBoundingClientRect();
      const p = el.scrollLeft + (rtl ? r.right - (box.right - pad) : r.left - (box.left + pad));
      return rtl ? Math.max(-max, Math.min(0, p)) : Math.max(0, Math.min(max, p));
    });
  }, []);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    let frame = 0;
    const measure = () => {
      const max = el.scrollWidth - el.clientWidth;
      const x = Math.abs(el.scrollLeft);
      setEdges({ start: x < 4, end: x > max - 4 });
      const pts = snapPoints(el);
      setCount(pts.length);
      // At the far end the last card counts as current even if it can't reach the snap line.
      if (x > max - 4) setIndex(pts.length - 1);
      else setIndex(pts.reduce((b, p, i) => (Math.abs(p - el.scrollLeft) < Math.abs(pts[b] - el.scrollLeft) ? i : b), 0));
    };
    // Scrolling is throttled to one measure per frame; the first one runs straight away (no frame needed, so the
    // dots and arrows are right even in a tab that isn't painting yet).
    const on = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(measure); };
    measure();
    el.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    const ro = new ResizeObserver(on);
    ro.observe(el);
    return () => { cancelAnimationFrame(frame); el.removeEventListener("scroll", on); window.removeEventListener("resize", on); ro.disconnect(); };
  }, [snapPoints]);

  const drag = useRef({ down: false, startX: 0, startLeft: 0, moved: false, lastX: 0, lastT: 0, v: 0, frame: 0, target: 0 });
  const [dragging, setDragging] = useState(false);
  useEffect(() => () => cancelAnimationFrame(drag.current.frame), []);

  const restoreSnap = (el: HTMLElement) => { el.style.scrollBehavior = ""; el.style.scrollSnapType = ""; };

  // One eased motion from the release point to the card where the throw would have come to rest. Then CSS snapping
  // takes over again.
  const glide = (el: HTMLElement) => {
    const d = drag.current;
    const from = el.scrollLeft;
    const projected = from - d.v * 16 * (0.94 / 0.06);
    const points = snapPoints(el);
    if (!points.length) { restoreSnap(el); return; }
    const to = points.reduce((best, p) => (Math.abs(p - projected) < Math.abs(best - projected) ? p : best));
    const dist = Math.abs(to - from);
    if (dist < 1) { restoreSnap(el); return; }
    const duration = Math.min(750, 280 + dist * 0.6);
    const t0 = performance.now();
    const ease = (t: number) => 1 - Math.pow(1 - t, 3);
    const step = (now: number) => {
      const t = Math.min(1, (now - t0) / duration);
      el.scrollLeft = from + (to - from) * ease(t);
      if (t < 1) d.frame = requestAnimationFrame(step);
      else { d.frame = 0; restoreSnap(el); }
    };
    d.frame = requestAnimationFrame(step);
  };

  const onPointerDown = (e: React.PointerEvent<T>) => {
    if (e.pointerType !== "mouse" || e.button !== 0) return;
    const el = e.currentTarget;
    if (el.scrollWidth <= el.clientWidth + 1) return; // nothing to scroll (e.g. the grid layout on wide screens)
    cancelAnimationFrame(drag.current.frame);
    drag.current = { down: true, startX: e.clientX, startLeft: el.scrollLeft, moved: false, lastX: e.clientX, lastT: performance.now(), v: 0, frame: 0, target: el.scrollLeft };
    el.style.scrollSnapType = "none";
    el.style.scrollBehavior = "auto";
  };
  const onPointerMove = (e: React.PointerEvent<T>) => {
    const d = drag.current;
    if (!d.down) return;
    const dx = e.clientX - d.startX;
    if (!d.moved && Math.abs(dx) > 5) {
      d.moved = true;
      setDragging(true);
      try { e.currentTarget.setPointerCapture(e.pointerId); } catch {}
    }
    if (!d.moved) return;
    const now = performance.now(), dt = Math.max(1, now - d.lastT);
    d.v = 0.8 * ((e.clientX - d.lastX) / dt) + 0.2 * d.v;
    d.lastX = e.clientX; d.lastT = now;
    d.target = d.startLeft - dx;
    if (!d.frame) {
      const el = e.currentTarget;
      d.frame = requestAnimationFrame(() => { el.scrollLeft = drag.current.target; drag.current.frame = 0; });
    }
  };
  const endDrag = (e: React.PointerEvent<T>) => {
    const d = drag.current;
    if (!d.down) return;
    d.down = false;
    setDragging(false);
    const el = e.currentTarget;
    cancelAnimationFrame(d.frame);
    d.frame = 0;
    if (!d.moved) { restoreSnap(el); return; }
    el.scrollLeft = d.target;
    if (performance.now() - d.lastT > 80) d.v = 0;
    glide(el);
  };
  // A drag that moved more than a few pixels doesn't count as a click on the card.
  const onClickCapture = (e: React.MouseEvent) => {
    if (drag.current.moved) { e.preventDefault(); e.stopPropagation(); drag.current.moved = false; }
  };

  const go = (i: number) => {
    const el = track.current;
    if (!el) return;
    const pts = snapPoints(el);
    if (pts[i] === undefined) return;
    el.scrollTo({ left: pts[i], behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  };
  const nudge = (dir: 1 | -1) => go(Math.max(0, Math.min(count - 1, index + dir)));

  const handlers = {
    onPointerDown, onPointerMove, onPointerUp: endDrag, onPointerCancel: endDrag, onPointerLeave: endDrag,
    onClickCapture, onDragStart: (e: React.DragEvent) => e.preventDefault(),
  };
  return { track, handlers, dragging, edges, index, count, nudge, go };
}
