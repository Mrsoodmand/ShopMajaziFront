import type { Metadata } from "next";
import { getLocale, getT } from "@/i18n/server";
import { storefront } from "@/lib/backend";
import { SITE_URL } from "@/lib/sitemap";

// H1, meta title, meta description and share image the admin sets per page (React admin › SEO, backend
// App\Services\PageSeo; GET /api/v1/storefront/seo). Written in Persian, so only the Persian site uses them; the
// English site and anything left empty keep the page's own text.

export type SeoKey =
  | "virtual-number" | "google-voice" | "rent-number"
  | "apple-id" | "apple-id-usa" | "apple-id-custom"
  | "accounts" | "telegram-stars" | "telegram-premium" | "telegram-ads" | "virtual-service"
  | "contact-us" | "faq" | "about-us";

export type PageSeo = { h1?: string; title?: string; description?: string; image?: string };

export async function pageSeo(key: SeoKey): Promise<PageSeo> {
  if ((await getLocale()) !== "fa") return {};
  try {
    const d = await storefront<{ pages: Record<string, PageSeo> }>("seo", 60);
    return d.pages[key] ?? {};
  } catch (e) {
    console.error("seo: backend unavailable", e);
    return {};
  }
}

// A full address on the site's own domain, for share images and structured data. Built from SITE_URL, not from the
// request: behind Apache, Next.js sees every request as plain http, so request-built addresses came out as http://.
export function absolute(path: string) {
  if (/^https?:\/\//.test(path)) return path;
  return `${SITE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
}

// The logo as a square picture (src/app/share-image.png), for link previews of pages without an image of their own.
export const SHARE_LOGO = { url: "/share-image.png", width: 600, height: 600 };

// The site's own title and description: the root layout's defaults and the home page's.
export async function siteTexts() {
  const t = await getT();
  return {
    title: t("ShopMajazi — Digital services, delivered instantly"),
    description: t("Virtual numbers, Google Voice, Apple ID, subscriptions and social growth services."),
  };
}

// What link previews (Telegram, WhatsApp, X…) read besides the title: site name, language, the page's address and a
// picture (the page's own, else the logo). A page's `openGraph` replaces its parent's whole, so the layout's defaults
// never reach a page that sets one: every page's metadata goes through here instead. Twitter's title, description
// and image are filled in from these by Next.js.
export async function withShare(meta: Metadata): Promise<Metadata> {
  const [locale, t] = await Promise.all([getLocale(), getT()]);
  const og = meta.openGraph ?? {};
  const canonical = meta.alternates?.canonical;
  const url = og.url ?? (typeof canonical === "string" || canonical instanceof URL ? canonical : canonical?.url);
  const title = og.title ?? (typeof meta.title === "string" ? meta.title : undefined);
  const description = og.description ?? meta.description ?? undefined;
  const own = og.images !== undefined;
  return {
    ...meta,
    openGraph: {
      type: "website",
      siteName: t("ShopMajazi"),
      locale: locale === "fa" ? "fa_IR" : "en_US",
      ...(url && { url }),
      ...(title && { title }),
      ...(description && { description }),
      ...og,
      images: own ? og.images : [{ ...SHARE_LOGO, alt: t("ShopMajazi") }],
    },
    twitter: { card: own ? "summary_large_image" : "summary", ...meta.twitter },
  };
}

// The page's own metadata with the admin's title, description and share image laid over it.
export async function seoMetadata(key: SeoKey, base: Metadata): Promise<Metadata> {
  const seo = await pageSeo(key);
  const title = seo.title ?? (typeof base.title === "string" ? base.title : undefined);
  const description = seo.description ?? base.description ?? undefined;
  const image = seo.image ? absolute(seo.image) : undefined;
  return withShare({
    ...base,
    ...(title && { title }),
    ...(description && { description }),
    openGraph: { ...base.openGraph, ...(title && { title }), ...(description && { description }), ...(image && { images: [{ url: image, width: 1200, height: 630 }] }) },
  });
}
