"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Mail } from "lucide-react";

interface CaptchaVerificationProps {
  isOpen: boolean;
  onClose: () => void;
  onVerify: () => void;
  email?: string;
}

function generateCaptcha(): { question: string; answer: number } {
  const num1 = Math.floor(Math.random() * 10) + 1;
  const num2 = Math.floor(Math.random() * 10) + 1;
  const operations = [
    { op: "+", answer: num1 + num2 },
    { op: "-", answer: num1 - num2 },
    { op: "*", answer: num1 * num2 },
  ];
  const operation = operations[Math.floor(Math.random() * operations.length)];

  return {
    question: `${num1} ${operation.op} ${num2}`,
    answer: operation.answer,
  };
}

export function CaptchaVerification({
  isOpen,
  onClose,
  onVerify,
  email,
}: CaptchaVerificationProps) {
  const [captcha, setCaptcha] = useState<{ question: string; answer: number }>(
    generateCaptcha()
  );
  const [userAnswer, setUserAnswer] = useState("");
  const [error, setError] = useState("");
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCaptcha(generateCaptcha());
      setUserAnswer("");
      setError("");
      setIsVerified(false);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const answer = parseInt(userAnswer, 10);

    if (isNaN(answer)) {
      setError("Please enter a valid number");
      return;
    }

    if (answer === captcha.answer) {
      setIsVerified(true);
      onVerify();
      // Don't close immediately - show email with animation
      if (!email) {
        onClose();
      }
    } else {
      setError("Incorrect answer. Please try again.");
      setCaptcha(generateCaptcha());
      setUserAnswer("");
    }
  };

  const handleRefresh = () => {
    setCaptcha(generateCaptcha());
    setUserAnswer("");
    setError("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 animate-scaleIn overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            {isVerified && email
              ? "Contact Information"
              : "Verify You're Human"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div
          className="relative overflow-hidden"
          style={{ minHeight: "300px" }}
        >
          {/* CAPTCHA Form */}
          <div
            className={`p-6 space-y-4 transition-transform duration-500 ease-in-out ${
              isVerified && email
                ? "-translate-x-full absolute inset-0 bg-white"
                : "translate-x-0 relative"
            }`}
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="captcha" className="text-gray-700 font-medium">
                  Solve this math problem to access contact information:
                </Label>
                <div className="mt-3 flex items-center gap-3">
                  <div className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-center">
                    <span className="text-2xl font-mono text-gray-900">
                      {captcha.question} = ?
                    </span>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleRefresh}
                    className="shrink-0"
                  >
                    Refresh
                  </Button>
                </div>
              </div>

              <div>
                <Input
                  id="captcha"
                  type="number"
                  value={userAnswer}
                  onChange={(e) => {
                    setUserAnswer(e.target.value);
                    setError("");
                  }}
                  placeholder="Enter your answer"
                  className="mt-1"
                  autoFocus
                />
                {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="transition-all duration-200"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 transition-all duration-200"
                >
                  Verify
                </Button>
              </div>
            </form>
          </div>

          {/* Email Display */}
          {isVerified && email && (
            <div className="p-6 space-y-4 translate-x-0 transition-transform duration-500 ease-in-out bg-white relative">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <svg
                    className="w-8 h-8 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Verification Successful!
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Contact this team:
                  </p>
                  <a
                    href={`mailto:${email}`}
                    className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-200"
                  >
                    <Mail className="h-5 w-5 mr-2" />
                    {email}
                  </a>
                </div>
              </div>
              <div className="flex justify-center pt-2">
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="transition-all duration-200"
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
