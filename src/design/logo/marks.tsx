// Ten logo marks for ShopMajazi, drawn on a 32px grid so they stay crisp from a 16px favicon up to a poster.
// Tile marks carry their own background and read on light and dark alike; open marks use `currentColor` for the
// ink parts, so they follow the theme. `word` sets how the name is set beside the mark.

import type { ReactNode } from "react";

export type WordStyle = "bold" | "split" | "light";
// `size` sets pixel width and height (needed where CSS classes do not apply, such as the generated favicon).
export type MarkProps = { className?: string; size?: number };
export type LogoMark = { id: string; name: string; summary: string; word: WordStyle; ink?: boolean; Mark: (p: MarkProps) => ReactNode };

const Svg = ({ className = "", size, children, title }: MarkProps & { children: ReactNode; title?: string }) => (
  <svg viewBox="0 0 32 32" fill="none" width={size} height={size} className={className} aria-hidden={title ? undefined : true} role={title ? "img" : undefined}>{title && <title>{title}</title>}{children}</svg>
);

// A · Signal Bag — a shopping bag whose handle is a signal: goods that arrive over the air.
function SignalBag({ className, size }: MarkProps) {
  return (
    <Svg className={className} size={size}>
      <rect width="32" height="32" rx="9" fill="#047857" />
      <path d="M8.5 14.5h15l-1.3 9.6a2.2 2.2 0 0 1-2.2 1.9h-8a2.2 2.2 0 0 1-2.2-1.9z" fill="#fff" />
      <path d="M12.6 12.2a4.8 4.8 0 0 1 6.8 0" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M9.6 9.3a9 9 0 0 1 12.8 0" stroke="#6EE7B7" strokeWidth="2.2" strokeLinecap="round" />
    </Svg>
  );
}

// B · Shin — the Persian letter ش of شاپ: three teeth and three dots. Bilingual at a glance.
function Shin({ className, size }: MarkProps) {
  return (
    <Svg className={className} size={size}>
      <rect width="32" height="32" rx="9" fill="#0F172A" />
      <rect x=".5" y=".5" width="31" height="31" rx="8.5" stroke="#fff" strokeOpacity=".14" />
      <path d="M25.5 15v3.2a2.6 2.6 0 0 1-5.2 0V15m0 3.2a2.6 2.6 0 0 1-5.2 0V15m0 3.2c0 4.6-2.9 7.3-6 7.3-2.6 0-4.1-1.9-4.1-4.6" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="17.7" cy="9.6" r="1.8" fill="#34D399" />
      <circle cx="23.1" cy="9.6" r="1.8" fill="#34D399" />
      <circle cx="20.4" cy="5.4" r="1.8" fill="#34D399" />
    </Svg>
  );
}

// C · Code Bubble — a message bubble holding a one-time code: the virtual-number promise.
function CodeBubble({ className, size }: MarkProps) {
  return (
    <Svg className={className} size={size}>
      <rect width="32" height="32" rx="9" fill="#4F46E5" />
      <path d="M8.5 8h15A2.5 2.5 0 0 1 26 10.5v9a2.5 2.5 0 0 1-2.5 2.5H15l-5.2 4.2V22H8.5A2.5 2.5 0 0 1 6 19.5v-9A2.5 2.5 0 0 1 8.5 8z" fill="#fff" />
      <circle cx="11.5" cy="15" r="1.7" fill="#4F46E5" />
      <circle cx="16" cy="15" r="1.7" fill="#4F46E5" />
      <circle cx="20.5" cy="15" r="1.7" fill="#10B981" />
    </Svg>
  );
}

// D · Pixel S — an S built from rounded pixels, one of them lit: digital, playful, unmistakable small.
function PixelS({ className, size }: MarkProps) {
  const on = [[1, 1, 1], [1, 0, 0], [1, 1, 1], [0, 0, 1], [1, 1, 1]];
  const cell = 4.6, gap = 1.3, x0 = (32 - (3 * cell + 2 * gap)) / 2, y0 = (32 - (5 * cell + 4 * gap)) / 2;
  return (
    <Svg className={className} size={size}>
      {on.flatMap((row, r) => row.map((v, c) => v ? (
        <rect key={`${r}-${c}`} x={x0 + c * (cell + gap)} y={y0 + r * (cell + gap)} width={cell} height={cell} rx="1.3" fill={r === 0 && c === 2 ? "#F59E0B" : "#059669"} />
      ) : null))}
    </Svg>
  );
}

