"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { ChevronDown, Search, Check } from "lucide-react";

// Searchable dropdown: a big field that opens a filterable list. Arrow keys move, Enter picks, Escape closes.
export type ComboItem = { id: string; label: string; hint?: string; icon?: ReactNode; search?: string };

export default function Combo({ label, items, value, onChange, placeholder }: { label: string; items: ComboItem[]; value: string; onChange: (id: string) => void; placeholder: string }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(0);
  const box = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const cur = items.find((i) => i.id === value);
  const t = q.trim().toLowerCase();
  const list = t ? items.filter((i) => `${i.label} ${i.search ?? ""}`.toLowerCase().includes(t)) : items;

  useEffect(() => {
    if (!open) return;
    input.current?.focus();
    const h = (e: MouseEvent) => { if (!box.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [open]);

  const pick = (id: string) => { onChange(id); setOpen(false); setQ(""); };
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setSel((s) => Math.min(s + 1, list.length - 1)); }
    if (e.key === "ArrowUp") { e.preventDefault(); setSel((s) => Math.max(s - 1, 0)); }
    if (e.key === "Enter" && list[sel]) { e.preventDefault(); pick(list[sel].id); }
    if (e.key === "Escape") setOpen(false);
  };

  return (
    <div ref={box} className="relative">
      <button type="button" onClick={() => { setOpen((o) => !o); setSel(0); }} aria-expanded={open} aria-haspopup="listbox"
        className={`flex w-full items-center gap-3 rounded-2xl bg-white px-4 py-3 text-start ring-1 transition dark:bg-white/5 ${open ? "ring-2 ring-indigo-500" : "ring-slate-200 hover:ring-slate-300 dark:ring-white/10 dark:hover:ring-white/25"}`}>
        {cur?.icon}
        <span className="min-w-0 flex-1">
          <span className="block text-[11px] font-semibold uppercase tracking-wide text-slate-400">{label}</span>
          <span className="block truncate font-semibold text-slate-900 dark:text-white">{cur?.label ?? placeholder}</span>
        </span>
        <ChevronDown className={`h-5 w-5 text-slate-400 transition ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute inset-x-0 top-full z-50 mt-2 animate-fade-up overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-slate-200 [animation-duration:200ms] dark:bg-[#0E1424] dark:ring-white/10">
          <label className="flex items-center gap-2 border-b border-slate-100 px-4 dark:border-white/10">
            <Search className="h-4 w-4 text-slate-400" />
            <input ref={input} value={q} onChange={(e) => { setQ(e.target.value); setSel(0); }} onKeyDown={onKey} placeholder={`Search ${label.toLowerCase()}…`} aria-label={`Search ${label}`} className="h-11 flex-1 bg-transparent text-sm outline-none dark:text-white" />
          </label>
          <ul role="listbox" className="max-h-72 overflow-y-auto p-1.5">
            {list.length === 0 && <li className="px-3 py-6 text-center text-sm text-slate-500">No matches</li>}
            {list.map((i, n) => (
              <li key={i.id} role="option" aria-selected={i.id === value}>
                <button type="button" onMouseEnter={() => setSel(n)} onClick={() => pick(i.id)}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-start text-sm ${n === sel ? "bg-indigo-50 dark:bg-indigo-500/15" : ""}`}>
                  {i.icon}<span className="flex-1 truncate text-slate-800 dark:text-slate-100">{i.label}</span>
                  {i.hint && <span className="text-xs text-slate-500 dark:text-slate-400">{i.hint}</span>}
                  {i.id === value && <Check className="h-4 w-4 text-indigo-600 dark:text-indigo-300" />}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
