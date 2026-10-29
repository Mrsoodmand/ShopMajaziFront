import type { Metadata } from "next";
import { headers } from "next/headers";
import { getLocale } from "@/i18n/server";
import { storefront } from "@/lib/backend";

// H1, meta title, meta description and share image the admin sets per page (React admin › SEO, backend
// App\Services\PageSeo; GET /api/v1/storefront/seo). Written in Persian, so only the Persian site uses them; the
// English site and anything left empty keep the page's own text.

export type SeoKey =
  | "virtual-number" | "google-voice" | "rent-number"
  | "apple-id" | "apple-id-usa" | "apple-id-custom"
  | "accounts" | "telegram-stars" | "telegram-premium" | "telegram-ads" | "virtual-service";

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

// Share images need a full address; build it from the host this page was asked for.
async function absolute(path: string) {
  if (/^https?:\/\//.test(path)) return path;
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? (/^(localhost|127\.)/.test(host) ? "http" : "https");
  return `${proto}://${host}${path}`;
}

// The page's own metadata with the admin's title, description and share image laid over it.
export async function seoMetadata(key: SeoKey, base: Metadata): Promise<Metadata> {
  const seo = await pageSeo(key);
  const title = seo.title ?? (typeof base.title === "string" ? base.title : undefined);
  const description = seo.description ?? base.description ?? undefined;
  const image = seo.image ? await absolute(seo.image) : undefined;
  return {
    ...base,
    ...(title && { title }),
    ...(description && { description }),
    openGraph: { ...base.openGraph, ...(title && { title }), ...(description && { description }), ...(image && { images: [{ url: image, width: 1200, height: 630 }] }) },
    ...(image && { twitter: { card: "summary_large_image", images: [image] } }),
  };
}