// E · Counter — a shop awning over a counter: the "shop" in ShopMajazi, kept simple enough for a favicon.
function Counter({ className, size }: MarkProps) {
  return (
    <Svg className={className} size={size}>
      <rect width="32" height="32" rx="9" fill="#047857" />
      {[0, 1, 2, 3].map((i) => (
        <path key={i} d={`M${6 + i * 5} 7h5v5.5a2.5 2.5 0 0 1-5 0z`} fill="#fff" fillOpacity={i % 2 ? 0.6 : 1} />
      ))}
      <path d="M8.5 17.5V24a1.5 1.5 0 0 0 1.5 1.5h12a1.5 1.5 0 0 0 1.5-1.5v-6.5" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" />
      <rect x="13.5" y="19.5" width="5" height="6" rx="1" fill="#6EE7B7" />
    </Svg>
  );
}

// F · Bolt Bag — a solid bag with a lightning bolt: bought now, delivered in minutes.
function BoltBag({ className, size }: MarkProps) {
  return (
    <Svg className={className} size={size}>
      <path d="M12 11.5V9.5a4 4 0 0 1 8 0v2" stroke="#059669" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M6.5 11.5h19l-1.6 13a2.8 2.8 0 0 1-2.8 2.5H10.9a2.8 2.8 0 0 1-2.8-2.5z" fill="#059669" />
      <path d="M17.6 13.8 12.4 20.4h3.7l-1.4 4.8 5.2-6.6h-3.7z" fill="#FDE68A" />
    </Svg>
  );
}

// G · SIM — a SIM card with a gold chip: numbers that live in the cloud, not in your phone.
function Sim({ className, size }: MarkProps) {
  return (
    <Svg className={className} size={size}>
      <path d="M10 3.5h9.2l7.3 7.3V26a2.5 2.5 0 0 1-2.5 2.5H10A2.5 2.5 0 0 1 7.5 26V6A2.5 2.5 0 0 1 10 3.5z" fill="#6D28D9" />
      <rect x="11" y="14" width="10.5" height="9.5" rx="2" fill="#FCD34D" />
      <path d="M11 18.75h10.5M16.25 14v4.75M13.5 18.75v4.75M19 18.75v4.75" stroke="#B45309" strokeOpacity=".55" strokeWidth="1" />
    </Svg>
  );
}

// H · Orbit — a world with a satellite on its path: a global shop, open around the clock.
function Orbit({ className, size }: MarkProps) {
  return (
    <Svg className={className} size={size}>
      {/* Back half of the orbit, the planet, then the front half over it. */}
      <g transform="rotate(-22 16 16)" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M2 16A14 5.2 0 0 1 30 16" strokeOpacity=".45" />
        <circle cx="16" cy="16" r="8.5" fill="#059669" stroke="none" />
        <path d="M2 16A14 5.2 0 0 0 30 16" />
      </g>
      <path d="M9 12.2a8 8 0 0 1 13.4-1.6" stroke="#6EE7B7" strokeWidth="1.6" strokeLinecap="round" strokeOpacity=".75" />
      <circle cx="27.4" cy="10.6" r="2.4" fill="#F59E0B" />
    </Svg>
  );
}

// I · Frame QR — the frame redrawn as a QR code: three finder squares in the corners, the small alignment square
// in the fourth (its centre lit emerald), and the shop bag in the middle where a QR code keeps its logo.
// Scan, pay, receive. Ink parts follow the theme.
// Helpers inside an <svg> are plain functions returning shapes, not components: the favicon renderer (next/og)
// only understands plain SVG elements there.
function finder(x: number, y: number) {
  return [
    <rect key={`f${x}${y}`} x={x} y={y} width="6.8" height="6.8" rx="1.9" stroke="currentColor" strokeWidth="1.9" />,
    <rect key={`d${x}${y}`} x={x + 1.9} y={y + 1.9} width="3" height="3" rx=".8" fill="currentColor" />,
  ];
}
function FrameQr({ className, size }: MarkProps) {
  return (
    <Svg className={className} size={size}>
      {finder(2.8, 2.8)}
      {finder(22.4, 2.8)}
      {finder(2.8, 22.4)}
      <rect x="22.9" y="22.9" width="5" height="5" rx="1.4" stroke="currentColor" strokeWidth="1.6" />
      <rect x="24.5" y="24.5" width="1.8" height="1.8" rx=".5" fill="#059669" />
      <path d="M13.9 13.4v-1.3a2.1 2.1 0 0 1 4.2 0v1.3" stroke="#059669" strokeWidth="1.9" strokeLinecap="round" />
      <path d="M10.9 13.4h10.2l-1.2 6.9a1.8 1.8 0 0 1-1.77 1.5h-4.46a1.8 1.8 0 0 1-1.77-1.5z" fill="#059669" />
    </Svg>
  );
}

