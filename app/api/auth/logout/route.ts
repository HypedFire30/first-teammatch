/**
 * POST /api/auth/logout
 * Destroy session and clear cookie
 */

import { NextRequest, NextResponse } from 'next/server';
import { deleteSession } from '@/lib/auth-server';
import { getSessionToken, clearSessionCookie } from '@/lib/middleware';

export async function POST(request: NextRequest) {
  try {
    const sessionToken = getSessionToken(request);
    
    if (sessionToken) {
      await deleteSession(sessionToken);
    }

    const response = NextResponse.json({ success: true });
    clearSessionCookie(response);

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
