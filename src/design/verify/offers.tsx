"use client";
import { useEffect, useRef, useState, type ComponentType, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { BadgeCheck, ChevronDown, Clock, FileLock2, LayoutGrid, Search, ShieldCheck, Trash2, Upload, UserCheck, X } from "lucide-react";
import { LocaleProvider, useT } from "@/i18n/client";
import { verifyProducts, type VerifyKind, type VerifyProduct } from "@/content/verify-en";
import { PageShell } from "../otp/parts";
import { field, ring } from "../googleVoice/clean";
import { From, KindBadge, LetterTile, PrivacyNote, VerifyFaq, VerifyForm, VerifyTitle, useFocusOnChange, useVerify, type Upload as UploadMode, type VerifyState } from "./parts";

// Verification landing (/verify) offers. Every offer sells both kinds — ready verified accounts and verifying the
// buyer's own account — and ends in the same order form (VerifyForm, inputs the admin chose, files included).

const card = "rounded-3xl border border-slate-200 bg-white dark:border-white/10 dark:bg-[#0E1424]";

function ProductHead({ p, headRef }: { p: VerifyProduct; headRef?: React.Ref<HTMLHeadingElement> }) {
  const tx = useT();
  return (
    <div className="flex items-start gap-4">
      <LetterTile p={p} size="lg" />
      <div className="min-w-0">
        <h2 ref={headRef} tabIndex={-1} className="font-display text-2xl font-bold text-slate-900 outline-none dark:text-white">{tx(p.name)}</h2>
        <p className="mt-0.5 text-slate-600 dark:text-slate-400">{tx(p.tagline)}</p>
        <p className="mt-2 flex flex-wrap items-center gap-2"><KindBadge kind={p.kind} /><span className="inline-flex items-center gap-1 text-sm text-slate-600 dark:text-slate-400"><Clock aria-hidden className="h-4 w-4" />{tx(p.delivery)}</span></p>
      </div>
    </div>
  );
}

function ProductCard({ p, on, onPick }: { p: VerifyProduct; on?: boolean; onPick: () => void }) {
  const tx = useT();
  return (
    <button type="button" onClick={onPick} aria-pressed={on} className={`group flex w-full items-center gap-4 rounded-3xl border-2 bg-white p-4 text-start transition-colors dark:bg-[#0E1424] ${on ? "border-emerald-600 dark:border-emerald-400" : "border-slate-200 hover:border-slate-400 dark:border-white/10 dark:hover:border-white/30"} ${ring}`}>
      <LetterTile p={p} />
      <span className="min-w-0 flex-1">
        <span className="block font-display font-semibold text-slate-900 dark:text-white">{tx(p.name)}</span>
        <span className="block truncate text-sm text-slate-600 dark:text-slate-400">{tx(p.tagline)}</span>
      </span>
      <From p={p} />
    </button>
  );
}

const Faq = () => {
  const tx = useT();
  return <section aria-labelledby="vfaq" className="mt-20"><h2 id="vfaq" className="font-display text-2xl font-bold text-slate-900 dark:text-white">{tx("Common questions")}</h2><div className="mt-6"><VerifyFaq /></div></section>;
};

// ---------- A · Two Doors ----------
// Two big choices first — "Buy a verified account" or "Verify my account" — then only that kind's products; the
// chosen one's form opens under the list and takes focus.
function VerifyAInner({ slug, upload }: { slug?: string; upload?: UploadMode }) {
  const tx = useT();
  const v = useVerify(slug);
  const [kind, setKind] = useState<VerifyKind>(v.product?.kind ?? "ready");
  const head = useFocusOnChange(v.product?.slug);
  const doors: { id: VerifyKind; title: string; text: string; Icon: typeof BadgeCheck }[] = [
    { id: "ready", title: "Buy a verified account", text: "A ready account, already verified. We send you the login.", Icon: BadgeCheck },
    { id: "verify", title: "Verify my own account", text: "Your account gets verified. You send what the form asks for.", Icon: UserCheck },
  ];
  return (
    <PageShell>
      <div className="mx-auto max-w-4xl px-4 pb-24 pt-10 sm:px-6 sm:pt-14">
        <VerifyTitle sub={tx("Verified accounts and account verification, done by our team.")}>{tx("Verification")}</VerifyTitle>
        <div role="radiogroup" aria-label={tx("What do you need?")} className="mt-8 grid gap-3 sm:grid-cols-2">
          {doors.map((d) => {
            const on = kind === d.id;
            return (
              <button key={d.id} type="button" role="radio" aria-checked={on} onClick={() => { setKind(d.id); v.select(null); }}
                className={`flex items-start gap-4 rounded-3xl border-2 p-5 text-start transition-colors ${on ? "border-slate-900 bg-slate-900 text-white dark:border-white dark:bg-white dark:text-slate-900" : "border-slate-200 bg-white text-slate-900 hover:border-slate-400 dark:border-white/15 dark:bg-white/5 dark:text-white"} ${ring}`}>
                <d.Icon aria-hidden className="mt-0.5 h-7 w-7 shrink-0" />
                <span><span className="block font-display text-lg font-bold">{tx(d.title)}</span><span className={`mt-1 block text-[15px] ${on ? "opacity-85" : "text-slate-600 dark:text-slate-400"}`}>{tx(d.text)}</span></span>
              </button>
            );
          })}
        </div>
        <div key={kind} className="mt-6 grid animate-fade-up gap-3 [animation-duration:250ms] sm:grid-cols-2">
          {verifyProducts.filter((p) => p.kind === kind).map((p) => <ProductCard key={p.slug} p={p} on={v.product?.slug === p.slug} onPick={() => v.select(p)} />)}
        </div>
        {v.product && (
          <section className={`${card} mt-8 animate-fade-up space-y-6 p-5 sm:p-7`}>
            <ProductHead p={v.product} headRef={head} />
            <VerifyForm v={v} upload={upload} />
          </section>
        )}
        <Faq />
      </div>
    </PageShell>
  );
}

// ---------- B · Catalog + Panel ----------
// Like the subscriptions page: a grid with kind chips and search; the chosen product's plans and form sit in a
// panel that follows you on desktop (below the grid on phones, scrolled to).
function VerifyBInner({ slug, upload }: { slug?: string; upload?: UploadMode }) {
  const tx = useT();
  const v = useVerify(slug ?? verifyProducts[3].slug);
  const [kind, setKind] = useState<VerifyKind | "all">("all");
  const [q, setQ] = useState("");
  const panel = useRef<HTMLDivElement>(null);
  const head = useFocusOnChange(v.product?.slug);
  const list = verifyProducts.filter((p) => (kind === "all" || p.kind === kind) && tx(p.name).toLowerCase().includes(q.trim().toLowerCase()));
  const chips: { id: VerifyKind | "all"; label: string; Icon: typeof BadgeCheck }[] = [
    { id: "all", label: "All", Icon: LayoutGrid }, { id: "ready", label: "Ready verified account", Icon: BadgeCheck }, { id: "verify", label: "We verify your account", Icon: UserCheck },
  ];
  const pick = (p: VerifyProduct) => { v.select(p); if (window.matchMedia("(max-width: 1023px)").matches) setTimeout(() => panel.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 0); };
  return (
    <PageShell>
      <div className="mx-auto max-w-6xl px-4 pb-24 pt-10 sm:px-6 sm:pt-14">
        <VerifyTitle>{tx("Verification")}</VerifyTitle>
        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_440px]">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              {chips.map((c) => (
                <button key={c.id} type="button" aria-pressed={kind === c.id} onClick={() => setKind(c.id)} className={`flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-[15px] font-medium ${kind === c.id ? "border-slate-900 bg-slate-900 text-white dark:border-white dark:bg-white dark:text-slate-900" : "border-slate-300 bg-white text-slate-800 hover:border-slate-500 dark:border-white/15 dark:bg-white/5 dark:text-slate-100"} ${ring}`}>
                  <c.Icon aria-hidden className="h-4 w-4" />{tx(c.label)}
                </button>
              ))}
            </div>
            <label className="relative mt-4 block"><span className="sr-only">{tx("Search")}</span><Search aria-hidden className="pointer-events-none absolute start-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" /><input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={tx("PayPal, Instagram, Binance…")} className={`${field} ps-11`} /></label>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {list.map((p) => <ProductCard key={p.slug} p={p} on={v.product?.slug === p.slug} onPick={() => pick(p)} />)}
              {list.length === 0 && <p className="text-slate-600 dark:text-slate-400">{tx("Nothing found.")}</p>}
            </div>
          </div>
          <div ref={panel} className="scroll-mt-24 lg:sticky lg:top-24 lg:h-fit">
            {v.product ? (
              <section key={v.product.slug} className={`${card} animate-fade-up space-y-6 p-5 [animation-duration:250ms]`}>
                <ProductHead p={v.product} headRef={head} />
                <VerifyForm v={v} upload={upload} />
              </section>
            ) : <p className={`${card} p-6 text-slate-600 dark:text-slate-400`}>{tx("Choose a product to see its plans.")}</p>}
          </div>
        </div>
        <Faq />
      </div>
    </PageShell>
  );
}

