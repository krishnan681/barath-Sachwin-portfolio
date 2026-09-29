import React, { useState, useEffect } from "react";
import "./Hero.css";
import { getR2Url } from "../../config/r2";

// R2 Assets
const sky3Img = getR2Url("profile/sky3.webp");
const heroGif = getR2Url("profile/background_removed_gif.gif");

const ROLES = [
  "Video Editor",
  "Graphic Designer",
  "Visual Creator",
  "Content Creator",
];

export default function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(null);
  const [isHeroVisible, setIsHeroVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setPrevIndex(currentIndex);
      setCurrentIndex((prev) => (prev + 1) % ROLES.length);
    }, 2800);

    return () => clearInterval(interval);
  }, [currentIndex]);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          const threshold = window.innerHeight * 1.05;
          const visible = window.scrollY < threshold;
          setIsHeroVisible(visible);
          ticking = false;
        });
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Fixed Hero Section Background */}
      <div
        className="hero-fixed-background"
        style={{
          visibility: isHeroVisible ? "visible" : "hidden",
          pointerEvents: isHeroVisible ? "auto" : "none",
        }}
      >
        <section className="hero" id="hero">
          {/* Main Content Area */}
          <div className="hero-content">
            <div className="hero-main-typography">
              {/* Main Headline */}
              <h1 className="hero-editorial-title">
                {/* Line 1: Eyebrow + Name with vertical badge & letter-by-letter hover animation */}
                <div className="title-name-container">
                  {/* Eyebrow greeting */}
                  <div className="hero-eyebrow">
                    <span className="eyebrow-dot" />
                    <span className="eyebrow-text">
                      HI THERE,
                    </span>
                  </div>

                  <div className="hero-vertical-tag" aria-hidden="true">
                    <span>VISUAL,CREATIVE,CINEMATIC</span>
                  </div>
                  <span className="title-line-1 title-name">
                    {"Barath Sachwin".split("").map((char, i) => (
                      <span key={i} className="interactive-letter">
                        {char === " " ? "\u00A0" : char}
                      </span>
                    ))}
                  </span>
                </div>

                {/* Line 2: Background Removed GIF + Rotating Roles & Underline on Same Line */}
                <span className="title-line-2">
                  {/* <div className="hero-gif-slot" id="hero-gif-slot">
                    <img
                      src={heroGif}
                      alt="Animated element"
                      className="hero-gif-image"
                      decoding="async"
                      loading="eager"
                    />
                  </div> */}

                  {/* Rotating Roles with SVG Underline */}
                  <div className="rotating-text-with-underline">
                    <span className="rotator-slot role-slot">
                      {ROLES.map((role, index) => (
                        <span
                          key={role}
                          className={`rotating-word ${
                            index === currentIndex
                              ? "active"
                              : index === prevIndex
                              ? "exit"
                              : ""
                          }`}
                        >
                          {role.split("").map((char, i) => (
                            <span key={i} className="interactive-letter">
                              {char === " " ? "\u00A0" : char}
                            </span>
                          ))}
                        </span>
                      ))}
                    </span>

                    {/* SVG Underline Line */}
                    <svg
                      className="rotator-underline-svg"
                      viewBox="0 0 260 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <path
                        d="M3 12C60 4 190 4 257 14"
                        stroke="#ffd026"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                </span>
              </h1>
            </div>
          </div>

          {/* Clouds / wave bottom layer */}
          <div className="hero-clouds-layer" aria-hidden="true">
            <img
              src={sky3Img}
              alt=""
              className="hero-sky-clouds"
              decoding="async"
              loading="eager"
            />
          </div>
        </section>
      </div>

      {/* Spacer so the page scroll reveals subsequent sections on top of hero */}
      <div className="hero-scroll-spacer" aria-hidden="true" />
    </>
  );
}