"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { BadgeDollarSign, Check, CheckCircle2, ChevronRight, CircleAlert, CircleSlash, CircleX, Clock, Loader2, LogIn, Plus, Send } from "lucide-react";
import Link from "@/i18n/Link";
import { useT } from "@/i18n/client";
import { accountApi, accountForm, useAccount } from "@/lib/account";
import { OrgInput, useOrgForm, type OrgField } from "../account/organization";
import { useSignInPopup } from "@/components/account/SignIn";
import { primary, secondary } from "../googleVoice/clean";

// «درخواست اکانت» pieces shared by the gallery (requestOffers.tsx, sections subs-request and page-account-requests)
// and the live pages: the request as an account card at the end of the /accounts grid (offer F, chosen 2026-11-24),
// the panel it opens, and the customer's requests in /account › درخواست‌های اکانت. Backend:
// Api\StorefrontPanelController@accountRequests (App\Services\AccountRequests); the form is the admin's
// (admin › درخواست اکانت › فرم), drawn with the business-account form's inputs.

const muted = "text-slate-600 dark:text-slate-400";

export type RequestStatus = "pending" | "quoted" | "paid" | "rejected" | "cancelled";
export type AccountRequest = {
  id: number; status: RequestStatus; site_name: string; site_url: string | null; note: string | null;
  answers: { key: string; title: string; type: string; value: string }[];
  order: { id: number; price: number; title: string } | null;
  created_at: string | null; reviewed_at: string | null;
};
type RequestState = { open: boolean; fields: OrgField[]; requests: AccountRequest[] };

/** The form (for everyone) and the signed-in customer's requests. */
export function useAccountRequests(enabled = true) {
  const account = useAccount();
  const [state, setState] = useState<RequestState | null>(null);
  const [failed, setFailed] = useState(false);
  const load = useCallback(async () => {
    try { setState(await accountApi<RequestState>("panel/account-requests")); setFailed(false); } catch { setFailed(true); }
  }, []);
  // Again after signing in or out: the list is the customer's own.
  useEffect(() => { if (enabled && account.status !== "loading") load(); }, [enabled, account.status, load]);
  const send = useCallback(async (values: Record<string, string | File>) => {
    const body = new FormData();
    for (const [k, v] of Object.entries(values)) body.append(`fields[${k}]`, v);
    const r = await accountForm<RequestState & { sent: number }>("panel/account-requests", body);
    setState(r);
    return r.sent;
  }, []);
  const withdraw = useCallback(async (id: number) => { setState(await accountApi<RequestState>(`panel/account-requests/${id}/withdraw`, {})); }, []);
  return { state, failed, reload: load, send, withdraw };
}
export type AccountRequests = ReturnType<typeof useAccountRequests>;

export const REQ_HEX = "#059669";
const ease = "ease-[cubic-bezier(0.22,1,0.36,1)]";

