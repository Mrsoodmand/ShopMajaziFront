"use client";
import { useMoney } from "@/lib/money";
import { methodInfo } from "@/content/apple-en";
import { PageShell } from "../otp/parts";
import { AppleCheckout, AppleFaq, AppleOrderView, AppleTitle, ContinueButton, CustomForm, ErrorSummary, H2, Quantity, useApple } from "./parts";
import { MethodToggle } from "./quick";

// Page G — "Buy Always in Reach": a clean page where the total and the buy button never leave the screen. On phones
// they sit in a bar at the bottom, in thumb reach; on desktop in a small card that follows you down the page.
export default function AppleG({ method }: { method?: string }) {
  const usd = useMoney().format;
  const a = useApple(method === "custom" ? "custom" : "ready");
  if (a.order) return <PageShell><div className="px-6 py-14"><AppleOrderView a={a} /></div></PageShell>;
  const info = methodInfo[a.method];

  return (
    <PageShell>
      <div className="mx-auto max-w-5xl px-4 pb-40 pt-10 sm:px-6 sm:pt-14 lg:pb-24">
        <AppleTitle>Get a US Apple ID</AppleTitle>

        <div className="mt-8 grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div>
            <div className="max-w-lg"><MethodToggle a={a} size="lg" /></div>
            <section key={a.method} aria-label={info.title} className="mt-8 max-w-lg animate-fade-up space-y-5 [animation-duration:250ms]">
              <p className="text-slate-700 dark:text-slate-300">{info.tagline}</p>
              {a.method === "custom" && <ErrorSummary a={a} />}
              {a.method === "ready" ? <Quantity a={a} /> : <CustomForm a={a} />}
            </section>
          </div>

          <aside aria-label="Your order" className="hidden h-fit rounded-3xl border border-slate-200 bg-white p-5 lg:sticky lg:top-24 lg:block dark:border-white/15 dark:bg-[#0E1424]">
            <p className="text-sm text-slate-600 dark:text-slate-400">{info.title}{a.method === "ready" && a.count > 1 ? ` × ${a.count}` : ""}</p>
            <p aria-live="polite" className="mt-1 font-display text-3xl font-bold text-slate-900 dark:text-white">{usd(a.total)}</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Delivery: {info.delivery.toLowerCase()}</p>
            <ContinueButton a={a} className="mt-5" />
          </aside>
        </div>

        <section aria-labelledby="faq" className="mt-20 max-w-3xl"><H2 id="faq">Common questions</H2><div className="mt-6"><AppleFaq /></div></section>
      </div>

      <section aria-label="Your order" className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 backdrop-blur lg:hidden dark:border-white/15 dark:bg-[#0B1020]/95">
        <div className="mx-auto flex max-w-lg items-center gap-4 px-4 py-3">
          <div className="min-w-0">
            <p className="truncate text-sm text-slate-600 dark:text-slate-400">{info.title}{a.method === "ready" && a.count > 1 ? ` × ${a.count}` : ""}</p>
            <p className="font-display text-xl font-bold text-slate-900 dark:text-white">{usd(a.total)}</p>
          </div>
          <ContinueButton a={a} full={false} short className="flex-1" />
        </div>
      </section>
      <AppleCheckout a={a} />
    </PageShell>
  );
}
