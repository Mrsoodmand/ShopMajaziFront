"use client";

import { PageShell } from "../otp/parts";
import { useT } from "@/i18n/client";
import { Actions, ErrorFrame, ErrorSearch, PopularLinks, SupportLink, useErrorCode } from "./parts";

// D — "Broken Route": copy on one side; on the other a small browser window whose route line runs from the
// address bar towards the page and breaks at the code, with a slow pulse travelling along it. For 503 the line
// is whole and a progress bar fills instead (maintenance, not a break).
// `onRetry` (app/error.tsx) re-renders the page instead of reloading it.
export default function ErrorsD({ code: fixed, onRetry }: { code?: string; onRetry?: () => void }) {
  const tx = useT();
  const { code, copy, switcher } = useErrorCode(fixed);
  const maintenance = code === "503";
  const ours = code.startsWith("5");
  return (
    <PageShell>
      <ErrorFrame switcher={switcher}>
        <div className="mx-auto grid max-w-6xl items-center gap-12 pt-8 sm:pt-14 lg:grid-cols-2">
          <div>
            <p className="font-mono text-sm font-semibold text-slate-400">{tx("Error {0}", { 0: code })}</p>
            <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl dark:text-white">{tx(copy.title)}</h1>
            <p className="mt-4 max-w-lg text-lg text-slate-600 dark:text-slate-400">{tx(copy.body)}</p>
            <p className="mt-1 max-w-lg text-slate-500">{tx(copy.hint)}</p>
            <div className="mt-8"><Actions copy={copy} onRetry={onRetry} /></div>
            {code === "404" && <div className="mt-8 space-y-4"><ErrorSearch /><PopularLinks /></div>}
            <div className="mt-10"><SupportLink /></div>
          </div>

          <div dir="ltr" aria-hidden className="relative mx-auto w-full max-w-md">
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-900/5 dark:border-white/10 dark:bg-slate-900">
              <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-3 dark:border-white/5">
                <span className="h-2.5 w-2.5 rounded-full bg-slate-200 dark:bg-white/15" /><span className="h-2.5 w-2.5 rounded-full bg-slate-200 dark:bg-white/15" /><span className="h-2.5 w-2.5 rounded-full bg-slate-200 dark:bg-white/15" />
                <span className="ms-3 flex-1 truncate rounded-md bg-slate-100 px-3 py-1 font-mono text-[11px] text-slate-500 dark:bg-white/5 dark:text-slate-400">shopmajazi.com/…</span>
              </div>
              <div className="relative h-64">
                <svg viewBox="0 0 400 256" className="absolute inset-0 h-full w-full">
                  <defs>
                    <linearGradient id="err-line" x1="0" x2="1"><stop offset="0" stopColor="currentColor" stopOpacity=".15" /><stop offset="1" stopColor="currentColor" stopOpacity=".6" /></linearGradient>
                  </defs>
                  <g className="text-slate-400 dark:text-slate-500">
                    {maintenance ? (
                      <path d="M40 200 C 140 200, 160 60, 360 60" fill="none" stroke="url(#err-line)" strokeWidth="2" strokeDasharray="4 6" />
                    ) : (
                      <>
                        <path d="M40 200 C 110 200, 140 130, 180 120" fill="none" stroke="url(#err-line)" strokeWidth="2" strokeDasharray="4 6" />
                        <path d="M228 104 C 280 90, 300 60, 360 60" fill="none" stroke="currentColor" strokeOpacity=".12" strokeWidth="2" strokeDasharray="4 6" />
                      </>
                    )}
                    <circle cx="40" cy="200" r="6" className="fill-slate-300 dark:fill-slate-600" />
                    <circle cx="360" cy="60" r="6" className="fill-slate-200 dark:fill-slate-700" />
                  </g>
                  {!maintenance && <circle r="4" className={ours ? "fill-rose-500" : "fill-indigo-500"}><animateMotion dur="2.6s" repeatCount="indefinite" path="M40 200 C 110 200, 140 130, 180 120" /></circle>}
                </svg>
                {maintenance ? (
                  <div className="absolute inset-x-10 bottom-10">
                    <div className="h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-white/5"><div className="h-full w-1/3 animate-[err-fill_2.4s_ease-in-out_infinite] rounded-full bg-emerald-500" /></div>
                  </div>
                ) : (
                  <span className={`absolute left-[51%] top-[44%] -translate-x-1/2 -translate-y-1/2 rounded-lg px-2.5 py-1 font-mono text-sm font-bold ring-1 ${ours ? "bg-rose-50 text-rose-600 ring-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:ring-rose-500/20" : "bg-indigo-50 text-indigo-600 ring-indigo-200 dark:bg-indigo-500/10 dark:text-indigo-400 dark:ring-indigo-500/20"}`}>{code}</span>
                )}
              </div>
            </div>
          </div>
        </div>
        <style>{`@keyframes err-fill{0%{transform:translateX(-100%)}100%{transform:translateX(300%)}}`}</style>
      </ErrorFrame>
    </PageShell>
  );
}
