// Persian is the main site at "/", English lives under "/en". The middleware turns "/en/x" into "/x" with an
// x-locale header, so the same pages serve both languages.
export type Locale = "fa" | "en";
export const LOCALES: Locale[] = ["fa", "en"];
export const DEFAULT_LOCALE: Locale = "fa";
export const LOCALE_HEADER = "x-locale";

export const dirOf = (l: Locale) => (l === "fa" ? "rtl" : "ltr");

// Paths that are not pages (or not translated): left alone by the middleware and by localized links.
export const isUnlocalized = (path: string) => /^\/(design|api|_next|image|upload|favicon)/.test(path) || /\.[a-z0-9]+$/i.test(path);

// "/virtual-number" in a locale: "/virtual-number" (fa) or "/en/virtual-number" (en).
export function localePath(path: string, locale: Locale): string {
  if (!path.startsWith("/") || path.startsWith("//") || isUnlocalized(path)) return path;
  const bare = stripLocale(path);
  return locale === DEFAULT_LOCALE ? bare : bare === "/" ? "/en" : `/en${bare}`;
}

export function stripLocale(path: string): string {
  return path === "/en" ? "/" : path.startsWith("/en/") || path.startsWith("/en?") || path.startsWith("/en#") ? path.slice(3) || "/" : path;
}
