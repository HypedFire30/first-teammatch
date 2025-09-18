"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Users, CheckCircle, Clock, ArrowRight } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { signUp } from "@/lib/auth";
import { PasswordInput } from "@/components/ui/password-input";

const teamRegistrationSchema = z.object({
  teamName: z.string().min(1, "Team name is required"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/\d/, "Password must contain at least one number"),
  firstLevel: z.string(),
  zipCode: z.string(),
  isSchoolTeam: z.boolean().default(false),
  schoolName: z.string().optional(),
  areasOfNeed: z.array(z.string()),
  gradeRangeMin: z.number(),
  gradeRangeMax: z.number(),
  timeCommitment: z.number(),
  qualities: z.array(z.string()),
  teamAwards: z.string(),
});

type TeamRegistrationForm = z.infer<typeof teamRegistrationSchema>;

const firstLevels = [
  { value: "jr-first-lego-league", label: "Jr. FIRST Lego League" },
  { value: "first-lego-league", label: "FIRST Lego League" },
  { value: "first-tech-challenge", label: "FIRST Tech Challenge" },
  { value: "first-robotics-competition", label: "FIRST Robotics Competition" },
];

const areasOfNeed = [
  { value: "hardware", label: "Hardware" },
  { value: "software", label: "Software" },
  { value: "outreach", label: "Outreach" },
];

const qualities = [
  { value: "teamwork", label: "Teamwork & Collaboration" },
  { value: "problem-solving", label: "Problem Solving" },
  { value: "creativity", label: "Creativity & Innovation" },
  { value: "leadership", label: "Leadership" },
  { value: "communication", label: "Communication Skills" },
  { value: "technical-skills", label: "Technical Skills" },
  { value: "perseverance", label: "Perseverance & Resilience" },
  { value: "mentorship", label: "Mentorship & Teaching" },
  { value: "organization", label: "Organization & Planning" },
  { value: "sportsmanship", label: "Gracious Professionalism" },
];

