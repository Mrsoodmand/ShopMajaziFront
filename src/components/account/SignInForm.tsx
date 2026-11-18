"use client";

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { ArrowRight, Loader2, KeyRound, MessageSquareText, Pencil } from "lucide-react";
import { accountApi, ApiError, useAccount, type AccountUser } from "@/lib/account";
import { CaptchaField, useCaptcha } from "@/lib/captcha";
import { useT } from "@/i18n/client";
import { errorText } from "./errors";
import WordReveal from "@/components/ui/WordReveal";

type Me = { authenticated: boolean; user: AccountUser | null; wallet: number };
type Started = { mobile: string; exists: boolean; resend_in?: number; dev_code?: string };
type Step = "mobile" | "password" | "code" | "register";

const field = "w-full rounded-2xl bg-white px-4 py-3.5 text-base text-slate-900 ring-1 ring-slate-200 transition placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-white/5 dark:text-white dark:ring-white/10";
const primary = "flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 py-3.5 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50";
const link = "text-sm font-semibold text-indigo-600 hover:underline disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:no-underline dark:text-indigo-300";

// Sign in or sign up with a mobile number, in one form:
//   mobile → existing account: password (or a one-time code by SMS) · new number: SMS code + name + password.
// Used inside the checkout modal and on /login. `onDone` runs once signed in.
export default function SignInForm({ onDone, heading = true }: { onDone?: () => void; heading?: boolean }) {
  const t = useT();
  const account = useAccount();
  const [step, setStep] = useState<Step>("mobile");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [devCode, setDevCode] = useState<string | null>(null);
  const [resendAt, setResendAt] = useState(0);
  const focusRef = useRef<HTMLInputElement>(null);
  // Captcha (admin › Captcha): asked once; the backend's session lets the next steps through without it.
  const captcha = useCaptcha("login", { session: true });
  useEffect(() => { focusRef.current?.focus(); }, [step]);

  const run = async (work: () => Promise<void>) => {
    setBusy(true); setError(null);
    try { await work(); captcha.used(); } catch (e) {
      if (e instanceof ApiError) captcha.handle(e.code, e.data);
      setError(errorText(e, t));
    } finally { setBusy(false); }
  };
  const codeSent = (r: Started) => { setDevCode(r.dev_code ?? null); setResendAt(Date.now() + (r.resend_in ?? 120) * 1000); setCode(""); };
  const finish = (me: Me) => { account.signedIn(me); onDone?.(); };

  const submitMobile = (e: FormEvent) => { e.preventDefault(); run(async () => {
    const r = await accountApi<Started>("start", { mobile: latin(mobile), ...(await captcha.fields()) });
    setMobile(r.mobile);
    if (r.exists) setStep("password"); else { codeSent(r); setStep("register"); }
  }); };
  const sendCode = () => run(async () => { codeSent(await accountApi<Started>("code", { mobile, ...(await captcha.fields()) })); if (step === "password") setStep("code"); });
  const submitPassword = (e: FormEvent) => { e.preventDefault(); run(async () => finish(await accountApi<Me>("login", { mobile, password, ...(await captcha.fields()) }))); };
  const submitCode = (e: FormEvent) => { e.preventDefault(); run(async () => finish(await accountApi<Me>("login", { mobile, code: latin(code), ...(await captcha.fields()) }))); };
  const submitRegister = (e: FormEvent) => { e.preventDefault(); run(async () => finish(await accountApi<Me>("register", { mobile, code: latin(code), name, password, email, ...(await captcha.fields()) }))); };
  const changeNumber = () => { setStep("mobile"); setError(null); setPassword(""); setCode(""); setDevCode(null); };

  const titles: Record<Step, [string, string]> = {
    mobile: [t("Sign in or create an account"), t("Enter your mobile number. New here? We'll text you a code to create your account.")],
    password: [t("Welcome back"), t("Enter your password to sign in.")],
    code: [t("Enter the code"), t("We texted a one-time code to your number.")],
    register: [t("Create your account"), t("We texted a code to your number. Add your name and a password to finish.")],
  };

  return (
    <div key={step} className="animate-step-in">
      {heading && (
        <div className="mb-5">
          <h2 className="font-display text-xl font-semibold text-slate-900 dark:text-white"><WordReveal text={titles[step][0]} step={60} /></h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400"><WordReveal text={titles[step][1]} delay={200} step={25} /></p>
        </div>
      )}

      {step !== "mobile" && (
        <div className="mb-4 flex items-center justify-between gap-3 rounded-2xl bg-slate-50 px-4 py-3 text-sm dark:bg-white/5">
          <span className="text-slate-500 dark:text-slate-400">{t("Mobile")}{" "}<b dir="ltr" className="font-mono text-slate-900 dark:text-white">{t.locale === "fa" ? mobile.replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[+d]) : mobile}</b></span>
          <button type="button" onClick={changeNumber} className={`flex items-center gap-1 ${link}`}><Pencil className="h-3.5 w-3.5" />{t("Change")}</button>
        </div>
      )}

      {step === "mobile" && (
        <form onSubmit={submitMobile} className="space-y-3">
          <Label text={t("Mobile number")}>
            <input ref={focusRef} type="tel" inputMode="numeric" autoComplete="tel" dir="ltr" required maxLength={14} value={mobile} onChange={(e) => setMobile(digitsOnly(e.target.value))} placeholder="09123456789" className={`${field} text-start font-mono`} />
          </Label>
          <CaptchaField captcha={captcha} />
          <Submit busy={busy} label={t("Continue")} />
        </form>
      )}

      {step === "password" && (
        <form onSubmit={submitPassword} className="space-y-3">
          <Label text={t("Password")}>
            <input ref={focusRef} type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} className={field} />
          </Label>
          <CaptchaField captcha={captcha} />
          <Submit busy={busy} label={t("Sign in")} icon={KeyRound} />
          <button type="button" onClick={sendCode} disabled={busy} className={`mx-auto flex items-center gap-1.5 ${link}`}><MessageSquareText className="h-4 w-4" />{t("Sign in with a code by SMS instead")}</button>
        </form>
      )}

      {step === "code" && (
        <form onSubmit={submitCode} className="space-y-3">
          <CodeInput inputRef={focusRef} value={code} onChange={setCode} label={t("Code from the SMS")} />
          <DevCode code={devCode} />
          <CaptchaField captcha={captcha} />
          <Submit busy={busy} label={t("Sign in")} />
          <Resend at={resendAt} onResend={sendCode} busy={busy} />
        </form>
      )}

      {step === "register" && (
        <form onSubmit={submitRegister} className="space-y-3">
          <CodeInput inputRef={focusRef} value={code} onChange={setCode} label={t("Code from the SMS")} />
          <DevCode code={devCode} />
          <Label text={t("Full name")}><input type="text" autoComplete="name" required minLength={3} maxLength={40} value={name} onChange={(e) => setName(e.target.value)} className={field} /></Label>
          <Label text={t("Password")} hint={t("6 to 30 characters")}><input type="password" autoComplete="new-password" required minLength={6} maxLength={30} value={password} onChange={(e) => setPassword(e.target.value)} className={field} /></Label>
          <Label text={t("Email")} hint={t("Optional")}><input type="email" autoComplete="email" dir="ltr" value={email} onChange={(e) => setEmail(e.target.value)} className={`${field} text-start`} /></Label>
          <CaptchaField captcha={captcha} />
          <Submit busy={busy} label={t("Create account")} />
          <Resend at={resendAt} onResend={sendCode} busy={busy} />
        </form>
      )}

      {error && <p role="alert" className="mt-3 rounded-xl bg-rose-50 px-3 py-2.5 text-sm text-rose-700 dark:bg-rose-500/10 dark:text-rose-300">{error}</p>}
    </div>
  );
}

