/**
 * POST /api/auth/signup
 * Create new team account
 */

import { NextRequest, NextResponse } from 'next/server';
import { createUser, hashPassword, createSession } from '@/lib/auth-server';
import { getUserByEmail } from '@/lib/auth-server';
import { query } from '@/lib/db';
import { setSessionCookie, getClientIp, getUserAgent } from '@/lib/middleware';
import { z } from 'zod';

const signupSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/\d/, 'Password must contain at least one number'),
    teamName: z.string().min(1, 'Team name is required'),
    teamNumber: z.string().min(1, 'Team number is required'),
    teamWebsite: z.string().optional().nullable(),
    zipCode: z.string().min(5, 'Invalid zip code'),
    firstLevel: z.string().min(1, 'FIRST level is required'),
    areasOfNeed: z.array(z.string()).default([]),
    gradeRangeMin: z.number().min(1).max(12),
    gradeRangeMax: z.number().min(1).max(12),
    timeCommitment: z.number().min(1).max(30),
    qualities: z.array(z.string()).default([]),
    isSchoolTeam: z.boolean().default(false),
    schoolName: z.string().optional().nullable(),
    teamAwards: z.string().optional().nullable(),
    phoneNumber: z.string().optional().nullable(),
});

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const data = signupSchema.parse(body);

        // Validate grade range
        if (data.gradeRangeMin > data.gradeRangeMax) {
            return NextResponse.json(
                { error: 'Invalid grade range' },
                { status: 400 }
            );
        }

        // Check if email already exists
        const existingUser = await getUserByEmail(data.email);
        if (existingUser) {
            return NextResponse.json(
                { error: 'Email already registered' },
                { status: 400 }
            );
        }

        // Hash password
        const passwordHash = await hashPassword(data.password);

        // Create user and team in a transaction
        const user = await createUser(data.email, passwordHash, 'team');

        // Create team profile
        await query(
            `INSERT INTO teams (
        id, team_name, team_number, team_website, email, zip_code, first_level, areas_of_need,
        grade_range_min, grade_range_max, time_commitment, qualities,
        is_school_team, school_name, team_awards, phone_number
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)`,
            [
                user.id,
                data.teamName,
                data.teamNumber,
                data.teamWebsite || null,
                user.email, // Sync email from user
                data.zipCode,
                data.firstLevel,
                data.areasOfNeed,
                data.gradeRangeMin,
                data.gradeRangeMax,
                data.timeCommitment,
                data.qualities,
                data.isSchoolTeam,
                data.schoolName || null,
                data.teamAwards || null,
                data.phoneNumber || null,
            ]
        );

        // Create session
        const ipAddress = getClientIp(request);
        const userAgent = getUserAgent(request);
        const sessionToken = await createSession(user.id, ipAddress, userAgent);

        // Set session cookie
        const response = NextResponse.json({
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                email_verified: user.email_verified,
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

        console.error('Signup error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
