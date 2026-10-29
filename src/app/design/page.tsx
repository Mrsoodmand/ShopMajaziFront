import Link from "next/link";
import { sections, upcoming } from "@/design/registry";
import { readDecisions } from "@/components/design/decisions";

export const dynamic = "force-dynamic";

export default async function DesignIndex() {
  const decisions = await readDecisions();
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-white">
      <div className="mx-auto max-w-4xl">
        <h1 className="font-display text-4xl font-bold">ShopMajazi · Design offers</h1>
        <p className="mt-2 text-slate-400">Each section of the new site gets several offers. Pick one per section; all offers stay saved.</p>

        <div className="mt-10 space-y-3">
          {sections.map((s) => {
            const d = decisions[s.id];
            const chosen = s.offers.find((o) => o.id === d?.offer);
            return (
              <Link key={s.id} href={`/design/${s.id}`} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-5 hover:border-white/30">
                <div>
                  <div className="font-display text-xl font-semibold">{s.title}</div>
                  <div className="text-sm text-slate-400">{s.offers.length} offers</div>
                </div>
                {chosen
                  ? <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-sm text-emerald-300">Chosen: {chosen.id} · {chosen.name}</span>
                  : <span className="rounded-full bg-amber-500/15 px-3 py-1 text-sm text-amber-300">Awaiting choice</span>}
              </Link>
            );
          })}
          {upcoming.map((u) => (
            <div key={u} className="flex items-center justify-between rounded-2xl border border-dashed border-white/10 p-5 text-slate-500">
              <span className="font-display text-lg">{u}</span><span className="text-sm">Not started</span>
            </div>
          ))}
        </div>

        <Link href="/" className="mt-10 inline-block text-sm text-slate-400 underline underline-offset-4">Preview home page with chosen sections →</Link>
      </div>
    </main>
  );
}
