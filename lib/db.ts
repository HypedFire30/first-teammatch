/**
 * Database connection and query utilities
 * Uses PostgreSQL with Neon (serverless driver)
 */

import { Pool, QueryResult, QueryResultRow } from '@neondatabase/serverless';

// Create connection pool
// Neon always requires SSL; the serverless driver handles this automatically
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 10, // Lower than pg default — Neon's pooler handles connection reuse
});

// Test connection on startup
pool.on('connect', () => {
    console.log('Database connection established');
});

pool.on('error', (err) => {
    console.error('Unexpected database error:', err);
});

/**
 * Execute a query with parameters
 * Prevents SQL injection by using parameterized queries
 */
export async function query<T extends QueryResultRow = any>(
    text: string,
    params?: any[]
): Promise<QueryResult<T>> {
    const start = Date.now();
    try {
        const result = await pool.query<T>(text, params);
        const duration = Date.now() - start;
        console.log('Executed query', { text, duration, rows: result.rowCount });
        return result;
    } catch (error) {
        console.error('Database query error:', error);
        throw error;
    }
}

/**
 * Execute a transaction
 * Automatically rolls back on error
 */
export async function transaction<T>(
    callback: (client: any) => Promise<T>
): Promise<T> {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const result = await callback({
            query: async (text: string, params?: any[]) => {
                return client.query(text, params);
            },
        });
        await client.query('COMMIT');
        return result;
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
}

/**
 * Get a client from the pool for manual transaction management
 */
export function getClient() {
    return pool.connect();
}

/**
 * Close all database connections
 * Useful for cleanup in tests or shutdown
 */
export async function closePool() {
    await pool.end();
}

export default pool;
