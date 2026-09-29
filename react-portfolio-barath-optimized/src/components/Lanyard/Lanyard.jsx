import React from "react";
import "./Lanyard.css";
import defaultProfileImg from "../../assets/profile/about1.webp";

export default function Lanyard({
  frontImage,
  alt = "Barath Sachwin - Creative Designer ID Badge",
  className = "",
}) {
  const cardImgSrc = frontImage || defaultProfileImg;

  return (
    <div className={`lanyard-wrapper ${className}`}>
      <div className="lanyard-card" aria-label={alt}>
        {/* Top attachment clip where the card hangs */}
        <div className="lanyard-clip-attachment" aria-hidden="true">
          <div className="lanyard-clip-ring" />
          <div className="lanyard-clip-metal" />
        </div>

        {/* Badge Card Holder Frame */}
        <div className="lanyard-badge-holder">
          <img
            src={cardImgSrc}
            alt={alt}
            className="lanyard-badge-img"
            loading="lazy"
            decoding="async"
            draggable={false}
          />
          <div className="lanyard-badge-sheen" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}