/** The request as a catalog card: same wash, glow, tile, badge and footer as ProductButton's `more` card. */
export function RequestCard({ on, onPick, q }: { on: boolean; onPick: () => void; q?: string }) {
  const t = useT();
  const wash = { backgroundImage: `linear-gradient(color-mix(in srgb, ${REQ_HEX} 9%, transparent), color-mix(in srgb, ${REQ_HEX} 9%, transparent))` };
  const title = q ? t("Request “{0}”", { 0: q }) : t("Request an account");
  return (
    <div style={wash} className={`group relative flex h-full flex-col overflow-hidden rounded-3xl border-2 border-dashed bg-white p-5 transition-[translate,box-shadow,border-color] duration-700 ${ease} hover:-translate-y-1 hover:shadow-[0_18px_40px_-18px_rgba(15,23,42,.28)] has-[button:focus-visible]:ring-2 has-[button:focus-visible]:ring-violet-600 has-[button:focus-visible]:ring-offset-2 dark:bg-[#0E1424] dark:hover:shadow-[0_18px_40px_-18px_rgba(0,0,0,.8)] ${on ? "!border-solid border-violet-700 dark:border-violet-400" : "border-emerald-600/40 hover:border-emerald-600/70 dark:border-emerald-400/30 dark:hover:border-emerald-400/60"}`}>
      <span aria-hidden style={{ backgroundColor: REQ_HEX }} className={`pointer-events-none absolute -end-10 -top-10 h-32 w-32 rounded-full opacity-15 blur-2xl transition-[scale,opacity] duration-1000 ${ease} group-hover:scale-150 group-hover:opacity-30`} />
      <button type="button" onClick={onPick} aria-pressed={on} className="absolute inset-0 z-[1] rounded-3xl outline-none"><span className="sr-only">{title}</span></button>
      <span aria-hidden className="pointer-events-none relative flex items-start justify-between gap-3">
        <span style={{ backgroundColor: REQ_HEX }} className={`grid h-12 w-12 place-items-center rounded-xl text-white transition-[translate,scale] duration-700 ${ease} group-hover:-translate-y-0.5 group-hover:scale-[1.06]`}><Plus className="h-6 w-6" strokeWidth={2.5} /></span>
        {on
          ? <span className="inline-flex items-center gap-1 rounded-full bg-violet-700 px-2 py-0.5 text-xs font-semibold text-white dark:bg-violet-400 dark:text-violet-950"><Check className="h-3 w-3" strokeWidth={3} />{t("Selected")}</span>
          : <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-900 dark:bg-emerald-500/20 dark:text-emerald-200">{t("On request")}</span>}
      </span>
      <span aria-hidden className="pointer-events-none relative mt-4 block font-display text-lg font-bold text-slate-900 dark:text-white">{q ? title : t("Can't find the account you want?")}</span>
      <span aria-hidden className="pointer-events-none relative mt-1 block text-sm text-slate-700 dark:text-slate-300">{q ? t("We don't sell it yet, but we may be able to get it for you.") : t("Tell us which site it is. We'll check whether we can get it and send you the price.")}</span>
      <span aria-hidden className="pointer-events-none relative mb-5 mt-4 flex">
        <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-slate-300 bg-white py-0.5 pe-2.5 ps-0.5 text-xs font-semibold text-slate-800 dark:border-white/20 dark:bg-white/5 dark:text-slate-100">
          <span className="grid h-5 w-5 place-items-center rounded-full bg-sky-600 text-white dark:bg-sky-400 dark:text-sky-950"><Clock className="h-3 w-3" strokeWidth={2.5} /></span>{t("Price within a few hours")}
        </span>
      </span>
      <span aria-hidden className="pointer-events-none relative mt-auto flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 border-t border-slate-900/10 pt-4 text-sm dark:border-white/10">
        <span className="whitespace-nowrap text-slate-700 dark:text-slate-300">{t("Price")}: <b className="font-display text-base text-slate-900 dark:text-white">{t("after review")}</b></span>
        <span className="inline-flex items-center gap-1 whitespace-nowrap font-semibold text-emerald-800 dark:text-emerald-300">{t("Request it")}<ChevronRight className={`h-4 w-4 transition-[translate] duration-700 ${ease} group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1`} /></span>
      </span>
    </div>
  );
}

/** The panel's header when the request card is picked, in the shape of a product's (tile, name, line). */
export function RequestPanelHead({ q }: { q?: string }) {
  const t = useT();
  return (
    <div className="mb-5 flex items-start gap-4">
      <span aria-hidden style={{ backgroundColor: REQ_HEX }} className="grid h-12 w-12 shrink-0 place-items-center rounded-xl text-white"><Plus className="h-6 w-6" strokeWidth={2.5} /></span>
      <div>
        <h2 tabIndex={-1} className="font-display text-xl font-bold text-slate-900 outline-none dark:text-white">{q ? t("Request “{0}”", { 0: q }) : t("Request an account")}</h2>
        <p className={`mt-0.5 text-sm ${muted}`}>{t("Tell us which site it is. We'll check whether we can get it and send you the price.")}</p>
      </div>
    </div>
  );
}

export function RequestDone({ onAgain, href = "/account/requests" }: { onAgain?: () => void; href?: string }) {
  const t = useT();
  return (
    <div role="status" className="py-4 text-center">
      <CheckCircle2 aria-hidden className="mx-auto h-10 w-10 text-emerald-600 dark:text-emerald-400" />
      <p className="mt-3 font-display text-lg font-bold text-slate-900 dark:text-white">{t("Your request was sent")}</p>
      <p className={`mx-auto mt-1 max-w-sm text-sm leading-relaxed ${muted}`}>{t("We'll check it and send the price to your account page, with a text message. Nothing is charged until you pay.")}</p>
      <div className="mt-5 flex flex-wrap justify-center gap-2">
        <Link href={href} className={`${secondary} !px-4 !py-2.5 text-sm`}>{t("See my requests")}</Link>
        {onAgain && <button type="button" onClick={onAgain} className={`${secondary} !px-4 !py-2.5 text-sm`}>{t("Request a different account")}</button>}
      </div>
    </div>
  );
}

export const REQUEST_STATUS: Record<RequestStatus, { label: string; cls: string; Icon: typeof Clock }> = {
  pending: { label: "Waiting for our answer", cls: "bg-sky-50 text-sky-900 ring-sky-200 dark:bg-sky-500/15 dark:text-sky-200 dark:ring-sky-500/30", Icon: Clock },
  quoted: { label: "Price sent", cls: "bg-amber-50 text-amber-900 ring-amber-200 dark:bg-amber-500/15 dark:text-amber-200 dark:ring-amber-500/30", Icon: BadgeDollarSign },
  paid: { label: "Paid", cls: "bg-emerald-50 text-emerald-900 ring-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-200 dark:ring-emerald-500/30", Icon: CheckCircle2 },
  rejected: { label: "Not possible", cls: "bg-red-50 text-red-900 ring-red-200 dark:bg-red-500/15 dark:text-red-200 dark:ring-red-500/30", Icon: CircleX },
  cancelled: { label: "Cancelled", cls: "bg-slate-100 text-slate-700 ring-slate-200 dark:bg-white/10 dark:text-slate-300 dark:ring-white/15", Icon: CircleSlash },
};

/**
 * The live form in the /accounts side panel. Guests fill it in too; «ارسال» opens the sign-in popup, keeps what
 * they wrote and sends it as soon as they're signed in (closing the popup instead leaves it unsent). `prefill`: a search that found nothing, as the site's name.
 */
export function LiveRequestPanel({ req, prefill = "" }: { req: AccountRequests; prefill?: string }) {
  const t = useT();
  const account = useAccount();
  const popup = useSignInPopup();
  const [sent, setSent] = useState(false);
  const fields = req.state?.fields ?? [];
  const waiting = useRef(false); // checked and waiting for the sign-in popup
  const s = useOrgForm(fields, async (v) => { await req.send(v); setSent(true); }, prefill ? { site_name: prefill } : {});
  const submit = s.submit;
  useEffect(() => {
    if (account.status === "user" && waiting.current) { waiting.current = false; submit(); }
  }, [account.status, submit]);
  const onSubmit = () => {
    if (account.status === "user") return s.submit();
    if (s.check()) { waiting.current = true; popup?.open(); }
  };
  if (sent) return <RequestDone onAgain={() => { setSent(false); for (const f of fields) s.set(f.key, undefined); }} />;
  return (
    <form noValidate onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
      <RequestPanelHead q={prefill || undefined} />
      <div className="space-y-4">
        {fields.map((f) => <OrgInput key={f.key} f={f} value={s.values[f.key]} error={s.errors[f.key] ?? null} onChange={(v) => s.set(f.key, v)} />)}
      </div>
      {s.failure && <p role="alert" className="mt-4 flex items-start gap-2 rounded-2xl bg-red-50 p-3 text-[15px] font-semibold text-red-800 dark:bg-red-500/10 dark:text-red-300"><CircleAlert aria-hidden className="mt-0.5 h-4 w-4 shrink-0" />{s.failure}</p>}
      <button type="submit" disabled={s.busy} className={`${primary} mt-5 w-full !py-3`}>
        {s.busy ? <Loader2 aria-hidden className="h-4 w-4 animate-spin" /> : account.status === "user" ? <Send aria-hidden className="h-4 w-4 -scale-x-100" /> : <LogIn aria-hidden className="h-4 w-4 rtl:rotate-180" />}
        {s.busy ? t("Sending…") : t("Send request")}
      </button>
      <p className={`mt-3 text-xs ${muted}`}>{account.status === "user" ? t("Usually answered within a few hours.") : t("You'll sign in before it's sent. Usually answered within a few hours.")}</p>
    </form>
  );
}
