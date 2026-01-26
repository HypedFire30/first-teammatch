"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser, signOut } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Users,
  Search,
  Eye,
  Mail,
  MapPin,
  Calendar,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

interface Team {
  id: string;
  team_name: string;
  email: string;
  zip_code: string;
  first_level: string;
  contact_views: number;
  created_at: string;
  last_contact_view: string | null;
}

interface Metrics {
  totalTeams: number;
  totalUsers: number;
  totalContactViews: number;
  topTeams: Array<{
    team_name: string;
    contact_views: number;
  }>;
}

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function loadAdmin() {
      const { user: currentUser, error: userError } = await getCurrentUser();

      if (userError || !currentUser) {
        router.push("/login");
        return;
      }

      if (currentUser.role !== "admin") {
        router.push("/dashboard");
        return;
      }

      setUser(currentUser);

      try {
        // Load teams
        const teamsResponse = await fetch("/api/admin/teams");
        if (!teamsResponse.ok) throw new Error("Failed to load teams");
        const teamsData = await teamsResponse.json();
        setTeams(teamsData.teams);

        // Load metrics
        const metricsResponse = await fetch("/api/admin/metrics");
        if (!metricsResponse.ok) throw new Error("Failed to load metrics");
        const metricsData = await metricsResponse.json();
        setMetrics(metricsData.metrics);
      } catch (err: any) {
        console.error("Error loading admin data:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadAdmin();
  }, [router]);

  function formatFirstLevel(level: string): string {
    return level
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  const filteredTeams = teams.filter((team) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      team.team_name.toLowerCase().includes(query) ||
      team.email.toLowerCase().includes(query) ||
      team.zip_code.includes(query)
    );
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Manage teams and view platform metrics
          </p>
        </div>

        {/* Metrics Cards */}
        {metrics && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="border border-gray-200">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Teams</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {metrics.totalTeams}
                    </p>
                  </div>
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-200">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Users</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {metrics.totalUsers}
                    </p>
                  </div>
                  <Users className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-200">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Contact Views</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {metrics.totalContactViews}
                    </p>
                  </div>
                  <Eye className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-200">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Top Team</p>
                    <p className="text-lg font-bold text-gray-900 mt-1 truncate">
                      {metrics.topTeams[0]?.team_name || "N/A"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {metrics.topTeams[0]?.contact_views || 0} views
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Teams List */}
        <Card className="border border-gray-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-semibold text-gray-900">
                  All Teams
                </CardTitle>
                <CardDescription className="text-sm text-gray-600">
                  View and manage registered teams
                </CardDescription>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search teams..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredTeams.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No teams found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredTeams.map((team) => (
                  <div
                    key={team.id}
                    className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-gray-900">
                            {team.team_name}
                          </h3>
                          <Badge variant="outline" className="text-xs">
                            {formatFirstLevel(team.first_level)}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Mail className="h-4 w-4 mr-2" />
                            <span className="truncate">{team.email}</span>
                          </div>
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-2" />
                            <span>ZIP: {team.zip_code}</span>
                          </div>
                          <div className="flex items-center">
                            <Eye className="h-4 w-4 mr-2" />
                            <span>{team.contact_views} views</span>
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2" />
                            <span>
                              {new Date(team.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Link href={`/admin/team/${team.id}`}>
                        <Button variant="outline" size="sm">
                          View Details
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
