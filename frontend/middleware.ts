import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const ua = req.headers.get("user-agent") || "";

  // Block empty user-agents and known bot patterns
  const botPatterns = ["bot", "crawler", "spider", "curl", "python", "scraper"];
  const isBot = botPatterns.some((b) => ua.toLowerCase().includes(b));

  if (!ua || isBot) {
    return new NextResponse("Blocked", { status: 403 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
