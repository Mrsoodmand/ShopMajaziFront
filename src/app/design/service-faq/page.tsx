import Link from "next/link";
import { readDecisions } from "@/components/design/decisions";
import Previews from "./Previews";

export const dynamic = "force-dynamic";

// The service pages' FAQ: the current design and five new offers (design/service/faqOffers.tsx), each on the real
// questions of the page picked above. "Choose this" saves the pick (decisions.json › service-faq).
export default async function ServiceFaqPreview() {
  const decisions = await readDecisions();
  const chosen = decisions["service-faq"]?.offer ?? "current";
  return (
    <main className="min-h-screen bg-[#F5F6FB] dark:bg-[#070B14]">
      <header dir="ltr" className="sticky top-0 z-50 flex items-center justify-between border-b border-white/10 bg-slate-950/95 px-6 py-3 text-white backdrop-blur">
        <Link href="/design" className="text-sm text-slate-400 hover:text-white">← All sections</Link>
        <span className="font-display font-semibold">Service FAQ · 5 new offers</span>
        <span className="text-xs text-slate-400">Chosen: {chosen}</span>
      </header>
      <Previews chosen={chosen} />
    </main>
  );
}
