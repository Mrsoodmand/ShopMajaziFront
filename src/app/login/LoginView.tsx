"use client";

import { useRouter } from "next/navigation";
import { Wallet, LogOut } from "lucide-react";
import SignInForm from "@/components/account/SignInForm";
import { PageShell } from "@/design/otp/parts";
import { TOP_UP_HREF, useAccount } from "@/lib/account";
import { toman } from "@/lib/money";
import { useLocalePath } from "@/i18n/Link";
import Link from "@/i18n/Link";
import { useT } from "@/i18n/client";

export default function LoginView({ next }: { next: string }) {
  const t = useT();
  const account = useAccount();
  const router = useRouter();
  const lp = useLocalePath();

  return (
    <PageShell>
      <div className="mx-auto flex max-w-md flex-col px-6 py-16 sm:py-24">
        <div className="rounded-[2rem] bg-white p-6 shadow-xl shadow-slate-900/5 ring-1 ring-slate-200 sm:p-8 dark:bg-[#0E1424] dark:shadow-black/30 dark:ring-white/10">
          {account.status === "loading" && <div className="h-64 animate-pulse rounded-2xl bg-slate-100 dark:bg-white/5" />}
          {account.status === "guest" && <SignInForm onDone={() => router.push(lp(next))} />}
          {account.status === "user" && account.user && (
            <div>
              <h1 className="font-display text-xl font-semibold text-slate-900 dark:text-white">{t("You're signed in")}</h1>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{account.user.name}</p>
              <div className="mt-5 flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3.5 dark:bg-white/5">
                <span className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300"><Wallet className="h-4 w-4" />{t("Wallet")}</span>
                <b className="font-display text-lg text-slate-900 dark:text-white">{toman(account.wallet ?? 0, t.locale)}</b>
              </div>
              <div className="mt-5 grid gap-2 sm:grid-cols-2">
                <Link href={next} className="rounded-2xl bg-indigo-600 py-3 text-center text-sm font-semibold text-white hover:bg-indigo-700">{t("Continue shopping")}</Link>
                <a href={TOP_UP_HREF} className="rounded-2xl py-3 text-center text-sm font-semibold text-slate-700 ring-1 ring-slate-200 hover:ring-slate-300 dark:text-slate-200 dark:ring-white/15">{t("Top up wallet")}</a>
              </div>
              <button onClick={() => account.signOut()} className="mx-auto mt-5 flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-rose-600 dark:text-slate-400"><LogOut className="h-4 w-4 rtl:rotate-180" />{t("Sign out")}</button>
            </div>
          )}
        </div>
      </div>
    </PageShell>
  );
}
