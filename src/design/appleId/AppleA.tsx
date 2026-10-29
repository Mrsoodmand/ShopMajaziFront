"use client";

import { appleHeadings } from "@/content/apple-en";
import { PageShell } from "../otp/parts";
import { useHasExtras } from "../service/slot";
import { AppleCheckout, AppleFaq, AppleNotices, AppleOrderView, AppleSummary, CompareTable, ContinueButton, CustomForm, ErrorSummary, H2, MethodRadios, Quantity, ReadyNotes, useApple } from "./parts";
import { useT } from "@/i18n/client";
import { Apple } from "lucide-react";
import { Trust } from "../telegram/parts";
import { BrandMesh } from "../social/heroBackdrops";
import { PageH1 } from "@/components/seo/PageHeading";

// Apple's own blues and purples for the hero band.
const appleMesh = ["#0071e3", "#5e5ce6", "#bf5af2", "#64d2ff"];

// Page A — "Choose, then Details": the two kinds of Apple ID as cards at the top. Below, only what that kind needs:
// a quantity for Ready, a short form for Custom. The order summary stays in view beside it, and Continue opens
// the payment window.
export default function AppleA({ method }: { method?: string }) {
  const t = useT();
  const a = useApple(method === "custom" ? "custom" : "ready");
  // On the live page the shared sections (how to use, FAQ, …) follow, so this design's own copies are dropped.
  const extras = useHasExtras();
  if (a.order) return <PageShell><div className="px-6 py-14"><AppleOrderView a={a} /></div></PageShell>;

  // Heading follows the address (/apple-id, /usa or /custom), not the switch below, so each page keeps its own title.
  const head = t.tr(appleHeadings)[method === "custom" ? "custom" : method === "ready" ? "ready" : "all"];

  return (
    <PageShell heroDark>
      {/* Same hero as /virtual-service and /accounts: a Brand Mesh band (here in Apple's blues and purples) with the
          title centred; the Ready / Custom cards rise into its fade. */}
      <section aria-labelledby="apple-h1" className="relative isolate -mt-16 overflow-hidden pb-36 pt-16">
        <BrandMesh colors={appleMesh} />
        <div className="mx-auto max-w-6xl px-6 pt-12 text-center sm:pt-20">
          <p className="flex items-center justify-center gap-1.5 text-sm font-semibold text-white/90"><Apple aria-hidden className="h-4 w-4" />{t("Apple ID · United States")}</p>
          <h1 id="apple-h1" className="mx-auto mt-3 max-w-3xl text-balance font-display text-4xl font-bold tracking-tight text-white drop-shadow-[0_2px_12px_rgba(0,0,0,.25)] sm:text-6xl"><PageH1 text={head.h1} /></h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-white/90 sm:text-lg">{head.sub}</p>
          <div className="mt-6 flex justify-center"><Trust light items={[t("Pay without a foreign card"), t("Ready ones in seconds"), t("Custom ones in about 10 minutes")]} /></div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-6 pb-24">
        <div className="relative z-10 -mt-24"><MethodRadios a={a} hideLegend /></div>

        <AppleNotices a={a} className="mt-8" />

        <div className="mt-10 grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[minmax(0,1fr)_340px]">
          <section key={a.method} aria-labelledby="details" className="animate-fade-up rounded-3xl border border-slate-200 bg-white p-6 [animation-duration:300ms] sm:p-8 dark:border-white/15 dark:bg-[#0E1424]">
            <H2 id="details">{a.method === "ready" ? t("How many do you need?") : t("Your details")}</H2>
            {a.method === "custom" && <p className="mt-1 text-slate-600 dark:text-slate-400">{t("We create the Apple ID with these. All fields are required unless marked optional.")}</p>}
            <div className="mt-6 space-y-6">
              {a.method === "custom" && <ErrorSummary a={a} />}
              {a.method === "ready" ? <><Quantity a={a} side /><ReadyNotes /></> : <CustomForm a={a} />}
            </div>
          </section>
          <div className="lg:sticky lg:top-24 lg:self-start"><AppleSummary a={a}><ContinueButton a={a} className="mt-5" /></AppleSummary></div>
        </div>

        <section aria-labelledby="compare" className="mt-20"><H2 id="compare">{t("Ready or custom?")}</H2><div className="mt-6"><CompareTable /></div></section>
        {!extras && <section aria-labelledby="faq" className="mt-16 max-w-3xl"><H2 id="faq">{t("Common questions")}</H2><div className="mt-6"><AppleFaq /></div></section>}
      </div>
      <AppleCheckout a={a} />
    </PageShell>
  );
}
