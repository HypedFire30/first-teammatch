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
import { UserPlus, Upload, CheckCircle, Clock, ArrowRight } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabase";
import { signUp } from "@/lib/auth";
import { PasswordInput } from "@/components/ui/password-input";

const studentRegistrationSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/\d/, "Password must contain at least one number"),
  firstLevel: z.string().min(1, "Please select your FIRST level"),
  areasOfInterest: z
    .array(z.string())
    .min(1, "Please select at least one area of interest"),
  grade: z
    .number()
    .min(1, "Please enter your grade")
    .max(12, "Grade must be between 1 and 12"),
  zipCode: z
    .string()
    .min(5, "Please enter a valid zip code")
    .max(10, "Please enter a valid zip code"),
  school: z.string().min(1, "Please enter your school name"),
  timeCommitment: z.number().min(1, "Time commitment is required"),
  resume: z.instanceof(File).optional(),
  impressiveThings: z
    .string()
    .min(
      10,
      "Please describe your impressive achievements (at least 10 characters)"
    ),
  whyJoinTeam: z
    .string()
    .min(
      10,
      "Please explain why you want to join a team (at least 10 characters)"
    ),
});

type StudentRegistrationForm = z.infer<typeof studentRegistrationSchema>;

const firstLevels = [
  { value: "jr-first-lego-league", label: "Jr. FIRST Lego League" },
  { value: "first-lego-league", label: "FIRST Lego League" },
  { value: "first-tech-challenge", label: "FIRST Tech Challenge" },
  { value: "first-robotics-competition", label: "FIRST Robotics Competition" },
];

const areasOfInterest = [
  { value: "hardware", label: "Hardware" },
  { value: "software", label: "Software" },
  { value: "outreach", label: "Outreach" },
];

