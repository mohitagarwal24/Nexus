// securityMiddleware.ts
import { Request, Response, NextFunction } from "express";

// API KEY GUARD
export function apiKeyGuard(req: Request, res: Response, next: NextFunction) {
  const key = req.headers["x-api-key"];
  if (!key || key !== process.env.BACKEND_ACCESS_KEY) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}

// CONCURRENCY GUARD
const activeSessions = new Map<string, boolean>();

export function concurrencyGuard(req: Request, res: Response, next: NextFunction) {
  const sessionId = req.headers["x-session-id"] as string;

  if (!sessionId) {
    return res.status(400).json({ error: "Missing x-session-id header" });
  }

  if (activeSessions.get(sessionId)) {
    return res.status(429).json({ error: "Another request is already running" });
  }

  activeSessions.set(sessionId, true);
  res.on("finish", () => activeSessions.delete(sessionId));
  next();
}
