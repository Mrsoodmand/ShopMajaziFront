"use client";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { BadgeCheck, Camera, Check, CheckCircle2, CircleAlert, FileText, ImageUp, Lock, ShieldCheck, Trash2, Upload, UserCheck } from "lucide-react";
import { useT } from "@/i18n/client";
import { useMoney } from "@/lib/money";
import { lowestPrice, verifyFaq, verifyProducts, type VerifyField, type VerifyKind, type VerifyPlan, type VerifyProduct } from "@/content/verify-en";
import { field, primary, ring, secondary } from "../googleVoice/clean";

// Pieces shared by the Verification page offers (sections page-verify and page-verify-form). Sample data only:
// Continue shows what the order would look like; nothing is sent. Rules match the backend's
// App\Services\VerificationOrders::spec (types, required, file kinds and sizes), so the live page can reuse them.

export const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MIME: Record<"image" | "pdf", string[]> = { image: ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"], pdf: ["application/pdf"] };
const toWestern = (s: string) => s.replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d))).replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)));

export type Upload = "drop" | "row" | "camera";

// ---------- State ----------

export function useVerify(initial?: string) {
  const tx = useT();
  const [product, setProduct] = useState<VerifyProduct | null>(verifyProducts.find((p) => p.slug === initial) ?? null);
  const [plan, setPlan] = useState<VerifyPlan | null>(product ? firstPlan(product) : null);
  const [values, setValues] = useState<Record<string, string>>({});
  const [files, setFiles] = useState<Record<string, File | null>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState(false);
  const [done, setDone] = useState(false);

  const select = (p: VerifyProduct | null) => {
    setProduct(p); setPlan(p ? firstPlan(p) : null);
    setValues(Object.fromEntries((p?.fields ?? []).filter((f) => f.type === "select").map((f) => [f.name, f.options?.[0] ?? ""])));
    setFiles({}); setTouched({}); setSubmitted(false); setDone(false);
  };

  const all: Record<string, string> = {};
  for (const f of product?.fields ?? []) {
    // "Enter your Instagram username": the title mid-sentence in English; Persian reads it as written.
    const what = tx.locale === "fa" ? tx(f.title) : f.title.charAt(0).toLowerCase() + f.title.slice(1);
    if (f.type === "file") {
      const file = files[f.name];
      if (!file && f.required) all[f.name] = tx("Add {0}", { 0: what });
      else if (file) {
        const ok = (f.accept ?? ["image"]).some((a) => MIME[a].includes(file.type));
        if (!ok) all[f.name] = tx("This file must be {0}", { 0: acceptLabel(tx, f) });
        else if (file.size > (f.maxMb ?? 5) * 1024 * 1024) all[f.name] = tx("The file must be {0} MB or smaller", { 0: tx.num(f.maxMb ?? 5) });
      }
      continue;
    }
    const v = toWestern((values[f.name] ?? "").trim());
    if (!v) { if (f.required) all[f.name] = tx(f.type === "select" ? "Choose {0}" : "Enter {0}", { 0: what }); continue; }
    if (f.type === "email" && !EMAIL.test(v)) all[f.name] = tx("Enter an email address in the correct format, like name@example.com");
    if (f.type === "phone" && v.replace(/\D/g, "").length < 6) all[f.name] = tx("Enter a phone number with at least 6 digits");
    if (f.type === "date" && !/^\d{4}[-/]\d{1,2}[-/]\d{1,2}$/.test(v)) all[f.name] = tx("Write the date like 1370/05/12");
    if (f.type === "textarea" && v.length > 3000) all[f.name] = tx("Use 3,000 characters or fewer");
  }
  const errors = Object.fromEntries(Object.entries(all).filter(([k]) => submitted || touched[k]));
  const filled = (f: VerifyField) => (f.type === "file" ? !!files[f.name] : !!(values[f.name] ?? "").trim()) && !all[f.name];

  // Shows the order (sample), or moves focus to the first problem.
  const proceed = () => {
    setSubmitted(true);
    const bad = product?.fields.find((f) => all[f.name]);
    if (bad) { document.getElementById(`vf-${bad.name}`)?.focus(); return false; }
    setDone(true);
    return true;
  };

  return {
    product, plan, values, files, errors, done, select, setPlan, proceed, filled,
    set: (name: string, v: string) => setValues((x) => ({ ...x, [name]: v })),
    setFile: (name: string, f: File | null) => { setFiles((x) => ({ ...x, [name]: f })); setTouched((t) => ({ ...t, [name]: true })); },
    touch: (name: string) => setTouched((t) => ({ ...t, [name]: true })),
    back: () => setDone(false),
  };
}
export type VerifyState = ReturnType<typeof useVerify>;

