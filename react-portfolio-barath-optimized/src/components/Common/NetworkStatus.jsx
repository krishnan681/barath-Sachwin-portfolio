import { WifiOff, Wifi, AlertTriangle } from "lucide-react";
import { useNetworkStatus } from "../../hooks/useNetworkStatus";
import "./NetworkStatus.css";

export default function NetworkStatus() {
  const { isOnline, isSlowConnection, showReconnectedAlert } = useNetworkStatus();

  if (isOnline && !showReconnectedAlert && !isSlowConnection) return null;

  return (
    <aside
      className={`network-status-toast ${
        !isOnline
          ? "is-offline"
          : isSlowConnection
          ? "is-slow"
          : "is-online"
      }`}
      role="status"
      aria-live="polite"
    >
      <div className="network-toast-icon">
        {!isOnline ? (
          <WifiOff size={16} />
        ) : isSlowConnection ? (
          <AlertTriangle size={16} />
        ) : (
          <Wifi size={16} />
        )}
      </div>
      <div className="network-toast-text">
        {!isOnline ? (
          <>
            <strong>You are currently offline.</strong>
            <span>Cached visual media will continue to display.</span>
          </>
        ) : isSlowConnection ? (
          <>
            <strong>Slow network detected.</strong>
            <span>Media is loading progressively in high definition.</span>
          </>
        ) : (
          <>
            <strong>Connection restored.</strong>
            <span>All media channels reconnected.</span>
          </>
        )}
      </div>
    </aside>
  );
}