export default function TeamRegistrationPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [selectedQualities, setSelectedQualities] = useState<string[]>([]);
  const [timeCommitment, setTimeCommitment] = useState([10]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [slideDirection, setSlideDirection] = useState<"left" | "right">(
    "right"
  );
  const [stepErrors, setStepErrors] = useState<{ [key: number]: string }>({});

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<TeamRegistrationForm>({
    resolver: zodResolver(teamRegistrationSchema),
    defaultValues: {
      gradeRangeMin: 6,
      gradeRangeMax: 12,
      timeCommitment: 10,
      areasOfNeed: [],
      qualities: [],
    },
  });

  // Set the time commitment value when component mounts
  useEffect(() => {
    setValue("timeCommitment", 10);
    setValue("areasOfNeed", []);
    setValue("qualities", []);
  }, [setValue]);

  const handleAreaToggle = (area: string) => {
    const newSelectedAreas = selectedAreas.includes(area)
      ? selectedAreas.filter((a) => a !== area)
      : [...selectedAreas, area];

    setSelectedAreas(newSelectedAreas);
    setValue("areasOfNeed", newSelectedAreas);
  };

  const handleQualityToggle = (quality: string) => {
    if (selectedQualities.includes(quality)) {
      const newQualities = selectedQualities.filter((q) => q !== quality);
      setSelectedQualities(newQualities);
      setValue("qualities", newQualities);
    } else if (selectedQualities.length < 3) {
      const newQualities = [...selectedQualities, quality];
      setSelectedQualities(newQualities);
      setValue("qualities", newQualities);
    }
  };

  const handleSchoolTeamToggle = (isSchool: boolean) => {
    setValue("isSchoolTeam", isSchool);
  };

  const handleTimeCommitmentChange = (value: number[]) => {
    setTimeCommitment(value);
    setValue("timeCommitment", value[0]);
  };

  // Validation functions for each step
  const validateStep = (step: number): boolean => {
    const currentValues = watch();
    let isValid = true;
    const newStepErrors = { ...stepErrors };

    switch (step) {
      case 0: // Team Name
        if (!currentValues.teamName?.trim()) {
          newStepErrors[0] = "Team name is required";
          isValid = false;
        } else {
          delete newStepErrors[0];
        }
        break;

      case 1: // Email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!currentValues.email?.trim()) {
          newStepErrors[1] = "Email is required";
          isValid = false;
        } else if (!emailRegex.test(currentValues.email)) {
          newStepErrors[1] = "Please enter a valid email address";
          isValid = false;
        } else {
          delete newStepErrors[1];
        }
        break;

      case 2: // Password
        const password = currentValues.password || "";
        if (password.length < 8) {
          newStepErrors[2] = "Password must be at least 8 characters";
          isValid = false;
        } else if (!/[A-Z]/.test(password)) {
          newStepErrors[2] =
            "Password must contain at least one uppercase letter";
          isValid = false;
        } else if (!/\d/.test(password)) {
          newStepErrors[2] = "Password must contain at least one number";
          isValid = false;
        } else {
          delete newStepErrors[2];
        }
        break;

      case 3: // FIRST Level
        if (!currentValues.firstLevel?.trim()) {
          newStepErrors[3] = "Please select your FIRST level";
          isValid = false;
        } else {
          delete newStepErrors[3];
        }
        break;

      case 4: // Zip Code
        if (!currentValues.zipCode?.trim()) {
          newStepErrors[4] = "Zip code is required";
          isValid = false;
        } else if (currentValues.zipCode.length < 5) {
          newStepErrors[4] = "Please enter a valid zip code";
          isValid = false;
        } else {
          delete newStepErrors[4];
        }
        break;

      case 5: // School Team (always valid since it has a default)
        delete newStepErrors[5];
        break;

      case 6: // School Name (if school team)
        if (currentValues.isSchoolTeam && !currentValues.schoolName?.trim()) {
          newStepErrors[6] = "School name is required for school teams";
          isValid = false;
        } else {
          delete newStepErrors[6];
        }
        break;

      case 7: // Areas of Need
        if (
          !currentValues.areasOfNeed ||
          currentValues.areasOfNeed.length === 0
        ) {
          newStepErrors[7] = "Please select at least one area of need";
          isValid = false;
        } else {
          delete newStepErrors[7];
        }
        break;

      case 8: // Grade Range
        const minGrade = currentValues.gradeRangeMin;
        const maxGrade = currentValues.gradeRangeMax;
        if (!minGrade || minGrade < 1 || minGrade > 12) {
          newStepErrors[8] = "Please enter a valid minimum grade (1-12)";
          isValid = false;
        } else if (!maxGrade || maxGrade < 1 || maxGrade > 12) {
          newStepErrors[8] = "Please enter a valid maximum grade (1-12)";
          isValid = false;
        } else if (minGrade > maxGrade) {
          newStepErrors[8] =
            "Minimum grade cannot be higher than maximum grade";
          isValid = false;
        } else {
          delete newStepErrors[8];
        }
        break;

      case 9: // Time Commitment (always valid since slider has default value)
        delete newStepErrors[9];
        break;

      case 10: // Team Awards
        if (!currentValues.teamAwards?.trim()) {
          newStepErrors[10] = "Please describe your team's achievements";
          isValid = false;
        } else if (currentValues.teamAwards.trim().length < 10) {
          newStepErrors[10] =
            "Please provide more details (at least 10 characters)";
          isValid = false;
        } else {
          delete newStepErrors[10];
        }
        break;

      case 11: // Qualities
        if (!currentValues.qualities || currentValues.qualities.length === 0) {
          newStepErrors[11] = "Please select at least one quality";
          isValid = false;
        } else if (currentValues.qualities.length > 3) {
          newStepErrors[11] = "Please select no more than 3 qualities";
          isValid = false;
        } else {
          delete newStepErrors[11];
        }
        break;
    }

    setStepErrors(newStepErrors);
    return isValid;
  };

  const nextStep = () => {
    // Validate current step before proceeding
    if (!validateStep(currentStep)) {
      return; // Don't proceed if validation fails
    }

    setSlideDirection("right");
    setIsTransitioning(true);
    setTimeout(() => {
      // Skip school name step if not a school team
      if (currentStep === 5 && !watch("isSchoolTeam")) {
        setCurrentStep(7); // Skip to areas of need
      } else {
        setCurrentStep((prev) => Math.min(prev + 1, 12));
      }
      setIsTransitioning(false);
    }, 300);
  };

  const prevStep = () => {
    setSlideDirection("left");
    setIsTransitioning(true);
    setTimeout(() => {
      // Skip school name step when going back if not a school team
      if (currentStep === 7 && !watch("isSchoolTeam")) {
        setCurrentStep(5); // Go back to school team question
      } else {
        setCurrentStep((prev) => Math.max(prev - 1, 0));
      }
      setIsTransitioning(false);
    }, 300);
  };

  const goToStep = (step: number) => {
    setSlideDirection(step > currentStep ? "right" : "left");
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentStep(step);
      setIsTransitioning(false);
    }, 300);
  };

  const onSubmit = async (data: TeamRegistrationForm) => {
    console.log("=== onSubmit FUNCTION CALLED ===");
    console.log("Submitting team form:", data);

    try {
      // Validate all required fields are present
      const requiredFields = {
        team_name: data.teamName,
        email: data.email,
        first_level: data.firstLevel,
        zip_code: data.zipCode,
        areas_of_need: data.areasOfNeed,
        grade_range_min: data.gradeRangeMin,
        grade_range_max: data.gradeRangeMax,
        time_commitment: data.timeCommitment,
        qualities: data.qualities,
      };

      console.log("Required fields check:", requiredFields);

      // Add timeout to prevent infinite hanging
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error("Request timeout")), 30000); // 30 second timeout
      });

      const signUpPromise = signUp(
        data.email,
        data.password,
        requiredFields,
        "team"
      );

      const { user, error: authError } = (await Promise.race([
        signUpPromise,
        timeoutPromise,
      ])) as any;

      if (authError) {
        console.error("Auth error:", authError);
        alert("Registration failed: " + authError.message);
        return;
      }

      console.log("Team registered successfully:", user);
      setIsSubmitted(true);
    } catch (error: any) {
      console.error("Registration error:", error);
      if (error.message === "Request timeout") {
        alert("Registration timed out. Please try again.");
      } else {
        alert("Registration failed. Please try again.");
      }
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-red-50 via-white to-orange-50">
        <div className="text-center max-w-md w-full">
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Registration Successful!
            </h2>
            <p className="text-gray-600 mb-6">
              Thank you for registering your team. Check your email for a confirmation.
            </p>
            <div className="space-y-3">
              <Button
                onClick={() => {
                  // Force a page refresh to ensure navigation updates properly
                  window.location.href = "/dashboard";
                }}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 w-full"
              >
                Go to My Account
              </Button>
              <Button
                onClick={() => setIsSubmitted(false)}
                variant="outline"
                className="w-full border-gray-300 hover:border-red-300 text-gray-700 hover:text-red-700 font-semibold py-3 px-6 rounded-xl transition-all duration-200"
              >
                Register Another Team
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-white via-red-50 to-blue-100">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Content */}
      <div className="relative max-w-4xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-24 sm:h-24 bg-red-600 rounded-3xl mb-6 sm:mb-8 shadow-2xl">
            <Users className="h-8 w-8 sm:h-12 sm:w-12 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-red-600 mb-4 sm:mb-6 px-4">
            Find Passionate Students
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-4">
            Register your FIRST robotics team to find prospective students who
            match your needs.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8 sm:mb-12">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-red-600 h-2 rounded-full transition-all duration-300 ease-out"
              style={{
                width: `${
                  ((currentStep + 1) / (watch("isSchoolTeam") ? 13 : 12)) * 100
                }%`,
              }}
            ></div>
          </div>
        </div>

        {/* Form Container */}
        <div className="min-h-[500px] sm:min-h-[600px] relative overflow-hidden">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div
              className={`transition-all duration-300 ease-out ${
                isTransitioning
                  ? slideDirection === "right"
                    ? "opacity-0 transform -translate-x-full"
                    : "opacity-0 transform translate-x-full"
                  : "opacity-100 transform translate-x-0"
              }`}
            >
              {/* Step 0: Team Name */}
              {currentStep === 0 && (
                <div className="text-center">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 px-4">
                    What's your team name?
                  </h2>
                  <p className="text-gray-600 mb-6 sm:mb-8 px-4">
                    Let's start with the basics
                  </p>
                  <div className="max-w-md mx-auto px-4">
                    <Input
                      {...register("teamName")}
                      placeholder="Enter your team name"
                      className={`w-full px-4 sm:px-6 py-3 sm:py-4 text-lg sm:text-xl border-2 rounded-2xl focus:ring-4 transition-all duration-300 bg-white/90 backdrop-blur-sm text-center shadow-lg ${
                        stepErrors[0]
                          ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                          : "border-gray-200 focus:border-red-500 focus:ring-red-100"
                      }`}
                      autoFocus
                    />
                    {stepErrors[0] && (
                      <div className="text-red-600 text-sm font-medium bg-red-50 border border-red-200 rounded-lg p-3 mt-4">
                        {stepErrors[0]}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 1: Email */}
              {currentStep === 1 && (
                <div className="text-center">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 px-4">
                    What's your email address?
                  </h2>
                  <p className="text-gray-600 mb-6 sm:mb-8 px-4">
                    We'll use this to connect you with students
                  </p>
                  <div className="max-w-md mx-auto px-4">
                    <Input
                      type="email"
                      {...register("email")}
                      placeholder="Enter your email address"
                      className={`w-full px-4 sm:px-6 py-3 sm:py-4 text-lg sm:text-xl border-2 rounded-2xl focus:ring-4 transition-all duration-300 bg-white/90 backdrop-blur-sm text-center shadow-lg ${
                        stepErrors[1]
                          ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                          : "border-gray-200 focus:border-red-500 focus:ring-red-100"
                      }`}
                      autoFocus
                    />
                    {stepErrors[1] && (
                      <div className="text-red-600 text-sm font-medium bg-red-50 border border-red-200 rounded-lg p-3 mt-4">
                        {stepErrors[1]}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 2: Password */}
              {currentStep === 2 && (
                <div className="text-center">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 px-4">
                    Create your password
                  </h2>
                  <p className="text-gray-600 mb-6 sm:mb-8 px-4">
                    This will be your login password for your account
                  </p>
                  <div className="max-w-md mx-auto px-4">
                    <PasswordInput
                      value={watch("password") || ""}
                      onChange={(value) => setValue("password", value)}
                      placeholder="Enter your password"
                      className={`w-full px-4 sm:px-6 py-3 sm:py-4 text-lg sm:text-xl border-2 rounded-2xl focus:ring-4 transition-all duration-300 bg-white/90 backdrop-blur-sm text-center shadow-lg ${
                        stepErrors[2]
                          ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                          : "border-gray-200 focus:border-red-500 focus:ring-red-100"
                      }`}
                      error={stepErrors[2] || errors.password?.message}
                    />
                  </div>
                </div>
              )}

              {/* Step 3: FIRST Level */}
              {currentStep === 3 && (
                <div className="text-center">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">
                    What FIRST level is your team?
                  </h2>
                  <p className="text-gray-600 mb-8">
                    This helps us match you with the right students
                  </p>
                  <div className="max-w-md mx-auto">
                    <Select
                      onValueChange={(value) =>
                        setValue("firstLevel", value as any)
                      }
                    >
                      <SelectTrigger
                        className={`w-full px-6 py-4 text-xl border-2 rounded-2xl focus:ring-4 transition-all duration-300 bg-white/90 backdrop-blur-sm shadow-lg ${
                          stepErrors[3]
                            ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                            : "border-gray-200 focus:border-red-500 focus:ring-red-100"
                        }`}
                      >
                        <SelectValue placeholder="Select a FIRST level" />
                      </SelectTrigger>
                      <SelectContent>
                        {firstLevels.map((level) => (
                          <SelectItem key={level.value} value={level.value}>
                            {level.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {stepErrors[3] && (
                      <div className="text-red-600 text-sm font-medium bg-red-50 border border-red-200 rounded-lg p-3 mt-4">
                        {stepErrors[3]}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 4: Zip Code */}
              {currentStep === 4 && (
                <div className="text-center">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">
                    Where is your team located?
                  </h2>
                  <p className="text-gray-600 mb-8">
                    This helps us find local students
                  </p>
                  <div className="max-w-md mx-auto">
                    <Input
                      {...register("zipCode")}
                      placeholder="Enter your zip code"
                      className={`w-full px-6 py-4 text-xl border-2 rounded-2xl focus:ring-4 transition-all duration-300 bg-white/90 backdrop-blur-sm text-center shadow-lg ${
                        stepErrors[4]
                          ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                          : "border-gray-200 focus:border-red-500 focus:ring-red-100"
                      }`}
                      autoFocus
                    />
                    {stepErrors[4] && (
                      <div className="text-red-600 text-sm font-medium bg-red-50 border border-red-200 rounded-lg p-3 mt-4">
                        {stepErrors[4]}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 5: School Team */}
              {currentStep === 5 && (
                <div className="text-center">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">
                    Is this a school team?
                  </h2>
                  <p className="text-gray-600 mb-8">
                    This helps us understand your team structure
                  </p>
                  <div className="max-w-md mx-auto space-y-4">
                    <div
                      className={`flex items-center space-x-3 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                        watch("isSchoolTeam") === true
                          ? "border-red-500 bg-red-50"
                          : "border-gray-200 hover:border-red-300"
                      }`}
                      onClick={() => handleSchoolTeamToggle(true)}
                    >
                      <Checkbox
                        checked={watch("isSchoolTeam") === true}
                        onCheckedChange={() => handleSchoolTeamToggle(true)}
                      />
                      <span className="text-lg font-medium">
                        Yes, it's a school team
                      </span>
                    </div>
                    <div
                      className={`flex items-center space-x-3 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                        watch("isSchoolTeam") === false
                          ? "border-red-500 bg-red-50"
                          : "border-gray-200 hover:border-red-300"
                      }`}
                      onClick={() => handleSchoolTeamToggle(false)}
                    >
                      <Checkbox
                        checked={watch("isSchoolTeam") === false}
                        onCheckedChange={() => handleSchoolTeamToggle(false)}
                      />
                      <span className="text-lg font-medium">
                        No, it's a community team
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 6: School Name (if school team) */}
              {currentStep === 6 && watch("isSchoolTeam") && (
                <div className="text-center">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">
                    What's your school name?
                  </h2>
                  <p className="text-gray-600 mb-8">
                    This helps students identify your team
                  </p>
                  <div className="max-w-md mx-auto">
                    <Input
                      {...register("schoolName")}
                      placeholder="Enter your school name"
                      className="w-full px-6 py-4 text-xl border-2 border-gray-200 rounded-2xl focus:border-red-500 focus:ring-4 focus:ring-red-100 transition-all duration-300 bg-white/90 backdrop-blur-sm text-center shadow-lg"
                      autoFocus
                    />
                  </div>
                </div>
              )}

              {/* Step 7: Areas of Need */}
              {currentStep === 7 && (
                <div className="text-center">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">
                    What areas do you need help with?
                  </h2>
                  <p className="text-gray-600 mb-8">
                    Select all that apply to your team's needs
                  </p>
                  <div className="max-w-md mx-auto space-y-4">
                    {areasOfNeed.map((area) => (
                      <div
                        key={area.value}
                        className={`flex items-center space-x-3 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                          selectedAreas.includes(area.value)
                            ? "border-red-500 bg-red-50"
                            : stepErrors[7]
                            ? "border-red-300 hover:border-red-400"
                            : "border-gray-200 hover:border-red-300"
                        }`}
                        onClick={() => handleAreaToggle(area.value)}
                      >
                        <div onClick={(e) => e.stopPropagation()}>
                          <Checkbox
                            checked={selectedAreas.includes(area.value)}
                            onCheckedChange={() => handleAreaToggle(area.value)}
                          />
                        </div>
                        <span className="text-lg font-medium">
                          {area.label}
                        </span>
                      </div>
                    ))}
                    {stepErrors[7] && (
                      <div className="text-red-600 text-sm font-medium bg-red-50 border border-red-200 rounded-lg p-3 mt-4">
                        {stepErrors[7]}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 8: Age Range */}
              {currentStep === 8 && (
                <div className="text-center">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">
                    What grade range are you looking for?
                  </h2>
                  <p className="text-gray-600 mb-8">
                    This helps us match you with appropriate students
                  </p>
                  <div className="max-w-md mx-auto space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-lg font-medium text-gray-700">
                          Minimum Grade
                        </Label>
                        <Input
                          type="number"
                          {...register("gradeRangeMin", {
                            valueAsNumber: true,
                          })}
                          placeholder="Min grade"
                          min="1"
                          max="12"
                          className={`w-full px-6 py-4 text-xl border-2 rounded-2xl focus:ring-4 transition-all duration-300 bg-white/90 backdrop-blur-sm text-center shadow-lg ${
                            stepErrors[8]
                              ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                              : "border-gray-200 focus:border-red-500 focus:ring-red-100"
                          }`}
                          autoFocus
                        />
                        {stepErrors[8] && (
                          <div className="text-red-600 text-sm font-medium bg-red-50 border border-red-200 rounded-lg p-3 mt-3">
                            {stepErrors[8]}
                          </div>
                        )}
                      </div>
                      <div>
                        <Label className="text-lg font-medium text-gray-700">
                          Maximum Grade
                        </Label>
                        <Input
                          type="number"
                          {...register("gradeRangeMax", {
                            valueAsNumber: true,
                          })}
                          placeholder="Max grade"
                          min="1"
                          max="12"
                          className={`w-full px-6 py-4 text-xl border-2 rounded-2xl focus:ring-4 transition-all duration-300 bg-white/90 backdrop-blur-sm text-center shadow-lg ${
                            stepErrors[8]
                              ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                              : "border-gray-200 focus:border-red-500 focus:ring-red-100"
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 9: Time Commitment */}
              {currentStep === 9 && (
                <div className="text-center">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">
                    How many hours per week do you expect from students?
                  </h2>
                  <p className="text-gray-600 mb-8">
                    This helps students understand the commitment level
                  </p>
                  <div className="max-w-md mx-auto space-y-6">
                    <div className="text-4xl font-bold text-red-600 mb-4">
                      {timeCommitment[0]} hours/week
                    </div>
                    <Slider
                      value={timeCommitment}
                      onValueChange={handleTimeCommitmentChange}
                      max={30}
                      min={1}
                      step={1}
                      className="w-full team-form-slider"
                    />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>1 hour</span>
                      <span>30+ hours</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 10: Team Awards */}
              {currentStep === 10 && (
                <div className="text-center">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">
                    Tell us about your team's achievements
                  </h2>
                  <p className="text-gray-600 mb-8">
                    This helps students understand your team's experience and
                    success
                  </p>
                  <div className="max-w-md mx-auto">
                    <Textarea
                      {...register("teamAwards")}
                      placeholder="List your team's awards, achievements, years of experience, and notable accomplishments..."
                      rows={6}
                      className={`w-full px-6 py-4 text-lg border-2 rounded-2xl focus:ring-4 transition-all duration-300 bg-white/90 backdrop-blur-sm resize-none shadow-lg ${
                        stepErrors[10]
                          ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                          : "border-gray-200 focus:border-red-500 focus:ring-red-100"
                      }`}
                      autoFocus
                    />
                    {stepErrors[10] && (
                      <div className="text-red-600 text-sm font-medium bg-red-50 border border-red-200 rounded-lg p-3 mt-4">
                        {stepErrors[10]}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 11: Qualities */}
              {currentStep === 11 && (
                <div className="text-center">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">
                    What qualities are you looking for? (Select up to 3)
                  </h2>
                  <p className="text-gray-600 mb-8">
                    This helps students understand what you value in team
                    members
                  </p>
                  <div className="max-w-md mx-auto space-y-3">
                    {qualities.map((quality) => (
                      <div
                        key={quality.value}
                        className={`flex items-center space-x-3 p-4 rounded-2xl border-2 transition-all ${
                          selectedQualities.includes(quality.value)
                            ? "border-red-500 bg-red-50"
                            : selectedQualities.length >= 3 &&
                              !selectedQualities.includes(quality.value)
                            ? "border-gray-200 opacity-50 cursor-not-allowed"
                            : stepErrors[11]
                            ? "border-red-300 hover:border-red-400 cursor-pointer"
                            : "border-gray-200 hover:border-red-300 cursor-pointer"
                        }`}
                        onClick={() => {
                          if (
                            !(
                              selectedQualities.length >= 3 &&
                              !selectedQualities.includes(quality.value)
                            )
                          ) {
                            handleQualityToggle(quality.value);
                          }
                        }}
                      >
                        <div onClick={(e) => e.stopPropagation()}>
                          <Checkbox
                            checked={selectedQualities.includes(quality.value)}
                            onCheckedChange={() =>
                              handleQualityToggle(quality.value)
                            }
                            disabled={
                              !selectedQualities.includes(quality.value) &&
                              selectedQualities.length >= 3
                            }
                          />
                        </div>
                        <span className="text-lg font-medium">
                          {quality.label}
                        </span>
                      </div>
                    ))}
                    <p className="text-sm text-gray-500">
                      Selected: {selectedQualities.length}/3
                    </p>
                    {stepErrors[11] && (
                      <div className="text-red-600 text-sm font-medium bg-red-50 border border-red-200 rounded-lg p-3 mt-4">
                        {stepErrors[11]}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </form>

          {/* Navigation Buttons */}
          <div className="flex justify-center space-x-4 mt-8">
            {currentStep > 0 && (
              <Button
                onClick={prevStep}
                variant="outline"
                className="px-6 py-4 rounded-2xl border-2 border-gray-200 hover:border-red-300 transition-all duration-300"
              >
                Back
              </Button>
            )}

            {currentStep < (watch("isSchoolTeam") ? 12 : 11) ? (
              <Button
                onClick={nextStep}
                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-4 px-8 rounded-2xl text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            ) : (
              <Button
                onClick={() => {
                  console.log("Submit Registration button clicked");
                  console.log("Form errors:", errors);
                  console.log("Form values:", watch());
                  console.log("Step errors:", stepErrors);
                  console.log(
                    "Is form valid:",
                    Object.keys(errors).length === 0
                  );

                  // Validate the final step before submitting
                  const isValid = validateStep(11);
                  console.log("Final step validation result:", isValid);

                  if (isValid) {
                    console.log("Proceeding with form submission...");
                    handleSubmit(onSubmit)();
                  } else {
                    console.log("Validation failed, not submitting");
                    alert("Please fix the errors before submitting.");
                  }
                }}
                disabled={isSubmitting}
                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-4 px-8 rounded-2xl text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <span>Submitting...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <span>Submit Registration</span>
                    <ArrowRight className="ml-3 h-6 w-6" />
                  </div>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
