"use client";

import { useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Check, Clock, X } from "lucide-react";
import { PageShell } from "@/design/otp/parts";
import { Passbook, type Page, type View } from "@/design/account/AccountC";
import { NowContext, secondary } from "@/design/account/kit";
import { ListD as OrdersByDay } from "@/design/account/orders";
import { useLiveAccount } from "@/lib/account-panel";
import { useLocalePath } from "@/i18n/Link";
import { useT } from "@/i18n/client";

const PAGES: Page[] = ["orders", "funds", "support", "profile", "password"];

// URL segments → the page and its id, and back.
function viewOf(slug: string[], newFor: string | null): View {
  const [page, id] = slug;
  if (page === "orders" && id && /^\d+$/.test(id)) return { page: "order", id: Number(id) };
  if (page === "support" && id === "new") return { page: "support", id: newFor && /^\d+$/.test(newFor) ? -Number(newFor) : 0 };
  if (page === "support" && id && /^\d+$/.test(id)) return { page: "support", id: Number(id) };
  return PAGES.includes(page as Page) ? { page: page as Page } : { page: "statement" };
}
function pathOf(v: View): string {
  if (v.page === "statement") return "/account";
  if (v.page === "order") return `/account/orders/${v.id}`;
  if (v.page === "support" && v.id != null) return v.id > 0 ? `/account/support/${v.id}` : v.id < 0 ? `/account/support/new?order=${-v.id}` : "/account/support/new";
  return `/account/${v.page}`;
}

export default function AccountApp({ slug }: { slug: string[] }) {
  const t = useT();
  const router = useRouter();
  const lp = useLocalePath();
  const search = useSearchParams();
  const store = useLiveAccount();
  const view = useMemo(() => viewOf(slug, search.get("order")), [slug, search]);
  const here = pathOf(view);

  // Signed out: sign in, then come back to this page.
  useEffect(() => {
    if (store.status === "guest") router.replace(lp(`/login?next=${encodeURIComponent(here)}`));
  }, [store.status, router, lp, here]);

  // Back from the bank after a top-up (v2\ShopController::topUpBack): ?topup=ok|held|cancelled|failed.
  const topup = search.get("topup");
  const notice = topup && view.page === "funds" ? <TopUpNotice result={topup} /> : undefined;

  if (store.status !== "ready")
    return (
      <PageShell>
        <div className="mx-auto max-w-7xl px-4 pb-16 pt-6 sm:px-6 sm:pt-10 lg:grid lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-10">
          {store.status === "error" ? (
            <div className="col-span-2 mx-auto max-w-md py-16 text-center">
              <p className="font-display text-xl font-semibold text-slate-900 dark:text-white">{t("Your account didn't load")}</p>
              <p className="mt-1 text-[15px] text-slate-600 dark:text-slate-400">{t("Check your connection and try again.")}</p>
              <button type="button" onClick={() => store.reload()} className={`${secondary} mt-5`}>{t("Try again")}</button>
            </div>
          ) : (
            <>
              <div aria-hidden className="hidden h-96 animate-pulse rounded-3xl bg-indigo-950/80 lg:block dark:bg-[#15123a]" />
              <div role="status" aria-label={t("Loading…")} className="space-y-4">
                <div className="h-10 w-56 animate-pulse rounded-xl bg-slate-200 dark:bg-white/10" />
                <div className="h-5 w-96 max-w-full animate-pulse rounded-lg bg-slate-200 dark:bg-white/10" />
                <div className="h-80 animate-pulse rounded-3xl bg-white ring-1 ring-slate-200 dark:bg-white/5 dark:ring-white/10" />
              </div>
            </>
          )}
        </div>
      </PageShell>
    );

  return (
    <PageShell>
      <NowContext.Provider value={null}>
        <Passbook store={store} view={view} go={(v) => router.push(lp(pathOf(v)))} notice={notice} OrdersList={OrdersByDay}
          onSignOut={async () => { await store.signOut(); router.replace(lp("/")); }} />
      </NowContext.Provider>
    </PageShell>
  );
}

function TopUpNotice({ result }: { result: string }) {
  const t = useT();
  const look = {
    ok: { Icon: Check, cls: "bg-emerald-50 text-emerald-900 dark:bg-emerald-400/10 dark:text-emerald-100", text: t("Payment received. The top-up is in your wallet.") },
    held: { Icon: Clock, cls: "bg-amber-50 text-amber-900 dark:bg-amber-400/10 dark:text-amber-100", text: t("You paid with a card that isn't the one you chose, so the top-up is on hold. Send a photo of that card to support in a ticket and we'll add it.") },
    cancelled: { Icon: X, cls: "bg-slate-100 text-slate-800 dark:bg-white/[.06] dark:text-slate-200", text: t("The payment was cancelled. Nothing was taken from your card.") },
  }[result] ?? { Icon: X, cls: "bg-red-50 text-red-900 dark:bg-red-400/10 dark:text-red-100", text: t("The bank didn't confirm the payment. If money left your card, the bank returns it within 72 hours.") };
  return (
    <p role="status" className={`mb-6 flex items-start gap-2.5 rounded-2xl px-4 py-3 text-[15px] ${look.cls}`}>
      <look.Icon aria-hidden className="mt-0.5 h-4 w-4 shrink-0" /><span>{look.text}</span>
    </p>
  );
}
