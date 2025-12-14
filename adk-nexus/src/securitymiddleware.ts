// securityMiddleware.ts
import { Request, Response, NextFunction } from "express";
import fetch from "node-fetch";

// ============================================================================
// RATE LIMITING - IP-based sliding window rate limiter
// ============================================================================
interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute window
const RATE_LIMIT_MAX_REQUESTS = 3; // AGGRESSIVE: max 3 requests per minute per IP (prevents bot floods)
const MAX_RATE_LIMIT_ENTRIES = 1000; // Prevent memory leak - max 1000 IPs tracked

// Aggressive cleanup every 1 minute + size limit enforcement
const cleanupInterval = setInterval(() => {
  const now = Date.now();

  // Remove expired entries
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key);
    }
  }

  // CRITICAL: If still too large, remove oldest entries (FIFO)
  if (rateLimitStore.size > MAX_RATE_LIMIT_ENTRIES) {
    const entriesToRemove = rateLimitStore.size - MAX_RATE_LIMIT_ENTRIES;
    const keys = Array.from(rateLimitStore.keys()).slice(0, entriesToRemove);
    keys.forEach(key => rateLimitStore.delete(key));
    console.warn(`⚠️ Rate limit store overflow: removed ${entriesToRemove} old entries`);
  }
}, 60 * 1000); // Run every 1 minute instead of 5

// Cleanup on process termination
process.on('SIGTERM', () => {
  clearInterval(cleanupInterval);
  rateLimitStore.clear();
});
process.on('SIGINT', () => {
  clearInterval(cleanupInterval);
  rateLimitStore.clear();
});

function getClientIP(req: Request): string {
  // Check various headers for the real IP (behind proxies)
  const forwarded = req.headers["x-forwarded-for"];
  if (forwarded) {
    const ips = (typeof forwarded === "string" ? forwarded : forwarded[0]).split(",");
    return ips[0].trim();
  }
  const realIP = req.headers["x-real-ip"];
  if (realIP) {
    return typeof realIP === "string" ? realIP : realIP[0];
  }
  return req.ip || req.socket.remoteAddress || "unknown";
}

export function rateLimitGuard(req: Request, res: Response, next: NextFunction) {
  const clientIP = getClientIP(req);
  const now = Date.now();

  let entry = rateLimitStore.get(clientIP);

  if (!entry || now > entry.resetTime) {
    // Create new entry or reset expired one
    entry = { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS };
    rateLimitStore.set(clientIP, entry);
    next();
    return;
  }

  entry.count++;

  if (entry.count > RATE_LIMIT_MAX_REQUESTS) {
    const retryAfter = Math.ceil((entry.resetTime - now) / 1000);
    res.setHeader("Retry-After", String(retryAfter));
    console.warn(`⚠️ Rate limit exceeded for IP: ${clientIP}`);
    return res.status(429).json({
      error: "Rate limit exceeded. Please try again later.",
      retryAfter
    });
  }

  next();
}

// ============================================================================
// BOT DETECTION - Block known bot patterns and suspicious requests
// ============================================================================
const BOT_PATTERNS = [
  "bot", "crawler", "spider", "scraper", "curl", "wget",
  "python-requests", "go-http-client", "java/", "ruby",
  "headless", "phantom", "selenium", "puppeteer", "playwright"
];

export function botGuard(req: Request, res: Response, next: NextFunction) {
  // CRITICAL: Skip bot detection for /health endpoint
  // Railway/Docker healthchecks use curl which is in BOT_PATTERNS
  // Without this exemption, healthchecks fail and deployment breaks
  if (req.path === "/health") {
    return next();
  }

  const ua = (req.headers["user-agent"] || "").toLowerCase();

  // Block empty user-agents (likely bots/scripts)
  if (!ua || ua.length < 10) {
    console.warn(`⚠️ Blocked empty/short user-agent from ${getClientIP(req)}`);
    return res.status(403).json({ error: "Access denied" });
  }

  // Block known bot patterns
  const isBot = BOT_PATTERNS.some(pattern => ua.includes(pattern));
  if (isBot) {
    console.warn(`⚠️ Blocked bot user-agent: ${ua} from ${getClientIP(req)}`);
    return res.status(403).json({ error: "Access denied" });
  }

  next();
}

// ============================================================================
// API KEY GUARD - Require valid API key for protected endpoints
// ============================================================================
export function apiKeyGuard(req: Request, res: Response, next: NextFunction) {
  const key = req.headers["x-api-key"];
  const expectedKey = process.env.BACKEND_ACCESS_KEY;

  // Skip if no key is configured (development mode)
  if (!expectedKey) {
    console.warn("⚠️ BACKEND_ACCESS_KEY not set - API key validation skipped");
    next();
    return;
  }

  if (!key || key !== expectedKey) {
    console.warn(`⚠️ Invalid API key attempt from ${getClientIP(req)}`);
    return res.status(401).json({ error: "Unauthorized" });
  }

  next();
}

