"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
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
    { name: "Gifts", href: "/dashboard/gift", icon: "🎁" },
    { name: "Contributions", href: "/dashboard/contribution", icon: "💰" },
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
            className={`flex items-center px-6 py-3 text-sm font-medium ${active
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

function DashboardHeader({
  sidebarOpen,
  setSidebarOpen,
}: {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}) {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="border-b bg-white shadow-sm">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-500 focus:outline-none"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Welcome, {user?.name ?? "User"}
            </h2>
            <span className="text-sm text-gray-500 hidden sm:block">{user?.email}</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggler />
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-500 font-semibold text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {user?.name?.charAt(0).toUpperCase() ?? "U"}
            </button>

            {dropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-10 h-full w-full cursor-default"
                  onClick={() => setDropdownOpen(false)}
                ></div>
                <div className="absolute right-0 z-20 mt-2 w-48 rounded-md border border-gray-100 bg-white py-2 shadow-lg dark:border-gray-700 dark:bg-gray-800">
                  <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {user?.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {user?.email}
                    </p>
                  </div>
                  <Link
                    href="/dashboard/settings"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      window.location.href = "/signin";
                    }}
                    className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Logout
                  </button>
                </div>
              </>
            )}
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
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    // Close sidebar on mobile by default
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  }, []);
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`dark:bg-black ${inter.className}`}>
        <AuthProvider>
          <ThemeProvider enableSystem={false} attribute="class">
            <Lines />

            <div className="flex min-h-screen bg-gray-100">
              <div
                className={`${sidebarOpen ? "w-64" : "w-0"
                  } overflow-hidden bg-white shadow-lg transition-all duration-300`}
              >
                <div className="p-6">
                  <Link href="/">
                    <Image
                      src="/images/logo/logo-dark.svg"
                      alt="logo"
                      width={119.03}
                      height={30}
                      className="hidden w-full dark:block"
                    />
                    <Image
                      src="/images/logo/logo-light.svg"
                      alt="logo"
                      width={119.03}
                      height={30}
                      className="w-full dark:hidden"
                    />
                  </Link>
                </div>
                <DashboardSidebar />
              </div>

              <div className="flex flex-1 flex-col">
                <DashboardHeader
                  sidebarOpen={sidebarOpen}
                  setSidebarOpen={setSidebarOpen}
                />
                <main className="flex-1 p-6">{children}</main>
              </div>
            </div>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
