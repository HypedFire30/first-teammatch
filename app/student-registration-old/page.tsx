"use client";

import React, { useState } from "react";
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
import { UserPlus, Upload, CheckCircle, Clock } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabase";

const studentRegistrationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Please enter a valid email address"),
  firstLevel: z.enum(
    [
      "jr-first-lego-league",
      "first-lego-league",
      "first-tech-challenge",
      "first-robotics-competition",
    ],
    {
      required_error: "Please select a FIRST level",
    }
  ),
  areasOfInterest: z
    .array(z.string())
    .min(1, "Please select at least one area of interest"),
  age: z
    .number()
    .min(6, "Age must be at least 6")
    .max(18, "Age must be 18 or younger"),
  zipCode: z.string().min(1, "Zip code is required"),
  school: z.string().min(1, "School is required"),
  timeCommitment: z
    .number()
    .min(1, "Time commitment is required")
    .max(30, "Time commitment cannot exceed 30 hours"),
  resume: z.instanceof(File).optional(),
  impressiveThings: z
    .string()
    .min(1, "Please describe three impressive things you've done"),
  whyJoinTeam: z.string().min(1, "Please explain why you want to join a team"),
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

export default function StudentRegistrationOldPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [timeCommitment, setTimeCommitment] = useState([10]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<StudentRegistrationForm>({
    resolver: zodResolver(studentRegistrationSchema),
  });

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

  const onSubmit = async (data: StudentRegistrationForm) => {
    if (!supabase) {
      console.error("Supabase not initialized");
      return;
    }

    try {
      const { error } = await supabase.from("students").insert([
        {
          name: data.name,
          email: data.email,
          first_level: data.firstLevel,
          areas_of_interest: data.areasOfInterest,
          age: data.age,
          zip_code: data.zipCode,
          school: data.school,
          time_commitment: data.timeCommitment,
          impressive_things: data.impressiveThings,
          why_join_team: data.whyJoinTeam,
        },
      ]);

      if (error) throw error;

      setIsSubmitted(true);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-green-500 rounded-full mb-8">
            <CheckCircle className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Application Submitted!
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Thank you for your interest. We'll be in touch soon!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-blue-50">
      <div className="max-w-3xl mx-auto">
        <div className="modern-card">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-full mb-6">
              <UserPlus className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-blue-600 mb-4">
              Find Your Robotics Team
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Interested in joining a FIRST Robotics team? Fill out this form
              and we'll match you to the perfect team.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Row 1: Full Name and Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label
                  htmlFor="name"
                  className="text-lg font-semibold text-gray-800"
                >
                  Full Name *
                </Label>
                <Input
                  id="name"
                  {...register("name")}
                  placeholder="Enter your full name"
                  className={`modern-input mt-2 ${
                    errors.name ? "border-red-500 ring-red-500" : ""
                  }`}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-2">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <Label
                  htmlFor="email"
                  className="text-lg font-semibold text-gray-800"
                >
                  Email Address *
                </Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  placeholder="Enter your email address"
                  className={`modern-input mt-2 ${
                    errors.email ? "border-red-500 ring-red-500" : ""
                  }`}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-2">
                    {errors.email.message}
                  </p>
                )}
              </div>
            </div>

            {/* Row 2: FIRST Level and Zip Code */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label
                  htmlFor="firstLevel"
                  className="text-lg font-semibold text-gray-800"
                >
                  FIRST Level of Interest *
                </Label>
                <Select
                  onValueChange={(value) =>
                    setValue("firstLevel", value as any)
                  }
                >
                  <SelectTrigger
                    className={`modern-input mt-2 ${
                      errors.firstLevel ? "border-red-500 ring-red-500" : ""
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
                {errors.firstLevel && (
                  <p className="text-red-500 text-sm mt-2">
                    {errors.firstLevel.message}
                  </p>
                )}
              </div>

              <div>
                <Label
                  htmlFor="zipCode"
                  className="text-lg font-semibold text-gray-800"
                >
                  Zip Code *
                </Label>
                <Input
                  id="zipCode"
                  {...register("zipCode")}
                  placeholder="Enter your zip code"
                  className={`modern-input mt-2 ${
                    errors.zipCode ? "border-red-500 ring-red-500" : ""
                  }`}
                />
                {errors.zipCode && (
                  <p className="text-red-500 text-sm mt-2">
                    {errors.zipCode.message}
                  </p>
                )}
              </div>
            </div>

            {/* Areas of Interest */}
            <div>
              <Label className="text-lg font-semibold text-gray-800">
                Areas of Interest *
              </Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                {areasOfInterest.map((area) => (
                  <div
                    key={area.value}
                    className="flex items-center space-x-3 p-4 bg-white/30 rounded-xl border border-white/20"
                  >
                    <Checkbox
                      id={area.value}
                      checked={selectedAreas.includes(area.value)}
                      onCheckedChange={() => handleAreaToggle(area.value)}
                      className="multi-select-checkbox"
                    />
                    <Label
                      htmlFor={area.value}
                      className="text-sm font-medium cursor-pointer"
                    >
                      {area.label}
                    </Label>
                  </div>
                ))}
              </div>
              {errors.areasOfInterest && (
                <p className="text-red-500 text-sm mt-2">
                  {errors.areasOfInterest.message}
                </p>
              )}
            </div>

            {/* Resume Upload */}
            <div>
              <Label
                htmlFor="resume"
                className="text-lg font-semibold text-gray-800"
              >
                Resume (Optional)
              </Label>
              <Input
                id="resume"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="modern-input mt-2"
              />
            </div>

            {/* Row 3: Age and School */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label
                  htmlFor="age"
                  className="text-lg font-semibold text-gray-800"
                >
                  Age *
                </Label>
                <Input
                  id="age"
                  type="number"
                  {...register("age", { valueAsNumber: true })}
                  placeholder="Enter your age"
                  className={`modern-input mt-2 ${
                    errors.age ? "border-red-500 ring-red-500" : ""
                  }`}
                />
                {errors.age && (
                  <p className="text-red-500 text-sm mt-2">
                    {errors.age.message}
                  </p>
                )}
              </div>

              <div>
                <Label
                  htmlFor="school"
                  className="text-lg font-semibold text-gray-800"
                >
                  School *
                </Label>
                <Input
                  id="school"
                  {...register("school")}
                  placeholder="Enter your school name"
                  className={`modern-input mt-2 ${
                    errors.school ? "border-red-500 ring-red-500" : ""
                  }`}
                />
                {errors.school && (
                  <p className="text-red-500 text-sm mt-2">
                    {errors.school.message}
                  </p>
                )}
              </div>
            </div>

            {/* Time Commitment */}
            <div>
              <div className="flex items-center justify-between">
                <Label className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Time Commitment per Week *
                </Label>
                <span className="text-lg font-semibold student-form-accent">
                  {timeCommitment[0]} hours/week
                </span>
              </div>
              <div className="mt-4 space-y-4">
                <Slider
                  value={timeCommitment}
                  onValueChange={handleTimeCommitmentChange}
                  max={30}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-600">
                  <span>1 hour</span>
                  <span>30+ hours</span>
                </div>
              </div>
              {errors.timeCommitment && (
                <p className="text-red-500 text-sm mt-2">
                  {errors.timeCommitment.message}
                </p>
              )}
            </div>

            {/* Impressive Things */}
            <div>
              <Label
                htmlFor="impressiveThings"
                className="text-lg font-semibold text-gray-800"
              >
                Describe three impressive things you've done before *
              </Label>
              <Textarea
                id="impressiveThings"
                {...register("impressiveThings")}
                placeholder="Tell us about three impressive accomplishments, projects, or experiences you've had..."
                className={`mt-2 student-form-focus ${
                  errors.impressiveThings ? "border-red-500 ring-red-500" : ""
                }`}
                rows={4}
              />
              {errors.impressiveThings && (
                <p className="text-red-500 text-sm mt-2">
                  {errors.impressiveThings.message}
                </p>
              )}
            </div>

            {/* Why Join Team */}
            <div>
              <Label
                htmlFor="whyJoinTeam"
                className="text-lg font-semibold text-gray-800"
              >
                Why do you want to join a team? *
              </Label>
              <Textarea
                id="whyJoinTeam"
                {...register("whyJoinTeam")}
                placeholder="Explain your motivation for joining a FIRST Robotics team. Think about the qualities teams are looking for in prospects."
                className={`mt-2 student-form-focus ${
                  errors.whyJoinTeam ? "border-red-500 ring-red-500" : ""
                }`}
                rows={4}
              />
              {errors.whyJoinTeam && (
                <p className="text-red-500 text-sm mt-2">
                  {errors.whyJoinTeam.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="student-form-button w-full text-lg py-4"
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
