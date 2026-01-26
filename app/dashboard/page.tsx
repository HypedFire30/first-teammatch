"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/lib/auth-client";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  Users,
  Eye,
  Edit2,
  Save,
  X,
  Globe,
} from "lucide-react";

interface Team {
  id: string;
  team_name: string;
  team_number: string | null;
  team_website: string | null;
  email: string;
  zip_code: string;
  first_level: string;
  areas_of_need: string[];
  grade_range_min: number;
  grade_range_max: number;
  time_commitment: number;
  qualities: string[];
  is_school_team: boolean;
  school_name: string | null;
  team_awards: string | null;
  phone_number: string | null;
  contact_views: number;
  created_at: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [team, setTeam] = useState<Team | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editData, setEditData] = useState<Partial<Team>>({});

  useEffect(() => {
    async function loadDashboard() {
      const { user: currentUser, error: userError } = await getCurrentUser();

      if (userError || !currentUser) {
        router.push("/login");
        return;
      }

      // Redirect administrators to admin page
      if (currentUser.role === "admin") {
        router.push("/admin");
        return;
      }

      setUser(currentUser);

      try {
        // Load team profile
        const response = await fetch(`/api/teams/${currentUser.id}`);
        if (!response.ok) {
          throw new Error("Failed to load team profile");
        }

        const data = await response.json();
        setTeam(data.team);
        setEditData(data.team);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    loadDashboard();
  }, [router]);

  async function handleSave() {
    if (!team || !user) return;

    setIsSaving(true);
    try {
      const response = await fetch(`/api/teams/${user.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update profile");
      }

      // Reload team data
      const teamResponse = await fetch(`/api/teams/${user.id}`);
      const teamData = await teamResponse.json();
      setTeam(teamData.team);
      setEditData(teamData.team);
      setIsEditing(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  }

  function handleCancel() {
    if (team) {
      setEditData(team);
    }
    setIsEditing(false);
  }

  function formatFirstLevel(level: string): string {
    return level
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

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

  if (error && !team) {
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

  if (!team) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg border border-gray-100 p-8 text-center max-w-md">
          <p className="text-gray-600 mb-4">Team profile not found</p>
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <Card className="border border-gray-200">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl font-semibold text-gray-900 tracking-tight mb-1">
                      Team Profile
                    </CardTitle>
                    <CardDescription className="text-sm text-gray-600 font-light">
                      Your team information
                    </CardDescription>
                  </div>
                  {!isEditing && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditing(true)}
                      className="text-blue-600 hover:text-blue-700 border-blue-200 hover:border-blue-300 hover:bg-blue-50"
                    >
                      <Edit2 className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditing ? (
                  <>
                    <div>
                      <Label
                        htmlFor="team_name"
                        className="text-sm font-medium text-gray-500"
                      >
                        Team Name
                      </Label>
                      <Input
                        id="team_name"
                        value={editData.team_name || ""}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            team_name: e.target.value,
                          })
                        }
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="zip_code"
                        className="text-sm font-medium text-gray-500"
                      >
                        Zip Code
                      </Label>
                      <Input
                        id="zip_code"
                        value={editData.zip_code || ""}
                        onChange={(e) =>
                          setEditData({ ...editData, zip_code: e.target.value })
                        }
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="phone_number"
                        className="text-sm font-medium text-gray-500"
                      >
                        Phone Number
                      </Label>
                      <Input
                        id="phone_number"
                        value={editData.phone_number || ""}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            phone_number: e.target.value,
                          })
                        }
                        className="mt-1"
                        placeholder="(123) 456-7890"
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="team_website"
                        className="text-sm font-medium text-gray-500"
                      >
                        Team Website (optional)
                      </Label>
                      <Input
                        id="team_website"
                        value={editData.team_website || ""}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            team_website: e.target.value,
                          })
                        }
                        className="mt-1"
                        placeholder="https://example.com"
                      />
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex-1 bg-blue-600 hover:bg-blue-700"
                      >
                        <Save className="h-4 w-4 mr-1" />
                        {isSaving ? "Saving..." : "Save"}
                      </Button>
                      <Button
                        onClick={handleCancel}
                        variant="outline"
                        className="flex-1"
                      >
                        <X className="h-4 w-4 mr-1" />
                        Cancel
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Team Name
                      </p>
                      <p className="text-gray-900">{team.team_name}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Level</p>
                      <p className="text-gray-900">
                        {formatFirstLevel(team.first_level)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Areas of Need
                      </p>
                      <p className="text-gray-900">
                        {team.areas_of_need
                          ?.map(
                            (area) =>
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
                        {team.grade_range_min} - {team.grade_range_max}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Time Commitment
                      </p>
                      <p className="text-gray-900">
                        {team.time_commitment} hours/week
                      </p>
                    </div>
                    {team.school_name && (
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          School
                        </p>
                        <p className="text-gray-900">{team.school_name}</p>
                      </div>
                    )}
                  </>
                )}

                <Separator />

                <div>
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p className="text-gray-900 flex items-center space-x-2">
                    <Mail className="h-4 w-4" />
                    <span>{team.email}</span>
                  </p>
                </div>

                {team.phone_number && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Phone</p>
                    <p className="text-gray-900 flex items-center space-x-2">
                      <Phone className="h-4 w-4" />
                      <span>{team.phone_number}</span>
                    </p>
                  </div>
                )}

                {team.team_website && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Website</p>
                    <p className="text-gray-900 flex items-center space-x-2">
                      <Globe className="h-4 w-4" />
                      <a
                        href={
                          team.team_website.startsWith("http")
                            ? team.team_website
                            : `https://${team.team_website}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 underline"
                      >
                        {team.team_website}
                      </a>
                    </p>
                  </div>
                )}

                <div>
                  <p className="text-sm font-medium text-gray-500">Location</p>
                  <p className="text-gray-900 flex items-center space-x-2">
                    <MapPin className="h-4 w-4" />
                    <span>ZIP: {team.zip_code}</span>
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500">Joined</p>
                  <p className="text-gray-900 flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {new Date(team.created_at).toLocaleDateString()}
                    </span>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Metrics and Info Card */}
          <div className="lg:col-span-2">
            <Card className="border border-gray-200 mb-6">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-semibold text-gray-900 tracking-tight mb-1">
                  Team Metrics
                </CardTitle>
                <CardDescription className="text-sm text-gray-600 font-light">
                  How many students have viewed your contact information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Eye className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">
                        {team.contact_views}
                      </p>
                      <p className="text-sm text-gray-600">Contact Views</p>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-4">
                  This is the number of times students have clicked the contact
                  button on your team profile.
                </p>
              </CardContent>
            </Card>

            {/* Team Details Card */}
            <Card className="border border-gray-200">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-semibold text-gray-900 tracking-tight mb-1">
                  Team Details
                </CardTitle>
                <CardDescription className="text-sm text-gray-600 font-light">
                  Additional information about your team
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {team.qualities && team.qualities.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-2">
                      Desired Qualities
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {team.qualities.map((quality) => (
                        <Badge key={quality} variant="outline">
                          {quality
                            .split("-")
                            .map(
                              (word) =>
                                word.charAt(0).toUpperCase() + word.slice(1)
                            )
                            .join(" ")}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {team.team_awards && (
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-2">
                      Team Achievements
                    </p>
                    <p className="text-gray-700 whitespace-pre-line">
                      {team.team_awards}
                    </p>
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
