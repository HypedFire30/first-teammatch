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
              {appConfig.appName} is designed to connect students with FIRST
              robotics teams. We collect information only from teams that
              register with our platform. Students do not create accounts or
              provide personal information.
            </p>
            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
              Team Registration Information
            </h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              When a team registers with {appConfig.appName}, we collect the
              following information:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>
                Contact information: Team email address and optional phone
                number
              </li>
              <li>
                Team identification: Team name, team number, and optional website
              </li>
              <li>
                Geographic information: Zip code for location-based browsing
              </li>
              <li>
                FIRST program information: FIRST level (FLL, FTC, FRC, etc.)
              </li>
              <li>
                Team requirements: Areas of expertise, grade range, time
                commitment expectations
              </li>
              <li>
                Additional details: School name (if applicable), team awards,
                and desired qualities in team members
              </li>
            </ul>
            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
              Student Browsing
            </h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              Students can browse team listings on {appConfig.appName} without
              creating an account or providing any personal information. We do
              not collect, store, or track any data from students who browse
              our platform.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              When a student wishes to view a team's contact information, they
              must complete a human verification (CAPTCHA) test. This helps
              protect teams from automated bots accessing their contact
              information. We do not collect or store any information about
              students who complete this verification.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              2. How We Use Your Information
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We use team information exclusively for the following purposes:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>
                To display team profiles on our public browse page, allowing
                students to discover and learn about teams
              </li>
              <li>
                To enable students to contact teams directly (after completing
                human verification)
              </li>
              <li>
                To provide teams with metrics about how many students have
                viewed their contact information
              </li>
              <li>
                To send service-related communications to teams regarding their
                account (e.g., password reset emails)
              </li>
              <li>To improve and optimize our platform functionality</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              We do not sell, rent, lease, or otherwise disclose team
              information to third parties for marketing or commercial purposes.
              Team contact information (email and phone) is only accessible to
              students who complete the human verification process.
            </p>
            <p className="text-gray-700 leading-relaxed mt-4">
              <strong>Data Storage:</strong> Team information is stored in a
              PostgreSQL database hosted on Railway. Your data is protected by
              industry-standard security measures, including encrypted
              connections and secure password hashing. We use HTTP-only session
              cookies for authentication to protect team accounts.
            </p>
            <p className="text-gray-700 leading-relaxed mt-4">
              <strong>Contact Metrics:</strong> We track when students click the
              "Contact" button on team profiles to provide teams with insights
              about interest in their team. This tracking does not collect any
              student information—only the count of contact button clicks.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              3. Your Rights and Choices
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Teams registered with {appConfig.appName} have the following
              rights:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>
                <strong>Access:</strong> You can view and edit your team profile
                information at any time through your dashboard
              </li>
              <li>
                <strong>Update:</strong> You can update your team information,
                including contact details, at any time
              </li>
              <li>
                <strong>Delete:</strong> You can request deletion of your team
                account and associated data by contacting us
              </li>
              <li>
                <strong>Opt-out:</strong> You can remove your team from public
                listings by deleting your account
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              4. Data Security
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We implement appropriate technical and organizational measures to
              protect team information against unauthorized access, alteration,
              disclosure, or destruction. This includes:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Encrypted database connections (SSL/TLS)</li>
              <li>Secure password hashing (bcrypt)</li>
              <li>HTTP-only session cookies for authentication</li>
              <li>Regular security updates and monitoring</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              5. Children's Privacy
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              {appConfig.appName} does not collect personal information from
              children or minors. Students can browse team listings without
              creating accounts or providing any personal information. Only
              teams (typically represented by adult coaches or mentors) register
              and provide information to our platform.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              If you are a parent or guardian and believe that a team has
              provided information about a child in violation of this policy,
              please contact us immediately.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              6. Changes to This Policy
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We may update this Privacy Policy from time to time. We will notify
              registered teams of any material changes by email or through a
              notice on our platform. The "Last updated" date at the top of this
              page indicates when this policy was last revised.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              7. Contact Us
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              If you have questions about this Privacy Policy, wish to request
              access to or deletion of your team data, or have any concerns
              about how we handle information, please contact us at{" "}
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
