"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
import { getSession, getUserType, signOut } from "@/lib/auth";
import {
  collection,
  getDocs,
  query,
  orderBy,
  where,
  updateDoc,
  doc,
  Timestamp,
  getDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { testStorageBucket } from "@/lib/utils";

import {
  UserPlus,
  Users,
  Search,
  Filter,
  MapPin,
  Clock,
  Star,
  CheckCircle,
  X,
  ArrowRight,
  Eye,
  Mail,
  Phone,
  Calendar,
  Target,
  Award,
  FileText,
  Building2,
  Lock,
} from "lucide-react";

// Database query functions
const fetchStudents = async () => {
  try {
    const studentsQuery = query(
      collection(db, "students"),
      orderBy("created_at", "desc")
    );
    const snapshot = await getDocs(studentsQuery);
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      created_at:
        doc.data().created_at?.toDate?.()?.toISOString() ||
        doc.data().created_at,
    })) as any[];

    console.log("Fetched students data:", data);
    // Log resume_url data for each student
    data?.forEach((student: any, index) => {
      console.log(
        `Student ${index + 1} (${student.name}): resume_url =`,
        student.resume_url
      );
    });

    return data || [];
  } catch (error) {
    console.error("Error fetching students:", error);
    return [];
  }
};

const fetchTeams = async () => {
  try {
    const teamsQuery = query(
      collection(db, "teams"),
      orderBy("created_at", "desc")
    );
    const snapshot = await getDocs(teamsQuery);
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      created_at:
        doc.data().created_at?.toDate?.()?.toISOString() ||
        doc.data().created_at,
    })) as any[];

    return data || [];
  } catch (error) {
    console.error("Error fetching teams:", error);
    return [];
  }
};

const fetchMatches = async () => {
  try {
    // Get all students and filter for matched ones
    // Note: Firestore doesn't support != null queries efficiently, so we fetch all and filter
    const studentsQuery = query(
      collection(db, "students"),
      orderBy("created_at", "desc")
    );
    const studentsSnapshot = await getDocs(studentsQuery);

    // Filter for matched students and fetch team data
    const matchedStudents = studentsSnapshot.docs.filter(
      (doc) => doc.data().matched_team_id != null
    );

    const matches = await Promise.all(
      matchedStudents.map(async (studentDoc) => {
        const studentData = { id: studentDoc.id, ...studentDoc.data() } as any;
        if (studentData.matched_team_id) {
          const teamRef = doc(db, "teams", studentData.matched_team_id);
          const teamSnap = await getDoc(teamRef);

          if (teamSnap.exists()) {
            return {
              ...studentData,
              teams: { id: teamSnap.id, ...teamSnap.data() },
            };
          }
        }
        return null;
      })
    );

    return matches.filter((m) => m !== null && m.teams);
  } catch (error) {
    console.error("Error fetching matches:", error);
    return [];
  }
};

const createMatch = async (studentId: string, teamId: string) => {
  try {
    const studentRef = doc(db, "students", studentId);
    await updateDoc(studentRef, {
      matched_team_id: teamId,
      is_matched: true,
      updated_at: Timestamp.now(),
    });

    return { success: true };
  } catch (error: any) {
    console.error("Error creating match:", error);
    return { success: false, error: error.message };
  }
};

