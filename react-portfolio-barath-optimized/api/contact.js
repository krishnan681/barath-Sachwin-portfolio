/**
 * Secure Serverless Backend API Route for Contact Form Submissions
 * Compatible with Vercel Serverless, Netlify Functions, Cloudflare Pages Functions, or Node/Express.
 */

// Simple in-memory rate limiter per IP for serverless invocations
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 3;

function isRateLimited(ip) {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now - record.startTime > RATE_LIMIT_WINDOW_MS) {
    rateLimitMap.set(ip, { count: 1, startTime: now });
    return false;
  }

  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    return true;
  }

  record.count += 1;
  return false;
}

// Clean up expired rate limit records periodically
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of rateLimitMap.entries()) {
    if (now - record.startTime > RATE_LIMIT_WINDOW_MS) {
      rateLimitMap.delete(ip);
    }
  }
}, RATE_LIMIT_WINDOW_MS);

export default async function handler(req, res) {
  // 1. Set Security & CORS Headers
  const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:3000",
    process.env.ALLOWED_ORIGIN || "",
  ].filter(Boolean);

  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");

  // Handle preflight OPTIONS request
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Only allow POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  // 2. IP Rate Limiting
  const clientIp =
    req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
    req.socket?.remoteAddress ||
    "unknown";

  if (isRateLimited(clientIp)) {
    return res.status(429).json({
      error: "Too many requests. Please wait a minute before submitting again.",
    });
  }

  try {
    const { name, email, projectType, message, honeypot } = req.body || {};

    // 3. Honeypot check (Bots fill hidden fields)
    if (honeypot && honeypot.trim().length > 0) {
      return res.status(400).json({ error: "Invalid submission detected." });
    }

    // 4. Input sanitization and validation
    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return res.status(400).json({ error: "Name must be at least 2 characters." });
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email || !emailRegex.test(email.trim())) {
      return res.status(400).json({ error: "Valid email is required." });
    }

    if (!message || typeof message !== "string" || message.trim().length < 5) {
      return res.status(400).json({ error: "Message must be at least 5 characters." });
    }

    const sanitizedData = {
      name: name.slice(0, 100).replace(/[<>]/g, "").trim(),
      email: email.slice(0, 120).trim().toLowerCase(),
      projectType: (projectType || "General").slice(0, 100).replace(/[<>]/g, "").trim(),
      message: message.slice(0, 2000).replace(/[<>]/g, "").trim(),
      timestamp: new Date().toISOString(),
      clientIp,
    };

    console.log("Secure inquiry received:", sanitizedData);

    // Optional: Integrate with Resend / SendGrid / Nodemailer if API key is provided
    // e.g.:
    // if (process.env.RESEND_API_KEY) {
    //   await resend.emails.send({
    //     from: "Portfolio <onboarding@resend.dev>",
    //     to: "barathsachwin13@gmail.com",
    //     subject: `New Portfolio Inquiry from ${sanitizedData.name}`,
    //     text: `From: ${sanitizedData.name} (${sanitizedData.email})\nService: ${sanitizedData.projectType}\n\n${sanitizedData.message}`,
    //   });
    // }

    return res.status(200).json({
      success: true,
      message: "Inquiry processed successfully.",
    });
  } catch (error) {
    console.error("Inquiry handler error:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
}
