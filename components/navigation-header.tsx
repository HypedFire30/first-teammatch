"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Users, UserPlus, Menu, X, LogIn, LogOut, Bug } from "lucide-react";
import Image from "next/image";
import { getSession, signOut, getUserProfile, supabase } from "@/lib/auth";

export function NavigationHeader() {
  const pathname = usePathname();
  const isStudentPage = pathname === "/student-registration";
  const isTeamPage = pathname === "/team-registration";
  const isHomePage = pathname === "/";
  const isLoginPage = pathname === "/login";
  const isDashboardPage = pathname === "/dashboard";
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
      `mailto:vedrshah@icloud.com?subject=${encodeURIComponent(
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
        const { profile } = await getUserProfile(session.user.id);
        if (profile) {
          setUserType(profile.type);
        }
      }

      setIsLoading(false);
    }
    checkAuth();

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event: string, session: any) => {
      setIsAuthenticated(!!session);

      if (session) {
        const { profile } = await getUserProfile(session.user.id);
        if (profile) {
          setUserType(profile.type);
        }
      } else {
        setUserType(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <header className="glass-effect sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
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
                <span className="ml-2 sm:ml-3 text-lg sm:text-xl font-bold text-gray-800">
                  TeamMatch
                </span>
              )}
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-3 lg:space-x-4">
            {/* Bug Report Button */}
            <a
              href={bugReportUrl || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className={!bugReportUrl ? "pointer-events-none opacity-50" : ""}
            >
              <Button
                variant="outline"
                className="border-orange-500 text-orange-600 hover:bg-orange-50 hover:border-orange-600 font-semibold py-2 px-4 lg:py-3 lg:px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center space-x-2 text-sm lg:text-base"
              >
                <Bug className="h-4 w-4" />
                <span className="hidden lg:inline">Bug Report</span>
                <span className="lg:hidden">Report</span>
              </Button>
            </a>

            {!isLoading && !isLoginPage && !isAuthenticated && (
              <Link href="/login">
                <Button className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 lg:py-3 lg:px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center space-x-2 text-sm lg:text-base">
                  <LogIn className="h-4 w-4" />
                  <span className="hidden lg:inline">Log In</span>
                  <span className="lg:hidden">Log In</span>
                </Button>
              </Link>
            )}

            {!isLoading && isAuthenticated && userType === "admin" && (
              <Link href="/admin">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 lg:py-3 lg:px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 text-sm lg:text-base">
                  Admin
                </Button>
              </Link>
            )}

            {!isLoading && isAuthenticated && userType !== "admin" && (
              <Link href="/dashboard">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 lg:py-3 lg:px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 text-sm lg:text-base">
                  Dashboard
                </Button>
              </Link>
            )}
          </div>

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
          <div className="md:hidden border-t border-gray-200 bg-white/95 backdrop-blur-sm">
            <div className="px-4 py-4 space-y-3">
              {/* Bug Report Button - Mobile */}
              <a
                href={bugReportUrl || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className={
                  !bugReportUrl ? "pointer-events-none opacity-50" : ""
                }
              >
                <Button
                  variant="outline"
                  className="w-full border-orange-500 text-orange-600 hover:bg-orange-50 hover:border-orange-600 font-semibold py-3 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <Bug className="h-4 w-4" />
                  <span>Bug Report</span>
                </Button>
              </a>

              {!isLoading && !isLoginPage && !isAuthenticated && (
                <Link href="/login">
                  <Button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center space-x-2">
                    <LogIn className="h-4 w-4" />
                    <span>Log In</span>
                  </Button>
                </Link>
              )}

              {!isLoading && isAuthenticated && userType === "admin" && (
                <Link href="/admin">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200">
                    Admin
                  </Button>
                </Link>
              )}

              {!isLoading && isAuthenticated && userType !== "admin" && (
                <Link href="/dashboard">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200">
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
