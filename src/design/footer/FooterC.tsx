"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Mail } from "lucide-react";
import { copyright, legalLinks } from "@/content/footer-en";
import { LangSwitch, Logo } from "../header/shared";
import { Columns, Payments, Socials, TrustSeals } from "./parts";

// Offer C — "Dark Newsletter": always dark, like hero A. A newsletter signup for deals and guides, a live
// "all systems operational" status, link columns, and slots for official trust seals.
export default function FooterC() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <footer className="relative overflow-hidden bg-[#070B14] text-white">
      <div aria-hidden className="pointer-events-none absolute -top-40 start-1/4 h-80 w-[600px] rounded-full bg-indigo-600/20 blur-[120px]" />
      <div className="relative mx-auto max-w-7xl px-6">
        <div className="grid gap-8 border-b border-white/10 py-14 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="font-display text-2xl font-bold sm:text-3xl">Deals and guides, once a week.</h2>
            <p className="mt-2 text-slate-400">New services, price drops and how-tos. No spam, unsubscribe any time.</p>
          </div>
          {/* Preview only: the real form will post to the newsletter endpoint. */}
          <form onSubmit={(e) => { e.preventDefault(); if (email.includes("@")) setSent(true); }} className="flex gap-2 rounded-2xl bg-white/5 p-2 ring-1 ring-white/10 focus-within:ring-indigo-400/60">
            <label className="flex flex-1 items-center gap-3 px-3">
              <Mail className="h-4 w-4 shrink-0 text-slate-500" />
              <input type="email" required value={email} onChange={(e) => { setEmail(e.target.value); setSent(false); }} placeholder="you@example.com" aria-label="Email address"
                className="h-11 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-slate-500" />
            </label>
            <button className={`flex items-center gap-1.5 rounded-xl px-5 text-sm font-semibold transition ${sent ? "bg-emerald-500" : "bg-indigo-500 hover:bg-indigo-400"}`}>
              {sent ? <><Check className="h-4 w-4" />Subscribed</> : "Subscribe"}
            </button>
          </form>
        </div>

        <div className="grid gap-12 py-14 lg:grid-cols-[1fr_2.2fr]">
          <div>
            <Logo dark />
            <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-300 ring-1 ring-emerald-500/20">
              <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" /><span className="relative h-2 w-2 rounded-full bg-emerald-400" /></span>
              All systems operational
            </div>
            <div className="mt-6"><Socials dark /></div>
            <div className="mt-6"><TrustSeals dark /></div>
          </div>
          <Columns dark />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 py-6 text-xs text-slate-400">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <span>{copyright}</span>
            {legalLinks.map((l) => <Link key={l.href} href={l.href} className="hover:text-white">{l.label}</Link>)}
          </div>
          <div className="flex items-center gap-3"><Payments dark /><LangSwitch dark /></div>
        </div>
      </div>
    </footer>
  );
}
