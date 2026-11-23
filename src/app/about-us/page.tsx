import type { Metadata } from "next";
import { getT } from "@/i18n/server";
import { AboutB } from "@/design/info/offers";
import { PageHeadingProvider } from "@/components/seo/PageHeading";
import { pageSeo, seoMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return seoMetadata("about-us", {
    title: t("About us — ShopMajazi"),
    description: t("Since 1400, ShopMajazi has been bringing international services to people in Iran, with fair prices and real support."),
    alternates: { canonical: "/about-us" },
  });
}

// About us = page-about B "Bento" (decisions.json).
export default async function AboutUsPage() {
  const seo = await pageSeo("about-us");
  return <PageHeadingProvider h1={seo.h1}><AboutB /></PageHeadingProvider>;
}
