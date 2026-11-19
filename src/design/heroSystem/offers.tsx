// One hero system for every page (home, product pages, Telegram pages). Five directions, each shown on three sample
// pages so the same pattern can be judged across the site. Preview copy is Persian and hard-coded here; once one is
// chosen it moves to English source strings + the fa dictionary like the rest of the site.
// One accent (the site's green) on every page instead of a different glow colour per page.

import type { LucideIcon } from "lucide-react";
import { ArrowLeft, Check, CreditCard, MessageSquareCode, Search, ShieldCheck, Sparkles, Star, Wallet, Zap, Bitcoin, Send } from "lucide-react";

type Sample = {
  key: string;
  label: string;
  path: string;
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  accent: string;
  sub: string;
  cta: string;
  placeholder: string;
  chips: string[];
  stats: [string, string][];
  terminal: { cmd: string; out: string[]; done: string };
  specs: { big: string; bigLabel: string; steps: string[] };
  nodes: string[];
};

const samples: Sample[] = [
  {
    key: "home", label: "صفحه اصلی", path: "/", icon: Sparkles,
    eyebrow: "خدمات دیجیتال · تحویل آنی",
    title: "خدمات دیجیتال را", accent: "در چند دقیقه تحویل بگیرید",
    sub: "شماره مجازی، اپل آیدی، اشتراک‌ها و خدمات تلگرام. پرداخت بدون کارت خارجی، و اگر سفارشی انجام نشود پول خودکار برمی‌گردد.",
    cta: "مشاهده خدمات", placeholder: "دنبال چه سرویسی هستید؟ مثلاً شماره تلگرام",
    chips: ["بدون کارت خارجی", "تحویل آنی", "بازگشت خودکار وجه"],
    stats: [["۱۵۰+", "کشور"], ["۲۰۰۰+", "اپلیکیشن"], ["۲۴/۷", "پشتیبانی فارسی"]],
    terminal: { cmd: "shopmajazi search \"telegram\"", out: ["→ 3 services found", "  virtual-number  ·  telegram-stars  ·  premium"], done: "✓ ready to order" },
    specs: { big: "۱۵۰+", bigLabel: "کشور برای شماره مجازی", steps: ["انتخاب", "پرداخت", "تحویل"] },
    nodes: ["شماره مجازی", "اپل آیدی", "تلگرام", "اشتراک‌ها"],
  },
  {
    key: "otp", label: "شماره مجازی", path: "/virtual-number", icon: MessageSquareCode,
    eyebrow: "شماره مجازی · کد تأیید",
    title: "شماره مجازی برای", accent: "دریافت کد تأیید",
    sub: "برای تلگرام، واتس‌اپ، گوگل و هزاران اپ دیگر یک شماره یک‌بار مصرف بگیرید. اگر پیامکی نیاید، پول به کیف پول برمی‌گردد.",
    cta: "دریافت شماره", placeholder: "نام اپ یا کشور، مثلاً تلگرام",
    chips: ["۱۵۰+ کشور", "۲۰۰۰+ اپ", "بازگشت وجه اگر کد نیاید"],
    stats: [["۱۵۰+", "کشور"], ["۲۰۰۰+", "اپ"], ["خودکار", "بازگشت وجه"]],
    terminal: { cmd: "order otp --app telegram --country ID", out: ["→ number  +62 812 •••• 4471", "… waiting for sms"], done: "✓ code 48213 received" },
    specs: { big: "۲۰۰۰+", bigLabel: "اپ پشتیبانی‌شده", steps: ["اپ", "کشور", "کد"] },
    nodes: ["تلگرام", "واتس‌اپ", "گوگل", "اینستاگرام"],
  },
  {
    key: "stars", label: "استارز تلگرام", path: "/telegram/stars", icon: Star,
    eyebrow: "تلگرام · استارز",
    title: "استارز تلگرام را", accent: "به هر یوزرنیم بفرستید",
    sub: "بدون ورود به حساب، بدون TON و بدون کارت خارجی. فقط یوزرنیم گیرنده را وارد کنید؛ قبل از پرداخت حساب بررسی می‌شود.",
    cta: "خرید استارز", placeholder: "یوزرنیم گیرنده، مثلاً ‎@username",
    chips: ["بدون ورود به حساب", "بدون TON", "تحویل در چند دقیقه"],
    stats: [["۵۰+", "حداقل استارز"], ["بدون ورود", "به حساب"], ["چند دقیقه", "تحویل"]],
    terminal: { cmd: "send stars --to @username --amount 500", out: ["→ account found  ·  @username", "… delivering"], done: "✓ 500 stars delivered" },
    specs: { big: "۵۰۰", bigLabel: "پرفروش‌ترین بسته", steps: ["یوزرنیم", "بسته", "ارسال"] },
    nodes: ["‎@username", "۵۰۰ ستاره", "کیف پول", "کارت"],
  },
];

