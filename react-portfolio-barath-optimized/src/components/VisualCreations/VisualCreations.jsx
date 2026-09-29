import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowUpRight,
  Images,
  Video,
  FileImage,
  Film,
  Layers,
  FileText,
  PlaySquare,
} from "lucide-react";
import "./VisualCreations.css";

const IMAGE_FILES = [
  {
    name: "3D_KeyVisual.webp",
    tag: "WEBP • 3.2 MB",
    color: "#ff5f6d",
    icon: <FileImage size={14} />,
  },
  {
    name: "Editorial_Spread.pdf",
    tag: "PDF • 1.4 MB",
    color: "#ffc371",
    icon: <FileText size={14} />,
  },
  {
    name: "Campaign_Poster.psd",
    tag: "PSD • 42 MB",
    color: "#4facfe",
    icon: <Layers size={14} />,
  },
  {
    name: "Brand_Identity.ai",
    tag: "AI • 18 MB",
    color: "#00f2fe",
    icon: <Layers size={14} />,
  },
  {
    name: "Hero_Banner.png",
    tag: "PNG • 5.1 MB",
    color: "#a18cd1",
    icon: <FileImage size={14} />,
  },
];

const VIDEO_FILES = [
  {
    name: "3D_Animation.mp4",
    tag: "60FPS • 120 MB",
    color: "#ff5f6d",
    icon: <Film size={14} />,
  },
  {
    name: "Commercial_Cut.mp4",
    tag: "1080P • 85 MB",
    color: "#ffc371",
    icon: <PlaySquare size={14} />,
  },
  {
    name: "Motion_Logo.mov",
    tag: "PRORES • 160 MB",
    color: "#4facfe",
    icon: <Layers size={14} />,
  },
  {
    name: "Vertical_Reel.mp4",
    tag: "9:16 • 35 MB",
    color: "#00f2fe",
    icon: <Film size={14} />,
  },
  {
    name: "Cinema_Trailer.mp4",
    tag: "4K • 250 MB",
    color: "#a18cd1",
    icon: <PlaySquare size={14} />,
  },
];