// Mock data for demonstration (will be replaced with real data)
const mockStudents = [
  {
    id: 2,
    name: "Sarah Chen",
    email: "sarah@email.com",
    phone: "(555) 234-5678",
    zipCode: "75001",
    school: "Dallas High School",
    firstLevel: "FIRST Robotics Competition",
    areasOfInterest: ["Software", "Outreach"],
    grade: 11,
    timeCommitment: 15,
    resumeUrl: "https://example.com/resume2.pdf",
    resume_url: "student-resumes/1703123456790_sarah_resume.pdf",
    impressiveThings:
      "Developed mobile app for local charity, organized STEM workshops, robotics team captain",
    whyJoinTeam:
      "Looking to expand my technical skills and make a positive impact in the community",
    isMatched: false,
    createdAt: "2024-01-14",
  },
  {
    id: 3,
    name: "Marcus Rodriguez",
    email: "marcus@email.com",
    phone: "(555) 345-6789",
    zipCode: "97201",
    school: "Portland High School",
    firstLevel: "FIRST Tech Challenge",
    areasOfInterest: ["Hardware"],
    grade: 9,
    timeCommitment: 8,
    resumeUrl: "https://example.com/resume3.pdf",
    resume_url: "student-resumes/1703123456791_marcus_resume.pdf",
    impressiveThings:
      "Built automated plant watering system, won district science fair, loves tinkering with electronics",
    whyJoinTeam: "Excited to learn robotics and work with like-minded students",
    isMatched: true,
    matchedTeamId: 1,
    createdAt: "2024-01-13",
  },
  {
    id: 4,
    name: "Priya Patel",
    email: "priya.patel@email.com",
    phone: "(555) 456-7890",
    zipCode: "98101",
    school: "Seattle High School",
    firstLevel: "FIRST Tech Challenge",
    areasOfInterest: ["Software", "Hardware"],
    grade: 10,
    timeCommitment: 14,
    resumeUrl: "https://example.com/resume4.pdf",
    resume_url: "student-resumes/1703123456792_priya_resume.pdf",
    impressiveThings:
      "Created AI-powered study app, won state robotics championship, founded coding club for girls",
    whyJoinTeam:
      "Passionate about using technology to solve real-world problems and inspire other young women in STEM",
    isMatched: false,
    createdAt: "2024-01-12",
  },
  {
    id: 5,
    name: "Jordan Williams",
    email: "jordan.williams@email.com",
    phone: "(555) 567-8901",
    zipCode: "80201",
    school: "Denver High School",
    firstLevel: "FIRST Robotics Competition",
    areasOfInterest: ["Hardware", "Outreach"],
    grade: 12,
    timeCommitment: 18,
    resumeUrl: "https://example.com/resume5.pdf",
    resume_url: "student-resumes/1703123456793_jordan_resume.pdf",
    impressiveThings:
      "Designed solar-powered robot, mentored younger students, organized community tech workshops",
    whyJoinTeam:
      "Want to push the boundaries of robotics innovation while mentoring the next generation of engineers",
    isMatched: false,
    createdAt: "2024-01-11",
  },
  {
    id: 6,
    name: "Maya Thompson",
    email: "maya.thompson@email.com",
    phone: "(555) 678-9012",
    zipCode: "97202",
    school: "Portland Middle School",
    firstLevel: "FIRST Lego League",
    areasOfInterest: ["Software"],
    grade: 7,
    timeCommitment: 10,
    resumeUrl: "https://example.com/resume6.pdf",
    resume_url: "student-resumes/1703123456794_maya_resume.pdf",
    impressiveThings:
      "Developed educational game for kids, won regional programming contest, loves teaching others to code",
    whyJoinTeam:
      "Excited to learn robotics fundamentals and contribute my programming skills to a collaborative team",
    isMatched: false,
    createdAt: "2024-01-10",
  },
  {
    id: 7,
    name: "David Kim",
    email: "david.kim@email.com",
    phone: "(555) 789-0123",
    zipCode: "90001",
    school: "Los Angeles High School",
    firstLevel: "FIRST Tech Challenge",
    areasOfInterest: ["Hardware", "Software", "Outreach"],
    grade: 11,
    timeCommitment: 16,
    resumeUrl: "https://example.com/resume7.pdf",
    resume_url: "student-resumes/1703123456795_david_resume.pdf",
    impressiveThings:
      "Built autonomous drone, won national engineering competition, led school's robotics team to state finals",
    whyJoinTeam:
      "Seeking a team that values both technical excellence and community impact, ready to take on complex challenges",
    isMatched: false,
    createdAt: "2024-01-09",
  },
];

