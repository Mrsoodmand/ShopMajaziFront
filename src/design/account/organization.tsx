"use client";

import { useEffect, useId, useMemo, useState, type ReactNode } from "react";
import { BadgePercent, Building2, Check, CircleAlert, Clock, FileCheck2, FileUp, Loader2, Mail, MapPin, Phone, ReceiptText, ShieldCheck, Sparkles, X } from "lucide-react";
import { PageShell } from "../otp/parts";
import { LocaleProvider, useLocale, useT } from "@/i18n/client";
import { usePathname } from "next/navigation";
import { Head, Passbook, type Go, type View } from "./AccountC";
import { bad, card, describe, errorText, field, inner, Labeled, payBtn, secondary, smallBtn, useAccountDemo, useFmt, type Store } from "./kit";

// Organisation account (Back: App\Services\Organizations; /account › Business). A personal account becomes an
// organisation account after the customer sends the form (company name, email, phone, address, tax code + the
// questions the admin added) and an admin approves it. Approved accounts get a percent off on the product
// families the admin chose for that company (each family its own percent). Offers differ in how the page is laid out; the form and its rules are shared.

/* ---------- Data (the shape of GET account/panel/organization) ---------- */

export type OrgFieldType = "text" | "email" | "phone" | "textarea" | "number" | "select" | "yesno" | "date" | "file";
export type OrgField = { key: string; title: string; title_en: string | null; type: OrgFieldType; required: boolean; hint: string | null; hint_en: string | null; options: string[]; accept: string[]; max_mb: number | null };
export type OrgStatus = "personal" | "pending" | "approved" | "rejected" | "cancelled";
export type OrgFamily = "subscriptions" | "services" | "verification" | "apple_id" | "google_voice" | "telegram";
export type OrgRequest = { id: number; status: Exclude<OrgStatus, "personal">; company_name: string | null; note: string | null; answers: { key: string; title: string; type: string; value: string }[]; created_at: string | null; reviewed_at: string | null };
// discounts: this company's percent per product family; a family not listed has no discount.
// vat: the VAT percent an official invoice adds (the company's own once approved, else the admin's default).
export type OrgState = { status: OrgStatus; discounts: Partial<Record<OrgFamily, number>>; vat?: number; open: boolean; can_apply: boolean; fields: OrgField[]; request: OrgRequest | null };
export type OrgStore = { org: OrgState | null; loadOrg?: () => void; applyOrg: (fields: Record<string, string | File>) => Promise<void> };

export const FAMILY_LABEL: Record<OrgFamily, string> = { subscriptions: "Subscriptions & accounts", services: "Social media services", verification: "Verification", apple_id: "Apple ID", google_voice: "Google Voice", telegram: "Telegram Stars & Premium" };
const FAMILY_ORDER = Object.keys(FAMILY_LABEL) as OrgFamily[];
/** The families this company has a percent on, in a fixed order. */
export const familiesOf = (org: OrgState) => FAMILY_ORDER.filter((k) => (org.discounts[k] ?? 0) > 0);

/** Toman off a price; the server takes off the same (Organizations::cut). */
export const orgCut = (price: number, percent: number) => (percent > 0 ? Math.round((price * percent) / 100) : 0);

/* ---------- Sample ---------- */

