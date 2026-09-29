import { useEffect } from "react";
import { X } from "lucide-react";
import "./Modal.css";

export default function VideoModal({ isOpen, onClose, src, title, tag }) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !src) return null;

  return (
    <div className="custom-modal-overlay" onClick={onClose}>
      <div className="custom-video-modal-content" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="custom-modal-close-btn" onClick={onClose}>
          <X size={20} />
        </button>
        <div className="custom-modal-video-wrapper">
          <video src={src} controls autoPlay playsInline controlsList="nodownload" />
        </div>
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
