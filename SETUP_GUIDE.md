# Setup Guide - PostgreSQL Migration

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

This will install:
- `pg` - PostgreSQL client
- `bcryptjs` - Password hashing
- Type definitions for both

### 2. Set Up Railway PostgreSQL

1. Go to [Railway](https://railway.app) and create an account
2. Create a new project
3. Click "New" → "Database" → "PostgreSQL"
4. Once created, click on the PostgreSQL service
5. Go to the "Variables" tab
6. Copy the `DATABASE_URL` value

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
# Database (from Railway)
DATABASE_URL=postgresql://user:password@host:port/database

# Environment
NODE_ENV=development

# Your existing Next.js public variables
NEXT_PUBLIC_APP_NAME=FIRST TeamMatch
# ... (copy from env-template.txt)
```

### 4. Initialize Database

Run the schema SQL file on your Railway database:

**Option A: Using psql**
```bash
psql $DATABASE_URL -f database/schema.sql
```

**Option B: Using Railway CLI**
```bash
railway connect
# Then in psql:
\i database/schema.sql
```

**Option C: Using a GUI tool (TablePlus, pgAdmin, etc.)**
- Connect to your Railway database
- Copy contents of `database/schema.sql`
- Execute the SQL

### 5. Create Your First Admin User

You can create an admin user directly in the database:

```sql
-- First, generate a password hash (run in Node.js):
-- node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('your-password', 12).then(h => console.log(h))"

-- Then insert the admin user:
INSERT INTO users (email, password_hash, role, email_verified)
VALUES ('admin@example.com', '<paste-hash-here>', 'admin', true);
```

### 6. Test the Application

1. Start the dev server: `npm run dev`
2. Try registering a new team
3. Log in as that team
4. Log in as admin
5. Browse teams as a student (no login required)

## What Changed

### Removed
- Student registration and authentication
- Firebase Firestore database
- Firebase Authentication
- Student-related pages and components

### Added
- PostgreSQL database with custom schema
- Custom authentication with HTTP-only cookies
- Next.js API routes for all backend operations
- Team metrics tracking (contact views)
- Admin dashboard with team metrics
- Team detail pages (`/teams/[id]`)
- Team profile editing in dashboard

### Updated
- Browse page now uses `/api/teams`
- Login/signup use new auth API
- Dashboard shows team metrics and allows editing
- Admin page shows all teams with metrics

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new team
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user
- `POST /api/auth/password-reset/request` - Request password reset
- `POST /api/auth/password-reset/reset` - Reset password

### Teams
- `GET /api/teams` - Get all teams (public)
- `GET /api/teams/[id]` - Get team details (public)
- `PATCH /api/teams/[id]` - Update team (authenticated, owner only)
- `POST /api/teams/[id]/contact` - Track contact view (public)

### Admin
- `GET /api/admin/teams` - Get all teams with metrics (admin only)
- `GET /api/admin/metrics` - Get platform metrics (admin only)

## Database Schema

See `database/schema.sql` for the complete schema. Key tables:

- **users**: Authentication (teams and admins)
- **teams**: Team profiles
- **sessions**: HTTP-only cookie sessions
- **password_reset_tokens**: Password reset flow
- **contact_views**: Contact button click tracking

## Troubleshooting

**"Database connection error"**
- Check `DATABASE_URL` is set correctly
- Verify Railway database is running
- Check SSL settings (production requires SSL)

**"Table does not exist"**
- Run the schema SQL file
- Check you're connected to the right database

**"Unauthorized" errors**
- Make sure you're logged in
- Check session cookie is being set
- Verify user exists in database

**Teams not showing**
- Check teams have `email_verified = true` in users table
- Verify teams are in the database
- Check API route is working (`/api/teams`)

## Next Steps

1. Set up email service for password resets (optional)
2. Add rate limiting to API routes
3. Set up production environment variables
4. Deploy to production
5. Remove Firebase dependencies (optional cleanup)