// I1 · Frame (first version) — viewfinder corners around a small bag. Kept for comparison.
function Frame({ className, size }: MarkProps) {
  return (
    <Svg className={className} size={size}>
      <path d="M5.5 11.5V8A2.5 2.5 0 0 1 8 5.5h3.5M20.5 5.5H24A2.5 2.5 0 0 1 26.5 8v3.5M26.5 20.5V24a2.5 2.5 0 0 1-2.5 2.5h-3.5M11.5 26.5H8A2.5 2.5 0 0 1 5.5 24v-3.5" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
      <path d="M13.6 14.2v-1a2.4 2.4 0 0 1 4.8 0v1" stroke="#059669" strokeWidth="2" strokeLinecap="round" />
      <path d="M10.8 14.2h10.4l-1 7.2a1.8 1.8 0 0 1-1.8 1.6h-4.8a1.8 1.8 0 0 1-1.8-1.6z" fill="#059669" />
    </Svg>
  );
}

// J · Two-tone S — an S made of two arcs, indigo and emerald: buyer and delivery, two languages, one shop.
function TwoToneS({ className, size }: MarkProps) {
  return (
    <Svg className={className} size={size}>
      <path d="M22.4 9.4A6.6 6.6 0 1 0 16 16" stroke="#4F46E5" strokeWidth="4.6" strokeLinecap="round" />
      <path d="M16 16a6.6 6.6 0 1 1-6.4 6.6" stroke="#10B981" strokeWidth="4.6" strokeLinecap="round" />
    </Svg>
  );
}

// ---------- Round 2: the ShopMajazi cart, redrawn ----------
// The brand's own logo (Back/public/upload/logo) is a sand-yellow shopping cart on a deep teal tile: a handle that
// turns into a diagonal and the bottom rail, a basket open on its left side, two wheels. These marks keep that cart
// and its colours, redrawn on one clean geometry so every variant shares the same bones.
const PETROL = "#0E4F5C";
const SAND = "#F7D58B";
const CHASSIS = "M5.7 8.9H8.7L13.7 19.4H25.2";
// The basket starts clear of the handle (as in the original), and the solid one's left side runs parallel to it.
const BASKET_OPEN = "M12.2 6.4H24.2a1.5 1.5 0 0 1 1.45 1.9l-1.9 6.9a2.2 2.2 0 0 1-2.1 1.6H16.6";
const BASKET_FULL = "M11.8 6.4H24.2a1.5 1.5 0 0 1 1.45 1.9l-1.9 6.9a2.2 2.2 0 0 1-2.1 1.6H16.6z";

function cart({ ink, wheel = ink, full, basket = ink, chassis = CHASSIS, w = 2.6 }: { ink: string; wheel?: string; full?: boolean; basket?: string; chassis?: string; w?: number }) {
  return [
    <path key="chassis" d={chassis} stroke={ink} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" />,
    full
      ? <path key="basket" d={BASKET_FULL} fill={basket} stroke={basket} strokeWidth={w} strokeLinejoin="round" />
      : <path key="basket" d={BASKET_OPEN} stroke={basket} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" />,
    <circle key="w1" cx="15.2" cy="24.4" r="2.1" fill={wheel} />,
    <circle key="w2" cx="23.7" cy="24.4" r="2.1" fill={wheel} />,
  ];
}

const tile = (fill = PETROL) => <rect width="32" height="32" rx="8" fill={fill} />;

// K · Refined — the same cart and colours, redrawn: one stroke weight, true angles, balanced in the tile.
function CartRefined({ className, size }: MarkProps) {
  return <Svg className={className} size={size}>{tile()}{cart({ ink: SAND })}</Svg>;
}

// L · Monoline — one continuous line from the handle round the basket, no tile; amber wheels.
function CartMonoline({ className, size }: MarkProps) {
  return (
    <Svg className={className} size={size}>
      <path d="M4.5 7.2h3l5 10.9h12.1l2.6-9.3H9.6" stroke="#0D9488" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="14.4" cy="23.6" r="2.2" fill="#E9A23B" />
      <circle cx="23.1" cy="23.6" r="2.2" fill="#E9A23B" />
    </Svg>
  );
}

