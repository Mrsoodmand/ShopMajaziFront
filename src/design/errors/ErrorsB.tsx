"use client";

import { Apple, Crown, Newspaper, Phone, Send, Smartphone, type LucideIcon } from "lucide-react";
import Link from "@/i18n/Link";
import { PageShell } from "../otp/parts";
import { useT } from "@/i18n/client";
import { Actions, ErrorFrame, ErrorSearch, SupportLink, popular, useErrorCode } from "./parts";

const icons: Record<string, LucideIcon> = { "/virtual-number": Smartphone, "/apple-id": Apple, "/google-voice": Phone, "/accounts": Crown, "/telegram/premium": Send, "/blog": Newspaper };

// B — "Search Rescue": treats a dead end as a fresh start. A big search field leads, the popular services sit
// below it as tiles, and the error itself is a small chip. Server errors (5xx) and timeouts swap the tiles for
// the retry button, since searching won't help there.
export default function ErrorsB({ code: fixed }: { code?: string }) {
  const tx = useT();
  const { code, copy, switcher } = useErrorCode(fixed);
  const findable = code === "404" || code === "400" || code === "403";
  return (
    <PageShell>
      <ErrorFrame switcher={switcher}>
        <div className="mx-auto flex max-w-4xl flex-col items-center pt-10 text-center sm:pt-16">
          <span dir="ltr" className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 font-mono text-xs font-semibold text-slate-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-400">
            <span className={`h-1.5 w-1.5 rounded-full ${code.startsWith("5") ? "bg-rose-500" : "bg-amber-500"}`} />{code}
          </span>
          <h1 className="mt-5 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl dark:text-white">{tx(copy.title)}</h1>
          <p className="mt-4 max-w-xl text-lg text-slate-600 dark:text-slate-400">{tx(copy.body)} {tx(copy.hint)}</p>
          {findable ? (
            <>
              <div className="mt-8 flex w-full justify-center"><ErrorSearch big /></div>
              <div className="mt-10 grid w-full grid-cols-2 gap-3 sm:grid-cols-3">
                {popular.map((p) => {
                  const Icon = icons[p.href] ?? Smartphone;
                  return (
                    <Link key={p.href} href={p.href} className="group flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-start transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md dark:border-white/10 dark:bg-white/5">
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-slate-100 text-slate-700 transition group-hover:bg-slate-900 group-hover:text-white dark:bg-white/10 dark:text-slate-200"><Icon className="h-5 w-5" /></span>
                      <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">{tx(p.label)}</span>
                    </Link>
                  );
                })}
              </div>
              <div className="mt-10"><Actions copy={copy} center /></div>
            </>
          ) : (
            <div className="mt-8"><Actions copy={copy} center /></div>
          )}
          <div className="mt-12"><SupportLink /></div>
        </div>
      </ErrorFrame>
    </PageShell>
  );
}
