"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeProvider } from "next-themes";
import { Inter } from "next/font/google";
import "../../globals.css";
import Lines from "@/components/Lines";
import ThemeToggler from "@/components/Header/ThemeToggler";
import { AuthProvider, useAuth } from "@/context/AuthContext";

const inter = Inter({ subsets: ["latin"] });

function DashboardSidebar() {
  const pathname = usePathname();
  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: "📊" },
    { name: "Stats", href: "/dashboard/stats", icon: "📈" },
    { name: "Gifts", href: "/dashboard/gift", icon: "🎁" },
    { name: "Analytics", href: "/dashboard/analytics", icon: "📉" },
    { name: "Settings", href: "/dashboard/settings", icon: "⚙️" },
  ];

  return (
    <nav className="mt-6">
      {navigation.map((item) => {
        const active = item.href === pathname;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center px-6 py-3 text-sm font-medium ${
              active
                ? "border-r-2 border-blue-700 bg-blue-50 text-blue-700"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <span className="mr-3">{item.icon}</span>
            {item.name}
          </Link>
        );
      })}
    </nav>
  );
}

function DashboardHeader() {
  const { user, logout } = useAuth();

  return (
    <header className="border-b bg-white shadow-sm">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            Welcome, {user?.name ?? "User"}
          </h2>
          <span className="text-sm text-gray-500">{user?.email}</span>
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggler />
          <button onClick={logout} className="text-sm text-red-600">
            Logout
          </button>

          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-500 font-semibold text-white">
            {user?.name?.charAt(0).toUpperCase() ?? "U"}
          </div>
        </div>
      </div>
    </header>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`dark:bg-black ${inter.className}`}>
        <AuthProvider>
          <ThemeProvider enableSystem={false} attribute="class">
            <Lines />

            <div className="flex min-h-screen bg-gray-100">
              <div className="w-64 bg-white shadow-lg">
                <div className="p-6">
                  <h1 className="text-2xl font-bold text-gray-800">
                    Dashboard
                  </h1>
                </div>
                <DashboardSidebar />
              </div>

              <div className="flex flex-1 flex-col">
                <DashboardHeader />
                <main className="flex-1 p-6">{children}</main>
              </div>
            </div>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
