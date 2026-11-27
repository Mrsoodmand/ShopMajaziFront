import type { NextConfig } from "next";

const BACKEND_URL = (process.env.BACKEND_URL ?? "http://127.0.0.1:8001").replace(/\/$/, "");

// Which site this build is: fa (shopmajazi.com, Persian only), en (the English site) or all (both languages, what
// `npm run dev` runs). The same variables as src/i18n/edition.ts, which this file can't import.
const raw = process.env.NEXT_PUBLIC_SITE_EDITION;
const EDITION = raw === "fa" || raw === "en" || raw === "all" ? raw : process.env.NODE_ENV === "production" ? "fa" : "all";
const site = (url: string | undefined) => (url ?? "").trim().replace(/\/$/, "");
const PERSIAN_SITE_URL = site(process.env.NEXT_PUBLIC_PERSIAN_SITE_URL) || "https://shopmajazi.com";
const ENGLISH_SITE_URL = site(process.env.NEXT_PUBLIC_ENGLISH_SITE_URL);

// A path with no page here, for addresses the English site doesn't have: it answers with the site's 404 page.
const NOT_HERE = "/__not-on-this-site";

type Redirect = { source: string; destination: string; permanent: boolean };

function editionRedirects(): Redirect[] {
  if (EDITION === "fa") {
    // English left shopmajazi.com: old "/en/..." links go to the same page on the English site once it has an
    // address, until then (temporarily, so browsers don't keep it) to the Persian page. The English-only landing
    // pages move there too.
    return ENGLISH_SITE_URL
      ? [
          { source: "/en", destination: ENGLISH_SITE_URL, permanent: true },
          { source: "/en/:path*", destination: `${ENGLISH_SITE_URL}/:path*`, permanent: true },
          { source: "/landing/:path*", destination: `${ENGLISH_SITE_URL}/landing/:path*`, permanent: true },
        ]
      : [
          { source: "/en", destination: "/", permanent: false },
          { source: "/en/:path*", destination: "/:path*", permanent: false },
        ];
  }
  if (EDITION === "en") {
    // English is at "/" here: "/en/x" is "/x". Persian addresses ("/fa/...") belong to the Persian site.
    return [
      { source: "/en", destination: "/", permanent: true },
      { source: "/en/:path*", destination: "/:path*", permanent: true },
      { source: "/fa", destination: PERSIAN_SITE_URL, permanent: true },
      { source: "/fa/:path*", destination: `${PERSIAN_SITE_URL}/:path*`, permanent: true },
    ];
  }
  return [];
}

const nextConfig: NextConfig = {
  // The server runs this self-contained build under PM2 (deploy/remote.sh copies .next/standalone).
  output: "standalone",
  async redirects() {
    return [
      ...editionRedirects(),
      // Persian is the default and has no prefix (see src/middleware.ts).
      ...(EDITION !== "en"
        ? [
            { source: "/fa", destination: "/", permanent: true },
            { source: "/fa/:path*", destination: "/:path*", permanent: true },
          ]
        : []),
      // Older links use the plural form; the live page is /virtual-number.
      { source: "/virtual-numbers", destination: "/virtual-number", permanent: true },
      // Tech news used to have its own section on the old site; it's the "Tech News" topic of the blog now.
      // /tech-news/sitemap.xml is answered by src/app/tech-news/sitemap.xml (it lists the posts' /blog addresses).
      ...(EDITION !== "en"
        ? [
            { source: "/tech-news", destination: "/blog?topic=news", permanent: true },
            { source: "/tech-news/:slug((?!sitemap\\.xml$)[^/]+)", destination: "/blog/:slug", permanent: true },
          ]
        : []),
    ];
  },
  async rewrites() {
    // The browser talks to the Laravel backend through this site: storefront API calls, and the images and
    // uploads it serves (app logos, flags, blog images), whose paths the API returns as "/image/...", "/upload/...".
    const backend = [
      { source: "/api/v1/:path*", destination: `${BACKEND_URL}/api/v1/:path*` },
      { source: "/image/:path*", destination: `${BACKEND_URL}/image/:path*` },
      { source: "/upload/:path*", destination: `${BACKEND_URL}/upload/:path*` },
    ];
    if (EDITION === "en") {
      return {
        // The blog (its posts are Persian) and the old site's pages are not on the English site.
        beforeFiles: ["/blog", "/blog/:path*", "/tech-news", "/tech-news/:path*"].map((source) => ({ source, destination: NOT_HERE })),
        afterFiles: backend,
        // No fallback to Laravel: its pages are the old Persian site, and its admin must not answer on this domain.
        fallback: [],
      };
    }
    return {
      beforeFiles: EDITION === "all"
        ? [
            // English: "/en/x" is served by the page at "/x"; src/middleware.ts has already marked the request as English.
            { source: "/en", destination: "/" },
            { source: "/en/:path*", destination: "/:path*" },
          ]
        : [],
      afterFiles: backend,
      // Anything Next.js has no page or file for goes to the old site: the user panel (wallet top-up, orders,
      // tickets), bank callbacks and their assets. Same origin, so they share the session cookie with the new pages.
      fallback: [{ source: "/:path*", destination: `${BACKEND_URL}/:path*` }],
    };
  },
};

export default nextConfig;
