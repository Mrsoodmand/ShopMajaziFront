// PLACEHOLDER data for designing the Apple ID page. Mirrors the live Laravel page: a ready (instant) US Apple ID,
// partner packs for resellers, and a custom Apple ID made with the buyer's own name, email and birthday
// (delivered within about 10 minutes). Prices are placeholders; the live ones come from the page settings.

export const READY_PRICE = 6.5;
export const CUSTOM_PRICE = 9;
export const MAX_QTY = 10;

export type AppleMethod = "ready" | "custom";

// Live addresses for each kind (the menu links here) and their page titles.
export const applePaths: Record<AppleMethod, string> = { ready: "/apple-id/usa", custom: "/apple-id/custom" };
export const appleTitles: Record<AppleMethod | "all", string> = {
  all: "Buy a US Apple ID: ready in seconds or made with your details — ShopMajazi",
  ready: "Buy a USA Apple ID: ready-made, instant delivery — ShopMajazi",
  custom: "Custom USA Apple ID with your own name and email — ShopMajazi",
};

// Main heading and intro per address, so /apple-id, /apple-id/usa and /apple-id/custom each read as their own page.
export const appleHeadings: Record<AppleMethod | "all", { h1: string; sub: string }> = {
  all: { h1: "Buy a US Apple ID", sub: "Get a ready US Apple ID in seconds, or one made with your own name and email." },
  ready: { h1: "USA Apple ID, ready in seconds", sub: "A verified United States Apple ID delivered the moment you pay. Buy one, a few, or a partner pack." },
  custom: { h1: "Custom USA Apple ID", sub: "A US Apple ID made with your own name, email and birthday, ready in about 10 minutes." },
};

// Bulk packs for resellers ("partner" Apple IDs on the old site), cheaper per ID.
export const packs = [
  { qty: 30, each: 5.9 },
  { qty: 50, each: 5.6 },
  { qty: 100, each: 5.3 },
  { qty: 200, each: 4.9 },
];

export const methodInfo: Record<AppleMethod, { title: string; tagline: string; price: number; delivery: string; points: string[] }> = {
  ready: {
    title: "Ready Apple ID", tagline: "Fastest. Delivered the moment you pay.", price: READY_PRICE, delivery: "Instant",
    points: ["United States region", "Verified and ready to sign in", "Buy 1 to 10, or a partner pack"],
  },
  custom: {
    title: "Custom Apple ID", tagline: "Made with your own name, email and birthday.", price: CUSTOM_PRICE, delivery: "About 10 minutes",
    points: ["United States region", "Your own email address", "Easier to recover later"],
  },
};

export const compareRows: { label: string; ready: string; custom: string }[] = [
  { label: "Delivery", ready: "Instant", custom: "About 10 minutes" },
  { label: "Email address", ready: "Provided by us", custom: "Your own" },
  { label: "Name and birthday", ready: "Provided by us", custom: "Yours" },
  { label: "Region", ready: "United States", custom: "United States" },
  { label: "Price", ready: "$6.50 each", custom: "$9.00" },
];

export const appleFaq = [
  { q: "Which one should I choose?", a: "Choose Ready if you need an Apple ID right now. Choose Custom if you want it under your own name and email, which makes it easier to recover and keep long term." },
  { q: "What do I receive?", a: "The Apple ID email, password, date of birth and the answers to its three security questions, shown in your dashboard." },
  { q: "Do I have to give a password for a custom Apple ID?", a: "No. If you leave it empty, we create a strong password and send it with your order. You can change it any time." },
  { q: "Will it work on my iPhone and Mac?", a: "Yes. It's a normal US Apple ID: sign in to the App Store, iCloud or any Apple device." },
  { q: "Can I change the details later?", a: "Yes. After signing in you can change the password, security questions and trusted phone number in your Apple account settings." },
];

// Sample delivered account for the designs.
export const sampleApple = (i = 0) => ({
  appleId: `ready.us.${4810 + i}@example.com`, password: `Qm7#vT${i}x-La2p`, birthday: "March 14, 1994",
  answers: ["Rivera", "Blue", "Austin"],
});

// Months for the birthday fields.
export const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
