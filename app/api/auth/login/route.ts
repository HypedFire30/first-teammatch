/**
 * POST /api/auth/login
 * Authenticate user and create session
 */

import { NextRequest, NextResponse } from 'next/server';
import { getUserWithPassword, createSession } from '@/lib/auth-server';
import { verifyPassword } from '@/lib/auth-server';
import { setSessionCookie, getClientIp, getUserAgent } from '@/lib/middleware';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = loginSchema.parse(body);

    // Get user with password hash
    const userData = await getUserWithPassword(email);
    if (!userData) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Check if password is set
    if (!userData.passwordHash) {
      return NextResponse.json(
        { error: 'Password not set. Please use password reset.' },
        { status: 401 }
      );
    }

    // Verify password
    const isValid = await verifyPassword(password, userData.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Create session
    const ipAddress = getClientIp(request);
    const userAgent = getUserAgent(request);
    const sessionToken = await createSession(
      userData.user.id,
      ipAddress,
      userAgent
    );

    // Set session cookie
    const response = NextResponse.json({
      user: {
        id: userData.user.id,
        email: userData.user.email,
        role: userData.user.role,
        email_verified: userData.user.email_verified,
      },
    });

    setSessionCookie(response, sessionToken);

    return response;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
