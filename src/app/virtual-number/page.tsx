import type { Metadata } from "next";
import { getSection } from "@/design/registry";
import { readDecisions } from "@/components/design/decisions";
import { ExtrasSlot } from "@/design/service/slot";
import ServiceExtras from "@/design/service/ServiceExtras";
import { LiveOtpProvider, type LiveOtp } from "@/design/otp/live";
import { MoneyProvider } from "@/lib/money";
import { storefront } from "@/lib/backend";
import { toCatalog, type ApiOffer, type ApiVirtualNumbers, type Locale } from "@/lib/virtual-numbers";
import { getLocale, getT } from "@/i18n/server";
import { makeT } from "@/i18n/translate";
import { PageHeadingProvider } from "@/components/seo/PageHeading";
import { pageSeo, seoMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return seoMetadata("virtual-number", {
    title: t("Buy a virtual number for SMS verification — ShopMajazi"),
    description: t("Virtual numbers from 150+ countries for WhatsApp, Telegram, Google, ChatGPT and 2,000+ apps. Choose app, country and operator; refund if no code arrives."),
  });
}

const DEFAULT_APP = "telegram";

// Apps, countries and "from" prices from the backend, plus the default app's offers so the page opens with
// Telegram and its cheapest country already picked.
// `want` comes from the address (?app=telegram&cc=DE), e.g. a landing page's look-up; unknown values are ignored.
async function loadLive(locale: Locale, want: { app?: string; cc?: string } = {}): Promise<LiveOtp> {
  try {
    const catalog = toCatalog(await storefront<ApiVirtualNumbers>("virtual-numbers"), locale);
    const app = catalog.apps.find((a) => a.id === want.app) ?? catalog.apps.find((a) => a.id === DEFAULT_APP) ?? catalog.apps[0];
    if (!app?.sid) return { catalog, locale, defaultApp: DEFAULT_APP };
    const { offers } = await storefront<{ offers: ApiOffer[] }>(`virtual-numbers/offers?service=${app.sid}`);
    const cheapest = offers.reduce<ApiOffer | null>((a, b) => (!a || b.price < a.price ? b : a), null);
    const wanted = catalog.countries.find((c) => c.cc === want.cc?.toUpperCase());
    const hasWanted = !!wanted && offers.some((o) => Number(o.country_id) === wanted.cid);
    const defaultCc = hasWanted ? wanted.cc : catalog.countries.find((c) => c.cid === Number(cheapest?.country_id))?.cc;
    return { catalog, locale, defaultApp: app.id, defaultCc, preload: { appId: app.id, offers } };
  } catch (e) {
    console.error("virtual-number: backend unavailable", e);
    const t = makeT(locale);
    return { catalog: { apps: [], countries: [], appFrom: {}, countryFrom: {} }, locale, defaultApp: DEFAULT_APP, error: t("Prices are unavailable right now. Please try again in a minute.") };
  }
}

// The live Virtual Number (OTP) page: renders whichever page design is chosen in /design/page-otp (falls back to L).
export default async function VirtualNumberPage({ searchParams }: { searchParams: Promise<{ app?: string; cc?: string }> }) {
  const seo = await pageSeo("virtual-number");
  const want = await searchParams;
  const [decisions, live] = await Promise.all([readDecisions(), getLocale().then((l) => loadLive(l, want))]);
  const section = getSection("page-otp")!;
  const offer = section.offers.find((o) => o.id === decisions["page-otp"]?.offer) ?? section.offers.find((o) => o.id === "L")!;
  // Pages L and P also take the chosen order screen from /design/page-otp-order.
  const { Component } = offer;
  return (
    <PageHeadingProvider h1={seo.h1}>
      <MoneyProvider currency="toman">
        <LiveOtpProvider value={live}>
          <ExtrasSlot extras={<ServiceExtras service="virtual-number" />} glow="violet">
            <Component orderView={offer.id === "L" || offer.id === "P" ? decisions["page-otp-order"]?.offer : undefined} panel={offer.id === "P" ? decisions["page-otp-panel"]?.offer : undefined} card={offer.id === "P" ? decisions["page-otp-card"]?.offer : undefined} />
          </ExtrasSlot>
        </LiveOtpProvider>
      </MoneyProvider>
    </PageHeadingProvider>
  );
}
