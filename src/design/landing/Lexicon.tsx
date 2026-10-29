import type { ReactNode } from "react";
import { localePath, type Locale } from "@/i18n/config";
import { entries, entry as entryCopy, type EntryId, type Sense, type Step } from "@/content/landing-en";
import GuideWords from "./GuideWords";

// The ShopMajazi Lexicon: the shared world of the landing pages. Each page is one entry: a head rule with live
// guide words, an index of entries down the shoulder, the entry itself, and a colophon. Styles in app/landing/lexicon.css.

export const toman = (n: number) => `${Math.round(n).toLocaleString("en-US")} Toman`;

// A solid arrow, the mark a printed cross-reference closes with. Flips for right-to-left.
export function Arrow({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 12 12" aria-hidden className={`inline-block h-[0.62em] w-[0.62em] shrink-0 rtl:rotate-180 ${className}`}>
      <path d="M1 1.2 11 6 1 10.8z" fill="currentColor" />
    </svg>
  );
}

type Contents = { id: string; label: string }[];

export function LexiconPage({ current, locale, contents, children }: { current: EntryId; locale: Locale; contents: Contents; children: ReactNode }) {
  const at = (p: string) => localePath(p, locale);
  const headword = entryCopy[current].headword;
  return (
    <>
      <a href="#entry" className="lx-btn sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-50">Skip to the entry</a>

      {/* Head rule: first guide word, the masthead, last guide word. */}
      <header className="sticky top-0 z-30 bg-[var(--paper)]">
        {/* Phones: masthead at the start and one guide word at the end; wider: guide words either side of it. */}
        <div className="lx-double-b mx-auto grid max-w-[86rem] grid-cols-[auto_minmax(0,1fr)] items-end gap-4 px-4 pb-2.5 pt-3 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] sm:px-6 lg:px-10">
          <div className="order-2 text-end text-[0.95rem] sm:order-none sm:text-start sm:text-base"><GuideWords initial={headword} side="first" /></div>
          <a href={at("/")} className="order-1 leading-tight no-underline sm:order-none sm:text-center">
            <span className="block text-[1.35rem] font-bold tracking-[0.02em] sm:text-[1.6rem]">ShopMajazi</span>
            <span className="lx-caps hidden text-[var(--ink-3)] sm:block">A lexicon of numbers &amp; accounts</span>
          </a>
          <div className="hidden text-end sm:block sm:text-base"><GuideWords initial={headword} side="last" /></div>
        </div>
        {/* Phones: the thumb index as a strip under the head rule. */}
        <nav aria-label="Index of entries" className="lx-rule-b lg:hidden">
          <ul className="mx-auto grid max-w-[86rem] grid-cols-2 px-4 sm:grid-cols-4 sm:px-6">
            {entries.map((e) => (
              <li key={e.id}>
                <a href={at(e.href)} aria-current={e.id === current ? "page" : undefined}
                  className={`block whitespace-nowrap py-2 text-center text-[0.95rem] no-underline ${e.id === current ? "font-bold text-[var(--rubric)] underline decoration-2 underline-offset-[0.35em]" : "text-[var(--ink-2)]"}`}>
                  {e.headword}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <div className="mx-auto grid max-w-[86rem] gap-x-12 px-4 sm:px-6 lg:grid-cols-[13.5rem_minmax(0,1fr)] lg:px-10">
        <Shoulder current={current} contents={contents} at={at} />
        <main id="entry" className="min-w-0 pb-24">{children}</main>
      </div>

      <Colophon at={at} />
    </>
  );
}

// The shoulder: the index of entries (the current one in the rubric) and what this entry contains.
function Shoulder({ current, contents, at }: { current: EntryId; contents: Contents; at: (p: string) => string }) {
  return (
    <aside className="hidden lg:block">
      <div className="sticky top-[5.75rem] pt-10">
        <nav aria-label="Index of entries">
          <h2 className="lx-caps lx-rule-b pb-2 text-[var(--ink-2)]">Index of entries</h2>
          <ul>
            {entries.map((e) => {
              const on = e.id === current;
              return (
                <li key={e.id} className={on ? "border-b-2 border-[var(--rubric)]" : "lx-rule-b border-[color:rgb(23_20_15/0.3)]"}>
                  <a href={at(e.href)} aria-current={on ? "page" : undefined} className="group block py-2.5 no-underline">
                    <span className={`block font-bold leading-snug ${on ? "text-[var(--rubric)]" : "group-hover:underline"}`}>{e.headword}</span>
                    <span className="block text-[0.85rem] italic leading-snug text-[var(--ink-3)]">{e.gloss}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <nav aria-label="In this entry" className="mt-8">
          <h2 className="lx-caps lx-rule-b pb-2 text-[var(--ink-2)]">In this entry</h2>
          <ol className="mt-2 space-y-1 text-[0.95rem]">
            {contents.map((c) => (
              <li key={c.id}><a href={`#${c.id}`} className="lx-see no-underline hover:underline">{c.label}</a></li>
            ))}
          </ol>
        </nav>

        <div className="mt-8 border-[3px] border-double border-[var(--ink)] p-4 text-[0.95rem] leading-snug">
          <p className="font-bold">The order desk</p>
          <p className="mt-1 italic text-[var(--ink-3)]">Your orders, codes and logins live in your account.</p>
          <p className="mt-3 flex flex-col gap-1.5">
            <a href={at("/login")} className="lx-see inline-flex items-center gap-1.5">My account <Arrow /></a>
            <a href={at("/contact-us")} className="lx-see inline-flex items-center gap-1.5">Ask support <Arrow /></a>
          </p>
        </div>
      </div>
    </aside>
  );
}

// The opening of an entry: headword, pronunciation, the first sense as the lead, the look-up, and the plate.
export function EntryHead({ id, lookup, plate }: { id: EntryId; lookup: ReactNode; plate: ReactNode }) {
  const e = entryCopy[id];
  return (
    <div className="grid gap-10 pt-8 sm:pt-10 xl:grid-cols-[minmax(0,1fr)_minmax(22rem,27rem)] xl:gap-14">
      <div data-hw={e.headword} className="min-w-0">
        <h1 className="text-balance text-[clamp(3rem,8.2vw,6rem)] font-bold leading-[0.95] tracking-[-0.02em]">{e.headword}</h1>
        <p className="mt-4 text-[1.0625rem] text-[var(--ink-2)]">
          <span className="italic">{e.pron}</span>
          <span className="mx-2" aria-hidden>·</span>
          <span className="italic">{e.pos}</span>
          {e.etym && <><span className="mx-2" aria-hidden>·</span><span>[{e.etym}]</span></>}
        </p>
        <p className="lx-rule-t mt-6 max-w-[38rem] pt-5 text-[clamp(1.25rem,2.1vw,1.55rem)] leading-[1.45]">
          <span className="me-2 font-bold">1.</span>{e.senses[0].text}
        </p>
        <div className="mt-8">{lookup}</div>
      </div>
      <div className="min-w-0">{plate}</div>
    </div>
  );
}

// A look-up box: a fieldset framed by a double rule, as a printed form would be.
export function LookupBox({ legend, children, note }: { legend: string; children: ReactNode; note?: ReactNode }) {
  return (
    <div className="max-w-[44rem]">
      <fieldset className="border-[3px] border-double border-[var(--ink)] bg-[var(--paper-deep)] px-4 pb-5 pt-2 sm:px-5">
        <legend className="px-2 text-[1.125rem] font-bold">{legend}</legend>
        {children}
      </fieldset>
      {note && <p className="mt-3 text-[0.95rem] italic text-[var(--ink-3)]">{note}</p>}
    </div>
  );
}

// A section of the entry, ranked by a full rule and a hanging head.
export function Section({ id, title, hw, children, aside }: { id: string; title: string; hw?: string; children: ReactNode; aside?: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-h`} className="lx-rule-t mt-20 pt-6 sm:mt-24">
      <div className="grid gap-x-12 gap-y-6 xl:grid-cols-[12rem_minmax(0,1fr)]">
        <div data-hw={hw ?? title}>
          <h2 id={`${id}-h`} className="text-[1.75rem] font-bold leading-tight tracking-[-0.01em]">{title}</h2>
          {aside && <div className="mt-2 text-[0.95rem] italic leading-snug text-[var(--ink-3)]">{aside}</div>}
        </div>
        <div className="min-w-0">{children}</div>
      </div>
    </section>
  );
}

// Numbered senses after the first, each with an optional usage example and cross-reference.
export function Senses({ id, locale }: { id: EntryId; locale: Locale }) {
  const senses = entryCopy[id].senses.slice(1);
  return (
    <ol className="max-w-[40rem] space-y-5">
      {senses.map((s, i) => <SenseItem key={i} n={i + 2} sense={s} locale={locale} />)}
    </ol>
  );
}

function SenseItem({ n, sense, locale }: { n: number; sense: Sense; locale: Locale }) {
  const see = sense.see && entries.find((e) => e.id === sense.see);
  return (
    <li className="grid grid-cols-[1.75rem_minmax(0,1fr)]">
      <span className="font-bold">{n}.</span>
      <div>
        {sense.text}
        {see && <> see <a href={localePath(see.href, locale)} className="lx-see inline-flex items-center gap-1 font-bold">{see.headword} <Arrow /></a></>}
        {sense.example && <span className="mt-1 block italic text-[var(--ink-3)]">e.g. {sense.example}.</span>}
      </div>
    </li>
  );
}

// Usage: the three steps of buying, in order (the order matters, so they are numbered).
export function Usage({ steps }: { steps: Step[] }) {
  return (
    <ol className="grid gap-6 sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-[color:rgb(23_20_15/0.35)] rtl:sm:divide-x-reverse">
      {steps.map((s, i) => (
        <li key={s.title} className="sm:px-6 sm:first:ps-0 sm:last:pe-0">
          <span className="block text-[2.5rem] font-bold leading-none">{["i", "ii", "iii"][i]}.</span>
          <span className="mt-3 block text-[1.15rem] font-bold leading-snug">{s.title}</span>
          <span className="mt-1 block text-[var(--ink-2)]">{s.text}</span>
        </li>
      ))}
    </ol>
  );
}

// Notes: the questions buyers ask, printed in full (no accordions; every answer is on the page).
export function Notes({ items }: { items: { q: string; a: string }[] }) {
  return (
    <ol className="lx-columns-wide">
      {items.map((n, i) => (
        <li key={n.q} data-hw={n.q} className="mb-6 break-inside-avoid">
          <p className="font-bold leading-snug"><span className="me-1.5">{i + 1}.</span>{n.q}</p>
          <p className="mt-1 text-[var(--ink-2)]">{n.a}</p>
        </li>
      ))}
    </ol>
  );
}

// See also: the other entries, and the last call to look one up.
export function SeeAlso({ current, locale, action }: { current: EntryId; locale: Locale; action: ReactNode }) {
  const others = entries.filter((e) => e.id !== current);
  return (
    <>
      <ul className="grid gap-x-10 gap-y-4 sm:grid-cols-3">
        {others.map((e) => (
          <li key={e.id} data-hw={e.headword}>
            <a href={localePath(e.href, locale)} className="group block no-underline">
              <span className="inline-flex items-center gap-1.5 text-[1.2rem] font-bold group-hover:underline">{e.headword} <Arrow /></span>
              <span className="block italic text-[var(--ink-3)]">{e.gloss}</span>
            </a>
          </li>
        ))}
      </ul>
      <div className="lx-double-t mt-12 flex flex-wrap items-center gap-x-8 gap-y-4 pt-8">{action}</div>
    </>
  );
}

// A comparison table set like a lexicon's synonym study: rows of terms, the current entry's column in bold.
export function CompareTable({ caption, columns, rows, current }: { caption: string; columns: { id: string; label: string; href?: string }[]; rows: { label: string; values: Record<string, string | undefined> }[]; current: string }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[34rem] border-collapse text-start">
        <caption className="pb-3 text-start italic text-[var(--ink-3)]">{caption}</caption>
        <thead>
          <tr className="lx-double-b">
            <td className="w-[22%]" />
            {columns.map((c) => (
              <th key={c.id} scope="col" className={`px-3 pb-2 text-start align-bottom text-[1.1rem] leading-tight ${c.id === current ? "text-[var(--rubric)]" : ""}`}>
                {c.id === current || !c.href ? c.label : <a href={c.href} className="lx-see">{c.label}</a>}
                {c.id === current && <span className="block text-[0.8rem] font-normal italic text-[var(--ink-3)]">this entry</span>}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.label} className="lx-rule-b border-[color:rgb(23_20_15/0.3)]">
              <th scope="row" className="py-2.5 pe-3 text-start align-top font-normal italic text-[var(--ink-2)]">{r.label}</th>
              {columns.map((c) => (
                <td key={c.id} className={`px-3 py-2.5 align-top ${c.id === current ? "font-bold" : ""}`}>{r.values[c.id] ?? "—"}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// A plate: the only place colour is printed. Ink border, vermilion inner frame, a title, the figure, a numbered legend.
export function Plate({ numeral, title, children, legend, caption }: { numeral: string; title: string; children: ReactNode; legend?: ReactNode; caption?: string }) {
  return (
    <figure className="lx-plate" aria-labelledby={`plate-${numeral}`}>
      <div className="lx-plate-frame">
        <p id={`plate-${numeral}`} className="lx-caps mb-4 text-center text-[var(--ink)]">Plate {numeral}. {title}</p>
        {children}
      </div>
      {(legend || caption) && (
        <figcaption className="px-3 pb-2 pt-3 text-[0.95rem] leading-snug">
          {legend}
          {caption && <p className="mt-2 text-[0.85rem] italic text-[var(--ink-3)]">{caption}</p>}
        </figcaption>
      )}
    </figure>
  );
}

// The colophon: who prints this, how to pay, where to get help.
function Colophon({ at }: { at: (p: string) => string }) {
  // Terms of service (/rules), Refund policy (/rules#refunds) and Privacy (/privacy) come back once those pages exist.
  const links = [
    { label: "Contact us", href: "/contact-us" },
  ];
  return (
    <footer className="lx-double-t">
      <div className="mx-auto grid max-w-[86rem] gap-8 px-4 py-12 sm:grid-cols-3 sm:px-6 lg:px-10">
        <div>
          <p className="text-[1.5rem] font-bold">ShopMajazi</p>
          <p className="mt-2 max-w-[22rem] text-[var(--ink-2)]">Numbers, accounts and subscriptions from abroad, delivered in minutes and paid without a foreign card.</p>
        </div>
        <div>
          <p className="lx-caps text-[var(--ink-2)]">Paid with</p>
          <p className="mt-2">Your wallet balance, a bank card, or crypto. Failed orders are refunded to your wallet automatically.</p>
        </div>
        <div>
          <p className="lx-caps text-[var(--ink-2)]">Help</p>
          <ul className="mt-2 space-y-1">
            {links.map((l) => <li key={l.href}><a href={at(l.href)} className="lx-see">{l.label}</a></li>)}
          </ul>
        </div>
      </div>
      <p className="lx-rule-t mx-auto max-w-[86rem] px-4 py-4 text-center text-[0.85rem] italic text-[var(--ink-3)] sm:px-6 lg:px-10">
        Set in Old Standard. Prices are read from the shop when the page is printed, and checked again when you pay.
      </p>
    </footer>
  );
}
