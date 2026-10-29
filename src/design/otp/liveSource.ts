"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import type { OtpOffer } from "@/content/otp-en";
import { cheapestBy, fetchOffers, serversAsOperators, toServerOffers, type ApiOffer, type Locale, type ServerOffer, type VnCatalog } from "@/lib/virtual-numbers";
import type { OtpSource } from "./flow";
import { useT } from "@/i18n/client";

// Live data for the OTP flow: the catalog comes from the server render, and offers (per app or per country) are
// fetched from the backend the first time a choice needs them, then kept for the visit.
// `preload` holds offers already fetched on the server for the default app.
export function useLiveOtpSource(catalog: VnCatalog, locale: Locale, preload?: { appId: string; offers: ApiOffer[] }, initialError?: string): OtpSource {
  const t = useT();
  const [byApp, setByApp] = useState<Record<string, ServerOffer[]>>(() => (preload ? { [preload.appId]: toServerOffers(preload.offers, catalog) } : {}));
  const [byCountry, setByCountry] = useState<Record<string, ServerOffer[]>>({});
  const [error, setError] = useState<string | null>(initialError ?? null);
  const pending = useRef(new Set<string>());

  const load = useCallback((key: string, run: () => Promise<ApiOffer[]>, save: (o: ServerOffer[]) => void) => {
    if (pending.current.has(key)) return;
    pending.current.add(key);
    run().then((rows) => { save(toServerOffers(rows, catalog)); setError(null); })
      .catch(() => { pending.current.delete(key); setError(locale === "fa" ? "قیمت‌ها بارگیری نشد. دوباره تلاش کنید." : t("Couldn't load prices. Please try again.")); });
  }, [catalog, locale]);

  const need = useCallback((appId: string | null, cc: string | null) => {
    const app = appId ? catalog.apps.find((a) => a.id === appId) : null;
    const country = cc ? catalog.countries.find((c) => c.cc === cc) : null;
    if (app?.sid && !byApp[app.id]) load(`a:${app.id}`, () => fetchOffers({ service: app.sid! }), (o) => setByApp((m) => ({ ...m, [app.id]: o })));
    if (country?.cid && !byCountry[country.cc]) load(`c:${country.cc}`, () => fetchOffers({ country: country.cid! }), (o) => setByCountry((m) => ({ ...m, [country.cc]: o })));
  }, [catalog, byApp, byCountry, load]);

  return useMemo<OtpSource>(() => {
    const fromList = (ids: string[], prices: Record<string, number>, make: (id: string, price: number) => OtpOffer | null) =>
      ids.flatMap((id) => { const o = prices[id] != null ? make(id, prices[id]) : null; return o ? [o] : []; });
    // "From" prices are the cheapest across everything; the paired app/country there is only a placeholder.
    const anyCountry = catalog.countries[0], anyApp = catalog.apps[0];
    const forAppCache = new Map<string, OtpOffer[]>(), inCountryCache = new Map<string, OtpOffer[]>();
    return {
      apps: catalog.apps, countries: catalog.countries, error, need,
      appsFrom: fromList(catalog.apps.map((a) => a.id), catalog.appFrom, (id, price) => ({ app: catalog.apps.find((a) => a.id === id)!, country: anyCountry, price })),
      countriesFrom: fromList(catalog.countries.map((c) => c.cc), catalog.countryFrom, (cc, price) => ({ app: anyApp, country: catalog.countries.find((c) => c.cc === cc)!, price })),
      forApp: (appId) => {
        if (!byApp[appId]) return null;
        if (!forAppCache.has(appId)) forAppCache.set(appId, cheapestBy(byApp[appId], "cc", catalog));
        return forAppCache.get(appId)!;
      },
      inCountry: (cc) => {
        if (!byCountry[cc]) return null;
        if (!inCountryCache.has(cc)) inCountryCache.set(cc, cheapestBy(byCountry[cc], "appId", catalog));
        return inCountryCache.get(cc)!;
      },
      operators: (appId, cc) => {
        const rows = byApp[appId] ?? byCountry[cc];
        return rows ? serversAsOperators(rows, appId, cc, locale) : null;
      },
    };
  }, [catalog, locale, byApp, byCountry, error, need]);
}
