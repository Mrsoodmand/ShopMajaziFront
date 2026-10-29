// PLACEHOLDER data for designing the Google Voice page. The live page will load the numbers in stock from the Laravel
// GoogleVoice table (status 0 = available) and the price from its page settings. Each number comes on its own Google
// account; after paying, the buyer gets the number, the Gmail address, password, recovery email and 2FA code.
// Numbers use the reserved 555-01xx range so none of them is a real line.

export const GV_PRICE = 9.9;

// `pid` and `price` (Toman) are set on live numbers (lib/google-voice.ts); the samples here use GV_PRICE.
export type GvNumber = { id: string; number: string; area: string; city: string; state: string; easy?: boolean; pid?: number; price?: number };

const raw: [string, string, string, string, boolean?][] = [
  ["212", "0142", "New York", "NY"], ["646", "0177", "New York", "NY", true], ["917", "0105", "New York", "NY"],
  ["415", "0123", "San Francisco", "CA", true], ["213", "0168", "Los Angeles", "CA"], ["310", "0190", "Los Angeles", "CA"],
  ["305", "0111", "Miami", "FL", true], ["786", "0156", "Miami", "FL"],
  ["312", "0134", "Chicago", "IL"], ["773", "0181", "Chicago", "IL"],
  ["512", "0100", "Austin", "TX", true], ["214", "0147", "Dallas", "TX"],
  ["206", "0129", "Seattle", "WA"], ["617", "0163", "Boston", "MA"],
  ["702", "0177", "Las Vegas", "NV"], ["404", "0118", "Atlanta", "GA"], ["720", "0150", "Denver", "CO", true],
];

export const gvNumbers: GvNumber[] = raw.map(([area, end, city, state, easy]) => ({
  id: `${area}${end}`, number: `(${area}) 555-${end}`, area, city, state, easy,
}));

export const gvStates = [...new Set(gvNumbers.map((n) => n.state))];
export const gvCities = [...new Set(gvNumbers.map((n) => n.city))].map((city) => {
  const list = gvNumbers.filter((n) => n.city === city);
  return { city, state: list[0].state, areas: [...new Set(list.map((n) => n.area))], numbers: list };
});

// Digits only, for matching a typed search like "555 01" or "415".
export const digits = (s: string) => s.replace(/\D/g, "");
export const matches = (n: GvNumber, q: string) => !digits(q) || digits(n.number).includes(digits(q)) || n.city.toLowerCase().includes(q.trim().toLowerCase());

export const gvFeatures = [
  { title: "A real US number", text: "Calls and texts in the US, from the Google Voice app or voice.google.com." },
  { title: "Yours to keep", text: "The number sits on its own Google account that you fully control." },
  { title: "Works with most apps", text: "Use it for WhatsApp, Telegram, PayPal, banks and US-only services." },
  { title: "Instant delivery", text: "The login shows up in your dashboard seconds after paying." },
];

export const gvIncluded = ["Google Voice number", "Gmail address", "Password", "Recovery email", "2-step verification code", "Setup guide"];

export const gvSteps = [
  { title: "Pick your number", text: "Choose a number by city or area code, or search for digits you like." },
  { title: "Pay once", text: "Wallet, card or crypto. No monthly fee." },
  { title: "Sign in and use it", text: "Log in to the Google account in the Voice app. Change the password and recovery email to your own." },
];

export const gvFaq = [
  { q: "Is this a one-time or a permanent number?", a: "Permanent. It's a Google Voice number on its own Google account, and it stays yours as long as you keep using it." },
  { q: "How do I keep the number active?", a: "Google may reclaim numbers that aren't used for about three months. Make a call or send a text from it every few weeks." },
  { q: "Can I change the password and recovery email?", a: "Yes, and you should. Right after signing in, set your own password, recovery email and 2-step verification." },
  { q: "Can I receive verification codes from any app?", a: "Most apps and sites accept Google Voice numbers. A few banks and services block VoIP numbers; for those, use a virtual number instead." },
  { q: "What if the login doesn't work?", a: "Tell support from your order page. We check it right away and replace the number or refund you." },
];

// Sample delivered order for the designs.
export const gvSampleLogin = { email: "gv.sample.0142@example.com", password: "Xk7#pL2q-Vm9", recovery: "recovery.0142@example.com", twofa: "JBSW Y3DP EHPK 3PXP" };

export const compareRows: { label: string; gv: string; otp: string; rent: string }[] = [
  { label: "How long it lasts", gv: "Permanent", otp: "One code", rent: "7–30 days" },
  { label: "Receive SMS", gv: "Yes", otp: "One SMS", rent: "Unlimited" },
  { label: "Make & receive calls", gv: "Yes", otp: "No", rent: "No" },
  { label: "Countries", gv: "USA", otp: "150+", rent: "40+" },
  { label: "Price", gv: "$9.90 once", otp: "from $0.30", rent: "from $4.90" },
];
