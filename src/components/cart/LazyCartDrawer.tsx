"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart";

const CartDrawer = dynamic(() => import("./CartDrawer"), { ssr: false });

// The cart drawer is in every page's layout, but most visits never open it: its code (lines, payment, sign-in step)
// loads the first time the cart opens (the header button, or adding something), then stays so closing animates.
export default function LazyCartDrawer() {
  const open = !!useCart()?.open;
  const [wanted, setWanted] = useState(false);
  useEffect(() => { if (open) setWanted(true); }, [open]);
  return wanted ? <CartDrawer /> : null;
}
