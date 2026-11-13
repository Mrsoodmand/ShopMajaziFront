import type { NextConfig } from "next";

const BACKEND_URL = (process.env.BACKEND_URL ?? "http://127.0.0.1:8001").replace(/\/$/, "");

const nextConfig: NextConfig = {
  // The server runs this self-contained build under PM2 (deploy/remote.sh copies .next/standalone).
  output: "standalone",
  async redirects() {
    return [
      // Persian is the default and has no prefix (see src/middleware.ts).
      { source: "/fa", destination: "/", permanent: true },
      { source: "/fa/:path*", destination: "/:path*", permanent: true },
      // Older links use the plural form; the live page is /virtual-number.
      { source: "/virtual-numbers", destination: "/virtual-number", permanent: true },
      // Tech news used to have its own section on the old site; it's the "Tech News" topic of the blog now.
      // Its sitemap (listed in robots.txt) still comes from the old site.
      { source: "/tech-news", destination: "/blog?topic=news", permanent: true },
      { source: "/tech-news/:slug((?!sitemap\\.xml$)[^/]+)", destination: "/blog/:slug", permanent: true },
    ];
  },
  async rewrites() {
    // The browser talks to the Laravel backend through this site: storefront API calls, and the images and
    // uploads it serves (app logos, flags, blog images), whose paths the API returns as "/image/...", "/upload/...".
    return {
      // The blog's sitemap (listed in robots.txt) is the old site's; without this, /blog/[slug] would answer it.
      beforeFiles: [
        { source: "/blog/sitemap.xml", destination: `${BACKEND_URL}/blog/sitemap.xml` },
        // English: "/en/x" is served by the page at "/x"; src/middleware.ts has already marked the request as English.
        { source: "/en", destination: "/" },
        { source: "/en/:path*", destination: "/:path*" },
      ],
      afterFiles: [
        { source: "/api/v1/:path*", destination: `${BACKEND_URL}/api/v1/:path*` },
        { source: "/image/:path*", destination: `${BACKEND_URL}/image/:path*` },
        { source: "/upload/:path*", destination: `${BACKEND_URL}/upload/:path*` },
      ],
      // Anything Next.js has no page or file for goes to the old site: the user panel (wallet top-up, orders,
      // tickets), bank callbacks and their assets. Same origin, so they share the session cookie with the new pages.
      fallback: [{ source: "/:path*", destination: `${BACKEND_URL}/:path*` }],
    };
  },
};

export default nextConfig;
