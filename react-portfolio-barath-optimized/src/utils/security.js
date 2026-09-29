/**
 * Security & Anti-Abuse Utilities for Contact & Inquiry Forms
 */

/**
 * Sanitizes user input string against XSS and script injection attacks.
 * Strips HTML tags, trims whitespace, and limits length.
 * @param {string} str - Raw input string
 * @param {number} maxLength - Maximum allowable length (default 2000)
 * @returns {string} Sanitized string
 */
export function sanitizeInput(str, maxLength = 2000) {
  if (typeof str !== "string") return "";

  return str
    .slice(0, maxLength)
    .replace(/[<>]/g, "") // Strip dangerous bracket tags
    .replace(/javascript:/gi, "") // Strip javascript pseudo-protocols
    .replace(/data:/gi, "") // Strip data URI attacks
    .replace(/on\w+=/gi, "") // Strip inline event handlers like onerror=, onclick=
    .trim();
}

/**
 * Validates email format according to standard RFC patterns.
 * @param {string} email
 * @returns {boolean}
 */
export function validateEmail(email) {
  if (!email || typeof email !== "string") return false;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email.trim()) && email.length <= 120;
}

/**
 * Validates phone number (supports optional country code, +91, standard 10 digits).
 * @param {string} phone
 * @returns {boolean}
 */
export function validatePhone(phone) {
  if (!phone || typeof phone !== "string") return false;
  const cleanPhone = phone.replace(/[\s\-()]/g, "");
  // Matches +91XXXXXXXXXX or standard 7-15 digit phone numbers
  const phoneRegex = /^\+?[0-9]{7,15}$/;
  return phoneRegex.test(cleanPhone);
}

/**
 * Honeypot spam trap detector.
 * Humans cannot see this field; automated spam bots auto-fill it.
 * @param {string} honeypotValue - Value of the invisible honeypot input
 * @returns {boolean} True if clean (human), false if trapped (bot)
 */
export function checkHoneypot(honeypotValue) {
  return !honeypotValue || honeypotValue.trim().length === 0;
}

/**
 * Human Timing Detector.
 * A human takes at least 1.5 seconds to fill and submit a form.
 * Instant automated bot scripts execute in milliseconds.
 * @param {number} startTimeMs - Timestamp when form mounted or user focused
 * @param {number} minMs - Minimum allowed elapsed time in milliseconds (default 1500ms)
 * @returns {boolean} True if human timing, false if bot
 */
export function checkBotTiming(startTimeMs, minMs = 1500) {
  if (!startTimeMs) return true;
  const elapsed = Date.now() - startTimeMs;
  return elapsed >= minMs;
}

/**
 * Client-Side Rate Limiter / Spam Cooldown.
 * Prevents rapid repeated submissions in the same session.
 * @param {string} actionKey - Unique identifier for the action
 * @param {number} cooldownSeconds - Cooldown duration in seconds (default 30s)
 * @returns {{ allowed: boolean, remainingSeconds: number }}
 */
export function checkRateLimit(actionKey = "contact_inquiry", cooldownSeconds = 30) {
  try {
    const key = `ratelimit_${actionKey}`;
    const lastTime = sessionStorage.getItem(key) || localStorage.getItem(key);

    if (!lastTime) {
      return { allowed: true, remainingSeconds: 0 };
    }

    const elapsedSeconds = Math.floor((Date.now() - parseInt(lastTime, 10)) / 1000);
    if (elapsedSeconds < cooldownSeconds) {
      return {
        allowed: false,
        remainingSeconds: cooldownSeconds - elapsedSeconds,
      };
    }

    return { allowed: true, remainingSeconds: 0 };
  } catch {
    // If storage is disabled, allow submission gracefully
    return { allowed: true, remainingSeconds: 0 };
  }
}

/**
 * Registers a successful submission to trigger the rate-limiting cooldown.
 * @param {string} actionKey
 */
export function setRateLimitCooldown(actionKey = "contact_inquiry") {
  try {
    const key = `ratelimit_${actionKey}`;
    const now = Date.now().toString();
    sessionStorage.setItem(key, now);
    localStorage.setItem(key, now);
  } catch {
    // Storage silent fallback
  }
}
