"use client";
import { Apple, Star } from "lucide-react";
import { useMoney } from "@/lib/money";
import { methodInfo, months } from "@/content/apple-en";
import { PageShell } from "../otp/parts";
import { AppleCheckout, AppleFaq, AppleOrderView, CompareTable, ContinueButton, CustomForm, ErrorSummary, H2, MethodRadios, Quantity, useApple, type AppleState } from "./parts";

// A card that previews the Apple ID: filled in live from the form for Custom, sample details for Ready.
function PreviewCard({ a }: { a: AppleState }) {
  const f = a.form;
  const custom = a.method === "custom";
  const name = custom ? [f.first, f.last].filter(Boolean).join(" ") || "Your name" : "Ready account";
  const email = custom ? f.email || "you@example.com" : "Provided after paying";
  const bday = custom && f.day && f.month && f.year ? `${months[Number(f.month) - 1]} ${f.day}, ${f.year}` : custom ? "Your birthday" : "Provided after paying";
  return (
    <figure aria-label="Preview of your Apple ID" className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-900 via-slate-800 to-sky-900 p-8 text-white shadow-2xl shadow-slate-900/20">
      <div aria-hidden className="absolute -end-10 -top-10 h-48 w-48 rounded-full bg-sky-400/25 blur-3xl" />
      <div className="relative flex items-center justify-between">
        <Apple aria-hidden className="h-9 w-9" />
        <span className="rounded-full bg-white/15 px-3 py-1 text-sm font-semibold">United States</span>
      </div>
      <dl className="relative mt-12 space-y-4">
        <div><dt className="text-sm text-white/70">Name</dt><dd className="font-display text-2xl font-semibold">{name}</dd></div>
        <div><dt className="text-sm text-white/70">Apple ID</dt><dd className="break-all font-mono text-lg">{email}</dd></div>
        <div><dt className="text-sm text-white/70">Date of birth</dt><dd className="text-lg">{bday}</dd></div>
      </dl>
      <figcaption className="relative mt-8 text-sm text-white/70">{custom ? "Fills in as you type." : `Delivered ${methodInfo.ready.delivery.toLowerCase()}.`}</figcaption>
    </figure>
  );
}

// Page D — "Live Preview": a product page. On the left, a card previews the Apple ID and fills in live as you type
// your details; on the right, title, rating, kind, the quantity or the form, and the buy button.
export default function AppleD({ method }: { method?: string }) {
  const usd = useMoney().format;
  const a = useApple(method === "custom" ? "custom" : "ready");
  if (a.order) return <PageShell><div className="px-6 py-14"><AppleOrderView a={a} /></div></PageShell>;

  return (
    <PageShell>
      <div className="mx-auto max-w-6xl px-6 pb-24 pt-14">
        <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)]">
          <div className="lg:sticky lg:top-24"><PreviewCard a={a} /></div>
          <div>
            <p className="text-sm font-semibold text-sky-800 dark:text-sky-300">Apple ID · United States</p>
            <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl dark:text-white">US Apple ID</h1>
            <p className="mt-3 flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <span aria-hidden className="flex text-amber-500">{Array.from({ length: 5 }, (_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}</span>
              4.9 out of 5 · 3,120 sold
            </p>
            <div className="mt-8"><MethodRadios a={a} details={false} /></div>
            <div key={a.method} className="mt-8 animate-fade-up space-y-6 [animation-duration:300ms]">
              {a.method === "custom" && <ErrorSummary a={a} />}
              {a.method === "ready" ? <Quantity a={a} /> : <CustomForm a={a} />}
            </div>
            <div aria-live="polite" className="mt-8 flex items-baseline justify-between border-t border-slate-200 pt-6 dark:border-white/10">
              <span className="text-slate-700 dark:text-slate-300">Total</span><span className="font-display text-3xl font-bold text-slate-900 dark:text-white">{usd(a.total)}</span>
            </div>
            <ContinueButton a={a} className="mt-5" />
          </div>
        </div>

        <section aria-labelledby="compare" className="mt-24"><H2 id="compare">Ready or custom?</H2><div className="mt-6"><CompareTable /></div></section>
        <section aria-labelledby="faq" className="mt-16 max-w-3xl"><H2 id="faq">Common questions</H2><div className="mt-6"><AppleFaq /></div></section>
      </div>
      <AppleCheckout a={a} />
    </PageShell>
  );
}
