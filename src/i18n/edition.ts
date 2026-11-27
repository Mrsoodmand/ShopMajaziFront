// Which site this build is. Set when the site is built (deploy/deploy.env › SITE_EDITION, written to .env.production
// as NEXT_PUBLIC_SITE_EDITION by deploy/remote.sh › frontend_env), so the browser code knows it too:
//   fa  — shopmajazi.com: Persian only, at "/".
//   en  — the English site: English only, at "/" (more languages can join later, each under its own prefix).
//   all — Persian at "/" and English under "/en", both on one site: what `npm run dev` runs, to build and preview both.
// next.config.ts reads the same variables itself (it can't import this file).
export type Edition = "fa" | "en" | "all";

const raw = process.env.NEXT_PUBLIC_SITE_EDITION;
export const EDITION: Edition =
  raw === "fa" || raw === "en" || raw === "all" ? raw : process.env.NODE_ENV === "production" ? "fa" : "all";

// The languages this site serves; the first one lives at "/".
export const EDITION_LOCALES: ("fa" | "en")[] = EDITION === "all" ? ["fa", "en"] : [EDITION];

const site = (url: string | undefined) => (url ?? "").trim().replace(/\/$/, "");
// The other site's address, for links and old URLs that belong there ("" while the English site has none yet).
export const PERSIAN_SITE_URL = site(process.env.NEXT_PUBLIC_PERSIAN_SITE_URL) || "https://shopmajazi.com";
export const ENGLISH_SITE_URL = site(process.env.NEXT_PUBLIC_ENGLISH_SITE_URL);

// SITE_INDEX=0 keeps search engines out (robots.txt disallows everything, every page says noindex): the English site
// until it opens to customers.
export const SITE_INDEXED = process.env.NEXT_PUBLIC_SITE_INDEX !== "0";

// The blog's posts are written in Persian, so the English site has no blog.
export const HAS_BLOG = EDITION !== "en";

// Metadata for the English-only pages (/landing/*): hidden from search engines on the Persian site, where they stay
// only until the English site has an address (next.config.ts then sends them there).
export const ENGLISH_ONLY: { robots?: { index: false } } = EDITION === "fa" ? { robots: { index: false } } : {};
