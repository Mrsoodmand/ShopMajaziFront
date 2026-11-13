import type { ComponentType } from "react";
import type { Metadata } from "next";
import { getLocale, getT } from "@/i18n/server";
import { makeT, toman } from "@/i18n/translate";
import { getSection } from "@/design/registry";
import { readDecisions } from "@/components/design/decisions";
import { ExtrasSlot } from "@/design/service/slot";
import LiveServiceExtras from "@/design/service/LiveServiceExtras";
import { LiveSubsProvider, type LiveSubs } from "@/design/subs/live";
import SingleA from "@/design/subSingle/SingleA";
import SingleB from "@/design/subSingle/SingleB";
import SingleC from "@/design/subSingle/SingleC";
import SingleD from "@/design/subSingle/SingleD";
import SingleE from "@/design/subSingle/SingleE";
import { MoneyProvider } from "@/lib/money";
import { isNotFound, storefront } from "@/lib/backend";
import { toSubProduct, toSubProducts, type ApiSub, type ApiSubDetail } from "@/lib/subs";
import { articleBlocks, articleSections, repeats } from "@/lib/article";
import type { SubProduct } from "@/content/subs-en";
import { PageHeadingProvider } from "@/components/seo/PageHeading";
import { pageSeo, seoMetadata } from "@/lib/seo";

// Shared by /accounts (the catalog, opens on the first popular subscription) and /accounts/{slug} (one
// subscription's own page with more detail and its own buy box). Products, plans and toman prices come from the
// backend (React admin › accounts; see lib/subs.ts), and buying goes through it (design/subs/parts.tsx useSubs).

// Single-subscription designs by offer id (the registry holds previews of these for the comparison page).
const singles: Record<string, ComponentType<{ slug?: string; panel?: string }>> = { A: SingleA, B: SingleB, C: SingleC, D: SingleD, E: SingleE };

const localeOf = async () => ((await getLocale()) === "fa" ? "fa" : "en") as "en" | "fa";

// Every live subscription. Short cache: prices follow the dollar rate.
async function loadSubs(locale: "en" | "fa"): Promise<LiveSubs> {
  try {
    return { products: toSubProducts((await storefront<{ accounts: ApiSub[] }>("accounts", 60)).accounts, locale) };
  } catch (e) {
    console.error("accounts: backend unavailable", e);
    return { products: [], error: makeT(locale)("Subscriptions are unavailable right now. Please try again in a minute.") };
  }
}

// One subscription with its SEO, or null when there's no such live subscription. Throws when the backend is down.
export async function loadSub(slug: string): Promise<ApiSubDetail | null> {
  try {
    return (await storefront<{ account: ApiSubDetail }>(`accounts/${encodeURIComponent(slug)}`, 60)).account;
  } catch (e) {
    if (isNotFound(e)) return null;
    throw e;
  }
}

// The admin's own article for a subscription (admin › accounts › متن صفحه: the short text, then the full one), as
// guide sections. Persian only: the admin writes it in Persian. The short text often restates the full one's
// opening; those paragraphs are left out.
async function loadGuide(slug: string): Promise<SubProduct["guide"]> {
  let raw: ApiSubDetail | null = null;
  try { raw = await loadSub(slug); } catch { return undefined; }
  if (!raw) return undefined;
  const full = articleBlocks(raw.content);
  const short = articleBlocks(raw.short_detail).filter((b) => b.kind === "h" || !full.some((f) => f.kind === "p" && repeats(b.text, f.text)));
  const t = makeT("fa");
  const sections = articleSections([...short, ...full], t("More about {0}", { 0: raw.name }));
  return sections.length ? sections : undefined;
}

export async function accountsMetadata(slug?: string): Promise<Metadata> {
  const t = await getT();
  // The list page takes the admin's SEO (React admin › SEO); each subscription's own page its own (admin › accounts).
  if (!slug) return seoMetadata("accounts", {
    title: t("Premium subscriptions without a foreign card — ShopMajazi"),
    description: t("Buy premium app subscriptions with your wallet or an Iranian bank card. Each one shows how it's activated and how long it takes."),
    alternates: { canonical: "/accounts" },
  });
  let raw: ApiSubDetail | null = null;
  try { raw = await loadSub(slug); } catch { /* backend down: the page says so */ }
  // Unknown or switched-off product: the 404 page (app/not-found.tsx) is shown, so give it its title.
  if (!raw) return { title: `${t("We couldn't find that page")} — ${t("ShopMajazi")}`, robots: { index: false } };
  const locale = await localeOf();
  const p = toSubProduct(raw, locale);
  const from = Math.min(...p.plans.map((pl) => pl.price));
  const how = t(p.activation === "ready" ? "Delivered as a ready account" : "Activated on your own account");
  const own = {
    title: t("Buy {0} from {1} — ShopMajazi", { 0: p.name, 1: toman(from, locale) }),
    description: [p.tagline, `${how}${p.delivery ? (locale === "fa" ? "، " : ", ") + (locale === "fa" ? p.delivery : p.delivery.toLowerCase()) : ""}`, p.plans.map((pl) => pl.name).join(locale === "fa" ? "، " : ", ")]
      .filter(Boolean).join(". ") + ".",
  };
  // The admin's SEO text is Persian: the Persian site uses it, the English one writes its own.
  return {
    title: (locale === "fa" && raw.seo.meta_title) || own.title,
    description: (locale === "fa" && raw.seo.meta_desc) || own.description,
    alternates: { canonical: `/accounts/${p.slug}` },
  };
}

// /accounts: the catalog design chosen in /design/page-subs (falls back to A).
// /accounts/{slug}: the single design chosen in /design/page-sub-single (falls back to A).
// Both use the product panel chosen in /design/page-subs-panel.
export async function AccountsPage({ slug }: { slug?: string }) {
  const locale = await localeOf();
  const [decisions, loaded, guide] = await Promise.all([readDecisions(), loadSubs(locale), slug && locale === "fa" ? loadGuide(slug) : undefined]);
  const live = guide ? { ...loaded, products: loaded.products.map((x) => (x.slug === slug ? { ...x, guide } : x)) } : loaded;
  const p = slug ? live.products.find((x) => x.slug === slug) : undefined;
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

  // Product data for search results (price range per subscription; toman ×10 = rial).
  const ld = p && {
    "@context": "https://schema.org", "@type": "Product", name: p.name, description: p.tagline || undefined, image: p.image,
    offers: { "@type": "AggregateOffer", priceCurrency: "IRR", lowPrice: Math.min(...p.plans.map((x) => x.price)) * 10, highPrice: Math.max(...p.plans.map((x) => x.price)) * 10, offerCount: p.plans.length },
  };

  // How to use, content, comments, FAQ and blog follow the design; each product page has its own (see extrasFor).
  return (
    <MoneyProvider currency="toman">
      <LiveSubsProvider value={live}>
        {ld && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, "\\u003c") }} />}
        <ExtrasSlot extras={<LiveServiceExtras service={p ? `subs:${p.slug}` : "subscriptions"} />} glow="rose">{page}</ExtrasSlot>
      </LiveSubsProvider>
    </MoneyProvider>
  );
}
