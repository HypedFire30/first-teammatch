# FIRST TeamMatch

A modern, franchisable platform for matching students with FIRST Robotics teams. Built by FTC12808 RevAmped to strengthen the FIRST community, this app can be easily deployed for any state or region.

## 🌟 Overview

FIRST TeamMatch is designed to be **franchisable** - meaning any FIRST team or organization can set up their own instance for their state or region. Each instance has its own database, configuration, and branding, allowing teams to manage their own matching platform independently.

### Key Features

- **Student Registration**: Multi-step form with profile creation, skills tracking, and resume upload
- **Team Registration**: Comprehensive team profiles with needs, requirements, and preferences
- **Smart Matching**: Algorithm-based matching between students and teams
- **Admin Dashboard**: Full management interface for viewing and managing registrations
- **State-Specific Configuration**: Easy customization for your state/region
- **Self-Hosted**: Deploy anywhere - Vercel, AWS, your own server, etc.

## 🚀 Complete Setup Instructions

### Prerequisites

- Node.js 18+ and npm
- A Firebase account (free tier works)
- A GitHub account (for cloning the repository)
- Basic knowledge of command line and web development

### Step 1: Clone and Install

```bash
git clone https://github.com/your-org/first-teammatch.git
cd first-teammatch
npm install
```

### Step 2: Configure Your Instance

1. Copy the environment template:
   ```bash
   cp env-template.txt .env.local
   ```

2. Open `.env.local` and customize the application configuration:

   ```env
   # State/Region Information
   NEXT_PUBLIC_STATE_NAME=YourState
   NEXT_PUBLIC_STATE_ABBREVIATION=XX
   NEXT_PUBLIC_REGION_NAME=YourState

   # Organization Information
   NEXT_PUBLIC_ORG_NAME=Your Team Name
   NEXT_PUBLIC_ORG_LOCATION=City, State
   NEXT_PUBLIC_ORG_WEBSITE=https://your-team-website.org
   NEXT_PUBLIC_ORG_EMAIL=your-email@example.com

   # Contact Information
   NEXT_PUBLIC_CONTACT_EMAIL=your-email@example.com

   # App Branding
   NEXT_PUBLIC_APP_NAME=FIRST TeamMatch YourState
   NEXT_PUBLIC_APP_DESCRIPTION=Connecting passionate students with competitive FIRST robotics teams in YourState.
   ```

### Step 3: Set Up Firebase

#### Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" and enter a project name (e.g., "first-teammatch-california")
3. Follow the setup wizard (Google Analytics is optional)

#### Enable Authentication

1. Go to **Authentication** → **Get started**
2. Click **Sign-in method** tab
3. Enable **Email/Password** provider
4. Click **Save**

#### Create Firestore Database

1. Go to **Firestore Database** → **Create database**
2. Choose **Start in production mode**
3. Select a location closest to your users
4. Click **Enable**
5. Go to **Rules** tab, replace with rules from `firestore.rules` in this repository, click **Publish**

#### Set Up Firebase Storage

1. Go to **Storage** → **Get started**
2. Choose **Start in production mode**
3. Use the same location as your Firestore database
4. Click **Done**
5. Go to **Rules** tab, replace with rules from `storage.rules` in this repository, click **Publish**

#### Get Firebase Configuration

1. Go to **Project Settings** (gear icon) → **Your apps**
2. Click the **Web** icon (`</>`) to add a web app
3. Register your app (nickname is optional)
4. Copy the Firebase configuration values and add to `.env.local`:

   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key-here
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
   NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
   ```

#### Firebase Admin SDK (Optional, for scripts)

If you plan to use admin scripts:

1. Go to **Project Settings** → **Service accounts**
2. Click **Generate new private key** and download the JSON file
3. Extract `private_key` and `client_email` values
4. Add to `.env.local`:

   ```env
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
   FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com
   ```

   **Note**: The private key should be on a single line with `\n` for newlines.

### Step 4: Test Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. You should see your customized homepage.

### Step 5: Create Your First Admin Account

1. Register a new account through the app (use "I'm a Student" or "I'm a Team" button)
2. Use the admin management script to promote them to admin:
   ```bash
   npm run manage:admins -- add your-email@example.com
   ```
   
   Or manually in Firebase Console:
   - Go to Firestore Database
   - Create a document in the `admins` collection
   - Document ID: the user's UID (found in Authentication → Users)
   - Add field: `email` (string) = the user's email

### Step 6: Deploy Your Instance

#### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com) and sign in with GitHub
3. Click "Add New Project" and import your repository
4. Add **ALL** environment variables from your `.env.local` file (both `NEXT_PUBLIC_*` config variables and Firebase variables)
5. Click "Deploy"

#### Deploy to Other Platforms

The app can be deployed to any platform that supports Next.js:
- **AWS Amplify**: Connect GitHub repo and add environment variables
- **Netlify**: Connect GitHub repo and add environment variables
- **Railway**: Connect GitHub repo and add environment variables
- **Your own server**: Build with `npm run build` and run with `npm start`

For any deployment, ensure all environment variables are set, Node.js 18+ is available, and the build completes successfully.

## 📋 Configuration Reference

### Required Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_STATE_NAME` | Full name of your state | `California` |
| `NEXT_PUBLIC_STATE_ABBREVIATION` | Two-letter state code | `CA` |
| `NEXT_PUBLIC_REGION_NAME` | Region name (can be same as state) | `California` |
| `NEXT_PUBLIC_ORG_NAME` | Your team/organization name | `FTC12345 YourTeam` |
| `NEXT_PUBLIC_ORG_LOCATION` | Your organization's location | `San Francisco, California` |
| `NEXT_PUBLIC_ORG_WEBSITE` | Your organization's website | `https://yourteam.org` |
| `NEXT_PUBLIC_ORG_EMAIL` | Your organization's email | `contact@yourteam.org` |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Contact email for bug reports | `contact@yourteam.org` |
| `NEXT_PUBLIC_APP_NAME` | Full app name | `FIRST TeamMatch California` |
| `NEXT_PUBLIC_APP_DESCRIPTION` | App description | `Connecting students with teams in California.` |

