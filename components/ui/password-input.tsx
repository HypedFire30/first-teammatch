"use client";

import { useState, useEffect } from "react";
import { Input } from "./input";
import { Check, X } from "lucide-react";

interface PasswordInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  error?: string;
}

interface PasswordRequirement {
  id: string;
  label: string;
  test: (password: string) => boolean;
}

const passwordRequirements: PasswordRequirement[] = [
  {
    id: "length",
    label: "At least 8 characters",
    test: (password) => password.length >= 8,
  },
  {
    id: "uppercase",
    label: "At least 1 uppercase letter",
    test: (password) => /[A-Z]/.test(password),
  },
  {
    id: "number",
    label: "At least 1 number",
    test: (password) => /\d/.test(password),
  },
];

export function PasswordInput({
  value,
  onChange,
  placeholder = "Password",
  className,
  error,
}: PasswordInputProps) {
  const [showRequirements, setShowRequirements] = useState(false);
  const [focused, setFocused] = useState(false);

  const requirements = passwordRequirements.map((req) => ({
    ...req,
    met: req.test(value),
  }));

  const allRequirementsMet = requirements.every((req) => req.met);

  return (
    <div className="space-y-2">
      <Input
        type="password"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => {
          setFocused(true);
          setShowRequirements(true);
        }}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        className={className}
        aria-describedby={
          showRequirements ? "password-requirements" : undefined
        }
      />

      {error && <p className="text-sm text-red-600">{error}</p>}

      {showRequirements && (
        <div
          id="password-requirements"
          className="space-y-1 text-sm"
          onMouseEnter={() => setShowRequirements(true)}
          onMouseLeave={() => !focused && setShowRequirements(false)}
        >
          <p className="text-gray-600 font-medium">Password requirements:</p>
          <ul className="space-y-1">
            {requirements.map((req) => (
              <li
                key={req.id}
                className={`flex items-center gap-2 ${
                  req.met ? "text-green-600" : "text-gray-500"
                }`}
              >
                {req.met ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <X className="h-4 w-4 text-gray-400" />
                )}
                {req.label}
              </li>
            ))}
          </ul>
          {allRequirementsMet && (
            <p className="text-green-600 font-medium flex items-center gap-2">
              <Check className="h-4 w-4" />
              Password meets all requirements
            </p>
          )}
        </div>
      )}
    </div>
  );
}
