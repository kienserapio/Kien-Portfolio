import { lazy, Suspense } from "react";
import Seo from "@/components/Seo";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Wika from "@/components/sections/Wika";
import { PERSON_ID, SITE_URL } from "@/lib/site";
import { flagships } from "@/data/projects";

// Below the fold: split out so the hero paints first.
const Recognition = lazy(() => import("@/components/sections/Recognition"));
const Press = lazy(() => import("@/components/sections/Press"));
const Stage = lazy(() => import("@/components/sections/Stage"));
const Journey = lazy(() => import("@/components/sections/Journey"));
const World = lazy(() => import("@/components/sections/World"));
const Work = lazy(() => import("@/components/sections/Work"));
const Writing = lazy(() => import("@/components/sections/Writing"));
const Contact = lazy(() => import("@/components/sections/Contact"));

const TITLE = "Kien Serapio — Founder of Wika PH, AI Engineer & Software Developer";

const DESCRIPTION =
  "Kien Serapio is the Founder & CEO of Wika PH, a PH100 Brightest Minds Under 30 honoree, and an AI Engineer and Software Developer from Quezon City building offline AI, enterprise systems and apps used worldwide.";

/** Module scope keeps the object reference stable across renders. */
const HOME_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "@id": `${SITE_URL}/#flagship-work`,
  name: "Flagship work by Kien Serapio",
  itemListElement: flagships.map((p, i) => ({
    "@type": "ListItem",
    position: i + 1,
    url: `${SITE_URL}/work/${p.slug}`,
    item: {
      "@type": "CreativeWork",
      name: p.name,
      description: p.tagline,
      url: `${SITE_URL}/work/${p.slug}`,
      creator: { "@id": PERSON_ID },
    },
  })),
};

/**
 * One page, in story order: who I am → the company I founded → recognition →
 * press → stage → experience → reach → the work → writing → contact.
 */
const Home = () => (
  <main className="relative min-h-screen">
    <Seo title={TITLE} description={DESCRIPTION} path="/" type="profile" jsonLd={HOME_JSON_LD} />
    <Hero />
    <About />
    <Wika />
    <Suspense fallback={<div className="min-h-screen" />}>
      <Recognition />
      <Press />
      <Stage />
      <Journey />
      <World />
      <Work />
      <Writing />
      <Contact />
    </Suspense>
  </main>
);

export default Home;
