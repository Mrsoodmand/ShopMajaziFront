"use client";

import { useState } from "react";
import { Smartphone, Phone, Apple, Sparkles, Users, CalendarClock, ShieldCheck, type LucideIcon } from "lucide-react";
import { seoIntro, seoSections } from "@/content/seo-en";
import Body from "./Body";

const icons: Record<string, LucideIcon> = {
  "virtual-number": Smartphone, "google-voice": Phone, "rent-number": CalendarClock, "apple-id": Apple,
  subscriptions: Sparkles, "social-growth": Users, "why-shopmajazi": ShieldCheck,
};
const short: Record<string, string> = {
  "virtual-number": "Virtual numbers", "google-voice": "Google Voice", "rent-number": "Rent a number", "apple-id": "Apple ID",
  subscriptions: "Subscriptions", "social-growth": "Social growth", "why-shopmajazi": "Why us",
};

// Offer E — "Knowledge Tabs": a vertical topic menu with one panel open at a time, styled to match hero G.
// Hidden panels stay in the HTML (just not displayed), so search engines read every topic.
export default function SeoE() {
  const [id, setId] = useState(seoSections[0].id);
  return (
    <section className="relative overflow-hidden bg-[#F5F6FB] py-24">
      <div aria-hidden className="pointer-events-none absolute -bottom-20 start-[5%] h-80 w-80 rounded-full bg-fuchsia-300/30 blur-[110px]" />
      <div className="relative mx-auto max-w-6xl px-6">
        <div className="max-w-3xl">
          <span className="text-sm font-semibold uppercase tracking-widest text-indigo-600">Learn more</span>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">{seoIntro.heading}</h2>
          <p className="mt-5 text-lg leading-8 text-slate-600">{seoIntro.lead}</p>
        </div>

        <div className="mt-12 grid gap-6 rounded-3xl border border-white bg-white/80 p-3 shadow-xl shadow-indigo-100 backdrop-blur-xl lg:grid-cols-[260px_1fr]">
          <div role="tablist" aria-orientation="vertical" className="flex gap-1 overflow-x-auto rounded-2xl bg-slate-100/80 p-1 lg:flex-col">
            {seoSections.map((s) => {
              const Icon = icons[s.id];
              const on = s.id === id;
              return (
                <button key={s.id} role="tab" aria-selected={on} aria-controls={`e-${s.id}`} onClick={() => setId(s.id)}
                  className={`flex shrink-0 items-center gap-3 whitespace-nowrap rounded-xl px-4 py-3 text-start text-sm font-medium transition ${on ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}>
                  <Icon className={`h-4 w-4 ${on ? "text-indigo-600" : ""}`} />{short[s.id]}
                </button>
              );
            })}
          </div>

          <div className="p-4 sm:p-8">
            {seoSections.map((s) => (
              <section key={s.id} id={`e-${s.id}`} role="tabpanel" hidden={s.id !== id} className="animate-fade-up">
                <h3 className="font-display text-2xl font-semibold text-slate-900">{s.heading}</h3>
                <Body s={s} />
              </section>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
