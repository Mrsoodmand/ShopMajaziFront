import { MousePointerClick, Wallet, Zap, Headphones } from "lucide-react";

const steps = [
  { icon: MousePointerClick, title: "Choose a service", desc: "Pick a number, account, subscription or growth package. Prices are shown up front.", note: "2,000+ services" },
  { icon: Wallet, title: "Pay your way", desc: "Pay by card or crypto, or use your wallet balance for one-click checkout.", note: "Card · Crypto · Wallet" },
  { icon: Zap, title: "Get it instantly", desc: "Delivery is automatic. Codes, logins and numbers appear in your dashboard.", note: "Avg. 30 seconds" },
  { icon: Headphones, title: "We've got your back", desc: "Something wrong? Automatic refunds, plus real people on support 24/7.", note: "Refund guarantee" },
];

// Offer A — "Step Row": classic four steps in a row joined by a dashed line. Clean, light, easy to scan.
export default function HowA() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-indigo-600">How to buy</span>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl">From click to delivered in under a minute</h2>
          <p className="mt-4 text-lg text-slate-600">No sign-up forms, no waiting for an operator. Four simple steps.</p>
        </div>

        <ol className="relative mt-16 grid gap-10 md:grid-cols-4 md:gap-6">
          <div aria-hidden className="absolute start-[12.5%] end-[12.5%] top-8 hidden border-t-2 border-dashed border-slate-200 md:block" />
          {steps.map((s, i) => (
            <li key={s.title} className="relative text-center">
              <div className="relative mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-white shadow-lg shadow-indigo-100 ring-1 ring-slate-200">
                <s.icon className="h-7 w-7 text-indigo-600" />
                <span className="absolute -end-2 -top-2 grid h-6 w-6 place-items-center rounded-full bg-indigo-600 text-xs font-bold text-white">{i + 1}</span>
              </div>
              <h3 className="mt-6 font-display text-lg font-semibold text-slate-900">{s.title}</h3>
              <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-slate-600">{s.desc}</p>
              <span className="mt-4 inline-block rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">{s.note}</span>
            </li>
          ))}
        </ol>

        <div className="mt-16 text-center">
          <a href="#" className="inline-flex rounded-full bg-slate-900 px-6 py-3.5 text-sm font-semibold text-white hover:bg-slate-800">Start your first order</a>
        </div>
      </div>
    </section>
  );
}
