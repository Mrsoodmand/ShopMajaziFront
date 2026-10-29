import HeroG from "../hero/HeroG";

// Shown under each header offer on the comparison page, so the header is judged on top of the chosen hero.
export default function HeaderContext({ overlay }: { overlay?: boolean }) {
  return <HeroG bare={overlay ? "overlay" : "flow"} />;
}
