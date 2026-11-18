"use client";

import { useState, type ReactNode } from "react";
import { Check, X } from "lucide-react";
import { useT } from "@/i18n/client";
import { useMoney } from "@/lib/money";
import { PageShell } from "../otp/parts";
import { Trust } from "../telegram/parts";
import { secondaryBtn } from "../social/kit";
import { LiveAmount, LiveCheckout, LiveFields, LiveMark, LiveNotice, LiveSummary, toneOf, type LiveOrder } from "../social/liveOrder";
import { SpotlightBand, spotTone, useSpotlight } from "../service/spotlight";
import { card, PayBar, ring, toneVars, useOnScreen } from "../socialService/parts";
import { Done, Empty, PlatformBelow, PlatformRoot, PlatformSwitch, usePlatform } from "./parts";
import { ServiceCard } from "./offers";

// K — Band + Checklist: A's top as it is live (the Spotlight band while that hero is on, else the band in the
// platform's colours, with the title, icon and platform switch; the summary rises into it on desktop), and B's
// selection under it, with F's service cards in the first row: the order as folding rows (service, amount, link), one open at a time. A closed row shows
// its answer and a tick, or the problem after Continue; Continue opens the first row with a problem and puts the
// cursor in it. The platform is chosen on the band, so it isn't a row.

type Row = "service" | "amount" | "details";
const ROWS: Row[] = ["service", "amount", "details"];

function Band({ c }: { c: Parameters<typeof toneOf>[0] }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden bg-slate-950">
      <div className="absolute inset-0" style={{ backgroundImage: toneOf(c).band }} />
      <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/25 to-black/45" />
      <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,.1)_1px,transparent_1px)] bg-[size:20px_20px]" />
    </div>
  );
}

function Step({ id, n, title, answer, problem, open, onOpen, onNext, children }: {
  id: Row; n: number; title: string; answer?: ReactNode; problem?: string; open: boolean; onOpen: () => void; onNext?: () => void; children: ReactNode;
}) {
  const tx = useT();
  const done = !problem && !!answer && !open;
  return (
    <section aria-labelledby={`pk-${id}`} className={`${card} overflow-hidden transition-shadow ${open ? "shadow-2xl shadow-slate-950/15" : ""}`}>
      <h2 id={`pk-${id}`}>
        <button type="button" onClick={onOpen} aria-expanded={open} aria-controls={`pk-panel-${id}`} className={`flex w-full items-center gap-4 rounded-3xl p-5 text-start sm:p-6 ${ring}`}>
          <span aria-hidden className={`grid h-9 w-9 shrink-0 place-items-center rounded-full font-display font-bold transition-colors ${problem ? "bg-red-700 text-white dark:bg-red-400 dark:text-red-950" : done ? "bg-emerald-700 text-white dark:bg-emerald-400 dark:text-emerald-950" : open ? "border-2 border-[var(--tone)] text-slate-900 dark:text-white" : "border-2 border-slate-300 text-slate-700 dark:border-white/25 dark:text-slate-200"}`}>
            {problem ? <X className="h-4 w-4" /> : done ? <Check className="h-4 w-4" /> : n}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block font-display text-lg font-semibold text-slate-900 dark:text-white">{title}</span>
            {!open && (problem || answer) && <span className={`block truncate text-sm ${problem ? "font-semibold text-red-700 dark:text-red-400" : "text-slate-600 dark:text-slate-400"}`}>{problem ?? answer}</span>}
          </span>
          {!open && (answer || problem) && <span className="shrink-0 text-sm font-semibold text-slate-700 underline underline-offset-2 dark:text-slate-300">{tx("Change")}</span>}
        </button>
      </h2>
      <div id={`pk-panel-${id}`} hidden={!open} className="animate-step-in border-t border-slate-200 p-5 sm:p-6 dark:border-white/10">
        {children}
        {onNext && <button type="button" onClick={onNext} className={`${secondaryBtn} mt-6`}>{tx("Next")}</button>}
      </div>
    </section>
  );
}

