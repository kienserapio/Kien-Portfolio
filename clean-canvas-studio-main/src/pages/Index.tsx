import NavBar from "@/components/portfolio/NavBar";
import Hero from "@/components/portfolio/Hero";
import FeaturedWorks from "@/components/portfolio/FeaturedWorks";
import FeaturedWebWorks from "@/components/portfolio/FeaturedWebWorks";
import Footer from "@/components/portfolio/Footer";

const Index = () => {
  return (
    <main className="min-h-screen bg-background">
      <NavBar />
      <Hero />
      <FeaturedWorks />
      <FeaturedWebWorks />
      <Footer />
    </main>
  );
};

export default Index;
