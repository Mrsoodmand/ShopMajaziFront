import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLocale, getT } from "@/i18n/server";
import { getSection } from "@/design/registry";
import { readDecisions } from "@/components/design/decisions";
import { LiveSocialOrderProvider, type LiveSocialOrder } from "@/design/social/live";
import { MoneyProvider } from "@/lib/money";
import { isNotFound, storefront } from "@/lib/backend";
import { display, toLiveServices, toSocialCategories, type ApiServiceDetail, type ApiServicePlatform, type ApiVirtualServices } from "@/lib/social";
import type { SocialCategory } from "@/content/social-categories-en";

// Shared by /virtual-service/{platform} and /virtual-service/{platform}/{service} (opens on that service, with its
// own SEO and FAQ). Platforms, services, packages, fields and prices come from React admin › Virtual services.

type Locale = "en" | "fa";
type Loaded = {
  platform: SocialCategory;
  platforms: SocialCategory[];
  page: ApiServicePlatform | null;
  detail: ApiServiceDetail | null;
  error?: string;
};

const get = <T,>(path: string, revalidate: number) => storefront<T>(path, revalidate);

async function load(platform: string, service: string | undefined, locale: Locale): Promise<Loaded> {
  const enc = encodeURIComponent;
  const [list, page, detail] = await Promise.all([
    get<ApiVirtualServices>("virtual-services", 60).catch(() => null),
    get<ApiServicePlatform>(`virtual-services/${enc(platform)}`, 30).catch((e) => (isNotFound(e) ? notFound() : null)),
    service ? get<ApiServiceDetail>(`virtual-services/${enc(platform)}/${enc(service)}`, 60).catch((e) => (isNotFound(e) ? notFound() : null)) : null,
  ]);
  const platforms = list ? toSocialCategories(list, locale) : [];
  const own = page
    ? toSocialCategories({ categories: [{ ...page.category, logo: page.category.image, featured: false, sort: 0, from_per_1000: null, services: [] }] }, locale)[0]
    : null;
  const listed = platforms.find((p) => p.slug === platform);
  const current = listed ?? own ?? { slug: platform, name: platform, short: "", color: "#475569", order: 0, services: [] };
  const t = await getT();
  return { platform: current, platforms, page, detail, error: page && (!service || detail) ? undefined : t("Services are unavailable right now. Please try again in a minute.") };
}

// Admin HTML (the old site's article) as plain headings and paragraphs: no markup from the database reaches the page.
function articleBlocks(html: string | null | undefined): { kind: "h" | "p"; text: string }[] {
  if (!html) return [];
  const decode = (s: string) => s
    .replace(/<[^>]+>/g, " ")
    .replace(/&zwnj;/g, "‌").replace(/&nbsp;/g, " ").replace(/&quot;/g, "\"").replace(/&#0?39;|&apos;/g, "'")
    .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n)).replace(/&amp;/g, "&")
    .replace(/\s+/g, " ").trim();
  return [...html.matchAll(/<(h[1-6]|p|li)\b[^>]*>([\s\S]*?)<\/\1>/gi)]
    .map((m) => ({ kind: (m[1][0].toLowerCase() === "h" ? "h" : "p") as "h" | "p", text: decode(m[2]) }))
    .filter((b) => b.text);
}

export async function socialOrderMetadata(platform: string, service?: string): Promise<Metadata> {
  const locale: Locale = (await getLocale()) === "fa" ? "fa" : "en";
  const t = await getT();
  const { platform: p, page, detail } = await load(platform, service, locale);
  const canonical = `/virtual-service/${platform}${service ? `/${service}` : ""}`;
  // The admin's SEO texts are Persian; the English site gets its own.
  const seo = locale === "fa" ? (detail ? detail.service.seo : page?.category.seo) : null;
  const name = detail ? (locale === "fa" ? detail.service.name : display(detail.service.en_name || detail.service.name)) : null;
  return {
    title: seo?.meta_title || (name ? t("{0} — {1} — ShopMajazi", { 0: name, 1: p.name }) : t("Buy {0} services — ShopMajazi", { 0: p.name })),
    description: seo?.meta_desc || t("{0} services: pick a package, paste the link and pay with your wallet or card. We never ask for your password.", { 0: p.name }),
    alternates: { canonical },
  };
}

export async function SocialOrderPage({ platform, service }: { platform: string; service?: string }) {
  const locale: Locale = (await getLocale()) === "fa" ? "fa" : "en";
  const t = await getT();
  const [decisions, loaded] = await Promise.all([readDecisions(), load(platform, service, locale)]);
  const { platform: p, platforms, page, detail, error } = loaded;
  const services = page ? toLiveServices(page.services, locale) : [];
  const own = detail && services.find((s) => s.id === detail.service.id);
  const live: LiveSocialOrder = {
    platforms, platform: p, services,
    initialService: own ? own.slug : undefined,
    title: own ? own.name : t("Buy {0} services", { 0: p.name }),
    sub: p.short || t("Pick a service and an amount, paste the link and pay. We never ask for your password."),
    // The article and FAQ are written in Persian in the admin.
    article: locale === "fa" ? (() => {
      const blocks = articleBlocks(detail ? detail.service.content : page?.category.content);
      return blocks.length ? { title: own ? t("More about {0}", { 0: own.name }) : t("About {0} services", { 0: p.name }), blocks } : undefined;
    })() : undefined,
    faq: locale === "fa" ? detail?.service.faq : undefined,
    error,
  };
  // The page design chosen in /design/page-social (A). Only A reads the live data so far.
  const section = getSection("page-social")!;
  const offer = section.offers.find((o) => o.id === decisions["page-social"]?.offer) ?? section.offers.find((o) => o.id === "A")!;
  const { Component } = offer;
  return (
    <MoneyProvider currency="toman">
      <LiveSocialOrderProvider value={live}>
        <Component />
      </LiveSocialOrderProvider>
    </MoneyProvider>
  );
}
