import type { MetadataRoute } from "next";
import { storefront } from "./backend";
import { applePaths } from "@/content/apple-en";
import { tgPaths } from "@/content/telegram-en";
import type { ApiSub } from "./subs";
import type { ApiVerify } from "./verify";
import type { ApiVirtualServices } from "./social";
import type { ApiBlogPost } from "./blog";

// What /sitemap.xml, /blog/sitemap.xml and /tech-news/sitemap.xml list (src/app/sitemap.ts and the two route
// handlers). Every address is the page's canonical one: no redirects (/virtual-numbers, /tech-news/x), no pages
// marked noindex (/login, /account). Persian is the main site; pages with an English version say so with hreflang.

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://shopmajazi.com").replace(/\/$/, "");

const url = (path: string) => (path === "/" ? SITE_URL : `${SITE_URL}${path}`);
const en = (path: string) => url(path === "/" ? "/en" : `/en${path}`);

// A page of the new site, in Persian with its English version.
function page(path: string, priority: number, lastModified?: string | null): MetadataRoute.Sitemap[number] {
  return {
    url: url(path),
    ...(lastModified && { lastModified }),
    priority,
    alternates: { languages: { fa: url(path), en: en(path), "x-default": url(path) } },
  };
}

// Pages the old Laravel site still serves (Persian only).
const legacy = ["/static-ip", "/faq", "/contact-us", "/about-us"];

async function safe<T>(what: string, load: () => Promise<T>): Promise<T | null> {
  try {
    return await load();
  } catch (e) {
    // The pages themselves still go out; the products come back on the next request.
    console.error(`sitemap: ${what} unavailable`, e);
    return null;
  }
}

export async function pagesSitemap(): Promise<MetadataRoute.Sitemap> {
  const [subs, services, verify] = await Promise.all([
    safe("accounts", () => storefront<{ accounts: ApiSub[] }>("accounts", 600)),
    safe("virtual-services", () => storefront<ApiVirtualServices>("virtual-services", 600)),
    safe("verifications", () => storefront<{ products: ApiVerify[] }>("verifications", 600)),
  ]);

  return [
    page("/", 1),
    page("/virtual-number", 0.9),
    page("/rent-number", 0.9),
    page("/google-voice", 0.9),
    page("/apple-id", 0.9),
    ...Object.values(applePaths).map((p) => page(p, 0.8)),
    page("/accounts", 0.9),
    ...(subs?.accounts ?? []).map((s) => page(`/accounts/${encodeURIComponent(s.slug)}`, 0.8)),
    page("/verify", 0.9),
    ...(verify?.products ?? []).map((v) => page(`/verify/${encodeURIComponent(v.slug)}`, 0.8)),
    page("/virtual-service", 0.9),
    ...(services?.categories ?? []).flatMap((c) => [
      page(`/virtual-service/${encodeURIComponent(c.slug)}`, 0.8),
      ...c.services.map((s) => page(`/virtual-service/${encodeURIComponent(c.slug)}/${encodeURIComponent(s.slug)}`, 0.7)),
    ]),
    ...Object.values(tgPaths).map((p) => page(p, 0.8)),
    page("/blog", 0.7),
    ...legacy.map((p) => ({ url: url(p), priority: 0.5 })),
  ];
}

// Published posts, both kinds, at their one address /blog/{slug} (tech news included: /tech-news/{slug} redirects
// there). Posts are written in Persian and their canonical address is the Persian page, so no English alternate.
export async function postsSitemap(type?: ApiBlogPost["type"]): Promise<MetadataRoute.Sitemap> {
  const { posts } = await storefront<{ posts: ApiBlogPost[] }>("blog", 600);
  return posts
    .filter((p) => !type || p.type === type)
    .map((p) => ({
      url: url(`/blog/${encodeURIComponent(p.slug)}`),
      ...((p.published_at ?? p.created_at) && { lastModified: (p.published_at ?? p.created_at)! }),
      priority: 0.6,
    }));
}

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// A <urlset> for the route handlers (sitemap.ts gets this from Next.js).
export function sitemapXml(entries: MetadataRoute.Sitemap): string {
  const rows = entries.map((e) => {
    const mod = e.lastModified ? `<lastmod>${new Date(e.lastModified).toISOString()}</lastmod>` : "";
    return `<url><loc>${esc(e.url)}</loc>${mod}</url>`;
  });
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${rows.join("\n")}\n</urlset>\n`;
}

export async function sitemapResponse(load: () => Promise<MetadataRoute.Sitemap>): Promise<Response> {
  try {
    return new Response(sitemapXml(await load()), {
      headers: { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, max-age=3600" },
    });
  } catch (e) {
    // Backend down: a 503 makes search engines come back later, an empty list would tell them the posts are gone.
    console.error("sitemap: backend unavailable", e);
    return new Response("Sitemap temporarily unavailable", { status: 503, headers: { "Retry-After": "600" } });
  }
}
