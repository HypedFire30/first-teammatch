/**
 * Server-side authentication utilities
 * Handles password hashing, session management, and token generation
 */

import { compare, hash } from 'bcryptjs';
import { randomBytes } from 'crypto';
import { query } from './db';

const BCRYPT_ROUNDS = 12;
const SESSION_TOKEN_LENGTH = 32;
const SESSION_DURATION_DAYS = 30;

export interface User {
  id: string;
  email: string;
  role: 'team' | 'admin';
  email_verified: boolean;
  created_at: Date;
}

export interface Team {
  id: string;
  team_name: string;
  email: string;
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
}

export async function hashPassword(password: string): Promise<string> {
  return hash(password, BCRYPT_ROUNDS);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return compare(password, hash);
}

export function generateToken(length: number = 32): string {
  return randomBytes(length).toString('hex');
}

/**
 * Create a new session for a user
 */
export async function createSession(
  userId: string,
  ipAddress?: string,
  userAgent?: string
): Promise<string> {
  const sessionToken = generateToken(SESSION_TOKEN_LENGTH);
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + SESSION_DURATION_DAYS);

  await query(
    `INSERT INTO sessions (user_id, session_token, expires_at, ip_address, user_agent)
     VALUES ($1, $2, $3, $4, $5)`,
    [userId, sessionToken, expiresAt, ipAddress || null, userAgent || null]
  );

  return sessionToken;
}

/**
 * Get session by token
 */
export async function getSession(sessionToken: string): Promise<{
  user: User;
  sessionId: string;
} | null> {
  const result = await query<{
    session_id: string;
    user_id: string;
    email: string;
    role: 'team' | 'admin';
    email_verified: boolean;
    created_at: Date;
  }>(
    `SELECT s.id as session_id, u.id as user_id, u.email, u.role, u.email_verified, u.created_at
     FROM sessions s
     JOIN users u ON s.user_id = u.id
     WHERE s.session_token = $1 AND s.expires_at > NOW()`,
    [sessionToken]
  );

  if (result.rows.length === 0) {
    return null;
  }

  const row = result.rows[0];
  return {
    user: {
      id: row.user_id,
      email: row.email,
      role: row.role,
      email_verified: row.email_verified,
      created_at: row.created_at,
    },
    sessionId: row.session_id,
  };
}

export async function deleteSession(sessionToken: string): Promise<void> {
  await query('DELETE FROM sessions WHERE session_token = $1', [sessionToken]);
}

export async function deleteAllUserSessions(userId: string): Promise<void> {
  await query('DELETE FROM sessions WHERE user_id = $1', [userId]);
}

export async function cleanupExpiredSessions(): Promise<void> {
  await query('DELETE FROM sessions WHERE expires_at < NOW()');
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const result = await query<{
    id: string;
    email: string;
    role: 'team' | 'admin';
    email_verified: boolean;
    created_at: Date;
  }>(
    `SELECT id, email, role, email_verified, created_at
     FROM users
     WHERE email = $1`,
    [email.toLowerCase().trim()]
  );

  if (result.rows.length === 0) {
    return null;
  }

  const row = result.rows[0];
  return {
    id: row.id,
    email: row.email,
    role: row.role,
    email_verified: row.email_verified,
    created_at: row.created_at,
  };
}

export async function getUserById(userId: string): Promise<User | null> {
  const result = await query<{
    id: string;
    email: string;
    role: 'team' | 'admin';
    email_verified: boolean;
    created_at: Date;
  }>(
    `SELECT id, email, role, email_verified, created_at
     FROM users
     WHERE id = $1`,
    [userId]
  );

  if (result.rows.length === 0) {
    return null;
  }

  const row = result.rows[0];
  return {
    id: row.id,
    email: row.email,
    role: row.role,
    email_verified: row.email_verified,
    created_at: row.created_at,
  };
}

/**
 * Get user with password hash (for login verification)
 */
export async function getUserWithPassword(email: string): Promise<{
  user: User;
  passwordHash: string | null;
} | null> {
  const result = await query<{
    id: string;
    email: string;
    role: 'team' | 'admin';
    email_verified: boolean;
    created_at: Date;
    password_hash: string | null;
  }>(
    `SELECT id, email, role, email_verified, created_at, password_hash
     FROM users
     WHERE email = $1`,
    [email.toLowerCase().trim()]
  );

  if (result.rows.length === 0) {
    return null;
  }

  const row = result.rows[0];
  return {
    user: {
      id: row.id,
      email: row.email,
      role: row.role,
      email_verified: row.email_verified,
      created_at: row.created_at,
    },
    passwordHash: row.password_hash,
  };
}

export async function createUser(
  email: string,
  passwordHash: string | null,
  role: 'team' | 'admin'
): Promise<User> {
  const result = await query<{
    id: string;
    email: string;
    role: 'team' | 'admin';
    email_verified: boolean;
    created_at: Date;
  }>(
    `INSERT INTO users (email, password_hash, role)
     VALUES ($1, $2, $3)
     RETURNING id, email, role, email_verified, created_at`,
    [email.toLowerCase().trim(), passwordHash, role]
  );

  const row = result.rows[0];
  return {
    id: row.id,
    email: row.email,
    role: row.role,
    email_verified: row.email_verified,
    created_at: row.created_at,
  };
}

export async function updateUserPassword(
  userId: string,
  newPasswordHash: string
): Promise<void> {
  await query(
    `UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2`,
    [newPasswordHash, userId]
  );
}
