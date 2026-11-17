import { postsSitemap, sitemapResponse } from "@/lib/sitemap";

// /blog/sitemap.xml: every published post and tech-news item at /blog/{slug} (listed in robots.txt).
export const dynamic = "force-dynamic";

export function GET() {
  return sitemapResponse(() => postsSitemap());
}
