"use client";

import React, { useState } from "react";
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
  isSchoolTeam: z.boolean().nullable().optional(),
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
  const [stepErrors, setStepErrors] = useState<{ [key: number]: string }>({});
  const [isExplicitSubmit, setIsExplicitSubmit] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<TeamRegistrationForm>({
    resolver: zodResolver(teamRegistrationSchema),
    mode: "onSubmit", // Only validate on submit, not on change
    defaultValues: {
      firstLevel: "",
      zipCode: "",
      gradeRangeMin: 6,
      gradeRangeMax: 12,
      timeCommitment: 10,
      areasOfNeed: [],
      qualities: [],
    },
  });

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

  const validateStep = (step: number): boolean => {
    const currentValues = watch();
    let isValid = true;
    const newStepErrors = { ...stepErrors };

    switch (step) {
      case 0:
        if (!currentValues.teamName?.trim()) {
          newStepErrors[0] = "Please enter team name";
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
        if (!currentValues.firstLevel?.trim()) {
          newStepErrors[3] = "Please select a level";
          isValid = false;
        } else {
          delete newStepErrors[3];
        }
        break;
      case 4:
        if (
          !currentValues.zipCode?.trim() ||
          currentValues.zipCode.length < 5
        ) {
          newStepErrors[4] = "Please enter a valid zip code";
          isValid = false;
        } else {
          delete newStepErrors[4];
        }
        break;
      case 5:
        delete newStepErrors[5];
        break;
      case 6:
        if (currentValues.isSchoolTeam && !currentValues.schoolName?.trim()) {
          newStepErrors[6] = "Please enter school name";
          isValid = false;
        } else {
          delete newStepErrors[6];
        }
        break;
      case 7:
        if (
          !currentValues.areasOfNeed ||
          currentValues.areasOfNeed.length === 0
        ) {
          newStepErrors[7] = "Please select at least one";
          isValid = false;
        } else {
          delete newStepErrors[7];
        }
        break;
      case 8:
        const minGrade = currentValues.gradeRangeMin;
        const maxGrade = currentValues.gradeRangeMax;
        if (
          !minGrade ||
          minGrade < 1 ||
          minGrade > 12 ||
          !maxGrade ||
          maxGrade < 1 ||
          maxGrade > 12 ||
          minGrade > maxGrade
        ) {
          newStepErrors[8] = "Please enter valid grades";
          isValid = false;
        } else {
          delete newStepErrors[8];
        }
        break;
      case 9:
        delete newStepErrors[9];
        break;
      case 10:
        if (
          !currentValues.teamAwards?.trim() ||
          currentValues.teamAwards.trim().length < 10
        ) {
          newStepErrors[10] = "Please provide more details";
          isValid = false;
        } else {
          delete newStepErrors[10];
        }
        break;
      case 11:
        if (!currentValues.qualities || currentValues.qualities.length === 0) {
          newStepErrors[11] = "Please select at least one";
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

    const maxStep = watch("isSchoolTeam") === true ? 12 : 11;

    // Prevent going beyond the last step
    if (currentStep >= maxStep) {
      return;
    }

    // Skip school name step if not a school team
    if (currentStep === 5 && watch("isSchoolTeam") !== true) {
      setCurrentStep(7);
    } else {
      setCurrentStep((prev) => Math.min(prev + 1, maxStep));
    }
  };

  const prevStep = () => {
    // Skip school name step when going back if not a school team
    if (currentStep === 7 && !watch("isSchoolTeam")) {
      setCurrentStep(5);
    } else {
      setCurrentStep((prev) => Math.max(prev - 1, 0));
    }
  };

  const onSubmit = async (data: TeamRegistrationForm) => {
    if (isSubmitting) return; // Prevent double submission

    try {
      const { user, error: authError } = await signUp(
        data.email,
        data.password,
        {
          team_name: data.teamName,
          email: data.email,
          first_level: data.firstLevel,
          zip_code: data.zipCode,
          areas_of_need: data.areasOfNeed,
          grade_range_min: data.gradeRangeMin,
          grade_range_max: data.gradeRangeMax,
          time_commitment: data.timeCommitment,
          qualities: data.qualities,
          is_school_team: data.isSchoolTeam,
          school_name: data.schoolName || null,
          team_awards: data.teamAwards,
        },
        "team"
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
            Registration Successful!
          </h2>
          <p className="text-gray-600 mb-6">
            Check your email for a confirmation.
          </p>
          <button
            onClick={() => {
              window.location.href = "/dashboard";
            }}
            className="bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const totalSteps = watch("isSchoolTeam") ? 13 : 12;

  return (
    <div
      className="bg-white flex items-center justify-center overflow-hidden"
      style={{ height: "calc(100vh - 4rem)" }}
    >
      <div className="w-full max-w-3xl px-6 sm:px-8 lg:px-12">
        <form
          onSubmit={(e) => {
            // Only allow submission when explicitly clicking the submit button on the last step
            const maxStep = watch("isSchoolTeam") === true ? 12 : 11;
            if (!isExplicitSubmit || currentStep < maxStep) {
              e.preventDefault();
              return;
            }
            handleSubmit(onSubmit)(e);
          }}
          onKeyDown={(e) => {
            // Prevent form submission on Enter key when on last step
            const maxStep = watch("isSchoolTeam") === true ? 12 : 11;
            if (e.key === "Enter" && currentStep >= maxStep) {
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
                  className="bg-red-600 h-2 rounded-full transition-all duration-300 ease-out"
                  style={{
                    width: `${((currentStep + 1) / totalSteps) * 100}%`,
                  }}
                />
              </div>
            </div>

            {/* Question */}
            <div className="mb-8 transition-all duration-300 ease-in-out form-step-enter">
              {/* Input fields */}
              <div className="space-y-4">
                {currentStep === 0 && (
                  <>
                    <h2 className="text-3xl font-semibold text-gray-900 mb-8">
                      What's your team name?
                    </h2>
                    <Input
                      {...register("teamName")}
                      placeholder="Team name"
                      className="w-full text-lg border border-gray-200 rounded-lg focus:border-red-600 px-5 py-4 focus:ring-2 focus:ring-red-600 transition-colors"
                      autoFocus
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
                  <>
                    <h2 className="text-3xl font-semibold text-gray-900 mb-8">
                      What's your email?
                    </h2>
                    <Input
                      type="email"
                      {...register("email")}
                      placeholder="your@email.com"
                      className="w-full text-lg border border-gray-200 rounded-lg focus:border-red-600 px-5 py-4 focus:ring-2 focus:ring-red-600 transition-colors"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          nextStep();
                        }
                      }}
                    />
                  </>
                )}

                {currentStep === 2 && (
                  <>
                    <h2 className="text-3xl font-semibold text-gray-900 mb-8">
                      Create a password
                    </h2>
                    <PasswordInput
                      value={watch("password") || ""}
                      onChange={(value) => setValue("password", value)}
                      placeholder="Enter password"
                      className="w-full text-lg border border-gray-200 rounded-lg focus:border-red-600 px-5 py-4 focus:ring-2 focus:ring-red-600 transition-colors"
                      error={stepErrors[2] || errors.password?.message}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          nextStep();
                        }
                      }}
                    />
                  </>
                )}

                {currentStep === 3 && (
                  <>
                    <h2 className="text-3xl font-semibold text-gray-900 mb-8">
                      What FIRST level is your team?
                    </h2>
                    <Select
                      value={watch("firstLevel") || ""}
                      onValueChange={(value) => {
                        setValue("firstLevel", value as any);
                        setTimeout(() => nextStep(), 300);
                      }}
                    >
                      <SelectTrigger className="w-full text-lg border border-gray-200 rounded-lg focus:border-red-600 px-5 py-4 focus:ring-2 focus:ring-red-600 h-auto">
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
                  </>
                )}

                {currentStep === 4 && (
                  <>
                    <h2 className="text-3xl font-semibold text-gray-900 mb-8">
                      Where is your team located?
                    </h2>
                    <Input
                      {...register("zipCode")}
                      placeholder="12345"
                      className="w-full text-lg border border-gray-200 rounded-lg focus:border-red-600 px-5 py-4 focus:ring-2 focus:ring-red-600 transition-colors"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          nextStep();
                        }
                      }}
                    />
                  </>
                )}

                {currentStep === 5 && (
                  <>
                    <h2 className="text-3xl font-semibold text-gray-900 mb-8">
                      Is this a school team?
                    </h2>
                    <div
                      className="space-y-3"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          nextStep();
                        }
                      }}
                      tabIndex={0}
                    >
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <Checkbox
                          checked={watch("isSchoolTeam") === true}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              handleSchoolTeamToggle(true);
                            } else {
                              // Uncheck by setting to false
                              setValue("isSchoolTeam", false);
                            }
                          }}
                        />
                        <span className="text-lg">Yes, it's a school team</span>
                      </label>
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <Checkbox
                          checked={watch("isSchoolTeam") === false}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              handleSchoolTeamToggle(false);
                            }
                          }}
                        />
                        <span className="text-lg">
                          No, it's a community team
                        </span>
                      </label>
                    </div>
                  </>
                )}

                {currentStep === 6 && watch("isSchoolTeam") && (
                  <>
                    <h2 className="text-3xl font-semibold text-gray-900 mb-8">
                      What's your school name?
                    </h2>
                    <Input
                      {...register("schoolName")}
                      placeholder="School name"
                      className="w-full text-lg border border-gray-200 rounded-lg focus:border-red-600 px-5 py-4 focus:ring-2 focus:ring-red-600 transition-colors"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          nextStep();
                        }
                      }}
                    />
                  </>
                )}

                {currentStep === 7 && (
                  <>
                    <h2 className="text-3xl font-semibold text-gray-900 mb-8">
                      What areas do you need help with?
                    </h2>
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
                      {areasOfNeed.map((area) => (
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
                  </>
                )}

                {currentStep === 8 && (
                  <>
                    <h2 className="text-3xl font-semibold text-gray-900 mb-8">
                      What grade range are you looking for?
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Input
                          type="number"
                          {...register("gradeRangeMin", {
                            valueAsNumber: true,
                          })}
                          placeholder="Min"
                          min="1"
                          max="12"
                          className="w-full text-lg border border-gray-200 rounded-lg focus:border-red-600 px-5 py-4 focus:ring-2 focus:ring-red-600 transition-colors"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              document
                                .querySelector<HTMLInputElement>(
                                  'input[placeholder="Max"]'
                                )
                                ?.focus();
                            }
                          }}
                        />
                      </div>
                      <div>
                        <Input
                          type="number"
                          {...register("gradeRangeMax", {
                            valueAsNumber: true,
                          })}
                          placeholder="Max"
                          min="1"
                          max="12"
                          className="w-full text-lg border border-gray-200 rounded-lg focus:border-red-600 px-5 py-4 focus:ring-2 focus:ring-red-600 transition-colors"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              nextStep();
                            }
                          }}
                        />
                      </div>
                    </div>
                  </>
                )}

                {currentStep === 9 && (
                  <>
                    <h2 className="text-3xl font-semibold text-gray-900 mb-8">
                      How many hours per week do you expect from students?
                    </h2>
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
                  </>
                )}

                {currentStep === 10 && (
                  <>
                    <h2 className="text-3xl font-semibold text-gray-900 mb-8">
                      Tell us about your team's achievements
                    </h2>
                    <Textarea
                      {...register("teamAwards")}
                      placeholder="List your team's awards and accomplishments..."
                      className="w-full text-lg border border-gray-200 rounded-lg focus:border-red-600 px-5 py-4 focus:ring-2 focus:ring-red-600 transition-colors resize-none"
                      rows={4}
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                          e.preventDefault();
                          nextStep();
                        }
                      }}
                    />
                  </>
                )}

                {currentStep === 11 && (
                  <>
                    <h2 className="text-3xl font-semibold text-gray-900 mb-8">
                      What qualities are you looking for? (Select up to 3)
                    </h2>
                    <div className="space-y-3">
                      {qualities.map((quality) => {
                        const isDisabled =
                          !selectedQualities.includes(quality.value) &&
                          selectedQualities.length >= 3;
                        return (
                          <label
                            key={quality.value}
                            className={`flex items-center space-x-3 ${
                              isDisabled
                                ? "opacity-50 cursor-not-allowed"
                                : "cursor-pointer"
                            }`}
                          >
                            <Checkbox
                              checked={selectedQualities.includes(
                                quality.value
                              )}
                              onCheckedChange={() => {
                                if (!isDisabled) {
                                  handleQualityToggle(quality.value);
                                }
                              }}
                              disabled={isDisabled}
                            />
                            <span className="text-lg">{quality.label}</span>
                          </label>
                        );
                      })}
                      <p className="text-sm text-gray-400 mt-4">
                        Selected: {selectedQualities.length}/3
                      </p>
                    </div>
                  </>
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

              {currentStep < (watch("isSchoolTeam") === true ? 12 : 11) ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="text-lg text-red-600 hover:text-red-700 font-semibold transition-colors"
                >
                  Next →
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  onClick={(e) => {
                    // Mark that this is an explicit submit button click
                    setIsExplicitSubmit(true);
                    // Ensure we're on the last step before allowing submission
                    const maxStep = watch("isSchoolTeam") === true ? 12 : 11;
                    if (currentStep < maxStep) {
                      e.preventDefault();
                      setIsExplicitSubmit(false);
                      return;
                    }
                  }}
                  className="text-lg text-red-600 hover:text-red-700 font-semibold disabled:opacity-50 transition-colors"
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
