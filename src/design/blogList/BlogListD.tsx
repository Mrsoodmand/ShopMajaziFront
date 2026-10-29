"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { blogCats, postHref } from "@/content/blog-en";
import { archive, countOf } from "@/content/blog-list-en";
import Cover from "../blog/Cover";
import { Meta } from "../blog/parts";
import { PageShell } from "../otp/parts";
import { catIcons } from "./parts";

// Page D — "Topic Shelves": a big cover banner for the newest article, a row of topic chips that jump down the page,
// then one swipeable shelf per topic with a "See all" link (to that topic's own page).
export default function BlogListD() {
  const [lead] = archive;

  return (
    <PageShell>
      <div className="mx-auto max-w-6xl px-6 py-10">
        <Link href={postHref(lead)} className="group relative block overflow-hidden rounded-[2rem]">
          <Cover cat={lead.cat} size="lg" corner className="absolute inset-0" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent" />
          <div className="relative flex min-h-[420px] flex-col justify-end p-8 sm:p-12">
            <span className="w-fit rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur">Newest · {blogCats.find((c) => c.id === lead.cat)!.label}</span>
            <h1 className="mt-4 max-w-3xl font-display text-3xl font-bold leading-tight text-white sm:text-5xl">{lead.title}</h1>
            <p className="mt-3 max-w-2xl text-white/80">{lead.excerpt}</p>
            <div className="mt-6 flex items-center gap-4">
              <Meta p={lead} light />
              <span className="flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition group-hover:gap-2.5">Read article<ArrowRight className="h-4 w-4 rtl:rotate-180" /></span>
            </div>
          </div>
        </Link>

        <nav aria-label="Topics" className="sticky top-16 z-20 -mx-6 mt-8 flex gap-2 overflow-x-auto bg-[#F5F6FB]/85 px-6 py-3 backdrop-blur [scrollbar-width:none] dark:bg-[#070B14]/85">
          {blogCats.map((c) => {
            const Icon = catIcons[c.id];
            return (
              <a key={c.id} href={`#shelf-${c.id}`} className="flex shrink-0 items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-700 ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:ring-indigo-300 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10 dark:hover:ring-indigo-400/50">
                <Icon className="h-4 w-4 text-indigo-500" />{c.label}<span className="text-xs text-slate-400">{countOf(c.id)}</span>
              </a>
            );
          })}
        </nav>

        <div className="mt-6 space-y-14 pb-10">
          {blogCats.map((c) => {
            const items = archive.filter((p) => p.cat === c.id);
            const Icon = catIcons[c.id];
            return (
              <section key={c.id} id={`shelf-${c.id}`} className="scroll-mt-36">
                <div className="flex items-center justify-between gap-4">
                  <h2 className="flex items-center gap-3 font-display text-2xl font-bold text-slate-900 dark:text-white">
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-600 text-white"><Icon className="h-5 w-5" /></span>{c.label}
                  </h2>
                  <Link href={`/blog/topic/${c.id}`} className="group flex items-center gap-1 text-sm font-semibold text-indigo-600 dark:text-indigo-400">See all {items.length}<ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5 rtl:rotate-180" /></Link>
                </div>
                <div className="-mx-6 mt-5 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-px-6 px-6 pb-2 [scrollbar-width:none]">
                  {items.map((p) => (
                    <Link key={p.slug} href={postHref(p)} className="group w-[78%] shrink-0 snap-start sm:w-[44%] lg:w-[31.5%]">
                      <Cover cat={p.cat} className="aspect-[16/10] rounded-3xl" />
                      <div className="mt-4 px-1">
                        <Meta p={p} />
                        <h3 className="mt-2 line-clamp-2 font-display text-lg font-semibold leading-snug text-slate-900 transition-colors group-hover:text-indigo-700 dark:text-white dark:group-hover:text-indigo-300">{p.title}</h3>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </PageShell>
  );
}