// M · Shin Cart — the three dots of ش ride in the basket as the goods: the Persian name inside the cart.
function CartShin({ className, size }: MarkProps) {
  return (
    <Svg className={className} size={size}>
      {tile()}{cart({ ink: SAND })}
      <circle cx="16.9" cy="13.1" r="1.55" fill="#fff" />
      <circle cx="21" cy="13.1" r="1.55" fill="#fff" />
      <circle cx="18.95" cy="9.6" r="1.55" fill="#fff" />
    </Svg>
  );
}

// N · Bolt Cart — a solid sand basket with a teal lightning bolt: bought now, delivered in minutes.
function CartBolt({ className, size }: MarkProps) {
  return (
    <Svg className={className} size={size}>
      {tile()}{cart({ ink: SAND, full: true })}
      <path d="M20.4 8.4l-3.3 4.1h2.4l-.9 3.1 3.3-4.1h-2.4z" fill={PETROL} />
    </Svg>
  );
}

// O · Code Cart — the solid basket carries a code (•••): the virtual numbers the shop is known for.
function CartCode({ className, size }: MarkProps) {
  return (
    <Svg className={className} size={size}>
      {tile()}{cart({ ink: SAND, full: true })}
      {[16.6, 19.5, 22.4].map((x) => <circle key={x} cx={x} cy="11.6" r="1.35" fill={PETROL} />)}
    </Svg>
  );
}

// P · Express — the cart moves right, with three speed lines trailing behind it.
function CartExpress({ className, size }: MarkProps) {
  return (
    <Svg className={className} size={size}>
      {tile()}
      <g transform="translate(2 0)">{cart({ ink: SAND })}</g>
      <path d="M2.6 12.6h3.6M1.8 15.8h5.1M3.4 19h3" stroke={SAND} strokeOpacity=".7" strokeWidth="1.8" strokeLinecap="round" />
    </Svg>
  );
}

// Q · Click Cart — the handle becomes a cursor: one click and it's in your cart.
function CartClick({ className, size }: MarkProps) {
  return (
    <Svg className={className} size={size}>
      {tile()}
      {cart({ ink: SAND, chassis: "M8.6 11.2L13.7 19.4H25.2" })}
      <path d="M3.6 3.9l6.9 2.7-2.9 1.3-1.3 2.9z" fill="#fff" stroke="#fff" strokeWidth="1" strokeLinejoin="round" />
    </Svg>
  );
}

// R · Sand — the colours swapped: a warm sand tile with the cart in deep teal.
function CartSand({ className, size }: MarkProps) {
  return <Svg className={className} size={size}>{tile(SAND)}{cart({ ink: PETROL })}</Svg>;
}

// S · Emerald — the redrawn cart on the site's own emerald, so the logo and the Continue button match.
function CartEmerald({ className, size }: MarkProps) {
  return <Svg className={className} size={size}>{tile("#047857")}{cart({ ink: "#fff", wheel: "#6EE7B7" })}</Svg>;
}

// T · Spark — a round teal badge, the cart and a small sand sparkle: majazi, the virtual shop.
function CartSpark({ className, size }: MarkProps) {
  return (
    <Svg className={className} size={size}>
      <circle cx="16" cy="16" r="16" fill={PETROL} />
      <g transform="translate(16 17.2) scale(.86) translate(-16 -16)">{cart({ ink: SAND })}</g>
      <path d="M11.5 1.9q.4 2.3 2.7 2.7-2.3.4-2.7 2.7-.4-2.3-2.7-2.7 2.3-.4 2.7-2.7z" fill="#fff" />
    </Svg>
  );
}

// The logo the site had before this round: an indigo-to-fuchsia tile with an S. Used until an offer is chosen.
export function CurrentMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <defs><linearGradient id="sm-current" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#4F46E5" /><stop offset="1" stopColor="#D946EF" /></linearGradient></defs>
      <rect width="32" height="32" rx="8" fill="url(#sm-current)" />
      <text x="16" y="21.5" textAnchor="middle" fontSize="15" fontWeight="700" fill="#fff" fontFamily="var(--font-grotesk), system-ui, sans-serif">S</text>
    </svg>
  );
}

