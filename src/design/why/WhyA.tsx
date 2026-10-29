import { reasons } from "@/content/why-en";

// Offer A — "Icon Grid": six reasons as cards in a 3 × 2 grid, each with a colored icon tile. Cards lift gently on hover.
export default function WhyA() {
  return (
    <section className="bg-white py-24 dark:bg-[#070B14]">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">Why ShopMajazi</span>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl dark:text-white">Built so you never have to wait or worry</h2>
        </div>
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {reasons.map((r) => (
            <div key={r.id} className="group rounded-3xl bg-slate-50 p-7 ring-1 ring-slate-200 transition duration-300 ease-out hover:-translate-y-1 hover:bg-white hover:shadow-xl hover:shadow-indigo-100 dark:bg-[#0E1424] dark:ring-white/10 dark:hover:shadow-black/40 motion-reduce:hover:translate-y-0">
              <span className={`grid h-12 w-12 place-items-center rounded-2xl transition duration-300 group-hover:scale-110 ${r.tint}`}><r.icon className="h-6 w-6" /></span>
              <h3 className="mt-5 font-display text-lg font-semibold text-slate-900 dark:text-white">{r.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">{r.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