const firstPlan = (p: VerifyProduct) => p.plans.find((x) => x.popular) ?? p.plans[0];

function acceptLabel(tx: ReturnType<typeof useT>, f: VerifyField) {
  const a = f.accept ?? ["image"];
  return a.map((x) => (x === "image" ? tx("a photo (JPG, PNG, WEBP or HEIC)") : "PDF")).join(` ${tx("or")} `);
}

// ---------- Small pieces ----------

export function LetterTile({ p, size = "md" }: { p: VerifyProduct; size?: "sm" | "md" | "lg" }) {
  const s = size === "lg" ? "h-16 w-16 rounded-2xl text-2xl" : size === "sm" ? "h-9 w-9 rounded-lg text-sm" : "h-12 w-12 rounded-xl text-lg";
  return (
    <span aria-hidden style={{ background: p.color }} className={`relative grid shrink-0 place-items-center font-display font-bold text-white ${s}`}>
      {p.letter}
      <BadgeCheck className="absolute -bottom-1 -end-1 h-[42%] w-[42%] rounded-full bg-white fill-sky-500 text-white dark:bg-[#0E1424]" />
    </span>
  );
}

export function KindBadge({ kind, className = "" }: { kind: VerifyKind; className?: string }) {
  const tx = useT();
  const ready = kind === "ready";
  const Icon = ready ? BadgeCheck : UserCheck;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[13px] font-medium ${ready ? "border-sky-300 text-sky-900 dark:border-sky-400/40 dark:text-sky-200" : "border-emerald-300 text-emerald-900 dark:border-emerald-400/40 dark:text-emerald-200"} ${className}`}>
      <Icon aria-hidden className="h-3.5 w-3.5" />{ready ? tx("Ready verified account") : tx("We verify your account")}
    </span>
  );
}

export function From({ p }: { p: VerifyProduct }) {
  const tx = useT();
  const money = useMoney().format;
  return <span className="text-sm text-slate-700 dark:text-slate-300">{tx("from")} <b className="text-lg text-slate-900 dark:text-white">{money(lowestPrice(p))}</b></span>;
}

export function VerifyTitle({ children, sub }: { children: ReactNode; sub?: ReactNode }) {
  const tx = useT();
  return (
    <div>
      <p className="inline-flex items-center gap-1.5 text-sm font-semibold text-sky-800 dark:text-sky-300"><BadgeCheck aria-hidden className="h-4 w-4" />{tx("Verification")}</p>
      <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl dark:text-white">{children}</h1>
      {sub && <p className="mt-4 max-w-2xl text-lg leading-relaxed text-slate-700 dark:text-slate-300">{sub}</p>}
    </div>
  );
}

// How the buyer's documents are handled: the one promise this page must make clearly.
export function PrivacyNote({ compact = false }: { compact?: boolean }) {
  const tx = useT();
  if (compact) return <p className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400"><Lock aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700 dark:text-emerald-400" />{tx("Your files are private: only our support team sees them, and they are deleted 30 days after the order is done.")}</p>;
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-950 dark:border-emerald-400/25 dark:bg-emerald-400/10 dark:text-emerald-100">
      <ShieldCheck aria-hidden className="mt-0.5 h-5 w-5 shrink-0" />
      <div>
        <p className="font-semibold">{tx("Your documents stay private")}</p>
        <p className="mt-1 text-[15px] leading-relaxed opacity-90">{tx("They are kept in private storage, never on the website. Only our support team opens them for your order, and they are deleted 30 days after it is done.")}</p>
      </div>
    </div>
  );
}

export function PlanPicker({ v, compact = false }: { v: VerifyState; compact?: boolean }) {
  const tx = useT();
  const money = useMoney().format;
  const id = useId();
  if (!v.product) return null;
  if (v.product.plans.length === 1 && compact) return null;
  return (
    <fieldset>
      <legend className="mb-2 font-semibold text-slate-900 dark:text-white">{tx("Choose a plan")}</legend>
      <div className="grid gap-2 sm:grid-cols-2">
        {v.product.plans.map((pl) => {
          const on = v.plan?.id === pl.id;
          return (
            <label key={pl.id} className={`flex cursor-pointer items-center justify-between gap-3 rounded-xl border-2 px-4 py-3 transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-emerald-600 ${on ? "border-emerald-600 bg-emerald-50 dark:border-emerald-400 dark:bg-emerald-400/10" : "border-slate-200 bg-white hover:border-slate-400 dark:border-white/15 dark:bg-white/5"}`}>
              <input type="radio" name={id} className="sr-only" checked={on} onChange={() => v.setPlan(pl)} />
              <span className="flex items-center gap-2 font-medium text-slate-900 dark:text-white">
                <span aria-hidden className={`grid h-5 w-5 place-items-center rounded-full border-2 ${on ? "border-emerald-600 bg-emerald-600 dark:border-emerald-400 dark:bg-emerald-400" : "border-slate-300 dark:border-white/30"}`}>{on && <Check className="h-3 w-3 text-white dark:text-slate-900" />}</span>
                {tx(pl.name)}
                {pl.popular && <span className="rounded-full bg-amber-200 px-2 py-0.5 text-[11px] font-bold text-amber-950">{tx("Most popular plan")}</span>}
              </span>
              <span className="text-end">
                {pl.was && <s className="me-1.5 text-sm text-slate-500">{money(pl.was)}</s>}
                <b className="text-slate-900 dark:text-white">{money(pl.price)}</b>
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

// ---------- Inputs ----------

export function FieldInput({ v, f, upload = "drop" }: { v: VerifyState; f: VerifyField; upload?: Upload }) {
  const tx = useT();
  const id = `vf-${f.name}`;
  const err = v.errors[f.name];
  const help = [f.hint && `${id}-hint`, err && `${id}-err`].filter(Boolean).join(" ") || undefined;
  const label = (
    <label htmlFor={id} className="mb-1.5 block font-semibold text-slate-900 dark:text-white">
      {tx(f.title)}{!f.required && <span className="ms-1.5 text-sm font-normal text-slate-500 dark:text-slate-400">({tx("optional")})</span>}
    </label>
  );
  const foot = (
    <>
      {f.hint && <p id={`${id}-hint`} className="mt-1.5 text-sm text-slate-600 dark:text-slate-400">{tx(f.hint)}</p>}
      {err && <p id={`${id}-err`} className="mt-1.5 flex items-center gap-1.5 text-sm font-medium text-red-700 dark:text-red-400"><CircleAlert aria-hidden className="h-4 w-4" />{err}</p>}
    </>
  );
  const common = { id, "aria-invalid": !!err || undefined, "aria-describedby": help, onBlur: () => v.touch(f.name) };
  const box = `${field} ${err ? "border-red-600 dark:border-red-400" : ""}`;

  if (f.type === "file") return <div>{label}<FileInput v={v} f={f} mode={upload} describedBy={help} invalid={!!err} />{foot}</div>;
  return (
    <div>
      {label}
      {f.type === "select" ? (
        <select {...common} className={box} value={v.values[f.name] ?? ""} onChange={(e) => v.set(f.name, e.target.value)}>
          {(f.options ?? []).map((o) => <option key={o} value={o}>{tx(o)}</option>)}
        </select>
      ) : f.type === "textarea" ? (
        <textarea {...common} rows={3} className={box} value={v.values[f.name] ?? ""} onChange={(e) => v.set(f.name, e.target.value)} />
      ) : (
        <input
          {...common}
          className={box}
          dir={f.type === "text" ? undefined : "ltr"}
          type={f.type === "email" ? "email" : f.type === "phone" ? "tel" : "text"}
          inputMode={f.type === "phone" ? "tel" : f.type === "date" ? "numeric" : undefined}
          autoComplete={f.type === "email" ? "email" : f.type === "phone" ? "tel" : undefined}
          placeholder={f.type === "date" ? "1370/05/12" : f.type === "email" ? "name@example.com" : undefined}
          value={v.values[f.name] ?? ""}
          onChange={(e) => v.set(f.name, e.target.value)}
        />
      )}
      {foot}
    </div>
  );
}

const sizeLabel = (tx: ReturnType<typeof useT>, n: number) => (n >= 1024 * 1024 ? tx("{0} MB", { 0: tx.num(Math.round((n / 1024 / 1024) * 10) / 10) }) : tx("{0} KB", { 0: tx.num(Math.max(1, Math.round(n / 1024))) }));

// A file input in three styles: a drop zone, a compact row, or camera-first (phones open the camera).
// The real <input type=file> stays in the page for keyboards and screen readers; the styled parts are its label.
export function FileInput({ v, f, mode, describedBy, invalid }: { v: VerifyState; f: VerifyField; mode: Upload; describedBy?: string; invalid: boolean }) {
  const tx = useT();
  const id = `vf-${f.name}`;
  const file = v.files[f.name] ?? null;
  const input = useRef<HTMLInputElement>(null);
  const camera = useRef<HTMLInputElement>(null);
  const [over, setOver] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const accept = (f.accept ?? ["image"]).flatMap((a) => MIME[a]).join(",");
  const types = `${acceptLabel(tx, f)} · ${tx("up to {0} MB", { 0: tx.num(f.maxMb ?? 5) })}`;

  useEffect(() => {
    if (!file || !file.type.startsWith("image/")) { setPreview(null); return; }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const pick = (list: FileList | null) => v.setFile(f.name, list?.[0] ?? null);
  const clear = () => { v.setFile(f.name, null); if (input.current) input.current.value = ""; input.current?.focus(); };
  const hidden = <input ref={input} id={id} type="file" accept={accept} className="sr-only" aria-describedby={describedBy} aria-invalid={invalid || undefined} onChange={(e) => pick(e.target.files)} />;

  // Chosen: the same card in every mode.
  if (file) {
    return (
      <div className={`flex items-center gap-3 rounded-2xl border p-3 ${invalid ? "border-red-600 dark:border-red-400" : "border-emerald-300 bg-emerald-50/60 dark:border-emerald-400/30 dark:bg-emerald-400/5"}`}>
        {hidden}
        {/* eslint-disable-next-line @next/next/no-img-element -- local preview of the buyer's own file */}
        {preview ? <img src={preview} alt="" className="h-14 w-14 shrink-0 rounded-lg object-cover ring-1 ring-slate-900/10" /> : <span aria-hidden className="grid h-14 w-14 shrink-0 place-items-center rounded-lg bg-white text-slate-600 ring-1 ring-slate-900/10 dark:bg-white/10 dark:text-slate-300"><FileText className="h-6 w-6" /></span>}
        <div className="min-w-0 flex-1">
          <p dir="ltr" className="truncate text-start font-medium text-slate-900 dark:text-white">{file.name}</p>
          <p className="flex items-center gap-1 text-sm text-slate-600 dark:text-slate-400">{!invalid && <CheckCircle2 aria-hidden className="h-4 w-4 text-emerald-700 dark:text-emerald-400" />}{sizeLabel(tx, file.size)}</p>
        </div>
        <button type="button" onClick={() => input.current?.click()} className={`rounded-lg px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-100 dark:text-slate-100 dark:hover:bg-white/10 ${ring}`}>{tx("Change")}</button>
        <button type="button" onClick={clear} aria-label={tx("Remove {0}", { 0: file.name })} className={`rounded-lg p-2 text-slate-600 hover:bg-slate-100 hover:text-red-700 dark:text-slate-400 dark:hover:bg-white/10 ${ring}`}><Trash2 aria-hidden className="h-4 w-4" /></button>
      </div>
    );
  }

  if (mode === "row") {
    return (
      <div className={`flex flex-wrap items-center justify-between gap-3 rounded-xl border px-4 py-3 ${invalid ? "border-red-600 dark:border-red-400" : "border-slate-300 dark:border-white/20"}`}>
        {hidden}
        <span className="text-sm text-slate-600 dark:text-slate-400">{types}</span>
        <label htmlFor={id} className={`${secondary} cursor-pointer !px-4 !py-2 text-[15px]`}><Upload aria-hidden className="h-4 w-4" />{tx("Choose file")}</label>
      </div>
    );
  }

  if (mode === "camera") {
    return (
      <div className="grid gap-2 sm:grid-cols-2">
        {hidden}
        <input ref={camera} type="file" accept="image/*" capture="environment" className="sr-only" tabIndex={-1} aria-hidden onChange={(e) => pick(e.target.files)} />
        <button type="button" onClick={() => camera.current?.click()} className={`flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3.5 font-semibold text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 ${ring}`}><Camera aria-hidden className="h-5 w-5" />{tx("Take a photo")}</button>
        <label htmlFor={id} className={`${secondary} cursor-pointer`}><ImageUp aria-hidden className="h-5 w-5" />{tx("Choose from files")}</label>
        <p className="text-sm text-slate-600 sm:col-span-2 dark:text-slate-400">{types}</p>
      </div>
    );
  }

  return (
    <label
      htmlFor={id}
      onDragOver={(e) => { e.preventDefault(); setOver(true); }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => { e.preventDefault(); setOver(false); pick(e.dataTransfer.files); }}
      className={`flex cursor-pointer flex-col items-center gap-2 rounded-2xl border-2 border-dashed px-6 py-7 text-center transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-emerald-600 ${over ? "border-emerald-600 bg-emerald-50 dark:border-emerald-400 dark:bg-emerald-400/10" : invalid ? "border-red-500 dark:border-red-400" : "border-slate-300 bg-white hover:border-slate-500 dark:border-white/20 dark:bg-white/5"}`}
    >
      {hidden}
      <span aria-hidden className="grid h-11 w-11 place-items-center rounded-full bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-slate-200"><Upload className="h-5 w-5" /></span>
      <span className="font-semibold text-slate-900 dark:text-white">{tx("Drop the file here or choose one")}</span>
      <span className="text-sm text-slate-600 dark:text-slate-400">{types}</span>
    </label>
  );
}

// ---------- Form ----------

// The product's inputs, plan and Continue. `layout`: stack = one column; grouped = "Your account" / "Your documents";
// checklist = a progress list of what's still needed beside the fields.
export function VerifyForm({ v, upload = "drop", layout = "stack", hidePlans = false, privacy = true }: { v: VerifyState; upload?: Upload; layout?: "stack" | "grouped" | "checklist"; hidePlans?: boolean; privacy?: boolean }) {
  const tx = useT();
  const money = useMoney().format;
  if (!v.product) return null;
  if (v.done) return <DoneView v={v} />;
  const fields = v.product.fields;
  const docs = fields.filter((f) => f.type === "file");
  const info = fields.filter((f) => f.type !== "file");
  const total = v.plan ? money(v.plan.price) : "";
  const pay = (
    <div className="space-y-3">
      {privacy && docs.length > 0 && <PrivacyNote compact />}
      <button type="button" onClick={v.proceed} className={`${primary} w-full`}>{tx("Continue to payment")} · {total}</button>
    </div>
  );
  const group = (title: string, list: VerifyField[]) => list.length > 0 && (
    <fieldset className="space-y-4 rounded-2xl border border-slate-200 p-4 sm:p-5 dark:border-white/10">
      <legend className="px-1 font-display text-lg font-semibold text-slate-900 dark:text-white">{tx(title)}</legend>
      {list.map((f) => <FieldInput key={f.name} v={v} f={f} upload={upload} />)}
    </fieldset>
  );

  if (layout === "checklist") {
    const done = fields.filter((f) => v.filled(f)).length;
    return (
      <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_260px]">
        <div className="space-y-5">
          {!hidePlans && <PlanPicker v={v} />}
          {fields.map((f) => <FieldInput key={f.name} v={v} f={f} upload={upload} />)}
          {pay}
        </div>
        <aside aria-label={tx("What we need")} className="h-fit rounded-2xl border border-slate-200 bg-white p-4 md:sticky md:top-24 dark:border-white/10 dark:bg-[#0E1424]">
          <p className="font-semibold text-slate-900 dark:text-white">{tx("What we need")}</p>
          <p className="mt-0.5 text-sm text-slate-600 dark:text-slate-400">{tx("{0} of {1} ready", { 0: tx.num(done), 1: tx.num(fields.length) })}</p>
          <div aria-hidden className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10"><div className="h-full rounded-full bg-emerald-600 transition-[width] duration-300 dark:bg-emerald-400" style={{ width: `${fields.length ? (done / fields.length) * 100 : 100}%` }} /></div>
          <ul className="mt-4 space-y-2.5">
            {fields.map((f) => {
              const ok = v.filled(f);
              const Icon = f.type === "file" ? FileText : Check;
              return (
                <li key={f.name} className="flex items-start gap-2 text-[15px]">
                  <span aria-hidden className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full ${ok ? "bg-emerald-600 text-white dark:bg-emerald-400 dark:text-slate-900" : "border border-slate-300 text-slate-400 dark:border-white/25"}`}>{ok ? <Check className="h-3 w-3" /> : <Icon className="h-3 w-3" />}</span>
                  <a href={`#vf-${f.name}`} className={`hover:underline ${ok ? "text-slate-500 dark:text-slate-400" : "text-slate-900 dark:text-white"}`}>{tx(f.title)}{!f.required && <span className="text-slate-500"> ({tx("optional")})</span>}<span className="sr-only">{ok ? `, ${tx("done")}` : `, ${tx("still needed")}`}</span></a>
                </li>
              );
            })}
          </ul>
        </aside>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {!hidePlans && <PlanPicker v={v} />}
      {layout === "grouped" ? (
        <>
          {group(v.product.kind === "ready" ? "Where we send it" : "Your account", info)}
          {group("Your documents", docs)}
        </>
      ) : fields.map((f) => <FieldInput key={f.name} v={v} f={f} upload={upload} />)}
      {pay}
    </div>
  );
}

