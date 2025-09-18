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
  Phone,
  MapPin,
  Calendar,
  Clock,
  Building2,
  Target,
  Award,
  FileText,
  UserPlus,
  CheckCircle,
  Clock as ClockIcon,
  Users,
  Star,
  Mail as MailIcon,
} from "lucide-react";
import { supabase } from "@/lib/auth";
import { getResumeUrl } from "@/lib/auth";

interface Student {
  id: string;
  name: string;
  email: string;
  phone?: string;
  zip_code: string;
  school: string;
  first_level: string;
  areas_of_interest: string[];
  grade: number;
  time_commitment: number;
  resume_url?: string;
  impressive_things: string;
  why_join_team: string;
  is_matched: boolean;
  matched_team_id?: string;
  created_at: string;
  teams?: {
    id: string;
    team_name: string;
    email: string;
    first_level: string;
    time_commitment: number;
    grade_range_min: number;
    grade_range_max: number;
    zip_code: string;
  };
}

export default function StudentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [student, setStudent] = useState<Student | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (params.id) {
      fetchStudent();
    }
  }, [params.id]);

  const fetchStudent = async () => {
    try {
      setIsLoading(true);

      const { data, error } = await supabase
        .from("students")
        .select(
          `
          *,
          teams (
            id,
            team_name,
            email,
            first_level,
            time_commitment,
            grade_range_min,
            grade_range_max,
            zip_code
          )
        `
        )
        .eq("id", params.id)
        .single();

      if (error) {
        console.error("Error fetching student:", error);
        setError("Failed to load student information");
        return;
      }

      setStudent(data);
    } catch (error) {
      console.error("Error fetching student:", error);
      setError("Failed to load student information");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResumeClick = () => {
    if (student?.resume_url) {
      const resumeUrl = getResumeUrl(student.resume_url);
      window.open(resumeUrl, "_blank");
    } else {
      alert("No resume uploaded");
    }
  };

  const handleEmailClick = () => {
    if (student?.email) {
      window.open(`mailto:${student.email}`, "_blank");
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
          <p className="text-gray-600">Loading student information...</p>
        </div>
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <UserPlus className="h-12 w-12 mx-auto" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Student Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            {error || "The requested student could not be found."}
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
                  {student.name}
                </h1>
                <p className="text-sm text-gray-600">Student Profile</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {student.is_matched ? (
                <Badge className="bg-green-100 text-green-800">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Matched
                </Badge>
              ) : (
                <Badge className="bg-yellow-100 text-yellow-800">
                  <ClockIcon className="h-3 w-3 mr-1" />
                  Available
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
                  <UserPlus className="h-5 w-5 mr-2" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {student.email}
                      </p>
                      <p className="text-xs text-gray-500">Email</p>
                    </div>
                  </div>
                  {student.phone && (
                    <div className="flex items-center space-x-3">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {student.phone}
                        </p>
                        <p className="text-xs text-gray-500">Phone</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {student.zip_code}
                      </p>
                      <p className="text-xs text-gray-500">Location</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Building2 className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {student.school}
                      </p>
                      <p className="text-xs text-gray-500">School</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Grade {student.grade}
                      </p>
                      <p className="text-xs text-gray-500">Grade Level</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {student.time_commitment} hrs/week
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
                      {student.first_level}
                    </p>
                    <p className="text-xs text-gray-500">FIRST Level</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Target className="h-4 w-4 text-gray-500 mt-1" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Areas of Interest
                    </p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {student.areas_of_interest?.map((interest, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="text-xs"
                        >
                          {interest}
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

            {/* Long Answer Responses */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Star className="h-5 w-5 mr-2" />
                  Detailed Responses
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    Impressive Things
                  </h4>
                  <p className="text-gray-700 text-sm leading-relaxed bg-gray-50 p-4 rounded-lg">
                    {student.impressive_things || "No response provided"}
                  </p>
                </div>
                <Separator />
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    Why Join Team
                  </h4>
                  <p className="text-gray-700 text-sm leading-relaxed bg-gray-50 p-4 rounded-lg">
                    {student.why_join_team || "No response provided"}
                  </p>
                </div>
              </CardContent>
            </Card>
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
                {student.resume_url && (
                  <Button
                    onClick={handleResumeClick}
                    className="w-full"
                    variant="outline"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    View Resume
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Match Information */}
            {student.is_matched && student.teams && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    Matched Team
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="font-medium text-gray-900">
                      {student.teams.team_name}
                    </p>
                    <p className="text-sm text-gray-600">
                      {student.teams.email}
                    </p>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>Location: {student.teams.zip_code}</p>
                    <p>Level: {student.teams.first_level}</p>
                    <p>
                      Grades: {student.teams.grade_range_min}-
                      {student.teams.grade_range_max}
                    </p>
                    <p>Time: {student.teams.time_commitment} hrs/week</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Registration Info */}
            <Card>
              <CardHeader>
                <CardTitle>Registration Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-gray-600">
                <p>
                  Registered:{" "}
                  {new Date(student.created_at).toLocaleDateString()}
                </p>
                <p>Status: {student.is_matched ? "Matched" : "Available"}</p>
                {student.matched_team_id && (
                  <p>Team ID: {student.matched_team_id}</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
