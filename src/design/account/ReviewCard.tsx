"use client";

import { useId, useState } from "react";
import { BadgeCheck, CheckCircle2, Send } from "lucide-react";
import { useT } from "@/i18n/client";
import { accountApi, ApiError } from "@/lib/account";
import { field, primary } from "../googleVoice/clean";

// Asks the buyer for a comment once an order is delivered (Back: App\Services\OrderReviews). One per order: it goes
// to the product's page as from a verified buyer, after the admin approves it. `state` comes from the order
// ("open": not written yet, "sent": written). Shown on the order page (account Receipt) and on the subscription
// purchase page when the plan is active.
export type ReviewState = { state: "open" | "sent" } | null | undefined;

export function ReviewCard({ orderId, review, name: defaultName = "", product, className = "" }: {
  orderId: number; review: ReviewState; name?: string; product?: string; className?: string;
}) {
  const t = useT();
  const [state, setState] = useState(review?.state);
  const [name, setName] = useState(defaultName);
  const [text, setText] = useState("");
  const [tried, setTried] = useState(false);
  const [sending, setSending] = useState(false);
  const [failed, setFailed] = useState("");
  const nId = useId(), tId = useId();
  if (!state) return null;

  const card = `rounded-3xl border border-slate-200 bg-white p-6 sm:p-7 dark:border-white/15 dark:bg-[#0E1424] ${className}`;
  if (state === "sent") {
    return (
      <section aria-live="polite" className={`${card} flex items-start gap-3`}>
        <CheckCircle2 aria-hidden className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700 dark:text-emerald-400" />
        <div>
          <h2 className="font-display text-base font-semibold text-slate-900 dark:text-white">{t("Thanks for your comment")}</h2>
          <p className="mt-1 text-[15px] text-slate-600 dark:text-slate-400">{t("It will appear on the product page after a quick review, marked as from a verified buyer.")}</p>
        </div>
      </section>
    );
  }

  const errName = tried && name.trim().length < 2 ? t("Enter your name") : "";
  const errText = tried && text.trim().length < 10 ? (text.trim() ? t("Write at least 10 characters") : t("Write your comment")) : "";
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTried(true);
    if (name.trim().length < 2) return document.getElementById(nId)?.focus();
    if (text.trim().length < 10) return document.getElementById(tId)?.focus();
    setSending(true); setFailed("");
    try {
      await accountApi(`panel/orders/${orderId}/review`, { name: name.trim(), text: text.trim() });
      setState("sent");
    } catch (err) {
      // Already written (another tab): show it as sent. Anything else: say so and keep what they typed.
      if (err instanceof ApiError && err.code === "already") setState("sent");
      else setFailed(err instanceof ApiError && err.message ? err.message : t("Your comment couldn't be sent. Please try again."));
    } finally {
      setSending(false);
    }
  };

  return (
    <section aria-labelledby={`${tId}-h`} className={card}>
      <div className="flex items-start gap-3">
        <span aria-hidden className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-violet-100 text-violet-800 dark:bg-violet-400/15 dark:text-violet-300"><BadgeCheck className="h-5 w-5" /></span>
        <div className="min-w-0">
          <h2 id={`${tId}-h`} className="font-display text-lg font-semibold text-slate-900 dark:text-white">{t("Your order arrived. How did it go?")}</h2>
          <p className="mt-1 text-[15px] leading-7 text-slate-600 dark:text-slate-400">
            {product ? t("Your comment helps others buying {0}. It shows on its page as from a verified buyer.", { 0: product }) : t("Your comment helps other buyers. It shows on the product page as from a verified buyer.")}
          </p>
        </div>
      </div>
      {failed && <p role="alert" className="mt-4 text-[15px] font-semibold text-red-700 dark:text-red-400">{failed}</p>}
      <form noValidate onSubmit={submit} className="mt-5 grid gap-4 sm:grid-cols-[minmax(0,14rem)_minmax(0,1fr)]">
        <div>
          <label htmlFor={nId} className="block text-sm font-semibold text-slate-900 dark:text-white">{t("Name shown")}</label>
          {errName && <p id={`${nId}-e`} className="text-sm font-semibold text-red-700 dark:text-red-400"><span className="sr-only">{t("Error:")}{" "}</span>{errName}</p>}
          <input id={nId} autoComplete="name" value={name} maxLength={60} onChange={(e) => setName(e.target.value)} aria-invalid={!!errName} aria-describedby={errName ? `${nId}-e` : undefined}
            className={`${field} mt-2 ${errName ? "!border-red-700 dark:!border-red-400" : ""}`} />
        </div>
        <div>
          <label htmlFor={tId} className="block text-sm font-semibold text-slate-900 dark:text-white">{t("Your comment")}</label>
          {errText && <p id={`${tId}-e`} className="text-sm font-semibold text-red-700 dark:text-red-400"><span className="sr-only">{t("Error:")}{" "}</span>{errText}</p>}
          <textarea id={tId} rows={3} maxLength={1000} value={text} onChange={(e) => setText(e.target.value)} aria-invalid={!!errText}
            aria-describedby={[errText && `${tId}-e`, `${tId}-c`].filter(Boolean).join(" ")} placeholder={t("How fast was it, did it work as expected…")}
            className={`${field} mt-2 resize-y ${errText ? "!border-red-700 dark:!border-red-400" : ""}`} />
          <p id={`${tId}-c`} className="mt-1 text-end text-sm text-slate-500 dark:text-slate-400">{t.num(text.length)} / {t.num(1000)}</p>
        </div>
        <div className="sm:col-span-2">
          <button type="submit" disabled={sending} className={`${primary} w-full disabled:opacity-60 sm:w-auto`}><Send aria-hidden className="h-4 w-4" />{t(sending ? "Sending…" : "Post comment")}</button>
        </div>
      </form>
    </section>
  );
}
