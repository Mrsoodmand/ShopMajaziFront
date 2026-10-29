"use client";
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { Bot, Send } from "lucide-react";
import { useMoney } from "@/lib/money";
import { checkUsername, cleanUsername, lookupUser, starPacks, starPrice, STAR_MIN } from "@/content/telegram-en";
import { PageShell } from "../otp/parts";
import { useHasExtras } from "../service/slot";
import { accent, field, H2, ring, StarGlyph, StarsCheckout, TgFaq, TgOrderView, Title, useStars } from "./parts";

// Stars E — "Bot Chat": buying feels like talking to a Telegram bot. The bot asks who gets the Stars and how many;
// you answer in the message box or tap a reply button. A summary card with Pay is the last message. The chat is a
// log region, so screen readers hear each new message.

type Msg = { from: "bot" | "me"; body: ReactNode; key: string };

export default function StarsE() {
  const usd = useMoney().format;
  const st = useStars();
  const extras = useHasExtras();
  const [step, setStep] = useState<"who" | "amount" | "pay">("who");
  const [draft, setDraft] = useState("");
  const [err, setErr] = useState<string>();
  const [log, setLog] = useState<Msg[]>([{ from: "bot", key: "hi", body: <>Hi! I send Telegram Stars to any account, no login needed. <strong>Who should get them?</strong> Send me a username.</> }]);
  const box = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  // Keep the newest message in view by scrolling the chat box only, never the page.
  useEffect(() => { const b = box.current; if (b) b.scrollTo({ top: b.scrollHeight, behavior: "smooth" }); }, [log]);

  if (st.order) return <PageShell><div className="px-6 py-14"><TgOrderView o={st.order} onAgain={st.reset} /></div></PageShell>;

  const say = (...m: Msg[]) => setLog((l) => [...l, ...m]);
  const pickAmount = (n: number) => {
    st.setAmount(n);
    say({ from: "me", key: `a${Date.now()}`, body: `${n.toLocaleString("en-US")} Stars` }, { from: "bot", key: `p${Date.now()}`, body: "pay" });
    setStep("pay");
  };
  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (step === "who") {
      const bad = checkUsername(draft);
      if (bad) { setErr(bad); return; }
      const u = lookupUser(cleanUsername(draft));
      st.r.set(draft); setErr(undefined); setDraft("");
      say({ from: "me", key: "u", body: `@${u.username}` }, { from: "bot", key: "amt", body: <>Found <strong>{u.name}</strong>. How many Stars? Tap one below or type a number ({STAR_MIN} or more).</> });
      setStep("amount");
    } else if (step === "amount") {
      const n = Number(draft.replace(/\D/g, ""));
      if (!(n >= STAR_MIN)) { setErr(`Send a number, ${STAR_MIN} or more`); return; }
      setErr(undefined); setDraft(""); pickAmount(n);
    }
  };
  const restart = () => { setStep("who"); setLog((l) => [l[0]]); st.r.set(""); setTimeout(() => input.current?.focus(), 0); };

  return (
    <PageShell>
      <div className="mx-auto max-w-2xl px-4 pb-24 pt-14 sm:px-6">
        <Title s="stars" center sub="Chat with our bot: a username, an amount, done.">{"Buy Telegram Stars"}</Title>

        <section aria-label="Stars bot" className="mt-10 overflow-hidden rounded-[2rem] border border-slate-200 bg-[#e6ebee] shadow-xl dark:border-white/10 dark:bg-[#0e1621]">
          <header className="flex items-center gap-3 bg-white px-5 py-3.5 dark:bg-[#17212b]">
            <span aria-hidden className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-amber-300 to-orange-500 text-white"><Bot className="h-5 w-5" /></span>
            <span><span className="block font-semibold text-slate-900 dark:text-white">ShopMajazi Stars</span><span className="block text-xs text-sky-600 dark:text-sky-400">bot · online</span></span>
          </header>

          <div ref={box} role="log" aria-live="polite" className="max-h-[480px] min-h-[360px] space-y-3 overflow-y-auto p-4 sm:p-5">
            {log.map((m) => m.body === "pay" ? (
              <div key={m.key} className="max-w-[85%] animate-fade-up rounded-2xl rounded-bl-md bg-white p-4 [animation-duration:300ms] dark:bg-[#182533]">
                <p className="text-slate-800 dark:text-slate-100">Here&apos;s your order:</p>
                <div className="mt-3 flex items-center gap-3 rounded-xl bg-amber-50 p-3 dark:bg-amber-400/10">
                  <StarGlyph className="h-8 w-8" />
                  <span className="min-w-0 flex-1"><span className="block font-display text-lg font-bold text-slate-900 dark:text-white">{st.amount.toLocaleString("en-US")} Stars</span><span className="block truncate text-sm text-slate-600 dark:text-slate-400">to @{cleanUsername(st.r.value)}</span></span>
                  <span className="font-display text-lg font-bold text-slate-900 dark:text-white">{usd(st.total)}</span>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <button type="button" onClick={st.proceed} className={`${accent.stars.btn} !py-2.5`}>Pay {usd(st.total)}</button>
                  <button type="button" onClick={restart} className={`rounded-xl border border-slate-300 py-2.5 font-semibold text-slate-800 dark:border-white/20 dark:text-slate-100 ${ring}`}>Start over</button>
                </div>
              </div>
            ) : (
              <div key={m.key} className={`flex animate-fade-up [animation-duration:300ms] ${m.from === "me" ? "justify-end" : ""}`}>
                <p className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-[15px] leading-snug ${m.from === "me" ? "rounded-br-md bg-[#effdde] text-slate-900 dark:bg-[#2b5278] dark:text-white" : "rounded-bl-md bg-white text-slate-800 dark:bg-[#182533] dark:text-slate-100"}`}>
                  <span className="sr-only">{m.from === "me" ? "You: " : "Bot: "}</span>{m.body}
                </p>
              </div>
            ))}
          </div>

          {step === "amount" && (
            <div className="grid grid-cols-4 gap-1.5 border-t border-slate-200 bg-white/60 p-2 dark:border-white/10 dark:bg-[#17212b]/60" role="group" aria-label="Quick amounts">
              {starPacks.map((n) => <button key={n} type="button" onClick={() => pickAmount(n)} className={`rounded-lg bg-white py-2 text-sm font-semibold text-slate-900 shadow-sm hover:bg-amber-50 dark:bg-[#182533] dark:text-white dark:hover:bg-[#22344a] ${ring}`}>{n.toLocaleString("en-US")}<span className="block text-xs font-normal text-slate-500">{usd(starPrice(n))}</span></button>)}
            </div>
          )}

          {step !== "pay" && (
            <form onSubmit={submit} className="border-t border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-[#17212b]">
              {err && <p id="bot-err" className="mb-2 px-1 text-sm font-semibold text-red-700 dark:text-red-400"><span className="sr-only">Error: </span>{err}</p>}
              <div className="flex gap-2">
                <label htmlFor="bot-input" className="sr-only">{step === "who" ? "Telegram username" : "Number of Stars"}</label>
                <input ref={input} id="bot-input" value={draft} onChange={(e) => setDraft(e.target.value)} inputMode={step === "amount" ? "numeric" : "text"} autoComplete="off" autoCapitalize="none" spellCheck={false}
                  placeholder={step === "who" ? "@username" : "e.g. 750"} aria-invalid={!!err} aria-describedby={err ? "bot-err" : undefined} className={`${field} !rounded-full`} />
                <button type="submit" aria-label="Send" className={`grid h-12 w-12 shrink-0 place-items-center rounded-full bg-sky-500 text-white hover:bg-sky-600 ${ring}`}><Send aria-hidden className="h-5 w-5" /></button>
              </div>
            </form>
          )}
        </section>

        {!extras && <section aria-labelledby="faq" className="mt-16"><H2 id="faq">Common questions</H2><div className="mt-6"><TgFaq s="stars" /></div></section>}
      </div>
      <StarsCheckout st={st} />
    </PageShell>
  );
}