function Checklist({ o, submitted }: { o: LiveOrder; submitted: { tried: boolean; open: Row; seen: Set<Row>; go: (r: Row) => void } }) {
  const tx = useT();
  const money = useMoney();
  const { tried, open, seen, go } = submitted;
  const s = o.service!;
  const answered = (r: Row) => seen.has(r) || tried;
  const next = () => go(ROWS[ROWS.indexOf(open) + 1]);
  const amountProblem = tried && o.problem === "qty" ? tx("Check the amount") : undefined;
  const badField = s.fields.find((f) => f.name === o.problem);
  const detailsProblem = !tried || !o.problem || o.problem === "qty" ? undefined
    : badField ? tx("Add {0}", { 0: badField.title }) : tx("Answer the call question");
  const link = o.target ? (o.values[o.target.name] ?? "").trim().replace(/^https?:\/\/(www\.)?/, "") : "";
  return (
    <div className="min-w-0 space-y-3">
      <Step id="service" n={1} title={tx("Service")} answer={answered("service") ? s.name : undefined} open={open === "service"} onOpen={() => go("service")} onNext={next}>
        {/* F's service cards: a swipe row on phones, two per row from tablets. */}
        <fieldset className="min-w-0">
          <legend className="text-base font-semibold text-slate-900 dark:text-white">{`${o.d.platform.name} · ${tx("Service")}`}</legend>
          <div className="-mx-5 mt-3 flex snap-x snap-mandatory scroll-px-5 gap-3 overflow-x-auto px-5 pb-2 pt-1 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0">
            {o.d.services.map((x) => <ServiceCard key={x.id} o={o} s={x} className="w-[78%] shrink-0 snap-start sm:w-auto" />)}
          </div>
        </fieldset>
      </Step>
      <Step id="amount" n={2} title={tx("Amount")} problem={amountProblem} open={open === "amount"} onOpen={() => go("amount")} onNext={next}
        answer={answered("amount") && o.count && !o.qtyError ? <span className="tabular-nums">{`${o.num(o.count)} · ${money.format(o.total)}`}</span> : undefined}>
        <LiveAmount o={o} />
      </Step>
      <Step id="details" n={3} title={tx("Where to deliver")} problem={detailsProblem} open={open === "details"} onOpen={() => go("details")}
        answer={link && !o.problem ? <span dir="ltr">{link}</span> : undefined}>
        <LiveFields o={o} />
      </Step>
    </div>
  );
}

function BodyK() {
  const tx = useT();
  const spot = useSpotlight();
  const { d, o } = usePlatform();
  const [sumRef, sumOn] = useOnScreen<HTMLDivElement>();
  const [open, setOpen] = useState<Row>("service");
  const [seen, setSeen] = useState<Set<Row>>(new Set());
  const [tried, setTried] = useState(false);
  if (o.order) return <Done o={o} />;

  const go = (r: Row) => { setSeen((x) => new Set(x).add(open)); setOpen(r); };
  // Open the row with the problem first, so the field to fix is on screen when the order logic focuses it.
  const submit = () => {
    setTried(true);
    setSeen(new Set(ROWS));
    const p = !o.problem ? null : o.problem === "qty" ? "amount" : "details";
    if (p && p !== open) { setOpen(p); setTimeout(() => o.proceed(), 0); return false; }
    return o.proceed();
  };
  const pills = spot ? "chips" : "glass";

  return (
    <PageShell heroDark={!spot}>
      <div style={{ ...o.tone.vars, ...toneVars(d) }}>
        <section aria-labelledby="pk-h1" className={`relative -mt-16 overflow-hidden pb-28 pt-28 ${spot ? spotTone.title : "text-white"}`}>
          {spot ? <SpotlightBand under={false} beam="start" /> : <Band c={d.platform} />}
          <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
            <div className="flex items-center justify-between gap-5 lg:max-w-[calc(100%-400px)]">
              <div className="min-w-0">
                <h1 id="pk-h1" className="text-balance font-display text-3xl font-bold tracking-tight sm:text-5xl">{d.title}</h1>
                {d.sub && <p className={`mt-2 max-w-2xl text-base leading-relaxed sm:mt-3 sm:text-lg ${spot ? spotTone.sub : "text-white/90"}`}>{d.sub}</p>}
              </div>
              <LiveMark key={d.platform.slug} c={d.platform} size="xl" className="hidden animate-pop shadow-2xl shadow-black/30 sm:grid" />
            </div>
            <PlatformSwitch d={d} look={pills} className="mt-6" />
            <div className="mt-5"><Trust light={!spot} items={[tx("No password needed"), tx("24/7 support"), tx("Refund if it can't start")]} /></div>
            {o.notice && <LiveNotice n={o.notice} />}
          </div>
        </section>

        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <form noValidate onSubmit={(e) => { e.preventDefault(); submit(); }} className="grid grid-cols-[minmax(0,1fr)] gap-x-10 gap-y-10 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div className="relative z-10 -mt-16 min-w-0 lg:col-start-1 lg:row-start-1">
              {d.error || !o.service ? <div className={`${card} p-6 shadow-2xl shadow-slate-950/15`}><Empty o={o} /></div>
                : <Checklist o={o} submitted={{ tried, open, seen, go }} />}
            </div>
            <aside aria-label={tx("Your order")} className="relative z-10 min-w-0 lg:col-start-2 lg:row-start-1 lg:-mt-72">
              <div ref={sumRef} className="lg:sticky lg:top-24"><LiveSummary o={o} className={`${card} shadow-2xl shadow-slate-950/20`} /></div>
            </aside>
          </form>
        </div>
        <PlatformBelow d={d} />
        {o.service && <><PayBar o={{ ...o, proceed: submit }} hide={sumOn} /><LiveCheckout o={o} /></>}
      </div>
    </PageShell>
  );
}
export const SocialPlatformK = () => <PlatformRoot><BodyK /></PlatformRoot>;
