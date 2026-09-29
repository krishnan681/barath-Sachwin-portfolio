import { Layers, RotateCcw } from "lucide-react";
import "./EmptyState.css";

export default function EmptyState({
  title = "No Visuals Found",
  message = "There are no media items available in this showcase category yet.",
  icon: Icon = Layers,
  actionText,
  onAction,
}) {
  return (
    <div className="empty-state-card" role="status">
      <div className="empty-state-icon-wrap">
        <Icon size={28} />
      </div>
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-desc">{message}</p>
      {actionText && onAction && (
        <button type="button" className="empty-state-btn" onClick={onAction}>
          <RotateCcw size={14} />
          <span>{actionText}</span>
        </button>
      )}
    </div>
  );
}