const mockTeams = [
  {
    id: 1,
    teamName: "RevAmped",
    email: "revampedrobotics@gmail.com",
    phone: "(123) 456-7890",
    zipCode: "97201",
    firstLevel: "FIRST Tech Challenge",
    areasOfNeed: ["Software", "Outreach"],
    gradeRangeMin: 6,
    gradeRangeMax: 8,
    timeCommitment: 15,
    qualities: ["Teamwork", "Technical Skills", "Leadership"],
    teamAwards:
      "• 1st Place State Championship 2023\n• 2nd Place Regional Tournament 2022\n• Team founded in 2018\n• 3 students received scholarships\n• Community outreach program leader\n• Innovation Award at World Championship 2021",
    isSchoolTeam: false,
    isActive: true,
    createdAt: "2024-01-10",
  },
  {
    id: 2,
    teamName: "Overcharged",
    email: "overcharged@gmail.com",
    phone: "(123) 456-7890",
    zipCode: "97202",
    firstLevel: "FIRST Tech Challenge",
    areasOfNeed: ["Hardware", "Outreach"],
    gradeRangeMin: 6,
    gradeRangeMax: 8,
    timeCommitment: 15,
    qualities: ["Problem Solving", "Communication Skills"],
    teamAwards:
      "• 3rd Place State Championship 2023\n• Regional Finalist 2022\n• Team founded in 2020\n• 2 students received engineering scholarships\n• STEM education outreach program\n• Gracious Professionalism Award 2021",
    isSchoolTeam: false,
    isActive: true,
    createdAt: "2024-01-12",
  },
  {
    id: 3,
    teamName: "Super Sigma",
    email: "supersigmarobotics@gmail.com",
    phone: "(123) 456-7890",
    zipCode: "97203",
    firstLevel: "FIRST Tech Challenge",
    areasOfNeed: ["Hardware", "Software"],
    gradeRangeMin: 6,
    gradeRangeMax: 10,
    timeCommitment: 10,
    qualities: ["Creativity", "Problem Solving", "Technical Skills"],
    teamAwards:
      "• 2nd Place State Championship 2023\n• Regional Winner 2022\n• Team founded in 2019\n• 4 students received college scholarships\n• Technical Innovation Award 2023\n• Community Service Award 2022\n• Mentored 3 rookie teams",
    isSchoolTeam: true,
    isActive: true,
    createdAt: "2024-01-11",
  },
];

const mockMatches = [
  {
    id: 1,
    student: mockStudents[2],
    team: mockTeams[2],
    matchedAt: new Date().toISOString().split("T")[0],
    status: "Matched", // "Matched" or "Contacted"
  },
];

