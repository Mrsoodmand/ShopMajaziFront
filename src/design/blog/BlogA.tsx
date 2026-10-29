import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { postHref, posts } from "@/content/blog-en";
import Cover from "./Cover";
import { Chip, Heading, Meta } from "./parts";

// Offer A — "Featured + List": the newest article large on the left, the next four as a compact list on the right.
export default function BlogA() {
  const [lead, ...rest] = posts;
  return (
    <section className="bg-white py-24 dark:bg-[#070B14]">
      <div className="mx-auto max-w-6xl px-6">
        <Heading kicker="Blog" title="Guides and news from our team" />
        <div className="mt-12 grid gap-8 lg:grid-cols-[1.3fr_1fr]">
          <Link href={postHref(lead)} className="group flex flex-col overflow-hidden rounded-3xl bg-slate-50 ring-1 ring-slate-200 transition hover:shadow-xl dark:bg-[#0E1424] dark:ring-white/10 dark:hover:shadow-black/40">
            <Cover cat={lead.cat} size="lg" className="aspect-[16/9]" />
            <div className="flex flex-1 flex-col p-7">
              <Chip p={lead} />
              <h3 className="mt-4 font-display text-2xl font-semibold leading-snug text-slate-900 group-hover:text-indigo-700 dark:text-white dark:group-hover:text-indigo-300">{lead.title}</h3>
              <p className="mt-3 text-slate-600 dark:text-slate-400">{lead.excerpt}</p>
              <div className="mt-auto pt-6"><Meta p={lead} /></div>
            </div>
          </Link>

          <ul className="divide-y divide-slate-200 dark:divide-white/10">
            {rest.slice(0, 4).map((p) => (
              <li key={p.slug}>
                <Link href={postHref(p)} className="group flex gap-4 py-5 first:pt-0">
                  <Cover cat={p.cat} size="sm" className="h-20 w-24 shrink-0 rounded-2xl" />
                  <div className="min-w-0 flex-1">
                    <Chip p={p} />
                    <h3 className="mt-2 line-clamp-2 font-semibold leading-snug text-slate-900 group-hover:text-indigo-700 dark:text-white dark:group-hover:text-indigo-300">{p.title}</h3>
                    <div className="mt-2"><Meta p={p} /></div>
                  </div>
                  <ArrowUpRight className="h-5 w-5 shrink-0 text-slate-300 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-indigo-600 dark:text-slate-600 dark:group-hover:text-indigo-400" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
