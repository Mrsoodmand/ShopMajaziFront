"use client";

import { useId } from "react";
import { Check } from "lucide-react";
import { AdContentFields, AdErrors, AdsNightPage, AudienceFields, CpmBudgetFields, hasFocusRing, muted, optOff, optOn, Panel, ScheduleFields, targets, useAdForm, type Ad, type Target } from "./adsKit";

// Ads I — "Where It Shows": the page starts with the one choice that can't be changed later. Each placement is a
// large tile with a small drawing of where the ad lands (under a channel post, inside a bot, at the top of search,
// in front of people by country); the sidebar preview redraws itself for the chosen place. Ad, budget and schedule
// follow. Green Continue in the sidebar.

const ad = "rounded-[5px] bg-sky-400/70";
const line = "h-1.5 rounded-full bg-white/20";

function Scene({ t, on }: { t: Target; on: boolean }) {
  const hl = on ? "bg-sky-400" : "bg-sky-400/60";
  return (
    <span aria-hidden className="block h-24 overflow-hidden rounded-xl bg-[#0e1621] p-2.5">
      {t === "channels" && (
        <span className="flex h-full flex-col justify-end gap-1.5">
          <span className="w-4/5 space-y-1 rounded-md bg-[#182533] p-1.5"><span className={`block w-full ${line}`} /><span className={`block w-2/3 ${line}`} /></span>
          <span className={`block h-6 w-4/5 ${ad} ${hl}`} />
        </span>
      )}
      {t === "bots" && (
        <span className="flex h-full flex-col gap-1.5">
          <span className="flex items-center gap-1.5"><span className="h-4 w-4 rounded-full bg-violet-400/70" /><span className={`block w-10 ${line}`} /></span>
          <span className={`block h-6 w-3/4 ${ad} ${hl}`} />
          <span className="ms-auto w-1/2 rounded-md bg-[#2b5278] p-1.5"><span className={`block ${line}`} /></span>
        </span>
      )}
      {t === "search" && (
        <span className="flex h-full flex-col gap-1.5">
          <span className="block h-4 rounded-full bg-black/40" />
          <span className={`flex h-6 items-center gap-1.5 px-1.5 ${ad} ${hl}`}><span className="h-3.5 w-3.5 rounded-full bg-white/70" /><span className="block h-1.5 w-1/2 rounded-full bg-white/70" /></span>
          <span className="flex items-center gap-1.5 px-1.5"><span className="h-3.5 w-3.5 rounded-full bg-white/15" /><span className={`block w-1/3 ${line}`} /></span>
        </span>
      )}
      {t === "users" && (
        <span className="grid h-full grid-cols-6 place-items-center gap-1">
          {Array.from({ length: 18 }, (_, i) => <span key={i} className={`h-3.5 w-3.5 rounded-full ${[2, 3, 7, 8, 9, 14].includes(i) ? hl : "bg-white/15"}`} />)}
        </span>
      )}
    </span>
  );
}

function PlacementTiles({ a }: { a: Ad }) {
  const name = useId();
  return (
    <fieldset>
      <legend className="sr-only">Where to show the ad</legend>
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {targets.map((t) => {
          const on = a.target === t.id;
          return (
            <label key={t.id} className={`relative flex cursor-pointer flex-col gap-3 rounded-2xl border-2 p-3 transition-colors ${hasFocusRing} ${on ? optOn : optOff}`}>
              <input type="radio" name={name} checked={on} onChange={() => a.setTarget(t.id)} className="sr-only" />
              <Scene t={t.id} on={on} />
              <span className="px-1 pb-1">
                <span className="flex items-center justify-between gap-2 font-semibold text-white">{t.label}{on && <span className="grid h-5 w-5 place-items-center rounded-full bg-sky-400"><Check aria-hidden className="h-3 w-3 text-[#0a1930]" strokeWidth={3} /></span>}</span>
                <span className={`mt-0.5 block text-sm leading-snug ${muted}`}>{t.hint}</span>
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

export default function AdsI() {
  const a = useAdForm();
  return (
    <AdsNightPage ad={a} left={<>
      <AdErrors ad={a} />
      <Panel id={`${a.p}-where`} title="Where should people see it?"><PlacementTiles a={a} /><AudienceFields ad={a} /></Panel>
      <Panel id={`${a.p}-ad`} title="Your ad"><AdContentFields ad={a} /></Panel>
      <Panel id={`${a.p}-money`} title="Budget and schedule"><CpmBudgetFields ad={a} /><ScheduleFields ad={a} /></Panel>
    </>} />
  );
}
