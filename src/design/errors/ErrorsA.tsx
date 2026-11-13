"use client";

import { PageShell } from "../otp/parts";
import { useT } from "@/i18n/client";
import { Actions, ErrorFrame, ErrorSearch, PopularLinks, SupportLink, useErrorCode } from "./parts";

// A — "Big Code": the status number huge and pale behind the message, like a watermark; one clear sentence,
// the way out, and on 404 a search field with popular pages.
export default function ErrorsA({ code: fixed }: { code?: string }) {
  const tx = useT();
  const { code, copy, switcher } = useErrorCode(fixed);
  return (
    <PageShell>
      <ErrorFrame switcher={switcher}>
        <div className="relative mx-auto max-w-3xl pt-10 text-center sm:pt-16">
          <span dir="ltr" aria-hidden className="pointer-events-none absolute inset-x-0 -top-6 select-none bg-gradient-to-b from-slate-200 to-transparent bg-clip-text font-display text-[9rem] font-bold leading-none tracking-tighter text-transparent sm:text-[13rem] dark:from-white/10">
            {code}
          </span>
          <div className="relative pt-24 sm:pt-36">
            <p className="font-mono text-sm font-semibold text-slate-400">{tx("Error {0}", { 0: code })}</p>
            <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl dark:text-white">{tx(copy.title)}</h1>
            <p className="mx-auto mt-4 max-w-xl text-lg text-slate-600 dark:text-slate-400">{tx(copy.body)}</p>
            <p className="mx-auto mt-1 max-w-xl text-slate-500 dark:text-slate-500">{tx(copy.hint)}</p>
            <div className="mt-8"><Actions copy={copy} center /></div>
            {code === "404" && (
              <div className="mt-12 flex flex-col items-center gap-5">
                <ErrorSearch />
                <PopularLinks center />
              </div>
            )}
            <div className="mt-12"><SupportLink /></div>
          </div>
        </div>
      </ErrorFrame>
    </PageShell>
  );
}
