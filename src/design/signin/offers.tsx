"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Apple, BadgeCheck, Check, Clock, Headphones, Instagram, KeyRound, LockKeyhole, MessageSquareText, Phone, RotateCcw, Send, ShieldCheck, Smartphone, Wallet, X, Zap } from "lucide-react";
import SignInForm from "@/components/account/SignInForm";
import { SignInCard, SignInStrip } from "@/components/account/SignIn";
import LoginView from "@/app/login/LoginView";
import { PageShell } from "../otp/parts";
import { Logo as SiteLogo } from "../header/shared";
import { useT } from "@/i18n/client";

// Offers for signing in: the /login page and the popup the header opens instead of sending the visitor to /login.
// Every offer wraps the same working form (components/account/SignInForm: mobile → password, SMS code or sign-up);
// they differ in what surrounds it. "Preview popup" opens that offer's popup over the page.

// ---------- The popup shell: centered on desktop, a bottom sheet on phones; Escape or the backdrop closes it ----------

export function SignInDialog({ open, onClose, children, label, wide = false }: { open: boolean; onClose: () => void; children: ReactNode; label: string; wide?: boolean }) {
  const t = useT();
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const back = document.activeElement as HTMLElement | null;
    const k = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", k);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", k); document.body.style.overflow = ""; back?.focus?.(); };
  }, [open, onClose]);
  return (
    <div className={`fixed inset-0 z-[80] ${open ? "" : "pointer-events-none"}`} aria-hidden={!open} inert={!open}>
      <div onClick={onClose} className={`absolute inset-0 bg-slate-950/50 backdrop-blur-sm transition-opacity duration-200 ${open ? "opacity-100" : "opacity-0"}`} />
      <div ref={box} role="dialog" aria-modal="true" aria-label={label}
        className={`absolute inset-x-0 bottom-0 max-h-[92dvh] overflow-y-auto rounded-t-[2rem] bg-white shadow-2xl transition duration-300 ease-out sm:inset-x-auto sm:bottom-auto sm:start-1/2 sm:top-1/2 sm:w-full sm:-translate-y-1/2 sm:rounded-[2rem] ltr:sm:-translate-x-1/2 rtl:sm:translate-x-1/2 dark:bg-[#0E1424] dark:ring-1 dark:ring-white/10 ${wide ? "sm:max-w-3xl" : "sm:max-w-md"} ${open ? "translate-y-0 opacity-100 sm:scale-100" : "translate-y-8 opacity-0 sm:scale-95"}`}>
        <span aria-hidden className="absolute inset-x-0 top-2 z-10 mx-auto block h-1.5 w-10 rounded-full bg-slate-400/60 sm:hidden dark:bg-white/25" />
        <button type="button" onClick={onClose} aria-label={t("Close")} className="absolute end-4 top-4 z-10 grid h-9 w-9 place-items-center rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white">
          <X aria-hidden className="h-5 w-5" />
        </button>
        {open && children}
      </div>
    </div>
  );
}

// Gallery only: the button that opens the offer's popup, and the popup.
function WithPopup({ page, popup, wide }: { page: ReactNode; popup: (close: () => void) => ReactNode; wide?: boolean }) {
  const t = useT();
  const [open, setOpen] = useState(false);
  return (
    <>
      {page}
      <button type="button" onClick={() => setOpen(true)} className="fixed bottom-5 end-5 z-[60] rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-xl hover:bg-slate-800 dark:bg-white dark:text-slate-900">{t("Preview popup")}</button>
      <SignInDialog open={open} onClose={() => setOpen(false)} label={t("Sign in or create an account")} wide={wide}>{popup(() => setOpen(false))}</SignInDialog>
    </>
  );
}

// The site's chosen logo (design/logo → components/brand), as in the header.
const Logo = ({ className = "" }: { className?: string }) => <span className={`inline-flex ${className}`}><SiteLogo dark={className.includes("text-white")} /></span>;

// ---------- A · Trust Split: a deep indigo panel says why it's safe, the form beside it ----------

