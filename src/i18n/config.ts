import { EDITION, EDITION_LOCALES } from "./edition";

// The site's languages come from its edition (./edition.ts). The first one lives at "/" with no prefix, any other
// under its own ("/en/..." while one site serves both). The middleware turns "/en/x" into "/x" with an x-locale
// header, so the same pages serve every language.
export type Locale = "fa" | "en";
export const LOCALES: Locale[] = EDITION_LOCALES;
export const DEFAULT_LOCALE: Locale = EDITION === "en" ? "en" : "fa";
export const LOCALE_HEADER = "x-locale";

export const dirOf = (l: Locale) => (l === "fa" ? "rtl" : "ltr");

// The languages that live under a prefix ("en" while one site serves both; none on a one-language site).
const PREFIXED = LOCALES.filter((l) => l !== DEFAULT_LOCALE);

// Paths that are not pages (or not translated): left alone by the middleware and by localized links.
export const isUnlocalized = (path: string) => /^\/(design|api|_next|image|upload|favicon)/.test(path) || /\.[a-z0-9]+$/i.test(path);

// The language a path is in: its prefix's, or the site's main one.
export const localeOfPath = (path: string): Locale =>
  PREFIXED.find((l) => path === `/${l}` || path.startsWith(`/${l}/`)) ?? DEFAULT_LOCALE;

// "/virtual-number" in a locale: "/virtual-number" for the site's main language, "/en/virtual-number" for a prefixed one.
export function localePath(path: string, locale: Locale): string {
  if (!path.startsWith("/") || path.startsWith("//") || isUnlocalized(path)) return path;
  const bare = stripLocale(path);
  if (!PREFIXED.includes(locale)) return bare;
  return bare === "/" ? `/${locale}` : `/${locale}${bare}`;
}

export function stripLocale(path: string): string {
  for (const l of PREFIXED) {
    if (path === `/${l}`) return "/";
    if ([`/${l}/`, `/${l}?`, `/${l}#`].some((p) => path.startsWith(p))) {
      const rest = path.slice(l.length + 1);
      return rest.startsWith("/") ? rest : `/${rest}`;
    }
  }
  return path;
}
