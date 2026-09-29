import { useState } from "react";
import { CONTACT_CONFIG } from "../../services/contactService";
import { CONTACT_CONFIG2 } from "../../services/contactService";

import "./Contact.css";

import { Mail, Phone, MapPin } from "lucide-react";

export default function Contact() {
  const [year] = useState(() => new Date().getFullYear());

  const handleBackToTop = (e) => {
    e?.preventDefault();
    if (window.__lenis) {
      window.__lenis.scrollTo(0, { duration: 1.2 });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <section id="contact" className="contact-section">
      <div className="container">
        <div className="portfolio-contact-card" data-aos="fade-up">
          {/* Giant PORTFOLIO Headline */}
          <h2 className="contact-hero-title">PORTFOLIO</h2>

          {/* 2-Column Content: Bio on Left, Contact Details on Right */}
          <div className="contact-content-grid">
            <div className="contact-col-bio">
              <p>
                Video Editor &amp; Graphic Designer focused on visual
                storytelling, motion graphics, cinematic editing, and creative
                brand design.
              </p>
            </div>

            <div className="contact-col-info">
              <h3 className="contact-info-heading">CONTACT:</h3>
              <div className="contact-details-list">
                <div  className="contact-detail-item">
                  <Mail />
                  <a
                    href={`mailto:${CONTACT_CONFIG.email}`}
                    className="contact-link"
                  >
                    {CONTACT_CONFIG.email}
                  </a>
                </div>
                <div className="contact-detail-item">
                  <Phone />
                  <div className="contact-phone-links">
                    <a
                      href={`tel:${CONTACT_CONFIG.rawPhone}`}
                      className="contact-link"
                    >
                      {CONTACT_CONFIG.phone}
                    </a>
                    <span className="contact-phone-divider">,</span>
                    <a
                      href={`tel:${CONTACT_CONFIG.rawPhone2 || CONTACT_CONFIG2.rawPhone}`}
                      className="contact-link"
                    >
                      {CONTACT_CONFIG.phone2 || CONTACT_CONFIG2.phone}
                    </a>
                  </div>
                </div>

                 

                <div className="contact-detail-item">
                  <MapPin />
                  <span className="contact-location">
                    {CONTACT_CONFIG.location}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Centered BACK TO Button */}
          <div className="contact-back-wrapper">
            <button
              type="button"
              onClick={handleBackToTop}
              className="contact-back-btn"
              aria-label="Back to top"
            >
              Take me up
            </button>
          </div>

          {/* Horizontal Divider Line */}
          <hr className="contact-divider" />

          {/* Bottom Copyright */}
          <footer className="contact-bottom-bar">
            <p className="copyright-text">
              &copy; {year} {CONTACT_CONFIG.name}. All rights reserved.
            </p>
          </footer>
        </div>
      </div>
    </section>
  );
}
