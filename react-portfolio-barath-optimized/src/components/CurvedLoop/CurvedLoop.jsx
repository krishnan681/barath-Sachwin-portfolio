import {
  useRef,
  useEffect,
  useState,
  useMemo,
  useId,
  useCallback,
} from "react";
import "./CurvedLoop.css";

const DEFAULT_ITEMS = [
  { text: "Content", outline: true },
  { text: "Ads", outline: false },
  { text: "Web", outline: true },
  { text: "Software", outline: false },
  { text: "AI", outline: true },
  { text: "Strategy", outline: false },
];

const SparkleIcon = ({ color = "#ff2a75", size = 16, className = "" }) => (
  <svg
    className={`loop-sparkle-icon ${className}`}
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill={color}
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path d="M12 0L14.7 9.3L24 12L14.7 14.7L12 24L9.3 14.7L0 12L9.3 9.3L12 0Z" />
  </svg>
);

const CurvedLoop = ({
  items = DEFAULT_ITEMS,
  marqueeText = "",
  speed = 1.4,
  className = "",
  curveAmount = 0, // 0 for straight line ticker, >0 for curved SVG
  direction = "left",
  interactive = true,
  sparkleColor = "#ff2a75",
}) => {
  // Normalize items array
  const parsedItems = useMemo(() => {
    if (Array.isArray(items) && items.length > 0) {
      return items.map((item, idx) => {
        if (typeof item === "string") {
          return {
            text: item,
            outline: idx % 2 === 0,
          };
        }
        return {
          text: item.text || "",
          outline: item.outline !== undefined ? item.outline : idx % 2 === 0,
        };
      });
    }
    if (marqueeText && typeof marqueeText === "string") {
      const parts = marqueeText
        .split(/[•·|,✦*]/)
        .map((s) => s.trim())
        .filter(Boolean);
      if (parts.length > 1) {
        return parts.map((text, idx) => ({
          text,
          outline: idx % 2 === 0,
        }));
      }
    }
    return DEFAULT_ITEMS;
  }, [items, marqueeText]);

  const isStraight = !curveAmount || curveAmount === 0;

  /* =========================================================
     STRAIGHT TICKER MODE (Ultra-smooth DOM Ribbon)
  ========================================================= */
  const tickerJacketRef = useRef(null);
  const trackRef = useRef(null);
  const singleSetRef = useRef(null);

  const [cycleWidth, setCycleWidth] = useState(0);
  const [repeatCount, setRepeatCount] = useState(4);
  const [isHovered, setIsHovered] = useState(false);
  const isHoveredRef = useRef(false);
  const tickerAnimationRef = useRef(0);
  const tickerVisibleRef = useRef(true);

  const offsetRef = useRef(0);
  const isDraggingRef = useRef(false);
  const lastXRef = useRef(0);
  const velRef = useRef(0);
  const currentSpeedRef = useRef(speed);
  const directionRef = useRef(direction);

  useEffect(() => {
    directionRef.current = direction;
    currentSpeedRef.current = speed;
  }, [direction, speed]);

  // Measure single set width for seamless infinite looping
  const measureTicker = useCallback(() => {
    if (singleSetRef.current && tickerJacketRef.current) {
      const setW = singleSetRef.current.getBoundingClientRect().width;
      const containerW = tickerJacketRef.current.getBoundingClientRect().width;
      if (setW > 0) {
        setCycleWidth(setW);
        const needed = Math.max(Math.ceil((containerW * 2.5) / setW) + 2, 4);
        setRepeatCount(needed);
      }
    }
  }, []);

  useEffect(() => {
    if (!isStraight) return;
    measureTicker();

    if (document.fonts) {
      document.fonts.ready.then(measureTicker);
    }

    const jacketEl = tickerJacketRef.current;
    if (!jacketEl) return;

    const ro = new ResizeObserver(() => {
      measureTicker();
    });
    ro.observe(jacketEl);
    window.addEventListener("resize", measureTicker);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measureTicker);
    };
  }, [isStraight, measureTicker, parsedItems]);

  // Straight Ticker RAF animation loop with inertia & drag
  useEffect(() => {
    isHoveredRef.current = isHovered;
  }, [isHovered]);

  useEffect(() => {
    if (!isStraight || cycleWidth <= 0) return;

    const el = tickerJacketRef.current;
    if (!el) return;

    const stop = () => {
      cancelAnimationFrame(tickerAnimationRef.current);
      tickerAnimationRef.current = 0;
    };

    const step = () => {
      if (!tickerVisibleRef.current || isDraggingRef.current) {
        tickerAnimationRef.current = 0;
        return;
      }

      if (trackRef.current) {
        if (Math.abs(velRef.current) > 0.05) {
          offsetRef.current += velRef.current;
          velRef.current *= 0.94;
        } else {
          velRef.current = 0;
          const dirFactor = directionRef.current === "right" ? 1 : -1;
          const effectiveSpeed = isHoveredRef.current
            ? currentSpeedRef.current * 0.4
            : currentSpeedRef.current;
          offsetRef.current += dirFactor * effectiveSpeed;
        }

        if (offsetRef.current <= -cycleWidth) offsetRef.current += cycleWidth;
        else if (offsetRef.current > 0) offsetRef.current -= cycleWidth;

        trackRef.current.style.transform = `translate3d(${offsetRef.current}px, 0, 0)`;
      }

      tickerAnimationRef.current = requestAnimationFrame(step);
    };

    const start = () => {
      if (!tickerAnimationRef.current && tickerVisibleRef.current && !isDraggingRef.current) {
        tickerAnimationRef.current = requestAnimationFrame(step);
      }
    };

    const observer = typeof IntersectionObserver !== "undefined"
      ? new IntersectionObserver(([entry]) => {
          tickerVisibleRef.current = entry.isIntersecting;
          if (entry.isIntersecting) start();
          else stop();
        }, { rootMargin: "100px 0px" })
      : null;

    observer?.observe(el);
    start();

    return () => {
      stop();
      observer?.disconnect();
    };
  }, [isStraight, cycleWidth]);

  // Pointer drag events for straight ticker
  const handlePointerDown = (e) => {
    if (!interactive) return;
    isDraggingRef.current = true;
    cancelAnimationFrame(tickerAnimationRef.current);
    tickerAnimationRef.current = 0;
    lastXRef.current = e.clientX;
    velRef.current = 0;
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // fallback
    }
  };

  const handlePointerMove = (e) => {
    if (!interactive || !isDraggingRef.current || !trackRef.current) return;
    const dx = e.clientX - lastXRef.current;
    lastXRef.current = e.clientX;
    velRef.current = dx;
    offsetRef.current += dx;

    if (cycleWidth > 0) {
      if (offsetRef.current <= -cycleWidth) {
        offsetRef.current += cycleWidth;
      } else if (offsetRef.current > 0) {
        offsetRef.current -= cycleWidth;
      }
    }

    trackRef.current.style.transform = `translate3d(${offsetRef.current}px, 0, 0)`;
  };

  const handlePointerUp = (e) => {
    if (!interactive) return;
    isDraggingRef.current = false;
    if (tickerVisibleRef.current && !tickerAnimationRef.current) {
      tickerAnimationRef.current = requestAnimationFrame(function resumeTicker() {
        if (!tickerVisibleRef.current || isDraggingRef.current || !trackRef.current || cycleWidth <= 0) {
          tickerAnimationRef.current = 0;
          return;
        }
        const dirFactor = directionRef.current === "right" ? 1 : -1;
        const effectiveSpeed = isHoveredRef.current ? currentSpeedRef.current * 0.4 : currentSpeedRef.current;
        offsetRef.current += Math.abs(velRef.current) > 0.05 ? velRef.current : dirFactor * effectiveSpeed;
        velRef.current *= 0.94;
        if (offsetRef.current <= -cycleWidth) offsetRef.current += cycleWidth;
        else if (offsetRef.current > 0) offsetRef.current -= cycleWidth;
        trackRef.current.style.transform = `translate3d(${offsetRef.current}px, 0, 0)`;
        tickerAnimationRef.current = requestAnimationFrame(resumeTicker);
      });
    }
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // fallback
    }
  };

  /* =========================================================
     CURVED SVG MODE (Fallback if curveAmount > 0)
  ========================================================= */
  const jacketRef = useRef(null);
  const textPathRef = useRef(null);
  const measureSvgRef = useRef(null);
  const [svgSpacing, setSvgSpacing] = useState(0);
  const [svgOffset, setSvgOffset] = useState(0);
  const [svgContainerWidth, setSvgContainerWidth] = useState(1440);

  const uid = useId();
  const pathId = `curve-${uid.replace(/[^a-zA-Z0-9-_]/g, "")}`;

  const pathD = useMemo(() => {
    return `M-100,40 Q500,${40 + curveAmount} 1540,40`;
  }, [curveAmount]);

  const rawFullText = useMemo(() => {
    return parsedItems.map((item) => `${item.text} ✦ `).join("");
  }, [parsedItems]);

  const updateSvgMetrics = useCallback(() => {
    if (jacketRef.current) {
      const { width } = jacketRef.current.getBoundingClientRect();
      if (width > 0) setSvgContainerWidth(Math.round(width));
    }
    if (measureSvgRef.current) {
      const measured = measureSvgRef.current.getComputedTextLength();
      if (measured > 0) setSvgSpacing(Math.ceil(measured));
    }
  }, []);

  useEffect(() => {
    if (isStraight) return;
    updateSvgMetrics();
    const handleResize = () => updateSvgMetrics();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isStraight, updateSvgMetrics]);

  useEffect(() => {
    if (isStraight || !svgSpacing) return;
    let frameId;
    const step = () => {
      if (textPathRef.current) {
        const delta = directionRef.current === "right" ? speed : -speed;
        const cur = parseFloat(
          textPathRef.current.getAttribute("startOffset") || "0"
        );
        let next = cur + delta;
        if (next <= -svgSpacing) next += svgSpacing;
        if (next > 0) next -= svgSpacing;
        textPathRef.current.setAttribute("startOffset", `${next}px`);
        setSvgOffset(next);
      }
      frameId = requestAnimationFrame(step);
    };
    frameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameId);
  }, [isStraight, svgSpacing, speed]);

  /* =========================================================
     RENDER: Straight Ticker (Matches Reference Image)
  ========================================================= */
  if (isStraight) {
    return (
      <div
        ref={tickerJacketRef}
        className={`curved-loop-jacket straight-loop-jacket ${className}`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        role="region"
        aria-label="Interactive Highlights Marquee"
        style={{
          cursor: interactive
            ? isDraggingRef.current
              ? "grabbing"
              : "grab"
            : "default",
        }}
      >
        <div ref={trackRef} className="curved-loop-track">
          {/* Measurement Set */}
          <div ref={singleSetRef} className="curved-loop-set" aria-hidden="false">
            {parsedItems.map((item, idx) => (
              <span
                key={`measure-${idx}`}
                className={`loop-item ${
                  item.outline ? "loop-item-outline" : "loop-item-solid"
                }`}
              >
                <span className="loop-word">{item.text}</span>
                <span className="loop-sparkle-wrapper">
                  <SparkleIcon color={sparkleColor} />
                </span>
              </span>
            ))}
          </div>

          {/* Repeated Sets for seamless infinite looping */}
          {Array.from({ length: repeatCount }).map((_, setIdx) => (
            <div
              key={`set-${setIdx}`}
              className="curved-loop-set"
              aria-hidden="true"
            >
              {parsedItems.map((item, idx) => (
                <span
                  key={`item-${setIdx}-${idx}`}
                  className={`loop-item ${
                    item.outline ? "loop-item-outline" : "loop-item-solid"
                  }`}
                >
                  <span className="loop-word">{item.text}</span>
                  <span className="loop-sparkle-wrapper">
                    <SparkleIcon color={sparkleColor} />
                  </span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* =========================================================
     RENDER: Curved SVG Mode
  ========================================================= */
  const totalSvgText = svgSpacing
    ? Array(Math.max(Math.ceil((svgContainerWidth * 3) / svgSpacing) + 3, 3))
        .fill(rawFullText)
        .join("")
    : rawFullText;

  return (
    <div
      ref={jacketRef}
      className={`curved-loop-jacket ${className}`}
      role="region"
      aria-label="Curved Highlights Banner"
    >
      <svg className="curved-loop-svg" viewBox="0 0 1440 120" preserveAspectRatio="none">
        <text
          ref={measureSvgRef}
          xmlSpace="preserve"
          className="curved-loop-text"
          style={{ visibility: "hidden", opacity: 0, position: "absolute" }}
        >
          {rawFullText}
        </text>
        <defs>
          <path id={pathId} d={pathD} fill="none" stroke="transparent" />
        </defs>
        {svgSpacing > 0 && (
          <text xmlSpace="preserve" className="curved-loop-text">
            <textPath
              ref={textPathRef}
              href={`#${pathId}`}
              startOffset={`${svgOffset}px`}
              xmlSpace="preserve"
            >
              {totalSvgText}
            </textPath>
          </text>
        )}
      </svg>
    </div>
  );
};

export default CurvedLoop;
