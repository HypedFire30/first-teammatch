/**
 * Next.js API route middleware utilities
 * Handles authentication, rate limiting, and request validation
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSession } from './auth-server';

const SESSION_COOKIE_NAME = 'session_token';

export function getSessionToken(request: NextRequest): string | null {
  return request.cookies.get(SESSION_COOKIE_NAME)?.value || null;
}

export function setSessionCookie(
  response: NextResponse,
  sessionToken: string
): void {
  const maxAge = 30 * 24 * 60 * 60; // 30 days in seconds
  response.cookies.set(SESSION_COOKIE_NAME, sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge,
    path: '/',
  });
}

export function clearSessionCookie(response: NextResponse): void {
  response.cookies.delete(SESSION_COOKIE_NAME);
}

/**
 * Get authenticated user from request
 * Returns null if not authenticated
 */
export async function getAuthenticatedUser(request: NextRequest): Promise<{
  user: {
    id: string;
    email: string;
    role: 'team' | 'admin';
    email_verified: boolean;
  };
  sessionId: string;
} | null> {
  const sessionToken = getSessionToken(request);
  if (!sessionToken) {
    return null;
  }

  const session = await getSession(sessionToken);
  return session;
}

/**
 * Require authentication middleware
 * Returns 401 if not authenticated
 */
export async function requireAuth(request: NextRequest): Promise<{
  user: {
    id: string;
    email: string;
    role: 'team' | 'admin';
    email_verified: boolean;
  };
  sessionId: string;
} | NextResponse> {
  const session = await getAuthenticatedUser(request);
  if (!session) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  return session;
}

/**
 * Require admin role middleware
 * Returns 403 if not admin
 */
export async function requireAdmin(request: NextRequest): Promise<{
  user: {
    id: string;
    email: string;
    role: 'team' | 'admin';
    email_verified: boolean;
  };
  sessionId: string;
} | NextResponse> {
  const authResult = await requireAuth(request);
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  if (authResult.user.role !== 'admin') {
    return NextResponse.json(
      { error: 'Forbidden - Admin access required' },
      { status: 403 }
    );
  }

  return authResult;
}

/**
 * Get client IP address from request
 */
export function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return request.headers.get('x-real-ip') || 'unknown';
}

/**
 * Get user agent from request
 */
export function getUserAgent(request: NextRequest): string {
  return request.headers.get('user-agent') || 'unknown';
}
