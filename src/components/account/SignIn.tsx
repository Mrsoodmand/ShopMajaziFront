"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Check, LockKeyhole, X } from "lucide-react";
import dynamic from "next/dynamic";
import WordReveal from "@/components/ui/WordReveal";
import { Logo } from "@/design/header/shared";
import { useAccount } from "@/lib/account";
import { useT } from "@/i18n/client";

// Signing in, design H "Trust Split · Glow" (/design/page-signin, chosen 2026-11-15): a deep indigo panel with the
// site's faint grid drifting under a slow glow, a floating lock, the headline and four promises arriving one by one;
// the form beside it. Used by /login (app/login/LoginView) and by the popup the header opens (SignInPopupProvider),
// so signing in never leaves the page you're on. Motion stops under prefers-reduced-motion (globals.css).

const indigo = "bg-[#1e1b4b] dark:bg-[#15123a]";

// The form's code (sign-in steps, captcha, SMS code) loads when it is first shown: the popup is in every page's
// layout but renders the form only while open, so pages don't download it up front. /login still renders it on
// the server.
const SignInForm = dynamic(() => import("./SignInForm"));

function useChips() {
  const t = useT();
  return [t("Delivered in seconds"), t("Money back to your wallet"), t("Support around the clock"), t("Registered with Enamad")];
}

// The grid and the two glows behind the panel.
function Backdrop({ small = false }: { small?: boolean }) {
  return (
    <>
      <div aria-hidden className="pointer-events-none absolute inset-0 animate-grid-pan bg-[linear-gradient(to_right,rgba(255,255,255,.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,.06)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_top,black,transparent_75%)]" />
      <div aria-hidden className={`pointer-events-none absolute start-1/2 -translate-x-1/2 animate-glow-a rounded-full bg-indigo-400/30 blur-3xl ${small ? "-top-16 h-48 w-48" : "-top-24 h-72 w-72"}`} />
      {!small && <div aria-hidden className="pointer-events-none absolute -bottom-24 -start-16 h-64 w-64 animate-glow-b rounded-full bg-violet-500/20 blur-3xl" />}
    </>
  );
}

// Promises as chips, each arriving a beat after the one before.
function Chips({ items, small = false }: { items: string[]; small?: boolean }) {
  return (
    <ul className={`flex flex-wrap ${small ? "gap-1.5" : "gap-2"}`}>
      {items.map((c, i) => (
        <li key={c} style={{ animationDelay: `${(small ? 450 : 1000) + i * 110}ms` }}
          className={`inline-flex animate-fade-up items-center gap-1.5 rounded-full bg-white/10 text-white ring-1 ring-white/15 ${small ? "px-2.5 py-1 text-xs" : "px-3 py-1.5 text-sm"}`}>
          <Check aria-hidden className={`text-emerald-300 ${small ? "h-3 w-3" : "h-3.5 w-3.5"}`} />{c}
        </li>
      ))}
    </ul>
  );
}

// The panel beside the form on /login (wide screens).
export function SignInPanel() {
  const t = useT();
  return (
    <aside className={`relative hidden flex-col justify-between gap-10 overflow-hidden p-10 lg:flex ${indigo}`}>
      <Backdrop />
      <div className="relative"><Logo dark /></div>
      <div className="relative">
        <span className="grid h-14 w-14 animate-float place-items-center rounded-2xl bg-white/10 ring-1 ring-white/20 [animation-duration:5s]"><LockKeyhole aria-hidden className="h-7 w-7 text-white" /></span>
        <h1 className="mt-6 font-display text-3xl font-bold leading-tight text-white"><WordReveal text={t("Your orders, codes and wallet in one place")} delay={150} step={70} /></h1>
        <p className="mt-3 text-indigo-200"><WordReveal text={t("Sign in once and everything you buy waits here.")} delay={650} step={35} /></p>
        <div className="mt-6"><Chips items={useChips()} /></div>
      </div>
      <span />
    </aside>
  );
}

