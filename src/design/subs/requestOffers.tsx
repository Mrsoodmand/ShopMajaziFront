"use client";
import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import { ArrowLeft, MessageSquarePlus, Plus, Search, SearchX, Send, X } from "lucide-react";
import { MoneyProvider, useMoney } from "@/lib/money";
import { LocaleProvider, useT } from "@/i18n/client";
import { subs } from "@/content/subs-en";
import { ProductButton, Tile as ProductTile } from "./parts";
import { field, primary, ring, secondary } from "../googleVoice/clean";
import { REQ_HEX, REQUEST_STATUS as TONE, RequestCard, RequestDone as Done, RequestPanelHead } from "./request";

// «درخواست اکانت»: a customer asks for a subscription we don't sell (e.g. qq.com); support answers with a price that
// becomes a custom order paid in /account (backend App\Services\AccountRequests). Gallery section "subs-request"
// shows where the entry sits on /accounts and how its form opens, each with the full list and a search that found
// nothing; "page-account-requests" shows the customer's requests in /account. The form here is the admin's default
// (site name, address, plan, details); the live one comes from admin › درخواست اکانت › فرم.
// tile (A): the last card of the grid; the form opens in the side panel where a product's plans show.
// band (B): a band under the grid; the form opens in a dialog.
// unfold (C): a band under the grid that opens the form right inside it.
// search (D): a quiet line under the grid; a search with no result becomes a card with the form already open.
// card (F): an account card like the products' own, last in the grid; the form opens in the side panel.
// grow (G): the same card; picking it widens it across the row with the form inside.
// ask (E): one question («دنبال چه اکانتی هستید؟») with a single input; the rest of the form follows it.

type Field = { key: string; title: string; hint?: string; type: "text" | "textarea"; required?: boolean; ltr?: boolean };
const FORM: Field[] = [
  { key: "site_name", title: "Site or service name", hint: "e.g. QQ or Notion", type: "text", required: true },
  { key: "site_url", title: "Website address", hint: "e.g. qq.com", type: "text", ltr: true },
  { key: "plan", title: "Plan or length", hint: "e.g. Premium, one month", type: "text" },
  { key: "details", title: "More details", hint: "Anything it would help us to know", type: "textarea" },
];

const card = "rounded-3xl border border-slate-200 bg-white dark:border-white/15 dark:bg-[#0E1424]";
const label = "block text-sm font-semibold text-slate-900 dark:text-white";
const muted = "text-slate-600 dark:text-slate-400";

/* ---------- Shared pieces ---------- */

/** The admin's form. `skip` leaves out fields already asked (offer E asks the name first). */
function RequestForm({ prefill = "", onCancel, skip = [], autoFocus = false }: { prefill?: string; onCancel?: () => void; skip?: string[]; autoFocus?: boolean }) {
  const t = useT();
  const id = useId();
  const [values, setValues] = useState<Record<string, string>>({ site_name: prefill });
  const [error, setError] = useState<string | null>(null);
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");
  const first = useRef<HTMLInputElement>(null);
  useEffect(() => { if (autoFocus) first.current?.focus(); }, [autoFocus]);
  if (state === "done") return <Done href="#account-requests" onAgain={() => { setValues({ site_name: "" }); setState("idle"); }} />;

  const send = (e: FormEvent) => {
    e.preventDefault();
    const missing = FORM.find((f) => f.required && !skip.includes(f.key) && !values[f.key]?.trim());
    if (missing) return setError(t("Please fill in “{0}”.", { 0: t(missing.title) }));
    setError(null);
    setState("sending");
    setTimeout(() => setState("done"), 600); // gallery: no request is sent
  };
  const fields = FORM.filter((f) => !skip.includes(f.key));
  return (
    <form onSubmit={send} noValidate className="space-y-4">
      {fields.map((f, i) => (
        <div key={f.key}>
          <label htmlFor={`${id}-${f.key}`} className={label}>{t(f.title)}{!f.required && <span className={`ms-1.5 text-xs font-normal ${muted}`}>({t("Optional")})</span>}</label>
          {f.type === "textarea"
            ? <textarea id={`${id}-${f.key}`} rows={2} className={`${field} mt-1.5 !py-2.5`} placeholder={t(f.hint ?? "")} value={values[f.key] ?? ""} onChange={(e) => setValues({ ...values, [f.key]: e.target.value })} />
            : <input ref={i === 0 ? first : undefined} id={`${id}-${f.key}`} dir={f.ltr ? "ltr" : undefined} className={`${field} mt-1.5 !py-2.5`} placeholder={t(f.hint ?? "")} value={values[f.key] ?? ""}
                aria-invalid={!!error && f.required && !values[f.key]?.trim()} aria-describedby={error ? `${id}-err` : undefined} onChange={(e) => setValues({ ...values, [f.key]: e.target.value })} />}
        </div>
      ))}
      {error && <p id={`${id}-err`} role="alert" className="text-sm font-semibold text-red-700 dark:text-red-400">{error}</p>}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        <button type="submit" disabled={state === "sending"} className={`${primary} flex-1 !py-3`}><Send aria-hidden className="h-4 w-4 -scale-x-100" />{state === "sending" ? t("Sending…") : t("Send request")}</button>
        {onCancel && <button type="button" onClick={onCancel} className={`${secondary} !py-3`}>{t("Cancel")}</button>}
      </div>
      <p className={`text-xs ${muted}`}>{t("Usually answered within a few hours.")}</p>
    </form>
  );
}

