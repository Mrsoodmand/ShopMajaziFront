"use client";

import { PageShell } from "../otp/parts";
import { AppleCheckout, AppleFaq, AppleOrderView, AppleSummary, AppleTitle, ContinueButton, CustomForm, ErrorSummary, H2, MethodRadios, Quantity, useApple } from "./parts";

// Page C — "One Simple Form": reads top to bottom like a paper form. 1 · which kind, 2 · quantity or your details,
// 3 · review and pay. Large type, one column, nothing hidden.
export default function AppleC({ method }: { method?: string }) {
  const a = useApple(method === "custom" ? "custom" : "ready");
  if (a.order) return <PageShell><div className="px-6 py-14"><AppleOrderView a={a} /></div></PageShell>;

  const badge = "grid h-9 w-9 shrink-0 place-items-center rounded-full bg-slate-900 font-display font-bold text-white dark:bg-white dark:text-slate-900";
  return (
    <PageShell>
      <div className="mx-auto max-w-2xl px-6 pb-24 pt-14">
        <AppleTitle sub="Answer three short questions. It takes about a minute.">Get a US Apple ID</AppleTitle>

        <ol className="mt-12 space-y-12">
          <li className="flex gap-4">
            <span aria-hidden className={badge}>1</span>
            <div className="min-w-0 flex-1"><H2>Choose a kind</H2><div className="mt-4"><MethodRadios a={a} details={false} legend="Kind of Apple ID" hideLegend /></div></div>
          </li>
          <li className="flex gap-4">
            <span aria-hidden className={badge}>2</span>
            <div key={a.method} className="min-w-0 flex-1 animate-fade-up [animation-duration:300ms]">
              <H2>{a.method === "ready" ? "How many?" : "Your details"}</H2>
              {a.method === "custom" && <p className="mt-1 text-slate-600 dark:text-slate-400">The Apple ID is created with these details.</p>}
              <div className="mt-5 space-y-6">
                {a.method === "custom" && <ErrorSummary a={a} />}
                {a.method === "ready" ? <Quantity a={a} /> : <CustomForm a={a} cols={1} />}
              </div>
            </div>
          </li>
          <li className="flex gap-4">
            <span aria-hidden className={badge}>3</span>
            <div className="min-w-0 flex-1"><H2>Review and pay</H2><div className="mt-4"><AppleSummary a={a} title="Order summary"><ContinueButton a={a} className="mt-5" /></AppleSummary></div></div>
          </li>
        </ol>

        <section aria-labelledby="faq" className="mt-20"><H2 id="faq">Common questions</H2><div className="mt-6"><AppleFaq /></div></section>
      </div>
      <AppleCheckout a={a} />
    </PageShell>
  );
}
