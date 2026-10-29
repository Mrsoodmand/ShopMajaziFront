import { ArrowRight, BadgeCheck, Lock, RefreshCcw, Quote } from "lucide-react";
import { brand, services, stats } from "@/content/en";

// Offer E — "Editorial Trust": calm, premium, serif headline. Leads with credibility (stats, guarantees, a real review).
export default function HeroE() {
  return (
    <section className="bg-[#FBFAF7] text-[#1C1917]">
      <nav className="mx-auto flex max-w-7xl items-center justify-between border-b border-stone-200 px-6 py-5">
        <span className="font-serif text-2xl">{brand.name}</span>
        <div className="hidden gap-8 text-sm text-stone-600 md:flex">
          <a href="#">Catalog</a><a href="#">Guarantee</a><a href="#">Reviews</a><a href="#">Journal</a>
        </div>
        <a href="#" className="text-sm font-medium underline decoration-stone-300 underline-offset-4">Sign in →</a>
      </nav>

      <div className="mx-auto grid max-w-7xl gap-14 px-6 py-16 lg:grid-cols-12 lg:py-24">
        <div className="lg:col-span-7">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">Since 2018 · Trusted by 380,000 people</p>
          <h1 className="mt-6 font-serif text-5xl leading-[1.02] sm:text-7xl">
            Digital services,<br /><em className="text-[#B45309]">done properly.</em>
          </h1>
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-stone-600">
            Verified virtual numbers, permanent Google Voice lines, genuine Apple IDs and premium subscriptions — delivered instantly, backed by a written refund guarantee.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-6">
            <a href="#" className="flex items-center gap-3 rounded-none bg-[#1C1917] px-7 py-4 text-sm font-medium text-white hover:bg-black">
              Explore the catalog <ArrowRight className="h-4 w-4" />
            </a>
            <a href="#" className="text-sm font-medium text-stone-700 underline decoration-stone-300 underline-offset-4">How our guarantee works</a>
          </div>

          <dl className="mt-16 grid grid-cols-2 gap-y-8 border-t border-stone-200 pt-8 sm:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label}><dt className="text-xs text-stone-500">{s.label}</dt><dd className="mt-1 font-serif text-3xl">{s.value}</dd></div>
            ))}
          </dl>
        </div>

        <aside className="lg:col-span-5">
          <div className="border border-stone-200 bg-white">
            <div className="border-b border-stone-200 px-6 py-4 text-xs font-semibold uppercase tracking-[0.15em] text-stone-500">Most requested</div>
            <ul className="divide-y divide-stone-100">
              {services.slice(0, 5).map((s, i) => (
                <li key={s.id}>
                  <a href="#" className="group flex items-center gap-4 px-6 py-4 hover:bg-stone-50">
                    <span className="font-serif text-lg text-stone-400">0{i + 1}</span>
                    <span className="flex-1">
                      <span className="block font-medium">{s.name}</span>
                      <span className="block text-sm text-stone-500">{s.short}</span>
                    </span>
                    <span className="text-sm text-stone-500">from <span className="font-semibold text-stone-900">{s.from}</span></span>
                    <ArrowRight className="h-4 w-4 text-stone-300 transition group-hover:translate-x-1 group-hover:text-stone-900" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <figure className="mt-6 border border-stone-200 bg-[#F3EFE7] p-6">
            <Quote className="h-5 w-5 text-[#B45309]" />
            <blockquote className="mt-3 font-serif text-xl leading-snug">“Got my Google Voice number in under a minute and it's still working two years later.”</blockquote>
            <figcaption className="mt-4 text-sm text-stone-600">Sara K. · verified buyer</figcaption>
          </figure>

          <div className="mt-6 grid grid-cols-3 gap-3 text-xs text-stone-600">
            {[[BadgeCheck, "Verified stock"], [RefreshCcw, "Refund guarantee"], [Lock, "Private delivery"]].map(([Icon, t]) => {
              const I = Icon as typeof Lock;
              return <div key={t as string} className="flex flex-col items-center gap-2 border border-stone-200 bg-white py-4 text-center"><I className="h-5 w-5 text-stone-800" />{t as string}</div>;
            })}
          </div>
        </aside>
      </div>
    </section>
  );
}
