# FIRST Robotics Registration System

A modern platform for matching students with FIRST Robotics teams, featuring a streamlined registration process and intuitive user interface.

## 🚀 Features

### Student Registration
- Multi-step form with progress tracking
- Profile creation with skills, interests, and availability
- Optional resume upload (PDF, DOC, DOCX up to 10MB)
- Secure authentication and data storage

### Team Registration
- Comprehensive team profile setup
- Areas of need and student requirements
- Grade range and time commitment preferences
- Team achievements and qualities selection

### Admin Dashboard
- View and manage student registrations
- View and manage team registrations
- User profile management

## 📋 Setup Instructions

### 1. Environment Variables

Create a `.env.local` file with Firebase configuration:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

### 2. Firebase Setup

1. **Enable Authentication**: Go to Firebase Console → Authentication → Enable Email/Password
2. **Create Firestore Database**: Go to Firebase Console → Firestore Database → Create database
3. **Set Up Storage**: Go to Firebase Console → Storage → Get started
4. **Configure Security Rules**: Set up Firestore and Storage security rules

### 3. Install Dependencies

```bash
npm install
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🏗️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **Storage**: Firebase Storage
- **UI**: Tailwind CSS, Shadcn UI, Radix UI
- **Forms**: React Hook Form, Zod
- **Language**: TypeScript

## 📝 Project Structure

```
app/
  ├── admin/                    # Admin dashboard
  ├── dashboard/                # User dashboard
  ├── login/                    # Authentication
  ├── student-registration/     # Student signup form
  └── team-registration/        # Team signup form

components/
  ├── ui/                       # Reusable UI components
  └── navigation-header.tsx      # Global navigation

lib/
  ├── firebase.ts               # Firebase configuration
  ├── auth.ts                   # Authentication functions
  └── utils.ts                  # Utility functions

scripts/
  ├── migrate-to-firebase.ts    # Data migration utilities
  ├── manage-admins.ts          # Admin management
  └── import-auth-accounts.ts  # Auth account import
```

## 🎨 Design

- Clean, modern interface with FIRST Robotics colors (red, blue, green)
- Responsive design optimized for all devices
- Smooth animations and transitions
- Accessible form components

## 🔒 Security

- Firestore security rules restrict access based on user authentication
- Storage rules limit file uploads to authenticated users
- Admin access verified through Firestore document checks
- Secure password requirements and validation

## 📄 License

Private project
