"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { RefreshCw } from "lucide-react";
import { useT } from "@/i18n/client";

// Captcha for the public forms (comments, sign-in / sign-up). The backend decides the mode (admin › Captcha,
// App\Services\Captcha) and checks every submit; this hook only fetches the mode, gets a Google reCAPTCHA v3 token
// or shows the number picture, and adds the fields to the request:
//   google → captcha_token · number → captcha_id + captcha_answer · off → nothing.
// When Google's script can't load (it is filtered on some networks) or the backend asks for it, the form switches
// to the number picture. Any captcha_* error from the backend carries the current mode, so a page left open while
// an admin changes it catches up on the next submit.

type Driver = "off" | "google" | "number";
export type CaptchaConfig = { driver: Driver; site_key: string | null; fallback: boolean };
type Challenge = { id: string; image: string };
type Mode = Driver | "passed" | null; // passed: solved once in this session; the backend lets the next few through

// English here, Persian in i18n/fa/account.ts. Keys are the backend's error codes.
export const CAPTCHA_MESSAGES: Record<string, string> = {
  captcha_required: "Type the numbers in the picture.",
  captcha_invalid: "The numbers didn't match, or the picture expired. Type the new ones.",
  captcha_number: "To continue, type the numbers in the picture.",
  captcha_failed: "The security check didn't pass. Refresh the page and try again.",
};
export const isCaptchaCode = (code: string | undefined | null): code is string => !!code && code in CAPTCHA_MESSAGES;

const OFF: CaptchaConfig = { driver: "off", site_key: null, fallback: false };
let configLoad: Promise<CaptchaConfig> | null = null;
function loadConfig(): Promise<CaptchaConfig> {
  configLoad ??= fetch("/api/v1/storefront/captcha", { cache: "no-store", headers: { Accept: "application/json" } })
    .then((r) => r.json())
    .then((j: { data?: CaptchaConfig }) => j.data ?? OFF)
    // Unknown: send nothing; if the backend wants a captcha, its answer says which and the form adapts.
    .catch(() => { configLoad = null; return OFF; });
  return configLoad;
}

type Grecaptcha = { ready: (cb: () => void) => void; execute: (key: string, opts: { action: string }) => Promise<string> };
declare global { interface Window { grecaptcha?: Grecaptcha } }

const googleLoads = new Map<string, Promise<Grecaptcha>>();
function loadGoogle(siteKey: string): Promise<Grecaptcha> {
  let p = googleLoads.get(siteKey);
  if (p) return p;
  p = new Promise<Grecaptcha>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("timeout")), 8000);
    const done = () => window.grecaptcha!.ready(() => { clearTimeout(timer); resolve(window.grecaptcha!); });
    if (window.grecaptcha) return done();
    // The forms show Google's notice instead of the floating badge (allowed by Google's terms).
    const style = document.createElement("style");
    style.textContent = ".grecaptcha-badge{visibility:hidden}";
    document.head.appendChild(style);
    const s = document.createElement("script");
    // recaptcha.net: Google's own mirror, reachable where www.google.com is filtered.
    s.src = `https://www.recaptcha.net/recaptcha/api.js?render=${encodeURIComponent(siteKey)}`;
    s.async = true;
    s.onload = done;
    s.onerror = () => { clearTimeout(timer); reject(new Error("load")); };
    document.head.appendChild(s);
  });
  p.catch(() => googleLoads.delete(siteKey));
  googleLoads.set(siteKey, p);
  return p;
}

export type Captcha = {
  mode: Mode;
  challenge: Challenge | null;
  answer: string;
  setAnswer: (v: string) => void;
  refresh: () => void;
  loading: boolean;
  /** The fields to add to the request body. */
  fields: () => Promise<Record<string, string>>;
  /** Call with the backend's error code (and data); true when it was a captcha error and the form has adapted. */
  handle: (code: string | undefined | null, data?: Record<string, unknown> | null) => boolean;
  /** Call after the request went through. */
  used: () => void;
};

/**
 * @param action reCAPTCHA v3 action; must match the backend route's `captcha:<action>` (comment, login, contact).
 * @param session true for forms in the Laravel session (sign-in): once solved, the next few steps pass without it.
 */
