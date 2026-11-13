"use client";

import { useT } from "@/i18n/client";
import { BigNumber, Glossy, REASONS, STATS, WhyHeading, useInView } from "./parts";

// Offer I — "Icon Shelf": the calm one. Six big glossy icons on a single white shelf, each with its title and one
// line under it; the icons bob gently one after another, and tilt up when pointed at. A strip of four big blue
// numbers that count up sits underneath.
export default function WhyI() {
  const t = useT();
  const [ref, seen] = useInView();

  return (
    <section className="bg-white py-24 dark:bg-[#070B14]">
      <div ref={ref} className="mx-auto max-w-6xl px-6">
        <WhyHeading center title="Everything a careful buyer looks for" />

        <div className="mt-14 grid grid-cols-2 gap-x-6 gap-y-12 rounded-[32px] bg-[#F5F6FB] px-6 py-12 ring-1 ring-slate-200/70 sm:grid-cols-3 lg:grid-cols-6 dark:bg-white/[.03] dark:ring-white/10">
          {REASONS.map((r, i) => (
            <div key={r.id} className="group flex flex-col items-center text-center">
              <span className="animate-[why-bob_6s_ease-in-out_infinite]" style={{ animationDelay: `${i * 0.5}s` }}>
                <Glossy icon={r.icon} tone={r.tone} size={76} className="transition duration-300 ease-out group-hover:-translate-y-1 group-hover:-rotate-6 group-hover:scale-105 motion-reduce:group-hover:transform-none" />
              </span>
              <h3 className="mt-6 font-display text-base font-bold text-slate-900 dark:text-white">{t(r.title)}</h3>
              <p className="mt-2 text-[13px] leading-6 text-slate-600 dark:text-slate-400">{t(r.desc)}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-2 divide-slate-200 rounded-[32px] ring-1 ring-slate-200/70 lg:grid-cols-4 lg:divide-x lg:rtl:divide-x-reverse dark:divide-white/10 dark:ring-white/10">
          {STATS.map((s) => (
            <div key={s.id} className="flex flex-col items-center px-4 py-8 text-center">
              <BigNumber s={s} run={seen} className="text-3xl text-blue-600 sm:text-4xl dark:text-blue-400" />
              <span className="mt-2 text-sm font-medium text-slate-600 dark:text-slate-400">{t(s.label)}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
