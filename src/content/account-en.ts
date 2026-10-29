// Sample data for the account area design offers (/design/page-account). Not real: names, numbers, logins,
// prices and tickets are made up so every state shows (waiting for an SMS, delivering, paused and needing the
// buyer, delivered, refunded, a top-up on hold). Replaced by the Laravel account API once a design is chosen.

export type OrderState = "waiting" | "delivering" | "needs-you" | "delivered" | "refunded";
export type OrderKind = "number" | "social" | "telegram" | "google-voice" | "apple-id" | "subscription";

// What the order hands over, by type of service.
export type Delivery =
  | { type: "number"; app: string; country: string; number: string; code?: string; codeAt?: string; minutes: number }
  | { type: "progress"; unit: string; done: number; total: number; target: string; refillDays: number; problem?: { title: string; text: string } }
  | { type: "gift"; what: string; recipient: string }
  | { type: "login"; fields: { label: string; value: string; secret?: boolean }[]; note: string }
  | { type: "activation"; plan: string; email: string; ends: string };

export type AccountOrder = {
  id: number;
  kind: OrderKind;
  service: string; // brand shown on the tile
  title: string;
  detail: string; // one line under the title
  state: OrderState;
  price: number; // Toman
  paidWith: "wallet" | string; // "wallet" or a card id
  at: string; // ISO, when it was paid
  deliveredAt?: string;
  refund?: { amount: number; reason: string; at: string };
  delivery: Delivery;
};

export type BankCard = { id: string; bank: string; first6: string; last4: string };
export type TopUp = { id: string; amount: number; card: string; at: string; state: "done" | "on-hold" };

export type TicketState = "replied" | "waiting" | "closed";
export type Dept = "orders" | "sales" | "technical" | "accounting" | "other";
export type TicketMessage = { from: "you" | "support"; name?: string; at: string; text: string; file?: string };
export type Ticket = { id: number; subject: string; dept: Dept; orderId?: number; state: TicketState; messages: TicketMessage[] };

// Fixed "now" for day labels (Today, Yesterday), so the sample reads the same on any day.
export const DEMO_NOW = "2026-10-29T10:30:00";

export const accountUser = { name: "Arash Karimi", mobile: "0912 345 6789", email: "arash.karimi@gmail.com", since: "2025-03-14" };

export const bankCards: BankCard[] = [
  { id: "melli", bank: "Bank Melli", first6: "603799", last4: "4417" },
  { id: "mellat", bank: "Bank Mellat", first6: "610433", last4: "0921" },
];
// The card a top-up on hold was paid with: it isn't on the account.
export const strayCard: BankCard = { id: "parsian", bank: "Parsian Bank", first6: "622106", last4: "8812" };

export const topUps: TopUp[] = [
  { id: "P-7702", amount: 500_000, card: "parsian", at: "2026-10-28T09:00:00", state: "on-hold" },
  { id: "P-7688", amount: 2_000_000, card: "melli", at: "2026-10-26T14:10:00", state: "done" },
  { id: "P-7641", amount: 3_000_000, card: "mellat", at: "2026-10-18T11:05:00", state: "done" },
];

