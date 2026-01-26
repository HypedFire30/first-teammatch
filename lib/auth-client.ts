/**
 * Client-side authentication utilities
 * Handles API calls for authentication
 */

export interface User {
    id: string;
    email: string;
    role: 'team' | 'admin';
    email_verified: boolean;
}

export interface AuthError {
    message: string;
    details?: any;
}

/**
 * Sign up a new team
 */
export async function signUp(
    email: string,
    password: string,
    teamData: {
        teamName: string;
        teamNumber: string;
        teamWebsite?: string | null;
        zipCode: string;
        firstLevel: string;
        areasOfNeed: string[];
        gradeRangeMin: number;
        gradeRangeMax: number;
        timeCommitment: number;
        qualities: string[];
        isSchoolTeam: boolean;
        schoolName?: string | null;
        teamAwards?: string | null;
        phoneNumber?: string | null;
    }
): Promise<{ user: User | null; error: AuthError | null }> {
    try {
        const response = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email,
                password,
                ...teamData,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            return {
                user: null,
                error: { message: data.error || 'Signup failed', details: data.details },
            };
        }

        return { user: data.user, error: null };
    } catch (error: any) {
        return {
            user: null,
            error: { message: error.message || 'Network error' },
        };
    }
}

/**
 * Sign in existing user
 */
export async function signIn(
    email: string,
    password: string
): Promise<{ user: User | null; error: AuthError | null }> {
    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
            return {
                user: null,
                error: { message: data.error || 'Login failed' },
            };
        }

        return { user: data.user, error: null };
    } catch (error: any) {
        return {
            user: null,
            error: { message: error.message || 'Network error' },
        };
    }
}

/**
 * Sign out current user
 */
export async function signOut(): Promise<{ error: AuthError | null }> {
    try {
        const response = await fetch('/api/auth/logout', {
            method: 'POST',
        });

        if (!response.ok) {
            const data = await response.json();
            return { error: { message: data.error || 'Logout failed' } };
        }

        return { error: null };
    } catch (error: any) {
        return { error: { message: error.message || 'Network error' } };
    }
}

/**
 * Get current authenticated user
 */
export async function getCurrentUser(): Promise<{
    user: User | null;
    error: AuthError | null;
}> {
    try {
        const response = await fetch('/api/auth/me');

        if (!response.ok) {
            return { user: null, error: null }; // Not authenticated, not an error
        }

        const data = await response.json();
        return { user: data.user, error: null };
    } catch (error: any) {
        return { user: null, error: { message: error.message || 'Network error' } };
    }
}

/**
 * Request password reset
 */
export async function requestPasswordReset(
    email: string
): Promise<{ error: AuthError | null }> {
    try {
        const response = await fetch('/api/auth/password-reset/request', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        });

        const data = await response.json();

        if (!response.ok) {
            return { error: { message: data.error || 'Request failed' } };
        }

        return { error: null };
    } catch (error: any) {
        return { error: { message: error.message || 'Network error' } };
    }
}

/**
 * Reset password with token
 */
export async function resetPassword(
    token: string,
    newPassword: string
): Promise<{ error: AuthError | null }> {
    try {
        const response = await fetch('/api/auth/password-reset/reset', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token, password: newPassword }),
        });

        const data = await response.json();

        if (!response.ok) {
            return {
                error: {
                    message: data.error || 'Password reset failed',
                    details: data.details,
                },
            };
        }

        return { error: null };
    } catch (error: any) {
        return { error: { message: error.message || 'Network error' } };
    }
}
