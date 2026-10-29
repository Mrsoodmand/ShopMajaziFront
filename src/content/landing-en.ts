// Copy for the landing pages (/landing/<service>), written as entries in the ShopMajazi Lexicon.
// Facts come from the live service pages and their FAQs; nothing here is a price or a claim of its own.
// Prices and stock on the landing pages are read live from the backend (virtual numbers, Google Voice);
// rent and Apple ID prices are still placeholders on the shop, so those entries quote none.

import { extrasFor } from "./service-extras-en";

export type EntryId = "virtual-number" | "google-voice" | "rent-number" | "apple-id";

// The index of entries, in alphabetical order as a lexicon prints it.
export const entries: { id: EntryId; headword: string; gloss: string; href: string; shop: string }[] = [
  { id: "apple-id", headword: "Apple ID", gloss: "a US account for the App Store", href: "/landing/apple-id", shop: "/apple-id" },
  { id: "google-voice", headword: "Google Voice", gloss: "a permanent US number", href: "/landing/google-voice", shop: "/google-voice" },
  { id: "rent-number", headword: "Number, rented", gloss: "kept for a week to a month", href: "/landing/rent-number", shop: "/rent-number" },
  { id: "virtual-number", headword: "Number, virtual", gloss: "one number, one code", href: "/landing/virtual-number", shop: "/virtual-number" },
];

export type Sense = { text: string; example?: string; see?: EntryId };
export type Step = { title: string; text: string };
export type Entry = {
  headword: string;
  pron: string;
  pos: string;
  etym?: string;
  senses: Sense[]; // the first is the lead definition in the opening
  usage: Step[];
  notes: { q: string; a: string }[];
};

export const entry: Record<EntryId, Entry> = {
  "virtual-number": {
    headword: "Number, virtual",
    pron: "num·ber, vir·tu·al",
    pos: "noun",
    etym: "Persian majāzī, ‘virtual’, as in ShopMajazi",
    senses: [
      { text: "A phone number in another country, taken for one app to receive one verification code." },
      { text: "Used to sign up for WhatsApp, Telegram, Google, ChatGPT and more than 2,000 other apps without giving out your own SIM.", example: "a German number for Telegram, used once for its code" },
      { text: "Refunded in full: if no SMS arrives within 20 minutes, the number is cancelled and the amount goes back to your wallet." },
      { text: "Not kept after its code. To sign in again later,", see: "rent-number" },
    ],
    usage: [
      { title: "Choose the app", text: "The one asking you for a phone number." },
      { title: "Choose a country and server", text: "Each one shows its price; the cheapest is picked for you." },
      { title: "Pay and read the code", text: "Wallet, card or crypto. The number appears at once, and the SMS shows on your order page." },
    ],
    notes: extrasFor("virtual-number").faq,
  },
  "google-voice": {
    headword: "Google Voice",
    pron: "goo·gle voice",
    pos: "noun",
    etym: "a US phone service from Google",
    senses: [
      { text: "A permanent US phone number for calls and texts, on its own Google account that you take over." },
      { text: "Chosen by state, city or area code from the numbers in stock; you see the exact number before you pay.", example: "a 415 number from San Francisco, kept for years" },
      { text: "Paid once, no monthly fee. You receive the number with its Gmail address, password, recovery email and 2FA code." },
      { text: "Kept by using it: make a call or send a text every few weeks. For a single code instead,", see: "virtual-number" },
    ],
    usage: [
      { title: "Pick a state or area code", text: "Or search for digits you like." },
      { title: "Choose your number", text: "Every number in stock is listed with its price." },
      { title: "Pay and sign in", text: "The login appears on your order page. Sign in to the Voice app or voice.google.com, then set your own password." },
    ],
    notes: extrasFor("google-voice").faq,
  },
  "rent-number": {
    headword: "Number, rented",
    pron: "num·ber, rent·ed",
    pos: "noun",
    senses: [
      { text: "A number from another country, kept for a week to a month, that receives every SMS sent to it." },
      { text: "Rented for all your apps, or for one app at a lower price.", example: "a UK number kept for a month for WhatsApp and Google" },
      { text: "Extended at any time before it ends, by 7, 14 or 30 days; the number does not change." },
      { text: "Receives SMS only. For calls,", see: "google-voice" },
    ],
    usage: [
      { title: "Choose all apps or one app", text: "One app costs less; all apps takes SMS from any sender." },
      { title: "Choose the period and country", text: "1 week, 2 weeks or 1 month. Longer rentals cost less per day." },
      { title: "Pay and start receiving", text: "The number is active the moment you pay, and every SMS lands in your dashboard." },
    ],
    notes: extrasFor("rent-number").faq,
  },
  "apple-id": {
    headword: "Apple ID",
    pron: "ap·ple I·D",
    pos: "noun",
    senses: [
      { text: "The account for the App Store, iCloud and every Apple device; here, a United States Apple ID." },
      { text: "Ready: verified and delivered the moment you pay. Buy one to ten, or a partner pack of 30 to 200." },
      { text: "Custom: made with your own name, email and birthday in about ten minutes, and easier to recover later.", example: "a custom Apple ID on your own Gmail, for the US App Store" },
      { text: "Delivered as the email, password, date of birth and the answers to three security questions, on your order page." },
    ],
    usage: [
      { title: "Choose Ready or Custom", text: "Ready if you need it now; Custom if you want it under your own name." },
      { title: "For Custom, give your details", text: "Your name, an email not yet used for an Apple ID, and your birthday. The password is optional." },
      { title: "Pay and sign in", text: "Wallet, card or crypto. Sign in on any iPhone, iPad or Mac, then change the password." },
    ],
    notes: extrasFor("apple-id").faq,
  },
};

// "cf." for the three kinds of number: what each one is, side by side.
export const numberKinds: { id: EntryId; label: string }[] = [
  { id: "virtual-number", label: "Number, virtual" },
  { id: "rent-number", label: "Number, rented" },
  { id: "google-voice", label: "Google Voice" },
];
export const numberCompare: { label: string; values: Partial<Record<EntryId, string>> }[] = [
  { label: "Kept for", values: { "virtual-number": "One code", "rent-number": "1 week to 1 month, extendable", "google-voice": "As long as you use it" } },
  { label: "Receives", values: { "virtual-number": "One SMS", "rent-number": "Every SMS, from any app", "google-voice": "Calls and texts" } },
  { label: "Makes calls", values: { "virtual-number": "No", "rent-number": "No", "google-voice": "Yes" } },
  { label: "Countries", values: { "virtual-number": "150+", "rent-number": "12", "google-voice": "United States" } },
  { label: "Best for", values: { "virtual-number": "Signing up once", "rent-number": "Signing in again for a while", "google-voice": "A number of your own" } },
];

export const appleCompare: { label: string; ready: string; custom: string }[] = [
  { label: "Delivery", ready: "Instant", custom: "About 10 minutes" },
  { label: "Email address", ready: "Provided by us", custom: "Your own" },
  { label: "Name and birthday", ready: "Provided by us", custom: "Yours" },
  { label: "Region", ready: "United States", custom: "United States" },
  { label: "Quantity", ready: "1 to 10, or a partner pack", custom: "One at a time" },
];
