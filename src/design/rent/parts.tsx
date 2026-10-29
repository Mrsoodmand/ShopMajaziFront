"use client";
import { useEffect, useId, useState, type ReactNode } from "react";
import Link from "@/i18n/Link";
import { Check, ChevronRight, Inbox, MessageSquare, RefreshCw } from "lucide-react";
import CheckoutModal, { type PayMethod } from "@/components/checkout/CheckoutModal";
import { useMoney } from "@/lib/money";
import { appInbox, durations, endDate, perDay, priceApp, priceFor, rentCountries, rentFaq, rentPoints, sampleInbox, sampleRentNumber, savingFor, type Duration, type RentApp, type RentCountry } from "@/content/rent-en";
import { AppTile, CC, CopyButton } from "../otp/parts";
import { field, primary, ring, secondary } from "../googleVoice/clean";
import { useT } from "@/i18n/client";

// Pieces shared by the Rent Number page offers. Every picker is a real radio group with a visible focus ring.

// `app` is set for a single-app rental.
export type RentOrder = { country: RentCountry; days: number; price: number; number: string; paidWith: PayMethod; app?: RentApp };

export function useRent(initial: RentCountry = rentCountries[0]) {
  const tx = useT();
  if (initial === tx.tr(rentCountries)[0]) initial = tx.tr(rentCountries)[0];
  const [country, setCountry] = useState<RentCountry>(initial);
  const [duration, setDuration] = useState<Duration>(tx.tr(durations)[0]);
  // Designs with free day counts (the slider) set `custom`; otherwise the duration's price applies.
  const [custom, setCustom] = useState<{ days: number; price: number } | null>(null);
  const [payOpen, setPayOpen] = useState(false);
  const [order, setOrder] = useState<RentOrder | null>(null);
  const days = custom?.days ?? duration.days;
  const price = custom?.price ?? priceFor(country, duration);
  const buy = (m: PayMethod) => {
    setOrder({ country, days, price, number: sampleRentNumber(country.cc), paidWith: m });
    setPayOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return { country, setCountry, duration, setDuration, custom, setCustom, days, price, payOpen, openPay: () => setPayOpen(true), closePay: () => setPayOpen(false), order, buy, reset: () => setOrder(null) };
}
export type Rent = ReturnType<typeof useRent>;

export function RentCheckout({ r }: { r: Rent }) {
  const tx = useT();
  return (
    <CheckoutModal open={r.payOpen} onClose={r.closePay} price={r.price} itemLabel={tx("Rental · {0} days", { 0: r.days })} payLabel={tx("Pay")}
      note={tx("No SMS in the first hour? We replace the number.")} onPay={r.buy}
      summary={<>
        <CC cc={r.country.cc} />
        <div className="min-w-0 flex-1">
          <div className="font-semibold text-slate-900 dark:text-white">{r.country.name}{" "}{tx("number")}</div>
          <div className="text-xs text-slate-500 dark:text-slate-400">{r.days}{" "}{tx("days · unlimited SMS · until")}{" "}{tx(endDate(r.days))}</div>
        </div>
      </>} />
  );
}

// ---------- Pickers ----------

const option = (on: boolean) =>
  `relative flex cursor-pointer items-center gap-3 rounded-2xl border-2 bg-white transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-emerald-600 has-[:focus-visible]:ring-offset-2 dark:bg-[#0E1424] dark:has-[:focus-visible]:ring-emerald-400 dark:has-[:focus-visible]:ring-offset-[#070B14] ${on ? "border-emerald-700 dark:border-emerald-400" : "border-slate-200 hover:border-slate-400 dark:border-white/15 dark:hover:border-white/40"}`;

export function Dot({ on }: { on: boolean }) {
  return (
    <span aria-hidden className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 ${on ? "border-emerald-700 bg-emerald-700 dark:border-emerald-400 dark:bg-emerald-400" : "border-slate-400 dark:border-white/30"}`}>
      {on && <Check className="h-3.5 w-3.5 text-white dark:text-emerald-950" strokeWidth={3} />}
    </span>
  );
}

// Country list with an optional search box. Prices shown are for one week.
export function CountryRadios({ r, legend = "Country", search = true, cols = 2, onPick }: { r: Rent; legend?: string; search?: boolean; cols?: 1 | 2 | 3; onPick?: (c: RentCountry) => void }) {
  const usd = useMoney().format;
  const tx = useT();
  legend = tx(legend);
  const [q, setQ] = useState("");
  const name = useId(), qId = useId();
  const list = tx.tr(rentCountries).filter((c) => c.name.toLowerCase().includes(q.trim().toLowerCase()));
  return (
    <fieldset>
      <legend className="text-sm font-semibold text-slate-900 dark:text-white">{legend}</legend>
      {search && (
        <div className="mt-3">
          <label htmlFor={qId} className="sr-only">{tx("Search countries")}</label>
          <input id={qId} type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={tx("Search countries")} autoComplete="off" className={field} />
          <p aria-live="polite" className="sr-only">{list.length}{" "}{tx("countries")}</p>
        </div>
      )}
      <div className={`mt-3 grid gap-2.5 ${cols === 2 ? "sm:grid-cols-2" : cols === 3 ? "sm:grid-cols-2 lg:grid-cols-3" : ""}`}>
        {list.map((c) => {
          const on = r.country.cc === c.cc;
          return (
            <label key={c.cc} className={`${option(on)} px-4 py-3`}>
              <input type="radio" autoComplete="off" name={name} checked={on} onChange={() => { r.setCountry(c); onPick?.(c); }} className="sr-only" />
              <Dot on={on} />
              <CC cc={c.cc} />
              <span className="min-w-0 flex-1">
                <span className="block font-semibold text-slate-900 dark:text-white">{c.name}</span>
                <span className="text-sm text-slate-600 dark:text-slate-400">{tx("from")}{" "}{usd(c.week)}{" "}{tx("/ week")}</span>
              </span>
            </label>
          );
        })}
        {list.length === 0 && <p className="text-slate-600 dark:text-slate-400">{tx("No country matches “")}{q}”.</p>}
      </div>
    </fieldset>
  );
}

// 1 week / 2 weeks / 1 month, each with its total, per-day price and saving.
export function DurationRadios({ r, legend = "How long?", stacked = false }: { r: Rent; legend?: string; stacked?: boolean }) {
  const usd = useMoney().format;
  const tx = useT();
  legend = tx(legend);
  const name = useId();
  return (
    <fieldset>
      <legend className="text-sm font-semibold text-slate-900 dark:text-white">{legend}</legend>
      <div className={`mt-3 grid gap-2.5 ${stacked ? "" : "sm:grid-cols-3"}`}>
        {tx.tr(durations).map((d) => {
          const on = !r.custom && r.duration.days === d.days;
          const save = savingFor(d);
          return (
            <label key={d.days} className={`${option(on)} ${stacked ? "px-4 py-3" : "flex-col items-start p-4"}`}>
              <input type="radio" autoComplete="off" name={name} checked={on} onChange={() => { r.setCustom(null); r.setDuration(d); }} className="sr-only" />
              <span className="flex w-full items-center gap-3">
                <Dot on={on} />
                <span className="flex-1 font-semibold text-slate-900 dark:text-white">{d.label}</span>
                {save > 0 && <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-900 dark:bg-amber-500/20 dark:text-amber-200">{tx("Save")}{" "}{save}%</span>}
              </span>
              <span className={`text-slate-700 dark:text-slate-300 ${stacked ? "ms-auto text-end" : "mt-2 ps-9"}`}>
                <span className="text-lg font-bold text-slate-900 dark:text-white">{usd(priceFor(r.country, d))}</span>
                <span className="block whitespace-nowrap text-sm text-slate-600 dark:text-slate-400">{usd(perDay(r.country, d))}{" "}{tx("a day")}</span>
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

// ---------- Summary ----------

export function RentSummary({ r, title = "Your rental", children }: { r: Rent; title?: string; children?: ReactNode }) {
  const usd = useMoney().format;
  const tx = useT();
  title = tx(title);
  const rows: [string, ReactNode][] = [
    [tx("Country"), <span key="c" className="inline-flex items-center gap-2"><CC cc={r.country.cc} />{r.country.name}</span>],
    [tx("Length"), `${r.days} days`],
    [tx("Ends"), tx(endDate(r.days))],
    ["SMS", tx("Unlimited, any app")],
    [tx("Total"), <span key="t" className="text-lg font-bold">{usd(r.price)}</span>],
  ];
  return (
    <section aria-labelledby="rent-summary" className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-white/15 dark:bg-[#0E1424]">
      <h2 id="rent-summary" className="font-display text-lg font-semibold text-slate-900 dark:text-white">{title}</h2>
      <dl className="mt-4 divide-y divide-slate-200 text-[15px] dark:divide-white/10">
        {rows.map(([k, v]) => (
          <div key={k} className="flex items-center justify-between gap-4 py-2.5">
            <dt className="text-slate-600 dark:text-slate-400">{k}</dt>
            <dd className="text-end font-medium text-slate-900 dark:text-white">{v}</dd>
          </div>
        ))}
      </dl>
      {children}
      <button onClick={r.openPay} className={`${primary} mt-5 w-full`}>{tx("Rent for")}{" "}{usd(r.price)}</button>
      <p className="mt-3 text-center text-sm text-slate-600 dark:text-slate-400">{tx("No SMS in the first hour? We replace the number.")}</p>
    </section>
  );
}

// ---------- Info ----------

export function Points({ cols = 4 }: { cols?: 2 | 4 }) {
  const tx = useT();
  return (
    <ul className={`grid gap-6 sm:grid-cols-2 ${cols === 4 ? "lg:grid-cols-4" : ""}`}>
      {tx.tr(rentPoints).map((p) => (
        <li key={p.title} className="flex gap-3">
          <Check aria-hidden className="mt-1 h-5 w-5 shrink-0 text-emerald-700 dark:text-emerald-400" />
          <span><span className="block font-semibold text-slate-900 dark:text-white">{p.title}</span><span className="text-slate-600 dark:text-slate-400">{p.text}</span></span>
        </li>
      ))}
    </ul>
  );
}

export function RentFaq() {
  const tx = useT();
  return (
    <div className="divide-y divide-slate-200 rounded-3xl border border-slate-200 bg-white dark:divide-white/10 dark:border-white/15 dark:bg-[#0E1424]">
      {tx.tr(rentFaq).map((f) => (
        <details key={f.q} className="group p-5 [&_summary::-webkit-details-marker]:hidden">
          <summary className={`flex cursor-pointer list-none items-center justify-between gap-4 rounded-lg font-semibold text-slate-900 dark:text-white ${ring}`}>
            {f.q}<ChevronRight aria-hidden className="h-4 w-4 shrink-0 text-slate-500 transition group-open:rotate-90 rtl:rotate-180 rtl:group-open:rotate-90" />
          </summary>
          <p className="mt-3 text-[15px] leading-7 text-slate-700 dark:text-slate-300">{f.a}</p>
        </details>
      ))}
    </div>
  );
}

export function Title({ children, sub, kicker = "Rent a number" }: { children: ReactNode; sub?: ReactNode; kicker?: string }) {
  const tx = useT();
  kicker = tx(kicker);
  return (
    <div>
      <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">{kicker}</p>
      <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl dark:text-white">{children}</h1>
      {sub && <p className="mt-4 max-w-2xl text-lg leading-relaxed text-slate-700 dark:text-slate-300">{sub}</p>}
    </div>
  );
}

export function Heading({ id, children }: { id?: string; children: ReactNode }) {
  return <h2 id={id} className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-white">{children}</h2>;
}

// ---------- Inbox (preview and the live rental) ----------

// Messages arrive one by one. `role="log"` lets screen readers announce each new one; `announce={false}` keeps an
// example preview quiet.
export function InboxList({ live = true, label = "Inbox", announce = true, messages = sampleInbox }: { live?: boolean; label?: string; announce?: boolean; messages?: { from: string; text: string; ago: string }[] }) {
  const tx = useT();
  label = tx(label);
  messages = tx.tr(messages);
  const [count, setCount] = useState(live ? 1 : messages.length);
  useEffect(() => {
    if (!live || window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setCount(messages.length); return; }
    const t = setInterval(() => setCount((c) => (c >= messages.length ? c : c + 1)), 1800);
    return () => clearInterval(t);
  }, [live, messages.length]);
  // Messages are newest first, so they "arrive" from the end; the list shows the newest on top.
  const shown = messages.slice(messages.length - count);
  return (
    <ul role={announce ? "log" : undefined} aria-label={label} aria-live={announce ? "polite" : "off"} className="space-y-2.5">
      {shown.map((m) => (
        <li key={m.from + m.ago} className="animate-fade-up rounded-2xl border border-slate-200 bg-white p-4 [animation-duration:400ms] dark:border-white/10 dark:bg-white/5">
          <div className="flex items-center gap-2 text-sm">
            <MessageSquare aria-hidden className="h-4 w-4 text-emerald-700 dark:text-emerald-400" />
            <span className="font-semibold text-slate-900 dark:text-white">{m.from}</span>
            <span className="ms-auto text-slate-500 dark:text-slate-400">{m.ago}</span>
          </div>
          <p className="mt-1.5 text-[15px] text-slate-700 dark:text-slate-300">{m.text}</p>
        </li>
      ))}
    </ul>
  );
}

// The active rental after paying: number, time left, inbox, extend and auto-renew.
export function RentOrderView({ order: o, onReset }: { order: RentOrder; onReset: () => void }) {
  const usd = useMoney().format;
  const tx = useT();
  const extendPrice = (d: Duration) => (o.app ? priceApp(o.country, d, o.app) : priceFor(o.country, d));
  const [auto, setAuto] = useState(false);
  const [extend, setExtend] = useState<Duration>(tx.tr(durations)[0]);
  const [added, setAdded] = useState(0);
  const total = o.days + added;
  const name = useId();
  return (
    <div className="mx-auto max-w-5xl animate-fade-up">
      <p className="flex items-center gap-2 font-semibold text-emerald-800 dark:text-emerald-300"><Check aria-hidden className="h-5 w-5" />{tx("Payment received · your rental is active")}</p>
      <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">{tx("Your")}{" "}{o.country.name}{" "}{tx("number")}</h1>
      <p className="mt-2 flex items-center gap-2 text-slate-700 dark:text-slate-300">{o.app ? <><AppTile app={o.app} size="sm" />{tx("For")}{" "}{o.app.name}{" "}{tx("only")}</> : tx("Receives SMS from any app")}</p>

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-6">
          <section aria-labelledby="num" className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-white/15 dark:bg-[#0E1424]">
            <h2 id="num" className="sr-only">{tx("Number")}</h2>
            <div className="flex flex-wrap items-center gap-4">
              <CC cc={o.country.cc} />
              <span className="flex-1 font-mono text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">{o.number}</span>
              <CopyButton text={o.number} label={tx("Copy number")} />
            </div>
            <div className="mt-6">
              <div className="flex justify-between text-sm"><span className="text-slate-700 dark:text-slate-300"><strong className="text-slate-900 dark:text-white">{total}{" "}{tx("days")}</strong>{" "}{tx("left")}</span><span className="text-slate-600 dark:text-slate-400">{tx("Ends")}{" "}{tx(endDate(total))}</span></div>
              <div role="progressbar" aria-label={tx("Rental time left")} aria-valuemin={0} aria-valuemax={total} aria-valuenow={total} className="mt-2 h-2.5 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
                <div className="h-full w-full rounded-full bg-emerald-600 dark:bg-emerald-400" />
              </div>
            </div>
          </section>

          <section aria-labelledby="inbox-h">
            <h2 id="inbox-h" className="flex items-center gap-2 font-display text-xl font-semibold text-slate-900 dark:text-white"><Inbox aria-hidden className="h-5 w-5" />{tx("Inbox")}</h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{tx("New messages appear here automatically.")}</p>
            <div className="mt-4"><InboxList label={tx("Messages received")} messages={o.app ? appInbox(o.app.name) : tx.tr(sampleInbox)} /></div>
          </section>
        </div>

        <aside className="space-y-6">
          <section aria-labelledby="ext" className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-white/15 dark:bg-[#0E1424]">
            <h2 id="ext" className="font-display text-lg font-semibold text-slate-900 dark:text-white">{tx("Extend")}</h2>
            <fieldset className="mt-3">
              <legend className="sr-only">{tx("Add time")}</legend>
              <div className="space-y-2">
                {tx.tr(durations).map((d) => (
                  <label key={d.days} className={`${option(extend.days === d.days)} px-3 py-2.5`}>
                    <input type="radio" autoComplete="off" name={name} checked={extend.days === d.days} onChange={() => setExtend(d)} className="sr-only" />
                    <Dot on={extend.days === d.days} />
                    <span className="flex-1 font-medium text-slate-900 dark:text-white">+ {d.label}</span>
                    <span className="font-semibold text-slate-900 dark:text-white">{usd(extendPrice(d))}</span>
                  </label>
                ))}
              </div>
            </fieldset>
            <button onClick={() => setAdded((a) => a + extend.days)} className={`${secondary} mt-4 w-full`}><RefreshCw aria-hidden className="h-4 w-4" />{tx("Extend by")}{" "}{extend.label}</button>
            <p aria-live="polite" className="mt-2 text-center text-sm text-emerald-800 dark:text-emerald-300">{added > 0 && tx("Added {0} days. Ends {1}.", { 0: added, 1: tx(endDate(total)) })}</p>
          </section>

          <div className="flex items-center justify-between gap-4 rounded-3xl border border-slate-200 bg-white p-5 dark:border-white/15 dark:bg-[#0E1424]">
            <span id="auto-l" className="text-[15px]"><span className="block font-semibold text-slate-900 dark:text-white">{tx("Auto-renew")}</span><span className="text-sm text-slate-600 dark:text-slate-400">{tx("Extend by a week from your wallet")}</span></span>
            <button role="switch" aria-checked={auto} aria-labelledby="auto-l" onClick={() => setAuto(!auto)} className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${auto ? "bg-emerald-700 dark:bg-emerald-400" : "bg-slate-300 dark:bg-white/20"} ${ring}`}>
              <span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all ${auto ? "start-6" : "start-1"}`} />
            </button>
          </div>

          <div className="flex flex-col gap-3">
            <Link href="/dashboard/orders" className={primary}>{tx("View in my orders")}</Link>
            <button onClick={onReset} className={secondary}>{tx("Rent another number")}</button>
          </div>
        </aside>
      </div>
    </div>
  );
}
