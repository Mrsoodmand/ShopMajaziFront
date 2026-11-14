// Text that writes itself in, word by word: each word rises from a soft blur a beat after the one before
// (globals.css › word-in). Words stay whole, so Persian letters keep joining. Screen readers get the sentence once;
// the animated words are hidden from them. Under prefers-reduced-motion the text is simply there.
// `delay`: ms before the first word; `step`: ms between words. Change `key` on the parent to play it again.
export default function WordReveal({ text, delay = 0, step = 55, className = "", once = false }: { text: string; delay?: number; step?: number; className?: string; once?: boolean }) {
  const words = text.split(/\s+/).filter(Boolean);
  const list = words.map((w, i) => (
    <span key={i}>
      <span className="inline-block animate-word-in" style={{ animationDelay: `${delay + i * step}ms` }}>{w}</span>
      {i < words.length - 1 && " "}
    </span>
  ));
  // `once`: the sentence is in the page a single time (no hidden copy for screen readers), for text search engines
  // read, like the home hero; the words are ordinary text, read in order.
  if (once) return <span className={className}>{list}</span>;
  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden>{list}</span>
    </span>
  );
}
