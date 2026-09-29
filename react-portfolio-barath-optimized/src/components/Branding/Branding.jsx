import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowUpRight, Sparkles } from "lucide-react";
import { BRANDS } from "../../data/brands";
import "./Branding.css";

export default function Branding() {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  const [cardWidth, setCardWidth] = useState(280);
  const containerRef = useRef(null);

  const total = BRANDS.length;

  // Dynamically calculate responsive card dimensions
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 480) {
        setCardWidth(205);
      } else if (window.innerWidth < 768) {
        setCardWidth(240);
      } else if (window.innerWidth < 1200) {
        setCardWidth(280);
      } else {
        setCardWidth(320);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toPrev = useCallback(() => {
    setActiveIndex((prev) => Math.max(0, prev - 1));
  }, []);

  const toNext = useCallback(() => {
    setActiveIndex((prev) => Math.min(total - 1, prev + 1));
  }, [total]);

  const toSlide = useCallback((index) => {
    setActiveIndex(index);
  }, []);

  // Keyboard navigation support
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowLeft") toPrev();
      if (e.key === "ArrowRight") toNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toPrev, toNext]);

  const handleCardClick = (index, slug) => {
    if (activeIndex === index) {
      navigate(`/branding/${slug}`);
    } else {
      toSlide(index);
    }
  };

  const gap = typeof window !== "undefined" && window.innerWidth < 480 ? 14 : 22;
  const stride = cardWidth + gap;

  return (
    <section className="branding-section sc_py" id="branding" aria-label="Branding Collaborations">
      <div className="container-fluid px-0">
        {/* ================= TITLE ================= */}
        <div className="title" data-aos="fade-up">
          <div className="bg-text">Branding</div>
          <h1 className="main-title">COLLABORATIONS</h1>
        </div>

        {/* ================= DESCRIPTION & HINT ================= */}
        <div className="BC-heading text-center" data-aos="fade-up" data-aos-delay="100">
          <p>
            <span>Creative work delivered across diverse industries entertainment, retail,</span>
            <span>hospitality, and  showcasing versatile design and content expertise.</span>
          </p>

          {/* <div className="branding-interaction-pill">
            <Sparkles size={14} className="branding-pill-sparkle" />
            <span>Interactive 3D Perspective Showcase • Click Active Project to View my works</span>
          </div> */}
        </div>

        {/* ================= 3D PERSPECTIVE CAROUSEL STAGE ================= */}
        <div className="branding-carousel-stage" ref={containerRef} data-aos="fade-up" data-aos-delay="150">
          <div className="branding-carousel-viewport">
            <motion.div
              className="branding-carousel-track"
              animate={{ x: -activeIndex * stride }}
              transition={{ type: "spring", stiffness: 220, damping: 26 }}
              style={{
                left: `calc(50% - ${cardWidth / 2}px)`,
              }}
            >
              {BRANDS.map((item, i) => {
                const isActive = activeIndex === i;
                const offset = i - activeIndex;
                const absOffset = Math.abs(offset);

                return (
                  <div
                    className="branding-perspective-item"
                    key={item.id || i}
                    style={{
                      width: cardWidth,
                      marginRight: gap,
                    }}
                  >
                    <motion.div
                      className={`branding-carousel-card ${isActive ? "active" : ""}`}
                      animate={{
                        rotateY: (activeIndex - i) * 45,
                        scale: isActive ? 1 : 0.84,
                        opacity: absOffset > 3 ? 0.2 : 1,
                        zIndex: 100 - absOffset,
                      }}
                      transition={{ type: "spring", stiffness: 220, damping: 26 }}
                      style={{
                        transformStyle: "preserve-3d",
                      }}
                      onClick={() => handleCardClick(i, item.slug)}
                    >
                      {/* Image Frame */}
                      <div className="branding-card-media">
                        <img
                          src={item.src || item.logo}
                          alt={item.title}
                          className="branding-card-img"
                          loading="lazy"
                        />
                        <div className="branding-card-gradient-overlay" />

                        {/* Top ID Badge */}
                        <div className="branding-card-num-badge">
                          <span>{item.id}</span>
                        </div>

                        {/* Hover / Active Action Pill */}
                        <div className={`branding-card-action-badge ${isActive ? "show" : ""}`}>
                          <span>View my works</span>
                          <ArrowUpRight size={14} className="badge-arrow" />
                        </div>
                      </div>

                      {/* Title & Info Below Image */}
                      <motion.div
                        className="branding-card-info"
                        animate={{
                          filter: isActive ? "blur(0px)" : "blur(1.5px)",
                          opacity: isActive ? 1 : 0.45,
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        <h3 className="branding-card-title">{item.title.replace("\n", " ")}</h3>
                        <p className="branding-card-category">{item.category}</p>
                      </motion.div>
                    </motion.div>
                  </div>
                );
              })}
            </motion.div>
          </div>

          {/* ================= CONTROLS DOCK ================= */}
          <div className="branding-controls-dock" data-aos="fade-up" data-aos-delay="200">
            {/* Prev button */}
            <button
              onClick={toPrev}
              disabled={activeIndex === 0}
              className={`branding-control-btn ${activeIndex === 0 ? "disabled" : ""}`}
              aria-label="Previous project"
            >
              {/* <ChevronLeft size={20} /> */}
              <ChevronLeft size={20} />
            </button>

            {/* Slide Dots */}
            <div className="branding-dots-track">
              {BRANDS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => toSlide(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  className={`branding-dot ${activeIndex === i ? "active" : ""}`}
                />
              ))}
            </div>

            {/* Next button */}
            <button
              onClick={toNext}
              disabled={activeIndex === total - 1}
              className={`branding-control-btn ${activeIndex === total - 1 ? "disabled" : ""}`}
              aria-label="Next project"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