export const accountOrders: AccountOrder[] = [
  {
    id: 10492, kind: "number", service: "WhatsApp", title: "WhatsApp number", detail: "United Kingdom · +44 7700 900418",
    state: "waiting", price: 186_000, paidWith: "wallet", at: "2026-10-29T10:24:30",
    delivery: { type: "number", app: "WhatsApp", country: "United Kingdom", number: "+44 7700 900418", minutes: 20 },
  },
  {
    id: 10491, kind: "social", service: "TikTok", title: "TikTok followers", detail: "2,000 followers · @mina.bakes",
    state: "needs-you", price: 95_000, paidWith: "wallet", at: "2026-10-28T21:10:00",
    delivery: {
      type: "progress", unit: "followers", done: 0, total: 2000, target: "tiktok.com/@mina.bakes", refillDays: 30,
      problem: { title: "The account is private", text: "We can't add followers to a private account. Make @mina.bakes public and continue, or cancel for a full refund." },
    },
  },
  {
    id: 10490, kind: "number", service: "Telegram", title: "Telegram number", detail: "Netherlands · +31 6 4123 0877",
    state: "delivered", price: 142_000, paidWith: "wallet", at: "2026-10-28T16:45:00", deliveredAt: "2026-10-28T16:47:00",
    delivery: { type: "number", app: "Telegram", country: "Netherlands", number: "+31 6 4123 0877", code: "48213", codeAt: "2026-10-28T16:47:00", minutes: 20 },
  },
  {
    id: 10487, kind: "social", service: "Instagram", title: "Instagram followers", detail: "5,000 followers · @arash.travels",
    state: "delivering", price: 420_000, paidWith: "wallet", at: "2026-10-28T12:30:00",
    delivery: { type: "progress", unit: "followers", done: 3240, total: 5000, target: "instagram.com/arash.travels", refillDays: 30 },
  },
  {
    id: 10484, kind: "telegram", service: "Telegram", title: "Telegram Premium · 3 months", detail: "Gift to @nima_dev",
    state: "delivered", price: 1_290_000, paidWith: "melli", at: "2026-10-27T18:30:00", deliveredAt: "2026-10-27T18:34:00",
    delivery: { type: "gift", what: "3 months of Telegram Premium", recipient: "@nima_dev" },
  },
  {
    id: 10481, kind: "google-voice", service: "Google Voice", title: "Google Voice number", detail: "San Francisco · +1 (415) 555-0192",
    state: "delivered", price: 890_000, paidWith: "wallet", at: "2026-10-26T14:20:00", deliveredAt: "2026-10-26T14:21:00",
    delivery: {
      type: "login",
      fields: [
        { label: "Number", value: "+1 (415) 555-0192" },
        { label: "Google account", value: "lena.harper.voice@gmail.com" },
        { label: "Password", value: "Vq7#mT2p!xL9", secret: true },
      ],
      note: "Sign in at voice.google.com. Use the number now and then so Google keeps it active.",
    },
  },
  {
    id: 10477, kind: "apple-id", service: "Apple", title: "Apple ID · United States", detail: "m.reyes.store@icloud.com",
    state: "delivered", price: 1_150_000, paidWith: "wallet", at: "2026-10-24T10:02:00", deliveredAt: "2026-10-24T10:02:00",
    delivery: {
      type: "login",
      fields: [
        { label: "Apple ID", value: "m.reyes.store@icloud.com" },
        { label: "Password", value: "Kx4!pR8wz2", secret: true },
        { label: "Security answers", value: "Teacher: Lopez · First car: Civic · City: Austin", secret: true },
        { label: "Date of birth", value: "14 March 1994" },
      ],
      note: "Change the password after you sign in, and keep the security answers somewhere safe.",
    },
  },
  {
    id: 10472, kind: "number", service: "Google", title: "Google number", detail: "Indonesia · +62 812 3456 7781",
    state: "refunded", price: 64_000, paidWith: "wallet", at: "2026-10-22T13:15:00",
    refund: { amount: 64_000, reason: "No SMS arrived within 20 minutes", at: "2026-10-22T13:35:00" },
    delivery: { type: "number", app: "Google", country: "Indonesia", number: "+62 812 3456 7781", minutes: 20 },
  },
  {
    id: 10470, kind: "subscription", service: "Spotify", title: "Spotify Premium · 1 month", detail: "Individual plan · arash.karimi@gmail.com",
    state: "delivered", price: 310_000, paidWith: "wallet", at: "2026-10-20T19:40:00", deliveredAt: "2026-10-20T20:05:00",
    delivery: { type: "activation", plan: "Premium Individual", email: "arash.karimi@gmail.com", ends: "2026-11-20" },
  },
  {
    id: 10466, kind: "telegram", service: "Telegram", title: "Telegram Stars · 500", detail: "To @arash_k",
    state: "delivered", price: 1_020_000, paidWith: "wallet", at: "2026-10-18T11:09:00", deliveredAt: "2026-10-18T11:10:00",
    delivery: { type: "gift", what: "500 Telegram Stars", recipient: "@arash_k" },
  },
];

export const accountTickets: Ticket[] = [
  {
    id: 3318, subject: "Followers order stopped at 3,240", dept: "orders", orderId: 10487, state: "replied",
    messages: [
      { from: "you", at: "2026-10-28T23:04:00", text: "My Instagram followers order stopped at 3,240 this evening. Is it still running?" },
      { from: "support", name: "Mahsa", at: "2026-10-29T09:12:00", text: "Hi Arash, deliveries for this service slowed down overnight. Your order picked up again at 08:40 and should finish in about 6 hours. If it stops again, the rest is refunded to your wallet automatically." },
    ],
  },
  {
    id: 3301, subject: "Top-up of 500,000 Toman isn't in my wallet", dept: "accounting", state: "waiting",
    messages: [
      { from: "you", at: "2026-10-28T09:20:00", text: "I topped up 500,000 Toman this morning but my wallet didn't change. I paid with my other card, the one ending 8812.", file: "bank-receipt.jpg" },
    ],
  },
  {
    id: 3254, subject: "Apple ID asks me to verify a phone number", dept: "technical", orderId: 10477, state: "closed",
    messages: [
      { from: "you", at: "2026-10-24T10:40:00", text: "When I sign in to the Apple ID on my iPhone it asks me to verify a phone number. What should I enter?" },
      { from: "support", name: "Reza", at: "2026-10-24T11:02:00", text: "Choose \"Not now\" on that screen; the account works without a phone number. If it insists, reply here and we'll add one for you." },
      { from: "you", at: "2026-10-24T11:15:00", text: "\"Not now\" worked, thanks!" },
    ],
  },
];

export const departments: { id: Dept; label: string; hint: string }[] = [
  { id: "orders", label: "Orders", hint: "A problem with something you bought" },
  { id: "sales", label: "Sales", hint: "Questions before you buy" },
  { id: "technical", label: "Technical support", hint: "Signing in, setup, codes" },
  { id: "accounting", label: "Accounting", hint: "Top-ups, refunds, payments" },
  { id: "other", label: "Something else", hint: "Anything that doesn't fit above" },
];

// Top-up amount shortcuts (Toman) and the sample limits the form checks against.
export const topUpPresets = [200_000, 500_000, 1_000_000, 2_000_000];
export const TOP_UP_MIN = 10_000;
export const TOP_UP_MAX = 50_000_000;
