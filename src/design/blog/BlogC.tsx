"use client";

import { useSwipeRow } from "@/components/ui/useSwipeRow";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { posts as placeholder } from "@/content/blog-en";
import { ViewAll } from "./parts";
import { useBlogPosts } from "./live";
import { PostCard } from "../blogList/parts";
import { useT } from "@/i18n/client";

// Offer C — "Carousel": a row of article cards with prev / next arrows. Drag it with the mouse on desktop;
// on phones it's a native swipe. Shows more posts in little vertical space. The cards are the site's PostCard
// (blog card A, "Framed"); the row keeps room above and below for their hover lift and shadow.
export default function BlogC() {
  const tx = useT();
  const posts = useBlogPosts(placeholder);
  const { track, handlers, dragging, edges, nudge } = useSwipeRow();

  if (!posts.length) return null;

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

        <div ref={track} {...handlers}
          className={`-mx-6 -mb-8 mt-8 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-px-6 px-6 pb-10 pt-2 select-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${dragging ? "cursor-grabbing [&_a]:cursor-grabbing" : "cursor-grab"}`}>
          {posts.map((p) => (
            <div key={p.slug} className="w-[82%] shrink-0 snap-start sm:w-[46%] lg:w-[31.5%]"><PostCard p={p} /></div>
          ))}
        </div>
      </div>
    </section>
  );
}
