"use client";

import { useState } from "react";
import { ChevronDown, Plus } from "lucide-react";
import Link from "@/i18n/Link";
import { useT } from "@/i18n/client";
import { Head, indigoBtn, type Go } from "./AccountC";
import { card, Empty, errorText, secondary, useFmt, type Store } from "./kit";
import { REQUEST_STATUS, useAccountRequests, type AccountRequest } from "../subs/request";

// /account/requests «درخواست‌های اکانت» (design page-account-requests A · Request cards): accounts the customer asked
// for that the site doesn't sell. A price support sent is an order waiting for payment, so «پرداخت» opens that order;
// a waiting request can be withdrawn. Asked for from the last card of /accounts (design/subs/request.tsx).

const muted = "text-slate-600 dark:text-slate-400";

export function AccountRequests({ go }: { demo: Store; go: Go }) {
  const t = useT();
  const req = useAccountRequests();
  const list = req.state?.requests;
  return (
    <>
      <Head title={t("Account requests")} sub={t("Accounts you asked for that aren't on the site.")}
        action={req.state?.open ? <Link href="/accounts" className={indigoBtn}><Plus aria-hidden className="h-4 w-4" />{t("Request an account")}</Link> : undefined} />
      {!list ? (
        req.failed
          ? <Empty title={t("Your requests didn't load")} text={t("Check your connection and try again.")} action={<button type="button" onClick={() => req.reload()} className={secondary}>{t("Try again")}</button>} />
          : <div role="status" aria-label={t("Loading…")} className="space-y-3">{[0, 1].map((i) => <div key={i} className="h-32 animate-pulse rounded-3xl bg-white ring-1 ring-slate-200 dark:bg-white/5 dark:ring-white/10" />)}</div>
      ) : list.length === 0 ? (
        <div className={card}><Empty title={t("No requests yet.")} text={t("Can't find the account you want? Tell us which site it is. We'll check whether we can get it and send you the price.")} /></div>
      ) : (
        <ul className="max-w-3xl space-y-3">
          {list.map((r) => <RequestRow key={r.id} r={r} go={go} withdraw={req.withdraw} />)}
        </ul>
      )}
    </>
  );
}

function RequestRow({ r, go, withdraw }: { r: AccountRequest; go: Go; withdraw: (id: number) => Promise<void> }) {
  const t = useT();
  const f = useFmt();
  const [busy, setBusy] = useState(false);
  const [failure, setFailure] = useState<string | null>(null);
  const s = REQUEST_STATUS[r.status];
  // What they wrote besides the name and address, for a reminder.
  const rest = r.answers.filter((a) => a.key !== "site_name" && a.key !== "site_url" && a.value);
  return (
    <li className={`${card} p-5`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">{r.site_name}</h2>
          <p className={`text-sm ${muted}`}>
            <bdi className="tabular-nums">#{r.id}</bdi>
            {r.site_url && <> · <bdi dir="ltr">{r.site_url}</bdi></>}
            {r.created_at && <> · {t("Sent {0}", { 0: f.date(r.created_at) })}</>}
          </p>
        </div>
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ring-1 ring-inset ${s.cls}`}><s.Icon aria-hidden className="h-3.5 w-3.5" />{t(s.label)}</span>
      </div>
      {r.order && (r.status === "quoted" || r.status === "paid") && <p className="mt-3 text-[15px] text-slate-800 dark:text-slate-200">{r.order.title} · <b className="tabular-nums">{f.money(r.order.price)}</b></p>}
      {r.note && <p className="mt-3 whitespace-pre-line rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-700 dark:bg-white/5 dark:text-slate-300"><span className="font-semibold">{t("Our note")}:</span> {r.note}</p>}
      {rest.length > 0 && (
        <details className="group mt-3">
          <summary className={`inline-flex cursor-pointer list-none items-center gap-1 rounded text-sm font-semibold ${muted} [&::-webkit-details-marker]:hidden`}>{t("What you wrote")}<ChevronDown aria-hidden className="h-4 w-4 transition-transform group-open:rotate-180" /></summary>
          <dl className="mt-2 space-y-1 text-sm">
            {rest.map((a) => <div key={a.key} className="flex flex-wrap gap-x-2"><dt className={muted}>{a.title}:</dt><dd className="whitespace-pre-line text-slate-800 dark:text-slate-200">{a.type === "yesno" ? (a.value === "yes" ? t("Yes") : t("No")) : a.value}</dd></div>)}
          </dl>
        </details>
      )}
      {failure && <p role="alert" className="mt-3 text-sm font-semibold text-red-700 dark:text-red-400">{failure}</p>}
      {((r.status === "quoted" || r.status === "paid") && r.order) || r.status === "pending" ? (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {r.status === "quoted" && r.order && <button type="button" onClick={() => go({ page: "order", id: r.order!.id })} className={`${indigoBtn} !px-4 !py-2.5 text-sm`}>{t("Pay {0}", { 0: f.money(r.order.price) })}</button>}
          {r.status === "paid" && r.order && <button type="button" onClick={() => go({ page: "order", id: r.order!.id })} className={`${secondary} !px-4 !py-2.5 text-sm`}>{t("View order")}</button>}
          {r.status === "pending" && (
            <button type="button" disabled={busy} className={`${secondary} !px-4 !py-2.5 text-sm`}
              onClick={async () => { setBusy(true); setFailure(null); try { await withdraw(r.id); } catch (e) { setFailure(errorText(e, t("Something went wrong. Please try again."))); setBusy(false); } }}>
              {t("Withdraw")}
            </button>
          )}
        </div>
      ) : null}
    </li>
  );
}
