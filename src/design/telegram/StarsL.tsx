"use client";
import { useEffect, useRef, useState } from "react";
import { ArrowUp } from "lucide-react";
import { useMoney } from "@/lib/money";
import { tgHeadings } from "@/content/telegram-en";
import { PageShell } from "../otp/parts";
import { useHasExtras } from "../service/slot";
import { primary } from "../googleVoice/clean";
import { H2, ring, StarsCheckout, TgFaq, TgOrderView, Trust, UsernameField, useStars } from "./parts";
import { StarsBlocker, starsLabel, StarsSummary, UsesList } from "./stars";
import { AmountPicker, Coin, panel } from "./StarsF";
import { useT } from "@/i18n/client";
import { PageH1 } from "@/components/seo/PageHeading";

// Stars L — "Pack Grid on a Gold Band": Premium S's layout in Stars gold. A deep amber band holds the title and the
// coin; on desktop the order summary rises into the band beside the title, and the form overlaps the band's lower
// edge. Everything below the band follows the site theme. Stars F's content: username, six packs or any amount, and
// Continue in the sidebar. One motion moment: the coin turns once and throws sparkles when the amount changes.

const fmt = (n: number) => n.toLocaleString("en-US");
const selection = "selection:bg-amber-200 selection:text-amber-950 [&_input]:caret-amber-600 dark:[&_input]:caret-amber-300";

function GoldBand() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden bg-[linear-gradient(135deg,#78350f_0%,#b45309_50%,#f59e0b_100%)]">
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/50" />
      <div className="absolute -end-[10%] -top-[30%] h-[90%] w-[55%] rounded-full bg-[radial-gradient(closest-side,rgba(253,230,138,.35),transparent)] blur-2xl" />
      <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,.12)_1px,transparent_1px)] bg-[size:20px_20px]" />
    </div>
  );
}

export default function StarsL() {
  const usd = useMoney().format;
  const t = useT();
  const st = useStars();
  const extras = useHasExtras();
  const summary = useRef<HTMLDivElement>(null);
  const [summaryInView, setSummaryInView] = useState(false);

  // On phones the summary is far below the form: a small bar shows the total and jumps to it until it's in view.
  useEffect(() => {
    const el = summary.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => setSummaryInView(e.isIntersecting), { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, [st.order]);

  if (st.order) return <PageShell><div className="px-6 py-14"><TgOrderView o={st.order} onAgain={st.reset} /></div></PageShell>;

  const toSummary = () => { summary.current?.scrollIntoView({ behavior: "smooth", block: "center" }); summary.current?.querySelector<HTMLButtonElement>("button")?.focus({ preventScroll: true }); };

  return (
    <PageShell heroDark>
      <div className={selection}>
        <section aria-labelledby="stars-h1" className="relative -mt-16 overflow-hidden pb-28 pt-28 text-white">
          <GoldBand />
          <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
            <div className="flex items-center justify-between gap-5 lg:max-w-[calc(100%-380px)]">
              <div className="min-w-0">
                <h1 id="stars-h1" className="text-balance font-display text-3xl font-bold tracking-tight sm:text-5xl"><PageH1 text={t.tr(tgHeadings).stars.h1} /></h1>
                <p className="mt-2 max-w-2xl text-base leading-relaxed text-amber-50 sm:mt-3 sm:text-lg">{t.tr(tgHeadings).stars.sub}</p>
              </div>
              <Coin amount={st.amount} valid={st.valid} />
            </div>
            <div className="mt-5 sm:mt-6"><Trust light items={[t("No login needed"), t("Delivered in minutes"), t("Refund if not delivered")]} /></div>
          </div>
        </section>

        <div id="buy" className="mx-auto max-w-6xl scroll-mt-24 px-4 sm:px-6">
          {/* A form, so Enter in any field works like Continue. */}
          <form noValidate onSubmit={(e) => { e.preventDefault(); st.proceed(); }} className="grid grid-cols-[minmax(0,1fr)] gap-x-10 gap-y-10 lg:grid-cols-[minmax(0,1fr)_340px]">
            <section aria-label={t("Choose")} className={`${panel} relative z-10 -mt-16 min-w-0 space-y-6 p-6 shadow-2xl shadow-amber-950/15 sm:p-8 lg:col-start-1 lg:row-start-1`}>
              <UsernameField r={st.r} s="stars" />
              <AmountPicker st={st} />
            </section>
            <aside aria-label={t("Your order")} className="relative z-10 lg:col-start-2 lg:row-start-1 lg:-mt-64">
              <div ref={summary} className="lg:sticky lg:top-24">
                <StarsSummary st={st} className={`${panel} shadow-2xl shadow-amber-950/20`}>
                  <button type="submit" className={`${primary} mt-5 w-full tabular-nums`}>{starsLabel(st, t("Continue"), usd)}</button>
                  <StarsBlocker st={st} />
                  <p className="mt-3 text-center text-sm text-slate-600 dark:text-slate-400">{t("Pay with your wallet, card or crypto on the next step.")}</p>
                </StarsSummary>
              </div>
            </aside>
          </form>
        </div>

        <div className="mx-auto max-w-6xl px-4 pb-28 pt-16 sm:px-6">
          <section aria-labelledby="uses"><H2 id="uses">{t("What can you do with Stars?")}</H2><div className="mt-6"><UsesList /></div></section>
          {!extras && <section aria-labelledby="faq" className="mt-16 max-w-3xl"><H2 id="faq">{t("Common questions")}</H2><div className="mt-6"><TgFaq s="stars" /></div></section>}
          <a href="#buy" className={`mt-12 inline-flex items-center gap-2 rounded-lg font-semibold text-amber-800 underline-offset-4 hover:underline dark:text-amber-300 ${ring}`}><ArrowUp aria-hidden className="h-4 w-4" />{t("Choose your Stars")}</a>
        </div>
      </div>

      {/* Phones only: total plus a jump to the order summary (Continue itself stays in the summary). */}
      <div className={`fixed inset-x-0 bottom-0 z-40 border-t border-amber-200 bg-white px-4 py-3 shadow-[0_-8px_24px_-12px_rgba(0,0,0,.25)] transition-transform duration-300 lg:hidden dark:border-white/10 dark:bg-[#0E1424] ${summaryInView ? "translate-y-full" : "translate-y-0"}`} aria-hidden={summaryInView} inert={summaryInView}>
        <div className="mx-auto flex max-w-xl items-center justify-between gap-4">
          <span className="min-w-0"><span className={`block text-sm ${st.r.user ? "text-slate-600 dark:text-slate-400" : "font-semibold text-amber-800 dark:text-amber-300"}`}>{!st.r.user ? t("Add a username to continue") : st.valid ? t("{0} Stars to @{1}", { 0: fmt(st.amount), 1: st.r.user.username }) : t("Check the amount")}</span><span className="font-display text-xl font-bold tabular-nums text-slate-900 dark:text-white">{st.valid ? usd(st.total) : "—"}</span></span>
          <button type="button" onClick={toSummary} className={`rounded-xl border border-slate-300 px-4 py-2.5 font-semibold text-slate-900 dark:border-white/20 dark:text-white ${ring}`}>{t("Review order")}</button>
        </div>
      </div>
      <StarsCheckout st={st} />
    </PageShell>
  );
}
