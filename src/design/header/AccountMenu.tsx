"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { UserRound, Wallet, LogOut, ListOrdered, Plus } from "lucide-react";
import Link from "@/i18n/Link";
import { stripLocale } from "@/i18n/config";
import { TOP_UP_HREF, useAccount } from "@/lib/account";
import { toman } from "@/lib/money";
import { useT } from "@/i18n/client";

// "/login?next=<this page>", so signing in comes back here.
function useLoginHref() {
  const path = stripLocale(usePathname() || "/");
  return path === "/login" || path === "/" ? "/login" : `/login?next=${encodeURIComponent(path)}`;
}

// Header account slot. Guests: the "Sign in / Sign up" button. Signed in: wallet balance + initial, opening a menu
// with the wallet, orders (old user panel) and Sign out.
// `outline` (header G): an outlined pill — "My account" with the balance in a small chip.
export function AccountButton({ label, outline = false }: { label: string; outline?: boolean }) {
  const t = useT();
  const account = useAccount();
  const loginHref = useLoginHref();
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const away = (e: MouseEvent) => !box.current?.contains(e.target as Node) && setOpen(false);
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", away);
    document.addEventListener("keydown", esc);
    return () => { document.removeEventListener("mousedown", away); document.removeEventListener("keydown", esc); };
  }, [open]);

  if (account.status !== "user" || !account.user) {
    if (outline)
      return (
        <Link href={loginHref} className={`ms-1 hidden h-10 items-center gap-2 whitespace-nowrap rounded-full border border-slate-200 px-4 text-sm font-semibold text-slate-800 transition hover:border-slate-300 hover:bg-slate-50 dark:border-white/10 dark:text-white dark:hover:border-white/20 dark:hover:bg-white/[.04] sm:flex ${account.status === "loading" ? "opacity-0" : ""}`}>
          <UserRound className="h-4 w-4 text-slate-500 dark:text-slate-400" />{label}
        </Link>
      );
    return (
      <Link href={loginHref} className={`ms-1 hidden items-center gap-2 rounded-full bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-600/25 hover:bg-indigo-700 sm:flex ${account.status === "loading" ? "opacity-0" : ""}`}>
        <UserRound className="h-4 w-4" />{label}
      </Link>
    );
  }
  const { user } = account;
  return (
    <div ref={box} className="relative ms-1 hidden sm:block">
      {outline ? (
        <button onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-haspopup="menu"
          className="flex h-10 items-center gap-2.5 whitespace-nowrap rounded-full border border-slate-200 pe-1.5 ps-4 text-sm font-semibold text-slate-800 transition hover:border-slate-300 hover:bg-slate-50 dark:border-white/10 dark:text-white dark:hover:border-white/20 dark:hover:bg-white/[.04]">
          {t("My account")}
          <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-bold tabular-nums text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-200">{toman(account.wallet ?? 0, t.locale)}</span>
        </button>
      ) : (
        <button onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-haspopup="menu"
          className="flex items-center gap-2 rounded-full bg-white py-1.5 pe-1.5 ps-3.5 text-sm font-semibold text-slate-800 ring-1 ring-slate-200 transition hover:ring-slate-300 dark:bg-white/10 dark:text-white dark:ring-white/15">
          <Wallet className="h-4 w-4 text-slate-500 dark:text-slate-300" />{toman(account.wallet ?? 0, t.locale)}
          <span className="grid h-7 w-7 place-items-center rounded-full bg-indigo-600 text-xs font-bold text-white">{user.name.trim().charAt(0).toUpperCase()}</span>
        </button>
      )}
      <div role="menu" className={`absolute end-0 top-full mt-3 w-72 rounded-2xl bg-white p-2 shadow-2xl shadow-slate-900/15 ring-1 ring-slate-200 transition-all duration-200 dark:bg-[#0E1424] dark:shadow-black/50 dark:ring-white/10 ${open ? "visible translate-y-0 opacity-100" : "invisible -translate-y-1 opacity-0"}`}>
        <div className="px-3 pb-3 pt-2">
          <div className="truncate font-semibold text-slate-900 dark:text-white">{user.name}</div>
          <div dir="ltr" className="text-start font-mono text-xs text-slate-500 dark:text-slate-400">{user.mobile}</div>
        </div>
        <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-3 dark:bg-white/5">
          <span><span className="block text-xs text-slate-500 dark:text-slate-400">{t("Wallet")}</span><b className="font-display text-slate-900 dark:text-white">{toman(account.wallet ?? 0, t.locale)}</b></span>
          <a href={TOP_UP_HREF} role="menuitem" className="flex items-center gap-1 rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold text-white hover:bg-indigo-700"><Plus className="h-3.5 w-3.5" />{t("Top up")}</a>
        </div>
        <a href="/user/orders" role="menuitem" className="mt-1 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-white/5"><ListOrdered className="h-4 w-4 text-slate-400" />{t("My orders")}</a>
        <button role="menuitem" onClick={() => { setOpen(false); account.signOut(); }} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-start text-sm text-slate-700 hover:bg-rose-50 hover:text-rose-700 dark:text-slate-200 dark:hover:bg-rose-500/10 dark:hover:text-rose-300"><LogOut className="h-4 w-4 text-slate-400 rtl:rotate-180" />{t("Sign out")}</button>
      </div>
    </div>
  );
}

// The same, for the bottom of the phone menu.
export function AccountMobile({ label, onClose }: { label: string; onClose: () => void }) {
  const t = useT();
  const account = useAccount();
  const loginHref = useLoginHref();
  if (account.status !== "user" || !account.user) {
    return <Link href={loginHref} onClick={onClose} className="block rounded-xl bg-indigo-600 py-3 text-center text-sm font-semibold text-white">{label}</Link>;
  }
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between rounded-xl bg-white/60 px-3 py-2.5 ring-1 ring-slate-200 dark:bg-white/5 dark:ring-white/10">
        <span className="min-w-0"><span className="block truncate text-sm font-semibold">{account.user.name}</span><span className="block text-xs opacity-70">{t("Wallet")}{" "}{toman(account.wallet ?? 0, t.locale)}</span></span>
        <a href={TOP_UP_HREF} className="shrink-0 rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold text-white">{t("Top up")}</a>
      </div>
      <button onClick={() => { onClose(); account.signOut(); }} className="w-full rounded-xl py-2.5 text-sm font-medium opacity-80 ring-1 ring-slate-200 dark:ring-white/10">{t("Sign out")}</button>
    </div>
  );
}
