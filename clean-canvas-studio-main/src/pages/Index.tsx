import Seo from "@/components/Seo";
import NavBar from "@/components/portfolio/NavBar";
import Hero from "@/components/portfolio/Hero";
import FeaturedWorks from "@/components/portfolio/FeaturedWorks";
import FeaturedWebWorks from "@/components/portfolio/FeaturedWebWorks";
import Footer from "@/components/portfolio/Footer";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { PERSON_ID, SITE_URL } from "@/lib/site";

const TITLE = "Kien Serapio — Product Designer & Software Engineer";

const DESCRIPTION =
  "Kien Serapio — product designer and software engineer in Manila. Founder & CEO of Wika PH, AI engineering intern at NMBLR AI Foundry, BSCS at TUP Manila.";

/** Module scope keeps the object reference stable across renders. */
const PROJECTS_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "@id": `${SITE_URL}/#projects`,
  name: "Selected work by Kien Serapio",
  description:
    "Apps, AI products, and websites designed and built by Kien Serapio.",
  itemListOrder: "https://schema.org/ItemListOrderDescending",
  numberOfItems: 9,
  itemListElement: [
    {
      name: "Wika",
      description:
        "A Philippine language-learning mobile app that teaches and preserves regional Filipino languages, with a real-time conversational AI tutor. 1st Runner Up, Developer Camp Manila 2026.",
      url: "https://wikaph.com",
    },
    {
      name: "DEVCON+",
      description:
        "The member platform for 11 DEVCON Philippines chapters — events, exclusive rewards, and an XP system, shipped as a Progressive Web App.",
    },
    {
      name: "AKBAI",
      description:
        "An AI-powered itinerary travel planner and local translator for tourists in the Philippines.",
    },
    {
      name: "Sinag",
      description:
        "An AI and blockchain rewards platform for household electricity savings, built for the Meralco IDOL Hackathon 2025.",
      url: "https://sinag-website.vercel.app",
    },
    {
      name: "Kolehiyo",
      description:
        "A centralized college and scholarship application tracker for Filipino students.",
      url: "https://kolehiyo.vercel.app",
    },
    {
      name: "Centro",
      description:
        "A property management SaaS unifying residential, administrative, and security operations for subdivisions, condominiums, and barangay administration.",
      url: "https://centro-platform.vercel.app",
    },
    {
      name: "She is DEVCON",
      description:
        "Website for DEVCON Philippines' women-in-tech program.",
      url: "https://devcon.ph/she",
    },
    {
      name: "DEVCON Jumpstart",
      description:
        "Internship program website for DEVCON Philippines.",
      url: "https://devcon.ph/jumpstart-internships/",
    },
    {
      name: "Eclipse",
      description:
        "A high-speed 2D movement platformer with a dual-state physics engine, built in 48 hours. Most Fun Game (Major Award), Global Game Jam 2026.",
    },
  ].map((project, index) => ({
    "@type": "ListItem",
    position: index + 1,
    item: {
      "@type": "CreativeWork",
      name: project.name,
      description: project.description,
      ...(project.url ? { url: project.url } : {}),
      creator: { "@id": PERSON_ID },
    },
  })),
};

const Index = () => {
  useScrollReveal();

  return (
    <main className="min-h-screen bg-background">
      <Seo
        title={TITLE}
        description={DESCRIPTION}
        path="/"
        jsonLd={PROJECTS_JSON_LD}
      />
      <NavBar />
      <Hero />
      <div className="scroll-reveal">
        <FeaturedWorks />
      </div>
      <div className="scroll-reveal">
        <FeaturedWebWorks />
      </div>
      <div className="scroll-reveal">
        <Footer />
      </div>
    </main>
  );
};

export default Index;
