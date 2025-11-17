# Migration Script

## Migrate Supabase Data to Firebase

If you have existing data in Supabase that needs to be migrated to Firebase:

### Prerequisites

1. Add Supabase credentials to `.env.local`:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

2. Ensure Firebase Admin credentials are in `.env.local` (already done)

### Run Migration

```bash
npm run migrate:firebase
```

This will migrate:

- ✅ All students
- ✅ All teams
- ✅ All admins

**Note:** Auth users need to be migrated separately or use password reset flow.
