"use client";

import { useState } from "react";
import { RotateCcw } from "lucide-react";
import { extrasFor } from "@/content/service-extras-en";
import { LocaleProvider, useT } from "@/i18n/client";
import type { Locale } from "@/i18n/config";
import HowToSteps, { type StepsDetail, type StepsMotion } from "./HowToSteps";
import type { GlowTone } from "./HeaderGlow";
import s from "./stepsMotion.module.css";

// Comparison frames for the "How to use" motion (registry section "steps-motion"). Each plays when scrolled into
// view; Replay plays it again, the service tabs show it with that service's own steps (3 or 4), and the language
// switch shows it right-to-left in Persian.

const services = ["virtual-number", "rent-number", "google-voice", "apple-id", "subscriptions", "telegram-stars"];
// Each live page's colour (its ExtrasSlot glow); Telegram pages have none and use the brand indigo.
const toneOf: Record<string, GlowTone | undefined> = { "virtual-number": "violet", "rent-number": "amber", "google-voice": "emerald", "apple-id": "sky", subscriptions: "rose" };

function Frame({ motion, detail }: { motion: StepsMotion; detail?: StepsDetail }) {
  const [lang, setLang] = useState<Locale>("fa");
  return (
    <LocaleProvider locale={lang}>
      <div lang={lang} dir={lang === "fa" ? "rtl" : "ltr"} className={lang === "fa" ? s.fa : undefined}>
        <Inner motion={motion} detail={detail} lang={lang} setLang={setLang} />
      </div>
    </LocaleProvider>
  );
}

function Inner({ motion, detail, lang, setLang }: { motion: StepsMotion; detail?: StepsDetail; lang: Locale; setLang: (l: Locale) => void }) {
  const tx = useT();
  const [service, setService] = useState(services[0]);
  const [replay, setReplay] = useState(0);
  const chip = (on: boolean) => `rounded-full border px-3 py-1 text-xs ${on ? "border-emerald-700 bg-emerald-700 text-white" : "border-slate-300 text-slate-700 hover:bg-white dark:border-white/20 dark:text-slate-300 dark:hover:bg-white/10"}`;
  return (
    <div className="bg-slate-50 py-14 dark:bg-[#0A0F1C]">
      <div className="mx-auto mb-10 flex max-w-6xl flex-wrap items-center gap-2 px-4 sm:px-6">
        {services.map((id) => (
          <button key={id} type="button" onClick={() => { setService(id); setReplay((r) => r + 1); }} className={chip(service === id)}>
            {extrasFor(id, tx).name}
          </button>
        ))}
        <div className="ms-auto flex items-center gap-2">
          <button type="button" onClick={() => { setLang(lang === "fa" ? "en" : "fa"); setReplay((r) => r + 1); }} className={chip(false)}>
            {lang === "fa" ? "English" : "فارسی"}
          </button>
          <button type="button" onClick={() => setReplay((r) => r + 1)}
            className="flex items-center gap-1.5 rounded-full bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-700 dark:bg-white dark:text-slate-900">
            <RotateCcw className="h-3.5 w-3.5" />{lang === "fa" ? "پخش دوباره" : "Replay"}
          </button>
        </div>
      </div>
      {/* E (chosen) shows the live card design; the others keep the plain card they were drawn on. */}
      <HowToSteps key={`${service}-${replay}`} service={service} motion={motion} preview replay={replay}
        look={motion === "e" ? "tone" : "classic"} tone={toneOf[service]} detail={detail} />
    </div>
  );
}

export const MotionA = () => <Frame motion="a" />;
export const MotionB = () => <Frame motion="b" />;
export const MotionC = () => <Frame motion="c" />;
export const MotionD = () => <Frame motion="d" />;
export const MotionE = () => <Frame motion="e" />;
export const MotionF = () => <Frame motion="f" />;
export const MotionG = () => <Frame motion="g" />;
export const MotionH = () => <Frame motion="h" />;
export const MotionI = () => <Frame motion="i" />;
export const MotionJ = () => <Frame motion="j" />;

// Card-detail motion on the chosen card (registry section "steps-detail"), each on top of entrance E.
export const DetailFill = () => <Frame motion="e" detail="fill" />;
export const DetailRelay = () => <Frame motion="e" detail="relay" />;
export const DetailWalk = () => <Frame motion="e" detail="walk" />;
export const DetailRoll = () => <Frame motion="e" detail="roll" />;
export const DetailSheen = () => <Frame motion="e" detail="sheen" />;