// ---------- shared bits ----------

const font = { fontFamily: "var(--font-iransans), var(--font-inter), sans-serif" };

const keyframes = `
@keyframes hs-line { from { opacity: 0; transform: translateY(4px) } to { opacity: 1; transform: none } }
@keyframes hs-caret { 50% { opacity: 0 } }
@keyframes hs-dash { to { stroke-dashoffset: -220 } }
@keyframes hs-ring { from { transform: scale(.7); opacity: .7 } to { transform: scale(1.9); opacity: 0 } }
@keyframes hs-beam { 0%,100% { opacity: .75 } 50% { opacity: 1 } }
@keyframes hs-fill { from { width: 0 } }
@media (prefers-reduced-motion: reduce) { .hs-anim, .hs-anim * { animation: none !important } }
`;

function Showcase({ children }: { children: (s: Sample) => React.ReactNode }) {
  return (
    <div dir="rtl" lang="fa" style={font} className="hs-anim bg-white text-slate-900 dark:bg-[#070B14] dark:text-slate-100">
      <style>{keyframes}</style>
      {samples.map((s) => (
        <div key={s.key}>
          <div dir="ltr" className="flex items-center gap-2 border-y border-slate-200 bg-slate-50 px-6 py-2 font-mono text-xs text-slate-500 dark:border-white/10 dark:bg-white/[.03] dark:text-slate-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />{s.path}
          </div>
          {children(s)}
        </div>
      ))}
    </div>
  );
}

const Accent = ({ children }: { children: React.ReactNode }) => <span className="text-emerald-600 dark:text-emerald-400">{children}</span>;

function PrimaryBtn({ children }: { children: React.ReactNode }) {
  return (
    <a href="#" className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-6 py-3.5 font-semibold text-white transition hover:bg-emerald-800 dark:bg-emerald-600 dark:text-white dark:hover:bg-emerald-500">
      {children}<ArrowLeft className="h-4 w-4" />
    </a>
  );
}

function GhostBtn({ children }: { children: React.ReactNode }) {
  return (
    <a href="#" className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-6 py-3.5 font-semibold text-slate-800 transition hover:bg-slate-50 dark:border-white/15 dark:text-slate-100 dark:hover:bg-white/5">
      {children}
    </a>
  );
}

function Chips({ items, center }: { items: string[]; center?: boolean }) {
  return (
    <ul className={`flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-600 dark:text-slate-400 ${center ? "justify-center" : ""}`}>
      {items.map((c) => <li key={c} className="flex items-center gap-1.5"><Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />{c}</li>)}
    </ul>
  );
}

function Title({ s, size = "text-4xl sm:text-6xl", center }: { s: Sample; size?: string; center?: boolean }) {
  return (
    <h1 className={`${size} font-extrabold leading-[1.25] tracking-tight ${center ? "mx-auto max-w-3xl text-center" : ""}`}>
      {s.title} <Accent>{s.accent}</Accent>
    </h1>
  );
}

// ---------- A · Grid Console ----------
// Centered. Hairline blueprint grid, a mono status eyebrow, the search field is the main action, a stats row below.

