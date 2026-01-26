# Resend Email Setup Guide

## Step-by-Step Instructions

### Step 1: Create a Resend Account
1. Go to **https://resend.com**
2. Click **"Sign Up"** in the top right
3. Sign up with your email (or use GitHub/Google)
4. Verify your email address

### Step 2: Get Your API Key
1. Once logged in, you'll be taken to the dashboard
2. Click **"API Keys"** in the left sidebar
3. Click **"Create API Key"** button
4. Give it a name (e.g., "FIRST TeamMatch Production")
5. Select **"Sending access"** (default)
6. Click **"Add"**
7. **IMPORTANT**: Copy the API key immediately - it starts with `re_` and you won't be able to see it again!

### Step 3: Add Domain (Optional but Recommended)
For production, you should verify a domain. For testing, you can use Resend's test domain.

**For Testing (Quick Setup):**
- You can use Resend's test domain for now
- Emails will be sent but may go to spam
- Good for development/testing

**For Production (Recommended):**
1. In Resend dashboard, go to **"Domains"**
2. Click **"Add Domain"**
3. Enter your domain (e.g., `yourdomain.com`)
4. Follow the DNS setup instructions:
   - Add the provided DNS records to your domain's DNS settings
   - Wait for verification (usually a few minutes)
5. Once verified, you can send emails from `noreply@yourdomain.com`

### Step 4: Add Environment Variables
Open your `.env.local` file and add:

```bash
# Email Configuration
EMAIL_PROVIDER=resend
RESEND_API_KEY=re_xxxxxxxxxxxxx
EMAIL_FROM=noreply@yourdomain.com
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Important Notes:**
- Replace `re_xxxxxxxxxxxxx` with your actual API key from Step 2
- For `EMAIL_FROM`:
  - If you verified a domain: use `noreply@yourdomain.com`
  - For testing: use `onboarding@resend.dev` (Resend's test domain)
- For `NEXT_PUBLIC_APP_URL`:
  - Development: `http://localhost:3000`
  - Production: `https://yourdomain.com`

### Step 5: Test Email Sending
1. Restart your Next.js dev server:
   ```bash
   # Stop the server (Ctrl+C) and restart
   npm run dev
   ```

2. Test password reset:
   - Go to `/login`
   - Click "Forgot Password?"
   - Enter your email
   - Check your inbox (and spam folder)

### Step 6: Verify It's Working
- Check the Resend dashboard → **"Logs"** to see if emails were sent
- Check your email inbox (and spam folder)
- If emails aren't arriving:
  - Check Resend dashboard for errors
  - Verify API key is correct
  - Make sure `EMAIL_FROM` matches a verified domain (or use test domain)

## Troubleshooting

### "RESEND_API_KEY not configured"
- Make sure the variable is in `.env.local` (not `.env`)
- Restart your dev server after adding the variable
- Check for typos in the variable name

### "Failed to send email"
- Check Resend dashboard → Logs for error details
- Verify your API key is correct
- Make sure `EMAIL_FROM` is valid

### Emails going to spam
- Verify your domain in Resend
- Set up SPF and DKIM records (Resend provides these)
- Use a proper domain (not test domain) for production

## Free Tier Limits
- **100 emails/day** on the free tier
- Perfect for development and small deployments
- Upgrade if you need more

## Next Steps
Once Resend is set up, password reset emails will automatically work! Users can:
1. Click "Forgot Password?" on the login page
2. Enter their email
3. Receive a reset link via email
4. Click the link to reset their password
