import { Plus } from "lucide-react";
import { seoIntro, seoSections } from "@/content/seo-en";
import Body from "./Body";

// Offer C — "Topic Accordion": every topic is a native <details> panel. Compact on the page, but the text is in the HTML for search engines.
// The first panel starts open. No JavaScript needed.
export default function SeoC() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 lg:grid-cols-[1fr_1.4fr]">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <span className="text-sm font-semibold uppercase tracking-widest text-indigo-600">Learn more</span>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">{seoIntro.heading}</h2>
          <p className="mt-5 leading-7 text-slate-600">{seoIntro.lead}</p>
        </div>

        <div className="divide-y divide-slate-200 border-y border-slate-200">
          {seoSections.map((s, i) => (
            <details key={s.id} id={`c-${s.id}`} open={i === 0} className="group py-2 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-4">
                <h3 className="font-display text-lg font-semibold text-slate-900 group-open:text-indigo-700">{s.heading}</h3>
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-slate-100 text-slate-600 transition group-open:rotate-45 group-open:bg-indigo-600 group-open:text-white">
                  <Plus className="h-4 w-4" />
                </span>
              </summary>
              <div className="pb-6 pe-12">
                <Body s={s} />
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
