"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CheckCircle,
  Code,
  Database,
  Shield,
  Rocket,
  Settings,
  Mail,
  FileText,
  ArrowLeft,
  ExternalLink,
  AlertTriangle,
  Github,
} from "lucide-react";
import { appConfig } from "@/lib/config";

export default function SetupPage() {
  const [databaseProvider, setDatabaseProvider] = useState<"firebase" | "supabase">("firebase");
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  
  const toggleCheckItem = (itemId: string) => {
    setCheckedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <h1 className="text-4xl font-bold text-gray-900">
              Setup Instructions
            </h1>
            <Button
              asChild
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-100 w-full sm:w-auto"
            >
              <a
                href="https://github.com/HypedFire30/first-teammatch"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="h-4 w-4 mr-2" />
                GitHub
              </a>
            </Button>
          </div>
          <p className="text-lg text-gray-600">
            Follow these steps to set up your own FIRST TeamMatch instance for
            your state or region.
          </p>
        </div>

        {/* Prerequisites */}
        <Card className="mb-8 border-blue-200 bg-blue-50/50">
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle className="h-5 w-5 mr-2 text-blue-600" />
              Prerequisites
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-gray-700">
              <li>• Node.js 18+ and npm</li>
              <li>• A Firebase account (free tier works)</li>
              <li>• A GitHub account (for cloning the repository)</li>
              <li>• Basic knowledge of command line and web development</li>
            </ul>
          </CardContent>
        </Card>

        {/* Step 1 */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm font-bold">
                1
              </span>
              Clone and Install
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700">
              Clone the repository and install dependencies:
            </p>
            <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto">
              <div className="mb-2">
                <span className="text-gray-400">$</span> git clone
                https://github.com/your-org/first-teammatch.git
              </div>
              <div className="mb-2">
                <span className="text-gray-400">$</span> cd first-teammatch
              </div>
              <div>
                <span className="text-gray-400">$</span> npm install
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step 2 */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm font-bold">
                2
              </span>
              Configure Your Instance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700">
              Copy the environment template and customize it:
            </p>
            <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto mb-4">
              <div>
                <span className="text-gray-400">$</span> cp env-template.txt
                .env.local
              </div>
            </div>
            <p className="text-gray-700">
              Open <code className="bg-gray-100 px-2 py-1 rounded">.env.local</code> and
              customize the following:
            </p>
            <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
              <div className="space-y-3 text-sm font-mono">
                <div>
                  <span className="text-gray-500"># State/Region Information</span>
                  <div className="ml-4 mt-1">
                    <div>NEXT_PUBLIC_STATE_NAME=YourState</div>
                    <div>NEXT_PUBLIC_STATE_ABBREVIATION=XX</div>
                    <div>NEXT_PUBLIC_REGION_NAME=YourState</div>
                  </div>
                </div>
                <div>
                  <span className="text-gray-500"># Organization Information</span>
                  <div className="ml-4 mt-1">
                    <div>NEXT_PUBLIC_ORG_NAME=Your Team Name</div>
                    <div>NEXT_PUBLIC_ORG_LOCATION=City, State</div>
                    <div>NEXT_PUBLIC_ORG_WEBSITE=https://your-team-website.org</div>
                    <div>NEXT_PUBLIC_ORG_EMAIL=your-email@example.com</div>
                  </div>
                </div>
                <div>
                  <span className="text-gray-500"># Contact & Branding</span>
                  <div className="ml-4 mt-1">
                    <div>NEXT_PUBLIC_CONTACT_EMAIL=your-email@example.com</div>
                    <div>NEXT_PUBLIC_APP_NAME=FIRST TeamMatch YourState</div>
                    <div>NEXT_PUBLIC_APP_DESCRIPTION=Connecting students...</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step 3 */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm font-bold">
                3
              </span>
              Set Up Database
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Tabs */}
            <div className="flex space-x-2 border-b border-gray-200 mb-6">
              <button
                onClick={() => setDatabaseProvider("firebase")}
                className={`px-4 py-2 font-medium text-sm transition-colors border-b-2 ${
                  databaseProvider === "firebase"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Firebase
              </button>
              <button
                onClick={() => setDatabaseProvider("supabase")}
                className={`px-4 py-2 font-medium text-sm transition-colors border-b-2 ${
                  databaseProvider === "supabase"
                    ? "border-green-600 text-green-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Supabase
              </button>
            </div>

            {/* Supabase Warning */}
            {databaseProvider === "supabase" && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <div className="flex items-start">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-yellow-900 mb-1">
                      Important: Supabase Free Plan Limitation
                    </h4>
                    <p className="text-sm text-yellow-800">
                      Supabase free plans shut off from inactivity. If your project
                      goes unused for a period of time, it will be paused and you'll
                      need to reactivate it. Keep this in mind when choosing your
                      database provider.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Firebase Content */}
            {databaseProvider === "firebase" && (
              <>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                    <Database className="h-4 w-4 mr-2 text-blue-600" />
                    Create Firebase Project
                  </h3>
                  <ol className="list-decimal list-inside space-y-1 text-gray-700 ml-6">
                    <li>
                      Go to{" "}
                      <a
                        href="https://console.firebase.google.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Firebase Console
                      </a>
                    </li>
                    <li>Click "Add project" and enter a project name</li>
                    <li>Follow the setup wizard (Google Analytics is optional)</li>
                  </ol>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                    <Shield className="h-4 w-4 mr-2 text-green-600" />
                    Enable Authentication
                  </h3>
                  <ol className="list-decimal list-inside space-y-1 text-gray-700 ml-6">
                    <li>Go to Authentication → Get started</li>
                    <li>Click Sign-in method tab</li>
                    <li>Enable Email/Password provider</li>
                    <li>Click Save</li>
                  </ol>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                    <Database className="h-4 w-4 mr-2 text-blue-600" />
                    Create Firestore Database
                  </h3>
                  <ol className="list-decimal list-inside space-y-1 text-gray-700 ml-6">
                    <li>Go to Firestore Database → Create database</li>
                    <li>Choose Start in production mode</li>
                    <li>Select a location closest to your users</li>
                    <li>Click Enable</li>
                    <li>
                      Go to Rules tab, replace with rules from{" "}
                      <a
                        href="https://github.com/HypedFire30/first-teammatch/blob/main/firestore.rules"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline font-mono bg-gray-100 px-1 rounded"
                      >
                        firestore.rules
                      </a>{" "}
                      in this repository, click Publish
                    </li>
                  </ol>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                    <FileText className="h-4 w-4 mr-2 text-purple-600" />
                    Set Up Firebase Storage
                  </h3>
                  <ol className="list-decimal list-inside space-y-1 text-gray-700 ml-6">
                    <li>Go to Storage → Get started</li>
                    <li>Choose Start in production mode</li>
                    <li>Use the same location as your Firestore database</li>
                    <li>Click Done</li>
                    <li>
                      Go to Rules tab, replace with rules from{" "}
                      <a
                        href="https://github.com/HypedFire30/first-teammatch/blob/main/storage.rules"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline font-mono bg-gray-100 px-1 rounded"
                      >
                        storage.rules
                      </a>{" "}
                      in this repository, click Publish
                    </li>
                  </ol>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                    <Settings className="h-4 w-4 mr-2 text-orange-600" />
                    Get Firebase Configuration
                  </h3>
                  <ol className="list-decimal list-inside space-y-1 text-gray-700 ml-6 mb-4">
                    <li>Go to Project Settings (gear icon) → Your apps</li>
                    <li>Click the Web icon to add a web app</li>
                    <li>Register your app (nickname is optional)</li>
                    <li>Copy the Firebase configuration values</li>
                    <li>Add them to your .env.local file</li>
                  </ol>
                  <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
                    <div className="space-y-2 text-sm font-mono">
                      <div>NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key-here</div>
                      <div>NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com</div>
                      <div>NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id</div>
                      <div>NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com</div>
                      <div>NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id</div>
                      <div>NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id</div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Supabase Content */}
            {databaseProvider === "supabase" && (
              <>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                    <Database className="h-4 w-4 mr-2 text-green-600" />
                    Create Supabase Project
                  </h3>
                  <ol className="list-decimal list-inside space-y-1 text-gray-700 ml-6">
                    <li>
                      Go to{" "}
                      <a
                        href="https://supabase.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-600 hover:underline"
                      >
                        Supabase
                      </a>{" "}
                      and sign up for an account
                    </li>
                    <li>Click "New Project"</li>
                    <li>Enter a project name and database password</li>
                    <li>Select a region closest to your users</li>
                    <li>Click "Create new project"</li>
                  </ol>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                    <Shield className="h-4 w-4 mr-2 text-green-600" />
                    Enable Authentication
                  </h3>
                  <ol className="list-decimal list-inside space-y-1 text-gray-700 ml-6">
                    <li>Go to Authentication → Providers</li>
                    <li>Enable Email provider</li>
                    <li>Configure email templates if needed</li>
                    <li>Save your changes</li>
                  </ol>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                    <Database className="h-4 w-4 mr-2 text-green-600" />
                    Set Up Database Tables
                  </h3>
                  <ol className="list-decimal list-inside space-y-1 text-gray-700 ml-6">
                    <li>Go to Table Editor in your Supabase dashboard</li>
                    <li>Create the necessary tables for students, teams, and admins</li>
                    <li>Set up Row Level Security (RLS) policies</li>
                    <li>Configure relationships between tables</li>
                  </ol>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                    <FileText className="h-4 w-4 mr-2 text-purple-600" />
                    Set Up Storage
                  </h3>
                  <ol className="list-decimal list-inside space-y-1 text-gray-700 ml-6">
                    <li>Go to Storage in your Supabase dashboard</li>
                    <li>Create a new bucket for resumes</li>
                    <li>Set bucket to public or configure access policies</li>
                    <li>Configure storage policies for file uploads</li>
                  </ol>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                    <Settings className="h-4 w-4 mr-2 text-orange-600" />
                    Get Supabase Configuration
                  </h3>
                  <ol className="list-decimal list-inside space-y-1 text-gray-700 ml-6 mb-4">
                    <li>Go to Project Settings → API</li>
                    <li>Copy your Project URL and anon/public key</li>
                    <li>Add them to your .env.local file</li>
                  </ol>
                  <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
                    <div className="space-y-2 text-sm font-mono">
                      <div>NEXT_PUBLIC_SUPABASE_URL=your-project-url</div>
                      <div>NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key</div>
                      <div>SUPABASE_SERVICE_ROLE_KEY=your-service-role-key</div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Step 4 */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm font-bold">
                4
              </span>
              Test Locally
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700">Start the development server:</p>
            <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto">
              <div>
                <span className="text-gray-400">$</span> npm run dev
              </div>
            </div>
            <p className="text-gray-700">
              Open{" "}
              <a
                href="http://localhost:3000"
                className="text-blue-600 hover:underline"
              >
                http://localhost:3000
              </a>{" "}
              in your browser. You should see your customized homepage.
            </p>
          </CardContent>
        </Card>

        {/* Step 5 */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm font-bold">
                5
              </span>
              Create Your First Admin Account
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>
                Register a new account through the app (use "I'm a Student" or
                "I'm a Team" button)
              </li>
              <li>
                Use the admin management script to promote them to admin:
                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm mt-2 overflow-x-auto">
                  <div>
                    <span className="text-gray-400">$</span> npm run manage:admins
                    -- add your-email@example.com
                  </div>
                </div>
              </li>
            </ol>
            <p className="text-gray-600 text-sm mt-4">
              Or manually in Firebase Console: Go to Firestore Database, create
              a document in the <code className="bg-gray-100 px-1 rounded">admins</code>{" "}
              collection with the user's UID as the document ID, and add an{" "}
              <code className="bg-gray-100 px-1 rounded">email</code> field.
            </p>
          </CardContent>
        </Card>

        {/* Step 6 */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm font-bold">
                6
              </span>
              Deploy Your Instance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                <Rocket className="h-4 w-4 mr-2 text-blue-600" />
                Deploy to Vercel (Recommended)
              </h3>
              <ol className="list-decimal list-inside space-y-1 text-gray-700 ml-6">
                <li>Push your code to GitHub</li>
                <li>
                  Go to{" "}
                  <a
                    href="https://vercel.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Vercel
                  </a>{" "}
                  and sign in with GitHub
                </li>
                <li>Click "Add New Project" and import your repository</li>
                <li>
                  Add <strong>ALL</strong> environment variables from your{" "}
                  <code className="bg-gray-100 px-1 rounded">.env.local</code> file
                </li>
                <li>Click "Deploy"</li>
              </ol>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Other Deployment Options
              </h3>
              <p className="text-gray-700 mb-2">
                The app can be deployed to any platform that supports Next.js:
              </p>
              <ul className="list-disc list-inside space-y-1 text-gray-700 ml-6">
                <li>AWS Amplify</li>
                <li>Netlify</li>
                <li>Railway</li>
                <li>Your own server (build with <code className="bg-gray-100 px-1 rounded">npm run build</code> and run with <code className="bg-gray-100 px-1 rounded">npm start</code>)</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Additional Resources */}
        <Card className="mb-8 border-green-200 bg-green-50/50">
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
              Security Checklist
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Click each item to check it off as you complete it. (This checklist resets when you reload the page.)
            </p>
            <ul className="space-y-2 text-gray-700">
              <li 
                className="flex items-start cursor-pointer hover:bg-green-100/50 rounded-md p-2 -ml-2 transition-colors"
                onClick={() => toggleCheckItem("firestore-rules")}
              >
                {checkedItems.has("firestore-rules") ? (
                  <CheckCircle className="h-5 w-5 mr-2 mt-0.5 text-green-600 flex-shrink-0" />
                ) : (
                  <div className="h-5 w-5 mr-2 mt-0.5 border-2 border-gray-300 rounded-full flex-shrink-0" />
                )}
                <span className={checkedItems.has("firestore-rules") ? "line-through text-gray-500" : ""}>
                  Firestore security rules are published
                </span>
              </li>
              <li 
                className="flex items-start cursor-pointer hover:bg-green-100/50 rounded-md p-2 -ml-2 transition-colors"
                onClick={() => toggleCheckItem("storage-rules")}
              >
                {checkedItems.has("storage-rules") ? (
                  <CheckCircle className="h-5 w-5 mr-2 mt-0.5 text-green-600 flex-shrink-0" />
                ) : (
                  <div className="h-5 w-5 mr-2 mt-0.5 border-2 border-gray-300 rounded-full flex-shrink-0" />
                )}
                <span className={checkedItems.has("storage-rules") ? "line-through text-gray-500" : ""}>
                  Storage security rules are published
                </span>
              </li>
              <li 
                className="flex items-start cursor-pointer hover:bg-green-100/50 rounded-md p-2 -ml-2 transition-colors"
                onClick={() => toggleCheckItem("admin-accounts")}
              >
                {checkedItems.has("admin-accounts") ? (
                  <CheckCircle className="h-5 w-5 mr-2 mt-0.5 text-green-600 flex-shrink-0" />
                ) : (
                  <div className="h-5 w-5 mr-2 mt-0.5 border-2 border-gray-300 rounded-full flex-shrink-0" />
                )}
                <span className={checkedItems.has("admin-accounts") ? "line-through text-gray-500" : ""}>
                  Admin accounts are properly set up
                </span>
              </li>
              <li 
                className="flex items-start cursor-pointer hover:bg-green-100/50 rounded-md p-2 -ml-2 transition-colors"
                onClick={() => toggleCheckItem("env-vars")}
              >
                {checkedItems.has("env-vars") ? (
                  <CheckCircle className="h-5 w-5 mr-2 mt-0.5 text-green-600 flex-shrink-0" />
                ) : (
                  <div className="h-5 w-5 mr-2 mt-0.5 border-2 border-gray-300 rounded-full flex-shrink-0" />
                )}
                <span className={checkedItems.has("env-vars") ? "line-through text-gray-500" : ""}>
                  Environment variables are set in production
                </span>
              </li>
              <li 
                className="flex items-start cursor-pointer hover:bg-green-100/50 rounded-md p-2 -ml-2 transition-colors"
                onClick={() => toggleCheckItem("auth-enabled")}
              >
                {checkedItems.has("auth-enabled") ? (
                  <CheckCircle className="h-5 w-5 mr-2 mt-0.5 text-green-600 flex-shrink-0" />
                ) : (
                  <div className="h-5 w-5 mr-2 mt-0.5 border-2 border-gray-300 rounded-full flex-shrink-0" />
                )}
                <span className={checkedItems.has("auth-enabled") ? "line-through text-gray-500" : ""}>
                  Firebase Authentication is enabled
                </span>
              </li>
              <li 
                className="flex items-start cursor-pointer hover:bg-green-100/50 rounded-md p-2 -ml-2 transition-colors"
                onClick={() => toggleCheckItem("test-registration")}
              >
                {checkedItems.has("test-registration") ? (
                  <CheckCircle className="h-5 w-5 mr-2 mt-0.5 text-green-600 flex-shrink-0" />
                ) : (
                  <div className="h-5 w-5 mr-2 mt-0.5 border-2 border-gray-300 rounded-full flex-shrink-0" />
                )}
                <span className={checkedItems.has("test-registration") ? "line-through text-gray-500" : ""}>
                  You've tested the registration flow
                </span>
              </li>
              <li 
                className="flex items-start cursor-pointer hover:bg-green-100/50 rounded-md p-2 -ml-2 transition-colors"
                onClick={() => toggleCheckItem("test-admin")}
              >
                {checkedItems.has("test-admin") ? (
                  <CheckCircle className="h-5 w-5 mr-2 mt-0.5 text-green-600 flex-shrink-0" />
                ) : (
                  <div className="h-5 w-5 mr-2 mt-0.5 border-2 border-gray-300 rounded-full flex-shrink-0" />
                )}
                <span className={checkedItems.has("test-admin") ? "line-through text-gray-500" : ""}>
                  You've tested the admin dashboard
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Support */}
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Mail className="h-5 w-5 mr-2 text-blue-600" />
              Need Help?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">
              For questions or issues, contact the original developers:
            </p>
            <Button asChild variant="outline">
              <a href="mailto:vedrshah@icloud.com">
                <Mail className="h-4 w-4 mr-2" />
                Email
              </a>
            </Button>
          </CardContent>
        </Card>

        {/* Back to Home */}
        <div className="mt-8 text-center">
          <Link href="/">
            <Button variant="outline" size="lg">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