export default function StudentRegistrationPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
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
  } = useForm<StudentRegistrationForm>({
    resolver: zodResolver(studentRegistrationSchema),
    defaultValues: {
      timeCommitment: 10,
      areasOfInterest: [],
    },
  });

  // Set the time commitment value when component mounts
  useEffect(() => {
    setValue("timeCommitment", 10);
    setValue("areasOfInterest", []);
  }, [setValue]);

  const handleAreaToggle = (area: string) => {
    const newSelectedAreas = selectedAreas.includes(area)
      ? selectedAreas.filter((a) => a !== area)
      : [...selectedAreas, area];

    setSelectedAreas(newSelectedAreas);
    setValue("areasOfInterest", newSelectedAreas);
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setResumeFile(file);
      setValue("resume", file);
    }
  };

  const handleTimeCommitmentChange = (value: number[]) => {
    console.log("Time commitment changed to:", value[0]);
    setTimeCommitment(value);
    setValue("timeCommitment", value[0]);
  };

  // Validation functions for each step
  const validateStep = (step: number): boolean => {
    const currentValues = watch();
    let isValid = true;
    const newStepErrors = { ...stepErrors };

    switch (step) {
      case 0: // Name
        if (!currentValues.firstName?.trim()) {
          newStepErrors[0] = "First name is required";
          isValid = false;
        } else if (!currentValues.lastName?.trim()) {
          newStepErrors[0] = "Last name is required";
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

      case 3: // Zip Code
        if (!currentValues.zipCode?.trim()) {
          newStepErrors[3] = "Zip code is required";
          isValid = false;
        } else if (currentValues.zipCode.length < 5) {
          newStepErrors[3] = "Please enter a valid zip code";
          isValid = false;
        } else {
          delete newStepErrors[3];
        }
        break;

      case 4: // FIRST Level
        if (!currentValues.firstLevel?.trim()) {
          newStepErrors[4] = "Please select your FIRST level";
          isValid = false;
        } else {
          delete newStepErrors[4];
        }
        break;

      case 5: // Areas of Interest
        if (
          !currentValues.areasOfInterest ||
          currentValues.areasOfInterest.length === 0
        ) {
          newStepErrors[5] = "Please select at least one area of interest";
          isValid = false;
        } else {
          delete newStepErrors[5];
        }
        break;

      case 6: // Grade
        const grade = currentValues.grade;
        if (!grade || grade < 1 || grade > 12) {
          newStepErrors[6] = "Please enter a valid grade (1-12)";
          isValid = false;
        } else {
          delete newStepErrors[6];
        }
        break;

      case 7: // School
        if (!currentValues.school?.trim()) {
          newStepErrors[7] = "School name is required";
          isValid = false;
        } else {
          delete newStepErrors[7];
        }
        break;

      case 8: // Time Commitment (always valid since slider has default value)
        delete newStepErrors[8];
        break;

      case 9: // Resume (optional)
        delete newStepErrors[9];
        break;

      case 10: // Impressive Things
        if (!currentValues.impressiveThings?.trim()) {
          newStepErrors[10] = "Please describe your impressive achievements";
          isValid = false;
        } else if (currentValues.impressiveThings.trim().length < 10) {
          newStepErrors[10] =
            "Please provide more details (at least 10 characters)";
          isValid = false;
        } else {
          delete newStepErrors[10];
        }
        break;

      case 11: // Why Join Team
        if (!currentValues.whyJoinTeam?.trim()) {
          newStepErrors[11] = "Please explain why you want to join a team";
          isValid = false;
        } else if (currentValues.whyJoinTeam.trim().length < 10) {
          newStepErrors[11] =
            "Please provide more details (at least 10 characters)";
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
      setCurrentStep((prev) => prev + 1);
      setIsTransitioning(false);
    }, 300);
  };

  const prevStep = () => {
    setSlideDirection("left");
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentStep((prev) => prev - 1);
      setIsTransitioning(false);
    }, 300);
  };

  const goToStep = (step: number) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentStep(step);
      setIsTransitioning(false);
    }, 300);
  };

  const onSubmit = async (data: StudentRegistrationForm) => {
    console.log("=== onSubmit FUNCTION CALLED ===");
    console.log("Submitting student form:", data);

    try {
      const { user, error: authError } = await signUp(
        data.email,
        data.password,
        {
          name: `${data.firstName} ${data.lastName}`,
          email: data.email,
          zip_code: data.zipCode,
          first_level: data.firstLevel,
          areas_of_interest: data.areasOfInterest,
          grade: data.grade,
          school: data.school,
          time_commitment: data.timeCommitment,
          resume_file: resumeFile, // Pass the actual file object
          impressive_things: data.impressiveThings,
          why_join_team: data.whyJoinTeam,
        },
        "student"
      );

      if (authError) {
        console.error("Auth error:", authError);
        alert("Registration failed: " + authError.message);
        return;
      }

      console.log("Student registered successfully:", user);
      setIsSubmitted(true);
    } catch (error: any) {
      console.error("Registration error:", error);
      alert("Registration failed. Please try again.");
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="text-center max-w-md w-full">
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              You're Signed Up!
            </h2>
            <p className="text-gray-600 mb-6">
              Thank you for signing up. Check your email for a confirmation.
            </p>
            <Button
              onClick={() => {
                // Force a page refresh to ensure navigation updates properly
                window.location.href = "/dashboard";
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
            >
              Go to My Account
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-white via-blue-50 to-red-100">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative max-w-4xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl mb-6 sm:mb-8 shadow-2xl">
            <UserPlus className="h-8 w-8 sm:h-12 sm:w-12 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4 sm:mb-6 px-4">
            Find Your Perfect Team
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-4">
            Join thousands of students who've found their robotics family. Let's
            discover the team that matches your passion and skills.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8 sm:mb-12">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${((currentStep + 1) / 12) * 100}%` }}
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
              {currentStep === 0 && (
                <div className="text-center">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 px-4">
                    What's your name?
                  </h2>
                  <p className="text-gray-600 mb-6 sm:mb-8 px-4">
                    Let's start with the basics
                  </p>
                  <div className="max-w-md mx-auto px-4 space-y-4">
                    <Input
                      {...register("firstName")}
                      placeholder="Enter your first name"
                      className={`w-full px-4 sm:px-6 py-3 sm:py-4 text-lg sm:text-xl border-2 rounded-2xl focus:ring-4 transition-all duration-300 bg-white/90 backdrop-blur-sm text-center shadow-lg ${
                        stepErrors[0]
                          ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                          : "border-gray-200 focus:border-blue-500 focus:ring-blue-100"
                      }`}
                      autoFocus
                    />
                    <Input
                      {...register("lastName")}
                      placeholder="Enter your last name"
                      className={`w-full px-4 sm:px-6 py-3 sm:py-4 text-lg sm:text-xl border-2 rounded-2xl focus:ring-4 transition-all duration-300 bg-white/90 backdrop-blur-sm text-center shadow-lg ${
                        stepErrors[0]
                          ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                          : "border-gray-200 focus:border-blue-500 focus:ring-blue-100"
                      }`}
                    />
                    {stepErrors[0] && (
                      <div className="text-red-600 text-sm font-medium bg-red-50 border border-red-200 rounded-lg p-3">
                        {stepErrors[0]}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {currentStep === 1 && (
                <div className="text-center">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 px-4">
                    What's your email?
                  </h2>
                  <p className="text-gray-600 mb-6 sm:mb-8 px-4">
                    We'll use this to connect you with teams
                  </p>
                  <div className="max-w-md mx-auto px-4">
                    <Input
                      type="email"
                      {...register("email")}
                      placeholder="Enter your email address"
                      className={`w-full px-4 sm:px-6 py-3 sm:py-4 text-lg sm:text-xl border-2 rounded-2xl focus:ring-4 transition-all duration-300 bg-white/90 backdrop-blur-sm text-center shadow-lg ${
                        stepErrors[1]
                          ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                          : "border-gray-200 focus:border-blue-500 focus:ring-blue-100"
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
                          : "border-gray-200 focus:border-blue-500 focus:ring-blue-100"
                      }`}
                      error={stepErrors[2] || errors.password?.message}
                    />
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="text-center">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">
                    Where are you located?
                  </h2>
                  <p className="text-gray-600 mb-8">
                    We'll find teams near you
                  </p>
                  <div className="max-w-md mx-auto">
                    <Input
                      {...register("zipCode")}
                      placeholder="Enter your zip code"
                      className={`w-full px-6 py-4 text-xl border-2 rounded-2xl focus:ring-4 transition-all duration-300 bg-white/90 backdrop-blur-sm text-center shadow-lg ${
                        stepErrors[3]
                          ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                          : "border-gray-200 focus:border-blue-500 focus:ring-blue-100"
                      }`}
                      autoFocus
                    />
                    {stepErrors[3] && (
                      <div className="text-red-600 text-sm font-medium bg-red-50 border border-red-200 rounded-lg p-3 mt-4">
                        {stepErrors[3]}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div className="text-center">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">
                    What's your FIRST experience level?
                  </h2>
                  <p className="text-gray-600 mb-8">
                    This helps us match you with the right team
                  </p>
                  <div className="max-w-md mx-auto">
                    <Select
                      value={watch("firstLevel")}
                      onValueChange={(value) =>
                        setValue("firstLevel", value as any)
                      }
                    >
                      <SelectTrigger
                        className={`w-full px-6 py-4 text-xl border-2 rounded-2xl focus:ring-4 transition-all duration-300 bg-white/90 backdrop-blur-sm shadow-lg ${
                          stepErrors[4]
                            ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                            : "border-gray-200 focus:border-blue-500 focus:ring-blue-100"
                        }`}
                      >
                        <SelectValue placeholder="Select your FIRST level" />
                      </SelectTrigger>
                      <SelectContent>
                        {firstLevels.map((level) => (
                          <SelectItem key={level.value} value={level.value}>
                            {level.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {stepErrors[4] && (
                      <div className="text-red-600 text-sm font-medium bg-red-50 border border-red-200 rounded-lg p-3 mt-4">
                        {stepErrors[4]}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {currentStep === 5 && (
                <div className="text-center">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">
                    What interests you most?
                  </h2>
                  <p className="text-gray-600 mb-8">Select all that apply</p>
                  <div className="max-w-md mx-auto space-y-4">
                    {areasOfInterest.map((area) => (
                      <div
                        key={area.value}
                        className={`flex items-center space-x-3 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                          selectedAreas.includes(area.value)
                            ? "border-blue-500 bg-blue-50"
                            : stepErrors[5]
                            ? "border-red-300 hover:border-red-400"
                            : "border-gray-200 hover:border-blue-300"
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
                    {stepErrors[5] && (
                      <div className="text-red-600 text-sm font-medium bg-red-50 border border-red-200 rounded-lg p-3 mt-4">
                        {stepErrors[5]}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {currentStep === 6 && (
                <div className="text-center">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">
                    What grade are you in?
                  </h2>
                  <p className="text-gray-600 mb-8">
                    This helps teams understand your academic level
                  </p>
                  <div className="max-w-md mx-auto">
                    <Input
                      type="number"
                      {...register("grade", { valueAsNumber: true })}
                      placeholder="Enter your grade"
                      className={`w-full px-6 py-4 text-xl border-2 rounded-2xl focus:ring-4 transition-all duration-300 bg-white/90 backdrop-blur-sm text-center shadow-lg ${
                        stepErrors[6]
                          ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                          : "border-gray-200 focus:border-blue-500 focus:ring-blue-100"
                      }`}
                      autoFocus
                    />
                    {stepErrors[6] && (
                      <div className="text-red-600 text-sm font-medium bg-red-50 border border-red-200 rounded-lg p-3 mt-4">
                        {stepErrors[6]}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {currentStep === 7 && (
                <div className="text-center">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">
                    What school do you attend?
                  </h2>
                  <p className="text-gray-600 mb-8">
                    This helps teams understand your background
                  </p>
                  <div className="max-w-md mx-auto">
                    <Input
                      {...register("school")}
                      placeholder="Enter your school name"
                      className={`w-full px-6 py-4 text-xl border-2 rounded-2xl focus:ring-4 transition-all duration-300 bg-white/90 backdrop-blur-sm text-center shadow-lg ${
                        stepErrors[7]
                          ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                          : "border-gray-200 focus:border-blue-500 focus:ring-blue-100"
                      }`}
                      autoFocus
                    />
                    {stepErrors[7] && (
                      <div className="text-red-600 text-sm font-medium bg-red-50 border border-red-200 rounded-lg p-3 mt-4">
                        {stepErrors[7]}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {currentStep === 8 && (
                <div className="text-center">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">
                    How much time can you commit?
                  </h2>
                  <p className="text-gray-600 mb-8">
                    Teams want to know your availability
                  </p>
                  <div className="max-w-md mx-auto">
                    <div className="text-4xl font-bold text-blue-600 mb-4">
                      {timeCommitment[0]} hours/week
                    </div>
                    <Slider
                      value={timeCommitment}
                      onValueChange={handleTimeCommitmentChange}
                      max={30}
                      min={1}
                      step={1}
                      className="w-full mb-4"
                    />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>1 hour</span>
                      <span>30+ hours</span>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 9 && (
                <div className="text-center">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">
                    Upload your resume (optional)
                  </h2>
                  <p className="text-gray-600 mb-8">
                    Help teams learn more about your experience
                  </p>
                  <div className="max-w-md mx-auto">
                    <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 hover:border-blue-500 transition-colors duration-300">
                      <div className="text-center">
                        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <div className="text-lg font-medium text-gray-900 mb-2">
                          {resumeFile ? resumeFile.name : "Choose a file"}
                        </div>
                        <p className="text-sm text-gray-500 mb-4">
                          PDF, DOC, or DOCX (max 10MB)
                        </p>
                        <Input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={handleFileChange}
                          className="hidden"
                          id="resume-upload"
                        />
                        <Label
                          htmlFor="resume-upload"
                          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-xl cursor-pointer transition-all duration-300 inline-block"
                        >
                          {resumeFile ? "Change File" : "Browse Files"}
                        </Label>
                      </div>
                    </div>
                    {resumeFile && (
                      <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl">
                        <div className="flex items-center">
                          <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                          <span className="text-green-800 font-medium">
                            {resumeFile.name} selected
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {currentStep === 10 && (
                <div className="text-center">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 px-4">
                    What are three impressive things you've done?
                  </h2>
                  <p className="text-gray-600 mb-6 sm:mb-8 px-4">
                    Help teams understand your achievements
                  </p>
                  <div className="max-w-2xl mx-auto px-4">
                    <Textarea
                      {...register("impressiveThings")}
                      placeholder="Describe three impressive accomplishments, projects, or experiences you've had..."
                      className={`w-full px-4 sm:px-6 py-3 sm:py-4 text-lg border-2 rounded-2xl focus:ring-4 transition-all duration-300 bg-white/90 backdrop-blur-sm shadow-lg ${
                        stepErrors[10]
                          ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                          : "border-gray-200 focus:border-blue-500 focus:ring-blue-100"
                      }`}
                      rows={6}
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

              {currentStep === 11 && (
                <div className="text-center">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 px-4">
                    Why do you want to join a team?
                  </h2>
                  <p className="text-gray-600 mb-6 sm:mb-8 px-4">
                    Help teams understand your motivation
                  </p>
                  <div className="max-w-2xl mx-auto px-4">
                    <Textarea
                      {...register("whyJoinTeam")}
                      placeholder="Explain your motivation for joining a FIRST Robotics team. Think about the qualities teams are looking for in prospects."
                      className={`w-full px-4 sm:px-6 py-3 sm:py-4 text-lg border-2 rounded-2xl focus:ring-4 transition-all duration-300 bg-white/90 backdrop-blur-sm shadow-lg ${
                        stepErrors[11]
                          ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                          : "border-gray-200 focus:border-blue-500 focus:ring-blue-100"
                      }`}
                      rows={6}
                      autoFocus
                    />
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
                className="px-6 py-4 rounded-2xl border-2 border-gray-200 hover:border-gray-300 transition-all duration-300"
              >
                Back
              </Button>
            )}

            {currentStep < 11 ? (
              <Button
                onClick={nextStep}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-4 px-8 rounded-2xl text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            ) : (
              <Button
                onClick={() => {
                  console.log("Start Your Journey button clicked");
                  console.log("Form errors:", errors);
                  console.log("Form values:", watch());
                  console.log(
                    "Is form valid:",
                    Object.keys(errors).length === 0
                  );

                  // Validate the final step before submitting
                  if (validateStep(11)) {
                    handleSubmit(onSubmit)();
                  }
                }}
                disabled={isSubmitting}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-4 px-8 rounded-2xl text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Creating Your Profile...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <span>Start Your Journey</span>
                    <ArrowRight className="ml-2 h-5 w-5" />
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
