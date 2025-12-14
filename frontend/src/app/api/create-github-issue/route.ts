import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';

// CRITICAL: Force Node.js runtime (not Edge) to avoid Edge request quota
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Protected API route for creating GitHub issues
 * Requires authentication to prevent abuse
 */
export async function POST(req: NextRequest) {
  try {
    // CRITICAL: Check authentication first
    const session = await auth();
    
    if (!session || !session.user) {
      console.warn(`🚫 Unauthorized create-github-issue attempt from ${req.headers.get('x-forwarded-for') || 'unknown'}`);
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
    const { owner, repo, issueData } = body;

    if (!owner || !repo || !issueData) {
      return NextResponse.json(
        { error: 'owner, repo, and issueData are required' },
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

    console.log(`✅ Authenticated issue creation from user: ${session.user.email} for ${owner}/${repo}`);

    // Forward request to backend with authentication
    const backendResponse = await fetch(`${backendUrl}/api/create-github-issue`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': backendApiKey,
        'x-session-id': req.headers.get('x-session-id') || 'unknown',
        // Pass user's GitHub token
        'Authorization': `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify({ owner, repo, issueData }),
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
    console.log(`✅ Issue created successfully for ${owner}/${repo}`);
    
    return NextResponse.json(result);

  } catch (error) {
    console.error('❌ Error in create-github-issue route:', error);
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

