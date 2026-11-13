"use client";

import { Bitcoin, Check, CreditCard, MessageCircle, Wallet, Zap, type LucideIcon } from "lucide-react";
import { useT } from "@/i18n/client";
import { WhyHeading, card, reason, tone, type Reason } from "./parts";

// Offer G — "Service Cards": the second reference brought over. White cards with a small coloured line icon beside
// the title, a short paragraph, and a soft pale illustration in the bottom corner (silver shapes with a few
// coloured coins floating over them). One tall card in the middle, one wide card along the bottom.

// A coloured coin with a glow, like the crypto coins in the reference.
function Coin({ icon: Icon, className, bg, delay = "0s", size = 52 }: { icon: LucideIcon; className: string; bg: string; delay?: string; size?: number }) {
  return (
    <span className={`absolute grid place-items-center rounded-full text-white ring-4 ring-white/80 animate-[why-bob_4.5s_ease-in-out_infinite] dark:ring-white/10 ${bg} ${className}`} style={{ width: size, height: size, animationDelay: delay }}>
      <Icon style={{ width: size * 0.45, height: size * 0.45 }} strokeWidth={2.4} />
    </span>
  );
}

// The pale silver block the coins sit on.
const pale = "bg-gradient-to-br from-slate-100 via-slate-200 to-blue-100 dark:from-white/10 dark:via-white/5 dark:to-blue-400/10";

function Head({ r }: { r: Reason }) {
  const t = useT();
  return (
    <>
      <h3 className="flex items-center gap-3 font-display text-xl font-bold text-slate-900 dark:text-white">
        <r.icon className={`h-6 w-6 shrink-0 ${tone(r.tone).ink}`} strokeWidth={2} />
        {t(r.title)}
      </h3>
      <p className="mt-3 text-[15px] leading-7 text-slate-600 dark:text-slate-400">{t(r.desc)}</p>
    </>
  );
}

export default function WhyG() {
  const t = useT();
  const base = `${card} p-7 transition duration-300 ease-out hover:ring-blue-200 hover:shadow-lg hover:shadow-blue-100/60 dark:hover:ring-blue-400/30 dark:hover:shadow-black/40`;

  return (
    <section className="bg-white py-24 dark:bg-[#070B14]">
      <div className="mx-auto max-w-6xl px-6">
        <WhyHeading title="Six reasons buyers come back" />

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          <div className={`${base} min-h-[300px]`}>
            <Head r={reason("speed")} />
            <div aria-hidden className="absolute -bottom-6 end-6 h-28 w-32">
              <span className={`absolute bottom-0 end-0 h-24 w-28 rounded-t-[40px] ${pale}`} />
              <Coin icon={Zap} bg="bg-gradient-to-b from-amber-300 to-orange-500" className="bottom-14 end-16" />
              <Coin icon={Check} bg="bg-gradient-to-b from-emerald-400 to-emerald-600" className="bottom-20 end-2" size={36} delay="1s" />
            </div>
          </div>

          {/* Tall card */}
          <div className={`${base} md:row-span-2`}>
            <Head r={reason("pay")} />
            <div aria-hidden className="relative mx-auto mt-10 h-72 w-60">
              <span className={`absolute bottom-0 start-6 h-40 w-48 -skew-x-6 rounded-3xl ${pale}`} />
              <span className="absolute bottom-10 start-14 grid h-28 w-40 place-items-center rounded-2xl bg-white/80 shadow-xl ring-1 ring-slate-200 backdrop-blur dark:bg-white/10 dark:ring-white/10">
                <Wallet className="h-10 w-10 text-slate-300 dark:text-slate-500" />
              </span>
              <Coin icon={CreditCard} bg="bg-gradient-to-b from-sky-400 to-blue-600" className="start-14 top-14" size={64} />
              <Coin icon={Bitcoin} bg="bg-gradient-to-b from-amber-300 to-orange-500" className="end-4 top-28" delay=".8s" />
              <Coin icon={Wallet} bg="bg-gradient-to-b from-emerald-400 to-emerald-600" className="end-12 top-0" size={40} delay="1.6s" />
            </div>
          </div>

          <div className={`${base} min-h-[300px]`}>
            <Head r={reason("support")} />
            <div aria-hidden className="absolute -bottom-4 end-6 h-28 w-40">
              <span className={`absolute bottom-0 end-0 h-20 w-36 rounded-t-[36px] ${pale}`} />
              <span className="absolute bottom-12 end-14 whitespace-nowrap rounded-2xl rounded-ee-sm bg-white px-3 py-2 text-xs font-medium text-slate-700 shadow-md ring-1 ring-slate-200 animate-[why-bob_5s_ease-in-out_infinite] dark:bg-white/10 dark:text-slate-200 dark:ring-white/10">{t("Hi, how can we help?")}</span>
              <Coin icon={MessageCircle} bg="bg-gradient-to-b from-orange-300 to-rose-500" className="bottom-4 end-2" size={40} delay=".7s" />
            </div>
          </div>

          <div className={`${base} min-h-[300px]`}>
            <Head r={reason("private")} />
            <div aria-hidden className="absolute -bottom-6 end-6 h-28 w-32">
              <span className={`absolute bottom-0 end-2 h-20 w-24 rounded-t-full ${pale}`} />
              <Coin icon={reason("private").icon} bg="bg-gradient-to-b from-fuchsia-400 to-violet-600" className="bottom-12 end-10" size={56} />
            </div>
          </div>

          <div className={`${base} min-h-[300px]`}>
            <Head r={reason("catalog")} />
            <div aria-hidden className="absolute -bottom-4 end-6 flex items-end gap-2">
              {["h-12", "h-16", "h-20", "h-24"].map((h, i) => (
                <span key={h} className={`w-9 rounded-t-xl ${h} ${pale} animate-[why-bob_5s_ease-in-out_infinite]`} style={{ animationDelay: `${i * 0.4}s` }} />
              ))}
            </div>
          </div>

          {/* Wide card */}
          <div className={`${base} md:col-span-3`}>
            <div className="grid items-center gap-8 md:grid-cols-[1fr_auto]">
              <div className="max-w-xl"><Head r={reason("refund")} /></div>
              <div aria-hidden className="relative h-40 w-full md:w-96">
                <span className={`absolute inset-x-6 bottom-0 h-24 rounded-t-[48px] ${pale}`} />
                <div className="absolute inset-x-0 top-6 mx-auto flex w-80 max-w-full items-center gap-3 rounded-2xl bg-white p-3.5 shadow-xl ring-1 ring-slate-200 dark:bg-[#151C30] dark:ring-white/10">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-emerald-500 text-white"><Check className="h-5 w-5" /></span>
                  <span className="text-sm">
                    <span className="block font-semibold text-slate-900 dark:text-white">{t("Refunded to your wallet")}</span>
                    <span className="text-slate-500 dark:text-slate-400">{t("No code arrived, so you weren't charged.")}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
