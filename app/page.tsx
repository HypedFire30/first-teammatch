"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Users,
  Target,
  ArrowRight,
  Mail,
  Award,
  MapPin,
  CheckCircle,
  Star,
  Building2,
  Bot,
} from "lucide-react";

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Global Background gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-100 via-white to-red-100"></div>

      {/* Hero Section */}
      <section className="relative">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 pb-20 sm:pb-32">
          <div className="text-center">
            {/* Logo/Brand */}
            <div className="mb-8 sm:mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-600 to-red-600 rounded-2xl shadow-lg mb-4 sm:mb-6">
                <Bot className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 to-red-600 bg-clip-text text-transparent mb-4 sm:mb-6 px-4">
                FIRST TeamMatch
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-4">
                We connect passionate students with competitive FIRST robotics
                teams. Built by 12808 RevAmped to strengthen the FIRST community
                around the US.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-1.5 sm:mb-2 px-4">
              <Button
                onClick={() => router.push("/student-registration")}
                size="lg"
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <Users className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                I'm a Student
                <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 ml-2" />
              </Button>

              <Button
                onClick={() => router.push("/team-registration")}
                size="lg"
                variant="outline"
                className="w-full sm:w-auto border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <Target className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                I'm a Team
                <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="pt-4 sm:pt-6 pb-12 sm:pb-16 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 px-4">
              How It Works
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              Three simple steps to connect students and FIRST robotics teams
              together.
            </p>
          </div>

          <div className="space-y-8 sm:space-y-12">
            {/* Step 1 */}
            <div className="flex flex-col lg:flex-row items-center gap-6 sm:gap-8 group hover:scale-105 transition-all duration-300 cursor-pointer">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-2xl flex items-center justify-center group-hover:bg-green-200 group-hover:shadow-lg transition-all duration-300">
                  <span className="text-2xl sm:text-3xl font-bold text-green-600 group-hover:scale-110 transition-transform duration-300">
                    1
                  </span>
                </div>
              </div>
              <div className="flex-1 text-center lg:text-left">
                <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2 sm:mb-3 group-hover:text-green-600 transition-colors duration-300">
                  Tell Us About You
                </h3>
                <p className="text-base sm:text-lg text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                  Students and teams create detailed profiles highlighting their
                  skills, interests, and requirements. Tell us what makes you
                  unique!
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col lg:flex-row items-center gap-6 sm:gap-8 group hover:scale-105 transition-all duration-300 cursor-pointer">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-100 rounded-2xl flex items-center justify-center group-hover:bg-blue-200 group-hover:shadow-lg transition-all duration-300">
                  <span className="text-2xl sm:text-3xl font-bold text-blue-600 group-hover:scale-110 transition-transform duration-300">
                    2
                  </span>
                </div>
              </div>
              <div className="flex-1 text-center lg:text-left">
                <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2 sm:mb-3 group-hover:text-blue-600 transition-colors duration-300">
                  Get Matched
                </h3>
                <p className="text-base sm:text-lg text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                  Our smart algorithm analyzes compatibility based on skills,
                  location, time commitment, and team needs to find your perfect
                  match.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col lg:flex-row items-center gap-6 sm:gap-8 group hover:scale-105 transition-all duration-300 cursor-pointer">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-red-100 rounded-2xl flex items-center justify-center group-hover:bg-red-200 group-hover:shadow-lg transition-all duration-300">
                  <span className="text-2xl sm:text-3xl font-bold text-red-600 group-hover:scale-110 transition-transform duration-300">
                    3
                  </span>
                </div>
              </div>
              <div className="flex-1 text-center lg:text-left">
                <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2 sm:mb-3 group-hover:text-red-600 transition-colors duration-300">
                  Connect With Your Match
                </h3>
                <p className="text-base sm:text-lg text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                  Connect with your match, start building relationships, and
                  begin your robotics journey together. The perfect team awaits!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 px-4">
              Why Choose FIRST TeamMatch?
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              We're building the future of FIRST robotics by connecting talent
              with opportunity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4 sm:mb-6">
                <Star className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">
                Smart Matching
              </h3>
              <p className="text-sm sm:text-base text-gray-600">
                Our algorithm considers skills, interests, and team needs to
                create the perfect match.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 sm:mb-6">
                <Building2 className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">
                Community Built
              </h3>
              <p className="text-sm sm:text-base text-gray-600">
                Created by RevAmped #12808, a team that understands what makes
                FIRST special.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 md:col-span-2 lg:col-span-1">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 rounded-xl flex items-center justify-center mb-4 sm:mb-6">
                <Award className="h-5 w-5 sm:h-6 sm:w-6 text-red-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">
                Proven Success
              </h3>
              <p className="text-sm sm:text-base text-gray-600">
                Teams and students across the country are already finding their
                perfect match.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900/95 backdrop-blur-sm text-white relative mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Mission */}
            <div>
              <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
                Our Mission
              </h3>
              <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                To strengthen the FIRST robotics community by connecting
                passionate students with competitive teams, fostering
                innovation, and building lasting partnerships that drive the
                future of robotics education.
              </p>
            </div>

            {/* About RevAmped */}
            <div>
              <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
                About RevAmped
              </h3>
              <p className="text-sm sm:text-base text-gray-300 leading-relaxed mb-3 sm:mb-4">
                RevAmped #12808 is a competitive FIRST Tech Challenge team based
                in Portland, Oregon. We're passionate about robotics,
                innovation, and building a stronger FIRST community.
              </p>
              <div className="flex items-center text-sm sm:text-base text-gray-300">
                <MapPin className="h-4 w-4 mr-2" />
                <span>Portland, Oregon</span>
              </div>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
                Contact Us
              </h3>
              <p className="text-sm sm:text-base text-gray-300 mb-3 sm:mb-4">
                Have questions or want to learn more? We'd love to hear from
                you.
              </p>
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                <Button
                  asChild
                  className="bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base"
                >
                  <a href="mailto:revampedrobotics@gmail.com">
                    <Mail className="h-4 w-4 mr-2" />
                    Email
                  </a>
                </Button>

                <Button
                  asChild
                  className="bg-gray-700 hover:bg-gray-600 text-white border-gray-600 text-sm sm:text-base"
                >
                  <a
                    href="https://revampedrobotics.org"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Building2 className="h-4 w-4 mr-2" />
                    Our Website
                  </a>
                </Button>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 sm:mt-12 pt-6 sm:pt-8 text-center">
            <p className="text-sm sm:text-base text-gray-400">
              © 2025 FIRST TeamMatch. Built with ❤️ by RevAmped #12808
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