export function HeroSysA() {
  return (
    <Showcase>
      {(s) => (
        <section className="relative isolate overflow-hidden px-4 pb-20 pt-24 sm:px-6">
          <div aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(15,23,42,.07)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,.07)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,black,transparent)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,.06)_1px,transparent_1px)]" />
          <div aria-hidden className="absolute inset-x-0 top-0 -z-10 mx-auto h-64 max-w-2xl rounded-full bg-emerald-400/20 blur-[100px] dark:bg-emerald-500/15" />
          <div className="mx-auto max-w-4xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-xs font-medium text-slate-600 backdrop-blur dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
              <span className="relative flex h-2 w-2"><span className="absolute inset-0 animate-ping rounded-full bg-emerald-500/60" /><span className="relative h-2 w-2 rounded-full bg-emerald-500" /></span>
              {s.eyebrow}
            </span>
            <div className="mt-6"><Title s={s} center /></div>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-400">{s.sub}</p>
            <form className="mx-auto mt-9 flex max-w-xl items-center gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_8px_30px_-12px_rgba(15,23,42,.18)] focus-within:border-emerald-500 dark:border-white/10 dark:bg-white/5 dark:shadow-none">
              <Search className="ms-2 h-5 w-5 shrink-0 text-slate-400" />
              <input aria-label="جستجو" placeholder={s.placeholder} className="min-w-0 flex-1 bg-transparent py-2 text-base outline-none placeholder:text-slate-400" />
              <kbd dir="ltr" className="hidden rounded-md border border-slate-200 px-1.5 py-0.5 font-mono text-[11px] text-slate-400 sm:block dark:border-white/10">Ctrl K</kbd>
              <button type="button" className="rounded-xl bg-emerald-700 px-5 py-2.5 font-semibold text-white dark:bg-emerald-600 dark:text-white">{s.cta}</button>
            </form>
            <dl className="mx-auto mt-12 grid max-w-xl grid-cols-3 divide-x divide-x-reverse divide-slate-200 dark:divide-white/10">
              {s.stats.map(([v, l]) => (
                <div key={l} className="px-2"><dt className="text-2xl font-bold">{v}</dt><dd className="mt-1 text-sm text-slate-500 dark:text-slate-400">{l}</dd></div>
              ))}
            </dl>
          </div>
        </section>
      )}
    </Showcase>
  );
}

// ---------- B · Split Terminal ----------
// Copy on the start side, a small terminal on the end side that plays the order for this page, line by line.

export function HeroSysB() {
  return (
    <Showcase>
      {(s) => (
        <section className="relative isolate overflow-hidden px-4 py-20 sm:px-6">
          <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(rgba(15,23,42,.1)_1px,transparent_1px)] bg-[size:20px_20px] [mask-image:linear-gradient(to_bottom,black,transparent)] dark:bg-[radial-gradient(rgba(255,255,255,.07)_1px,transparent_1px)]" />
          <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.1fr_1fr]">
            <div>
              <p className="flex items-center gap-2 text-sm font-semibold text-emerald-700 dark:text-emerald-400"><s.icon className="h-4 w-4" />{s.eyebrow}</p>
              <div className="mt-4"><Title s={s} size="text-4xl sm:text-5xl" /></div>
              <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600 dark:text-slate-400">{s.sub}</p>
              <div className="mt-8 flex flex-wrap gap-3"><PrimaryBtn>{s.cta}</PrimaryBtn><GhostBtn>راهنمای خرید</GhostBtn></div>
              <div className="mt-8"><Chips items={s.chips} /></div>
            </div>
            <div dir="ltr" className="overflow-hidden rounded-2xl border border-slate-800 bg-[#0B1020] shadow-2xl shadow-emerald-900/10 ring-1 ring-white/5">
              <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
                <span className="h-3 w-3 rounded-full bg-white/15" /><span className="h-3 w-3 rounded-full bg-white/15" /><span className="h-3 w-3 rounded-full bg-white/15" />
                <span className="ms-3 font-mono text-xs text-slate-500">shopmajazi — {s.key}</span>
              </div>
              <div lang="en" style={{ fontFamily: "var(--font-mono-code), ui-monospace, monospace" }} className="space-y-2 whitespace-pre p-6 text-[13px] leading-6 sm:text-sm">
                <p className="text-slate-200" style={{ animation: "hs-line .4s both" }}><span className="text-emerald-400">$</span> {s.terminal.cmd}</p>
                {s.terminal.out.map((l, i) => <p key={l} className="text-slate-400" style={{ animation: `hs-line .4s ${0.7 + i * 0.7}s both` }}>{l}</p>)}
                <p className="text-emerald-400" style={{ animation: `hs-line .4s ${0.7 + s.terminal.out.length * 0.7}s both` }}>{s.terminal.done}</p>
                <p className="text-slate-200" style={{ animation: `hs-line .4s ${1.2 + s.terminal.out.length * 0.7}s both` }}>
                  <span className="text-emerald-400">$</span> <span className="inline-block h-4 w-2 translate-y-0.5 bg-slate-300" style={{ animation: "hs-caret 1s steps(1) infinite" }} />
                </p>
              </div>
            </div>
          </div>
        </section>
      )}
    </Showcase>
  );
}

// ---------- C · Spotlight ----------
// Centered. One soft green beam from the top onto the page's icon tile, rings breathing out from it.

