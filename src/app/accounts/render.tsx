import type { ComponentType } from "react";
import type { Metadata } from "next";
import { getT } from "@/i18n/server";
import { getSection } from "@/design/registry";
import { readDecisions } from "@/components/design/decisions";
import { subBySlug, type SubProduct } from "@/content/subs-en";
import { ExtrasSlot } from "@/design/service/slot";
import ServiceExtras from "@/design/service/ServiceExtras";
import SingleA from "@/design/subSingle/SingleA";
import SingleB from "@/design/subSingle/SingleB";
import SingleC from "@/design/subSingle/SingleC";
import SingleD from "@/design/subSingle/SingleD";
import SingleE from "@/design/subSingle/SingleE";
import { PageHeadingProvider } from "@/components/seo/PageHeading";
import { pageSeo, seoMetadata } from "@/lib/seo";

// Shared by /accounts (the catalog, opens on ChatGPT Plus) and /accounts/{slug} (one subscription's own page with
// more detail and its own buy box).

// Single-subscription designs by offer id (the registry holds previews of these for the comparison page).
const singles: Record<string, ComponentType<{ slug?: string; panel?: string }>> = { A: SingleA, B: SingleB, C: SingleC, D: SingleD, E: SingleE };

export async function accountsMetadata(raw?: SubProduct): Promise<Metadata> {
  const t = await getT();
  // The list page takes the admin's SEO (React admin › SEO); each subscription's own page keeps its own.
  if (!raw) return seoMetadata("accounts", {
    title: t("Premium subscriptions: ChatGPT, Netflix, Spotify, Canva and more — ShopMajazi"),
    description: t("Buy ChatGPT Plus, Netflix, Spotify, Canva Pro and more without a foreign card. Most are activated on your own account; you never share a password."),
    alternates: { canonical: "/accounts" },
  });
  const p = t.tr(raw);
  const from = Math.min(...p.plans.map((pl) => pl.price));
  const how = t(p.activation === "own" ? "Activated on your own account" : "Delivered as a ready account");
  return {
    title: t("Buy {0} from {1} — ShopMajazi", { 0: p.name, 1: `$${from.toFixed(2)}` }),
    description: t.locale === "fa"
      ? `${p.tagline}. ${how}، ${p.delivery}. ${p.plans.map((pl) => pl.name).join("، ")}.`
      : `${p.tagline}. ${how}, ${p.delivery.toLowerCase()}. ${p.plans.map((pl) => pl.name).join(", ")}.`,
    alternates: { canonical: `/accounts/${p.slug}` },
  };
}

// /accounts: the catalog design chosen in /design/page-subs (falls back to A).
// /accounts/{slug}: the single design chosen in /design/page-sub-single (falls back to A).
// Both use the product panel chosen in /design/page-subs-panel.
export async function AccountsPage({ slug }: { slug?: string }) {
  const decisions = await readDecisions();
  const p = slug ? subBySlug(slug) : undefined;
  const panel = decisions["page-subs-panel"]?.offer;

  let page;
  if (p) {
    const Single = singles[decisions["page-sub-single"]?.offer ?? "A"] ?? SingleA;
    page = <Single slug={p.slug} panel={panel} />;
  } else {
    const section = getSection("page-subs")!;
    const { Component } = section.offers.find((o) => o.id === decisions["page-subs"]?.offer) ?? section.offers.find((o) => o.id === "A")!;
    const seo = await pageSeo("accounts");
    page = <PageHeadingProvider h1={seo.h1}><Component panel={panel} /></PageHeadingProvider>;
  }

  // Product data for search results (price range per subscription).
  const ld = p && {
    "@context": "https://schema.org", "@type": "Product", name: p.name, description: p.tagline,
    offers: { "@type": "AggregateOffer", priceCurrency: "USD", lowPrice: Math.min(...p.plans.map((x) => x.price)), highPrice: Math.max(...p.plans.map((x) => x.price)), offerCount: p.plans.length },
  };

  // How to use, content, comments, FAQ and blog follow the design; each product page has its own (see extrasFor).
  return (
    <>
      {ld && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, "\\u003c") }} />}
      <ExtrasSlot extras={<ServiceExtras service={p ? `subs:${p.slug}` : "subscriptions"} />} glow="rose">{page}</ExtrasSlot>
    </>
  );
}
