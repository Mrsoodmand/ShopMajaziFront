import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { products } from "@/content/products-en";
import { Heading, ProductCard } from "./parts";

// Offer A — "Product Grid": eight best-sellers as shop cards (icon, badge, rating, price with discount, delivery
// time and a Buy button). Classic store layout; cards lift on hover.
export default function PopA() {
  const picks = ["wa-de", "gpt", "tg-premium", "aid-custom", "gv-ny", "spotify", "ig-followers", "aid-usa"].map((id) => products.find((p) => p.id === id)!);
  return (
    <section className="bg-white py-24 dark:bg-[#070B14]">
      <div className="mx-auto max-w-7xl px-6">
        <Heading kicker="Popular now" title="Best-sellers this week"
          action={<Link href="/services" className="group flex items-center gap-1.5 rounded-full border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-800 hover:border-slate-400 dark:border-white/15 dark:text-slate-200 dark:hover:border-white/30">All products<ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5 rtl:rotate-180" /></Link>} />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {picks.map((p) => <ProductCard key={p.id} p={p} />)}
        </div>
      </div>
    </section>
  );
}
