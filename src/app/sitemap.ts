import type { MetadataRoute } from "next";
import { pagesSitemap } from "@/lib/sitemap";

// /sitemap.xml: the site's pages and products. Posts are in /blog/sitemap.xml (both listed in robots.txt).
export const dynamic = "force-dynamic";

export default function sitemap(): Promise<MetadataRoute.Sitemap> {
  return pagesSitemap();
}