const FIELDS: OrgField[] = [
  { key: "official_invoice", title: "آیا فاکتور رسمی نیاز دارید؟", title_en: "Do you need an official invoice?", type: "yesno", required: true, hint: null, hint_en: null, options: [], accept: [], max_mb: null },
  { key: "company_name", title: "نام شرکت", title_en: "Company name", type: "text", required: true, hint: null, hint_en: null, options: [], accept: [], max_mb: null },
  { key: "company_email", title: "ایمیل شرکت", title_en: "Company email", type: "email", required: true, hint: null, hint_en: null, options: [], accept: [], max_mb: null },
  { key: "company_phone", title: "تلفن شرکت", title_en: "Company phone", type: "phone", required: true, hint: null, hint_en: null, options: [], accept: [], max_mb: null },
  { key: "company_address", title: "آدرس شرکت", title_en: "Company address", type: "textarea", required: true, hint: null, hint_en: null, options: [], accept: [], max_mb: null },
  { key: "tax_code", title: "کد اقتصادی / شناسه ملی", title_en: "Tax code", type: "text", required: true, hint: "۱۰ تا ۱۴ رقم", hint_en: "10 to 14 digits", options: [], accept: [], max_mb: null },
  { key: "q_team", title: "چند نفر در شرکت کار می‌کنند؟", title_en: "How many people work at the company?", type: "select", required: true, hint: null, hint_en: null, options: ["۱ تا ۱۰ نفر", "۱۱ تا ۵۰ نفر", "بیشتر از ۵۰ نفر"], accept: [], max_mb: null },
  { key: "q_monthly", title: "ماهانه حدودا چقدر خرید دارید؟", title_en: "Roughly how much do you buy each month?", type: "text", required: false, hint: "به تومان", hint_en: "In Toman", options: [], accept: [], max_mb: null },
  { key: "q_doc", title: "آگهی تاسیس یا روزنامه رسمی", title_en: "Registration notice", type: "file", required: false, hint: null, hint_en: null, options: [], accept: ["image", "pdf"], max_mb: 5 },
];
const ANSWERS = [
  { key: "company_name", title: "نام شرکت", type: "text", value: "داده‌پردازان آریا" },
  { key: "company_email", title: "ایمیل شرکت", type: "email", value: "info@arya-data.ir" },
  { key: "company_phone", title: "تلفن شرکت", type: "phone", value: "021-88776655" },
  { key: "company_address", title: "آدرس شرکت", type: "textarea", value: "تهران، خیابان ولیعصر، پلاک ۱۲" },
  { key: "tax_code", title: "کد اقتصادی / شناسه ملی", type: "text", value: "411234567890" },
];
const REQ = (status: OrgRequest["status"], note: string | null = null): OrgRequest => ({ id: 14, status, company_name: "داده‌پردازان آریا", note, answers: ANSWERS, created_at: "2026-11-20T10:15:00", reviewed_at: status === "pending" ? null : "2026-11-21T09:00:00" });
const SAMPLES: Record<OrgStatus, OrgState> = {
  personal: { status: "personal", discounts: {}, vat: 12, open: true, can_apply: true, fields: FIELDS, request: null },
  pending: { status: "pending", discounts: {}, vat: 12, open: true, can_apply: false, fields: [], request: REQ("pending") },
  rejected: { status: "rejected", discounts: {}, vat: 12, open: true, can_apply: true, fields: FIELDS, request: REQ("rejected", "کد اقتصادی با نام شرکت یکی نیست. لطفا دوباره بررسی کنید.") },
  approved: { status: "approved", discounts: { subscriptions: 10, verification: 5 }, vat: 12, open: true, can_apply: false, fields: [], request: REQ("approved") },
  cancelled: { status: "cancelled", discounts: {}, vat: 12, open: true, can_apply: true, fields: FIELDS, request: REQ("cancelled") },
};

function useOrgDemo(initial: OrgStatus) {
  const demo = useAccountDemo();
  const [status, setStatus] = useState<OrgStatus>(initial);
  const store: Store & OrgStore = useMemo(() => ({
    ...demo,
    org: SAMPLES[status],
    applyOrg: async () => { await new Promise((r) => setTimeout(r, 800)); setStatus("pending"); },
  }), [demo, status]);
  return { store, status, setStatus };
}

/* ---------- Shared: the form ---------- */

const fieldTitle = (f: OrgField, en: boolean) => (en && f.title_en) || f.title;
const fieldHint = (f: OrgField, en: boolean) => (en && f.hint_en) || f.hint || undefined;
const FIELD_ICON: Partial<Record<string, typeof Mail>> = { official_invoice: FileCheck2, company_name: Building2, company_email: Mail, company_phone: Phone, company_address: MapPin, tax_code: ReceiptText };
const isBuiltin = (k: string) => k in FIELD_ICON;

/*
 * The field as it applies now: with the official-invoice question on the form, the tax code is required only
 * when the answer is yes (Organizations::submit checks the same).
 */
function liveField(f: OrgField, fields: OrgField[], values: Record<string, string | File | undefined>): OrgField {
  if (f.key !== "tax_code" || !fields.some((x) => x.key === "official_invoice")) return f;
  return { ...f, required: values.official_invoice === "yes" };
}

function checkField(f: OrgField, v: string | File | undefined, t: ReturnType<typeof useT>): string | null {
  if (f.type === "file") {
    if (!(v instanceof File)) return f.required ? t("Please attach this file.") : null;
    if (f.max_mb && v.size > f.max_mb * 1024 * 1024) return t("The file must be at most {0} MB.", { 0: f.max_mb });
    return null;
  }
  const s = typeof v === "string" ? v.trim() : "";
  if (!s) return f.required ? t("Please fill this in.") : null;
  if (f.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s)) return t("Enter an email like name@company.com.");
  if (f.type === "phone" && !/^\+?[0-9۰-۹][0-9۰-۹ \-]{4,19}$/.test(s)) return t("Enter a phone number with its area code.");
  if (f.key === "tax_code" && !/^[0-9۰-۹]{10,14}$/.test(s)) return t("The tax code is 10 to 14 digits.");
  return null;
}

