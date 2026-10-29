import { localePath, type Locale } from "@/i18n/config";
import { Plate, toman } from "./Lexicon";
import { STATE_NAMES, US_GRID } from "@/lib/us-states";

// The four plates of the Lexicon. Colour is printed here and nowhere else on the page.

const INKS = ["var(--vermilion)", "var(--ultramarine)", "var(--emerald)", "var(--chrome)", "var(--madder)", "var(--violet)", "var(--sepia)"];
// Chrome yellow is light, so its specimen sets ink-black type; the rest set paper-white.
const onInk = (i: number) => (i === 3 ? "var(--ink)" : "#fbf7ee");

// Plate I: seven specimen codes, one per app, laid out like specimens round a central one.
export function PlateSpecimens({ items }: { items: { name: string; from?: number }[] }) {
  const codes = ["48 213", "70 291", "51 806", "G-583 201", "662 914", "31 047", "924 118"];
  const spots = ["col-span-2 row-span-2", "", "", "", "", "", ""];
  return (
    <Plate
      numeral="I" title="Specimens of the code"
      caption="Codes shown are specimens, not real messages. Prices are the lowest in stock today."
      legend={
        <ol className="space-y-0.5">
          {items.map((it, i) => (
            <li key={it.name} className="lx-leader">
              <span className="whitespace-nowrap"><span className="lx-num me-1.5 inline-block w-4">{i + 1}.</span><span className="italic">{it.name}</span></span>
              <span className="lx-dots" aria-hidden />
              <span className="lx-num whitespace-nowrap">{it.from ? <>from <b>{toman(it.from)}</b></> : "—"}</span>
            </li>
          ))}
        </ol>
      }
    >
      <div className="grid grid-cols-3 grid-rows-[repeat(4,minmax(5.25rem,auto))] gap-2">
        {items.map((it, i) => (
          <div key={it.name} className={`lx-hatch relative flex flex-col justify-end p-2.5 pt-6 ${spots[i]}`} style={{ backgroundColor: INKS[i], color: onInk(i) }}>
            <span className="absolute start-2.5 top-1.5 text-[0.8rem] font-bold">{i + 1}</span>
            <span className={`lx-num font-bold leading-none ${i === 0 ? "text-[clamp(2rem,4vw,2.75rem)]" : "text-[1.05rem]"}`}>{codes[i]}</span>
            <span className={`mt-1 truncate italic ${i === 0 ? "text-[1.05rem]" : "text-[0.8rem]"}`}>{it.name}</span>
          </div>
        ))}
      </div>
    </Plate>
  );
}

// Plate II: the United States as a grid of states, printed by how many Google Voice numbers each has in stock.
const GRID = US_GRID;
export { STATE_NAMES };

const BANDS = [
  { min: 10, ink: "var(--ultramarine)", label: "10 or more" },
  { min: 3, ink: "var(--emerald)", label: "3 to 9" },
  { min: 1, ink: "var(--chrome)", label: "1 or 2" },
];
const band = (n: number) => BANDS.find((b) => n >= b.min);

export function PlateStates({ counts, locale, unavailable }: { counts: Record<string, number>; locale: Locale; unavailable?: boolean }) {
  return (
    <Plate
      numeral="II" title="The States, by numbers in stock"
      caption={unavailable ? "Stock could not be read just now; the order page always shows it." : "Read live from the shop. Choose a printed state to see its numbers."}
      legend={
        <ul className="flex flex-wrap gap-x-4 gap-y-1">
          {BANDS.map((b) => (
            <li key={b.label} className="inline-flex items-center gap-1.5">
              <span aria-hidden className="lx-hatch inline-block h-3.5 w-5 border border-[var(--ink)]" style={{ backgroundColor: b.ink }} />{b.label}
            </li>
          ))}
          <li className="inline-flex items-center gap-1.5"><span aria-hidden className="lx-hatch-empty inline-block h-3.5 w-5 border border-[var(--ink)]" />none today</li>
        </ul>
      }
    >
      <ul className="grid grid-cols-11 gap-[3px]" aria-label="States with Google Voice numbers in stock">
        {GRID.map(([st, r, c]) => {
          const n = counts[st] ?? 0;
          const b = band(n);
          const style = { gridRow: r + 1, gridColumn: c + 1, ...(b ? { backgroundColor: b.ink } : {}) };
          const ink = b && b.min !== 1 ? "#fbf7ee" : "var(--ink)";
          const label = `${STATE_NAMES[st]}: ${n === 0 ? "none in stock" : `${n} ${n === 1 ? "number" : "numbers"}`}`;
          return (
            <li key={st} style={style} className={`aspect-square ${b ? "lx-hatch" : "lx-hatch-empty"}`}>
              {n > 0 ? (
                <a href={localePath(`/google-voice?state=${st}`, locale)} aria-label={label} title={label}
                  className="flex h-full w-full items-center justify-center text-[clamp(0.55rem,1vw,0.72rem)] font-bold no-underline hover:outline hover:outline-2 hover:outline-[var(--ink)]" style={{ color: ink }}>
                  {st}
                </a>
              ) : (
                <span aria-label={label} className="flex h-full w-full items-center justify-center text-[clamp(0.55rem,1vw,0.72rem)] text-[var(--ink-3)]">{st}</span>
              )}
            </li>
          );
        })}
      </ul>
    </Plate>
  );
}

