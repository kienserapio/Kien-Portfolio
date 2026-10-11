import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { useScrollToHash } from "@/hooks/useScrollToHash";
import { setLenis } from "@/lib/lenis";
import { initSound } from "@/lib/sound";
import DotField from "@/components/fx/DotField";
import { ScrollProgress } from "@/components/fx/ScrollProgress";
import Island from "@/components/Island";
import Dock from "@/components/Dock";
import CvModal from "@/components/CvModal";
import Home from "./pages/Home.tsx";

// Everything but the home page is split out so the first paint stays small.
const About = lazy(() => import("./pages/About.tsx"));
const Work = lazy(() => import("./pages/Work.tsx"));
const Project = lazy(() => import("./pages/Project.tsx"));
const Events = lazy(() => import("./pages/Events.tsx"));
const Awards = lazy(() => import("./pages/Awards.tsx"));
const Writing = lazy(() => import("./pages/Writing.tsx"));
const Article = lazy(() => import("./pages/Article.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));
const Cursor = lazy(() => import("@/components/fx/Cursor"));

const Page = ({ children }: { children: React.ReactNode }) => {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0, transitionEnd: { transform: "none" } }}
      exit={reduce ? { opacity: 0 } : { opacity: 0, y: -12 }}
      transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
    >
      <Suspense fallback={<div className="min-h-screen" />}>{children}</Suspense>
    </motion.div>
  );
};

const AppRoutes = () => {
  const location = useLocation();
  useScrollToHash();

  // Smooth scrolling for the whole site
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    const lenis = new Lenis({ autoRaf: true, lerp: 0.1 });
    setLenis(lenis);
    return () => {
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  // `initial` stays on: with initial={false}, motion skips the entrance of
  // everything inside the first page, so slide-ins never played on first load.
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Page><Home /></Page>} />
        <Route path="/about" element={<Page><About /></Page>} />
        <Route path="/work" element={<Page><Work /></Page>} />
        <Route path="/work/:slug" element={<Page><Project /></Page>} />
        <Route path="/events" element={<Page><Events /></Page>} />
        <Route path="/awards" element={<Page><Awards /></Page>} />
        <Route path="/writing" element={<Page><Writing /></Page>} />
        <Route path="/writing/:slug" element={<Page><Article /></Page>} />
        {/* old URLs */}
        <Route path="/achievements" element={<Navigate to="/awards" replace />} />
        <Route path="/speaking" element={<Navigate to="/events" replace />} />
        <Route path="/projects" element={<Navigate to="/work" replace />} />
        <Route path="*" element={<Page><NotFound /></Page>} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => {
  useEffect(() => {
    initSound();
  }, []);

  return (
    <BrowserRouter>
          <DotField />
          <ScrollProgress />
          <Island />
          <AppRoutes />
          <Dock />
          <CvModal />
          <Suspense fallback={null}>
            <Cursor />
          </Suspense>
    </BrowserRouter>
  );
};

export default App;