/** One input, by type. */
function OrgInput({ f, value, error, onChange, note }: { f: OrgField; value: string | File | undefined; error: string | null; onChange: (v: string | File | undefined) => void; note?: ReactNode }) {
  const t = useT();
  const en = useLocale() === "en";
  const id = useId();
  const hint = fieldHint(f, en);
  const label = fieldTitle(f, en) + (f.required ? "" : ` (${t("optional")})`);
  const aria = { id, "aria-invalid": error ? true : undefined, "aria-describedby": describe(id, !!hint, error) } as const;
  const cls = `${field} ${error ? bad : ""}`;
  const s = typeof value === "string" ? value : "";
  let control: ReactNode;
  switch (f.type) {
    case "textarea":
      control = <textarea {...aria} rows={3} className={cls} value={s} onChange={(e) => onChange(e.target.value)} />;
      break;
    case "select":
      control = (
        <select {...aria} className={cls} value={s} onChange={(e) => onChange(e.target.value)}>
          <option value="">{t("Choose…")}</option>
          {f.options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      );
      break;
    case "yesno":
      control = (
        <div role="radiogroup" aria-labelledby={`${id}-l`} className="flex gap-2">
          {(f.key === "official_invoice" ? (["no", "yes"] as const) : (["yes", "no"] as const)).map((v) => (
            <button key={v} type="button" role="radio" aria-checked={s === v} onClick={() => onChange(v)}
              className={`${smallBtn} min-w-20 border ${s === v ? "border-indigo-600 bg-indigo-50 text-indigo-800 dark:border-indigo-400 dark:bg-indigo-500/15 dark:text-indigo-200" : "border-slate-300 text-slate-700 dark:border-white/20 dark:text-slate-300"}`}>
              {v === "yes" ? t("Yes") : t("No")}
            </button>
          ))}
        </div>
      );
      break;
    case "file": {
      const file = value instanceof File ? value : null;
      control = (
        <label className={`flex cursor-pointer items-center gap-3 rounded-2xl border-2 border-dashed p-4 transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-emerald-600 ${error ? "border-red-700 dark:border-red-400" : "border-slate-300 hover:border-slate-400 dark:border-white/20"}`}>
          <FileUp aria-hidden className="h-5 w-5 shrink-0 text-slate-500" />
          <span className="min-w-0 flex-1 text-[15px]">
            <span className="block truncate font-semibold text-slate-900 dark:text-white">{file ? file.name : t("Choose a file")}</span>
            <span className="block text-sm text-slate-600 dark:text-slate-400">{f.accept.includes("pdf") ? t("Photo or PDF") : t("Photo")}{f.max_mb ? ` · ${t("up to {0} MB", { 0: f.max_mb })}` : ""}</span>
          </span>
          {file && <button type="button" onClick={(e) => { e.preventDefault(); onChange(undefined); }} className={`${smallBtn} text-slate-600`} aria-label={t("Remove file")}><X aria-hidden className="h-4 w-4" /></button>}
          <input {...aria} type="file" className="sr-only" accept={[f.accept.includes("image") && "image/*", f.accept.includes("pdf") && "application/pdf"].filter(Boolean).join(",")} onChange={(e) => onChange(e.target.files?.[0])} />
        </label>
      );
      break;
    }
    default:
      control = (
        <input {...aria} className={cls} value={s} onChange={(e) => onChange(e.target.value)}
          dir={["email", "phone", "number"].includes(f.type) || f.key === "tax_code" ? "ltr" : undefined}
          inputMode={f.type === "phone" ? "tel" : f.type === "number" || f.key === "tax_code" ? "numeric" : f.type === "email" ? "email" : undefined}
          type={f.type === "email" ? "email" : "text"} autoComplete={f.type === "email" ? "email" : f.type === "phone" ? "tel" : undefined} />
      );
  }
  return <Labeled id={id} label={label} hint={hint} error={error}>{f.type === "yesno" ? <span id={`${id}-l`} className="sr-only">{label}</span> : null}{control}{note}</Labeled>;
}

function useOrgForm(fields: OrgField[], send: (v: Record<string, string | File>) => Promise<void>, initial: Record<string, string> = {}) {
  const t = useT();
  const [values, setValues] = useState<Record<string, string | File | undefined>>(initial);
  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const [busy, setBusy] = useState(false);
  const [failure, setFailure] = useState<string | null>(null);
  const set = (k: string, v: string | File | undefined) => { setValues((x) => ({ ...x, [k]: v })); if (errors[k]) setErrors((e) => ({ ...e, [k]: null })); };
  const check = (only?: OrgField[]) => {
    const next: Record<string, string | null> = {};
    for (const f of only ?? fields) next[f.key] = checkField(liveField(f, fields, values), values[f.key], t);
    setErrors((e) => ({ ...e, ...next }));
    const first = (only ?? fields).find((f) => next[f.key]);
    if (first) setTimeout(() => document.querySelector<HTMLElement>(`[aria-invalid="true"]`)?.focus(), 0); // after React marks the fields
    return !first;
  };
  const submit = async () => {
    if (!check()) return;
    setBusy(true); setFailure(null);
    try {
      await send(Object.fromEntries(Object.entries(values).filter(([, v]) => v !== undefined && v !== "")) as Record<string, string | File>);
    } catch (e) { setFailure(errorText(e, t("Something went wrong. Please try again."))); } finally { setBusy(false); }
  };
  return { values, errors, busy, failure, set, check, submit, fields };
}
type OrgFormState = ReturnType<typeof useOrgForm>;

// Under "official invoice: yes": the VAT that will be added (the admin's percent).
function VatNote({ vat }: { vat: number }) {
  const t = useT();
  const f = useFmt();
  return (
    <p role="status" className="mt-3 flex items-start gap-2 rounded-2xl bg-amber-50 p-3 text-[15px] font-semibold text-amber-900 dark:bg-amber-500/10 dark:text-amber-200">
      <ReceiptText aria-hidden className="mt-0.5 h-4 w-4 shrink-0" />
      {t("{0}% VAT will be added to every invoice.", { 0: f.pct(vat) })}
    </p>
  );
}

const Inputs = ({ list, s, vat = 0 }: { list: OrgField[]; s: OrgFormState; vat?: number }) => (
  <>{list.map((f) => (
    <OrgInput key={f.key} f={liveField(f, s.fields, s.values)} value={s.values[f.key]} error={s.errors[f.key] ?? null} onChange={(v) => s.set(f.key, v)}
      note={f.key === "official_invoice" && s.values.official_invoice === "yes" && vat > 0 ? <VatNote vat={vat} /> : undefined} />
  ))}</>
);

function SendButton({ s, label }: { s: OrgFormState; label: string }) {
  return (
    <>
      {s.failure && <p role="alert" className="flex items-start gap-2 rounded-2xl bg-red-50 p-3 text-[15px] font-semibold text-red-800 dark:bg-red-500/10 dark:text-red-300"><CircleAlert aria-hidden className="mt-0.5 h-4 w-4 shrink-0" />{s.failure}</p>}
      <button type="submit" disabled={s.busy} className={payBtn}>{s.busy ? <Loader2 aria-hidden className="h-5 w-5 animate-spin" /> : <Building2 aria-hidden className="h-5 w-5" />}{label}</button>
    </>
  );
}

/* ---------- Shared: status pieces ---------- */

function PricePreview({ org }: { org: OrgState }) {
  const t = useT();
  const f = useFmt();
  const family = familiesOf(org)[0];
  if (!family) return null;
  const percent = org.discounts[family] ?? 0;
  const price = 1_250_000;
  return (
    <div className={`${inner} p-4`}>
      <p className="text-sm text-slate-600 dark:text-slate-400">{t("How prices look for you, e.g. {0}", { 0: t(FAMILY_LABEL[family]) })}</p>
      <div className="mt-2 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="font-display text-2xl font-bold tabular-nums text-slate-900 dark:text-white">{f.money(price - orgCut(price, percent))}</span>
        <s className="tabular-nums text-slate-500">{f.num(price)}</s>
        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-sm font-semibold text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300">{t("Business −{0}%", { 0: f.pct(percent) })}</span>
      </div>
    </div>
  );
}

/** This company's percent per product, as a short list. `tone`: on a dark card or a light one. */
function Families({ org, tone = "light" }: { org: OrgState; tone?: "light" | "dark" }) {
  const t = useT();
  const f = useFmt();
  return (
    <ul className={tone === "dark" ? "space-y-2" : "divide-y divide-slate-200 dark:divide-white/10"}>
      {familiesOf(org).map((k) => (
        <li key={k} className={`flex items-center justify-between gap-3 ${tone === "dark" ? "text-indigo-100" : "py-2.5 text-[15px] text-slate-800 dark:text-slate-200"}`}>
          <span className="flex items-center gap-2"><Check aria-hidden className={`h-4 w-4 shrink-0 ${tone === "dark" ? "text-emerald-300" : "text-emerald-700 dark:text-emerald-400"}`} />{t(FAMILY_LABEL[k])}</span>
          <span className={`font-semibold tabular-nums ${tone === "dark" ? "text-white" : "text-emerald-800 dark:text-emerald-300"}`}>{t("{0}%", { 0: f.pct(org.discounts[k] ?? 0) })}</span>
        </li>
      ))}
    </ul>
  );
}

function Answers({ req }: { req: OrgRequest }) {
  const t = useT();
  return (
    <dl className="divide-y divide-slate-200 dark:divide-white/10">
      {req.answers.filter((a) => a.type !== "file").map((a) => (
        <div key={a.key} className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 py-2.5">
          <dt className="text-sm text-slate-600 dark:text-slate-400">{a.title}</dt>
          <dd dir={["email", "phone"].includes(a.type) || a.key === "tax_code" ? "ltr" : undefined} className="text-[15px] font-semibold text-slate-900 dark:text-white">{a.type === "yesno" ? (a.value === "yes" ? t("Yes") : t("No")) : a.value}</dd>
        </div>
      ))}
    </dl>
  );
}

function StatusNote({ org }: { org: OrgState }) {
  const t = useT();
  if (org.status === "pending") return <Banner tone="indigo" icon={Clock} title={t("We're checking your details")} text={t("You'll see the result here once we've checked them. Meanwhile you can keep buying at normal prices.")} />;
  if (org.status === "rejected") return <Banner tone="red" icon={CircleAlert} title={t("Your request wasn't approved")} text={org.request?.note || t("Fix the details below and send them again.")} />;
  if (org.status === "cancelled") return <Banner tone="slate" icon={CircleAlert} title={t("Your account is personal again")} text={org.request?.note || t("You can send a new request at any time.")} />;
  return null;
}
function Banner({ tone, icon: Icon, title, text }: { tone: "indigo" | "red" | "slate"; icon: typeof Clock; title: string; text: string }) {
  const c = { indigo: "bg-indigo-50 text-indigo-900 dark:bg-indigo-500/10 dark:text-indigo-100", red: "bg-red-50 text-red-900 dark:bg-red-500/10 dark:text-red-100", slate: "bg-slate-100 text-slate-800 dark:bg-white/5 dark:text-slate-200" }[tone];
  return (
    <div role="status" className={`mb-6 flex items-start gap-3 rounded-3xl p-5 ${c}`}>
      <Icon aria-hidden className="mt-0.5 h-5 w-5 shrink-0" />
      <div><p className="font-semibold">{title}</p><p className="mt-0.5 text-[15px] opacity-90">{text}</p></div>
    </div>
  );
}

const orgOf = (demo: Store) => (demo as Store & Partial<OrgStore>);

function OrgLoading() {
  const t = useT();
  return (
    <div role="status" aria-label={t("Loading…")} className="space-y-4">
      <div className="h-10 w-56 animate-pulse rounded-xl bg-slate-200 dark:bg-white/10" />
      <div className="h-80 animate-pulse rounded-3xl bg-white ring-1 ring-slate-200 dark:bg-white/5 dark:ring-white/10" />
    </div>
  );
}

/* ---------- A · Steps: a three-step track on top, then one form ---------- */

function Track({ status }: { status: OrgStatus }) {
  const t = useT();
  const at = status === "approved" ? 3 : status === "pending" ? 2 : 1;
  const steps = [t("Send your company details"), t("We review them"), t("Business prices")];
  return (
    <ol className="mb-6 grid grid-cols-3 gap-2">
      {steps.map((label, i) => {
        const n = i + 1;
        const done = n < at || status === "approved";
        const now = n === at && status !== "approved";
        return (
          <li key={label} aria-current={now ? "step" : undefined} className={`rounded-2xl border p-3 sm:p-4 ${now ? "border-indigo-600 bg-indigo-50 dark:border-indigo-400 dark:bg-indigo-500/10" : done ? "border-emerald-600/40 bg-emerald-50 dark:border-emerald-400/30 dark:bg-emerald-500/10" : "border-slate-200 dark:border-white/10"}`}>
            <span className={`grid h-7 w-7 place-items-center rounded-full text-sm font-bold ${done ? "bg-emerald-700 text-white dark:bg-emerald-400 dark:text-emerald-950" : now ? "bg-indigo-600 text-white" : "bg-slate-200 text-slate-600 dark:bg-white/10 dark:text-slate-400"}`}>{done ? <Check aria-hidden className="h-4 w-4" /> : n}</span>
            <span className="mt-2 block text-sm font-semibold text-slate-900 sm:text-[15px] dark:text-white">{label}</span>
          </li>
        );
      })}
    </ol>
  );
}

function BusinessA({ demo }: { demo: Store; go: Go }) {
  const t = useT();
  const f = useFmt();
  const { org, applyOrg } = orgOf(demo);
  const s = useOrgForm(org?.fields ?? [], (v) => applyOrg!(v));
  if (!org) return null;
  return (
    <div>
      <Head title={t("Business account")} sub={t("Turn your account into a company account and get a lower price on every order.")} />
      <Track status={org.status} />
      <StatusNote org={org} />
      {org.status === "approved" && org.request && (
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_21rem] xl:items-start">
          <section className={`${card} p-6 sm:p-8`}>
            <div className="flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300"><BadgePercent aria-hidden className="h-6 w-6" /></span>
              <p className="font-display text-xl font-semibold text-slate-900 dark:text-white">{t("Your business discounts")}</p>
            </div>
            <div className="mt-4"><Families org={org} /></div>
            <div className="mt-6"><PricePreview org={org} /></div>
          </section>
          <section className={`${card} p-6`}>
            <h2 className="mb-2 font-display text-lg font-semibold text-slate-900 dark:text-white">{t("Company details")}</h2>
            <Answers req={org.request} />
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">{t("To change these, write to support.")}</p>
          </section>
        </div>
      )}
      {org.status === "pending" && org.request && <section className={`${card} p-6`}><h2 className="mb-2 font-display text-lg font-semibold text-slate-900 dark:text-white">{t("What you sent")}</h2><Answers req={org.request} /></section>}
      {org.can_apply && (
        <form noValidate onSubmit={(e) => { e.preventDefault(); s.submit(); }} className={`${card} space-y-7 p-6 sm:p-8`}>
          <Inputs list={org.fields} s={s} vat={org.vat} />
          <SendButton s={s} label={org.status === "personal" ? t("Send for review") : t("Send again")} />
        </form>
      )}
      {!org.can_apply && org.status === "personal" && <Banner tone="slate" icon={Clock} title={t("Requests are closed for now")} text={t("Please check back later.")} />}
    </div>
  );
}

