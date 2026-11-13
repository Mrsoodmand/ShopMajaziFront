// Articles written in the old admin's editor (HTML) as plain headings and paragraphs: no markup from the database
// reaches the page. Line breaks split paragraphs ("• item<br>• item" becomes one paragraph per item) and list items
// become paragraphs of their own, numbered in ordered lists. Images, tables and links are left out.
// The admin writes these in Persian, so list numbers default to Persian digits.

export type ArticleBlock = { kind: "h" | "p"; text: string };
export type ArticleSection = { title: string; paragraphs: string[] };

const ENTITIES: Record<string, string> = {
  amp: "&", lt: "<", gt: ">", quot: "\"", apos: "'", nbsp: " ", zwnj: "‌", zwj: "‍", bull: "•", middot: "·", hellip: "…",
  ndash: "–", mdash: "—", laquo: "«", raquo: "»", lsquo: "‘", rsquo: "’", ldquo: "“", rdquo: "”",
};

const entity = (m: string, e: string) => {
  if (e[0] !== "#") return ENTITIES[e.toLowerCase()] ?? m;
  const code = e[1] === "x" || e[1] === "X" ? parseInt(e.slice(2), 16) : Number(e.slice(1));
  return Number.isInteger(code) && code > 0 && code <= 0x10ffff ? String.fromCodePoint(code) : m;
};

// One element's inner HTML as lines of plain text (one pass over the entities, so "&amp;lt;" stays "&lt;").
const lines = (html: string) => html
  .replace(/<br\s*\/?>/gi, "\n")
  .replace(/<[^>]+>/g, " ")
  .replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, entity)
  .split("\n").map((l) => l.replace(/\s+/g, " ").trim()).filter(Boolean);

export function articleBlocks(html: string | null | undefined, listMark: (n: number) => string = (n) => `${n.toLocaleString("fa-IR")}.`): ArticleBlock[] {
  if (!html) return [];
  // Number the items of ordered lists while the list tags are still there.
  const marked = html.replace(/<ol\b[^>]*>([\s\S]*?)<\/ol>/gi, (_, inner: string) => {
    let n = 0;
    return inner.replace(/<li\b[^>]*>/gi, () => `<li data-mark="${listMark(++n)}">`);
  });
  const out: ArticleBlock[] = [];
  for (const m of marked.matchAll(/<(h[1-6]|p|li)\b([^>]*)>([\s\S]*?)<\/\1>/gi)) {
    const text = lines(m[3]);
    if (!text.length) continue;
    if (m[1][0].toLowerCase() === "h") { out.push({ kind: "h", text: text.join(" ") }); continue; }
    const mark = m[1].toLowerCase() === "li" ? (m[2].match(/data-mark="([^"]*)"/)?.[1] ?? "•") : "";
    text.forEach((t, i) => out.push({ kind: "p", text: i === 0 && mark ? `${mark} ${t}` : t }));
  }
  return out;
}

// Blocks as sections: every heading starts one; paragraphs before the first heading go under `intro`.
// Headings with nothing under them (an image only) are left out.
export function articleSections(blocks: ArticleBlock[], intro: string): ArticleSection[] {
  const out: ArticleSection[] = [];
  for (const b of blocks) {
    if (b.kind === "h") out.push({ title: b.text, paragraphs: [] });
    else {
      if (!out.length) out.push({ title: intro, paragraphs: [] });
      out[out.length - 1].paragraphs.push(b.text);
    }
  }
  return out.filter((s) => s.paragraphs.length);
}

const words = (s: string) => s.replace(/[^\p{L}\p{N}\s]/gu, " ").split(/\s+/).filter(Boolean);

// Whether paragraph `a` mostly restates `b`: most of its first 20 words appear in `b`. The old admin's short text
// often repeats the article's opening with small spelling differences.
export function repeats(a: string, b: string) {
  const head = words(a).slice(0, 20);
  if (head.length < 6) return false;
  const seen = new Set(words(b));
  return head.filter((w) => seen.has(w)).length / head.length >= 0.8;
}