/** A trimmed copy of the /accounts catalog: search, a few cards, and the slots each offer fills. */
function Catalog({ empty, q, inGrid, below, onEmpty, side }: { empty: boolean; q: string; inGrid?: ReactNode; below?: ReactNode; onEmpty?: ReactNode; side?: ReactNode }) {
  const t = useT();
  const [picked, setPicked] = useState("chatgpt-plus");
  const list = empty ? [] : subs.slice(0, 5);
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
      <section aria-label={t("Catalog")}>
        <div className="relative max-w-md">
          <Search aria-hidden className="pointer-events-none absolute start-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
          <input readOnly value={empty ? q : ""} placeholder="ChatGPT، Netflix، Spotify…" aria-label={t("Search")} className={`${field} !ps-11`} />
        </div>
        <ul className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {list.map((p) => <li key={p.slug}><ProductButton more p={p} on={picked === p.slug} onPick={() => setPicked(p.slug)} /></li>)}
          {!empty && inGrid}
        </ul>
        {empty ? onEmpty : below}
      </section>
      {side !== undefined && <div className="lg:sticky lg:top-6 lg:self-start">{side}</div>}
    </div>
  );
}

/** Gallery toggle between the full list and a search that found nothing. */
function Demo({ children }: { children: (empty: boolean, q: string) => ReactNode }) {
  const t = useT();
  const [empty, setEmpty] = useState(false);
  return (
    <div className="mx-auto w-full max-w-6xl">
      <div role="radiogroup" aria-label="حالت فهرست" className="mb-5 inline-flex rounded-xl border border-slate-200 bg-slate-50 p-1 text-sm dark:border-white/15 dark:bg-white/5">
        {[false, true].map((on) => (
          <button key={String(on)} type="button" role="radio" aria-checked={empty === on} onClick={() => setEmpty(on)}
            className={`rounded-lg px-3 py-1.5 font-semibold ${empty === on ? "bg-white text-slate-900 shadow-sm dark:bg-white/15 dark:text-white" : "text-slate-600 dark:text-slate-400"}`}>
            {on ? t("Search with no result") : t("Full list")}
          </button>
        ))}
      </div>
      {children(empty, "qq")}
    </div>
  );
}

function EmptyLine({ q }: { q: string }) {
  const t = useT();
  return (
    <div className="flex items-center gap-3">
      <SearchX aria-hidden className="h-6 w-6 shrink-0 text-slate-500" />
      <div>
        <p className="font-semibold text-slate-900 dark:text-white">{t("We couldn't find “{0}”", { 0: q })}</p>
        <p className={`text-sm ${muted}`}>{t("We don't sell it yet, but we may be able to get it for you.")}</p>
      </div>
    </div>
  );
}

/* ---------- A · Tile in the grid → side panel ---------- */

function Tile() {
  // A search with no result opens the form in the panel straight away (there is no tile to press).
  return <Demo>{(empty, q) => <TileInner key={String(empty)} empty={empty} q={q} startOpen={empty} />}</Demo>;
}