/* ---------- B · Benefits aside: the form in two groups, what you get on the side ---------- */

function BusinessB({ demo }: { demo: Store; go: Go }) {
  const t = useT();
  const { org, applyOrg, loadOrg } = orgOf(demo);
  useEffect(() => { loadOrg?.(); }, [loadOrg]);
  const s = useOrgForm(org?.fields ?? [], (v) => applyOrg!(v));
  if (!org) return <OrgLoading />;
  const company = org.fields.filter((x) => isBuiltin(x.key));
  const questions = org.fields.filter((x) => !isBuiltin(x.key));
  const aside = (
    <aside className="space-y-6 xl:sticky xl:top-24">
      <section className="rounded-3xl bg-[#1e1b4b] p-6 text-white dark:bg-[#15123a]">
        <Building2 aria-hidden className="h-7 w-7 text-indigo-200" />
        <h2 className="mt-3 font-display text-xl font-semibold">{org.status === "approved" ? t("You have a business account") : t("What a business account gives you")}</h2>
        <ul className="mt-4 space-y-3 text-[15px] text-indigo-100">
          {org.status === "approved" ? (
            <li><p className="mb-2 flex gap-2"><BadgePercent aria-hidden className="mt-0.5 h-5 w-5 shrink-0 text-emerald-300" />{t("Your company's discounts:")}</p><div className="ps-7"><Families org={org} tone="dark" /></div></li>
          ) : (
            <li className="flex gap-2"><BadgePercent aria-hidden className="mt-0.5 h-5 w-5 shrink-0 text-emerald-300" />{t("Business prices on the products we agree with your company")}</li>
          )}
          <li className="flex gap-2"><ReceiptText aria-hidden className="mt-0.5 h-5 w-5 shrink-0 text-emerald-300" />{t("Your company name and tax code on every invoice")}</li>
          <li className="flex gap-2"><ShieldCheck aria-hidden className="mt-0.5 h-5 w-5 shrink-0 text-emerald-300" />{t("Same wallet, same orders, same sign-in")}</li>
        </ul>
      </section>
      {org.status === "approved" && <PricePreview org={org} />}
    </aside>
  );
  return (
    <div>
      <Head title={t("Business account")} sub={t("Turn your account into a company account and get a lower price on every order.")} />
      <StatusNote org={org} />
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_21rem] xl:items-start">
        <div className="min-w-0">
          {org.can_apply ? (
            <form noValidate onSubmit={(e) => { e.preventDefault(); s.submit(); }} className="space-y-6">
              <fieldset className={`${card} space-y-7 p-6 sm:p-8`}>
                <legend className="sr-only">{t("Company details")}</legend>
                <h2 aria-hidden className="font-display text-lg font-semibold text-slate-900 dark:text-white">{t("Company details")}</h2>
                <Inputs list={company} s={s} vat={org.vat} />
              </fieldset>
              {questions.length > 0 && (
                <fieldset className={`${card} space-y-7 p-6 sm:p-8`}>
                  <legend className="sr-only">{t("A few questions")}</legend>
                  <h2 aria-hidden className="font-display text-lg font-semibold text-slate-900 dark:text-white">{t("A few questions")}</h2>
                  <Inputs list={questions} s={s} vat={org.vat} />
                </fieldset>
              )}
              <SendButton s={s} label={org.status === "personal" ? t("Send for review") : t("Send again")} />
            </form>
          ) : org.request ? (
            <section className={`${card} p-6 sm:p-8`}>
              <h2 className="mb-2 font-display text-lg font-semibold text-slate-900 dark:text-white">{org.status === "approved" ? t("Company details") : t("What you sent")}</h2>
              <Answers req={org.request} />
              {org.status === "approved" && <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">{t("To change these, write to support.")}</p>}
            </section>
          ) : (
            <Banner tone="slate" icon={Clock} title={t("Requests are closed for now")} text={t("Please check back later.")} />
          )}
        </div>
        {aside}
      </div>
    </div>
  );
}

