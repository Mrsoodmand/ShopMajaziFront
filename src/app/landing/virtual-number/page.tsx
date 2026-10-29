import type { Metadata } from "next";
import { localePath } from "@/i18n/config";
import { getLocale } from "@/i18n/server";
import { storefront } from "@/lib/backend";
import { toCatalog, type ApiVirtualNumbers, type VnCatalog } from "@/lib/virtual-numbers";
import { entry, numberCompare, numberKinds } from "@/content/landing-en";
import { Arrow, CompareTable, EntryHead, LexiconPage, LookupBox, Notes, Section, SeeAlso, Senses, toman, Usage } from "@/design/landing/Lexicon";
import { PlateSpecimens } from "@/design/landing/plates";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Virtual number for SMS verification, from 150+ countries — ShopMajazi",
  description: "A phone number in another country for one verification code: WhatsApp, Telegram, Google, ChatGPT and 2,000+ apps. Pay without a foreign card; refunded if no code arrives.",
  alternates: { canonical: "/landing/virtual-number" },
};

// Apps first in the plate, by how often they are bought for (ids from the backend's image names).
const SPECIMEN_APPS = ["telegram", "whatsapp", "openai", "gmail", "instagram", "tiktok", "apple"];

async function loadCatalog(): Promise<VnCatalog | null> {
  try {
    return toCatalog(await storefront<ApiVirtualNumbers>("virtual-numbers"), "en");
  } catch (e) {
    console.error("landing/virtual-number: backend unavailable", e);
    return null;
  }
}

const contents = [
  { id: "senses", label: "Senses" },
  { id: "usage", label: "Usage" },
  { id: "prices", label: "Prices by app" },
  { id: "countries", label: "Cheapest countries" },
  { id: "compare", label: "Compare" },
  { id: "notes", label: "Notes" },
  { id: "see-also", label: "See also" },
];

