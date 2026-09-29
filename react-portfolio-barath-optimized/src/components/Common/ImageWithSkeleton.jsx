import { useState, useRef, useEffect } from "react";
import { ImageOff, RotateCcw } from "lucide-react";
import "./Skeleton.css";

export default function ImageWithSkeleton({
  src,
  alt = "",
  className = "",
  wrapperClassName = "",
  style = {},
  imgStyle = {},
  aspectRatio,
  objectFit,
  onClick,
  onLoad,
  loading = "lazy",
  fetchPriority,
  ...props
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [retryKey, setRetryKey] = useState(0);
  const imgRef = useRef(null);

  useEffect(() => {
    setIsLoaded(false);
    setHasError(false);
    if (imgRef.current && imgRef.current.complete && imgRef.current.naturalWidth > 0) {
      setIsLoaded(true);
    }
  }, [src, retryKey]);

  const handleRetry = (e) => {
    e.stopPropagation();
    setHasError(false);
    setIsLoaded(false);
    setRetryKey((k) => k + 1);
  };

  return (
    <div
      className={`image-with-skeleton-wrap ${!isLoaded && !hasError ? "is-loading" : ""} ${wrapperClassName}`}
      style={{
        ...(aspectRatio ? { aspectRatio } : {}),
        ...style,
      }}
      onClick={onClick}
    >
      {/* Skeleton Shimmer Placeholder (Loading State) */}
      {!hasError && !isLoaded && (
        <div
          className="skeleton-box image-skeleton-overlay"
          aria-hidden="true"
        >
          <div className="skeleton-shimmer" />
        </div>
      )}

      {/* Error Fallback State */}
      {hasError ? (
        <div className="image-error-fallback" role="status">
          <ImageOff size={24} className="image-error-icon" />
          <span className="image-error-label">Visual unavailable</span>
          <button type="button" className="image-retry-btn" onClick={handleRetry}>
            <RotateCcw size={12} />
            <span>Retry</span>
          </button>
        </div>
      ) : (
        /* Actual Image */
        <img
          key={`${src}-${retryKey}`}
          ref={imgRef}
          src={src}
          alt={alt}
          className={`image-with-skeleton-img ${isLoaded ? "is-loaded" : ""} ${className}`}
          style={{
            ...(objectFit ? { objectFit } : {}),
            ...imgStyle,
          }}
          loading={loading}
          fetchpriority={fetchPriority || props.fetchpriority}
          decoding="async"
          onLoad={(e) => {
            setIsLoaded(true);
            if (onLoad) onLoad(e);
          }}
          onError={() => {
            setHasError(true);
            setIsLoaded(false);
          }}
          {...props}
        />
      )}
    </div>
  );
}
