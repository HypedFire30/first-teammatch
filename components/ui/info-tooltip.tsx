"use client";

import React, { useState } from "react";
import { Info } from "lucide-react";
import Link from "next/link";

interface InfoTooltipProps {
  content: string;
  privacyLink?: boolean;
}

export function InfoTooltip({ content, privacyLink = true }: InfoTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative inline-block">
      <button
        type="button"
        className="inline-flex items-center justify-center w-6 h-6 rounded-full border border-gray-300 bg-white text-gray-500 hover:text-gray-700 hover:border-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        aria-label="Information"
      >
        <Info className="h-4 w-4" />
      </button>
      {isVisible && (
        <div
          className="absolute right-0 top-6 z-50 w-64 p-3 bg-white border border-gray-200 rounded-lg shadow-lg text-left"
          onMouseEnter={() => setIsVisible(true)}
          onMouseLeave={() => setIsVisible(false)}
        >
          <p className="text-xs text-gray-700 leading-relaxed mb-2">{content}</p>
          {privacyLink && (
            <div className="border-t border-gray-200 pt-2 mt-2">
              <Link
                href="/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-600 hover:text-blue-700 underline"
              >
                View Privacy Policy
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

