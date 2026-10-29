// PLACEHOLDER reviews for designing the testimonials section. They are not real customers: replace them with
// genuine, approved reviews (the Laravel site already stores customer comments) before anything goes live.

export type Review = { id: string; name: string; service: string; svc: "numbers" | "apple" | "subs" | "telegram" | "social"; rating: number; text: string; date: string };

export const reviews: Review[] = [
  { id: "r1", name: "Customer A.", service: "Virtual Number (OTP)", svc: "numbers", rating: 5, text: "Got my WhatsApp code in under a minute. The first number didn't receive anything and the refund hit my wallet automatically.", date: "2 days ago" },
  { id: "r2", name: "Customer B.", service: "Google Voice", svc: "numbers", rating: 5, text: "I've used the same Google Voice number for my freelance clients for over a year. Setup help from support was great.", date: "1 week ago" },
  { id: "r3", name: "Customer C.", service: "Custom USA Apple ID", svc: "apple", rating: 5, text: "Apple ID made with my own email, delivered the same hour, with a clear setup guide. Exactly what I needed.", date: "1 week ago" },
  { id: "r4", name: "Customer D.", service: "ChatGPT Plus", svc: "subs", rating: 4, text: "Activated on my own account in about ten minutes. Would love a yearly plan option.", date: "2 weeks ago" },
  { id: "r5", name: "Customer E.", service: "Telegram members", svc: "social", rating: 5, text: "Started within minutes and the delivery was steady, not a sudden spike. A few dropped and were refilled.", date: "2 weeks ago" },
  { id: "r6", name: "Customer F.", service: "Rent Number", svc: "numbers", rating: 5, text: "Rented a UK number for a month to verify a few accounts. Unlimited codes, no hassle.", date: "3 weeks ago" },
  { id: "r7", name: "Customer G.", service: "Spotify Premium", svc: "subs", rating: 5, text: "Cheap, fast and it just works. Topping up the wallet once makes buying anything a one-click job.", date: "3 weeks ago" },
  { id: "r8", name: "Customer H.", service: "Instagram followers", svc: "social", rating: 4, text: "Good quality followers for a new page. Delivery took a few hours longer than expected but support kept me updated.", date: "1 month ago" },
  { id: "r9", name: "Customer I.", service: "USA Apple ID", svc: "apple", rating: 5, text: "Instant delivery and it worked on my iPhone right away. Will buy again.", date: "1 month ago" },
  { id: "r10", name: "Customer J.", service: "Virtual Number (OTP)", svc: "numbers", rating: 5, text: "Tried three other sites before. This is the only one where the Telegram code actually arrived on the first try.", date: "1 month ago" },
  { id: "r11", name: "Customer K.", service: "Telegram Premium", svc: "telegram", rating: 5, text: "Only had to give my username. Premium showed up as a gift a minute later, no login or code needed.", date: "4 days ago" },
  { id: "r12", name: "Customer L.", service: "Telegram Ads", svc: "telegram", rating: 5, text: "They set up the sponsored message for my channel and picked good target channels. Clear stats every day.", date: "3 weeks ago" },
];

// Placeholder summary numbers; the real ones should come from the review data.
export const ratingSummary = { average: 4.9, total: 38214, breakdown: [92, 6, 1, 0.5, 0.5] as number[] }; // % for 5..1 stars

export const svcLabels: Record<Review["svc"], string> = { numbers: "Virtual Numbers", apple: "Apple ID", subs: "Subscriptions", telegram: "Telegram", social: "Social Media Services" };
