"use client";

import { useState } from "react";
import { ChevronDown, Clock } from "lucide-react";
import { seoIntro, seoSections } from "@/content/seo-en";
import Body from "./Body";

// Offer A — "Read More Article": one calm reading column. Shows the start, fades out, and expands on click.
// The full text is always in the HTML, so search engines index all of it.
export default function SeoA() {
  const [open, setOpen] = useState(false);
  return (
    <section className="bg-white py-24">
      <article className="mx-auto max-w-3xl px-6">
        <div className="flex items-center gap-3 text-xs text-slate-500">
          <span className="rounded-full bg-slate-100 px-2.5 py-1">{seoIntro.updated}</span>
          <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{seoIntro.readTime}</span>
        </div>
        <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">{seoIntro.heading}</h2>
        <p className="mt-5 text-lg leading-8 text-slate-700">{seoIntro.lead}</p>

        <div className={`relative overflow-hidden transition-[max-height] duration-700 ease-in-out ${open ? "max-h-[6000px]" : "max-h-[420px]"}`}>
          {seoSections.map((s) => (
            <section key={s.id} id={`a-${s.id}`} className="mt-10 scroll-mt-20">
              <h3 className="font-display text-2xl font-semibold text-slate-900">{s.heading}</h3>
              <Body s={s} />
            </section>
          ))}
          {!open && <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-white to-transparent" />}
        </div>

        <div className="mt-6 flex justify-center">
          <button onClick={() => setOpen((o) => !o)} aria-expanded={open} className="flex items-center gap-2 rounded-full border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-800 hover:border-slate-400">
            {open ? "Show less" : "Read the full guide"}<ChevronDown className={`h-4 w-4 transition ${open ? "rotate-180" : ""}`} />
          </button>
        </div>
      </article>
    </section>
  );
}
