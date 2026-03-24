"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Users, Clock, X, Mail, Globe } from "lucide-react";
import { CaptchaVerification } from "@/components/captcha-verification";
import { calculateZipDistance } from "@/lib/zip-distance";
import Link from "next/link";

interface Team {
  id: string;
  team_name: string;
  team_number: string | null;
  team_website: string | null;
  email: string;
  phone_number?: string;
  zip_code: string;
  first_level: string;
  areas_of_need: string[];
  grade_range_min: number;
  grade_range_max: number;
  time_commitment: number;
  qualities: string[];
  is_school_team?: boolean;
  school_name?: string;
  team_awards?: string;
}

interface SearchFilters {
  firstLevel: string;
  zipCode: string;
  areasOfNeed: string[];
  gradeRange: number;
  timeCommitment: number;
  qualities: string[];
}

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

const sortOptions = [
  { value: "name-asc", label: "Name (A-Z)" },
  { value: "name-desc", label: "Name (Z-A)" },
  { value: "zip-asc", label: "Location (Nearby)" },
];

export default function BrowsePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [teams, setTeams] = useState<Team[]>([]);
  const [filteredTeams, setFilteredTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [selectedTeamEmail, setSelectedTeamEmail] = useState<string>("");
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [verifiedTeams, setVerifiedTeams] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");

  const [filters, setFilters] = useState<SearchFilters>({
    firstLevel: searchParams.get("firstLevel") || "any",
    zipCode: searchParams.get("zipCode") || "",
    areasOfNeed:
      searchParams.get("areasOfNeed")?.split(",").filter(Boolean) || [],
    gradeRange: parseInt(searchParams.get("grade") || "6"),
    timeCommitment: parseInt(searchParams.get("time") || "10"),
    qualities: searchParams.get("qualities")?.split(",").filter(Boolean) || [],
  });

  // Default to nearest if zip code is provided, otherwise name-asc
  const [sortBy, setSortBy] = useState(
    searchParams.get("zipCode") ? "zip-asc" : "name-asc"
  );

  useEffect(() => {
    async function loadTeams() {
      setIsLoading(true);
      setError("");
      try {
        const response = await fetch("/api/teams");
        if (!response.ok) {
          throw new Error("Failed to load teams");
        }
        const data = await response.json();
        const teamsData = data.teams || [];
        setTeams(teamsData);
        if (teamsData.length === 0) {
          setFilteredTeams([]);
        }
      } catch (error) {
        console.error("Error loading teams:", error);
        setError("Failed to load teams. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }

    loadTeams();
  }, []);

  const applyFilters = useCallback(
    (teamsToFilter: Team[], currentFilters: SearchFilters) => {
      let filtered = [...teamsToFilter];

      // Apply search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(
          (team) =>
            team.team_name.toLowerCase().includes(query) ||
            team.school_name?.toLowerCase().includes(query) ||
            team.zip_code.includes(query)
        );
      }

      // Apply FIRST level filter
      if (currentFilters.firstLevel && currentFilters.firstLevel !== "any") {
        filtered = filtered.filter(
          (team) => team.first_level === currentFilters.firstLevel
        );
      }

      // Zip code is only used for sorting, not filtering

      // Apply areas of need filter
      if (currentFilters.areasOfNeed.length > 0) {
        filtered = filtered.filter((team) =>
          currentFilters.areasOfNeed.some((area) =>
            team.areas_of_need?.includes(area)
          )
        );
      }

      // Grade range and time commitment filters are ignored (not enough data)
      // They appear to work but don't actually filter teams

      // Apply qualities filter
      if (currentFilters.qualities.length > 0) {
        filtered = filtered.filter((team) =>
          currentFilters.qualities.some((quality) =>
            team.qualities?.includes(quality)
          )
        );
      }

      // Apply sorting
      filtered.sort((a, b) => {
        switch (sortBy) {
          case "name-asc":
            return a.team_name.localeCompare(b.team_name);
          case "name-desc":
            return b.team_name.localeCompare(a.team_name);
          case "zip-asc":
            // Sort by distance if user zip code is provided
            if (currentFilters.zipCode) {
              const distA = calculateZipDistance(
                currentFilters.zipCode,
                a.zip_code
              );
              const distB = calculateZipDistance(
                currentFilters.zipCode,
                b.zip_code
              );
              return distA - distB;
            }
            return a.zip_code.localeCompare(b.zip_code);
          default:
            return 0;
        }
      });

      setFilteredTeams(filtered);
    },
    [searchQuery, sortBy]
  );

  useEffect(() => {
    if (teams.length > 0) {
      applyFilters(teams, filters);
    }
  }, [filters, teams, searchQuery, sortBy, applyFilters]);

  // Sync filters to URL so they're bookmarkable and shareable
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.firstLevel && filters.firstLevel !== "any") params.set("firstLevel", filters.firstLevel);
    if (filters.zipCode) params.set("zipCode", filters.zipCode);
    if (filters.areasOfNeed.length > 0) params.set("areasOfNeed", filters.areasOfNeed.join(","));
    if (filters.qualities.length > 0) params.set("qualities", filters.qualities.join(","));
    if (searchQuery) params.set("q", searchQuery);
    const qs = params.toString();
    router.replace(qs ? `/browse?${qs}` : "/browse", { scroll: false });
  }, [filters, searchQuery]);

  // Update sort when zip code changes
  useEffect(() => {
    if (filters.zipCode && sortBy !== "zip-asc") {
      setSortBy("zip-asc");
    } else if (!filters.zipCode && sortBy === "zip-asc") {
      setSortBy("name-asc");
    }
  }, [filters.zipCode]);

  async function handleCardClick(team: Team) {
    // Navigate to team page when clicking anywhere on card
    router.push(`/teams/${team.id}`);
  }

  async function handleContactClick(e: React.MouseEvent, team: Team) {
    e.stopPropagation(); // Prevent card click

    // Track contact view
    try {
      await fetch(`/api/teams/${team.id}/contact`, {
        method: "POST",
      });
    } catch (error) {
      console.error("Failed to track contact view:", error);
    }

    // Fetch team email for CAPTCHA
    try {
      const response = await fetch(`/api/teams/${team.id}`);
      if (response.ok) {
        const data = await response.json();
        setSelectedTeam(team);
        setSelectedTeamEmail(data.team.email || "");
        setShowCaptcha(true);
      }
    } catch (error) {
      console.error("Failed to load team email:", error);
    }
  }

  function handleCaptchaVerify() {
    if (selectedTeam) {
      setVerifiedTeams((prev) => {
        const newSet = new Set(prev);
        newSet.add(selectedTeam.id);
        return newSet;
      });
      // Email will be shown in the CAPTCHA modal
    }
  }

  function formatFirstLevel(level: string): string {
    return level
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  function formatArea(area: string): string {
    return area.charAt(0).toUpperCase() + area.slice(1);
  }

  function clearFilters() {
    const emptyFilters: SearchFilters = {
      firstLevel: "any",
      zipCode: "",
      areasOfNeed: [],
      gradeRange: 6,
      timeCommitment: 10,
      qualities: [],
    };
    setFilters(emptyFilters);
    setSearchQuery("");
    router.push("/browse");
  }

  const activeFiltersCount =
    (filters.firstLevel && filters.firstLevel !== "any" ? 1 : 0) +
    (filters.zipCode ? 1 : 0) +
    filters.areasOfNeed.length +
    filters.qualities.length;
  // Note: gradeRange and timeCommitment are not counted as they don't actually filter

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-12 mt-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Browse Teams
          </h1>
          <p className="text-gray-600">
            Find FIRST robotics teams that match your interests
          </p>
        </div>

        {/* Search and Filters Bar */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col gap-4">
            {/* Search Row */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="Search by team name, school, or zip code..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center gap-3">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {activeFiltersCount > 0 && (
                  <Button variant="ghost" onClick={clearFilters} size="sm">
                    <X className="h-4 w-4 mr-1" />
                    Clear Filters
                  </Button>
                )}
              </div>
            </div>

            {/* Filters Row - Always Visible */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  FIRST Level
                </label>
                <Select
                  value={filters.firstLevel}
                  onValueChange={(value) =>
                    setFilters((prev) => ({ ...prev, firstLevel: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any level</SelectItem>
                    {firstLevels.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Zip Code
                </label>
                <Input
                  value={filters.zipCode}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, zipCode: e.target.value }))
                  }
                  placeholder="12345"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Areas of Expertise
                </label>
                <div className="flex flex-wrap gap-2">
                  {areasOfNeed.map((area) => (
                    <button
                      key={area.value}
                      onClick={() => {
                        setFilters((prev) => ({
                          ...prev,
                          areasOfNeed: prev.areasOfNeed.includes(area.value)
                            ? prev.areasOfNeed.filter((a) => a !== area.value)
                            : [...prev.areasOfNeed, area.value],
                        }));
                      }}
                      className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
                        filters.areasOfNeed.includes(area.value)
                          ? "bg-blue-600 text-white shadow-sm"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {area.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4 text-sm text-gray-600">
          Showing {filteredTeams.length} teams
        </div>

        {/* Teams Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading teams...</p>
          </div>
        ) : filteredTeams.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 font-medium mb-1">No teams found</p>
            <p className="text-gray-500 text-sm">
              Try adjusting your filters or search query
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTeams.map((team) => {
              const distance = filters.zipCode
                ? calculateZipDistance(filters.zipCode, team.zip_code)
                : null;

              return (
                <Card
                  key={team.id}
                  onClick={() => handleCardClick(team)}
                  className="border border-gray-200 hover:shadow-md transition-all duration-200 cursor-pointer"
                >
                  <CardHeader>
                    <CardTitle className="text-lg">
                      {team.team_name}
                      {team.team_number && (
                        <span className="text-sm text-gray-600 ml-2">
                          #{team.team_number}
                        </span>
                      )}
                    </CardTitle>
                    <p className="text-sm text-gray-600 mt-1">
                      {formatFirstLevel(team.first_level)}
                    </p>
                    {team.school_name && (
                      <p className="text-sm text-gray-600 mt-1">
                        {team.school_name}
                      </p>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      {team.zip_code}
                      {distance !== null && ` (${distance} mi)`}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="h-4 w-4 mr-2" />
                      Grades {team.grade_range_min}-{team.grade_range_max}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="h-4 w-4 mr-2" />
                      {team.time_commitment} hrs/week
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {team.areas_of_need?.slice(0, 2).map((area) => (
                        <Badge key={area} variant="outline" className="text-xs">
                          {formatArea(area)}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button
                        onClick={(e) => handleContactClick(e, team)}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 transition-all duration-200"
                      >
                        <Mail className="h-4 w-4 mr-2" />
                        Contact
                      </Button>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (team.team_website && team.team_website.trim()) {
                            const url = team.team_website
                              .trim()
                              .startsWith("http")
                              ? team.team_website.trim()
                              : `https://${team.team_website.trim()}`;
                            window.open(url, "_blank", "noopener,noreferrer");
                          }
                        }}
                        variant="outline"
                        disabled={
                          !team.team_website || !team.team_website.trim()
                        }
                        className="flex-1 border-blue-600 text-blue-600 hover:bg-blue-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Globe className="h-4 w-4 mr-2" />
                        Website
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* CAPTCHA Modal */}
      <CaptchaVerification
        isOpen={showCaptcha}
        onClose={() => {
          setShowCaptcha(false);
          setSelectedTeam(null);
          setSelectedTeamEmail("");
        }}
        onVerify={handleCaptchaVerify}
        email={selectedTeamEmail}
      />
    </div>
  );
}
