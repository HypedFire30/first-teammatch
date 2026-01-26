"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  MapPin,
  Users,
  Clock,
  Mail,
  Phone,
  ArrowLeft,
  Award,
  Building2,
  Globe,
} from "lucide-react";
import { CaptchaVerification } from "@/components/captcha-verification";
import Link from "next/link";

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

export default function TeamDetailPage() {
  const params = useParams();
  const router = useRouter();
  const teamId = params.id as string;
  const [team, setTeam] = useState<Team | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [contactViewed, setContactViewed] = useState(false);

  useEffect(() => {
    async function loadTeam() {
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
  }, [teamId]);

  function handleViewContact() {
    if (!contactViewed) {
      // Track contact view
      fetch(`/api/teams/${teamId}/contact`, {
        method: "POST",
      }).catch(console.error);
      setContactViewed(true);
    }
    setShowCaptcha(true);
  }

  function handleCaptchaVerify() {
    setShowCaptcha(false);
    setShowContact(true);
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
          <Button onClick={() => router.push("/browse")} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Browse
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <Link href="/browse">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Browse
          </Button>
        </Link>

        {/* Team Header Card */}
        <Card className="mb-8 border border-gray-200">
          <CardHeader>
            <div>
              <CardTitle className="text-3xl mb-2">
                {team.team_name}
                {team.team_number && (
                  <span className="text-xl text-gray-600 ml-2">
                    #{team.team_number}
                  </span>
                )}
              </CardTitle>
              <p className="text-base text-gray-600 mt-1">
                {formatFirstLevel(team.first_level)}
              </p>
              {team.school_name && (
                <div className="flex items-center text-gray-600 mt-2">
                  <Building2 className="h-4 w-4 mr-2" />
                  <span>{team.school_name}</span>
                </div>
              )}
              {team.team_website && (
                <div className="flex items-center text-gray-600 mt-2">
                  <Globe className="h-4 w-4 mr-2" />
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
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center text-gray-600">
                <MapPin className="h-5 w-5 mr-2" />
                <span>{team.zip_code}</span>
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
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

          {/* Contact Card */}
          <div className="lg:col-span-1">
            <Card className="border border-gray-200 sticky top-24">
              <CardHeader>
                <CardTitle className="text-xl">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {showContact ? (
                  <>
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
                    {team.team_website && (
                      <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">
                          Website
                        </p>
                        <Button
                          onClick={() => {
                            const url = team.team_website!.startsWith("http")
                              ? team.team_website!
                              : `https://${team.team_website}`;
                            window.open(url, "_blank", "noopener,noreferrer");
                          }}
                          variant="outline"
                          className="w-full border-blue-600 text-blue-600 hover:bg-blue-50"
                        >
                          <Globe className="h-4 w-4 mr-2" />
                          Visit Website
                        </Button>
                      </div>
                    )}
                    <Separator />
                    <p className="text-sm text-gray-600">
                      Reach out to this team to learn more about joining!
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-sm text-gray-600 mb-4">
                      Verify you're human to view contact information
                    </p>
                    <div className="space-y-2">
                      <Button
                        onClick={handleViewContact}
                        className="w-full bg-blue-600 hover:bg-blue-700"
                      >
                        Get Contact Info
                      </Button>
                      {team.team_website && (
                        <Button
                          onClick={() => {
                            const url = team.team_website!.startsWith("http")
                              ? team.team_website!
                              : `https://${team.team_website}`;
                            window.open(url, "_blank", "noopener,noreferrer");
                          }}
                          variant="outline"
                          className="w-full border-blue-600 text-blue-600 hover:bg-blue-50"
                        >
                          <Globe className="h-4 w-4 mr-2" />
                          Visit Website
                        </Button>
                      )}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* CAPTCHA Modal */}
      <CaptchaVerification
        isOpen={showCaptcha}
        onClose={() => setShowCaptcha(false)}
        onVerify={handleCaptchaVerify}
      />
    </div>
  );
}
