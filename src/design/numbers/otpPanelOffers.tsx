"use client";

import OtpCatalog from "./OtpCatalog";

// The virtual number catalog (page P) with each panel version, one per offer on /design/page-otp-panel.
export const OtpPanelA = () => <OtpCatalog panel="A" />;
export const OtpPanelB = () => <OtpCatalog panel="B" />;
export const OtpPanelC = () => <OtpCatalog panel="C" />;
export const OtpPanelD = () => <OtpCatalog panel="D" />;
export const OtpPanelE = () => <OtpCatalog panel="E" />;

// The app card versions (with panel E, the live one), one per offer on /design/page-otp-card.
export const OtpCardA = () => <OtpCatalog panel="E" card="A" />;
export const OtpCardB = () => <OtpCatalog panel="E" card="B" />;
export const OtpCardC = () => <OtpCatalog panel="E" card="C" />;
export const OtpCardD = () => <OtpCatalog panel="E" card="D" />;
export const OtpCardE = () => <OtpCatalog panel="E" card="E" />;
export const OtpCardNow = () => <OtpCatalog panel="E" />;

// Order screens F–J on this catalog (panel E, card C), opened straight on a fresh order; the code arrives after 30s.
export const OrderPreviewF = () => <OtpCatalog panel="E" card="C" orderView="F" previewOrder />;
export const OrderPreviewG = () => <OtpCatalog panel="E" card="C" orderView="G" previewOrder />;
export const OrderPreviewH = () => <OtpCatalog panel="E" card="C" orderView="H" previewOrder />;
export const OrderPreviewI = () => <OtpCatalog panel="E" card="C" orderView="I" previewOrder />;
export const OrderPreviewJ = () => <OtpCatalog panel="E" card="C" orderView="J" previewOrder />;