// ---------- C · Guided Steps ----------
// One column of numbered steps that open one after another: 1 what you need, 2 product, 3 your details and
// documents. Each finished step folds to one line with Change.
function VerifyCInner({ upload }: { upload?: UploadMode }) {
  const tx = useT();
  const v = useVerify();
  const [kind, setKind] = useState<VerifyKind | null>(null);
  const head = useFocusOnChange(v.product?.slug);
  const Step = ({ n, title, done, onChange, children }: { n: number; title: string; done?: ReactNode; onChange?: () => void; children?: ReactNode }) => (
    <li className={`${card} p-5 sm:p-6`}>
      <div className="flex items-center gap-3">
        <span aria-hidden className={`grid h-8 w-8 shrink-0 place-items-center rounded-full font-bold ${done ? "bg-emerald-600 text-white dark:bg-emerald-400 dark:text-slate-900" : "bg-slate-900 text-white dark:bg-white dark:text-slate-900"}`}>{tx.num(n)}</span>
        <h2 className="flex-1 font-display text-lg font-semibold text-slate-900 dark:text-white">{tx(title)}{done && <span className="ms-2 font-sans text-base font-normal text-slate-600 dark:text-slate-400">· {done}</span>}</h2>
        {done && onChange && <button type="button" onClick={onChange} className={`rounded-lg px-3 py-1.5 text-sm font-semibold text-emerald-800 hover:bg-emerald-50 dark:text-emerald-300 dark:hover:bg-white/5 ${ring}`}>{tx("Change")}</button>}
      </div>
      {!done && children && <div className="mt-5">{children}</div>}
    </li>
  );
  return (
    <PageShell>
      <div className="mx-auto max-w-2xl px-4 pb-24 pt-10 sm:px-6 sm:pt-14">
        <VerifyTitle sub={tx("Three short steps. Your documents stay private.")}>{tx("Verification")}</VerifyTitle>
        <ol className="mt-8 space-y-3">
          <Step n={1} title="What do you need?" done={kind && (kind === "ready" ? tx("Buy a verified account") : tx("Verify my own account"))} onChange={() => { setKind(null); v.select(null); }}>
            <div className="grid gap-2 sm:grid-cols-2">
              {(["ready", "verify"] as const).map((k) => (
                <button key={k} type="button" onClick={() => setKind(k)} className={`flex items-center gap-3 rounded-2xl border-2 border-slate-200 p-4 text-start font-semibold text-slate-900 hover:border-slate-500 dark:border-white/15 dark:text-white ${ring}`}>
                  {k === "ready" ? <BadgeCheck aria-hidden className="h-6 w-6 text-sky-700 dark:text-sky-300" /> : <UserCheck aria-hidden className="h-6 w-6 text-emerald-700 dark:text-emerald-300" />}
                  {tx(k === "ready" ? "Buy a verified account" : "Verify my own account")}
                </button>
              ))}
            </div>
          </Step>
          {kind && (
            <Step n={2} title="Choose the product" done={v.product && tx(v.product.name)} onChange={() => v.select(null)}>
              <div className="grid gap-2">{verifyProducts.filter((p) => p.kind === kind).map((p) => <ProductCard key={p.slug} p={p} onPick={() => v.select(p)} />)}</div>
            </Step>
          )}
          {v.product && (
            <li className={`${card} p-5 sm:p-6`}>
              <div className="flex items-center gap-3">
                <span aria-hidden className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-slate-900 font-bold text-white dark:bg-white dark:text-slate-900">{tx.num(3)}</span>
                <h2 ref={head} tabIndex={-1} className="font-display text-lg font-semibold text-slate-900 outline-none dark:text-white">{tx("Plan, details and documents")}</h2>
              </div>
              <div className="mt-5"><VerifyForm v={v} upload={upload} layout="grouped" /></div>
            </li>
          )}
        </ol>
        <Faq />
      </div>
    </PageShell>
  );
}

