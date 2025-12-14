import { NextRequest, NextResponse } from "next/server";

// Simple in-memory rate limiter for edge runtime
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 100; // 100 requests per minute per IP (allows normal browsing)

function getClientIP(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  const realIP = req.headers.get("x-real-ip");
  if (realIP) return realIP;
  return "unknown";
}

function checkRateLimit(ip: string): { allowed: boolean; retryAfter?: number } {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return { allowed: true };
  }

  entry.count++;
  if (entry.count > RATE_LIMIT_MAX) {
    return {
      allowed: false,
      retryAfter: Math.ceil((entry.resetTime - now) / 1000)
    };
  }

  return { allowed: true };
}

// Cleanup stale entries periodically (runs on each request, limited overhead)
function cleanupRateLimitMap() {
  if (rateLimitMap.size > 1000) {
    const now = Date.now();
    for (const [key, entry] of rateLimitMap.entries()) {
      if (now > entry.resetTime) {
        rateLimitMap.delete(key);
      }
    }
  }
}

export function middleware(req: NextRequest) {
  // EMERGENCY KILL SWITCH: Set EMERGENCY_SHUTDOWN=true in Vercel env vars to stop all traffic
  if (process.env.EMERGENCY_SHUTDOWN === 'true') {
    return new NextResponse(
      JSON.stringify({ 
        status: 'maintenance',
        message: 'Service temporarily unavailable. Please try again later.' 
      }),
      { 
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }

  const ua = req.headers.get("user-agent") || "";
  const pathname = req.nextUrl.pathname;

  // Skip all checks for static assets, Next.js internals, and auth
  if (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/api/auth/") ||
    pathname.includes("/_vercel/") ||
    pathname.endsWith(".css") ||
    pathname.endsWith(".js") ||
    pathname.endsWith(".woff") ||
    pathname.endsWith(".woff2") ||
    pathname.endsWith(".otf") ||
    pathname.endsWith(".ttf") ||
    pathname.endsWith(".ico") ||
    pathname.endsWith(".png") ||
    pathname.endsWith(".jpg") ||
    pathname.endsWith(".svg") ||
    pathname === "/health"
  ) {
    return NextResponse.next();
  }

  // AGGRESSIVE bot blocking - block early to save resources
  const botPatterns = [
    "bot", "crawler", "spider", "curl", "python", "scraper",
    "wget", "go-http-client", "java/", "headless", "phantom",
    "selenium", "puppeteer", "playwright", "axios", "node-fetch"
  ];
  const isBot = botPatterns.some((b) => ua.toLowerCase().includes(b));

  // Block ALL bots immediately (including API routes)
  if (!ua || ua.length < 10 || isBot) {
    return new NextResponse("Blocked", { status: 403 });
  }

  // STRICTER rate limiting - reduce to 30 req/min
  cleanupRateLimitMap();
  const clientIP = getClientIP(req);

  // Override rate limit for stricter control
  const STRICT_RATE_LIMIT = 30;
  const now = Date.now();
  const entry = rateLimitMap.get(clientIP);

  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(clientIP, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
  } else {
    entry.count++;
    if (entry.count > STRICT_RATE_LIMIT) {
      const retryAfter = Math.ceil((entry.resetTime - now) / 1000);
      return new NextResponse(
        JSON.stringify({ error: "Rate limit exceeded", retryAfter }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": String(retryAfter)
          }
        }
      );
    }
  }

  return NextResponse.next();
}

// CRITICAL: Only run middleware on API routes that need protection
// This prevents Edge requests from being counted on every page load
export const config = {
  matcher: [
    "/api/analyze-repo",
    "/api/create-github-issue",
  ],
};
