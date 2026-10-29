import { reviews } from "@/content/reviews-en";
import { Heading, ReviewCard } from "./parts";

// Offer A — "Marquee Wall": two rows of review cards drifting in opposite directions, faded at the edges.
// Hovering a row pauses it so a review can be read.
export default function TestiA() {
  const rowA = reviews.slice(0, 5);
  const rowB = reviews.slice(5);
  const Row = ({ list, reverse }: { list: typeof reviews; reverse?: boolean }) => (
    <div className="group flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
      <div className={`flex w-max gap-5 pe-5 ${reverse ? "animate-marquee-reverse" : "animate-marquee"} [animation-duration:60s] group-hover:[animation-play-state:paused]`}>
        {[...list, ...list].map((r, i) => <ReviewCard key={r.id + i} r={r} className="w-[340px] shrink-0" />)}
      </div>
    </div>
  );
  return (
    <section className="overflow-hidden bg-[#F5F6FB] py-24 dark:bg-[#070B14]">
      <div className="px-6"><Heading kicker="Reviews" title="Loved by people who hate waiting" sub="Thousands of orders every day, and here's what buyers say." /></div>
      <div className="mt-14 space-y-5">
        <Row list={rowA} />
        <Row list={rowB} reverse />
      </div>
    </section>
  );
}
