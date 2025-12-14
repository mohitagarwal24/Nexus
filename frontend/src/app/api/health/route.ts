import { NextResponse } from 'next/server';

// CRITICAL: Force Node.js runtime (not Edge)
export const runtime = 'nodejs';

/**
 * Health check endpoint
 * Use this to verify the app is running
 */
export async function GET() {
  // Check if emergency kill switch is enabled
  if (process.env.EMERGENCY_SHUTDOWN === 'true') {
    return NextResponse.json(
      { 
        status: 'maintenance',
        message: 'Service temporarily unavailable. Please try again later.' 
      },
      { status: 503 }
    );
  }

  return NextResponse.json({ 
    status: 'ok',
    timestamp: new Date().toISOString()
  });
}

