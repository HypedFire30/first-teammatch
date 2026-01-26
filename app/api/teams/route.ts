/**
 * GET /api/teams
 * Get all teams (public, for browse page)
 * 
 * POST /api/teams
 * Create new team (via signup, handled by /api/auth/signup)
 */

import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export interface Team {
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
}

export async function GET(request: NextRequest) {
    try {
        const result = await query<Team & { team_website: string | null }>(
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
        t.created_at
       FROM teams t
       JOIN users u ON t.id = u.id
       WHERE u.email_verified = TRUE
       ORDER BY t.team_name ASC`
        );

        return NextResponse.json({ teams: result.rows });
    } catch (error) {
        console.error('Get teams error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
