-- Migration: Add email to teams table and team_website column
-- This keeps email in sync with users table for easier querying

-- Add email column to teams table (will be synced with users.email)
ALTER TABLE teams ADD COLUMN IF NOT EXISTS email VARCHAR(255);

-- Add team_website column
ALTER TABLE teams ADD COLUMN IF NOT EXISTS team_website VARCHAR(255);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_teams_email ON teams(email);

-- Create trigger to sync email from users to teams when users.email is updated
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

-- Drop trigger if it exists, then create it
DROP TRIGGER IF EXISTS sync_team_email_trigger ON users;
CREATE TRIGGER sync_team_email_trigger
    AFTER UPDATE OF email ON users
    FOR EACH ROW
    WHEN (OLD.email IS DISTINCT FROM NEW.email)
    EXECUTE FUNCTION sync_team_email();

-- Also sync email when a new team is created (via INSERT trigger)
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

DROP TRIGGER IF EXISTS sync_team_email_on_insert_trigger ON users;
CREATE TRIGGER sync_team_email_on_insert_trigger
    AFTER INSERT ON users
    FOR EACH ROW
    WHEN (NEW.role = 'team')
    EXECUTE FUNCTION sync_team_email_on_insert();

-- Backfill existing teams with email from users table
UPDATE teams t
SET email = u.email
FROM users u
WHERE t.id = u.id AND t.email IS NULL;
