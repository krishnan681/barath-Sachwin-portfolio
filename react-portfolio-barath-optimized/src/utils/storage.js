/**
 * Safe LocalStorage Utility
 * Handles private browsing mode, storage quota exceeded, and parsing errors gracefully.
 */

const STORAGE_PREFIX = "bp_portfolio_";

export const safeStorage = {
  get: (key, defaultValue = null) => {
    try {
      if (typeof window === "undefined" || !window.localStorage) {
        return defaultValue;
      }
      const raw = window.localStorage.getItem(`${STORAGE_PREFIX}${key}`);
      if (raw === null) return defaultValue;
      return JSON.parse(raw);
    } catch (err) {
      console.warn(`[safeStorage] Error reading key "${key}":`, err);
      return defaultValue;
    }
  },

  set: (key, value) => {
    try {
      if (typeof window === "undefined" || !window.localStorage) return false;
      window.localStorage.setItem(`${STORAGE_PREFIX}${key}`, JSON.stringify(value));
      return true;
    } catch (err) {
      console.warn(`[safeStorage] Error setting key "${key}":`, err);
      return false;
    }
  },

  remove: (key) => {
    try {
      if (typeof window === "undefined" || !window.localStorage) return;
      window.localStorage.removeItem(`${STORAGE_PREFIX}${key}`);
    } catch (err) {
      console.warn(`[safeStorage] Error removing key "${key}":`, err);
    }
  },

  /**
   * Helper to manage recently viewed items (e.g., projects, designs)
   */
  addRecentlyViewed: (item, maxItems = 6) => {
    try {
      const recent = safeStorage.get("recently_viewed", []);
      const filtered = recent.filter((r) => r.slug !== item.slug && r.id !== item.id);
      const updated = [
        {
          id: item.id,
          slug: item.slug,
          title: item.title,
          category: item.category || item.sectionTitle,
          cover: item.src || item.logo || item.banner,
          viewedAt: new Date().toISOString(),
        },
        ...filtered,
      ].slice(0, maxItems);
      safeStorage.set("recently_viewed", updated);
      return updated;
    } catch (err) {
      console.warn("[safeStorage] Failed to track recently viewed:", err);
      return [];
    }
  },

  getRecentlyViewed: () => {
    return safeStorage.get("recently_viewed", []);
  },
};
