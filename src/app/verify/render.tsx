import type { ComponentType } from "react";
import type { Metadata } from "next";
import { getLocale, getT } from "@/i18n/server";
import { makeT, toman } from "@/i18n/translate";
import { readDecisions } from "@/components/design/decisions";
import { ExtrasSlot } from "@/design/service/slot";
import LiveServiceExtras, { loadLiveComments } from "@/design/service/LiveServiceExtras";
import type { LiveComments } from "@/design/service/ServiceExtras";
import { LiveSubsProvider, type LiveSubs } from "@/design/subs/live";
import SubsA from "@/design/subs/SubsA";
import SingleD from "@/design/subSingle/SingleD";
import { MoneyProvider } from "@/lib/money";
import { isNotFound, storefront } from "@/lib/backend";
import { toVerifyProduct, toVerifyProducts, type ApiVerify, type ApiVerifyDetail } from "@/lib/verify";
import { articleBlocks, articleSections, repeats } from "@/lib/article";
import type { SubProduct } from "@/content/subs-en";
import { withShare } from "@/lib/seo";

// /verify (the catalog) and /verify/{slug} (one product's own page). The user asked for the same designs as the
// Subscriptions pages: catalog A with the chosen product panel, and single page D. They run in `flavor: "verify"`
// (design/subs/live.tsx useFlavor), which swaps the links, buy endpoints (account/verification/*, multipart for
// files) and wording. Products, plans and toman prices come from the backend (React admin › وریفای).

const localeOf = async () => ((await getLocale()) === "fa" ? "fa" : "en") as "en" | "fa";

async function loadAll(locale: "en" | "fa"): Promise<LiveSubs> {
  try {
    return { flavor: "verify", products: toVerifyProducts((await storefront<{ products: ApiVerify[] }>("verifications", 60)).products, locale) };
  } catch (e) {
    console.error("verify: backend unavailable", e);
    return { flavor: "verify", products: [], error: makeT(locale)("Verification products are unavailable right now. Please try again in a minute.") };
  }
}

// One product with its page text and SEO, or null when there's no such live product. Throws when the backend is down.
export async function loadVerify(slug: string): Promise<ApiVerifyDetail | null> {
  try {
    return (await storefront<{ product: ApiVerifyDetail }>(`verifications/${encodeURIComponent(slug)}`, 60)).product;
  } catch (e) {
    if (isNotFound(e)) return null;
    throw e;
  }
}

// The admin's own article (admin › وریفای › متن صفحه) as guide sections; Persian only, like the subscriptions.
function guideOf(raw: ApiVerifyDetail): SubProduct["guide"] {
  const full = articleBlocks(raw.content);
  const short = articleBlocks(raw.short_detail).filter((b) => b.kind === "h" || !full.some((f) => f.kind === "p" && repeats(b.text, f.text)));
  const sections = articleSections([...short, ...full], makeT("fa")("More about {0}", { 0: raw.name }));
  return sections.length ? sections : undefined;
}

export async function verifyMetadata(slug?: string): Promise<Metadata> {
  const t = await getT();
  if (!slug) return withShare({
    title: t("Verified accounts and account verification — ShopMajazi"),
    description: t("Buy an account that's already verified, or have your own account verified. Pay with your wallet or an Iranian bank card; your documents stay private."),
    alternates: { canonical: "/verify" },
  });
  let raw: ApiVerifyDetail | null = null;
  try { raw = await loadVerify(slug); } catch { /* backend down: the page says so */ }
  if (!raw) return { title: `${t("We couldn't find that page")} — ${t("ShopMajazi")}`, robots: { index: false } };
  const locale = await localeOf();
  const p = toVerifyProduct(raw, locale);
  const from = Math.min(...p.plans.map((pl) => pl.price));
  const own = {
    title: t("Buy {0} from {1} — ShopMajazi", { 0: p.name, 1: toman(from, locale) }),
    description: [p.tagline, p.delivery].filter(Boolean).join(locale === "fa" ? "، " : ". ") + ".",
  };
  return withShare({
    title: (locale === "fa" && raw.seo.meta_title) || own.title,
    description: (locale === "fa" && raw.seo.meta_desc) || own.description,
    alternates: { canonical: `/verify/${p.slug}` },
  });
}

export async function VerifyPage({ slug, raw }: { slug?: string; raw?: ApiVerifyDetail | null }) {
  const locale = await localeOf();
  const [decisions, loaded] = await Promise.all([readDecisions(), loadAll(locale)]);
  const guide = raw && locale === "fa" ? guideOf(raw) : undefined;
  const live = guide ? { ...loaded, products: loaded.products.map((x) => (x.slug === slug ? { ...x, guide } : x)) } : loaded;
  const p = slug ? live.products.find((x) => x.slug === slug) : undefined;
  const panel = decisions["page-subs-panel"]?.offer;

  let page;
  let comments: LiveComments | undefined;
  if (p) {
    // Single D shows FAQ and comments in its own tabs: loaded once here and left out of the extras.
    comments = await loadLiveComments(`verify:${p.slug}`);
    const Single: ComponentType<{ slug?: string; panel?: string; comments?: LiveComments; bridge?: string }> = SingleD;
    page = <Single slug={p.slug} panel={panel} comments={comments} bridge={decisions["sub-single-bridge"]?.offer} />;
  } else {
    page = <SubsA panel={panel} />;
  }

  const ld = p && {
    "@context": "https://schema.org", "@type": "Product", name: p.name, description: p.tagline || undefined, image: p.image,
    offers: { "@type": "AggregateOffer", priceCurrency: "IRR", lowPrice: Math.min(...p.plans.map((x) => x.price)) * 10, highPrice: Math.max(...p.plans.map((x) => x.price)) * 10, offerCount: p.plans.length },
  };

  return (
    <>
    <MoneyProvider currency="toman">
      <LiveSubsProvider value={live}>
        <ExtrasSlot extras={<LiveServiceExtras service={p ? `verify:${p.slug}` : "verification"} omit={!!p} comments={comments} rule={!p} />} glow="rose">{page}</ExtrasSlot>
      </LiveSubsProvider>
    </MoneyProvider>
    {ld && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, "\\u003c") }} />}
    </>
  );
}
