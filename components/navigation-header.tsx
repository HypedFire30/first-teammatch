"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Users,
  UserPlus,
  Menu,
  X,
  LogIn,
  LogOut,
  Bug,
  BookOpen,
} from "lucide-react";
import Image from "next/image";
import {
  getSession,
  signOut,
  getUserProfile,
  onAuthStateChanged,
  auth,
  isFirebaseConfigured,
} from "@/lib/auth";
import { appConfig } from "@/lib/config";

export function NavigationHeader() {
  const pathname = usePathname();
  const isStudentPage = pathname === "/student-registration";
  const isTeamPage = pathname === "/team-registration";
  const isHomePage = pathname === "/";
  const isLoginPage = pathname === "/login";
  const isDashboardPage = pathname === "/dashboard";
  const isAdminPage = pathname === "/admin";
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Generate bug report email URL
  const [bugReportUrl, setBugReportUrl] = useState("");

  useEffect(() => {
    const currentUrl = window.location.href;
    const subject = "Bug Report — ";
    const body = `Page the Bug Occurs On: ${currentUrl}

Account Name (your email): 

Bug Description:
What Happened: 
What I expected to happen: 

Steps to Make the Bug Happen Again:
1. 
2. 
3. 

Browser: 
Device: 
Operating System: 

Priority Level:
☐ Low (minor inconvenience)
☐ Medium (affects functionality)
☐ High (prevents core features)
☐ Critical (app unusable)

Additional Details:
`;

    setBugReportUrl(
      `mailto:${appConfig.contactEmail}?subject=${encodeURIComponent(
        subject
      )}&body=${encodeURIComponent(body)}`
    );
  }, []);

  useEffect(() => {
    async function checkAuth() {
      const { session } = await getSession();
      setIsAuthenticated(!!session);

      if (session) {
        // Get user profile to determine type
        const { profile } = await getUserProfile(session.user.uid);
        if (profile) {
          setUserType(profile.type);
        }
      }

      setIsLoading(false);
    }
    checkAuth();

    // Listen for auth state changes (only if Firebase is configured)
    let unsubscribe: (() => void) | undefined;
    if (isFirebaseConfigured()) {
      unsubscribe = onAuthStateChanged(auth, async (user) => {
        setIsAuthenticated(!!user);

        if (user) {
          const { profile } = await getUserProfile(user.uid);
          if (profile) {
            setUserType(profile.type);
          }
        } else {
          setUserType(null);
        }
      });
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-lg">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Image
                src="/first-logo.png"
                alt="FIRST"
                width={120}
                height={40}
                className="h-8 sm:h-10 w-auto"
                style={{ width: "auto", height: "auto" }}
              />
              {!isHomePage && (
                <span className="ml-3 text-lg font-semibold text-gray-900">
                  TeamMatch
                </span>
              )}
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {/* Setup Guide Link */}
            <Link
              href="/setup"
              className="text-gray-700 hover:text-gray-900 font-medium text-sm transition-colors flex items-center space-x-1.5"
            >
              <BookOpen className="h-4 w-4" />
              <span>Setup Guide</span>
            </Link>

            {/* Bug Report Link */}
            <a
              href={bugReportUrl || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className={`text-gray-700 hover:text-gray-900 font-medium text-sm transition-colors flex items-center space-x-1.5 ${
                !bugReportUrl ? "pointer-events-none opacity-50" : ""
              }`}
            >
              <Bug className="h-4 w-4" />
              <span>Bug Report</span>
            </a>

            {!isLoading && !isLoginPage && !isAuthenticated && (
              <Link href="/login">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center space-x-2 text-sm">
                  <LogIn className="h-4 w-4" />
                  <span>Log In</span>
                </Button>
              </Link>
            )}

            {!isLoading &&
              isAuthenticated &&
              (isDashboardPage || isAdminPage) && (
                <Button
                  onClick={async () => {
                    await signOut();
                    window.location.href = "/";
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center space-x-2 text-sm"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Log Out</span>
                </Button>
              )}

            {!isLoading &&
              isAuthenticated &&
              userType === "admin" &&
              !isAdminPage && (
                <Link href="/admin">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm">
                    Admin
                  </Button>
                </Link>
              )}

            {!isLoading &&
              isAuthenticated &&
              userType !== "admin" &&
              !isDashboardPage && (
                <Link href="/dashboard">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm">
                    Dashboard
                  </Button>
                </Link>
              )}
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-md">
            <div className="px-6 py-4 space-y-3">
              {/* Setup Guide Link - Mobile */}
              <Link
                href="/setup"
                className="block text-gray-700 hover:text-gray-900 font-medium py-3 px-4 rounded-lg transition-colors flex items-center space-x-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <BookOpen className="h-4 w-4" />
                <span>Setup Guide</span>
              </Link>

              {/* Bug Report Link - Mobile */}
              <a
                href={bugReportUrl || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className={`block text-gray-700 hover:text-gray-900 font-medium py-3 px-4 rounded-lg transition-colors flex items-center space-x-2 ${
                  !bugReportUrl ? "pointer-events-none opacity-50" : ""
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Bug className="h-4 w-4" />
                <span>Bug Report</span>
              </a>

              {!isLoading && !isLoginPage && !isAuthenticated && (
                <Link href="/login">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2">
                    <LogIn className="h-4 w-4" />
                    <span>Log In</span>
                  </Button>
                </Link>
              )}

              {!isLoading &&
                isAuthenticated &&
                (isDashboardPage || isAdminPage) && (
                  <Button
                    onClick={async () => {
                      await signOut();
                      window.location.href = "/";
                    }}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Log Out</span>
                  </Button>
                )}

              {!isLoading &&
                isAuthenticated &&
                userType === "admin" &&
                !isAdminPage && (
                  <Link href="/admin">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors">
                      Admin
                    </Button>
                  </Link>
                )}

              {!isLoading &&
                isAuthenticated &&
                userType !== "admin" &&
                !isDashboardPage && (
                  <Link href="/dashboard">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors">
                      Dashboard
                    </Button>
                  </Link>
                )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
