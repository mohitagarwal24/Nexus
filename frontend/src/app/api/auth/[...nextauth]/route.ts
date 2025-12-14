import { handlers } from "@/auth"

// CRITICAL: Force Node.js runtime (not Edge) to avoid Edge request quota
export const runtime = 'nodejs';

export const { GET, POST } = handlers