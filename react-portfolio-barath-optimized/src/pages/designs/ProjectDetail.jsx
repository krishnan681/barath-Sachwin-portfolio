import { Fragment, useEffect, useMemo, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Play,
  Maximize2,
  Sparkles,
  Film,
  Layers,
  Plus,
  ChevronUp,
} from "lucide-react";
import { BRANDS } from "../../data/brands";
import ImageModal from "../../components/Modals/ImageModal";
import VideoModal from "../../components/Modals/VideoModal";
import ImageWithSkeleton from "../../components/Common/ImageWithSkeleton";
import OptimizedVideo from "../../components/Common/OptimizedVideo";
import EmptyState from "../../components/Common/EmptyState";
import { safeStorage } from "../../utils/storage";
import "./ProjectDetail.css";

/* =========================================================
   1. STAGGERED / ADAPTIVE CUSTOM GRID GALLERY
   Supports mixed aspect ratios (landscape/portrait) and
   progressive batched loading with "Load More" & "View Less" buttons.
========================================================= */
function StaggeredGridGallery({
  items,
  onSelectImage,
  categoryTitle,
  initialCount = 8,
  step = 6,
}) {
  const [visibleCount, setVisibleCount] = useState(initialCount);
  const [detectedAspects, setDetectedAspects] = useState({});

  const hasMore = visibleCount < items.length;
  const isExpanded = visibleCount > initialCount;
  const visibleItems = items.slice(0, visibleCount);
  const remainingCount = items.length - visibleCount;

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + step, items.length));
  };

  const handleViewLess = () => {
    setVisibleCount(initialCount);
  };

  const handleImageLoad = (id, e) => {
    const { naturalWidth, naturalHeight } = e.target;
    if (naturalWidth && naturalHeight) {
      const orientation =
        naturalWidth > naturalHeight * 1.15 ? "landscape" : "portrait";
      setDetectedAspects((prev) =>
        prev[id] === orientation ? prev : { ...prev, [id]: orientation },
      );
    }
  };

  return (
    <div className="staggered-custom-wrapper">
      <div className="staggered-custom-gallery">
        {visibleItems.map((item, idx) => {
          const isNewlyRevealed = idx >= initialCount;
          const orientation =
            item.aspect || detectedAspects[item.id || idx] || "portrait";

          return (
            <figure
              key={item.id || `gallery-item-${idx}`}
              className={`staggered-custom-item is-${orientation} ${isNewlyRevealed ? "is-revealed" : ""}`}
              onClick={() => onSelectImage(item)}
              tabIndex={0}
            >
              <ImageWithSkeleton
                src={item.src}
                alt={`${categoryTitle} Visual ${idx + 1}`}
                className="staggered-custom-img"
                wrapperClassName="staggered-custom-img-wrap"
                onLoad={(e) => handleImageLoad(item.id || idx, e)}
              />
            </figure>
          );
        })}
      </div>

      {(hasMore || isExpanded) && (
        <div className="staggered-load-more-container">
          <div className="staggered-btn-group">
            {hasMore && (
              <button
                type="button"
                className="staggered-load-more-btn"
                onClick={handleLoadMore}
                aria-label={`Load more ${categoryTitle} designs`}
              >
                <Plus size={16} />
                <span>Load More Designs</span>
                <span className="staggered-load-count-badge">
                  +{Math.min(step, remainingCount)}
                </span>
              </button>
            )}
            {isExpanded && (
              <button
                type="button"
                className="staggered-view-less-btn"
                onClick={handleViewLess}
                aria-label={`View less ${categoryTitle} designs`}
              >
                <ChevronUp size={16} />
                <span>View Less</span>
              </button>
            )}
          </div>
          <p className="staggered-load-status-text">
            Showing {visibleItems.length} of {items.length} designs
          </p>
        </div>
      )}
    </div>
  );
}

