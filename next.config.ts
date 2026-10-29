import type { NextConfig } from "next";

const BACKEND_URL = (process.env.BACKEND_URL ?? "http://127.0.0.1:8001").replace(/\/$/, "");

const nextConfig: NextConfig = {
  async redirects() {
    // Older links use the plural form; the live page is /virtual-number.
    return [{ source: "/virtual-numbers", destination: "/virtual-number", permanent: true }];
  },
  async rewrites() {
    // The browser talks to the Laravel backend through this site: storefront API calls, and the images and
    // uploads it serves (app logos, flags, blog images), whose paths the API returns as "/image/...", "/upload/...".
    return {
      beforeFiles: [],
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
