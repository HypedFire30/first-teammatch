/**
 * GET /api/teams/[id]
 * Get single team by ID (public)
 * 
 * PATCH /api/teams/[id]
 * Update team profile (authenticated, team owner only)
 */

import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { requireAuth } from '@/lib/middleware';
import { z } from 'zod';

const updateSchema = z.object({
    team_name: z.string().min(1).optional(),
    team_number: z.string().optional(),
    team_website: z.string().optional().nullable(),
    email: z.string().email().optional(), // Update both users and teams
    zip_code: z.string().min(5).optional(),
    first_level: z.string().optional(),
    areas_of_need: z.array(z.string()).optional(),
    grade_range_min: z.number().min(1).max(12).optional(),
    grade_range_max: z.number().min(1).max(12).optional(),
    time_commitment: z.number().min(1).max(30).optional(),
    qualities: z.array(z.string()).optional(),
    is_school_team: z.boolean().optional(),
    school_name: z.string().nullable().optional(),
    team_awards: z.string().nullable().optional(),
    phone_number: z.string().nullable().optional(),
});

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const result = await query<{
            id: string;
            team_name: string;
            team_number: string | null;
            team_website: string | null;
            zip_code: string;
            first_level: string;
            areas_of_need: string[];
            grade_range_min: number;
            grade_range_max: number;
            time_commitment: number;
            qualities: string[];
            is_school_team: boolean;
            school_name: string | null;
            team_awards: string | null;
            phone_number: string | null;
            contact_views: number;
            created_at: Date;
            email: string;
        }>(
            `SELECT 
        t.id,
        t.team_name,
        t.team_number,
        t.team_website,
        t.zip_code,
        t.first_level,
        t.areas_of_need,
        t.grade_range_min,
        t.grade_range_max,
        t.time_commitment,
        t.qualities,
        t.is_school_team,
        t.school_name,
        t.team_awards,
        t.phone_number,
        t.contact_views,
        t.created_at,
        COALESCE(t.email, u.email) as email
       FROM teams t
       JOIN users u ON t.id = u.id
       WHERE t.id = $1 AND u.email_verified = TRUE`,
            [params.id]
        );

        if (result.rows.length === 0) {
            return NextResponse.json(
                { error: 'Team not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ team: result.rows[0] });
    } catch (error) {
        console.error('Get team error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const authResult = await requireAuth(request);
        if (authResult instanceof NextResponse) {
            return authResult;
        }

        // Check if user owns this team or is admin
        if (authResult.user.id !== params.id && authResult.user.role !== 'admin') {
            return NextResponse.json(
                { error: 'Forbidden' },
                { status: 403 }
            );
        }

        const body = await request.json();
        const data = updateSchema.parse(body);

        // Validate grade range if both are provided
        if (data.grade_range_min !== undefined && data.grade_range_max !== undefined) {
            if (data.grade_range_min > data.grade_range_max) {
                return NextResponse.json(
                    { error: 'Invalid grade range' },
                    { status: 400 }
                );
            }
        }

        // Build update query dynamically
        const updates: string[] = [];
        const values: any[] = [];
        let paramIndex = 1;

        if (data.team_name !== undefined) {
            updates.push(`team_name = $${paramIndex++}`);
            values.push(data.team_name);
        }
        if (data.team_number !== undefined) {
            updates.push(`team_number = $${paramIndex++}`);
            values.push(data.team_number);
        }
        if (data.zip_code !== undefined) {
            updates.push(`zip_code = $${paramIndex++}`);
            values.push(data.zip_code);
        }
        if (data.first_level !== undefined) {
            updates.push(`first_level = $${paramIndex++}`);
            values.push(data.first_level);
        }
        if (data.areas_of_need !== undefined) {
            updates.push(`areas_of_need = $${paramIndex++}`);
            values.push(data.areas_of_need);
        }
        if (data.grade_range_min !== undefined) {
            updates.push(`grade_range_min = $${paramIndex++}`);
            values.push(data.grade_range_min);
        }
        if (data.grade_range_max !== undefined) {
            updates.push(`grade_range_max = $${paramIndex++}`);
            values.push(data.grade_range_max);
        }
        if (data.time_commitment !== undefined) {
            updates.push(`time_commitment = $${paramIndex++}`);
            values.push(data.time_commitment);
        }
        if (data.qualities !== undefined) {
            updates.push(`qualities = $${paramIndex++}`);
            values.push(data.qualities);
        }
        if (data.is_school_team !== undefined) {
            updates.push(`is_school_team = $${paramIndex++}`);
            values.push(data.is_school_team);
        }
        if (data.school_name !== undefined) {
            updates.push(`school_name = $${paramIndex++}`);
            values.push(data.school_name);
        }
        if (data.team_awards !== undefined) {
            updates.push(`team_awards = $${paramIndex++}`);
            values.push(data.team_awards);
        }
        if (data.phone_number !== undefined) {
            updates.push(`phone_number = $${paramIndex++}`);
            values.push(data.phone_number);
        }
        if (data.team_website !== undefined) {
            updates.push(`team_website = $${paramIndex++}`);
            values.push(data.team_website);
        }

        // Handle email update - sync with users table
        if (data.email !== undefined) {
            // Check if email is already taken by another user
            const existingUser = await query<{ id: string }>(
                `SELECT id FROM users WHERE email = $1 AND id != $2`,
                [data.email, params.id]
            );
            if (existingUser.rows.length > 0) {
                return NextResponse.json(
                    { error: 'Email already in use' },
                    { status: 400 }
                );
            }
            // Update users.email (trigger will sync to teams.email)
            await query(
                `UPDATE users SET email = $1, updated_at = NOW() WHERE id = $2`,
                [data.email, params.id]
            );
        }

        if (updates.length === 0 && data.email === undefined) {
            return NextResponse.json(
                { error: 'No fields to update' },
                { status: 400 }
            );
        }

        if (updates.length > 0) {
            updates.push(`updated_at = NOW()`);
            values.push(params.id);
            await query(
                `UPDATE teams SET ${updates.join(', ')} WHERE id = $${paramIndex}`,
                values
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: 'Invalid request data', details: error.errors },
                { status: 400 }
            );
        }

        console.error('Update team error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
