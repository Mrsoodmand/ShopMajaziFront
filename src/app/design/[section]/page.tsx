import Link from "next/link";
import { notFound } from "next/navigation";
import { Maximize2 } from "lucide-react";
import { getSection } from "@/design/registry";
import { readDecisions } from "@/components/design/decisions";
import ChooseButton from "@/components/design/ChooseButton";

export const dynamic = "force-dynamic";

export default async function SectionOffers({ params, searchParams }: { params: Promise<{ section: string }>; searchParams: Promise<{ all?: string }> }) {
  const { section: id } = await params;
  const section = getSection(id);
  if (!section) notFound();
  const decisions = await readDecisions();
  const showAll = (await searchParams).all === "1";
  const offers = section.offers.filter((o) => showAll || !o.archived);
  const archivedCount = section.offers.filter((o) => o.archived).length;

  return (
    <main className="bg-slate-950">
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-white/10 bg-slate-950/90 px-6 py-3 text-white backdrop-blur">
        <Link href="/design" className="text-sm text-slate-400 hover:text-white">← All sections</Link>
        <span className="font-display font-semibold">{section.title} · {showAll ? `all ${offers.length} offers` : `shortlist (${offers.length})`}</span>
        <nav className="hidden items-center gap-1 sm:flex">
          {offers.map((o) => <a key={o.id} href={`#offer-${o.id}`} className="rounded-md px-2.5 py-1 text-sm text-slate-300 hover:bg-white/10">{o.id}</a>)}
          {archivedCount > 0 && (
            <Link href={showAll ? `/design/${section.id}` : `/design/${section.id}?all=1`} className="ms-2 rounded-md border border-white/15 px-2.5 py-1 text-xs text-slate-400 hover:text-white">
              {showAll ? "Shortlist only" : `Show archived (${archivedCount})`}
            </Link>
          )}
        </nav>
      </header>

      {offers.map(({ id: offerId, name, summary, Component, archived, overlay }) => (
        <article key={offerId} id={`offer-${offerId}`} className="scroll-mt-14 border-b-8 border-slate-950">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 px-6 py-4 text-white">
            <div>
              <div className="font-display text-lg font-semibold">Offer {offerId} — {name}{archived && <span className="ms-2 rounded bg-white/10 px-1.5 py-0.5 text-xs font-normal text-slate-400">archived</span>}</div>
              <div className="text-sm text-slate-400">{summary}</div>
            </div>
            <div className="flex items-center gap-2">
              <Link href={`/design/${section.id}/${offerId}`} className="flex items-center gap-1.5 rounded-full border border-white/20 px-3 py-1.5 text-xs hover:bg-white/10"><Maximize2 className="h-3.5 w-3.5" />Full page</Link>
              <ChooseButton section={section.id} offer={offerId} chosen={decisions[section.id]?.offer === offerId} />
            </div>
          </div>
          <Component />
          {section.context && <section.context overlay={overlay} />}
        </article>
      ))}
    </main>
  );
}
