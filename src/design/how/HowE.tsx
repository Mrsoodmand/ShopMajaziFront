"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Smartphone, Apple, Sparkles, Send, Users, ArrowRight, type LucideIcon } from "lucide-react";
import { Connector, Rail, gaps, type ArrowStyle } from "./connectors";
import { useT } from "@/i18n/client";

type Flow = { id: string; name: string; icon: LucideIcon; steps: { title: string; desc: string }[]; time: string; cta: string };

const flows: Flow[] = [
  {
    id: "numbers", name: "Virtual Numbers", icon: Smartphone, time: "~30 seconds", cta: "Get a number",
    steps: [
      { title: "Pick app & country", desc: "Choose the app you want to verify, like WhatsApp or Telegram, and a country." },
      { title: "Get your number", desc: "Pay and the number appears instantly. Enter it in the app." },
      { title: "Receive the code", desc: "The SMS code shows up on your dashboard. No code means an automatic refund." },
    ],
  },
  {
    id: "apple", name: "Apple ID", icon: Apple, time: "Instant (custom: ~1 hour)", cta: "Get an Apple ID",
    steps: [
      { title: "Ready or custom", desc: "Take a ready USA Apple ID, or order a custom one with your name and email." },
      { title: "Pay & send details", desc: "For a custom ID, fill in the short form after paying." },
      { title: "Sign in on your device", desc: "Login details arrive in your dashboard, with a setup guide." },
    ],
  },
  {
    id: "subs", name: "Subscriptions", icon: Sparkles, time: "Within minutes", cta: "See subscriptions",
    steps: [
      { title: "Choose a plan", desc: "ChatGPT Plus, Netflix, Spotify, Canva and more, by month or year." },
      { title: "Your account or ours", desc: "Activate on your own account, or receive a ready account." },
      { title: "Start using it", desc: "We confirm activation and you're ready. Renew from your dashboard." },
    ],
  },
  {
    id: "telegram", name: "Telegram", icon: Send, time: "Premium instant · Ads within 24 hours", cta: "Explore Telegram",
    steps: [
      { title: "Premium or Ads", desc: "Gift Telegram Premium for 3, 6 or 12 months, or run a sponsored-message campaign." },
      { title: "Send your username or brief", desc: "Premium needs only your @username, never your login. For Ads, share your link, ad text and audience." },
      { title: "Go live", desc: "Premium activates on your account right away. Your ad goes live and its stats show in your dashboard." },
    ],
  },
  {
    id: "social", name: "Social Media Services", icon: Users, time: "Starts in minutes", cta: "Grow an account",
    steps: [
      { title: "Choose platform & package", desc: "Telegram, Instagram, YouTube or TikTok. Followers, members, views or likes." },
      { title: "Paste your link", desc: "Just the channel, profile or post link. We never ask for your password." },
      { title: "Watch it grow", desc: "Track delivery live in your dashboard. Drops are refilled for free." },
    ],
  },
];

const STEP_MS = 2200;

