// Sample verification products for the /design gallery (section page-verify). Shapes follow the backend's
// storefront API (App\Services\VerificationOrders::product): kind, plans, and the inputs the admin chose.
// Prices are sample dollars, like the other gallery pages. No claims beyond what the admin would type.

export type VerifyKind = "ready" | "verify";
export type VerifyFieldType = "text" | "email" | "phone" | "select" | "textarea" | "date" | "file";
export type VerifyField = {
  name: string;
  title: string;
  type: VerifyFieldType;
  required: boolean;
  hint?: string;
  options?: string[];
  accept?: ("image" | "pdf")[];
  maxMb?: number;
};
export type VerifyPlan = { id: number; name: string; price: number; was?: number; popular?: boolean };
export type VerifyProduct = {
  slug: string;
  name: string;
  letter: string;
  color: string;
  kind: VerifyKind;
  tagline: string;
  delivery: string;
  plans: VerifyPlan[];
  fields: VerifyField[];
  notes: { label: string; value: string }[];
};

const idPhoto: VerifyField = { name: "id_photo", title: "Photo of your ID card or passport", type: "file", required: true, accept: ["image", "pdf"], maxMb: 5, hint: "All four corners visible, no glare." };
const selfie: VerifyField = { name: "selfie", title: "Selfie holding your ID", type: "file", required: true, accept: ["image"], maxMb: 5, hint: "Your face and the ID both sharp." };

export const verifyProducts: VerifyProduct[] = [
  {
    slug: "paypal-verified", name: "Verified PayPal account", letter: "P", color: "#003087", kind: "ready",
    tagline: "A ready PayPal account, already verified", delivery: "Within 24 hours",
    plans: [{ id: 1, name: "Personal", price: 45 }, { id: 2, name: "Business", price: 79, popular: true }],
    fields: [
      { name: "email", title: "Email to send the login to", type: "email", required: true },
      { name: "country", title: "Account country", type: "select", required: true, options: ["Turkey", "UAE", "Georgia"] },
    ],
    notes: [{ label: "Verification level", value: "Full" }],
  },
  {
    slug: "wise-verified", name: "Verified Wise account", letter: "W", color: "#163300", kind: "ready",
    tagline: "Multi-currency account, ready to use", delivery: "1–2 working days",
    plans: [{ id: 3, name: "Personal", price: 60, was: 70 }],
    fields: [{ name: "email", title: "Email to send the login to", type: "email", required: true }],
    notes: [{ label: "Card", value: "Not included" }],
  },
  {
    slug: "binance-kyc", name: "Binance KYC account", letter: "B", color: "#B8860B", kind: "ready",
    tagline: "Identity-verified exchange account", delivery: "Within 24 hours",
    plans: [{ id: 4, name: "Level 1", price: 30 }, { id: 5, name: "Level 2", price: 55, popular: true }],
    fields: [{ name: "email", title: "Email to send the login to", type: "email", required: true }],
    notes: [],
  },
  {
    slug: "meta-verified", name: "Meta Verified for Instagram", letter: "M", color: "#C13584", kind: "verify",
    tagline: "The blue badge on your own Instagram page", delivery: "3–5 working days",
    plans: [{ id: 6, name: "1 month", price: 18 }, { id: 7, name: "3 months", price: 48, popular: true }],
    fields: [
      { name: "account", title: "Your Instagram username", type: "text", required: true, hint: "Without @, like shopmajazi" },
      { name: "full_name", title: "Full name, as on your ID", type: "text", required: true },
      { name: "birth", title: "Date of birth", type: "date", required: true },
      idPhoto,
      selfie,
    ],
    notes: [{ label: "Your password", value: "Not needed" }],
  },
  {
    slug: "paypal-verify", name: "Verify your PayPal", letter: "P", color: "#0070BA", kind: "verify",
    tagline: "We verify the PayPal account you already have", delivery: "2–4 working days",
    plans: [{ id: 8, name: "Full verification", price: 35 }],
    fields: [
      { name: "email", title: "Your PayPal email", type: "email", required: true },
      { name: "phone", title: "Phone number on the account", type: "phone", required: false },
      { name: "address", title: "Address on the account", type: "textarea", required: true },
      idPhoto,
      { name: "bill", title: "Proof of address", type: "file", required: false, accept: ["image", "pdf"], maxMb: 5, hint: "A bill or bank statement from the last 3 months." },
    ],
    notes: [],
  },
  {
    slug: "x-verified", name: "X Premium badge", letter: "X", color: "#0F1419", kind: "verify",
    tagline: "The checkmark on your own X account", delivery: "1–2 working days",
    plans: [{ id: 9, name: "Basic", price: 5 }, { id: 10, name: "Premium", price: 11, popular: true }],
    fields: [{ name: "account", title: "Your X username", type: "text", required: true, hint: "Without @" }],
    notes: [],
  },
];

export const verifyFaq: { q: string; a: string }[] = [
  { q: "Who sees my documents?", a: "Only our support team, while they work on your order. They are kept in private storage, never on the website." },
  { q: "When are my files deleted?", a: "30 days after your order is done or cancelled, automatically." },
  { q: "Do you need my password?", a: "No. For your own account we only need what the form asks for." },
  { q: "What if it can't be verified?", a: "We tell you why. If we can't do it, your money goes back to your wallet." },
];

export const lowestPrice = (p: VerifyProduct) => Math.min(...p.plans.map((x) => x.price));
