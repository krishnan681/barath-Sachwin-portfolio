import { useState, useEffect, useRef } from "react";
import { X, ChevronLeft, ChevronRight, ImageOff, RotateCcw } from "lucide-react";
import "./Modal.css";

export default function ImageModal({
  isOpen,
  onClose,
  src,
  title,
  tag,
  onNext,
  onPrev,
  hasNext = false,
  hasPrev = false,
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [retryKey, setRetryKey] = useState(0);
  const touchStartX = useRef(null);

  useEffect(() => {
    setIsLoaded(false);
    setHasError(false);
  }, [src, retryKey]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight" && onNext && hasNext) onNext();
      if (e.key === "ArrowLeft" && onPrev && hasPrev) onPrev();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, onNext, onPrev, hasNext, hasPrev]);

  if (!isOpen || !src) return null;

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const diffX = touchStartX.current - e.changedTouches[0].clientX;
    if (diffX > 50 && onNext && hasNext) {
      onNext();
    } else if (diffX < -50 && onPrev && hasPrev) {
      onPrev();
    }
    touchStartX.current = null;
  };

  return (
    <div
      className="custom-modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={title || "Image Lightbox"}
    >
      <div
        className="custom-image-modal-content"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Close Button */}
        <button
          type="button"
          className="custom-modal-close-btn"
          onClick={onClose}
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        {/* Previous Navigation Button */}
        {hasPrev && onPrev && (
          <button
            type="button"
            className="custom-modal-nav-btn prev"
            onClick={onPrev}
            aria-label="Previous image"
          >
            <ChevronLeft size={24} />
          </button>
        )}

        {/* Next Navigation Button */}
        {hasNext && onNext && (
          <button
            type="button"
            className="custom-modal-nav-btn next"
            onClick={onNext}
            aria-label="Next image"
          >
            <ChevronRight size={24} />
          </button>
        )}

        {/* Image Display Wrapper */}
        <div className="custom-modal-image-wrapper">
          {!isLoaded && !hasError && (
            <div className="modal-image-skeleton-shimmer">
              <div className="skeleton-shimmer" />
            </div>
          )}

          {hasError ? (
            <div className="modal-image-error-state">
              <ImageOff size={32} />
              <p>Unable to load high-resolution artwork</p>
              <button
                type="button"
                className="modal-retry-btn"
                onClick={() => {
                  setHasError(false);
                  setIsLoaded(false);
                  setRetryKey((k) => k + 1);
                }}
              >
                <RotateCcw size={13} />
                <span>Retry</span>
              </button>
            </div>
          ) : (
            <img
              key={`${src}-${retryKey}`}
              src={src}
              alt={title || "Showcase Preview"}
              className={`modal-preview-img ${isLoaded ? "is-loaded" : ""}`}
              onLoad={() => setIsLoaded(true)}
              onError={() => {
                setHasError(true);
                setIsLoaded(false);
              }}
            />
          )}
        </div>

        {/* Image Caption / Title */}
        {(title || tag) && (
          <div className="custom-modal-caption">
            {tag && <span className="custom-modal-tag">{tag}</span>}
            {title && <h4>{title}</h4>}
          </div>
        )}
      </div>
    </div>
  );
}
