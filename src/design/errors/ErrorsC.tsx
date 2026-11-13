"use client";

import { Clock, Compass, Lock, ServerCrash, ShieldAlert, Wrench, type LucideIcon } from "lucide-react";
import { PageShell } from "../otp/parts";
import { useT } from "@/i18n/client";
import { Actions, ErrorFrame, PopularLinks, SupportLink, useErrorCode, type ErrorCode } from "./parts";

const look: Record<ErrorCode, { Icon: LucideIcon; tone: string }> = {
  "400": { Icon: ShieldAlert, tone: "bg-amber-50 text-amber-600 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:ring-amber-500/20" },
  "401": { Icon: Lock, tone: "bg-sky-50 text-sky-600 ring-sky-200 dark:bg-sky-500/10 dark:text-sky-400 dark:ring-sky-500/20" },
  "403": { Icon: Lock, tone: "bg-amber-50 text-amber-600 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:ring-amber-500/20" },
  "404": { Icon: Compass, tone: "bg-indigo-50 text-indigo-600 ring-indigo-200 dark:bg-indigo-500/10 dark:text-indigo-400 dark:ring-indigo-500/20" },
  "419": { Icon: Clock, tone: "bg-sky-50 text-sky-600 ring-sky-200 dark:bg-sky-500/10 dark:text-sky-400 dark:ring-sky-500/20" },
  "429": { Icon: Clock, tone: "bg-amber-50 text-amber-600 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:ring-amber-500/20" },
  "500": { Icon: ServerCrash, tone: "bg-rose-50 text-rose-600 ring-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:ring-rose-500/20" },
  "503": { Icon: Wrench, tone: "bg-emerald-50 text-emerald-600 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/20" },
};

// C — "Status Card": one calm card, like a receipt. An icon tile coloured by kind (amber for a bad request,
// rose for our fault, green for maintenance), "What happened" and "What you can do" as two rows, then the
// buttons. The code and the time are printed small at the bottom, handy to quote to support.
export default function ErrorsC({ code: fixed }: { code?: string }) {
  const tx = useT();
  const { code, copy, switcher } = useErrorCode(fixed);
  const { Icon, tone } = look[code];
  const time = new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  return (
    <PageShell>
      <ErrorFrame switcher={switcher}>
        <div className="mx-auto max-w-xl pt-8 sm:pt-14">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,.04),0_12px_40px_-12px_rgba(15,23,42,.12)] sm:p-10 dark:border-white/10 dark:bg-white/[.03]">
            <span className={`grid h-14 w-14 place-items-center rounded-2xl ring-1 ${tone}`}><Icon className="h-7 w-7" /></span>
            <h1 className="mt-6 font-display text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">{tx(copy.title)}</h1>
            <dl className="mt-6 divide-y divide-slate-100 border-y border-slate-100 dark:divide-white/5 dark:border-white/5">
              <div className="py-4"><dt className="text-xs font-semibold uppercase tracking-widest text-slate-400">{tx("What happened")}</dt><dd className="mt-1.5 text-slate-700 dark:text-slate-300">{tx(copy.body)}</dd></div>
              <div className="py-4"><dt className="text-xs font-semibold uppercase tracking-widest text-slate-400">{tx("What you can do")}</dt><dd className="mt-1.5 text-slate-700 dark:text-slate-300">{tx(copy.hint)}</dd></div>
            </dl>
            <div className="mt-6"><Actions copy={copy} /></div>
            {code === "404" && <div className="mt-6"><PopularLinks /></div>}
            <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-dashed border-slate-200 pt-5 dark:border-white/10">
              <SupportLink />
              <span dir="ltr" className="font-mono text-xs text-slate-400">ERR {code} · {time}</span>
            </div>
          </div>
        </div>
      </ErrorFrame>
    </PageShell>
  );
}