export function HeroSysC() {
  return (
    <Showcase>
      {(s) => (
        <section className="relative isolate overflow-hidden px-4 pb-20 pt-20 sm:px-6">
          <div aria-hidden className="absolute start-1/2 top-0 -z-10 h-[560px] w-[900px] -translate-x-1/2 rtl:translate-x-1/2 bg-[conic-gradient(from_150deg_at_50%_0%,transparent_0deg,rgba(16,185,129,.32)_30deg,transparent_60deg)] blur-2xl dark:bg-[conic-gradient(from_150deg_at_50%_0%,transparent_0deg,rgba(16,185,129,.38)_30deg,transparent_60deg)]" style={{ animation: "hs-beam 6s ease-in-out infinite" }} />
          <div aria-hidden className="absolute inset-x-0 bottom-0 -z-10 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-white/15" />
          <div className="mx-auto max-w-4xl text-center">
            <div className="relative mx-auto grid h-20 w-20 place-items-center">
              {[0, 1.3].map((d) => <span key={d} className="absolute inset-0 rounded-2xl border border-emerald-500/40" style={{ animation: `hs-ring 2.6s ${d}s ease-out infinite` }} />)}
              <span className="relative grid h-20 w-20 place-items-center rounded-2xl border border-white/60 bg-gradient-to-b from-white to-slate-100 shadow-lg dark:border-white/10 dark:from-white/10 dark:to-white/[.02]">
                <s.icon className="h-9 w-9 text-emerald-600 dark:text-emerald-400" />
              </span>
            </div>
            <p className="mt-8 text-sm font-medium tracking-wide text-slate-500 dark:text-slate-400">{s.eyebrow}</p>
            <h1 className="mx-auto mt-3 max-w-3xl text-4xl font-extrabold leading-[1.25] tracking-tight sm:text-6xl">
              {s.title} <Accent>{s.accent}</Accent>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-400">{s.sub}</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3"><PrimaryBtn>{s.cta}</PrimaryBtn><GhostBtn>سوالات متداول</GhostBtn></div>
            <div className="mt-10"><Chips items={s.chips} center /></div>
          </div>
        </section>
      )}
    </Showcase>
  );
}

// ---------- D · Spec Bento ----------
// Copy on the start side; four small spec tiles on the end side (key number, the three steps, payment, refund).

export function HeroSysD() {
  return (
    <Showcase>
      {(s) => (
        <section className="relative isolate overflow-hidden px-4 py-20 sm:px-6">
          <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.1fr_1fr]">
            <div>
              <span className="inline-flex items-center gap-2 rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-300"><s.icon className="h-3.5 w-3.5" />{s.eyebrow}</span>
              <div className="mt-5"><Title s={s} size="text-4xl sm:text-5xl" /></div>
              <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600 dark:text-slate-400">{s.sub}</p>
              <div className="mt-8 flex flex-wrap gap-3"><PrimaryBtn>{s.cta}</PrimaryBtn><GhostBtn>راهنمای خرید</GhostBtn></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2 flex items-end justify-between rounded-2xl border border-slate-200 bg-slate-50 p-6 dark:border-white/10 dark:bg-white/[.03]">
                <div><p className="text-5xl font-extrabold tracking-tight">{s.specs.big}</p><p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{s.specs.bigLabel}</p></div>
                <s.icon className="h-10 w-10 text-emerald-600/80 dark:text-emerald-400/80" />
              </div>
              <div className="rounded-2xl border border-slate-200 p-5 dark:border-white/10">
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">مراحل خرید</p>
                <ol className="mt-4 space-y-2.5">
                  {s.specs.steps.map((st, i) => (
                    <li key={st} className="flex items-center gap-2 text-sm font-medium">
                      <span className={`grid h-5 w-5 place-items-center rounded-full text-[10px] ${i < 2 ? "bg-emerald-600 text-white dark:bg-emerald-500 dark:text-emerald-950" : "border border-slate-300 text-slate-500 dark:border-white/20"}`}>{i < 2 ? <Check className="h-3 w-3" /> : i + 1}</span>{st}
                    </li>
                  ))}
                </ol>
                <div className="mt-4 h-1 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10"><div className="h-full w-2/3 rounded-full bg-emerald-500" style={{ animation: "hs-fill 1.4s cubic-bezier(.2,.8,.2,1) both" }} /></div>
              </div>
              <div className="rounded-2xl border border-slate-200 p-5 dark:border-white/10">
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">پرداخت</p>
                <ul className="mt-4 space-y-2.5 text-sm font-medium">
                  {([[Wallet, "کیف پول"], [CreditCard, "کارت بانکی"], [Bitcoin, "کریپتو"]] as const).map(([I, l]) => <li key={l} className="flex items-center gap-2"><I className="h-4 w-4 text-slate-400" />{l}</li>)}
                </ul>
                <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">بدون کارت خارجی</p>
              </div>
              <div className="col-span-2 flex items-center gap-3 rounded-2xl bg-emerald-700 p-5 text-white dark:bg-emerald-500/15 dark:text-emerald-200">
                <ShieldCheck className="h-6 w-6 shrink-0" />
                <p className="text-sm font-medium">اگر سفارش انجام نشود، مبلغ خودکار به کیف پول برمی‌گردد.</p>
              </div>
            </div>
          </div>
        </section>
      )}
    </Showcase>
  );
}

