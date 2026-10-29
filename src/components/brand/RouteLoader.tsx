"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useT } from "@/i18n/client";
import { LoaderMark } from "./Brand";

// Page-change loader. A click on a link to another page of this site starts it; it shows only if the new page
// takes longer than DELAY (so quick changes never flash), and it ends when the URL changes. Same-page anchors,
// new tabs, downloads, modified clicks, other sites and links inside [data-no-loader] are ignored. A safety
// timeout clears it if a navigation never lands.
const DELAY = 150;
const GIVE_UP = 12000;

export default function RouteLoader() {
  const t = useT();
  const pathname = usePathname();
  const search = useSearchParams();
  const [pending, setPending] = useState(false);
  const [visible, setVisible] = useState(false);
  const timers = useRef<number[]>([]);

  const clear = () => { timers.current.forEach(clearTimeout); timers.current = []; };

  // The URL changed: the new page is here.
  useEffect(() => { clear(); setPending(false); setVisible(false); }, [pathname, search]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a");
      if (!a || !a.href || a.hasAttribute("download") || a.closest("[data-no-loader]") || (a.target && a.target !== "_self")) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin) return;
      if (url.pathname === location.pathname && url.search === location.search) return; // same page or #anchor
      clear();
      setPending(true);
      timers.current.push(window.setTimeout(() => setVisible(true), DELAY));
      timers.current.push(window.setTimeout(() => { setPending(false); setVisible(false); }, GIVE_UP));
    };
    // Capture phase: next/link cancels the click (to navigate on the client) before a bubbling listener would see it.
    document.addEventListener("click", onClick, true);
    return () => { document.removeEventListener("click", onClick, true); clear(); };
  }, []);

  if (!pending) return null;
  return (
    <div role="status" aria-live="polite" className={`fixed inset-0 z-[100] transition-opacity duration-200 ${visible ? "opacity-100" : "pointer-events-none opacity-0"}`}>
      <div aria-hidden className="absolute inset-x-0 top-0 h-[3px] overflow-hidden bg-emerald-600/15 dark:bg-emerald-400/15">
        <div className="h-full w-1/3 animate-[brand-bar_1.1s_cubic-bezier(.65,0,.35,1)_infinite] rounded-full bg-emerald-600 dark:bg-emerald-400" />
      </div>
      <div className="absolute inset-0 bg-[#F5F6FB]/55 backdrop-blur-[3px] dark:bg-[#070B14]/55" />
      <div className="absolute inset-0 grid place-items-center">
        <div className="rounded-[28px] border border-slate-200 bg-white/90 p-5 shadow-[0_24px_60px_-24px_rgba(15,23,42,.35)] dark:border-white/10 dark:bg-[#0E1424]/90 dark:shadow-[0_24px_60px_-24px_rgba(0,0,0,.9)]">
          <LoaderMark />
        </div>
      </div>
      <span className="sr-only">{t("Loading")}</span>
    </div>
  );
}
