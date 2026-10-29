// PLACEHOLDER Google Voice inventory for designing the page. The live page will list available numbers from the
// GoogleVoice table (status = 0) and take the single price from the page settings (custom_price).

export type GvArea = { code: string; city: string; state: string; stateName: string };
export type GvNumber = { id: string; number: string; area: GvArea; easy?: boolean };

export const GV_PRICE = 9.9; // placeholder
export const gvAreas: GvArea[] = [
  { code: "212", city: "New York", state: "NY", stateName: "New York" },
  { code: "646", city: "New York", state: "NY", stateName: "New York" },
  { code: "415", city: "San Francisco", state: "CA", stateName: "California" },
  { code: "213", city: "Los Angeles", state: "CA", stateName: "California" },
  { code: "305", city: "Miami", state: "FL", stateName: "Florida" },
  { code: "512", city: "Austin", state: "TX", stateName: "Texas" },
  { code: "713", city: "Houston", state: "TX", stateName: "Texas" },
  { code: "312", city: "Chicago", state: "IL", stateName: "Illinois" },
  { code: "206", city: "Seattle", state: "WA", stateName: "Washington" },
  { code: "617", city: "Boston", state: "MA", stateName: "Massachusetts" },
  { code: "702", city: "Las Vegas", state: "NV", stateName: "Nevada" },
  { code: "404", city: "Atlanta", state: "GA", stateName: "Georgia" },
];

const seed = (s: string) => { let h = 2166136261; for (const ch of s) h = Math.imul(h ^ ch.charCodeAt(0), 16777619); return h >>> 0; };
// "Easy to remember": a repeated or sequential tail, e.g. 4444 or 1234.
const isEasy = (tail: string) => /(\d)\1\1/.test(tail) || "0123456789".includes(tail) || tail.slice(0, 2) === tail.slice(2);

export const gvNumbers: GvNumber[] = gvAreas.flatMap((area, ai) =>
  Array.from({ length: 3 + (ai % 3) }, (_, i) => {
    const h = seed(area.code + i);
    const mid = String(200 + (h % 700));
    const special = ["7777", "1234", "2020", "5000", "8888", "4545"];
    const tail = i === 2 && ai % 2 === 0 ? special[ai % special.length] : String(1000 + (Math.floor(h / 700) % 9000));
    return { id: `${area.code}-${i}`, number: `+1 (${area.code}) ${mid}-${tail}`, area, easy: isEasy(tail) };
  }),
);

export const gvStates = Array.from(new Map(gvAreas.map((a) => [a.state, a.stateName])).entries()).map(([state, name]) => ({
  state, name, count: gvNumbers.filter((n) => n.area.state === state).length,
}));

export const gvFeatures = [
  { title: "Permanent US number", desc: "Yours for as long as you use it; not a one-time code." },
  { title: "Calls and texts", desc: "Call and text the US and Canada from the Google Voice app or web." },
  { title: "Works for verification", desc: "Receive codes from apps and sites that need a US number." },
  { title: "Full account access", desc: "You get the Google login, so the number is fully under your control." },
];

// A Google Voice number stays active while it's used; these are the setup and keep-alive steps shown after delivery.
export const gvSetup = [
  "Open voice.google.com or the Google Voice app and sign in with the account details below.",
  "Change the password and add your own recovery email and phone.",
  "Make a call or send a text at least once every few months so Google keeps the number active.",
];
