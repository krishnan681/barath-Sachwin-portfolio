import { useEffect, lazy, Suspense } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

import Navbar from "./components/Navbar/Navbar";
import Hero from "./components/Hero/Hero";
import About from "./components/About/About";
import CreativeExpertise from "./components/CreativeExpertise/CreativeExpertise";
import CareerHighlights from "./components/CareerHighlights/CareerHighlights";
import Branding from "./components/Branding/Branding";
import VisualCreations from "./components/VisualCreations/VisualCreations";
import Tools from "./components/Tools/Tools";
import Contact from "./components/Contact/Contact";
import ClickSpark from "./components/ClickSpark/ClickSpark";
import CurvedLoop from "./components/CurvedLoop/CurvedLoop";

import ErrorBoundary from "./components/Common/ErrorBoundary";
import NetworkStatus from "./components/Common/NetworkStatus";
import PageLoader from "./components/Common/PageLoader";

// Code-split route-level lazy loading for sub-pages
const ProjectPage = lazy(() => import("./pages/ProjectPage/ProjectPage"));
const ImagesPage = lazy(() => import("./pages/VisualCreations/ImagesPage"));
const VideosPage = lazy(() => import("./pages/VisualCreations/VideosPage"));

function PageLoadingFallback() {
  return <PageLoader text="Loading Showcase..." />;
}

function Home() {
  const location = useLocation();

  useEffect(() => {
    const hash = location.hash || window.location.hash;
    if (hash) {
      const targetId = hash.replace("#", "");
      const timer = setTimeout(() => {
        const targetEl = document.getElementById(targetId);
        if (targetEl) {
          if (window.__lenis) {
            window.__lenis.scrollTo(targetEl, { offset: -30, duration: 1.2 });
          } else {
            targetEl.scrollIntoView({ behavior: "smooth" });
          }
        }
      }, 160);
      return () => clearTimeout(timer);
    }
  }, [location.hash, location.pathname, location.key]);

  return (
    <>
      <Navbar />

      <main>
        <Hero />
        <div className="content-layers">
          <CurvedLoop
            items={[
              "Skilled in motion design",
              "Video editing",
              "Visual storytelling",
              "Videography",
              "Photography",
              "Color grading",
              "Post-production workflows",
              "Delivering high-impact",
            ]}
            speed={1.4}
            curveAmount={0}
            direction="left"
            interactive={true}
          />
          <About />
          <CreativeExpertise />
          <CareerHighlights />
          <Branding />
          <VisualCreations />
          <Tools />
          <Contact />
        </div>
      </main>
    </>
  );
}

function App() {
  useEffect(() => {
    AOS.init({
      duration: 750,
      easing: "ease-out-cubic",
      once: true,
      offset: 50,
      delay: 0,
    });

    // Initialize Lenis Smooth Scroll with high-FPS hardware tuning
    const lenis = new Lenis({
      duration: 1.0,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      smoothTouch: false, // Native fast touch on mobile
      wheelMultiplier: 0.95,
      touchMultiplier: 1.5,
    });

    window.__lenis = lenis;

    let rafId;
    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      delete window.__lenis;
    };
  }, []);

  return (
    <ErrorBoundary>
      <ClickSpark
        sparkColor="#1b4ef5"
        sparkSize={10}
        sparkRadius={18}
        sparkCount={8}
        duration={400}
      >
        <BrowserRouter>
          <NetworkStatus />
          <Suspense fallback={<PageLoadingFallback />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/images" element={<ImagesPage />} />
              <Route path="/visual-creations/images" element={<ImagesPage />} />
              <Route path="/videos" element={<VideosPage />} />
              <Route path="/visual-creations/videos" element={<VideosPage />} />
              <Route path="/branding/:slug" element={<ProjectPage />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </ClickSpark>
    </ErrorBoundary>
  );
}

export default App;