export default async function VirtualNumberLanding() {
  const [locale, catalog] = await Promise.all([getLocale(), loadCatalog()]);
  const at = (p: string) => localePath(p, locale);
  const live = !!catalog && catalog.apps.length > 0;
  const appFrom = catalog?.appFrom ?? {};

  const apps = live ? [...catalog.apps].sort((a, b) => a.name.localeCompare(b.name)) : [];
  const countries = live ? [...catalog.countries].sort((a, b) => a.name.localeCompare(b.name)) : [];
  const cheapestCountries = live ? [...catalog.countries].filter((c) => catalog.countryFrom[c.cc] > 0).sort((a, b) => catalog.countryFrom[a.cc] - catalog.countryFrom[b.cc]).slice(0, 12) : [];
  const specimens = SPECIMEN_APPS.map((id) => {
    const app = catalog?.apps.find((a) => a.id === id);
    const fallback: Record<string, string> = { telegram: "Telegram", whatsapp: "WhatsApp", openai: "ChatGPT", gmail: "Google", instagram: "Instagram", tiktok: "TikTok", apple: "Apple ID" };
    return { name: (app?.name ?? fallback[id]).replace(" / OpenAI", "").replace(" / Gmail / YouTube", ""), from: app ? appFrom[app.id] : undefined };
  });
  // Apps grouped under their initial letter, the way a dictionary page runs.
  const byLetter = apps.reduce<Record<string, typeof apps>>((acc, a) => { const l = a.name.charAt(0).toUpperCase(); (acc[l] ??= []).push(a); return acc; }, {});
  const defaultApp = catalog?.apps.find((a) => a.id === "telegram")?.id ?? apps[0]?.id;

  const lookup = live ? (
    <LookupBox legend="Look up a number" note={<>Refunded to your wallet if no code arrives within 20 minutes.</>}>
      <form method="get" action={at("/virtual-number")} className="grid gap-4 pt-2 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] sm:items-end">
        <label className="block">
          <span className="mb-1.5 block font-bold">App</span>
          <select name="app" defaultValue={defaultApp} className="lx-field">
            {apps.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>
        </label>
        <label className="block">
          <span className="mb-1.5 block font-bold">Country</span>
          <select name="cc" defaultValue="" className="lx-field">
            <option value="">Any country</option>
            {countries.map((c) => <option key={c.cc} value={c.cc}>{c.name}</option>)}
          </select>
        </label>
        <button type="submit" className="lx-btn">Look up <Arrow /></button>
      </form>
    </LookupBox>
  ) : (
    <LookupBox legend="Look up a number" note="Prices could not be read just now; the order page always shows them.">
      <p className="pb-1 pt-2"><a href={at("/virtual-number")} className="lx-btn">Choose an app and country <Arrow /></a></p>
    </LookupBox>
  );

  return (
    <LexiconPage current="virtual-number" locale={locale} contents={contents}>
      <EntryHead id="virtual-number" lookup={lookup} plate={<PlateSpecimens items={specimens} />} />

      <Section id="senses" title="Senses">
        <Senses id="virtual-number" locale={locale} />
      </Section>

      <Section id="usage" title="Usage" aside="How a number is bought, in about a minute.">
        <Usage steps={entry["virtual-number"].usage} />
      </Section>

      <Section id="prices" title="Prices by app" aside={live ? <>Lowest price in stock for each of {apps.length} apps, in Toman. Choose one to see every country.</> : undefined}>
        {live ? (
          <div className="lx-columns">
            {Object.entries(byLetter).map(([letter, list]) => (
              <div key={letter} className="mb-5">
                <p className="break-after-avoid text-[1.6rem] font-bold leading-none" aria-hidden>{letter}</p>
                <ul className="mt-1.5">
                  {list.map((a) => (
                    <li key={a.id} data-hw={a.name}>
                      <a href={at(`/virtual-number?app=${a.id}`)} className="lx-leader group py-[3px] no-underline">
                        <span className="min-w-0 truncate group-hover:underline">{a.name}</span>
                        <span className="lx-dots" aria-hidden />
                        <span className="lx-num shrink-0 font-bold">{appFrom[a.id] ? toman(appFrom[a.id]).replace(" Toman", "") : "—"}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ) : (
          <p className="max-w-[38rem] italic text-[var(--ink-2)]">Prices could not be read from the shop just now. They are always shown on the <a href={at("/virtual-number")} className="lx-see not-italic">order page</a>.</p>
        )}
      </Section>

      {cheapestCountries.length > 0 && (
        <Section id="countries" title="Cheapest countries" aside="The lowest price for any app in each country, in Toman.">
          <ol className="lx-columns">
            {cheapestCountries.map((c, i) => (
              <li key={c.cc} data-hw={c.name} className="lx-leader py-[3px]">
                <span><span className="lx-num me-2 inline-block w-6 text-[var(--ink-3)]">{i + 1}.</span>{c.name}</span>
                <span className="lx-dots" aria-hidden />
                <span className="lx-num font-bold">{toman(catalog!.countryFrom[c.cc]).replace(" Toman", "")}</span>
              </li>
            ))}
          </ol>
        </Section>
      )}

      <Section id="compare" title="Compare" aside="Not to be confused with a rented number or Google Voice.">
        <CompareTable caption="Three kinds of number, side by side." current="virtual-number"
          columns={numberKinds.map((k) => ({ id: k.id, label: k.label, href: at(`/landing/${k.id}`) }))}
          rows={numberCompare.map((r) => ({ label: r.label, values: r.values }))} />
      </Section>

      <Section id="notes" title="Notes">
        <Notes items={entry["virtual-number"].notes} />
      </Section>

      <Section id="see-also" title="See also">
        <SeeAlso current="virtual-number" locale={locale} action={
          <>
            <a href={at("/virtual-number")} className="lx-btn">Look up a number <Arrow /></a>
            <p className="italic text-[var(--ink-3)]">Pay from your wallet, by card or in crypto.</p>
          </>
        } />
      </Section>
    </LexiconPage>
  );
}