// Offer E — "Per-service Guide": every service buys a little differently, so the visitor picks one and sees its exact three steps.
// Animated: content fades up on scroll, the tab pill slides, and the steps light up one after another in a loop.
// `arrow` picks the connector style between cards (see connectors.tsx).
export default function HowE({ arrow = "chevrons" }: { arrow?: ArrowStyle }) {
  const tx = useT();
  const [id, setId] = useState(tx.tr(flows)[0].id);
  const [active, setActive] = useState(0);
  const flow = tx.tr(flows).find((f) => f.id === id)!;

  // Reveal on scroll: animations stay paused until the section is on screen.
  const rootRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && (setInView(true), io.disconnect()), { rootMargin: "0px 0px -15% 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Sliding pill behind the active tab.
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [pill, setPill] = useState({ left: 0, width: 0 });
  useLayoutEffect(() => {
    const measure = () => {
      const b = tabRefs.current[id];
      if (b) setPill({ left: b.offsetLeft, width: b.offsetWidth });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [id]);

  // Steps light up in turn, then loop. Restarts when the tab changes.
  useEffect(() => {
    if (!inView || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setActive((a) => (a + 1) % 3), STEP_MS);
    return () => clearInterval(t);
  }, [inView, id]);

  const choose = (next: string) => { setId(next); setActive(0); };
  const play = inView ? "" : "[animation-play-state:paused]";

  return (
    <section ref={rootRef} className="relative overflow-hidden bg-[#F5F6FB] py-24 dark:bg-[#070B14]">
      <div aria-hidden className="pointer-events-none absolute -top-20 end-[10%] h-80 w-80 animate-float rounded-full bg-indigo-300/40 blur-[110px] dark:bg-indigo-600/20" />
      <div className="relative mx-auto max-w-6xl px-6">
        <div className={`animate-fade-up text-center ${play}`}>
          <span className="text-sm font-semibold uppercase tracking-widest text-indigo-600">{tx("How to buy")}</span>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl dark:text-white">{tx("What are you buying today?")}</h2>
        </div>

        <div className={`relative mx-auto mt-10 flex max-w-4xl animate-fade-up gap-1 overflow-x-auto rounded-2xl bg-white p-1 shadow-sm ring-1 ring-slate-200 [animation-delay:120ms] dark:bg-white/5 dark:ring-white/10 ${play}`}>
          <span aria-hidden className="absolute inset-y-1 rounded-xl bg-slate-900 shadow-md transition-all dark:bg-white duration-500 ease-[cubic-bezier(.3,1.3,.5,1)]" style={{ left: pill.left, width: pill.width }} />
          {tx.tr(flows).map((f) => (
            <button
              key={f.id}
              ref={(el) => { tabRefs.current[f.id] = el; }}
              onClick={() => choose(f.id)}
              className={`relative z-10 flex shrink-0 flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-medium transition-colors duration-300 ${f.id === id ? "text-white dark:text-slate-900" : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"}`}
            >
              <f.icon className="h-4 w-4" />{f.name}
            </button>
          ))}
        </div>

        {arrow === "rail" && <Rail active={active} stepMs={STEP_MS} resetKey={flow.id} />}
        <div className={`grid gap-4 md:grid-cols-3 ${gaps[arrow].cls} ${arrow === "rail" ? "mt-10 md:mt-0" : "mt-10"}`}>
          {flow.steps.map((s, i) => {
            const on = i === active;
            const done = i < active;
            return (
              <div
                key={flow.id + i}
                onMouseEnter={() => setActive(i)}
                className={`relative animate-fade-up rounded-3xl p-7 shadow-sm ring-1 transition-all duration-500 ${play} ${
                  on ? "-translate-y-1 bg-white shadow-xl shadow-indigo-200/60 ring-indigo-300 dark:bg-[#0E1424] dark:shadow-indigo-500/20 dark:ring-indigo-400/60"
                  : done ? "bg-emerald-50 ring-emerald-300 dark:bg-emerald-500/10 dark:ring-emerald-400/40"
                  : "bg-white ring-slate-200/70 dark:bg-[#0E1424] dark:ring-white/10"}`}
                // Earlier cards sit above later ones so the arrow between them is never covered.
                style={{ animationDelay: `${200 + i * 120}ms`, zIndex: flow.steps.length - i }}
              >
                <span className={`block font-display text-5xl font-bold transition-colors duration-500 ${on ? "text-indigo-600" : done ? "text-emerald-500" : "text-indigo-100 dark:text-white/10"}`}>{i + 1}</span>
                <h3 className="mt-2 font-display text-lg font-semibold text-slate-900 dark:text-white">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{s.desc}</p>
                <div className={`mt-5 h-1 overflow-hidden rounded-full transition-colors duration-500 ${done ? "bg-emerald-200 dark:bg-emerald-500/20" : "bg-slate-100 dark:bg-white/10"}`}>
                  {on && <span key={`${flow.id}-${active}`} className="block h-full rounded-full bg-gradient-to-r from-indigo-500 to-fuchsia-500" style={{ animation: `grow ${STEP_MS}ms linear forwards` }} />}
                  {done && <span className="block h-full w-full rounded-full bg-emerald-500" />}
                </div>
                {i < 2 && <Connector style={arrow} state={done ? "done" : on ? "live" : "idle"} />}
              </div>
            );
          })}
        </div>

        <div key={flow.id} className={`mt-8 flex animate-fade-up flex-wrap items-center justify-center gap-4 [animation-delay:560ms] ${play}`}>
          <span className="text-sm text-slate-500 dark:text-slate-400">{tx("Delivery time:")}{" "}<span className="font-semibold text-slate-900 dark:text-white">{flow.time}</span></span>
          <a href="#" className="group flex items-center gap-2 rounded-full bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 transition hover:bg-indigo-700 hover:shadow-indigo-600/50">
            {flow.cta}<ArrowRight className="h-4 w-4 transition group-hover:translate-x-1 rtl:rotate-180" />
          </a>
        </div>
      </div>
    </section>
  );
}