function TileInner({ empty, q, startOpen }: { empty: boolean; q: string; startOpen: boolean }) {
  const t = useT();
  const [open, setOpen] = useState(startOpen);
  const tile = (
    <li>
      <button type="button" onClick={() => setOpen(true)} className={`flex h-full min-h-[132px] w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-300 p-4 text-center text-slate-700 transition-colors hover:border-emerald-600 hover:text-emerald-800 dark:border-white/20 dark:text-slate-300 dark:hover:border-emerald-400 dark:hover:text-emerald-300 ${ring}`}>
        <Plus aria-hidden className="h-6 w-6" />
        <span className="font-semibold">{t("Can't find the account you want?")}</span>
        <span className="text-sm">{t("Request it from us")}</span>
      </button>
    </li>
  );
  return (
    <Catalog empty={empty} q={q} inGrid={tile}
      onEmpty={<div className="mt-6"><EmptyLine q={q} /></div>}
      side={<div className={`${card} p-6`}>
        {open
          ? <><h2 className="mb-1 font-display text-lg font-bold text-slate-900 dark:text-white">{t("Request an account")}</h2><p className={`mb-4 text-sm ${muted}`}>{t("Tell us which site it is. We'll check whether we can get it and send you the price.")}</p><RequestForm prefill={empty ? q : ""} onCancel={empty ? undefined : () => setOpen(false)} /></>
          : <p className={`py-10 text-center ${muted}`}>{t("You'll see its plans and price here.")}</p>}
      </div>} />
  );
}

/* ---------- B · Band under the grid → dialog ---------- */

