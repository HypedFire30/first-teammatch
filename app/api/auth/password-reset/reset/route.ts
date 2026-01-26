/**
 * POST /api/auth/password-reset/reset
 * Reset password using token
 */

import { NextRequest, NextResponse } from 'next/server';
import { hashPassword, updateUserPassword, deleteAllUserSessions } from '@/lib/auth-server';
import { query } from '@/lib/db';
import { z } from 'zod';

const resetSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/\d/, 'Password must contain at least one number'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, password } = resetSchema.parse(body);

    // Find valid token
    const tokenResult = await query<{
      user_id: string;
      used: boolean;
    }>(
      `SELECT user_id, used
       FROM password_reset_tokens
       WHERE token = $1 AND expires_at > NOW() AND used = FALSE
       LIMIT 1`,
      [token]
    );

    if (tokenResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 400 }
      );
    }

    const { user_id } = tokenResult.rows[0];

    // Hash new password
    const passwordHash = await hashPassword(password);

    // Update password and mark token as used
    await query('BEGIN');
    try {
      await updateUserPassword(user_id, passwordHash);
      
      // Mark token as used
      await query(
        `UPDATE password_reset_tokens SET used = TRUE WHERE token = $1`,
        [token]
      );

      // Invalidate all existing sessions (force re-login)
      await deleteAllUserSessions(user_id);

      await query('COMMIT');
    } catch (error) {
      await query('ROLLBACK');
      throw error;
    }

    return NextResponse.json({
      message: 'Password reset successfully',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Password reset error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
