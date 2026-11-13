"use client";

import Link from "@/i18n/Link";
import { PageShell } from "../otp/parts";
import { useT } from "@/i18n/client";
import { ErrorFrame, SUPPORT_URL, popular, useErrorCode } from "./parts";

// E — "Quiet Line": editorial and text-only. The code and the title share one line split by a hairline, then
// one short paragraph and a plain list of links (home, back, popular pages, support). No cards, no icons.
export default function ErrorsE({ code: fixed }: { code?: string }) {
  const tx = useT();
  const { code, copy, switcher } = useErrorCode(fixed);
  const links: { href: string; label: string; external?: boolean }[] = [
    { href: "/", label: "Home page" },
    ...(copy.signIn ? [{ href: "/login", label: "Sign in" }] : []),
    ...(code === "404" ? popular.slice(0, 4) : []),
    { href: SUPPORT_URL, label: "Support on Telegram", external: true },
  ];
  return (
    <PageShell>
      <ErrorFrame switcher={switcher}>
        <div className="mx-auto max-w-3xl pt-14 sm:pt-24">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
            <span dir="ltr" className="font-mono text-6xl font-light tracking-tight text-slate-300 sm:text-7xl dark:text-slate-600">{code}</span>
            <span aria-hidden className="hidden h-16 w-px bg-slate-200 sm:block dark:bg-white/10" />
            <h1 className="font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">{tx(copy.title)}</h1>
          </div>
          <p className="mt-8 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-400">{tx(copy.body)} {tx(copy.hint)}</p>
          <ul className="mt-10 divide-y divide-slate-200 border-y border-slate-200 dark:divide-white/10 dark:border-white/10">
            {copy.retry && (
              <li><button type="button" onClick={() => location.reload()} className="flex w-full items-center justify-between py-4 text-start text-slate-900 transition hover:ps-2 dark:text-white"><span className="font-semibold">{tx("Try again")}</span><span aria-hidden className="text-slate-400 rtl:rotate-180">→</span></button></li>
            )}
            {links.map((l) => (
              <li key={l.href}>
                {l.external ? (
                  <a href={l.href} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between py-4 text-slate-700 transition hover:ps-2 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"><span>{tx(l.label)}</span><span aria-hidden className="text-slate-400">↗</span></a>
                ) : (
                  <Link href={l.href} className="flex items-center justify-between py-4 text-slate-700 transition hover:ps-2 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"><span>{tx(l.label)}</span><span aria-hidden className="text-slate-400 rtl:rotate-180">→</span></Link>
                )}
              </li>
            ))}
          </ul>
        </div>
      </ErrorFrame>
    </PageShell>
  );
}