/* ---------- C · Membership card: a company card up top; applying is two short steps ---------- */

function MemberCard({ org }: { org: OrgState }) {
  const t = useT();
  const f = useFmt();
  const on = org.status === "approved";
  return (
    <div className={`relative overflow-hidden rounded-3xl p-6 sm:p-8 ${on ? "bg-gradient-to-br from-indigo-700 via-indigo-800 to-[#1e1b4b] text-white" : "border-2 border-dashed border-slate-300 text-slate-500 dark:border-white/20 dark:text-slate-400"}`}>
      {on && <Sparkles aria-hidden className="absolute -end-4 -top-4 h-28 w-28 text-white/10" />}
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className={`text-sm ${on ? "text-indigo-200" : ""}`}>{t("Business account")}</p>
          <p className={`mt-1 truncate font-display text-2xl font-bold ${on ? "" : "text-slate-400 dark:text-slate-500"}`}>{on ? org.request?.company_name : t("Your company")}</p>
          <p dir="ltr" className={`mt-1 text-start text-sm tabular-nums ${on ? "text-indigo-200" : ""}`}>{on ? org.request?.answers.find((a) => a.key === "tax_code")?.value : "•••• •••• ••••"}</p>
        </div>
        <div className="text-end">
          <p className={`text-sm ${on ? "text-indigo-200" : ""}`}>{t("Discount")}</p>
          <p className="font-display text-4xl font-bold tabular-nums">{on && familiesOf(org).length ? t("Up to {0}%", { 0: f.pct(Math.max(...familiesOf(org).map((k) => org.discounts[k] ?? 0))) }) : "—"}</p>
        </div>
      </div>
      {on && <div className="mt-6 flex flex-wrap gap-2">{familiesOf(org).map((k) => <span key={k} className="rounded-full bg-white/15 px-3 py-1 text-sm font-semibold">{t(FAMILY_LABEL[k])} · {t("{0}%", { 0: f.pct(org.discounts[k] ?? 0) })}</span>)}</div>}
    </div>
  );
}

