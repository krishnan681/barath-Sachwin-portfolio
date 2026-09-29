import {
  sanitizeInput,
  validateEmail,
  checkHoneypot,
  checkBotTiming,
  checkRateLimit,
  setRateLimitCooldown,
} from "../utils/security";

export const CONTACT_CONFIG = {
  name: "Barath Sachwin",
  email: "barathsachwin13@gmail.com",
  phone: "+91 7868986677",
  rawPhone: "+917868986677",
  phone2: "+91 9791789480",
  rawPhone2: "+919791789480",
  whatsappNumber: "9791789480",
  location: "Coimbatore, Tamil Nadu, India",
};

export const CONTACT_CONFIG2 = {
  name: "Barath Sachwin",
  email: "barathsachwin13@gmail.com",
  phone: "+91 9791789480",
  rawPhone: "+919791789480",
  whatsappNumber: "9791789480",
  location: "Coimbatore, Tamil Nadu, India",
};


/**
 * Copies string text to system clipboard with robust fallback
 * @param {string} text
 * @returns {Promise<boolean>}
 */
export async function copyToClipboard(text) {
  if (!text) return false;

  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Fallback below
  }

  try {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    textArea.style.top = "-999999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = document.execCommand("copy");
    document.body.removeChild(textArea);
    return successful;
  } catch {
    return false;
  }
}

/**
 * Constructs a pre-formatted WhatsApp chat link
 * @param {string} customText
 * @returns {string}
 */
export function getWhatsAppLink(customText = "") {
  const defaultText = "Hi Barath! I saw your portfolio and would like to discuss a creative project with you.";
  const text = encodeURIComponent(customText.trim() || defaultText);
  return `https://wa.me/${CONTACT_CONFIG.whatsappNumber}?text=${text}`;
}

/**
 * Constructs a pre-formatted Mailto link
 * @param {{ subject?: string, body?: string }} options
 * @returns {string}
 */
export function getMailtoLink({ subject = "", body = "" } = {}) {
  const defaultSubject = "Project Inquiry - Barath Portfolio";
  const finalSubject = encodeURIComponent(subject || defaultSubject);
  const finalBody = encodeURIComponent(body || "");
  return `mailto:${CONTACT_CONFIG.email}?subject=${finalSubject}&body=${finalBody}`;
}

/**
 * Processes and validates a project inquiry with full security protections.
 * Sanitizes input, enforces rate limiting, checks anti-spam honeypot & timing.
 * 
 * @param {{
 *   name: string,
 *   email: string,
 *   projectType?: string,
 *   message: string,
 *   honeypot?: string,
 *   startTimeMs?: number
 * }} rawData
 * 
 * @returns {Promise<{
 *   success: boolean,
 *   message: string,
 *   data?: {
 *     whatsappUrl: string,
 *     mailtoUrl: string,
 *     sanitized: { name: string, email: string, projectType: string, message: string }
 *   }
 * }>}
 */
export async function submitProjectInquiry(rawData) {
  // 1. Anti-Bot Honeypot Trap Check
  if (!checkHoneypot(rawData.honeypot)) {
    // Bot detected - reject silently or simulate delay
    return {
      success: false,
      message: "Unable to process request. Please try again or contact directly via WhatsApp.",
    };
  }

  // 2. Automated Script Timing Check (< 1.5s is superhuman)
  if (!checkBotTiming(rawData.startTimeMs, 1200)) {
    return {
      success: false,
      message: "Please take a moment to review your details before submitting.",
    };
  }

  // 3. Client-Side Rate Limit & Cooldown Check (30 seconds)
  const rateLimit = checkRateLimit("inquiry_submission", 30);
  if (!rateLimit.allowed) {
    return {
      success: false,
      message: `Please wait ${rateLimit.remainingSeconds}s before submitting another inquiry.`,
    };
  }

  // 4. Input Sanitization
  const name = sanitizeInput(rawData.name || "", 80);
  const email = (rawData.email || "").trim().toLowerCase();
  const projectType = sanitizeInput(rawData.projectType || "General Inquiry", 80);
  const message = sanitizeInput(rawData.message || "", 1500);

  // 5. Validation Rules
  if (!name || name.length < 2) {
    return { success: false, message: "Please enter your name (at least 2 characters)." };
  }

  if (!validateEmail(email)) {
    return { success: false, message: "Please provide a valid email address." };
  }

  if (!message || message.length < 5) {
    return { success: false, message: "Please describe your project or inquiry." };
  }

  const sanitized = { name, email, projectType, message };

  // 6. Build Direct Communication Channels (WhatsApp & Mailto)
  const whatsappMsg = `*New Project Inquiry via Portfolio*\n\n` +
    `👤 *Name:* ${name}\n` +
    `✉️ *Email:* ${email}\n` +
    `🎯 *Service:* ${projectType}\n\n` +
    `💬 *Details:* \n${message}`;

  const mailtoBody = `Name: ${name}\n` +
    `Email: ${email}\n` +
    `Service: ${projectType}\n\n` +
    `Project Brief:\n${message}\n\n` +
    `--\nSent via Barath Portfolio`;

  const whatsappUrl = getWhatsAppLink(whatsappMsg);
  const mailtoUrl = getMailtoLink({
    subject: `Project Inquiry: ${projectType} from ${name}`,
    body: mailtoBody,
  });

  // 7. Optional Backend / Serverless API webhook dispatch if configured
  const apiUrl = import.meta.env.VITE_CONTACT_API_URL;
  if (apiUrl) {
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sanitized),
      });

      if (!response.ok) {
        console.warn("Backend API response not OK, falling back to direct channels");
      }
    } catch (err) {
      console.warn("Backend API dispatch failed, proceeding with direct client channels", err);
    }
  }

  // 8. Record Rate Limit Cooldown on success
  setRateLimitCooldown("inquiry_submission");

  return {
    success: true,
    message: "Inquiry prepared successfully! Choose your preferred channel below to send.",
    data: {
      whatsappUrl,
      mailtoUrl,
      sanitized,
    },
  };
}