// ---------- E · Signal Lines ----------
// Copy on the start side; on the end side, thin circuit traces carry pulses from labelled sources into the page's chip.

function Circuit({ s }: { s: Sample }) {
  // Four traces from the corners of a 400×320 board into the centre chip.
  const paths = ["M20 40 H140 V130 H170", "M380 40 H260 V130 H230", "M20 280 H140 V190 H170", "M380 280 H260 V190 H230"];
  const labels: [number, number, "start" | "end"][] = [[20, 26, "start"], [380, 26, "end"], [20, 306, "start"], [380, 306, "end"]];
  return (
    <svg direction="ltr" viewBox="0 0 400 320" className="h-auto w-full" role="img" aria-label={s.nodes.join("، ")}>
      {paths.map((d) => <path key={d} d={d} fill="none" className="stroke-slate-200 dark:stroke-white/10" strokeWidth="1.5" />)}
      {paths.map((d, i) => (
        <path key={`p${d}`} d={d} fill="none" className="stroke-emerald-500" strokeWidth="2" strokeLinecap="round" strokeDasharray="18 202" style={{ animation: `hs-dash 2.8s ${i * 0.5}s linear infinite` }} />
      ))}
      {[[20, 40], [380, 40], [20, 280], [380, 280]].map(([x, y]) => <circle key={`${x}${y}`} cx={x} cy={y} r="4" className="fill-white stroke-slate-300 dark:fill-[#070B14] dark:stroke-white/25" strokeWidth="1.5" />)}
      {labels.map(([x, y, a], i) => (
        <text key={i} x={x} y={y} textAnchor={a} className="fill-slate-500 text-[12px] font-medium dark:fill-slate-400" style={font}>{s.nodes[i]}</text>
      ))}
      <rect x="170" y="110" width="60" height="100" rx="14" className="fill-white stroke-slate-200 dark:fill-[#0E1424] dark:stroke-white/15" strokeWidth="1.5" />
      {[125, 145, 165, 185].map((y) => <g key={y}><line x1="164" y1={y + 5} x2="170" y2={y + 5} className="stroke-slate-300 dark:stroke-white/20" /><line x1="230" y1={y + 5} x2="236" y2={y + 5} className="stroke-slate-300 dark:stroke-white/20" /></g>)}
      <foreignObject x="180" y="140" width="40" height="40"><div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400"><s.icon className="h-5 w-5" /></div></foreignObject>
    </svg>
  );
}

export function HeroSysE() {
  return (
    <Showcase>
      {(s) => (
        <section className="relative isolate overflow-hidden px-4 py-20 sm:px-6">
          <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.15fr_1fr]">
            <div>
              <p className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400"><span className="h-px w-8 bg-emerald-500" />{s.eyebrow}</p>
              <div className="mt-5"><Title s={s} size="text-4xl sm:text-5xl" /></div>
              <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600 dark:text-slate-400">{s.sub}</p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <PrimaryBtn>{s.cta}</PrimaryBtn>
                <span className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400"><Zap className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />تحویل خودکار</span>
                <span className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400"><Send className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />پشتیبانی تلگرام</span>
              </div>
              <dl className="mt-10 flex gap-10 border-t border-slate-200 pt-6 dark:border-white/10">
                {s.stats.map(([v, l]) => <div key={l}><dt className="text-xl font-bold">{v}</dt><dd className="mt-1 text-xs text-slate-500 dark:text-slate-400">{l}</dd></div>)}
              </dl>
            </div>
            <div className="mx-auto w-full max-w-md"><Circuit s={s} /></div>
          </div>
        </section>
      )}
    </Showcase>
  );
}