function Label({ text, hint, children }: { text: string; hint?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-baseline justify-between px-1 text-sm font-medium text-slate-700 dark:text-slate-300">{text}{hint && <span className="text-xs font-normal text-slate-400">{hint}</span>}</span>
      {children}
    </label>
  );
}

function Submit({ busy, label, icon: Icon = ArrowRight }: { busy: boolean; label: string; icon?: typeof ArrowRight }) {
  return (
    <button type="submit" disabled={busy} className={primary}>
      {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}{label}{!busy && <Icon className={`h-4 w-4 ${Icon === ArrowRight ? "rtl:rotate-180" : ""}`} />}
    </button>
  );
}

// Only digits: English 0-9, Persian ۰-۹ and Arabic ٠-٩ (some Persian keyboards type these). Anything else typed or
// pasted (spaces, dashes, "+", letters) is dropped as it comes in; the backend turns the digits into 09xxxxxxxxx.
const digitsOnly = (v: string) => v.replace(/[^0-9۰-۹٠-٩]/g, "");
// What is sent to the server: the same digits in English.
const latin = (v: string) => v.replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 0x06f0)).replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660));

function CodeInput({ value, onChange, label, inputRef }: { value: string; onChange: (v: string) => void; label: string; inputRef: React.RefObject<HTMLInputElement | null> }) {
  return (
    <Label text={label}>
      <input ref={inputRef} type="text" inputMode="numeric" autoComplete="one-time-code" dir="ltr" required maxLength={8} value={value}
        onChange={(e) => onChange(digitsOnly(e.target.value))} className={`${field} text-center font-mono text-xl tracking-[0.4em]`} />
    </Label>
  );
}

// Seconds until another code can be requested, then a "Send a new code" link.
function Resend({ at, onResend, busy }: { at: number; onResend: () => void; busy: boolean }) {
  const t = useT();
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => { const i = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(i); }, []);
  const left = Math.ceil((at - now) / 1000);
  if (left > 0) {
    const mmss = `${Math.floor(left / 60)}:${String(left % 60).padStart(2, "0")}`;
    return <p className="text-center text-sm text-slate-500 dark:text-slate-400">{t("New code in {time}", { time: mmss })}</p>;
  }
  return <button type="button" onClick={onResend} disabled={busy} className={`mx-auto block ${link}`}>{t("Send a new code")}</button>;
}

// Local development only: the backend fakes SMS and hands the code over (see DevFakeProviders on the backend).
function DevCode({ code }: { code: string | null }) {
  if (!code) return null;
  return <p className="rounded-xl bg-amber-50 px-3 py-2 text-center text-xs text-amber-800 dark:bg-amber-500/10 dark:text-amber-300">Dev: SMS is faked locally. Code <b className="font-mono">{code}</b></p>;
}
