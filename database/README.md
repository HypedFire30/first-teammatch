# Database Setup Guide

## Overview

This application uses PostgreSQL hosted on Railway for data storage. The database schema includes tables for users, teams, sessions, password resets, and contact view tracking.

## Initial Setup

### 1. Create Railway PostgreSQL Database

1. Go to [Railway](https://railway.app)
2. Create a new project
3. Add a PostgreSQL service
4. Copy the `DATABASE_URL` connection string from the service settings

### 2. Set Environment Variable

Add the `DATABASE_URL` to your `.env.local` file:

```bash
DATABASE_URL=postgresql://user:password@host:port/database
```

### 3. Run Schema

You can run the schema in one of two ways:

**Option A: Using psql (recommended)**
```bash
psql $DATABASE_URL -f database/schema.sql
```

**Option B: Using a database client**
- Connect to your Railway database using TablePlus, pgAdmin, or similar
- Copy and paste the contents of `database/schema.sql`
- Execute the SQL

### 4. Verify Setup

Check that all tables were created:
```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

You should see:
- `users`
- `teams`
- `sessions`
- `password_reset_tokens`
- `contact_views`

## Creating Admin Users

After setting up the database, create admin users:

```sql
-- Create admin user (replace with actual email and password hash)
-- First, create the user
INSERT INTO users (email, password_hash, role, email_verified)
VALUES ('admin@example.com', '<bcrypt_hash>', 'admin', true)
RETURNING id;

-- The user is now an admin and can log in
```

To generate a password hash, you can use the Node.js script:
```bash
node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('your-password', 12).then(h => console.log(h))"
```

Or use the admin management script (once implemented):
```bash
npm run manage:admins -- add admin@example.com
```

## Database Schema

### Tables

- **users**: Authentication and user accounts (teams and admins)
- **teams**: Team profile information
- **sessions**: HTTP-only session tokens for authentication
- **password_reset_tokens**: One-time tokens for password resets
- **contact_views**: Tracking of contact button clicks for metrics

### Key Features

- UUIDs as primary keys
- Automatic `updated_at` timestamps via triggers
- Foreign key constraints for data integrity
- Indexes for performance
- Email verification support (currently auto-verified for simplicity)

## Migration Notes

This is a fresh start - no data migration from Firebase is included. You'll need to manually add any existing team data.

## Troubleshooting

**Connection errors:**
- Verify `DATABASE_URL` is set correctly
- Check Railway service is running
- Ensure SSL is configured for production

**Schema errors:**
- Make sure you're running the schema on a fresh database
- Check for existing tables that might conflict
