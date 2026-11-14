"use client";

import { useState, type ReactNode } from "react";
import { ArrowLeft, Home, LifeBuoy, RotateCw, Search } from "lucide-react";
import Link from "@/i18n/Link";
import { useT } from "@/i18n/client";

// Error pages (section "errors" in /design). Each offer renders one status code; with no `code` it is a preview
// and shows a switcher so every code can be checked. The live pages (app/not-found.tsx, app/error.tsx, and
// Laravel's resources/views/errors/*) use the chosen offer with a fixed code.

import { ERROR_CODES, errorCopy, isCode, type Copy, type ErrorCode } from "./copy";
export { ERROR_CODES, errorCopy, isCode, type ErrorCode };

// Popular destinations offered on the 404 page.
export const popular: { href: string; label: string }[] = [
  { href: "/virtual-number", label: "Virtual numbers" },
  { href: "/apple-id", label: "Apple ID" },
  { href: "/google-voice", label: "Google Voice" },
  { href: "/accounts", label: "Premium accounts" },
  { href: "/telegram/premium", label: "Telegram Premium" },
  { href: "/blog", label: "Blog" },
];

export const SUPPORT_URL = "https://t.me/shopmajazi";

// The code the offer shows: fixed on a live page, chosen with the switcher in a preview.
export function useErrorCode(fixed?: string) {
  const [picked, setPicked] = useState<ErrorCode>("404");
  const code: ErrorCode = isCode(fixed) ? fixed : picked;
  const switcher = isCode(fixed) ? null : <CodeSwitch value={picked} onChange={setPicked} />;
  return { code, copy: errorCopy[code], switcher };
}

function CodeSwitch({ value, onChange }: { value: ErrorCode; onChange: (c: ErrorCode) => void }) {
  return (
    <div dir="ltr" className="sticky top-16 z-20 mx-auto flex w-fit flex-wrap justify-center gap-1 rounded-full border border-slate-200 bg-white/90 p-1 shadow-sm backdrop-blur dark:border-white/10 dark:bg-slate-900/90">
      {ERROR_CODES.map((c) => (
        <button key={c} type="button" onClick={() => onChange(c)}
          className={`rounded-full px-3 py-1 font-mono text-xs font-semibold transition ${c === value ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900" : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"}`}>
          {c}
        </button>
      ))}
    </div>
  );
}

// The main way out for each code: Try again (when retrying can help), Sign in, or Home.
export function Actions({ copy, center = false, onRetry }: { copy: Copy; center?: boolean; onRetry?: () => void }) {
  const tx = useT();
  const retry = onRetry ?? (() => window.location.reload());
  const primary = "inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200";
  const ghost = "inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-900 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:text-white";
  return (
    <div className={`flex flex-wrap gap-3 ${center ? "justify-center" : ""}`}>
      {copy.retry && <button type="button" onClick={retry} className={primary}><RotateCw className="h-4 w-4" />{tx("Try again")}</button>}
      {copy.signIn && <Link href="/login" className={primary}>{tx("Sign in")}</Link>}
      <Link href="/" className={copy.retry || copy.signIn ? ghost : primary}><Home className="h-4 w-4" />{tx("Go to home page")}</Link>
      <button type="button" onClick={() => history.back()} className={ghost}><ArrowLeft className="h-4 w-4 rtl:rotate-180" />{tx("Go back")}</button>
    </div>
  );
}

export function SupportLink({ className = "" }: { className?: string }) {
  const tx = useT();
  return (
    <a href={SUPPORT_URL} target="_blank" rel="noopener noreferrer" className={`inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 underline-offset-4 hover:text-slate-900 hover:underline dark:text-slate-400 dark:hover:text-white ${className}`}>
      <LifeBuoy className="h-4 w-4" />{tx("Message support on Telegram")}
    </a>
  );
}

// Site search that hands off to the blog/catalog search page.
export function ErrorSearch({ big = false }: { big?: boolean }) {
  const tx = useT();
  return (
    <form action="/virtual-service" className={`relative w-full ${big ? "max-w-xl" : "max-w-md"}`}>
      <Search className="pointer-events-none absolute start-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
      <input name="q" type="search" placeholder={tx("Search services, apps or countries")}
        className={`w-full rounded-2xl border border-slate-200 bg-white ps-12 pe-4 text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-900/5 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:border-white/30 ${big ? "py-4 text-base" : "py-3 text-sm"}`} />
    </form>
  );
}

export function PopularLinks({ center = false }: { center?: boolean }) {
  const tx = useT();
  return (
    <div className={`flex flex-wrap gap-2 ${center ? "justify-center" : ""}`}>
      {popular.map((p) => (
        <Link key={p.href} href={p.href} className="rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-sm text-slate-600 transition hover:border-slate-300 hover:text-slate-900 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:text-white">
          {tx(p.label)}
        </Link>
      ))}
    </div>
  );
}

// Frame used by every offer: the switcher (previews only) above the page body.
export function ErrorFrame({ switcher, children }: { switcher: ReactNode; children: ReactNode }) {
  return (
    // Fills the first screen under the header and centres the message in it, so a short error (500) doesn't sit at
    // the top with an empty block between it and the footer.
    <section className="relative flex min-h-[calc(100svh-4rem)] flex-col justify-center px-4 py-12 sm:px-6">
      {switcher && <div className="mb-8">{switcher}</div>}
      {children}
    </section>
  );
}
