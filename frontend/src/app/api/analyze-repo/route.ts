import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';

// CRITICAL: Force Node.js runtime (not Edge) to avoid Edge request quota
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Protected API route for repository analysis
 * This route acts as a proxy to the backend but requires authentication
 * 
 * Security layers:
 * 1. NextAuth session validation (blocks all unauthenticated requests)
 * 2. CAPTCHA token validation (passed to backend)
 * 3. Session ID tracking (prevents concurrent abuse)
 * 4. Backend API key (prevents direct backend access)
 */
export async function POST(req: NextRequest) {
  try {
    // CRITICAL: Check authentication first - blocks 99% of bot traffic
    const session = await auth();
    
    if (!session || !session.user) {
      console.warn(`🚫 Unauthorized analyze-repo attempt from ${req.headers.get('x-forwarded-for') || 'unknown'}`);
      return NextResponse.json(
        { error: 'Authentication required. Please sign in with GitHub.' },
        { status: 401 }
      );
    }

    // Verify user has GitHub access token
    if (!session.accessToken) {
      console.warn(`🚫 Missing GitHub access token for user: ${session.user.email}`);
      return NextResponse.json(
        { error: 'GitHub authentication incomplete. Please sign in again.' },
        { status: 401 }
      );
    }

    // Extract request data
    const body = await req.json();
    const { repo_url } = body;

    if (!repo_url) {
      return NextResponse.json(
        { error: 'repo_url is required' },
        { status: 400 }
      );
    }

    // Validate GitHub URL format
    if (!repo_url.match(/^https:\/\/github\.com\/[^\/]+\/[^\/\?#]+/)) {
      return NextResponse.json(
        { error: 'Invalid GitHub repository URL format' },
        { status: 400 }
      );
    }

    // Extract headers
    const captchaToken = req.headers.get('x-captcha-token');
    const sessionId = req.headers.get('x-session-id');

    // Require CAPTCHA token (optional in dev, required in production)
    if (process.env.NODE_ENV === 'production' && !captchaToken) {
      return NextResponse.json(
        { error: 'CAPTCHA verification required' },
        { status: 400 }
      );
    }

    // Require session ID for concurrency control
    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID required' },
        { status: 400 }
      );
    }

    // Prepare backend request
    const backendUrl = process.env.BACKEND_URL || 'https://nexus-production-b793.up.railway.app';
    const backendApiKey = process.env.NEXT_PUBLIC_BACKEND_KEY;

    if (!backendApiKey) {
      console.error('❌ NEXT_PUBLIC_BACKEND_KEY not configured');
      return NextResponse.json(
        { error: 'Service configuration error' },
        { status: 500 }
      );
    }

    console.log(`✅ Authenticated request from user: ${session.user.email} for repo: ${repo_url}`);

    // Forward request to backend with authentication
    const backendResponse = await fetch(`${backendUrl}/api/analyze-repo`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': backendApiKey,
        'x-session-id': sessionId,
        'x-captcha-token': captchaToken || '',
        // Pass user's GitHub token for repository access
        'Authorization': `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify({ repo_url }),
    });

    // Handle backend response
    if (!backendResponse.ok) {
      const errorData = await backendResponse.json().catch(() => ({ error: 'Backend service error' }));
      console.error(`❌ Backend error: ${backendResponse.status} - ${JSON.stringify(errorData)}`);
      
      return NextResponse.json(
        errorData,
        { status: backendResponse.status }
      );
    }

    const result = await backendResponse.json();
    console.log(`✅ Analysis completed successfully for ${repo_url}`);
    
    return NextResponse.json(result);

  } catch (error) {
    console.error('❌ Error in analyze-repo route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Block all other methods
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}