function BusinessC({ demo }: { demo: Store; go: Go }) {
  const t = useT();
  const { org, applyOrg } = orgOf(demo);
  const s = useOrgForm(org?.fields ?? [], (v) => applyOrg!(v));
  const [step, setStep] = useState<0 | 1 | 2>(0); // 0 = not started, 1 = company, 2 = questions
  if (!org) return null;
  const company = org.fields.filter((x) => isBuiltin(x.key));
  const questions = org.fields.filter((x) => !isBuiltin(x.key));
  const last = questions.length ? 2 : 1;
  return (
    <div>
      <Head title={t("Business account")} sub={t("Turn your account into a company account and get a lower price on every order.")} />
      <div className="mb-6"><MemberCard org={org} /></div>
      <StatusNote org={org} />
      {org.status === "approved" && (
        <div className="grid gap-6 xl:grid-cols-2 xl:items-start">
          <PricePreview org={org} />
          {org.request && <section className={`${card} p-6`}><h2 className="mb-2 font-display text-lg font-semibold text-slate-900 dark:text-white">{t("Company details")}</h2><Answers req={org.request} /><p className="mt-3 text-sm text-slate-600 dark:text-slate-400">{t("To change these, write to support.")}</p></section>}
        </div>
      )}
      {org.status === "pending" && org.request && <section className={`${card} p-6`}><h2 className="mb-2 font-display text-lg font-semibold text-slate-900 dark:text-white">{t("What you sent")}</h2><Answers req={org.request} /></section>}
      {org.can_apply && step === 0 && (
        <section className={`${card} flex flex-wrap items-center justify-between gap-4 p-6`}>
          <div className="max-w-lg">
            <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-white">{t("Buying for a company?")}</h2>
            <p className="mt-1 text-[15px] text-slate-700 dark:text-slate-300">{t("Send your company details once. After we approve them, every price you see is your business price.")}</p>
          </div>
          <button type="button" onClick={() => setStep(1)} className={`${payBtn} w-auto`}>{t("Get a business account")}</button>
        </section>
      )}
      {org.can_apply && step > 0 && (
        <form noValidate onSubmit={(e) => { e.preventDefault(); if (step < last) { if (s.check(company)) setStep(2); } else s.submit(); }} className={`${card} space-y-7 p-6 sm:p-8`}>
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-white">{step === 1 ? t("Company details") : t("A few questions")}</h2>
            <span className="text-sm tabular-nums text-slate-600 dark:text-slate-400">{t("Step {0} of {1}", { 0: step, 1: last })}</span>
          </div>
          <Inputs list={step === 1 ? company : questions} s={s} vat={org.vat} />
          <div className="flex flex-col-reverse gap-3 sm:flex-row">
            <button type="button" onClick={() => setStep(step === 2 ? 1 : 0)} className={`${secondary} sm:w-auto`}>{t("Back")}</button>
            <div className="flex-1 space-y-3">{step < last ? <button type="submit" className={payBtn}>{t("Next")}</button> : <SendButton s={s} label={t("Send for review")} />}</div>
          </div>
        </form>
      )}
    </div>
  );
}

