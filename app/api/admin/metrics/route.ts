/**
 * GET /api/admin/metrics
 * Get overall platform metrics (admin only)
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

    // Get total teams
    const teamsResult = await query<{ count: string }>(
      'SELECT COUNT(*) as count FROM teams'
    );
    const totalTeams = parseInt(teamsResult.rows[0].count);

    // Get total contact views
    const viewsResult = await query<{ count: string }>(
      'SELECT COUNT(*) as count FROM contact_views'
    );
    const totalContactViews = parseInt(viewsResult.rows[0].count);

    // Get total users
    const usersResult = await query<{ count: string }>(
      'SELECT COUNT(*) as count FROM users WHERE role = $1',
      ['team']
    );
    const totalUsers = parseInt(usersResult.rows[0].count);

    // Get teams with most views
    const topTeamsResult = await query<{
      team_name: string;
      contact_views: number;
    }>(
      `SELECT team_name, contact_views
       FROM teams
       ORDER BY contact_views DESC
       LIMIT 10`
    );

    return NextResponse.json({
      metrics: {
        totalTeams,
        totalUsers,
        totalContactViews,
        topTeams: topTeamsResult.rows,
      },
    });
  } catch (error) {
    console.error('Get admin metrics error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
