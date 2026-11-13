import { NextResponse, type NextRequest } from "next/server";
import { LOCALE_HEADER, isUnlocalized } from "@/i18n/config";

// Sets the request's language for the pages: "/en/..." is English, everything else Persian (the default, no prefix).
// It only sets a request header. Stripping "/en" is a rewrite in next.config.ts, and "/fa/..." → "/..." a redirect
// there: rewriting or redirecting here needs an absolute URL, and behind Apache the server's own origin
// (HOSTNAME=127.0.0.1) differs from the one middleware builds (localhost), so Next.js proxied "/en" back to itself
// as "/" (Persian) and redirected "/fa" to http://localhost:3005/.
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (isUnlocalized(pathname)) return NextResponse.next();
  const headers = new Headers(req.headers);
  headers.set(LOCALE_HEADER, pathname === "/en" || pathname.startsWith("/en/") ? "en" : "fa");
  return NextResponse.next({ request: { headers } });
}

export const config = { matcher: ["/((?!_next/|api/|image/|upload/|favicon).*)"] };