/* ---------- The offers ---------- */

const STATES: OrgStatus[] = ["personal", "pending", "rejected", "approved"];
const STATE_LABEL: Record<OrgStatus, string> = { personal: "Personal (form)", pending: "Sent, under review", rejected: "Not approved", approved: "Approved", cancelled: "Cancelled" };

function offer(Business: (p: { demo: Store; go: Go }) => ReactNode) {
  return function Offer() {
    const t = useT();
    const { store, status, setStatus } = useOrgDemo("personal");
    const [view, setView] = useState<View>({ page: "business" });
    return (
      <PageShell>
        <div className="mx-auto flex max-w-[1280px] flex-wrap gap-2 px-4 pe-48 pt-4">
          {STATES.map((s) => (
            <button key={s} type="button" onClick={() => { setStatus(s); setView({ page: "business" }); }} className={`${smallBtn} ${status === s ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900" : "border border-slate-300 dark:border-white/20"}`}>{t(STATE_LABEL[s])}</button>
          ))}
        </div>
        <Passbook key={status} store={store} view={view} go={setView} Business={Business} />
      </PageShell>
    );
  };
}

// The gallery is English; these offers open in Persian (the site's own language) with a switch, like the verify offers.
function inLanguage(C: () => ReactNode) {
  return function InLanguage() {
    const [lang, setLang] = useState<"fa" | "en">("fa");
    if (!usePathname()?.startsWith("/design")) return <C />;
    return (
      <div className="relative">
        <div role="group" aria-label="Language" className="absolute top-20 left-4 z-40 flex rounded-xl border border-slate-300 bg-white p-1 text-sm shadow-sm dark:border-white/15 dark:bg-slate-800">
          {(["fa", "en"] as const).map((l) => <button key={l} type="button" aria-pressed={lang === l} onClick={() => setLang(l)} className={`rounded-lg px-3 py-1.5 ${lang === l ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900" : "text-slate-700 dark:text-slate-300"}`}>{l === "fa" ? "فارسی" : "English"}</button>)}
        </div>
        <div dir={lang === "fa" ? "rtl" : "ltr"} lang={lang} key={lang}><LocaleProvider locale={lang}><C /></LocaleProvider></div>
      </div>
    );
  };
}

export const BusinessOfferA = inLanguage(offer(BusinessA));
export const BusinessOfferB = inLanguage(offer(BusinessB));
export const BusinessOfferC = inLanguage(offer(BusinessC));
export { BusinessA, BusinessB, BusinessC };
// The same inputs draw other admin-built forms (design/subs/request.tsx: درخواست اکانت).
export { OrgInput, useOrgForm };
