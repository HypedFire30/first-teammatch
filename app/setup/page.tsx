"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CheckCircle,
  Code,
  Database,
  Rocket,
  Settings,
  Mail,
  ArrowLeft,
  ExternalLink,
  AlertTriangle,
  Github,
} from "lucide-react";
import { appConfig } from "@/lib/config";

export default function SetupPage() {
  const [databaseProvider] = useState<"postgresql">("postgresql");
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
              <li>• A Neon account (free, at neon.tech) for the database</li>
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
            <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto w-full min-w-0">
              <div className="mb-2 whitespace-nowrap">
                <span className="text-gray-400">$</span> git clone
                https://github.com/your-org/first-teammatch.git
              </div>
              <div className="mb-2 whitespace-nowrap">
                <span className="text-gray-400">$</span> cd first-teammatch
              </div>
              <div className="whitespace-nowrap">
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
            <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto w-full min-w-0 mb-4">
              <div className="whitespace-nowrap">
                <span className="text-gray-400">$</span> cp env-template.txt
                .env.local
              </div>
            </div>
            <p className="text-gray-700">
              Open{" "}
              <code className="bg-gray-100 px-2 py-1 rounded">.env.local</code>{" "}
              and customize the following:
            </p>
            <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg overflow-x-auto w-full min-w-0">
              <div className="space-y-3 text-sm font-mono min-w-max">
                <div>
                  <span className="text-gray-500">
                    # State/Region Information
                  </span>
                  <div className="ml-4 mt-1">
                    <div className="whitespace-nowrap">
                      NEXT_PUBLIC_STATE_NAME=YourState
                    </div>
                    <div className="whitespace-nowrap">
                      NEXT_PUBLIC_STATE_ABBREVIATION=XX
                    </div>
                    <div className="whitespace-nowrap">
                      NEXT_PUBLIC_REGION_NAME=YourState
                    </div>
                  </div>
                </div>
                <div>
                  <span className="text-gray-500">
                    # Organization Information
                  </span>
                  <div className="ml-4 mt-1">
                    <div className="whitespace-nowrap">
                      NEXT_PUBLIC_ORG_NAME=Your Team Name
                    </div>
                    <div className="whitespace-nowrap">
                      NEXT_PUBLIC_ORG_LOCATION=City, State
                    </div>
                    <div className="whitespace-nowrap">
                      NEXT_PUBLIC_ORG_WEBSITE=https://your-team-website.org
                    </div>
                    <div className="whitespace-nowrap">
                      NEXT_PUBLIC_ORG_EMAIL=your-email@example.com
                    </div>
                  </div>
                </div>
                <div>
                  <span className="text-gray-500"># Contact & Branding</span>
                  <div className="ml-4 mt-1">
                    <div className="whitespace-nowrap">
                      NEXT_PUBLIC_CONTACT_EMAIL=your-email@example.com
                    </div>
                    <div className="whitespace-nowrap">
                      NEXT_PUBLIC_APP_NAME=FIRST TeamMatch YourState
                    </div>
                    <div className="whitespace-nowrap">
                      NEXT_PUBLIC_APP_DESCRIPTION=Connecting students...
                    </div>
                  </div>
                </div>
                <div>
                  <span className="text-gray-500"># Database</span>
                  <div className="ml-4 mt-1">
                    <div className="whitespace-nowrap">
                      DATABASE_URL=postgresql://user:pass@ep-xxx.pooler.us-east-1.aws.neon.tech/neondb?sslmode=require
                    </div>
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
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                    <Database className="h-4 w-4 mr-2 text-blue-600" />
                    Create a Neon Project
                  </h3>
                  <ol className="list-decimal list-inside space-y-1 text-gray-700 ml-6">
                    <li>
                      Go to{" "}
                      <a
                        href="https://neon.tech"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        neon.tech
                      </a>{" "}
                      and sign up (free, no credit card required)
                    </li>
                    <li>Click "New Project" and give it a name</li>
                    <li>Select <strong>AWS</strong> as the provider and <strong>US East (N. Virginia)</strong> as the region</li>
                    <li>Leave Neon Auth <strong>off</strong></li>
                    <li>Click "Create project"</li>
                  </ol>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                    <Settings className="h-4 w-4 mr-2 text-orange-600" />
                    Get Your Connection String
                  </h3>
                  <ol className="list-decimal list-inside space-y-1 text-gray-700 ml-6 mb-4">
                    <li>From your Neon project dashboard, click "Connect"</li>
                    <li>Select <strong>Pooled connection</strong></li>
                    <li>Copy the connection string</li>
                    <li>Add it to your <code className="bg-gray-100 px-1 rounded">.env.local</code> as <code className="bg-gray-100 px-1 rounded">DATABASE_URL</code></li>
                  </ol>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                    <Code className="h-4 w-4 mr-2 text-purple-600" />
                    Run the Schema
                  </h3>
                  <ol className="list-decimal list-inside space-y-1 text-gray-700 ml-6">
                    <li>In the Neon dashboard, open the <strong>SQL Editor</strong></li>
                    <li>
                      Copy the contents of{" "}
                      <a
                        href="https://github.com/HypedFire30/first-teammatch/blob/main/database/schema.sql"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline font-mono bg-gray-100 px-1 rounded"
                      >
                        database/schema.sql
                      </a>{" "}
                      from this repository
                    </li>
                    <li>Paste it into the SQL Editor and click <strong>Run</strong></li>
                  </ol>
                </div>
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
            <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto w-full min-w-0">
              <div className="whitespace-nowrap">
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
                Register a new team account through the app (use "I'm a Team"
                button)
              </li>
              <li>
                Use the admin management script to promote them to admin:
                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm mt-2 overflow-x-auto w-full min-w-0">
                  <div className="whitespace-nowrap">
                    <span className="text-gray-400">$</span> npm run
                    manage:admins -- add your-email@example.com
                  </div>
                </div>
              </li>
            </ol>
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
                  <code className="bg-gray-100 px-1 rounded">.env.local</code>{" "}
                  file
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
                <li>
                  Your own server (build with{" "}
                  <code className="bg-gray-100 px-1 rounded">
                    npm run build
                  </code>{" "}
                  and run with{" "}
                  <code className="bg-gray-100 px-1 rounded">npm start</code>)
                </li>
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
              Click each item to check it off as you complete it. (This
              checklist resets when you reload the page.)
            </p>
            <ul className="space-y-2 text-gray-700">
              <li
                className="flex items-start cursor-pointer hover:bg-green-100/50 rounded-md p-2 -ml-2 transition-colors"
                onClick={() => toggleCheckItem("db-schema")}
              >
                {checkedItems.has("db-schema") ? (
                  <CheckCircle className="h-5 w-5 mr-2 mt-0.5 text-green-600 flex-shrink-0" />
                ) : (
                  <div className="h-5 w-5 mr-2 mt-0.5 border-2 border-gray-300 rounded-full flex-shrink-0" />
                )}
                <span
                  className={
                    checkedItems.has("db-schema")
                      ? "line-through text-gray-500"
                      : ""
                  }
                >
                  database/schema.sql has been run on your Neon database
                </span>
              </li>
              <li
                className="flex items-start cursor-pointer hover:bg-green-100/50 rounded-md p-2 -ml-2 transition-colors"
                onClick={() => toggleCheckItem("db-url")}
              >
                {checkedItems.has("db-url") ? (
                  <CheckCircle className="h-5 w-5 mr-2 mt-0.5 text-green-600 flex-shrink-0" />
                ) : (
                  <div className="h-5 w-5 mr-2 mt-0.5 border-2 border-gray-300 rounded-full flex-shrink-0" />
                )}
                <span
                  className={
                    checkedItems.has("db-url")
                      ? "line-through text-gray-500"
                      : ""
                  }
                >
                  DATABASE_URL is set in your environment variables
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
                <span
                  className={
                    checkedItems.has("admin-accounts")
                      ? "line-through text-gray-500"
                      : ""
                  }
                >
                  Admin account created with manage:admins script
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
                <span
                  className={
                    checkedItems.has("env-vars")
                      ? "line-through text-gray-500"
                      : ""
                  }
                >
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
                <span
                  className={
                    checkedItems.has("auth-enabled")
                      ? "line-through text-gray-500"
                      : ""
                  }
                >
                  Login and registration flow tested successfully
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
                <span
                  className={
                    checkedItems.has("test-registration")
                      ? "line-through text-gray-500"
                      : ""
                  }
                >
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
                <span
                  className={
                    checkedItems.has("test-admin")
                      ? "line-through text-gray-500"
                      : ""
                  }
                >
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