// ============================================================================
// CONCURRENCY GUARD - Prevent duplicate concurrent requests per session
// ============================================================================
const activeSessions = new Map<string, boolean>();
const MAX_ACTIVE_SESSIONS = 500; // Prevent memory leak

// Cleanup stale sessions every 2 minutes
const sessionCleanupInterval = setInterval(() => {
  // If too many sessions, clear oldest half (aggressive cleanup)
  if (activeSessions.size > MAX_ACTIVE_SESSIONS) {
    const toClear = Math.floor(activeSessions.size / 2);
    const keys = Array.from(activeSessions.keys()).slice(0, toClear);
    keys.forEach(key => activeSessions.delete(key));
    console.warn(`⚠️ Session store overflow: cleared ${toClear} stale sessions`);
  }
}, 2 * 60 * 1000);

// Cleanup on process termination
process.on('SIGTERM', () => {
  clearInterval(sessionCleanupInterval);
  activeSessions.clear();
});
process.on('SIGINT', () => {
  clearInterval(sessionCleanupInterval);
  activeSessions.clear();
});

export function concurrencyGuard(req: Request, res: Response, next: NextFunction) {
  const sessionId = req.headers["x-session-id"] as string;

  if (!sessionId) {
    return res.status(400).json({ error: "Missing x-session-id header" });
  }

  if (activeSessions.get(sessionId)) {
    console.warn(`⚠️ Concurrent request blocked for session: ${sessionId}`);
    return res.status(429).json({ error: "Another request is already running for this session" });
  }

  // Enforce max sessions limit
  if (activeSessions.size >= MAX_ACTIVE_SESSIONS) {
    console.error(`⚠️ Max active sessions reached (${MAX_ACTIVE_SESSIONS})`);
    return res.status(503).json({ error: "Service temporarily unavailable. Too many concurrent requests." });
  }

  activeSessions.set(sessionId, true);
  res.on("finish", () => activeSessions.delete(sessionId));
  next();
}

// ============================================================================
// REQUEST VALIDATION - Validate request body and prevent abuse
// ============================================================================
export function requestValidationGuard(req: Request, res: Response, next: NextFunction) {
  // Check content-type for POST/PUT requests
  if (["POST", "PUT", "PATCH"].includes(req.method)) {
    const contentType = req.headers["content-type"];
    if (!contentType || !contentType.includes("application/json")) {
      return res.status(415).json({ error: "Content-Type must be application/json" });
    }
  }

  // Limit body size already handled by express.json({ limit: '10mb' })
  next();
}

// ============================================================================
// CAPTCHA VERIFICATION - Cloudflare Turnstile verification
// ============================================================================
export async function captchaGuard(req: Request, res: Response, next: NextFunction) {
  const captchaToken = req.headers["x-captcha-token"] as string;
  const secretKey = process.env.TURNSTILE_SECRET_KEY;

  // In production, ALWAYS require CAPTCHA
  if (process.env.NODE_ENV === 'production' && !secretKey) {
    console.error("❌ TURNSTILE_SECRET_KEY not set in production - blocking request");
    return res.status(503).json({ error: "Service configuration error" });
  }

  // Skip only in development mode
  if (!secretKey && process.env.NODE_ENV !== 'production') {
    console.warn("⚠️ TURNSTILE_SECRET_KEY not set - CAPTCHA validation skipped (dev mode only)");
    next();
    return;
  }

  if (!captchaToken) {
    console.warn(`⚠️ Missing CAPTCHA token from ${getClientIP(req)}`);
    return res.status(400).json({ error: "CAPTCHA verification required. Please complete the verification." });
  }

  try {
    // Verify token with Cloudflare Turnstile API
    const verifyResponse = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        secret: secretKey,
        response: captchaToken,
        remoteip: getClientIP(req),
      }),
    });

    const verifyData = await verifyResponse.json() as {
      success: boolean;
      'error-codes'?: string[];
      challenge_ts?: string;
      hostname?: string;
    };

    if (!verifyData.success) {
      console.warn(`⚠️ CAPTCHA verification failed for ${getClientIP(req)}:`, verifyData['error-codes']);
      return res.status(403).json({ 
        error: "CAPTCHA verification failed. Please try again.",
        details: verifyData['error-codes']
      });
    }

    console.log(`✅ CAPTCHA verified for ${getClientIP(req)}`);
    next();
  } catch (error) {
    console.error('❌ CAPTCHA verification error:', error);
    return res.status(500).json({ error: "CAPTCHA verification service unavailable" });
  }
}

// ============================================================================
// COMBINED SECURITY MIDDLEWARE - Apply all guards in sequence
// ============================================================================
export function securityMiddleware(req: Request, res: Response, next: NextFunction) {
  // Apply guards in sequence
  rateLimitGuard(req, res, () => {
    botGuard(req, res, () => {
      requestValidationGuard(req, res, next);
    });
  });
}