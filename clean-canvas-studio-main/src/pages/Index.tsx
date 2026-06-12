import NavBar from "@/components/portfolio/NavBar";
import Hero from "@/components/portfolio/Hero";
import FeaturedWorks from "@/components/portfolio/FeaturedWorks";
import FeaturedWebWorks from "@/components/portfolio/FeaturedWebWorks";
import Footer from "@/components/portfolio/Footer";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const Index = () => {
  useScrollReveal();

  return (
    <main className="min-h-screen bg-background">
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
