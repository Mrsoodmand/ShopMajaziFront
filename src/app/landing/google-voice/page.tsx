import type { Metadata } from "next";
import { localePath } from "@/i18n/config";
import { getLocale } from "@/i18n/server";
import { storefront } from "@/lib/backend";
import { toGvNumber, type ApiGoogleVoice } from "@/lib/google-voice";
import type { GvNumber } from "@/content/google-voice-en";
import { entry, numberCompare, numberKinds } from "@/content/landing-en";
import { Arrow, CompareTable, EntryHead, LexiconPage, LookupBox, Notes, Section, SeeAlso, Senses, toman, Usage } from "@/design/landing/Lexicon";
import { PlateStates, STATE_NAMES } from "@/design/landing/plates";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Google Voice number: a permanent US number of your own — ShopMajazi",
  description: "A real US number for calls and texts, on its own Google account. Choose it by state or area code, pay once without a foreign card, get the login instantly.",
  alternates: { canonical: "/landing/google-voice" },
};

async function loadNumbers(): Promise<GvNumber[] | null> {
  try {
    const data = await storefront<ApiGoogleVoice>("google-voice", 60);
    if (data.disabled || data.unavailable) return null;
    return data.numbers.map(toGvNumber);
  } catch (e) {
    console.error("landing/google-voice: backend unavailable", e);
    return null;
  }
}

const contents = [
  { id: "senses", label: "Senses" },
  { id: "usage", label: "Usage" },
  { id: "stock", label: "In stock by state" },
  { id: "compare", label: "Compare" },
  { id: "notes", label: "Notes" },
  { id: "see-also", label: "See also" },
];

export default async function GoogleVoiceLanding() {
  const [locale, numbers] = await Promise.all([getLocale(), loadNumbers()]);
  const at = (p: string) => localePath(p, locale);
  const live = !!numbers && numbers.length > 0;

  // Stock per state: how many numbers, the cheapest, and the cities they ring in.
  const states = new Map<string, { n: number; from: number; cities: Set<string> }>();
  for (const num of numbers ?? []) {
    if (!STATE_NAMES[num.state]) continue;
    const s = states.get(num.state) ?? { n: 0, from: Infinity, cities: new Set<string>() };
    s.n += 1;
    if (num.price) s.from = Math.min(s.from, num.price);
    s.cities.add(num.city);
    states.set(num.state, s);
  }
  const counts = Object.fromEntries([...states].map(([st, s]) => [st, s.n]));
  const listed = [...states].sort((a, b) => STATE_NAMES[a[0]].localeCompare(STATE_NAMES[b[0]]));

  const lookup = live ? (
    <LookupBox legend="Look up a number" note={<>{numbers!.length} numbers in stock in {states.size} states today.</>}>
      <form method="get" action={at("/google-voice")} className="grid gap-4 pt-2 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
        <label className="block">
          <span className="mb-1.5 block font-bold">State</span>
          <select name="state" defaultValue="" className="lx-field">
            <option value="">Every state</option>
            {listed.map(([st, s]) => <option key={st} value={st}>{STATE_NAMES[st]} ({s.n})</option>)}
          </select>
        </label>
        <button type="submit" className="lx-btn">See the numbers <Arrow /></button>
      </form>
    </LookupBox>
  ) : (
    <LookupBox legend="Look up a number" note="Stock could not be read just now; the order page always shows it.">
      <p className="pb-1 pt-2"><a href={at("/google-voice")} className="lx-btn">See the numbers <Arrow /></a></p>
    </LookupBox>
  );

  return (
    <LexiconPage current="google-voice" locale={locale} contents={contents}>
      <EntryHead id="google-voice" lookup={lookup} plate={<PlateStates counts={counts} locale={locale} unavailable={!live} />} />

      <Section id="senses" title="Senses">
        <Senses id="google-voice" locale={locale} />
      </Section>

      <Section id="usage" title="Usage" aside="From choosing to signing in.">
        <Usage steps={entry["google-voice"].usage} />
      </Section>

      <Section id="stock" title="In stock by state" aside={live ? "Numbers available now and the lowest price in each state, in Toman." : undefined}>
        {live ? (
          <ul className="lx-columns-wide">
            {listed.map(([st, s]) => (
              <li key={st} data-hw={STATE_NAMES[st]} className="mb-3 break-inside-avoid">
                <a href={at(`/google-voice?state=${st}`)} className="lx-leader group no-underline">
                  <span className="font-bold group-hover:underline">{STATE_NAMES[st]}</span>
                  <span className="lx-dots" aria-hidden />
                  <span className="lx-num shrink-0">{s.n} {s.n === 1 ? "number" : "numbers"}{Number.isFinite(s.from) ? <>, from <b>{toman(s.from).replace(" Toman", "")}</b></> : null}</span>
                </a>
                <p className="text-[0.9rem] italic text-[var(--ink-3)]">{[...s.cities].sort().slice(0, 4).join(", ")}{s.cities.size > 4 ? ", and more" : ""}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="max-w-[38rem] italic text-[var(--ink-2)]">Stock could not be read from the shop just now. Every number in stock is listed on the <a href={at("/google-voice")} className="lx-see not-italic">order page</a>.</p>
        )}
      </Section>

      <Section id="compare" title="Compare" aside="Not to be confused with a one-time or rented number.">
        <CompareTable caption="Three kinds of number, side by side." current="google-voice"
          columns={numberKinds.map((k) => ({ id: k.id, label: k.label, href: at(`/landing/${k.id}`) }))}
          rows={numberCompare.map((r) => ({ label: r.label, values: r.values }))} />
      </Section>

      <Section id="notes" title="Notes">
        <Notes items={entry["google-voice"].notes} />
      </Section>

      <Section id="see-also" title="See also">
        <SeeAlso current="google-voice" locale={locale} action={
          <>
            <a href={at("/google-voice")} className="lx-btn">Choose your number <Arrow /></a>
            <p className="italic text-[var(--ink-3)]">One payment, no monthly fee.</p>
          </>
        } />
      </Section>
    </LexiconPage>
  );
}
