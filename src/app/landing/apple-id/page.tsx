import type { Metadata } from "next";
import { localePath } from "@/i18n/config";
import { getLocale } from "@/i18n/server";
import { appleCompare, entry } from "@/content/landing-en";
import { Arrow, CompareTable, EntryHead, LexiconPage, LookupBox, Notes, Section, SeeAlso, Senses, Usage } from "@/design/landing/Lexicon";
import { PlateApple } from "@/design/landing/plates";

export const metadata: Metadata = {
  title: "US Apple ID, ready in seconds or made with your details — ShopMajazi",
  description: "A United States Apple ID for the App Store, iCloud and every Apple device: ready the moment you pay, or custom-made with your own name and email.",
  alternates: { canonical: "/landing/apple-id" },
};

const contents = [
  { id: "senses", label: "Senses" },
  { id: "usage", label: "Usage" },
  { id: "compare", label: "Ready or Custom" },
  { id: "notes", label: "Notes" },
  { id: "see-also", label: "See also" },
];

// Apple ID prices are still placeholders on the shop, so this entry quotes none; the order pages have them.
export default async function AppleIdLanding() {
  const locale = await getLocale();
  const at = (p: string) => localePath(p, locale);

  const lookup = (
    <LookupBox legend="Choose your Apple ID" note="Both are United States Apple IDs and work on any iPhone, iPad or Mac.">
      <div className="grid gap-4 pt-2 sm:grid-cols-2">
        <div>
          <a href={at("/apple-id/usa")} className="lx-btn w-full">Ready Apple ID <Arrow /></a>
          <p className="mt-2 text-[0.95rem] text-[var(--ink-2)]">Delivered the moment you pay.</p>
        </div>
        <div>
          <a href={at("/apple-id/custom")} className="lx-btn-2 w-full">Custom Apple ID <Arrow /></a>
          <p className="mt-2 text-[0.95rem] text-[var(--ink-2)]">Your name and email, in about 10 minutes.</p>
        </div>
      </div>
    </LookupBox>
  );

  return (
    <LexiconPage current="apple-id" locale={locale} contents={contents}>
      <EntryHead id="apple-id" lookup={lookup} plate={<PlateApple />} />

      <Section id="senses" title="Senses">
        <Senses id="apple-id" locale={locale} />
      </Section>

      <Section id="usage" title="Usage" aside="From choosing to signing in.">
        <Usage steps={entry["apple-id"].usage} />
      </Section>

      <Section id="compare" title="Ready or Custom" aside="Two kinds of the same account.">
        <CompareTable caption="Ready and Custom Apple IDs, side by side." current=""
          columns={[{ id: "ready", label: "Ready", href: at("/apple-id/usa") }, { id: "custom", label: "Custom", href: at("/apple-id/custom") }]}
          rows={appleCompare.map((r) => ({ label: r.label, values: { ready: r.ready, custom: r.custom } }))} />
      </Section>

      <Section id="notes" title="Notes">
        <Notes items={entry["apple-id"].notes} />
      </Section>

      <Section id="see-also" title="See also">
        <SeeAlso current="apple-id" locale={locale} action={
          <>
            <a href={at("/apple-id/usa")} className="lx-btn">Get a ready Apple ID <Arrow /></a>
            <a href={at("/apple-id/custom")} className="lx-see inline-flex items-center gap-1.5">or a custom one <Arrow /></a>
          </>
        } />
      </Section>
    </LexiconPage>
  );
}
