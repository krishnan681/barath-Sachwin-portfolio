import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Sparkles,
  Play,
  ChevronRight,
  ChevronUp,
  Plus,
} from "lucide-react";
import { VIDEO_SECTIONS } from "../../data/visualCreationsData";
import VideoModal from "../../components/Modals/VideoModal";
import "./VideosPage.css";

/* =========================================================
   INDIVIDUAL VIDEO CARD COMPONENT
   Optimized preview: Loads metadata, smooth hover/touch playback,
   instant modal launcher on click.
========================================================= */
function VideoCardItem({ item, index, onSelectVideo }) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleMouseEnter = () => {
    if (videoRef.current) {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch(() => {});
      }
    }
  };

  const handleMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleClick = () => {
    onSelectVideo(item);
  };

  const numStr = String(index + 1).padStart(2, "0");

  return (
    <article
      className="video-card-item"
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      tabIndex={0}
      role="button"
      aria-label={`Play Video ${numStr}`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      <div className="video-card-thumb">
        <video
          ref={videoRef}
          src={item.src}
          preload="none"
          playsInline
          muted
          loop
          controlsList="nodownload"
          className="video-card-media"
        />

        <div className="video-card-vignette" />

        {/* Index Tag Badge */}
        {/* <span className="video-card-badge">#{numStr}</span> */}

        {/* Center Play Button with Glow */}
        <div
          className={`video-card-play-btn ${isPlaying ? "is-active" : ""}`}
          aria-hidden="true"
        >
          <Play size={20} fill="#ffffff" stroke="#ffffff" />
        </div>

        {/* Hover / Tap Scrim Overlay */}
        <div className="video-card-hover-scrim">
          <div className="video-card-action-pill">
            <Play size={14} fill="currentColor" />
            <span>Watch Fullscreen</span>
          </div>
        </div>
      </div>
    </article>
  );
}

/* =========================================================
   VIDEO FOLDER SECTION COMPONENT (1 Row Initial + Load More)
========================================================= */
function VideoFolderSection({ section, sIdx, onSelectVideo }) {
  const INITIAL_COUNT = 4; // 1 row on 4-col desktop
  const STEP = 4;
  const videos = section.videos || [];
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);

  const hasMore = visibleCount < videos.length;
  const isExpanded = visibleCount > INITIAL_COUNT;
  const visibleVideos = videos.slice(0, visibleCount);
  const remainingCount = videos.length - visibleCount;

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + STEP, videos.length));
  };

  const handleViewLess = () => {
    setVisibleCount(INITIAL_COUNT);
  };

  return (
    <section
      key={section.id || sIdx}
      className="video-folder-section"
      data-aos="fade-up"
      data-aos-delay={sIdx * 80}
    >
      {/* Folder Header */}
      <div className="video-section-header">
        <div className="video-section-title-wrap">
          {/* <div className="video-section-badge">
            <Layers size={13} />
            <span>Folder {String(sIdx + 1).padStart(2, "0")}</span>
          </div> */}
          <h2 className="video-section-title">{section.title}</h2>
        </div>
        <div className="video-section-count-badge">
          <span className="count-num">{videos.length}</span>
          <span className="count-label">
            {videos.length === 1 ? "Video" : "Videos"}
          </span>
        </div>
      </div>

      {/* Video Cards Grid */}
      <div className="video-gallery-grid">
        {visibleVideos.map((item, idx) => (
          <VideoCardItem
            key={item.id || `video-${sIdx}-${idx}`}
            item={item}
            index={idx}
            onSelectVideo={onSelectVideo}
          />
        ))}
      </div>

      {/* Load More / View Less Action Controls */}
      {(hasMore || isExpanded) && (
        <div className="video-load-controls">
          <div className="video-btn-group">
            {hasMore && (
              <button
                type="button"
                className="video-load-btn load-more-btn"
                onClick={handleLoadMore}
                aria-label={`Load more videos for ${section.title}`}
              >
                <Plus size={16} />
                <span>Load More</span>
                <span className="video-count-badge">
                  +{Math.min(STEP, remainingCount)}
                </span>
              </button>
            )}
            {isExpanded && (
              <button
                type="button"
                className="video-load-btn view-less-btn"
                onClick={handleViewLess}
                aria-label={`View less videos for ${section.title}`}
              >
                <ChevronUp size={16} />
                <span>View Less</span>
              </button>
            )}
          </div>
          <p className="video-status-text">
            Showing {visibleVideos.length} of {videos.length} videos
          </p>
        </div>
      )}
    </section>
  );
}

/* =========================================================
   MAIN VIDEOS PAGE COMPONENT
========================================================= */
export default function VideosPage() {
  const navigate = useNavigate();
  const [selectedVideo, setSelectedVideo] = useState(null);

  const handleBackToVisuals = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    navigate("/#visual");
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <main className="videos-page">
      {/* Top Header Navigation */}
      <header className="video-header-nav">
        <div className="video-header-container">
          <button
            type="button"
            onClick={handleBackToVisuals}
            className="video-back-link"
            aria-label="Back to portfolio"
          >
            <ArrowLeft size={16} />
            <span>Back to Portfolio</span>
          </button>
          <div className="video-header-badge">
            <Sparkles size={13} className="badge-sparkle" />
            <span>Visual Creations / Videos</span>
          </div>
        </div>
      </header>

      {/* Hero Showcase Introduction */}
      <section className="video-hero-section">
        <div className="video-hero-content">
          {/* <span className="video-eyebrow">
            <Film size={14} />
            Visual Creations
          </span> */}
          <h1 className="video-hero-title">Video Production & Editing</h1>
          <p className="video-hero-desc">
            A curated showcase of cinematic shoots, commercial edits, brand promotions, and product focused videos created for cinemas, cafes.
          </p>
        </div>
      </section>

      {/* Video Folder Sections */}
      <div className="video-sections-container">
        {VIDEO_SECTIONS.map((section, sIdx) => (
          <VideoFolderSection
            key={section.id || sIdx}
            section={section}
            sIdx={sIdx}
            onSelectVideo={setSelectedVideo}
          />
        ))}
      </div>

      {/* Bottom Navigation Footer */}
      <footer className="video-bottom-bar">
        <div className="bottom-bar-inner">
          <button
            type="button"
            onClick={handleBackToVisuals}
            className="back-home-button"
            aria-label="Return to portfolio"
          >
            <ArrowLeft size={16} />
            <span>Return to Visuals</span>
          </button>
          <Link to="/images" className="next-showcase-button">
            <span>Explore Images Showcase</span>
            <ChevronRight size={16} />
          </Link>
        </div>
      </footer>

      {/* Fullscreen Video Modal */}
      <VideoModal
        isOpen={Boolean(selectedVideo)}
        onClose={() => setSelectedVideo(null)}
        src={selectedVideo?.src}
        title="Visual Creation Video"
      />
    </main>
  );
}
