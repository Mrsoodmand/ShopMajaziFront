"use client";
import { useState, type ComponentType, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { CheckCircle2, Clock, Mail, MapPin, Phone, Search, Send, X } from "lucide-react";
import { LocaleProvider, useT } from "@/i18n/client";
import Link from "@/i18n/Link";
import { useH1 } from "@/components/seo/PageHeading";
import { contact, contactTopics } from "@/content/info-en";
import { field, ring } from "../googleVoice/clean";
import { CAPTCHA_MESSAGES, CaptchaField, useCaptcha } from "@/lib/captcha";

// Shared pieces for the Contact us, FAQ and About us page offers (offers.tsx).

export const card = "rounded-3xl border border-slate-200 bg-white dark:border-white/10 dark:bg-[#0E1424]";
export const eyebrow = "text-sm font-semibold uppercase tracking-widest text-indigo-600 dark:text-indigo-400";
export const h1 = "font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl dark:text-white";
export const lead = "mt-4 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-400";
export const btn = `inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white transition hover:bg-slate-700 disabled:opacity-60 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200 ${ring}`;

export function PageHead({ kicker, title, text, center = false, children }: { kicker: string; title: string; text?: string; center?: boolean; children?: ReactNode }) {
  const tx = useT();
  const heading = useH1(tx(title)); // admin › SEO › H1 on the live page
  return (
    <header className={`animate-fade-up ${center ? "mx-auto text-center [&>p]:mx-auto" : ""}`}>
      <p className={eyebrow}>{tx(kicker)}</p>
      <h1 className={`mt-3 ${h1}`}>{heading}</h1>
      {text && <p className={lead}>{tx(text)}</p>}
      {children}
    </header>
  );
}

export type Channel = { id: string; icon: typeof Mail; label: string; value: string; href: string; note: string; ltr?: boolean };
export function useChannels(): Channel[] {
  return [
    { id: "telegram", icon: Send, label: "Telegram", value: "Message us on Telegram", href: contact.telegram, note: "The quickest way to reach us" },
    { id: "email", icon: Mail, label: "Email", value: contact.email, href: `mailto:${contact.email}`, note: "We reply within a few hours", ltr: true },
    { id: "phone", icon: Phone, label: "Call us", value: contact.phone, href: contact.phoneHref, note: "For urgent questions", ltr: true },
  ];
}

export function ChannelRow({ c, big = false }: { c: Channel; big?: boolean }) {
  const tx = useT();
  return (
    <a href={c.href} className={`group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white transition hover:border-indigo-300 hover:shadow-lg hover:shadow-indigo-100/60 dark:border-white/10 dark:bg-[#0E1424] dark:hover:border-indigo-400/40 dark:hover:shadow-black/30 ${big ? "flex-col items-start p-6" : "p-4"} ${ring}`}>
      <span className={`grid shrink-0 place-items-center rounded-xl bg-indigo-50 text-indigo-600 transition group-hover:bg-indigo-600 group-hover:text-white dark:bg-indigo-400/10 dark:text-indigo-300 ${big ? "h-12 w-12" : "h-10 w-10"}`}><c.icon aria-hidden className="h-5 w-5" /></span>
      <span className="min-w-0">
        <span className="block text-sm text-slate-500 dark:text-slate-400">{tx(c.label)}</span>
        <span dir={c.ltr ? "ltr" : undefined} className={`block font-display font-semibold text-slate-900 dark:text-white ${big ? "mt-1 text-lg" : ""}`}>{c.ltr ? c.value : tx(c.value)}</span>
        <span className="mt-0.5 block text-sm text-slate-500 dark:text-slate-400">{tx(c.note)}</span>
      </span>
    </a>
  );
}

export function OfficeCard({ className = "" }: { className?: string }) {
  const tx = useT();
  return (
    <div className={`${card} p-6 ${className}`}>
      <div className="flex items-start gap-3">
        <MapPin aria-hidden className="mt-0.5 h-5 w-5 shrink-0 text-indigo-600 dark:text-indigo-400" />
        <div>
          <p className="font-display font-semibold text-slate-900 dark:text-white">{tx(contact.city)}</p>
          <p className="mt-1 text-slate-600 dark:text-slate-400">{tx(contact.address)}</p>
        </div>
      </div>
      <div className="mt-4 flex items-start gap-3">
        <Clock aria-hidden className="mt-0.5 h-5 w-5 shrink-0 text-indigo-600 dark:text-indigo-400" />
        <p className="text-slate-600 dark:text-slate-400">{tx("Support answers every day, around the clock.")}</p>
      </div>
    </div>
  );
}

// The contact form. `live` posts to api/v1/storefront/contact (Laravel StorefrontContactController: same rules as the
// old Blade form — name, email, 11-digit mobile, subject, message up to 300 characters — plus captcha); without it
// (the /design gallery) sending only shows the thank-you state.
const latinDigits = (v: string) => v.replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 0x06f0)).replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660));

