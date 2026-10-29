import { Check, X } from "lucide-react";
import { brand } from "@/content/en";
import { comparison } from "@/content/why-en";

function Cell({ v, good }: { v: string | boolean; good: boolean }) {
  if (typeof v === "string") return <span className={good ? "font-semibold text-slate-900 dark:text-white" : "text-slate-500 dark:text-slate-400"}>{v}</span>;
  // The word is the literal answer; the mark and color say whether that answer is the good one for the row
  // (for "Asks for your passwords", "No" is good).
  const word = v ? "Yes" : "No";
  return good
    ? <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 py-1 pe-3 ps-1 font-semibold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"><span className="grid h-5 w-5 place-items-center rounded-full bg-emerald-500 text-white"><Check aria-hidden className="h-3.5 w-3.5" /></span>{word}</span>
    : <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 py-1 pe-3 ps-1 font-medium text-rose-600 dark:bg-rose-500/15 dark:text-rose-300"><span className="grid h-5 w-5 place-items-center rounded-full bg-rose-500/15"><X aria-hidden className="h-3.5 w-3.5" /></span>{word}</span>;
}

// Offer C — "Comparison": a side-by-side table of ShopMajazi against a typical number or account seller.
// Direct and persuasive; the ShopMajazi column is highlighted.
export default function WhyC() {
  return (
    <section className="bg-white py-24 dark:bg-[#070B14]">
      <div className="mx-auto max-w-4xl px-6">
        <div className="text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">Why ShopMajazi</span>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl dark:text-white">Not all digital stores are equal</h2>
        </div>

        <div className="mt-12 overflow-x-auto">
          <table className="w-full min-w-[560px] border-separate border-spacing-0 text-sm">
            <thead>
              <tr>
                <th className="w-2/5 pb-4 text-start font-medium text-slate-500 dark:text-slate-400">&nbsp;</th>
                <th className="rounded-t-2xl bg-indigo-600 px-4 py-4 font-display text-base font-semibold text-white">{brand.name}</th>
                <th className="px-4 py-4 font-medium text-slate-500 dark:text-slate-400">Typical seller</th>
              </tr>
            </thead>
            <tbody>
              {comparison.map((row, i) => {
                const last = i === comparison.length - 1;
                const usGood = typeof row.us === "boolean" ? (row.invert ? !row.us : row.us) : true;
                const themGood = typeof row.them === "boolean" ? (row.invert ? !row.them : row.them) : false;
                return (
                  <tr key={row.feature}>
                    <td className="border-t border-slate-100 py-4 pe-4 font-medium text-slate-700 dark:border-white/10 dark:text-slate-300">{row.feature}</td>
                    <td className={`border-t border-indigo-500/20 bg-indigo-50 px-4 py-4 text-center dark:bg-indigo-500/10 ${last ? "rounded-b-2xl" : ""}`}><Cell v={row.us} good={usGood} /></td>
                    <td className="border-t border-slate-100 px-4 py-4 text-center dark:border-white/10"><Cell v={row.them} good={themGood} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
