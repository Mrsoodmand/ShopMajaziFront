"use client";

import { useEffect, useState } from "react";
import { List } from "lucide-react";
import { seoIntro, seoSections } from "@/content/seo-en";
import Body from "./Body";
import { useT } from "@/i18n/client";

// Offer B — "Guide with Contents": a sticky table of contents on the side that highlights where you are, article on the other side.
// Good for long text: visitors jump to the part they care about, and the anchor links help search results show sitelinks.
export default function SeoB() {
  const t = useT();
  const [current, setCurrent] = useState(t.tr(seoSections)[0].id);
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setCurrent(e.target.id)),
      { rootMargin: "-30% 0px -60% 0px" },
    );
    t.tr(seoSections).forEach((s) => { const el = document.getElementById(`b-${s.id}`); if (el) io.observe(el); });
    return () => io.disconnect();
  }, []);

  return (
    <section className="bg-[#F5F6FB] py-24 dark:bg-[#070B14]">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 lg:grid-cols-[260px_1fr]">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 dark:bg-[#0E1424] dark:ring-white/10">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400"><List className="h-4 w-4" />{t("On this page")}</div>
            <nav className="mt-4 space-y-1 border-s border-slate-200 dark:border-white/10">
              {t.tr(seoSections).map((s) => {
                const on = `b-${s.id}` === current;
                return (
                  <a key={s.id} href={`#b-${s.id}`} className={`-ms-px block border-s-2 py-1.5 ps-4 text-sm transition ${on ? "border-indigo-600 font-medium text-indigo-700 dark:border-indigo-400 dark:text-indigo-300" : "border-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"}`}>
                    {s.heading}
                  </a>
                );
              })}
            </nav>
          </div>
        </aside>

        <article className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200 sm:p-12 dark:bg-[#0E1424] dark:ring-white/10">
          <span className="text-xs font-semibold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">{t("Guide ·")}{" "}{t.tr(seoIntro).readTime}</span>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">{t.tr(seoIntro).heading}</h2>
          <p className="mt-5 text-lg leading-8 text-slate-700 dark:text-slate-300">{t.tr(seoIntro).lead}</p>
          {t.tr(seoSections).map((s) => (
            <section key={s.id} id={`b-${s.id}`} className="mt-12 scroll-mt-24 border-t border-slate-100 pt-10 dark:border-white/10">
              <h3 className="font-display text-2xl font-semibold text-slate-900 dark:text-white">{s.heading}</h3>
              <Body s={s} />
            </section>
          ))}
        </article>
      </div>
    </section>
  );
}