export function ContactForm({ topic, compact = false, live = false }: { topic?: string; compact?: boolean; live?: boolean }) {
  const tx = useT();
  const captcha = useCaptcha("contact"); // admin › Captcha; checked by the backend
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [failed, setFailed] = useState("");
  const [subject, setSubject] = useState(topic ?? contactTopics[0].id);
  const [f, setF] = useState({ name: "", mobile: "", email: "", message: "", website: "" });
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setF({ ...f, [k]: e.target.value });
  const mobile = latinDigits(f.mobile).replace(/\D/g, "");
  const mobileBad = f.mobile !== "" && !/^09\d{9}$/.test(mobile);
  const reset = () => { setSent(false); setF({ name: "", mobile: "", email: "", message: "", website: "" }); };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mobileBad) return document.getElementById("cf-mobile")?.focus();
    if (!live) return setSent(true);
    setSending(true); setFailed("");
    const label = contactTopics.find((t) => t.id === (topic ?? subject))!.label;
    captcha.fields()
      .then((extra) => fetch("/api/v1/storefront/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ name: f.name.trim(), email: f.email.trim(), mobile, subject: tx(label), message: f.message.trim(), website: f.website, ...extra }),
      }))
      .then(async (r) => {
        const body = await r.json().catch(() => null) as { success?: boolean; message?: string; code?: string; errors?: Record<string, string[]>; data?: Record<string, unknown> | null } | null;
        if (r.ok && body?.success) { setSent(true); captcha.used(); }
        else if (captcha.handle(body?.code, body?.data)) setFailed(tx(CAPTCHA_MESSAGES[body!.code!]));
        else {
          captcha.used(); // a number picture is good for one try
          const first = body?.errors && Object.values(body.errors)[0]?.[0];
          setFailed(r.status === 429 ? tx("Too many messages in a short time. Please try again in a minute.") : first || body?.message || tx("Your message couldn't be sent. Please try again."));
        }
      })
      .catch(() => setFailed(tx("Your message couldn't be sent. Please try again.")))
      .finally(() => setSending(false));
  };

  if (sent) return (
    <div role="status" className="animate-pop py-10 text-center">
      <CheckCircle2 aria-hidden className="mx-auto h-12 w-12 text-emerald-600 dark:text-emerald-400" />
      <p className="mt-4 font-display text-xl font-bold text-slate-900 dark:text-white">{tx("Thanks, your message reached us.")}</p>
      <p className="mt-2 text-slate-600 dark:text-slate-400">{tx("We'll get back to you soon by phone or email.")}</p>
      <button type="button" onClick={reset} className={`mt-6 text-sm font-semibold text-indigo-600 dark:text-indigo-400 ${ring}`}>{tx("Send another message")}</button>
    </div>
  );
  const label = "mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300";
  return (
    <form onSubmit={submit} className="relative space-y-4">
      {topic === undefined && (
        <fieldset>
          <legend className={label}>{tx("What is it about?")}</legend>
          <div className="flex flex-wrap gap-2">
            {contactTopics.map((t) => (
              <button key={t.id} type="button" aria-pressed={subject === t.id} onClick={() => setSubject(t.id)}
                className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm transition ${subject === t.id ? "border-indigo-600 bg-indigo-600 text-white" : "border-slate-300 text-slate-700 hover:border-slate-500 dark:border-white/20 dark:text-slate-300"} ${ring}`}>
                <t.icon aria-hidden className="h-4 w-4" />{tx(t.label)}
              </button>
            ))}
          </div>
        </fieldset>
      )}
      <div className={`grid gap-4 ${compact ? "" : "sm:grid-cols-2"}`}>
        <label className="block"><span className={label}>{tx("Your name")}</span><input required minLength={3} maxLength={50} autoComplete="name" value={f.name} onChange={set("name")} className={field} /></label>
        <label className="block">
          <span className={label}>{tx("Mobile number")}</span>
          <input id="cf-mobile" required dir="ltr" inputMode="numeric" maxLength={11} placeholder="09xxxxxxxxx" autoComplete="tel" value={f.mobile} onChange={set("mobile")} aria-invalid={mobileBad} aria-describedby={mobileBad ? "cf-mobile-e" : undefined} className={`${field} ${mobileBad ? "!border-red-700 dark:!border-red-400" : ""}`} />
          {mobileBad && <span id="cf-mobile-e" className="mt-1 block text-sm font-semibold text-red-700 dark:text-red-400">{tx("11 digits, starting with 09.")}</span>}
        </label>
      </div>
      <label className="block"><span className={label}>{tx("Email")}</span><input required type="email" dir="ltr" maxLength={50} autoComplete="email" value={f.email} onChange={set("email")} className={field} /></label>
      <label className="block">
        <span className={`${label} flex justify-between`}><span>{tx("Your message")}</span><span className="font-normal text-slate-400">{f.message.length}/300</span></span>
        <textarea required minLength={3} maxLength={300} rows={compact ? 4 : 5} value={f.message} onChange={set("message")} placeholder={tx("Tell us what happened; an order number helps.")} className={`${field} resize-none`} />
      </label>
      {live && <CaptchaField captcha={captcha} />}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden value={f.website} onChange={set("website")} className="pointer-events-none absolute start-0 top-0 h-px w-px overflow-hidden opacity-0 [clip-path:inset(50%)]" />
      {failed && <p role="alert" className="text-[15px] font-semibold text-red-700 dark:text-red-400">{failed}</p>}
      <button type="submit" disabled={sending} className={`${btn} w-full sm:w-auto`}><Send aria-hidden className="h-4 w-4 rtl:-scale-x-100" />{tx(sending ? "Sending…" : "Send message")}</button>
    </form>
  );
}

export function SearchBox({ q, setQ, big = false }: { q: string; setQ: (v: string) => void; big?: boolean }) {
  const tx = useT();
  return (
    <div className={`relative ${big ? "mx-auto mt-8 max-w-2xl" : ""}`}>
      <Search aria-hidden className={`pointer-events-none absolute start-4 top-1/2 -translate-y-1/2 text-slate-400 ${big ? "h-5 w-5" : "h-4 w-4"}`} />
      <input type="search" value={q} onChange={(e) => setQ(e.target.value)} aria-label={tx("Search the questions")} placeholder={tx("Search the questions")}
        className={`${field} ${big ? "rounded-2xl py-4 ps-12 text-lg shadow-sm" : "ps-10"}`} />
      {q && <button type="button" onClick={() => setQ("")} aria-label={tx("Clear")} className={`absolute end-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 hover:text-slate-700 ${ring}`}><X className="h-4 w-4" /></button>}
    </div>
  );
}

// Highlights the search words inside a question or answer.
export function Mark({ text, q }: { text: string; q: string }) {
  const w = q.trim();
  if (w.length < 2) return <>{text}</>;
  const parts = text.split(new RegExp(`(${w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi"));
  return <>{parts.map((p, i) => p.toLowerCase() === w.toLowerCase() ? <mark key={i} className="rounded bg-amber-200/70 px-0.5 text-inherit dark:bg-amber-400/30">{p}</mark> : p)}</>;
}

export function StillStuck() {
  const tx = useT();
  return (
    <div className="mt-14 flex flex-col items-start justify-between gap-6 rounded-3xl bg-slate-900 p-7 text-white sm:flex-row sm:items-center dark:bg-white/5 dark:ring-1 dark:ring-white/10">
      <div>
        <p className="font-display text-xl font-bold">{tx("Didn't find your answer?")}</p>
        <p className="mt-1 text-slate-300">{tx("Message us; a real person answers, every day.")}</p>
      </div>
      <Link href="/contact-us" className={`inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-slate-900 transition hover:bg-slate-200 ${ring}`}>{tx("Contact us")}</Link>
    </div>
  );
}

// The gallery is English; these offers open in Persian (the site's own language) with a switch, like the verify offers.
export function inLanguage<P extends object>(C: ComponentType<P>) {
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
