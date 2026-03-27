"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Users,
  Target,
  ArrowRight,
  Mail,
  Award,
  MapPin,
  Building2,
  Bot,
  Search,
} from "lucide-react";
import { appConfig } from "@/lib/config";
import Link from "next/link";

interface SearchFilters {
  firstLevel: string;
  zipCode: string;
  areasOfNeed: string[];
  gradeRange: number;
  timeCommitment: number;
  qualities: string[];
}

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 pt-16 pb-8 sm:pt-20 sm:pb-10">
          <div className="text-center max-w-4xl mx-auto">
            {/* Logo/Brand */}
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 via-green-500 to-red-600 rounded-lg mb-6">
                <Bot className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-4 tracking-tight">
                <span className="animate-drift-gradient">FIRST TeamMatch</span>
              </h1>
              <p className="text-xl sm:text-2xl text-gray-600 max-w-2xl mx-auto leading-relaxed font-light">
                {appConfig.appDescription}
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-row gap-3 sm:gap-4 justify-center items-center">
              <Button
                onClick={() => router.push("/browse")}
                size="lg"
                className="flex-1 sm:flex-none sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-8 py-6 text-sm sm:text-base font-medium rounded-lg transition-colors"
              >
                <Users className="h-5 w-5 mr-2" />
                I'm a Student
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>

              <Button
                onClick={() => router.push("/team-registration")}
                size="lg"
                variant="outline"
                className="flex-1 sm:flex-none sm:w-auto border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white px-3 sm:px-8 py-6 text-sm sm:text-base font-medium rounded-lg transition-colors"
              >
                <Target className="h-5 w-5 mr-2" />
                I'm a Team
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-8 sm:py-10">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Three simple steps to connect students and FIRST robotics teams
              together.
            </p>
          </div>

          <div className="space-y-8">
            {/* Step 1 - Green */}
            <div className="flex flex-col md:flex-row items-start gap-8">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                  <Target className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                  Teams Register
                </h3>
                <p className="text-base text-gray-600 leading-relaxed">
                  Teams create detailed profiles highlighting their needs,
                  location, and requirements. Students can then browse and find
                  teams that match their interests.
                </p>
              </div>
            </div>

            {/* Step 2 - Red */}
            <div className="flex flex-col md:flex-row items-start gap-8">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center">
                  <Search className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                  Students Browse
                </h3>
                <p className="text-base text-gray-600 leading-relaxed">
                  Students can search and filter teams by location, FIRST level,
                  areas of need, grade range, and more. No account required to
                  browse.
                </p>
              </div>
            </div>

            {/* Step 3 - Blue */}
            <div className="flex flex-col md:flex-row items-start gap-8">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Mail className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                  Get Contact Information
                </h3>
                <p className="text-base text-gray-600 leading-relaxed">
                  After verifying you're human, students can access team contact
                  information (email and phone) to reach out directly and start
                  their robotics journey.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-8 sm:py-10 pb-20 sm:pb-24">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Why Choose FIRST TeamMatch?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              A public directory connecting students with FIRST robotics teams.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-10 h-10 bg-blue-100 group-hover:bg-blue-600 rounded-lg flex items-center justify-center mb-6 transition-colors duration-300">
                <Search className="h-5 w-5 text-blue-600 group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Easy Discovery
              </h3>
              <p className="text-base text-gray-600 leading-relaxed">
                Browse and filter teams by location, expertise, and requirements
                to find the perfect fit for your interests.
              </p>
            </div>

            <div className="p-8 border border-gray-200 rounded-xl hover:border-green-300 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-10 h-10 bg-green-100 group-hover:bg-green-600 rounded-lg flex items-center justify-center mb-6 transition-colors duration-300">
                <Building2 className="h-5 w-5 text-green-600 group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Community Built
              </h3>
              <p className="text-base text-gray-600 leading-relaxed">
                Created by FTC12808 RevAmped, a team that understands what makes
                FIRST special.
              </p>
            </div>

            <div className="p-8 border border-gray-200 rounded-xl hover:border-red-300 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-10 h-10 bg-red-100 group-hover:bg-red-600 rounded-lg flex items-center justify-center mb-6 transition-colors duration-300">
                <Award className="h-5 w-5 text-red-600 group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Growing Community
              </h3>
              <p className="text-base text-gray-600 leading-relaxed">
                Teams across the country are joining to connect with passionate
                students and grow the FIRST community.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-800 border-t border-slate-700">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Mission */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">
                Our Mission
              </h3>
              <p className="text-base text-gray-300 leading-relaxed">
                To strengthen the FIRST robotics community by providing a public
                directory where students can discover teams and teams can
                connect with passionate students, fostering innovation and
                building lasting partnerships.
              </p>
            </div>

            {/* About RevAmped */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">
                About RevAmped
              </h3>
              <p className="text-base text-gray-300 leading-relaxed mb-4">
                {appConfig.organizationName} is a competitive FIRST Tech
                Challenge team based in {appConfig.organizationLocation}. We're
                passionate about robotics, innovation, and building a stronger
                FIRST community.
              </p>
              <div className="flex items-center text-base text-gray-300">
                <MapPin className="h-4 w-4 mr-2" />
                <span>{appConfig.organizationLocation}</span>
              </div>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">
                Contact Us
              </h3>
              <p className="text-base text-gray-300 mb-6">
                Have questions or want to learn more? We'd love to hear from
                you.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  asChild
                  variant="outline"
                  className="bg-white border-white text-slate-800 hover:bg-slate-100 transition-colors"
                >
                  <a href={`mailto:${appConfig.organizationEmail}`}>
                    <Mail className="h-4 w-4 mr-2" />
                    Email
                  </a>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  className="bg-white border-white text-slate-800 hover:bg-slate-100 transition-colors"
                >
                  <a
                    href={appConfig.organizationWebsite}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Building2 className="h-4 w-4 mr-2" />
                    Website
                  </a>
                </Button>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-700 pt-6 pb-4 text-center">
            <p className="text-sm text-gray-400 mb-2">
              © {new Date().getFullYear()} {appConfig.appName}. Built by {appConfig.organizationName}.
            </p>
            <p className="text-sm text-gray-400 mt-2">
              <Link
                href="/privacy"
                className="text-gray-400 hover:text-white underline transition-colors"
              >
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
