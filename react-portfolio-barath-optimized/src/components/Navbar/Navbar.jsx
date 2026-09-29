import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css";
import { getR2Url } from "../../config/r2";

const avatarImg = getR2Url("profile/BS.webp");

const SECTIONS = [
  { id: "about", label: "About", href: "#about" },
  { id: "creative-expertise", label: "Expertise", href: "#creative-expertise" },
  { id: "career", label: "Highlights", href: "#career" },
  { id: "branding", label: "Branding", href: "#branding" },
  { id: "visual", label: "Visuals", href: "#visual" },
  { id: "tools", label: "Tools", href: "#tools" },
  { id: "contact", label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [activeSection, setActiveSection] = useState("hero");
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const updateActiveSection = useCallback(() => {
    const scrollY = window.scrollY;
    const viewportHeight = window.innerHeight;
    const heroHeight = viewportHeight * 0.5;

    setIsScrolled(scrollY > heroHeight);

    // If at the very top (Hero section)
    if (scrollY <= heroHeight * 0.7) {
      setActiveSection("hero");
      return;
    }

    // If near the bottom of the page, activate Contact
    const isAtPageBottom =
      window.innerHeight + scrollY >=
      document.documentElement.scrollHeight - 80;

    if (isAtPageBottom) {
      setActiveSection("contact");
      return;
    }

    // Focal point in viewport (40% from top)
    const focalPoint = viewportHeight * 0.40;
    let current = null;

    for (let i = 0; i < SECTIONS.length; i++) {
      const el = document.getElementById(SECTIONS[i].id);
      if (el) {
        const rect = el.getBoundingClientRect();
        // Check if focal point lies inside section bounds
        if (rect.top <= focalPoint && rect.bottom > focalPoint) {
          current = SECTIONS[i].id;
          break;
        }
      }
    }

    // Fallback: choose section with largest visible area in viewport
    if (!current) {
      let maxVisibleHeight = 0;
      let bestSection = "hero";

      for (const sec of SECTIONS) {
        const el = document.getElementById(sec.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          const visibleTop = Math.max(0, rect.top);
          const visibleBottom = Math.min(viewportHeight, rect.bottom);
          const visibleHeight = Math.max(0, visibleBottom - visibleTop);

          if (visibleHeight > maxVisibleHeight) {
            maxVisibleHeight = visibleHeight;
            bestSection = sec.id;
          }
        }
      }
      current = bestSection;
    }

    if (current) {
      setActiveSection(current);
    }
  }, []);

  const tickingRef = useRef(false);

  const handleScroll = useCallback(() => {
    if (!tickingRef.current) {
      tickingRef.current = true;
      requestAnimationFrame(() => {
        updateActiveSection();
        tickingRef.current = false;
      });
    }
  }, [updateActiveSection]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    updateActiveSection();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll, updateActiveSection]);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 840) {
        setMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleNavClick = (e, href) => {
    if (e && e.preventDefault) e.preventDefault();
    setMenuOpen(false);

    if (location.pathname !== "/") {
      navigate("/" + (href.startsWith("#") ? href : "#" + href));
      return;
    }

    if (href === "#hero" || href === "#" || href === "/") {
      if (window.__lenis) {
        window.__lenis.scrollTo(0, { duration: 1.2 });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      return;
    }

    const target = document.querySelector(href);
    if (target) {
      if (window.__lenis) {
        window.__lenis.scrollTo(target, { offset: -30, duration: 1.2 });
      } else {
        target.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const currentSectionObj = SECTIONS.find((s) => s.id === activeSection);
  const activeLabel = currentSectionObj ? currentSectionObj.label : "Home";
  const isCompactMode = isScrolled && activeSection !== "hero";

  return (
    <>
      {/* Mobile Backdrop overlay */}
      {menuOpen && (
        <div
          className="nav-backdrop"
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Main Glassmorphism Capsule Header */}
      <header
        className={`navbar-capsule-wrapper ${
          isCompactMode ? "capsule-compact" : "capsule-expanded"
        } ${isHovered && isCompactMode ? "capsule-hover-expanded" : ""}`}
        id="navbar"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Left: Avatar Photo (Touch/Click takes home) */}
        <a
          href="#hero"
          className="nav-avatar-link"
          onClick={(e) => handleNavClick(e, "#hero")}
          onTouchEnd={(e) => handleNavClick(e, "#hero")}
          aria-label="Go to home section"
        >
          <img
            src={avatarImg}
            alt="Barath Sachwin"
            className="nav-avatar-img"
          />
        </a>

        {/* Center Desktop Mode 1: All Section Links (Expanded when at Hero or when Hovered) */}
        <nav className="nav-links-desktop">
          {SECTIONS.filter((s) => s.id !== "contact").map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`nav-link-item ${
                activeSection === link.id ? "active-link" : ""
              }`}
              onClick={(e) => handleNavClick(e, link.href)}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Center Mode 2: Single Active Section Name (Compact when scrolled past Hero) */}
        <div className="nav-active-pill">
          <a
            href={`#${activeSection}`}
            className="nav-active-link"
            onClick={(e) => handleNavClick(e, `#${activeSection}`)}
          >
            <span key={activeLabel} className="nav-active-text">
              {activeLabel}
            </span>
          </a>
        </div>

        {/* Right: Button "Hire me" */}
        <a
          href="#contact"
          className="nav-hire-btn"
          onClick={(e) => handleNavClick(e, "#contact")}
        >
          <svg
            className="nav-mail-icon"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
          </svg>
          <span>Hire me</span>
        </a>

        {/* Mobile menu hamburger toggle button */}
        <button
          type="button"
          className={`nav-mobile-toggle ${menuOpen ? "active" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </header>

      {/* Mobile Drawer (Only visible on mobile when hamburger is clicked) */}
      <div className={`nav-mobile-drawer ${menuOpen ? "drawer-open" : ""}`}>
        <div className="drawer-header">
          <span className="drawer-title">Navigation</span>
          <button
            type="button"
            className="drawer-close-btn"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>
        <div className="drawer-links">
          {SECTIONS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`drawer-link-item ${
                activeSection === link.id ? "active-drawer-link" : ""
              }`}
              onClick={(e) => handleNavClick(e, link.href)}
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </>
  );
}