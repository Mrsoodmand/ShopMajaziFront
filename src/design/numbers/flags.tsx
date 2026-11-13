"use client";

import type { ReactNode } from "react";

// Small drawn flags for the rent countries, whose placeholder data has no flag images yet. A flag image from the
// backend (`src`) wins when there is one; a country with no drawing shows its ISO code. Flags are drawn in a
// 30 × 20 box (3:2); the Union Jack and Canada keep their own 2:1 shape and are cropped to fit the tile.

type Art = { box: string; body: ReactNode };

// Horizontal (or vertical) bands of equal size, slightly overlapped so no hairline shows between them.
const bands = (colors: string[], vertical = false) => colors.map((fill, i) => {
  const size = (vertical ? 30 : 20) / colors.length;
  return vertical
    ? <rect key={i} x={i * size} y={0} width={size + 0.05} height={20} fill={fill} />
    : <rect key={i} x={0} y={i * size} width={30} height={size + 0.05} fill={fill} />;
});

// A five-pointed star as polygon points, centred on (x, y) with outer radius r.
const star = (x: number, y: number, r: number) => Array.from({ length: 10 }, (_, k) => {
  const rad = k % 2 ? r * 0.382 : r;
  const a = -Math.PI / 2 + (k * Math.PI) / 5;
  return `${(x + rad * Math.cos(a)).toFixed(2)},${(y + rad * Math.sin(a)).toFixed(2)}`;
}).join(" ");

const stripe = 20 / 13;

