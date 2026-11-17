import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/sitemap";

// /robots.txt (used to be a file in Laravel's public folder).
export default function robots(): MetadataRoute.Robots {
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
    sitemap: [`${SITE_URL}/sitemap.xml`, `${SITE_URL}/blog/sitemap.xml`],
  };
}
