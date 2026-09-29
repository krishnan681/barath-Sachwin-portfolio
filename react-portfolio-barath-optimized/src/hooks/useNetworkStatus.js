import { useState, useEffect } from "react";

/**
 * Custom Hook for tracking network connectivity & speed status
 * Returns { isOnline, isSlowConnection, showReconnectedAlert }
 */
export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(() => {
    return typeof navigator !== "undefined" && typeof navigator.onLine === "boolean"
      ? navigator.onLine
      : true;
  });
  const [isSlowConnection, setIsSlowConnection] = useState(false);
  const [wasOffline, setWasOffline] = useState(false);
  const [showReconnectedAlert, setShowReconnectedAlert] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      if (wasOffline) {
        setShowReconnectedAlert(true);
        const timer = setTimeout(() => setShowReconnectedAlert(false), 4000);
        return () => clearTimeout(timer);
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      setWasOffline(true);
      setShowReconnectedAlert(false);
    };

    const checkConnectionSpeed = () => {
      if (typeof navigator !== "undefined" && navigator.connection) {
        const { effectiveType, saveData } = navigator.connection;
        const slow = effectiveType === "2g" || effectiveType === "slow-2g" || saveData;
        setIsSlowConnection(Boolean(slow));
      }
    };

    checkConnectionSpeed();

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    if (typeof navigator !== "undefined" && navigator.connection) {
      navigator.connection.addEventListener("change", checkConnectionSpeed);
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      if (typeof navigator !== "undefined" && navigator.connection) {
        navigator.connection.removeEventListener("change", checkConnectionSpeed);
      }
    };
  }, [wasOffline]);

  return { isOnline, isSlowConnection, showReconnectedAlert };
}