function Band() {
  const t = useT();
  const dialog = useRef<HTMLDialogElement>(null);
  const [q, setQ] = useState("");
  const open = (prefill: string) => { setQ(prefill); dialog.current?.showModal(); };
  const band = (prefill: string) => (
    <div className="mt-8 flex flex-col items-start gap-4 rounded-3xl bg-gradient-to-l from-emerald-50 to-sky-50 p-6 sm:flex-row sm:items-center sm:justify-between dark:from-emerald-500/10 dark:to-sky-500/10">
      <div className="flex items-start gap-3">
        <MessageSquarePlus aria-hidden className="mt-0.5 h-6 w-6 shrink-0 text-emerald-700 dark:text-emerald-400" />
        <div>
          <p className="font-display text-lg font-bold text-slate-900 dark:text-white">{prefill ? t("We couldn't find “{0}”", { 0: prefill }) : t("Can't find the account you want?")}</p>
          <p className={`mt-0.5 text-sm ${muted}`}>{t("Tell us which site it is. We'll check whether we can get it and send you the price.")}</p>
        </div>
      </div>
      <button type="button" onClick={() => open(prefill)} className={`${primary} shrink-0 !py-3`}>{prefill ? t("Request “{0}”", { 0: prefill }) : t("Request an account")}</button>
    </div>
  );
  return (
    <Demo>
      {(empty, sq) => (
        <>
          <Catalog empty={empty} q={sq} below={band("")} onEmpty={band(sq)} />
          <dialog ref={dialog} aria-labelledby="req-dlg-h" className="m-auto w-[min(32rem,calc(100vw-2rem))] rounded-3xl bg-white p-0 shadow-2xl backdrop:bg-slate-950/50 dark:bg-[#0E1424]" onClick={(e) => e.target === dialog.current && dialog.current.close()}>
            <div className="p-6">
              <div className="mb-4 flex items-start justify-between gap-3">
                <div><h2 id="req-dlg-h" className="font-display text-lg font-bold text-slate-900 dark:text-white">{t("Request an account")}</h2><p className={`mt-0.5 text-sm ${muted}`}>{t("Tell us which site it is. We'll check whether we can get it and send you the price.")}</p></div>
                <button type="button" onClick={() => dialog.current?.close()} aria-label={t("Close")} className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-white/10 ${ring}`}><X aria-hidden className="h-5 w-5" /></button>
              </div>
              <RequestForm key={q} prefill={q} />
            </div>
          </dialog>
        </>
      )}
    </Demo>
  );
}

/* ---------- C · Band that unfolds ---------- */

function UnfoldBand({ prefill }: { prefill: string }) {
  const t = useT();
  const [open, setOpen] = useState(!!prefill);
  const id = useId();
  return (
    <div className={`${card} mt-8 overflow-hidden`}>
      <div className="flex flex-col items-start gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-display text-lg font-bold text-slate-900 dark:text-white">{prefill ? t("We couldn't find “{0}”", { 0: prefill }) : t("Can't find the account you want?")}</p>
          <p className={`mt-0.5 text-sm ${muted}`}>{prefill ? t("We don't sell it yet, but we may be able to get it for you.") : t("Tell us which site it is. We'll check whether we can get it and send you the price.")}</p>
        </div>
        {!open && <button type="button" aria-expanded={open} aria-controls={id} onClick={() => setOpen(true)} className={`${secondary} shrink-0 !py-3`}><Plus aria-hidden className="h-4 w-4" />{t("Request an account")}</button>}
      </div>
      <div id={id} hidden={!open} className="border-t border-slate-200 bg-slate-50/60 p-6 dark:border-white/10 dark:bg-white/[.03]">
        <div className="max-w-xl">{open && <RequestForm prefill={prefill} onCancel={prefill ? undefined : () => setOpen(false)} autoFocus={!prefill} />}</div>
      </div>
    </div>
  );
}

function Unfold() {
  return <Demo>{(empty, q) => <Catalog empty={empty} q={q} below={<UnfoldBand prefill="" />} onEmpty={<UnfoldBand key="e" prefill={q} />} />}</Demo>;
}

/* ---------- D · Quiet line; the empty search is the form ---------- */

function SearchFirst() {
  const t = useT();
  const sheet = useRef<HTMLDialogElement>(null);
  const line = (
    <p className={`mt-6 text-sm ${muted}`}>
      {t("Can't find the account you want?")}{" "}
      <button type="button" onClick={() => sheet.current?.showModal()} className={`inline-flex items-center gap-1 font-semibold text-emerald-800 underline-offset-4 hover:underline dark:text-emerald-300 ${ring} rounded`}>{t("Request it from us")}<ArrowLeft aria-hidden className="h-4 w-4 rtl:rotate-0 ltr:rotate-180" /></button>
    </p>
  );
  return (
    <Demo>
      {(empty, q) => (
        <>
          <Catalog empty={empty} q={q} below={line}
            onEmpty={<div className={`${card} mt-6 grid gap-6 p-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]`}>
              <div><EmptyLine q={q} /><p className={`mt-4 text-sm leading-relaxed ${muted}`}>{t("Tell us which site it is. We'll check whether we can get it and send you the price.")}</p></div>
              <RequestForm prefill={q} />
            </div>} />
          <dialog ref={sheet} aria-labelledby="req-sheet-h" className="m-0 ms-auto h-dvh max-h-none w-[min(28rem,100vw)] bg-white p-0 shadow-2xl backdrop:bg-slate-950/50 dark:bg-[#0E1424]" onClick={(e) => e.target === sheet.current && sheet.current.close()}>
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between gap-3 border-b border-slate-200 p-5 dark:border-white/10">
                <h2 id="req-sheet-h" className="font-display text-lg font-bold text-slate-900 dark:text-white">{t("Request an account")}</h2>
                <button type="button" onClick={() => sheet.current?.close()} aria-label={t("Close")} className={`grid h-9 w-9 place-items-center rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-white/10 ${ring}`}><X aria-hidden className="h-5 w-5" /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-5"><p className={`mb-4 text-sm ${muted}`}>{t("Tell us which site it is. We'll check whether we can get it and send you the price.")}</p><RequestForm /></div>
            </div>
          </dialog>
        </>
      )}
    </Demo>
  );
}

/* ---------- E · One question first ---------- */

function AskCard({ prefill }: { prefill: string }) {
  const t = useT();
  const id = useId();
  const [name, setName] = useState(prefill);
  const [step, setStep] = useState<1 | 2>(1);
  return (
    <div className={`${card} mt-8 p-6 sm:p-8`}>
      <div className="mx-auto max-w-xl">
        {prefill && <div className="mb-5"><EmptyLine q={prefill} /></div>}
        {step === 1 ? (
          <form onSubmit={(e) => { e.preventDefault(); if (name.trim()) setStep(2); }}>
            <label htmlFor={id} className="block font-display text-xl font-bold text-slate-900 dark:text-white">{t("Which account are you looking for?")}</label>
            <p className={`mt-1 text-sm ${muted}`}>{t("Type the site's name and we'll ask a couple more things.")}</p>
            <div className="mt-4 flex gap-2">
              <input id={id} className={`${field} flex-1`} placeholder={t("e.g. QQ or Notion")} value={name} onChange={(e) => setName(e.target.value)} />
              <button type="submit" disabled={!name.trim()} className={`${primary} !px-5 disabled:opacity-50`}>{t("Next")}<ArrowLeft aria-hidden className="h-4 w-4 ltr:rotate-180" /></button>
            </div>
          </form>
        ) : (
          <>
            <p className="mb-4 flex flex-wrap items-center gap-2 text-sm">
              <span className={muted}>{t("Site or service name")}:</span>
              <span className="rounded-full bg-emerald-50 px-3 py-1 font-semibold text-emerald-900 dark:bg-emerald-500/15 dark:text-emerald-200">{name}</span>
              <button type="button" onClick={() => setStep(1)} className={`text-xs font-semibold text-slate-600 underline underline-offset-4 dark:text-slate-400 ${ring} rounded`}>{t("Edit")}</button>
            </p>
            <RequestForm skip={["site_name"]} autoFocus />
          </>
        )}
      </div>
    </div>
  );
}

function Ask() {
  return <Demo>{(empty, q) => <Catalog empty={empty} q={q} below={<AskCard prefill="" />} onEmpty={<AskCard key="e" prefill={q} />} />}</Demo>;
}

/* ---------- F, G · An account card like the products' own ---------- */

/** A sample product's panel, so picking a product beside the request card still shows something. */
function SamplePanel({ slug }: { slug: string }) {
  const t = useT();
  const p = subs.find((x) => x.slug === slug);
  if (!p) return null;
  return (
    <div className="flex items-start gap-4">
      <ProductTile p={p} />
      <div><p className="font-display text-xl font-bold text-slate-900 dark:text-white">{p.name}</p><p className={`mt-0.5 text-sm ${muted}`}>{t("You'll see its plans and price here.")}</p></div>
    </div>
  );
}

function CardSide() {
  return <Demo>{(empty, q) => <CardSideInner key={String(empty)} empty={empty} q={q} />}</Demo>;
}

function CardSideInner({ empty, q }: { empty: boolean; q: string }) {
  const t = useT();
  const [picked, setPicked] = useState(empty ? "request" : "chatgpt-plus");
  const list = empty ? [] : subs.slice(0, 5);
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
      <section aria-label={t("Catalog")}>
        <div className="relative max-w-md">
          <Search aria-hidden className="pointer-events-none absolute start-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
          <input readOnly value={empty ? q : ""} placeholder="ChatGPT، Netflix، Spotify…" aria-label={t("Search")} className={`${field} !ps-11`} />
        </div>
        <ul className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {list.map((p) => <li key={p.slug}><ProductButton more p={p} on={picked === p.slug} onPick={() => setPicked(p.slug)} /></li>)}
          <li><RequestCard on={picked === "request"} onPick={() => setPicked("request")} q={empty ? q : undefined} /></li>
        </ul>
      </section>
      <div className="lg:sticky lg:top-6 lg:self-start">
        <div className={`${card} p-6`}>
          {picked === "request"
            ? <div key={picked} className="animate-fade-up [animation-duration:250ms]"><RequestPanelHead q={empty ? q : undefined} /><RequestForm prefill={empty ? q : ""} /></div>
            : <SamplePanel slug={picked} />}
        </div>
      </div>
    </div>
  );
}

function CardGrow() {
  return <Demo>{(empty, q) => <CardGrowInner key={String(empty)} empty={empty} q={q} />}</Demo>;
}

function CardGrowInner({ empty, q }: { empty: boolean; q: string }) {
  const t = useT();
  const [open, setOpen] = useState(empty);
  const [picked, setPicked] = useState("chatgpt-plus");
  const list = empty ? [] : subs.slice(0, 5);
  const wash = { backgroundImage: `linear-gradient(color-mix(in srgb, ${REQ_HEX} 9%, transparent), color-mix(in srgb, ${REQ_HEX} 9%, transparent))` };
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
      <section aria-label={t("Catalog")}>
        <div className="relative max-w-md">
          <Search aria-hidden className="pointer-events-none absolute start-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
          <input readOnly value={empty ? q : ""} placeholder="ChatGPT، Netflix، Spotify…" aria-label={t("Search")} className={`${field} !ps-11`} />
        </div>
        <ul className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {list.map((p) => <li key={p.slug}><ProductButton more p={p} on={picked === p.slug} onPick={() => setPicked(p.slug)} /></li>)}
          {open ? (
            <li className="sm:col-span-2 xl:col-span-3">
              <div style={wash} className="relative overflow-hidden rounded-3xl border-2 border-emerald-600/50 bg-white p-6 dark:border-emerald-400/40 dark:bg-[#0E1424]">
                <span aria-hidden style={{ backgroundColor: REQ_HEX }} className="pointer-events-none absolute -end-10 -top-10 h-40 w-40 rounded-full opacity-15 blur-2xl" />
                <div className="relative grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
                  <div>
                    <RequestPanelHead q={empty ? q : undefined} />
                    {!empty && <button type="button" onClick={() => setOpen(false)} className={`${secondary} !px-4 !py-2 text-sm`}><X aria-hidden className="h-4 w-4" />{t("Close")}</button>}
                  </div>
                  <RequestForm prefill={empty ? q : ""} autoFocus={!empty} />
                </div>
              </div>
            </li>
          ) : (
            <li><RequestCard on={false} onPick={() => setOpen(true)} /></li>
          )}
        </ul>
      </section>
      <div className="lg:sticky lg:top-6 lg:self-start"><div className={`${card} p-6`}><SamplePanel slug={picked} /></div></div>
    </div>
  );
}

/* ---------- /account › درخواست‌های اکانت ---------- */

type Req = { id: number; site: string; url?: string; status: "pending" | "quoted" | "paid" | "rejected" | "cancelled"; date: string; price?: number; order?: number; note?: string };
const SAMPLE: Req[] = [
  { id: 14, site: "QQ VIP", url: "qq.com", status: "quoted", date: "۳ آذر", price: 1_850_000, order: 2546, note: "تحویل حدود ۲ ساعت بعد از پرداخت." },
  { id: 12, site: "Notion AI", url: "notion.so", status: "pending", date: "۲ آذر" },
  { id: 9, site: "Perplexity Pro", status: "paid", date: "۲۸ آبان", price: 3_400_000, order: 2471 },
  { id: 7, site: "Weibo", url: "weibo.com", status: "rejected", date: "۲۰ آبان", note: "فعلا راهی برای خرید این اشتراک از ایران نداریم." },
];
function RequestsList() {
  const t = useT();
  const usd = useMoney().format;
  const [rows, setRows] = useState(SAMPLE);
  return (
    <section id="account-requests" aria-labelledby="req-list-h" className="mx-auto w-full max-w-3xl">
      <h2 id="req-list-h" className="font-display text-2xl font-bold text-slate-900 dark:text-white">{t("Account requests")}</h2>
      <p className={`mt-1 ${muted}`}>{t("Accounts you asked for that aren't on the site.")}</p>
      <ul className="mt-6 space-y-3">
        {rows.map((r) => {
          const s = TONE[r.status];
          return (
            <li key={r.id} className={`${card} p-5`}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-display text-lg font-bold text-slate-900 dark:text-white">{r.site}</p>
                  <p className={`text-sm ${muted}`}><bdi className="num">#{r.id}</bdi>{r.url && <> · <bdi dir="ltr">{r.url}</bdi></>} · {t("Sent {0}", { 0: r.date })}</p>
                </div>
                <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ring-1 ring-inset ${s.cls}`}><s.Icon aria-hidden className="h-3.5 w-3.5" />{t(s.label)}</span>
              </div>
              {r.note && <p className="mt-3 rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-700 dark:bg-white/5 dark:text-slate-300"><span className="font-semibold">{t("Our note")}:</span> {r.note}</p>}
              {(r.status === "quoted" || r.status === "paid" || r.status === "pending") && (
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  {r.status === "quoted" && r.price && <a href="#" className={`${primary} !px-4 !py-2.5 text-sm`}>{t("Pay {0}", { 0: usd(r.price) })}</a>}
                  {r.status === "paid" && <a href="#" className={`${secondary} !px-4 !py-2.5 text-sm`}>{t("View order")}</a>}
                  {r.status === "pending" && <button type="button" onClick={() => setRows(rows.map((x) => (x.id === r.id ? { ...x, status: "cancelled" } : x)))} className={`${secondary} !px-4 !py-2.5 text-sm`}>{t("Withdraw")}</button>}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

// The sample catalog's prices are dollars; the account list shows Toman like the live panel.
const Fa = ({ children, currency = "usd" }: { children: ReactNode; currency?: "usd" | "toman" }) => <LocaleProvider locale="fa"><div dir="rtl"><MoneyProvider currency={currency}>{children}</MoneyProvider></div></LocaleProvider>;
export const RequestTile = () => <Fa><Tile /></Fa>;
export const RequestBand = () => <Fa><Band /></Fa>;
export const RequestUnfold = () => <Fa><Unfold /></Fa>;
export const RequestSearchFirst = () => <Fa><SearchFirst /></Fa>;
export const RequestAsk = () => <Fa><Ask /></Fa>;
export const RequestCardSide = () => <Fa><CardSide /></Fa>;
export const RequestCardGrow = () => <Fa><CardGrow /></Fa>;
export const AccountRequestsList = () => <Fa currency="toman"><RequestsList /></Fa>;