function TrustPoints({ dark = true }: { dark?: boolean }) {
  const t = useT();
  const points = [
    { Icon: Zap, title: t("Delivered in seconds"), text: t("Codes, numbers and logins show up in your account right away.") },
    { Icon: RotateCcw, title: t("Money back to your wallet"), text: t("If an order doesn't go through, the price comes back automatically.") },
    { Icon: Headphones, title: t("Support around the clock"), text: t("Real people answer tickets day and night.") },
  ];
  return (
    <ul className="space-y-5">
      {points.map(({ Icon, title, text }) => (
        <li key={title} className="flex gap-3">
          <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${dark ? "bg-white/10 text-white" : "bg-white text-indigo-700 shadow-sm ring-1 ring-indigo-100 dark:bg-indigo-400/10 dark:text-indigo-200 dark:ring-0"}`}><Icon aria-hidden className="h-5 w-5" /></span>
          <span><b className={`block ${dark ? "text-white" : "text-slate-900 dark:text-white"}`}>{title}</b><span className={`text-sm ${dark ? "text-indigo-200" : "text-slate-600 dark:text-slate-400"}`}>{text}</span></span>
        </li>
      ))}
    </ul>
  );
}

function PageA() {
  const t = useT();
  return (
    <PageShell>
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-16">
        <div className="grid overflow-hidden rounded-[2rem] bg-white shadow-xl shadow-slate-900/5 ring-1 ring-slate-200 lg:grid-cols-[1fr_1.1fr] dark:bg-[#0E1424] dark:ring-white/10">
          <aside className="relative hidden flex-col justify-between gap-10 bg-[#1e1b4b] p-10 text-white lg:flex dark:bg-[#15123a]">
            <Logo className="text-white" />
            <div>
              <h1 className="font-display text-3xl font-bold leading-tight">{t("Your orders, codes and wallet in one place")}</h1>
              <div className="mt-8"><TrustPoints /></div>
            </div>
            <p className="flex items-center gap-2 text-sm text-indigo-200"><BadgeCheck aria-hidden className="h-4 w-4" />{t("Registered with Enamad")}</p>
          </aside>
          <div className="p-6 sm:p-10"><SignInForm /></div>
        </div>
      </div>
    </PageShell>
  );
}
export const SignInA = () => (
  <WithPopup page={<PageA />} popup={() => (
    <div>
      <div className="rounded-t-[2rem] bg-[#1e1b4b] px-6 pb-5 pt-6 text-white sm:px-8 dark:bg-[#15123a]"><Logo className="text-white" /><p className="mt-2 text-sm text-indigo-200">{useT()("Your orders, codes and wallet in one place")}</p></div>
      <div className="p-6 sm:p-8"><SignInForm /></div>
    </div>
  )} />
);

// ---------- B · Quiet Card: one centered card on the page grid, the logo above, a three-step strip ----------

function Steps() {
  const t = useT();
  const steps = [{ Icon: Smartphone, label: t("Mobile number") }, { Icon: KeyRound, label: t("Password or SMS code") }, { Icon: Wallet, label: t("Your account") }];
  return (
    <ol className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
      {steps.map(({ Icon, label }, i) => (
        <li key={label} className="flex items-center gap-2">
          {i > 0 && <span aria-hidden className="h-px w-6 bg-slate-300 dark:bg-white/15" />}
          <Icon aria-hidden className="h-4 w-4" />{label}
        </li>
      ))}
    </ol>
  );
}

function PageB() {
  const t = useT();
  return (
    <PageShell>
      <div className="relative">
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(99,102,241,.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(99,102,241,.08)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
        <div className="relative mx-auto flex max-w-md flex-col items-center px-6 py-14 sm:py-20">
          <Logo className="text-slate-900 dark:text-white" />
          <div className="mt-6 w-full rounded-[2rem] bg-white p-6 shadow-xl shadow-slate-900/5 ring-1 ring-slate-200 sm:p-8 dark:bg-[#0E1424] dark:ring-white/10"><SignInForm /></div>
          <div className="mt-6"><Steps /></div>
          <p className="mt-6 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400"><ShieldCheck aria-hidden className="h-4 w-4" />{t("Your number is only used to sign in and send order codes.")}</p>
        </div>
      </div>
    </PageShell>
  );
}
export const SignInB = () => (
  <WithPopup page={<PageB />} popup={() => (
    <div className="p-6 pt-8 sm:p-8">
      <SignInForm />
      <div className="mt-6 border-t border-slate-200 pt-5 dark:border-white/10"><Steps /></div>
    </div>
  )} />
);

// ---------- C · Phone First: the number is the whole page; ways to sign in and the benefits sit under it ----------

function Ways() {
  const t = useT();
  const ways = [{ Icon: KeyRound, label: t("With your password") }, { Icon: MessageSquareText, label: t("With a code by SMS") }, { Icon: Phone, label: t("New? An account in a minute") }];
  return (
    <ul className="grid gap-2 sm:grid-cols-3">
      {ways.map(({ Icon, label }) => (
        <li key={label} className="flex items-center gap-2 rounded-2xl bg-slate-50 px-3 py-2.5 text-sm text-slate-700 dark:bg-white/5 dark:text-slate-300"><Icon aria-hidden className="h-4 w-4 shrink-0 text-indigo-600 dark:text-indigo-300" />{label}</li>
      ))}
    </ul>
  );
}

function PageC() {
  const t = useT();
  return (
    <PageShell>
      <div className="mx-auto max-w-2xl px-6 py-14 text-center sm:py-20">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"><Smartphone aria-hidden className="h-8 w-8" /></span>
        <h1 className="mt-6 font-display text-3xl font-bold text-slate-900 sm:text-4xl dark:text-white">{t("One number, your whole account")}</h1>
        <p className="mx-auto mt-3 max-w-md text-[15px] text-slate-600 dark:text-slate-400">{t("No email, no username. Enter your mobile and we'll take you to your wallet and orders.")}</p>
        <div className="mx-auto mt-8 max-w-md rounded-[2rem] bg-white p-6 text-start shadow-xl shadow-slate-900/5 ring-1 ring-slate-200 sm:p-8 dark:bg-[#0E1424] dark:ring-white/10"><SignInForm heading={false} /></div>
        <div className="mx-auto mt-6 max-w-xl"><Ways /></div>
      </div>
    </PageShell>
  );
}
export const SignInC = () => (
  <WithPopup page={<PageC />} popup={() => (
    <div className="p-6 pt-8 text-center sm:p-8">
      <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-indigo-600 text-white"><Smartphone aria-hidden className="h-6 w-6" /></span>
      <h2 className="mt-4 font-display text-xl font-bold text-slate-900 dark:text-white">{useT()("One number, your whole account")}</h2>
      <div className="mt-5 text-start"><SignInForm heading={false} /></div>
    </div>
  )} />
);

// ---------- D · Account Preview: the form beside a picture of what signing in opens (wallet, live order, code) ----------

function Preview() {
  const t = useT();
  return (
    <div aria-hidden className="relative mx-auto w-full max-w-sm select-none">
      <div className="rounded-3xl bg-[#1e1b4b] p-5 text-white shadow-2xl shadow-indigo-900/30 dark:bg-[#15123a]">
        <p className="text-sm text-indigo-200">{t("Wallet balance")}</p>
        <p className="font-display text-3xl font-bold tabular-nums">{t.num(787_000)} <span className="text-base font-semibold">{t("Toman")}</span></p>
      </div>
      <div className="-mt-3 ms-6 rounded-3xl bg-white p-4 shadow-xl ring-1 ring-slate-200 dark:bg-[#0E1424] dark:ring-white/10">
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#128C7E] text-white"><MessageSquareText className="h-4 w-4" /></span>
          <span className="min-w-0 flex-1"><b className="block text-sm text-slate-900 dark:text-white">{t("WhatsApp number")}</b><span dir="ltr" className="block text-start font-mono text-xs text-slate-500">+44 7700 900418</span></span>
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-900"><Clock className="h-3 w-3" />14:27</span>
        </div>
        <div className="mt-3 flex items-center justify-between rounded-2xl bg-emerald-700 px-4 py-2.5 text-white"><span className="text-xs">{t("Code")}</span><span className="font-mono text-xl font-bold tracking-[0.2em]">48213</span></div>
      </div>
    </div>
  );
}

function PageD() {
  const t = useT();
  return (
    <PageShell>
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-2">
        <div className="order-2 lg:order-1">
          <h1 className="font-display text-3xl font-bold text-slate-900 sm:text-4xl dark:text-white">{t("Sign in to see your codes, orders and wallet")}</h1>
          <p className="mt-3 max-w-lg text-[15px] text-slate-600 dark:text-slate-400">{t("Everything you buy waits here: numbers with their codes, logins, refunds to your wallet, and your conversations with support.")}</p>
          <div className="mt-10"><Preview /></div>
        </div>
        <div className="order-1 rounded-[2rem] bg-white p-6 shadow-xl shadow-slate-900/5 ring-1 ring-slate-200 sm:p-10 lg:order-2 dark:bg-[#0E1424] dark:ring-white/10"><SignInForm /></div>
      </div>
    </PageShell>
  );
}
export const SignInD = () => (
  <WithPopup wide page={<PageD />} popup={() => (
    <div className="grid sm:grid-cols-[1fr_1.1fr]">
      <div className="hidden items-center rounded-s-[2rem] bg-slate-50 p-8 sm:flex dark:bg-white/[.03]"><Preview /></div>
      <div className="p-6 pt-8 sm:p-8"><SignInForm /></div>
    </div>
  )} />
);

// ---------- Current ----------

export const SignInNow = () => (
  <WithPopup page={<LoginView next="/" />} popup={() => <div className="p-6 pt-8 sm:p-8"><SignInForm /></div>} />
);

// ---------- More in A's style (user: "keep A and design more like A"): the same split, a different panel ----------

// The split frame every A-style offer shares: `panel` on the start side (hidden on phones), the form on the end side.
function Split({ panel, panelCls, reverse = false, narrow = false }: { panel: ReactNode; panelCls: string; reverse?: boolean; narrow?: boolean }) {
  return (
    <PageShell>
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-16">
        <div className={`grid overflow-hidden rounded-[2rem] bg-white shadow-xl shadow-slate-900/5 ring-1 ring-slate-200 dark:bg-[#0E1424] dark:ring-white/10 ${narrow ? (reverse ? "lg:grid-cols-[1.2fr_0.8fr]" : "lg:grid-cols-[0.8fr_1.2fr]") : "lg:grid-cols-[1fr_1.1fr]"}`}>
          <aside className={`relative hidden flex-col justify-between gap-10 overflow-hidden p-10 lg:flex ${reverse ? "lg:order-2" : ""} ${panelCls}`}>{panel}</aside>
          <div className="p-6 sm:p-10"><SignInForm /></div>
        </div>
      </div>
    </PageShell>
  );
}

// ---------- F · Trust Split · Light: A's panel in pale indigo, so it sits quietly on light pages ----------

function PanelF() {
  const t = useT();
  return (
    <>
      <Logo />
      <div>
        <h1 className="font-display text-3xl font-bold leading-tight text-slate-900 dark:text-white">{t("Your orders, codes and wallet in one place")}</h1>
        <div className="mt-8"><TrustPoints dark={false} /></div>
      </div>
      <p className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400"><BadgeCheck aria-hidden className="h-4 w-4 text-emerald-600" />{t("Registered with Enamad")}</p>
    </>
  );
}
export const SignInF = () => (
  <WithPopup page={<Split panel={<PanelF />} panelCls="bg-indigo-50 border-e border-indigo-100 dark:bg-indigo-400/[.06] dark:border-white/10" />} popup={() => (
    <div>
      <div className="rounded-t-[2rem] border-b border-indigo-100 bg-indigo-50 px-6 pb-5 pt-6 sm:px-8 dark:border-white/10 dark:bg-indigo-400/[.06]"><Logo /><p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{useT()("Your orders, codes and wallet in one place")}</p></div>
      <div className="p-6 sm:p-8"><SignInForm /></div>
    </div>
  )} />
);

// ---------- G · Trust Split · Services: the panel shows what the account buys, as the shop's own tiles ----------

function ServiceTiles({ small = false }: { small?: boolean }) {
  const t = useT();
  const items = [
    { Icon: MessageSquareText, label: t("Virtual numbers"), cls: "bg-emerald-500" },
    { Icon: Phone, label: t("Google Voice"), cls: "bg-blue-500" },
    { Icon: Apple, label: t("Apple ID"), cls: "bg-slate-600" },
    { Icon: Send, label: t("Telegram Premium"), cls: "bg-sky-500" },
    { Icon: Instagram, label: t("Instagram"), cls: "bg-[linear-gradient(45deg,#f59e0b,#ec4899_50%,#8b5cf6)]" },
    { Icon: Wallet, label: t("Subscriptions"), cls: "bg-violet-500" },
  ];
  return (
    <ul className={`grid grid-cols-3 ${small ? "gap-2" : "gap-3"}`}>
      {items.map(({ Icon, label, cls }) => (
        <li key={label} className={`flex flex-col items-center gap-2 rounded-2xl bg-white/[.07] text-center ring-1 ring-white/10 ${small ? "p-2.5" : "p-3.5"}`}>
          <span className={`grid place-items-center rounded-xl text-white ${cls} ${small ? "h-8 w-8" : "h-10 w-10"}`}><Icon aria-hidden className={small ? "h-4 w-4" : "h-5 w-5"} /></span>
          <span className={`font-semibold leading-tight text-white ${small ? "text-[11px]" : "text-xs"}`}>{label}</span>
        </li>
      ))}
    </ul>
  );
}
function PanelG() {
  const t = useT();
  return (
    <>
      <Logo className="text-white" />
      <div>
        <h1 className="font-display text-3xl font-bold leading-tight text-white">{t("One account for everything you buy here")}</h1>
        <p className="mt-3 text-indigo-200">{t("Numbers, logins and subscriptions land in your account the moment they're ready.")}</p>
        <div className="mt-8"><ServiceTiles /></div>
      </div>
      <p className="flex items-center gap-2 text-sm text-indigo-200"><RotateCcw aria-hidden className="h-4 w-4" />{t("Anything that doesn't go through is refunded to your wallet.")}</p>
    </>
  );
}
export const SignInG = () => (
  <WithPopup page={<Split panel={<PanelG />} panelCls="bg-[#1e1b4b] dark:bg-[#15123a]" />} popup={() => (
    <div>
      <div className="rounded-t-[2rem] bg-[#1e1b4b] px-6 pb-6 pt-6 sm:px-8 dark:bg-[#15123a]"><Logo className="text-white" /><div className="mt-5"><ServiceTiles small /></div></div>
      <div className="p-6 sm:p-8"><SignInForm /></div>
    </div>
  )} />
);

// ---------- H · Trust Split · Glow: A's indigo with the site's grid and a soft beam; the promises as chips ----------

function PanelH() {
  const t = useT();
  const chips = [t("Delivered in seconds"), t("Money back to your wallet"), t("Support around the clock"), t("Registered with Enamad")];
  return (
    <>
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,.06)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_top,black,transparent_75%)]" />
      <div aria-hidden className="pointer-events-none absolute -top-24 start-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-indigo-400/30 blur-3xl motion-safe:animate-pulse" />
      <Logo className="relative text-white" />
      <div className="relative">
        <span className="grid h-14 w-14 place-items-center rounded-2xl bg-white/10 ring-1 ring-white/20"><LockKeyhole aria-hidden className="h-7 w-7 text-white" /></span>
        <h1 className="mt-6 font-display text-3xl font-bold leading-tight text-white">{t("Your orders, codes and wallet in one place")}</h1>
        <ul className="mt-6 flex flex-wrap gap-2">
          {chips.map((c) => <li key={c} className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-sm text-white ring-1 ring-white/15"><Check aria-hidden className="h-3.5 w-3.5 text-emerald-300" />{c}</li>)}
        </ul>
      </div>
      <span />
    </>
  );
}
// Chosen 2026-11-15; the live version (with motion) is components/account/SignIn, shown here as it runs.
export const SignInH = () => (
  <WithPopup page={<PageShell><div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-16"><SignInCard /></div></PageShell>} popup={() => (
    <><SignInStrip /><div className="p-6 sm:p-8"><SignInForm /></div></>
  )} />
);

// ---------- I · Trust Split · Steps: form first, a slim indigo panel after it walks through what happens next ----------

function PanelI() {
  const t = useT();
  const steps = [
    { title: t("Enter your mobile"), text: t("No email or username needed.") },
    { title: t("Password or SMS code"), text: t("Forgot your password? Sign in with a code instead.") },
    { title: t("You're in"), text: t("Back to where you were, with your wallet and orders.") },
  ];
  return (
    <>
      <Logo className="text-white" />
      <ol className="relative space-y-7">
        <span aria-hidden className="absolute bottom-3 start-[15px] top-3 w-px bg-white/20" />
        {steps.map((s, i) => (
          <li key={s.title} className="relative flex gap-4">
            <span className="relative grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white font-display text-sm font-bold text-indigo-950">{t.num(i + 1)}</span>
            <span><b className="block text-white">{s.title}</b><span className="text-sm text-indigo-200">{s.text}</span></span>
          </li>
        ))}
      </ol>
      <p className="flex items-center gap-2 text-sm text-indigo-200"><ShieldCheck aria-hidden className="h-4 w-4" />{t("Your number is only used to sign in and send order codes.")}</p>
    </>
  );
}
export const SignInI = () => (
  <WithPopup page={<Split reverse narrow panel={<PanelI />} panelCls="bg-[#1e1b4b] dark:bg-[#15123a]" />} popup={() => (
    <div>
      <div className="p-6 pt-8 sm:p-8"><SignInForm /></div>
      <div className="rounded-b-[2rem] bg-[#1e1b4b] px-6 py-4 text-sm text-indigo-200 sm:px-8 dark:bg-[#15123a]"><ShieldCheck aria-hidden className="me-1.5 inline h-4 w-4" />{useT()("Your number is only used to sign in and send order codes.")}</div>
    </div>
  )} />
);
