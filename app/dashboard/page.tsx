"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSession, getUserProfile, getUserMatches } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Users,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
} from "lucide-react";

interface UserProfile {
  type: "student" | "team" | "admin";
  profile: any;
}

export default function DashboardPage() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [matches, setMatches] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    async function loadDashboard() {
      const { session, error: sessionError } = await getSession();

      if (sessionError || !session) {
        router.push("/login");
        return;
      }

      try {
        // Load user profile
        const { profile, error: profileError } = await getUserProfile(
          session.user.uid
        );
        if (profileError) throw profileError;

        // Redirect administrators to admin page
        if (profile && profile.type === "admin") {
          router.push("/admin");
          return;
        }

        setUserProfile(profile);

        // Load user matches
        const { matches: userMatches, error: matchesError } =
          await getUserMatches(session.user.uid);
        if (matchesError) throw matchesError;

        setMatches(userMatches || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    loadDashboard();
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg border border-gray-100 p-8 text-center max-w-md">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <Button
            onClick={() => router.push("/login")}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Back to Login
          </Button>
        </div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg border border-gray-100 p-8 text-center max-w-md">
          <p className="text-gray-600 mb-4">User profile not found</p>
          <Button
            onClick={() => router.push("/login")}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Back to Login
          </Button>
        </div>
      </div>
    );
  }

  const { type, profile } = userProfile;
  const isStudent = type === "student";
  const isTeam = type === "team";
  const isAdmin = type === "admin";

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <Card className="border border-gray-200">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl font-semibold text-gray-900 tracking-tight mb-1">
                      Profile Information
                    </CardTitle>
                    <CardDescription className="text-sm text-gray-600 font-light">
                      Your registration details
                    </CardDescription>
                  </div>
                  {isStudent && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        // TODO: Implement edit profile functionality
                        alert("Edit profile functionality coming soon!");
                      }}
                      className="text-blue-600 hover:text-blue-700 border-blue-200 hover:border-blue-300 hover:bg-blue-50"
                    >
                      Edit Profile
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {isStudent && (
                  <>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Name</p>
                      <p className="text-gray-900">{profile.name}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Grade</p>
                      <p className="text-gray-900">{profile.grade}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Match Status
                      </p>
                      <div className="flex items-center space-x-2">
                        {matches &&
                        matches.length > 0 &&
                        matches[0]?.type === "matched" ? (
                          <>
                            <Badge className="bg-green-100 text-green-800">
                              <Users className="h-3 w-3 mr-1" />
                              Matched
                            </Badge>
                            <span className="text-sm text-gray-600">
                              to {matches[0].team.team_name}
                            </span>
                          </>
                        ) : (
                          <Badge className="bg-yellow-100 text-yellow-800">
                            <Clock className="h-3 w-3 mr-1" />
                            Available
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Level</p>
                      <p className="text-gray-900">
                        {profile.first_level
                          ?.split("-")
                          .map(
                            (word: string) =>
                              word.charAt(0).toUpperCase() + word.slice(1)
                          )
                          .join(" ")}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Interests
                      </p>
                      <p className="text-gray-900">
                        {profile.areas_of_interest
                          ?.map(
                            (interest: string) =>
                              interest.charAt(0).toUpperCase() +
                              interest.slice(1)
                          )
                          .join(", ")}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        School
                      </p>
                      <p className="text-gray-900">{profile.school}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Time Commitment
                      </p>
                      <p className="text-gray-900">
                        {profile.time_commitment} hours/week
                      </p>
                    </div>
                  </>
                )}

                {isTeam && (
                  <>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Team Name
                      </p>
                      <p className="text-gray-900">{profile.team_name}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Match Status
                      </p>
                      <div className="flex items-center space-x-2">
                        {matches && matches.length > 0 ? (
                          <>
                            <Badge className="bg-green-100 text-green-800">
                              <Users className="h-3 w-3 mr-1" />
                              {matches.length} Student
                              {matches.length > 1 ? "s" : ""} Matched
                            </Badge>
                          </>
                        ) : (
                          <Badge className="bg-yellow-100 text-yellow-800">
                            <Clock className="h-3 w-3 mr-1" />
                            No Students Matched
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Level</p>
                      <p className="text-gray-900">
                        {profile.first_level
                          ?.split("-")
                          .map(
                            (word: string) =>
                              word.charAt(0).toUpperCase() + word.slice(1)
                          )
                          .join(" ")}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Areas of Need
                      </p>
                      <p className="text-gray-900">
                        {profile.areas_of_need
                          ?.map(
                            (area: string) =>
                              area.charAt(0).toUpperCase() + area.slice(1)
                          )
                          .join(", ")}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Grade Range
                      </p>
                      <p className="text-gray-900">
                        {profile.grade_range_min} - {profile.grade_range_max}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Time Commitment
                      </p>
                      <p className="text-gray-900">
                        {profile.time_commitment} hours/week
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Qualities Looking For
                      </p>
                      <p className="text-gray-900">
                        {profile.qualities
                          ?.map((quality: string) =>
                            quality
                              .split("-")
                              .map(
                                (word: string) =>
                                  word.charAt(0).toUpperCase() + word.slice(1)
                              )
                              .join(" ")
                          )
                          .join(", ")}
                      </p>
                    </div>
                  </>
                )}

                {isAdmin && (
                  <>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Name</p>
                      <p className="text-gray-900">{profile.name}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Role</p>
                      <p className="text-gray-900">Administrator</p>
                    </div>
                  </>
                )}

                <Separator />

                <div>
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p className="text-gray-900 flex items-center space-x-2">
                    <Mail className="h-4 w-4" />
                    <span>{profile.email}</span>
                  </p>
                </div>

                {profile.phone_number && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Phone</p>
                    <p className="text-gray-900 flex items-center space-x-2">
                      <Phone className="h-4 w-4" />
                      <span>{profile.phone_number}</span>
                    </p>
                  </div>
                )}

                {profile.zip_code && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Location
                    </p>
                    <p className="text-gray-900 flex items-center space-x-2">
                      <MapPin className="h-4 w-4" />
                      <span>ZIP: {profile.zip_code}</span>
                    </p>
                  </div>
                )}

                <div>
                  <p className="text-sm font-medium text-gray-500">Joined</p>
                  <p className="text-gray-900 flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {new Date(profile.created_at).toLocaleDateString()}
                    </span>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Matches Card */}
          <div className="lg:col-span-2">
            <Card className="border border-gray-200">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-semibold text-gray-900 tracking-tight mb-1">
                  {isStudent
                    ? matches &&
                      matches.length > 0 &&
                      matches[0]?.type === "matched"
                      ? "Your Matched Team"
                      : "Available Teams"
                    : isTeam
                    ? matches && matches.length > 0
                      ? "Your Matched Students"
                      : "Available Students"
                    : "All Users"}
                </CardTitle>
                <CardDescription className="text-sm text-gray-600 font-light">
                  {isStudent
                    ? matches &&
                      matches.length > 0 &&
                      matches[0]?.type === "matched"
                      ? "You have been matched with a team!"
                      : "Teams that might be a good match for you"
                    : isTeam
                    ? matches && matches.length > 0
                      ? `You have ${matches.length} matched student${
                          matches.length > 1 ? "s" : ""
                        }!`
                      : "Students who might be interested in joining your team"
                    : "All registered students and teams"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!matches || matches.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="h-8 w-8 text-gray-400" />
                    </div>
                    <p className="text-gray-600 font-medium mb-1">
                      {isStudent
                        ? "No teams available yet"
                        : isTeam
                        ? "No students available yet"
                        : "No users found"}
                    </p>
                    <p className="text-gray-500 text-sm">
                      {isStudent
                        ? "Check back later for new team matches!"
                        : isTeam
                        ? "Check back later for new student matches!"
                        : "No matches to display."}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {Array.isArray(matches) &&
                      matches.map((match, index) => (
                        <div
                          key={index}
                          className="border border-gray-200 rounded-lg p-6 hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              {isStudent && match.type === "matched" ? (
                                // Show matched team information
                                <>
                                  <div className="flex items-center space-x-2 mb-2">
                                    <h3 className="font-semibold text-gray-900">
                                      {match.team.team_name}
                                    </h3>
                                    <Badge className="bg-green-100 text-green-800">
                                      Matched
                                    </Badge>
                                  </div>
                                  <div className="space-y-2 text-sm text-gray-600">
                                    <p>
                                      <strong>FIRST Level:</strong>{" "}
                                      {match.team.first_level}
                                    </p>
                                    <p>
                                      <strong>Location:</strong>{" "}
                                      {match.team.zip_code}
                                    </p>
                                    <p>
                                      <strong>Grade Range:</strong>{" "}
                                      {match.team.grade_range_min}-
                                      {match.team.grade_range_max}
                                    </p>
                                    <p>
                                      <strong>Time Commitment:</strong>{" "}
                                      {match.team.time_commitment} hrs/week
                                    </p>
                                    {match.team.areas_of_need &&
                                      match.team.areas_of_need.length > 0 && (
                                        <p>
                                          <strong>Areas of Need:</strong>{" "}
                                          {match.team.areas_of_need.join(", ")}
                                        </p>
                                      )}
                                    {match.team.qualities &&
                                      match.team.qualities.length > 0 && (
                                        <p>
                                          <strong>Desired Qualities:</strong>{" "}
                                          {match.team.qualities.join(", ")}
                                        </p>
                                      )}
                                  </div>
                                </>
                              ) : isTeam ? (
                                // Show matched student information for teams
                                <>
                                  <div className="flex items-center space-x-2 mb-2">
                                    <h3 className="font-semibold text-gray-900">
                                      {match.name}
                                    </h3>
                                    <Badge className="bg-green-100 text-green-800">
                                      Matched
                                    </Badge>
                                  </div>
                                  <div className="space-y-2 text-sm text-gray-600">
                                    <p>
                                      <strong>Grade:</strong> {match.grade}
                                    </p>
                                    <p>
                                      <strong>School:</strong> {match.school}
                                    </p>
                                    <p>
                                      <strong>FIRST Level:</strong>{" "}
                                      {match.first_level}
                                    </p>
                                    <p>
                                      <strong>Time Commitment:</strong>{" "}
                                      {match.time_commitment} hrs/week
                                    </p>
                                    {match.areas_of_interest &&
                                      match.areas_of_interest.length > 0 && (
                                        <p>
                                          <strong>Interests:</strong>{" "}
                                          {match.areas_of_interest.join(", ")}
                                        </p>
                                      )}
                                  </div>
                                </>
                              ) : (
                                // Show regular match information (for other cases)
                                <>
                                  <h3 className="font-semibold text-gray-900">
                                    {isStudent
                                      ? match.teamName
                                      : `${match.firstName} ${match.lastName}`}
                                  </h3>
                                  {isStudent && match.teamNumber && (
                                    <p className="text-sm text-gray-600">
                                      Team #{match.teamNumber}
                                    </p>
                                  )}
                                  {isTeam && match.grade && (
                                    <p className="text-sm text-gray-600">
                                      Grade {match.grade}
                                    </p>
                                  )}
                                  <p className="text-sm text-gray-600 mt-2">
                                    {isStudent
                                      ? match.description
                                      : match.interests}
                                  </p>
                                </>
                              )}
                            </div>
                            <div className="flex flex-col items-end space-y-2">
                              {isStudent && match.type === "matched" ? (
                                <div className="text-xs text-gray-500">
                                  Matched on{" "}
                                  {new Date(
                                    match.matchedAt
                                  ).toLocaleDateString()}
                                </div>
                              ) : (
                                <>
                                  <Badge variant="outline">
                                    {isStudent ? "Team" : "Student"}
                                  </Badge>
                                  <div className="text-xs text-gray-500">
                                    Contact info hidden for privacy
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
