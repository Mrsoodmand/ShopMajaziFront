import type { Metadata } from "next";
import { localePath } from "@/i18n/config";
import { getLocale } from "@/i18n/server";
import { entry, numberCompare, numberKinds } from "@/content/landing-en";
import { Arrow, CompareTable, EntryHead, LexiconPage, LookupBox, Notes, Section, SeeAlso, Senses, Usage } from "@/design/landing/Lexicon";
import { PlateCalendar } from "@/design/landing/plates";

export const metadata: Metadata = {
  title: "Rent a phone number for a week to a month, unlimited SMS — ShopMajazi",
  description: "Rent a number for all your apps or for one app, from 12 countries. Every SMS for a week to a month; extend any time and keep the same number.",
  alternates: { canonical: "/landing/rent-number" },
};

const contents = [
  { id: "senses", label: "Senses" },
  { id: "usage", label: "Usage" },
  { id: "terms", label: "Terms of rent" },
  { id: "compare", label: "Compare" },
  { id: "notes", label: "Notes" },
  { id: "see-also", label: "See also" },
];

// Rent prices and stock are still placeholders on the shop, so this entry quotes none; the order page has them.
export default async function RentNumberLanding() {
  const locale = await getLocale();
  const at = (p: string) => localePath(p, locale);

  const ways = [
    { name: "For all apps", text: "Takes every SMS sent to the number, from any sender. For signing in to several services." },
    { name: "For one app", text: "Takes SMS from the one app you choose, and costs less. For keeping one account." },
  ];

  const lookup = (
    <LookupBox legend="Rent a number" note="The number is active the moment you pay.">
      <ul className="grid gap-3 pb-4 pt-2 sm:grid-cols-2">
        {ways.map((w) => (
          <li key={w.name} className="border-t border-[var(--ink)] pt-2">
            <span className="block font-bold">{w.name}</span>
            <span className="block text-[0.95rem] text-[var(--ink-2)]">{w.text}</span>
          </li>
        ))}
      </ul>
      <a href={at("/rent-number")} className="lx-btn">Choose a country and period <Arrow /></a>
    </LookupBox>
  );

  const terms = [
    { term: "Periods", def: "1 week, 2 weeks or 1 month. Longer rentals cost less per day." },
    { term: "Countries", def: "Twelve. The order page shows which have numbers for your period today." },
    { term: "Messages", def: "Unlimited SMS for the whole rental, shown in your dashboard as they arrive." },
    { term: "Extension", def: "Add 7, 14 or 30 days at any time before the rental ends. The number does not change." },
    { term: "Replacement", def: "If a code does not arrive in the first hour, the number is replaced." },
    { term: "End of rent", def: "The number is released and may later go to someone else. Move important accounts first." },
  ];

  return (
    <LexiconPage current="rent-number" locale={locale} contents={contents}>
      <EntryHead id="rent-number" lookup={lookup} plate={<PlateCalendar />} />

      <Section id="senses" title="Senses">
        <Senses id="rent-number" locale={locale} />
      </Section>

      <Section id="usage" title="Usage" aside="How a rental begins.">
        <Usage steps={entry["rent-number"].usage} />
      </Section>

      <Section id="terms" title="Terms of rent">
        <dl className="lx-columns-wide">
          {terms.map((t) => (
            <div key={t.term} data-hw={t.term} className="mb-5 break-inside-avoid">
              <dt className="font-bold">{t.term}</dt>
              <dd className="text-[var(--ink-2)]">{t.def}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section id="compare" title="Compare" aside="Not to be confused with a one-time number or Google Voice.">
        <CompareTable caption="Three kinds of number, side by side." current="rent-number"
          columns={numberKinds.map((k) => ({ id: k.id, label: k.label, href: at(`/landing/${k.id}`) }))}
          rows={numberCompare.map((r) => ({ label: r.label, values: r.values }))} />
      </Section>

      <Section id="notes" title="Notes">
        <Notes items={entry["rent-number"].notes} />
      </Section>

      <Section id="see-also" title="See also">
        <SeeAlso current="rent-number" locale={locale} action={
          <>
            <a href={at("/rent-number")} className="lx-btn">Rent a number <Arrow /></a>
            <p className="italic text-[var(--ink-3)]">Pay from your wallet, by card or in crypto.</p>
          </>
        } />
      </Section>
    </LexiconPage>
  );
}