// What happens after Continue (sample: the live page goes to payment first).
export function DoneView({ v }: { v: VerifyState }) {
  const tx = useT();
  const money = useMoney().format;
  if (!v.product || !v.plan) return null;
  const sent = v.product.fields.filter((f) => (f.type === "file" ? v.files[f.name] : v.values[f.name]));
  return (
    <div role="status" className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-[#0E1424]">
      <p className="flex items-center gap-2 font-display text-xl font-bold text-slate-900 dark:text-white"><CheckCircle2 aria-hidden className="h-6 w-6 text-emerald-700 dark:text-emerald-400" />{tx("Order sent for review")}</p>
      <p className="mt-2 text-slate-700 dark:text-slate-300">{tx("Preview only: on the live site you pay first. Then our support team checks what you sent and starts work; you can follow it in your account.")}</p>
      <dl className="mt-5 divide-y divide-slate-100 text-[15px] dark:divide-white/10">
        <div className="flex justify-between gap-4 py-2"><dt className="text-slate-600 dark:text-slate-400">{tx(v.product.name)}</dt><dd className="font-semibold text-slate-900 dark:text-white">{tx(v.plan.name)} · {money(v.plan.price)}</dd></div>
        {sent.map((f) => (
          <div key={f.name} className="flex justify-between gap-4 py-2">
            <dt className="text-slate-600 dark:text-slate-400">{tx(f.title)}</dt>
            <dd dir="ltr" className="truncate font-medium text-slate-900 dark:text-white">{f.type === "file" ? <span className="inline-flex items-center gap-1"><Lock aria-hidden className="h-3.5 w-3.5 text-emerald-700 dark:text-emerald-400" />{v.files[f.name]?.name}</span> : v.values[f.name]}</dd>
          </div>
        ))}
      </dl>
      <button type="button" onClick={v.back} className={`${secondary} mt-5`}>{tx("Edit the order")}</button>
    </div>
  );
}

export function VerifyFaq() {
  const tx = useT();
  return (
    <div className="divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white dark:divide-white/10 dark:border-white/10 dark:bg-[#0E1424]">
      {verifyFaq.map((x) => (
        <details key={x.q} className="group p-5">
          <summary className={`cursor-pointer list-none font-semibold text-slate-900 marker:hidden dark:text-white ${ring} rounded`}>{tx(x.q)}</summary>
          <p className="mt-2 leading-relaxed text-slate-700 dark:text-slate-300">{tx(x.a)}</p>
        </details>
      ))}
    </div>
  );
}

// Moves focus to a newly shown panel's heading (after picking a product).
export function useFocusOnChange(key: unknown) {
  const ref = useRef<HTMLHeadingElement>(null);
  const first = useRef(true);
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    if (key) ref.current?.focus();
  }, [key]);
  return ref;
}
