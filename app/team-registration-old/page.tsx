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
import { Textarea } from "@/components/ui/textarea";
import { Users, CheckCircle, Clock } from "lucide-react";
import { supabase } from "@/lib/supabase";

const teamRegistrationSchema = z.object({
  teamName: z.string().min(1, "Team name is required"),
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
  zipCode: z.string().min(1, "Zip code is required"),
  isSchoolTeam: z.boolean().default(false),
  schoolName: z.string().optional(),
  areasOfNeed: z
    .array(z.string())
    .min(1, "Please select at least one area of need"),
  ageRangeMin: z
    .number()
    .min(6, "Minimum age must be at least 6")
    .max(18, "Minimum age must be 18 or younger"),
  ageRangeMax: z
    .number()
    .min(6, "Maximum age must be at least 6")
    .max(18, "Maximum age must be 18 or younger"),
  timeCommitment: z
    .number()
    .min(1, "Time commitment is required")
    .max(30, "Time commitment cannot exceed 30 hours"),
  qualities: z
    .array(z.string())
    .min(1, "Please select at least one quality")
    .max(3, "Please select no more than 3 qualities"),
  teamAwards: z.string().min(1, "Team awards are required"),
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

const states = [
  { value: "alabama", label: "Alabama" },
  { value: "alaska", label: "Alaska" },
  { value: "arizona", label: "Arizona" },
  { value: "arkansas", label: "Arkansas" },
  { value: "california", label: "California" },
  { value: "colorado", label: "Colorado" },
  { value: "connecticut", label: "Connecticut" },
  { value: "delaware", label: "Delaware" },
  { value: "florida", label: "Florida" },
  { value: "georgia", label: "Georgia" },
  { value: "hawaii", label: "Hawaii" },
  { value: "idaho", label: "Idaho" },
  { value: "illinois", label: "Illinois" },
  { value: "indiana", label: "Indiana" },
  { value: "iowa", label: "Iowa" },
  { value: "kansas", label: "Kansas" },
  { value: "kentucky", label: "Kentucky" },
  { value: "louisiana", label: "Louisiana" },
  { value: "maine", label: "Maine" },
  { value: "maryland", label: "Maryland" },
  { value: "massachusetts", label: "Massachusetts" },
  { value: "michigan", label: "Michigan" },
  { value: "minnesota", label: "Minnesota" },
  { value: "mississippi", label: "Mississippi" },
  { value: "missouri", label: "Missouri" },
  { value: "montana", label: "Montana" },
  { value: "nebraska", label: "Nebraska" },
  { value: "nevada", label: "Nevada" },
  { value: "new-hampshire", label: "New Hampshire" },
  { value: "new-jersey", label: "New Jersey" },
  { value: "new-mexico", label: "New Mexico" },
  { value: "new-york", label: "New York" },
  { value: "north-carolina", label: "North Carolina" },
  { value: "north-dakota", label: "North Dakota" },
  { value: "ohio", label: "Ohio" },
  { value: "oklahoma", label: "Oklahoma" },
  { value: "oregon", label: "Oregon" },
  { value: "pennsylvania", label: "Pennsylvania" },
  { value: "rhode-island", label: "Rhode Island" },
  { value: "south-carolina", label: "South Carolina" },
  { value: "south-dakota", label: "South Dakota" },
  { value: "tennessee", label: "Tennessee" },
  { value: "texas", label: "Texas" },
  { value: "utah", label: "Utah" },
  { value: "vermont", label: "Vermont" },
  { value: "virginia", label: "Virginia" },
  { value: "washington", label: "Washington" },
  { value: "west-virginia", label: "West Virginia" },
  { value: "wisconsin", label: "Wisconsin" },
  { value: "wyoming", label: "Wyoming" },
];

export default function TeamRegistrationPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [selectedQualities, setSelectedQualities] = useState<string[]>([]);
  const [timeCommitment, setTimeCommitment] = useState([10]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<TeamRegistrationForm>({
    resolver: zodResolver(teamRegistrationSchema),
    defaultValues: {
      ageRangeMin: 12,
    },
  });

  const handleAreaToggle = (area: string) => {
    setSelectedAreas((prev) =>
      prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]
    );
    setValue(
      "areasOfNeed",
      selectedAreas.includes(area)
        ? selectedAreas.filter((a) => a !== area)
        : [...selectedAreas, area]
    );
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

  const handleTimeCommitmentChange = (value: number[]) => {
    setTimeCommitment(value);
    setValue("timeCommitment", value[0]);
  };

  const onSubmit = async (data: TeamRegistrationForm) => {
    try {
      if (!supabase) {
        throw new Error("Database connection not available");
      }

      // Prepare data for Supabase
      const teamData = {
        team_name: data.teamName,
        email: data.email,
        first_level: data.firstLevel,
        zip_code: data.zipCode,
        is_school_team: data.isSchoolTeam,
        school_name: data.schoolName,
        areas_of_need: data.areasOfNeed,
        age_range_min: data.ageRangeMin,
        age_range_max: data.ageRangeMax,
        time_commitment: data.timeCommitment,
        qualities: data.qualities,
        team_awards: data.teamAwards,
      };

      // Insert into Supabase
      const { data: result, error } = await supabase
        .from("teams")
        .insert([teamData])
        .select();

      if (error) {
        console.error("Supabase error:", error);
        throw new Error(error.message);
      }

      console.log("Team registered successfully:", result);
      setIsSubmitted(true);
    } catch (error) {
      console.error("Registration error:", error);
      alert("Registration failed. Please try again.");
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="modern-card max-w-md w-full text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Registration Successful!
          </h2>
          <p className="text-gray-600 mb-6">
            Thank you for registering your team. We'll help connect you with
            interested students.
          </p>
          <Button
            onClick={() => setIsSubmitted(false)}
            className="modern-button"
          >
            Register Another Team
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-red-50">
      <div className="max-w-3xl mx-auto">
        <div className="modern-card">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-red-500 rounded-full mb-6">
              <Users className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-red-500 mb-4">
              Find Passionate Students
            </h1>
            <p className="text-gray-600 text-lg">
              Register your FIRST robotics team to find prospective students who
              match your needs.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Row 1: Team Name and Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label
                  htmlFor="teamName"
                  className="text-lg font-semibold text-gray-800"
                >
                  Team Name *
                </Label>
                <Input
                  id="teamName"
                  {...register("teamName")}
                  placeholder="Enter your team name"
                  className={`modern-input mt-2 ${
                    errors.teamName ? "border-red-500 ring-red-500" : ""
                  }`}
                />
                {errors.teamName && (
                  <p className="text-red-500 text-sm mt-2">
                    {errors.teamName.message}
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
                  FIRST Level *
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

            {/* Row 3: School Team and School Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center space-x-3 p-4 bg-white/30 rounded-xl border border-white/20">
                <Checkbox
                  id="isSchoolTeam"
                  {...register("isSchoolTeam")}
                  className="team-form-checkbox single-select-checkbox"
                />
                <Label
                  htmlFor="isSchoolTeam"
                  className="text-lg font-semibold text-gray-800 cursor-pointer"
                >
                  School Team
                </Label>
              </div>

              <div>
                <Label
                  htmlFor="schoolName"
                  className="text-lg font-semibold text-gray-800"
                >
                  School Name
                </Label>
                <Input
                  id="schoolName"
                  {...register("schoolName")}
                  placeholder="Enter school name (if school team)"
                  disabled={!watch("isSchoolTeam")}
                  className={`modern-input mt-2 ${
                    !watch("isSchoolTeam")
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                />
              </div>
            </div>

            {/* Areas of Need */}
            <div>
              <Label className="text-lg font-semibold text-gray-800">
                Areas of Need *
              </Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                {areasOfNeed.map((area) => (
                  <div
                    key={area.value}
                    className="flex items-center space-x-3 p-4 bg-white/30 rounded-xl border border-white/20"
                  >
                    <Checkbox
                      id={area.value}
                      checked={selectedAreas.includes(area.value)}
                      onCheckedChange={() => handleAreaToggle(area.value)}
                      className="team-form-checkbox multi-select-checkbox"
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
              {errors.areasOfNeed && (
                <p className="text-red-500 text-sm mt-2">
                  {errors.areasOfNeed.message}
                </p>
              )}
            </div>

            {/* Age Range */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label
                  htmlFor="ageRangeMin"
                  className="text-lg font-semibold text-gray-800"
                >
                  Minimum Age *
                </Label>
                <Input
                  id="ageRangeMin"
                  type="number"
                  {...register("ageRangeMin", { valueAsNumber: true })}
                  placeholder="Min age"
                  min="6"
                  max="18"
                  className={`modern-input mt-2 ${
                    errors.ageRangeMin ? "border-red-500 ring-red-500" : ""
                  }`}
                />
                {errors.ageRangeMin && (
                  <p className="text-red-500 text-sm mt-2">
                    {errors.ageRangeMin.message}
                  </p>
                )}
              </div>
              <div>
                <Label
                  htmlFor="ageRangeMax"
                  className="text-lg font-semibold text-gray-800"
                >
                  Maximum Age *
                </Label>
                <Input
                  id="ageRangeMax"
                  type="number"
                  {...register("ageRangeMax", { valueAsNumber: true })}
                  placeholder="Max age"
                  min="6"
                  max="18"
                  className={`modern-input mt-2 ${
                    errors.ageRangeMax ? "border-red-500 ring-red-500" : ""
                  }`}
                />
                {errors.ageRangeMax && (
                  <p className="text-red-500 text-sm mt-2">
                    {errors.ageRangeMax.message}
                  </p>
                )}
              </div>
            </div>

            {/* Time Commitment */}
            <div>
              <div className="flex items-center justify-between">
                <Label className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Time Commitment Expected from Students
                </Label>
                <span className="text-lg font-semibold team-form-accent">
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
                  className="w-full team-form-slider"
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

            {/* Team Awards */}
            <div>
              <Label
                htmlFor="teamAwards"
                className="text-lg font-semibold text-gray-800"
              >
                Team Awards *
              </Label>
              <Textarea
                id="teamAwards"
                {...register("teamAwards")}
                placeholder="List your team's awards, achievements, years of experience, and notable accomplishments."
                rows={6}
                className={`modern-input mt-2 ${
                  errors.teamAwards ? "border-red-500 ring-red-500" : ""
                }`}
              />
              {errors.teamAwards && (
                <p className="text-red-500 text-sm mt-2">
                  {errors.teamAwards.message}
                </p>
              )}
            </div>

            {/* Qualities */}
            <div>
              <Label className="text-lg font-semibold text-gray-800">
                Qualities Team is Looking For * (Select up to 3)
              </Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {qualities.map((quality) => (
                  <div
                    key={quality.value}
                    className="flex items-center space-x-3 p-4 bg-white/30 rounded-xl border border-white/20"
                  >
                    <Checkbox
                      id={quality.value}
                      checked={selectedQualities.includes(quality.value)}
                      onCheckedChange={() => handleQualityToggle(quality.value)}
                      disabled={
                        !selectedQualities.includes(quality.value) &&
                        selectedQualities.length >= 3
                      }
                      className="team-form-checkbox multi-select-checkbox"
                    />
                    <Label
                      htmlFor={quality.value}
                      className="text-sm font-medium cursor-pointer"
                    >
                      {quality.label}
                    </Label>
                  </div>
                ))}
              </div>
              {errors.qualities && (
                <p className="text-red-500 text-sm mt-2">
                  {errors.qualities.message}
                </p>
              )}
              <p className="text-sm text-gray-500 mt-3">
                Selected: {selectedQualities.length}/3
              </p>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 w-full text-lg py-4"
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
