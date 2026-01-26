/**
 * GET /api/admin/teams
 * Get all teams with metrics (admin only)
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/middleware';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAdmin(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const result = await query<{
      id: string;
      team_name: string;
      email: string;
      zip_code: string;
      first_level: string;
      contact_views: number;
      created_at: Date;
      last_contact_view: Date | null;
    }>(
      `SELECT 
        t.id,
        t.team_name,
        u.email,
        t.zip_code,
        t.first_level,
        t.contact_views,
        t.created_at,
        MAX(cv.viewed_at) as last_contact_view
       FROM teams t
       JOIN users u ON t.id = u.id
       LEFT JOIN contact_views cv ON t.id = cv.team_id
       GROUP BY t.id, t.team_name, u.email, t.zip_code, t.first_level, t.contact_views, t.created_at
       ORDER BY t.contact_views DESC, t.created_at DESC`
    );

    return NextResponse.json({ teams: result.rows });
  } catch (error) {
    console.error('Get admin teams error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
