"use client";
import { useId, useMemo, useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { useMoney } from "@/lib/money";
import { GV_PRICE, gvNumbers, type GvNumber } from "@/content/google-voice-en";
import { PageShell } from "../otp/parts";
import { Faq, GvCheckout, Included, OrderView, useGv } from "./parts";
import { CitySelect, H1, H2, Label, Live, ring, Summary } from "./clean";

type Key = "number" | "city" | "state";
const cols: { key: Key; label: string }[] = [{ key: "number", label: "Number" }, { key: "city", label: "City" }, { key: "state", label: "State" }];

// Page I — "Number Table": a real data table, the most predictable pattern for keyboards and screen readers.
// Each row has a radio; column headers sort (and say how they're sorted). A city filter sits above, the order
// summary beside it.
export default function GvI() {
  const usd = useMoney().format;
  const gv = useGv();
  const [city, setCity] = useState("all");
  const [sort, setSort] = useState<{ key: Key; dir: 1 | -1 }>({ key: "city", dir: 1 });
  const cityId = useId(), name = useId();

  const rows = useMemo(() => {
    const out = gvNumbers.filter((n) => city === "all" || n.city === city);
    return [...out].sort((a: GvNumber, b: GvNumber) => a[sort.key].localeCompare(b[sort.key]) * sort.dir);
  }, [city, sort]);

  if (gv.order) return <PageShell><div className="px-6 py-14"><OrderView gv={gv} /></div></PageShell>;

  const sortBy = (key: Key) => setSort((s) => ({ key, dir: s.key === key ? (s.dir === 1 ? -1 : 1) : 1 }));

  return (
    <PageShell>
      <div className="mx-auto max-w-6xl px-6 pb-24 pt-14">
        <H1 sub={`Every Google Voice number we have, in one table. Each is ${usd(GV_PRICE)}, one time, and comes on its own Google account.`}>Available US numbers</H1>

        <div className="mt-12 grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[minmax(0,1fr)_340px]">
          <section aria-labelledby="pick">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <H2 id="pick">Choose a number</H2>
              <div className="w-full sm:w-64">
                <Label htmlFor={cityId}>Filter by city</Label>
                <div className="mt-2"><CitySelect id={cityId} value={city} onChange={setCity} /></div>
              </div>
            </div>
            <Live>{rows.length} numbers shown, sorted by {sort.key} {sort.dir === 1 ? "ascending" : "descending"}.</Live>

            <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-300 dark:border-white/15">
              <table className="w-full min-w-[520px] text-start text-[15px]">
                <caption className="sr-only">Google Voice numbers in stock. Choose one with the radio button in each row.</caption>
                <thead className="bg-slate-50 dark:bg-white/5">
                  <tr>
                    <th scope="col" className="w-14 px-4 py-3 text-start font-semibold text-slate-900 dark:text-white"><span className="sr-only">Choose</span></th>
                    {cols.map((c) => {
                      const active = sort.key === c.key;
                      const Icon = !active ? ArrowUpDown : sort.dir === 1 ? ArrowUp : ArrowDown;
                      return (
                        <th key={c.key} scope="col" aria-sort={active ? (sort.dir === 1 ? "ascending" : "descending") : "none"} className="px-4 py-3 text-start">
                          <button onClick={() => sortBy(c.key)} className={`-mx-2 flex items-center gap-1.5 rounded-lg px-2 py-1 font-semibold text-slate-900 hover:bg-slate-200/60 dark:text-white dark:hover:bg-white/10 ${ring}`}>
                            {c.label}<Icon aria-hidden className={`h-4 w-4 ${active ? "" : "text-slate-500"}`} />
                          </button>
                        </th>
                      );
                    })}
                    <th scope="col" className="px-4 py-3 text-end font-semibold text-slate-900 dark:text-white">Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-white/10">
                  {rows.map((n) => {
                    const on = gv.selected.id === n.id;
                    const id = `${name}-${n.id}`;
                    return (
                      <tr key={n.id} onClick={() => gv.setSelected(n)} className={`cursor-pointer transition-colors ${on ? "bg-emerald-50 dark:bg-emerald-500/10" : "hover:bg-slate-50 dark:hover:bg-white/5"}`}>
                        <td className="px-4 py-3.5">
                          <input type="radio" autoComplete="off" name={name} id={id} checked={on} onChange={() => gv.setSelected(n)} aria-describedby={`${id}-where`}
                            className={`h-5 w-5 accent-emerald-700 dark:accent-emerald-400 ${ring}`} />
                        </td>
                        <td className="px-4 py-3.5"><label htmlFor={id} className="cursor-pointer font-mono font-semibold text-slate-900 dark:text-white">{n.number}</label>{n.easy && <span className="ms-2 text-sm text-slate-600 dark:text-slate-400">Easy to remember</span>}</td>
                        <td id={`${id}-where`} className="px-4 py-3.5 text-slate-800 dark:text-slate-200">{n.city}</td>
                        <td className="px-4 py-3.5 text-slate-800 dark:text-slate-200">{n.state}</td>
                        <td className="px-4 py-3.5 text-end text-slate-800 dark:text-slate-200">{usd(GV_PRICE)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          <div className="lg:sticky lg:top-24 lg:self-start"><Summary gv={gv} /></div>
        </div>

        <div className="mt-20 grid gap-12 lg:grid-cols-2">
          <section aria-labelledby="included"><H2 id="included">What you get</H2><div className="mt-6"><Included /></div></section>
          <section aria-labelledby="faq"><H2 id="faq">Common questions</H2><div className="mt-6"><Faq /></div></section>
        </div>
      </div>
      <GvCheckout gv={gv} />
    </PageShell>
  );
}
