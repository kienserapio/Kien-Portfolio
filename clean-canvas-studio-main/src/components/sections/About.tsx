import PerspectiveText from "@/components/perspective-text-scroll";
import { BIONOTE } from "@/data/profile";

/** Phrases that carry the bionote get full ink; the rest sits a step lighter. */
const KEY = [
  "Kien Leriss R. Serapio",
  "Founder and Chief Executive Officer of Wika PH",
  "more than 2,000 learners in its first month",
  "PH100 Brightest Minds Under 30",
  "software developer and AI engineer",
];

const emphasize = (text: string) => {
  const re = new RegExp(`(${KEY.map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`, "g");
  return text.split(re).map((part, i) =>
    KEY.includes(part) ? (
      <span key={i} className="text-ink">
        {part}
      </span>
    ) : (
      <span key={i}>{part}</span>
    ),
  );
};

/** The formal bionote, tilting out of the distance as you scroll. */
const About = () => (
  <section id="about" className="relative z-10" aria-label="About Kien Serapio">
    <PerspectiveText
      height="320vh"
      text={<p>{emphasize(BIONOTE)}</p>}
      className="relative w-full max-w-4xl px-6 text-center font-hn text-[1.35rem] font-medium leading-[1.25] tracking-[-0.02em] text-ink/45 sm:text-3xl lg:text-[2.6rem]"
    />
  </section>
);

export default About;
