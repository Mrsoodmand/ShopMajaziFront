"use client";

import { useT } from "@/i18n/client";
import { useOrgPrice, type OrgFamily } from "@/lib/account";

// A product price as an approved business account sees it: the company's own price, with the normal price crossed
// out before it. Everyone else sees the plain price. The cut is the same Math.round the server and the checkout use
// (App\Services\Organizations::cut), so the card, the checkout and the charge agree.
// `format` is the page's own money formatter (useMoney().format or toman), so each design keeps its look.
// `was` is a sale's old price the design would cross out anyway; then that one is shown instead of the list price.
export function OrgPrice({ value, family, format, was = null, wasClassName = "" }: { value: number; family: OrgFamily; format: (n: number) => string; was?: number | null; wasClassName?: string }) {
  const org = useOrgPrice()(value, family);
  const t = useT();
  if (org.was === null) return <>{format(value)}</>;
  return (
    <>
      <s className={`me-1.5 text-[0.8em] font-normal opacity-60 ${wasClassName}`}><span className="sr-only">{t("Was")}{" "}</span>{format(Math.max(was ?? 0, org.was))}</s>
      <span className="sr-only">{t("Business price")}{" "}</span>{format(org.price)}
    </>
  );
}

// The same company price as plain text, for sentences and labels ("from 1,200 / 1,000"), where a crossed-out figure
// would not read well.
export function useOrgFormat(family: OrgFamily, format: (n: number) => string) {
  const org = useOrgPrice();
  return (n: number) => format(org(n, family).price);
}
