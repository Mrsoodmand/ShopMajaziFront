"use client";

import { Gift, Smartphone, Apple, Send, Sparkles } from "lucide-react";
import { useT } from "@/i18n/client";
import { BrandMark, Wordmark } from "@/components/brand/Brand";
import { BigNumber, Glossy, WhyHeading, card, pageBg, reason, stat, useInView, tone } from "./parts";

// Offer F — "Glossy Bento": the first reference brought over. A bento of soft white cards: a 2 × 2 cluster of glossy
// product icons, a "24" tile, overlapping circles for speed, big blue numbers, and a blue brand card with fine
// wavy lines and the logo in the middle of the grid. Cards lift a little on hover.
export default function WhyF() {
  const t = useT();
  const [ref, seen] = useInView();
  const lift = "transition duration-300 ease-out hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/70 dark:hover:shadow-black/40 motion-reduce:hover:translate-y-0";
  const R = (id: string) => reason(id);

  return (
    <section className={`${pageBg} py-24`}>
      <div ref={ref} className="mx-auto max-w-6xl px-6">
        <WhyHeading title="Built so you never have to wait or worry" />

        <div className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4 lg:auto-rows-[200px]">
          {/* Everything in one place: four glossy product icons. */}
          <div className={`${card} ${lift} col-span-2 flex flex-col items-center justify-center p-7 text-center sm:col-span-1 lg:row-span-2`}>
            <div className="grid grid-cols-2 gap-3">
              <Glossy icon={Smartphone} tone="green" size={64} className="animate-[why-bob_5s_ease-in-out_infinite]" />
              <Glossy icon={Gift} tone="amber" size={64} className="animate-[why-bob_5s_ease-in-out_.6s_infinite]" />
              <Glossy icon={Send} tone="blue" size={64} className="animate-[why-bob_5s_ease-in-out_1.2s_infinite]" />
              <Glossy icon={Apple} tone="violet" size={64} className="animate-[why-bob_5s_ease-in-out_1.8s_infinite]" />
            </div>
            <h3 className="mt-8 font-display text-xl font-bold text-slate-900 dark:text-white">{t(R("catalog").title)}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">{t(R("catalog").desc)}</p>
          </div>

          {/* 24/7 */}
          <div className={`${card} ${lift} flex flex-col items-center justify-center gap-4 p-6 text-center`}>
            <Glossy tone="coral" size={60}>{t.num(24)}</Glossy>
            <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">{t(R("support").title)}</h3>
          </div>

          {/* Speed: two overlapping circles, the front one with a spark. */}
          <div className={`${card} ${lift} flex flex-col items-center justify-center p-7 text-center lg:row-span-2`}>
            <div className="relative h-36 w-40">
              <span className="absolute end-0 top-0 h-24 w-24 rounded-full bg-blue-200 dark:bg-blue-400/30" />
              <span className="absolute bottom-0 start-2 grid h-28 w-28 place-items-center rounded-full bg-gradient-to-b from-blue-400 to-blue-600 shadow-[0_18px_30px_-12px_rgba(37,99,235,.8)] ring-[6px] ring-white dark:ring-[#0E1424]">
                <Sparkles className="h-9 w-9 fill-white text-white" />
              </span>
            </div>
            <h3 className="mt-6 font-display text-xl font-bold text-slate-900 dark:text-white">{t(R("speed").title)}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">{t(R("speed").desc)}</p>
          </div>

          {/* Big number */}
          <div className={`${card} ${lift} col-span-2 flex flex-col items-center justify-center p-6 text-center sm:col-span-1`}>
            <BigNumber s={stat("orders")} run={seen} className="text-3xl text-blue-600 xl:text-4xl dark:text-blue-400" />
            <span className="mt-3 font-display text-base font-bold text-slate-900 dark:text-white">{t(stat("orders").label)}</span>
          </div>

          {/* No passwords */}
          <div className={`${card} ${lift} flex flex-col items-center justify-center gap-4 p-6 text-center`}>
            <Glossy icon={R("private").icon} tone="violet" size={60} />
            <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">{t(R("private").title)}</h3>
          </div>

          {/* Pay: icon at the side, text next to it (like the "earn" card in the reference). */}
          <div className={`${card} ${lift} col-span-2 flex items-center gap-5 p-6 sm:col-span-1`}>
            <Glossy icon={R("pay").icon} tone="green" size={68} />
            <div>
              <h3 className="font-display text-base font-bold text-slate-900 dark:text-white">{t(R("pay").title)}</h3>
              <p className="mt-1.5 text-xs leading-5 text-slate-600 dark:text-slate-400">{t("Wallet, bank card or crypto.")}</p>
            </div>
          </div>

          {/* Brand card */}
          <div className="relative col-span-2 flex min-h-[260px] items-center justify-center overflow-hidden rounded-[28px] bg-blue-600 text-white lg:row-span-2">
            <svg aria-hidden viewBox="0 0 600 400" preserveAspectRatio="none" className="absolute inset-0 h-full w-full opacity-40">
              {Array.from({ length: 22 }, (_, i) => (
                <path key={i} d={`M-20 ${330 - i * 6} C 140 ${120 + i * 9}, 300 ${470 - i * 10}, 620 ${60 + i * 7}`} fill="none" stroke="white" strokeWidth=".8" strokeOpacity={0.25 + (i % 4) * 0.12} />
              ))}
            </svg>
            <div aria-hidden className="absolute -end-20 -top-20 h-72 w-72 rounded-full bg-sky-300/30 blur-3xl" />
            <div className="relative flex items-center gap-5">
              <span className="grid h-20 w-20 place-items-center rounded-[28%] bg-white shadow-[0_18px_40px_-12px_rgba(0,0,0,.45)] sm:h-24 sm:w-24">
                <BrandMark className="h-12 w-12 text-blue-600 sm:h-14 sm:w-14" />
              </span>
              <Wordmark className="text-4xl sm:text-6xl" />
            </div>
          </div>

          {/* Refund */}
          <div className={`${card} ${lift} flex flex-col items-center justify-center gap-4 p-6 text-center`}>
            <Glossy icon={R("refund").icon} tone="green" size={60} />
            <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">{t(R("refund").title)}</h3>
          </div>

          {/* Seconds */}
          <div className={`${card} ${lift} flex flex-col items-center justify-center p-6 text-center`}>
            <BigNumber s={stat("speed")} run={seen} className={`text-5xl ${tone("blue").ink}`} />
            <span className="mt-3 text-sm font-semibold text-slate-700 dark:text-slate-300">{t(stat("speed").label)}</span>
          </div>

          {/* Years */}
          <div className={`${card} ${lift} col-span-2 flex flex-col items-center justify-center p-6 text-center`}>
            <BigNumber s={stat("years")} run={seen} className="text-6xl text-blue-600 dark:text-blue-400" />
            <span className="mt-3 font-display text-lg font-bold text-slate-900 dark:text-white">{t("Years of selling digital services")}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