export const marks: LogoMark[] = [
  { id: "A", name: "Signal Bag", word: "bold", summary: "Emerald tile with a white shopping bag whose handle is a signal: goods that arrive over the air. Uses the site's Continue green.", Mark: SignalBag },
  { id: "B", name: "Shin", word: "bold", summary: "The Persian letter ش from شاپ, three teeth under three emerald dots, on an ink tile. Says 'Persian shop' to anyone who reads it, and is still a clean shape to anyone who doesn't.", Mark: Shin },
  { id: "C", name: "Code Bubble", word: "split", summary: "Indigo tile with a message bubble holding a code (the last digit lit green): the virtual-number promise. Name set as a light 'Shop' and a bold 'Majazi'.", Mark: CodeBubble },
  { id: "D", name: "Pixel S", word: "bold", summary: "An S built from eleven rounded emerald pixels with one amber pixel lit. Digital, playful and still readable at 16px.", Mark: PixelS },
  { id: "E", name: "Counter", word: "split", summary: "A striped shop awning over a counter, on an emerald tile. The most literal 'shop': calm, friendly, trustworthy.", Mark: Counter },
  { id: "F", name: "Bolt Bag", word: "bold", summary: "A solid emerald bag with a pale gold lightning bolt and no tile: bought now, delivered in minutes.", Mark: BoltBag },
  { id: "G", name: "SIM", word: "light", summary: "A violet SIM card with a gold chip: numbers that live in the cloud. Name set light and wide for a techier feel.", Mark: Sim },
  { id: "H", name: "Orbit", word: "bold", ink: true, summary: "An emerald world with an orbit in the theme's ink and an amber satellite: a global shop that is always open.", Mark: Orbit },
  { id: "I", name: "Frame · QR", word: "split", ink: true, summary: "Frame redrawn as a QR code: three finder squares in the corners, the small alignment square in the fourth (its centre lit emerald) and a bigger shop bag in the middle, where a QR code keeps its logo. Scan, pay, receive. Ink follows light and dark.", Mark: FrameQr },
  { id: "I1", name: "Frame (first version)", word: "split", ink: true, summary: "The first Frame: viewfinder corners in the theme's ink around a small emerald bag. Kept for comparison with Frame · QR.", Mark: Frame },
  { id: "J", name: "Two-tone S", word: "bold", summary: "An S drawn as two thick arcs, indigo above and emerald below: buyer and delivery, two languages, one shop. Keeps the site's two brand colours.", Mark: TwoToneS },
  // Round 2: the brand's own cart, redrawn.
  { id: "K", name: "Cart · Refined", word: "bold", summary: "The ShopMajazi cart as it is today (sand cart, deep teal tile), redrawn: one stroke weight, true angles, the basket and wheels balanced in the tile. The closest to the current logo.", Mark: CartRefined },
  { id: "L", name: "Cart · Monoline", word: "split", summary: "The cart as one continuous teal line, from the handle round the basket, with amber wheels and no tile. Lighter and more modern; reads on light and dark.", Mark: CartMonoline },
  { id: "M", name: "Cart · Shin", word: "bold", summary: "The three dots of ش (from شاپ) ride in the basket as the goods: the Persian name hidden inside the cart.", Mark: CartShin },
  { id: "N", name: "Cart · Bolt", word: "bold", summary: "A solid sand basket with a teal lightning bolt: bought now, delivered in minutes.", Mark: CartBolt },
  { id: "O", name: "Cart · Code", word: "split", summary: "The solid basket carries a code (three dots): the virtual numbers and codes the shop is known for.", Mark: CartCode },
  { id: "P", name: "Cart · Express", word: "bold", summary: "The cart moves forward with three speed lines trailing behind it: instant delivery.", Mark: CartExpress },
  { id: "Q", name: "Cart · Click", word: "split", summary: "The handle becomes a white mouse cursor: one click and it's in your cart. The online shop in one picture.", Mark: CartClick },
  { id: "R", name: "Cart · Sand", word: "bold", summary: "The colours swapped: a warm sand tile with the cart in deep teal. Friendlier and stands out among dark app icons.", Mark: CartSand },
  { id: "S", name: "Cart · Emerald", word: "bold", summary: "The redrawn cart, white with mint wheels, on the site's emerald, so the logo and the green Continue button belong together.", Mark: CartEmerald },
  { id: "T", name: "Cart · Spark", word: "light", summary: "A round teal badge with the cart and a small sparkle above it: majazi, the virtual shop. Softer, app-icon style.", Mark: CartSpark },
];

// Marks set aside (still under "Show archived"); I · Frame QR is the chosen logo and stays on the shortlist.
export const archivedMarks = new Set(["A", "B", "C", "D", "E", "F", "G", "H", "I1", "J"]);

export const markById = (id?: string) => marks.find((m) => m.id === id);
