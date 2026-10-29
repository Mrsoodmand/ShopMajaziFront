"use client";
import { useRef } from "react";
import { X } from "lucide-react";
import { useMoney } from "@/lib/money";
import { fromPrice } from "@/content/subs-en";
import { PageShell } from "../otp/parts";
import { ring } from "../googleVoice/clean";
import { CatChips, ProductPanel, SearchBox, SubsCheckout, SubsFaq, SubsOrderView, SubsTitle, Tile, useCatalog, useSubs } from "./parts";

// Page B — "Grid + Sheet": a compact app-store grid (icon, name, price) that fits many services on one screen.
// Tapping one opens a sheet (bottom sheet on phones, centered on desktop) with its plans, fields and Continue.
// The sheet is a native <dialog>: focus stays inside, Escape closes it, focus returns to the tile.
export default function SubsB({ slug }: { slug?: string }) {
  const usd = useMoney().format;
  const s = useSubs(slug);
  const c = useCatalog();
  const sheet = useRef<HTMLDialogElement>(null);
  if (s.order) return <PageShell><div className="px-6 py-14"><SubsOrderView s={s} /></div></PageShell>;

  const open = (p: Parameters<typeof s.select>[0]) => { s.select(p); sheet.current?.showModal(); };
  // Close the sheet only when the fields are fine and payment opens.
  const buy = () => { if (s.proceed()) sheet.current?.close(); };

  return (
    <PageShell>
      <div className="mx-auto max-w-6xl px-4 pb-24 pt-10 sm:px-6 sm:pt-14">
        <SubsTitle>Subscriptions</SubsTitle>
        <div className="mt-6 space-y-4"><SearchBox c={c} className="max-w-md" /><CatChips c={c} /></div>

        <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {c.list.map((p) => (
            <li key={p.slug}>
              <button onClick={() => open(p)} aria-haspopup="dialog"
                className={`flex h-full w-full flex-col items-center rounded-3xl border border-slate-200 bg-white p-4 text-center transition hover:-translate-y-0.5 hover:border-violet-400 hover:shadow-md dark:border-white/15 dark:bg-[#0E1424] dark:hover:border-violet-400 ${ring}`}>
                <Tile p={p} size="lg" />
                <span className="mt-3 font-semibold leading-tight text-slate-900 dark:text-white">{p.name}</span>
                <span className="mt-1 text-sm text-slate-600 dark:text-slate-400">from {usd(fromPrice(p))}/mo</span>
              </button>
            </li>
          ))}
        </ul>
        {c.list.length === 0 && <p className="mt-6 text-slate-600 dark:text-slate-400">Nothing matches “{c.q}”.</p>}

        <section aria-labelledby="faq" className="mt-20 max-w-3xl"><h2 id="faq" className="font-display text-2xl font-bold text-slate-900 dark:text-white">Common questions</h2><div className="mt-6"><SubsFaq /></div></section>
      </div>

      <dialog ref={sheet} aria-label={s.product?.name ?? "Subscription"}
        className="m-0 mt-auto w-full max-w-none rounded-t-[2rem] bg-white p-0 text-slate-900 backdrop:bg-slate-950/50 backdrop:backdrop-blur-sm sm:m-auto sm:max-w-lg sm:rounded-[2rem] dark:bg-[#0B1020] dark:text-white">
        <div className="max-h-[88vh] overflow-y-auto p-6">
          <div className="flex justify-end"><button onClick={() => sheet.current?.close()} aria-label="Close" className={`grid h-10 w-10 place-items-center rounded-full bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-slate-200 ${ring}`}><X aria-hidden className="h-5 w-5" /></button></div>
          {s.product && <ProductPanel key={s.product.slug} s={s} cols={1} onBuy={buy} />}
        </div>
      </dialog>
      <SubsCheckout s={s} />
    </PageShell>
  );
}
