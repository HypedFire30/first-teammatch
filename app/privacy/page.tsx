import React from "react";
import Link from "next/link";
import { appConfig } from "@/lib/config";

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-white min-h-screen py-12 px-6 sm:px-8 lg:px-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-700 text-sm font-medium mb-4 inline-block"
          >
            ← Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Privacy Policy
          </h1>
          <p className="text-gray-600 text-sm">
            Last updated: {new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        <div className="prose prose-gray max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              1. Information We Collect
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              By registering with {appConfig.appName}, you provide us with the
              following personal information:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Personal identification information, including name and email address</li>
              <li>Educational information, including grade level and school name</li>
              <li>Geographic information, including zip code for location-based matching</li>
              <li>FIRST program participation information, including experience level and areas of interest</li>
              <li>Qualifications and achievements, including resume documents when provided</li>
              <li>Time commitment preferences and availability</li>
              <li>For team registrations: Team name, contact information, requirements, and preferences</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              2. How We Use Your Information
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We use the information you provide exclusively for the following
              purposes:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>To facilitate matching between students and FIRST robotics teams based on qualifications, location, and preferences</li>
              <li>To share your information with registered users (students or teams) for the purpose of facilitating matches</li>
              <li>To enable communication between matched parties</li>
              <li>To send you service-related communications regarding your account and potential matches</li>
              <li>To improve and optimize our matching algorithm and service functionality</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              We do not sell, rent, lease, or otherwise disclose your personal
              information to third parties for marketing or commercial purposes.
              Your information is shared solely with registered users of our
              platform for the express purpose of facilitating matches between
              students and teams.
            </p>
            <p className="text-gray-700 leading-relaxed mt-4">
              <strong>Data Storage:</strong> Your information is stored in a
              Google Firebase database. Firebase provides secure cloud storage
              and authentication services. Your data is protected by Firebase's
              security measures and is subject to Google's privacy policies
              regarding data storage and processing.
            </p>
            <p className="text-gray-700 leading-relaxed mt-4">
              If you have questions regarding this policy or wish to request
              deletion of your account and associated data, please contact us
              at{" "}
              <a
                href={`mailto:${appConfig.contactEmail}`}
                className="text-blue-600 hover:text-blue-700 underline"
              >
                {appConfig.contactEmail}
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
