import React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { NavigationHeader } from "@/components/navigation-header";
import { appConfig } from "@/lib/config";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: appConfig.appName,
  description: appConfig.appDescription,
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
        <main className="min-h-screen bg-white page-enter relative">
          <div className="fixed top-16 left-0 right-0 h-32 pointer-events-none z-40 bg-gradient-to-b from-white via-white/60 to-transparent"></div>
          {children}
        </main>
      </body>
    </html>
  );
}
