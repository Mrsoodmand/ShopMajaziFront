"use client";

import { ShoppingBag } from "lucide-react";
import { useT } from "@/i18n/client";
import { useCart } from "@/lib/cart";

const focus = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 dark:focus-visible:outline-emerald-400";

// The header's cart button with its item count. Kept apart from CartDrawer so the header doesn't pull in the drawer's
// code, which loads only when the cart is first opened (LazyCartDrawer).
export function CartButton({ className = "" }: { className?: string }) {
  const cart = useCart();
  const t = useT();
  if (!cart) return null;
  const n = cart.count;
  return (
    <button type="button" onClick={() => cart.setOpen(true)} aria-label={t("Cart, {0} items", { 0: t.num(n) })} aria-expanded={cart.open} data-no-loader
      className={`relative ${className} ${focus}`}>
      <style>{"@keyframes cart-pop{0%{transform:scale(.4)}60%{transform:scale(1.25)}100%{transform:scale(1)}}"}</style>
      <ShoppingBag className="h-[18px] w-[18px]" />
      {n > 0 && <span key={n} className="absolute -end-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-emerald-600 px-1 text-[11px] font-bold text-white ring-2 ring-white animate-[cart-pop_.4s_ease-out] dark:ring-[#070B14]">{t.num(n)}</span>}
    </button>
  );
}