function art(cc: string): Art | null {
  switch (cc) {
    case "US":
      return { box: "0 0 30 20", body: <>
        <rect width={30} height={20} fill="#fff" />
        {[0, 2, 4, 6, 8, 10, 12].map((k) => <rect key={k} y={k * stripe} width={30} height={stripe} fill="#B22234" />)}
        <rect width={12} height={7 * stripe} fill="#3C3B6E" />
        {Array.from({ length: 9 }, (_, row) => Array.from({ length: row % 2 ? 5 : 6 }, (_, col) => (
          <polygon key={`${row}-${col}`} points={star((row % 2 ? 2 : 1) + col * 2, ((row + 1) * 7 * stripe) / 10, 0.45)} fill="#fff" />
        )))}
      </> };
    case "GB":
      // The thin red diagonals sit off-centre (counterchanged), drawn as four bands so no clip path id is needed.
      return { box: "0 0 60 30", body: <>
        <rect width={60} height={30} fill="#012169" />
        <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth={6} />
        <g fill="#C8102E">
          <polygon points="0,0 30,15 29.11,16.79 -0.89,1.79" />
          <polygon points="30,15 60,30 60.89,28.21 30.89,13.21" />
          <polygon points="30,15 0,30 0.89,31.79 30.89,16.79" />
          <polygon points="30,15 60,0 59.11,-1.79 29.11,13.21" />
        </g>
        <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth={10} />
        <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth={6} />
      </> };
    case "CA":
      return { box: "0 0 40 20", body: <>
        <rect width={40} height={20} fill="#fff" />
        <rect width={10} height={20} fill="#D52B1E" />
        <rect x={30} width={10} height={20} fill="#D52B1E" />
        <polygon fill="#D52B1E" points="20,3 21.3,5.5 22.8,4.9 22.3,8.6 24.2,6.9 24.7,8.1 26.6,7.7 25.9,10 26.8,10.5 23,13.6 23.4,14.8 20.4,14.4 20.5,17.3 19.5,17.3 19.6,14.4 16.6,14.8 17,13.6 13.2,10.5 14.1,10 13.4,7.7 15.3,8.1 15.8,6.9 17.7,8.6 17.2,4.9 18.7,5.5" />
      </> };
    case "DE": return { box: "0 0 30 20", body: bands(["#000", "#DD0000", "#FFCE00"]) };
    case "NL": return { box: "0 0 30 20", body: bands(["#AE1C28", "#fff", "#21468B"]) };
    case "FR": return { box: "0 0 30 20", body: bands(["#002654", "#fff", "#CE1126"], true) };
    case "PL": return { box: "0 0 30 20", body: bands(["#fff", "#DC143C"]) };
    case "ID": return { box: "0 0 30 20", body: bands(["#CE1126", "#fff"]) };
    case "ES":
      return { box: "0 0 30 20", body: <>
        <rect width={30} height={20} fill="#AA151B" />
        <rect y={5} width={30} height={10} fill="#F1BF00" />
      </> };
    case "IN":
      return { box: "0 0 30 20", body: <>
        {bands(["#FF9933", "#fff", "#138808"])}
        <circle cx={15} cy={10} r={2.4} fill="none" stroke="#000080" strokeWidth={0.45} />
        <circle cx={15} cy={10} r={0.5} fill="#000080" />
        {Array.from({ length: 12 }, (_, k) => {
          const a = (k * Math.PI) / 6;
          return <line key={k} x1={(15 - 2.4 * Math.cos(a)).toFixed(2)} y1={(10 - 2.4 * Math.sin(a)).toFixed(2)} x2={(15 + 2.4 * Math.cos(a)).toFixed(2)} y2={(10 + 2.4 * Math.sin(a)).toFixed(2)} stroke="#000080" strokeWidth={0.18} />;
        })}
      </> };
    case "BR":
      return { box: "0 0 30 20", body: <>
        <rect width={30} height={20} fill="#009C3B" />
        <polygon points="15,2.2 27.6,10 15,17.8 2.4,10" fill="#FFDF00" />
        <circle cx={15} cy={10} r={4.6} fill="#002776" />
        <path d="M10.5,9.2 Q14.8,7.7 19.5,11" fill="none" stroke="#fff" strokeWidth={0.8} />
      </> };
    case "PH":
      return { box: "0 0 30 20", body: <>
        <rect width={30} height={10} fill="#0038A8" />
        <rect y={10} width={30} height={10} fill="#CE1126" />
        <polygon points="0,0 17.3,10 0,20" fill="#fff" />
        <circle cx={6.2} cy={10} r={1.9} fill="#FCD116" />
        {Array.from({ length: 8 }, (_, k) => {
          const a = (k * Math.PI) / 4;
          return <line key={k} x1={(6.2 + 2.4 * Math.cos(a)).toFixed(2)} y1={(10 + 2.4 * Math.sin(a)).toFixed(2)} x2={(6.2 + 3.5 * Math.cos(a)).toFixed(2)} y2={(10 + 3.5 * Math.sin(a)).toFixed(2)} stroke="#FCD116" strokeWidth={0.7} />;
        })}
        {[[1.7, 2.6], [1.7, 17.4], [14.6, 10]].map(([x, y]) => <polygon key={`${x}-${y}`} points={star(x, y, 0.8)} fill="#FCD116" />)}
      </> };
    default:
      return null;
  }
}

// `className` sizes the tile (keep it 3:2, e.g. "h-6 w-9"); a hairline edge keeps white bands visible on a white card.
export function Flag({ cc, src, className = "h-6 w-9 rounded-[5px]" }: { cc: string; src?: string; className?: string }) {
  const drawn = src ? null : art(cc);
  return (
    <span aria-hidden className={`relative inline-grid shrink-0 place-items-center overflow-hidden bg-slate-100 dark:bg-white/10 ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {src ? <img src={src} alt="" loading="lazy" className="h-full w-full object-cover" />
        : drawn ? <svg viewBox={drawn.box} preserveAspectRatio="xMidYMid slice" className="h-full w-full">{drawn.body}</svg>
        : <span className="font-mono text-[10px] font-bold text-slate-700 dark:text-slate-200">{cc}</span>}
      <span className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-inset ring-black/10 dark:ring-white/15" />
    </span>
  );
}
