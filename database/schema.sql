-- FIRST TeamMatch Database Schema
-- PostgreSQL database for team registration and student browsing

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (for authentication)
-- Supports both teams and admins
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255), -- NULL for invite-only accounts
    role VARCHAR(20) NOT NULL CHECK (role IN ('team', 'admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    email_verified BOOLEAN DEFAULT FALSE,
    email_verification_token VARCHAR(255),
    email_verification_expires_at TIMESTAMP WITH TIME ZONE
);

-- Teams table (team profile information)
CREATE TABLE teams (
    id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    team_name VARCHAR(255) NOT NULL,
    team_number VARCHAR(20),
    team_website VARCHAR(255),
    email VARCHAR(255), -- Synced with users.email for easier querying
    zip_code VARCHAR(10) NOT NULL,
    first_level VARCHAR(50) NOT NULL,
    areas_of_need TEXT[] DEFAULT '{}',
    grade_range_min INTEGER NOT NULL CHECK (grade_range_min >= 1 AND grade_range_min <= 12),
    grade_range_max INTEGER NOT NULL CHECK (grade_range_max >= 1 AND grade_range_max <= 12),
    time_commitment INTEGER NOT NULL CHECK (time_commitment >= 1 AND time_commitment <= 30),
    qualities TEXT[] DEFAULT '{}',
    is_school_team BOOLEAN DEFAULT FALSE,
    school_name VARCHAR(255),
    team_awards TEXT,
    phone_number VARCHAR(20),
    contact_views INTEGER DEFAULT 0, -- Count of contact button clicks
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT grade_range_valid CHECK (grade_range_min <= grade_range_max)
);

-- Sessions table (for HTTP-only cookie authentication)
CREATE TABLE sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ip_address VARCHAR(45), -- IPv6 compatible
    user_agent TEXT
);

-- Password reset tokens
CREATE TABLE password_reset_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contact views tracking (for metrics)
CREATE TABLE contact_views (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ip_address VARCHAR(45),
    user_agent TEXT
);

-- Indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_sessions_token ON sessions(session_token);
CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_expires_at ON sessions(expires_at);
CREATE INDEX idx_teams_zip_code ON teams(zip_code);
CREATE INDEX idx_teams_first_level ON teams(first_level);
CREATE INDEX idx_teams_email ON teams(email);
CREATE INDEX idx_contact_views_team_id ON contact_views(team_id);
CREATE INDEX idx_contact_views_viewed_at ON contact_views(viewed_at);
CREATE INDEX idx_password_reset_tokens_token ON password_reset_tokens(token);
CREATE INDEX idx_password_reset_tokens_user_id ON password_reset_tokens(user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers to auto-update updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_teams_updated_at BEFORE UPDATE ON teams
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to sync email from users to teams when users.email is updated
CREATE OR REPLACE FUNCTION sync_team_email()
RETURNS TRIGGER AS $$
BEGIN
    -- Update teams.email when users.email changes
    UPDATE teams
    SET email = NEW.email, updated_at = NOW()
    WHERE id = NEW.id;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to sync email from users to teams
CREATE TRIGGER sync_team_email_trigger
    AFTER UPDATE OF email ON users
    FOR EACH ROW
    WHEN (OLD.email IS DISTINCT FROM NEW.email)
    EXECUTE FUNCTION sync_team_email();

-- Function to sync email when a new team is created
CREATE OR REPLACE FUNCTION sync_team_email_on_insert()
RETURNS TRIGGER AS $$
BEGIN
    -- When a new user with role 'team' is created, ensure teams.email is set
    IF NEW.role = 'team' THEN
        UPDATE teams
        SET email = NEW.email
        WHERE id = NEW.id;
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to sync email on team creation
CREATE TRIGGER sync_team_email_on_insert_trigger
    AFTER INSERT ON users
    FOR EACH ROW
    WHEN (NEW.role = 'team')
    EXECUTE FUNCTION sync_team_email_on_insert();
