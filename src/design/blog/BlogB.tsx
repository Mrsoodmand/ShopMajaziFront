import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { postHref, posts } from "@/content/blog-en";
import Cover from "./Cover";
import { Chip, Heading, Meta } from "./parts";

// Offer B — "Card Grid": three classic article cards (cover, category, title, excerpt, date). Simple and scannable.
export default function BlogB() {
  return (
    <section className="relative overflow-hidden bg-[#F5F6FB] py-24 dark:bg-[#070B14]">
      <div aria-hidden className="pointer-events-none absolute -top-24 end-[10%] h-80 w-80 rounded-full bg-fuchsia-300/30 blur-[110px] dark:bg-fuchsia-600/15" />
      <div className="relative mx-auto max-w-6xl px-6">
        <Heading kicker="From the blog" title="Learn before you buy" />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {posts.slice(0, 3).map((p) => (
            <Link key={p.slug} href={postHref(p)} className="group flex flex-col overflow-hidden rounded-3xl bg-white ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-100 dark:bg-[#0E1424] dark:ring-white/10 dark:hover:shadow-black/40">
              <Cover cat={p.cat} className="aspect-[16/10]" />
              <div className="flex flex-1 flex-col p-6">
                <div className="flex items-center justify-between"><Chip p={p} /><Meta p={p} /></div>
                <h3 className="mt-4 font-display text-lg font-semibold leading-snug text-slate-900 dark:text-white">{p.title}</h3>
                <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600 dark:text-slate-400">{p.excerpt}</p>
                <span className="mt-auto flex items-center gap-1.5 pt-6 text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                  Read article<ArrowRight className="h-4 w-4 transition group-hover:translate-x-1 rtl:rotate-180" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
