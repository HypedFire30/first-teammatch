/**
 * POST /api/auth/password-reset/request
 * Request password reset token
 */

import { NextRequest, NextResponse } from 'next/server';
import { getUserByEmail, generateToken } from '@/lib/auth-server';
import { query } from '@/lib/db';
import { z } from 'zod';

const requestSchema = z.object({
    email: z.string().email('Invalid email address'),
});

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email } = requestSchema.parse(body);

        // Get user
        const user = await getUserByEmail(email);

        // Always return success to prevent email enumeration
        // But only create token if user exists
        if (user) {
            const token = generateToken(32);
            const expiresAt = new Date();
            expiresAt.setHours(expiresAt.getHours() + 1); // 1 hour expiry

            await query(
                `INSERT INTO password_reset_tokens (user_id, token, expires_at)
         VALUES ($1, $2, $3)`,
                [user.id, token, expiresAt]
            );

            // Send email with reset link
            const { sendPasswordResetEmail } = await import('@/lib/email');
            const emailResult = await sendPasswordResetEmail(email, token);

            if (!emailResult.success) {
                console.error('Failed to send password reset email:', emailResult.error);
                // Still return success to prevent email enumeration
            }
        }

        return NextResponse.json({
            message: 'If an account exists, a password reset link has been sent.',
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: 'Invalid request data', details: error.errors },
                { status: 400 }
            );
        }

        console.error('Password reset request error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