// Plate III: a month of days, printed in the three rental periods.
export function PlateCalendar() {
  const periods = [
    { days: 7, ink: "var(--vermilion)", label: "1 week", on: "#fbf7ee" },
    { days: 14, ink: "var(--chrome)", label: "2 weeks", on: "var(--ink)" },
    { days: 30, ink: "var(--ultramarine)", label: "1 month", on: "#fbf7ee" },
  ];
  const periodOf = (d: number) => periods.find((p) => d <= p.days)!;
  return (
    <Plate
      numeral="III" title="The rental, day by day"
      caption="Extend before the last day and the same number carries on."
      legend={
        <ol className="space-y-0.5">
          {periods.map((p, i) => (
            <li key={p.label} className="lx-leader">
              <span className="inline-flex items-center gap-1.5"><span aria-hidden className="lx-hatch inline-block h-3.5 w-5 border border-[var(--ink)]" style={{ backgroundColor: p.ink }} /><span className="me-1">{i + 1}.</span>{p.label}</span>
              <span className="lx-dots" aria-hidden />
              <span className="lx-num">days {i === 0 ? 1 : periods[i - 1].days + 1}–{p.days}</span>
            </li>
          ))}
        </ol>
      }
    >
      <ol className="grid grid-cols-7 gap-[3px]" aria-label="Thirty days of a one-month rental">
        {Array.from({ length: 30 }, (_, i) => i + 1).map((d) => {
          const p = periodOf(d);
          return (
            <li key={d} className="lx-hatch lx-num flex aspect-square items-start justify-start p-1 text-[0.8rem] font-bold" style={{ backgroundColor: p.ink, color: p.on }}>
              {d}
            </li>
          );
        })}
        <li className="col-span-5 flex items-center ps-2 text-[0.85rem] italic text-[var(--ink-3)]">extend, or the number is released</li>
      </ol>
    </Plate>
  );
}

// Plate IV: the two kinds of Apple ID as delivered, shown as specimens with their values masked.
export function PlateApple() {
  const kinds = [
    { name: "Ready", ink: "var(--emerald)", when: "delivered at once", email: "r•••••@icloud.com", who: "Name and birthday provided" },
    { name: "Custom", ink: "var(--madder)", when: "about ten minutes", email: "your own email", who: "Your name and birthday" },
  ];
  return (
    <Plate
      numeral="IV" title="The Apple ID, as delivered"
      caption="Specimens with the values masked. Yours appear in full on your order page."
      legend={<p><span className="me-1">1.</span><span className="italic">Ready</span>, United States. <span className="ms-2 me-1">2.</span><span className="italic">Custom</span>, United States.</p>}
    >
      <div className="grid gap-3">
        {kinds.map((k, i) => (
          <dl key={k.name} className="lx-hatch relative p-4 text-[#fbf7ee]" style={{ backgroundColor: k.ink }}>
            <span className="absolute end-3 top-2 text-[0.8rem] font-bold">{i + 1}</span>
            <dt className="sr-only">Kind</dt>
            <dd className="text-[1.5rem] font-bold leading-none">{k.name} <span className="text-[0.95rem] font-normal italic">· {k.when}</span></dd>
            <div className="mt-3 grid grid-cols-[7rem_minmax(0,1fr)] gap-y-1 text-[0.9rem]">
              <dt className="italic opacity-90">Apple ID</dt><dd className="truncate">{k.email}</dd>
              <dt className="italic opacity-90">Password</dt><dd>••••••••••</dd>
              <dt className="italic opacity-90">Born</dt><dd>{k.who}</dd>
              <dt className="italic opacity-90">Answers</dt><dd>three security answers</dd>
            </div>
          </dl>
        ))}
      </div>
    </Plate>
  );
}
