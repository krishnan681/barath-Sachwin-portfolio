import { useEffect, useState, useRef } from "react";
import Lanyard from "../Lanyard/Lanyard";
import aboutProfileImg from "../../assets/profile/about1.webp";
import "./About.css";

function StatCounter({
  target,
  suffix = "",
  prefix = "",
  label,
  sublabel,
  decimals = 0,
}) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const animatedRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const startAnimation = () => {
      if (animatedRef.current) return;
      animatedRef.current = true;

      const duration = 1600;
      const startTime = performance.now();

      const animate = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentVal = target * easeOut;

        setCount(currentVal);

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setCount(target);
        }
      };

      requestAnimationFrame(animate);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          startAnimation();
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px 60px 0px",
      },
    );

    observer.observe(el);

    const fallbackTimer = setTimeout(() => {
      if (!animatedRef.current) {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight + 100 && rect.bottom > -100) {
          startAnimation();
        }
      }
    }, 400);

    return () => {
      observer.disconnect();
      clearTimeout(fallbackTimer);
    };
  }, [target]);

  const formattedValue =
    decimals > 0
      ? count.toFixed(decimals) + suffix
      : Math.round(count) + suffix;

  return (
    <div className="about-stat-item" ref={ref}>
      <div className="about-stat-number">
        {prefix}
        {formattedValue}
      </div>
      <div className="about-stat-line" aria-hidden="true"></div>
      <h4 className="about-stat-title">{label}</h4>
      {sublabel && <p className="about-stat-desc">{sublabel}</p>}
    </div>
  );
}

// Word by Word Animation Component with Multi-Line Support
function AnimatedWordText({
  lines = [],
  highlightWords = [],
  startDelay = 0,
  isRevealed,
  lineClassName = "",
}) {
  let globalWordIndex = 0;

  return (
    <div className="animated-lines-container">
      {lines.map((lineText, lineIdx) => {
        const words = lineText.split(" ");
        return (
          <span key={lineIdx} className={`text-line ${lineClassName}`}>
            {words.map((word) => {
              const currentIdx = globalWordIndex++;
              const cleanWord = word.replace(/[^a-zA-Z&]/g, "");
              const isHighlight =
                highlightWords.includes(cleanWord) ||
                highlightWords.includes(word);
              const delay = startDelay + currentIdx * 32;

              return (
                <span
                  key={currentIdx}
                  className={`word-span ${isRevealed ? "revealed" : ""} ${isHighlight ? "highlight-word" : ""}`}
                  style={{ transitionDelay: `${delay}ms` }}
                >
                  {word}&nbsp;
                </span>
              );
            })}
          </span>
        );
      })}
    </div>
  );
}

export default function About() {
  const sectionRef = useRef(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isMobile, setIsMobile] = useState(() => {
    return typeof window !== "undefined" ? window.innerWidth <= 768 : false;
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsRevealed(entry.isIntersecting);
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px",
      },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const leadLines = [
    "I'm a passionate Graphic Designer & Video Editor dedicated to crafting motion graphics, promotional videos, and compelling visual storytelling.",
  ];

  const bodyLines = [
    "Skilled in graphic design, motion design, video editing, color grading, and post-production workflows.",
    "I deliver high-impact creative solutions that strengthen brand identity and drive audience engagement.",
  ];

  return (
    <section className="about" id="about" ref={sectionRef} style={{padding:"4rem 0 0 0"}} >
      <div className="container">
        {/* ================= 2-COLUMN SHOWCASE (LANYARD LEFT, CONTENT RIGHT) ================= */}
        <div className="about-showcase-grid">
          {/* Left Column: Interactive 3D Lanyard */}
          <div
            className="about-lanyard-col"
            data-aos={isMobile ? undefined : "fade-right"}
          >
            <div className="about-lanyard-container">
              <Lanyard
                frontImage={aboutProfileImg}
                imageFit="cover"
                lanyardWidth={1.1}
              />
            </div>
          </div>

          {/* Right Column: Bio Content */}
          <div
            className="about-content-col"
            data-aos={isMobile ? undefined : "fade-left"}
          >
            {/* Hey Title with Bounce Animation */}
            <div
              className={`hey ${isRevealed ? "hey-bounce-in" : ""}`}
              aria-label="Hey!"
            >
              <span className="letter h">h</span>
              <span className="letter e">E</span>
              <span className="letter y">y</span>
              <span className="letter exclamation">!</span>
              
            </div>

            {/* <div
              className={`experience-badge scroll-block ${isRevealed ? "revealed" : ""}`}
            >
              <span className="exp-badge-pill">
                <span className="exp-badge-dot"></span>
                <span className="exp-num">2+</span>
                <span className="exp-unit">YEARS</span>
              </span>
              <span className="exp-divider"></span>
              <span className="exp-text">Creative Experience</span>
            </div> */}

            {/* Bio Paragraphs with Word-by-Word Animation */}
            <div className="about-text-content">
              <div className="lead-text">
                <AnimatedWordText
                  lines={leadLines}
                  highlightWords={["Graphic", "Designer", "&", "Video", "Editor"]}
                  startDelay={200}
                  isRevealed={isRevealed}
                  lineClassName="lead-line"
                />
              </div>
              <div className="body-text">
                <AnimatedWordText
                  lines={bodyLines}
                  highlightWords={[]}
                  startDelay={650}
                  isRevealed={isRevealed}
                  lineClassName="body-line"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ================= STATS SECTION (EDITORIAL LAYOUT) ================= */}
        <div
          className={`about-stats-section scroll-block ${isRevealed ? "revealed" : ""}`}
        >
          <div className="about-stats-grid">
            <StatCounter
              target={150}
              suffix="+"
              label="VIDEOS PRODUCED"
              decimals={0}
            />
            <StatCounter
              target={200}
              suffix="+"
              label="SOCIAL CREATIVES"
              decimals={0}
            />
            <StatCounter
              target={5.5}
              suffix="M+"
              label="TOTAL VIEWS"
              decimals={1}
            />
          </div>
        </div>
      </div>

      {/* Bottom Custom Shape Divider (flipped downward) */}
      <div
        className="custom-shape-divider-bottom-1788027072"
        aria-hidden="true"
      >
        <svg
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
            opacity=".25"
            className="shape-fill"
          ></path>
          <path
            d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
            opacity=".5"
            className="shape-fill"
          ></path>
          <path
            d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
            className="shape-fill"
          ></path>
        </svg>
      </div>
    </section>
  );
}
