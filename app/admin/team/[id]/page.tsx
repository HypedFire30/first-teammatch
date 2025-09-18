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
  Target,
  Award,
  Users,
  Star,
  Mail as MailIcon,
  CheckCircle,
  Clock as ClockIcon,
} from "lucide-react";
import { supabase } from "@/lib/auth";

interface Team {
  id: string;
  team_name: string;
  email: string;
  zip_code: string;
  first_level: string;
  areas_of_need: string[];
  grade_range_min: number;
  grade_range_max: number;
  time_commitment: number;
  qualities: string[];
  is_school_team: boolean;
  is_active: boolean;
  created_at: string;
  students?: {
    id: string;
    name: string;
    email: string;
    school: string;
    first_level: string;
    grade: number;
    time_commitment: number;
  }[];
}

export default function TeamDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [team, setTeam] = useState<Team | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (params.id) {
      fetchTeam();
    }
  }, [params.id]);

  const fetchTeam = async () => {
    try {
      setIsLoading(true);

      const { data, error } = await supabase
        .from("teams")
        .select(
          `
          *,
          students (
            id,
            name,
            email,
            school,
            first_level,
            grade,
            time_commitment
          )
        `
        )
        .eq("id", params.id)
        .single();

      if (error) {
        console.error("Error fetching team:", error);
        setError("Failed to load team information");
        return;
      }

      setTeam(data);
    } catch (error) {
      console.error("Error fetching team:", error);
      setError("Failed to load team information");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailClick = () => {
    if (team?.email) {
      window.open(`mailto:${team.email}`, "_blank");
    }
  };

  const handleBackClick = () => {
    router.push("/admin");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading team information...</p>
        </div>
      </div>
    );
  }

  if (error || !team) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <Users className="h-12 w-12 mx-auto" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Team Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            {error || "The requested team could not be found."}
          </p>
          <Button onClick={handleBackClick} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Admin
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button onClick={handleBackClick} variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Admin
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {team.team_name}
                </h1>
                <p className="text-sm text-gray-600">Team Profile</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {team.is_active ? (
                <Badge className="bg-green-100 text-green-800">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Active
                </Badge>
              ) : (
                <Badge className="bg-gray-100 text-gray-800">
                  <ClockIcon className="h-3 w-3 mr-1" />
                  Inactive
                </Badge>
              )}
              {team.is_school_team && (
                <Badge className="bg-purple-100 text-purple-800">
                  <Building2 className="h-3 w-3 mr-1" />
                  School Team
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {team.email}
                      </p>
                      <p className="text-xs text-gray-500">Email</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {team.zip_code}
                      </p>
                      <p className="text-xs text-gray-500">Location</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Grades {team.grade_range_min}-{team.grade_range_max}
                      </p>
                      <p className="text-xs text-gray-500">Grade Range</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {team.time_commitment} hrs/week
                      </p>
                      <p className="text-xs text-gray-500">Time Commitment</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* FIRST Program Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="h-5 w-5 mr-2" />
                  FIRST Program Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Award className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {team.first_level}
                    </p>
                    <p className="text-xs text-gray-500">FIRST Level</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Target className="h-4 w-4 text-gray-500 mt-1" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Areas of Need
                    </p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {team.areas_of_need?.map((need, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="text-xs"
                        >
                          {need}
                        </Badge>
                      )) || (
                        <span className="text-gray-500 text-sm">
                          None specified
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Star className="h-4 w-4 text-gray-500 mt-1" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Desired Qualities
                    </p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {team.qualities?.map((quality, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-xs"
                        >
                          {quality}
                        </Badge>
                      )) || (
                        <span className="text-gray-500 text-sm">
                          None specified
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Matched Students */}
            {team.students && team.students.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    Matched Students ({team.students.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {team.students.map((student) => (
                      <div
                        key={student.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <p className="font-medium text-gray-900">
                            {student.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            {student.email}
                          </p>
                          <p className="text-xs text-gray-500">
                            {student.school} • Grade {student.grade} •{" "}
                            {student.time_commitment} hrs/week
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            router.push(`/admin/student/${student.id}`)
                          }
                        >
                          View Profile
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  onClick={handleEmailClick}
                  className="w-full"
                  variant="outline"
                >
                  <MailIcon className="h-4 w-4 mr-2" />
                  Send Email
                </Button>
              </CardContent>
            </Card>

            {/* Team Information */}
            <Card>
              <CardHeader>
                <CardTitle>Team Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-gray-600">
                <p>
                  Registered: {new Date(team.created_at).toLocaleDateString()}
                </p>
                <p>Status: {team.is_active ? "Active" : "Inactive"}</p>
                <p>
                  Type: {team.is_school_team ? "School Team" : "Community Team"}
                </p>
                {team.students && (
                  <p>Students: {team.students.length} matched</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
