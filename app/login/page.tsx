"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn, requestPasswordReset } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [isSendingReset, setIsSendingReset] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setShowResendOption(false);
    setResendSuccess(false);
    setIsLoading(true);

    const { user, error: authError } = await signIn(email, password);

    if (authError) {
      setError(authError.message);
      setIsLoading(false);
      return;
    }

    if (user) {
      // Redirect based on user type
      if (user.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    }
  };

  const handleForgotPassword = async () => {
    if (!email || !email.trim()) {
      setError("Please enter your email address first.");
      return;
    }

    setIsSendingReset(true);
    setError("");
    setResetSuccess(false);

    console.log("Password reset requested for email:", email);

    const { error: resetError } = await requestPasswordReset(email);

    if (resetError) {
      console.error("Password reset error:", resetError);
      setError(`Failed to send password reset email: ${resetError.message}`);
      setResetSuccess(false);
    } else {
      console.log("Password reset email sent successfully");
      setResetSuccess(true);
      setShowForgotPassword(false);
      setError(""); // Clear any previous errors
    }

    setIsSendingReset(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-600">
            Sign in to your FIRST Robotics account
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="email" className="text-gray-700 font-medium">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="mt-1"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <Label htmlFor="password" className="text-gray-700 font-medium">
                  Password
                </Label>
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Forgot Password?
                </button>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="mt-1"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {showForgotPassword && (
              <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                <p className="text-blue-600 text-sm mb-2">
                  Enter your email address and we'll send you a link to reset
                  your password.
                </p>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    onClick={handleForgotPassword}
                    disabled={isSendingReset || !email || !email.trim()}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-sm py-1 px-3 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSendingReset ? "Sending..." : "Send Reset Link"}
                  </Button>
                  <Button
                    type="button"
                    onClick={() => {
                      setShowForgotPassword(false);
                      setResetSuccess(false);
                      setError(""); // Clear errors when canceling
                    }}
                    variant="outline"
                    className="text-sm py-1 px-3 rounded"
                  >
                    Cancel
                  </Button>
                </div>
                {isSendingReset && (
                  <p className="text-blue-600 text-xs mt-2">
                    Sending password reset email...
                  </p>
                )}
              </div>
            )}

            {resetSuccess && (
              <div className="bg-green-50 border border-green-200 rounded-md p-3">
                <p className="text-green-600 text-sm">
                  ✅ Password reset email sent! Please check your inbox and spam
                  folder. Click the link in the email to reset your password.
                </p>
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              Don't have an account?{" "}
              <Link
                href="/team-registration"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Register as Team
              </Link>
            </p>
            <p className="text-gray-600 text-sm mt-2">
              Looking for a team?{" "}
              <Link
                href="/browse"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Browse Teams
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
