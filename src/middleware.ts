import { NextResponse, type NextRequest } from "next/server";
import { LOCALE_HEADER, isUnlocalized } from "@/i18n/config";

// "/en/..." → serve "/..." in English; "/fa/..." → redirect to "/..." (Persian is the default, no prefix);
// everything else is Persian.
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (isUnlocalized(pathname)) return NextResponse.next();

  if (pathname === "/fa" || pathname.startsWith("/fa/")) {
    const url = req.nextUrl.clone();
    url.pathname = pathname.slice(3) || "/";
    return NextResponse.redirect(url, 308);
  }

  const headers = new Headers(req.headers);
  if (pathname === "/en" || pathname.startsWith("/en/")) {
    headers.set(LOCALE_HEADER, "en");
    const url = req.nextUrl.clone();
    url.pathname = pathname.slice(3) || "/";
    return NextResponse.rewrite(url, { request: { headers } });
  }
  headers.set(LOCALE_HEADER, "fa");
  return NextResponse.next({ request: { headers } });
}

export const config = { matcher: ["/((?!_next/|api/|image/|upload/|favicon).*)"] };
