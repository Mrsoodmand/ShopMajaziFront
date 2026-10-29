import type { Metadata } from "next";
import { getLocale, getT } from "@/i18n/server";
import { makeT } from "@/i18n/translate";
import { getSection } from "@/design/registry";
import { readDecisions } from "@/components/design/decisions";
import { LiveSocialProvider, type LiveSocial } from "@/design/social/live";
import { MoneyProvider } from "@/lib/money";
import { storefront } from "@/lib/backend";
import { toSocialCategories, type ApiVirtualServices } from "@/lib/social";
import { PageHeadingProvider } from "@/components/seo/PageHeading";
import { pageSeo, seoMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return seoMetadata("virtual-service", {
    title: t("Social media services: members, followers, views and likes — ShopMajazi"),
    description: t("Telegram members, Instagram followers, YouTube views and TikTok likes. Only a public link is needed, never your password. Starts in minutes, free refill on drops."),
    alternates: { canonical: "/virtual-service" },
  });
}

// Platforms and services the admin manages (React admin › Virtual services), with toman prices per 1,000.
async function loadLive(locale: "en" | "fa"): Promise<LiveSocial> {
  try {
    return { categories: toSocialCategories(await storefront<ApiVirtualServices>("virtual-services", 60), locale) };
  } catch (e) {
    console.error("virtual-service: backend unavailable", e);
    return { categories: [], error: makeT(locale)("Services are unavailable right now. Please try again in a minute.") };
  }
}

// The live Social media services list: the platforms the admin manages, in whichever design is chosen in
// /design/page-social-list (F), with the hero chosen in /design/page-social-list-hero (plain title and search until
// one is picked). Ordering happens on /virtual-service/{platform}.
export default async function SocialPage() {
  const seo = await pageSeo("virtual-service");
  const [decisions, live] = await Promise.all([readDecisions(), getLocale().then((l) => loadLive(l === "fa" ? "fa" : "en"))]);
  const section = getSection("page-social-list")!;
  const offer = section.offers.find((o) => o.id === decisions["page-social-list"]?.offer) ?? section.offers.find((o) => o.id === "F")!;
  const { Component } = offer;
  const textures: Record<string, string> = { A: "grid", B: "rings", C: "grain", D: "lines", E: "glyphs", F: "none" };
  const icons: Record<string, string> = { A: "tile", B: "mono", C: "bubble", D: "constellation", E: "orbit", F: "line", G: "g-bounce", H: "g-pop", I: "g-spin", J: "g-orbit", K: "g-rise", L: "none" };
  const backdrops: Record<string, string> = { A: "aurora", B: "sunset", C: "mesh", D: "beams", E: "waves", F: "none" };
  const objects: Record<string, string> = { A: "globe", B: "orb", C: "curve", D: "halo", E: "pulse", F: "none" };
  return (
    <PageHeadingProvider h1={seo.h1}>
      <MoneyProvider currency="toman">
        <LiveSocialProvider value={live}>
          <Component hero={decisions["page-social-list-hero"]?.offer} texture={textures[decisions["page-social-list-hero-texture"]?.offer ?? "F"]} icons={icons[decisions["page-social-list-hero-icons"]?.offer ?? "F"]} object={objects[decisions["page-social-list-hero-object"]?.offer ?? "A"]} bg={backdrops[decisions["page-social-list-hero-bg"]?.offer ?? "F"]} />
        </LiveSocialProvider>
      </MoneyProvider>
    </PageHeadingProvider>
  );
}
