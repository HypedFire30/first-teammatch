# Vercel Environment Variables Setup

## Why Teams Aren't Showing Up

The teams aren't showing up because Vercel doesn't have access to your `.env.local` file (it's gitignored for security). You need to manually add environment variables in the Vercel dashboard.

## Required Environment Variables

### 1. Database Connection (REQUIRED)
```
DATABASE_URL=postgresql://user:password@host:port/database
```
- Get this from your Railway PostgreSQL database
- Go to Railway → Your PostgreSQL service → "Connect" tab
- Copy the "Connection URL" (starts with `postgresql://`)

### 2. App Configuration (OPTIONAL - has defaults)
These control how your app appears. If you don't set them, the app uses these defaults:
```
NEXT_PUBLIC_APP_NAME=FIRST TeamMatch
NEXT_PUBLIC_STATE_NAME=Oregon
NEXT_PUBLIC_STATE_ABBREVIATION=OR
NEXT_PUBLIC_REGION_NAME=Oregon
NEXT_PUBLIC_ORG_NAME=FTC12808 RevAmped
NEXT_PUBLIC_ORG_LOCATION=Portland, Oregon
NEXT_PUBLIC_ORG_WEBSITE=https://revampedrobotics.org
NEXT_PUBLIC_ORG_EMAIL=revampedrobotics@gmail.com
NEXT_PUBLIC_CONTACT_EMAIL=revampedrobotics@gmail.com
NEXT_PUBLIC_APP_DESCRIPTION=A public directory where students can discover and connect with FIRST robotics teams in Oregon.
```

**You can skip these if you're happy with the defaults!**

### 3. Email Configuration (OPTIONAL - for password resets)
```
EMAIL_PROVIDER=resend
RESEND_API_KEY=re_xxxxxxxxxxxxx
EMAIL_FROM=noreply@yourdomain.com
NEXT_PUBLIC_APP_URL=https://your-vercel-url.vercel.app
```
- Only needed if you want password reset emails to work
- See `RESEND_SETUP.md` for details

## How to Add Environment Variables in Vercel

### Step 1: Go to Your Project Settings
1. Log in to [Vercel](https://vercel.com)
2. Click on your project (first-teammatch)
3. Go to **Settings** tab
4. Click **Environment Variables** in the left sidebar

### Step 2: Add Each Variable
1. Click **"Add New"** button
2. Enter the **Name** (e.g., `DATABASE_URL`)
3. Enter the **Value** (paste from your `.env.local` file)
4. Select **Environment(s)**:
   - ✅ **Production** (for live site)
   - ✅ **Preview** (for pull request previews)
   - ✅ **Development** (optional, for Vercel CLI)
5. Click **"Save"**
6. Repeat for each environment variable

### Step 3: Redeploy
After adding all variables:
1. Go to **Deployments** tab
2. Click the **"..."** menu on the latest deployment
3. Click **"Redeploy"**
   - OR
4. Push a new commit to trigger a new deployment

## Quick Checklist

Copy these from your `.env.local` file and add them to Vercel:

### CRITICAL (Required for app to work):
- [ ] `DATABASE_URL` ⚠️ **MOST IMPORTANT** - without this, teams won't load!
  - Your value: `postgresql://postgres:lVbxgljYqRZnwcYwAmurQRFMFlAsirLP@maglev.proxy.rlwy.net:14036/railway`

### App Configuration (OPTIONAL - skip if you want defaults):
- [ ] `NEXT_PUBLIC_APP_NAME` (default: "FIRST TeamMatch")
- [ ] `NEXT_PUBLIC_STATE_NAME` (default: "Oregon")
- [ ] `NEXT_PUBLIC_STATE_ABBREVIATION` (default: "OR")
- [ ] `NEXT_PUBLIC_REGION_NAME` (default: "Oregon")
- [ ] `NEXT_PUBLIC_ORG_NAME` (default: "FTC12808 RevAmped")
- [ ] `NEXT_PUBLIC_ORG_LOCATION` (default: "Portland, Oregon")
- [ ] `NEXT_PUBLIC_ORG_WEBSITE` (default: "https://revampedrobotics.org")
- [ ] `NEXT_PUBLIC_ORG_EMAIL` (default: "revampedrobotics@gmail.com")
- [ ] `NEXT_PUBLIC_CONTACT_EMAIL` (default: "revampedrobotics@gmail.com")
- [ ] `NEXT_PUBLIC_APP_DESCRIPTION` (default: "A public directory...")

**You can skip all of these - the app will use the defaults shown above!**

### Optional (for email functionality):
- [ ] `RESEND_API_KEY` (only if you want password reset emails)
- [ ] `EMAIL_FROM` (only if you want password reset emails)
- [ ] `EMAIL_PROVIDER` (default: "resend")
- [ ] `NEXT_PUBLIC_APP_URL` (set to your Vercel URL, e.g., `https://your-app.vercel.app`)

### ⚠️ DO NOT ADD (Old Firebase variables - not needed):
- ❌ `NEXT_PUBLIC_FIREBASE_*` (all Firebase variables)
- ❌ `FIREBASE_PRIVATE_KEY`
- ❌ `FIREBASE_CLIENT_EMAIL`

## Verify It's Working

After redeploying:
1. Visit your Vercel site
2. Go to `/browse` page
3. Teams should now appear!

If teams still don't show:
- Check Vercel deployment logs (Deployments → Click deployment → "Logs")
- Look for database connection errors
- Verify `DATABASE_URL` is correct (no extra spaces, correct format)

## Security Notes

- ✅ Environment variables in Vercel are encrypted and secure
- ✅ Never commit `.env.local` to GitHub (it's already gitignored)
- ✅ `NEXT_PUBLIC_*` variables are exposed to the browser (safe for public config)
- ✅ Variables without `NEXT_PUBLIC_` are server-only (keep secrets here)