export default function VisualCreations() {
  const navigate = useNavigate();
  const sectionRef = useRef(null);
  const [imageOpen, setImageOpen] = useState(false);
  const [videoOpen, setVideoOpen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setImageOpen(true), 300);
          setTimeout(() => setVideoOpen(true), 600);
        }
      },
      { threshold: 0.25 },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleOpenImages = (e) => {
    e?.stopPropagation();
    navigate("/images");
  };

  const handleOpenVideos = (e) => {
    e?.stopPropagation();
    navigate("/videos");
  };

  return (
    <section className="visual-creations" id="visual" ref={sectionRef}>
      <div className="title" data-aos="fade-up">
        <div className="bg-text">Visual</div>
        <h1 className="main-title">Creations</h1>
      </div>

      <div className="container">
        <div
          className="VC-heading section-heading text-center"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          <p>
            <span>Explore creative works across image designs and cinematic motion graphics,</span>
            <span>curated in interactive folders. Click each folder to enter the showcase.</span>
          </p>
        </div>

        <div className="row g-4 justify-content-center d-flex align-items-stretch">
          {/* ==================== IMAGE FOLDER ==================== */}
          <div className="col-12 col-md-6 col-lg-5 d-flex">
            <div className="folder-specular-wrap">
              <div className="folder-wrapper-card" onClick={handleOpenImages}>
                <div
                  className={`folder-card image-folder-card ${imageOpen ? "is-open" : ""}`}
                  onMouseEnter={() => setImageOpen(true)}
                  onMouseLeave={() => setImageOpen(false)}
                >
                  <div className="folder-container">
                    {/* Folder Back SVG */}
                    <svg className="folder-back" viewBox="0 0 50 40" fill="none">
                      <path
                        d="M0 4C0 1.79086 1.79086 0 4 0H16.524C17.721 0 18.8415 0.54051 19.574 1.4673L22.426 5.0654C23.1585 5.99219 24.279 6.5327 25.476 6.5327H46C48.2091 6.5327 50 8.32356 50 10.5327V36C50 38.2091 48.2091 40 46 40H4C1.79086 40 0 38.2091 0 36V4Z"
                        fill="#0284c7"
                      />
                    </svg>

                    {/* 5 Stacked Files */}
                    {IMAGE_FILES.map((file, i) => (
                      <div
                        key={i}
                        className={`file file-${i + 1}`}
                        style={{ background: file.color }}
                      >
                        <div className="shine"></div>
                        <div className="file-icon-wrap">{file.icon}</div>
                        <div className="file-text">{file.name}</div>
                        <div className="file-tag">{file.tag}</div>
                      </div>
                    ))}

                    {/* Folder Front Wrapper */}
                    <div className="folder-front-wrapper">
                      <svg
                        className="folder-front"
                        viewBox="0 0 50 34"
                        fill="none"
                      >
                        <path
                          d="M0 4C0 1.79086 1.79086 0 4 0H46C48.2091 0 50 1.79086 50 4V30C50 32.2091 48.2091 34 46 34H4C1.79086 34 0 32.2091 0 30V4Z"
                          fill="rgba(2, 132, 199, 0.75)"
                        />
                      </svg>
                      <div className="folder-label"></div>
                    </div>
                  </div>
                </div>

                {/* Below Folder Info */}
                <div className="folder-bottom-info">
                  <div className="folder-bottom-head">
                    <div className="folder-title-icon-group">
                      <div className="folder-lead-icon">
                        <Images size={18} />
                      </div>
                      <h3>Images</h3>
                    </div>
                  </div>
                   
                  <button
                    type="button"
                    className="folder-open-cta-btn"
                    onClick={handleOpenImages}
                  >
                    <span>Explore my works</span>
                    <ArrowUpRight size={15} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ==================== VIDEO FOLDER ==================== */}
          <div className="col-12 col-md-6 col-lg-5 d-flex">
            <div className="folder-specular-wrap">
              <div className="folder-wrapper-card" onClick={handleOpenVideos}>
                <div
                  className={`folder-card video-folder-card ${videoOpen ? "is-open" : ""}`}
                  onMouseEnter={() => setVideoOpen(true)}
                  onMouseLeave={() => setVideoOpen(false)}
                >
                  <div className="folder-container">
                    {/* Folder Back SVG */}
                    <svg className="folder-back" viewBox="0 0 50 40" fill="none">
                      <path
                        d="M0 4C0 1.79086 1.79086 0 4 0H16.524C17.721 0 18.8415 0.54051 19.574 1.4673L22.426 5.0654C23.1585 5.99219 24.279 6.5327 25.476 6.5327H46C48.2091 6.5327 50 8.32356 50 10.5327V36C50 38.2091 48.2091 40 46 40H4C1.79086 40 0 38.2091 0 36V4Z"
                        fill="#0284c7"
                      />
                    </svg>

                    {/* 5 Stacked Files */}
                    {VIDEO_FILES.map((file, i) => (
                      <div
                        key={i}
                        className={`file file-${i + 1}`}
                        style={{ background: file.color }}
                      >
                        <div className="shine"></div>
                        <div className="file-icon-wrap">{file.icon}</div>
                        <div className="file-text">{file.name}</div>
                        <div className="file-tag">{file.tag}</div>
                      </div>
                    ))}

                    {/* Folder Front Wrapper */}
                    <div className="folder-front-wrapper">
                      <svg
                        className="folder-front"
                        viewBox="0 0 50 34"
                        fill="none"
                      >
                        <path
                          d="M0 4C0 1.79086 1.79086 0 4 0H46C48.2091 0 50 1.79086 50 4V30C50 32.2091 48.2091 34 46 34H4C1.79086 34 0 32.2091 0 30V4Z"
                          fill="rgba(2, 132, 199, 0.75)"
                        />
                      </svg>
                      <div className="folder-label"></div>
                    </div>
                  </div>
                </div>

                {/* Below Folder Info */}
                <div className="folder-bottom-info">
                  <div className="folder-bottom-head">
                    <div className="folder-title-icon-group">
                      <div className="folder-lead-icon">
                        <Video size={18} />
                      </div>
                      <h3>Videos</h3>
                    </div>
                  </div>
               
                  <button
                    type="button"
                    className="folder-open-cta-btn"
                    onClick={handleOpenVideos}
                  >
                    <span>Explore my works</span>
                    <ArrowUpRight size={15} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
