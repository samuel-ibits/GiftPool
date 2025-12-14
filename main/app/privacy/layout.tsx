"use client";

import React from "react";
import { ThemeProvider } from "next-themes";
import { Inter } from "next/font/google";
import "../globals.css";
import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export default function QuickStartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className}`}>
        <AuthProvider>
          <ThemeProvider enableSystem={false} attribute="class">
            <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
              {/* Animated Background Elements */}
              <div className="absolute inset-0">
                {/* Floating Circles */}
                <div className="absolute top-10 left-10 h-72 w-72 animate-blob rounded-full bg-purple-300 opacity-70 mix-blend-multiply blur-xl filter"></div>
                <div className="animation-delay-2000 absolute top-0 right-10 h-72 w-72 animate-blob rounded-full bg-yellow-300 opacity-70 mix-blend-multiply blur-xl filter"></div>
                <div className="animation-delay-4000 absolute -bottom-8 left-20 h-72 w-72 animate-blob rounded-full bg-pink-300 opacity-70 mix-blend-multiply blur-xl filter"></div>

                {/* Gradient Orbs */}
                <div className="absolute top-1/4 right-1/4 h-96 w-96 animate-pulse rounded-full bg-gradient-to-r from-blue-400 to-cyan-300 opacity-30 blur-3xl"></div>
                <div className="animation-delay-3000 absolute bottom-1/4 left-1/3 h-80 w-80 animate-pulse rounded-full bg-gradient-to-r from-purple-400 to-pink-300 opacity-30 blur-3xl"></div>

                {/* Moving Shapes */}
                <div className="absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 animate-spin-slow rounded-full border-4 border-white opacity-10"></div>
                <div className="animation-delay-1000 absolute top-1/3 right-1/3 h-48 w-48 animate-bounce-slow rounded-lg bg-white opacity-5"></div>
              </div>

              {/* Content */}
              <div className="relative z-10 flex min-h-screen items-center justify-center p-4">
                {children}
              </div>
            </div>
          </ThemeProvider>
        </AuthProvider>

        <style jsx global>{`
          @keyframes blob {
            0% {
              transform: translate(0px, 0px) scale(1);
            }
            33% {
              transform: translate(30px, -50px) scale(1.1);
            }
            66% {
              transform: translate(-20px, 20px) scale(0.9);
            }
            100% {
              transform: translate(0px, 0px) scale(1);
            }
          }

          @keyframes spin-slow {
            from {
              transform: translate(-50%, -50%) rotate(0deg);
            }
            to {
              transform: translate(-50%, -50%) rotate(360deg);
            }
          }

          @keyframes bounce-slow {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-20px);
            }
          }

          .animate-blob {
            animation: blob 7s infinite;
          }

          .animation-delay-2000 {
            animation-delay: 2s;
          }

          .animation-delay-3000 {
            animation-delay: 3s;
          }

          .animation-delay-4000 {
            animation-delay: 4s;
          }

          .animation-delay-1000 {
            animation-delay: 1s;
          }

          .animate-spin-slow {
            animation: spin-slow 20s linear infinite;
          }

          .animate-bounce-slow {
            animation: bounce-slow 3s ease-in-out infinite;
          }
        `}</style>
      </body>
    </html>
  );
}
