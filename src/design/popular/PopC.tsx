"use client";

import { useState } from "react";
import { LayoutGrid, Smartphone, Apple, Sparkles, Send, Users } from "lucide-react";
import { productCats, products, type Product } from "@/content/products-en";
import SlidingTabs, { type Tab } from "@/components/ui/SlidingTabs";
import { Heading, ProductCard } from "./parts";

// Offer C — "Tabbed Shelf": How to buy E's tab bar over a shelf of best-sellers for the chosen category.
export default function PopC() {
  const icons = { all: LayoutGrid, numbers: Smartphone, apple: Apple, subs: Sparkles, telegram: Send, social: Users };
  const tabs: Tab<"all" | Product["cat"]>[] = [{ id: "all", label: "Top picks", icon: icons.all }, ...productCats.map((c) => ({ id: c.id, label: c.label, icon: icons[c.id] }))];
  const [cat, setCat] = useState<"all" | Product["cat"]>("all");
  const shown = (cat === "all" ? [...products].sort((a, b) => b.sold - a.sold) : products.filter((p) => p.cat === cat)).slice(0, 4);

  return (
    <section className="relative overflow-hidden bg-[#F5F6FB] py-24 dark:bg-[#070B14]">
      <div aria-hidden className="pointer-events-none absolute -top-20 end-[10%] h-80 w-80 rounded-full bg-fuchsia-300/30 blur-[110px] dark:bg-fuchsia-600/15" />
      <div className="relative mx-auto max-w-7xl px-6">
        <div className="text-center"><Heading kicker="Popular now" title="What people are buying" /></div>
        <SlidingTabs tabs={tabs} value={cat} onChange={setCat} className="mx-auto mt-10 max-w-5xl" />
        <div key={cat} className="mt-8 grid animate-fade-up gap-5 [animation-duration:350ms] sm:grid-cols-2 lg:grid-cols-4">
          {shown.map((p) => <ProductCard key={p.id} p={p} />)}
        </div>
      </div>
    </section>
  );
}
