"use client";

import type { OtpOperator } from "@/content/otp-en";
import CheckoutModal from "@/components/checkout/CheckoutModal";
import type { OtpFlow } from "./flow";
import { AppTile, CC } from "./parts";
import { useT } from "@/i18n/client";
import { TOP_UP_HREF } from "@/lib/account";

// OTP payment modal: the shared checkout modal with the app / country / operator summary.
// `live`: real purchase (sign in first): from the wallet, or by card through ZarinPal. Crypto is not wired yet.
export default function PayModal({ open, onClose, flow, operator, live = false }: { open: boolean; onClose: () => void; flow: OtpFlow; operator: OtpOperator | null; live?: boolean }) {
  const t = useT();
  return (
    <CheckoutModal open={open} onClose={onClose} price={operator?.price ?? 0} itemLabel={t("Number")} payLabel={t("Pay")} note={t("No code within {minutes} minutes? Automatic full refund.", { minutes: flow.minutes })}
      onPay={(m) => flow.purchase(operator, m)} signIn={live} only={live ? ["wallet", "card"] : undefined} topUpHref={live ? TOP_UP_HREF : undefined}
      busyLabel="Getting your number…" busyLabels={{ card: "Opening the bank…" }}
      fees={live ? { card: 0 } : undefined} notes={live ? { card: "Iranian bank cards, via ZarinPal" } : undefined}
      summary={flow.app && flow.country && operator && (
        <>
          <AppTile app={flow.app} />
          <div className="min-w-0 flex-1">
            <div className="truncate font-semibold text-slate-900 dark:text-white">{t("{app} number", { app: flow.app.name })}</div>
            <div className="flex items-center gap-1.5 truncate text-xs text-slate-500 dark:text-slate-400"><CC cc={flow.country.cc} flag={flow.country.flag} />{flow.country.name} · {operator.name}</div>
          </div>
        </>
      )} />
  );
}
