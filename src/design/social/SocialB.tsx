"use client";

import { useState, type ReactNode } from "react";
import { Check, X } from "lucide-react";
import { socialHeadings, socialPlatforms } from "@/content/social-en";
import { PageShell } from "../otp/parts";
import { Trust } from "../telegram/parts";
import { card, LinkField, PlatformIcon, PlatformTiles, QuantityPicker, ring, secondaryBtn, ServiceRadios, SocialBelow, SocialCheckout, SocialForm, SocialOrderView, SocialSummary, TierRadios, useJump, useSocial, JumpBar, type Social } from "./kit";
import { useT } from "@/i18n/client";

// Social B — "Order Checklist": the form as four folding rows (platform, service, amount, link), one open at a time.
// A closed row shows its answer and a tick, or the problem after Continue; Continue opens the first row with a
// problem and puts the cursor in it. Plain site theme, summary and Continue in the sidebar.

type Row = "platform" | "service" | "amount" | "link";
const order: Row[] = ["platform", "service", "amount", "link"];
const fmt = (n: number) => n.toLocaleString("en-US");

function Step({ id, n, title, answer, problem, open, onOpen, children, last, onNext }: {
  id: Row; n: number; title: string; answer: ReactNode; problem?: string; open: boolean; onOpen: () => void; children: ReactNode; last?: boolean; onNext: () => void;
}) {
  const tx = useT();
  const ok = !problem && answer;
  return (
    <section aria-labelledby={`row-${id}`} className={`${card} overflow-hidden`}>
      <h2 id={`row-${id}`}>
        <button type="button" onClick={onOpen} aria-expanded={open} aria-controls={`panel-${id}`} className={`flex w-full items-center gap-4 rounded-3xl p-5 text-start sm:p-6 ${ring}`}>
          <span aria-hidden className={`grid h-9 w-9 shrink-0 place-items-center rounded-full font-display font-bold ${problem ? "bg-red-700 text-white dark:bg-red-400 dark:text-red-950" : ok && !open ? "bg-emerald-700 text-white dark:bg-emerald-400 dark:text-emerald-950" : "border-2 border-slate-300 text-slate-700 dark:border-white/25 dark:text-slate-200"}`}>
            {problem ? <X className="h-4 w-4" /> : ok && !open ? <Check className="h-4 w-4" /> : n}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block font-display text-lg font-semibold text-slate-900 dark:text-white">{title}</span>
            {!open && <span className={`block truncate text-sm ${problem ? "font-semibold text-red-700 dark:text-red-400" : "text-slate-600 dark:text-slate-400"}`}>{problem ?? answer}</span>}
          </span>
          {!open && (answer || problem) && <span className="text-sm font-semibold text-slate-700 underline underline-offset-2 dark:text-slate-300">{tx("Change")}</span>}
        </button>
      </h2>
      <div id={`panel-${id}`} hidden={!open} className="border-t border-slate-200 p-5 sm:p-6 dark:border-white/10">
        {children}
        {!last && <button type="button" onClick={onNext} className={`${secondaryBtn} mt-6`}>{tx("Next")}</button>}
      </div>
    </section>
  );
}

export default function SocialB() {
  const tx = useT();
  const s = useSocial();
  const jump = useJump(s.order);
  const [open, setOpen] = useState<Row>("platform");
  const [seen, setSeen] = useState<Set<Row>>(new Set());
  const [tried, setTried] = useState(false);
  if (s.order) return <PageShell><div className="px-6 py-14"><SocialOrderView o={s.order} onAgain={s.reset} /></div></PageShell>;

  const go = (r: Row) => { setSeen((x) => new Set(x).add(open)); setOpen(r); };
  const next = () => go(order[order.indexOf(open) + 1]);
  const submit = () => {
    setTried(true);
    setSeen(new Set(order));
    const p = s.problem === "link" ? "link" : s.problem === "qty" ? "amount" : null;
    if (p) { setOpen(p); setTimeout(() => s.proceed(), 0); } else s.proceed();
  };
  const platformName = tx(socialPlatforms.find((p) => p.id === s.platform)!.name);
  const answered = (r: Row) => seen.has(r) || tried;
  const amountProblem = tried && s.problem === "qty" ? tx("Check the amount") : undefined;
  const linkProblem = tried && s.problem === "link" ? (s.link.trim() ? tx("Check the link") : tx("Add the link")) : undefined;

  return (
    <PageShell>
      <div className="mx-auto max-w-6xl px-4 pt-12 sm:px-6">
        <div className="flex items-start justify-between gap-6">
          <div className="min-w-0">
            <h1 className="text-balance font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl dark:text-white">{tx(socialHeadings.h1)}</h1>
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-700 sm:text-lg dark:text-slate-300">{tx(socialHeadings.sub)}</p>
          </div>
          <div aria-hidden className="hidden shrink-0 -space-x-3 sm:flex rtl:space-x-reverse">{socialPlatforms.map((p) => <PlatformIcon key={p.id} p={p.id} size="lg" className="ring-4 ring-[#F5F6FB] dark:ring-[#070B14]" />)}</div>
        </div>
        <div className="mt-5"><Trust items={[tx("No password needed"), tx("Starts in minutes"), tx("Refund if it can't start")]} /></div>
      </div>

      <div id="buy" className="mx-auto mt-10 max-w-6xl scroll-mt-24 px-4 sm:px-6">
        <SocialForm s={s} onSubmit={submit} className="grid grid-cols-[minmax(0,1fr)] gap-x-10 gap-y-10 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="min-w-0 space-y-3">
            <Step id="platform" n={1} title={tx("Platform")} answer={answered("platform") ? platformName : undefined} open={open === "platform"} onOpen={() => go("platform")} onNext={next}>
              <PlatformTiles s={s} legend="Where should it go?" />
            </Step>
            <Step id="service" n={2} title={tx("Service")} answer={answered("service") ? `${tx(s.service.name)} · ${tx(s.tier.name)}` : undefined} open={open === "service"} onOpen={() => go("service")} onNext={next}>
              <div className="space-y-8"><ServiceRadios s={s} legend={`${platformName} · ${tx("Service")}`} /><TierRadios s={s} /></div>
            </Step>
            <Step id="amount" n={3} title={tx("Amount")} answer={answered("amount") && s.qty ? `${fmt(s.qty)} ${tx(s.service.unit)}` : undefined} problem={amountProblem} open={open === "amount"} onOpen={() => go("amount")} onNext={next}>
              <QuantityPicker s={s} />
            </Step>
            <Step id="link" n={4} title={tx("Where to deliver")} answer={s.link.trim() && !s.linkError ? <span dir="ltr">{s.link.trim()}</span> : undefined} problem={linkProblem} open={open === "link"} onOpen={() => go("link")} onNext={next} last>
              <LinkField s={s} />
            </Step>
          </div>
          <aside aria-label={tx("Your order")}>
            <div ref={jump.ref} className="lg:sticky lg:top-24"><SocialSummary s={s} /></div>
          </aside>
        </SocialForm>
      </div>
      <SocialBelow />
      <JumpBar s={s} inView={jump.inView} go={jump.go} />
      <SocialCheckout s={s} />
    </PageShell>
  );
}
