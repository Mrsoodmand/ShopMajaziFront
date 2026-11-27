import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/sitemap";
import { HAS_BLOG, SITE_INDEXED } from "@/i18n/edition";

// /robots.txt (used to be a file in Laravel's public folder). A site not open to search engines yet (SITE_INDEX=0,
// src/i18n/edition.ts) keeps every crawler out.
export default function robots(): MetadataRoute.Robots {
  if (!SITE_INDEXED) return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: {
      userAgent: "*",
      disallow: [
        "/cgi-bin/",
        "/admin/",
        "/_laravel/",
        "/api/",
        // Old site's form and polling endpoints
        "/login/reset-password-v2",
        "/login/new-register-code",
        "/login/fast-login-code",
        "/static-ip/submit-order",
        "/virtual-number/get-virtual-numbers",
        "/virtual-number/get-virtual-single-number",
      ],
    },
    sitemap: [`${SITE_URL}/sitemap.xml`, ...(HAS_BLOG ? [`${SITE_URL}/blog/sitemap.xml`] : [])],
  };
}