export default function AdminPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"students" | "teams" | "matches">(
    "students"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedFirstLevel, setSelectedFirstLevel] = useState("");
  const [showMatchedOnly, setShowMatchedOnly] = useState(false);
  const [showUnmatchedOnly, setShowUnmatchedOnly] = useState(false);
  const [showActiveOnly, setShowActiveOnly] = useState(false);
  const [showInactiveOnly, setShowInactiveOnly] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<number | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<number | null>(null);
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [sortBy, setSortBy] = useState<string>("newest");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState("");

  // Real data state
  const [students, setStudents] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [matches, setMatches] = useState<any[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isCreatingMatch, setIsCreatingMatch] = useState(false);

  // Check for admin authentication on component mount
  useEffect(() => {
    async function checkAdminAuth() {
      const { session, error: sessionError } = await getSession();

      if (sessionError || !session) {
        setIsAuthenticated(false);
        return;
      }

      // Check if user is admin
      const { type, error: typeError } = await getUserType(session.user.uid);

      if (typeError || type !== "admin") {
        setIsAuthenticated(false);
        setError("Access denied. Admin privileges required.");
        return;
      }

      setIsAuthenticated(true);
    }

    checkAdminAuth();
  }, []);

  // Load real data when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  const loadData = async () => {
    setIsLoadingData(true);
    try {
      const [studentsData, teamsData, matchesData] = await Promise.all([
        fetchStudents(),
        fetchTeams(),
        fetchMatches(),
      ]);

      setStudents(studentsData);
      setTeams(teamsData);
      setMatches(matchesData);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    setIsAuthenticated(false);
    router.push("/");
  };

  // Show login screen if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-md mx-auto mt-20 space-y-8 p-8">
          <div className="bg-white rounded-lg shadow-lg border border-gray-100 p-8 text-center">
            <div className="mx-auto h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Lock className="h-6 w-6 text-blue-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Admin Access Required
            </h2>
            <p className="text-gray-600 mb-6">
              Please log in with your admin account to access the dashboard
            </p>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3 text-red-600 text-sm text-center mb-6">
                {error}
              </div>
            )}

            <Button
              onClick={() => router.push("/login")}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              size="lg"
            >
              Go to Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const states = [
    "All States",
    "Alabama",
    "Alaska",
    "Arizona",
    "Arkansas",
    "California",
    "Colorado",
    "Connecticut",
    "Delaware",
    "Florida",
    "Georgia",
    "Hawaii",
    "Idaho",
    "Illinois",
    "Indiana",
    "Iowa",
    "Kansas",
    "Kentucky",
    "Louisiana",
    "Maine",
    "Maryland",
    "Massachusetts",
    "Michigan",
    "Minnesota",
    "Mississippi",
    "Missouri",
    "Montana",
    "Nebraska",
    "Nevada",
    "New Hampshire",
    "New Jersey",
    "New Mexico",
    "New York",
    "North Carolina",
    "North Dakota",
    "Ohio",
    "Oklahoma",
    "Oregon",
    "Pennsylvania",
    "Rhode Island",
    "South Carolina",
    "South Dakota",
    "Tennessee",
    "Texas",
    "Utah",
    "Vermont",
    "Virginia",
    "Washington",
    "West Virginia",
    "Wisconsin",
    "Wyoming",
  ];

  const firstLevels = [
    "All Levels",
    "Jr. FIRST Lego League",
    "FIRST Lego League",
    "FIRST Tech Challenge",
    "FIRST Robotics Competition",
  ];

  const filteredStudents = students
    .filter((student) => {
      const matchesSearch =
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesState =
        !selectedState ||
        selectedState === "All States" ||
        student.zip_code === selectedState;
      const matchesLevel =
        !selectedFirstLevel ||
        selectedFirstLevel === "All Levels" ||
        student.first_level === selectedFirstLevel;
      const matchesStatus =
        (!showMatchedOnly || student.is_matched) &&
        (!showUnmatchedOnly || !student.is_matched);

      return matchesSearch && matchesState && matchesLevel && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === "newest") {
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      } else if (sortBy === "oldest") {
        return (
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
      } else if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      } else if (sortBy === "state") {
        return a.zip_code.localeCompare(b.zip_code);
      }
      return 0;
    });

  const filteredTeams = teams
    .filter((team) => {
      const matchesSearch =
        team.team_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        team.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesState =
        !selectedState ||
        selectedState === "All States" ||
        team.zip_code === selectedState;
      const matchesLevel =
        !selectedFirstLevel ||
        selectedFirstLevel === "All Levels" ||
        team.first_level === selectedFirstLevel;
      const matchesStatus =
        (!showActiveOnly || team.is_active) &&
        (!showInactiveOnly || !team.is_active);

      return matchesSearch && matchesState && matchesLevel && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === "newest") {
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      } else if (sortBy === "oldest") {
        return (
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
      } else if (sortBy === "name") {
        return a.team_name.localeCompare(b.team_name);
      } else if (sortBy === "state") {
        return a.zip_code.localeCompare(b.zip_code);
      }
      return 0;
    });

  const handleMatch = () => {
    if (selectedStudent && selectedTeam) {
      setShowMatchModal(true);
    }
  };

  const confirmMatch = async () => {
    if (!selectedStudent || !selectedTeam) {
      alert("Please select both a student and a team.");
      return;
    }

    setIsCreatingMatch(true);

    try {
      const result = await createMatch(
        selectedStudent.toString(),
        selectedTeam.toString()
      );

      if (result.success) {
        alert("Match created successfully!");
        // Reload data to show the new match
        await loadData();
        // Clear selections after successful match
        setSelectedStudent(null);
        setSelectedTeam(null);
      } else {
        alert(`Failed to create match: ${result.error}`);
      }
    } catch (error) {
      console.error("Error creating match:", error);
      alert("Failed to create match. Please try again.");
    } finally {
      setIsCreatingMatch(false);
    }

    setShowMatchModal(false);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-8">
        {/* Stats Bar */}
        <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 mb-8">
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>
              {isLoadingData ? "Loading..." : `${students.length} Students`}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <UserPlus className="h-4 w-4" />
            <span>
              {isLoadingData ? "Loading..." : `${teams.length} Teams`}
            </span>
          </div>
          <div className="flex items-center space-x-2 text-green-600">
            <CheckCircle className="h-4 w-4" />
            <span>
              {isLoadingData ? "Loading..." : `${matches.length} Matches`}
            </span>
          </div>
          <Button
            onClick={async () => {
              console.log("Testing storage bucket...");
              const result = await testStorageBucket();
              console.log("Storage test result:", result);
              if (result.success) {
                alert(
                  `Storage bucket test successful! Found ${
                    result.files?.length || 0
                  } files.`
                );
              } else {
                alert(`Storage bucket test failed: ${result.error}`);
              }
            }}
            variant="outline"
            size="sm"
          >
            Test Storage
          </Button>
        </div>
        {/* Tabs */}
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 bg-white p-2 rounded-lg border border-gray-200 mb-8">
          <button
            onClick={() => setActiveTab("students")}
            className={`flex-1 py-3 px-6 rounded-md text-sm font-medium transition-colors ${
              activeTab === "students"
                ? "bg-gray-900 text-white"
                : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            <UserPlus className="h-4 w-4 inline mr-2" />
            Students
          </button>
          <button
            onClick={() => setActiveTab("teams")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === "teams"
                ? "bg-blue-500 text-white shadow-sm"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            }`}
          >
            <Users className="h-4 w-4 inline mr-2" />
            Teams
          </button>
          <button
            onClick={() => setActiveTab("matches")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === "matches"
                ? "bg-blue-500 text-white shadow-sm"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            }`}
          >
            <CheckCircle className="h-4 w-4 inline mr-2" />
            Matches
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label
                htmlFor="search"
                className="text-sm font-medium text-gray-700"
              >
                Search
              </Label>
              <div className="relative mt-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Search by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Label
                htmlFor="state"
                className="text-sm font-medium text-gray-700"
              >
                State
              </Label>
              <Select value={selectedState} onValueChange={setSelectedState}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="All States" />
                </SelectTrigger>
                <SelectContent>
                  {states.map((state) => (
                    <SelectItem key={state} value={state}>
                      {state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label
                htmlFor="level"
                className="text-sm font-medium text-gray-700"
              >
                FIRST Level
              </Label>
              <Select
                value={selectedFirstLevel}
                onValueChange={setSelectedFirstLevel}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="All Levels" />
                </SelectTrigger>
                <SelectContent>
                  {firstLevels.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label
                htmlFor="sort"
                className="text-sm font-medium text-gray-700"
              >
                Sort By
              </Label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Sort by..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="name">Name A-Z</SelectItem>
                  <SelectItem value="state">State A-Z</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="sm:col-span-2 lg:col-span-4">
              <Label className="text-sm font-medium text-gray-700 mb-2 block">
                Status Filter
              </Label>
              <div className="flex flex-wrap gap-4">
                {activeTab === "students" ? (
                  <>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="matched"
                        checked={showMatchedOnly}
                        onCheckedChange={(checked) => {
                          setShowMatchedOnly(checked as boolean);
                          if (checked) setShowUnmatchedOnly(false);
                        }}
                        className="single-select-checkbox"
                      />
                      <Label
                        htmlFor="matched"
                        className="text-sm text-gray-700"
                      >
                        Matched
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="unmatched"
                        checked={showUnmatchedOnly}
                        onCheckedChange={(checked) => {
                          setShowUnmatchedOnly(checked as boolean);
                          if (checked) setShowMatchedOnly(false);
                        }}
                        className="single-select-checkbox"
                      />
                      <Label
                        htmlFor="unmatched"
                        className="text-sm text-gray-700"
                      >
                        Not Matched
                      </Label>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="active"
                        checked={showActiveOnly}
                        onCheckedChange={(checked) => {
                          setShowActiveOnly(checked as boolean);
                          if (checked) setShowInactiveOnly(false);
                        }}
                        className="single-select-checkbox"
                      />
                      <Label htmlFor="active" className="text-sm text-gray-700">
                        Active
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="inactive"
                        checked={showInactiveOnly}
                        onCheckedChange={(checked) => {
                          setShowInactiveOnly(checked as boolean);
                          if (checked) setShowActiveOnly(false);
                        }}
                        className="single-select-checkbox"
                      />
                      <Label
                        htmlFor="inactive"
                        className="text-sm text-gray-700"
                      >
                        Inactive
                      </Label>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        {activeTab === "students" && (
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="px-6 py-5 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                <h2 className="text-xl font-semibold text-gray-900 tracking-tight">
                  Student Submissions
                </h2>
                <p className="text-sm text-gray-600 font-light">
                  {filteredStudents.length} students found
                </p>
              </div>
            </div>

            <div className="divide-y divide-gray-200">
              {filteredStudents.map((student) => (
                <div
                  key={student.id}
                  className="p-6 hover:bg-gray-50 transition-colors cursor-pointer border-b border-gray-200 last:border-b-0"
                  onClick={() => router.push(`/admin/student/${student.id}`)}
                >
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between space-y-4 lg:space-y-0">
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                        <h3 className="text-lg font-medium text-gray-900">
                          {student.name}
                        </h3>
                        {student.is_matched ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 w-fit">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Matched
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 w-fit">
                            <Clock className="h-3 w-3 mr-1" />
                            Available
                          </span>
                        )}
                      </div>

                      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4" />
                          <span>{student.zip_code}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4" />
                          <span>{student.time_commitment} hrs/week</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Building2 className="h-4 w-4" />
                          <span className="truncate">{student.school}</span>
                        </div>
                      </div>

                      <div className="mt-3 space-y-2">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Target className="h-4 w-4" />
                          <span className="font-medium">Interests:</span>
                          <span className="truncate">
                            {student.areas_of_interest?.join(", ") || "None"}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Award className="h-4 w-4" />
                          <span className="font-medium">Level:</span>
                          <span>{student.first_level}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <Calendar className="h-4 w-4" />
                          <span>
                            Submitted:{" "}
                            {new Date(student.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div
                      className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 lg:ml-4"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(`mailto:${student.email}`, "_blank");
                        }}
                        className="order-first"
                      >
                        <Mail className="h-4 w-4 mr-1" />
                        Email
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedStudent(student.id);
                        }}
                        className={
                          selectedStudent === student.id
                            ? "bg-blue-50 border-blue-200"
                            : ""
                        }
                      >
                        <UserPlus className="h-4 w-4 mr-1" />
                        Select
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "teams" && (
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="px-6 py-5 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                <h2 className="text-xl font-semibold text-gray-900 tracking-tight">
                  Team Submissions
                </h2>
                <p className="text-sm text-gray-600 font-light">
                  {filteredTeams.length} teams found
                </p>
              </div>
            </div>

            <div className="divide-y divide-gray-200">
              {filteredTeams.map((team) => (
                <div
                  key={team.id}
                  className="p-6 hover:bg-gray-50 transition-colors cursor-pointer border-b border-gray-200 last:border-b-0"
                  onClick={() => router.push(`/admin/team/${team.id}`)}
                >
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between space-y-4 lg:space-y-0">
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                        <h3 className="text-lg font-medium text-gray-900">
                          {team.team_name}
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            <Users className="h-3 w-3 mr-1" />
                            Active
                          </span>
                          {team.isSchoolTeam && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                              <Building2 className="h-3 w-3 mr-1" />
                              School Team
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4" />
                          <span>
                            Submitted:{" "}
                            {new Date(team.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4" />
                          <span>{team.zip_code}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4" />
                          <span>{team.time_commitment} hrs/week</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4" />
                          <span>
                            Grades {team.grade_range_min}-{team.grade_range_max}
                          </span>
                        </div>
                      </div>

                      <div className="mt-3 space-y-2">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Target className="h-4 w-4" />
                          <span className="font-medium">Needs:</span>
                          <span className="truncate">
                            {team.areas_of_need?.join(", ") || "None"}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Award className="h-4 w-4" />
                          <span className="font-medium">Level:</span>
                          <span>{team.first_level}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Star className="h-4 w-4" />
                          <span className="font-medium">Qualities:</span>
                          <span className="truncate">
                            {team.qualities?.join(", ") || "None"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div
                      className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 lg:ml-4"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(`mailto:${team.email}`, "_blank");
                        }}
                        className="order-first"
                      >
                        <Mail className="h-4 w-4 mr-1" />
                        Email
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTeam(team.id);
                        }}
                        className={
                          selectedTeam === team.id
                            ? "bg-blue-50 border-blue-200"
                            : ""
                        }
                      >
                        <Users className="h-4 w-4 mr-1" />
                        Select
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "matches" && (
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="px-6 py-5 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 tracking-tight">
                  Current Matches
                </h2>
                <p className="text-sm text-gray-600 font-light">
                  {matches.length} matches made
                </p>
              </div>
            </div>

            <div className="divide-y divide-gray-200">
              {matches.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium">No matches yet</p>
                  <p className="text-sm">
                    Create matches by selecting students and teams
                  </p>
                </div>
              ) : (
                matches.map((match) => (
                  <div key={match.id} className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 grid grid-cols-2 gap-6">
                        {/* Student Half */}
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <UserPlus className="h-6 w-6 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">
                              {match.name}
                            </h4>
                            <div className="text-sm text-gray-600 space-y-1">
                              <p>{match.email}</p>
                              <p>
                                {match.zip_code} • Grade {match.grade}
                              </p>
                              <p>
                                {match.first_level} • {match.time_commitment}{" "}
                                hrs/week
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Team Half */}
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                            <Users className="h-6 w-6 text-green-600" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">
                              {match.teams?.team_name || "Unknown Team"}
                            </h4>
                            <div className="text-sm text-gray-600 space-y-1">
                              <p>{match.teams?.email || "No email"}</p>
                              <p>
                                {match.teams?.zip_code || "Unknown"} • Grades{" "}
                                {match.teams?.grade_range_min || "?"}-
                                {match.teams?.grade_range_max || "?"}
                              </p>
                              <p>
                                {match.teams?.first_level || "Unknown"} •{" "}
                                {match.teams?.time_commitment || "?"} hrs/week
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-end space-y-2 ml-6">
                        <div className="flex items-center space-x-2">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              match.status === "Contacted"
                                ? "bg-green-100 text-green-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {match.status === "Contacted" ? (
                              <>
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Contacted
                              </>
                            ) : (
                              <>
                                <Clock className="h-3 w-3 mr-1" />
                                Matched
                              </>
                            )}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">Matched</p>
                        <Button variant="outline" size="sm">
                          <Mail className="h-4 w-4 mr-1" />
                          Email
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Match Button */}
        {activeTab !== "matches" && (
          <div className="fixed bottom-6 right-6">
            <Button
              onClick={confirmMatch}
              disabled={!selectedStudent || !selectedTeam || isCreatingMatch}
              className="shadow-lg bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              {isCreatingMatch ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Create Match
                </>
              )}
            </Button>
          </div>
        )}

        {/* Match Modal */}
        {showMatchModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl border border-gray-200 p-6 max-w-4xl w-full mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Match Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Student Info */}
                <div className="bg-blue-50/50 rounded-lg p-4 border border-blue-100">
                  <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Student
                  </h4>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="font-medium">Name:</span>{" "}
                      {students.find((s) => s.id === selectedStudent)?.name}
                    </p>
                    <p>
                      <span className="font-medium">Email:</span>{" "}
                      {students.find((s) => s.id === selectedStudent)?.email}
                    </p>
                    <p>
                      <span className="font-medium">Location:</span>{" "}
                      {students.find((s) => s.id === selectedStudent)?.zip_code}
                    </p>
                    <p>
                      <span className="font-medium">Level:</span>{" "}
                      {
                        students.find((s) => s.id === selectedStudent)
                          ?.first_level
                      }
                    </p>
                    <p>
                      <span className="font-medium">Grade:</span>{" "}
                      {students.find((s) => s.id === selectedStudent)?.grade}
                    </p>
                    <p>
                      <span className="font-medium">Time:</span>{" "}
                      {
                        students.find((s) => s.id === selectedStudent)
                          ?.time_commitment
                      }{" "}
                      hrs/week
                    </p>
                    <p>
                      <span className="font-medium">Interests:</span>{" "}
                      {students
                        .find((s) => s.id === selectedStudent)
                        ?.areas_of_interest?.join(", ") || "None"}
                    </p>
                  </div>
                </div>

                {/* Team Info */}
                <div className="bg-red-50/50 rounded-lg p-4 border border-red-100">
                  <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                    <Users className="h-4 w-4 mr-2" />
                    Team
                  </h4>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="font-medium">Name:</span>{" "}
                      {teams.find((t) => t.id === selectedTeam)?.team_name}
                    </p>
                    <p>
                      <span className="font-medium">Email:</span>{" "}
                      {teams.find((t) => t.id === selectedTeam)?.email}
                    </p>
                    <p>
                      <span className="font-medium">Location:</span>{" "}
                      {teams.find((t) => t.id === selectedTeam)?.zip_code}
                    </p>
                    <p>
                      <span className="font-medium">Level:</span>{" "}
                      {teams.find((t) => t.id === selectedTeam)?.first_level}
                    </p>
                    <p>
                      <span className="font-medium">Grade Range:</span>{" "}
                      {
                        teams.find((t) => t.id === selectedTeam)
                          ?.grade_range_min
                      }
                      -
                      {
                        teams.find((t) => t.id === selectedTeam)
                          ?.grade_range_max
                      }
                    </p>
                    <p>
                      <span className="font-medium">Time:</span>{" "}
                      {
                        teams.find((t) => t.id === selectedTeam)
                          ?.time_commitment
                      }{" "}
                      hrs/week
                    </p>
                    <p>
                      <span className="font-medium">Needs:</span>{" "}
                      {teams
                        .find((t) => t.id === selectedTeam)
                        ?.areas_of_need?.join(", ") || "None"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowMatchModal(false)}
                >
                  Cancel
                </Button>
                <Button onClick={confirmMatch}>Match</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
