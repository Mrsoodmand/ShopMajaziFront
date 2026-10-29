import type { Metadata } from "next";
import { getT } from "@/i18n/server";
import { getSection } from "@/design/registry";
import { readDecisions } from "@/components/design/decisions";
import { ExtrasSlot } from "@/design/service/slot";
import ServiceExtras from "@/design/service/ServiceExtras";
import { PageHeadingProvider } from "@/components/seo/PageHeading";
import { pageSeo, seoMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return seoMetadata("rent-number", {
    title: t("Rent a phone number for unlimited SMS (1 week to 1 month) — ShopMajazi"),
    description: t("Rent a number for all your apps or for one app, from 12 countries. Unlimited SMS for a week to a month, extend any time."),
    alternates: { canonical: "/rent-number" },
  });
}

// The live Rent Number page: renders whichever page design is chosen in /design/page-rent (falls back to G).
export default async function RentNumberPage() {
  const seo = await pageSeo("rent-number");
  const decisions = await readDecisions();
  const section = getSection("page-rent")!;
  const offer = section.offers.find((o) => o.id === decisions["page-rent"]?.offer) ?? section.offers.find((o) => o.id === "G")!;
  const { Component } = offer;
  // How to use, content, comments, FAQ and blog follow the design (see ServiceExtras).
  return <PageHeadingProvider h1={seo.h1}><ExtrasSlot extras={<ServiceExtras service="rent-number" />} glow="amber"><Component /></ExtrasSlot></PageHeadingProvider>;
}