### Optional Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_SUPPORT_EMAIL` | Separate support email | `support@yourteam.org` |
| `NEXT_PUBLIC_DEPLOYMENT_URL` | Your deployment URL | `https://teammatch.yourstate.org` |

## 🛠️ Admin Management

### Creating Admins

Use the admin management script:

```bash
# Add an admin
npm run manage:admins -- add user@example.com

# Remove an admin
npm run manage:admins -- remove user@example.com

# List all admins
npm run manage:admins -- list
```

Or manually in Firebase Console:
1. Go to Firestore Database
2. Create/edit document in `admins` collection
3. Document ID = user's UID (from Authentication)
4. Add `email` field with user's email

### Data Migration (Optional)

If you have existing data in Supabase to migrate:

1. Add Supabase credentials to `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

2. Run migration:
   ```bash
   npm run migrate:firebase
   ```

This migrates all students, teams, and admins. Auth users need to be migrated separately or use password reset flow.

## 🔒 Security Checklist

Before going live, ensure:

- [ ] Firestore security rules are published
- [ ] Storage security rules are published
- [ ] Admin accounts are properly set up
- [ ] Environment variables are set in production (not just `.env.local`)
- [ ] Firebase Authentication is enabled
- [ ] You've tested the registration flow
- [ ] You've tested the admin dashboard

## 📝 Project Structure

```
first-teammatch/
├── app/                          # Next.js app directory
│   ├── admin/                    # Admin dashboard
│   ├── dashboard/                # User dashboard
│   ├── login/                    # Authentication
│   ├── student-registration/     # Student signup
│   └── team-registration/        # Team signup
├── components/                   # React components
│   ├── ui/                       # Reusable UI components
│   └── navigation-header.tsx     # Global navigation
├── lib/                          # Core libraries
│   ├── config.ts                 # App configuration
│   ├── firebase.ts               # Firebase setup
│   ├── auth.ts                   # Authentication
│   └── utils.ts                  # Utilities
├── scripts/                      # Utility scripts
│   ├── manage-admins.ts          # Admin management
│   └── migrate-to-firebase.ts    # Data migration
├── firestore.rules               # Firestore security rules
├── storage.rules                 # Storage security rules
└── env-template.txt              # Environment variable template
```

## 🏗️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **Storage**: Firebase Storage
- **UI**: Tailwind CSS, Shadcn UI, Radix UI
- **Forms**: React Hook Form, Zod
- **Language**: TypeScript

## 🎨 Customization

The app uses a configuration system that reads from environment variables. All state-specific text, organization information, and branding can be customized through environment variables - no code changes needed!

See `lib/config.ts` for the configuration structure and `env-template.txt` for all available options.

## 🐛 Troubleshooting

### Build Errors

- **Firebase not configured**: Make sure all `NEXT_PUBLIC_FIREBASE_*` variables are set
- **Type errors**: Run `npm install` to ensure all dependencies are installed

### Runtime Errors

- **"Firestore is not initialized"**: Check your Firebase environment variables
- **Authentication not working**: Verify Email/Password is enabled in Firebase Console
- **Can't upload files**: Check Storage security rules and ensure Storage is enabled

### Deployment Issues

- **Environment variables not working**: Ensure variables are set in your deployment platform's dashboard
- **Build fails**: Check that all required environment variables are set
- **App shows default values**: Verify `NEXT_PUBLIC_*` variables are set correctly

## 📞 Support

For questions or issues:

1. Check this README and the troubleshooting section
2. Review Firebase documentation for setup issues
3. Open an issue on GitHub (if applicable)
4. Contact the original developers: revampedrobotics@gmail.com

## 🤝 Contributing

This is a franchisable project. If you've set up your own instance and made improvements:

1. Consider contributing back to the main repository
2. Share your improvements with other state instances
3. Help build a stronger FIRST community

## 📄 License

Private project - Built by FTC12808 RevAmped

## 🙏 Acknowledgments

FIRST TeamMatch was created by FTC12808 RevAmped to help strengthen the FIRST robotics community. We're excited to see teams across the country using this platform to connect students with teams.
