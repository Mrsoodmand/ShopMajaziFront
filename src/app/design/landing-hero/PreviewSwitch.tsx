"use client";

import { setHeroPreview } from "@/design/service/spotlight";

export default function PreviewSwitch({ on, locked }: { on: boolean; locked: boolean }) {
  if (locked) return <p className="text-sm font-semibold text-emerald-400">Chosen: every landing page now uses this hero.</p>;
  return (
    <div className="inline-flex rounded-full border border-white/15 p-1 text-sm font-semibold">
      <button type="button" aria-pressed={!on} onClick={() => on && setHeroPreview(false)} className={`rounded-full px-4 py-1.5 ${!on ? "bg-white text-slate-900" : "text-slate-300 hover:text-white"}`}>Current hero</button>
      <button type="button" aria-pressed={on} onClick={() => !on && setHeroPreview(true)} className={`rounded-full px-4 py-1.5 ${on ? "bg-emerald-400 text-emerald-950" : "text-slate-300 hover:text-white"}`}>New hero (preview)</button>
    </div>
  );
}