// ---------- D · Rows that Open ----------
// A calm list in two groups; opening a row unfolds its plans and form right there (one open at a time).
function VerifyDInner({ upload }: { upload?: UploadMode }) {
  const tx = useT();
  const v = useVerify();
  const groups: { kind: VerifyKind; title: string; text: string }[] = [
    { kind: "ready", title: "Ready verified accounts", text: "Already verified. We send you the login." },
    { kind: "verify", title: "We verify your account", text: "Your own account gets verified." },
  ];
  return (
    <PageShell>
      <div className="mx-auto max-w-3xl px-4 pb-24 pt-10 sm:px-6 sm:pt-14">
        <VerifyTitle>{tx("Verification")}</VerifyTitle>
        {groups.map((g) => (
          <section key={g.kind} aria-labelledby={`g-${g.kind}`} className="mt-10">
            <h2 id={`g-${g.kind}`} className="font-display text-xl font-bold text-slate-900 dark:text-white">{tx(g.title)}</h2>
            <p className="text-slate-600 dark:text-slate-400">{tx(g.text)}</p>
            <ul className={`${card} mt-4 divide-y divide-slate-100 overflow-hidden dark:divide-white/10`}>
              {verifyProducts.filter((p) => p.kind === g.kind).map((p) => {
                const open = v.product?.slug === p.slug;
                return (
                  <li key={p.slug}>
                    <button type="button" aria-expanded={open} aria-controls={`row-${p.slug}`} onClick={() => v.select(open ? null : p)} className={`flex w-full items-center gap-4 p-4 text-start hover:bg-slate-50 dark:hover:bg-white/5 ${ring} focus-visible:ring-inset`}>
                      <LetterTile p={p} size="sm" />
                      <span className="min-w-0 flex-1"><span className="block font-semibold text-slate-900 dark:text-white">{tx(p.name)}</span><span className="block truncate text-sm text-slate-600 dark:text-slate-400">{tx(p.tagline)}</span></span>
                      <From p={p} />
                      <ChevronDown aria-hidden className={`h-5 w-5 shrink-0 text-slate-500 transition-transform ${open ? "rotate-180" : ""}`} />
                    </button>
                    {open && <div id={`row-${p.slug}`} className="animate-fade-up border-t border-slate-100 bg-slate-50/60 p-4 [animation-duration:200ms] sm:p-6 dark:border-white/10 dark:bg-white/[0.03]"><VerifyForm v={v} upload={upload} /></div>}
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
        <Faq />
      </div>
    </PageShell>
  );
}

// ---------- E · Privacy First ----------
// Opens on how documents are handled (upload → we review → done → deleted after 30 days), then the products as
// cards; picking one opens the form in a sheet (a bottom sheet on phones).
function VerifyEInner({ upload }: { upload?: UploadMode }) {
  const tx = useT();
  const v = useVerify();
  const sheet = useRef<HTMLDialogElement>(null);
  useEffect(() => { const d = sheet.current; const close = () => v.select(null); d?.addEventListener("close", close); return () => d?.removeEventListener("close", close); });
  const steps = [
    { Icon: Upload, title: "You send", text: "Only what the form asks for." },
    { Icon: FileLock2, title: "Kept private", text: "Never on the website; only our support team opens it." },
    { Icon: ShieldCheck, title: "We verify", text: "You follow the order in your account." },
    { Icon: Trash2, title: "Deleted", text: "30 days after the order is done." },
  ];
  const open = (p: VerifyProduct) => { v.select(p); sheet.current?.showModal(); };
  return (
    <PageShell>
      <div className="mx-auto max-w-5xl px-4 pb-24 pt-10 sm:px-6 sm:pt-14">
        <VerifyTitle sub={tx("Verified accounts and account verification. Here is what happens to your documents.")}>{tx("Verification, with your documents kept private")}</VerifyTitle>
        <ol className="mt-8 grid gap-3 sm:grid-cols-4">
          {steps.map((s, i) => (
            <li key={s.title} className={`${card} relative p-5`}>
              <span aria-hidden className="text-sm font-bold text-slate-400">{tx.num(i + 1)}</span>
              <s.Icon aria-hidden className="mt-2 h-6 w-6 text-emerald-700 dark:text-emerald-400" />
              <p className="mt-3 font-display font-semibold text-slate-900 dark:text-white">{tx(s.title)}</p>
              <p className="mt-1 text-[15px] text-slate-600 dark:text-slate-400">{tx(s.text)}</p>
            </li>
          ))}
        </ol>
        {(["ready", "verify"] as const).map((k) => (
          <section key={k} aria-labelledby={`e-${k}`} className="mt-12">
            <h2 id={`e-${k}`} className="font-display text-xl font-bold text-slate-900 dark:text-white">{tx(k === "ready" ? "Ready verified accounts" : "We verify your account")}</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {verifyProducts.filter((p) => p.kind === k).map((p) => (
                <button key={p.slug} type="button" onClick={() => open(p)} aria-haspopup="dialog" className={`${card} flex flex-col items-start gap-3 p-5 text-start hover:border-slate-400 dark:hover:border-white/30 ${ring}`}>
                  <LetterTile p={p} />
                  <span className="font-display font-semibold text-slate-900 dark:text-white">{tx(p.name)}</span>
                  <span className="text-sm text-slate-600 dark:text-slate-400">{tx(p.tagline)}</span>
                  <span className="mt-auto pt-1"><From p={p} /></span>
                </button>
              ))}
            </div>
          </section>
        ))}
        <Faq />
      </div>
      <dialog ref={sheet} aria-labelledby="e-sheet" className="m-0 mt-auto max-h-[92dvh] w-full max-w-none overflow-y-auto rounded-t-3xl bg-white p-0 backdrop:bg-slate-950/60 sm:m-auto sm:max-w-xl sm:rounded-3xl dark:bg-[#0E1424]">
        {v.product && (
          <div className="space-y-6 p-5 sm:p-7">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3"><LetterTile p={v.product} /><h2 id="e-sheet" className="font-display text-xl font-bold text-slate-900 dark:text-white">{tx(v.product.name)}</h2></div>
              <button type="button" onClick={() => sheet.current?.close()} aria-label={tx("Close")} className={`rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10 ${ring}`}><X aria-hidden className="h-5 w-5" /></button>
            </div>
            <VerifyForm v={v} upload={upload} />
          </div>
        )}
      </dialog>
    </PageShell>
  );
}

// ---------- Order form offers (section page-verify-form) ----------
// The same product (Meta Verified: text, date and two files) in four form styles, so only the form differs.
function FormFrame({ children, v }: { children: ReactNode; v: VerifyState }) {
  return (
    <PageShell>
      <div className="mx-auto max-w-3xl px-4 pb-24 pt-10 sm:px-6 sm:pt-14">
        <section className={`${card} space-y-6 p-5 sm:p-7`}>
          {v.product && <ProductHead p={v.product} />}
          {children}
        </section>
      </div>
    </PageShell>
  );
}

function VerifyFormAInner() {
  const v = useVerify("meta-verified");
  return <FormFrame v={v}><PrivacyNote /><VerifyForm v={v} upload="drop" privacy={false} /></FormFrame>;
}
function VerifyFormBInner() {
  const v = useVerify("meta-verified");
  return <FormFrame v={v}><VerifyForm v={v} upload="row" layout="grouped" /></FormFrame>;
}
function VerifyFormCInner() {
  const v = useVerify("meta-verified");
  return <FormFrame v={v}><VerifyForm v={v} upload="camera" layout="grouped" /></FormFrame>;
}
function VerifyFormDInner() {
  const v = useVerify("meta-verified");
  return (
    <PageShell>
      <div className="mx-auto max-w-5xl px-4 pb-24 pt-10 sm:px-6 sm:pt-14">
        <section className={`${card} space-y-6 p-5 sm:p-7`}>
          {v.product && <ProductHead p={v.product} />}
          <VerifyForm v={v} upload="drop" layout="checklist" />
        </section>
      </div>
    </PageShell>
  );
}

// The gallery is English; these offers open in Persian (the site's own language) with a switch, like the cart offers.
function inLanguage<P extends object>(C: ComponentType<P>) {
  return function InLanguage(props: P) {
    const [lang, setLang] = useState<"fa" | "en">("fa");
    if (!usePathname()?.startsWith("/design")) return <C {...props} />;
    return (
      <div className="relative">
        <div role="group" aria-label="Language" className="absolute top-20 end-4 z-40 flex rounded-xl border border-slate-300 bg-white p-1 text-sm shadow-sm dark:border-white/15 dark:bg-slate-800">
          {(["fa", "en"] as const).map((l) => <button key={l} type="button" aria-pressed={lang === l} onClick={() => setLang(l)} className={`rounded-lg px-3 py-1.5 ${lang === l ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900" : "text-slate-700 dark:text-slate-300"}`}>{l === "fa" ? "فارسی" : "English"}</button>)}
        </div>
        <div dir={lang === "fa" ? "rtl" : "ltr"} lang={lang} key={lang}><LocaleProvider locale={lang}><C {...props} /></LocaleProvider></div>
      </div>
    );
  };
}

export const VerifyA = inLanguage(VerifyAInner);
export const VerifyB = inLanguage(VerifyBInner);
export const VerifyC = inLanguage(VerifyCInner);
export const VerifyD = inLanguage(VerifyDInner);
export const VerifyE = inLanguage(VerifyEInner);
export const VerifyFormA = inLanguage(VerifyFormAInner);
export const VerifyFormB = inLanguage(VerifyFormBInner);
export const VerifyFormC = inLanguage(VerifyFormCInner);
export const VerifyFormD = inLanguage(VerifyFormDInner);
