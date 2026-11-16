"use client";

import { useId, useState, type ReactNode } from "react";
import { Check, Moon, PhoneCall, Sun } from "lucide-react";
import { PageShell } from "../otp/parts";
import { useT } from "@/i18n/client";

// Offers for the checkout question «آیا از ساعت ۲۱ تا ۷ صبح برای تماس در دسترس هستید؟», asked before paying for
// services support delivers by hand (social services, subscriptions). The answer is saved on the order
// (orders.night_call) and shows as a moon badge in admin. Shown inside a stand-in of the checkout dialog.

type Answer = boolean | null;
const ring = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2 dark:focus-visible:ring-indigo-400 dark:focus-visible:ring-offset-[#0E1424]";

function Dialog({ children, answer }: { children: ReactNode; answer: Answer }) {
  const t = useT();
  return (
    <PageShell>
      <div className="mx-auto max-w-md px-4 py-10">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl dark:border-white/15 dark:bg-[#0E1424]">
          <p className="text-sm text-slate-500 dark:text-slate-400">{t("Checkout")}</p>
          <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white">{t("Instagram followers · 10,000")}</h2>
          <div className="mt-3 flex justify-between rounded-2xl bg-slate-50 px-4 py-3 text-[15px] dark:bg-white/[.04]">
            <span className="text-slate-600 dark:text-slate-400">{t("Total")}</span>
            <span className="font-semibold tabular-nums text-slate-900 dark:text-white">{t("{0} Toman", { 0: "1,250,000" })}</span>
          </div>
          <div className="mt-5">{children}</div>
          <button type="button" disabled={answer === null} className={`mt-5 w-full rounded-2xl bg-indigo-600 px-6 py-3.5 font-semibold text-white disabled:opacity-40 ${ring}`}>{t("Pay")}</button>
          {answer === null && <p className="mt-2 text-center text-sm text-slate-500 dark:text-slate-400">{t("Answer the question to continue.")}</p>}
        </div>
      </div>
    </PageShell>
  );
}

/* ---------- A · Segmented: one line, Yes / No pills ---------- */

export function NightCallA() {
  const t = useT();
  const [a, setA] = useState<Answer>(null);
  const id = useId();
  return (
    <Dialog answer={a}>
      <fieldset>
        <legend id={id} className="flex items-center gap-2 text-[15px] font-semibold text-slate-900 dark:text-white"><PhoneCall aria-hidden className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />{t("Can support call you between 9 pm and 7 am?")}</legend>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{t("If something about your order needs a quick answer.")}</p>
        <div className="mt-3 grid grid-cols-2 rounded-2xl bg-slate-100 p-1 dark:bg-white/[.06]">
          {([true, false] as const).map((v) => (
            <label key={String(v)} className={`cursor-pointer rounded-xl px-4 py-2.5 text-center text-[15px] font-semibold transition-colors ${a === v ? "bg-white text-slate-900 shadow dark:bg-white/15 dark:text-white" : "text-slate-600 dark:text-slate-300"}`}>
              <input type="radio" name={id} className="sr-only" checked={a === v} onChange={() => setA(v)} />
              {v ? t("Yes, call me") : t("No, daytime only")}
            </label>
          ))}
        </div>
      </fieldset>
    </Dialog>
  );
}

/* ---------- B · Two cards: moon and sun, with what each means ---------- */

export function NightCallB() {
  const t = useT();
  const [a, setA] = useState<Answer>(null);
  const id = useId();
  const opt = (v: boolean, Icon: typeof Moon, title: string, sub: string) => (
    <label className={`relative flex cursor-pointer flex-col gap-2 rounded-2xl border-2 p-4 transition-colors ${a === v ? "border-indigo-600 bg-indigo-50 dark:border-indigo-400 dark:bg-indigo-500/10" : "border-slate-200 hover:border-slate-300 dark:border-white/15"}`}>
      <input type="radio" name={id} className="sr-only" checked={a === v} onChange={() => setA(v)} />
      <Icon aria-hidden className={`h-6 w-6 ${v ? "text-indigo-600 dark:text-indigo-300" : "text-amber-500"}`} />
      <span className="text-[15px] font-semibold text-slate-900 dark:text-white">{title}</span>
      <span className="text-sm text-slate-600 dark:text-slate-400">{sub}</span>
      {a === v && <Check aria-hidden className="absolute end-3 top-3 h-5 w-5 text-indigo-600 dark:text-indigo-300" />}
    </label>
  );
  return (
    <Dialog answer={a}>
      <fieldset>
        <legend className="text-[15px] font-semibold text-slate-900 dark:text-white">{t("Can support call you between 9 pm and 7 am?")}</legend>
        <div className="mt-3 grid grid-cols-2 gap-3">
          {opt(true, Moon, t("Yes, at night too"), t("Calls from 21:00 to 07:00 are fine."))}
          {opt(false, Sun, t("Daytime only"), t("Support calls between 07:00 and 21:00."))}
        </div>
      </fieldset>
    </Dialog>
  );
}

/* ---------- C · Switch: a quiet row, off by default (no answer needed to pay) ---------- */

export function NightCallC() {
  const t = useT();
  const [on, setOn] = useState(false);
  return (
    <Dialog answer={on}>
      <button type="button" role="switch" aria-checked={on} onClick={() => setOn(!on)} className={`flex w-full items-center gap-3 rounded-2xl border border-slate-200 p-4 text-start dark:border-white/15 ${ring}`}>
        <Moon aria-hidden className="h-5 w-5 shrink-0 text-indigo-600 dark:text-indigo-300" />
        <span className="min-w-0 flex-1">
          <span className="block text-[15px] font-semibold text-slate-900 dark:text-white">{t("Support may call me at night")}</span>
          <span className="block text-sm text-slate-600 dark:text-slate-400">{t("Between 21:00 and 07:00, if your order needs a quick answer.")}</span>
        </span>
        <span aria-hidden className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${on ? "bg-indigo-600 dark:bg-indigo-500" : "bg-slate-300 dark:bg-white/20"}`}>
          <span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all ${on ? "start-6" : "start-1"}`} />
        </span>
      </button>
    </Dialog>
  );
}
