"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { months } from "@/content/apple-en";
import { PageShell } from "../otp/parts";
import { primary, ring, secondary } from "../googleVoice/clean";
import { AppleCheckout, AppleFaq, AppleOrderView, AppleSummary, BirthdayField, ContinueButton, EmailField, H2, MethodRadios, NameFields, PasswordField, Quantity, useApple, type AppleState } from "./parts";

type Step = "kind" | "qty" | "name" | "email" | "birthday" | "password" | "review";
const flows: Record<AppleState["method"], Step[]> = {
  ready: ["kind", "qty", "review"],
  custom: ["kind", "name", "email", "birthday", "password", "review"],
};
const titles: Record<Step, string> = {
  kind: "Which Apple ID do you need?", qty: "How many?", name: "What's your name?", email: "What's your email address?",
  birthday: "When were you born?", password: "Choose a password", review: "Check your order",
};
// Which errors belong to each step, and the field to focus when one is wrong.
const stepErrors: Partial<Record<Step, { keys: ("first" | "last" | "email" | "birthday" | "password")[]; focus: string }>> = {
  name: { keys: ["first", "last"], focus: "apple-first" },
  email: { keys: ["email"], focus: "apple-email" },
  birthday: { keys: ["birthday"], focus: "apple-day" },
  password: { keys: ["password"], focus: "apple-password" },
};

// Page E — "Guided Steps": one question per screen with "Step 3 of 6" progress, for first-time buyers. Each answer is
// checked before moving on (focus goes to the field that needs fixing). The review screen lists every answer with a
// Change link, and Pay opens the payment window.
export default function AppleE({ method }: { method?: string }) {
  const a = useApple(method === "custom" ? "custom" : "ready");
  const [at, setAt] = useState(0);
  const steps = flows[a.method];
  const step = steps[Math.min(at, steps.length - 1)];
  const heading = useRef<HTMLHeadingElement>(null);
  const first = useRef(true);
  useEffect(() => { if (first.current) { first.current = false; return; } heading.current?.focus(); }, [at]);

  if (a.order) return <PageShell><div className="px-6 py-14"><AppleOrderView a={{ ...a, reset: () => { a.reset(); setAt(0); } }} /></div></PageShell>;

  const next = () => {
    const rule = stepErrors[step];
    if (rule) {
      rule.keys.forEach((k) => a.touch(k));
      if (rule.keys.some((k) => a.allErrors[k])) { document.getElementById(rule.focus)?.focus(); return; }
    }
    setAt(at + 1);
  };
  const goto = (s: Step) => setAt(steps.indexOf(s));
  const f = a.form;
  const answers: [Step, string, string][] = a.method === "custom" ? [
    ["name", "Name", `${f.first} ${f.last}`],
    ["email", "Email", f.email],
    ["birthday", "Date of birth", f.day && f.month && f.year ? `${months[Number(f.month) - 1]} ${f.day}, ${f.year}` : ""],
    ["password", "Password", f.password ? "Your own (hidden)" : "We'll create one"],
  ] : [];

  return (
    <PageShell>
      <div className="mx-auto max-w-2xl px-6 pb-24 pt-14">
        <p className="text-sm font-semibold text-sky-800 dark:text-sky-300">Apple ID · United States</p>
        <nav aria-label="Progress" className="mt-5">
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Step {at + 1} of {steps.length}</p>
          <div aria-hidden className="mt-2 flex gap-1.5">{steps.map((s, i) => <span key={s} className={`h-2 flex-1 rounded-full transition-colors duration-500 ${i <= at ? "bg-sky-700 dark:bg-sky-400" : "bg-slate-200 dark:bg-white/15"}`} />)}</div>
        </nav>

        <form key={`${a.method}-${step}`} noValidate onSubmit={(e) => { e.preventDefault(); if (step !== "review") next(); }} className="mt-8 animate-fade-up [animation-duration:300ms]">
          <h1 ref={heading} tabIndex={-1} className="font-display text-3xl font-bold tracking-tight text-slate-900 outline-none sm:text-4xl dark:text-white">{titles[step]}</h1>
          <div className="mt-6">
            {step === "kind" && <MethodRadios a={a} legend="Kind of Apple ID" hideLegend />}
            {step === "qty" && <Quantity a={a} />}
            {step === "name" && <NameFields a={a} cols={1} />}
            {step === "email" && <EmailField a={a} />}
            {step === "birthday" && <BirthdayField a={a} />}
            {step === "password" && <PasswordField a={a} />}
            {step === "review" && (
              <div className="space-y-6">
                {answers.length > 0 && (
                  <dl className="divide-y divide-slate-200 rounded-3xl border border-slate-200 bg-white px-5 dark:divide-white/10 dark:border-white/15 dark:bg-[#0E1424]">
                    {answers.map(([s, k, v]) => (
                      <div key={s} className="flex items-center justify-between gap-4 py-3.5">
                        <div className="min-w-0"><dt className="text-sm text-slate-600 dark:text-slate-400">{k}</dt><dd className="truncate font-medium text-slate-900 dark:text-white">{v}</dd></div>
                        <button type="button" onClick={() => goto(s)} className={`shrink-0 rounded-lg px-2.5 py-1.5 text-sm font-semibold text-sky-800 underline underline-offset-2 hover:bg-sky-50 dark:text-sky-300 dark:hover:bg-sky-500/10 ${ring}`}>Change<span className="sr-only"> {k.toLowerCase()}</span></button>
                      </div>
                    ))}
                  </dl>
                )}
                <AppleSummary a={a} title="Order summary"><ContinueButton a={a} className="mt-5" /></AppleSummary>
              </div>
            )}
          </div>

          <div className="mt-8 flex items-center justify-between gap-3">
            {at > 0 ? <button type="button" onClick={() => setAt(at - 1)} className={secondary}><ArrowLeft aria-hidden className="h-4 w-4 rtl:rotate-180" />Back</button> : <span />}
            {step !== "review" && (
              <div className="flex gap-3">
                {step === "password" && !f.password && <span className="sr-only">Password is optional.</span>}
                <button type="submit" className={primary}>{step === "password" && !f.password ? "Skip, create one for me" : "Continue"}</button>
              </div>
            )}
          </div>
        </form>

        <section aria-labelledby="faq" className="mt-24"><H2 id="faq">Common questions</H2><div className="mt-6"><AppleFaq /></div></section>
      </div>
      <AppleCheckout a={a} />
    </PageShell>
  );
}