// The /login card: panel and form; `onDone` runs once signed in.
export function SignInCard({ onDone }: { onDone?: () => void }) {
  return (
    <div className="grid animate-fade-up overflow-hidden rounded-[2rem] bg-white shadow-xl shadow-slate-900/5 ring-1 ring-slate-200 lg:grid-cols-[1fr_1.1fr] dark:bg-[#0E1424] dark:ring-white/10">
      <SignInPanel />
      <div className="p-6 sm:p-10"><SignInForm onDone={onDone} /></div>
    </div>
  );
}

// The popup's head: logo, glow and two promises.
export function SignInStrip() {
  const chips = useChips();
  return (
    <div className={`relative overflow-hidden rounded-t-[2rem] px-6 pb-6 pt-7 sm:px-8 ${indigo}`}>
      <Backdrop small />
      <div className="relative"><Logo dark /></div>
      <p className="relative mt-3 font-display text-lg font-semibold leading-snug text-white"><WordReveal text={useT()("Your orders, codes and wallet in one place")} delay={120} step={60} /></p>
      <div className="relative mt-3"><Chips small items={chips.slice(0, 2)} /></div>
    </div>
  );
}

// ---------- The popup shell: centered on desktop, a bottom sheet on phones; Escape or the backdrop closes it ----------

export function SignInDialog({ open, onClose, children, label, wide = false }: { open: boolean; onClose: () => void; children: ReactNode; label: string; wide?: boolean }) {
  const t = useT();
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const back = document.activeElement as HTMLElement | null;
    const k = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      // Keep Tab inside the popup.
      if (e.key === "Tab" && box.current) {
        const items = [...box.current.querySelectorAll<HTMLElement>("a[href],button:not([disabled]),input:not([disabled]),[tabindex]:not([tabindex='-1'])")];
        const first = items[0], last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last?.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus(); }
      }
    };
    document.addEventListener("keydown", k);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", k); document.body.style.overflow = overflow; back?.focus?.(); };
  }, [open, onClose]);
  return (
    <div className={`fixed inset-0 z-[80] ${open ? "" : "pointer-events-none"}`} aria-hidden={!open} inert={!open}>
      <div onClick={onClose} className={`absolute inset-0 bg-slate-950/55 backdrop-blur-sm transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`} />
      <div ref={box} role="dialog" aria-modal="true" aria-label={label}
        className={`absolute inset-x-0 bottom-0 max-h-[92dvh] overflow-y-auto rounded-t-[2rem] bg-white shadow-2xl transition duration-300 ease-[cubic-bezier(.16,1,.3,1)] sm:inset-x-auto sm:bottom-auto sm:start-1/2 sm:top-1/2 sm:w-full sm:-translate-y-1/2 sm:rounded-[2rem] ltr:sm:-translate-x-1/2 rtl:sm:translate-x-1/2 dark:bg-[#0E1424] dark:ring-1 dark:ring-white/10 ${wide ? "sm:max-w-3xl" : "sm:max-w-md"} ${open ? "translate-y-0 opacity-100 sm:scale-100" : "translate-y-10 opacity-0 sm:scale-95"}`}>
        <span aria-hidden className="absolute inset-x-0 top-2 z-10 mx-auto block h-1.5 w-10 rounded-full bg-white/40 sm:hidden" />
        <button type="button" onClick={onClose} aria-label={t("Close")} className="absolute end-4 top-4 z-10 grid h-9 w-9 place-items-center rounded-full text-white/70 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60">
          <X aria-hidden className="h-5 w-5" />
        </button>
        {open && children}
      </div>
    </div>
  );
}

// ---------- Opening the popup from anywhere (header button, phone menu) ----------

const Ctx = createContext<{ open: () => void } | null>(null);
export const useSignInPopup = () => useContext(Ctx);

export function SignInPopupProvider({ children }: { children: ReactNode }) {
  const t = useT();
  const account = useAccount();
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  // Signed in some other way (another tab, the checkout): nothing left to do here.
  useEffect(() => { if (account.status === "user") setOpen(false); }, [account.status]);
  const value = useMemo(() => ({ open: () => setOpen(true) }), []);
  return (
    <Ctx.Provider value={value}>
      {children}
      <SignInDialog open={open} onClose={close} label={t("Sign in or create an account")}>
        <SignInStrip />
        <div className="p-6 sm:p-8"><SignInForm onDone={close} /></div>
      </SignInDialog>
    </Ctx.Provider>
  );
}
