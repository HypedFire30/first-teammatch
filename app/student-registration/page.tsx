"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
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
import { CheckCircle } from "lucide-react";
import { signUp } from "@/lib/auth";
import { PasswordInput } from "@/components/ui/password-input";
import { InfoTooltip } from "@/components/ui/info-tooltip";

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

  useEffect(() => {
    setValue("timeCommitment", 10);
    setValue("areasOfInterest", []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    setTimeCommitment(value);
    setValue("timeCommitment", value[0]);
  };

  const validateStep = (step: number): boolean => {
    const currentValues = watch();
    let isValid = true;
    const newStepErrors = { ...stepErrors };

    switch (step) {
      case 0:
        if (
          !currentValues.firstName?.trim() ||
          !currentValues.lastName?.trim()
        ) {
          newStepErrors[0] = "Please enter your name";
          isValid = false;
        } else {
          delete newStepErrors[0];
        }
        break;
      case 1:
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (
          !currentValues.email?.trim() ||
          !emailRegex.test(currentValues.email)
        ) {
          newStepErrors[1] = "Please enter a valid email";
          isValid = false;
        } else {
          delete newStepErrors[1];
        }
        break;
      case 2:
        const password = currentValues.password || "";
        if (
          password.length < 8 ||
          !/[A-Z]/.test(password) ||
          !/\d/.test(password)
        ) {
          newStepErrors[2] =
            "Password must be 8+ chars with uppercase and number";
          isValid = false;
        } else {
          delete newStepErrors[2];
        }
        break;
      case 3:
        if (
          !currentValues.zipCode?.trim() ||
          currentValues.zipCode.length < 5
        ) {
          newStepErrors[3] = "Please enter a valid zip code";
          isValid = false;
        } else {
          delete newStepErrors[3];
        }
        break;
      case 4:
        if (!currentValues.firstLevel?.trim()) {
          newStepErrors[4] = "Please select a level";
          isValid = false;
        } else {
          delete newStepErrors[4];
        }
        break;
      case 5:
        if (
          !currentValues.areasOfInterest ||
          currentValues.areasOfInterest.length === 0
        ) {
          newStepErrors[5] = "Please select at least one";
          isValid = false;
        } else {
          delete newStepErrors[5];
        }
        break;
      case 6:
        const grade = currentValues.grade;
        if (!grade || grade < 1 || grade > 12) {
          newStepErrors[6] = "Please enter a valid grade (1-12)";
          isValid = false;
        } else {
          delete newStepErrors[6];
        }
        break;
      case 7:
        if (!currentValues.school?.trim()) {
          newStepErrors[7] = "Please enter your school";
          isValid = false;
        } else {
          delete newStepErrors[7];
        }
        break;
      case 8:
        delete newStepErrors[8];
        break;
      case 9:
        delete newStepErrors[9];
        break;
      case 10:
        if (
          !currentValues.impressiveThings?.trim() ||
          currentValues.impressiveThings.trim().length < 10
        ) {
          newStepErrors[10] = "Please provide more details";
          isValid = false;
        } else {
          delete newStepErrors[10];
        }
        break;
      case 11:
        if (
          !currentValues.whyJoinTeam?.trim() ||
          currentValues.whyJoinTeam.trim().length < 10
        ) {
          newStepErrors[11] = "Please provide more details";
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
    if (!validateStep(currentStep)) {
      return;
    }
    setCurrentStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const onSubmit = async (data: StudentRegistrationForm) => {
    if (isSubmitting) return; // Prevent double submission

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
          resume_file: resumeFile,
          impressive_things: data.impressiveThings,
          why_join_team: data.whyJoinTeam,
        },
        "student"
      );

      if (authError) {
        alert("Registration failed: " + authError.message);
        return;
      }

      setIsSubmitted(true);
    } catch (error: any) {
      alert("Registration failed. Please try again.");
    }
  };

  if (isSubmitted) {
    return (
      <div
        className="flex items-center justify-center overflow-hidden bg-white"
        style={{ height: "calc(100vh - 4rem)" }}
      >
        <div className="text-center max-w-md w-full px-6 sm:px-8 lg:px-12">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            You're Signed Up!
          </h2>
          <p className="text-gray-600 mb-6">
            Check your email for a confirmation.
          </p>
          <button
            onClick={() => {
              window.location.href = "/dashboard";
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const getQuestion = (step: number) => {
    const questions = [
      "What's your name?",
      "What's your email?",
      "Create a password",
      "What's your zip code?",
      "What's your FIRST experience level?",
      "What interests you most?",
      "What grade are you in?",
      "What school do you attend?",
      "How many hours per week can you commit?",
      "Upload your resume (optional)",
      "What are three impressive things you've done?",
      "Why do you want to join a team?",
    ];
    return questions[step] || "";
  };

  const totalSteps = 12;

  return (
    <div
      className="bg-white flex items-center justify-center overflow-hidden"
      style={{ height: "calc(100vh - 4rem)" }}
    >
      <div className="w-full max-w-3xl px-6 sm:px-8 lg:px-12">
        <form 
          onSubmit={handleSubmit(onSubmit)}
          onKeyDown={(e) => {
            // Prevent form submission on Enter key when on last step
            if (e.key === "Enter" && currentStep >= 11) {
              e.preventDefault();
            }
          }}
        >
          <div className="relative">
            {/* Progress indicator */}
            <div className="mb-8">
              <div className="flex items-center justify-between text-sm text-gray-400 mb-3">
                <span>
                  Question {currentStep + 1} of {totalSteps}
                </span>
                <span>
                  {Math.round(((currentStep + 1) / totalSteps) * 100)}%
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
                  style={{
                    width: `${((currentStep + 1) / totalSteps) * 100}%`,
                  }}
                />
              </div>
            </div>

            {/* Question */}
            <div className="mb-8 transition-all duration-300 ease-in-out form-step-enter">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-semibold text-gray-900">
                  {getQuestion(currentStep)}
                </h2>
                <InfoTooltip
                  content="By submitting this form, you consent to the use of your name, email address, grade level, and qualifications for the purpose of matching you with qualified FIRST robotics teams. Your information will only be shared with registered teams for matching purposes. You must be at least 13 years of age to use this form, and by submitting this form, you agree that you have obtained parental consent to submit it."
                />
              </div>

              {/* Input fields */}
              <div className="space-y-4">
                {currentStep === 0 && (
                  <>
                    <Input
                      {...register("firstName")}
                      placeholder="First name"
                      className="w-full text-lg border border-gray-200 rounded-lg focus:border-blue-600 px-5 py-4 focus:ring-2 focus:ring-blue-600 transition-colors"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && watch("firstName")) {
                          e.preventDefault();
                          document.getElementById("lastName")?.focus();
                        }
                      }}
                    />
                    <Input
                      {...register("lastName")}
                      id="lastName"
                      placeholder="Last name"
                      className="w-full text-lg border border-gray-200 rounded-lg focus:border-blue-600 px-5 py-4 focus:ring-2 focus:ring-blue-600 transition-colors"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          nextStep();
                        }
                      }}
                    />
                  </>
                )}

                {currentStep === 1 && (
                  <Input
                    type="email"
                    {...register("email")}
                    placeholder="your@email.com"
                    className="w-full text-lg border border-gray-200 rounded-lg focus:border-blue-600 px-5 py-4 focus:ring-2 focus:ring-blue-600 transition-colors"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        nextStep();
                      }
                    }}
                  />
                )}

                {currentStep === 2 && (
                  <PasswordInput
                    value={watch("password") || ""}
                    onChange={(value) => setValue("password", value)}
                    placeholder="Enter password"
                    className="w-full text-lg border border-gray-200 rounded-lg focus:border-blue-600 px-5 py-4 focus:ring-2 focus:ring-blue-600 transition-colors"
                    error={stepErrors[2] || errors.password?.message}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        nextStep();
                      }
                    }}
                  />
                )}

                {currentStep === 3 && (
                  <Input
                    {...register("zipCode")}
                    placeholder="12345"
                    className="w-full text-lg border border-gray-200 rounded-lg focus:border-blue-600 px-5 py-4 focus:ring-2 focus:ring-blue-600 transition-colors"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        nextStep();
                      }
                    }}
                  />
                )}

                {currentStep === 4 && (
                  <Select
                    value={watch("firstLevel")}
                    onValueChange={(value) => {
                      setValue("firstLevel", value as any);
                      setTimeout(() => nextStep(), 300);
                    }}
                  >
                    <SelectTrigger className="w-full text-lg border border-gray-200 rounded-lg focus:border-blue-600 px-5 py-4 focus:ring-2 focus:ring-blue-600 h-auto">
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      {firstLevels.map((level) => (
                        <SelectItem key={level.value} value={level.value}>
                          {level.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}

                {currentStep === 5 && (
                  <div 
                    className="space-y-3"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && selectedAreas.length > 0) {
                        e.preventDefault();
                        nextStep();
                      }
                    }}
                    tabIndex={0}
                  >
                    {areasOfInterest.map((area) => (
                      <label
                        key={area.value}
                        className="flex items-center space-x-3 cursor-pointer"
                      >
                        <Checkbox
                          checked={selectedAreas.includes(area.value)}
                          onCheckedChange={() => handleAreaToggle(area.value)}
                        />
                        <span className="text-lg">{area.label}</span>
                      </label>
                    ))}
                  </div>
                )}

                {currentStep === 6 && (
                  <Input
                    type="number"
                    {...register("grade", { valueAsNumber: true })}
                    placeholder="9"
                    min="1"
                    max="12"
                    className="w-full text-lg border border-gray-200 rounded-lg focus:border-blue-600 px-5 py-4 focus:ring-2 focus:ring-blue-600 transition-colors"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        nextStep();
                      }
                    }}
                  />
                )}

                {currentStep === 7 && (
                  <Input
                    {...register("school")}
                    placeholder="School name"
                    className="w-full text-lg border border-gray-200 rounded-lg focus:border-blue-600 px-5 py-4 focus:ring-2 focus:ring-blue-600 transition-colors"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        nextStep();
                      }
                    }}
                  />
                )}

                {currentStep === 8 && (
                  <div 
                    className="space-y-4"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        nextStep();
                      }
                    }}
                    tabIndex={0}
                  >
                    <div className="text-3xl font-light text-gray-900">
                      {timeCommitment[0]} hours/week
                    </div>
                    <Slider
                      value={timeCommitment}
                      onValueChange={handleTimeCommitmentChange}
                      max={30}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-400">
                      <span>1 hour</span>
                      <span>30+ hours</span>
                    </div>
                  </div>
                )}

                {currentStep === 9 && (
                  <div
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        nextStep();
                      }
                    }}
                    tabIndex={0}
                  >
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      className="hidden"
                      id="resume-upload"
                    />
                    <label
                      htmlFor="resume-upload"
                      className="block text-lg text-blue-600 hover:text-blue-700 cursor-pointer border-b-2 border-blue-600 pb-1 inline-block"
                    >
                      {resumeFile ? resumeFile.name : "Choose file (optional)"}
                    </label>
                  </div>
                )}

                {currentStep === 10 && (
                  <Textarea
                    {...register("impressiveThings")}
                    placeholder="Describe your achievements..."
                    className="w-full text-lg border border-gray-200 rounded-lg focus:border-blue-600 px-5 py-4 focus:ring-2 focus:ring-blue-600 transition-colors resize-none"
                    rows={4}
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                        e.preventDefault();
                        nextStep();
                      }
                    }}
                  />
                )}

                {currentStep === 11 && (
                  <Textarea
                    {...register("whyJoinTeam")}
                    placeholder="Explain your motivation..."
                    className="w-full text-lg border border-gray-200 rounded-lg focus:border-blue-600 px-5 py-4 focus:ring-2 focus:ring-blue-600 transition-colors resize-none"
                    rows={4}
                    autoFocus
                  />
                )}

                {stepErrors[currentStep] && (
                  <p className="text-red-500 text-sm mt-2">
                    {stepErrors[currentStep]}
                  </p>
                )}
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8">
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 0}
                className="text-lg text-gray-600 hover:text-gray-900 disabled:opacity-0 disabled:cursor-not-allowed transition-colors font-medium"
              >
                ← Back
              </button>

              {currentStep < 11 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="text-lg text-blue-600 hover:text-blue-700 font-semibold transition-colors"
                >
                  Next →
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="text-lg text-blue-600 hover:text-blue-700 font-semibold disabled:opacity-50 transition-colors"
                >
                  {isSubmitting ? "Submitting..." : "Submit →"}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
