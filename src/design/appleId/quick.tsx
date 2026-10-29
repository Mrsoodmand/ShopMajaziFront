"use client";
import { useId } from "react";
import { useMoney } from "@/lib/money";
import { methodInfo } from "@/content/apple-en";
import type { AppleState } from "./parts";

// Compact Ready / Custom switch for the minimal offers (F–J): a segmented control made of real radio buttons
// (arrow keys move between them), with price and delivery on each side.
export function MethodToggle({ a, size = "md" }: { a: AppleState; size?: "md" | "lg" }) {
  const usd = useMoney().format;
  const name = useId();
  return (
    <fieldset>
      <legend className="sr-only">Kind of Apple ID</legend>
      <div className="grid grid-cols-2 gap-1 rounded-2xl border border-slate-300 bg-slate-100 p-1 dark:border-white/15 dark:bg-white/5">
        {(["ready", "custom"] as const).map((m) => {
          const on = a.method === m;
          const info = methodInfo[m];
          return (
            <label key={m} className={`cursor-pointer rounded-xl text-center transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-sky-600 has-[:focus-visible]:ring-offset-2 dark:has-[:focus-visible]:ring-sky-400 dark:has-[:focus-visible]:ring-offset-[#070B14] ${size === "lg" ? "px-3 py-3.5" : "px-3 py-2.5"} ${on ? "bg-white text-slate-900 shadow-sm dark:bg-white dark:text-slate-900" : "text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"}`}>
              <input type="radio" autoComplete="off" name={name} checked={on} onChange={() => a.setMethod(m)} className="sr-only" />
              <span className="block font-semibold">{m === "ready" ? "Ready" : "Custom"}</span>
              <span className={`block text-sm ${on ? "text-slate-600" : "text-slate-600 dark:text-slate-400"}`}>{usd(info.price)} · {info.delivery}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

export const tagline = (a: AppleState) => methodInfo[a.method].tagline;
