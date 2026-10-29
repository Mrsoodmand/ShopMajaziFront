import { ratingSummary, reviews } from "@/content/reviews-en";
import { Heading, ReviewCard, Stars } from "./parts";

// Offer C — "Masonry Grid": reviews of different lengths packed into tidy columns, under a one-line rating summary.
export default function TestiC() {
  return (
    <section className="bg-white py-24 dark:bg-[#070B14]">
      <div className="mx-auto max-w-6xl px-6">
        <Heading kicker="Reviews" title="Don't take our word for it" />
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-sm text-slate-600 dark:text-slate-400">
          <Stars n={ratingSummary.average} />
          <span><span className="font-semibold text-slate-900 dark:text-white">{ratingSummary.average}</span> out of 5 from {ratingSummary.total.toLocaleString("en-US")} reviews</span>
        </div>
        <div className="mt-14 columns-1 gap-5 sm:columns-2 lg:columns-3">
          {reviews.slice(0, 9).map((r, i) => (
            <ReviewCard key={r.id} r={r} className={`mb-5 break-inside-avoid ${i % 4 === 0 ? "bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-500/10 dark:to-[#0E1424]" : ""}`} />
          ))}
        </div>
      </div>
    </section>
  );
}
