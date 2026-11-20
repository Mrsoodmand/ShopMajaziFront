"use client";

import AdsG from "./AdsG";

// Gallery offers for two parts of the Telegram Ads page (design G): the budget section and where Telegram's ad rules
// sit. Each shows the whole page with only that part changed; the live page takes both picks (app/telegram/ads).
export const AdsBudgetA = () => <AdsG budget="A" />;
export const AdsBudgetB = () => <AdsG budget="B" />;
export const AdsBudgetC = () => <AdsG budget="C" />;
export const AdsBudgetD = () => <AdsG budget="D" />;
export const AdsBudgetE = () => <AdsG budget="E" />;
export const AdsRulesA = () => <AdsG rules="A" />;
export const AdsRulesB = () => <AdsG rules="B" />;
export const AdsRulesC = () => <AdsG rules="C" />;
export const AdsRulesD = () => <AdsG rules="D" />;
export const AdsRulesE = () => <AdsG rules="E" />;
