/**
 * POST /api/teams/[id]/contact
 * Track contact button click (before CAPTCHA)
 * Increments contact_views counter
 */

import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getClientIp, getUserAgent } from '@/lib/middleware';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const teamId = params.id;

    // Verify team exists
    const teamCheck = await query(
      'SELECT id FROM teams WHERE id = $1',
      [teamId]
    );

    if (teamCheck.rows.length === 0) {
      return NextResponse.json(
        { error: 'Team not found' },
        { status: 404 }
      );
    }

    // Increment contact_views counter
    await query(
      `UPDATE teams SET contact_views = contact_views + 1 WHERE id = $1`,
      [teamId]
    );

    // Log the contact view for metrics
    const ipAddress = getClientIp(request);
    const userAgent = getUserAgent(request);
    await query(
      `INSERT INTO contact_views (team_id, ip_address, user_agent)
       VALUES ($1, $2, $3)`,
      [teamId, ipAddress, userAgent]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Track contact view error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
