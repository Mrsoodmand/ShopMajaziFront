import Link from "next/link";
import { sections } from "@/design/registry";
import { readDecisions } from "@/components/design/decisions";

export const dynamic = "force-dynamic";

// Temporary home: stitches together the chosen offer of each designed section.
// A chosen variant (e.g. the arrow style for How to buy) stands in for its parent section's offer,
// and a chosen header replaces the hero's built-in nav.
export default async function Home() {
  const decisions = await readDecisions();
  const pick = (id: string) => sections.find((s) => s.id === id)?.offers.find((o) => o.id === decisions[id]?.offer);
  const header = pick("header");

  const chosen = sections
    .filter((s) => !s.variantOf && !s.kind && pick(s.id)) // whole pages and the logo never join the home page
    .map((s) => {
      const variant = sections.find((v) => v.variantOf === s.id && pick(v.id));
      return { key: s.id, Component: (variant ? pick(variant.id) : pick(s.id))!.Component };
    });

  if (chosen.length === 0)
    return (
      <main className="grid min-h-screen place-items-center bg-slate-950 text-white">
        <div className="text-center">
          <h1 className="font-display text-3xl font-bold">No sections chosen yet</h1>
          <Link href="/design" className="mt-4 inline-block text-slate-400 underline underline-offset-4">Go to design offers →</Link>
        </div>
      </main>
    );

  return (
    <main>
      {chosen.map(({ key, Component }) =>
        key === "hero" && header ? <Component key={key} bare={header.overlay ? "overlay" : "flow"} /> : <Component key={key} />,
      )}
    </main>
  );
}
