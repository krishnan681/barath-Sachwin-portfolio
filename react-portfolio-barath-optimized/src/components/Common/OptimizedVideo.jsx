import React, { useRef, useEffect, useState } from "react";

/**
 * OptimizedVideo
 * High-performance video player implementing the architecture recommended
 * for media-heavy portfolios:
 * 1. IntersectionObserver for viewport-aware play/pause (preserves GPU/hardware decoders).
 * 2. Starts with preload="none" and only preloads metadata when within rootMargin (200px).
 * 3. Immediate pause and release when scrolled out of view.
 * 4. Supports `isActive` prop for slider/carousel active-item awareness.
 */
export default function OptimizedVideo({
  src,
  poster,
  className = "",
  style = {},
  autoPlay = true,
  loop = true,
  muted = true,
  playsInline = true,
  controlsList = "nodownload",
  threshold = 0.15,
  rootMargin = "200px",
  isActive = true,
  onLoadedMetadata,
  children,
  ...props
}) {
  const videoRef = useRef(null);
  const [isInView, setIsInView] = useState(false);
  const [shouldPreload, setShouldPreload] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (!("IntersectionObserver" in window)) {
      // Fallback for environments without IntersectionObserver
      setIsInView(true);
      setShouldPreload(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        const inView = entry.isIntersecting;
        setIsInView(inView);
        if (inView) {
          setShouldPreload(true);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(video);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin]);

  // Handle play/pause based on viewport intersection and isActive status
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (autoPlay && isInView && isActive) {
      video.muted = true;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Autoplay policy or interruption safe catch
        });
      }
    } else {
      if (!video.paused) {
        video.pause();
      }
    }
  }, [isInView, isActive, autoPlay]);

  return (
    <video
      ref={videoRef}
      className={className}
      style={style}
      poster={poster}
      preload={shouldPreload ? "metadata" : "none"}
      muted={muted}
      defaultMuted={muted}
      loop={loop}
      playsInline={playsInline}
      controlsList={controlsList}
      onLoadedMetadata={(e) => {
        e.target.muted = true;
        if (onLoadedMetadata) onLoadedMetadata(e);
      }}
      {...props}
    >
      {src && <source src={src} type="video/mp4" />}
      {children}
    </video>
  );
}