/* =========================================================
   2. PORTRAIT POSTERS GALLERY (2:3 Cinema Poster Cards)
   With progressive batched loading (Load More & View Less) and lazy loading
========================================================= */
function PortraitPostersGrid({
  items,
  onSelectImage,
  categoryTitle,
  initialCount = 8,
  step = 4,
}) {
  const [visibleCount, setVisibleCount] = useState(initialCount);

  const hasMore = visibleCount < items.length;
  const isExpanded = visibleCount > initialCount;
  const visibleItems = items.slice(0, visibleCount);
  const remainingCount = items.length - visibleCount;

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + step, items.length));
  };

  const handleViewLess = () => {
    setVisibleCount(initialCount);
  };

  return (
    <div className="portrait-posters-wrapper">
      <div className="portrait-posters-gallery">
        {visibleItems.map((item, idx) => {
          const isNewlyRevealed = idx >= initialCount;
          return (
            <article
              key={item.id || `portrait-item-${idx}`}
              className={`portrait-poster-card ${item.aspect ? `is-${item.aspect}` : ""} ${isNewlyRevealed ? "is-revealed" : ""}`}
              onClick={() => onSelectImage(item)}
            >
              <div
                className={`portrait-poster-thumb ${item.aspect ? `is-${item.aspect}` : ""}`}
              >
                <ImageWithSkeleton
                  src={item.src}
                  alt={`${categoryTitle} Poster ${idx + 1}`}
                  className="portrait-poster-img"
                  wrapperClassName="portrait-poster-img-wrap"
                />

                <div className="portrait-poster-vignette" />

                <div className="portrait-poster-hover-scrim">
                  <div className="portrait-poster-zoom-btn">
                    <Maximize2 size={16} />
                    <span>View Poster</span>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {(hasMore || isExpanded) && (
        <div className="portrait-load-more-container">
          <div className="portrait-btn-group">
            {hasMore && (
              <button
                type="button"
                className="portrait-load-more-btn"
                onClick={handleLoadMore}
                aria-label={`Load more ${categoryTitle} posters`}
              >
                <Plus size={16} />
                <span>Load More Posters</span>
                <span className="portrait-load-count-badge">
                  +{Math.min(step, remainingCount)}
                </span>
              </button>
            )}
            {isExpanded && (
              <button
                type="button"
                className="portrait-view-less-btn"
                onClick={handleViewLess}
                aria-label={`View less ${categoryTitle} posters`}
              >
                <ChevronUp size={16} />
                <span>View Less</span>
              </button>
            )}
          </div>
          <p className="portrait-load-status-text">
            Showing {visibleItems.length} of {items.length} posters
          </p>
        </div>
      )}
    </div>
  );
}

/* =========================================================
   3. PORTRAIT ROWS GALLERY (Custom Multi-Row Distribution with Load More & View Less)
   Tailored for curated brand showcases like The Crimson & Giggles & Twirls
========================================================= */
function PortraitRowsGallery({
  items,
  onSelectImage,
  categoryTitle,
  rowDistribution = [5, 4],
  initialRows = null,
  initialCount = null,
  stepRows = 1,
}) {
  // Split items into designated row groupings
  const rows = useMemo(() => {
    let currentIndex = 0;
    const computedRows = [];

    for (const count of rowDistribution) {
      if (currentIndex >= items.length) break;
      computedRows.push(items.slice(currentIndex, currentIndex + count));
      currentIndex += count;
    }

    if (currentIndex < items.length) {
      computedRows.push(items.slice(currentIndex));
    }

    return computedRows;
  }, [items, rowDistribution]);

  // Determine initial visible rows
  const defaultVisibleRows = useMemo(() => {
    if (initialRows != null) return initialRows;
    if (initialCount != null) {
      let acc = 0;
      for (let i = 0; i < rows.length; i++) {
        acc += rows[i].length;
        if (acc >= initialCount) return i + 1;
      }
      return rows.length;
    }
    return rows.length;
  }, [initialRows, initialCount, rows]);

  const [visibleRowsCount, setVisibleRowsCount] = useState(defaultVisibleRows);

  const visibleRows = rows.slice(0, visibleRowsCount);
  const totalVisibleItems = visibleRows.reduce((sum, r) => sum + r.length, 0);
  const hasMore = visibleRowsCount < rows.length;
  const isExpanded = visibleRowsCount > defaultVisibleRows;
  const remainingCount = items.length - totalVisibleItems;

  const handleLoadMore = () => {
    setVisibleRowsCount((prev) => Math.min(prev + stepRows, rows.length));
  };

  const handleViewLess = () => {
    setVisibleRowsCount(defaultVisibleRows);
  };

  return (
    <div className="portrait-rows-wrapper">
      {visibleRows.map((rowItems, rowIdx) => {
        const isNewlyRevealed = rowIdx >= defaultVisibleRows;
        return (
          <div
            key={`portrait-row-${rowIdx}`}
            className={`portrait-row-grid portrait-row-${rowItems.length}-items ${
              isNewlyRevealed ? "is-revealed" : ""
            }`}
          >
            {rowItems.map((item, itemIdx) => {
              const globalIdx = items.findIndex(
                (i) =>
                  (i.id && item.id && i.id === item.id) || i.src === item.src,
              );
              const itemNumber = String(
                (globalIdx >= 0 ? globalIdx : itemIdx) + 1,
              ).padStart(2, "0");

              return (
                <article
                  key={item.id || `portrait-row-item-${rowIdx}-${itemIdx}`}
                  className="portrait-row-card is-revealed"
                  onClick={() => onSelectImage(item)}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onSelectImage(item);
                    }
                  }}
                >
                  <div className="portrait-row-thumb">
                    <ImageWithSkeleton
                      src={item.src}
                      alt={`${categoryTitle} - ${item.title || `Visual ${itemNumber}`}`}
                      className="portrait-row-img"
                      wrapperClassName="portrait-row-img-wrap"
                    />

                    <div className="portrait-row-vignette" />

                    <div className="portrait-row-hover-scrim">
                      <div className="portrait-row-zoom-btn">
                        <Maximize2 size={15} />
                        <span>{item.tag || "View Visual"}</span>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        );
      })}

      {(hasMore || isExpanded) && (
        <div className="staggered-load-more-container">
          <div className="staggered-btn-group">
            {hasMore && (
              <button
                type="button"
                className="staggered-load-more-btn"
                onClick={handleLoadMore}
                aria-label={`Load more ${categoryTitle} designs`}
              >
                <Plus size={16} />
                <span>Load More Designs</span>
                <span className="staggered-load-count-badge">
                  +
                  {Math.min(
                    rows[visibleRowsCount]?.length || 6,
                    remainingCount,
                  )}
                </span>
              </button>
            )}
            {isExpanded && (
              <button
                type="button"
                className="staggered-view-less-btn"
                onClick={handleViewLess}
                aria-label={`View less ${categoryTitle} designs`}
              >
                <ChevronUp size={16} />
                <span>View Less</span>
              </button>
            )}
          </div>
          <p className="staggered-load-status-text">
            Showing {totalVisibleItems} of {items.length} designs
          </p>
        </div>
      )}
    </div>
  );
}

/* =========================================================
   4. FEATURED BANNER & COLLATERALS GALLERY
   Tailored for showcase categories with a hero campaign banner
   and supporting print collaterals (e.g. Sunbeam School Offline Print Works)
========================================================= */
function FeaturedBannerGallery({ items, onSelectImage, categoryTitle }) {
  if (!items || items.length === 0) return null;

  const [heroItem, ...subItems] = items;

  return (
    <div className="featured-banner-gallery">
      {/* 1. Hero Campaign Banner */}
      {heroItem && (
        <article
          className="featured-banner-hero-card"
          onClick={() => onSelectImage(heroItem)}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onSelectImage(heroItem);
            }
          }}
        >
          <div className="featured-banner-hero-thumb">
            <ImageWithSkeleton
              src={heroItem.src}
              alt={`${categoryTitle} - ${heroItem.title || "Campaign Banner"}`}
              className="featured-banner-hero-img"
              wrapperClassName="featured-banner-hero-img-wrap"
            />
            <div className="featured-banner-vignette" />
            <div className="featured-banner-hover-scrim">
              <div className="featured-banner-zoom-btn">
                <Maximize2 size={16} />
                <span>{heroItem.tag || "View Banner"}</span>
              </div>
            </div>
          </div>
        </article>
      )}

      {/* 2. Collateral Cards Row */}
      {subItems.length > 0 && (
        <div
          className={`featured-banner-cards-grid featured-banner-cards-${Math.min(
            subItems.length,
            3,
          )}`}
        >
          {subItems.map((item, idx) => (
            <article
              key={item.id || `sub-item-${idx}`}
              className="featured-banner-sub-card"
              onClick={() => onSelectImage(item)}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelectImage(item);
                }
              }}
            >
              <div className="featured-banner-sub-thumb">
                <ImageWithSkeleton
                  src={item.src}
                  alt={`${categoryTitle} - ${item.title || `Collateral ${idx + 1}`}`}
                  className="featured-banner-sub-img"
                  wrapperClassName="featured-banner-sub-img-wrap"
                />
                <div className="featured-banner-vignette" />
                <div className="featured-banner-hover-scrim">
                  <div className="featured-banner-zoom-btn">
                    <Maximize2 size={15} />
                    <span>{item.tag || "View Collateral"}</span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

/* =========================================================
   5. VERTICAL VIDEOS GRID (9:16 Reels with Load More & View Less)
========================================================= */
function VerticalVideosGrid({
  items,
  onSelectVideo,
  initialCount = 8,
  step = 4,
  label = "Videos",
}) {
  const [visibleCount, setVisibleCount] = useState(initialCount);

  const hasMore = visibleCount < items.length;
  const isExpanded = visibleCount > initialCount;
  const visibleItems = items.slice(0, visibleCount);
  const remainingCount = items.length - visibleCount;

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + step, items.length));
  };

  const handleViewLess = () => {
    setVisibleCount(initialCount);
  };

  return (
    <div className="vertical-videos-wrapper">
      <div
        className={`category-vertical-videos-grid project-vertical-videos-grid ${
          visibleItems.length < 4 ? "is-few-items" : "has-4-cols"
        }`}
      >
        {visibleItems.map((vid, vidIdx) => {
          const isNewlyRevealed = vidIdx >= initialCount;
          return (
            <article
              key={vid.id || `video-${vidIdx}`}
              className={`category-vertical-video-card project-vertical-video-card ${
                isNewlyRevealed ? "is-revealed" : ""
              }`}
              onClick={() => onSelectVideo(vid)}
              tabIndex={0}
              role="button"
              aria-label={`Play ${vid.title || `Video ${vidIdx + 1}`}`}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelectVideo(vid);
                }
              }}
            >
              <div className="vertical-video-thumb">
                <OptimizedVideo
                  src={vid.src}
                  poster={vid.poster}
                  playsInline
                  muted
                  loop
                  autoPlay
                  controlsList="nodownload"
                  className="vertical-video-media"
                />

                <div className="video-play-badge">
                  <Play size={18} fill="#ffffff" />
                </div>

                <div className="video-hover-scrim">
                  <span className="video-action-pill">
                    <Play size={14} fill="currentColor" /> Play Reel
                  </span>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {(hasMore || isExpanded) && (
        <div className="portrait-load-more-container video-load-more-container">
          <div className="portrait-btn-group">
            {hasMore && (
              <button
                type="button"
                className="portrait-load-more-btn"
                onClick={handleLoadMore}
                aria-label={`Load more ${label}`}
              >
                <Plus size={16} />
                <span>Load More {label}</span>
                <span className="portrait-load-count-badge">
                  +{Math.min(step, remainingCount)}
                </span>
              </button>
            )}
            {isExpanded && (
              <button
                type="button"
                className="portrait-view-less-btn"
                onClick={handleViewLess}
                aria-label={`View less ${label}`}
              >
                <ChevronUp size={16} />
                <span>View Less</span>
              </button>
            )}
          </div>
          <p className="portrait-load-status-text">
            Showing {visibleItems.length} of {items.length}{" "}
            {label.toLowerCase()}
          </p>
        </div>
      )}
    </div>
  );
}

/* =========================================================
   MAIN PROJECT DETAIL COMPONENT
========================================================= */
export default function ProjectDetail({ data }) {
  const navigate = useNavigate();
  const { slug } = useParams();
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);

  const handleBackToBranding = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    navigate("/#branding");
  };

  // Scroll to top on slug / route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [slug]);

  // Find the active project by prop or slug
  const project = useMemo(() => {
    if (data) return data;
    if (!slug) return BRANDS[0];
    return BRANDS.find((item) => item.slug === slug);
  }, [data, slug]);

  // Track recently viewed project in persistent storage
  useEffect(() => {
    if (project) {
      safeStorage.addRecentlyViewed(project);
    }
  }, [project]);

  // Collect all flat images for continuous lightbox navigation
  const allProjectImages = useMemo(() => {
    if (!project) return [];
    if (project.categories && project.categories.length > 0) {
      return project.categories.flatMap((cat) => cat.images || []);
    }
    return project.images || [];
  }, [project]);

  const activeImageIndex = useMemo(() => {
    if (!selectedImage || allProjectImages.length === 0) return -1;
    return allProjectImages.findIndex(
      (img) => img.id === selectedImage.id || img.src === selectedImage.src,
    );
  }, [selectedImage, allProjectImages]);

  const handleNextImage = () => {
    if (allProjectImages.length === 0) return;
    if (
      activeImageIndex >= 0 &&
      activeImageIndex < allProjectImages.length - 1
    ) {
      setSelectedImage(allProjectImages[activeImageIndex + 1]);
    } else {
      setSelectedImage(allProjectImages[0]);
    }
  };

  const handlePrevImage = () => {
    if (allProjectImages.length === 0) return;
    if (activeImageIndex > 0) {
      setSelectedImage(allProjectImages[activeImageIndex - 1]);
    } else {
      setSelectedImage(allProjectImages[allProjectImages.length - 1]);
    }
  };

  // Find index for Next/Previous project navigation
  const currentIndex = useMemo(() => {
    if (!project) return -1;
    return BRANDS.findIndex((b) => b.slug === project.slug);
  }, [project]);

  const prevProject =
    currentIndex > 0 ? BRANDS[currentIndex - 1] : BRANDS[BRANDS.length - 1];
  const nextProject =
    currentIndex >= 0 && currentIndex < BRANDS.length - 1
      ? BRANDS[currentIndex + 1]
      : BRANDS[0];

  // Preload Next & Previous project banners in background for instant transitions
  useEffect(() => {
    if (!project) return;
    const bannersToPreload = [
      nextProject?.banner || nextProject?.src,
      prevProject?.banner || prevProject?.src,
    ].filter(Boolean);

    bannersToPreload.forEach((bannerUrl) => {
      const img = new Image();
      img.src = bannerUrl;
    });
  }, [project, nextProject, prevProject]);

  // 404 Project Not Found State
  if (!project) {
    return (
      <main className="project-detail-page project-not-found-state">
        <div className="not-found-card">
          <span className="not-found-code">404</span>
          <h1 className="not-found-title">Project Not Found</h1>
          <p className="not-found-desc">
            The branding showcase you are looking for does not exist or has been
            moved.
          </p>
          <button
            type="button"
            onClick={handleBackToBranding}
            className="project-back-btn primary"
          >
            <ArrowLeft size={16} />
            <span>Back to All Projects</span>
          </button>
        </div>
      </main>
    );
  }

  const hasCategories = project.categories && project.categories.length > 0;
  const imagesList = project.images || [];
  const hasImages = !hasCategories && imagesList.length > 0;
  const videosList = project.videos || [];
  const hasVideos = videosList.length > 0;

  const isColorGradingBrand =
    project.id === "03" ||
    project.id === "07" ||
    project.slug === "giggles-and-twirls" ||
    project.slug === "pavizham-jewellers";

  const imagesHeading = isColorGradingBrand
    ? "Color Grading & Finishing"
    : project.imagesHeading || "Poster Designs";

  const videosHeading = isColorGradingBrand
    ? "Cinematic Color Finishing"
    : project.videosHeading || "Brand Video Content";

  return (
    <main
      className="project-detail-page"
      data-variant={project.designVariant || "showcase"}
      style={{
        "--project-bg": project.cardBg || "#04193a",
        "--project-text": project.cardTextColor || "#c49150",
        "--project-accent": project.cardTextColor || project.color || "#c49150",
      }}
    >
      {/* ================= TOP FLOATING NAVIGATION ================= */}
      <nav className="project-top-nav">
        <div className="project-top-nav-inner">
          <button
            type="button"
            onClick={handleBackToBranding}
            className="project-back-btn"
            aria-label="Back to portfolio"
          >
            <ArrowLeft size={15} />
            <span>Back</span>
          </button>
        </div>
      </nav>

      {/* ================= HERO YOUTUBE-STYLE BANNER ================= */}
      <section className="project-hero-banner-section">
        <div className="project-banner-container">
          <ImageWithSkeleton
            key={project.slug}
            src={project.banner || project.src}
            className="project-banner-media"
            wrapperClassName="w-100 h-100"
            alt={`${project.title} Banner`}
            loading="eager"
            fetchPriority="high"
          />
          <div className="project-banner-vignette" />
        </div>
      </section>

      {/* ================= MAIN CONTAINER CONTENT ================= */}
      <div className="project-content-container">
        {/* Project Header Card */}
        <header className="project-header-card">
          <div className="project-header-card-grid">
            <div className="project-header-col-title">
              <h1 className="project-headline-title">
                {project.title.split("\n").map((line, idx) => (
                  <Fragment key={idx}>
                    {idx > 0 && <br />}
                    <span className="project-headline-line">{line}</span>
                  </Fragment>
                ))}
              </h1>
            </div>

            <div className="project-header-col-desc">
              {(project.description || project.headline) && (
                <p className="project-lead-p">
                  {project.description || project.headline}
                </p>
              )}
              {project.details && (
                <p className="project-details-p">{project.details}</p>
              )}
            </div>
          </div>

          {/* Deliverables pill bar */}
          {project.deliverables && project.deliverables.length > 0 && (
            <div className="project-deliverables-pill-wrap">
              <div className="project-deliverables-line">
                <span className="deliverables-label">DELIVERABLES :</span>
                <span className="deliverables-items">
                  {project.deliverables.map((item, idx) => (
                    <Fragment key={idx}>
                      {idx > 0 && (
                        <span className="deliverables-bullet"> • </span>
                      )}
                      <span className="deliverables-item">{item}</span>
                    </Fragment>
                  ))}
                </span>
              </div>
            </div>
          )}
        </header>

        {/* ================= DISTINCT CATEGORY SECTIONS ================= */}
        {hasCategories &&
          project.categories.map((category) => {
            const catImages = category.images || [];
            const catVideos = category.videos || [];
            if (catImages.length === 0 && catVideos.length === 0) return null;

            const isFeaturedBannerLayout =
              category.layout === "featured-banner" ||
              category.layout === "hero-banner" ||
              category.id === "offline-print-works";
            const isPortraitRowsLayout =
              category.layout === "portrait-5-4" ||
              category.layout === "portrait-rows";
            const isPortraitLayout = category.layout === "portrait";
            return (
              <section
                key={category.id}
                id={category.id}
                className="project-media-section project-category-section"
              >
                <div className="section-title-wrap">
                  <div className="section-title-badge">
                    {catImages.length === 0 && catVideos.length > 0 ? (
                      <Film size={1} />
                    ) : (
                      <Layers size={1} />
                    )}
                    <span>
                      {catImages.length === 0 && catVideos.length > 0}
                    </span>
                  </div>
                  <h2 className="section-heading">{category.title}</h2>
                  {category.subtext && (
                    <p className="section-subtext">{category.subtext}</p>
                  )}
                </div>

                {/* Render Custom Portrait Rows, Portrait Posters Grid, Featured Banner, or Staggered Grid */}
                {catImages.length > 0 &&
                  (isFeaturedBannerLayout ? (
                    <FeaturedBannerGallery
                      items={catImages}
                      onSelectImage={(item) => setSelectedImage(item)}
                      categoryTitle={category.title}
                    />
                  ) : isPortraitRowsLayout ? (
                    <PortraitRowsGallery
                      items={catImages}
                      onSelectImage={(item) => setSelectedImage(item)}
                      categoryTitle={category.title}
                      rowDistribution={category.rowDistribution || [5, 4]}
                      initialRows={category.initialRows}
                      initialCount={category.initialCount}
                      stepRows={category.stepRows || 1}
                    />
                  ) : isPortraitLayout ? (
                    <PortraitPostersGrid
                      items={catImages}
                      onSelectImage={(item) => setSelectedImage(item)}
                      categoryTitle={category.title}
                      initialCount={category.initialCount || 8}
                      step={category.step || 4}
                    />
                  ) : (
                    <StaggeredGridGallery
                      items={catImages}
                      onSelectImage={(item) => setSelectedImage(item)}
                      categoryTitle={category.title}
                      initialCount={category.initialCount || 8}
                      step={category.step || 6}
                    />
                  ))}

                {/* Render Category Motion / Vertical Video Reels if present */}
                {catVideos.length > 0 && (
                  <div className="category-videos-block">
                    {catImages.length > 0 && (
                      <div className="category-videos-header">
                        <div className="category-video-subbadge">
                          {/* <Film size={13} /> */}
                          <span>IMAX Social Media Campaigns:</span>
                        </div>
                        <h3 className="category-video-heading">
                          Crafted engaging promotional videos for IMAX movie
                          releases, bringing the cinematic experience to life.
                        </h3>
                      </div>
                    )}

                    <VerticalVideosGrid
                      items={catVideos}
                      onSelectVideo={(vid) => setSelectedVideo(vid)}
                      initialCount={category.initialCount || 8}
                      step={category.step || 4}
                      label="Videos"
                    />
                  </div>
                )}
              </section>
            );
          })}

        {/* ================= SINGLE IMAGES SECTION ================= */}
        {hasImages && (
          <section className="project-media-section project-images-section">
            <div className="section-title-wrap">
              <div className="section-title-badge">
                {/* <ImageIcon size={15} /> */}
                {/* <span>Gallery</span> */}
              </div>
              <h2 className="section-heading">{imagesHeading}</h2>
            </div>

            {/* Layout Tactic Dispatcher */}
            {project.layout === "portrait-5-4" ||
            project.layout === "portrait-rows" ? (
              <PortraitRowsGallery
                items={imagesList}
                onSelectImage={(item) => setSelectedImage(item)}
                categoryTitle={project.title}
                rowDistribution={project.rowDistribution || [5, 4]}
                initialRows={project.initialRows}
                initialCount={project.initialCount}
                stepRows={project.stepRows || 1}
              />
            ) : project.layout === "portrait" ? (
              <PortraitPostersGrid
                items={imagesList}
                onSelectImage={(item) => setSelectedImage(item)}
                categoryTitle={project.title}
                initialCount={project.initialCount || 8}
                step={project.step || 4}
              />
            ) : (
              <StaggeredGridGallery
                items={imagesList}
                onSelectImage={(item) => setSelectedImage(item)}
                categoryTitle={project.title}
                initialCount={project.initialCount || 8}
                step={project.step || 6}
              />
            )}
          </section>
        )}

        {/* ================= VIDEOS SECTION (PURE VERTICAL REELS - NO TEXTS) ================= */}
        {hasVideos && (
          <section className="project-media-section project-videos-section">
            <div className="section-title-wrap">
              <div className="section-title-badge">
                {/* <Film size={15} /> */}
                {/* <span>Motion</span> */}
              </div>
              <h2 className="section-heading">{videosHeading}</h2>
            </div>

            {/* Vertical Video 9:16 Grid (Pure Visuals) */}
            <VerticalVideosGrid
              items={videosList}
              onSelectVideo={(item) => setSelectedVideo(item)}
              initialCount={project.initialCount || 8}
              step={project.step || 4}
              label="Videos"
            />
          </section>
        )}

        {/* ================= EMPTY STATE IF NO MEDIA ================= */}
        {!hasCategories && !hasImages && !hasVideos && (
          <EmptyState
            title="Curating Project Visuals"
            message={`Assets for ${project.title} are currently being prepared for high-definition showcase.`}
            actionText="Browse All Projects"
            onAction={handleBackToBranding}
          />
        )}

        {/* ================= BOTTOM PROJECT NAVIGATION ================= */}
        <footer className="project-footer-navigation">
          {prevProject && (
            <Link
              to={`/branding/${prevProject.slug}`}
              replace
              className="project-nav-link prev"
            >
              <ArrowLeft size={16} />
              <div className="nav-link-texts">
                <span className="nav-direction">Previous Project</span>
                <span className="nav-name">{prevProject.title}</span>
              </div>
            </Link>
          )}

          <button
            type="button"
            onClick={handleBackToBranding}
            className="project-nav-link back-home"
            aria-label="Back to all projects"
          >
            <Sparkles size={14} />
            <span>All Projects</span>
          </button>

          {nextProject && (
            <Link
              to={`/branding/${nextProject.slug}`}
              replace
              className="project-nav-link next"
            >
              <div className="nav-link-texts text-end">
                <span className="nav-direction">Next Project</span>
                <span className="nav-name">{nextProject.title}</span>
              </div>
              <ArrowRight size={16} />
            </Link>
          )}
        </footer>
      </div>

      {/* ================= FULL-SCREEN LIGHTBOX MODALS ================= */}
      <ImageModal
        isOpen={Boolean(selectedImage)}
        onClose={() => setSelectedImage(null)}
        src={selectedImage?.src}
        title={selectedImage?.title || project.title}
        tag={selectedImage?.tag}
        onNext={handleNextImage}
        onPrev={handlePrevImage}
        hasNext={allProjectImages.length > 1}
        hasPrev={allProjectImages.length > 1}
      />

      <VideoModal
        isOpen={Boolean(selectedVideo)}
        onClose={() => setSelectedVideo(null)}
        src={selectedVideo?.src}
        title={selectedVideo?.title || project.title}
        tag={selectedVideo?.tag}
      />
    </main>
  );
}
