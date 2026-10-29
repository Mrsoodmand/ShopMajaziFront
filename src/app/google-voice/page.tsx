import type { Metadata } from "next";
import { getT } from "@/i18n/server";
import { getSection } from "@/design/registry";
import { readDecisions } from "@/components/design/decisions";
import { ExtrasSlot } from "@/design/service/slot";
import ServiceExtras from "@/design/service/ServiceExtras";
import { LiveGvProvider, type LiveGv } from "@/design/googleVoice/live";
import { MoneyProvider } from "@/lib/money";
import { storefront } from "@/lib/backend";
import { toGvNumber, type ApiGoogleVoice } from "@/lib/google-voice";
import { PageHeadingProvider } from "@/components/seo/PageHeading";
import { pageSeo, seoMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return seoMetadata("google-voice", {
    title: t("Buy a Google Voice number: permanent US phone number — ShopMajazi"),
    description: t("A real US number for calls and texts on its own Google account. Pick your number by city or area code, pay once, get the login instantly."),
    alternates: { canonical: "/google-voice" },
  });
}

// Numbers in stock and their prices (Numberland, through the backend). Kept fresh: stock sells out fast.
async function loadLive(state?: string): Promise<LiveGv> {
  const t = await getT();
  try {
    const data = await storefront<ApiGoogleVoice>("google-voice", 0);
    if (data.disabled) return { numbers: [], error: t("Google Voice sales are paused for a moment. Please try again a little later.") };
    return { numbers: data.numbers.map(toGvNumber), initialState: state?.toUpperCase(), error: data.unavailable ? t("Numbers are unavailable right now. Please try again in a minute.") : undefined };
  } catch (e) {
    console.error("google-voice: backend unavailable", e);
    return { numbers: [], error: t("Numbers are unavailable right now. Please try again in a minute.") };
  }
}

// The live Google Voice page: renders whichever page design is chosen in /design/page-google-voice (falls back to A).
// Design A reads the live numbers and buys through the backend; the others still show the samples.
// ?state=CA (e.g. from a landing page) opens the picker on that state.
export default async function GoogleVoicePage({ searchParams }: { searchParams: Promise<{ state?: string }> }) {
  const seo = await pageSeo("google-voice");
  const { state } = await searchParams;
  const [decisions, live] = await Promise.all([readDecisions(), loadLive(state)]);
  const section = getSection("page-google-voice")!;
  const offer = section.offers.find((o) => o.id === decisions["page-google-voice"]?.offer) ?? section.offers.find((o) => o.id === "A")!;
  const { Component } = offer;
  // How to use, content, comments, FAQ and blog follow the design (see ServiceExtras).
  return (
    <PageHeadingProvider h1={seo.h1}>
      <MoneyProvider currency="toman">
        <LiveGvProvider value={live}>
          <ExtrasSlot extras={<ServiceExtras service="google-voice" />} glow="emerald"><Component card={offer.id === "K" ? decisions["page-google-voice-card"]?.offer : undefined} /></ExtrasSlot>
        </LiveGvProvider>
      </MoneyProvider>
    </PageHeadingProvider>
  );
}