export function useCaptcha(action: string, { session = false }: { session?: boolean } = {}): Captcha {
  const [config, setConfig] = useState<CaptchaConfig | null>(null);
  const [mode, setMode] = useState<Mode>(null);
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [broken, setBroken] = useState(false); // the picture didn't load; wait for "New picture" instead of retrying
  const google = useRef<Grecaptcha | null>(null);

  const refresh = useCallback(() => {
    setLoading(true);
    setBroken(false);
    setAnswer("");
    fetch("/api/v1/storefront/captcha/number", { cache: "no-store", headers: { Accept: "application/json" } })
      .then((r) => r.json())
      .then((j: { data?: Challenge }) => { setChallenge(j.data ?? null); setBroken(!j.data); })
      .catch(() => { setChallenge(null); setBroken(true); })
      .finally(() => setLoading(false));
  }, []);

  const apply = useCallback((c: CaptchaConfig) => {
    setConfig(c);
    if (c.driver === "google" && c.site_key) {
      setMode("google");
      loadGoogle(c.site_key).then((g) => { google.current = g; }).catch(() => { if (c.fallback) setMode("number"); });
    } else {
      setMode(c.driver);
    }
  }, []);

  useEffect(() => { loadConfig().then(apply); }, [apply]);
  useEffect(() => { if (mode === "number" && !challenge && !loading && !broken) refresh(); }, [mode, challenge, loading, broken, refresh]);

  const fields = useCallback(async (): Promise<Record<string, string>> => {
    if (mode === "number") return challenge ? { captcha_id: challenge.id, captcha_answer: latin(answer.trim()) } : {};
    if (mode === "google" && config?.site_key) {
      try {
        const g = google.current ?? await loadGoogle(config.site_key);
        return { captcha_token: await g.execute(config.site_key, { action }) };
      } catch { return {}; } // the backend answers captcha_number (fallback on) and the form shows the picture
    }
    return {};
  }, [mode, challenge, answer, config, action]);

  const handle = useCallback((code: string | undefined | null, data?: Record<string, unknown> | null) => {
    if (!isCaptchaCode(code)) return false;
    const fresh = data?.captcha as CaptchaConfig | undefined;
    if (fresh) { configLoad = Promise.resolve(fresh); setConfig(fresh); }
    const driver = fresh?.driver ?? config?.driver;
    if (code === "captcha_number" || driver === "number") {
      setMode("number");
      refresh(); // a picture is good for one try
    } else if (fresh) {
      apply(fresh);
    }
    return true;
  }, [config, refresh, apply]);

  const used = useCallback(() => {
    if (mode !== "number") return;
    if (session) { setMode("passed"); setChallenge(null); setAnswer(""); } else refresh();
  }, [mode, session, refresh]);

  return { mode, challenge, answer, setAnswer, refresh, loading, fields, handle, used };
}

const latin = (v: string) => v.replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 0x06f0)).replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660));

/** The number picture with its answer field, or Google's notice; nothing when the captcha is off. */
export function CaptchaField({ captcha, className = "" }: { captcha: Captcha; className?: string }) {
  const t = useT();
  if (captcha.mode === "google") {
    return (
      <p className={`text-xs leading-5 text-slate-500 dark:text-slate-400 ${className}`}>
        {t("Protected by Google reCAPTCHA.")}{" "}
        <a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer" className="underline">{t("Privacy")}</a>{" · "}
        <a href="https://policies.google.com/terms" target="_blank" rel="noreferrer" className="underline">{t("Terms")}</a>
      </p>
    );
  }
  if (captcha.mode !== "number") return null;
  return (
    <div className={className}>
      <label className="block">
        <span className="mb-1.5 block px-1 text-sm font-medium text-slate-700 dark:text-slate-300">{t("Type the numbers in the picture")}</span>
        <span className="flex items-stretch gap-2">
          <span className="flex h-14 w-[176px] shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-slate-50 ring-1 ring-slate-200 dark:ring-white/10">
            {captcha.challenge
              ? <img src={captcha.challenge.image} alt={t("Security code picture")} width={176} height={56} className="h-14 w-[176px] select-none" draggable={false} />
              : <span className="text-xs text-slate-400">{captcha.loading ? "…" : t("Picture unavailable")}</span>}
          </span>
          <input type="text" inputMode="numeric" autoComplete="off" dir="ltr" required maxLength={5} value={captcha.answer}
            onChange={(e) => captcha.setAnswer(e.target.value.replace(/[^0-9۰-۹٠-٩]/g, ""))}
            className="w-full min-w-0 rounded-2xl bg-white px-3 text-center font-mono text-lg tracking-[0.3em] text-slate-900 ring-1 ring-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-white/5 dark:text-white dark:ring-white/10" />
        </span>
      </label>
      <button type="button" onClick={captcha.refresh} disabled={captcha.loading}
        className="mt-1.5 flex items-center gap-1.5 px-1 text-xs font-semibold text-indigo-600 hover:underline disabled:opacity-50 dark:text-indigo-300">
        <RefreshCw aria-hidden className={`h-3.5 w-3.5 ${captcha.loading ? "animate-spin" : ""}`} />{t("New picture")}
      </button>
    </div>
  );
}
