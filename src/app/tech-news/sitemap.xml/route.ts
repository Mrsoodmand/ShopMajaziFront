import { postsSitemap, sitemapResponse } from "@/lib/sitemap";

// /tech-news/sitemap.xml: kept for search consoles that still have it. Tech news lives in the blog now, so it lists
// the news items at their /blog/{slug} address (they're in /blog/sitemap.xml too; robots.txt no longer lists this one).
export const dynamic = "force-dynamic";

export function GET() {
  return sitemapResponse(() => postsSitemap("news"));
}
