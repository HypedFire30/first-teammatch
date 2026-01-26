# Environment Variables Cleanup

## Remove These Firebase Variables from `.env.local`

You can safely remove these lines from your `.env.local` file:

```bash
# Firebase Configuration (Web App)
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyCJaX1yJwn2uJ0u3K9xom28wFnBaO9kBM8
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=revampedapp.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=revampedapp
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=revampedapp.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=122324946480
NEXT_PUBLIC_FIREBASE_APP_ID=1:122324946480:web:4f6e0d74372bc86e49a7f5

# Firebase Admin (for server-side access)
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@revampedapp.iam.gserviceaccount.com
```

## Add These Email Variables to `.env.local`

Add these for email functionality (choose one provider):

### Option 1: Resend (Recommended - Easy Setup)
```bash
EMAIL_PROVIDER=resend
RESEND_API_KEY=re_xxxxxxxxxxxxx
EMAIL_FROM=noreply@yourdomain.com
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Option 2: SendGrid
```bash
EMAIL_PROVIDER=sendgrid
SENDGRID_API_KEY=SG.xxxxxxxxxxxxx
EMAIL_FROM=noreply@yourdomain.com
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Required Variables (Keep These)

```bash
# Database
DATABASE_URL=postgresql://postgres:password@host:port/database

# Environment
NODE_ENV=development

# Next.js Public Variables
NEXT_PUBLIC_APP_NAME=FIRST TeamMatch
NEXT_PUBLIC_STATE_NAME=Oregon
NEXT_PUBLIC_STATE_ABBREVIATION=OR
NEXT_PUBLIC_REGION_NAME=Oregon
NEXT_PUBLIC_ORG_NAME=FTC12808 RevAmped
NEXT_PUBLIC_ORG_LOCATION=Portland, Oregon
NEXT_PUBLIC_ORG_WEBSITE=https://revampedrobotics.org
NEXT_PUBLIC_ORG_EMAIL=revampedrobotics@gmail.com
NEXT_PUBLIC_CONTACT_EMAIL=revampedrobotics@gmail.com
NEXT_PUBLIC_APP_DESCRIPTION=Connecting passionate students with competitive FIRST robotics teams in Oregon.
```
