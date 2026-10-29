"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { Terminal, Copy, Check } from "lucide-react";
import { cheapest, offersFor, otpApps } from "@/content/otp-en";
import { useMoney } from "@/lib/money";
import Combo from "./Combo";
import { useOtpOrders, useCountdown, type Order } from "./order";
import { AppTile, CC, PageShell, WalletChip } from "./parts";

type Line = { t: string; text: string; tone?: "ok" | "warn" | "code" | "dim" };

// Turns an order's progress into console lines (number issued → polling → code / refund).
function useLog(order: Order | undefined) {
  const usd = useMoney().format;
  const [lines, setLines] = useState<Line[]>([]);
  const seen = useRef<string>("");
  useEffect(() => {
    if (!order) return;
    const stamp = () => new Date().toLocaleTimeString("en-GB");
    const key = order.id + order.status;
    if (seen.current === key) return;
    if (!seen.current.startsWith(order.id)) {
      setLines((l) => [...l,
        { t: stamp(), text: `$ get-number --app ${order.offer.app.id} --country ${order.offer.country.cc}`, tone: "dim" },
        { t: stamp(), text: `Paid ${usd(order.offer.price)} from wallet` },
        { t: stamp(), text: `Number issued: ${order.number}`, tone: "ok" },
        { t: stamp(), text: "Waiting for SMS… (refund after 20:00)", tone: "warn" },
      ]);
    }
    if (order.status === "received") setLines((l) => [...l, { t: stamp(), text: `SMS received from ${order.offer.app.name}`, tone: "ok" }, { t: stamp(), text: order.code ?? "", tone: "code" }]);
    if (order.status === "cancelled") setLines((l) => [...l, { t: stamp(), text: `Cancelled. ${usd(order.offer.price)} refunded to wallet`, tone: "warn" }]);
    seen.current = key;
  }, [order]);
  return lines;
}

// Page H — "Live Console": a dark, techy page. Choose app and country on the left; the right is a terminal that
// streams what's happening (payment, number issued, polling, code) in real time. Built for developers and power users.
export default function OtpH() {
  const usd = useMoney().format;
  const [appId, setAppId] = useState("telegram");
  const [cc, setCc] = useState(() => cheapest("telegram").country.cc);
  const { orders, buy, cancel } = useOtpOrders();
  const offers = useMemo(() => [...offersFor(appId)].sort((a, b) => a.price - b.price), [appId]);
  const offer = offers.find((o) => o.country.cc === cc)!;
  const cur = orders[0];
  const lines = useLog(cur);
  const { text } = useCountdown(cur?.expiresAt ?? 0, cur?.status === "waiting");
  const [copied, setCopied] = useState(false);
  const scroller = useRef<HTMLDivElement>(null);
  useEffect(() => { scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: "smooth" }); }, [lines.length]);

  return (
    <PageShell>
      <section className="dark relative overflow-hidden bg-[#070B14] text-white">
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,.04)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_75%)]" />
        <div aria-hidden className="pointer-events-none absolute -top-40 end-0 h-[480px] w-[700px] rounded-full bg-indigo-600/25 blur-[120px]" />
        <div className="relative mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)] gap-10 px-6 py-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
          <div>
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-cyan-300">Virtual numbers · SMS API</span>
            <h1 className="mt-4 font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl">Get a number.<br /><span className="text-slate-500">Watch the code arrive.</span></h1>
            <div className="mt-8 space-y-3">
              <Combo label="App" value={appId} onChange={(id) => { setAppId(id); setCc(cheapest(id).country.cc); }} placeholder="Choose app"
                items={otpApps.map((a) => ({ id: a.id, label: a.name, hint: `from ${usd(cheapest(a.id).price)}`, icon: <AppTile app={a} size="sm" /> }))} />
              <div>
                <div className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">Cheapest countries</div>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {offers.slice(0, 8).map((o) => (
                    <button key={o.country.cc} onClick={() => setCc(o.country.cc)} className={`flex flex-col items-start gap-1 rounded-xl p-3 text-start ring-1 transition ${o.country.cc === cc ? "bg-indigo-500/20 ring-indigo-400" : "bg-white/[.03] ring-white/10 hover:ring-white/25"}`}>
                      <CC cc={o.country.cc} flag={o.country.flag} /><span className="truncate text-xs text-slate-400">{o.country.name}</span><span className="font-mono text-sm font-semibold">{usd(o.price)}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between gap-4 pt-2">
                <WalletChip />
                <button onClick={() => buy(offer)} className="rounded-xl bg-indigo-500 px-6 py-3.5 font-semibold transition hover:bg-indigo-400">Run · {usd(offer.price)}</button>
              </div>
            </div>
          </div>

          <div className="flex min-h-[460px] flex-col overflow-hidden rounded-2xl border border-white/10 bg-black/40 shadow-2xl shadow-indigo-950/50 backdrop-blur">
            <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
              <span className="h-3 w-3 rounded-full bg-rose-500/80" /><span className="h-3 w-3 rounded-full bg-amber-400/80" /><span className="h-3 w-3 rounded-full bg-emerald-400/80" />
              <span className="ms-3 flex items-center gap-1.5 font-mono text-xs text-slate-500"><Terminal className="h-3.5 w-3.5" />shopmajazi — sms</span>
              {cur?.status === "waiting" && <span className="ms-auto font-mono text-xs text-amber-300">{text}</span>}
            </div>
            <div ref={scroller} className="flex-1 space-y-1.5 overflow-y-auto p-5 font-mono text-sm" aria-live="polite">
              {lines.length === 0 && <div className="text-slate-500">Ready. Choose an app and a country, then press Run.<span className="ms-1 inline-block h-4 w-2 animate-pulse bg-slate-500 align-middle" /></div>}
              {lines.map((l, i) => l.tone === "code" ? (
                <div key={i} className="my-3 flex animate-fade-up items-center justify-between rounded-xl bg-emerald-500/15 px-4 py-3 ring-1 ring-emerald-400/30 [animation-duration:300ms]">
                  <span className="text-3xl font-bold tracking-[0.3em] text-emerald-300">{l.text}</span>
                  <button onClick={() => { navigator.clipboard?.writeText(l.text.replace(/\s/g, "")); setCopied(true); setTimeout(() => setCopied(false), 1500); }} aria-label="Copy code" className="grid h-9 w-9 place-items-center rounded-lg bg-white/10 hover:bg-white/20">{copied ? <Check className="h-4 w-4 text-emerald-300" /> : <Copy className="h-4 w-4" />}</button>
                </div>
              ) : (
                <div key={i} className="flex animate-fade-up gap-3 [animation-duration:250ms]">
                  <span className="shrink-0 text-slate-600">{l.t}</span>
                  <span className={l.tone === "ok" ? "text-emerald-300" : l.tone === "warn" ? "text-amber-300" : l.tone === "dim" ? "text-slate-400" : "text-slate-200"}>{l.text}</span>
                </div>
              ))}
            </div>
            {cur?.status === "waiting" && (
              <div className="flex justify-end border-t border-white/10 px-4 py-2"><button onClick={() => cancel(cur.id)} className="font-mono text-xs text-slate-400 hover:text-rose-300">$ cancel --refund</button></div>
            )}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
