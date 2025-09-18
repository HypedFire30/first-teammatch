import React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { NavigationHeader } from "@/components/navigation-header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FIRST Robotics Registration",
  description: "Register as a student or team for FIRST Robotics programs",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NavigationHeader />
        <main className="min-h-screen gradient-bg">{children}</main>
      </body>
    </html>
  );
}
