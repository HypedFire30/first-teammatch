"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Mail,
  MapPin,
  Calendar,
  Clock,
  Building2,
  Award,
  Users,
  Eye,
  Phone,
} from "lucide-react";
import { getCurrentUser } from "@/lib/auth-client";
import Link from "next/link";

interface Team {
  id: string;
  team_name: string;
  team_number: string | null;
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

export default function AdminTeamDetailPage() {
  const params = useParams();
  const router = useRouter();
  const teamId = params.id as string;
  const [team, setTeam] = useState<Team | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function checkAuth() {
      const { user } = await getCurrentUser();
      if (!user || user.role !== "admin") {
        router.push("/login");
        return;
      }
    }

    async function loadTeam() {
      await checkAuth();

      try {
        const response = await fetch(`/api/teams/${teamId}`);
        if (!response.ok) {
          if (response.status === 404) {
            setError("Team not found");
          } else {
            setError("Failed to load team");
          }
          setIsLoading(false);
          return;
        }

        const data = await response.json();
        setTeam(data.team);
      } catch (err) {
        setError("Failed to load team");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }

    if (teamId) {
      loadTeam();
    }
  }, [teamId, router]);

  function formatFirstLevel(level: string): string {
    return level
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  function formatArea(area: string): string {
    return area.charAt(0).toUpperCase() + area.slice(1);
  }

  function formatQuality(quality: string): string {
    return quality
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading team...</p>
        </div>
      </div>
    );
  }

  if (error || !team) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <p className="text-red-600 mb-4">{error || "Team not found"}</p>
          <Link href="/admin">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Admin
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 py-8">
        {/* Back Button */}
        <Link href="/admin">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Admin
          </Button>
        </Link>

        {/* Team Header Card */}
        <Card className="mb-6 border border-gray-200">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-3xl mb-2">
                  {team.team_name}
                  {team.team_number && (
                    <span className="text-xl text-gray-600 ml-2">
                      #{team.team_number}
                    </span>
                  )}
                </CardTitle>
                {team.school_name && (
                  <div className="flex items-center text-gray-600 mt-2">
                    <Building2 className="h-4 w-4 mr-2" />
                    <span>{team.school_name}</span>
                  </div>
                )}
              </div>
              <Badge variant="outline" className="text-sm">
                {formatFirstLevel(team.first_level)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center text-gray-600">
                <MapPin className="h-5 w-5 mr-2" />
                <span>ZIP: {team.zip_code}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Users className="h-5 w-5 mr-2" />
                <span>
                  Grades {team.grade_range_min}-{team.grade_range_max}
                </span>
              </div>
              <div className="flex items-center text-gray-600">
                <Clock className="h-5 w-5 mr-2" />
                <span>{team.time_commitment} hrs/week</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Information */}
            <Card className="border border-gray-200">
              <CardHeader>
                <CardTitle className="text-xl">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">
                    Email
                  </p>
                  <a
                    href={`mailto:${team.email}`}
                    className="text-blue-600 hover:text-blue-700 break-all"
                  >
                    {team.email}
                  </a>
                </div>
                {team.phone_number && (
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">
                      Phone
                    </p>
                    <a
                      href={`tel:${team.phone_number}`}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      {team.phone_number}
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Areas of Need */}
            <Card className="border border-gray-200">
              <CardHeader>
                <CardTitle className="text-xl">Areas of Expertise</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {team.areas_of_need.map((area) => (
                    <Badge key={area} variant="outline">
                      {formatArea(area)}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Desired Qualities */}
            {team.qualities.length > 0 && (
              <Card className="border border-gray-200">
                <CardHeader>
                  <CardTitle className="text-xl">Desired Qualities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {team.qualities.map((quality) => (
                      <Badge key={quality} variant="outline">
                        {formatQuality(quality)}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Team Awards */}
            {team.team_awards && (
              <Card className="border border-gray-200">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center">
                    <Award className="h-5 w-5 mr-2" />
                    Team Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 whitespace-pre-line">
                    {team.team_awards}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Metrics Sidebar */}
          <div className="lg:col-span-1">
            <Card className="border border-gray-200 sticky top-24">
              <CardHeader>
                <CardTitle className="text-xl">Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-gray-500">
                      Contact Views
                    </p>
                    <Eye className="h-5 w-5 text-blue-600" />
                  </div>
                  <p className="text-3xl font-bold text-gray-900">
                    {team.contact_views}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Total button clicks
                  </p>
                </div>

                <Separator />

                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">
                    Created
                  </p>
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
        </div>
      </div>
    </div>
  );
}
