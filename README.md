# FIRST TeamMatch

A modern, franchisable platform for matching students with FIRST Robotics teams. Built by FTC12808 RevAmped to strengthen the FIRST community, this app can be easily deployed for any state or region.

> 📖 **Need detailed setup instructions?** Visit our [interactive setup guide](https://first-teammatch.vercel.app/setup) for step-by-step instructions with code examples, database setup options, and an interactive checklist.

## 🌟 Overview

FIRST TeamMatch is designed to be **franchisable - meaning any FIRST team or organization can set up their own instance for their state or region. Each instance has its own database, configuration, and branding, allowing teams to manage their own matching platform independently.

### Key Features

- **Student Registration**: Multi-step form with profile creation, skills tracking, and resume upload
- **Team Registration**: Comprehensive team profiles with needs, requirements, and preferences
- **Smart Matching**: Algorithm-based matching between students and teams
- **Admin Dashboard**: Full management interface for viewing and managing registrations
- **State-Specific Configuration**: Easy customization for your state/region
- **Self-Hosted**: Deploy anywhere - Vercel, AWS, your own server, etc.

## 🚀 Quick Setup

### Prerequisites

- Node.js 18+ and npm
- A Firebase account (free tier works)
- A GitHub account (for cloning the repository)

### Step 1: Clone and Install

```bash
git clone https://github.com/HypedFire30/first-teammatch.git
cd first-teammatch
npm install
```

### Step 2: Configure Your Instance

1. Copy the environment template: `cp env-template.txt .env.local`
2. Edit `.env.local` and set your state/organization information:
   - `NEXT_PUBLIC_STATE_NAME` - Your state name
   - `NEXT_PUBLIC_ORG_NAME` - Your team name
   - `NEXT_PUBLIC_ORG_LOCATION` - Your location
   - `NEXT_PUBLIC_ORG_EMAIL` - Your contact email
   - `NEXT_PUBLIC_APP_NAME` - Your app name
   - See `env-template.txt` for all options

### Step 3: Set Up Firebase

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable **Email/Password** authentication
3. Create **Firestore Database** (production mode)
4. Set up **Firebase Storage** (production mode)
5. Copy security rules from [`firestore.rules`](https://github.com/HypedFire30/first-teammatch/blob/main/firestore.rules) and [`storage.rules`](https://github.com/HypedFire30/first-teammatch/blob/main/storage.rules)
6. Get your Firebase config from Project Settings → Your apps → Web
7. Add Firebase config to `.env.local`:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
   ```

### Step 4: Test Locally

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your customized homepage.

### Step 5: Create Admin Account

1. Register an account through the app
2. Run: `npm run manage:admins -- add your-email@example.com`
3. Or manually: Create document in Firestore `admins` collection with user's UID as document ID

### Step 6: Deploy

**Vercel (Recommended):**
1. Push code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add all environment variables from `.env.local`
4. Deploy

**Other Platforms:** AWS Amplify, Netlify, Railway, or your own server

> 💡 **For detailed instructions**, visit [first-teammatch.vercel.app/setup](https://first-teammatch.vercel.app/setup)

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

```bash
# Add an admin
npm run manage:admins -- add user@example.com

# Remove an admin
npm run manage:admins -- remove user@example.com

# List all admins
npm run manage:admins -- list
```

Or manually in Firebase Console: Create/edit document in `admins` collection with user's UID as document ID.

## 🔒 Security Checklist

Before going live:
- [ ] Firestore security rules published
- [ ] Storage security rules published
- [ ] Admin accounts set up
- [ ] Environment variables set in production
- [ ] Firebase Authentication enabled
- [ ] Registration flow tested
- [ ] Admin dashboard tested

> 📋 **Interactive checklist available at** [first-teammatch.vercel.app/setup](https://first-teammatch.vercel.app/setup)

## 📝 Project Structure

```
first-teammatch/
├── app/                          # Next.js app directory
│   ├── admin/                    # Admin dashboard
│   ├── dashboard/                # User dashboard
│   ├── login/                    # Authentication
│   ├── setup/                    # Setup instructions page
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
│   └── import-auth-accounts.ts   # Auth account import
├── firestore.rules               # Firestore security rules
├── storage.rules                 # Storage security rules
└── env-template.txt              # Environment variable template
```

## 🏗️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: Firebase Firestore (Supabase also supported)
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
2. Visit the [detailed setup guide](https://first-teammatch.vercel.app/setup)
3. Review Firebase documentation for setup issues
4. Open an issue on GitHub
5. Contact: revampedrobotics@gmail.com

## 🤝 Contributing

This is a franchisable project. If you've set up your own instance and made improvements:
1. Consider contributing back to the main repository
2. Share your improvements with other state instances
3. Help build a stronger FIRST community

## 📄 License

Private project - Built by FTC12808 RevAmped

## 🙏 Acknowledgments

FIRST TeamMatch was created by FTC12808 RevAmped to help strengthen the FIRST robotics community. We're excited to see teams across the country using this platform to connect students with teams.
